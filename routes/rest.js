/* eslint-disable no-unused-vars */
const express = require('express');
const TodoService = require('../service/TodoService');

const router = express.Router();
const todoService = new TodoService();

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

/* todo가 추가되었을때 */
router.get('/api/todo/move/order', (req, res, next) => {
  res.json({ data: { user: 'hello', pw: 'test' } });
});

/* todo가  container를 바꿨을 때  */
router.get('/api/todo/move/container', (req, res, next) => {
  res.json({ data: { user: 'hello', pw: 'test' } });
});
module.exports = router;
