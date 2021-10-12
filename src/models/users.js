export default (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    // 연관관계 설정
    User.associate = function(models) {
        models.User.hasMany(models.Board); // Board 연관관계 설정  - 일대다
        models.User.hasOne(models.Permission); // Permission 연관관계 설정  - 일대일
    }

    return User; 
};