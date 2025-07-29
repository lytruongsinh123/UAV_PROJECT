# giai đoạn 1: build ứng dụng REACT
FROM node:16-slim AS build
# Thiết lập thư mục làm việc
WORKDIR /app 
# Sao chép package.json và package-lock.json để cài đặt các phụ thuộc
COPY package*.json ./
# Cài đặt các phụ thuộc
RUN npm install
# Sao chép mã nguồn ứng dụng vào thư mục làm việc
COPY . .
# Biên dịch ứng dụng REACT
RUN npm run build
# giai đoạn 2: Server ứng dụng với Nginx
FROM nginx:alpine
# Copy các file build sang thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Mặc định dùng cổng 80
EXPOSE 80
# Cấu hình Nginx để phục vụ ứng dụng REACT
CMD ["nginx", "-g", "daemon off;"]
