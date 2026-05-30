import React, { useState, useEffect } from 'react';

export default function HeroBanner({ activeProfile }) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Anniversary date setup: October 24, 2023 (Customizable)
  const anniversaryDate = new Date('2023-10-24');
  const [daysTogether, setDaysTogether] = useState(0);

  // Slideshow States for Billboard
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const today = new Date();
    const diffTime = Math.abs(today - anniversaryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysTogether(diffDays);
  }, []);

  const slides = [
    {
      id: "slide-main",
      title: "The Greatest Story Ever Told: US",
      desc: "An emotional, biographical documentary celebrating the shared adventures, late-night talks, and inside jokes of the ultimate dream team. Now streaming in each other's hearts forever.",
      img: "/couple_cafe_selfie.png",
      date: "Forever & Always",
      subtitle: "👔 FEATURED DOCUMENTARY",
      matchRate: "99% Match",
      year: "2026",
      seasons: "2 Seasons",
      tags: "Romantic • Feel-Good • Slice of Life",
      isVideo: true,
      objectPosition: "center 50%"
    },
    {
      id: "slide-cafe",
      title: "First Date Magic",
      desc: "Nervous laughter, sharing a dessert we couldn't finish, and realizing this was something special in a cozy café.",
      img: "/couple_cafe_selfie.png",
      date: "November 2023",
      subtitle: "☕ ROMANCE SPECIAL",
      matchRate: "99% Match",
      year: "2023",
      seasons: "Episode 2",
      tags: "Sweet • Cozy • Romantic",
      objectPosition: "center 50%"
    },
    {
      id: "slide-sandcastle",
      title: "Building Dreams",
      desc: "Underneath the warm sun, shaping castles in the sand and designing our next adventures together.",
      img: "/couple_sandcastle.png",
      date: "May 2024",
      subtitle: "🏝️ BEACH ESCAPE",
      matchRate: "98% Match",
      year: "2024",
      seasons: "Special Episode",
      tags: "Warm • Creative • Feel-Good",
      objectPosition: "center 50%"
    },
    {
      id: "slide-beach-lift",
      title: "Beachside Romance",
      desc: "Running into the surf, holding each other close, and letting the ocean breeze carry our laughter away.",
      img: "/couple_beach_lift.png",
      date: "September 2025",
      subtitle: "🌊 SLICE OF LIFE",
      matchRate: "99.2% Match",
      year: "2025",
      seasons: "Season 2 Finale",
      tags: "Romantic • Inspiring • Original",
      objectPosition: "center 50%"
    }
  ];

  // Silky Smooth Custom Real-time Slider Timer with Hover Pause
  const slideDuration = 9000; // 9 seconds per slide for relaxed reading
  useEffect(() => {
    let startTime = Date.now() - (progress / 100) * slideDuration;
    let animFrame;

    const tick = () => {
      if (isHovered) {
        // Freeze timer progress bar while hovered
        startTime = Date.now() - (progress / 100) * slideDuration;
        animFrame = requestAnimationFrame(tick);
        return;
      }
      
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / slideDuration) * 100, 100);
      setProgress(pct);

      if (elapsed >= slideDuration) {
        setActiveSlideIndex((prev) => (prev + 1) % slides.length);
        setProgress(0);
        startTime = Date.now();
      }
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [activeSlideIndex, isHovered]);

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  // Full screen slideshow player autoplay
  useEffect(() => {
    let timer;
    if (showSlideshow && isAutoplay) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [showSlideshow, isAutoplay]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      <div 
        className="hero-banner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Layers (Cross-fading Videos & Images) */}
        {slides.map((slide, idx) => {
          if (slide.isVideo) {
            return (
              <video 
                key={slide.id}
                autoPlay 
                loop 
                muted={isMuted}
                playsInline 
                poster={slide.img}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: slide.objectPosition || 'center 15%',
                  zIndex: 1,
                  opacity: idx === activeSlideIndex ? 0.55 : 0,
                  transition: 'opacity 1.2s ease-in-out',
                  pointerEvents: 'none'
                }}
              >
                <source src="/couple_video.mp4" type="video/mp4" />
              </video>
            );
          }
          return (
            <img 
              key={slide.id}
              src={slide.img} 
              alt={slide.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: slide.objectPosition || 'center 15%',
                zIndex: 1,
                opacity: idx === activeSlideIndex ? 0.55 : 0,
                transition: 'opacity 1.2s ease-in-out',
                pointerEvents: 'none'
              }}
            />
          );
        })}

        {/* Arrow Controls (fade in on banner hover) */}
        <button 
          onClick={handlePrev}
          className="hero-arrow-btn hero-arrow-left"
          aria-label="Previous Slide"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button 
          onClick={handleNext}
          className="hero-arrow-btn hero-arrow-right"
          aria-label="Next Slide"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Content Container (Key-based to trigger entrance animation on slide shift) */}
        <div 
          key={activeSlideIndex}
          className="hero-content hero-animate-text" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          {/* Featured Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '1rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.25em', 
            fontSize: '0.8rem', 
            fontWeight: '800', 
            color: '#e50914' 
          }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#e50914', 
              color: '#000', 
              borderRadius: '2px', 
              fontSize: '0.85rem', 
              fontWeight: '900',
              fontFamily: 'var(--font-outfit)',
              letterSpacing: 'normal',
              marginRight: '2px'
            }}>N</span> {slides[activeSlideIndex].subtitle}
          </div>

          {/* Slide Title */}
          <h1 className="hero-title" style={{ 
            fontFamily: "'Cinzel', 'Georgia', serif", 
            fontSize: '3.6rem', 
            lineHeight: '1.05', 
            fontWeight: '400',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            textAlign: 'left',
            letterSpacing: '0.02em',
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
          }}>
            {slides[activeSlideIndex].id === "slide-main" ? (
              <>
                The Greatest<br />
                Story<br />
                Ever Told: <span style={{ 
                  color: '#e50914', 
                  fontFamily: 'var(--font-outfit), sans-serif', 
                  fontWeight: '900',
                  textShadow: '0 0 15px rgba(229, 9, 20, 0.6)',
                  letterSpacing: '-0.02em'
                }}>US</span>
              </>
            ) : (
              slides[activeSlideIndex].title
            )}
          </h1>

          {/* Metadata Row */}
          <div className="hero-badge-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            <span className="hero-badge-match" style={{ color: '#4ade80', fontWeight: '700' }}>{slides[activeSlideIndex].matchRate}</span>
            <span style={{ color: '#fff', fontWeight: '500' }}>{slides[activeSlideIndex].year}</span>
            <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1px 5px', fontSize: '0.7rem', borderRadius: '2.5px', color: '#fff', fontWeight: '700' }}>U/A 16+</span>
            <span style={{ color: '#fff', fontWeight: '500' }}>{slides[activeSlideIndex].seasons}</span>
            <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1px 5px', fontSize: '0.7rem', borderRadius: '2.5px', color: '#fff', fontWeight: '700', textTransform: 'uppercase' }}>ultra HD 4K</span>
            <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1px 5px', fontSize: '0.7rem', borderRadius: '2.5px', color: '#fff', fontWeight: '700', textTransform: 'uppercase' }}>HDR</span>
          </div>
          
          {/* Description */}
          <p className="hero-desc" style={{ 
            fontSize: '1rem', 
            lineHeight: '1.5', 
            color: '#d4d4d4', 
            marginBottom: '2rem', 
            maxWidth: '550px',
            textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
          }}>
            {slides[activeSlideIndex].desc}
          </p>
          
          {/* Action Buttons */}
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-play" onClick={() => { setShowSlideshow(true); setCurrentSlide(activeSlideIndex); }} style={{
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: '700',
              padding: '0.65rem 1.8rem',
              fontSize: '1rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play Memories
            </button>
            
            <button className="hero-btn hero-btn-info" onClick={() => setShowInfoModal(true)} style={{
              backgroundColor: 'rgba(109, 109, 110, 0.7)',
              color: '#fff',
              fontWeight: '700',
              padding: '0.65rem 1.8rem',
              fontSize: '1rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              More Info
            </button>
          </div>
        </div>

        {/* Volume & Age Rating Info Ribbon */}
        <div className="hero-right-meta-tag">
          <button 
            className="hero-volume-btn" 
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute background video" : "Mute background video"}
          >
            {isMuted ? (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 2.76-2.24 5-5 5v2c3.87 0 7-3.13 7-7s-3.13-7-7-7v2c2.76 0 5 2.24 5 5zm-15-2v4h4l5 5V5L9 10H4z"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
          <div className="hero-age-rating">
            U/A 16+
          </div>
        </div>

        {/* Indicator Progress bars */}
        <div className="hero-indicators-container">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className="hero-indicator-bar-wrapper"
              onClick={() => {
                setActiveSlideIndex(idx);
                setProgress(0);
              }}
            >
              <div 
                className="hero-indicator-bar-fill"
                style={{
                  width: idx === activeSlideIndex ? `${progress}%` : idx < activeSlideIndex ? '100%' : '0%',
                  transition: idx === activeSlideIndex ? 'none' : 'width 0.3s ease'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowInfoModal(false)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="modal-image-wrapper">
              <img 
                src="/couple_beach_lift.png" 
                className="modal-image" 
                alt="Love Story info cover" 
              />
              <div className="modal-gradient"></div>
              <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                zIndex: 10
              }}>
                <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Our Love Story</h2>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#a3a3a3' }}>
                  <span>Anniversary: Oct 24, 2023</span>
                  <span>•</span>
                  <span className="text-netflix-red">{daysTogether} Days Together</span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-main-info">
                <p style={{ fontSize: '1.05rem', lineHeight: '1.5', color: '#e5e5e5' }}>
                  This award-winning love saga recounts the magical, continuous adventure of two hearts. From initial text exchanges to joint road trips, culinary experiments, cozy couch movies, and future blueprints. An ongoing story filled with warmth, inside jokes, and unwavering support.
                </p>
                
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>Series Statistics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '0.75rem' }}>
                    <div style={{ background: '#222', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--netflix-red)' }}>{daysTogether}</div>
                      <div style={{ fontSize: '0.8rem', color: '#a3a3a3', textTransform: 'uppercase', marginTop: '0.25rem' }}>Days of Spark</div>
                    </div>
                    <div style={{ background: '#222', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-amber)' }}>99.8%</div>
                      <div style={{ fontSize: '0.8rem', color: '#a3a3a3', textTransform: 'uppercase', marginTop: '0.25rem' }}>Compatibility Score</div>
                    </div>
                    <div style={{ background: '#222', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>42+</div>
                      <div style={{ fontSize: '0.8rem', color: '#a3a3a3', textTransform: 'uppercase', marginTop: '0.25rem' }}>Dates Completed</div>
                    </div>
                    <div style={{ background: '#222', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>&infin;</div>
                      <div style={{ fontSize: '0.8rem', color: '#a3a3a3', textTransform: 'uppercase', marginTop: '0.25rem' }}>Inside Jokes</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-side-info">
                <div>
                  <div className="info-label">Starring:</div>
                  <div className="info-value">Vatsal, Muskan</div>
                </div>
                <div>
                  <div className="info-label">Genres:</div>
                  <div className="info-value">Romantic Comedy, Feel-Good, Slice of Life, Travel Adventure</div>
                </div>
                <div>
                  <div className="info-label">This Show is:</div>
                  <div className="info-value">Heartwarming, Emotional, Romantic, Cozy</div>
                </div>
                <div>
                  <div className="info-label">Current Phase:</div>
                  <div className="info-value">Season 3 (Building Dreams)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Immersive Slideshow Player Overlay */}
      {showSlideshow && (
        <div className="slideshow-viewer">
          <div className="slideshow-header">
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              PLAYING: MEMORY REEL
            </span>
            <button className="slideshow-close-btn" onClick={() => setShowSlideshow(false)}>
              ✕ CLOSE PLAYER
            </button>
          </div>

          <div className="slideshow-track">
            {slides.map((slide, idx) => (
              idx === currentSlide && (
                <div key={idx} className="slideshow-slide">
                  <img src={slide.img} className="slideshow-image" alt={slide.title} />
                  
                  <div className="slideshow-info">
                    <div style={{
                      color: 'var(--accent-amber)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase'
                    }}>
                      {slide.date}
                    </div>
                    <h2 className="slideshow-title">{slide.title}</h2>
                    <p className="slideshow-desc">{slide.desc}</p>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="slideshow-controls">
            <button className="slideshow-control-btn" onClick={handlePrevSlide}>
              ◀ PREV
            </button>
            <button 
              className="slideshow-control-btn" 
              onClick={() => setIsAutoplay(!isAutoplay)}
              style={{
                borderColor: isAutoplay ? 'var(--netflix-red)' : 'rgba(255,255,255,0.2)',
                backgroundColor: isAutoplay ? 'rgba(229, 9, 20, 0.1)' : 'transparent'
              }}
            >
              {isAutoplay ? "⏸ PAUSE AUTOPLAY" : "▶ RESUME AUTOPLAY"}
            </button>
            <button className="slideshow-control-btn" onClick={handleNextSlide}>
              NEXT ▶
            </button>
          </div>

          {/* Top Progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--netflix-red)',
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      )}

      {/* Embedded Banner CSS Stylesheets */}
      <style>{`
        .hero-banner {
          position: relative;
          height: 85vh;
          min-height: 700px;
          width: 100%;
          display: flex;
          align-items: flex-end;
          padding: 0 4% 150px;
          overflow: hidden;
          background-color: #000;
        }

        /* Gradient overlays */
        .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 100%),
                      linear-gradient(to top, var(--bg-black) 0%, transparent 35%);
          z-index: 5;
          pointer-events: none;
        }

        /* Side navigation arrows */
        .hero-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) scale(0.9);
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 15;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          backdrop-filter: blur(8px);
        }

        .hero-arrow-left { left: 1.5%; }
        .hero-arrow-right { right: 1.5%; }

        .hero-banner:hover .hero-arrow-btn {
          opacity: 0.8;
          transform: translateY(-50%) scale(1);
        }

        .hero-arrow-btn:hover {
          background: rgba(229, 9, 20, 0.8) !important;
          border-color: var(--netflix-red);
          transform: translateY(-50%) scale(1.1) !important;
          box-shadow: 0 0 15px rgba(229, 9, 20, 0.4);
        }

        /* Indicators container */
        .hero-indicators-container {
          position: absolute;
          right: 4%;
          bottom: 150px;
          display: flex;
          gap: 6px;
          z-index: 15;
        }

        .hero-indicator-bar-wrapper {
          width: 32px;
          height: 3px;
          background: rgba(255, 255, 255, 0.25);
          cursor: pointer;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
          transition: background 0.2s;
        }

        .hero-indicator-bar-wrapper:hover {
          background: rgba(255, 255, 255, 0.55);
        }

        .hero-indicator-bar-fill {
          height: 100%;
          background: #fff;
          width: 0;
          box-shadow: 0 0 4px #fff;
        }

        /* Ribbon panel */
        .hero-right-meta-tag {
          position: absolute;
          right: 0;
          bottom: 185px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 15;
        }

        .hero-volume-btn {
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(0, 0, 0, 0.45);
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }

        .hero-volume-btn:hover {
          border-color: #fff;
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.08);
        }

        .hero-age-rating {
          background: rgba(51, 51, 51, 0.6);
          border-left: 3px solid #d4d4d4;
          padding: 0.35rem 2.5rem 0.35rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          backdrop-filter: blur(4px);
          letter-spacing: 0.05em;
        }

        /* Animations */
        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-animate-text {
          animation: slideUpFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </>
  );
}
