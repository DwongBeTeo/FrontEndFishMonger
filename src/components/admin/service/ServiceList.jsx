import React from 'react';
import { Edit, Clock, Tag, ImageOff, Lock, Unlock } from 'lucide-react';

const ServiceList = ({ services, loading, onEdit, onToggleStatus }) => {
    
    if (loading) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
    );

    if (services.length === 0) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Chưa có dịch vụ nào</h3>
            <p className="text-gray-500 mt-1">Hãy tạo dịch vụ đầu tiên của bạn.</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                            <th className="px-6 py-4">Hình ảnh</th>
                            <th className="px-6 py-4">Tên dịch vụ</th>
                            <th className="px-6 py-4">Giá & Thời gian</th>
                            <th className="px-6 py-4">Mô tả</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.map((svc) => (
                            <tr key={svc.id} className="hover:bg-cyan-50/30 transition-colors group">
                                {/* Cột Ảnh */}
                                <td className="px-6 py-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        {svc.imageUrl ? (
                                            <img src={svc.imageUrl} alt={svc.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageOff className="text-gray-300" size={20} />
                                        )}
                                    </div>
                                </td>
                                
                                {/* Cột Tên */}
                                <td className="px-6 py-4 font-semibold text-gray-800">
                                    {svc.name}
                                </td>

                                {/* Cột Giá & Thời gian */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-cyan-700 font-bold">
                                            {svc.price?.toLocaleString()}đ
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                                            <Clock size={12} />
                                            <span>{svc.estimatedDuration} phút</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Cột Mô tả */}
                                <td className="px-6 py-4 max-w-xs">
                                    <p className="truncate text-gray-500" title={svc.description}>
                                        {svc.description || "Chưa có mô tả"}
                                    </p>
                                </td>

                                {/* Cột Trạng thái */}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                        svc.isActive 
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                            : 'bg-gray-100 text-gray-500 border-gray-200'
                                    }`}>
                                        {svc.isActive ? 'Đang hoạt động' : 'Đã ẩn'}
                                    </span>
                                </td>

                                {/* Cột Thao tác */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => onEdit(svc)}
                                            className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        
                                        <button 
                                            onClick={() => onToggleStatus(svc.id, svc.isActive)}
                                            className={`p-2 rounded-lg transition-all ${
                                                svc.isActive 
                                                    ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                                                    : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                                            }`}
                                            title={svc.isActive ? "Ẩn dịch vụ" : "Kích hoạt"}
                                        >
                                            {svc.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceList;