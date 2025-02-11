
// src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = ({ match }) => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    axios.get(`/api/profile/${match.params.userId}`)
      .then(response => {
        setUser(response.data);
        setBio(response.data.bio || '');
      })
      .catch(err => console.log(err));
  }, [match.params.userId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const response = await axios.put(`/api/profile/${match.params.userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data);
      setEditMode(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile-page">
      <img src={user.profilePicture} alt="Profile" />
      {editMode ? (
        <div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Update your bio"
          />
          <input
            type="file"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <h3>{user.name}</h3>
          <p>{user.bio}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
