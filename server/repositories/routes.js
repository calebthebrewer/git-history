var model = require('./model');

module.exports = function(app) {
	app.get('/repositories/commits', commits);
	app.get('/repositories/commit', commit);
	app.get('/repositories/compare', compare);
};

function commits(req, res) {
	var user = req.query.user,
		repo = req.query.repo,
		path = req.query.path;

	model
		.commits(user, repo, path)
		.then(function(response) {
			res.send(response);
		}, function() {
			res
				.status(500)
				.send();
		});
}

function commit(req, res) {
	var user = req.query.user,
		repo = req.query.repo,
		path = req.query.path,
		sha = req.query.sha;

	model
		.commit(user, repo, path, sha)
		.then(function(response) {
			res.send(response);
		}, function() {
			res
				.status(500)
				.send();
		});
}

function compare(req, res) {
	var user = req.query.user,
		repo = req.query.repo,
		base = req.query.base,
		head = req.query.head;

	model
		.compare(user, repo, base, head)
		.then(function(response) {
			res.send(response);
		}, function() {
			res
				.status(500)
				.send();
		});
}