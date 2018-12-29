'use strict';

module.exports = {
	port: 8001,
	url: 'mongodb://116.62.228.3:27017/rl',
	// url: 'mongodb://47.101.55.144:27017/rl',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
		    secure:   false,
		    maxAge:   365 * 24 * 60 * 60 * 1000,
		}
	}
}