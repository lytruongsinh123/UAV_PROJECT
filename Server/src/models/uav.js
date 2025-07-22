"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Uav extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Uav.init(
        {
            droneId: DataTypes.STRING,
            droneName: DataTypes.STRING,
            speedMax: DataTypes.INTEGER,
            hightMax: DataTypes.INTEGER,
            performance: DataTypes.STRING,
            image: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Uav",
        }
    );
    return Uav;
};
