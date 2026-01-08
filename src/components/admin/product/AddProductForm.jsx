import React, { useState, useEffect, useMemo } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import Input from '../../common/Input'; // Import Input dùng chung
import ImageUploader from '../../common/ImageUploader'; // Import ImageUploader

const AddProductForm = ({ isEditing, onSubmit, onClose, initialData, categories = [] }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // const isEditing = Boolean(initialData && initialData.id);

    // 1. Chuẩn bị dữ liệu Options cho Select (Input.jsx yêu cầu format {value, label})
    const categoryOptions = useMemo(() => {
        return categories.map(cat => ({ value: cat.id, label: cat.name }));
    }, [categories]);

    const statusOptions = [
        { value: 'AVAILABLE', label: 'Đang bán (Available)' },
        { value: 'OUT_OF_STOCK', label: 'Hết hàng (Out of Stock)' },
        { value: 'INACTIVE', label: 'Ẩn sản phẩm (Hidden)' } // Sửa lại value cho khớp với logic filter
    ];

    // 2. State Form
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        status: 'AVAILABLE',
        description: '',
        imageUrl: '',
        metaTitle: '',
        metaKeyword: '',
        slug: ''
    });

    // 3. Load dữ liệu khi Edit
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || 0,
                stockQuantity: initialData.stockQuantity || 0,
                categoryId: initialData.categoryId || '',
                status: initialData.status || 'AVAILABLE',
                description: initialData.description || '',
                imageUrl: initialData.imageUrl || '',
                metaTitle: initialData.metaTitle || '',
                metaKeyword: initialData.metaKeyword || '',
                slug: initialData.slug || ''
            });
        } else {
            // Reset form
            setFormData({
                name: '',
                price: '',
                stockQuantity: '',
                categoryId: '',
                status: 'AVAILABLE',
                description: '',
                imageUrl: '',
                metaTitle: '',
                metaKeyword: '',
                slug: ''
            });
        }
        setError('');
    }, [initialData, isEditing]);

    // 4. Helper update state (Vì Input.jsx trả về e.target.value nhưng ko kèm name trong 1 số case select)
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 5. Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) return setError('Vui lòng nhập tên sản phẩm.');
        if (!formData.price || Number(formData.price) < 0) return setError('Giá sản phẩm không hợp lệ.');
        if (!formData.categoryId) return setError('Vui lòng chọn danh mục.');

        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stockQuantity: Number(formData.stockQuantity)
            };
            await onSubmit(payload);
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-b-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {/* Hiển thị lỗi */}
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        <span className="font-medium mr-1">Lỗi:</span> {error}
                    </div>
                )}

                {/* nội dung edit, add */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* --- CỘT TRÁI: THÔNG TIN CƠ BẢN --- */}
                    <div className="flex flex-col gap-1">
                        <Input 
                            label="Tên sản phẩm"
                            placeholder="VD: Cá Koi Nhật Bản"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                        />

                        <Input 
                            label="Slug (URL)"
                            placeholder="Tu dong tao neu de trong"
                            value={formData.slug}
                            onChange={(e) => updateField('slug', e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Giá bán (VNĐ)"
                                type="number"
                                placeholder="0"
                                value={formData.price}
                                onChange={(e) => updateField('price', e.target.value)}
                            />
                            <Input 
                                label="Tồn kho"
                                type="number"
                                placeholder="0"
                                value={formData.stockQuantity}
                                onChange={(e) => updateField('stockQuantity', e.target.value)}
                            />
                        </div>

                        {/* Description (Input.jsx chưa hỗ trợ textarea nên dùng thẻ thường + style tương tự) */}
                        <div className="mb-4">
                            <label className="text-[13px] text-slate-800 block mb-1">Mô tả chi tiết</label>
                            <textarea 
                                className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 min-h-[120px]"
                                placeholder="Nhập mô tả sản phẩm..."
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: PHÂN LOẠI & ẢNH --- */}
                    <div className="flex flex-col gap-1">
                        <Input 
                            label="Danh mục"
                            isSelect={true}
                            options={categoryOptions}
                            value={formData.categoryId}
                            onChange={(e) => updateField('categoryId', e.target.value)}
                            placeholder="-- Chọn danh mục --"
                        />

                        <Input 
                            label="Trạng thái"
                            isSelect={true}
                            options={statusOptions}
                            value={formData.status}
                            onChange={(e) => updateField('status', e.target.value)}
                        />

                        {/* Image Uploader Component */}
                        <div className="mb-4">
                            <ImageUploader 
                                label="Ảnh sản phẩm"
                                value={formData.imageUrl} 
                                onChange={(url) => updateField('imageUrl', url)}
                            />
                        </div>

                        {/* SEO Section (Gộp gọn) */}
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mt-2">
                            <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase">Cấu hình SEO</h4>
                            <Input 
                                label="Meta Title"
                                placeholder="Tiêu đề hiển thị trên Google"
                                value={formData.metaTitle}
                                onChange={(e) => updateField('metaTitle', e.target.value)}
                            />

                            <Input 
                                label="Meta Keyword"
                                placeholder="Từ khóa (VD: ca koi, be ca)"
                                value={formData.metaKeyword}
                                onChange={(e) => updateField('metaKeyword', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="h-4 w-full col-span-full"></div>
                </div>
            </div>

            {/* --- FOOTER BUTTONS --- */}
            <div className="py-4 px-6 border-t border-gray-100 bg-white flex items-center justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button 
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                >
                    Hủy bỏ
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 shadow-sm"
                >
                    {loading ? <LoaderCircle className='w-4 h-4 animate-spin'/> : <Save className="w-4 h-4" />}
                    {isEditing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
            </div>
        </form>
    );
};

export default AddProductForm;