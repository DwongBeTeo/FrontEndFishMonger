import React, { useState, useEffect } from 'react';
import { Modal } from '../../Modal';
import Input from '../../common/Input';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';

const AssignEmployeeModal = ({ isOpen, onClose, appointment, onSuccess }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [loading, setLoading] = useState(false);

    // Load danh sách nhân viên ACTIVE mỗi khi mở modal
    useEffect(() => {
        if (isOpen) {
            const fetchEmployees = async () => {
                try {
                    // --- SỬA LẠI ĐOẠN NÀY ---
                    // Gọi API mới: GET /admin/employees/active
                    const res = await axiosConfig.get('/admin/employees/active');
                    
                    // Vì trả về List nên data nằm trực tiếp trong res.data
                    const options = res.data.map(e => ({
                        value: e.id,
                        label: `${e.fullName} (${e.phoneNumber})`
                    }));
                    setEmployees(options);
                    // ------------------------
                    
                    // Nếu appointment đã có nhân viên cũ thì set default
                    if (appointment?.employeeId) {
                        setSelectedEmpId(appointment.employeeId);
                    } else {
                        setSelectedEmpId('');
                    }

                } catch (error) {
                    console.error("Lỗi load nhân viên:", error);
                    // Có thể toast nhẹ nếu lỗi
                }
            };
            fetchEmployees();
        }
    }, [isOpen, appointment]);

    const handleAssign = async () => {
        if (!selectedEmpId) {
            Swal.fire('Chưa chọn', 'Vui lòng chọn nhân viên!', 'warning');
            return;
        }

        setLoading(true);
        try {
            // PUT /admin/appointments/{id}/assign?employeeId=...
            await axiosConfig.put(`/admin/appointments/${appointment.id}/assign`, null, {
                params: { employeeId: selectedEmpId }
            });
            onSuccess(); // Đóng modal & reload list
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Nhân viên bị trùng lịch', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Phân công đơn #${appointment?.id}`}
        >
            <div className="p-6 bg-white">
                <div className="mb-4 text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p><span className="font-semibold text-gray-800">Khách hàng:</span> {appointment?.userFullName}</p>
                    <p><span className="font-semibold text-gray-800">Dịch vụ:</span> {appointment?.serviceTypeName}</p>
                    <p><span className="font-semibold text-gray-800">Thời gian:</span> {appointment?.appointmentDate} ({appointment?.appointmentTime})</p>
                </div>

                <Input 
                    label="Chọn nhân viên thực hiện *" 
                    isSelect={true}
                    options={employees}
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    placeholder={employees.length > 0 ? "-- Chọn nhân viên --" : "Không có nhân viên khả dụng"}
                    disabled={employees.length === 0}
                />

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-50">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleAssign}
                        disabled={loading}
                        className="px-6 py-2 text-sm font-bold text-white bg-cyan-600 rounded hover:bg-cyan-700 disabled:opacity-50 transition-all shadow-sm"
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận Phân công'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AssignEmployeeModal;