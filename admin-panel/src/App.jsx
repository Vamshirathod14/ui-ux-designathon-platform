import React, { useState, useEffect } from 'react';
import './App.css';

// Base URL configuration - Change this to your backend URL
const BASE_URL = 'http://localhost:5000/api';

function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [marksInput, setMarksInput] = useState({});
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [problemStatement, setProblemStatement] = useState('');
  const [isEditingProblem, setIsEditingProblem] = useState(false);
  
  const [newTeam, setNewTeam] = useState({
    teamName: '',
    leaderName: '',
    leaderHallTicket: '',
    year: '',
    department: '',
    members: [{ name: '', hallTicket: '' }],
    problemStatement: ''
  });

  // Check for saved admin session on component mount
  useEffect(() => {
    const savedAdminSession = localStorage.getItem('adminSession');
    if (savedAdminSession === 'true') {
      setIsLoggedIn(true);
      fetchTeams();
      fetchProblemStatement();
    }
  }, []);

  // Fetch problem statement on load
  useEffect(() => {
    if (isLoggedIn) {
      fetchProblemStatement();
    }
  }, [isLoggedIn]);

  const fetchProblemStatement = async () => {
    try {
      const response = await fetch(`${BASE_URL}/problem-statement`);
      const data = await response.json();
      if (data.problemStatement) {
        setProblemStatement(data.problemStatement);
      }
    } catch (err) {
      console.error('Failed to fetch problem statement:', err);
    }
  };

  const updateProblemStatement = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/problem-statement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemStatement })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Problem statement updated successfully!');
        setIsEditingProblem(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      // Save admin session to localStorage
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminUsername', username);
      
      setIsLoggedIn(true);
      fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${BASE_URL}/teams`);
      const data = await response.json();
      setTeams(data);
      
      const marksObj = {};
      data.forEach(team => {
        marksObj[team._id] = team.marks || '';
      });
      setMarksInput(marksObj);
    } catch (err) {
      setError('Failed to fetch teams');
    }
  };

  const handleMarksChange = (teamId, value) => {
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setMarksInput(prev => ({
        ...prev,
        [teamId]: value
      }));
    }
  };

  const handleSubmitMarks = async (teamId) => {
    const marks = parseInt(marksInput[teamId]);
    
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setError('Please enter valid marks between 0 and 100');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/marks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, marks })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setSuccessMessage('Marks saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const filteredMembers = newTeam.members.filter(m => m.name.trim() !== '' && m.hallTicket.trim() !== '');
    
    const teamData = {
      ...newTeam,
      members: filteredMembers,
      problemStatement: problemStatement,
      marks: 0,
      locked: false,
      rank: null
    };

    try {
      const response = await fetch(`${BASE_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSuccessMessage('Team added successfully!');
      setShowAddTeam(false);
      setNewTeam({
        teamName: '',
        leaderName: '',
        leaderHallTicket: '',
        year: '',
        department: '',
        members: [{ name: '', hallTicket: '' }],
        problemStatement: problemStatement
      });
      fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setNewTeam({
      ...newTeam,
      members: [...newTeam.members, { name: '', hallTicket: '' }]
    });
  };

  const handleRemoveMember = (index) => {
    const members = [...newTeam.members];
    members.splice(index, 1);
    setNewTeam({ ...newTeam, members });
  };

  const handleMemberChange = (index, field, value) => {
    const members = [...newTeam.members];
    members[index][field] = value;
    setNewTeam({ ...newTeam, members });
  };

  const handleGenerateResults = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/generate-results`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setSuccessMessage('Results generated successfully!');
      fetchResults();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${BASE_URL}/results`);
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      setError('Failed to fetch results');
    }
  };

  const handleResetMarks = async () => {
    if (window.confirm('Are you sure you want to reset all marks? This action cannot be undone.')) {
      try {
        const response = await fetch(`${BASE_URL}/reset-marks`, {
          method: 'POST'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error);
        }
        
        setSuccessMessage('All marks reset successfully!');
        fetchTeams();
        setShowResults(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminUsername');
    
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setTeams([]);
    setResults([]);
    setShowResults(false);
    setShowAddTeam(false);
  };

  const getMedal = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="app admin-app">
        <header className="header">
          <h1>UI/UX Design-A-Thon – Admin Panel</h1>
          <p className="subtitle">Evaluator Dashboard</p>
        </header>

        <div className="login-container">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showResults) {
    const topThree = results.slice(0, 3);

    return (
      <div className="app admin-app">
        <header className="header">
          <h1>UI/UX Design-A-Thon – Results</h1>
          <p className="subtitle">Final Rankings</p>
          <div className="header-buttons">
            <button className="secondary-btn" onClick={() => setShowResults(false)}>
              Back to Dashboard
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="results-container">
          <h2>🏆 Winners 🏆</h2>
          <div className="winners-grid">
            {topThree.map((team, index) => (
              <div key={team._id} className={`winner-card rank-${team.rank}`}>
                <div className="medal">{getMedal(team.rank)}</div>
                <h3>{team.teamName}</h3>
                <p className="leader">Leader: {team.leaderName}</p>
                <p className="score">Score: {team.marks}/100</p>
                <p className="rank-text">Rank: {team.rank}</p>
              </div>
            ))}
          </div>

          <h3>Full Leaderboard</h3>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Medal</th>
                  <th>Team Name</th>
                  <th>Leader</th>
                  <th>Department</th>
                  <th>Score</th>
                 </tr>
              </thead>
              <tbody>
                {results.map(team => (
                  <tr key={team._id} className={team.rank <= 3 ? `rank-${team.rank}` : ''}>
                     <td>{team.rank}</td>
                     <td>{getMedal(team.rank)}</td>
                     <td>{team.teamName}</td>
                     <td>{team.leaderName}</td>
                     <td>{team.department}</td>
                     <td>{team.marks}/100</td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app admin-app">
      <header className="header">
        <h1>UI/UX Design-A-Thon – Admin Panel</h1>
        <p className="subtitle">Team Evaluation Dashboard</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Teams List ({teams.length} teams)</h2>
          <div className="header-actions">
            <button 
              className="add-team-btn"
              onClick={() => setShowAddTeam(!showAddTeam)}
            >
              {showAddTeam ? 'Cancel' : '+ Add New Team'}
            </button>
            <button 
              className="reset-btn"
              onClick={handleResetMarks}
            >
              Reset All Marks
            </button>
            <button 
              className="results-btn"
              onClick={handleGenerateResults}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Results'}
            </button>
          </div>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Problem Statement Editor */}
        <div className="problem-editor-card">
          <div className="problem-editor-header">
            <h3>
              <span className="icon">📋</span>
              Common Problem Statement
            </h3>
            {!isEditingProblem ? (
              <button className="edit-btn" onClick={() => setIsEditingProblem(true)}>
                ✏️ Edit
              </button>
            ) : (
              <div className="editor-actions">
                <button className="save-btn" onClick={updateProblemStatement} disabled={loading}>
                  {loading ? 'Saving...' : '💾 Save'}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditingProblem(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          {!isEditingProblem ? (
            <div className="problem-display">
              <p>{problemStatement || 'No problem statement set. Click Edit to add one.'}</p>
            </div>
          ) : (
            <div className="problem-editor">
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Enter the problem statement for all teams..."
                rows="6"
                className="problem-textarea"
              />
              <p className="note">* This problem statement will be shown to all teams</p>
            </div>
          )}
        </div>

        {showAddTeam && (
          <div className="add-team-form">
            <h3>Add New Team</h3>
            <div className="info-note">
              <p>📌 Problem statement will be auto-filled from the common problem statement above</p>
            </div>
            <form onSubmit={handleAddTeam}>
              <div className="form-row">
                <div className="form-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    value={newTeam.teamName}
                    onChange={(e) => setNewTeam({...newTeam, teamName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Leader Name *</label>
                  <input
                    type="text"
                    value={newTeam.leaderName}
                    onChange={(e) => setNewTeam({...newTeam, leaderName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Leader Hall Ticket *</label>
                  <input
                    type="text"
                    value={newTeam.leaderHallTicket}
                    onChange={(e) => setNewTeam({...newTeam, leaderHallTicket: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <input
                    type="text"
                    value={newTeam.year}
                    onChange={(e) => setNewTeam({...newTeam, year: e.target.value})}
                    placeholder="e.g., 1-2, 2-2"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    value={newTeam.department}
                    onChange={(e) => setNewTeam({...newTeam, department: e.target.value})}
                    placeholder="e.g., CSE, AIML, CSM"
                    required
                  />
                </div>
              </div>

              <div className="members-section">
                <label>Team Members</label>
                {newTeam.members.map((member, index) => (
                  <div key={index} className="member-row">
                    <input
                      type="text"
                      placeholder="Member Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Hall Ticket"
                      value={member.hallTicket}
                      onChange={(e) => handleMemberChange(index, 'hallTicket', e.target.value)}
                    />
                    {newTeam.members.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-member-btn"
                        onClick={() => handleRemoveMember(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-member-btn"
                  onClick={handleAddMember}
                >
                  + Add Member
                </button>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Team'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddTeam(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container">
          <table className="teams-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Team Name</th>
                <th>Leader Name</th>
                <th>Hall Ticket</th>
                <th>Department</th>
                <th>Year</th>
                <th>Members</th>
                <th>Marks (0-100)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team._id}>
                  <td>{index + 1}</td>
                  <td><strong>{team.teamName}</strong></td>
                  <td>{team.leaderName}</td>
                  <td>{team.leaderHallTicket}</td>
                  <td><span className="dept-badge">{team.department}</span></td>
                  <td>{team.year}</td>
                  <td className="members-count">{team.members.length}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksInput[team._id] || ''}
                      onChange={(e) => handleMarksChange(team._id, e.target.value)}
                      disabled={team.locked}
                      className={team.locked ? 'disabled-input' : ''}
                    />
                  </td>
                  <td>
                    <span className={`status-badge ${team.locked ? 'locked' : 'pending'}`}>
                      {team.locked ? '✓ Evaluated' : '⏳ Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleSubmitMarks(team._id)}
                      disabled={team.locked || loading}
                      className={team.locked ? 'submitted-btn' : 'submit-btn'}
                    >
                      {team.locked ? 'Submitted' : 'Submit'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="event-summary">
          <h3>Evaluation Summary</h3>
          <div className="summary-stats">
            <div className="stat-card">
              <span className="stat-label">Total Teams</span>
              <span className="stat-value">{teams.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Evaluated</span>
              <span className="stat-value success">{teams.filter(t => t.locked).length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending</span>
              <span className="stat-value warning">{teams.filter(t => !t.locked).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;