const { validationResult } = require('express-validator');
const Issue = require('../models/Issue');

exports.createIssue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, description, category, latitude, longitude, address, isAnonymous } = req.body;
    const photos = req.files ? req.files.map(file => file.filename) : [];

    const issueId = await Issue.create({
      title, 
      description, 
      category, 
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude), 
      address,
      userId: req.userId, 
      photos, 
      isAnonymous: isAnonymous === 'true'
    });

    const issue = await Issue.findById(issueId);
    res.status(201).json({
      message: 'Issue reported successfully',
      issue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ error: 'Failed to create issue. Please try again.' });
  }
};

exports.getNearbyIssues = async (req, res) => {
  try {
    const { lat, lng, radius = 5, status, category } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    let issues = await Issue.findNearby(parseFloat(lat), parseFloat(lng), parseFloat(radius));
    
    // Apply filters
    if (status && status !== 'all') {
      issues = issues.filter(issue => issue.status === status);
    }
    
    if (category && category !== 'all') {
      issues = issues.filter(issue => issue.category === category);
    }

    res.json({ issues });
  } catch (error) {
    console.error('Fetch nearby issues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const statusHistory = await Issue.getStatusHistory(id);
    
    res.json({ 
      issue: {
        ...issue,
        statusHistory
      }
    });
  } catch (error) {
    console.error('Fetch issue error:', error);
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
};

exports.flagIssue = async (req, res) => {
  try {
    const { id } = req.params;
    
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    await Issue.flag(id, req.userId);
    res.json({ message: 'Issue flagged successfully' });
  } catch (error) {
    console.error('Flag issue error:', error);
    res.status(500).json({ error: 'Failed to flag issue' });
  }
};