import db from './src/models/index.js'
import bcrypt from 'bcrypt';
import faker from "faker";


const { User, Board } = db;

faker.locale = "ko";

const getPaginatedItems = (items, page, pageSize) => {
    var pg = page || 1,
      pgSize = pageSize || 10,
      offset = (pg - 1) * pgSize,
      pagedItems = _.drop(items, offset).slice(0, pgSize);
    return {
      page: pg,
      pageSize: pgSize,
      total: items.length,
      total_pages: Math.ceil(items.length / pgSize),
      data: pagedItems
    };
}

/* User 데이터 생성 */
const user_sync = async () => {
    await User.sync({ force: true }); // { force: true }: User 초기화
    for (let i=0; i<1000; i++) {
        const hashPwd = await bcrypt.hash("test1234", 10);
        await User.create({
            name: faker.name.lastName()+faker.name.firstName(),
            age: getRandomInt(15,50),
            password: hashPwd
        });
    }
}
user_sync();

// Board 데이터 생성 
const board_sync = async () => {
    await Board.sync({ force: true }); // { force: true }: User 초기화
    for (let i=0; i<100; i++) {
        await Board.create({
            title: faker.lorem.sentence(1),
            content: faker.lorem.sentence(10),
            userId: getRandomInt(1, 1000)
        });
    }
}
board_sync();