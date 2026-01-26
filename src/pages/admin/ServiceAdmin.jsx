import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import axiosConfig from '../../util/axiosConfig';
import Swal from 'sweetalert2';
import { Modal } from '../../components/Modal';
// 1. Import Pagination component
import Pagination from '../../components/common/Pagination';
import ServiceList from '../../components/admin/service/ServiceList';
import ServiceForm from '../../components/admin/service/ServiceForm';

const ServiceAdmin = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null); // Null = Create, Object = Update
    
    // Search & Pagination
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Fetch Data
    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await axiosConfig.get('/admin/service-types', {
                params: {
                    keyword: keyword,
                    page: page,
                    size: 5
                }
            });
            const responseData = res.data;
            const total = responseData.page?.totalPages || 0;
            setServices(responseData.content);
            setTotalPages(total);
        } catch (error) {
            console.error("Lỗi tải dịch vụ:", error);
        } finally {
            setLoading(false);
        }
    };

    // Reset về trang 0 khi tìm kiếm thay đổi
    useEffect(() => {
        setPage(0);
    }, [keyword]);

    useEffect(() => {
        fetchServices();
    }, [page, keyword]);

    // 2. Handlers Modal
    const openCreateModal = () => {
        setSelectedService(null);
        setModalIsOpen(true);
    };

    const openEditModal = (service) => {
        setSelectedService(service);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTimeout(() => setSelectedService(null), 200);
    };

    // 3. Callback sau khi Create/Update thành công
    const handleFormSuccess = () => {
        closeModal();
        fetchServices();
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            showConfirmButton: false,
            timer: 1500
        });
    };

    // 4. Xử lý Ẩn/Hiện dịch vụ (Toggle Status)
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            if(currentStatus) { 
                 const result = await Swal.fire({
                    title: 'Bạn chắc chắn?',
                    text: "Dịch vụ này sẽ bị ẩn khỏi trang chủ!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Ẩn dịch vụ',
                    cancelButtonText: 'Hủy'
                });
                if (!result.isConfirmed) return;
            }

            await axiosConfig.patch(`/admin/service-types/${id}/toggle`);
            fetchServices();
            
            Swal.fire({
                icon: 'success',
                title: currentStatus ? 'Đã ẩn dịch vụ' : 'Đã kích hoạt dịch vụ',
                showConfirmButton: false,
                timer: 1000
            });

        } catch (error) {
            Swal.fire('Lỗi', 'Không thể thay đổi trạng thái', 'error');
        }
    };

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý Dịch vụ</h1>
                    <p className="text-sm text-gray-500 mt-1">Thiết lập các gói dịch vụ (Vệ sinh, Setup...)</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-cyan-200 transition-all active:scale-95 font-medium"
                >
                    <Plus size={20} />
                    <span>Thêm dịch vụ</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm tên dịch vụ..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            {/* List Table */}
            <ServiceList 
                services={services} 
                loading={loading} 
                onEdit={openEditModal}
                onToggleStatus={handleToggleStatus}
            />

            {/* 5. Pagination Component: Thay thế đoạn code cũ */}
            <Pagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />

            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onClose={closeModal}
                title={selectedService ? 'Cập nhật Dịch vụ' : 'Thêm Dịch vụ mới'}
            >
                <ServiceForm 
                    selectedService={selectedService} 
                    onSuccess={handleFormSuccess}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
};

export default ServiceAdmin;