import React, { useState } from 'react';
import { X, Download, Maximize2, Minimize2 } from 'lucide-react';

const ImagePreview = ({ image, onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!image) return null;

  const handleToggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        className="modal-content animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: isZoomed ? '95vw' : '80vw',
          maxHeight: isZoomed ? '90vh' : '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: isZoomed ? 'auto' : 'hidden',
          borderRadius: '8px'
        }}
      >
        <button 
          className="close-btn" 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            zIndex: 1010,
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          <X size={32} />
        </button>
        
        <img 
          src={image} 
          alt="Full Preview" 
          onClick={handleToggleZoom}
          style={{ 
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            width: isZoomed ? 'auto' : '100%',
            height: isZoomed ? 'auto' : 'auto',
            maxHeight: isZoomed ? 'none' : '80vh',
            objectFit: 'contain',
            display: 'block',
            transition: 'transform 0.3s ease'
          }}
        />

        <div style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1rem',
          zIndex: 1010
        }}>
          {/* <button
            onClick={handleToggleZoom}
            className="btn btn-secondary"
            style={{ 
              borderRadius: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            {isZoomed ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {isZoomed ? 'Actual Size' : 'Zoom In'}
          </button> */}

          {/* <a 
            href={image} 
            download="screenshot.png" 
            className="btn btn-primary"
            style={{ 
              borderRadius: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            <Download size={18} />
            Download
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;