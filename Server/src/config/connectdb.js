const { Sequelize } = require("sequelize");
require("dotenv").config();
// file này để Tạo một Instance Sequelize và cung cấp hàm connectDB để kết nối database khi chạy ứng dụng Node.js (runtime). Dùng để truy vấn thêm sửa xóa dữ liệu
// Option 2: Passing parameters separately (other dialects)
// Instance Sequelize là đối tượng đại diện cho kết nối tới database, giúp bạn thao tác với database bằng cú pháp của Sequelize.
const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        dialectOptions:
            process.env.DB_SSL === "true"
                ? {
                      ssl: {
                          require: true,
                          rejectUnauthorized: false,
                      },
                  }
                : {},
        query: {
            raw: true,
        },
        timezone: "+07:00",
    }
);

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
module.exports = connectDB;
