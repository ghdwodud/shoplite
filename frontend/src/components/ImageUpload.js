import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ images, onImagesChange, maxImages = 5 }) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = (files) => {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => {
            // 이미지 파일만 허용
            return file.type.startsWith('image/');
        });

        if (images.length + validFiles.length > maxImages) {
            alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
            return;
        }

        // 파일을 base64로 변환하여 미리보기 제공
        const newImages = [];
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newImages.push({
                    file: file,
                    preview: e.target.result,
                    url: null // 실제 업로드 후 URL로 변경
                });
                
                if (newImages.length === validFiles.length) {
                    onImagesChange([...images, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="image-upload-container">
            <div className="image-upload-label">
                <span>리뷰 사진</span>
                <span className="image-count">({images.length}/{maxImages})</span>
            </div>
            
            {/* 이미지 미리보기 */}
            {images.length > 0 && (
                <div className="image-preview-container">
                    {images.map((image, index) => (
                        <div key={index} className="image-preview-item">
                            <img 
                                src={image.preview || image.url} 
                                alt={`리뷰 이미지 ${index + 1}`}
                                className="preview-image"
                            />
                            <button 
                                type="button"
                                className="remove-image-btn"
                                onClick={() => removeImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* 업로드 영역 */}
            {images.length < maxImages && (
                <div 
                    className={`image-upload-area ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <div className="upload-content">
                        <div className="upload-icon">📷</div>
                        <div className="upload-text">
                            <p>사진을 드래그하거나 클릭하여 업로드</p>
                            <p className="upload-subtext">
                                JPG, PNG 파일 (최대 {maxImages}개)
                            </p>
                        </div>
                    </div>
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;

