const pool = require('../DB/mysqPool');
const User = require('./User');

class UserRepository {
  constructor() {
    this.promisePool = pool.promise();
  }

  async selectUserById(id) {
    const [row, field] = await this.promisePool.query(
      `select * from user where id='${id}'`,
    );
    this.promisePool.end();
    return row;
  }

  async selectAll() {
    let result = await this.promisePool
      .query('select * from user')
      .then((res) => {
        const [rows, fields] = res;
        let UserList = [];
        rows.forEach((row) => {
          let user = Object.assign(new User(), row);
          UserList.push(user);
        });
        this.promisePool.end();
        return UserList;
      });
    return result;
  }

  async insertUser(user) {
    const [row, field] = await this.promisePool.execute(
      `INSERT INTO user(id, pw) VALUES ('${user.id}', '${user.pw}');`,
    );
    this.promisePool.end();
    return row;
  }

  async updateUser(user) {
    const [row, field] = await this.promisePool.execute(
      `UPDATE user SET id = '${user.id}', pw='${user.pw}' WHERE id = '${user.id}';`,
    );
    this.promisePool.end();
    return row;
  }

  async deleteUser(user) {
    const [row, field] = await this.promisePool.execute(
      `DELETE from user where id='${user.id}';`,
    );
    this.promisePool.end();
    return row;
  }
}

module.exports = UserRepository;
