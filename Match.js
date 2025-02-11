import React, { useState } from 'react';

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);

  const handleSwipe = (action) => {
    if (action === 'like') {
      // API call to like the profile
    } else {
      // API call to skip/dislike the profile
    }
  };

  return (
    <div className="match-page">
      {currentProfile && (
        <div className="profile-card">
          <img src={currentProfile.image} alt="profile" />
          <h3>{currentProfile.name}</h3>
          <p>{currentProfile.bio}</p>
          <div className="swipe-buttons">
            <button onClick={() => handleSwipe('like')}>Like</button>
            <button onClick={() => handleSwipe('dislike')}>Dislike</button>
          </div>
        </div>
      )}
      <div className="matches-list">
        <h4>Your Matches</h4>
        {matches.map((match) => (
          <div key={match.id} className="match-item">
            <img src={match.image} alt="match" />
            <p>{match.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchPage;
// models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isMatched: { type: Boolean, default: false },
});

module.exports = mongoose.model('Match', matchSchema);
