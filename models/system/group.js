'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const groupSchema = new Schema({
	number:String,
    name:String,
    position:String,
	create_time:String,
	device:[{ type:Schema.Types.ObjectId, ref: 'Device'}]
})

const Group = mongoose.model('Group', groupSchema);


export default Group
