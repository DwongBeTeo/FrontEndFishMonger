import React, { useState, useEffect } from 'react';
import Input from '../../common/Input';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';
import ImageUploader from '../../common/ImageUploader';

const ServiceForm = ({ selectedService, onSuccess, onCancel }) => {
    const isEditMode = !!selectedService;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        estimatedDuration: '',
        imageUrl: '',
        description: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);

    // Load data khi edit
    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: selectedService.name,
                price: selectedService.price,
                estimatedDuration: selectedService.estimatedDuration,
                imageUrl: selectedService.imageUrl || '',
                description: selectedService.description || '',
                isActive: selectedService.isActive
            });
        }
    }, [isEditMode, selectedService]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // 4. Helper update state (Vì Input.jsx trả về e.target.value nhưng ko kèm name trong 1 số case select)
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!formData.name || !formData.price || !formData.estimatedDuration) {
            Swal.fire('Thiếu thông tin', 'Vui lòng nhập Tên, Giá và Thời gian ước tính.', 'warning');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                // UPDATE: PUT /admin/service-types/{id}
                await axiosConfig.put(`/admin/service-types/${selectedService.id}`, formData);
            } else {
                // CREATE: POST /admin/service-types
                await axiosConfig.post('/admin/service-types', formData);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
                
                {/* 1. Tên Dịch vụ */}
                <Input 
                    label="Tên dịch vụ *" 
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="VD: Vệ sinh hồ cá Koi"
                />

                {/* 2. Giá & Thời gian */}
                <div className="grid grid-cols-2 gap-5">
                    <Input 
                        label="Giá (VNĐ) *" 
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="VD: 200000"
                    />
                    <Input 
                        label="Thời gian (Phút) *" 
                        type="number"
                        value={formData.estimatedDuration}
                        onChange={(e) => handleChange('estimatedDuration', e.target.value)}
                        placeholder="VD: 60"
                    />
                </div>

                {/* 3. Image URL & Preview */}
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <ImageUploader 
                                label="Ảnh sản phẩm"
                                value={formData.imageUrl} 
                                onChange={(url) => updateField('imageUrl', url)}
                            />
                    </div>
                    {/* Preview ảnh nhỏ */}
                    <div className="w-16 h-16 mt-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" 
                                 onError={(e) => e.target.style.display = 'none'} />
                        ) : (
                            <span className="text-[10px] text-gray-400">No Img</span>
                        )}
                    </div>
                </div>

                {/* 4. Mô tả */}
                <Input 
                    label="Mô tả chi tiết" 
                    multiline={true} // Dùng textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về dịch vụ..."
                />

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 active:scale-95 transition-all shadow-md shadow-cyan-200 disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;