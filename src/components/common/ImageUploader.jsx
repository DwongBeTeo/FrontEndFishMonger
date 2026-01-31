import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import uploadImage from '../../util/uploadImage';
import toast from 'react-hot-toast';

// file này để upload ảnh lên Cloudinary và trả về URL ảnh
const ImageUploader = ({ value, onChange, label = "Hình ảnh" }) => {
    const [uploading, setUploading] = useState(false);

    // Xử lý khi người dùng chọn file
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate loại file (chỉ cho phép ảnh)
        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chọn file ảnh!");
            return;
        }

        // Validate dung lượng (ví dụ < 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File ảnh quá lớn (Max 5MB)");
            return;
        }

        try {
            setUploading(true);
            // Gọi hàm util để upload lên Cloudinary
            const imageUrl = await uploadImage(file);
            
            // Trả URL về cho form cha
            onChange(imageUrl); 
            toast.success("Upload ảnh thành công!");
        } catch (error) {
            toast.error("Lỗi khi upload ảnh!");
        } finally {
            setUploading(false);
        }
    };

    // Xóa ảnh
    const handleRemoveImage = () => {
        onChange(''); // Set URL về rỗng
    };

    return (
        <div className="w-full">
            <label className="text-[13px] text-slate-800 block mb-2 font-medium">
                {label}
            </label>

            {/* Khu vực hiển thị ảnh hoặc nút upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative min-h-[160px]">
                
                {/* 1. Trạng thái đang upload */}
                {uploading ? (
                    <div className="flex flex-col items-center text-blue-600">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm font-medium">Đang tải lên...</span>
                    </div>
                ) : value ? (
                    // 2. Trạng thái đã có ảnh (Hiển thị preview)
                    <div className="relative w-full h-40 group">
                        <img 
                            src={value} 
                            alt="Preview" 
                            className="w-full h-full object-contain rounded-md" 
                        />
                        {/* Nút xóa ảnh */}
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                            title="Xóa ảnh"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    // 3. Trạng thái chưa có ảnh (Hiện nút chọn)
                    <>
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                        <label className="cursor-pointer">
                            <span className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-all shadow-sm">
                                Chọn ảnh từ máy
                            </span>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Hỗ trợ JPG, PNG, WEBP (Max 5MB)</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;