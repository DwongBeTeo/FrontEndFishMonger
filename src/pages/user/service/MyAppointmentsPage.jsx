import React, { useContext, useEffect, useState } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import { Calendar, MapPin, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Tag } from 'lucide-react';
import Pagination from '../../../components/common/Pagination';
import Swal from 'sweetalert2';
import SocketContext from '../../../context/SocketContext';

const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { lastMessage } = useContext(SocketContext);

    // 🔥 LOGIC REAL-TIME
    useEffect(() => {
        if (lastMessage && lastMessage.type === 'APPOINTMENT') {
            const updatedAppt = lastMessage.data;
            
            setAppointments(prevList => {
                // Kiểm tra xem item có trong list không (So sánh lỏng lẻo == để bỏ qua khác biệt string/number)
                const exists = prevList.find(a => a.id == updatedAppt.id);
                if (!exists) return prevList;

                return prevList.map(a => 
                    // Dùng a.id == updatedAppt.id thay vì === để an toàn hơn
                    a.id == updatedAppt.id ? updatedAppt : a
                );
            });

            // Hiển thị thông báo toast
            let title = `Lịch hẹn #${updatedAppt.id} cập nhật`;
            let icon = 'info';

            if (updatedAppt.status === 'CONFIRMED') {
                title = 'Đã được phân công nhân viên!';
                icon = 'success';
            } else if (updatedAppt.status === 'CANCELLED') {
                title = 'Yêu cầu hủy đã được duyệt';
                icon = 'success';
            } else if (updatedAppt.status === 'CANCEL_REQUESTED') {
                title = 'Yêu cầu hủy đã được gửi đi';
                icon = 'warning';
            } else if (updatedAppt.status === 'COMPLETED') {
                title = 'Lịch hẹn đã hoàn thành';
                icon = 'success';
            } else if (updatedAppt.status === 'IN_PROCESS') {
                title = 'Lịch hẹn đang được thực hiện';
                icon = 'info';
            }

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: icon,
                title: title,
                showConfirmButton: false,
                timer: 3000
            });
        }
    }, [lastMessage]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axiosConfig.get('/appointments', {
                params: { page, size: 5 } // 5 đơn mỗi trang cho gọn
            });
            const responseData = res.data;
            setAppointments(responseData.content || []);
            setTotalPages(responseData.totalPages || responseData.totalPages || 0);
        } catch (error) {
            console.error("Lỗi tải lịch sử:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [page]);

    // Hàm hiển thị trạng thái đẹp mắt
    const renderStatus = (status, paymentStatus) => {
        const styles = {
            'PENDING': { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Chờ xác nhận' },
            'CONFIRMED': { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Đã xác nhận' },
            'CANCEL_REQUESTED': { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Đang chờ hủy...' },
            'IN_PROCESS': { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Đang thực hiện' },
            'COMPLETED': { color: 'text-green-600', bg: 'bg-green-50', label: 'Hoàn thành' },
            'CANCELLED': { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Đã hủy' }
        };
        const s = styles[status] || styles['PENDING'];

        return (
            <div className="flex flex-col items-end gap-1">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.color} ${s.bg} border border-${s.color.split('-')[1]}-200`}>
                    {s.label}
                </span>
                {status === 'COMPLETED' && (
                    <span className={`text-[10px] font-bold ${paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-500'}`}>
                        {paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                )}
            </div>
        );
    };

    // Hàm gửi yêu cầu hủy lịch
    const handleCancel = async (id) => {
        const { value: reason } = await Swal.fire({
            title: 'Yêu cầu hủy lịch hẹn?',
            input: 'textarea',
            inputLabel: 'Lý do hủy',
            inputPlaceholder: 'Nhập lý do của bạn...',
            inputValidator: (value) => {
                if (!value) return 'Bạn cần nhập lý do hủy!';
            },
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Gửi yêu cầu',
            cancelButtonText: 'Quay lại'
        });

        if (reason) {
            try {
                // PATCH /appointments/{id}/request-cancel
                await axiosConfig.patch(`/appointments/${id}/request-cancel`, null, {
                    params: { reason }
                });
                Swal.fire('Đã gửi', 'Yêu cầu hủy đã được gửi. Vui lòng chờ Admin xác nhận.', 'success');
                fetchHistory(); // Reload lại danh sách
            } catch (error) {
                Swal.fire('Lỗi', error.response?.data?.message || 'Không thể hủy lịch này', 'error');
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Lịch hẹn của tôi</h1>

                {loading ? (
                    <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div></div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl text-center shadow-sm">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Bạn chưa đặt lịch hẹn nào.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map(appt => (
                            <div key={appt.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex gap-4">
                                        <img 
                                            src={appt.serviceImage || 'https://via.placeholder.com/100'} 
                                            alt={appt.serviceTypeName} 
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">{appt.serviceTypeName}</h3>
                                            <p className="text-sm text-gray-500">Mã đơn: #{appt.id}</p>
                                            
                                            {/* --- UPDATED PRICE DISPLAY WITH VOUCHER --- */}
                                            <div className="mt-1">
                                                {appt.discountAmount > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appt.priceAtBooking)}
                                                        </span>
                                                        <span className="text-cyan-600 font-bold text-lg">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appt.finalPrice)}
                                                        </span>
                                                        {appt.voucherCode && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                                                                <Tag size={10} /> Voucher: {appt.voucherCode}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-cyan-600 font-bold text-lg">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appt.priceAtBooking)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {renderStatus(appt.status, appt.paymentStatus)}
                                </div>

                                {/* Body Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-cyan-600"/>
                                            <span className="font-medium text-gray-800">
                                                {appt.appointmentDate} <span className="font-normal text-gray-500">|</span> {appt.appointmentTime}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin size={16} className="text-cyan-600 mt-0.5"/>
                                            <span>{appt.address}</span>
                                        </div>
                                        {appt.note && (
                                            <div className="flex items-start gap-2 text-gray-500 italic bg-gray-50 p-2 rounded">
                                                <AlertCircle size={14} className="mt-0.5"/> "{appt.note}"
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2 md:border-l md:pl-4 border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-cyan-600"/>
                                            <span>Nhân viên: <span className="font-medium text-gray-800">{appt.employeeName || "Đang sắp xếp..."}</span></span>
                                        </div>
                                        {appt.employeeId && (
                                            <div className="flex items-center gap-2 text-green-600 text-xs">
                                                <CheckCircle size={12}/> Đã được phân công
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                                    <div className="flex justify-end pt-3 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleCancel(appt.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                                        >
                                            <XCircle size={16}/> Yêu cầu hủy lịch
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                />
            </div>
        </div>
    );
};

export default MyAppointmentsPage;