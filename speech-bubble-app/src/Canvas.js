import React from 'react';
import './Canvas.css';
import PixelBubble from './components/PixelBubble';
import Bubble from './Bubble'; // Import generic Bubble

const Canvas = ({
  currentMode,
  // Pixel Mode Props
  pixelBubbleText,
  pixelSpikeDirection,
  pixelIsThoughtBubble,
  pixelCanvasRef,
  isAnimatingForGif,
  // ImageMeme Mode Props
  uploadedImage,
  imageMemeBubbles,
  onUpdateBubble // Accept onUpdateBubble
}) => {
  const bubbleX = currentMode === 'Pixel' ? 50 : 0;
  const bubbleY = currentMode === 'Pixel' ? 50 : 0;

  return (
    <div className="canvas-area">
      {/* Pixel Mode Rendering */}
      {currentMode === 'Pixel' && (
        <PixelBubble
          text={pixelBubbleText}
          x={bubbleX}
          y={bubbleY}
          spikeDirection={pixelSpikeDirection}
          isThoughtBubble={pixelIsThoughtBubble}
          canvasRef={pixelCanvasRef}
        />
      )}

      {/* ImageMeme Mode Rendering */}
      {currentMode === 'ImageMeme' && uploadedImage && (
        <img
          src={uploadedImage}
          alt="Uploaded Meme"
          className="meme-image-on-canvas" // Added class for potential specific styling
          style={{
            position: 'absolute', // Positioned so bubbles can overlay
            left: 0, top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 1 // Image behind bubbles
          }}
        />
      )}
      {currentMode === 'ImageMeme' && imageMemeBubbles && imageMemeBubbles.map(bubble => (
        <Bubble
          key={bubble.id}
          text={bubble.text}
          x={bubble.x}
          y={bubble.y}
          width={bubble.width}
          height={bubble.height}
          styleType={bubble.styleType}
          onUpdateBubble={onUpdateBubble} // Pass it to Bubble
        />
      ))}
      {currentMode === 'ImageMeme' && !uploadedImage && (
        <div style={{padding: '20px'}}>Upload an image to see it here. Add bubbles from the library.</div>
      )}

      {/* Quote Mode Rendering */}
      {currentMode === 'Quote' && <div style={{padding: '20px'}}>Quote Mode Canvas Area</div>}

      {/* Fallback for unhandled or initial state */}
      {currentMode !== 'Pixel' && currentMode !== 'ImageMeme' && currentMode !== 'Quote' && (
        <div>Select a mode to start creating!</div>
      )}
    </div>
  );
};

export default Canvas;
