import React, { useState, useEffect, useRef } from 'react';
import IntroScreen from './components/IntroScreen';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MemoryRow from './components/MemoryRow';
import Timeline from './components/Timeline';
import DatePlanner from './components/DatePlanner';
import MemoryVault from './components/MemoryVault';
import SecretLetter from './components/SecretLetter';
import GalleryWall from './components/GalleryWall';
import CinematicEnding from './components/CinematicEnding';
import './App.css';

// Database of relationship milestone tracks
const TRACKS = [
  {
    id: 's1',
    title: 'Tum Se Hi',
    artist: 'Pritam, Mohit Chauhan',
    album: 'Jab We Met',
    year: '2007',
    youtubeId: 'Cb6wuzOurPc',
    img: '/couple_portrait_1.png',
    desc: 'Holding onto the seat, running behind me, and letting go. That was the day I learned to fly.',
    matchRate: '99% Match',
    tags: 'Sweet • Nostalgic • Romantic',
    memoryId: 'c1',
    duration: 323
  },
  {
    id: 's2',
    title: 'Subhanallah',
    artist: 'Pritam, Sreerama Chandra',
    album: 'Yeh Jawaani Hai Deewani',
    year: '2013',
    youtubeId: 'QYO6AlxiRE4',
    img: '/couple_portrait_2.png',
    desc: 'Under a canopy of stars, listening to you spin tales of old adventures by the cracking fire.',
    matchRate: '98% Match',
    tags: 'Warm • Magic • Romantic',
    memoryId: 'c2',
    duration: 249
  },
  {
    id: 's3',
    title: 'Raabta',
    artist: 'Pritam, Arijit Singh',
    album: 'Agent Vinod',
    year: '2012',
    youtubeId: 'zlt38OOqwDc',
    img: '/couple_portrait_3.png',
    desc: 'Patiently showing me how to cast. The look of pure pride on your face was bigger than the catch.',
    matchRate: '97% Match',
    tags: 'Calm • Soulful • Tender',
    memoryId: 'c3',
    duration: 243
  },
  {
    id: 's4',
    title: 'Tujh Mein Rab Dikhta Hai',
    artist: 'Salim-Sulaiman, Roop Kumar Rathod',
    album: 'Rab Ne Bana Di Jodi',
    year: '2008',
    youtubeId: 'qoq8B8ThgEM',
    img: '/couple_portrait_4.png',
    desc: 'When you showed me that doing the right thing, even when no one is looking, defines your true character.',
    matchRate: '99.5% Match',
    tags: 'Divine • Pure • Romantic',
    memoryId: 'c4',
    duration: 282
  },
  {
    id: 's5',
    title: 'Saibo',
    artist: 'Sachin-Jigar, Tochi Raina, Shreya Ghoshal',
    album: 'Shor in the City',
    year: '2011',
    youtubeId: '9Bmh6vaQt0s',
    img: '/couple_portrait_5.png',
    desc: 'Finding a quiet wooden cabin café in the mountain woods and watching the pine silhouettes in the sunset glow.',
    matchRate: '98% Match',
    tags: 'Cozy • Acoustic • Heartfelt',
    memoryId: 't1',
    duration: 196
  },
  {
    id: 's6',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh',
    album: 'Brahmāstra',
    year: '2022',
    youtubeId: 'BddP6PYo2gs',
    img: '/couple_portrait_6.png',
    desc: 'Dancing to our favorite indie band on the lawn back-row with bags of popcorn and starry skies.',
    matchRate: '96% Match',
    tags: 'Vibrant • Passionate • Anthem',
    memoryId: 't2',
    duration: 268
  },
  {
    id: 's7',
    title: 'Pehla Nasha',
    artist: 'Jatin-Lalit, Udit Narayan',
    album: 'Jo Jeeta Wohi Sikandar',
    year: '1992',
    youtubeId: 'ODu7OyAqK-Q',
    img: '/couple_portrait_7.png',
    desc: 'Surprise cheese board and lemonade on the warm sand, defending our sandwiches from ambitious seagulls.',
    matchRate: '97% Match',
    tags: 'Classic • First Love • Dreamy',
    memoryId: 't3',
    duration: 291
  },
  {
    id: 's8',
    title: 'Agar Tum Saath Ho',
    artist: 'A.R. Rahman, Arijit Singh, Alka Yagnik',
    album: 'Tamasha',
    year: '2015',
    youtubeId: 'sK7riqg2mr4',
    img: '/couple_portrait_8.png',
    desc: 'Celebrating our anniversary with fancy formal clothes, gourmet menus, and making plans for seasons to come.',
    matchRate: '99.8% Perfect',
    tags: 'Intense • Emotional • Masterpiece',
    memoryId: 't4',
    duration: 341
  }
];


// Helper to format seconds as m:ss
const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function App() {
  const [activeProfile, setActiveProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Custom Music Player States & Refs
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playerType, setPlayerType] = useState('none'); // 'youtube' | 'local' | 'none'
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0.7);

  const audioRef = useRef(null);
  const youtubeRef = useRef(null);

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
    localStorage.getItem('spotlightImage_v2') || "/couple_portrait_9.png"
  );

  const [galleryCards, setGalleryCards] = useState(() => {
    const saved = localStorage.getItem('galleryCards_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'g1',
        style: 'polaroid',
        title: "Summer of '24",
        date: "2024",
        desc: "A vintage snapshot of us before life became busy, full of energy and big dreams.",
        img: "/couple_portrait_10.png"
      },
      {
        id: 'g2',
        style: 'cinematic',
        title: "FIRST CHRISTMAS TOGETHER",
        date: "2023",
        desc: "Holding hands in front of the giant pine tree, shielding each other from the winter breeze.",
        img: "/couple_portrait_11.png"
      },
      {
        id: 'g3',
        style: 'polaroid',
        title: "Fixing the Apartment",
        date: "2025",
        desc: "Paint-stained hands, assembly blueprints, and that wide, proud smile after our first sofa was built.",
        img: "/couple_portrait_12.png"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('spotlightTitle', spotlightTitle);
    localStorage.setItem('spotlightSubtitle', spotlightSubtitle);
    localStorage.setItem('spotlightText', spotlightText);
    localStorage.setItem('spotlightQuote', spotlightQuote);
    localStorage.setItem('spotlightImage_v2', spotlightImage);
  }, [spotlightTitle, spotlightSubtitle, spotlightText, spotlightQuote, spotlightImage]);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [selectedMemory]);

  useEffect(() => {
    localStorage.setItem('galleryCards_v2', JSON.stringify(galleryCards));
  }, [galleryCards]);

  const handleAddGalleryCard = (newCard) => {
    setGalleryCards(prev => [newCard, ...prev]);
  };

  const [bucketList, setBucketList] = useState([
    { id: 'b1', title: 'Road trip to the coast', done: false },
    { id: 'b2', title: 'Couples cooking masterclass', done: false },
    { id: 'b3', title: 'Pitch blankets for midnight stargazing', done: true },
    { id: 'b4', title: 'Write a joint future bucket list', done: false }
  ]);

  // Tick timer hook for YouTube player background simulation
  useEffect(() => {
    let interval = null;
    if (isPlayingAudio && playerType === 'youtube' && currentTrack) {
      interval = setInterval(() => {
        setAudioTime(prevTime => {
          if (prevTime >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, playerType, currentTrack]);

  const playTrack = (track) => {
    // Stop local audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setPlayerType('youtube');
    setCurrentTrack(track);
    setAudioTime(0);
    setAudioDuration(track.duration);
    setYoutubeVideoId(track.youtubeId);
    setIsPlayingAudio(true);
    setIsMusicPlaying(true);
  };

  const handleSelectTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      handlePlayPause();
    } else {
      playTrack(track);
    }
  };

  const handlePlayPause = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      setIsMusicPlaying(false);
      if (playerType === 'youtube') {
        youtubeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo' }),
          '*'
        );
      } else if (playerType === 'local') {
        audioRef.current?.pause();
      }
    } else {
      if (playerType === 'none') {
        playTrack(TRACKS[0]);
      } else {
        setIsPlayingAudio(true);
        setIsMusicPlaying(true);
        if (playerType === 'youtube') {
          youtubeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo' }),
            '*'
          );
        } else if (playerType === 'local') {
          audioRef.current?.play();
        }
      }
    }
  };

  const handleStopAudio = () => {
    setIsPlayingAudio(false);
    setIsMusicPlaying(false);
    setPlayerType('none');
    setCurrentTrack(null);
    setYoutubeVideoId('');
    setAudioTime(0);
    setAudioDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  const handleNextTrack = () => {
    if (playerType === 'local') {
      playTrack(TRACKS[0]);
      return;
    }
    if (!currentTrack) return;
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % TRACKS.length;
    playTrack(TRACKS[nextIdx]);
  };

  const handlePrevTrack = () => {
    if (playerType === 'local') {
      playTrack(TRACKS[TRACKS.length - 1]);
      return;
    }
    if (!currentTrack) return;
    const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + TRACKS.length) % TRACKS.length;
    playTrack(TRACKS[prevIdx]);
  };

  const handleVolumeChange = (val) => {
    setAudioVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (playerType === 'youtube') {
      youtubeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [val * 100] }),
        '*'
      );
    }
  };

  const handleSeek = (newTime) => {
    setAudioTime(newTime);
    if (playerType === 'youtube') {
      youtubeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [newTime, true] }),
        '*'
      );
    } else if (playerType === 'local') {
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const playThemeSong = () => {
    if (youtubeRef.current) {
      youtubeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo' }),
        '*'
      );
    }
    
    setPlayerType('local');
    setYoutubeVideoId('');
    setCurrentTrack({
      id: 'theme',
      title: 'Our Theme Song',
      artist: 'Vatsal & Muskan',
      album: 'Forever',
      year: '2026',
      img: '/couple_portrait_9.png',
      duration: 250
    });
    setAudioTime(0);
    setIsPlayingAudio(true);
    setIsMusicPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = '/theme_song.mp3';
      audioRef.current.volume = audioVolume;
      audioRef.current.play()
        .catch(err => console.warn("Failed to play local theme song:", err));
    }
  };

  const handleToggleMusic = () => {
    handlePlayPause();
  };

  const handleSwitchProfile = () => {
    handleStopAudio();
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
      img: '/couple_portrait_1.png',
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
      img: '/couple_portrait_2.png',
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
      img: '/couple_portrait_3.png',
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
      img: '/couple_portrait_4.png',
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
      img: '/couple_portrait_5.png',
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
      img: '/couple_portrait_6.png',
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
      img: '/couple_portrait_7.png',
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
      img: '/couple_portrait_8.png',
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
        currentTrack={currentTrack}
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

              {/* Soundtracks of Our Love Row */}
              <div style={{ margin: '2rem 0' }}>
                <h2 className="memory-row-title" style={{ marginBottom: '0.5rem' }}>SOUNDTRACKS OF OUR LOVE</h2>
                <span style={{ fontSize: '0.82rem', color: '#808080', display: 'block', marginBottom: '1.25rem' }}>
                  Listen to the background score of our favorite moments.
                </span>
                
                <div style={{ position: 'relative' }}>
                  <div className="memory-row-scroll" style={{ scrollbarWidth: 'none', display: 'flex', gap: '1.25rem', overflowX: 'auto', padding: '10px 0' }}>
                    {TRACKS.map((track) => {
                      const isCurrent = currentTrack && currentTrack.id === track.id;
                      const isPlayingThis = isCurrent && isPlayingAudio;
                      return (
                        <div 
                          key={track.id}
                          onClick={() => handleSelectTrack(track)}
                          className={`track-card ${isCurrent ? 'active-track' : ''}`}
                          style={{
                            flex: '0 0 auto',
                            width: '180px',
                            backgroundColor: '#181818',
                            borderRadius: '8px',
                            border: isCurrent ? '1.5px solid var(--netflix-red)' : '1px solid #282828',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative'
                          }}
                        >
                          <div style={{ position: 'relative', aspectRatio: '1/1', width: '100%', overflow: 'hidden' }}>
                            <img 
                              src={track.img} 
                              alt="" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="track-card-overlay" style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(0,0,0,0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: isCurrent ? 1 : 0,
                              transition: 'opacity 0.2s ease'
                            }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--netflix-red)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                              }}>
                                {isPlayingThis ? (
                                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                                  </svg>
                                ) : (
                                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '2px' }}>
                                    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: isCurrent ? 'var(--netflix-red)' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {track.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#a3a3a3', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {track.artist}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.1)', padding: '1px 5px', borderRadius: '3px' }}>
                                {track.year}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#888' }}>
                                {formatTime(track.duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

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

              {/* Memories Gallery Wall Section */}
              <GalleryWall 
                cards={galleryCards}
                onAddCard={handleAddGalleryCard}
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

            {/* Cinematic Ending Section */}
            <CinematicEnding 
              memories={[...trendingNowItems, ...continueWatchingItems]} 
              onPlayThemeSong={playThemeSong}
            />
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
              {isPlayingVideo ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <video 
                    src="/make_video_of_this.mp4" 
                    autoPlay 
                    controls 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button 
                    onClick={() => setIsPlayingVideo(false)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      zIndex: 20
                    }}
                    title="Close Video"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
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
                    right: '2rem',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <div>
                      <h2 style={{ fontSize: '2.2rem', textTransform: 'uppercase', marginBottom: '0.25rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', fontFamily: "'Cinzel', 'Georgia', serif" }}>
                        {selectedMemory.title}
                      </h2>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#ccc', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        <span>{selectedMemory.date}</span>
                        <span>•</span>
                        <span>{selectedMemory.location}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsPlayingVideo(true)}
                      style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.6rem 1.5rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        transition: 'all 0.2s ease',
                        fontSize: '0.95rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6e6e6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Play Video
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="modal-body" style={{ padding: '1.5rem 2rem' }}>
              <div className="modal-main-info" style={{ flex: 2 }}>
                <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#e5e5e5' }}>
                  {selectedMemory.desc}
                </p>

                {/* Soundtrack Widget */}
                {(() => {
                  const linkedTrack = TRACKS.find(t => t.memoryId === selectedMemory.id);
                  if (!linkedTrack) return null;
                  const isCurrent = currentTrack && currentTrack.id === linkedTrack.id;
                  const isPlayingThis = isCurrent && isPlayingAudio;
                  
                  return (
                    <div style={{
                      marginTop: '1.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.85rem 1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>🎵</div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            MEMORY SOUNDTRACK
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
                            {linkedTrack.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>
                            {linkedTrack.artist} • {linkedTrack.album}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleSelectTrack(linkedTrack)}
                        style={{
                          backgroundColor: isPlayingThis ? 'rgba(255, 255, 255, 0.15)' : 'var(--netflix-red)',
                          border: 'none',
                          color: '#fff',
                          padding: '0.45rem 1.2rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                          fontSize: '0.85rem'
                        }}
                      >
                        {isPlayingThis ? (
                          <>
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                            </svg>
                            Pause
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                            Play Song
                          </>
                        )}
                      </button>
                    </div>
                  );
                })()}

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

      {/* Hidden YouTube Iframe for Audio-Only Streaming */}
      {youtubeVideoId && (
        <iframe
          ref={youtubeRef}
          key={youtubeVideoId}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=1&controls=0&rel=0`}
          allow="autoplay"
          style={{
            width: '1px',
            height: '1px',
            position: 'fixed',
            top: '-10px',
            left: '-10px',
            opacity: 0.01,
            pointerEvents: 'none',
            border: 'none'
          }}
          title="Audio Player"
        />
      )}

      {/* Hidden HTML5 Audio Element for Local Playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current && playerType === 'local') {
            setAudioTime(Math.floor(audioRef.current.currentTime));
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && playerType === 'local') {
            setAudioDuration(Math.floor(audioRef.current.duration));
          }
        }}
        onEnded={handleNextTrack}
      />

      {/* Glassmorphic Bottom Player Widget */}
      {currentTrack && (
        <div className="bottom-player">
          <div className="bottom-player-inner">
            {/* Track Info */}
            <div className="bottom-player-info">
              <img src={currentTrack.img} alt="" className="bottom-player-art" />
              <div className="bottom-player-text">
                <div className="bottom-player-title">{currentTrack.title}</div>
                <div className="bottom-player-artist">{currentTrack.artist}</div>
              </div>
            </div>

            {/* Center Controls */}
            <div className="bottom-player-controls">
              <button className="player-ctrl-btn" onClick={handlePrevTrack} title="Previous">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 2a.5.5 0 0 1 .5.5v5.21l7.15-4.94A.5.5 0 0 1 12 3.23V12.77a.5.5 0 0 1-.85.36L4 8.29V13.5a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5z"/></svg>
              </button>
              <button className="player-ctrl-btn play-btn" onClick={handlePlayPause} title={isPlayingAudio ? 'Pause' : 'Play'}>
                {isPlayingAudio ? (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>
                ) : (
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                )}
              </button>
              <button className="player-ctrl-btn" onClick={handleNextTrack} title="Next">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0V8.29l-7.15 4.84A.5.5 0 0 1 4 12.77V3.23a.5.5 0 0 1 .85-.36L12 7.71V2.5a.5.5 0 0 1 .5-.5z"/></svg>
              </button>
              <button className="player-ctrl-btn" onClick={handleStopAudio} title="Stop">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><rect width="10" height="10" x="3" y="3" rx="1"/></svg>
              </button>
            </div>

            {/* Progress & Volume */}
            <div className="bottom-player-right">
              <div className="bottom-player-progress">
                <span className="player-time">{formatTime(audioTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={currentTrack.duration || 300}
                  value={audioTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="player-seek-bar"
                />
                <span className="player-time">{formatTime(currentTrack.duration || 0)}</span>
              </div>
              <div className="bottom-player-volume">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="player-volume-bar"
                />
              </div>
            </div>

            {/* Animated Equalizer */}
            {isPlayingAudio && (
              <div className="player-equalizer">
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cinematic Footer */}
      <footer style={{
        backgroundColor: '#0c0c0c',
        borderTop: '1px solid #222',
        padding: currentTrack ? '1.5rem 4% 6rem' : '1.5rem 4% 1.5rem',
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
