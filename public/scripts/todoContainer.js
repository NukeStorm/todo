/* eslint-disable quotes */

import { Todo } from './todo';

/*
현재 화면에 생성된 TodoContainer(todo를 담고있는 container)를 관리하는 클래스
백엔드의 TodoContainer에 대응
*/
class TodoContainer {
  constructor(id, name, todolist) {
    this.id = id;
    this.name = name;
    this.todolist = todolist;
    this.node = null;
  }

  static createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  addTodo(todo) {
    this.todolist.push(todo);
  }

  // todo container node를 생성, this.node를 통해 이 dom node를 조작 가능
  render() {
    const cnt = this.todolist.length;
    const title = this.name;
    const htmlString = `<div class="todo-container">
        <div class="container-title">
            <div>${cnt}</div>
            <div>${title}</div>
            <div><button class="add-todo">+</button>X</div>
         </div>
    </div>`;

    const node = TodoContainer.createElementFromHTML(htmlString);
    this.todolist.forEach((todo) => {
      this.node.appendChild(todo.node);
    });

    this.node = node;

    // 추가버튼을 누를때 발생하는 이벤트 핸들러 추가
    node.querySelector('.add-todo').addEventListener('click', (e) => {
      // 현재는 테스트용으로 샘플 todo card를 생성하여 todocontainer에 삽입
      // TODO:아래 코드를 삭제하고 todo card 생성하고 추가하는 코드 구현
      let todo = new Todo(1, null, '테스트', new Date(), 'shin');
      todo.render();
      this.node.appendChild(todo.node);
    });

    return node;
  }
}

/* board에 todo container 추가 테스트 코드, 삭제 예정 */
let board = document.querySelector('.board');
let todoContainer = new TodoContainer(1, '할일', []);
todoContainer.render();
board.appendChild(todoContainer.node);
