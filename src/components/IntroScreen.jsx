import React, { useState } from 'react';

export default function IntroScreen({ onProfileSelect }) {
  const [isFading, setIsFading] = useState(false);

  const profiles = [
    {
      name: 'Vatsal',
      letter: 'V',
      gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)', // Blue/indigo gradient
      badgeText: '👔 HE',
      badgeColor: '#1d4ed8',
      role: 'THE BOYFRIEND 👔',
      avatarColor: '#1e40af',
      emoji: '👔'
    },
    {
      name: 'Muskan',
      letter: 'M',
      gradient: 'linear-gradient(135deg, #be185d, #ec4899)', // Red/pink gradient
      badgeText: '👑 SHE',
      badgeColor: '#db2777',
      role: 'THE GIRLFRIEND 👑',
      avatarColor: '#be185d',
      emoji: '👑'
    },
    {
      name: 'Both ❤️',
      letter: '❤️',
      gradient: 'linear-gradient(135deg, #b45309, #f59e0b)', // Amber/orange gradient
      badgeText: '💖 US',
      badgeColor: '#d97706',
      role: 'THE COUPLE 💖',
      avatarColor: '#b45309',
      emoji: '💖'
    }
  ];

  const playTadum = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      // 1. Low Thud 1 (T) at 0s
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain1.gain.setValueAtTime(0.8, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);
      
      // 2. Low Thud 2 (DUM) at 0.12s
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(85, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.38);
      
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(150, now);
      
      gain2.gain.setValueAtTime(0.9, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
      
      osc2.connect(lp);
      lp.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.38);
      
      // 3. String pad / Synth rise at 0.12s
      const frequencies = [65.41, 130.81, 196.00, 261.63, 311.13, 392.00, 523.25, 587.33]; 
      
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        osc.detune.value = (idx - 3.5) * 6; 
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(80, now + 0.12);
        filter.frequency.exponentialRampToValueAtTime(1000 + idx * 80, now + 1.2);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + 0.12);
        osc.stop(now + 2.4);
      });
    } catch (err) {
      console.warn("Failed to play Web Audio sound", err);
    }
  };

  const handleSelect = (profile) => {
    playTadum();
    setIsFading(true);
    setTimeout(() => {
      onProfileSelect(profile);
    }, 1200);
  };

  return (
    <div className="profile-container" style={{
      opacity: isFading ? 0 : 1,
      transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      pointerEvents: isFading ? 'none' : 'auto',
      backgroundColor: '#000'
    }}>
      <div className="cinema-vignette"></div>
      <div className="film-grain"></div>

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 className="profile-title">
          Who's watching?
        </h1>
        
        <p className="profile-subtitle">
          Choose a profile to start streaming memories
        </p>
        
        <div className="profile-list">
          {profiles.map((profile) => (
            <div 
              key={profile.name} 
              className="profile-card"
              onClick={() => handleSelect(profile)}
            >
              {/* Profile Card Box */}
              <div 
                className="profile-avatar-wrapper"
                style={{ background: profile.gradient }}
              >
                {/* Large Center Character */}
                <div className={`profile-avatar-letter ${profile.letter === '❤️' ? 'heart' : ''}`}>
                  {profile.letter}
                </div>

                {/* Bottom Right Pill Badge */}
                <div className="profile-avatar-badge">
                  {profile.badgeText}
                </div>
              </div>

              {/* Profile Text Details underneath */}
              <span className="profile-name">
                {profile.name}
              </span>
              
              <span className="profile-role">
                {profile.role}
              </span>
            </div>
          ))}
        </div>

        <button className="manage-profiles-btn" style={{
          marginTop: '2rem',
          border: '1px solid #444',
          color: '#555',
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
          padding: '0.6rem 2rem',
          backgroundColor: 'transparent',
          fontFamily: 'var(--font-outfit)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#555';
          e.currentTarget.style.borderColor = '#444';
        }}
        >
          Manage Profiles
        </button>
      </div>
    </div>
  );
}
