angular.module('app')
.controller('repositories', [
		'$http',
		'$scope',
		'$q',
		'$sce',
		function($http, $scope, $q, $sce) {

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
						$scope.commit = applyPatch(response);
					}
				});
			}

			function applyPatch(file) {
				//raw is stored in file.raw, patch is in file.patch
				var lines = file.raw.split('\n'),
					map = mapChunks(file.patch.split('@@').slice(1));

				for (var i = 0, l = lines.length - 1; i < l; i++) {
					lines[i] = '<span class="line">' + lines[i] + '</span>';
				}

				map.forEach(function(chunk) {
					lines.splice.apply(lines, [chunk[0] - 1, chunk[1]].concat(chunk[2]));
				});

				file.raw = $sce.trustAsHtml(lines.join('\n'));

				return file;
			}

			function mapChunks(patch, mapped) {
				var map = [] || mapped;

				var indices = patch.shift().match(/\d+/g),
					blob = patch.shift().trim().split('\n');

				for (var i = 0, l = blob.length - 1; i < l; i++) {
					switch (blob[i][0]) {
						case '-':
							blob[i] = '<span class="line-removed bg-danger">' + blob[i].slice(1) + '</span>';
							break;
						case '+':
							blob[i] = '<span class="line bg-success">' + blob[i].slice(1) + '</span>';
							break;
						default:
							blob[i] = '<span class="line">' + blob[i] + '</span>';
							break;
					}
				}

				map.push([indices[2], indices[3], blob]);

				if (patch.length) {
					return mapChunks(patch, map);
				}
				return map;
			}
		}
	]);