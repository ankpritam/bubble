import React, { useState, useEffect, useRef } from 'react';
import './Bubble.css';

const Bubble = ({ id, text, x, y, width, height, styleType = 'rect', onUpdateBubble }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  const initialSizeRef = useRef({ width: 0, height: 0 });
  const bubbleRef = useRef(null);
  const textareaRef = useRef(null);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDownDraggable = (e) => {
    if (isEditing || e.target.classList.contains('resize-handle')) return;
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
        newWidth = Math.max(newWidth, 50);
        newHeight = Math.max(newHeight, 30);
        onUpdateBubble({ id, width: newWidth, height: newHeight });
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging, isResizing, onUpdateBubble, id]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    if (isDragging || isResizing) {
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, isResizing]);

  const handleDoubleClick = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    setIsEditing(true);
    setEditText(text); // Initialize textarea with current text
  };

  const handleTextChange = (e) => {
    setEditText(e.target.value);
  };

  const commitTextChange = () => {
    if (editText !== text) { // Only update if text actually changed
        onUpdateBubble({ id, text: editText });
    }
    setIsEditing(false);
  };

  const handleTextareaBlur = () => {
    commitTextChange();
  };

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in textarea
      commitTextChange();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditText(text); // Revert to original text
      setIsEditing(false);
    }
  };

  const baseStyle = {
    position: 'absolute', left: `${x}px`, top: `${y}px`,
    width: `${width}px`, height: `${height}px`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '10px', boxSizing: 'border-box',
    cursor: isDragging ? 'grabbing' : (isEditing ? 'default' : 'grab'),
  };

  let specificStyle = {};
  let bubbleClassName = 'bubble';
  switch (styleType) {
    case 'cloud': specificStyle = { backgroundColor: '#4a90e2', borderRadius: '50%', border: '2px solid #357abd' }; bubbleClassName += ' bubble-cloud'; break;
    case 'tail-down': specificStyle = { backgroundColor: '#f5a623', borderRadius: '10px', border: '2px solid #d08c1d' }; bubbleClassName += ' bubble-tail-down'; break;
    default: specificStyle = { backgroundColor: '#007bff', borderRadius: '10px', border: '1px solid #0056b3' }; bubbleClassName += ' bubble-rect'; break;
  }
  const combinedStyle = { ...baseStyle, ...specificStyle };

  return (
    <div
      ref={bubbleRef}
      className={`${bubbleClassName} ${isEditing ? 'editing' : ''}`}
      style={combinedStyle}
      onMouseDown={handleMouseDownDraggable}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editText}
          onChange={handleTextChange}
          onBlur={handleTextareaBlur}
          onKeyDown={handleTextareaKeyDown}
          className="bubble-edit-textarea"
          style={{ // Basic styling, can be moved to CSS
            width: '100%', height: '100%', border: 'none', resize: 'none',
            textAlign: 'center', background: 'transparent', color: 'white', // Match text style
            padding: '0', margin: '0', // Remove default textarea padding
            fontFamily: 'inherit', fontSize: 'inherit', // Inherit from bubble
            overflowY: 'auto'
          }}
        />
      ) : (
        <div className="bubble-text-content">{text}</div>
      )}
      {!isEditing && (
        <div
          className="resize-handle resize-handle-br"
          onMouseDown={handleMouseDownResizable}
        ></div>
      )}
    </div>
  );
};

export default Bubble;
