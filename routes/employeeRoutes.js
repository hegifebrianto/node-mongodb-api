const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { protect } = require('../middleware/auth');


// Create a new employee
router.post('/employees', async (req, res) => {
  try {
    if (!req.body.emailAddress) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email address must be unique' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get all employees
router.get('/employees', protect, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get an employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an employee
router.put('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Register
router.post('/register', async (req, res) => {
  const { emailAddress, password, ...otherDetails } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newEmployee = new Employee({
      ...otherDetails,
      emailAddress,
      password: hashedPassword,
    });

    await newEmployee.save();
    const token = generateToken(newEmployee._id); // Generate token
    res.status(201).json({ employee: newEmployee, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    const employee = await Employee.findOne({ emailAddress });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const isMatch = await bcrypt.compare(password, employee.password); // Compare password
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(employee._id); // Generate token
    res.status(200).json({ employee, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
