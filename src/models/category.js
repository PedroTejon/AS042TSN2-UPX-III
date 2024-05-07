const BaseModel = require('./model');

module.exports = class Category extends BaseModel {
  #categoryId;
  #name;
  tableName = 'Categories';

  constructor(properties = {}) {
    super();
    Object.assign(this, properties);
    this.initialized = true;
  }

  get categoryId() { return this.#categoryId; }
  get name() { return this.#name; }

  set categoryId(value) {
    this.#categoryId = value;
  }
  set name(value) {
    if (this.#name !== value) {
      if (this.initialized)
        this.changedFields.add('name');
      this.#name = value;
    }
  }
}