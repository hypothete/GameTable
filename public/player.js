/*global angular */

'use strict';

angular.module('myApp.playerFactory', [])
.factory('player', function(){
	var player = {
		position: Vector.create([300,200]),
		speed: Vector.create([0,0]),
		angle: function(){
			var unit = player.speed.dup().toUnitVector();
			return Math.atan2(unit.elements[1], unit.elements[0])* 180 / Math.PI;
		},
		move: function(){
			player.position = player.position.add(player.speed);
			if(player.position.elements[0] < 0){
				player.position.elements[0] += 600;
			}
			if(player.position.elements[1] < 0){
				player.position.elements[1] += 400;
			}
			if(player.position.elements[0] > 600){
				player.position.elements[0] -= 600;
			}
			if(player.position.elements[1] > 400){
				player.position.elements[1] -= 400;
			}
		}
	};

	return player;
});