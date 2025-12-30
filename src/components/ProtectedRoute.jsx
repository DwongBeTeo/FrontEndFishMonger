import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    // Gọi useUser ở đây 1 lần duy nhất cho các route con
    const { user, isLoading } = useContext(AuthContext);

    // --- THÊM DÒNG NÀY ĐỂ DEBUG ---
    if (user) {
        console.log("--- DEBUG PROTECTED ROUTE ---");
        console.log("User trong Context:", user);
        console.log("Role mong đợi (allowed):", allowedRoles);
        const currentRole = user.role?.name || user.role || "USER"; 
        console.log("Role thực tế tính toán được:", currentRole);
    }

    if(isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoaderCircle className="animate-spin w-10 h-10 text-purple-600"/>
            </div>
        );
    }

    // 1. Nếu không có user -> Chưa đăng nhập -> Về Login
    if (!user) {
        console.log("Vui lý đăng nhập để sử dụng chắc năng này");
        return <Navigate to="/login" replace />;
    }

    // 2. Kiểm tra Role
    // Lưu ý: Cấu trúc user phụ thuộc vào cái API GET_USER_INFO trả về.
    // Giả sử API trả về: { fullName: "A", role: { name: "ADMIN" } } hoặc role: "ADMIN"
    // Bạn cần debug xem console.log(user) ra cái gì để sửa dòng dưới đây:
    const userRole = user.role?.name || user.role || "USER"; 

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Có đăng nhập nhưng sai quyền
        console.log("Sai quyền truy cập");
        
        return <Navigate to="/" replace />; // Hoặc về trang Home
    }

    // 3. OK -> Hiển thị nội dung
    return <Outlet />;
}

export default ProtectedRoute;