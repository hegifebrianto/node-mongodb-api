const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobTitleName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  preferredFullName: { type: String, required: true },
  employeeCode: { type: String, required: true },
  region: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: false, unique: true }, // Mark as required and unique
},{ collection: 'employee' });

module.exports = mongoose.model('Employee', employeeSchema);
