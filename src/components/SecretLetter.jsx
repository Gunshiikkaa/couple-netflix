import React, { useState, useEffect } from 'react';

export default function SecretLetter() {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hearts, setHearts] = useState([]);

  const correctPIN = '1024'; // October 24 anniversary

  const handleKeyPress = (num) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + num);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPasscode('');
    setErrorMsg('');
  };

  const spawnHearts = () => {
    const list = [];
    // Spawn 30 hearts with random positions, delays, and scales
    for (let i = 0; i < 30; i++) {
      const id = Math.random().toString(36).substr(2, 9);
      const left = Math.random() * 100; // 0-100% width
      const size = Math.random() * 20 + 15; // 15-35px
      const delay = Math.random() * 3; // 0-3s delay
      const duration = Math.random() * 3 + 3; // 3-6s duration
      list.push({ id, left, size, delay, duration });
    }
    setHearts(list);

    // Clean up hearts after they finish animating
    setTimeout(() => {
      setHearts([]);
    }, 6000);
  };

  useEffect(() => {
    if (passcode.length === 4) {
      if (passcode === correctPIN) {
        setIsUnlocked(true);
        setErrorMsg('');
        spawnHearts();
      } else {
        setErrorMsg('Incorrect Passcode. Try again!');
        setPasscode('');
        // Shake feedback
        try {
          const display = document.querySelector('.passcode-display');
          if (display) {
            display.style.animation = 'none';
            // Trigger reflow
            void display.offsetWidth;
            display.style.animation = 'shake 0.4s ease';
          }
        } catch (e) {}
      }
    }
  }, [passcode]);

  return (
    <div style={{ padding: '4rem 4%', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Floating Hearts Animation */}
      {hearts.length > 0 && (
        <div className="hearts-container">
          {hearts.map((heart) => (
            <svg
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${heart.duration}s`
              }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ))}
        </div>
      )}

      {!isUnlocked ? (
        <div className="lockbox-container">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-outfit)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Secret Lockbox
          </h2>
          <p style={{ color: 'var(--text-grey)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Please enter our anniversary passcode (MMDD) to unlock a private message.
          </p>

          {/* Keypad display */}
          <div className="passcode-display" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: passcode.length > idx ? 'var(--netflix-red)' : 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: passcode.length > idx ? '0 0 10px var(--netflix-red)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              />
            ))}
          </div>

          {errorMsg && (
            <div style={{ color: 'var(--netflix-red)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', minHeight: '1.2rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Lockbox Numeric Keypad */}
          <div className="lockbox-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="keypad-btn"
                onClick={() => handleKeyPress(num)}
              >
                {num}
              </button>
            ))}
            <button className="keypad-btn" onClick={handleClear} style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-grey)' }}>
              Clear
            </button>
            <button className="keypad-btn" onClick={() => handleKeyPress(0)}>
              0
            </button>
            <button className="keypad-btn" onClick={handleBackspace} style={{ color: 'var(--text-grey)' }}>
              ⌫
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.5rem' }}>
            Hint: Late October celebration date.
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', textAlign: 'center', animation: 'fadeIn 0.8s ease-out' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-outfit)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            A Message <span style={{ color: 'var(--netflix-red)' }}>For You</span>
          </h2>
          
          <div className="love-letter-paper">
            <div className="love-letter-content">
              <h3 className="love-letter-heading">Dearest Muskan,</h3>
              <p style={{ textIndent: '2rem', marginBottom: '1.5rem' }}>
                Every single day spent with you has felt like an incredible episode of my absolute favorite series. We have shared so many seasons already—from the nervous smiles and initial coffee dates of our pilot episode, to the road trips, late-night chats, culinary achievements (and disasters!), and moving into our cozy shared space.
              </p>
              <p style={{ textIndent: '2rem', marginBottom: '1.5rem' }}>
                You are my comfort when I am tired, my partner in laughter, my critic in film reviews, and my biggest source of happiness. Thank you for being exactly who you are, for loving me, and for writing this beautiful story with me day after day.
              </p>
              <p style={{ textIndent: '2rem' }}>
                No matter how many seasons we film, I know the best is yet to come. I love you more than words, characters, or lines of code can describe.
              </p>
              <div className="love-letter-footer">
                <p>Always and forever yours,</p>
                <p style={{ color: 'var(--netflix-red-hover)', fontSize: '2.4rem', marginTop: '0.5rem' }}>Vatsal ❤️</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsUnlocked(false);
              setPasscode('');
            }}
            style={{
              marginTop: '2rem',
              background: 'transparent',
              border: '1px solid #444',
              color: 'var(--text-grey)',
              padding: '0.6rem 2rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--text-white)';
              e.currentTarget.style.color = 'var(--text-white)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#444';
              e.currentTarget.style.color = 'var(--text-grey)';
            }}
          >
            🔒 Lock Secret Message
          </button>
        </div>
      )}

      {/* Embedded Passcode Keypad Shake Animation Keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
