const LogHistoryRepo = require('../models/LogHistory/LogHistoryRepo');
const LogHistory = require('../models/LogHistory/loghistory');

class LogService {
  constructor() {
    this.logRepo = new LogHistoryRepo();
  }

  async getAllLogs(userId) {
    const logList = await this.logRepo.selectAllLogHistory(userId);
    return logList;
  }

  async getLog(id) {
    const log = await this.logRepo.selectLogHistory(id);
    return log;
  }

  async reportLog(logmsg, timestamp, userId) {
    const log = new LogHistory(null, logmsg, timestamp, userId);
    const insertId = await this.logRepo.insertLogHistory(log);
    return insertId;
  }
}

module.exports = LogService;
