import React from 'react';
import { LayoutGrid } from 'lucide-react';

// hiển thị danh sách danh mục để lọc
const CategorySidebar = ({ categories, selectedCatId, onSelectCategory }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
                <LayoutGrid size={20} className="text-cyan-600"/>
                Danh mục bài viết
            </h3>
            <ul className="space-y-2">
                {/* Option Tất cả */}
                <li>
                    <button 
                        onClick={() => onSelectCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${!selectedCatId ? 'bg-cyan-50 text-cyan-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Tất cả chủ đề
                    </button>
                </li>
                
                {/* List Categories */}
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <button 
                            onClick={() => onSelectCategory(cat.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${selectedCatId === cat.id ? 'bg-cyan-50 text-cyan-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {cat.name}
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{cat.postCount || 0}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;