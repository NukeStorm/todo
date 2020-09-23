const pool = require('../../DB/mysqPool');
const TodoContainer = require('./TodoContainer');

class TodoContainerRepo {
  constructor() {
    this.pool = pool;
  }

  async selectUserContainerIdList(userId) {
    let connection = await this.pool.getConnection();
    const [row, field] = await connection.query(`select * from container where user_id='${userId}'`);
    connection.release();

    return row;
  }

  async insertContainer(name, userid) {
    let connection = await this.pool.getConnection();
    let sql = `INSERT INTO todolist.container ( name,user_id)VALUES ('${name}','${userid}');`;
    const [row, field] = await connection.query(sql);
    connection.release();
    return row;
  }

  async selectContainerTodoListById(id) {
    let connection = await this.pool.getConnection();
    const sql = `select todo.id,content,date,todo.user_id,container_id from todo,container where todo.container_id= container.id  and todo.container_id='${id}';`;
    const [row, field] = await connection.query(sql);
    connection.release();
    return row;
  }

  async DeleteContainerById(id) {
    let connection = await this.pool.getConnection();
    const sql = `DELETE from container where id='${id}';`;
    const [row, field] = await connection.query(sql);
    connection.release();
    return row;
  }

  async updateConainerOrder(id, order) {
    let connection = await this.pool.getConnection();
    const sql = `UPDATE container SET orderlist = '${order}' WHERE id = ${id};`;
    const [row, field] = await connection.query(sql);
    connection.release();
    return row;
  }
}

module.exports = TodoContainerRepo;
