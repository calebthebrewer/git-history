var model = require('./model');

module.exports = function(app) {
	app.get('/repositories/commits', commits);
	app.get('/repositories/commit', commit);
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