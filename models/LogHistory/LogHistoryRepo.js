const pool = require('../../DB/mysqPool');
const LogHistory = require('./loghistory');
class LogHistoryRepo {
  constructor() {
    this.pool = pool;
  }

  async selectAllLogHistory(userId) {
    let connection = await this.pool.getConnection();
    const [rows, field] = await connection.query(`select * from loghistory where user_id='${userId}' order by date DESC;`);

    const logList = rows.map((row) => {
      let { date } = row;
      date = date.replace(' ', 'T');
      date += '.000Z';
      date = new Date(date);
      const logHistory = new LogHistory(row.id, row.log, date);
      return logHistory;
    });
    await connection.release();
    return logList;
  }

  async selectLogHistory(id) {
    let connection = await this.pool.getConnection();
    const sql = `select * from loghistory where id=${id};`;

    const [rows, field] = await connection.query(sql);

    let log = rows.map((row) => {
      let { date } = row;
      date = date.replace(' ', 'T');
      date += '.000Z';
      date = new Date(date);
      const logHistory = new LogHistory(row.id, row.log, date);
      return logHistory;
    });

    [log] = log;

    await connection.release();
    return log;
  }

  async insertLogHistory(logHistoryObj) {
    let connection = await this.pool.getConnection();
    let sql = `INSERT INTO loghistory (log ,user_id)VALUES ('${logHistoryObj.log}', '${logHistoryObj.userId}');`;
    const [row, field] = await connection.query(sql);
    await connection.release();
    const result = row.insertId;
    return result;
  }
}
module.exports = LogHistoryRepo;
