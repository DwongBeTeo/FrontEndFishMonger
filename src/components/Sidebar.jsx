import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
// 1. Import useLocation
import { useNavigate, useLocation } from "react-router-dom"; 
import { ChevronLeft, ChevronRight, LogOutIcon, User } from "lucide-react";
import { SIDE_BAR_ADMIN, SIDE_BAR_USER } from "../assets/asset";

const Sidebar = () => { // 2. Bỏ nhận props activeMenu
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    // Gọi hook lấy đường dẫn hiện tại
    const location = useLocation();
    const isAdmin = user?.role === 'ADMIN';
    
    // quản lý đóng mở(chỉ dùng cho admin)
    const [isExpandState, setIsExpandState] = useState(true);

    // Nếu là Admin: dùng state đóng/mở.
    // Nếu là User: LUÔN LUÔN là true (luôn mở)
    const isExpanded = isAdmin ? isExpandState : true;

    // Logic Resize chỉ kích hoạt nếu là Admin
    useEffect(() => {
        if(!isAdmin) return; // Nếu không phải admin thì thoát luôn
        const handleResize = () => {
            if(window.innerWidth <= 768) {
                setIsExpandState(false);
            } else {
                setIsExpandState(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isAdmin]);

    const currentUser = user?.role === 'ADMIN' ? SIDE_BAR_ADMIN : SIDE_BAR_USER;
    const heightClass = isAdmin ? "h-screen top-0" : "h-[calc(100vh-61px)] top-[61px]";
    return (
        <div className={`${heightClass} flex flex-col bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20 px-2'}`}>
            {/* toggle expand/collapse */}
            {isAdmin && (
                <button
                    onClick={() => setIsExpandState(!isExpandState)}
                    className="z-50 absolute -right-3 top-6 bg-purple-800 text-white p-1 rounded-full shadow-md hover:bg-purple-700 transition-colors"
                >
                    {isExpanded ? <ChevronLeft size={20}/> : <ChevronRight size={20} />}
                </button>
            )}
            {/* User info */}
            <div className={`flex flex-col items-center justify-center gap-3 mt-3 mb-7 transition-all duration-300 ${!isExpanded && 'mb-4'}`}>
                {user?.profileImageUrl ? (
                    <img
                     src={user.profileImageUrl || ''} 
                     alt="profile image"
                     className={`bg-slate-400 rounded-full transition-all duration-300 ${isExpanded ? 'w-20 h-20' : 'w-10 h-10'}`}
                    />
                ) : (   
                    <User className={`text-xl transition-all duration-300 ${isExpanded ? 'w-20 h-20' : 'w-10 h-10'}`} />
                )}
                <div className={`flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0 max-h-0 hidden'}`}>
                    <h5 className="text-gray-950 font-medium leading-6 whitespace-nowrap">{user?.username || ''}</h5>
                    {/* <span className="text-gray-600 text-sm">{user?.email || ''}</span> */}
                    <span className="text-gray-600 text-sm whitespace-nowrap">{user?.role || ''}</span>
                </div>
            </div>

            {/* Menu list */}
                <div className="flex-1 flex flex-col gap-2">
                    {currentUser.map((item, index) => {
                        // 4. LOGIC MỚI: So sánh URL hiện tại với path của item
                        // location.pathname: đường dẫn trên trình duyệt (ví dụ: /product)
                        // item.path: đường dẫn của nút bấm (ví dụ: /product)
                        
                        // Logic này chấp nhận cả trang chính xác VÀ trang con (ví dụ /product/add vẫn sáng nút Product)
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

                        return (
                            <button 
                                key={`menu_${index}`}
                                onClick={() => navigate(item.path)}
                                title={!isExpanded ? item.label : ''}
                                // 5. Nếu isActive = true thì thêm class màu tím
                                className={`cursor-pointer w-full flex items-center py-3 rounded-lg transition-all duration-300 relative group
                                ${isActive ? 'text-white bg-purple-800 shadow-md' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-800'}
                                ${isExpanded ? 'px-6 gap-4 justify-start' : 'px-0 justify-center'}
                                `}
                            >
                                    <item.icon className="text-xl shrink-0" />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 origin-left ${isExpanded ? 'w-auto opacity-100' : 'opacity-0 w-0 ml-0'}`}>
                                        {item.label}
                                    </span>
                                    {/* Tooltip chỉ hiện cho Admin khi đóng Sidebar */}
                                    {!isExpanded && isAdmin && (
                                        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-xs opacity-0 -translate-x-3 transition-all group-hover:opacity-100 group-hover:translate-x-0 invisible group-hover:visible z-50 whitespace-nowrap">
                                            {item.label}
                                        </div>
                                    )}
                            </button>
                        )
                    })}
                </div>
            {/* Logout Button */}
            {isAdmin && (
                 <button onClick={logout}
                  className={`mt-auto flex items-center gap-4 text-red-600 hover:text-red-800 transition-all duration-300
                    ${isExpanded ? 'px-0 gap-4 justify-start' : 'px-0 justify-center'}
                    `}
                  >
                     <LogOutIcon className="shrink-0" /> 
                     <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${isExpanded ? 'w-auto opacity-100' : 'opacity-0 w-0'}`}>
                        Đăng xuất
                     </span>
                 </button>
             )}
        </div>
    )
}

export default Sidebar;