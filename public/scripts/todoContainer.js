/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable quotes */

import { Todo } from './todo.js';

/*
현재 화면에 생성된 TodoContainer(todo를 담고있는 container)를 관리하는 클래스
백엔드의 TodoContainer에 대응
*/
export class TodoContainer extends EventTarget {
  constructor(id, name, todolist) {
    super();
    this.id = id;
    this.name = name;
    this.todolist = todolist;
    this.todomap = new Map();

    todolist.forEach((todo) => {
      this.todomap.set([todo.id], todo);
    });

    console.log('test', this.todomap.size);
    this.node = null;
    this.addEventListener('changed', (e) => {
      console.log(e.cardobj);
    });
  }

  static createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  addTodo(todo) {
    this.todolist.push(todo);
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
    console.log(orderlist);
    return orderlist;
  }

  // todo container node를 생성, this.node를 통해 이 dom node를 조작 가능
  render() {
    const cnt = this.todolist.length;
    const title = this.name;
    const htmlString = `<div class="todo-container" container-id="${this.id}">
        <div class="container-title">
            <div class= "card-num">${cnt}</div>
            <div>${title}</div>
            <div><button class="add-todo">+</button>X</div>
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
    this.todolist.forEach((todo) => {
      this.node.querySelector('.cardlist').appendChild(todo.node);
    });

    const cardlistNode = this.node.querySelector('.cardlist');

    cardlistNode.addEventListener('DOMSubtreeModified', (e) => {
      e.preventDefault();
      console.log(e.target, 'cardlist affected');
      const todoCntNode = this.node.querySelector('.card-num');

      todoCntNode.innerText = cardlistNode.querySelectorAll('.todo-card').length;
    });

    node.addEventListener('dragover', TodoContainer.dragoverHandler);

    node.addEventListener('drop', (e) => {
      const data = e.dataTransfer.getData('text/plain');
      const board = document.querySelector('.board');
      const source = board.querySelector(`div[card-id="${data}"]`);

      //card node를 감싸고 있는 todo object
      const sourceObj = this.todomap.get(data);
      console.log('drop container');
      const changeEvent = new Event('changed');
      changeEvent.cardobj = sourceObj;
      this.dispatchEvent(changeEvent);
      this.node.querySelector('.cardlist').appendChild(source);

      source.style.opacity = '1.0';
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
          console.log(data);

          if (data.obj) {
            const newTodo = Object.assign(new Todo(), data.obj);
            newTodo.render();
            Todo.setHandler(newTodo.node);
            document.todoMap.set(newTodo.id, newTodo);
            this.node.querySelector('.cardlist').prepend(newTodo.node);

            let formNode = this.node.querySelector('.form-add-todo');
            formNode.classList.toggle('hidden');
          } else {
            alert('추가도중 오류 발생');
          }
        });
    });

    node.querySelector('.add-todo').addEventListener('click', (e) => {
      let formNode = node.querySelector('.form-add-todo');
      formNode.classList.toggle('hidden');
    });

    return node;
  }
}
