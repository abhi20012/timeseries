const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
	names:String, 
	cities:String,
	timestamp:Date
});

const InfoModel = mongoose.model('Info', infoSchema);
module.exports = InfoModel;