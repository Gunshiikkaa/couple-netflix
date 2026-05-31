import React, { useState, useEffect, useRef } from 'react';

export default function CinematicEnding({ memories, onPlayThemeSong }) {
  const [confetti, setConfetti] = useState([]);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer to trigger animate-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Get first 6 memories
  const activeCollage = memories && memories.length >= 6 
    ? memories.slice(0, 6) 
    : (memories || []).slice(0, 6);

  // Generate background ember/spark list on mount
  useEffect(() => {
    generateConfetti(30, true);
  }, []);

  const generateConfetti = (count, isEmberBackground = false) => {
    const pieces = [];
    const colors = [
      '#e50914', // Netflix Red
      '#ff4d55', // Soft Red
      '#b20710', // Deep Red
      '#f59e0b', // Warm Gold
      '#fcd34d', // Soft Gold
      '#ffffff', // White
    ];

    for (let i = 0; i < count; i++) {
      pieces.push({
        id: i + (isEmberBackground ? 1000 : Date.now() + Math.random()),
        left: Math.random() * 100,
        top: isEmberBackground ? -10 - Math.random() * 20 : -10,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * (isEmberBackground ? 8 : 0.5),
        speed: 3 + Math.random() * 4, // seconds
        rotation: Math.random() * 360,
      });
    }

    if (isEmberBackground) {
      setConfetti((prev) => [...prev, ...pieces]);
    } else {
      setConfetti((prev) => [...prev.filter((p) => p.id >= 1000), ...pieces]);
    }
  };

  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const now = audioCtx.currentTime;
      
      const chimeGain = audioCtx.createGain();
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.connect(audioCtx.destination);

      // arpeggio notes in C major key (soothing & bright): C4, E4, G4, C5
      const notes = [261.63, 329.63, 392.00, 523.25];
      
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.15;
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        oscGain.gain.setValueAtTime(0, time);
        oscGain.gain.linearRampToValueAtTime(0.15, time + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.0);
        
        osc.connect(oscGain);
        oscGain.connect(chimeGain);
        
        osc.start(time);
        osc.stop(time + 1.2);
      });

      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.8, now + 0.15);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  const handleCelebrate = () => {
    setCelebrationActive(true);
    generateConfetti(50, false);
    playChime();

    setTimeout(() => {
      setCelebrationActive(false);
    }, 4500);
  };

  return (
    <section 
      ref={sectionRef}
      className="cinematic-ending-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0c0c0c',
        overflow: 'hidden',
        zIndex: 10,
        userSelect: 'none',
        padding: '3rem 4% 1.5rem',
        borderTop: '1px solid #1a1a1a',
        marginTop: '2rem'
      }}
    >
      {/* Volumetric Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(229, 9, 20, 0.04) 0%, rgba(0, 0, 0, 0) 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '50vh',
        backgroundColor: 'rgba(229, 9, 20, 0.02)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Confetti Sparks Container */}
      <div className="confetti-sparks-container" style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1
      }}>
        {confetti.map((spark) => (
          <div
            key={spark.id}
            style={{
              position: 'absolute',
              borderRadius: '2px',
              opacity: 0.6,
              left: `${spark.left}%`,
              top: `${spark.top}%`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              backgroundColor: spark.color,
              transform: `rotate(${spark.rotation}deg)`,
              animation: `fallDownSparks ${spark.speed}s linear infinite`,
              animationDelay: `${spark.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Scattered Polaroids for Large Screens */}
      <div className="scattered-collage-container" style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5
      }}>
        {/* Card 1: Top Left */}
        {activeCollage[0] && (
          <div
            className={`collage-card card-tl ${isVisible ? 'fade-in-tl' : ''}`}
            style={{
              position: 'absolute',
              left: '4%',
              top: '10%',
              backgroundColor: '#fff',
              padding: '0.65rem 0.65rem 1.5rem 0.65rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              borderRadius: '2px',
              width: '150px',
              display: 'flex',
              flexDirection: 'column',
              transform: 'rotate(-8deg)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)';
              e.currentTarget.style.zIndex = 30;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(-8deg) scale(1)';
              e.currentTarget.style.zIndex = 5;
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#222' }}>
              <img src={activeCollage[0].img} alt={activeCollage[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeCollage[0].title}
            </span>
          </div>
        )}

        {/* Card 2: Middle Left */}
        {activeCollage[1] && (
          <div
            className={`collage-card card-ml ${isVisible ? 'fade-in-ml' : ''}`}
            style={{
              position: 'absolute',
              left: '2%',
              bottom: '24%',
              backgroundColor: '#fff',
              padding: '0.65rem 0.65rem 1.5rem 0.65rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              borderRadius: '2px',
              width: '155px',
              display: 'flex',
              flexDirection: 'column',
              transform: 'rotate(10deg)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)';
              e.currentTarget.style.zIndex = 30;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(10deg) scale(1)';
              e.currentTarget.style.zIndex = 5;
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#222' }}>
              <img src={activeCollage[1].img} alt={activeCollage[1].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeCollage[1].title}
            </span>
          </div>
        )}

        {/* Card 3: Bottom Left */}
        {activeCollage[2] && (
          <div
            className={`collage-card card-bl ${isVisible ? 'fade-in-bl' : ''}`}
            style={{
              position: 'absolute',
              left: '14%',
              bottom: '5%',
              backgroundColor: '#fff',
              padding: '0.65rem 0.65rem 1.5rem 0.65rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              borderRadius: '2px',
              width: '150px',
              display: 'flex',
              flexDirection: 'column',
              transform: 'rotate(-4deg)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)';
              e.currentTarget.style.zIndex = 30;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(-4deg) scale(1)';
              e.currentTarget.style.zIndex = 5;
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#222' }}>
              <img src={activeCollage[2].img} alt={activeCollage[2].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeCollage[2].title}
            </span>
          </div>
        )}

        {/* Card 4: Top Right */}
        {activeCollage[3] && (
          <div
            className={`collage-card card-tr ${isVisible ? 'fade-in-tr' : ''}`}
            style={{
              position: 'absolute',
              right: '5%',
              top: '12%',
              backgroundColor: '#fff',
              padding: '0.65rem 0.65rem 1.5rem 0.65rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              borderRadius: '2px',
              width: '150px',
              display: 'flex',
              flexDirection: 'column',
              transform: 'rotate(8deg)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)';
              e.currentTarget.style.zIndex = 30;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(8deg) scale(1)';
              e.currentTarget.style.zIndex = 5;
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#222' }}>
              <img src={activeCollage[3].img} alt={activeCollage[3].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeCollage[3].title}
            </span>
          </div>
        )}

        {/* Card 5: Middle Right */}
        {activeCollage[4] && (
          <div
            className={`collage-card card-mr ${isVisible ? 'fade-in-mr' : ''}`}
            style={{
              position: 'absolute',
              right: '2%',
              bottom: '22%',
              backgroundColor: '#fff',
              padding: '0.65rem 0.65rem 1.5rem 0.65rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              borderRadius: '2px',
              width: '155px',
              display: 'flex',
              flexDirection: 'column',
              transform: 'rotate(-10deg)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)';
              e.currentTarget.style.zIndex = 30;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(-10deg) scale(1)';
              e.currentTarget.style.zIndex = 5;
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#222' }}>
              <img src={activeCollage[4].img} alt={activeCollage[4].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeCollage[4].title}
            </span>
          </div>
        )}

        {/* Card 6: Bottom Right */}
        {activeCollage[5] && (
          <div
            className={`collage-card card-br ${isVisible ? 'fade-in-br' : ''}`}
            style={{
              position: 'absolute',
              right: '12%',
              bottom: '5%',
              backgroundColor: '#fff',
              padding: '0.65rem 0.65rem 1.5rem 0.65rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
              borderRadius: '2px',
              width: '150px',
              display: 'flex',
              flexDirection: 'column',
              transform: 'rotate(6deg)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1.08)';
              e.currentTarget.style.zIndex = 30;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(6deg) scale(1)';
              e.currentTarget.style.zIndex = 5;
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#222' }}>
              <img src={activeCollage[5].img} alt={activeCollage[5].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              marginTop: '0.5rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {activeCollage[5].title}
            </span>
          </div>
        )}
      </div>

      {/* Main Center Card */}
      <div 
        className={`center-card-wrapper ${isVisible ? 'fade-in-center' : ''}`}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '650px',
          zIndex: 20,
          textAlign: 'center',
          margin: 'auto'
        }}
      >
        <div style={{
          position: 'relative',
          backgroundColor: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* Circular Red Heart Badge */}
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e50914, #ff3344)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '2px solid rgba(229, 9, 20, 0.3)',
            boxShadow: '0 8px 16px rgba(229, 9, 20, 0.3)'
          }}>
            {/* Heart SVG */}
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#000' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="pulse-ring" />
          </div>

          {/* Original Tribute Header */}
          <span style={{
            display: 'block',
            fontSize: '0.75rem',
            fontFamily: 'var(--mono)',
            fontWeight: 800,
            letterSpacing: '0.25em',
            color: 'var(--netflix-red)',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            A COUPLEFLIX ORIGINAL TRIBUTE
          </span>

          {/* Title Header */}
          <h2 style={{
            fontFamily: "'Cinzel', 'Georgia', serif",
            fontSize: '2rem',
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: '0.02em',
            color: '#fff',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            THANK YOU FOR BEING THE BEST PART OF MY <span style={{ color: 'var(--netflix-red)' }}>STORY</span>.
          </h2>

          {/* Quote Section */}
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: '#a3a3a3',
            fontStyle: 'italic',
            borderTop: '1px solid #222',
            paddingTop: '1.25rem',
            marginBottom: '1.5rem',
            maxWidth: '460px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            "In you, I've found the love of my life and my closest, truest partner. Every single episode with you is my absolute favorite."
          </p>

          {/* Action Button Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={handleCelebrate}
              style={{
                backgroundColor: 'var(--netflix-red)',
                color: '#fff',
                fontWeight: '800',
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.75rem 1.75rem',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--netflix-red-hover)';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--netflix-red)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Celebrate Us! 🥳
            </button>

            <button
              onClick={onPlayThemeSong || playChime}
              style={{
                backgroundColor: '#0c0c0c',
                color: '#ccc',
                fontWeight: '800',
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.75rem 1.75rem',
                border: '1px solid #333',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#555';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = '#ccc';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Play Theme Song 🎵
            </button>
          </div>
        </div>

        {/* Small Screens Collage Scroll */}
        <div className="mobile-collage-scroll" style={{ width: '100%', marginTop: '1.5rem' }}>
          <span style={{
            fontSize: '0.7rem',
            color: '#555',
            fontFamily: 'var(--mono)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            Moments Collage
          </span>
          <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            padding: '1rem 0',
            scrollbarWidth: 'none',
            justifyContent: 'flex-start',
            scrollSnapType: 'x mandatory'
          }}>
            {activeCollage.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  flexShrink: 0,
                  backgroundColor: '#white',
                  background: '#fff',
                  padding: '0.5rem 0.5rem 1rem 0.5rem',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                  borderRadius: '2px',
                  width: '110px',
                  display: 'flex',
                  flexDirection: 'column',
                  scrollSnapAlign: 'center',
                  transform: `rotate(${(idx % 2 === 0 ? -1.5 : 1.5)}deg)`
                }}
              >
                <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#222' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-caveat), cursive',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  textAlign: 'center',
                  marginTop: '0.35rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elegant Cinematic Registry details */}
      <div className="registry-footer" style={{
        width: '100%',
        textAlign: 'center',
        marginTop: '2.5rem',
        zIndex: 20
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--netflix-red)',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '0.75rem',
          fontFamily: "'Cinzel', 'Georgia', serif"
        }}>
          <span>CoupleFlix</span>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#a3a3a3', fontFamily: 'var(--mono)', letterSpacing: '0.1em', fontSize: '0.65rem' }}>Tribute Registry</span>
        </div>
        <p style={{
          color: '#555',
          fontSize: '0.75rem',
          marginTop: '0.5rem',
          lineHeight: '1.4'
        }}>
          A Lifetime of Memories. Streaming Since October 24, 2023.<br />
          All custom memories and selections are stored safely inside your browser.
        </p>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes fallDownSparks {
          0% { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg) translateX(30px); opacity: 0; }
        }

        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(229, 9, 20, 0.4);
          animation: heartPulse 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          pointer-events: none;
        }

        @keyframes heartPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        /* Animations for card entries */
        .collage-card {
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .fade-in-tl { opacity: 1; transform: translate(0, 0) rotate(-8deg) !important; }
        .fade-in-ml { opacity: 1; transform: translate(0, 0) rotate(10deg) !important; }
        .fade-in-bl { opacity: 1; transform: translate(0, 0) rotate(-4deg) !important; }
        .fade-in-tr { opacity: 1; transform: translate(0, 0) rotate(8deg) !important; }
        .fade-in-mr { opacity: 1; transform: translate(0, 0) rotate(-10deg) !important; }
        .fade-in-br { opacity: 1; transform: translate(0, 0) rotate(6deg) !important; }

        .center-card-wrapper {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) 0.3s;
        }

        .fade-in-center {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive displays */
        @media (max-width: 1024px) {
          .scattered-collage-container {
            display: none !important;
          }
          .cinematic-ending-section {
            min-height: auto !important;
            padding: 2rem 4% 1.5rem !important;
          }
        }

        @media (min-width: 1025px) {
          .mobile-collage-scroll {
            display: none !important;
          }
          .collage-card {
            /* Initial translate off-screen for animation */
            &.card-tl { transform: translate(-30px, -30px) rotate(-15deg); }
            &.card-ml { transform: translate(-30px, 0) rotate(18deg); }
            &.card-bl { transform: translate(-30px, 30px) rotate(-10deg); }
            &.card-tr { transform: translate(30px, -30px) rotate(15deg); }
            &.card-mr { transform: translate(30px, 0) rotate(-18deg); }
            &.card-br { transform: translate(30px, 30px) rotate(12deg); }
          }
        }
      `}</style>
    </section>
  );
}
