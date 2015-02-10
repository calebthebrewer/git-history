angular.module('app')
.controller('repositories', [
		'$http',
		'$scope',
		'$q',
		function($http, $scope, $q) {

			var user,
				repo,
				path,
				commits = {};

			$scope.user = 'calebthebrewer';
			$scope.repo = 'jsenvy';
			$scope.path = 'src/console.js';

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
					if (repeat) {
						$scope.commitLoadProgress -= (100 / $scope.commitsLength);
						if (index) {
							getCommit(--index, true);
						}
					} else {
						$scope.commit = response;
					}
				});
			}

			function getCompare(index, repeat) {
				$http.get('repositories/compare', {
					params: {
						user: user,
						repo: repo,
						base: $scope.commits[index - 1].sha,
						head: $scope.commits[index].sha
					},
					cache: true
				}).success(function(response) {
					if (repeat) {
						$scope.commitLoadProgress -= (100 / $scope.commitsLength);
						if (index) {
							getCommit(--index, true);
						}
					} else {
						$scope.commit = response;
					}
				});
			}
		}
	]);