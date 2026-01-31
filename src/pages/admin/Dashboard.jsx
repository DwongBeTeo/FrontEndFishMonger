import React, { useEffect, useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
    DollarSign, ShoppingBag, Calendar, Users, TrendingUp, 
    ArrowUp, ArrowDown, Package, Clock, CheckCircle, XCircle, Search, Tag 
} from 'lucide-react';
import axiosConfig from '../../util/axiosConfig';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- STATE FOR VOUCHER STATS ---
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherStats, setVoucherStats] = useState(null);
    const [voucherLoading, setVoucherLoading] = useState(false);

    // Fetch General Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosConfig.get('/admin/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Lỗi tải thống kê:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // --- FUNCTION TO FETCH VOUCHER STATS ---
    const handleCheckVoucher = async () => {
        if (!voucherCode.trim()) return;
        setVoucherLoading(true);
        setVoucherStats(null); // Reset previous result
        try {
            // Call API: GET /admin/dashboard/{code}/stats
            const res = await axiosConfig.get(`/admin/dashboard/${voucherCode}/stats`);
            setVoucherStats(res.data);
        } catch (error) {
            console.error("Lỗi tra cứu voucher:", error);
            // Optional: Show error toast/alert here
        } finally {
            setVoucherLoading(false);
        }
    };

    // --- HELPERS ---
    const formatCurrency = (value) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    const pieData = stats?.orderStatusCounts ? [
        { name: 'Hoàn thành', value: stats.orderStatusCounts['COMPLETED'] || 0, color: '#10b981' },
        { name: 'Chờ xử lý', value: stats.orderStatusCounts['PENDING'] || 0, color: '#f59e0b' },
        { name: 'Đã hủy', value: stats.orderStatusCounts['CANCELLED'] || 0, color: '#ef4444' },
        { name: 'Giao hàng', value: stats.orderStatusCounts['SHIPPING'] || 0, color: '#3b82f6' },
    ].filter(item => item.value > 0) : [];

    // --- RENDER ---
    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
    );

    if (!stats) return <div className="p-8 text-center text-gray-500">Không có dữ liệu hiển thị.</div>;

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Tổng quan kinh doanh</h1>
                <p className="text-gray-500 text-sm mt-1">Cập nhật tình hình kinh doanh mới nhất</p>
            </div>

            {/* --- PHẦN 1: STAT CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Tổng Doanh Thu" value={formatCurrency(stats.totalRevenueThisMonth)} icon={DollarSign} color="bg-emerald-500" growth={stats.growthRate} subText="So với tháng trước" />
                <StatCard title="Đơn hàng mới" value={stats.totalOrdersThisMonth} icon={ShoppingBag} color="bg-blue-500" />
                <StatCard title="Lịch hẹn dịch vụ" value={stats.totalAppointmentsThisMonth} icon={Calendar} color="bg-purple-500" />
                <StatCard title="Tổng Khách hàng" value={stats.totalCustomers} icon={Users} color="bg-orange-500" />
            </div>

            {/* --- PHẦN 2: CHARTS SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={20} className="text-cyan-600"/> Biểu đồ doanh thu
                        </h2>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dailyRevenues} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0891b2" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(val) => `${val/1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [formatCurrency(value), "Doanh thu"]} labelFormatter={(label) => `Ngày: ${formatDate(label)}`} />
                                <Area type="monotone" dataKey="revenue" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Package size={20} className="text-cyan-600"/> Trạng thái đơn hàng
                    </h2>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- NEW SECTION: VOUCHER CHECKER --- */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Tag size={20} className="text-cyan-600"/> Tra cứu hiệu quả Voucher
                </h2>
                
                <div className="flex gap-4 mb-6 max-w-md">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Nhập mã voucher (VD: SALE50)" 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none uppercase"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheckVoucher()}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <button 
                        onClick={handleCheckVoucher}
                        disabled={voucherLoading || !voucherCode}
                        className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                        {voucherLoading ? 'Đang tra cứu...' : 'Tra cứu'}
                    </button>
                </div>

                {/* Display Voucher Stats Result */}
                {voucherStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">Số lượt sử dụng</p>
                            <p className="text-2xl font-bold text-gray-800">{voucherStats.totalUsed}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">Doanh thu mang lại</p>
                            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(voucherStats.totalRevenue)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">Tổng tiền đã giảm</p>
                            <p className="text-2xl font-bold text-orange-600">{formatCurrency(voucherStats.totalDiscount)}</p>
                        </div>
                    </div>
                )}
                
                {/* Empty State / Not Found (Optional check) */}
                {voucherStats && voucherStats.totalUsed === 0 && (
                    <p className="text-sm text-gray-500 italic mt-2">Mã voucher này chưa được sử dụng lần nào hoặc không tồn tại.</p>
                )}
            </div>

            {/* --- PHẦN 3: LISTS SECTION (Top Products & Recent Orders) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 3.1 Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Top sản phẩm bán chạy</h2>
                    <div className="space-y-4">
                        {stats.topProducts && stats.topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 m-auto text-gray-400 mt-3" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-gray-500">Đã bán: <span className="font-bold text-cyan-600">{product.totalSold}</span></p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-600">{formatCurrency(product.totalRevenue)}</span>
                            </div>
                        ))}
                        {(!stats.topProducts || stats.topProducts.length === 0) && <p className="text-center text-gray-400 text-sm py-4">Chưa có dữ liệu bán hàng.</p>}
                    </div>
                </div>

                {/* 3.2 Recent Orders Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng gần đây</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3">Mã đơn</th>
                                    <th className="px-4 py-3">Khách hàng</th>
                                    <th className="px-4 py-3">Tổng tiền</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders && stats.recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-4 py-3 text-gray-600">{order.fullName || order.userFullName || "Khách lẻ"}</td>
                                        <td className="px-4 py-3 font-medium">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!stats.recentOrders || stats.recentOrders.length === 0) && <p className="text-center text-gray-400 text-sm py-4">Chưa có đơn hàng nào.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... Sub-components (StatCard, StatusBadge) remain exactly the same as your provided code ...
const StatCard = ({ title, value, icon: Icon, color, growth, subText }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg text-white ${color} shadow-lg shadow-opacity-20`}>
                    <Icon size={22} />
                </div>
                {growth !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-1 rounded-full`}>
                        {growth >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(growth)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
                {subText && <p className="text-xs text-gray-400 mt-2">{subText}</p>}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING:    { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Chờ xử lý' },
        CONFIRMED:  { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: CheckCircle, label: 'Đã xác nhận' },
        SHIPPING:   { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Package, label: 'Đang giao' },
        COMPLETED:  { bg: 'bg-emerald-100',text: 'text-emerald-700',icon: CheckCircle, label: 'Hoàn thành' },
        CANCELLED:  { bg: 'bg-rose-100',   text: 'text-rose-700',   icon: XCircle, label: 'Đã hủy' },
    };

    const style = styles[status] || styles.PENDING;
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            <Icon size={12} />
            {style.label}
        </span>
    );
};

export default Dashboard;