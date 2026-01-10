import React, { useState, useMemo, useEffect } from 'react';
import Input from '../../common/Input';
import { LoaderCircle } from 'lucide-react';

const AddCategoryForm = ({ onClose, onSubmit, isEditing, initialData, categories = [] }) => {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState('');
    // 1. State lưu dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        parentId: null,
        type: 'FISH',
        description: '',
        metaTitle: '',
        metaKeyword: ''
    });

    // Effect: Điền dữ liệu khi mở form Sửa hoặc Reset khi mở form Thêm
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                name: initialData.name || '',
                parentId: initialData.parentId || null,
                type: initialData.type || 'FISH',
                description: initialData.description || '',
                metaTitle: initialData.metaTitle || '',
                metaKeyword: initialData.metaKeyword || ''
            });
        } else {
            // Reset form về mặc định
            setFormData({
                name: '',
                parentId: null,
                type: 'FISH',
                description: '',
                metaTitle: '',
                metaKeyword: ''
            });
        }
        setError('');
    }, [isEditing, initialData]);

    // 2. Tạo danh sách Options cho Parent ID
    const parentOptions = useMemo(() => {
        // Option mặc định: Chính nó là danh mục gốc
        const defaultOption = [{ value: null, label: '--- Là danh mục gốc (Không có cha) ---' }];

        // Lọc và Map: Chỉ lấy những danh mục đang là GỐC (parentId === null)
        const rootCategoryOptions = categories
            .filter(cat => !cat.parentId) // <--- ĐIỀU KIỆN QUAN TRỌNG: Chỉ lấy cái chưa có cha
            .filter(cat => cat.id !== initialData?.id) // QUAN TRỌNG: Không cho chọn chính mình làm cha (khi edit)
            .map(cat => ({
                value: cat.id,
                label: cat.name
            }));

        return [...defaultOption, ...rootCategoryOptions];
    }, [categories, initialData]);

    // 3. Options cho loại danh mục (Hardcode hoặc lấy từ API constants)
    const typeOptions = [
        { value: 'FISH', label: 'Cá cảnh (FISH)' },
        { value: 'ACCESSORY', label: 'Phụ kiện (ACCESSORY)' },
        { value: 'FOOD', label: 'Thức ăn (FOOD)' },
        { value: 'OTHER', label: 'Khác' }
    ];

    // 4. Hàm xử lý thay đổi input
    const handleChange = (field, e) => {
        // Input của bạn trả về e.target.value ngay cả với Select (do bạn đã convert trong Input.jsx)
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        if(error) setError(''); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    // 5. Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation cơ bản
        if (!formData.name.trim()) {
            setError('Tên danh mục không được để trống');
            return;
        }
        try {
            // Gọi hàm từ component cha để xử lý API
            await onSubmit(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        
        // Reset hoặc đóng form (tuỳ logic)
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col p-6 md:p-8 overflow-y-auto max-h-[80vh]">
            
            {/* Hiển thị lỗi nếu có */}
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên danh mục */}
                <div className="col-span-2">
                    <Input 
                        label="Tên danh mục" 
                        placeholder="Nhập tên danh mục (VD: Cá Koi)" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e)}
                        type="text"
                    />
                </div>

                {/* Chọn danh mục cha */}
                <Input 
                    label="Danh mục cha" 
                    isSelect={true}
                    options={parentOptions}
                    value={formData.parentId}
                    onChange={(e) => handleChange('parentId', e)}
                    placeholder="Chọn danh mục cha..."
                />

                {/* Chọn loại (Type) */}
                <Input 
                    label="Loại danh mục" 
                    isSelect={true}
                    options={typeOptions}
                    value={formData.type}
                    onChange={(e) => handleChange('type', e)}
                />

                {/* Meta Title (SEO) */}
                <Input 
                    label="Meta Title (SEO)" 
                    placeholder="Tiêu đề hiển thị trên Google" 
                    value={formData.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e)}
                    type="text"
                />

                 {/* Meta Keyword (SEO) */}
                 <Input 
                    label="Meta Keyword" 
                    placeholder="Từ khóa (VD: ca koi, be ca)" 
                    value={formData.metaKeyword}
                    onChange={(e) => handleChange('metaKeyword', e)}
                    type="text"
                />
            </div>

            {/* Description - Dùng Textarea (Input component của bạn chưa hỗ trợ textarea, tạm dùng input hoặc div riêng) */}
            <div className="mb-4">
                <label className="text-[13px] text-slate-800 block mb-1">Mô tả</label>
                <textarea 
                    className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 min-h-[100px]"
                    placeholder="Nhập mô tả chi tiết..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button 
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Hủy bỏ
                </button>
                <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <LoaderCircle className='w-4 h-4 animate-spin'/>
                            {isEditing ? 'Cập nhật...' : 'Thêm mới...'}
                        </>
                    ) : (
                        <>
                            {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AddCategoryForm;