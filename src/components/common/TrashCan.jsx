import React from 'react';
import { RotateCcw, X, Archive } from 'lucide-react';

const TrashCan = ({ title, data, onRestore, onClose, isLoading }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-800">
                        <Archive size={24} className="text-orange-500" />
                        <h2 className="text-xl font-bold">Thùng rác - {title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body List */}
                <div className="flex-1 overflow-y-auto p-0">
                    {isLoading ? (
                        <div className="text-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>
                    ) : data.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                            <Archive size={48} className="mb-2 opacity-20" />
                            <p>Thùng rác trống</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Tên / Tiêu đề</th>
                                    <th className="px-6 py-3">Ngày xóa (Cập nhật cuối)</th>
                                    <th className="px-6 py-3 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-500">#{item.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {item.name || item.title} {/* Support cả Category và Post */}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {item.updatedDate ? new Date(item.updatedDate).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => onRestore(item.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200 transition-all font-medium text-xs"
                                            >
                                                <RotateCcw size={14} /> Khôi phục
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrashCan;