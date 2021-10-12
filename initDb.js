import db from './src/models/index.js'
import bcrypt from 'bcrypt';
import faker from "faker";

const { User, Board, Permission } = db;

faker.locale = "ko";

const userCount = 200;
const boardCount = userCount * 0.3 * 365;

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const permissions = [
    {title: "전체 관리자", level: 0, desc: "관리자 권한"},
    {title: "게시판 관리자", level: 1, desc: "게시판 관리자 권한"},
    {title: "사용자 관리자", level: 2, desc: "사용자 관리자 권한"},
    {title: "일반 사용자", level: 3, desc: "일반 사용자 권한"},
    {title: "게스트", level: 4, desc: "게스트 권한"},
];

const permission_sync = async () => {
    try {
        for (let i=0; i<permissions.length; i++) {
            const { title, level, desc } = permissions[i];
            await Permission.create({ title, level, desc });
        }
    } catch(err) {
        console.log(err);
    }
}

/* User 데이터 생성 */
const user_sync = async () => {
    try {
        for (let i=0; i<userCount; i++) {
            const hashPwd = await bcrypt.hash("test1234", 10);
            const createUser = await User.create({
                name: faker.name.lastName()+faker.name.firstName(),
                age: getRandomInt(15,50),
                password: hashPwd,
                permissionId: getRandomInt(1, permissions.length)
            });
            if (i%10 === 0) console.log(`createUser: ${i}/${userCount}`);
        }
    } catch(err) {
        console.log(err);
    }
}

// Board 데이터 생성 
const board_sync = async () => {
    try {
        for (let i=0; i<boardCount; i++) {
            await Board.create({
                title: faker.lorem.sentence(1),
                content: faker.lorem.sentence(10),
                userId: getRandomInt(1, userCount)
            });
            if (i%10 === 0) console.log(`createBoard: ${i}/${boardCount}`);
        }
    } catch(err) {
        console.log(err);
    }
}

db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", {raw: true}).then(async () => {
    await db.sequelize.sync({ force: true });
    await permission_sync();
    console.log("Permission 생성 완료");
    await user_sync();
    console.log("User 생성 완료");
    await board_sync();
    console.log("Board 생성 완료");
})