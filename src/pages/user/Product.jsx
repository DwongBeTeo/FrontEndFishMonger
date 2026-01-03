import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import MainLayout from "../../components/MainLayout";

const Product = ({activeMenu}) => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav>
                <>
                    <span>Hello, </span>
                    <div>Product for user</div>
                    {/* Gọi hàm logout khi click */}
                </>
        </nav>
    )
}

export default Product;