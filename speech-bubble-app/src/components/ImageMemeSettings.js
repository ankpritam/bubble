import React from 'react';
import './ImageMemeSettings.css';
import BubbleLibrary from './BubbleLibrary'; // Import BubbleLibrary

const ImageMemeSettings = ({ setUploadedImage, onAddBubble }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUploadedImage(imageURL);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    // Add some visual cue if desired, e.g., by adding a class
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp")) {
      const imageURL = URL.createObjectURL(file);
      setUploadedImage(imageURL);
    } else {
      alert("Please drop a JPG, PNG, or WEBP image file.");
    }
  };

  return (
    <div
      className="image-meme-settings"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h4>Image Meme Settings</h4>
      <p>Upload an image to get started:</p>
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
      />
      <div className="drop-zone-text">
        Or drag and drop an image here.
      </div>
      <BubbleLibrary onAddBubble={onAddBubble} /> {/* Render BubbleLibrary */}
    </div>
  );
};

export default ImageMemeSettings;
