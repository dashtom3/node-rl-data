'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const searchSchema = new Schema({
	id:Number,
	from_time: String,
	to_time:String,
},{ collection: 'analyse'})

const Search = mongoose.model('Search', searchSchema);


export default Search
