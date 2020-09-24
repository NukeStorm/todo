const UserRepository = require('../models/User/UserRepository');
const User = require('../models/User/User');

class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async findUser(id, pw) {
    let res = await this.userRepo.selectUserById(id);

    if (!res) {
      return false;
    }

    [res] = res;

    if (res.id === id && res.pw === pw) return res;

    return false;
  }
}

module.exports = UserService;
