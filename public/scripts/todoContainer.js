/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable quotes */

import { Todo } from './todo.js';

/*
현재 화면에 생성된 TodoContainer(todo를 담고있는 container)를 관리하는 클래스
백엔드의 TodoContainer에 대응
*/
export class TodoContainer extends EventTarget {
  constructor(id, name, todolist, orderlist) {
    super();
    this.id = id;
    this.name = name;
    this.todolist = todolist;
    this.todomap = new Map();
    this.orderlist = orderlist;
    todolist.forEach((todo) => {
      this.todomap.set([todo.id], todo);
    });

    this.node = null;
    this.addEventListener('todomoved', (e) => {
      const orderlist = this.getCurrentOrderList();
      const containerId = this.id;
      const payload = {
        orderlist,
        containerId,
      };

      fetch(`/api/todo/move/order`, {
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
        });
    });
  }

  static createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  static dragoverHandler(ev) {
    ev.preventDefault();
    // dropEffect를 move로 설정.
    ev.dataTransfer.dropEffect = 'move';
  }

  getCurrentOrderList() {
    const cardlistNode = this.node.querySelector('.cardlist');
    let cardlist = cardlistNode.querySelectorAll('.todo-card');
    let orderlist = [];
    cardlist.forEach((todoNode) => {
      orderlist.push(parseInt(todoNode.getAttribute('card-id'), 10));
    });

    return orderlist;
  }

  // todo container node를 생성, this.node를 통해 이 dom node를 조작 가능
  render() {
    const cnt = this.todolist.length;
    const title = this.name;
    const htmlString = `<div class="todo-container" container-id="${this.id}">
        <div class="container-title">
            <div class= "card-num"><div>${cnt}</div></div>
            <div>${title}</div>
            <div><button class="add-todo">+</button></div>
         </div>
         
         <div class="form-add-todo hidden">
            <textarea class="textarea-todo" name="content"  placehold="입력"></textarea>
           <div class="form-btn-area">
            <button class="add-btn">ADD</button><button class="cancel-btn">CANCEL</button>
            </div>
         </div>

         <div class="cardlist"></div>
    </div>`;

    const node = TodoContainer.createElementFromHTML(htmlString);
    this.node = node;

    if (this.orderlist == null) this.orderlist = [];
    if (this.orderlist.length == 0) {
      this.todolist.forEach((todo) => {
        this.orderlist.push(todo.id);
      });
    }

    this.orderlist.forEach((todoid) => {
      const todo = document.todoMap.get(todoid);
      this.node.querySelector('.cardlist').appendChild(todo.node);
    });

    const cardlistNode = this.node.querySelector('.cardlist');

    cardlistNode.addEventListener('DOMSubtreeModified', (e) => {
      e.preventDefault();

      const todoCntNode = this.node.querySelector('.card-num');

      todoCntNode.innerText = cardlistNode.querySelectorAll('.todo-card').length;
    });

    node.addEventListener('dragover', TodoContainer.dragoverHandler);

    node.addEventListener('drop', (e) => {
      const data = e.dataTransfer.getData('text/plain');
      const board = document.querySelector('.board');
      const source = board.querySelector(`div[card-id="${data}"]`);
      const sourceTodoContainerId = parseInt(source.closest('.todo-container').getAttribute('container-id'), 10);
      const sourceTodoContainer = document.containerMap.get(sourceTodoContainerId);
      //card node를 감싸고 있는 todo object
      const sourceObj = this.todomap.get(data);

      const changeEvent = new Event('todomoved');
      this.dispatchEvent(changeEvent);

      this.node.querySelector('.cardlist').appendChild(source);

      source.style.opacity = '1.0';

      const targetTodoContainerId = this.id;

      if (sourceTodoContainerId !== targetTodoContainerId) {
        const todoId = data;
        const containerId = targetTodoContainerId;
        const payload = {
          todoId,
          containerId,
        };

        fetch('/api/todo/move/container', {
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
            sourceTodoContainer.dispatchEvent(new Event('todomoved'));

            const logEvent = new Event('todomove');
            logEvent.log = {
              userid: document.loginId,
              action: 'move',
              todo: document.todoMap.get(parseInt(todoId, 10)),
              fromCotainerId: sourceTodoContainerId,
              toContainerId: targetTodoContainerId,
            };
            document.logManager.dispatchEvent(logEvent);

            this.dispatchEvent(new Event('todomoved'));
            if (!data.result) {
              alert('컨테이너간 todo 카드 이동이 저장되지 않았습니다.');
            }
          });
      }
    });

    node.querySelector('.cancel-btn').addEventListener('click', (e) => {
      const textarea = node.querySelector('.textarea-todo');
      textarea.value = '';
      let formNode = node.querySelector('.form-add-todo');
      formNode.classList.toggle('hidden');
    });
    // 추가버튼을 누를때 발생하는 이벤트 핸들러 추가
    node.querySelector('.add-btn').addEventListener('click', (e) => {
      const textarea = node.querySelector('.textarea-todo');
      const content = textarea.value;

      //현재 브라우저 전역변수  userId :로그인된 userId
      let loginId = document.loginId;
      const containerId = this.id;

      const payload = {
        content,
        date: new Date(),
        userId: loginId,
        containerId,
      };

      fetch(`/api/todo/add`, {
        method: 'POST',
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
            data.obj.date = new Date(data.obj.date);
            const newTodo = Object.assign(new Todo(), data.obj);

            newTodo.render();
            Todo.setHandler(newTodo.node);
            document.todoMap.set(newTodo.id, newTodo);
            this.node.querySelector('.cardlist').prepend(newTodo.node);

            let formNode = this.node.querySelector('.form-add-todo');
            formNode.classList.toggle('hidden');

            const logEvent = new Event('todoadd');
            logEvent.log = {
              userid: document.loginId,
              action: 'add',
              todo: newTodo,
              fromCotainerId: '',
              toContainerId: this.id,
            };
            document.logManager.dispatchEvent(logEvent);

            // 추가되었으면 순서변경 이벤트 발생하여 orderlist 갱신
            this.dispatchEvent(new Event('todomoved'));
          } else {
            alert('추가도중 오류가 발생');
          }
        });
    });

    node.querySelector('.add-todo').addEventListener('click', (e) => {
      let formNode = node.querySelector('.form-add-todo');
      const textArea = node.querySelector('.textarea-todo');
      textArea.value = '';
      formNode.classList.toggle('hidden');
    });

    return node;
  }
}
