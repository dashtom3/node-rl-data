'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const dataSchema = new Schema({
	id: Number,
    type: Number,
})

const Data = mongoose.model('Data', dataSchema);


export default Data
