const TodoRepo = require('../models/Todo/TodoRepo');
const Todo = require('../models/Todo/Todo');
const TodoContainer = require('../models/TodoContainer/TodoContainer');
const TodoContainerRepo = require('../models/TodoContainer/TodoContainerRepo');

class TodoService {
  constructor() {
    this.todoRepo = new TodoRepo();
    this.containerRepo = new TodoContainerRepo();
  }

  async getUserContainers(userid) {
    let containerList = await this.containerRepo.selectUserContainerIdList(userid);

    let containerArr = containerList.map(async (container) => {
      let todoData = await this.containerRepo.selectContainerTodoListById(container.id);

      let orderlist = container.orderlist;

      if (!orderlist) orderlist = [];
      else orderlist = orderlist.split(',').map((id) => parseInt(id, 10));
      todoData = todoData.map((row) => Object.assign(new Todo(), row));

      let todoContainer = new TodoContainer(container.id, container.name, todoData, orderlist);

      return todoContainer;
    });

    containerArr = await Promise.all(containerArr);

    return containerArr;
  }

  async getTodo(id) {
    let res = await this.todoRepo.selectTodoById(id);
    return res;
  }

  async addTodo(todoObj, userId, containerId) {
    let res = await this.todoRepo.insertTodo(todoObj, userId, containerId);
    return res;
  }

  async moveToContainer(todoId, containerId) {
    let todoObj = await this.getTodo(todoId);
    let res = await this.todoRepo.updateTodo(todoObj, containerId);
    return res.changedRows === 1;
  }

  async editTodo(todoObj, containerId) {
    let res = await this.todoRepo.updateTodo(todoObj, containerId);
    if (res.changedRows === 1) return true;
    return false;
  }

  async changeTodoOrder(todocontainerId, orderlist) {
    let result = await this.containerRepo.updateConainerOrder(todocontainerId, orderlist);
    return result.changedRows === 1;
  }

  async removeTodo(todoId) {
    let result = await this.todoRepo.deleteTodo(todoId);
    if (result >= 1) return true;
    return false;
  }
}

module.exports = TodoService;
