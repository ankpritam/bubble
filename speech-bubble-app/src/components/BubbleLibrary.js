import React from 'react';
import './BubbleLibrary.css';

const BubbleLibrary = ({ onAddBubble }) => {
  const bubbleTypes = [
    { id: 'rect', name: 'Simple Rectangle' },
    { id: 'cloud', name: 'Cloud Bubble' },
    { id: 'tail-down', name: 'Spike Down' }, // Simplified name for now
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
          >
            {bubble.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BubbleLibrary;
