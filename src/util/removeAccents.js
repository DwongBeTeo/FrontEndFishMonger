// Hàm helper loại bỏ dấu và chuyển về lowercase
export const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')           // Phân tách ký tự + dấu thành 2 phần
    .replace(/[\u0300-\u036f]/g, '') // Xóa hết dấu (diacritics)
    .toLowerCase();
};