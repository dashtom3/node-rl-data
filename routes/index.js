'use strict';


import data from './data'
import search from './search'
import test from './test'
import camera from './camera'
import wifi from './wifiDemo'
import collect from './collect'
export default app => {
	
	app.use('/data', collect);
	app.use('/test',collect);
	app.use('/collect',collect);
	app.use('/search',search);
	app.use('/camera',camera)
	
	app.use('/wifi',wifi)

	app.use('')
}