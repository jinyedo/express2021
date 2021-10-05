import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";
faker.locale = "ko";

const boardRouter = Router();

const seq = new sequelize('express', 'root', null, {
    dialect: 'mysql',
    host: 'localhost',
    password: "911059",
    logging: true
});

// Board 테이블 생성 
const Board = seq.define("board", {
    title: {
        type: sequelize.STRING, // String type 으로 선언
        allowNull: false // null 허용 X
    },
    content: {
        type: sequelize.TEXT,
        allowNull: true
    }
});

const initDB = async() => {
    await Board.sync();
}

initDB();

const check_sequelize_auth = async () => {
    try {
        await seq.authenticate();
        console.log("DB 연결 성공")
    } catch(err) {
        console.error("DB 연결 실패: ", err)
    }
}

check_sequelize_auth();

// Board 데이터 생성 
const board_sync = async () => {
    await Board.sync({ force: true }); // { force: true }: User 초기화
    for (let i=0; i<10000; i++) {
        await Board.create({
            title: faker.lorem.sentence(1),
            content: faker.lorem.sentence(10)
        });
    }
}
// board_sync();
// 전체 게시글 조회하기
boardRouter.get("/", async (req, res) => {
    try {
        const findBoardList = await Board.findAll();
        res.send({
            count: findBoardList.length,
            boards: findBoardList
        })
    } catch(err) {
        res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
});

boardRouter.get("/:id", async (req, res) => {
    try {
        const 
        const findBoardList = await Board.findAll();
        res.send({
            count: findBoardList.length,
            boards: findBoardList
        })
    } catch(err) {
        res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
});













/* let boards = [
    {
        id: 1,
        title: "1번 게시글 타이틀 입니다.",
        content: "1번 게시글 내용입니다.",
        createDate: "2021-09-07",
        updateDate: "2021-09-07"
    },
    {
        id: 2,
        title: "2번 게시글 타이틀 입니다.",
        content: "2번 게시글 내용입니다.",
        createDate: "2021-09-07",
        updateDate: "2021-09-07"
    },
    {
        id: 3,
        title: "3번 게시글 타이틀 입니다.",
        content: "3번 게시글 내용입니다.",
        createDate: "2021-09-07",
        updateDate: "2021-09-07"
    },
    {
        id: 4,
        title: "4번 게시글 타이틀 입니다.",
        content: "4번 게시글 내용입니다.",
        createDate: "2021-09-07",
        updateDate: "2021-09-07"
    },
    {
        id: 5,
        title: "5번 게시글 타이틀 입니다.",
        content: "5번 게시글 내용입니다.",
        createDate: "2021-09-07",
        updateDate: "2021-09-07"
    }
];

let time = new Date();
let year = time.getFullYear(); 
let month = time.getMonth() + 1; 
let date = time.getDate();  

// 전체 게시글 조회하기
userRouter.get("/getList", (req, res) => {
    res.send({
        result : {
            count : boards.length,
            boards : boards
        }
    });
});

// id로 특정 게시글 조회하기
userRouter.get("/:id", (req, res) => {
    const findBoard = _.find(boards, {id: parseInt(req.params.id)});
    if (findBoard) {
        res.status(200).send({
            msg : "정상적으로 조회 되었습니다.",
            findBoard
        });
    } else {
        res.status(404).send({
            msg: "해당 게시물이 존재하지 않습니다.",
        });
    }
});

// 게시글 추가하기
userRouter.post("/add", (req, res) => {
    const createBoard = req.body;
    const findBoard = _.find(boards, {id: parseInt(createBoard.id)});

    if (!findBoard) {
        if (createBoard.id && createBoard.title && createBoard.content) {
            createBoard.createDate = `${year}-${month}-${date}`;
            createBoard.updateDate = "";

            boards.push(createBoard);
            res.status(200).send({
                msg : `게시글 ${createBoard.id}이 추가되었습니다.`
            });
        } else {
            res.status(400).send({
                msg : "입력 요청이 잘못되었습니다."
            });
        }
    } else {
        res.status(400).send({
            msg: `${createBoard.id}는 이미 존재하는 게시글 입니다.`,
        });
    }
});

// 게시글 수정하기
userRouter.put("/modify", (req, res) => {
    const updateBoard = req.body;
    const findBoard = _.find(boards, {id: parseInt(updateBoard.id)});

    if (findBoard) {
        if (updateBoard.title && updateBoard.content) {
            findBoard.title = updateBoard.title;
            findBoard.content = updateBoard.content;
            findBoard.updateDate = `${year}-${month}-${date}`;
            res.status(200).send({
                msg : "수정을 완료했습니다.",
                findBoard
            });
        } else {
            res.status(400).send({
                msg : "입력 요청이 잘못되었습니다."
            });
        }
    } else {
        res.status(404).send({
            msg : `게시글 ${updateBoard.id}이 존재하지 않습니다.`
        });
    }
});

// 게시글 삭제하기
userRouter.delete("/delete", (req, res) => {
    const deleteBoard = req.body;
    const findBoard = _.find(boards, {id: parseInt(deleteBoard.id)});
    
    if (findBoard) {
        _.remove(boards, {id: parseInt(deleteBoard.id)});
        res.status(200).send({
            msg : "삭제를 완료했습니다."
        });
    } else {
        res.status(404).send({
            msg : `게시글 ${deleteBoard.id}이 존재하지 않습니다.`
        });
    }
}); */

export default boardRouter;