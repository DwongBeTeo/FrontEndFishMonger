import React, { useState, useEffect } from 'react';
import Input from '../../../common/Input';

const CategoryForm = ({ initialData, onSubmit, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        isActive: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                metaTitle: initialData.metaTitle || '',
                metaKeyword: initialData.metaKeyword || '',
                metaDescription: initialData.metaDescription || '',
                isActive: initialData.isActive ?? true
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4 p-1">
            <div className="grid grid-cols-1 gap-4">
                <Input label="Tên danh mục *" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="VD: Kiến thức nuôi cá" />
                <Input label="Mô tả ngắn" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} multiline placeholder="Mô tả về danh mục này..." />
                
                {/* SEO Section (Collapsible or just separated) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Cấu hình SEO</h4>
                    <Input label="Meta Title" value={formData.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
                    <Input label="Meta Keyword" value={formData.metaKeyword} onChange={(e) => handleChange('metaKeyword', e.target.value)} />
                    <Input label="Meta Description" value={formData.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} multiline />
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <input 
                        type="checkbox" 
                        id="isActive" 
                        checked={formData.isActive} 
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                        className="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Hiển thị danh mục này</label>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 shadow-md disabled:opacity-50">
                    {loading ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Tạo mới')}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;