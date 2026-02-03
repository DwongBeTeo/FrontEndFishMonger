import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosConfig from '../../../util/axiosConfig';
import BlogCard from '../../../components/user/blog/BlogCard';
import CategorySidebar from '../../../components/user/blog/CategorySidebar';
import Pagination from '../../../components/common/Pagination'; // Tái sử dụng Pagination common
import { Search } from 'lucide-react';

// Trang chính kết hợp danh sách bài viết, phân trang và sidebar.
const BlogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // State
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter Params
    const page = parseInt(searchParams.get('page') || '0');
    const categoryId = searchParams.get('category') ? parseInt(searchParams.get('category')) : null;

    // 1. Fetch Categories (Chỉ gọi 1 lần)
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axiosConfig.get('/blog/categories');
                setCategories(res.data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchCats();
    }, []);

    // 2. Fetch Posts (Gọi khi page hoặc category thay đổi)
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await axiosConfig.get('/blog/posts', {
                    params: {
                        page: page,
                        size: 9, // 9 bài mỗi trang (grid 3x3 đẹp)
                        categoryId: categoryId
                    }
                });
                setPosts(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [page, categoryId]);

    // Handle Filter Change
    const handleCategoryChange = (catId) => {
        if (catId) {
            setSearchParams({ category: catId, page: 0 }); // Reset về trang 0 khi đổi danh mục
        } else {
            setSearchParams({ page: 0 }); // Xóa param category nếu chọn 'Tất cả'
        }
    };

    const handlePageChange = (newPage) => {
        const currentParams = Object.fromEntries([...searchParams]);
        setSearchParams({ ...currentParams, page: newPage });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header Banner */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Kiến Thức & Tin Tức</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Cập nhật những kinh nghiệm nuôi cá cảnh, phong thủy và tin tức mới nhất từ FishSeller.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Left Sidebar (Danh mục) */}
                    <div className="lg:col-span-1 space-y-6">
                        <CategorySidebar 
                            categories={categories} 
                            selectedCatId={categoryId} 
                            onSelectCategory={handleCategoryChange} 
                        />
                        
                        {/* Có thể thêm component FeaturedPosts (Bài viết nổi bật) ở đây nếu muốn */}
                        {/* <FeaturedPosts /> */} 
                    </div>

                    {/* Main Content (Danh sách bài viết) */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="bg-white rounded-xl h-80 animate-pulse"></div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="bg-white p-10 rounded-xl text-center shadow-sm">
                                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600">Không tìm thấy bài viết nào</h3>
                                <p className="text-gray-400">Vui lòng thử chọn danh mục khác.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {posts.map(post => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>

                                <Pagination 
                                    currentPage={page} 
                                    totalPages={totalPages} 
                                    onPageChange={handlePageChange} 
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;