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

  setHandler(container) {
    this.node.addEventListener('dragstart', (e) => Todo.dragstartHandler(e, container));
    this.node.addEventListener('drop', Todo.dropHandler);
    this.node.addEventListener('dragover', Todo.dragoverHandler);
    this.node.querySelector('.remove').addEventListener('click', (e) => {
      const parent = node.parentNode;
      console.log(container);
      parent.removeChild(this.node);
    });
  }

  static dragstartHandler(ev, parent) {
    // 데이터 전달 객체에 대상 요소의 id를 추가합니다

    //ev.dataTransfer.setData('todo/obj', parent.todomap.get(ev.target.getAttribute('card-id')));
    ev.dataTransfer.setData('text/plain', ev.target.getAttribute('card-id'));
    // eslint-disable-next-line no-param-reassign
    ev.dataTransfer.dropEffect = 'move';
    ev.target.style.opacity = '0.5';
  }

  static dragoverHandler(ev) {
    ev.preventDefault();
    // dropEffect를 move로 설정.
    ev.dataTransfer.dropEffect = 'move';
  }

  static dropHandler(ev) {
    console.log('drop card');
    ev.stopPropagation();
    // 대상의 id를 가져와 대상 DOM에 움직인 요소를 추가합니다.

    let { target } = ev;
    console.log('target card', target);
    if (target.className === 'todo-content' || target.className === 'todo-title' || target.className === 'todo-author') {
      target = target.parentNode;
    }

    if (target.className === 'todo-card') {
      // 삽입 위치의 node를 백업

      const data = ev.dataTransfer.getData('text/plain');

      //const board = target.parentNode;
      const board = document.querySelector('.board');
      const container = target.parentNode;
      const source = board.querySelector(`div[card-id="${data}"]`);
      console.log(source);
      const clone = source.cloneNode(true);
      const target_clone = target.cloneNode(true);

      if (target.getAttribute('card-id') !== source.getAttribute('card-id')) {
        container.replaceChild(clone, target);
        clone.style.opacity = '1.0';
        container.replaceChild(target_clone, source);

        clone.addEventListener('dragstart', Todo.dragstartHandler);
        clone.addEventListener('drop', Todo.dropHandler);
        clone.addEventListener('dragover', Todo.dragoverHandler);

        target_clone.addEventListener('dragstart', Todo.dragstartHandler);
        target_clone.addEventListener('drop', Todo.dropHandler);
        target_clone.addEventListener('dragover', Todo.dragoverHandler);
      } else {
        console.log('same', source);
        source.style.opacity = '1.0';
      }
    }
  }

  static createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  render() {
    const htmlString = `<div class="todo-card" draggable="true" card-id=${this.id}>
    <div class="todo-content">
    ${this.content} id : ${this.id}
    <button class="remove">x</button>
    </div> 
      <div class="todo-author">created by ${this.user_id}</div>
    </div>`;
    const node = Todo.createElementFromHTML(htmlString);
    this.node = node;
    return node;
  }
}
