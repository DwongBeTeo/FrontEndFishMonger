import React, { useMemo, useState } from 'react';
import { Search, Edit, Trash2, Layers2, CornerDownRight, Folder, FileText, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { buildCategoryTree } from '../../../util/buildCategoryTree';
import { removeAccents } from '../../../util/removeAccents';
const CategoryList = ({categories= [],onEditCategory, onDeleteCategory, onRestoreCategory}) => {
    const [searchTerm, setSearchTerm] = useState('');
    // 1. State lưu các ID đang bị thu gọn
    const [collapsedIds, setCollapsedIds] = useState([]);

    // 2. Tính toán xem ID nào là Cha (có con) để hiện nút mũi tên
    const parentIds = useMemo(() => {
        return new Set(categories.map(cat => cat.parentId).filter(id => id));
    }, [categories]);

    // 3. Hàm xử lý toggle (đóng/mở)
    const toggleCollapse = (id) => {
        setCollapsedIds(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id) // Nếu đang đóng thì mở ra (xóa khỏi list)
                : [...prev, id] // Nếu đang mở thì đóng lại (thêm vào list)
        );
    };

    // 4. Xử lý dữ liệu hiển thị (Logic cốt lõi)
    const displayCategories = useMemo(() => {
      // A: Có tìm kiếm -> Trả về danh sách phẳng (Flat) để không bị gãy cây
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        return categories.filter(cat => 
          // cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // cat.description?.toLowerCase().includes(searchTerm.toLowerCase())

          removeAccents(cat.name).includes(search) ||
          (cat.description && removeAccents(cat.description).includes(search))
        );
      }

      // B: Dựng cây -> Sau đó lọc theo trạng thái đóng/mở
      const treeData = buildCategoryTree(categories);
      const visibleItems = [];
      const hiddenParentIds = new Set(); // Set tạm để lưu các cha đang bị ẩn

      treeData.forEach(item => {
          // Logic lọc đệ quy trên danh sách phẳng:
          
          // Trường hợp 1: Nếu cha của item này nằm trong danh sách "đang ẩn"
          // -> Item này cũng phải ẩn theo.
          if (item.parentId && hiddenParentIds.has(item.parentId)) {
              hiddenParentIds.add(item.id); // Đánh dấu item này cũng đang ẩn (để ẩn con của nó)
              return; // Bỏ qua, không push vào visibleItems
          }

          // Trường hợp 2: Item này được hiển thị, nhưng người dùng đã bấm thu gọn nó
          if (collapsedIds.includes(item.id)) {
              hiddenParentIds.add(item.id); // Đánh dấu để các vòng lặp sau ẩn con của item này
          }

          // Nếu vượt qua các check trên -> Hiển thị
          visibleItems.push(item);
      });

      return visibleItems;
      
    }, [categories, searchTerm, collapsedIds]); // Chạy lại khi search hoặc collapsedIds thay đổi

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header: Title & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-100 gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                        <Layers2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Danh sách danh mục</h2>
                </div>

                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Table List */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên danh mục (Cây)</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Loại</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayCategories.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Không tìm thấy danh mục nào.
                                </td>
                            </tr>
                        ) : (
                            displayCategories.map((item) => {
                                // Kiểm tra xem dòng này có phải là cha (có con) không
                                const hasChildren = parentIds.has(item.id);
                                const isCollapsed = collapsedIds.includes(item.id);
                                
                                // === LOGIC XÓA MỀM ===
                                // Kiểm tra xem item này đã bị xóa chưa (giả sử DB lưu 1 là xóa, 0 là chưa)
                                const isDeleted = item.isDeleted === 1 || item.isDeleted === true;

                                return (
                                    <tr key={item.id} 
                                        className={`transition-colors group ${
                                            // Nếu đã xóa thì nền đỏ nhạt, ngược lại hover xám
                                            isDeleted ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                                        }`}
                                    >

                                        {/* ID */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                                            #{item.id?.toString().padStart(2, '0')}
                                        </td>

                                        {/* CỘT CÂY THƯ MỤC */}
                                        <td className="px-6 py-4">
                                            <div
                                                className={`flex items-center gap-2 ${isDeleted ? 'opacity-60' : ''}`} // Làm mờ nếu đã xóa
                                                style={{ paddingLeft: searchTerm ? 0 : `${(item.level || 0) * 40}px` }}
                                            >
                                                {/* Nút Toggle (Chỉ hiện nếu có con và không search) */}
                                                {!searchTerm && (
                                                    <button
                                                        onClick={() => toggleCollapse(item.id)}
                                                        className={`p-1 rounded hover:bg-gray-200 text-gray-500 transition-all ${!hasChildren ? 'invisible' : ''}`}
                                                    >
                                                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                                                    </button>
                                                )}

                                                {/* Ảnh/Icon */}
                                                <div className={`relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 flex items-center justify-center cursor-pointer
                                                                ${isDeleted ? 'bg-gray-100' : (item.level === 0 ? 'bg-blue-50' : 'bg-gray-50')}`}
                                                     onClick={() => hasChildren && !searchTerm && toggleCollapse(item.id)}
                                                >
                                                    {item.icon ? (
                                                        <img src={item.icon} alt={item.name} className={`w-full h-full object-cover ${isDeleted ? 'grayscale' : ''}`} />
                                                    ) : (
                                                        isDeleted 
                                                            ? <Trash2 size={16} className="text-red-300"/> 
                                                            : (item.level === 0 ? <Folder size={18} className="text-blue-500" /> : <FileText size={16} className="text-gray-400" />)
                                                    )}
                                                </div>

                                                {/* Tên & Mô tả */}
                                                <div className="flex flex-col select-none" onClick={() => hasChildren && !searchTerm && toggleCollapse(item.id)}>
                                                    <span className={`text-sm cursor-pointer 
                                                        ${item.level === 0 ? 'font-bold' : 'font-medium'} 
                                                        ${isDeleted ? 'text-red-500 line-through decoration-red-300' : 'text-gray-800'}` // Gạch ngang nếu xóa
                                                    }>
                                                        {item.name}
                                                        {isDeleted && <span className="ml-2 text-[11px] text-red-400 italic no-underline font-normal">(Đã xóa)</span>}
                                                    </span>
                                                    
                                                    {searchTerm && item.parentName && (
                                                        <span className="text-[10px] text-gray-400">Thuộc: {item.parentName}</span>
                                                    )}
                                                    
                                                    {!searchTerm && (
                                                        <span className={`text-xs mt-0.5 line-clamp-1 max-w-[200px] ${isDeleted ? 'text-red-300' : 'text-gray-400'}`}>
                                                            {item.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Loại */}
                                        <td className={`px-6 py-4 ${isDeleted ? 'opacity-50' : ''}`}>
                                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                                {item.type || 'N/A'}
                                            </span>
                                        </td>

                                        {/* Sản phẩm */}
                                        <td className={`px-6 py-4 ${isDeleted ? 'opacity-50' : ''}`}>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700`}>
                                                {item.productCount || 0} sản phẩm
                                            </span>
                                        </td>

                                        {/* Hành động */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                
                                                {isDeleted ? (
                                                    // === NẾU ĐÃ XÓA: HIỆN NÚT KHÔI PHỤC ===
                                                    <button
                                                        onClick={() => onRestoreCategory && onRestoreCategory(item.id)}
                                                        className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                        title="Khôi phục danh mục"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    // === NẾU CHƯA XÓA: HIỆN SỬA VÀ XÓA ===
                                                    <>
                                                        <button
                                                            onClick={() => onEditCategory && onEditCategory(item)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteCategory && onDeleteCategory(item.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Xóa danh mục"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}

                                            </div>
                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CategoryList;