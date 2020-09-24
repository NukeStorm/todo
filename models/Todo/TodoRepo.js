const pool = require('../../DB/mysqPool');
const Todo = require('./Todo');

class TodoRepo {
  constructor() {
    this.pool = pool;
  }

  async selectTodoById(id) {
    let connection = await this.pool.getConnection();

    const [rows, field] = await connection.query(`select * from todo where id='${id}'`);
    let todo = Object.assign(new Todo(), rows[0]);

    todo.date = todo.date.replace(' ', 'T');
    todo.date += '.000Z';
    todo.date = new Date(todo.date);

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

    const sql = `UPDATE todo SET title='${todoObj.title}', content='${todoObj.content}', date='${todoObj.date
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')}' , container_id='${containerId}' WHERE id = '${todoObj.id}';`;

    const [row] = await connection.query(sql);
    await connection.release();
    const result = row;
    return result;
  }

  async deleteTodo(todoId) {
    let connection = await this.pool.getConnection();
    const sql = `Delete from todo where id='${todoId}';`;

    const [row] = await connection.query(sql);
    await connection.release();

    const result = row.affectedRows;
    return result;
  }
}

module.exports = TodoRepo;
