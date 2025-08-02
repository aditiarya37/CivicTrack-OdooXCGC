// backend/routes/admin.js - Complete version
const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Apply auth and admin check to all routes
router.use(auth);
router.use(adminAuth);

router.get('/dashboard', adminController.getDashboard);
router.get('/issues', adminController.getAllIssues);
router.put('/issues/:id/status', adminController.updateIssueStatus);
router.put('/issues/:id/hide', adminController.hideIssue);
router.put('/issues/:id/unhide', adminController.unhideIssue);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/ban', adminController.banUser);

module.exports = router;