import React from 'react';
import { Edit, Trash2, Eye, CheckCircle, XCircle, Star, RotateCcw } from 'lucide-react';

const PostList = ({ posts, onEdit, onDelete, onRestore, isTrash }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4 w-[80px]">Ảnh</th>
                            <th className="px-6 py-4 w-[300px]">Tiêu đề / Slug</th>
                            <th className="px-6 py-4">Danh mục</th>
                            <th className="px-6 py-4 text-center">Lượt xem</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                {/* Thumbnail */}
                                <td className="px-6 py-4">
                                    <img 
                                        src={post.thumbnail || 'https://via.placeholder.com/50'} 
                                        alt="" 
                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                    />
                                </td>

                                {/* Title & Info */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 line-clamp-2" title={post.title}>
                                        {post.title}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 font-mono truncate max-w-[250px]">
                                        /{post.slug}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {post.isHome && (
                                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <Star size={10} fill="currentColor"/> Hot
                                            </span>
                                        )}
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                        {post.categoryName}
                                    </span>
                                </td>

                                {/* View Count */}
                                <td className="px-6 py-4 text-center text-gray-500">
                                    <div className="flex items-center justify-center gap-1">
                                        <Eye size={14}/> {post.viewCount}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 text-center">
                                    {post.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                                            <CheckCircle size={12}/> Hiển thị
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                                            <XCircle size={12}/> Ẩn
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                    {isTrash ? (
                                        <button 
                                            onClick={() => onRestore(post.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200 transition-all font-medium text-xs"
                                        >
                                            <RotateCcw size={14} /> Khôi phục
                                        </button>
                                    ) : (
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => onEdit(post)} 
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Sửa bài viết"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(post.id)} 
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Xóa bài viết"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostList;