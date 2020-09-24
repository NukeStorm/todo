/* eslint-disable max-len */
import { Todo } from './todo.js';
import { TodoContainer } from './todoContainer.js';
import { LogManager } from './LogManager.js';
import { addDateFormat } from './dateformat.js';

addDateFormat();
// todlist FE javasript code 시작점
document.loginId = 'test';
console.log('app running');
// 로그인 시 해당 id의  유저 todolist 화면 초기화

// container , todo 객체를 관리하는 map 전역 변수
document.containerMap = new Map();
document.todoMap = new Map();
//todo CRUD 관련 이벤트를 받아 로그를 전송하는 객체
document.logManager = new LogManager();
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
        container.todolist = container.todolist.map((todo) => {
          todo = new Todo(todo.id, null, todo.content, todo.date, todo.user_id);
          todo.render();
          document.todoMap.set(todo.id, todo);
          return todo;
        });

        const todocontainer = new TodoContainer(container.id, container.name, container.todolist, container.orderlist);
        todocontainer.render();
        todocontainer.todolist.forEach((todo) => {
          Todo.setHandler(todo.node);
        });

        document.containerMap.set(todocontainer.id, todocontainer);

        board.appendChild(todocontainer.node);
      });
    });
}

function setWindowModalHanler() {
  const modal = document.getElementById('edit_modal');
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.classList.toggle('hidden');
    }
  };
}
setWindowModalHanler();

function setEditModalSubmitBtnHandler() {
  const modal = document.getElementById('edit_modal');
  modal.querySelector('.edit-submit-btn').addEventListener('click', (e) => {
    let cardId = modal.getAttribute('card-id');
    let containerId = modal.getAttribute('container-id');
    let updateDate = new Date();
    let content = modal.querySelector('.textarea-todo').value;

    let payload = {
      id: cardId,
      content: content,
      date: updateDate,
      containerId: containerId,
    };

    fetch(`/api/todo/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
    })
      .then((e) => e.json())
      .then((e) => {
        let data = e.data;

        if (data.obj) {
          let { obj } = data;

          // 현재 todo object
          let todo = document.todoMap.get(parseInt(cardId, 10));

          //변경된 todo object
          todo.content = obj.content;
          todo.date = new Date(obj.date);
          todo.node.querySelector('.todo-content').innerText = obj.content;
          document.todoMap.set(todo.id, todo);
          const logEvent = new Event('todoupdate');
          logEvent.log = {
            userid: document.loginId,
            action: 'update',
            todo: todo,
            fromCotainerId: null,
            toContainerId: null,
          };
          document.logManager.dispatchEvent(logEvent);
          modal.classList.toggle('hidden');
        } else {
          alert('편집도중 오류 발생');
        }
      });
  });
}
setEditModalSubmitBtnHandler();

init(document.loginId);
