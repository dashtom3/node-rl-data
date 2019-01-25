'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const subshopSchema = new Schema({
	number:String,
    name:String,
    address:String,
	create_time:String,
	device:[{ type:Schema.Types.ObjectId, ref: 'Device'}]
})

const Subshop = mongoose.model('Subshop', subshopSchema);


export default Subshop
