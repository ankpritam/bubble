import React, { useState, useRef } from 'react';
import GIF from 'gif.js';
import './App.css';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import PixelBubbleSettings from './components/PixelBubbleSettings';
import ImageMemeSettings from './components/ImageMemeSettings';

function App() {
  const [currentMode, setCurrentMode] = useState('Pixel');
  const pixelCanvasRef = useRef(null);

  // PixelBubble State
  const [pixelBubbleText, setPixelBubbleText] = useState("Pixel Art!");
  const [pixelSpikeDirection, setPixelSpikeDirection] = useState('left');
  const [pixelIsThoughtBubble, setPixelIsThoughtBubble] = useState(false);
  const [animationFrameParams, setAnimationFrameParams] = useState(null);

  // ImageMeme State
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageMemeBubbles, setImageMemeBubbles] = useState([]);

  const handleAddImageMemeBubble = (bubbleType) => {
    const newBubble = {
      id: `bubble-${Date.now()}`,
      text: "Edit me!",
      x: 50,
      y: 50,
      width: 150,
      height: 80,
      styleType: bubbleType,
    };
    setImageMemeBubbles(prevBubbles => [...prevBubbles, newBubble]);
  };

  const handleUpdateImageMemeBubble = (updatedProps) => {
    setImageMemeBubbles(prevBubbles =>
      prevBubbles.map(bubble =>
        bubble.id === updatedProps.id ? { ...bubble, ...updatedProps } : bubble
      )
    );
  };

  const handleDownloadPNG = () => {
    if (pixelCanvasRef.current) {
      const canvas = pixelCanvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'pixel-bubble.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Canvas ref not found for PNG download.");
    }
  };

  const handleDownloadGIF = async () => {
    if (!pixelCanvasRef.current) {
      console.error("Canvas ref not found for GIF download.");
      return;
    }

    const gif = new GIF({
      workers: 2, // Number of web workers to use
      quality: 10, // Lower for smaller file size, higher for better quality
      workerScript: '/gif.worker.js' // Updated path to worker script in public folder
    });

    const frames = 3; // Number of frames for blinking
    const delay = 300; // ms per frame

    for (let i = 0; i < frames * 2; i++) { // Loop for on/off states
      const showText = i % 2 === 0;
      // Trigger re-render of PixelBubble with modified text param for animation
      // This is a bit of a hack. Ideally, PixelBubble's draw function would be directly callable.
      setAnimationFrameParams({ text: showText ? pixelBubbleText : " ", isBlinking: true });

      // Wait for the re-render and canvas update. This is tricky and might need a more robust solution
      // like a callback from PixelBubble after it draws. For now, a timeout.
      await new Promise(resolve => setTimeout(resolve, 50));

      if (pixelCanvasRef.current) {
        // Create a new canvas, draw the current pixelCanvasRef content to it.
        // This is because gif.js might have issues with directly using a React-managed canvas
        // if it's re-rendered frequently or if the ref changes.
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = pixelCanvasRef.current.width;
        tempCanvas.height = pixelCanvasRef.current.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(pixelCanvasRef.current, 0, 0);
        gif.addFrame(tempCanvas, { delay: delay });
      }
    }

    setAnimationFrameParams(null); // Reset animation state

    gif.on('finished', (blob) => {
      const link = document.createElement('a');
      link.download = 'pixel-bubble.gif';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });

    gif.render();
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Content Generator</h1>
      </header>
      <Toolbar setCurrentMode={setCurrentMode} />

      {currentMode === 'Pixel' && (
        <PixelBubbleSettings
          pixelBubbleText={pixelBubbleText}
          setPixelBubbleText={setPixelBubbleText}
          pixelSpikeDirection={pixelSpikeDirection}
          setPixelSpikeDirection={setPixelSpikeDirection}
          pixelIsThoughtBubble={pixelIsThoughtBubble}
          setPixelIsThoughtBubble={setPixelIsThoughtBubble}
          onDownloadPNG={handleDownloadPNG}
          onDownloadGIF={handleDownloadGIF}
        />
      )}

      {currentMode === 'ImageMeme' && (
        <ImageMemeSettings
          setUploadedImage={setUploadedImage}
          onAddBubble={handleAddImageMemeBubble} // Pass the handler
        />
      )}

      <Canvas
        currentMode={currentMode}
        // Pixel props
        pixelBubbleText={animationFrameParams && animationFrameParams.isBlinking ? animationFrameParams.text : pixelBubbleText}
        pixelSpikeDirection={pixelSpikeDirection}
        pixelIsThoughtBubble={pixelIsThoughtBubble}
        pixelCanvasRef={pixelCanvasRef}
        isAnimatingForGif={!!animationFrameParams}
        // ImageMeme props
        uploadedImage={uploadedImage}
        imageMemeBubbles={imageMemeBubbles}
        onUpdateBubble={handleUpdateImageMemeBubble} // Pass update handler
      />

      <div>
        {/* Placeholder for other mode-specific settings or content that aren't in their own settings component */}
        {/* {currentMode === 'ImageMeme' && <div>ImageMeme Mode Content Area</div>} */}
        {currentMode === 'Quote' && <div>Quote Mode Content Area</div>}
      </div>
    </div>
  );
}

export default App;
