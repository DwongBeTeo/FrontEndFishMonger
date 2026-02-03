import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

// hiển thị tóm tắt bài viết
const BlogCard = ({ post }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all h-full flex flex-col group">
            {/* Thumbnail */}
            <Link to={`/blog/${post.slug}`} className="relative h-48 overflow-hidden block">
                <img 
                    src={post.thumbnail || 'https://via.placeholder.com/400x250'} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {post.categoryName}
                </span>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-1"><Eye size={14}/> {post.viewCount} lượt xem</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-cyan-600 transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>

                {/* Short Desc */}
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                    {post.shortDescription}
                </p>

                {/* Footer Link */}
                <Link to={`/blog/${post.slug}`} className="text-sm font-medium text-cyan-600 flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                    Đọc tiếp <ArrowRight size={16}/>
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;