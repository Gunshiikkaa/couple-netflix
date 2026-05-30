import React, { useState, useEffect } from 'react';

export default function HeroBanner({ activeProfile }) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Anniversary date setup: October 24, 2023 (Customizable)
  const anniversaryDate = new Date('2023-10-24');
  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const today = new Date();
    const diffTime = Math.abs(today - anniversaryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysTogether(diffDays);
  }, []);

  const slides = [
    {
      title: "The First Spark",
      desc: "Where it all began. A simple conversation that turned into late-night calls and nervous excitement.",
      img: "/couple_first_date.png",
      date: "October 2023"
    },
    {
      title: "First Date Magic",
      desc: "Nervous laughter, sharing a dessert we couldn't finish, and realizing this was something special.",
      img: "/couple_sunset_date.png",
      date: "November 2023"
    },
    {
      title: "Wanderlust Together",
      desc: "Getting lost in new cities, sharing a single pair of headphones, and making memory lanes across the map.",
      img: "/couple_road_trip.png",
      date: "May 2024"
    },
    {
      title: "Cozy Coffee & Rainy Afternoons",
      desc: "Finding comfort in the quietest moments, sharing books, and making the perfect blanket fort.",
      img: "/couple_campfire_night.png",
      date: "December 2024"
    },
    {
      title: "Stronger Every Day",
      desc: "Celebrating wins, cheering through challenges, and realizing that home isn't a place—it's a person.",
      img: "/couple_beach_picnic.png",
      date: "September 2025"
    },
    {
      title: "The Next Chapter",
      desc: "Looking forward to thousands of more sunsets, shared pizzas, inside jokes, and adventures together.",
      img: "/couple_anniversary_dinner.png",
      date: "Forever & Always"
    }
  ];

  // Slideshow autoplay effect
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
      <div className="hero-banner">
        {/* Background Looping Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/couple_sunset_date.png"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            opacity: 0.5
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-holding-hands-and-walking-in-a-field-3428-large.mp4" type="video/mp4" />
        </video>

        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          
          {/* Tribute Series Badge */}
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
            }}>N</span> TRIBUTE SERIES
          </div>

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
            The Greatest<br />
            Story<br />
            Ever Told: <span style={{ 
              color: '#e50914', 
              fontFamily: 'var(--font-outfit), sans-serif', 
              fontWeight: '900',
              textShadow: '0 0 15px rgba(229, 9, 20, 0.6)',
              letterSpacing: '-0.02em'
            }}>US</span>
          </h1>

          {/* Metadata Row */}
          <div className="hero-badge-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            <span className="hero-badge-match" style={{ color: '#4ade80', fontWeight: '700' }}>99% Match</span>
            <span style={{ color: '#fff', fontWeight: '500' }}>2026</span>
            <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1px 5px', fontSize: '0.7rem', borderRadius: '2.5px', color: '#fff', fontWeight: '700' }}>U/A 16+</span>
            <span style={{ color: '#fff', fontWeight: '500' }}>2 Seasons</span>
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
            An emotional, biographical documentary celebrating the shared adventures, late-night talks, and inside jokes of the ultimate dream team. Now streaming in each other's hearts forever.
          </p>
          
          {/* Action Buttons */}
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-play" onClick={() => { setShowSlideshow(true); setCurrentSlide(0); }} style={{
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
              {/* Play SVG Icon */}
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
              {/* Info SVG Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              More Info
            </button>
          </div>
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
                src="/couple_anniversary_dinner.png" 
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

      {/* Slideshow Player Overlay */}
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
    </>
  );
}
