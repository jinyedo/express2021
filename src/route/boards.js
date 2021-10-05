import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";
import db from '../models/index.js'

faker.locale = "ko";
const Board = db.Board;

const boardRouter = Router();

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
boardRouter.get("/getList", async (req, res) => {
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


// 전체 게시글 및 특정 게시글 조회
boardRouter.get("/", async (req, res) => {
    try {
        const { Op } = sequelize;
        let {id, title, content} = req.query;

        const findBoardQuery = {
            attributes: ['id', 'title', 'content']
        }

        if (id && title && content) {
            findBoardQuery['where'] = { id, title: {[Op.substring]: title}, content: {[Op.substring]: content} }
        } else if(id) {
            findBoardQuery['where'] = {id}
        } else if (title) {
            findBoardQuery['where'] = { title: {[Op.substring]: title} } 
        } else if (content) {
            findBoardQuery['where'] = { content: {[Op.substring]: content} }
        }

        const result = await Board.findAll(findBoardQuery);

        res.send({
            count: result.length,
            result : result
        });
    } catch(err) {
        res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
});

// 게시글 추가하기
boardRouter.post("/", async (req, res) => {
    try {
        const createBoard = req.body;

        if (!createBoard.title || !createBoard.content) {
            res.status(400).send("입력 요청이 잘못되었습니다.");
            return; 
        }

        const result = await Board.create({
            title: createBoard.title,
            content: createBoard.content
        });

        res.status(201).send({
            result : `작성을 완료했습니다.`,
            content: result
        });

    } catch (err) {
        res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
})

// 수정하기
boardRouter.put("/:id", async (req, res) => {
    try {
        const updateBoardId = parseInt(req.params.id);
        const updateTitle = req.body.title;
        const updateContent = req.body.content;
        const { Op } = sequelize;

        const findBoard = await Board.findOne({
            where: {
                id : {[Op.eq]: updateBoardId}
            }
        });

        if (!findBoard || (!updateTitle && !updateContent)) {
            res.status(400).send("해당 게시글이 존재하지 않거나, 입력 요청이 잘못되었습니다.");
            return; 
        }

        if (updateTitle) findBoard.title = updateTitle;
        if (updateContent) findBoard.content = updateContent;
        findBoard.save();

        res.status(200).send({
            msg : "수정을 완료하였습니다.",
            result : findBoard
        });

    } catch(err) {
        res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
});

// 삭제하기
boardRouter.delete("/:id", async (req, res) => {
    try {
        const deleteBoardId = parseInt(req.params.id);
        const { Op } = sequelize;

        const findBoard = await Board.findOne({
            where: {
                id : {[Op.eq]: deleteBoardId}
            }
        });

        if (!findBoard) {
            res.status(400).send("해당 회원이 존재하지 않습니다.");
            return; 
        }

        findBoard.destroy();

        res.status(200).send({
            msg : "삭제를 완료하였습니다."
        });

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