import React, { useState, useEffect, useRef } from 'react';
import './Bubble.css';

const BORDER_WIDTH = 2;
const TAIL_WIDTH = 20;
const TAIL_HEIGHT = 20;
const PADDING = 10; // Padding for text content within the bubble body

const Bubble = ({ id, text, x, y, width, height, styleType = 'rect', onUpdateBubble }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const initialSizeRef = useRef({ width: 0, height: 0 });
  const bubbleRef = useRef(null); // For the outer div
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDownDraggable = (e) => {
    if (isEditing || e.target.classList.contains('resize-handle') || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x, y };
  };

  const handleMouseDownResizable = (e) => {
    if (isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x, y };
    initialSizeRef.current = { width, height };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        onUpdateBubble({ id, x: initialPosRef.current.x + dx, y: initialPosRef.current.y + dy });
      } else if (isResizing) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        let newWidth = initialSizeRef.current.width + dx;
        let newHeight = initialSizeRef.current.height + dy;
        newWidth = Math.max(newWidth, 50 + 2 * PADDING);
        newHeight = Math.max(newHeight, 30 + 2 * PADDING);
        onUpdateBubble({ id, width: newWidth, height: newHeight });
      }
    };
    if (isDragging || isResizing) window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging, isResizing, onUpdateBubble, id]);

  useEffect(() => {
    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };
    if (isDragging || isResizing) window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, isResizing]);

  const handleDoubleClick = (e) => {
    if (e.target.classList.contains('resize-handle') || e.target.tagName === 'TEXTAREA') return;
    setIsEditing(true);
    setEditText(text);
  };

  const handleTextChange = (e) => setEditText(e.target.value);
  const commitTextChange = () => {
    if (editText !== text) onUpdateBubble({ id, text: editText });
    setIsEditing(false);
  };
  const handleTextareaBlur = () => commitTextChange();
  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitTextChange(); }
    else if (e.key === 'Escape') { e.preventDefault(); setEditText(text); setIsEditing(false); }
  };

  // SVG rendering logic
  const bubbleBodyWidth = width - 2 * BORDER_WIDTH;
  const bubbleBodyHeight = height - 2 * BORDER_WIDTH;

  let svgViewBoxWidth = width;
  let svgViewBoxHeight = height;
  let bubblePath = '';
  let tailPath = '';
  // textX and textY are not used for positioning text wrapper anymore, PADDING is used directly.
  let svgXOffset = 0;
  let svgYOffset = 0;

  const isRect = styleType.startsWith('rect') || styleType.startsWith('sticker-rect');
  const isCloud = styleType.startsWith('cloud');
  const isDashed = styleType.includes('-dashed');
  const isSticker = styleType.startsWith('sticker-');

  // Main bubble body path
  if (isRect) {
    bubblePath = `M${BORDER_WIDTH},${BORDER_WIDTH} H${width - BORDER_WIDTH} V${height - BORDER_WIDTH} H${BORDER_WIDTH} Z`;
  } else if (isCloud) {
    // Simplified cloud: ellipse
    bubblePath = `M${BORDER_WIDTH},${height / 2} Q${BORDER_WIDTH},${BORDER_WIDTH} ${width / 2},${BORDER_WIDTH} T${width - BORDER_WIDTH},${height / 2} Q${width-BORDER_WIDTH},${height-BORDER_WIDTH} ${width/2},${height-BORDER_WIDTH} T${BORDER_WIDTH},${height/2} Z`;
  }

  // Tail Path Calculations
  const tailBaseX = width / 2;
  const tailBaseY = height / 2;

  if (styleType.includes('-tail-down')) {
    svgViewBoxHeight = height + TAIL_HEIGHT;
    // Adjust main bubble path if it's a tail variant that doesn't already have its path adjusted by svgYOffset
     if (svgYOffset === 0) { // only adjust if not already shifted for tail-up
        // No change needed for body path itself if tail is at bottom and body is at top.
     }
    tailPath = `M${tailBaseX - TAIL_WIDTH / 2},${height - BORDER_WIDTH*1.5} L${tailBaseX},${height + TAIL_HEIGHT - BORDER_WIDTH*2} L${tailBaseX + TAIL_WIDTH / 2},${height - BORDER_WIDTH*1.5} Z`;
  } else if (styleType.includes('-tail-up')) {
    svgViewBoxHeight = height + TAIL_HEIGHT;
    svgYOffset = TAIL_HEIGHT; // Shift entire bubble drawing down
    const bodyY = TAIL_HEIGHT + BORDER_WIDTH;
    const bodyBottom = TAIL_HEIGHT + height - BORDER_WIDTH;
    const bodyMidY = TAIL_HEIGHT + height/2;
    bubblePath = isRect ? `M${BORDER_WIDTH},${bodyY} H${width - BORDER_WIDTH} V${bodyBottom} H${BORDER_WIDTH} Z`
                        : `M${BORDER_WIDTH},${bodyMidY} Q${BORDER_WIDTH},${bodyY} ${width / 2},${bodyY} T${width - BORDER_WIDTH},${bodyMidY} Q${width-BORDER_WIDTH},${bodyBottom} ${width/2},${bodyBottom} T${BORDER_WIDTH},${bodyMidY} Z`;
    tailPath = `M${tailBaseX - TAIL_WIDTH / 2},${TAIL_HEIGHT + BORDER_WIDTH*1.5} L${tailBaseX},${BORDER_WIDTH*2} L${tailBaseX + TAIL_WIDTH / 2},${TAIL_HEIGHT + BORDER_WIDTH*1.5} Z`;
  } else if (styleType.includes('-tail-left')) {
    svgViewBoxWidth = width + TAIL_WIDTH;
    svgXOffset = TAIL_WIDTH; // Shift entire bubble drawing right
    const bodyX = TAIL_WIDTH + BORDER_WIDTH;
    const bodyRight = TAIL_WIDTH + width - BORDER_WIDTH;
    const bodyMidX = TAIL_WIDTH + width/2;
     bubblePath = isRect ? `M${bodyX},${BORDER_WIDTH} H${bodyRight} V${height - BORDER_WIDTH} H${bodyX} Z`
                        : `M${bodyX},${height / 2} Q${bodyX},${BORDER_WIDTH} ${bodyMidX},${BORDER_WIDTH} T${bodyRight},${height / 2} Q${bodyRight},${height-BORDER_WIDTH} ${bodyMidX},${height-BORDER_WIDTH} T${bodyX},${height/2} Z`;
    tailPath = `M${TAIL_WIDTH + BORDER_WIDTH*1.5},${tailBaseY - TAIL_WIDTH / 2} L${BORDER_WIDTH*2},${tailBaseY} L${TAIL_WIDTH + BORDER_WIDTH*1.5},${tailBaseY + TAIL_WIDTH / 2} Z`;
  } else if (styleType.includes('-tail-right')) {
    svgViewBoxWidth = width + TAIL_WIDTH;
    // No svgXOffset needed as bubble body is at left.
    tailPath = `M${width - BORDER_WIDTH*1.5},${tailBaseY - TAIL_WIDTH / 2} L${width + TAIL_WIDTH - BORDER_WIDTH*2},${tailBaseY} L${width - BORDER_WIDTH*1.5},${tailBaseY + TAIL_WIDTH / 2} Z`;
  }

  let fillCol = '#007bff'; // default rect
  let strokeCol = '#0056b3'; // default rect stroke
  let extraPathProps = {};

  if (isCloud) {
    fillCol = '#4a90e2'; strokeCol = '#357abd';
  }
  if (styleType.includes('tail')) { // Tails often have a different base color in comics
    fillCol = '#f5a623'; strokeCol = '#d08c1d';
  }
   if (isSticker) { // Sticker specific color
    fillCol = '#ffef99'; strokeCol = '#e6d780'; // Light yellow sticker
    extraPathProps.filter = "url(#dropShadow)";
  }
   if (isDashed) {
    extraPathProps.strokeDasharray = "8,4"; // Example dash pattern
  }
  // Override for dashed if also a tail or cloud, to keep their base color
  if (isDashed && (styleType.startsWith('cloud-dashed') || styleType.includes('tail-dashed'))){
     // Keep cloud or tail color, just add dash
  } else if (isDashed) { // plain rect-dashed
    fillCol = '#6c757d'; strokeCol = '#5a6268'; // Gray for dashed rect
  }


  const divStyle = {
    position: 'absolute', left: `${x - svgXOffset}px`, top: `${y - svgYOffset}px`,
    width: `${svgViewBoxWidth}px`, height: `${svgViewBoxHeight}px`,
    cursor: isDragging ? 'grabbing' : (isEditing ? 'default' : 'grab'),
    userSelect: 'none',
  };

  return (
    <div
      ref={bubbleRef}
      style={divStyle}
      className={`bubble ${isEditing ? 'editing' : ''} ${styleType}`}
      onMouseDown={handleMouseDownDraggable}
      onDoubleClick={handleDoubleClick}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`}>
        <defs>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d={bubblePath} fill={fillCol} stroke={strokeCol} strokeWidth={BORDER_WIDTH} {...extraPathProps} />
        {tailPath && <path d={tailPath} fill={fillCol} stroke={strokeCol} strokeWidth={BORDER_WIDTH} {...extraPathProps} />}
      </svg>

      <div className="bubble-content-wrapper" style={{
        position: 'absolute',
        left: `${svgXOffset + PADDING}px`,
        top: `${svgYOffset + PADDING}px`,
        width: `${bubbleBodyWidth - 2 * PADDING}px`,
        height: `${bubbleBodyHeight - 2 * PADDING}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={handleTextChange}
            onBlur={handleTextareaBlur}
            onKeyDown={handleTextareaKeyDown}
            className="bubble-edit-textarea"
          />
        ) : (
          <div className="bubble-text-content">{text}</div>
        )}
      </div>

      {!isEditing && (
        <div
          className="resize-handle resize-handle-br"
          style={{left: `${svgXOffset + width - 5}px`, top: `${svgYOffset + height - 5}px` }} // Adjust handle position based on svg offsets
          onMouseDown={handleMouseDownResizable}
        ></div>
      )}
    </div>
  );
};

export default Bubble;
