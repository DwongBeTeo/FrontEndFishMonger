import React, { useState, useEffect } from 'react';
import Input from '../../common/Input'; 
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';
import { isValidPhone } from '../../../util/Validation';

const AddEmployeeForm = ({ selectedEmployee, onSuccess, onCancel }) => {
    // Nếu có selectedEmployee -> Mode Update (Sửa), ngược lại -> Mode Create (Thêm mới)
    const isEditMode = !!selectedEmployee;

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        status: 'ACTIVE',
        userId: '' // ID của User được chọn
    });

    const [users, setUsers] = useState([]); // Danh sách user khả dụng cho dropdown
    const [loading, setLoading] = useState(false);

    // 1. Load dữ liệu (User khả dụng hoặc Data cũ để sửa)
    useEffect(() => {
        if (!isEditMode) {
            // --- CHẾ ĐỘ THÊM MỚI: Gọi API lấy danh sách User chưa làm nhân viên ---
            const fetchAvailableUsers = async () => {
                try {
                    // Gọi đúng API bạn vừa tạo ở UserAdminController
                    const res = await axiosConfig.get('/admin/users/available'); 
                    
                    // Map dữ liệu sang format mà Input/React-Select cần: { value, label }
                    const userOptions = res.data.map(u => ({
                        value: u.id,
                        // Hiển thị Username kèm Họ tên hoặc Email để dễ chọn
                        label: `${u.username} - ${u.fullName || u.email}` 
                    }));
                    
                    setUsers(userOptions);
                } catch (error) {
                    console.error("Lỗi lấy danh sách user:", error);
                    // Không cần Swal lỗi ở đây để tránh spam popup nếu chỉ lỗi mạng nhẹ
                }
            };
            fetchAvailableUsers();
        } else {
            // --- CHẾ ĐỘ CHỈNH SỬA: Điền dữ liệu cũ vào Form ---
            setFormData({
                fullName: selectedEmployee.fullName,
                phoneNumber: selectedEmployee.phoneNumber,
                status: selectedEmployee.status,
                userId: selectedEmployee.userId 
            });
        }
    }, [isEditMode, selectedEmployee]);

    // 2. Xử lý thay đổi input
    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // 3. Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate Frontend
        if (!formData.fullName || !formData.phoneNumber) {
            Swal.fire('Thiếu thông tin', 'Vui lòng nhập họ tên và số điện thoại.', 'warning');
            return;
        }
        if (!isEditMode && !formData.userId) {
            Swal.fire('Chưa chọn tài khoản', 'Vui lòng chọn một tài khoản User để liên kết.', 'warning');
            return;
        }

        // CHECK SỐ ĐIỆN THOẠI
        if (!isValidPhone(formData.phoneNumber)) {
            Swal.fire('Số điện thoại sai', 'Số điện thoại phải có đúng 10 chữ số!', 'warning');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                // API Update
                await axiosConfig.put(`/admin/employees/${selectedEmployee.id}`, {
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    status: formData.status
                    // Không gửi userId khi update (Backend không cho sửa)
                });
            } else {
                // API Create
                await axiosConfig.post('/admin/employees', {
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    status: 'ACTIVE',
                    userId: formData.userId
                });
            }
            // Gọi callback thành công để đóng modal và reload list
            onSuccess(); 
        } catch (error) {
            console.error("Submit lỗi:", error);
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Option cho dropdown trạng thái
    const statusOptions = [
        { value: 'ACTIVE', label: 'Đang làm việc' },
        { value: 'INACTIVE', label: 'Đã nghỉ việc' },
        { value: 'ON_LEAVE', label: 'Nghỉ phép' }
    ];

    return (
        <div className="bg-white">
            <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
                
                {/* --- PHẦN 1: CHỌN TÀI KHOẢN --- */}
                {!isEditMode ? (
                    // Mode Create: Hiện Dropdown chọn User
                    <Input 
                        label="Chọn tài khoản liên kết *" 
                        isSelect={true}
                        options={users} // List lấy từ API
                        value={formData.userId}
                        onChange={(e) => handleChange('userId', e.target.value)}
                        placeholder={users.length > 0 ? "-- Chọn tài khoản --" : "Không có user khả dụng"}
                        disabled={users.length === 0} // Disable nếu không có user nào
                    />
                ) : (
                    // Mode Edit: Hiện thông tin Read-only (Không cho sửa User)
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                        <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                            Tài khoản liên kết
                        </label>
                        <div className="text-sm text-blue-900 font-medium mt-1">
                            {selectedEmployee.username} <span className="text-blue-400 opacity-70">| ID: {selectedEmployee.userId}</span>
                        </div>
                    </div>
                )}

                {/* --- PHẦN 2: THÔNG TIN CÁ NHÂN --- */}
                <div className="grid grid-cols-1 gap-5">
                    <Input 
                        label="Họ và Tên *" 
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="VD: Nguyễn Văn A"
                    />
                    <Input 
                        label="Số điện thoại *" 
                        type="number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        placeholder="VD: 0987654321"
                    />
                </div>

                {/* --- PHẦN 3: TRẠNG THÁI (Chỉ hiện khi Edit) --- */}
                {isEditMode && (
                    <Input 
                        label="Trạng thái làm việc" 
                        isSelect={true}
                        options={statusOptions}
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    />
                )}

                {/* --- FOOTER BUTTONS --- */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 active:scale-95 transition-all shadow-md shadow-cyan-200 disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Thêm mới')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEmployeeForm;