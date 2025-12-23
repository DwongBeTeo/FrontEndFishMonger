import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const ProductAdmin = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav>
            {user ? (
                <>
                    <span>Hello, {user.fullName}</span>
                    <div>Product for admin</div>
                    {/* Gọi hàm logout khi click */}
                    <button onClick={logout}>Đăng xuất</button>
                </>
            ) : (
                <a href="/login">Login</a>
            )}
        </nav>
    )
}

export default ProductAdmin;