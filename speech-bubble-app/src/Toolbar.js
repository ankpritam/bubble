import React from 'react';
import './Toolbar.css';

const Toolbar = ({ setCurrentMode }) => {
  return (
    <div className="toolbar">
      <button onClick={() => setCurrentMode('Pixel')}>Pixel Mode</button>
      <button onClick={() => setCurrentMode('ImageMeme')}>Image Meme Mode</button>
      <button onClick={() => setCurrentMode('Quote')}>Quote Mode</button>
    </div>
  );
};

export default Toolbar;
