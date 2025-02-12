const express = require('express');
const { signUp, signIn } = require('../controllers/authController'); // Importing the controller
const router = express.Router();

// Sign-up and Sign-in routes using controller functions
router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;
