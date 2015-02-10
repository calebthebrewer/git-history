var Github = require('github');

var github = new Github({
	// required
	version: "3.0.0",
	// optional
	debug: true,
	protocol: "https",
	timeout: 5000,
	headers: {
		'user-agent': 'git-history-viewer',
		Accept: 'application/vnd.github.v3+json'
	}
});

github.authenticate({
	type: 'oauth',
	token: '79a786e256717a2d0941bc5bb9caf9b3e777bb51'
});

module.exports = github;