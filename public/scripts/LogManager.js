/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
export class LogManager extends EventTarget {
  constructor() {
    super();
    this.addEventListener('updatelog', async (ev) => {
      let userId = document.loginId;
      let getAlldata = async () => {
        const fetchResponse = await fetch(`/api/log/loadall/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          credentials: 'same-origin',
        });
        const data = await fetchResponse.json();

        return data;
      };

      let res = await getAlldata();
      res = res.data;

      const logContainerNode = document.querySelector('.log-container');
      logContainerNode.innerHTML = '';
      res.forEach((logHistory) => {
        let logmsg = logHistory.log;
        let timestamp = logHistory.date;
        this.addLog(this.rendermsg(logmsg, timestamp));
      });
    });

    this.addEventListener('todoadd', (ev) => {
      let log = ev.log;

      let todoId = log.todo.id;
      let todoContent = log.todo.content;
      let targetContainerName = document.containerMap.get(log.toContainerId).name;

      let logmsg = `added <a href="#card-${todoId}">${todoContent}</a> to <b>${targetContainerName}</b> `;
      let timestamp = log.todo.date;

      this.sendLog(logmsg, document.loginId).then(() => {
        this.dispatchEvent(new Event('updatelog'));
      });
    });
    this.addEventListener('todoupdate', (ev) => {
      let log = ev.log;
      let todoId = log.todo.id;
      let todoContent = log.todo.content;

      let logmsg = `updated  <a href="#card-${todoId}">${todoContent}</a>`;
      let timestamp = log.todo.date;

      this.sendLog(logmsg, document.loginId).then(() => {
        this.dispatchEvent(new Event('updatelog'));
      });
    });

    this.addEventListener('todoremove', (ev) => {
      let log = ev.log;
      let todoId = log.todo.id;
      let todoContent = log.todo.content;
      let logmsg = `removed  <b>${todoContent}</b>`;
      let timestamp = log.todo.date;
      this.sendLog(logmsg, document.loginId).then(() => {
        this.dispatchEvent(new Event('updatelog'));
      });
    });

    this.addEventListener('todomove', (ev) => {
      let log = ev.log;
      let todoId = log.todo.id;
      let todoContent = log.todo.content;

      let sourceContainerName = document.containerMap.get(log.fromCotainerId).name;
      let targetContainerName = document.containerMap.get(log.toContainerId).name;

      let logmsg = `moved <a href="#card-${todoId}">${todoContent}</a> from <b>${sourceContainerName}</b> to <b>${targetContainerName}</b>`;
      let timestamp = log.todo.date;

      this.sendLog(logmsg, document.loginId).then(() => {
        this.dispatchEvent(new Event('updatelog'));
      });

      //
    });
    this.dispatchEvent(new Event('updatelog'));
  }

  static createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  rendermsg(logmsg, timestamp) {
    const htmlstr = `
    <div class="log-msg">
    <div>${logmsg}<div>
    <div>${timestamp}</div>
    </div>`;
    const node = LogManager.createElementFromHTML(htmlstr);
    return node;
  }

  addLog(msgnode) {
    const logContainerNode = document.querySelector('.log-container');
    logContainerNode.appendChild(msgnode);
  }

  async sendLog(logmsg, userId) {
    const log = {
      logmsg: logmsg,
      timestamp: null, //null시 db에 기록된 시간 자동 저장
      userId,
    };

    const fetchResponse = await fetch('/api/log/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(log),
      credentials: 'same-origin',
    });
    const data = await fetchResponse.json();
  }
}
