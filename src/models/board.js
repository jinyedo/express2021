export default (sequelize, DataTypes) => {

    const Board = sequelize.define("board", {
        title: {
            type: DataTypes.STRING, // String type 으로 선언
            allowNull: false // null 허용 X
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    // 연관관계 설정
    Board.associate = function(models) {
        models.Board.belongsTo(models.User);
    }

    return Board; 
};
