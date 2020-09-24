/* eslint-disable no-unused-vars */
const express = require('express');
const session = require('express-session');
const Todo = require('../models/Todo/Todo');
const LogHistory = require('../models/LogHistory/loghistory');

const TodoService = require('../service/TodoService');
const UserService = require('../service/UserService');
const LogService = require('../service/LogService');

const router = express.Router();
const todoService = new TodoService();
const userService = new UserService();
const logService = new LogService();
/* GET users listing. */
router.get('/api/user', (req, res, next) => {
  res.json({ data: { user: 'hello', pw: 'test' } });
});

/* user의 모든 container(column) 정보를 요청  */
router.get('/api/todo/loadall/:userId', async (req, res, next) => {
  let userId = req.params.userId;
  let result = await todoService.getUserContainers(userId);
  res.json({ data: result });
});

/* todo 순서 바뀌었을때 업데이트 요청 */
router.put('/api/todo/move/order', async (req, res, next) => {
  let { orderlist, containerId } = req.body;
  let result = await todoService.changeTodoOrder(containerId, orderlist);
  res.json({ data: { result } });
});

/* todo의 컨테이너간 이동 반영 요청  */
router.put('/api/todo/move/container', async (req, res, next) => {
  const { todoId, containerId } = req.body;
  let result = await todoService.moveToContainer(todoId, containerId);

  res.json({ data: { result } });
});

router.post('/api/todo/add', async (req, res, next) => {
  try {
    const { content, date, userId, containerId } = req.body;

    let newTodo = new Todo(null, null, content, null);

    let insertId = await todoService.addTodo(newTodo, userId, containerId);
    let newTodoObj = await todoService.getTodo(insertId);

    res.json({ data: { obj: newTodoObj } });
  } catch (e) {
    res.json({ data: { obj: null } });
  }
});

router.put('/api/todo/edit', async (req, res, next) => {
  try {
    const { id, content, date, containerId } = req.body;

    let updateTodo = new Todo(id, null, content, new Date(date));

    let result = await todoService.editTodo(updateTodo, containerId);
    if (!result) throw new Error('no updated');

    let updatedTodo = await todoService.getTodo(id);

    res.json({ data: { obj: updatedTodo } });
  } catch (e) {
    console.error(e);
    res.json({ data: { obj: null } });
  }
});

router.post('/api/todo/delete', async (req, res, next) => {
  try {
    const { todoId } = req.body;
    let result = await todoService.removeTodo(todoId);

    res.json({ data: { result } });
  } catch (e) {
    res.json({ data: { result: false } });
  }
});
router.get('/api/user/login/:id/:pw', async (req, res) => {
  const { id, pw } = req.params;
  const sess = req.session;
  const result = await userService.findUser(id, pw);

  if (result) {
    sess.id = result.id;

    sess.save(() => {
      res.json({ data: { res: true } });
    });

    return;
  }
  res.json({ data: { res: false } });
});

router.post('/api/user/login', async (req, res) => {
  const { id, pw } = req.body;
  const sess = req.session;
  const result = await userService.findUser(id, pw);

  if (result) {
    sess.id = result.id;

    sess.save(() => {
      res.json({ data: { res: true, id: result.id } });
    });

    return;
  }
  res.json({ data: { res: false } });
});

// userId 관련 모든 log 기록 반환
router.get('/api/log/loadall/:userId', async (req, res, next) => {
  const { userId } = req.params;
  const logList = await logService.getAllLogs(userId);
  res.json({ data: logList });
});

// log 기록
router.post('/api/log/record', async (req, res, next) => {
  try {
    const { logmsg, timestamp, userId } = req.body;

    let insertId = await logService.reportLog(logmsg, timestamp, userId);

    let newLogObj = await logService.getLog(insertId);

    res.json({ data: { obj: newLogObj } });
  } catch (e) {
    res.json({ data: { obj: null } });
  }
});

module.exports = router;
