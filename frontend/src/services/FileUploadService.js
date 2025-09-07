import apiClient from './ApiClient';

class FileUploadService {
  // 단일 이미지 업로드
  static async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // 다중 이미지 업로드
  static async uploadMultipleImages(files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return await apiClient.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // 이미지 URL 생성
  static getImageUrl(filename) {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/files/image/${filename}`;
  }

  // 파일 URL 생성
  static getFileUrl(filename) {
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/files/${filename}`;
  }

  // 파일 크기 포맷팅
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 파일 형식 검증
  static validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        message: '지원하지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 지원)'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        message: '파일 크기가 너무 큽니다. (최대 5MB)'
      };
    }
    
    return { valid: true };
  }

  // 이미지 리사이즈 (Canvas 사용)
  static resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // 비율 계산
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);
        
        // Blob으로 변환
        canvas.toBlob(resolve, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}

export default FileUploadService;


