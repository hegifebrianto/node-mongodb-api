const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobTitleName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  preferredFullName: { type: String, required: true },
  employeeCode: { type: String, required: true },
  region: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (number) => /^\+?[0-9]{7,15}$/.test(number),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: { type: String, required: true },

}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Employee', employeeSchema);
