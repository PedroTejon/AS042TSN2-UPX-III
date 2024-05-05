const db = require('../services/db');

module.exports = class BaseModel {
  tableName;
  changedFields = new Set();
  initialized = false;

  constructor() { }

  async load(identifyingColumn, value, fields = '*') {
    const result = await db.query(`SELECT ${fields} FROM ${this.tableName} WHERE ${identifyingColumn} = ?`, [value]);

    if (result.length === 0) {
      return;
    }

    this.initialized = false;
    Object.assign(this, result[0]);
    this.initialized = true;
  }
}