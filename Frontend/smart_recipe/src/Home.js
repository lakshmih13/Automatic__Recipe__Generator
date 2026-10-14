import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import homeImage from './home.jpg'; 

const Home = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false); 

  const handleStartClick = () => {
    navigate('/visitor');
  };

  const homeStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.8) 100%), url(${homeImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at 30% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    animation: 'fadeInUp 0.8s ease-out',
  };

  const taglineStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#fbbf24',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    marginBottom: '16px',
    opacity: 0.9,
  };

  const headingStyle = {
    margin: '0 0 12px 0',
    textAlign: 'center',
    color: '#f1f5f9',
    fontSize: 'clamp(36px, 5vw, 64px)',
    fontWeight: '800',
    lineHeight: 1.1,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-1px',
  };

  const highlightStyle = {
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: '#94a3b8',
    maxWidth: '500px',
    margin: '0 auto 40px auto',
    fontWeight: '400',
    lineHeight: 1.6,
  };

  const buttonStyle = {
    background: isHovered 
      ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' 
      : 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    color: '#0f172a',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.5px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isHovered 
      ? '0 8px 30px rgba(245, 158, 11, 0.5)' 
      : '0 4px 20px rgba(245, 158, 11, 0.3)',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
  };

  return (
    <div style={homeStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <p style={taglineStyle}>🍳 Smart Cooking Made Easy</p>
        <h1 style={headingStyle}>
          Automatic <span style={highlightStyle}>Recipe</span> Generator
        </h1>
        <p style={subtitleStyle}>
          Discover delicious recipes tailored to your ingredients. Cook smarter, eat better.
        </p>
        <button 
          style={buttonStyle} 
          onClick={handleStartClick}
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
};

export default Home;
