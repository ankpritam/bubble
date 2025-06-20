import React from 'react';
import './PixelBubbleSettings.css';

const PixelBubbleSettings = ({
  pixelBubbleText,
  setPixelBubbleText,
  pixelSpikeDirection,
  setPixelSpikeDirection,
  pixelIsThoughtBubble,
  setPixelIsThoughtBubble,
  onDownloadPNG,
  onDownloadGIF,
}) => {
  return (
    <div className="pixel-bubble-settings">
      <h4>Pixel Bubble Settings</h4>
      <div>
        <label htmlFor="pixel-text">Text: </label>
        <textarea
          id="pixel-text"
          value={pixelBubbleText}
          onChange={(e) => setPixelBubbleText(e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="spike-direction">Spike Direction: </label>
        <select
          id="spike-direction"
          name="spikeDirection"
          value={pixelSpikeDirection}
          onChange={(e) => setPixelSpikeDirection(e.target.value)}
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <input
          type="checkbox"
          id="thought-bubble"
          name="isThoughtBubble"
          checked={pixelIsThoughtBubble}
          onChange={(e) => setPixelIsThoughtBubble(e.target.checked)}
        />
        <label htmlFor="thought-bubble">Thought Bubble</label>
      </div>
      <div className="export-buttons">
        <button onClick={onDownloadPNG}>Download PNG</button>
        <button onClick={onDownloadGIF}>Download Animated GIF</button>
      </div>
    </div>
  );
};

export default PixelBubbleSettings;
