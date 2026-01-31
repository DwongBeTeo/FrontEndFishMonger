import React, { useEffect, useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import axiosConfig from '../../util/axiosConfig';
import Swal from 'sweetalert2';
import Pagination from '../../components/common/Pagination';
import AppointmentList from '../../components/admin/appointment/AppointmentList';
import AssignEmployeeModal from '../../components/admin/appointment/AssignEmployeeModal';

const AppointmentAdmin = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho Modal Phân công
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Filter & Pagination
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Fetch Data
    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axiosConfig.get('/admin/appointments', {
                params: {
                    keyword: keyword,
                    status: statusFilter || null,
                    page: page,
                    size: 10
                }
            });
            
            console.log("API Response:", res.data); // Debugging

            // Adapting to Spring Data REST Page structure
            const content = res.data.content.sort((a, b) => b.id - a.id) || [];
            // Check if totalPages is at root or inside 'page' object
            const total = res.data.totalPages || res.data.page?.totalPages || 0;

            setAppointments(content);
            setTotalPages(total);

        } catch (error) {
            console.error("Lỗi tải lịch hẹn:", error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(0); // Reset về trang đầu khi filter đổi
    }, [keyword, statusFilter]);

    useEffect(() => {
        fetchAppointments();
    }, [page, keyword, statusFilter]);

    // 2. Handle Assign Employee (Mở Modal)
    const openAssignModal = (appt) => {
        setSelectedAppointment(appt);
        setAssignModalOpen(true);
    };

    // 3. Handle Update Status (Confirm, Complete, Cancel)
    const handleUpdateStatus = async (id, newStatus) => {
        // Confirm trước khi đổi
        const result = await Swal.fire({
            title: 'Xác nhận thay đổi?',
            text: `Bạn muốn chuyển trạng thái đơn #${id} sang ${newStatus}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0891b2',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        try {
            await axiosConfig.patch(`/admin/appointments/${id}/status`, null, {
                params: { status: newStatus }
            });
            Swal.fire('Thành công', 'Đã cập nhật trạng thái!', 'success');
            fetchAppointments(); // Reload
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Không thể cập nhật', 'error');
        }
    };

    // 4. Handle Cancel Appointment (Admin chủ động hủy)
    const handleCancel = async (id) => {
        const { value: reason, isConfirmed } = await Swal.fire({
            title: 'Hủy lịch hẹn?',
            text: "Vui lòng nhập lý do hủy lịch này:",
            input: 'textarea',
            inputPlaceholder: 'Ví dụ: Nhân viên bận đột xuất, Khách hàng yêu cầu hủy qua điện thoại...',
            inputAttributes: {
                'aria-label': 'Nhập lý do hủy'
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Màu đỏ
            confirmButtonText: 'Xác nhận hủy',
            cancelButtonText: 'Quay lại',
            inputValidator: (value) => {
                if (!value) {
                    return 'Bạn cần nhập lý do để hủy lịch!';
                }
            }
        });

        if (isConfirmed && reason) {
            try {
                await axiosConfig.patch(`/admin/appointments/${id}/cancel`, null, {
                    params: { reason: reason }
                });
                Swal.fire('Đã hủy', 'Lịch hẹn đã được hủy thành công.', 'success');
                fetchAppointments(); // Reload danh sách
            } catch (error) {
                Swal.fire('Lỗi', error.response?.data?.message || 'Không thể hủy lịch', 'error');
            }
        }
    };

    // 5. hàm xử lý Duyệt/Từ chối yêu cầu hủy
    const handleReviewCancel = async (id, approve) => {
        let reason = "";
        if (!approve) {
            const { value: inputReason } = await Swal.fire({
                title: 'Từ chối yêu cầu hủy?',
                input: 'textarea',
                inputLabel: 'Lý do từ chối (sẽ gửi mail cho khách)',
                inputPlaceholder: 'Ví dụ: Kỹ thuật viên đã lên đường...',
                showCancelButton: true,
                confirmButtonText: 'Gửi từ chối',
                cancelButtonText: 'Quay lại',
                inputValidator: (value) => {
                    if (!value) return 'Bạn phải nhập lý do từ chối!';
                }
            });
            if (!inputReason) return;
            reason = inputReason;
        } else {
            const confirm = await Swal.fire({
                title: 'Chấp nhận hủy lịch?',
                text: "Lịch hẹn này sẽ bị hủy vĩnh viễn.",
                icon: 'warning',
                showCancelButton: true
            });
            if (!confirm.isConfirmed) return;
        }

        try {
            await axiosConfig.put(`/admin/appointments/${id}/review-cancel`, null, {
                params: { approve, reason }
            });
            Swal.fire('Thành công', 'Đã xử lý yêu cầu hủy.', 'success');
            fetchAppointments(); // Reload dữ liệu
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        } finally{
            setLoading(false);
        }
    };

    const handleAssignSuccess = () => {
        setAssignModalOpen(false);
        fetchAppointments();
        Swal.fire('Thành công', 'Đã phân công nhân viên!', 'success');
    };

    return (
        <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý Lịch hẹn</h1>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi và phân công lịch dịch vụ tại nhà</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên khách, SĐT, Mã đơn..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="IN_PROCESS">Đang thực hiện</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* List Table */}
            <AppointmentList 
                appointments={appointments} 
                loading={loading}
                onAssign={openAssignModal}
                onUpdateStatus={handleUpdateStatus}
                onCancel={handleCancel}
                onReviewCancel = {handleReviewCancel}
            />

            {/* Pagination */}
            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
            />

            {/* Assign Modal */}
            <AssignEmployeeModal 
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                appointment={selectedAppointment}
                onSuccess={handleAssignSuccess}
            />
        </div>
    );
};

export default AppointmentAdmin;