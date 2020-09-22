import { Todo } from './todo.js';
import { TodoContainer } from './todoContainer.js';

// todlist FE javasript code 시작점

// 로그인 시 해당 id의  유저 todolist 화면 초기화
function init(userid) {
  /* test user의 todolist 가져오는 코드 */
  fetch(`/api/todo/loadall/${userid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    credentials: 'same-origin',
  })
    .then((e) => e.json())
    .then((e) => {
      let data = e.data;

      let board = document.querySelector('.board');
      data.forEach((container) => {
        let todocontainer = Object.assign(new TodoContainer(), container);
        todocontainer.todolist = todocontainer.todolist.map((todo) => {
          todo = Object.assign(new Todo(), todo);
          todo.render();
          return todo;
        });

        todocontainer.render();

        board.appendChild(todocontainer.node);
      });
    });
}
init('test');
