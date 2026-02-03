import React, { useState, useEffect } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';
import Input from '../../common/Input'; 
import ImageUploader from '../../common/ImageUploader'; 

// form thông tin cá nhân
const ProfileForm = ({ initialData, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        profileImageUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                phoneNumber: initialData.phoneNumber || '',
                address: initialData.address || '',
                profileImageUrl: initialData.profileImageUrl || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        // Input component trả về event chuẩn {target: {value}} nên dùng như bình thường
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm riêng cho ImageUploader (vì nó trả về trực tiếp URL string)
    const handleImageChange = (url) => {
        setFormData({ ...formData, profileImageUrl: url });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosConfig.put('/profile', formData);
            
            Swal.fire({
                icon: 'success',
                title: 'Cập nhật thành công!',
                showConfirmButton: false,
                timer: 1500
            });
            
            if (onUpdateSuccess) onUpdateSuccess(res.data);

        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.error || 'Không thể cập nhật thông tin', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Thông tin tài khoản</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 2. Sử dụng ImageUploader */}
                <div className="flex justify-center mb-6">
                    <div className="w-full max-w-[200px]"> {/* Giới hạn chiều rộng cho đẹp */}
                        <ImageUploader 
                            label="Ảnh đại diện" 
                            value={formData.profileImageUrl} 
                            onChange={handleImageChange} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 3. Sử dụng Input Common */}
                    <div className="md:col-span-2">
                        <Input 
                            label="Họ và tên"
                            // Lưu ý: Input component cần prop 'onChange' nhận event, nên truyền callback bọc lại nếu cần định danh name
                            // Hoặc sửa Input component để nhận 'name'. 
                            // Ở đây ta giả định Input chưa có prop name, nên xử lý thủ công:
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>

                    <div>
                        <Input 
                            label="Số điện thoại"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div>
                        <Input 
                            label="Email"
                            value={initialData?.email || ''}
                            onChange={() => {}}
                            disabled={true} 
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Input 
                            label="Địa chỉ"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Nhập địa chỉ nhận hàng"
                            multiline={true}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-cyan-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-cyan-700 transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;