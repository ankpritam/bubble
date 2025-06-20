import React from 'react';
import './BubbleLibrary.css';

const BubbleLibrary = ({ onAddBubble }) => {
  const bubbleTypes = [
    { id: 'rect', name: 'Rectangle' },
    { id: 'rect-dashed', name: 'Rect Dashed' },
    { id: 'rect-tail-down', name: 'Rect Tail Down' },
    { id: 'rect-tail-up', name: 'Rect Tail Up' },
    { id: 'rect-tail-left', name: 'Rect Tail Left' },
    { id: 'rect-tail-right', name: 'Rect Tail Right' },
    { id: 'cloud', name: 'Cloud' },
    { id: 'cloud-dashed', name: 'Cloud Dashed' },
    { id: 'cloud-tail-down', name: 'Cloud Tail Down' },
    { id: 'sticker-rect', name: 'Sticker (Rect)'},
    // Add more cloud tail variations if desired later
  ];

  return (
    <div className="bubble-library">
      <h5>Bubble Library</h5>
      <div className="bubble-options">
        {bubbleTypes.map(bubble => (
          <button
            key={bubble.id}
            onClick={() => onAddBubble(bubble.id)}
            className="bubble-option-button"
            title={bubble.name} // Add title for better UX if names are long
          >
            {bubble.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BubbleLibrary;
