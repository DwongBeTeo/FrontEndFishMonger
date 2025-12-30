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

            // // 2. Check token hết hạn (Client side check)
            // try {
            //     const decoded = jwtDecode(token);
            //     if (decoded.exp * 1000 < Date.now()) {
            //         console.warn("Token expired -> Logout");
            //         logout();
            //         return;
            //     }
            // } catch (error) {
            //     logout(); // Token rác/lỗi -> Logout
            //     return;
            // }

            try {
                // Gọi API 1 lần duy nhất khi web vừa load (F5)
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
                if (response.data) {
                    const finalUser = mergeUserWithTokenRole(response.data,token);
                    setUser(finalUser);
                }
            } catch (error) {
                console.log("Failed to restore session:", error);
                // Chỉ logout nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
                // Nếu 500 hoặc mất mạng thì KHÔNG logout, để user thử lại sau
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
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

        const finalUser = mergeUserWithTokenRole(dataFromApi,token);

        // 4. Lưu vào State
        setUser(finalUser);
        
        // 5. Trả về role để bên ngoài biết đường điều hướng (nếu cần)
        return finalUser?.role;
    };

    // --- HÀM LOGOUT CHUYÊN NGHIỆP ---
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoading(false);
    };

    const contextValue = {
        user,
        setUser,
        login,
        logout,
        isLoading,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )

};
export default AuthContext;
// export default useAuth = () => useContext(AuthContext); // Để dùng với useContext(AppContext)