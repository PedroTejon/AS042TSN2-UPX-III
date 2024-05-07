const BaseModel = require('./model');

module.exports = class Platform extends BaseModel {
  #platformId;
  #name;
  #url;
  tableName = 'Platforms';

  constructor(properties = {}) {
    super();
    Object.assign(this, properties);
    this.initialized = true;
  }

  get platformId() { return this.#platformId; }
  get nome() { return this.#name; }
  get url() { return this.#url; }

  set platformId(value) {
    this.#platformId = value;
  }
  set nome(value) {
    if (this.#name !== value) {
      if (this.initialized)
        this.changedFields.add('name');
      this.#name = value;
    }
  }
  set url(value) {
    if (this.#url !== value) {
      if (this.initialized)
        this.changedFields.add('url');
      this.#url = value;
    }
  }
}