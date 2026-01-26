import React, { useEffect, useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import axiosConfig from '../../util/axiosConfig';
import Swal from 'sweetalert2';
import EmployeeList from '../../components/admin/employee/EmployeeList';
import AddEmployeeForm from '../../components/admin/employee/AddEmployeeForm';
import { Modal } from '../../components/Modal';

const EmployeeAdmin = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Để biết là Edit hay Create
    
    // Filter State
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Fetch Employees
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await axiosConfig.get('/admin/employees', {
                params: {
                    keyword: keyword,
                    status: statusFilter || null,
                    page: page,
                    size: 10
                }
            });
            setEmployees(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Lỗi tải danh sách NV:", error);
            Swal.fire('Lỗi', 'Không thể tải danh sách nhân viên', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, keyword, statusFilter]);

    // 2. Handlers Modal
    const openCreateModal = () => {
        setSelectedEmployee(null); // Null = Chế độ tạo mới
        setModalIsOpen(true);
    };

    const openEditModal = (employee) => {
        setSelectedEmployee(employee); // Có data = Chế độ sửa
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTimeout(() => setSelectedEmployee(null), 200); // Delay reset state để tránh UI nhảy khi đóng modal
    };

    // 3. Callback khi form submit thành công
    const handleFormSuccess = () => {
        closeModal();
        fetchEmployees(); // Reload list
        Swal.fire({
            icon: 'success',
            title: selectedEmployee ? 'Cập nhật thành công!' : 'Thêm mới thành công!',
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý Nhân viên</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý hồ sơ và tài khoản nhân viên hệ thống</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-cyan-200 transition-all active:scale-95 font-medium"
                >
                    <Plus size={20} />
                    <span>Thêm nhân viên</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, số điện thoại..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[200px] w-full md:w-auto">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                        className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 cursor-pointer appearance-none text-gray-600 font-medium"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang làm việc</option>
                        <option value="INACTIVE">Đã nghỉ việc</option>
                        <option value="ON_LEAVE">Nghỉ phép</option>
                    </select>
                    {/* Custom Arrow Icon for Select */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>

            {/* List Table */}
            <EmployeeList 
                employees={employees} 
                loading={loading} 
                onEdit={openEditModal} 
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-6">
                    <button 
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600">
                        Trang {page + 1} / {totalPages}
                    </span>
                    <button 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Sau
                    </button>
                </div>
            )}

            {/* Modal - Reusable */}
            <Modal
                isOpen={modalIsOpen}
                onClose={closeModal}
                title={selectedEmployee ? 'Cập nhật Hồ sơ' : 'Thêm Nhân viên mới'}
                fitContent={true}
            >
                <AddEmployeeForm 
                    selectedEmployee={selectedEmployee} 
                    onSuccess={handleFormSuccess}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
};

export default EmployeeAdmin;