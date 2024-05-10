const BaseModel = require('./model');
const crypto = require('crypto');
const db = require('../services/db');

module.exports = class PasswordChangeRequest extends BaseModel {
  #requestId;
  #requestCode;
  #requestDate;
  #user;
  #used = false;
  tableName = 'PasswordChangeRequests';

  constructor(properties = {}) {
    super();
    Object.assign(this, properties);
    this.initialized = true;
  }

  get requestId() { return this.#requestId; }
  get requestCode() { return this.#requestCode; }
  get requestDate() { return this.#requestDate; }
  get user() { return this.#user; }
  get used() { return this.#used; }

  set requestId(value) { this.#requestId = value; }
  set requestCode(value) { this.#requestCode = value; }
  set requestDate(value) { this.#requestDate = value; }
  set user(value) { this.#user = value; }
  set used(value) {
    if (this.#used !== value) {
      if (this.initialized)
        this.changedFields.add('used');
      this.#used = value;
    }
  }

  async save() {
    if (this.#requestId && this.changedFields.size !== 0) {
      await db.query(`CALL finishPasswordChangeRequest(?)`, [this.#requestId]);
    } else {
      this.#requestId = await db.query('CALL createPasswordChangeRequest(?, ?, ?)', [
        this.#requestCode,
        this.#requestDate,
        this.#user.userId
      ]);
    }
  }

  async loadByUserEmail(email) {
    const request = await db.query(`SELECT requestId
    FROM PasswordChangeRequests INNER JOIN Users ON PasswordChangeRequests.userId = Users.userId 
    WHERE Users.email = ? 
    ORDER BY requestDate DESC LIMIT 1`,
      [email]);
    if (request.length == 0) {
      return false;
    }

    this.load('requestId', request[0].requestId);
    return true;
  }
}