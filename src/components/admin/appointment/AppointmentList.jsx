import React from 'react';
import { User, Clock, MapPin, Phone, CalendarCheck, MoreVertical, Hash } from 'lucide-react';

const AppointmentList = ({ appointments, loading, onAssign, onUpdateStatus }) => {
    
    // Helper hiển thị badge trạng thái
    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
            IN_PROCESS: 'bg-purple-100 text-purple-800 border-purple-200',
            COMPLETED: 'bg-green-100 text-green-800 border-green-200',
            CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
        };
        const labels = {
            PENDING: 'Chờ xác nhận',
            CONFIRMED: 'Đã xác nhận',
            IN_PROCESS: 'Đang làm',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy',
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

                                {/* 2. Khách hàng (Tên + SĐT) */}
                                <td className="px-6 py-4 align-top">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{appt.username}</div>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                <Phone size={12} /> {appt.phoneNumber}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* 3. Dịch vụ & Địa chỉ (Gộp lại cho gọn nhưng phân cấp rõ) */}
                                <td className="px-6 py-4 align-top">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="font-medium text-cyan-700">
                                            {appt.serviceTypeName}
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
                                        {/* Nút Phân công */}
                                        {['PENDING', 'CONFIRMED'].includes(appt.status) && (
                                            <button 
                                                onClick={() => onAssign(appt)}
                                                className="w-full px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 shadow-sm hover:shadow transition-all"
                                            >
                                                Phân công
                                            </button>
                                        )}

                                        {/* Các nút chuyển trạng thái */}
                                        {appt.status === 'CONFIRMED' && (
                                            <button 
                                                onClick={() => onUpdateStatus(appt.id, 'IN_PROCESS')}
                                                className="w-full px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 shadow-sm hover:shadow transition-all"
                                            >
                                                Bắt đầu làm
                                            </button>
                                        )}

                                        {appt.status === 'IN_PROCESS' && (
                                            <button 
                                                onClick={() => onUpdateStatus(appt.id, 'COMPLETED')}
                                                className="w-full px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 shadow-sm hover:shadow transition-all"
                                            >
                                                Hoàn thành
                                            </button>
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