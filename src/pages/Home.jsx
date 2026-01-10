import { useEffect, useState } from "react";
import SlideShow from "../components/SlideShow";
import { Box, BoxIcon, Link } from "lucide-react";
import axiosConfig from "../util/axiosConfig";
import ProductCard from "../components/user/ProductCard";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import CategorySection from "../components/user/CategorySection";
const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      // Gọi API lấy sản phẩm mới nhất (Page 0, Size 8)
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
      <div className="pb-10">
        {/* 1. Banner Slider */}
        <SlideShow /> 

        <div className="container mx-auto px-4">
          
            {/* 2. Danh mục nổi bật (Demo tĩnh hoặc gọi API Categories) */}
            <section className="py-10">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Sản phẩm nổi bật</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Demo item */}
                    {['Cá Koi', 'Cá Rồng', 'Bể Cá', 'Thức Ăn', 'Thuốc', 'Phụ Kiện'].map((cat, idx) => (
                        <Link key={idx} to={`/products?category=${idx}`} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                {/* Icon tương ứng */}
                                📦
                            </div>
                            <span className="font-medium text-sm text-gray-700">{cat}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="bg-white">
                <CategorySection 
                    categoryId={10} 
                    title="Cá Koi Nhật Bản" 
                    subTitle="Nhập khẩu trực tiếp từ Nhật, phẩm chất cao"
                    slug="ca-koi-nhat-ban-vip"
                />
            </div>
            
            <div className="bg-white">
                <CategorySection 
                    categoryId={4} 
                    title="Cá dĩa Cảnh" 
                    subTitle="Các dòng cá dĩa đẹp, phong thủy"
                    slug="ca-dia"
                />
            </div>

            <div className="bg-white">
                <CategorySection 
                    categoryId={1} 
                    title="Cá chép Cảnh" 
                    subTitle="Các dòng cá chép đẹp, phong thủy"
                    slug="ca-chep"
                />
            </div>

          {/* 4. Banner phụ (Quảng cáo) */}
          <section className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      Khuyến mãi thức ăn cá 20%
                  </div>
                  <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      Combo bể cá mini giá sốc
                  </div>
              </div>
          </section>

        </div>
    </div>
    );
}

export default Home;