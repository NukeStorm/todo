const pool = require('../../DB/mysqPool');
const Todo = require('./Todo');

class TodRepo {
  constructor() {
    this.pool = pool;
  }

  async selectTodoById(id) {
    let connection = await this.pool.getConnection();
    console.log(connection);
    const [rows, field] = await connection.query(
      `select * from todo where id='${id}'`,
    );
    console.log(rows[0].date.getTimezoneOffset());

    let todo = Object.assign(new Todo(), rows[0]);
    await connection.release();

    return todo;
  }

  async insertTodo(todoObj, userId, containerId) {
    let connection = await this.pool.getConnection();
    const [row, field] = await connection.query(
      `INSERT INTO todolist.todo (title ,content,user_id,container_id)VALUES ('${todoObj.title}','${todoObj.content}', '${userId}',${containerId});`,
    );
    await connection.release();
    let result = row.insertId;
    return result;
  }

  async updateTodo(todoObj, containerId) {
    let connection = await this.pool.getConnection();
    const sql = `UPDATE todo SET title='${todoObj.title}', content='${
      todoObj.content
    }', date='${todoObj.date.toISOString()}', user_id='${
      todoObj.user_id
    }' , container_id='${containerId}' WHERE id = '${todoObj.id}';`;
    console.log(sql);
    const [row] = await connection.query(sql);
    await connection.release();
    const result = row.insertId;
    return result;
  }

  async deleteTodo(todoId) {
    let connection = await this.pool.getConnection();
    const sql = `Delete from todo where id='${todoId}';`;
    console.log(sql);
    const [row] = await connection.query(sql);
    await connection.release();
    const result = row.insertId;
    return result;
  }
}

module.exports = TodRepo;
/*
let repo = new TodRepo();
repo.selectTodoById(1).then((res) => {
  console.log(res);

  repo
    .selectTodoById(2)
    .then((res2) => console.log(res2))
    .then(() => {
      repo.pool.end();
    });
});
*/
