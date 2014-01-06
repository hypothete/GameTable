/*global angular */

'use strict';

angular.module('myApp.directives', [])
	.directive('boardInterface', ['$timeout', function($timeout){

		return {
			restrict: 'A',
			scope: {
				display: '='
			},
			templateUrl: 'partials/board.html',
			link: function(scope, elem){
				var board = document.getElementById('screen'),
					ctx = board.getContext('2d');
				scope.players = [];

				board.width = 600;
				board.height = 400;


				scope.update = function(){
					ctx.clearRect(0,0, board.width, board.height);
					scope.display.forEach(function(playerLogEntry){

						var player = playerLogEntry.data;


						ctx.strokeStyle = 'green';
						ctx.beginPath();
						ctx.arc(player.position.elements[0], player.position.elements[1], 10, 0, 2*Math.PI, false);
						ctx.closePath();
						ctx.stroke();
						ctx.beginPath();
						ctx.moveTo(player.position.elements[0], player.position.elements[1]);
						ctx.lineTo(player.position.elements[0] + player.speed.elements[0]*10, player.position.elements[1] + player.speed.elements[1]*10);
						ctx.closePath();
						ctx.stroke();

					});
				}

				var gameLoop = function(){
					$timeout(function(){
						scope.update();
						gameLoop();
					}, 100);
				};
				gameLoop();



			}
		};
	}])

	.directive('playerSteering', ['player', '$timeout', function(player, $timeout){

		return {
			restrict: 'A',
			scope: {
				output: '=',
			},
			templateUrl: 'partials/player-controls.html',
			link: function(scope, elem){

				scope.touching = false;

				scope.player = player;
				var touchpad = document.getElementById('touchpad'),
					touchctx = touchpad.getContext('2d');


				elem.bind('touchstart', function(evt){
						evt.preventDefault();
						scope.touching = true;
						scope.touchevt = evt;
					})
					.bind('touchmove', function(evt){
						evt.preventDefault();
						scope.touching = true;
						scope.touchevt = evt;
					})
					.bind('touchend', function(evt){
						scope.touching = false;
						scope.touchevt = null;
					});

				scope.move = function(nudge){
					if(nudge !== undefined && nudge.modulus() > 0){
						scope.player.speed = nudge;
						scope.player.move();
						scope.output = scope.player;
					}
				};

				var gameLoop = function(){
					$timeout(function(){
						var touchPosX = touchpad.width/2;
						var touchPosY = touchpad.height/2;

						scope.move(Vector.Zero(2));

						if(scope.touching){
							touchPosX = scope.touchevt.touches[scope.touchevt.touches.length-1].pageX-touchpad.offsetLeft;
							touchPosY = scope.touchevt.touches[scope.touchevt.touches.length-1].pageY-touchpad.offsetTop;
							scope.move(Vector.create([touchPosX - touchpad.width/2, touchPosY - touchpad.height/2]).multiply(1/10));
						}

						touchctx.clearRect(0,0, touchpad.width, touchpad.height);
						touchctx.strokeStyle = 'red';
						touchctx.beginPath();
						touchctx.moveTo(touchpad.width/2, touchpad.height/2);
						touchctx.lineTo(touchPosX, touchPosY);
						touchctx.stroke();
						
						gameLoop();
					}, 100);
				};

				gameLoop();
			}
		};
	}]);