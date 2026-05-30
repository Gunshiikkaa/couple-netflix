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
      title: 'Season 3: Building Dreams',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      desc: 'An ongoing season packed with new career horizons, learning routines, and shared blueprints for the future.',
      progress: 90,
      matchRate: '99% Match',
      year: '2026',
      location: 'Everywhere',
      date: 'Ongoing'
    },
    {
      id: 'c2',
      title: 'Season 2: Moving In & Shared Keys',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
      desc: 'The complete season covering the huge step of packing boxes, assembling furniture, and creating a shared home.',
      progress: 100,
      matchRate: '99.8% Match',
      year: '2025',
      location: 'Our Apartment',
      date: 'July 2025'
    },
    {
      id: 'c3',
      title: 'Season 1: First Steps & Sparks',
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
      desc: 'The origin episodes. Nervous greetings, coffee meetups, road trips, and deciding to face the world together.',
      progress: 100,
      matchRate: '99.5% Match',
      year: '2023',
      location: 'City and Trails',
      date: 'Oct - Dec 2023'
    },
    {
      id: 'c4',
      title: 'Season 1.5: Travel & Adventures',
      img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
      desc: 'Exploring new cities, seeking quiet cafes, and documenting our journeys. The chapters where our bond grew deeper.',
      progress: 100,
      matchRate: '99.0% Match',
      year: '2024',
      location: 'Various Destinations',
      date: 'Jan - Dec 2024'
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
                title="Top 4 Hits in Hearts Today" 
                items={continueWatchingItems} 
                onCardClick={setSelectedMemory} 
                variant="top4"
              />

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
