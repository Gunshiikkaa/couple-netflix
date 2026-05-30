import React, { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MemoryRow from './components/MemoryRow';
import Timeline from './components/Timeline';
import DatePlanner from './components/DatePlanner';
import MemoryVault from './components/MemoryVault';
import SecretLetter from './components/SecretLetter';
import './App.css';

// Audio Context reference variables
let audioCtx = null;
let musicTimer = null;
let currentChordIdx = 0;

export default function App() {
  const [activeProfile, setActiveProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [likedMemories, setLikedMemories] = useState({});
  const [isEditingSpotlight, setIsEditingSpotlight] = useState(false);
  const [spotlightTitle, setSpotlightTitle] = useState(() => 
    localStorage.getItem('spotlightTitle') || "THE MOMENT\nTHAT CHANGED\nEVERYTHING"
  );
  const [spotlightSubtitle, setSpotlightSubtitle] = useState(() => 
    localStorage.getItem('spotlightSubtitle') || "OUR FOREVER PROMISE"
  );
  const [spotlightText, setSpotlightText] = useState(() => 
    localStorage.getItem('spotlightText') || "It was a quiet Tuesday morning in October. I looked into your eyes for the first time, and in that split second, the weight of the entire universe shifted. I made a silent vow right then and there: to cherish you, support you, and love you more than life itself. Every single moment since that day has been my greatest honor."
  );
  const [spotlightQuote, setSpotlightQuote] = useState(() => 
    localStorage.getItem('spotlightQuote') || "You never know the value of a moment, until it becomes a memory that stays with you forever."
  );
  const [spotlightImage, setSpotlightImage] = useState(() => 
    localStorage.getItem('spotlightImage') || "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"
  );

  useEffect(() => {
    localStorage.setItem('spotlightTitle', spotlightTitle);
    localStorage.setItem('spotlightSubtitle', spotlightSubtitle);
    localStorage.setItem('spotlightText', spotlightText);
    localStorage.setItem('spotlightQuote', spotlightQuote);
    localStorage.setItem('spotlightImage', spotlightImage);
  }, [spotlightTitle, spotlightSubtitle, spotlightText, spotlightQuote, spotlightImage]);

  const [bucketList, setBucketList] = useState([
    { id: 'b1', title: 'Road trip to the coast', done: false },
    { id: 'b2', title: 'Couples cooking masterclass', done: false },
    { id: 'b3', title: 'Pitch blankets for midnight stargazing', done: true },
    { id: 'b4', title: 'Write a joint future bucket list', done: false }
  ]);

  // Ambient sound generator using Web Audio API
  const startAmbientMusic = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Soothing chord progression in C/F major:
      // 1. Cmaj7 (C3, E3, G3, B3)
      // 2. Am7 (A2, C3, E3, G3)
      // 3. Fmaj7 (F2, A2, C3, E3)
      // 4. G6 (G2, B2, D3, E3)
      const chords = [
        [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
        [110.00, 130.81, 164.81, 196.00], // A2, C3, E3, G3
        [87.31, 110.00, 130.81, 164.81],  // F2, A2, C3, E3
        [98.00, 123.47, 146.83, 164.81]   // G2, B2, D3, E3
      ];

      const playChord = () => {
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime;
        const notes = chords[currentChordIdx];
        currentChordIdx = (currentChordIdx + 1) % chords.length;

        // Soothing low-pass filter to soften high frequencies
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, now);

        notes.forEach((freq, index) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine'; // Pure warm tone
          osc.frequency.setValueAtTime(freq, now + index * 0.2); // Slightly arpeggiated entry

          // Sound envelope: slow swell and fade out
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.04, now + index * 0.2 + 0.5); // Warm fade-in
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8); // Long decay

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now + index * 0.2);
          osc.stop(now + 5.2);
        });
      };

      playChord();
      musicTimer = setInterval(playChord, 5200);

    } catch (err) {
      console.warn("Could not play ambient background audio", err);
    }
  };

  const stopAmbientMusic = () => {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  };

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      stopAmbientMusic();
      setIsMusicPlaying(false);
    } else {
      setIsMusicPlaying(true);
      // Wait for brief user interaction confirmation block resolution
      setTimeout(() => {
        startAmbientMusic();
      }, 50);
    }
  };

  // Turn off music if profile is unmounted/switched
  const handleSwitchProfile = () => {
    stopAmbientMusic();
    setIsMusicPlaying(false);
    setActiveProfile(null);
    setActiveTab('home');
  };

  const handleReaction = (memoryId, type) => {
    setLikedMemories(prev => ({
      ...prev,
      [memoryId]: prev[memoryId] === type ? null : type
    }));

    // Trigger custom particle effect inside modal
    if (type === 'love') {
      try {
        const rect = document.querySelector('.modal-image-wrapper').getBoundingClientRect();
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);

        for (let i = 0; i < 15; i++) {
          const heart = document.createElement('span');
          heart.innerHTML = '❤️';
          heart.style.position = 'absolute';
          heart.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 80}px`;
          heart.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 40}px`;
          heart.style.fontSize = `${Math.random() * 15 + 15}px`;
          heart.style.transition = 'all 1s ease-out';
          heart.style.opacity = '1';
          container.appendChild(heart);

          // Force reflow
          void heart.offsetHeight;

          heart.style.transform = `translate(${(Math.random() - 0.5) * 200}px, -${Math.random() * 150 + 100}px) scale(1.5)`;
          heart.style.opacity = '0';
        }

        setTimeout(() => container.remove(), 1200);
      } catch (err) {}
    }
  };

  const toggleBucketListItem = (itemId) => {
    setBucketList(prev => prev.map(item => 
      item.id === itemId ? { ...item, done: !item.done } : item
    ));
  };

  // Rows Catalog Data
  const continueWatchingItems = [
    {
      id: 'c1',
      title: 'LEARNING TO RIDE',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      desc: 'Holding onto the seat, running behind me, and letting go. That was the day I learned to fly.',
      matchRate: '99% Match',
      year: '2023',
      location: 'Park Lane',
      date: 'June 15, 2023',
      tags: 'Heartfelt • Inspiring • Original'
    },
    {
      id: 'c2',
      title: 'CAMPFIRE CHRONICLES',
      img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
      desc: 'Under a canopy of stars, listening to you spin tales of old adventures by the cracking fire.',
      matchRate: '98% Match',
      year: '2024',
      location: 'Forest Retreat',
      date: 'October 12, 2024',
      tags: 'Heartfelt • Inspiring • Original'
    },
    {
      id: 'c3',
      title: 'CATCHING THE FIRST FISH',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      desc: 'Patiently showing me how to cast. The look of pure pride on your face was bigger than the catch.',
      matchRate: '97% Match',
      year: '2024',
      location: 'Pine Lake',
      date: 'July 8, 2024',
      tags: 'Heartfelt • Inspiring • Original'
    },
    {
      id: 'c4',
      title: 'THE ART OF HONESTY',
      img: 'https://images.unsplash.com/photo-1533048347193-7b447a18f883?auto=format&fit=crop&w=600&q=80',
      desc: 'When you showed me that doing the right thing, even when no one is looking, defines your true character.',
      matchRate: '99.5% Match',
      year: '2025',
      location: 'Home',
      date: 'September 5, 2025',
      tags: 'Heartfelt • Inspiring • Original'
    }
  ];

  const trendingNowItems = [
    {
      id: 't1',
      title: 'The Sunset Café Visit',
      img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
      desc: 'Finding a quiet wooden cabin café in the mountain woods and watching the pine silhouettes in the sunset glow.',
      matchRate: '98% Match',
      year: '2024',
      location: 'Mountain Vista Café',
      date: 'May 12, 2024',
      tags: 'Heartfelt • Adventure • Original'
    },
    {
      id: 't2',
      title: 'Concert Under the Stars',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      desc: 'Dancing to our favorite indie band on the lawn back-row with bags of popcorn and starry skies.',
      matchRate: '96% Match',
      year: '2024',
      location: 'City Amphitheater',
      date: 'Aug 18, 2024',
      tags: 'Heartfelt • Music • Romantic'
    },
    {
      id: 't3',
      title: 'Beachside Afternoon Picnic',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      desc: 'Surprise cheese board and lemonade on the warm sand, defending our sandwiches from ambitious seagulls.',
      matchRate: '97% Match',
      year: '2024',
      location: 'Sandy Shores Beach',
      date: 'July 5, 2024',
      tags: 'Sweet • Cozy • Original'
    },
    {
      id: 't4',
      title: 'Anniversary Special Gala',
      img: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80',
      desc: 'Celebrating our anniversary with fancy formal clothes, gourmet menus, and making plans for seasons to come.',
      matchRate: '99.8% Perfect',
      year: '2025',
      location: 'The Glasshouse Bistro',
      date: 'Oct 24, 2025',
      tags: 'Fancy • Anniversary • Special'
    }
  ];


  if (!activeProfile) {
    return <IntroScreen onProfileSelect={setActiveProfile} />;
  }

  return (
    <div className="main-layout">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeProfile={activeProfile}
        onSwitchProfile={handleSwitchProfile}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
      />

      {/* Main Tab Routing */}
      <main style={{ flex: 1, paddingTop: activeTab === 'home' ? 0 : '70px' }}>
        {activeTab === 'home' && (
          <>
            <HeroBanner activeProfile={activeProfile} />
            
            <div className="rows-container">
              <MemoryRow 
                title="Memories" 
                subtitle="Click any card to read the full episode description and view reaction details."
                items={trendingNowItems} 
                onCardClick={setSelectedMemory} 
                variant="memories"
              />
              <MemoryRow 
                title="TOP 4 HITS IN HEARTS TODAY" 
                items={continueWatchingItems} 
                onCardClick={setSelectedMemory} 
                variant="top4"
              />

              {/* Featured Documentary Spotlight Section */}
              <div className="spotlight-section">
                {/* Left Side Image Card */}
                <div className="spotlight-image-wrapper">
                  <img src={spotlightImage} className="spotlight-image" alt="Featured spotlight" />
                  <div className="spotlight-badge">
                    <span className="spotlight-badge-dot"></span>
                    FEATURED MEMORY
                  </div>
                  <button className="spotlight-edit-btn" onClick={() => setIsEditingSpotlight(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
                    </svg>
                    CUSTOMIZE STORY
                  </button>
                </div>

                {/* Right Side Content */}
                <div className="spotlight-content">
                  <div className="spotlight-category-header">
                    <span style={{ color: 'var(--netflix-red)' }}>COUPLEFLIX</span> DOCUMENTARY SPOTLIGHT  |  <span>📅 EST. 2023</span>
                  </div>
                  <h2 className="spotlight-title-text">
                    {spotlightTitle.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </h2>
                  <div className="spotlight-subtitle-text">{spotlightSubtitle}</div>
                  <p className="spotlight-description">"{spotlightText}"</p>
                  <div className="spotlight-quote-box">
                    <p className="spotlight-quote">
                      "{spotlightQuote}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Interactive Row: Our List (Date Night Checklist) */}
              <div style={{ marginTop: '1rem' }}>
                <h2 className="memory-row-title">My List (Date Night Bucket List)</h2>
                <div style={{
                  backgroundColor: '#161616',
                  border: '1px solid #222',
                  borderRadius: '6px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  {bucketList.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleBucketListItem(item.id)}
                      style={{
                        padding: '1rem',
                        backgroundColor: item.done ? 'rgba(229, 9, 20, 0.05)' : '#222',
                        border: '1px solid',
                        borderColor: item.done ? 'var(--netflix-red)' : '#333',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.borderColor = 'var(--netflix-red)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = item.done ? 'var(--netflix-red)' : '#333';
                      }}
                    >
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: item.done ? '#a3a3a3' : '#fff',
                        textDecoration: item.done ? 'line-through' : 'none'
                      }}>
                        {item.title}
                      </span>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: '2px solid',
                        borderColor: item.done ? 'var(--netflix-red)' : '#777',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: item.done ? 'var(--netflix-red)' : 'transparent',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 900
                      }}>
                        {item.done && '✓'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'timeline' && <Timeline />}
        {activeTab === 'planner' && <DatePlanner />}
        {activeTab === 'vault' && <MemoryVault onCardClick={setSelectedMemory} />}
        {activeTab === 'letter' && <SecretLetter />}
      </main>

      {/* Global Memory Detail Modal Lightbox */}
      {selectedMemory && (
        <div className="modal-overlay" onClick={() => setSelectedMemory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedMemory(null)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="modal-image-wrapper">
              <img 
                src={selectedMemory.img} 
                className="modal-image" 
                alt={selectedMemory.title} 
              />
              <div className="modal-gradient"></div>
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '2rem',
                zIndex: 10
              }}>
                <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '0.25rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  {selectedMemory.title}
                </h2>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#ccc', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  <span>{selectedMemory.date}</span>
                  <span>•</span>
                  <span>{selectedMemory.location}</span>
                </div>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '1.5rem 2rem' }}>
              <div className="modal-main-info" style={{ flex: 2 }}>
                <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#e5e5e5' }}>
                  {selectedMemory.desc}
                </p>

                {/* Micro Interaction: Reactions */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    How much do you love this memory?
                  </span>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleReaction(selectedMemory.id, 'like')}
                      style={{
                        backgroundColor: likedMemories[selectedMemory.id] === 'like' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                        border: likedMemories[selectedMemory.id] === 'like' ? '1px solid #fff' : '1px solid #444',
                        color: likedMemories[selectedMemory.id] === 'like' ? '#fff' : '#ccc',
                        padding: '0.4rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                    >
                      👍 Liked
                    </button>
                    <button
                      onClick={() => handleReaction(selectedMemory.id, 'love')}
                      style={{
                        backgroundColor: likedMemories[selectedMemory.id] === 'love' ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.05)',
                        border: likedMemories[selectedMemory.id] === 'love' ? '1px solid var(--netflix-red)' : '1px solid #444',
                        color: likedMemories[selectedMemory.id] === 'love' ? 'var(--netflix-red)' : '#ccc',
                        padding: '0.4rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                    >
                      ❤️ Love It!
                    </button>
                    <button
                      onClick={() => handleReaction(selectedMemory.id, 'laugh')}
                      style={{
                        backgroundColor: likedMemories[selectedMemory.id] === 'laugh' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                        border: likedMemories[selectedMemory.id] === 'laugh' ? '1px solid var(--accent-amber)' : '1px solid #444',
                        color: likedMemories[selectedMemory.id] === 'laugh' ? 'var(--accent-amber)' : '#ccc',
                        padding: '0.4rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                    >
                      😂 Funny
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-side-info" style={{ flex: 1, paddingLeft: '1.5rem', borderLeft: '1px solid #333' }}>
                <div>
                  <div className="info-label">Category:</div>
                  <div className="info-value">{selectedMemory.category || 'Special Memory'}</div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <div className="info-label">Release Year:</div>
                  <div className="info-value">{selectedMemory.year}</div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <div className="info-label">Match Score:</div>
                  <div className="info-value" style={{ color: '#4ade80', fontWeight: 'bold' }}>
                    {selectedMemory.matchRate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize Spotlight Modal */}
      {isEditingSpotlight && (
        <div className="modal-overlay" onClick={() => setIsEditingSpotlight(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close-btn" onClick={() => setIsEditingSpotlight(false)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', textTransform: 'uppercase', color: '#fff' }}>
                Customize Featured Story
              </h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Title (Use Line Breaks if needed)</label>
                <textarea 
                  rows="3"
                  value={spotlightTitle} 
                  onChange={(e) => setSpotlightTitle(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Red Subtitle</label>
                <input 
                  type="text" 
                  value={spotlightSubtitle} 
                  onChange={(e) => setSpotlightSubtitle(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Story Description</label>
                <textarea 
                  rows="4"
                  value={spotlightText} 
                  onChange={(e) => setSpotlightText(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Bottom Quote</label>
                <input 
                  type="text" 
                  value={spotlightQuote} 
                  onChange={(e) => setSpotlightQuote(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Image URL</label>
                <input 
                  type="text" 
                  value={spotlightImage} 
                  onChange={(e) => setSpotlightImage(e.target.value)} 
                  style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setIsEditingSpotlight(false)}
                  style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsEditingSpotlight(false)}
                  style={{ padding: '0.6rem 1.25rem', background: 'var(--netflix-red)', border: 'none', color: '#fff', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Footer */}
      <footer style={{
        backgroundColor: '#0c0c0c',
        borderTop: '1px solid #222',
        padding: '3rem 4% 2rem',
        color: 'var(--text-grey)',
        fontSize: '0.8rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', listStyle: 'none' }}>
          <span>Terms of Romance</span>
          <span>Privacy & Hugs</span>
          <span>Date Policy</span>
          <span>Contact Vatsal</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p>© 2026 CoupleFlix Inc. Crafted with ❤️ for Muskan.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.5 }}>
            All characters and memories in this series are entirely real and cherished. Any similarity to other love stories is purely coincidental.
          </p>
        </div>
      </footer>
    </div>
  );
}
