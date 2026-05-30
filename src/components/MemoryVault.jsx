import React, { useState } from 'react';

export default function MemoryVault({ onCardClick }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Dates', 'Trips', 'Silly'];

  const memories = [
    {
      id: 'v1',
      title: 'The Sunset Café',
      category: 'Trips',
      date: 'May 12, 2024',
      location: 'Mountain Vista Café',
      img: '/couple_sunset_date.png',
      desc: 'After driving for three hours through winding mountain passes, we stumbled upon this small, wooden cabin café right as the sun began to sink. We sat on the balcony sipping hazelnut lattes, watching the pine trees turn into golden silhouettes.',
      matchRate: '98% Match',
      year: '2024'
    },
    {
      id: 'v2',
      title: 'Concert Under the Stars',
      category: 'Dates',
      date: 'Aug 18, 2024',
      location: 'City Amphitheater',
      img: '/couple_campfire_night.png',
      desc: 'Dancing to our favorite indie band on a warm summer evening. We did not have front-row seats, but dancing in the grass at the very back with popcorn in hand made it feel like our own private concert.',
      matchRate: '96% Match',
      year: '2024'
    },
    {
      id: 'v3',
      title: 'The Cookie Calamity',
      category: 'Silly',
      date: 'Dec 22, 2024',
      location: 'Our Kitchen',
      img: '/couple_first_date.png',
      desc: 'Our brave attempt to make chocolate chip cookies from scratch without checking if we had baking soda. The result was a giant, flat, crunchy cookie sheet. It tasted terrible, but we laughed for an hour and ended up eating ice cream straight from the tub.',
      matchRate: '100% Comedy',
      year: '2024'
    },
    {
      id: 'v4',
      title: 'Beachside Afternoon Picnic',
      category: 'Dates',
      date: 'July 5, 2024',
      location: 'Sandy Shores Beach',
      img: '/couple_beach_picnic.png',
      desc: 'A surprise afternoon setup on the sand. We packed a small cheese board, strawberries, and lemonade. The seagulls tried their best to steal our sandwich, but we defended our lunch and walked along the pier till the moon came up.',
      matchRate: '97% Match',
      year: '2024'
    },
    {
      id: 'v5',
      title: 'Midnight Highway Chase',
      category: 'Trips',
      date: 'Oct 11, 2025',
      location: 'Coastal Route 1',
      img: '/couple_road_trip.png',
      desc: 'Going out at midnight just to find a 24-hour diner that served waffles. We took the scenic route, rolled the windows down in the chilly night air, and played our favorite songs on repeat. The waffles were okay, but the drive was legendary.',
      matchRate: '99% Match',
      year: '2025'
    },
    {
      id: 'v6',
      title: 'Unexpected Rain Storm',
      category: 'Silly',
      date: 'April 3, 2025',
      location: 'Downtown Square',
      img: '/couple_sunset_date.png',
      desc: 'We went out for a nice dinner dressed up, only to get caught in a sudden, torrential downpour with no umbrella. We ended up running through the puddles hand-in-hand, completely soaked. A cozy reminder that every storm is an adventure.',
      matchRate: '95% Match',
      year: '2025'
    },
    {
      id: 'v7',
      title: 'Anniversary Celebration',
      category: 'Dates',
      date: 'Oct 24, 2025',
      location: 'The Glasshouse Bistro',
      img: '/couple_anniversary_dinner.png',
      desc: 'Celebrating two years of incredible memories. We dressed up, shared a chef-special degustation menu, and spent the entire dinner reminiscing about how we met and making plans for the seasons ahead.',
      matchRate: '99.8% Perfect',
      year: '2025'
    },
    {
      id: 'v8',
      title: 'The First Coffee Date',
      category: 'Dates',
      date: 'Nov 4, 2023',
      location: 'Corner Cafe',
      img: '/couple_first_date.png',
      desc: 'The beginning of our timeline. Two nervous people ordering cappuccinos, talking about their favorite movies, and smiling uncontrollably. That 2-hour conversation felt like 10 minutes, and we both knew we wanted a second date.',
      matchRate: '99% Match',
      year: '2023'
    }
  ];

  const filteredMemories = memories.filter((memory) => {
    const matchesCategory = activeFilter === 'All' || memory.category === activeFilter;
    const matchesSearch = memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          memory.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          memory.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section style={{ padding: '2rem 4%', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontFamily: "'Cinzel', 'Georgia', serif", textTransform: 'uppercase' }}>
          Memory <span style={{ color: 'var(--netflix-red)' }}>Vault</span>
        </h2>
        <p style={{ color: 'var(--text-grey)', marginTop: '0.35rem', fontSize: '0.9rem' }}>
          Browse and filter our catalog of adventures, dates, and funny highlights.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '1.25rem',
        flexWrap: 'wrap'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                backgroundColor: activeFilter === cat ? 'var(--netflix-red)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid',
                borderColor: activeFilter === cat ? 'var(--netflix-red)' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== cat) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== cat) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '0.6rem 1rem 0.6rem 2.5rem',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--netflix-red)'}
            onBlur={(e) => e.target.style.borderColor = '#444'}
          />
          {/* Search Glass SVG Icon */}
          <svg 
            width="16" 
            height="16" 
            fill="currentColor" 
            viewBox="0 0 16 16"
            style={{
              position: 'absolute',
              left: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-grey)',
              pointerEvents: 'none'
            }}
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </div>
      </div>

      {/* Grid Results */}
      {filteredMemories.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              onClick={() => onCardClick(memory)}
              style={{
                backgroundColor: '#181818',
                borderRadius: '6px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                border: '1px solid #222',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                aspectRatio: '16/10'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04) translateY(-5px)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '65%' }}>
                <img 
                  src={memory.img} 
                  alt={memory.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <span style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '20px',
                  fontWeight: 600,
                  color: 'var(--accent-amber)',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  {memory.category}
                </span>
              </div>
              <div style={{ padding: '0.85rem', height: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {memory.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-grey)', marginTop: '0.25rem' }}>
                  <span>{memory.date}</span>
                  <span>{memory.matchRate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-grey)',
          backgroundColor: '#111',
          borderRadius: '8px',
          border: '1px solid #222'
        }}>
          <p style={{ fontSize: '1.1rem' }}>No memories found matching your filters/search.</p>
          <button 
            onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
            style={{
              marginTop: '1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--netflix-red)',
              color: 'var(--netflix-red)',
              padding: '0.5rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--netflix-red)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--netflix-red)';
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
