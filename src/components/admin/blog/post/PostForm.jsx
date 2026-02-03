import React, { useState, useEffect, useMemo, useRef } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import Input from '../../../../components/common/Input';
import ImageUploader from '../../../../components/common/ImageUploader';
import uploadImage from '../../../../util/uploadImage';
import ReactQuill from 'react-quill-new';

const PostForm = ({ initialData, categories, onSubmit, onCancel, loading }) => {
    const quillRef = useRef(null); // Ref để truy cập Editor

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        thumbnail: '',
        shortDescription: '',
        content: '',
        categoryId: '',
        isHome: false,
        isActive: true,
        metaTitle: '',
        metaKeyword: '',
        metaDescription: ''
    });

    // Load dữ liệu khi sửa
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                thumbnail: initialData.thumbnail || '',
                shortDescription: initialData.shortDescription || '',
                content: initialData.content || '',
                categoryId: initialData.categoryId || '',
                isHome: initialData.isHome ?? false,
                isActive: initialData.isActive ?? true,
                metaTitle: initialData.metaTitle || '',
                metaKeyword: initialData.metaKeyword || '',
                metaDescription: initialData.metaDescription || ''
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- CUSTOM IMAGE HANDLER CHO QUILL ---
    // Logic: Chọn ảnh -> Upload Cloudinary -> Lấy URL -> Chèn vào Editor
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                try {
                    // 1. Upload lên Cloudinary
                    const url = await uploadImage(file); 
                    
                    // 2. Chèn URL vào Editor
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    // Chèn ảnh vào vị trí con trỏ
                    quill.insertEmbed(range.index, 'image', url); 
                } catch (error) {
                    console.error('Upload failed', error);
                    alert("Lỗi upload ảnh vào bài viết!");
                }
            }
        };
    };

    // Cấu hình Toolbar (Dùng useMemo để không bị render lại)
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'], // Nút image sẽ gọi handler ở dưới
                ['clean']
            ],
            handlers: {
                image: imageHandler // Gán custom handler
            }
        }
    }), []);

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="relative">
            
            {/* --- GRID LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20"> {/* mb-20 để chừa chỗ cho thanh Action Bar fixed bên dưới */}
                
                {/* Cột Trái (2 phần): Nội dung chính */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                        <Input 
                            label="Tiêu đề bài viết *" 
                            value={formData.title} 
                            onChange={(e) => handleChange('title', e.target.value)} 
                            placeholder="Nhập tiêu đề bài viết..." 
                        />
                        
                        {/* Editor */}
                        <div className="space-y-2">
                            <label className="text-[13px] text-slate-800 font-medium block">Nội dung chi tiết</label>
                            <div className="h-[500px]"> {/* Tăng chiều cao lên chút cho thoải mái */}
                                <ReactQuill 
                                    ref={quillRef}
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => handleChange('content', content)}
                                    modules={modules}
                                    className="h-[450px]" // Trừ hao thanh toolbar
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Input 
                                label="Mô tả ngắn (Sapo)" 
                                value={formData.shortDescription} 
                                onChange={(e) => handleChange('shortDescription', e.target.value)} 
                                multiline 
                                placeholder="Đoạn văn ngắn hiển thị dưới tiêu đề..." 
                            />
                        </div>
                    </div>
                </div>

                {/* Cột Phải (1 phần): Cấu hình */}
                <div className="space-y-6">
                    
                    {/* Panel 1: Thông tin chung */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 border-b pb-2">Thông tin chung</h3>
                        
                        <ImageUploader 
                            label="Ảnh đại diện (Thumbnail)" 
                            value={formData.thumbnail} 
                            onChange={(url) => handleChange('thumbnail', url)} 
                        />

                        {/* ... (Select danh mục và Checkbox giữ nguyên) ... */}
                        <div>
                            <label className="text-[13px] text-slate-800 block mb-1">Danh mục *</label>
                            <select 
                                className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:border-cyan-500"
                                value={formData.categoryId}
                                onChange={(e) => handleChange('categoryId', e.target.value)}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                <input type="checkbox" checked={formData.isActive} onChange={e => handleChange('isActive', e.target.checked)} className="w-4 h-4 text-cyan-600 rounded"/>
                                <span className="text-sm text-gray-700">Hiển thị bài viết</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                <input type="checkbox" checked={formData.isHome} onChange={e => handleChange('isHome', e.target.checked)} className="w-4 h-4 text-cyan-600 rounded"/>
                                <span className="text-sm text-gray-700">Nổi bật (Hiện trang chủ)</span>
                            </label>
                        </div>
                    </div>

                    {/* Panel 2: SEO */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 border-b pb-2">Cấu hình SEO</h3>
                        <Input label="Meta Title" value={formData.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
                        <Input label="Meta Keyword" value={formData.metaKeyword} onChange={(e) => handleChange('metaKeyword', e.target.value)} />
                        <Input label="Meta Description" value={formData.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} multiline />
                    </div>
                </div>
            </div>

            {/* --- ACTION BAR (FIXED BOTTOM) --- */}
            <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white border-t border-gray-200 p-4 shadow-lg z-10 flex justify-end items-center gap-4">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Hủy bỏ
                </button>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="px-8 py-2.5 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {loading ? 'Đang lưu...' : 'Lưu bài viết'}
                </button>
            </div>

        </form>
    );
};

export default PostForm;