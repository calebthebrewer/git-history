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
	type: 'oath',
	token: 'a11c3aeac53f73dd3451bac177a0144cb7438e26'
})

module.exports = github;