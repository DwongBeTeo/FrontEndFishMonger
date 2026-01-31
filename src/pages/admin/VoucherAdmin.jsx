import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import axiosConfig from '../../util/axiosConfig';
import Swal from 'sweetalert2';
import { Modal } from '../../components/Modal';
import Pagination from '../../components/common/Pagination';
import VoucherForm from '../../components/admin/voucher/VoucherForm';
import VoucherList from '../../components/admin/voucher/VoucherList';

const VoucherAdmin = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null); // Null = Create, Object = Update
    
    // Search & Pagination
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Fetch Data
    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await axiosConfig.get('/admin/vouchers', {
                params: {
                    keyword: keyword,
                    page: page,
                    size: 10
                }
            });
            const responseData = res.data;
            const total = responseData.page?.totalPages || 0;
            setVouchers(responseData.content);
            setTotalPages(total);
        } catch (error) {
            console.error("Lỗi tải voucher:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(0); // Reset về trang 0 khi search
    }, [keyword]);

    useEffect(() => {
        fetchVouchers();
    }, [page, keyword]);

    // 2. Handlers Modal
    const openCreateModal = () => {
        setSelectedVoucher(null);
        setModalIsOpen(true);
    };

    const openEditModal = (voucher) => {
        setSelectedVoucher(voucher);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTimeout(() => setSelectedVoucher(null), 200);
    };

    const handleFormSuccess = () => {
        closeModal();
        fetchVouchers(); // Reload list
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            showConfirmButton: false,
            timer: 1500
        });
    };

    // 3. Xử lý Xóa (Soft Delete)
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Xóa voucher này?',
            text: "Voucher sẽ bị vô hiệu hóa (Soft delete).",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa ngay',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await axiosConfig.delete(`/admin/vouchers/${id}`);
                fetchVouchers();
                Swal.fire('Đã xóa!', 'Voucher đã được xóa.', 'success');
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể xóa voucher', 'error');
            }
        }
    };

    // 4. Khôi phục voucher
    const handleRestore = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Khôi phục voucher?',
                text: "Voucher này sẽ hoạt động trở lại.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981', // Màu xanh lá
                confirmButtonText: 'Khôi phục',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                // Gọi API PUT restore
                await axiosConfig.put(`/admin/vouchers/${id}/restore`);
                fetchVouchers(); // Load lại danh sách để cập nhật trạng thái
                Swal.fire('Thành công', 'Đã khôi phục voucher.', 'success');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Lỗi', 'Không thể khôi phục voucher', 'error');
        }
    };

    // 5. Xử lý Clone
    const handleClone = (voucher) => {
        // Tạo một bản sao dữ liệu và reset các trường theo yêu cầu
        const clonedData = {
            ...voucher,           // Copy toàn bộ dữ liệu cũ
            id: null,             // QUAN TRỌNG: Reset ID để Form hiểu là TẠO MỚI
            code: '',             // Reset code để Admin nhập mới hoặc tự sinh
            description: `${voucher.description} (Copy)`, // Thêm chữ Copy để dễ phân biệt
            startDate: new Date().toISOString().split('T')[0], // Reset ngày bắt đầu là hôm nay
            endDate: '',          // Reset ngày kết thúc (bắt buộc chọn lại)
            isActive: true,       // Mặc định Active
            currentUsage: 0       // (Nếu có trường đếm số lần dùng thì reset về 0)
        };

        setSelectedVoucher(clonedData); // Set dữ liệu đã reset vào state
        setModalIsOpen(true);           // Mở Modal
    };

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý Mã Giảm Giá</h1>
                    <p className="text-sm text-gray-500 mt-1">Thiết lập các chương trình khuyến mãi</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-cyan-200 transition-all active:scale-95 font-medium"
                >
                    <Plus size={20} />
                    <span>Tạo Voucher mới</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm mã voucher..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            {/* List Table */}
            <VoucherList 
                vouchers={vouchers} 
                loading={loading} 
                onEdit={openEditModal}
                onDelete={handleDelete}
                onClone={handleClone}
                onRestore={handleRestore}
            />

            {/* Pagination */}
            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />

            {/* Modal Form */}
            <Modal
                isOpen={modalIsOpen}
                onClose={closeModal}
                title={selectedVoucher?.id ? 'Cập nhật Voucher' : (selectedVoucher ? 'Sao chép Voucher' : 'Tạo Voucher Mới')}
            >
                <VoucherForm 
                    selectedVoucher={selectedVoucher} 
                    onSuccess={handleFormSuccess}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
};

export default VoucherAdmin;