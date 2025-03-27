import React from 'react';
import './Avatar.css';

const Avatar = ({ name, image, size = 'medium', className = '' }) => {
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  // Generate a consistent color based on name
  const getColorFromName = (name) => {
    if (!name) return '#4a55a2'; // Default color
    
    const colors = [
      '#4a55a2', // Primary brand color
      '#3a4482',
      '#6c63ff',
      '#5e56e4',
      '#7986cb',
      '#5c6bc0',
      '#3f51b5',
      '#3949ab'
    ];
    
    // Simple hash function to get a consistent index
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  const sizeClass = `avatar-${size}`;
  
  return (
    <div className={`avatar ${sizeClass} ${className}`}>
      {image ? (
        <img src={image} alt={`${name}'s avatar`} className="avatar-image" />
      ) : (
        <div 
          className="avatar-initials"
          style={{ backgroundColor: getColorFromName(name) }}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;