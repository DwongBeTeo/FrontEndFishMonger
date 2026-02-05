import React, { useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import AuthContext from './AuthContext';

const SocketContext = React.createContext({ lastMessage: null });

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        // 1. Kiểm tra user có tồn tại không
        if (!user?.id) {
            console.log("SocketProvider: Chưa có user, bỏ qua kết nối.");
            return;
        }

        console.log(`SocketProvider: Kết nối WebSocket cho user ID: ${user.id}`);

        const client = new Client({
            brokerURL: 'ws://localhost:8080/api/v1.0/ws', // Đảm bảo đúng port và context-path backend
            reconnectDelay: 5000,
            // debug: (str) => console.log("STOMP:", str), // Bật lên nếu cần debug

            onConnect: (frame) => {
                console.log('✅ STOMP Connected');

                // =========================================================
                // 1. KÊNH CÁ NHÂN (Dành cho User để nhận thông báo của chính mình)
                // =========================================================
                const myOrderTopic = `/topic/user/${user.id}/orders`;
                client.subscribe(myOrderTopic, (message) => {
                    handleMessage(message, 'ORDER');
                });

                const myApptTopic = `/topic/user/${user.id}/appointments`;
                client.subscribe(myApptTopic, (message) => {
                    handleMessage(message, 'APPOINTMENT');
                });

                // =========================================================
                // 2. KÊNH QUẢN TRỊ (Chỉ dành cho ADMIN)
                // =========================================================
                // Kiểm tra role: Tùy vào cách bạn lưu role (user.roles mảng hoặc user.role string)
                // Ở đây tôi check cả 2 trường hợp phổ biến
                const isAdmin = user?.role === 'ADMIN' || (Array.isArray(user.roles) && user.roles.includes('ADMIN'));

                if (isAdmin) {
                    console.log("🛡️ User là Admin -> Đăng ký kênh quản trị");

                    // Nghe tất cả đơn hàng mới/update từ user gửi lên
                    client.subscribe('/topic/admin/orders', (message) => {
                        console.log("🔔 ADMIN nhận tin mới về ĐƠN HÀNG");
                        handleMessage(message, 'ADMIN_ORDER_UPDATE');
                    });

                    // Nghe tất cả lịch hẹn mới/update
                    client.subscribe('/topic/admin/appointments', (message) => {
                        console.log("🔔 ADMIN nhận tin mới về LỊCH HẸN");
                        handleMessage(message, 'ADMIN_APPOINTMENT_UPDATE');
                    });
                }
            },

            onDisconnect: () => console.log("🔴 STOMP Disconnected"),
            onStompError: (frame) => console.error("❌ STOMP Error:", frame),
        });

        // Hàm xử lý chung để parse JSON và set state
        const handleMessage = (message, type) => {
            try {
                const data = JSON.parse(message.body);
                setLastMessage({
                    type: type,
                    data: data,
                    timestamp: Date.now() // Quan trọng để trigger useEffect
                });
            } catch (e) {
                console.error(`Lỗi parse message type ${type}:`, e);
            }
        };

        client.activate();

        return () => {
            if (client.active) client.deactivate();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ lastMessage }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;