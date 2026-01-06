import { Eye, EyeOff, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CategoryList from "../../components/admin/category/CategoryList";
import { API_ENDPOINTS } from "../../util/apiEndpoints";
import axiosConfig from "../../util/axiosConfig";
import toast from "react-hot-toast";
import { Modal } from "../../components/Modal";
import AddCategoryForm from "../../components/admin/category/AddCategoryForm";

const CategoryAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);

    // Kiểm soát việc hiển thị danh mục đã xóa
    const [showDeleted, setShowDeleted] = useState(false);

    // State quản lý Modal
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState('ADD'); // 'ADD' hoặc 'EDIT'
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Fetch dữ liệu
    const fetchCategoriesDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Không thể tải danh sách danh mục.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriesDetails();
    }, []);

    // Mở Modal Thêm mới
    const handleOpenAddModal = () => {
        setModalType('ADD');
        setSelectedCategory(null); // Reset dữ liệu cũ
        setOpenModal(true);
    };

    // Mở Modal Chỉnh sửa
    const handleOpenEditModal = (category) => {
        setModalType('EDIT');
        setSelectedCategory(category);
        setOpenModal(true);
    };

    // Đóng Modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCategory(null);
    };

    // Xử lý chung cho cả Thêm và Sửa (Submit Form)
    const handleSubmitCategory = async (formData) => {
        try {
            if (modalType === 'ADD') {
                // Logic Thêm mới
                // Check trùng tên client-side (Optional - nên để backend check chuẩn hơn)
                const isExist = categoryData.some(
                    cat => cat.name.toLowerCase() === formData.name.trim().toLowerCase()
                );
                if (isExist) {
                    toast.error('Tên danh mục đã tồn tại!');
                    return; // Dừng lại, không đóng modal
                }

                await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, formData);
                toast.success('Thêm danh mục thành công');

            } else {
                // Logic Cập nhật
                // formData lúc này đã có id từ selectedCategory (được merge ở form con)
                await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(selectedCategory.id), formData);
                toast.success('Cập nhật danh mục thành công');
            }

            // Thành công thì đóng modal và reload lại bảng
            handleCloseModal();
            fetchCategoriesDetails();

        } catch (error) {
            console.error('Error submitting category:', error);
            // Lấy message lỗi từ backend trả về nếu có
            const msg = error.response?.data?.message || error.message;
            toast.error(`Thất bại: ${msg}`);
            throw error; // Ném lỗi để form con biết mà tắt loading
        }
    };

    // Xóa danh mục
    const handleDeleteCategory = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(id));
                console.log("Delete ID:", id); // Tạm log
                toast.success('Đã xóa danh mục');
                fetchCategoriesDetails();
            } catch (error) {
                console.error('Error deleting:', error);
                toast.error('Xóa thất bại');
            }
        }
    };

    // hàm sử lý khôi phục danh mục
    const handleRestoreCategory = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn khôi phục danh mục này?")) {
            try {
                await axiosConfig.put(API_ENDPOINTS.RESTORE_CATEGORY(id));
                toast.success('Đã khôi phục danh mục');
                fetchCategoriesDetails();
            } catch (error) {
                console.error('Error restoring:', error);
                toast.error('Khôi phục thất bại');
            }
        }
    };

    // Logic local danh mục dựa trên trạng thái xóa
    const processedData = useMemo(() => {
        // Nếu showDeleted = true -> Hiển thị tất cả (cả 0 và 1)
        // Nếu showDeleted = false -> Chỉ hiển thị cái chưa xóa (isDeleted = 0 hoặc null)
        if (showDeleted) {
            return categoryData;
        }
        return categoryData.filter(item => !item.isDeleted || item.isDeleted === 0);
    }, [categoryData, showDeleted]);

    return (
        <div className="my-5 mx-auto px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-semibold text-gray-800">Quản lý Danh mục</h2>
                <div className="flex gap-3">
                    {/* 4. Nút Toggle hiển thị thùng rác */}
                    <button
                        onClick={() => setShowDeleted(!showDeleted)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                            showDeleted 
                            ? 'bg-orange-100 border-orange-200 text-orange-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {showDeleted ? <Eye size={18} /> : <EyeOff size={18} />}
                        <span>{showDeleted ? 'Ẩn mục đã xóa' : 'Hiện mục đã xóa'}</span>
                    </button>

                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Thêm Danh mục</span>
                    </button>
                </div>
            </div>

            {/* List Table */}
            <CategoryList
                categories={processedData}
                onEditCategory={handleOpenEditModal}
                onDeleteCategory={handleDeleteCategory}
                onRestoreCategory={handleRestoreCategory}
            />

            {/* Shared Modal for Add & Edit */}
            <Modal
                isOpen={openModal}
                onClose={handleCloseModal}
                title={modalType === 'ADD' ? "Thêm danh mục mới" : "Cập nhật danh mục"}
            >
                <AddCategoryForm
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitCategory}
                    initialData={selectedCategory}
                    isEditing={modalType === 'EDIT'}
                    categories={categoryData} // Truyền data để lọc Parent Options
                />
            </Modal>
        </div>
    );
};

export default CategoryAdmin;