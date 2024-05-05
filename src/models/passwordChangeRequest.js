const BaseModel = require('./model');
const crypto = require('crypto');
const db = require('../services/db');

module.exports = class PasswordChangeRequest extends BaseModel {
  #requestId;
  #requestCode;
  #requestDate;
  #userId;
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
  get userId() { return this.#userId; }
  get used() { return this.#used; }

  set requestId(value) { this.#requestId = value; }
  set requestCode(value) { this.#requestCode = value; }
  set requestDate(value) { this.#requestDate = value; }
  set userId(value) { this.#userId = value; }
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
        this.#userId
      ]);
    }
  }

  async confirmCode(code, email) {
    await db.query(`SELECT request_code, request_date, usuarios.id_usuario, usuarios.email, used
    FROM solicitacoes_mudanca_senha INNER JOIN usuarios ON solicitacoes_mudanca_senha.id_usuario = usuarios.id_usuario 
    WHERE usuarios.email = ? 
    ORDER BY request_date DESC LIMIT 1`, [email])
  }
}