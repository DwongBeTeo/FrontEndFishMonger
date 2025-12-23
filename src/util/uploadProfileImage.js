import { API_ENDPOINTS } from "./apiEndpoints";

const CLOUDINARY_UPLOAD_PRESET = 'moneyManager';

const uploadProfileImage = async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const responese = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
            method: 'POST',
            body: formData
        });
        if(!responese.ok){
            const errorData = await responese.json();
            throw new Error(`Image upload failed: ${errorData.error.message || responese.statusText}`);
        }

        const data = await responese.json();
        console.log('Image uploaded successfully: ', data);
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image: ', error);
        throw error;
    }
}

export default uploadProfileImage;