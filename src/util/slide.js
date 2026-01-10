const slide = () => {
    let list = document.querySelector('.slider .list');
    let items = document.querySelectorAll('.slider .list .item');
    let dots = document.querySelectorAll('.slider .dots li');
    let prev = document.getElementById('prev');
    let next = document.getElementById('next');

    // Kiểm tra an toàn: Nếu không tìm thấy element thì dừng ngay
    if (!list || !prev || !next) return;

    let active = 0;
    let lengthItems = items.length - 1;
    let refreshSlider; // Khai báo biến ở đây để dùng chung

    next.onclick = function () {
        if (active + 1 > lengthItems) {
            active = 0;
        } else {
            active = active + 1;
        }
        reloadSlider();
    }

    prev.onclick = function () {
        if (active - 1 < 0) {
            active = lengthItems;
        } else {
            active = active - 1;
        }
        reloadSlider();
    }

    // Khởi tạo auto run
    refreshSlider = setInterval(() => {
        next.click()
    }, 5000);

    function reloadSlider() {
        let checkleft = items[active].offsetLeft;
        list.style.left = -checkleft + 'px';

        let lastActiveDot = document.querySelector('.slider .dots li.active');
        // Kiểm tra lastActiveDot để tránh lỗi null
        if(lastActiveDot) lastActiveDot.classList.remove('active');
        
        dots[active].classList.add('active');

        clearInterval(refreshSlider);
        // LƯU Ý QUAN TRỌNG: Bỏ chữ 'let' ở đây để cập nhật biến bên ngoài
        refreshSlider = setInterval(() => { next.click() }, 5000);
    }

    dots.forEach((li, key) => {
        li.addEventListener('click', function () {
            active = key;
            reloadSlider();
        })
    })

    // Trả về hàm dọn dẹp (Cleanup function)
    return () => {
        clearInterval(refreshSlider);
        // Xóa sự kiện click để tránh rò rỉ bộ nhớ
        if(next) next.onclick = null;
        if(prev) prev.onclick = null;
    };
};

export default slide;