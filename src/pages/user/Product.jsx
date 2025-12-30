import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import MainLayout from "../../components/MainLayout";

const Product = ({activeMenu}) => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav>
            {user ? (
                <>
                    <span>Hello, {user.fullName}</span>
                    <div>Product for user</div>
                    {/* Gọi hàm logout khi click */}
                    <button className="card-btn" onClick={logout}>Đăng xuất</button>
                </>
            ) : (
                <a href="/login">Login</a>
            )}
        </nav>
    )
}

export default Product;