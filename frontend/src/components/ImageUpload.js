import React, { useRef, useState } from 'react';
import FileUploadService from '../services/FileUploadService';
import './ImageUpload.css';

const ImageUpload = ({ images, onImagesChange, maxImages = 5, autoUpload = true }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = async (files) => {
        const fileArray = Array.from(files);
        
        // 파일 검증
        const validFiles = [];
        for (const file of fileArray) {
            const validation = FileUploadService.validateImageFile(file);
            if (!validation.valid) {
                alert(`${file.name}: ${validation.message}`);
                continue;
            }
            validFiles.push(file);
        }

        if (images.length + validFiles.length > maxImages) {
            alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
            return;
        }

        if (validFiles.length === 0) return;

        // 미리보기 생성
        const newImages = [];
        for (const file of validFiles) {
            const preview = await createPreview(file);
            newImages.push({
                file: file,
                preview: preview,
                url: null,
                uploading: autoUpload,
                uploaded: false
            });
        }

        // 이미지 목록 업데이트
        const updatedImages = [...images, ...newImages];
        onImagesChange(updatedImages);

        // 자동 업로드가 활성화된 경우 업로드 실행
        if (autoUpload) {
            await uploadImages(validFiles, updatedImages.length - validFiles.length);
        }
    };

    const createPreview = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    };

    const uploadImages = async (files, startIndex) => {
        setUploading(true);
        
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const imageIndex = startIndex + i;
                
                try {
                    const response = await FileUploadService.uploadImage(file);
                    
                    if (response.data.success) {
                        // 업로드 성공 시 이미지 정보 업데이트
                        const updatedImages = [...images];
                        updatedImages[imageIndex] = {
                            ...updatedImages[imageIndex],
                            url: FileUploadService.getImageUrl(response.data.filename),
                            filename: response.data.filename,
                            uploading: false,
                            uploaded: true
                        };
                        onImagesChange(updatedImages);
                    } else {
                        throw new Error(response.data.message);
                    }
                } catch (error) {
                    console.error('이미지 업로드 실패:', error);
                    
                    // 업로드 실패 시 이미지 상태 업데이트
                    const updatedImages = [...images];
                    updatedImages[imageIndex] = {
                        ...updatedImages[imageIndex],
                        uploading: false,
                        uploaded: false,
                        error: error.message || '업로드 실패'
                    };
                    onImagesChange(updatedImages);
                }
            }
        } finally {
            setUploading(false);
        }
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
                                alt={`이미지 ${index + 1}`}
                                className="preview-image"
                            />
                            
                            {/* 업로드 상태 표시 */}
                            {image.uploading && (
                                <div className="upload-overlay">
                                    <div className="upload-spinner"></div>
                                    <span>업로드 중...</span>
                                </div>
                            )}
                            
                            {image.error && (
                                <div className="upload-error">
                                    <span>❌ {image.error}</span>
                                </div>
                            )}
                            
                            {image.uploaded && (
                                <div className="upload-success">
                                    <span>✅</span>
                                </div>
                            )}
                            
                            <button 
                                type="button"
                                className="remove-image-btn"
                                onClick={() => removeImage(index)}
                                disabled={image.uploading}
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

