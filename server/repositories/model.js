var github = require('../github'),
	q = require('q'),
	request = require('request');

module.exports = {
	commits: commits,
	commit: commit,
	compare: compare
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
				response.files.forEach(function(file) {
					if (file.filename.indexOf(path) > -1) {
						commitCache[cacheKey] = file;
						deferred.resolve(file);
					}
				});

			}
		});
	}

	return deferred.promise;
}

function compare(user, repo, base, head, path) {
	var deferred = q.defer(),
		cacheKey = user + '/' + repo + '/' + path + '/' + base + '/' + head;

	if (commitCache[cacheKey]) {
		deferred.resolve(commitCache[cacheKey]);
	} else {
		github.repos.compareCommits({
			user: user,
			repo: repo,
			base: base,
			head: head
		}, function(error, response) {
			if (error) {
				deferred.reject();
			} else {
				response.files.forEach(function(file) {
					if (file.filename.indexOf(path) > -1) {
						commitCache[cacheKey] = file;
						deferred.resolve(file);
					}
				});
			}
		});
	}

	return deferred.promise;
}