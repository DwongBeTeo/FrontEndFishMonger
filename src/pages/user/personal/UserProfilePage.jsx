import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import axiosConfig from '../../../util/axiosConfig';
import ProfileForm from '../../../components/user/profile/ProfileForm';
import PasswordForm from '../../../components/user/profile/PasswordForm';

const UserProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setUser } = useContext(AuthContext); 

    const fetchProfile = async () => {
        try {
            // GET /users/profile
            const res = await axiosConfig.get('/profile');
            setUserProfile(res.data);
        } catch (error) {
            console.error("Lỗi tải thông tin cá nhân:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateSuccess = (updatedUser) => {
        // Cập nhật lại state local
        setUserProfile(updatedUser);
        // Nếu có Context global thì cập nhật luôn để Header thay đổi theo
        setUser(updatedUser); 
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Hồ sơ của tôi</h1>
                    <p className="text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Thông tin cá nhân (Chiếm 2 phần) */}
                    <div className="lg:col-span-2">
                        <ProfileForm
                            initialData={userProfile} 
                            onUpdateSuccess={handleUpdateSuccess} 
                        />
                    </div>

                    {/* Cột phải: Đổi mật khẩu (Chiếm 1 phần) */}
                    <div className="lg:col-span-1">
                        <PasswordForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;