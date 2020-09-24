const pool = require('../../DB/mysqPool');
const User = require('./User');

class UserRepository {
  constructor() {
    this.pool = pool;
  }

  async selectUserById(id) {
    let connection = await this.pool.getConnection();
    const [row, field] = await connection.query(`select * from user where id='${id}'`);
    connection.release();
    return row;
  }

  async selectAll() {
    let connection = await this.pool.getConnection();
    let result = await connection.query('select * from user').then((res) => {
      const [rows, fields] = res;
      let UserList = [];
      rows.forEach((row) => {
        let user = Object.assign(new User(), row);
        UserList.push(user);
      });
      connection.release();
      return UserList;
    });
    return result;
  }

  async insertUser(user) {
    let connection = await this.pool.getConnection();
    const [row, field] = await connection.execute(`INSERT INTO user(id, pw) VALUES ('${user.id}', '${user.pw}');`);
    connection.release();
    return row;
  }

  async updateUser(user) {
    let connection = await this.pool.getConnection();
    const [row, field] = await connection.execute(`UPDATE user SET id = '${user.id}', pw='${user.pw}' WHERE id = '${user.id}';`);
    connection.release();
    return row;
  }

  async deleteUser(user) {
    let connection = await this.pool.getConnection();
    const [row, field] = await connection.execute(`DELETE from user where id='${user.id}';`);
    connection.end();
    return row;
  }
}

module.exports = UserRepository;
