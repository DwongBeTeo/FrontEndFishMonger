import React, { useState, useEffect } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';
import AddressSelector from '../../../components/common/AddressSelector';

const AddressBook = () => {
    const [refresh, setRefresh] = useState(0);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0891b2',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa ngay'
        });

        if (result.isConfirmed) {
            try {
                await axiosConfig.delete(`/addresses/${id}`);
                Swal.fire('Đã xóa!', 'Địa chỉ đã được gỡ khỏi sổ.', 'success');
                setRefresh(prev => prev + 1); // Load lại danh sách
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể xóa địa chỉ mặc định hoặc lỗi hệ thống', 'error');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sổ địa chỉ của tôi</h2>
                <p className="text-sm text-gray-500">Quản lý các địa chỉ nhận hàng định kỳ</p>
            </div>

            {/* Tái sử dụng AddressSelector nhưng có thêm chức năng Xóa */}
            <div className="space-y-4">
                <AddressSelector 
                    key={refresh}
                    onSelect={(addr) => console.log("Xem địa chỉ:", addr)}
                    onDelete={handleDelete}
                />
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                    <strong>Mẹo:</strong> Địa chỉ mặc định sẽ được tự động chọn khi bạn tiến hành đặt hàng để tiết kiệm thời gian.
                </p>
            </div>
        </div>
    );
};

export default AddressBook;