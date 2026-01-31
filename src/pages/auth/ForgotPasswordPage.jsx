import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosConfig from '../../util/axiosConfig';
import Swal from 'sweetalert2';
import { Mail, KeyRound, ArrowLeft, Lock } from 'lucide-react';
import Input from '../../components/common/Input'; // Tái sử dụng Input common

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & Pass mới
    const [loading, setLoading] = useState(false);

    // State dữ liệu
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- BƯỚC 1: GỬI YÊU CẦU OTP ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            Swal.fire('Lỗi', 'Vui lòng nhập địa chỉ email', 'warning');
            return;
        }

        setLoading(true);
        try {
            // POST /users/forgot-password
            await axiosConfig.post('/forgot-password', { email });
            
            Swal.fire({
                icon: 'success',
                title: 'Đã gửi mã!',
                text: `Mã xác thực đã được gửi tới ${email}. Vui lòng kiểm tra hộp thư.`,
                confirmButtonColor: '#0891b2'
            });
            
            setStep(2); // Chuyển sang bước nhập OTP
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.error || 'Không tìm thấy email này', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- BƯỚC 2: ĐỔI MẬT KHẨU ---
    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validate
        if (!otp || !newPassword || !confirmPassword) {
            Swal.fire('Thiếu thông tin', 'Vui lòng nhập đầy đủ mã OTP và mật khẩu mới', 'warning');
            return;
        }
        if (newPassword !== confirmPassword) {
            Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp', 'error');
            return;
        }
        // if (newPassword.length < 6) {
        //     Swal.fire('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự', 'warning');
        //     return;
        // }

        setLoading(true);
        try {
            // POST /users/reset-password
            const payload = {
                email: email, // Lấy từ state đã nhập ở bước 1
                otp: otp,
                newPassword: newPassword
            };

            await axiosConfig.post('/reset-password', payload);

            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.',
                confirmButtonColor: '#0891b2'
            }).then(() => {
                navigate('/login'); // Chuyển về trang đăng nhập
            });

        } catch (error) {
            Swal.fire('Thất bại', error.response?.data?.error || 'Mã OTP không đúng hoặc đã hết hạn', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-cyan-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                        {step === 1 ? <Mail size={32} /> : <KeyRound size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        {step === 1 
                            ? 'Nhập email của bạn để nhận mã xác thực.' 
                            : `Nhập mã 6 số đã gửi tới ${email}`}
                    </p>
                </div>

                {/* --- FORM BƯỚC 1: NHẬP EMAIL --- */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <Input 
                            label="Email đăng ký"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                        </button>
                    </form>
                )}

                {/* --- FORM BƯỚC 2: NHẬP OTP & PASS MỚI --- */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <Input 
                            label="Mã xác thực (OTP)"
                            placeholder="Nhập 6 số (VD: 123456)"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        
                        <Input 
                            label="Mật khẩu mới"
                            type="password"
                            placeholder="••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <Input 
                            label="Xác nhận mật khẩu"
                            type="password"
                            placeholder="••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-700 transition-all shadow-md disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </button>

                        <div className="text-center mt-4">
                            <button 
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-cyan-600 hover:underline"
                            >
                                Gửi lại mã hoặc đổi email?
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer Link */}
                <div className="mt-8 text-center border-t pt-6">
                    <Link to="/login" className="text-gray-600 hover:text-cyan-700 font-medium flex items-center justify-center gap-2 text-sm">
                        <ArrowLeft size={16} /> Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;