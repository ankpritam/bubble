import React, { useEffect } from 'react'; // Removed own useRef, will use passed-in ref
import './PixelBubble.css';

const PIXEL_SCALE = 5; // How many screen pixels one "pixel art pixel" is
const PADDING = 2 * PIXEL_SCALE; // Padding around the text in "pixel art pixels"
const SPIKE_HEIGHT = 3 * PIXEL_SCALE;
const SPIKE_WIDTH = 4 * PIXEL_SCALE;
const THOUGHT_CIRCLE_RADIUS_1 = 1 * PIXEL_SCALE;
const THOUGHT_CIRCLE_RADIUS_2 = 2 * PIXEL_SCALE;
const LINE_HEIGHT = 3 * PIXEL_SCALE; // Approximate height of a line of text in "pixel art pixels"

const PixelBubble = ({
  text = "Hello",
  x = 0,
  y = 0,
  spikeDirection = 'left',
  isThoughtBubble = false,
  canvasRef // Accept the passed-in ref
}) => {
  // const canvasRef = useRef(null); // Use the passed-in ref instead

  useEffect(() => {
    const canvas = canvasRef.current; // Use the passed-in ref
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Calculate dimensions ---
    // For simplicity, using a rough estimate for text width based on char count
    // A more accurate way would be ctx.measureText, but that requires setting font first.
    const lines = text.split('\n');
    const maxLength = lines.reduce((max, line) => Math.max(max, line.length), 0);

    const textWidthPx = maxLength * (2 * PIXEL_SCALE); // Approx 2 "pixel art pixels" per char width
    const textHeightPx = lines.length * LINE_HEIGHT + (lines.length -1) * PIXEL_SCALE; // PIXEL_SCALE for line spacing

    const bubbleWidth = textWidthPx + 2 * PADDING;
    let bubbleHeight = textHeightPx + 2 * PADDING;

    let canvasWidth = bubbleWidth;
    let canvasHeight = bubbleHeight;

    if (!isThoughtBubble) {
      canvasHeight += SPIKE_HEIGHT;
    } else {
      canvasHeight += THOUGHT_CIRCLE_RADIUS_2 * 2 + PIXEL_SCALE; // Space for thought circles
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // --- Drawing ---
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Style for pixel art
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = PIXEL_SCALE; // Draw "pixel" borders
    ctx.font = `${2.5 * PIXEL_SCALE}px monospace`; // Basic pixel-like font

    // Adjust yOffset for drawing elements based on whether it's a thought bubble or speech bubble
    let yOffset = isThoughtBubble ? THOUGHT_CIRCLE_RADIUS_2 * 2 + PIXEL_SCALE : 0;


    // Draw main bubble rectangle (pixelated)
    drawPixelatedRect(ctx, 0, yOffset, bubbleWidth, bubbleHeight - (isThoughtBubble ? (THOUGHT_CIRCLE_RADIUS_2*2 + PIXEL_SCALE) : SPIKE_HEIGHT), PIXEL_SCALE);


    // Draw spike or thought circles
    if (isThoughtBubble) {
      const circle1X = bubbleWidth / 2 - THOUGHT_CIRCLE_RADIUS_2 - THOUGHT_CIRCLE_RADIUS_1 - PIXEL_SCALE;
      const circle2X = bubbleWidth / 2 ;
      drawPixelatedCircle(ctx, circle1X, THOUGHT_CIRCLE_RADIUS_1, THOUGHT_CIRCLE_RADIUS_1, PIXEL_SCALE);
      drawPixelatedCircle(ctx, circle2X, THOUGHT_CIRCLE_RADIUS_2, THOUGHT_CIRCLE_RADIUS_2, PIXEL_SCALE);
    } else {
      // Spike
      ctx.beginPath();
      let spikeBaseX = spikeDirection === 'left' ? PADDING + PIXEL_SCALE : bubbleWidth - PADDING - PIXEL_SCALE;
      spikeBaseX = Math.max(PIXEL_SCALE, Math.min(spikeBaseX, bubbleWidth - PIXEL_SCALE)); // Clamp

      const spikeTipX = spikeDirection === 'left' ? spikeBaseX - SPIKE_WIDTH / 2 : spikeBaseX + SPIKE_WIDTH / 2;
      const spikeTipY = bubbleHeight - SPIKE_HEIGHT + yOffset;

      ctx.moveTo(spikeBaseX - SPIKE_WIDTH / 2, bubbleHeight - SPIKE_HEIGHT + yOffset - PIXEL_SCALE); // top left of spike base
      ctx.lineTo(spikeTipX, canvasHeight - PIXEL_SCALE); // spike tip
      ctx.lineTo(spikeBaseX + SPIKE_WIDTH / 2, bubbleHeight - SPIKE_HEIGHT + yOffset - PIXEL_SCALE); // top right of spike base

      ctx.fill();
      ctx.stroke();
    }

    // Draw text (pixelated font would be better)
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    lines.forEach((line, index) => {
        ctx.fillText(line, PADDING, yOffset + PADDING + (index * (LINE_HEIGHT + PIXEL_SCALE)));
    });

  }, [text, spikeDirection, isThoughtBubble]);

  // Helper to draw a "pixelated" rectangle
  // Fills then strokes a path of PIXEL_SCALE thick lines
  const drawPixelatedRect = (ctx, rx, ry, rwidth, rheight, scale) => {
    ctx.beginPath();
    for (let i = 0; i < rwidth; i += scale) { // Vertical lines
        for (let j = 0; j < rheight; j += scale) { // Horizontal lines
            ctx.rect(rx + i, ry + j, scale, scale);
        }
    }
    ctx.fill();
    ctx.stroke(); // This will stroke each small square, creating the grid

    // Outline the whole shape
    ctx.strokeRect(rx, ry, rwidth - (rwidth % scale || scale) , rheight - (rheight % scale || scale));
  };

  const drawPixelatedCircle = (ctx, cx, cy, radius, scale) => {
    // Simplified: draw a filled circle and then stroke it.
    // True pixel circle needs more complex algorithm (Midpoint circle algorithm)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };


  const wrapperStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    // The canvas itself has dimensions, wrapper is for positioning
  };

  return (
    <div style={wrapperStyle} className="pixel-bubble-wrapper">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PixelBubble;
