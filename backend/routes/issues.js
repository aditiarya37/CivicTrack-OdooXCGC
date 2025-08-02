
// backend/routes/issues.js - Complete version
const express = require('express');
const { body } = require('express-validator');
const issueController = require('../controllers/issueController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', auth, upload.array('photos', 3), [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be 1-1000 characters'),
  body('category').isIn(['roads', 'lighting', 'water', 'cleanliness', 'safety', 'obstructions']).withMessage('Invalid category'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
], issueController.createIssue);

router.get('/nearby', issueController.getNearbyIssues);
router.get('/:id', issueController.getIssueById);
router.post('/:id/flag', auth, issueController.flagIssue);

module.exports = router;
