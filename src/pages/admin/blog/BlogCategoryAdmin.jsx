import React, { useEffect, useState } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';
import { Plus, Archive } from 'lucide-react';
import CategoryList from '../../../components/admin/blog/category/CategoryList';
import CategoryForm from '../../../components/admin/blog/category/CategoryForm';
import TrashCan from '../../../components/common/TrashCan';
import { Modal } from '../../../components/Modal';

const BlogCategoryAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Modal Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Trash State
    const [showTrash, setShowTrash] = useState(false);
    const [trashData, setTrashData] = useState([]);
    const [trashLoading, setTrashLoading] = useState(false);

    // 1. Fetch Danh sách chính
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axiosConfig.get('/admin/blog/categories'); // Cần thêm API này ở Backend
            setCategories(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch Thùng rác
    const fetchTrash = async () => {
        setTrashLoading(true);
        setShowTrash(true);
        try {
            const res = await axiosConfig.get('/admin/blog/categories/trash');
            setTrashData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setTrashLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ... Logic CRUD (Create, Update, Delete)
    const handleSave = async (formData) => {
        try {
            if (editingCategory) {
                await axiosConfig.put(`/admin/blog/categories/${editingCategory.id}`, formData);
            } else {
                await axiosConfig.post('/admin/blog/categories', formData);
            }
            Swal.fire('Thành công', 'Đã lưu danh mục!', 'success');
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Chuyển vào thùng rác?',
            text: "Bạn có thể khôi phục lại sau.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });
        if (result.isConfirmed) {
            try {
                await axiosConfig.delete(`/admin/blog/categories/${id}`);
                Swal.fire('Đã xóa', 'Danh mục đã chuyển vào thùng rác.', 'success');
                fetchCategories();
            } catch (error) {
                const errorMessage = error.response?.data?.message || '';
                if (errorMessage.includes('')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Không thể xóa',
                        html: `Danh mục này đang chứa các bài viết.<br/>Vui lòng <b>xóa </b> các bài viết trong danh mục trước khi xóa danh mục này.`,
                        confirmButtonText: 'Đã hiểu'
                    });
                } else {
                    Swal.fire('Lỗi',errorMessage, 'error');
                }
            }
        }
    };

    const handleRestore = async (id) => {
        try {
            await axiosConfig.put(`/admin/blog/categories/${id}/restore`);
            Swal.fire('Thành công', 'Đã khôi phục danh mục (Trạng thái đang Ẩn).', 'success');
            fetchTrash(); // Refresh thùng rác
            fetchCategories(); // Refresh list chính (ngầm)
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message, 'error');
        }
    };

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục Blog</h1>
                    <p className="text-sm text-gray-500">Phân loại bài viết website</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchTrash}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        <Archive size={18} /> Thùng rác
                    </button>
                    <button 
                        onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 shadow-md font-medium"
                    >
                        <Plus size={18} /> Thêm mới
                    </button>
                </div>
            </div>

            <CategoryList 
                categories={categories} 
                onEdit={(cat) => { setEditingCategory(cat); setIsModalOpen(true); }}
                onDelete={handleDelete}
            />

            {/* Modal Form */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            >
                <CategoryForm 
                    initialData={editingCategory}
                    onSubmit={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Trash View */}
            {showTrash && (
                <TrashCan 
                    title="Danh mục Blog"
                    data={trashData}
                    isLoading={trashLoading}
                    onClose={() => setShowTrash(false)}
                    onRestore={handleRestore}
                />
            )}
        </div>
    );
};

export default BlogCategoryAdmin;