"use strict"; // Bật chế độ nghiêm ngặt của JavaScript để tránh lỗi ngầm.

require("dotenv").config(); // Nạp biến môi trường từ file .env vào process.env.

const fs = require("fs"); // Module Node.js để thao tác với file hệ thống.
const path = require("path"); // Module Node.js để thao tác với đường dẫn file.
const Sequelize = require("sequelize"); // Import thư viện Sequelize ORM.

const basename = path.basename(__filename); // Lấy tên file hiện tại (index.js).
const env = process.env.NODE_ENV || "development"; // Lấy môi trường hiện tại, mặc định là development.

// const config = require(__dirname + '/../config/config.json')[env];
// (Dòng này bị comment, dùng khi cấu hình qua file config.json.)

const db = {}; // Tạo object để chứa tất cả các model.

let sequelize;
const customizeConfig = {
    host: process.env.DB_HOST, // Địa chỉ host của database.
    port: process.env.DB_PORT, // Cổng kết nối database.
    dialect: "postgres", // Loại database (ở đây là postgres).
    logging: false, // Tắt log SQL ra console.
    dialectOptions:
        process.env.DB_SSL === "true"
            ? {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {}, // Nếu DB_SSL=true thì bật SSL, ngược lại để trống.
    query: {
        raw: true, // Trả về dữ liệu thô (raw) khi query.
    },
    timezone: "+07:00", // Thiết lập múi giờ cho database.
};

// Khởi tạo instance Sequelize với các biến môi trường và cấu hình ở trên.
sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME, // Tên database
    process.env.DB_USERNAME, // Username
    process.env.DB_PASSWORD, // Password
    customizeConfig // Các cấu hình khác
);

// (Các dòng dưới là cấu hình cũ dùng file config.json, đã bị comment.)

fs.readdirSync(__dirname) // Đọc tất cả file trong thư mục models
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 && // Không lấy file ẩn (bắt đầu bằng .)
            file !== basename && // Không lấy chính file index.js
            file.slice(-3) === ".js" // Chỉ lấy file .js
        );
    })
    .forEach((file) => {
        // Import từng model (file .js trong thư mục models, trừ index.js)
        // Mỗi model là một hàm nhận vào (sequelize, DataTypes) và trả về class model
        const model = require(path.join(__dirname, file))(
            sequelize, // Instance kết nối Sequelize đã khởi tạo ở trên
            Sequelize.DataTypes // Kiểu dữ liệu chuẩn của Sequelize (STRING, INTEGER, ...)
        );
        // Lưu model vừa import vào object db với key là tên model (model.name)
        // Ví dụ: db['User'] = UserModel
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    // Nếu model có hàm associate thì gọi để thiết lập quan hệ giữa các model
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize; // Gắn instance sequelize vào db để dùng ở nơi khác.
db.Sequelize = Sequelize; // Gắn class Sequelize vào db để dùng ở nơi khác.

module.exports = db; // Xuất object db chứa tất cả model và instance Sequelize.
