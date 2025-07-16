"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class RegisterUav extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
           
        }
    }
    RegisterUav.init(
        {
            ownerId: DataTypes.INTEGER,
            droneId: DataTypes.STRING,
            droneName: DataTypes.STRING,
            startPoint: DataTypes.STRING,
            endPoint: DataTypes.STRING,
            heightFly: DataTypes.INTEGER,
            speed: DataTypes.INTEGER,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "RegisterUav",
        }
    );
    return RegisterUav;
};
