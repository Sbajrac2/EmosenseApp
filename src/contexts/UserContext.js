import React, { createContext, useContext, useState } from 'react';
import { IMAGES } from '../constants/images';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('Jane Doe');
  const [selectedImage, setSelectedImage] = useState(0);

  const profileImages = [IMAGES.userAvatar];

  const getUserImage = () => profileImages[selectedImage] || IMAGES.userAvatar;

  return (
    <UserContext.Provider value={{
      username,
      setUsername,
      selectedImage,
      setSelectedImage,
      getUserImage,
      profileImages
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};