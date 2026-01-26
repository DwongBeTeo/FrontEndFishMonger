import React, { useState, useEffect, useRef, use } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductList from '../../components/admin/product/ProductList';
import axiosConfig from '../../util/axiosConfig';
import { API_ENDPOINTS } from '../../util/apiEndpoints';
import { Modal } from '../../components/Modal';
import AddProductForm from '../../components/admin/product/AddProductForm';

const ProductAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([]);

    // State quản lý Modal
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState('ADD'); // 'ADD' hoặc 'EDIT'
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // 1. State lưu danh sách sản phẩm & phân trang
    const [pagination, setPagination] = useState({
        products: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 9
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

    // --- SỬA LẠI PHẦN EFFECT ---

    // Dùng useRef để giữ debounce timeout, tránh bị reset mỗi lần render
    const debounceRef = React.useRef(null);

    useEffect(() => {
        // Hàm gọi API
        const loadData = () => {
            fetchProducts(0);
        };

        // Nếu chỉ thay đổi category hoặc status -> Gọi ngay
        // Nhưng nếu đang gõ keyword -> Cần debounce
        if (filters.keyword) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                loadData();
            }, 500);
        } else {
            // Nếu không có keyword (hoặc keyword rỗng), gọi ngay lập tức khi đổi category/status
            // Tuy nhiên để an toàn và mượt mà, ta có thể debounce nhẹ 300ms cho tất cả
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                loadData();
            }, 300);
        }

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // Gộp tất cả dependency vào đây
    }, [filters.keyword, filters.categoryId, filters.status]);

    // Xóa bỏ useEffect([]) gọi fetchCategories ban đầu nếu không cần thiết
    // Hoặc chỉ giữ lại cái gọi Categories
    useEffect(() => {
        fetchCategories();
    }, []);


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

    // Mở Modal Thêm mới
    const handleOpenAddModal = () => {
        setModalType('ADD');
        setSelectedProduct(null); // Reset dữ liệu cũ
        setOpenModal(true);
    };

    // Mở Modal Chỉnh sửa
    const handleOpenEditModal = (product) => {
        setModalType('EDIT');
        setSelectedProduct(product);
        setOpenModal(true);
    };

    // Đóng Modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    // Xử lý chung cho cả Thêm và Sửa (Submit Form)
    const handleSubmitProduct = async (formData) => {
        try {
            if(modalType === 'ADD') {
                // Logic Thêm mới sản phẩm
                await axiosConfig.post(API_ENDPOINTS.ADD_PRODUCT, formData);
                toast.success('Thêm sản phẩm thành công');
            }else {
                // Logic Cập nhật sản phẩm
                // formData lúc này đã có id từ selectedProduct (được merge ở form con)
                await axiosConfig.put(API_ENDPOINTS.UPDATE_PRODUCT(selectedProduct.id), formData);
                toast.success('Cập nhật sản phẩm thành công');
            }
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            console.error('Error submitting category:', error);
            // Lấy message lỗi từ backend trả về nếu có
            const msg = error.response?.data?.message || error.message;
            toast.error(`Thất bại: ${msg}`);
            throw error; // Ném lỗi để form con biết mà tắt loading
        }
    }

    // delete product
    const handleDeleteProduct = async (productId) => {
        if(window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')){
            try {
                await axiosConfig.delete(API_ENDPOINTS.DELETE_PRODUCT(productId));
                toast.success('Xóa sản phẩm thành công');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                const msg = error.response?.data?.message || error.message;
                toast.error(`Xóa sản phẩm thất bại: ${msg}`);
            }
        }
    }
    
    useEffect(() => {
        if (pagination.products.length > 0) {
            console.log("Dữ liệu Pagination mới cập nhật:", pagination);
        }
    }, [pagination]); // Chỉ chạy khi pagination thay đổi

    return (
        <div className="my-5 mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
                    <p className="text-sm text-gray-500 mt-1">Tổng số: {pagination.totalElements} sản phẩm</p>
                </div>
                
                <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all font-medium"
                >
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
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProduct}
            />

            {/* Modal add and edit product */}
            <Modal
                isOpen={openModal}
                onClose={handleCloseModal}
                title={modalType === 'ADD' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
            >
                <AddProductForm 
                    onSubmit={handleSubmitProduct}
                    onClose={handleCloseModal}
                    isEditing={modalType === 'EDIT'}
                    initialData={selectedProduct}
                    categories={categories}
                />
            </Modal>

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