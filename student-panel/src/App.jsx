import React, { useState, useEffect } from 'react';
import './App.css';

// Base URL configuration - Change this to your backend URL
const BASE_URL = 'http://localhost:5000/api';

function App() {
  const [hallTicket, setHallTicket] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [winners, setWinners] = useState([]);
  const [resultsSummary, setResultsSummary] = useState({
    totalTeams: 0,
    evaluatedTeams: 0,
    resultsGenerated: false
  });
  const [animateRows, setAnimateRows] = useState(false);
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [dynamicProblemStatement, setDynamicProblemStatement] = useState('');

  // Fetch problem statement from database
  useEffect(() => {
    fetchProblemStatement();
    const interval = setInterval(fetchProblemStatement, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchProblemStatement = async () => {
    try {
      const response = await fetch(`${BASE_URL}/problem-statement`);
      const data = await response.json();
      if (data.problemStatement) {
        setDynamicProblemStatement(data.problemStatement);
      }
    } catch (err) {
      console.error('Failed to fetch problem statement:', err);
    }
  };

  // Check for saved login state on component mount
  useEffect(() => {
    const savedTeamData = localStorage.getItem('teamData');
    if (savedTeamData) {
      const parsedData = JSON.parse(savedTeamData);
      setTeamData(parsedData);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch leaderboard data and update team performance
  useEffect(() => {
    if (isLoggedIn) {
      fetchLeaderboard();
      const interval = setInterval(fetchLeaderboard, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/public/results`);
      const data = await response.json();
      
      if (response.ok) {
        setLeaderboard(data.results || []);
        setResultsSummary(data.summary || {
          totalTeams: 0,
          evaluatedTeams: 0,
          resultsGenerated: false
        });
        
        const winnersResponse = await fetch(`${BASE_URL}/public/winners`);
        const winnersData = await winnersResponse.json();
        setWinners(winnersData || []);
        
        if (teamData && teamData.leaderHallTicket) {
          const currentTeamResults = data.results?.find(
            team => team.leaderHallTicket === teamData.leaderHallTicket
          );
          
          if (currentTeamResults) {
            const updatedTeamData = {
              ...teamData,
              marks: currentTeamResults.marks,
              rank: currentTeamResults.rank,
              locked: true
            };
            setTeamData(updatedTeamData);
            localStorage.setItem('teamData', JSON.stringify(updatedTeamData));
          } else {
            const evaluateResponse = await fetch(`${BASE_URL}/team/${teamData.leaderHallTicket}`);
            const evaluateData = await evaluateResponse.json();
            
            if (evaluateData && evaluateData.locked) {
              const updatedTeamData = {
                ...teamData,
                marks: evaluateData.marks,
                rank: evaluateData.rank,
                locked: evaluateData.locked
              };
              setTeamData(updatedTeamData);
              localStorage.setItem('teamData', JSON.stringify(updatedTeamData));
            }
          }
        }
        
        setAnimateRows(true);
        setTimeout(() => setAnimateRows(false), 500);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hallTicket })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setTeamData(data);
      setIsLoggedIn(true);
      localStorage.setItem('teamData', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTeamData(null);
    setHallTicket('');
    setShowProblemStatement(false);
    localStorage.removeItem('teamData');
  };

  const getMedal = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  // Function to parse and format problem statement with sections
  const formatProblemStatement = (statement) => {
    if (!statement) return null;
    
    // Split into sections based on emoji markers
    const sections = [];
    const lines = statement.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for section headers with emojis
      if (line.includes('🎯') || line.includes('📌') || line.includes('👥') || 
          line.includes('⚙️') || line.includes('💡') || line.includes('🎨') || 
          line.includes('⭐')) {
        
        if (currentSection) {
          sections.push({ title: currentSection, content: currentContent.join('\n') });
        }
        currentSection = line;
        currentContent = [];
      } else if (currentSection && line.trim()) {
        currentContent.push(line);
      }
    }
    
    if (currentSection) {
      sections.push({ title: currentSection, content: currentContent.join('\n') });
    }
    
    return sections;
  };

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="hero-section">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
          <div className="hero-content fade-in-up">
            <div className="event-badge pulse">QUANTUM LEAP 2K26</div>
            <h1 className="hero-title">
              UI/UX 
              <span className="gradient-text">DESIGN-A-THON</span>
            </h1>
            <p className="hero-tagline slide-in">Where Creativity Meets User Experience</p>
            <div className="dates">
              <span className="date-card">Round 1: 24th March</span>
              <span className="date-card">Round 2: 25th March</span>
            </div>
          </div>
        </div>

        <div className="login-section">
          <div className="login-card glow-on-hover">
            <div className="login-header">
              <div className="login-icon bounce">🎨</div>
              <h2 className="slide-in">Student Login</h2>
              <p>Enter your hall ticket to view the leaderboard</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Hall Ticket Number</label>
                <input
                  type="text"
                  value={hallTicket}
                  onChange={(e) => setHallTicket(e.target.value)}
                  placeholder="Enter your hall ticket number"
                  required
                  className="input-glow"
                />
              </div>
              {error && <div className="error-message shake">{error}</div>}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Access Leaderboard
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="coordinator-info fade-in">
              <h4>Faculty Coordinators</h4>
              <p>Mrs. G. Swetha (Asst.Professor-CSE)</p>
              <p>Mrs. B. Rajeshwari (Asst.Professor-CSE)</p>
            </div>
            <div className="coordinator-info fade-in" style={{animationDelay: '0.2s'}}>
              <h4>Student Coordinators</h4>
              <p>Mr. R. Vamshi (IV-CSE)</p>
              <p>Mr. S. Deepthi (IV-CSE)</p>
            </div>
            <div className="contact-info fade-in" style={{animationDelay: '0.4s'}}>
              <h4>Contact</h4>
              <p>📞 9014243908</p>
              <p>📞 8374505524</p>
              <p>📍 Lab VIII</p>
              <p>🐦 X @scientsnti</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Student Dashboard (after login)
  const formattedSections = formatProblemStatement(dynamicProblemStatement);

  return (
    <div className="app dashboard-app">
      <nav className="dashboard-nav slide-down">
        <div className="nav-brand">
          <span className="brand-icon rotate">🎨</span>
          <span className="brand-text">UI/UX Design-A-Thon</span>
        </div>
        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{teamData.leaderName}</span>
            <span className="user-team">{teamData.teamName}</span>
          </div>
          <button className="problem-btn" onClick={() => setShowProblemStatement(!showProblemStatement)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Problem Statement
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Problem Statement Modal - Dynamically loaded */}
        {showProblemStatement && (
          <div className="modal-overlay" onClick={() => setShowProblemStatement(false)}>
            <div className="modal-content fade-in-up" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <span className="modal-icon">📋</span>
                  Design Challenge
                </h3>
                <button className="modal-close" onClick={() => setShowProblemStatement(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="problem-statement-display">
                  <div className="problem-badge">Smart Campus Navigation System</div>
                  <div className="problem-sections">
                    {formattedSections && formattedSections.length > 0 ? (
                      formattedSections.map((section, idx) => (
                        <div key={idx} className="problem-section">
                          <h4>{section.title}</h4>
                          <div className="section-content">
                            {section.content.split('\n').map((line, i) => {
                              if (line.trim().startsWith('•')) {
                                return <li key={i}>{line.trim().substring(1)}</li>;
                              }
                              return <p key={i}>{line}</p>;
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="problem-section">
                        <p>{dynamicProblemStatement || 'Loading problem statement...'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Info Card with Members */}
        <div className="team-info-card slide-in">
          <div className="team-card-header">
            <h3>
              <span className="header-icon">👥</span>
              Team Details
            </h3>
            <div className="team-badge">{teamData.teamName}</div>
          </div>
          
          <div className="team-section">
            <h4>Team Leader</h4>
            <div className="team-details-grid">
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{teamData.leaderName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hall Ticket</span>
                <span className="detail-value">{teamData.leaderHallTicket}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{teamData.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Year</span>
                <span className="detail-value">{teamData.year}</span>
              </div>
            </div>
          </div>

          <div className="team-section">
            <h4>Team Members ({teamData.members.length})</h4>
            <div className="members-list">
              {teamData.members.map((member, index) => (
                <div key={index} className="member-card">
                  <div className="member-avatar">
                    <span>{member.name.charAt(0)}</span>
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-hallticket">Hall Ticket: {member.hallTicket}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="view-problem-btn" onClick={() => setShowProblemStatement(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View Problem Statement
          </button>
        </div>

        {/* Score Card */}
        <div className="score-card">
          <div className="score-card-header">
            <h3>Your Performance</h3>
            {teamData.locked && (
              <span className="evaluated-badge pulse">✓ Evaluated</span>
            )}
          </div>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-value">{teamData.marks || 0}</span>
              <span className="score-max">/100</span>
            </div>
            <div className="score-details">
              <div className="detail-item">
                <span className="detail-label">Current Rank</span>
                <span className="detail-value rank-value">
                  {teamData.rank ? `${teamData.rank} ${getMedal(teamData.rank)}` : 'Pending Evaluation'}
                </span>
              </div>
              {teamData.locked && (
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value status-completed">Completed ✓</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="leaderboard-main fade-in-up">
          <div className="leaderboard-header">
            <h2>
              <span className="header-icon bounce">🏆</span>
              Competition Leaderboard
            </h2>
            <p className="header-subtitle pulse-text">Real-time rankings updated every 30 seconds</p>
          </div>
          
          {resultsSummary.resultsGenerated ? (
            <>
              {winners.length >= 3 && (
                <div className="podium">
                  <div className="podium-item second fade-in-up" style={{animationDelay: '0.1s'}}>
                    <div className="podium-medal bounce">🥈</div>
                    <div className="podium-score count-up">{winners[1]?.marks} pts</div>
                    <div className="podium-name">{winners[1]?.teamName}</div>
                    <div className="podium-leader">{winners[1]?.leaderName}</div>
                    <div className="podium-stand second-stand glow">2nd Place</div>
                  </div>
                  <div className="podium-item first fade-in-up" style={{animationDelay: '0s'}}>
                    <div className="podium-medal bounce">🥇</div>
                    <div className="podium-score count-up">{winners[0]?.marks} pts</div>
                    <div className="podium-name">{winners[0]?.teamName}</div>
                    <div className="podium-leader">{winners[0]?.leaderName}</div>
                    <div className="podium-stand first-stand glow">1st Place</div>
                  </div>
                  <div className="podium-item third fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="podium-medal bounce">🥉</div>
                    <div className="podium-score count-up">{winners[2]?.marks} pts</div>
                    <div className="podium-name">{winners[2]?.teamName}</div>
                    <div className="podium-leader">{winners[2]?.leaderName}</div>
                    <div className="podium-stand third-stand glow">3rd Place</div>
                  </div>
                </div>
              )}

              <div className="leaderboard-table-wrapper">
                <table className="full-leaderboard">
                  <thead>
                    <tr className="sticky-header">
                      <th>Rank</th>
                      <th>Team Name</th>
                      <th>Leader</th>
                      <th>Department</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((team, index) => (
                      <tr 
                        key={team._id} 
                        className={`
                          ${team.rank <= 3 ? `top-rank-${team.rank}` : ''}
                          ${team.leaderHallTicket === teamData.leaderHallTicket ? 'your-team-row' : ''}
                          ${animateRows ? 'row-flash' : ''}
                          slide-in
                        `}
                        style={{animationDelay: `${index * 0.03}s`}}
                      >
                        <td className="rank-col">
                          <span className={`rank-number rank-${team.rank} scale-on-hover`}>
                            #{team.rank}
                          </span>
                        </td>
                        <td className="team-col">
                          {team.teamName}
                          {team.leaderHallTicket === teamData.leaderHallTicket && 
                            <span className="your-badge pulse">Your Team</span>
                          }
                        </td>
                        <td>{team.leaderName}</td>
                        <td>{team.department}</td>
                        <td className="score-col">
                          <span className="score-number">{team.marks}</span>
                          <span className="score-total">/100</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="evaluation-status-card fade-in-up">
              <div className="status-icon bounce-in">⏳</div>
              <h3 className="glow-text">Results Under Evaluation</h3>
              <p>Judges are currently evaluating all submissions</p>
              <div className="evaluation-progress">
                <div className="progress-stats">
                  {resultsSummary.evaluatedTeams} / {resultsSummary.totalTeams} Teams Evaluated
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill shimmer"
                    style={{ 
                      width: resultsSummary.totalTeams > 0 
                        ? `${(resultsSummary.evaluatedTeams / resultsSummary.totalTeams) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
              </div>
              <p className="auto-refresh">Leaderboard will appear once evaluation is complete</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;