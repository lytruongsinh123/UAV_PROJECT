# Sử dụng Node 16 cho server
FROM node:16-slim

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn server vào container
COPY . .

# Mở cổng server (ví dụ: 8083)
EXPOSE 8083

# Chạy server (sửa lại nếu bạn dùng file khác ngoài index.js)
CMD ["node", "server.js"]