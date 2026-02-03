import React, { useState } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';
import Input from '../../common/Input';

const PasswordForm = () => {
    const [passData, setPassData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    // Helper hàm set state gọn hơn
    const handlePassChange = (field, value) => {
        setPassData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passData.newPassword !== passData.confirmPassword) {
            Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp', 'warning');
            return;
        }
        // if (passData.newPassword.length < 6) {
        //     Swal.fire('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự', 'warning');
        //     return;
        // }

        setLoading(true);
        try {
            await axiosConfig.post('/change-password', {
                currentPassword: passData.currentPassword,
                newPassword: passData.newPassword,
                confirmPassword: passData.confirmPassword
            });

            Swal.fire('Thành công', 'Đổi mật khẩu thành công!', 'success');
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });

        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Đổi mật khẩu thất bại';
            Swal.fire('Lỗi', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Đổi mật khẩu</h2>
            
            <form onSubmit={handleSubmit} className="space-y-2">
                {/* Lưu ý: Input component của bạn đã có sẵn logic Show/Hide password 
                    khi type="password", nên code ở đây rất gọn.
                */}
                <Input 
                    label="Mật khẩu hiện tại"
                    type="password"
                    value={passData.currentPassword}
                    onChange={(e) => handlePassChange('currentPassword', e.target.value)}
                    placeholder="••••••"
                />

                <Input 
                    label="Mật khẩu mới"
                    type="password"
                    value={passData.newPassword}
                    onChange={(e) => handlePassChange('newPassword', e.target.value)}
                    placeholder="••••••"
                />

                <Input 
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    value={passData.confirmPassword}
                    onChange={(e) => handlePassChange('confirmPassword', e.target.value)}
                    placeholder="••••••"
                />

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gray-800 text-white font-bold py-2.5 rounded-lg hover:bg-black transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordForm;