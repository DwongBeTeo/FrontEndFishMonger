import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductList from '../../components/admin/product/ProductList';
import axiosConfig from '../../util/axiosConfig';
import { API_ENDPOINTS } from '../../util/apiEndpoints';

const ProductAdmin = () => {
    const [loading, setLoading] = useState(false);
    
    // 1. State lưu danh sách sản phẩm & phân trang
    const [pagination, setPagination] = useState({
        products: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 10
    });

    // 2. State lưu bộ lọc (Search & Filter)
    const [filters, setFilters] = useState({
        keyword: '',
        categoryId: '', // Giá trị rỗng nghĩa là chọn "Tất cả"
        status: ''      // Giá trị rỗng nghĩa là chọn "Tất cả"
    });

    // 3. State lưu danh sách Category (để hiển thị trong Dropdown lọc)
    const [categories, setCategories] = useState([]);

    // --- HÀM HELPER ---

    // Fetch danh sách Category để đổ vào Dropdown
    const fetchCategories = async () => {
        try {
            const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES); // Dùng endpoint lấy category của bạn
            if (res.status === 200) {
                setCategories(res.data); // Giả sử API trả về mảng CategoryDTO
            }
        } catch (err) {
            console.error("Lỗi lấy danh mục:", err);
        }
    };

    // Fetch dữ liệu sản phẩm (Có kèm filter)
    const fetchProducts = async (page = 0) => {
        setLoading(true);
        try {
            // Chuẩn bị tham số params
            const params = {
                page: page,
                size: pagination.pageSize,
                // Chỉ gửi param nếu có giá trị
                keyword: filters.keyword || undefined, 
                categoryId: filters.categoryId || undefined,
                status: filters.status || undefined
            };

            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_PRODUCTS, { params });

            if (response.status === 200) {
                const data = response.data;
                console.log("API response: ", data);
                const pageInfo = data.page || {};
                console.log("Page Info: ", pageInfo);
                setPagination({
                    products: data.content || [],
                    totalPages: pageInfo.totalPages,
                    totalElements: pageInfo.totalElements || 0,
                    currentPage: pageInfo.number || 0,
                    pageSize: pageInfo.size
                });
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    // --- EFFECT ---

    // 1. Chạy 1 lần khi mount: Lấy danh mục & Lấy sản phẩm ban đầu
    useEffect(() => {
        fetchCategories();
        // fetchProducts(0);
    }, []);

    // 2. Lắng nghe sự thay đổi của Filters (Category, Status)
    // Khi chọn dropdown -> Gọi API ngay lập tức và reset về trang 0
    useEffect(() => {
        fetchProducts(0);
    }, [filters.categoryId, filters.status]);

    // 3. Xử lý Debounce cho Keyword (Chờ người dùng ngừng gõ 500ms mới gọi API)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(0); // Reset về trang 0 khi tìm kiếm
        }, 500); // Delay 500ms

        return () => clearTimeout(timer); // Cleanup function
    }, [filters.keyword]);


    // --- HANDLERS ---

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            keyword: '',
            categoryId: '',
            status: ''
        });
        // fetchProducts(0) sẽ tự chạy do useEffect lắng nghe filters thay đổi
    };

    // ... (Giữ nguyên các hàm handleEdit, handleDelete, render...)


    console.log("State Pagination hiện tại:", pagination);
    return (
        <div className="my-5 mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
                    <p className="text-sm text-gray-500 mt-1">Tổng số: {pagination.totalElements} sản phẩm</p>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all font-medium">
                    <Plus size={18} />
                    <span>Thêm sản phẩm</span>
                </button>
            </div>

            {/* --- FILTER BAR (Phần mới thêm) --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    
                    {/* 1. Tìm kiếm theo tên */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            name="keyword"
                            value={filters.keyword}
                            onChange={handleFilterChange}
                            placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* 2. Lọc theo Danh mục */}
                    <div className="w-full md:w-48">
                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Lọc theo Trạng thái */}
                    <div className="w-full md:w-48">
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="AVAILABLE">Đang bán</option>
                            <option value="OUT_OF_STOCK">Hết hàng</option>
                            <option value="INACTIVE">Đã ẩn</option>
                        </select>
                    </div>

                    {/* 4. Nút Xóa bộ lọc */}
                    {(filters.keyword || filters.categoryId || filters.status) && (
                        <button 
                            onClick={clearFilters}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            <X size={16} />
                            Xóa lọc
                        </button>
                    )}
                </div>
            </div>

            {/* Product List */}
            <ProductList 
                products={pagination.products}
                isLoading={loading}
                // onEdit... onDelete...
            />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
                <span>
                    Trang {pagination.currentPage + 1} / {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.currentPage === 0}
                        onClick={() => fetchProducts(pagination.currentPage - 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                    <button 
                        disabled={pagination.currentPage >= pagination.totalPages - 1}
                        onClick={() => fetchProducts(pagination.currentPage + 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductAdmin;