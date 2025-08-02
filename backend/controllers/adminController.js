const storage = require('../utils/storage');

exports.getDashboard = async (req, res) => {
  try {
    const analytics = storage.getAnalytics();
    res.json({ analytics });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.getAllIssues = async (req, res) => {
  try {
    const { status, category, flagged } = req.query;
    const filters = {};
    
    if (status && status !== 'all') filters.status = status;
    if (category && category !== 'all') filters.category = category;
    if (flagged === 'true') filters.flagged = true;

    const issues = storage.getAllIssues(filters);
    res.json({ issues });
  } catch (error) {
    console.error('Admin get issues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['reported', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const success = storage.updateIssueStatus(id, status, req.userId);
    if (!success) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json({ message: 'Issue status updated successfully' });
  } catch (error) {
    console.error('Update issue status error:', error);
    res.status(500).json({ error: 'Failed to update issue status' });
  }
};

exports.hideIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const success = storage.hideIssue(id);
    if (!success) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json({ message: 'Issue hidden successfully' });
  } catch (error) {
    console.error('Hide issue error:', error);
    res.status(500).json({ error: 'Failed to hide issue' });
  }
};

exports.unhideIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const success = storage.unhideIssue(id);
    if (!success) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json({ message: 'Issue unhidden successfully' });
  } catch (error) {
    console.error('Unhide issue error:', error);
    res.status(500).json({ error: 'Failed to unhide issue' });
  }
};

exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const success = storage.banUser(id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = storage.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
