export default (sequelize, DataTypes) => {

    const Permission = sequelize.define("permission", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    // 연관관계 설정
    Permission.associate = function(models) {
        models.Permission.belongsTo(models.User);
    }

    return Permission; 
};