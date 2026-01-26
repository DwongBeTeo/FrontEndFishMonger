import React from 'react';
import { Edit, User, Phone } from 'lucide-react';

const EmployeeList = ({ employees, loading, onEdit }) => {
    
    const getStatusStyle = (status) => {
        switch(status) {
            case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'INACTIVE': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'ON_LEAVE': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'ACTIVE': return 'Đang làm việc';
            case 'INACTIVE': return 'Đã nghỉ việc';
            case 'ON_LEAVE': return 'Nghỉ phép';
            default: return status;
        }
    };

    if (loading) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
    );

    if (employees.length === 0) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Chưa có nhân viên nào</h3>
            <p className="text-gray-500 mt-1">Hãy thêm nhân viên mới để bắt đầu quản lý.</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Nhân viên</th>
                            <th className="px-6 py-4">Liên hệ</th>
                            <th className="px-6 py-4">Tài khoản</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-cyan-50/30 transition-colors group">
                                <td className="px-6 py-4 text-gray-400 font-mono">#{emp.id}</td>
                                
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-800">{emp.fullName}</div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone size={14} className="text-gray-400" />
                                        <span>{emp.phoneNumber}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">
                                        {emp.username}
                                    </span>
                                    <span className="text-[10px] text-gray-400">ID: {emp.userId}</span>
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(emp.status)}`}>
                                        {getStatusLabel(emp.status)}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => onEdit(emp)}
                                        className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;