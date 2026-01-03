// Hàm đệ quy để làm phẳng cây category theo thứ tự hiển thị
// Input: List phẳng (ngẫu nhiên)
// Output: List phẳng (đã sắp xếp Cha -> Con) + thuộc tính 'level'
export const buildCategoryTree = (categories, parentId = null, level = 0) => {
  let result = [];
  
  // 1. Tìm tất cả con trực tiếp của parentId hiện tại
  const children = categories.filter(cat => 
    // So sánh lỏng (==) vì đôi khi ID từ API là string hoặc number
    (cat.parentId == parentId) || (!parentId && !cat.parentId) 
  );

  // 2. Duyệt qua từng con
  children.forEach(child => {
    // Thêm con vào kết quả, gán thêm level
    result.push({ ...child, level: level });
    
    // Đệ quy tìm con của con này (level + 1)
    const grandChildren = buildCategoryTree(categories, child.id, level + 1);
    result = result.concat(grandChildren);
  });

  return result;
};