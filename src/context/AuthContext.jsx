import { createContext, useContext, useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AppContextProvider = ({children}) => {

    const [user,setUser] = useState(null);

    // State này cực quan trọng: Để chặn App render khi đang check token
    const [isLoading, setIsLoading] = useState(true);

    // Helper Method
    const mergeUserWithTokenRole = (apiUser,token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                ...apiUser,
                role: decoded.role, // "ADMIN" hoặc "USER" lấy từ token
                email: decoded.sub, // Lấy email từ token cho chắc chắn
            }
        } catch (error) {
            return null;
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                // Gọi API 1 lần duy nhất khi web vừa load (F5)
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.log("Token hết hạn hoặc lỗi mạng:", error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                // Dù thành công hay thất bại cũng phải tắt loading
                setIsLoading(false);
            }
        };

        initAuth();
    }, []); // Empty dependency array [] đảm bảo chỉ chạy 1 lần duy nhất


    // --- HÀM LOGIN  ---
    const login = (token, dataFromApi) => {
        // 1. Lưu token
        localStorage.setItem('token', token);

        // 2. Luôn ưu tiên Role từ Token (Single Source of Truth)
        const decoded = jwtDecode(token);
        
        // 3. Merge dữ liệu: Lấy role từ token, lấy tên/email từ API
        const finalUser = {
            ...dataFromApi,      // FullName, Email...
            role: decoded.role,  // Ghi đè Role từ token để đảm bảo chính xác 100%
            email: decoded.sub   // Hoặc lấy email từ token luôn cho chắc
        };

        // 4. Lưu vào State
        setUser(finalUser);
        
        // 5. Trả về role để bên ngoài biết đường điều hướng (nếu cần)
        return decoded.role;
    };

    // --- HÀM LOGOUT CHUYÊN NGHIỆP ---
    const logout = () => {
        // 1. Xóa token khỏi Storage (Quan trọng nhất)
        localStorage.removeItem('token');

        // 2. Xóa state User để giao diện cập nhật ngay lập tức
        setUser(null);

        // 3. Điều hướng về trang Login
        
        // AuthContext (Provider) phải nằm bên trong BrowserRouter
        // index.js (hoặc main.jsx)
        {/* Router bọc bên ngoài cùng */}
        {/* Provider nằm trong Router -> Dùng được navigate */}
        // <BrowserRouter> 
        //     <AppContextProvider> 
        //         <App />
        //     </AppContextProvider>
        // </BrowserRouter>


        // navigate('/login');
        
        // Mẹo chuyên nghiệp: Nếu muốn xóa sạch mọi state rác của ứng dụng, 
        // thay vì navigate, bạn có thể dùng lệnh reload cứng (tùy chọn):
        // window.location.href = "/login";
    };

    const contextValue = {
        user,
        setUser,
        clearUser,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )

};
export default AuthContext;
// export default useAuth = () => useContext(AuthContext); // Để dùng với useContext(AppContext)