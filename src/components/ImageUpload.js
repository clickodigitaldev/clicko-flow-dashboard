import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';

const ImageUpload = ({ 
  currentImageUrl, 
  onImageChange, 
  placeholder = "Upload Image",
  className = "",
  showPreview = true 
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Update previewUrl when currentImageUrl changes
  React.useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        onImageChange(base64String);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setIsUploading(false);
      alert('Error processing image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-white text-sm font-medium mb-2">
        {placeholder}
      </label>
      
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      {!previewUrl && (
        <div
          onClick={handleClick}
          className="w-full h-32 border-2 border-dashed border-white border-opacity-30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-opacity-50 transition-all duration-300 bg-white bg-opacity-5"
        >
          {isUploading ? (
            <div className="text-white text-sm">Uploading...</div>
          ) : (
            <>
              <Camera className="w-8 h-8 text-white text-opacity-60 mb-2" />
              <p className="text-white text-opacity-60 text-sm">Click to upload image</p>
              <p className="text-white text-opacity-40 text-xs mt-1">Max 5MB</p>
            </>
          )}
        </div>
      )}

      {/* Preview */}
      {showPreview && previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-white border-opacity-20"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload Button (if no preview) */}
      {!previewUrl && (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;

