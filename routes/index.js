'use strict';


import data from './data'
import search from './search'
import test from './test'
import camera from './camera'
import wifi from './wifiDemo'
export default app => {
	// app.get('/', (req, res, next) => {
	// 	res.redirect('/');
	// });
	app.use('/data', data);
	app.use('/search',search);
	app.use('/camera',camera)
	app.use('/test',test)
	app.use('/wifi',wifi)
}