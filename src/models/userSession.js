const BaseModel = require('./model');
const crypto = require('crypto');
const db = require('../services/db');

module.exports = class UserSession extends BaseModel {
  #sessionHash;
  #userId;
  #loginDate;
  #expires;
  tableName = 'UserSessions';

  constructor(properties = {}) {
    super();
    Object.assign(this, properties);
    if (this.#userId) {
      if (this.#loginDate == undefined) {
        this.#loginDate = new Date();
      }
      if (this.#expires == undefined) {
        this.#expires = new Date(this.#loginDate.setMonth(this.#loginDate.getMonth() + 1));
      }
      if (this.#sessionHash == undefined) {
        this.#sessionHash = crypto.createHash('md5')
          .update(`${this.#userId}-${this.#loginDate.toISOString()}`).digest('hex');
      }
    }
  }

  get sessionHash() { return this.#sessionHash; }
  get userId() { return this.#userId; }
  get loginDate() { return this.#loginDate; }
  get expires() { return this.#expires; }

  set sessionHash(value) {
    this.#sessionHash = value;
  }
  set userId(value) {
    this.#userId = value;
  }
  set loginDate(value) {
    this.#loginDate = value;
  }
  set expires(value) {
    this.#expires = value;
  }

  async save() {
    await db.query('CALL createUserSession(?, ?, ?, ?)', [
      this.#sessionHash,
      this.#userId,
      this.#loginDate.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      this.#expires.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    ]);
  }
}