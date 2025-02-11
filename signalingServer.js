const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected to signaling server');

  // Handle signaling for voice/video calls
  socket.on('offer', (offer, targetId) => {
    socket.to(targetId).emit('offer', offer);
  });

  socket.on('answer', (answer, targetId) => {
    socket.to(targetId).emit('answer', answer);
  });

  socket.on('candidate', (candidate, targetId) => {
    socket.to(targetId).emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from signaling server');
  });
});
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Your signaling server URL

const CallComponent = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  let localStream;
  let remoteStream;
  let peerConnection;

  useEffect(() => {
    // Get local media stream (audio/video)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream = stream;
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => console.error('Error accessing media devices.', error));

    // Listen for incoming call signals
    socket.on('offer', (offer) => handleOffer(offer));
    socket.on('answer', (answer) => handleAnswer(answer));
    socket.on('candidate', (candidate) => handleCandidate(candidate));

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
    };
  }, []);

  // Call Functionality
  const startCall = () => {
    setIsCalling(true);
    // Create a new peer connection
    peerConnection = new RTCPeerConnection();
    peerConnection.addEventListener('icecandidate', handleIceCandidate);
    peerConnection.addEventListener('track', handleTrack);

    // Add local stream tracks to the connection
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Create an offer and send it to the target user
    peerConnection
      .createOffer()
      .then((offer) => {
        return peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        socket.emit('offer', peerConnection.localDescription, 'targetUserId');
      });
  };

  // Handle incoming offer
  const handleOffer = (offer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    peerConnection
      .createAnswer()
      .then((answer) => peerConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit('answer', peerConnection.localDescription, 'targetUserId');
      });
  };

  // Handle incoming answer
  const handleAnswer = (answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // Handle ICE candidates
  const handleIceCandidate = (event) => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate, 'targetUserId');
    }
  };

  // Handle remote track (remote video/audio)
  const handleTrack = (event) => {
    remoteStream = event.streams[0];
    remoteVideoRef.current.srcObject = remoteStream;
    setIsInCall(true);
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
      {isCalling ? (
        <div>Calling...</div>
      ) : (
        <button onClick={startCall}>Start Call</button>
      )}
      {isInCall && <div>In Call</div>}
    </div>
  );
};

export default CallComponent;
