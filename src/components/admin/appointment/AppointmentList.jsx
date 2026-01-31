import React from 'react';
import { User, Clock, MapPin, Phone, CalendarCheck, MoreVertical, Hash, XCircle, Mail, CheckCircle, Tag } from 'lucide-react';

const AppointmentList = ({ appointments, loading, onAssign, onUpdateStatus, onCancel, onReviewCancel }) => {
    
    // Helper hiển thị badge trạng thái (Giữ nguyên)
    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
            IN_PROCESS: 'bg-purple-100 text-purple-800 border-purple-200',
            COMPLETED: 'bg-green-100 text-green-800 border-green-200',
            CANCELLED: 'bg-orange-100 text-orange-800 border-orange-200',
            CANCEL_REQUESTED: 'bg-red-50 text-red-700 border-red-200 animate-pulse', // Highlight request
        };
        const labels = {
            PENDING: 'Chờ xác nhận',
            CONFIRMED: 'Đã xác nhận',
            IN_PROCESS: 'Đang làm',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy',
            CANCEL_REQUESTED: 'Khách yêu cầu hủy',
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    if (loading) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
    );

    if (appointments.length === 0) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Chưa có lịch hẹn nào</h3>
            <p className="text-gray-500 mt-1">Các đơn đặt lịch mới sẽ xuất hiện ở đây.</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr className="text-gray-500 uppercase text-xs font-semibold tracking-wider">
                            <th className="px-6 py-4 w-[140px]">Mã & Ngày</th>
                            <th className="px-6 py-4 w-[200px]">Khách hàng</th>
                            <th className="px-6 py-4 w-[250px]">Dịch vụ & Địa chỉ</th>
                            <th className="px-6 py-4 w-[180px]">Nhân viên</th>
                            <th className="px-6 py-4 w-[150px]">Trạng thái</th>
                            <th className="px-6 py-4 text-center w-[120px]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-cyan-50/20 transition-colors group">
                                
                                {/* 1. Mã & Ngày */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex items-center gap-1 font-mono text-gray-500 font-bold mb-1">
                                        <Hash size={12} className="text-gray-400"/>
                                        {appt.id}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                                        <CalendarCheck size={14} className="text-cyan-600"/>
                                        <span>{appt.appointmentDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                                        <Clock size={14} className="text-gray-400"/>
                                        <span>{appt.appointmentTime} - {appt.expectedEndTime}</span>
                                    </div>
                                </td>

                                {/* 2. Khách hàng */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{appt.userFullName || "Khách vãng lai"}</div>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                <Phone size={12} /> {appt.phoneNumber}
                                            </div>
                                            {appt.email && (
                                                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                    <Mail size={12} /> {appt.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* 3. Dịch vụ & Địa chỉ (CÓ SỬA ĐỔI ĐỂ HIỆN VOUCHER) */}
                                <td className="px-6 py-4 align-top">
                                    <div className="mb-2">
                                        <div className="font-medium text-cyan-700 mb-1">
                                            {appt.serviceTypeName}
                                        </div>
                                        
                                        {/* --- HIỂN THỊ GIÁ & VOUCHER --- */}
                                        <div className="text-xs text-gray-500">
                                            {appt.discountAmount > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1">
                                                        <span className="line-through text-gray-400">{appt.priceAtBooking?.toLocaleString()}đ</span>
                                                        <span className="font-bold text-red-600 ml-1">{appt.finalPrice?.toLocaleString()}đ</span>
                                                    </div>
                                                    {appt.voucherCode && (
                                                        <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 w-fit">
                                                            <Tag size={10} /> Voucher: <b>{appt.voucherCode}</b> (-{appt.discountAmount?.toLocaleString()}đ)
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="font-semibold text-gray-700">{appt.priceAtBooking?.toLocaleString()}đ</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-1.5 text-gray-600 text-xs leading-relaxed bg-gray-50 p-2 rounded-md border border-gray-100">
                                        <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" /> 
                                        <span>{appt.address}</span>
                                    </div>
                                </td>

                                {/* 4. Nhân viên */}
                                <td className="px-6 py-4 align-top">
                                    {appt.employeeId ? (
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-1 pr-3 py-1 w-fit">
                                            <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 text-xs font-bold">
                                                {appt.employeeName.charAt(0)}
                                            </div>
                                            <span className="text-gray-700 text-xs font-medium truncate max-w-[100px]">{appt.employeeName}</span>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-600 text-xs border border-red-100">
                                            Chưa phân công
                                        </span>
                                    )}
                                </td>

                                {/* 5. Trạng thái */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        {getStatusBadge(appt.status)}
                                        
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                            appt.paymentStatus === 'PAID' 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-orange-50 text-orange-700'
                                        }`}>
                                            {appt.paymentStatus === 'PAID' ? '● Đã thanh toán' : '○ Chưa thanh toán'}
                                        </span>
                                    </div>
                                </td>

                                {/* 6. Hành động */}
                                <td className="px-6 py-4 align-top text-center">
                                    <div className="flex flex-col gap-2 items-center">
                                        
                                        {/* CASE 1: Xử lý yêu cầu hủy */}
                                        {appt.status === 'CANCEL_REQUESTED' ? (
                                            <div className="flex flex-col gap-1 w-full">
                                                <button 
                                                    onClick={() => onReviewCancel(appt.id, true)}
                                                    className="w-full px-2 py-1.5 text-[11px] font-bold text-white bg-red-600 rounded hover:bg-red-700 shadow-sm flex items-center justify-center gap-1"
                                                >
                                                    <CheckCircle size={12}/> Duyệt Hủy
                                                </button>
                                                <button 
                                                    onClick={() => onReviewCancel(appt.id, false)}
                                                    className="w-full px-2 py-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm"
                                                >
                                                    Từ chối
                                                </button>
                                            </div>
                                        ) : (
                                            /* CASE 2: Các nút hành động bình thường */
                                            <>
                                                {/* Nút Phân công */}
                                                {['PENDING', 'CONFIRMED'].includes(appt.status) && (
                                                    <button 
                                                        onClick={() => onAssign(appt)}
                                                        className="w-full px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 shadow-sm transition-all"
                                                    >
                                                        Phân công
                                                    </button>
                                                )}

                                                {/* Nút Bắt đầu */}
                                                {appt.status === 'CONFIRMED' && (
                                                    <button 
                                                        onClick={() => onUpdateStatus(appt.id, 'IN_PROCESS')}
                                                        className="w-full px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 shadow-sm transition-all"
                                                    >
                                                        Bắt đầu làm
                                                    </button>
                                                )}

                                                {/* Nút Hoàn thành */}
                                                {appt.status === 'IN_PROCESS' && (
                                                    <button 
                                                        onClick={() => onUpdateStatus(appt.id, 'COMPLETED')}
                                                        className="w-full px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 shadow-sm transition-all"
                                                    >
                                                        Hoàn thành
                                                    </button>
                                                )}

                                                {/* Nút Hủy (Admin chủ động) */}
                                                {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                                                    <button 
                                                        onClick={() => onCancel(appt.id)}
                                                        className="w-full px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-all flex items-center justify-center gap-1"
                                                    >
                                                        <XCircle size={12} /> Hủy lịch
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentList;