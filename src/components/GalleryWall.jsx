import React, { useState } from 'react';

export default function GalleryWall({ cards, onAddCard }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');
  const [newStyle, setNewStyle] = useState('polaroid');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newImg) return alert("Title and Image URL are required!");

    const newCard = {
      id: 'g' + Date.now(),
      style: newStyle,
      title: newTitle,
      date: newDate || new Date().getFullYear().toString(),
      desc: newDesc,
      img: newImg
    };

    onAddCard(newCard);
    
    // Reset Form
    setNewTitle('');
    setNewDate('');
    setNewDesc('');
    setNewImg('');
    setNewStyle('polaroid');
    setShowAddModal(false);
  };

  return (
    <section className="gallery-section" style={{ margin: '0.5rem 0' }}>
      {/* Header Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 className="gallery-title">MEMORIES GALLERY WALL</h2>
          <span style={{ fontSize: '0.82rem', color: '#808080', marginTop: '0.2rem', textAlign: 'left' }}>
            An infinite masonry collection of vintage photos, Polaroid captures, and relationship cards.
          </span>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: 'var(--netflix-red)',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: '900',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'background-color 0.2s ease',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--netflix-red-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--netflix-red)'}
        >
          + ADD TO GALLERY
        </button>
      </div>

      {/* Grid Container */}
      <div className="gallery-grid">
        {cards.map((card, idx) => (
          <div 
            key={card.id || idx}
            className={`gallery-card-wrapper ${card.style}-card-wrapper`}
            style={{
              transform: card.style === 'polaroid' ? `rotate(${(idx % 2 === 0 ? -1.2 : 1.2)}deg)` : 'none'
            }}
          >
            {card.style === 'polaroid' ? (
              /* Polaroid Style Card (Light) */
              <div className="polaroid-card">
                <div className="polaroid-tape"></div>
                <div className="polaroid-image-container">
                  <img src={card.img} alt={card.title} className="polaroid-image" />
                </div>
                <div className="polaroid-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
                    <h3 className="polaroid-card-title">{card.title}</h3>
                    <span className="polaroid-card-date">{card.date}</span>
                  </div>
                  <p className="polaroid-card-desc">{card.desc}</p>
                </div>
              </div>
            ) : (
              /* Cinematic Style Card (Dark) */
              <div className="cinematic-card">
                <div className="cinematic-image-container">
                  <img src={card.img} alt={card.title} className="cinematic-image" />
                </div>
                <div className="cinematic-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', marginBottom: '0.25rem' }}>
                    <h3 className="cinematic-card-title">{card.title}</h3>
                    <span className="cinematic-card-date">{card.date}</span>
                  </div>
                  <p className="cinematic-card-desc">{card.desc}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-outfit)', textTransform: 'uppercase', color: '#fff' }}>
                Add New Memory Card
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Card Style</label>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="radio" 
                        name="cardStyle" 
                        value="polaroid"
                        checked={newStyle === 'polaroid'}
                        onChange={() => setNewStyle('polaroid')}
                      />
                      Polaroid (Light)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="radio" 
                        name="cardStyle" 
                        value="cinematic"
                        checked={newStyle === 'cinematic'}
                        onChange={() => setNewStyle('cinematic')}
                      />
                      Cinematic (Dark)
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Title</label>
                  <input 
                    type="text" 
                    placeholder={newStyle === 'polaroid' ? "e.g., Summer of '24" : "e.g., FIRST CHRISTMAS TOGETHER"}
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Year</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 2024"
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Describe this beautiful moment..."
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a3a3a3', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 700 }}>Image URL / Path</label>
                  <input 
                    type="text" 
                    placeholder="e.g. /couple_sunset_date.png or a URL..."
                    value={newImg} 
                    onChange={(e) => setNewImg(e.target.value)} 
                    style={{ width: '100%', padding: '0.6rem', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ padding: '0.6rem 1.25rem', background: 'var(--netflix-red)', border: 'none', color: '#fff', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
