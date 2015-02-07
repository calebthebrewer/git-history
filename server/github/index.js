var Github = require('github');

module.exports = new Github({
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