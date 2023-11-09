const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
	names:{
		type:String,
		required:true
	},
	cities:{
		type:String,
		required:true
	},
	timestamp: Date
});

const InfoModel = mongoose.model('Info', infoSchema);
module.exports = InfoModel;