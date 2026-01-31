import { useEffect, useState } from "react";
import SlideShow from "../components/SlideShow";
import { Link } from "react-router-dom";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import CategorySection from "../components/user/CategorySection";
import VoucherBanner from "../components/user/home/VoucherBanner"; 
const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_PRODUCT_FOR_HOME); 
      if (res.status === 200) {
        setNewProducts(res.data.content || []);
      }
    } catch (error) {
      console.error("Lỗi tải trang chủ:", error);
    } finally {
      setLoading(false);
    }
  };  
  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
      <div className="pb-10 bg-gray-50/50"> {/* Thêm bg-gray nhẹ cho toàn trang */}
        
        {/* 1. Banner Slider */}
        <SlideShow /> 
        <p className="text-sm text-slate-800 text-center mt-6">
            Phát triển bởi Trần Đăng Dương-K22CNT2 Khoa Công nghệ Thông tin Đại học Nguyễn trãi(link page cuar ban than)
        </p>
        <p className="text-sm text-slate-800 text-center mt-6">
            Link page cuar truong
        </p>
        <p className="text-sm text-slate-800 text-center mt-6">
            Link page cua khoa
        </p>

        {/* --- 2. VOUCHER BANNER (MỚI) --- */}
        <div className="mt-[-20px] relative z-10"> {/* Kỹ thuật overlap nhẹ lên slider nếu muốn đẹp */}
             <VoucherBanner />
        </div>

        <div className="container mx-auto px-4 mt-6">

            {/* Các Category Section */}
            <div className="space-y-8">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <CategorySection 
                        categoryId={10} 
                        title="Cá Koi Nhật Bản" 
                        subTitle="Nhập khẩu trực tiếp từ Nhật, phẩm chất cao"
                        slug="ca-koi-nhat-ban-vip"
                    />
                </div>
                
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <CategorySection 
                        categoryId={4} 
                        title="Cá dĩa Cảnh" 
                        subTitle="Các dòng cá dĩa đẹp, phong thủy"
                        slug="ca-dia"
                    />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <CategorySection 
                        categoryId={1} 
                        title="Cá chép Cảnh" 
                        subTitle="Các dòng cá chép đẹp, phong thủy"
                        slug="ca-chep"
                    />
                </div>
            </div>

            {/* 4. Banner phụ (Quảng cáo) */}
            <section className="py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                        <span className="text-2xl font-bold z-10">Thức ăn cá giảm 20%</span>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full mt-2 z-10 backdrop-blur-sm">Mua ngay &rarr;</span>
                    </div>
                    <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-400 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                        <span className="text-2xl font-bold z-10">Combo bể cá mini giá sốc</span>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full mt-2 z-10 backdrop-blur-sm">Xem chi tiết &rarr;</span>
                    </div>
                </div>
            </section>

        </div>
    </div>
    );
}

export default Home;