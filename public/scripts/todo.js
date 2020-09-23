/* eslint-disable operator-linebreak */
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

  static deletebtnHandler(ev, node) {
    const parent = node.parentNode;

    let todoId = node.getAttribute('card-id');

    fetch(`/api/todo/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ todoId }),
      credentials: 'same-origin',
    })
      .then((e) => e.json())
      .then((e) => {
        let data = e.data;

        if (data.result) {
          document.todoMap.delete(parseInt(todoId, 10));
          parent.removeChild(node);
        } else {
          alert('삭제 도중 오류 발생');
        }
      });
  }

  static setHandler(node) {
    node.addEventListener('dragstart', (e) => Todo.dragstartHandler(e));
    node.querySelector('.edit-btn').addEventListener('click', (e) => Todo.clickEditBtnHandler(e, node));
    node.addEventListener('drop', Todo.dropHandler);
    node.addEventListener('dragover', Todo.dragoverHandler);
    node.querySelector('.remove').addEventListener('click', (e) => Todo.deletebtnHandler(e, node));
  }

  //해당 todo 편집 버튼을 눌렀을때
  static clickEditBtnHandler(ev, cardNode) {
    const content = cardNode.querySelector('.todo-content').innerText;
    const modal = document.getElementById('edit_modal');
    modal.classList.toggle('hidden');
    //modal에 현재 선택한 todo의 값(todo id, container id, content ).전달

    const textarea = modal.querySelector('.textarea-todo');
    textarea.value = content;

    modal.setAttribute('card-id', parseInt(cardNode.getAttribute('card-id'), 10));
    modal.setAttribute('container-id', cardNode.parentNode.parentNode.getAttribute('container-id'));
  }

  static dragstartHandler(ev) {
    // 데이터 전달 객체에 대상 요소의 id를 추가

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

    if (target.className != 'todo-card') {
      target = target.closest('.todo-card');
      console.log('closest', target);
    }

    if (target.className === 'todo-card') {
      // 삽입 위치의 node를 백업

      const sourceId = parseInt(ev.dataTransfer.getData('text/plain'), 10);
      const targetId = parseInt(target.getAttribute('card-id'), 10);
      console.log(sourceId, targetId);

      const board = document.querySelector('.board');
      const source = document.todoMap.get(sourceId).node;
      const targetContainer = target.parentNode;
      const sourceContainer = source.parentNode;

      console.log('source', source);

      const sourceClone = source.cloneNode(true);
      const targetClone = target.cloneNode(true);

      if (target.getAttribute('card-id') !== source.getAttribute('card-id')) {
        console.log('targetcontainer ', targetContainer);
        console.log('sorucecontainer ', sourceContainer);
        if (targetContainer == sourceContainer) {
          targetContainer.replaceChild(sourceClone, target);
          sourceClone.style.opacity = '1.0';
          targetContainer.replaceChild(targetClone, source);
        } else {
          targetContainer.appendChild(source);
          targetContainer.replaceChild(sourceClone, target);
          sourceClone.style.opacity = '1.0';
          targetContainer.replaceChild(targetClone, source);
        }

        Todo.setHandler(sourceClone);
        Todo.setHandler(targetClone);

        let sourceTodo = document.todoMap.get(sourceId);
        sourceTodo.node = sourceClone;
        document.todoMap.set(sourceId, sourceTodo);

        let targetTodo = document.todoMap.get(targetId);
        targetTodo.node = targetClone;
        document.todoMap.set(targetId, targetTodo);
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
    <div class="todo-body" >
    <div class="todo-content">
    ${this.content}
    </div>
    <div class="btn-area">
    <button class="edit-btn">edit</btn><button class="remove">x</button>
    </div>
    </div> 
      <div class="todo-author">created by ${this.user_id}</div>
    </div>`;
    const node = Todo.createElementFromHTML(htmlString);
    this.node = node;
    return node;
  }
}
