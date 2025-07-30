"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("RegisterUavs", {

            // ownerId: DataTypes.INTEGER,
            // droneId: DataTypes.STRING,
            // droneName: DataTypes.STRING,
            // startPoint: DataTypes.STRING,
            // endPoint: DataTypes.STRING,
            // heightFly: DataTypes.INTEGER,
            // speed: DataTypes.INTEGER,
            // status: DataTypes.STRING,
            // distance: DataTypes.INTEGER
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            ownerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            droneId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            droneName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            startPoint: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            endPoint: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            heightFly: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            speed: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            distance: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            flightPathFile: {
                type: Sequelize.BLOB("long"),
                allowNull: true, // Có thể không có file đường bay
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("RegisterUavs");
    },
};
// npx sequelize-cli db:migrate --to migration-create-user.js
