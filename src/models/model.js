const db = require('../services/db');

module.exports = class BaseModel {
  instantiatableClasses = {
    Category: require('./category').prototype.constructor,
    User: require('./user').prototype.constructor,
    Product: require('./product').prototype.constructor,
    Platform: require('./platform').prototype.constructor,

  }
  tableName;
  changedFields = new Set();
  initialized = false;

  constructor() { }

  async load(identifyingColumn, value, fields = '*') {
    const result = await db.query(`SELECT ${fields} FROM ${this.tableName} WHERE ${identifyingColumn} = ?`, [value]);

    if (result.length === 0) {
      return;
    }

    const obj = result[0];
    const idName = this.constructor.name[0].toLowerCase() + this.constructor.name.slice(1) + 'Id';

    for (const field of Object.keys(obj).filter((field) => field !== idName && field.includes('Id') && (fields == '*' || fields.includes(field)))) {
      const relatedObject = new this.instantiatableClasses[field[0].toUpperCase() + field.slice(1).replace('Id', '')]()
      await relatedObject.load(field, obj[field]);
      this[field.replace('Id', '')] = relatedObject;
      delete obj[field]
    }

    this.initialized = false;
    Object.assign(this, obj);
    this.initialized = true;
  }
}