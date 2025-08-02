// In-memory storage for users and issues when database is not available
const bcrypt = require('bcryptjs');

class InMemoryStorage {
  constructor() {
    this.users = [
      // Default admin user
      {
        id: 1,
        email: 'admin@civictrack.com',
        password: '$2a$12$LQv3c1yqBwEHxv6r5jGQM.vI8N5k6FqZr0WtS2h.KdG8QJ7EFRB4W', // 'admin123'
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567890',
        role: 'admin',
        is_banned: false,
        is_anonymous: false,
        created_at: new Date().toISOString()
      }
    ];
    
    this.issues = [
      {
        id: 1,
        title: 'Pothole on Main Street',
        description: 'Large pothole causing damage to vehicles near the intersection of Main St and Oak Ave.',
        category: 'roads',
        latitude: 30.7700,
        longitude: 76.5710,
        address: 'Main Street, Chandigarh',
        user_id: 1,
        photos: [],
        is_anonymous: false,
        status: 'reported',
        is_hidden: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Broken Street Light',
        description: 'Street light has been non-functional for over a week, making the area unsafe at night.',
        category: 'lighting',
        latitude: 30.7705,
        longitude: 76.5715,
        address: 'Sector 17, Chandigarh',
        user_id: 1,
        photos: [],
        is_anonymous: false,
        status: 'in_progress',
        is_hidden: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'Garbage Overflow',
        description: 'Public dustbin is overflowing and attracting stray animals.',
        category: 'cleanliness',
        latitude: 30.7710,
        longitude: 76.5720,
        address: 'Sector 22, Chandigarh',
        user_id: 1,
        photos: [],
        is_anonymous: false,
        status: 'resolved',
        is_hidden: false,
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    this.statusLogs = [
      {
        id: 1,
        issue_id: 1,
        status: 'reported',
        changed_by: null,
        changed_at: new Date().toISOString()
      },
      {
        id: 2,
        issue_id: 2,
        status: 'reported',
        changed_by: null,
        changed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        issue_id: 2,
        status: 'in_progress',
        changed_by: 1,
        changed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    this.issueFlags = [];
    
    this.userIdCounter = 2;
    this.issueIdCounter = 4;
    this.statusLogIdCounter = 4;
  }

  // User methods
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const newUser = {
      id: this.userIdCounter++,
      email: userData.email,
      password: hashedPassword,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone || null,
      role: 'user',
      is_banned: false,
      is_anonymous: userData.isAnonymous || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.users.push(newUser);
    return newUser.id;
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    const user = this.users.find(user => user.id === parseInt(id));
    if (user) {
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  findUserByIdWithPassword(id) {
    return this.users.find(user => user.id === parseInt(id));
  }

  getAllUsers() {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  updateUser(id, userData) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...userData,
        updated_at: new Date().toISOString()
      };
      return true;
    }
    return false;
  }

  banUser(id) {
    return this.updateUser(id, { is_banned: true });
  }

  // Issue methods
  createIssue(issueData) {
    const newIssue = {
      id: this.issueIdCounter++,
      title: issueData.title,
      description: issueData.description,
      category: issueData.category,
      latitude: parseFloat(issueData.latitude),
      longitude: parseFloat(issueData.longitude),
      address: issueData.address,
      user_id: issueData.userId,
      photos: issueData.photos || [],
      is_anonymous: issueData.isAnonymous || false,
      status: 'reported',
      is_hidden: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.issues.push(newIssue);
    
    // Create initial status log
    this.statusLogs.push({
      id: this.statusLogIdCounter++,
      issue_id: newIssue.id,
      status: 'reported',
      changed_by: null,
      changed_at: new Date().toISOString()
    });
    
    return newIssue.id;
  }

  findIssueById(id) {
    const issue = this.issues.find(issue => issue.id === parseInt(id));
    if (issue) {
      // Add user information
      const user = this.findUserById(issue.user_id);
      return {
        ...issue,
        first_name: user?.first_name || 'Anonymous',
        last_name: user?.last_name || 'User'
      };
    }
    return null;
  }

  findNearbyIssues(latitude, longitude, radius = 5) {
    const issues = this.issues.filter(issue => {
      if (issue.is_hidden) return false;
      const distance = this.calculateDistance(latitude, longitude, issue.latitude, issue.longitude);
      return distance <= radius;
    });
    
    // Add user information to each issue
    return issues.map(issue => {
      const user = this.findUserById(issue.user_id);
      return {
        ...issue,
        first_name: user?.first_name || 'Anonymous',
        last_name: user?.last_name || 'User',
        distance: this.calculateDistance(latitude, longitude, issue.latitude, issue.longitude)
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getAllIssues(filters = {}) {
    let filteredIssues = [...this.issues];
    
    if (filters.status && filters.status !== 'all') {
      filteredIssues = filteredIssues.filter(issue => issue.status === filters.status);
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredIssues = filteredIssues.filter(issue => issue.category === filters.category);
    }
    
    if (filters.flagged) {
      filteredIssues = filteredIssues.filter(issue => issue.is_hidden);
    }
    
    // Add user information and flag count
    return filteredIssues.map(issue => {
      const user = this.findUserById(issue.user_id);
      const flagCount = this.issueFlags.filter(flag => flag.issue_id === issue.id).length;
      return {
        ...issue,
        first_name: user?.first_name || 'Anonymous',
        last_name: user?.last_name || 'User',
        flag_count: flagCount
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  updateIssueStatus(id, status, adminId = null) {
    const issueIndex = this.issues.findIndex(issue => issue.id === parseInt(id));
    if (issueIndex !== -1) {
      this.issues[issueIndex].status = status;
      this.issues[issueIndex].updated_at = new Date().toISOString();
      
      // Add status log
      this.statusLogs.push({
        id: this.statusLogIdCounter++,
        issue_id: parseInt(id),
        status: status,
        changed_by: adminId,
        changed_at: new Date().toISOString()
      });
      
      return true;
    }
    return false;
  }

  hideIssue(id) {
    const issueIndex = this.issues.findIndex(issue => issue.id === parseInt(id));
    if (issueIndex !== -1) {
      this.issues[issueIndex].is_hidden = true;
      this.issues[issueIndex].updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  unhideIssue(id) {
    const issueIndex = this.issues.findIndex(issue => issue.id === parseInt(id));
    if (issueIndex !== -1) {
      this.issues[issueIndex].is_hidden = false;
      this.issues[issueIndex].updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  flagIssue(issueId, userId) {
    // Check if user already flagged this issue
    const existingFlag = this.issueFlags.find(flag => 
      flag.issue_id === parseInt(issueId) && flag.user_id === parseInt(userId)
    );
    
    if (!existingFlag) {
      this.issueFlags.push({
        issue_id: parseInt(issueId),
        user_id: parseInt(userId),
        created_at: new Date().toISOString()
      });
    }
    
    // Auto-hide if 3+ flags
    const flagCount = this.issueFlags.filter(flag => flag.issue_id === parseInt(issueId)).length;
    if (flagCount >= 3) {
      this.hideIssue(issueId);
    }
    
    return true;
  }

  getStatusHistory(issueId) {
    const logs = this.statusLogs.filter(log => log.issue_id === parseInt(issueId));
    return logs.map(log => {
      const user = log.changed_by ? this.findUserById(log.changed_by) : null;
      return {
        ...log,
        first_name: user?.first_name || null,
        last_name: user?.last_name || null
      };
    }).sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
  }

  getAnalytics() {
    const totalIssues = this.issues.length;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentIssues = this.issues.filter(issue => 
      new Date(issue.created_at) >= sevenDaysAgo
    ).length;
    
    const categoryStats = {};
    const statusStats = {};
    
    this.issues.forEach(issue => {
      categoryStats[issue.category] = (categoryStats[issue.category] || 0) + 1;
      statusStats[issue.status] = (statusStats[issue.status] || 0) + 1;
    });
    
    return {
      totalIssues,
      recentIssues,
      categoryStats: Object.entries(categoryStats).map(([category, count]) => ({ category, count })),
      statusStats: Object.entries(statusStats).map(([status, count]) => ({ status, count }))
    };
  }

  // Helper method to calculate distance
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Method to validate password
  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

// Create and export a single instance
const storage = new InMemoryStorage();
module.exports = storage;
