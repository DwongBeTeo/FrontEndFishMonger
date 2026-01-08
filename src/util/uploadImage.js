import { API_ENDPOINTS } from "./apiEndpoints";

// Nếu bạn dùng chung 1 preset cho toàn app thì để const ở đây.
// Nếu muốn linh động (ví dụ product dùng preset 'product_img', user dùng 'avatar'), 
// hãy truyền nó vào tham số hàm.
const DEFAULT_UPLOAD_PRESET = 'moneyManager'; 

/**
 * Hàm upload ảnh lên Cloudinary
 * @param {File} imageFile - File ảnh lấy từ input type="file"
 * @param {String} uploadPreset - (Tùy chọn) Preset cấu hình trên Cloudinary
 * @returns {Promise<string>} - Trả về URL ảnh (secure_url)
 */
const uploadImage = async (imageFile, uploadPreset = DEFAULT_UPLOAD_PRESET) => {
    // Check nếu không phải file thì return null
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);
    // formData.append('folder', 'products'); // Nếu muốn quy định folder cụ thể

    try {
        // Lưu ý: API_ENDPOINTS.UPLOAD_IMAGE phải là link trực tiếp của Cloudinary
        // VD: https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload
        const response = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        console.log('Image uploaded:', data);
        
        return data.secure_url; // Trả về link ảnh để lưu vào DB
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export default uploadImage;