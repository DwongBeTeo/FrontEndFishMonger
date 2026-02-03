import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const CategoryList = ({ categories, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-4">Tên danh mục</th>
                        <th className="px-6 py-4">Slug (URL)</th>
                        <th className="px-6 py-4 text-center">Bài viết</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                            <td className="px-6 py-4 text-center">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                    {cat.postCount || 0}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                {cat.isActive ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                                        <CheckCircle size={12}/> Hiển thị
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                                        <XCircle size={12}/> Ẩn
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => onEdit(cat)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => onDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryList;