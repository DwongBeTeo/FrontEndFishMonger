import React, { useEffect, useState } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';
import { Plus, Archive, ArrowLeft } from 'lucide-react';
import PostList from '../../../components/admin/blog/post/PostList';
import PostForm from '../../../components/admin/blog/post/PostForm';
import TrashCan from '../../../components/common/TrashCan';
import Pagination from '../../../components/common/Pagination';

const PostAdmin = () => {
    // Modes: 'LIST', 'FORM', 'TRASH'
    const [viewMode, setViewMode] = useState('LIST'); 
    
    // Data States
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [trashData, setTrashData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Edit State
    const [editingPost, setEditingPost] = useState(null);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Fetch Danh sách Categories (Để dùng trong Form)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosConfig.get('/admin/blog/categories');
                setCategories(res.data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // 2. Fetch Posts
    const fetchPosts = async () => {
        setLoading(true);
        try {
            // GET /admin/blog/posts?page=0&size=10
            const res = await axiosConfig.get('/admin/blog/posts', {
                params: { page, size: 10 }
            });
            const responseData = res.data;
            const total = responseData.page?.totalPages || 0;
            setPosts(responseData.content || []);
            setTotalPages(total
                .totalPages || 0);
        } catch (error) {
            console.error("Lỗi tải bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Fetch Trash
    const fetchTrash = async () => {
        setLoading(true);
        try {
            const res = await axiosConfig.get('/admin/blog/posts/trash');
            setTrashData(res.data.content || []); // API trả về Page hay List? Nếu Page thì .content
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Effect để load dữ liệu tùy theo viewMode
    useEffect(() => {
        if (viewMode === 'LIST') fetchPosts();
        if (viewMode === 'TRASH') fetchTrash();
    }, [viewMode, page]);

    // --- HANDLERS ---

    const handleCreateNew = () => {
        setEditingPost(null);
        setViewMode('FORM');
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setViewMode('FORM');
    };

    const handleSave = async (formData) => {
        try {
            if (editingPost) {
                await axiosConfig.put(`/admin/blog/posts/${editingPost.id}`, formData);
            } else {
                await axiosConfig.post('/admin/blog/posts', formData);
            }
            Swal.fire('Thành công', 'Đã lưu bài viết!', 'success');
            setViewMode('LIST');
            fetchPosts();
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Chuyển vào thùng rác?',
            text: "Bài viết sẽ bị ẩn khỏi trang chủ.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await axiosConfig.delete(`/admin/blog/posts/${id}`);
                Swal.fire('Đã xóa', 'Bài viết đã chuyển vào thùng rác.', 'success');
                // Optimistic update: lọc bỏ ngay lập tức
                setPosts(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                Swal.fire('Lỗi', error.response?.data?.message, 'error');
            }
        }
    };

    const handleRestore = async (id) => {
        try {
            await axiosConfig.put(`/admin/blog/posts/${id}/restore`);
            Swal.fire('Thành công', 'Đã khôi phục bài viết (Trạng thái Ẩn).', 'success');
            fetchTrash(); // Refresh thùng rác
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message, 'error');
        }
    };

    // --- RENDER ---

    if (viewMode === 'FORM') {
        return (
            <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
                <div className="mb-6 flex items-center gap-4">
                    <button onClick={() => setViewMode('LIST')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
                        <ArrowLeft size={20} className="text-gray-600"/>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {editingPost ? `Chỉnh sửa: ${editingPost.title}` : 'Thêm bài viết mới'}
                    </h1>
                </div>
                <PostForm 
                    initialData={editingPost}
                    categories={categories}
                    onSubmit={handleSave}
                    onCancel={() => setViewMode('LIST')}
                    loading={loading}
                />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài Viết</h1>
                    <p className="text-sm text-gray-500">Danh sách tin tức, kiến thức</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setViewMode('TRASH'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        <Archive size={18} /> Thùng rác
                    </button>
                    <button 
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 shadow-md font-medium"
                    >
                        <Plus size={18} /> Viết bài mới
                    </button>
                </div>
            </div>

            {/* Main List */}
            <PostList 
                posts={posts} 
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div className="mt-4">
                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            {/* Trash View Modal */}
            {viewMode === 'TRASH' && (
                <TrashCan 
                    title="Bài viết đã xóa"
                    data={trashData}
                    isLoading={loading}
                    onClose={() => { setViewMode('LIST'); fetchPosts(); }} // Close -> Quay lại list chính
                    onRestore={handleRestore}
                />
            )}
        </div>
    );
};

export default PostAdmin;