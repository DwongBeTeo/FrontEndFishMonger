import React from 'react';
import { Edit, Trash2, ImageOff, MoreHorizontal } from 'lucide-react';

const ProductList = ({ products = [], isLoading, onEdit, onDelete }) => {

    // Helper: Format tiền tệ VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Helper: Xác định trạng thái hiển thị (Màu sắc & Text)
    // Logic: Nếu Status = HIDDEN -> Đã ẩn
    // Nếu Stock = 0 -> Hết hàng (Đỏ)
    // Nếu Stock < 10 -> Sắp hết (Cam)
    // Còn lại -> Còn hàng (Xanh)
    const renderStatusBadge = (product) => {
        if (product.status === 'INACTIVE') {
            return <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">Đã ẩn</span>;
        }
        if (product.status === 'OUT_OF_STOCK' || product.stockQuantity === 0) {
            return <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-full border border-red-100">● Hết hàng</span>;
        }
        if (product.stockQuantity <= 5) {
            return <span className="px-2.5 py-1 text-xs font-semibold bg-orange-50 text-orange-600 rounded-full border border-orange-100">● Sắp hết</span>;
        }
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">● Còn hàng</span>;
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá bán</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Tồn kho</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    Chưa có sản phẩm nào trong kho.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    {/* Checkbox */}
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    </td>

                                    {/* Cột Sản phẩm (Ảnh + Tên + SKU) */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* Ảnh Thumbnail */}
                                            <div className="relative w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0">
                                                {product.imageUrl ? (
                                                    <img 
                                                        src={product.imageUrl} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageOff size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            {/* Tên & SKU */}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-[200px]" title={product.name}>
                                                    {product.name}
                                                </span>
                                                <span className="text-[11px] text-gray-400 mt-0.5 font-mono">
                                                    SKU: {product.slug || `#${product.id}`}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Danh mục */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 font-medium">
                                            {product.categoryName || '---'}
                                        </span>
                                    </td>

                                    {/* Giá bán */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-800">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </td>

                                    {/* Tồn kho */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-sm font-medium ${product.stockQuantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>

                                    {/* Trạng thái (Badge) */}
                                    <td className="px-6 py-4">
                                        {renderStatusBadge(product)}
                                    </td>

                                    {/* Hành động */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => onEdit && onEdit(product)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Sửa sản phẩm"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete && onDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;