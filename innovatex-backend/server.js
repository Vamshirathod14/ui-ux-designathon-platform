const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully');
    seedInitialData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Team Schema
const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  leaderName: { type: String, required: true },
  leaderHallTicket: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  department: { type: String, required: true },
  members: [{
    name: String,
    hallTicket: String
  }],
  problemStatement: { type: String, required: true },
  marks: { type: Number, default: 0 },
  rank: { type: Number, default: null },
  locked: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

// Problem Statement Schema
const problemStatementSchema = new mongoose.Schema({
  statement: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const ProblemStatement = mongoose.model('ProblemStatement', problemStatementSchema);

// Default Problem Statement
const defaultProblemStatement = `🎯 Objective

Design a user-friendly mobile/web application that helps students and visitors easily navigate a large college campus.

📌 Problem Description

In many colleges, especially during events like Quantum Leap 2K26, outside participants and new students face difficulty in locating departments, auditoriums, labs, and event venues. This leads to confusion, delays, and poor experience.

👥 Target Users
• Outside participants
• First-year students
• Visitors/guests

⚙️ Inputs / Constraints
• Campus map will be provided (static image or basic layout)
• Users may not be familiar with building names
• Internet connectivity may be limited
• App should be simple and quick to use

💡 Expected Solution

Participants should design:
• Intuitive navigation interface (map-based or list-based)
• Search functionality (by location/event name)
• Step-by-step directions or visual guidance
• Emergency/help contact section

🎨 Deliverables
• Wireframes / UI Screens
• Interactive Prototype (Figma preferred)
• Brief explanation of design decisions

⭐ Evaluation Criteria
• User Experience (UX clarity & flow)
• Visual Design (UI attractiveness)
• Innovation
• Practical usability`;

// Initial team data
const initialTeams = [
  {
    teamName: "Neuro Nova",
    leaderName: "Rupesh Shyam",
    leaderHallTicket: "25C01A6646",
    year: "1-2",
    department: "CSM",
    members: [
      { name: "Rupesh Shyam", hallTicket: "25C01A6646" },
      { name: "Md Aayan", hallTicket: "25C01A6637" },
      { name: "B Sai Kumar", hallTicket: "25C01A6607" },
      { name: "N Anil Kumar", hallTicket: "25C01A6643" },
      { name: "V Hruday Charan", hallTicket: "25C01A6660" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "Pixel minds",
    leaderName: "Abhishek",
    leaderHallTicket: "24C01A05S1",
    year: "2-2",
    department: "CSE",
    members: [
      { name: "Abhishek", hallTicket: "24C01A05S1" },
      { name: "Siddharth", hallTicket: "24C01A05N3" },
      { name: "Venkatesh", hallTicket: "24C01A05P1" },
      { name: "Priyanka", hallTicket: "24C01A05P4" },
      { name: "Kaivalya", hallTicket: "24C01A05R7" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "Twin Quanta",
    leaderName: "K Akansha",
    leaderHallTicket: "24C01A7332",
    year: "2-2",
    department: "AIML",
    members: [
      { name: "K Akansha", hallTicket: "24C01A7332" },
      { name: "N Rajini", hallTicket: "24C01A7346" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "Mission KanyaRashi",
    leaderName: "N. Shanmukha Kundiya",
    leaderHallTicket: "25C01A05G7",
    year: "1-2",
    department: "CSE",
    members: [
      { name: "N. Shanmukha Kundiya", hallTicket: "25C01A05G7" },
      { name: "P Sumanth Chary", hallTicket: "25C01A05L4" },
      { name: "G Kali Tejas", hallTicket: "25C010A578" },
      { name: "Shiva Sai", hallTicket: "25C010A5A0" },
      { name: "G Ram Charan Reddy", hallTicket: "25C010A577" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "Tech Trojan",
    leaderName: "Mohammed Mustafa Ali",
    leaderHallTicket: "24C01A05H4",
    year: "2-2",
    department: "CSE",
    members: [
      { name: "Mohammed Mustafa Ali", hallTicket: "24C01A05H4" },
      { name: "Mohammed Urooj", hallTicket: "24C01A05H5" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "INCEPTION",
    leaderName: "Gagan Manoj",
    leaderHallTicket: "25C01A7302",
    year: "1-2",
    department: "AIML",
    members: [
      { name: "Gagan Manoj", hallTicket: "25C01A7302" },
      { name: "Yashwanth", hallTicket: "25C01A7318" },
      { name: "Ajay", hallTicket: "25C01A7361" },
      { name: "Gowtham", hallTicket: "25C01A7304" },
      { name: "Sankeerth", hallTicket: "25C01A7314" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "Tech Titans",
    leaderName: "Neha",
    leaderHallTicket: "25C01A6661",
    year: "1-2",
    department: "CSM",
    members: [
      { name: "Neha", hallTicket: "25C01A6661" },
      { name: "Jonathan Raj", hallTicket: "25C01A6622" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "CODE ASTHETICS",
    leaderName: "Jampula Mandhira",
    leaderHallTicket: "25C01A05A1",
    year: "1-2",
    department: "CSE",
    members: [
      { name: "Jampula Mandhira", hallTicket: "25C01A05A1" },
      { name: "Kadam Shruti Deshmukh", hallTicket: "25C01A05B3" },
      { name: "Jettaboina Ramya", hallTicket: "25C01A05A5" },
      { name: "Kayya Akhila", hallTicket: "25C01A05C5" },
      { name: "Kashamalla Pravalika", hallTicket: "25C01A05C3" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "Prof's",
    leaderName: "P. Jyoshna",
    leaderHallTicket: "25C01A7337",
    year: "1-2",
    department: "AIML",
    members: [
      { name: "P. Jyoshna", hallTicket: "25C01A7337" },
      { name: "B. Manasa", hallTicket: "25C01A6609" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  },
  {
    teamName: "007",
    leaderName: "Sai Teja N V",
    leaderHallTicket: "25C05A7304",
    year: "2-2",
    department: "AIML",
    members: [
      { name: "Sai Teja N V", hallTicket: "25C05A7304" },
      { name: "M Arun", hallTicket: "24C01A7339" }
    ],
    problemStatement: defaultProblemStatement,
    marks: 0,
    rank: null,
    locked: false
  }
];

// Seed initial data function
async function seedInitialData() {
  try {
    const count = await Team.countDocuments();
    if (count === 0) {
      console.log('Seeding initial team data...');
      await Team.insertMany(initialTeams);
      console.log(`${initialTeams.length} teams seeded successfully`);
    } else {
      console.log('Database already has data, skipping seed');
    }

    // Seed problem statement if not exists
    const problemCount = await ProblemStatement.countDocuments();
    if (problemCount === 0) {
      console.log('Seeding default problem statement...');
      await ProblemStatement.create({ statement: defaultProblemStatement });
      console.log('Default problem statement seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// ==================== PUBLIC ENDPOINTS ====================

// Get problem statement (public)
app.get('/api/problem-statement', async (req, res) => {
  try {
    let problem = await ProblemStatement.findOne();
    if (!problem) {
      problem = await ProblemStatement.create({ statement: defaultProblemStatement });
    }
    res.json({ problemStatement: problem.statement });
  } catch (error) {
    console.error('Fetch problem statement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public endpoint to get results/leaderboard (no login required)
app.get('/api/public/results', async (req, res) => {
  try {
    const teams = await Team.find({ locked: true })
      .sort({ rank: 1, marks: -1 })
      .select('teamName leaderName department marks rank leaderHallTicket');
    
    const allTeams = await Team.countDocuments();
    const evaluatedTeams = teams.length;
    
    res.json({
      results: teams,
      summary: {
        totalTeams: allTeams,
        evaluatedTeams: evaluatedTeams,
        resultsGenerated: evaluatedTeams === allTeams && allTeams > 0
      }
    });
  } catch (error) {
    console.error('Fetch public results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get winners only (top 3)
app.get('/api/public/winners', async (req, res) => {
  try {
    const winners = await Team.find({ locked: true, rank: { $lte: 3 } })
      .sort({ rank: 1 })
      .select('teamName leaderName department marks rank leaderHallTicket');
    
    res.json(winners);
  } catch (error) {
    console.error('Fetch winners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Student Login
app.post('/api/login', async (req, res) => {
  try {
    const { hallTicket } = req.body;
    
    if (!hallTicket) {
      return res.status(400).json({ error: 'Hall ticket is required' });
    }

    const team = await Team.findOne({ leaderHallTicket: hallTicket });
    
    if (!team) {
      return res.status(401).json({ error: 'Invalid Hall Ticket' });
    }
    
    res.json(team);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update problem statement (Admin only)
app.post('/api/problem-statement', async (req, res) => {
  try {
    const { problemStatement } = req.body;
    
    if (!problemStatement) {
      return res.status(400).json({ error: 'Problem statement is required' });
    }
    
    // Update or create problem statement
    let problem = await ProblemStatement.findOne();
    if (problem) {
      problem.statement = problemStatement;
      problem.updatedAt = new Date();
      await problem.save();
    } else {
      problem = await ProblemStatement.create({ statement: problemStatement });
    }
    
    // Update all existing teams with new problem statement
    await Team.updateMany(
      {},
      { problemStatement: problemStatement }
    );
    
    res.json({ 
      success: true, 
      message: 'Problem statement updated successfully',
      problemStatement: problem.statement
    });
  } catch (error) {
    console.error('Update problem statement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all teams (Admin)
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find().sort({ teamName: 1 });
    res.json(teams);
  } catch (error) {
    console.error('Fetch teams error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new team (Admin)
app.post('/api/teams', async (req, res) => {
  try {
    const teamData = req.body;
    
    // Validate required fields
    const requiredFields = ['teamName', 'leaderName', 'leaderHallTicket', 'year', 'department', 'problemStatement'];
    for (const field of requiredFields) {
      if (!teamData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Ensure members array exists
    if (!teamData.members || !Array.isArray(teamData.members)) {
      teamData.members = [];
    }

    // Set default values
    teamData.marks = teamData.marks || 0;
    teamData.rank = teamData.rank || null;
    teamData.locked = teamData.locked || false;
    
    const team = await Team.create(teamData);
    res.status(201).json({
      success: true,
      message: 'Team added successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Hall ticket already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Submit marks (Admin)
app.post('/api/marks', async (req, res) => {
  try {
    const { teamId, marks } = req.body;
    
    if (!teamId || marks === undefined) {
      return res.status(400).json({ error: 'Team ID and marks are required' });
    }

    if (marks < 0 || marks > 100) {
      return res.status(400).json({ error: 'Marks must be between 0 and 100' });
    }
    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    if (team.locked) {
      return res.status(400).json({ error: 'Marks already submitted for this team' });
    }
    
    team.marks = marks;
    team.locked = true;
    await team.save();
    
    res.json({ 
      success: true, 
      message: 'Marks saved successfully',
      team 
    });
  } catch (error) {
    console.error('Submit marks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate results (Admin)
app.post('/api/generate-results', async (req, res) => {
  try {
    const teams = await Team.find({ locked: true });
    
    // Check if all teams have marks
    const totalTeams = await Team.countDocuments();
    if (teams.length !== totalTeams) {
      return res.status(400).json({ 
        error: 'Not all teams have been evaluated',
        pending: totalTeams - teams.length,
        total: totalTeams,
        evaluated: teams.length
      });
    }
    
    if (teams.length === 0) {
      return res.status(400).json({ error: 'No teams have been evaluated yet' });
    }
    
    // Sort by marks descending
    teams.sort((a, b) => b.marks - a.marks);
    
    // Assign ranks with tie handling
    let rank = 1;
    for (let i = 0; i < teams.length; i++) {
      if (i > 0 && teams[i].marks === teams[i-1].marks) {
        teams[i].rank = teams[i-1].rank;
      } else {
        teams[i].rank = rank;
      }
      rank++;
      await teams[i].save();
    }
    
    // Get final sorted results
    const results = await Team.find({ locked: true }).sort({ rank: 1 });
    
    res.json({ 
      success: true, 
      message: 'Results generated successfully',
      results
    });
  } catch (error) {
    console.error('Generate results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get results (Admin)
app.get('/api/results', async (req, res) => {
  try {
    const teams = await Team.find({ locked: true })
      .sort({ rank: 1, marks: -1 })
      .select('-__v -createdAt -updatedAt');
    res.json(teams);
  } catch (error) {
    console.error('Fetch results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get team by hall ticket
app.get('/api/team/:hallTicket', async (req, res) => {
  try {
    const team = await Team.findOne({ leaderHallTicket: req.params.hallTicket });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    console.error('Fetch team error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update team (Admin)
app.put('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({
      success: true,
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    console.error('Update team error:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Hall ticket already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Delete team (Admin)
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset all marks (Admin)
app.post('/api/reset-marks', async (req, res) => {
  try {
    await Team.updateMany(
      {},
      { 
        marks: 0, 
        rank: null, 
        locked: false 
      }
    );
    
    res.json({
      success: true,
      message: 'All marks reset successfully'
    });
  } catch (error) {
    console.error('Reset marks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete all teams (Admin - for testing)
app.delete('/api/teams', async (req, res) => {
  try {
    await Team.deleteMany({});
    res.json({ success: true, message: 'All teams deleted' });
  } catch (error) {
    console.error('Delete teams error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});