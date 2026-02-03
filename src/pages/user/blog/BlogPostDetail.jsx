import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosConfig from '../../../util/axiosConfig';
import { Calendar, User, Eye, ChevronRight, Tag } from 'lucide-react';
import CategorySidebar from '../../../components/user/blog/CategorySidebar'; // Tái sử dụng

// Trang chi tiết bài viết (Hiển thị nội dung HTML từ React Quill)
const BlogPostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [categories, setCategories] = useState([]); // Để hiện sidebar bên cạnh
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Gọi song song 2 API: Chi tiết bài viết & Danh sách category
                const [postRes, catRes] = await Promise.all([
                    axiosConfig.get(`/blog/posts/${slug}`),
                    axiosConfig.get('/blog/categories')
                ]);
                setPost(postRes.data);
                setCategories(catRes.data);
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // Cuộn lên đầu trang khi chuyển bài
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div></div>;
    if (!post) return <div className="min-h-screen flex justify-center items-center text-gray-500">Bài viết không tồn tại.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-cyan-600">Trang chủ</Link>
                    <ChevronRight size={16} className="mx-2"/>
                    <Link to="/blog" className="hover:text-cyan-600">Blog</Link>
                    <ChevronRight size={16} className="mx-2"/>
                    <span className="text-gray-800 font-medium truncate max-w-[300px]">{post.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Main Content (Chiếm 3 phần) */}
                    <div className="lg:col-span-3 min-w-0">
                        {/* overflow-hidden */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100  p-6 md:p-8">
                            
                            {/* Header Post */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                {post.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                                    {post.categoryName}
                                </span>
                                <span className="flex items-center gap-1"><Calendar size={16}/> {new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
                                <span className="flex items-center gap-1"><User size={16}/> {post.authorName || 'Admin'}</span>
                                <span className="flex items-center gap-1"><Eye size={16}/> {post.viewCount} lượt xem</span>
                            </div>

                            {/* Sapo (Mô tả ngắn) */}
                            <div className="text-gray-600 font-medium italic mb-8 bg-gray-50 p-4 rounded-lg border-l-4 border-cyan-500">
                                {post.shortDescription}
                            </div>

                            {/* HTML Content (Render từ ReactQuill) */}
                            {/* QUAN TRỌNG: Dùng class 'prose' của Tailwind Typography để format HTML đẹp tự động */}
                            <div 
                                className="prose prose-cyan max-w-none text-gray-800"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            ></div>

                            {/* Tags / Meta Keywords (Nếu có) */}
                            {post.metaKeyword && (
                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2">
                                    <Tag size={18} className="text-gray-400"/>
                                    <span className="font-bold text-gray-700 mr-2">Từ khóa:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {post.metaKeyword.split(',').map((tag, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-gray-200 cursor-pointer transition-colors">
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar (Chiếm 1 phần) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Tái sử dụng CategorySidebar nhưng logic click sẽ navigate về trang list */}
                        <CategorySidebar 
                            categories={categories} 
                            selectedCatId={post.categoryId} // Highlight category hiện tại
                            onSelectCategory={(id) => window.location.href = `/blog`} // Chuyển trang đơn giản
                        />
                        
                        {/* Banner Quảng cáo hoặc Bài viết liên quan có thể đặt ở đây */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostDetail;