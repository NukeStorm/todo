/* eslint-disable import/prefer-default-export */

/*
현재 화면에 생성된 Todo Card(todo)를 관리하는 클래스
백엔드의 Todo에 대응
*/
export class Todo {
  constructor(id, title, content, date, userId) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.date = date;
    this.user_id = userId;
    this.node = null;
  }

  static createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  render() {
    const htmlString = `<div class="todo-card"><div class="todo-content">${this.content}<button class="remove">x</button> </div>  <div class="todo-author">created by ${this.user_id}</div></div>`;
    const node = Todo.createElementFromHTML(htmlString);

    node.querySelector('.remove').addEventListener('click', (e) => {
      const parent = node.parentNode;
      console.log(parent);
      parent.removeChild(node);
    });
    this.node = node;
    return node;
  }
}
