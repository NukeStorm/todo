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

  // todo container node를 생성, this.node를 통해 이 dom node를 조작 가능
  render() {
    const cnt = this.todolist.length;
    const title = this.name;
    const htmlString = `<div class="todo-container">
        <div class="container-title">
            <div class= "card-num">${cnt}</div>
            <div>${title}</div>
            <div><button class="add-todo">+</button>X</div>
         </div>
         <div class="cardlist"></div>
    </div>`;

    const node = TodoContainer.createElementFromHTML(htmlString);
    this.node = node;
    this.todolist.forEach((todo) => {
      this.node.querySelector('.cardlist').appendChild(todo.node);
    });
    node.addEventListener('dragover', TodoContainer.dragoverHandler);

    node.addEventListener('drop', (e) => {
      const data = e.dataTransfer.getData('text/plain');

      const todoObj = e.dataTransfer.getData('todo/obj');
      console.dir(todoObj, { depth: null });

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
    // 추가버튼을 누를때 발생하는 이벤트 핸들러 추가
    node.querySelector('.add-todo').addEventListener('click', (e) => {
      // 현재는 테스트용으로 샘플 todo card를 생성하여 todocontainer에 삽입
      // TODO:아래 코드를 삭제하고 todo card 생성하고 추가하는 코드 구현
      const todo = new Todo(Math.floor(Math.random() * 2000 + 1), null, `테스트${Math.floor(Math.random() * 2000 + 1)}`, new Date(), 'shin');
      todo.render(this.node);
      this.node.querySelector('.cardlist').appendChild(todo.node);
    });

    return node;
  }
}
