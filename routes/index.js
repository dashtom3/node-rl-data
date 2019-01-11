'use strict';

import show from './show'
import collect from './collect'

export default app => {
	
	app.use('/data', collect);//wifi(旧)
	app.use('/test',collect);//摄像头(旧)

	app.use('/collect',collect);
	app.use('/show',show);
	

	// app.use('/wifi',wifi)

	// app.use('')
}