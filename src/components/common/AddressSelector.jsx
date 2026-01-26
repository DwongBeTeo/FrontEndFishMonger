import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Swal from 'sweetalert2';
import { Pencil, Plus } from 'lucide-react';
import axiosConfig from '../../util/axiosConfig';
import { isValidPhone } from '../../util/Validation';

/**
 * Component quản lý địa chỉ dùng chung
 * @param {object} user - Thông tin user hiện tại (để điền tự động)
 * @param {function} onSelect - Callback trả về địa chỉ khi người dùng chọn (addrObject) => void
 * @param {object} selectedAddress - Địa chỉ đang được chọn (để sync với cha)
 */
const AddressSelector = ({ user, onSelect, selectedAddress }) => {
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [mode, setMode] = useState('loading'); // 'loading', 'select', 'new', 'edit'
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form state nội bộ
    const [localForm, setLocalForm] = useState({
        recipientName: '',
        phoneNumber: '',
        shippingAddress: ''
    });

    // 1. Load danh sách địa chỉ
    const fetchAddresses = async () => {
        try {
            const res = await axiosConfig.get('/addresses');
            setSavedAddresses(res.data);
            
            if (res.data.length > 0) {
                // Nếu chưa có địa chỉ nào được chọn từ cha, chọn cái đầu tiên
                if (!selectedAddress) {
                    const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
                    handleSelect(defaultAddr);
                }
                if (mode !== 'edit') setMode('select');
            } else {
                setMode('new');
                // Tự động điền thông tin user nếu chưa có địa chỉ nào
                if (user) {
                    setLocalForm({
                        recipientName: user.fullName || user.username || '',
                        phoneNumber: user.phoneNumber || '',
                        shippingAddress: user.address || ''
                    });
                }
            }
        } catch (error) {
            console.error("Lỗi tải địa chỉ:", error);
            setMode('new');
        }
    };

    useEffect(() => {
        fetchAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // 2. Xử lý khi chọn địa chỉ
    const handleSelect = (addr) => {
        // Gọi callback để báo cho component cha biết
        onSelect({
            id: addr.id, // Có ID nếu là địa chỉ cũ
            recipientName: addr.recipientName,
            phoneNumber: addr.phoneNumber,
            address: addr.detailedAddress
        });
    };

    // 3. Xử lý sửa
    const handleEditClick = (e, addr) => {
        e.stopPropagation();
        setEditingId(addr.id);
        setLocalForm({
            recipientName: addr.recipientName,
            phoneNumber: addr.phoneNumber,
            shippingAddress: addr.detailedAddress
        });
        setMode('edit');
    };

    // 4. Lưu địa chỉ (Thêm/Sửa)
    const handleSave = async () => {
        if (!localForm.recipientName || !localForm.phoneNumber || !localForm.shippingAddress) {
            Swal.fire('Thiếu thông tin', 'Vui lòng nhập đủ thông tin', 'warning');
            return;
        }
        if (!isValidPhone(localForm.phoneNumber)) {
            Swal.fire('SĐT sai', 'Số điện thoại không hợp lệ', 'error');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                recipientName: localForm.recipientName,
                phoneNumber: localForm.phoneNumber,
                detailedAddress: localForm.shippingAddress,
                isDefault: savedAddresses.length === 0
            };

            if (mode === 'edit') {
                await axiosConfig.put(`/addresses/${editingId}`, payload);
            } else {
                await axiosConfig.post('/addresses', payload);
            }
            
            await fetchAddresses(); // Reload list
            setMode('select');
            setEditingId(null);
            
            // Chọn luôn địa chỉ vừa lưu (nếu là mới)
            if(mode === 'new') {
                 // Logic chọn lại cái mới nhất (tạm thời reload sẽ chọn default)
            }

        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Lỗi lưu địa chỉ', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setMode('select');
        setEditingId(null);
    };

    // Render logic
    const isSelected = (addr) => {
        // So sánh theo ID nếu có, hoặc so sánh nội dung
        if (selectedAddress?.id && addr.id) return selectedAddress.id === addr.id;
        return selectedAddress?.address === addr.detailedAddress; 
    };

    return (
        <div className="flex flex-col gap-4">
            {/* --- LIST MODE --- */}
            {mode === 'select' && savedAddresses.length > 0 && (
                <div className="flex flex-col gap-3">
                    {savedAddresses.map((addr) => (
                        <div 
                            key={addr.id} 
                            onClick={() => handleSelect(addr)}
                            className={`relative flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all group ${isSelected(addr) ? 'border-cyan-600 bg-cyan-50 ring-1 ring-cyan-600' : 'hover:bg-gray-50 border-gray-200'}`}
                        >
                            <input 
                                type="radio" 
                                name="addressGroup"
                                checked={isSelected(addr)}
                                onChange={() => handleSelect(addr)}
                                className="mt-1 text-cyan-600 cursor-pointer"
                            />
                            <div className="flex-1">
                                <p className="font-bold text-gray-800 text-sm">
                                    {addr.recipientName} <span className="font-normal text-gray-500">|</span> {addr.phoneNumber}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">{addr.detailedAddress}</p>
                                {addr.isDefault && <span className="text-[10px] bg-gray-200 text-gray-600 px-1 rounded mt-1 inline-block">Mặc định</span>}
                            </div>
                            <button 
                                onClick={(e) => handleEditClick(e, addr)}
                                className="text-gray-400 hover:text-cyan-600 p-1"
                            >
                                <Pencil size={16} />
                            </button>
                        </div>
                    ))}
                    
                    <button 
                        onClick={() => {
                            setMode('new');
                            setLocalForm({ recipientName: '', phoneNumber: '', shippingAddress: '' });
                        }} 
                        className="text-sm text-cyan-600 font-semibold hover:underline mt-2 flex items-center gap-1 w-fit"
                    >
                        <Plus size={16}/> Thêm địa chỉ mới
                    </button>
                </div>
            )}

            {/* --- FORM MODE (NEW/EDIT) --- */}
            {(mode === 'new' || mode === 'edit') && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm animate-fade-in-up">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase">
                        {mode === 'new' ? 'Thêm địa chỉ mới' : 'Cập nhật địa chỉ'}
                    </h4>
                    <div className="flex flex-col gap-3">
                        <Input 
                            label="Người nhận" placeholder="VD: Nguyễn Văn A"
                            value={localForm.recipientName} 
                            onChange={(e) => setLocalForm({...localForm, recipientName: e.target.value})} 
                        />
                        <Input 
                            label="Số điện thoại" placeholder="VD: 0987654321" type="number"
                            value={localForm.phoneNumber}
                            onChange={(e) => setLocalForm({...localForm, phoneNumber: e.target.value})}
                        />
                        <Input 
                            label="Địa chỉ chi tiết" placeholder="Số nhà, đường, phường/xã..." multiline={true}
                            value={localForm.shippingAddress}
                            onChange={(e) => setLocalForm({...localForm, shippingAddress: e.target.value})}
                        />
                        
                        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
                            <button 
                                onClick={handleSave} disabled={loading}
                                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
                            </button>
                            {savedAddresses.length > 0 && (
                                <button onClick={handleCancel} className="text-gray-600 hover:bg-gray-200 px-4 py-2 rounded text-sm transition-colors">
                                    Hủy
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressSelector;