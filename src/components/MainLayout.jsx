import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MenuBar from "./Header/MenuBar";
import Footer from "./footer/Footer";

const MainLayout = () => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'ADMIN';
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* ------------------------------------------------------ */}
            {/* TRƯỜNG HỢP 1: ADMIN (Layout Dashboard: Trái - Phải)    */}
            {/* ------------------------------------------------------ */}
            {isAdmin ? (
                <div className="flex h-screen overflow-hidden">
                    {/* Sidebar nằm bên trái, cố định */}
                    {/* Lưu ý: Bạn cần sửa CSS trong Sidebar một chút để nó full chiều cao nếu không có MenuBar */}
                    <div className="z-20 shrink-0">
                         <Sidebar /> 
                    </div>

                    {/* Content nằm bên phải */}
                    <main className="flex-1 h-full overflow-y-auto bg-gray-50 relative p-6 md:p-8">
                        <Outlet />
                    </main>
                </div>
            ) : (
                /* ------------------------------------------------------ */
                /* TRƯỜNG HỢP 2: USER (Layout Website: Trên - Dưới)       */
                /* ------------------------------------------------------ */
                <div className="flex flex-col w-full">
                    <MenuBar/>
                    {/* Nếu bạn có Sidebar riêng cho Admin, có thể check user ở đây để ẩn/hiện Sidebar */}
                    <div className="hidden">
                        <Sidebar/>
                    </div>

                    <div className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6">
                        {/* Outlet là nơi các trang con (Home, Login, Profile) sẽ được render vào */}
                        <Outlet />
                    </div>

                    {/* Footer luôn hiện */}
                    <Footer/>
                </div>

            )}
        </div>
    );
};

export default MainLayout;