import React, { useState, useEffect, useCallback } from 'react';
import Input from '../common/Input';
import Swal from 'sweetalert2';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import axiosConfig from '../../util/axiosConfig';
import { isValidPhone } from '../../util/Validation';

const AddressSelector = ({ user, onSelect, selectedAddress, onDelete }) => {
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [mode, setMode] = useState('loading');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [localForm, setLocalForm] = useState({
        recipientName: '',
        phoneNumber: '',
        shippingAddress: '',
        isDefault: false
    });

    // ✅ 1. Load danh sách địa chỉ - Dùng useCallback với dependency đúng
    const fetchAddresses = useCallback(async (autoSelectDefault = false) => {
        try {
            const res = await axiosConfig.get('/addresses');
            const addresses = res.data;
            setSavedAddresses(addresses);
            
            if (addresses.length > 0) {
                // Chỉ tự động select khi cần thiết (lần đầu load hoặc sau khi save)
                if (autoSelectDefault && !selectedAddress) {
                    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
                    onSelect({
                        id: defaultAddr.id,
                        recipientName: defaultAddr.recipientName,
                        phoneNumber: defaultAddr.phoneNumber,
                        address: defaultAddr.detailedAddress
                    });
                }
                setMode('select');
            } else {
                setMode('new');
                // Tự động điền thông tin user nếu chưa có địa chỉ
                if (user) {
                    setLocalForm({
                        recipientName: user.fullName || user.username || '',
                        phoneNumber: user.phoneNumber || '',
                        shippingAddress: user.address || '',
                        isDefault: false
                    });
                }
            }
        } catch (error) {
            console.error("Lỗi tải địa chỉ:", error);
            setMode('new');
        }
    }, [user, selectedAddress, onSelect]); // ✅ Dependencies rõ ràng

    // ✅ 2. Chỉ load lần đầu khi mount
    useEffect(() => {
        fetchAddresses(true); // Load và auto-select lần đầu
    }, []); // ✅ Chỉ chạy 1 lần khi mount
    
    // ✅ 3. Update form khi user thay đổi (chỉ khi ở mode 'new')
    useEffect(() => {
        if (mode === 'new' && user) {
            setLocalForm(prev => ({
                ...prev,
                recipientName: user.fullName || user.username || prev.recipientName,
                phoneNumber: user.phoneNumber || prev.phoneNumber,
                shippingAddress: user.address || prev.shippingAddress
            }));
        }
    }, [user, mode]);

    // ✅ 4. Xử lý chọn địa chỉ - Tối ưu logic
    const handleSelect = async (addr) => {
        // Nếu click vào địa chỉ chưa phải mặc định → Đổi thành mặc định
        if (!addr.isDefault) {
            try {
                setLoading(true);
                const payload = {
                    recipientName: addr.recipientName,
                    phoneNumber: addr.phoneNumber,
                    detailedAddress: addr.detailedAddress,
                    isDefault: true
                };
                
                await axiosConfig.put(`/addresses/${addr.id}`, payload);
                
                // ✅ Chỉ reload danh sách, KHÔNG tự động select lại
                await fetchAddresses(false);
                
            } catch (error) {
                console.error("Lỗi khi chuyển mặc định:", error);
                Swal.fire('Lỗi', 'Không thể thay đổi địa chỉ mặc định', 'error');
                setLoading(false);
                return; // Dừng lại nếu lỗi
            } finally {
                setLoading(false);
            }
        }

        // ✅ Luôn báo cho component cha biết địa chỉ được chọn
        onSelect({
            id: addr.id,
            recipientName: addr.recipientName,
            phoneNumber: addr.phoneNumber,
            address: addr.detailedAddress
        });
    };

    // ✅ 5. Xử lý sửa
    const handleEditClick = (e, addr) => {
        e.stopPropagation();
        setEditingId(addr.id);
        setLocalForm({
            recipientName: addr.recipientName,
            phoneNumber: addr.phoneNumber,
            shippingAddress: addr.detailedAddress,
            isDefault: addr.isDefault
        });
        setMode('edit');
    };

    // ✅ 6. Lưu địa chỉ (Thêm/Sửa) - Tối ưu
    const handleSave = async () => {
        // Validation
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
                // Nếu là địa chỉ đầu tiên hoặc user tick checkbox → set mặc định
                isDefault: savedAddresses.length === 0 || localForm.isDefault
            };

            let savedAddressId;
            if (mode === 'edit') {
                await axiosConfig.put(`/addresses/${editingId}`, payload);
                savedAddressId = editingId;
            } else {
                const res = await axiosConfig.post('/addresses', payload);
                savedAddressId = res.data.id; // Giả sử BE trả về ID
            }
            
            // ✅ Reload danh sách
            await fetchAddresses(false);
            
            // ✅ Tự động select địa chỉ vừa lưu
            const savedAddr = savedAddresses.find(a => a.id === savedAddressId);
            if (savedAddr) {
                onSelect({
                    id: savedAddr.id,
                    recipientName: savedAddr.recipientName,
                    phoneNumber: savedAddr.phoneNumber,
                    address: savedAddr.detailedAddress
                });
            }
            
            setMode('select');
            setEditingId(null);
            
            Swal.fire('Thành công', `Đã ${mode === 'edit' ? 'cập nhật' : 'thêm'} địa chỉ`, 'success');

        } catch (error) {
            console.error('Lỗi lưu địa chỉ:', error);
            Swal.fire('Lỗi', error.response?.data?.message || 'Lỗi lưu địa chỉ', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setMode('select');
        setEditingId(null);
        setLocalForm({ recipientName: '', phoneNumber: '', shippingAddress: '', isDefault: false });
    };

    // ✅ 7. Logic kiểm tra Radio - Dựa vào selectedAddress từ cha
    const isRadioChecked = (addr) => {
        if (selectedAddress?.id && addr.id) {
            return selectedAddress.id === addr.id;
        }
        // Fallback: nếu chưa có selectedAddress, hiển thị theo isDefault
        return addr.isDefault;
    };

    // ✅ 8. Xử lý xóa
    const handleDeleteClick = (e, addr) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(addr.id);
        }
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
                            className={`relative flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all group 
                                ${isRadioChecked(addr) 
                                    ? 'border-cyan-600 bg-cyan-50 ring-1 ring-cyan-600' 
                                    : 'hover:bg-gray-50 border-gray-200'
                                }`}
                        >
                            <input 
                                type="radio" 
                                name="addressGroup"
                                checked={isRadioChecked(addr)}
                                onChange={() => {}} // ✅ Controlled component
                                className="mt-1 text-cyan-600 cursor-pointer"
                            />
                            <div className="flex-1">
                                <p className="font-bold text-gray-800 text-sm">
                                    {addr.recipientName} 
                                    <span className="font-normal text-gray-500"> | </span> 
                                    {addr.phoneNumber}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">{addr.detailedAddress}</p>
                                {addr.isDefault && (
                                    <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded mt-1 inline-block">
                                        Mặc định
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex gap-1">
                                <button 
                                    onClick={(e) => handleEditClick(e, addr)}
                                    className="text-gray-400 hover:text-cyan-600 p-1 transition-colors"
                                    title="Sửa địa chỉ"
                                >
                                    <Pencil size={16} />
                                </button>

                                {onDelete && (
                                    <button 
                                        onClick={(e) => handleDeleteClick(e, addr)}
                                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                        title="Xóa địa chỉ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    <button 
                        onClick={() => {
                            setMode('new');
                            setLocalForm({ 
                                recipientName: '', 
                                phoneNumber: '', 
                                shippingAddress: '',
                                isDefault: false
                            });
                        }} 
                        className="text-sm text-cyan-600 font-semibold hover:underline mt-2 flex items-center gap-1 w-fit"
                    >
                        <Plus size={16}/> Thêm địa chỉ mới
                    </button>
                </div>
            )}

            {/* --- FORM MODE (NEW/EDIT) --- */}
            {(mode === 'new' || mode === 'edit') && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase">
                        {mode === 'new' ? 'Thêm địa chỉ mới' : 'Cập nhật địa chỉ'}
                    </h4>
                    <div className="flex flex-col gap-3">
                        <Input 
                            label="Người nhận" 
                            placeholder="VD: Nguyễn Văn A"
                            value={localForm.recipientName} 
                            onChange={(e) => setLocalForm({...localForm, recipientName: e.target.value})} 
                        />
                        <Input 
                            label="Số điện thoại" 
                            placeholder="VD: 0987654321" 
                            type="tel"
                            value={localForm.phoneNumber}
                            onChange={(e) => setLocalForm({...localForm, phoneNumber: e.target.value})}
                        />
                        <Input 
                            label="Địa chỉ chi tiết" 
                            placeholder="Số nhà, đường, phường/xã..." 
                            multiline={true}
                            value={localForm.shippingAddress}
                            onChange={(e) => setLocalForm({...localForm, shippingAddress: e.target.value})}
                        />
                        
                        {/* Checkbox chọn mặc định */}
                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="checkbox"
                                id="isDefaultCheckbox"
                                className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                                checked={localForm.isDefault}
                                onChange={(e) => setLocalForm({...localForm, isDefault: e.target.checked})}
                            />
                            <label htmlFor="isDefaultCheckbox" className="text-sm text-gray-700 cursor-pointer select-none">
                                Đặt làm địa chỉ mặc định
                            </label>
                        </div>

                        <div className="flex gap-2 mt-2 pt-3 border-t border-gray-200">
                            <button 
                                onClick={handleSave} 
                                disabled={loading}
                                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
                            </button>
                            {savedAddresses.length > 0 && (
                                <button 
                                    onClick={handleCancel} 
                                    disabled={loading}
                                    className="text-gray-600 hover:bg-gray-200 px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
                                >
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