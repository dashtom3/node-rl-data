'use strict';

import show from './show'
import collect from './collect'
import system from './system';
import exportPDF from './exportPDF'
export default app => {
	
	app.use('/data', collect);//wifi(旧)
	app.use('/test',collect);//摄像头(旧)

	app.use('/collect',collect);
	app.use('/show',show);
	
	app.use('/system',system)
	// app.use('/wifi',wifi)
	app.use('/export',exportPDF)
	// app.use('')
}