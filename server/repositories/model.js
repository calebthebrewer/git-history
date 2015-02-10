var github = require('../github'),
	q = require('q'),
	request = require('request');

module.exports = {
	commits: commits,
	commit: commit
};

var commitsCache = {},
	commitCache = {};

function commits(user, repo, path) {
	var deferred = q.defer(),
		cacheKey = user + '/' + repo + '/' + path;

	if (commitsCache[cacheKey]) {
		deferred.resolve(commitsCache[cacheKey]);
	} else {
		github.repos.getCommits({
			user: user,
			repo: repo,
			path: path
		}, function(error, response) {
			if (error) {
				deferred.reject();
			} else {
				commitsCache[cacheKey] = response;
				deferred.resolve(response);
			}
		});
	}

	return deferred.promise;
}

function commit(user, repo, path, sha) {
	var deferred = q.defer(),
		cacheKey = user + '/' + repo + '/' + path + '/' + sha;

	if (commitCache[cacheKey]) {
		deferred.resolve(commitCache[cacheKey]);
	} else {
		github.repos.getCommit({
			user: user,
			repo: repo,
			path: path,
			sha: sha
		}, function(error, response) {
			if (error) {
				deferred.reject();
			} else {
				response.files.forEach(function(commitData) {
					if (commitData.filename.indexOf(path) > -1) {
						getRawFile(commitData.raw_url)
							.then(function(rawData) {
								commitData.raw = rawData;
								commitCache[cacheKey] = commitData;
								deferred.resolve(commitData);
							});
					}
				});
			}
		});
	}

	return deferred.promise;
}

function getRawFile(url) {
	var deferred = q.defer();

	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			deferred.resolve(body);
		} else {
			deferred.reject();
		}
	});

	return deferred.promise;
}