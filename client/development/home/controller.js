angular.module('app')
.controller('repositories', [
		'$http',
		'$scope',
		function($http, $scope) {

			var user,
				repo,
				path;

			$scope.user = 'calebthebrewer';
			$scope.repo = 'jsenvy';
			$scope.path = 'src/console.js';

			$scope.getCommits = getCommits;
			$scope.getCommit = getCommit;

			function getCommits() {
				$http.get('repositories/commits', {
					params: {
						user: $scope.user,
						repo: $scope.repo,
						path: $scope.path
					},
					cache: true
				}).success(function(response) {
					response.reverse();
					$scope.commitsLength = response.length - 1;
					$scope.currentCommit = $scope.commitsLength;
					$scope.commits = response;
					//also store these in case the scope is modified
					user = $scope.user;
					repo = $scope.repo;
					path = $scope.path;
					//trigger first commit
					getCommit(response[0].sha);
				});
			}

			function getCommit(sha) {
				$http.get('repositories/commit', {
					params: {
						user: user,
						repo: repo,
						path: path,
						sha: sha
					},
					cache: true
				}).success(function(response) {
					$scope.commit = response;
				});
			}
		}
	]);