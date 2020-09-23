/* eslint-disable no-unused-vars */
const express = require('express');
const session = require('express-session');
const TodoService = require('../service/TodoService');
const UserService = require('../service/UserService');

const router = express.Router();
const todoService = new TodoService();
const userService = new UserService();
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
/*router.post('/api/todo/move/order', async (req, res, next) => {
  let { orderlist } = req.body;
  let containerId = req.body.container_id;
  orderlist = orderlist.split(',').map((n) => parseFloat(n));
  let result = await todoService.changeTodoOrder(containerId, orderlist);

  console.log(result);
  res.json({ data: { user: 'hello', pw: 'test' } });
});
*/
/* todo가  container를 바꿨을 때  */
router.get('/api/todo/move/container', (req, res, next) => {
  res.json({ data: { user: 'hello', pw: 'test' } });
});

router.get('/api/user/login/:id/:pw', async (req, res) => {
  const { id, pw } = req.params;
  const sess = req.session;
  const result = await userService.findUser(id, pw);

  if (result) {
    sess.id = result.id;

    sess.save(() => {
      console.log(sess.id);
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
      console.log(sess.id);
      res.json({ data: { res: true, id: result.id } });
    });

    return;
  }
  res.json({ data: { res: false } });
});

module.exports = router;
