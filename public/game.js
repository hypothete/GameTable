/*global angular */

'use strict';

angular.module('myApp', ['myApp.controllers', 'myApp.directives', 'myApp.playerFactory']);

angular.module('myApp.controllers', []).controller('ctrl', ['$scope', function($scope){

	var socket = io.connect();
	$scope.localLog = [];

	$scope.id = Math.round(Math.random() * 1000);

	socket.on('message', function (data) {

			$scope.$apply(function(){
				var found = false;
				$scope.localLog.forEach(function(logEntry){
					if(logEntry.id == data.id){
						logEntry.data = data.data;
						found = true;
					}
				});

				if(!found){
					$scope.localLog.push(data);
				}
			});
		}
	);

	socket.on('removeClient', function (data) {
		$scope.localLog.forEach(function(logEntry, index){
			if(logEntry.id == data){
				$scope.localLog.splice(index, 1);
			}
		});
	});

	$scope.$watch('latest', function(themessage){
		if(themessage !== null){
			console.log('sending player data');
			socket.emit('send', {id: $scope.id, data: themessage});
		}
		
	}, true);

}]);