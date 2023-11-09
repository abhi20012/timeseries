const mongoose = require('mongoose');

const infoSchema = mongoose.Schema({
	names:{
		type:String,
		required:true
	},
	cities:{
		type:String,
		required:true
	}
}, {
	timestamps:true
});

const InfoModel = mongoose.model('Info', infoSchema);
module.exports = InfoModel;