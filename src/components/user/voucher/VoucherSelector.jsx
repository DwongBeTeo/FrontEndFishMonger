import React, { useState, useEffect } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import { Tag, X, ChevronRight } from 'lucide-react';
import VoucherCard from './VoucherCard';
import { Modal } from '../../Modal'; // Tái sử dụng Modal chung của bạn
import Swal from 'sweetalert2';

const VoucherSelector = ({ totalAmount, onApplyVoucher }) => {
    const [inputCode, setInputCode] = useState('');
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null); // Voucher đã áp dụng thành công
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. Fetch danh sách voucher khả dụng khi mở modal
    const fetchAvailableVouchers = async () => {
        try {
            const res = await axiosConfig.get('/vouchers/available');
            setAvailableVouchers(res.data);
        } catch (error) {
            console.error("Lỗi tải voucher:", error);
        }
    };

    useEffect(() => {
        if (isModalOpen) fetchAvailableVouchers();
    }, [isModalOpen]);

    // 2. Xử lý áp dụng voucher (Gọi API Preview)
    const handleApply = async (codeToApply) => {
        if (!codeToApply) return;
        
        setLoading(true);
        try {
            // Gọi API Preview để check tính hợp lệ và lấy số tiền giảm
            const res = await axiosConfig.get('/vouchers/preview', {
                params: {
                    code: codeToApply,
                    totalAmount: totalAmount
                }
            });

            // Nếu API trả về 200 OK -> Thành công
            const discountData = res.data; // { valid: true, discountAmount: 50000, ... }
            
            // Tìm thông tin chi tiết voucher (nếu có trong list available) hoặc tạo object tạm
            const voucherInfo = availableVouchers.find(v => v.code === codeToApply) || { code: codeToApply };

            setSelectedVoucher({ ...voucherInfo, discountAmount: discountData.discountAmount });
            
            // Báo lên cha (Checkout Page) để trừ tiền
            onApplyVoucher({ 
                code: codeToApply, 
                discountAmount: discountData.discountAmount 
            });

            Swal.fire({
                icon: 'success',
                title: 'Áp dụng thành công!',
                text: `Bạn được giảm ${new Intl.NumberFormat('vi-VN').format(discountData.discountAmount)}đ`,
                timer: 1500,
                showConfirmButton: false
            });
            setIsModalOpen(false); // Đóng modal nếu đang mở

        } catch (error) {
            // API trả về lỗi (400 Bad Request) kèm message
            const msg = error.response?.data?.message || "Mã giảm giá không hợp lệ";
            Swal.fire('Không thể áp dụng', msg, 'error');
            
            // Nếu lỗi thì reset voucher đang chọn
            handleRemove();
        } finally {
            setLoading(false);
        }
    };

    // 3. Xử lý gỡ bỏ voucher
    const handleRemove = () => {
        setSelectedVoucher(null);
        setInputCode('');
        onApplyVoucher(null); // Báo lên cha là không dùng voucher nữa
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold">
                <Tag size={18} className="text-cyan-600" />
                <span>Mã giảm giá</span>
            </div>

            {/* A. Trạng thái: Chưa chọn voucher */}
            {!selectedVoucher ? (
                <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="MÃ GIẢM GIÁ"
                    className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 uppercase placeholder:normal-case outline-none transition-all"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                />
                <button 
                    onClick={() => handleApply(inputCode)}
                    disabled={!inputCode || loading}
                    className="bg-gray-800 hover:bg-black text-white font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    ) : 'Áp dụng'}
                </button>
            </div>
            ) : (
                /* B. Trạng thái: Đã chọn voucher */
                <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 p-3 rounded-lg">
                    <div>
                        <p className="text-cyan-700 font-bold text-sm">{selectedVoucher.code}</p>
                        <p className="text-xs text-cyan-600">Đã giảm: -{new Intl.NumberFormat('vi-VN').format(selectedVoucher.discountAmount)}đ</p>
                    </div>
                    <button onClick={handleRemove} className="text-gray-400 hover:text-red-500">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Nút mở Modal chọn voucher */}
            {!selectedVoucher && (
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 flex items-center justify-between text-sm text-cyan-600 cursor-pointer hover:underline"
                >
                    <span>Chọn mã ưu đãi có sẵn</span>
                    <ChevronRight size={16} />
                </div>
            )}

            {/* --- MODAL DANH SÁCH VOUCHER --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Chọn Voucher">
                <div className="p-4 bg-gray-50 max-h-[60vh] overflow-y-auto space-y-3">
                    {/* Input search trong modal */}
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            placeholder="Tìm mã voucher..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        />
                        <button 
                            onClick={() => handleApply(inputCode)}
                            className="bg-cyan-600 text-white px-4 rounded-lg text-sm"
                        >
                            Áp dụng
                        </button>
                    </div>

                    {availableVouchers.length === 0 && (
                        <p className="text-center text-gray-500 py-4">Không có mã giảm giá nào phù hợp.</p>
                    )}

                    {availableVouchers.map(v => {
                        // Kiểm tra điều kiện tối thiểu để disable visual (tùy chọn)
                        const isDisabled = totalAmount < v.minOrderValue;
                        return (
                            <VoucherCard 
                                key={v.id} 
                                voucher={v}
                                disabled={isDisabled}
                                isSelected={selectedVoucher?.code === v.code}
                                onSelect={() => !isDisabled && handleApply(v.code)}
                            />
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
};

export default VoucherSelector;