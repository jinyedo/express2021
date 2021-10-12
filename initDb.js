import db from './src/models/index.js'
import bcrypt from 'bcrypt';
import faker from "faker";


const { User, Board, Permission } = db;

faker.locale = "ko";

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const roles = ['NON-MEMBER', 'MEMBER', 'ADMIN']

/* User 데이터 생성 */
const user_sync = async () => {
    for (let i=0; i<100; i++) {
        const hashPwd = await bcrypt.hash("test1234", 10);
        const createUser = await User.create({
            name: faker.name.lastName()+faker.name.firstName(),
            age: getRandomInt(15,50),
            password: hashPwd
        });
        await createUser.createPermission({
            title: i < 30 ? roles[0] : (i < 60 ? roles[1] : roles[2]),
            level: i < 30 ? 2 : (i < 60 ? 1 : 2)
        })
    }
}


// Board 데이터 생성 
const board_sync = async () => {
    for (let i=0; i<100; i++) {
        await Board.create({
            title: faker.lorem.sentence(1),
            content: faker.lorem.sentence(10),
            userId: getRandomInt(1, 1000)
        });
    }
}

db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", {raw: true}).then(async () => {
    db.sequelize.sync({ force: true })
    user_sync();
    //board_sync();
})