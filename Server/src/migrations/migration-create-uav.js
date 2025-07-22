"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Uavs", {
            // droneId: DataTypes.STRING,
            // droneName: DataTypes.STRING,
            // speedMax: DataTypes.INTEGER,
            // hightMax: DataTypes.INTEGER,
            // performance: DataTypes.STRING,
            // image: DataTypes.TEXT,
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            droneId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            droneName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            speedMax: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            hightMax: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            performance: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image: {
                type: Sequelize.BLOB("long"),
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
        await queryInterface.dropTable("Uavs");
    },
};
// npx sequelize-cli db:migrate --to migration-create-user.js
