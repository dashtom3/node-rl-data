'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const shopSchema = new Schema({
	username:String,
	password:String,
	name:String,
	address:String,
	create_time:String,
	subShop:[{ type:Schema.Types.ObjectId, ref: 'Subshop'}]
})

const Data = mongoose.model('Shop', shopSchema);


export default Data
