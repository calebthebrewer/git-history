angular.module('app')
	.config([
		'$stateProvider',
		function($stateProvider) {

			$stateProvider
				.state('home', {
					url: '/?source',
					templateUrl: 'home/home.tpl.html',
					controller: 'repositories'
				});
		}]);