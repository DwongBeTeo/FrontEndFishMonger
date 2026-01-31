import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Calendar, Clock, Info, FileText, Home, ChevronRight } from 'lucide-react';
import axiosConfig from '../../../util/axiosConfig';
import AddressSelector from '../../../components/common/AddressSelector';
import Input from '../../../components/common/Input';
import VoucherSelector from '../../../components/user/voucher/VoucherSelector';

const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Form data keeps the raw input values (yyyy-MM-dd for the date picker)
    const [formData, setFormData] = useState({
        appointmentDate: '', // Format: yyyy-MM-dd
        appointmentTime: '', // Format: HH:mm
        note: ''
    });

    const [selectedAddress, setSelectedAddress] = useState(null); 
    const [userProfile, setUserProfile] = useState(null);

    // state voucher
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [finalPrice, setFinalPrice] = useState(0);

    // 1. Load Service Data
    useEffect(() => {
        if (!serviceId) {
            Swal.fire('Lỗi', 'Vui lòng chọn dịch vụ trước', 'warning').then(() => navigate('/services'));
            return;
        }
        const fetchService = async () => {
            try {
                const res = await axiosConfig.get(`/service-types/${serviceId}`);
                setService(res.data);
            } catch (error) {
                console.error(error);
                Swal.fire('Lỗi', 'Không tìm thấy dịch vụ', 'error').then(() => navigate('/services'));
            }
        };
        fetchService();
    }, [serviceId, navigate]);

    // 2. Load User Profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosConfig.get('/profile'); 
                setUserProfile(res.data);
            } catch (error) {}
        };
        fetchProfile();
    }, []);

    // --- 3. LOGIC TÍNH GIÁ KHI CÓ VOUCHER ---
    useEffect(() => {
        if (service) {
            const originalPrice = service.price;
            if (appliedVoucher) {
                const discount = appliedVoucher.discountAmount || 0;
                // Đảm bảo không âm
                setFinalPrice(Math.max(0, originalPrice - discount));
            } else {
                setFinalPrice(originalPrice);
            }
        }
    }, [appliedVoucher, service]);

    // Callback khi chọn voucher
    const handleApplyVoucher = (voucherData) => {
        setAppliedVoucher(voucherData);
    };

    // --- HELPER FUNCTION TO FORMAT DATE ---
    const formatDateForBackend = (dateString) => {
        if (!dateString) return '';
        // Input: "2026-01-31" -> Output: "31-01-2026"
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    // 4. Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.appointmentDate || !formData.appointmentTime) {
            Swal.fire('Thiếu thông tin', 'Vui lòng chọn ngày và giờ hẹn', 'warning');
            return;
        }
        if (!selectedAddress) {
            Swal.fire('Thiếu thông tin', 'Vui lòng chọn hoặc nhập địa chỉ thực hiện', 'warning');
            return;
        }

        setLoading(true);
        try {
            // Construct payload with formatted date
            const payload = {
                serviceTypeId: serviceId,
                // FORMAT DATE HERE
                appointmentDate: formatDateForBackend(formData.appointmentDate), 
                appointmentTime: formData.appointmentTime, // HH:mm is fine

                addressId: selectedAddress.id,
                address: selectedAddress.address,
                phoneNumber: selectedAddress.phoneNumber,
                note: formData.note,
                voucherCode: appliedVoucher ? appliedVoucher.code : null
            };

            console.log("Sending Payload:", payload); // Debugging

            await axiosConfig.post('/appointments', payload);
            
            Swal.fire({
                icon: 'success',
                title: 'Đặt lịch thành công!',
                text: 'Nhân viên sẽ sớm liên hệ xác nhận.',
                confirmButtonColor: '#0891b2'
            }).then(() => {
                navigate('/my-appointments'); 
            });

        } catch (error) {
            console.error("Booking Error:", error);
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!service) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb (Đường dẫn) */}
                <nav className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-blue-600 flex items-center">
                        <Home size={16} className="mr-1"/> Trang chủ
                    </Link>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="hover:text-blue-600 cursor-pointer">
                        {service.categoryName || 'Sản phẩm'}
                    </span>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="text-gray-800 font-medium truncate max-w-[200px]">{service.name}</span>
                </nav>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Xác nhận Đặt lịch</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Service Info */}
                    <div className="md:col-span-1 h-fit space-y-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                                <Info size={18} className="text-cyan-600" />
                                Dịch vụ đã chọn
                            </h3>
                            <img src={service.imageUrl || 'https://via.placeholder.com/300'} alt="" className="w-full h-32 object-cover rounded-lg mb-4" />
                            <h4 className="font-bold text-cyan-700 text-lg">{service.name}</h4>
                            <div className="space-y-3 mt-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span className="flex gap-2 items-center"><Clock size={14}/> Thời gian:</span>
                                    <span className="font-medium">{service.estimatedDuration} phút</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Đơn giá:</span>
                                    <span className="font-bold text-gray-800">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                                    </span>
                                </div>
                                {/* Hiển thị giảm giá */}
                                {appliedVoucher && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Giảm giá:</span>
                                        <span>-{new Intl.NumberFormat('vi-VN').format(appliedVoucher.discountAmount)}đ</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                                    <span className="font-bold text-lg text-gray-800">Thành tiền:</span>
                                    <span className="font-bold text-xl text-cyan-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* --- [MỚI] VOUCHER SELECTOR --- */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <VoucherSelector 
                                totalAmount={service.price} 
                                onApplyVoucher={handleApplyVoucher} 
                            />
                        </div>
                    </div>

                    {/* Right Column: Input Form */}
                    <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            
                            {/* SECTION 1: TIME */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="bg-cyan-100 text-cyan-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                    Thời gian hẹn
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Ngày hẹn *</label>
                                        <input 
                                            type="date" 
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                                            // Value must be yyyy-MM-dd for the input to display correctly
                                            value={formData.appointmentDate}
                                            onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Giờ hẹn *</label>
                                        <input 
                                            type="time" 
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                                            value={formData.appointmentTime}
                                            onChange={e => setFormData({...formData, appointmentTime: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100"/>

                            {/* SECTION 2: ADDRESS (Using AddressSelector) */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="bg-cyan-100 text-cyan-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                    Thông tin liên hệ
                                </h3>
                                <AddressSelector 
                                    user={userProfile}
                                    selectedAddress={selectedAddress}
                                    onSelect={(addr) => setSelectedAddress(addr)}
                                />
                            </div>

                            <hr className="border-gray-100"/>

                            {/* SECTION 3: NOTE */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <FileText size={16} className="text-cyan-600" />
                                    Ghi chú thêm
                                </label>
                                <Input 
                                    placeholder="Tình trạng bể, yêu cầu đặc biệt..."
                                    multiline={true}
                                    value={formData.note}
                                    onChange={e => setFormData({...formData, note: e.target.value})}
                                />
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-cyan-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-cyan-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? 'Đang xử lý...' : 'Xác nhận Đặt lịch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;