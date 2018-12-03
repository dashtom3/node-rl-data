'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const subshopSchema = new Schema({
	number:String,
    name:String,
    address:String,
	create_time:String,
	group:[{ type:Schema.Types.ObjectId, ref: 'Group'}]
})

const Subshop = mongoose.model('Subshop', subshopSchema);


export default Subshop
