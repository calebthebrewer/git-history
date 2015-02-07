angular.module('app')
.controller('repositories', [
		'$http',
		'$scope',
		function($http, $scope) {

			var user,
				repo,
				path,
				commits = {};

			$scope.getCommits = getCommits;
			$scope.getCommit = getCommit;
			$scope.commitLoadProgress = 100;

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
					getCommit($scope.commitsLength, true);
				});
			}

			function getCommit(index, repeat) {
				$http.get('repositories/commit', {
					params: {
						user: user,
						repo: repo,
						path: path,
						sha: $scope.commits[index].sha
					},
					cache: true
				}).success(function(response) {
					$scope.commit = response;
					if (repeat) {
						$scope.commitLoadProgress -= (100 / $scope.commitsLength);
						if (index) {
							getCommit(--index, true);
						}
					}
				});
			}
		}
	]);