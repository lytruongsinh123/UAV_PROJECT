# UAV Project - Client

Đây là frontend của dự án UAV được xây dựng bằng React.

## Yêu cầu hệ thống

-   Node.js 16+ (khuyến nghị 18+)
-   npm hoặc yarn

## Cài đặt

1. Clone dự án và di chuyển vào thư mục client:

```bash
cd UAV_Project/Client
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Khởi chạy development server:

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Scripts có sẵn

Trong thư mục dự án, bạn có thể chạy:

### `npm start`

Chạy ứng dụng ở chế độ development.
Mở [http://localhost:3000](http://localhost:3000) để xem trong browser.

### `npm test`

Chạy test runner ở chế độ interactive watch.

### `npm run build`

Build ứng dụng production vào thư mục `build`.

### `npm run eject`

**Lưu ý: Đây là lệnh một chiều. Một khi bạn `eject`, bạn không thể quay lại!**

## Cấu trúc thư mục

```
src/
  ├── App.js          # Component chính
  ├── App.css         # CSS cho App component
  ├── App.test.js     # Test file cho App
  ├── index.js        # Entry point
  ├── index.css       # CSS global
  ├── setupTests.js   # Test setup
  └── reportWebVitals.js  # Performance measuring
public/
  ├── index.html      # HTML template
  ├── manifest.json   # PWA manifest
  └── robots.txt      # Robots.txt
```

## Packages cơ bản đã cài đặt

-   **react**: Library chính để xây dựng UI
-   **react-dom**: React DOM rendering
-   **react-scripts**: Scripts và configuration cho Create React App
-   **web-vitals**: Measuring performance metrics
-   **@testing-library**: Testing utilities
    -   @testing-library/jest-dom
    -   @testing-library/react
    -   @testing-library/user-event

## Học thêm

Bạn có thể tìm hiểu thêm tại [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

Để học React, xem [React documentation](https://reactjs.org/).
