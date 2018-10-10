var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },  
  name: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  properties: []
});
module.exports = mongoose.model('Role', RoleSchema);
