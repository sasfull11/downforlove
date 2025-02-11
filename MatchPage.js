// src/components/MatchPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const MatchPage = () => {
  const [profiles, setProfiles] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch profiles from your backend
    axios.get('/api/profiles')
      .then(response => setProfiles(response.data))
      .catch(err => console.log(err));
  }, []);

  const handleSwipe = (action, profileId) => {
    // Handle swipe action (like/dislike)
    axios.post('/api/match/swipe', { user1Id: 'currentUserId', user2Id: profileId, action })
      .then(response => console.log(response.data))
      .catch(err => console.log(err));

    if (action === 'like') {
      // Navigate to chat if match found
      history.push(`/chat/${profileId}`);
    }
  };

  return (
    <div className="match-page">
      {profiles.map(profile => (
        <div key={profile._id} className="profile-card">
          <img src={profile.profilePicture} alt="profile" />
          <h3>{profile.name}</h3>
          <p>{profile.bio}</p>
          <button onClick={() => handleSwipe('like', profile._id)}>Like</button>
          <button onClick={() => handleSwipe('dislike', profile._id)}>Dislike</button>
        </div>
      ))}
    </div>
  );
};

export default MatchPage;
