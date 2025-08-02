const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 })
], authController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], authController.login);

router.get('/profile', auth, authController.getProfile);

module.exports = router;
