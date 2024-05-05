const BaseModel = require('./model');
const db = require('../services/db');

module.exports = class User extends BaseModel {
  #userId;
  #email;
  #passwordHash;
  #name;
  #birthDate;
  #gender;
  #administrator;
  tableName = 'Users';

  constructor(properties = {}) {
    super();
    Object.assign(this, properties);
    this.initialized = true;
  }

  get userId() { return this.#userId; }
  get email() { return this.#email; }
  get passwordHash() { return this.#passwordHash; }
  get name() { return this.#name; }
  get birthDate() { return this.#birthDate; }
  get gender() { return this.#gender; }
  get administrator() { return this.#administrator; }

  set userId(value) {
    this.#userId = value;
  }
  set email(value) {
    if (this.#email !== value) {
      if (this.initialized)
        this.changedFields.add('email');
      this.#email = value;
    }
  }
  set passwordHash(value) {
    if (this.#passwordHash !== value) {
      if (this.initialized)
        this.changedFields.add('passwordHash');
      this.#passwordHash = value;
    }
  }
  set name(value) {
    if (this.#name !== value) {
      if (this.initialized)
        this.changedFields.add('name');
      this.#name = value;
    }
  }
  set birthDate(value) {
    if (this.#birthDate !== undefined)
      if (this.#birthDate.toString() === value.toString())
        return;

    if (this.#birthDate !== value) {
      if (this.initialized)
        this.changedFields.add('birthDate');

      this.#birthDate = value;
    }
  }
  set gender(value) {
    if (this.#gender !== value) {
      if (this.initialized)
        this.changedFields.add('gender');
      this.#gender = value;
    }
  }
  set administrator(value) {
    this.#administrator = value;
  }

  async save() {
    if (this.#userId) {
      let updateString = '';
      let updateValues = [];
      for (const [index, element] of [...this.changedFields].entries()) {
        updateString += element + ' = ?' + (index === this.changedFields.size - 1 ? '' : ', ');
        updateValues.push(
          this[element]);
      }
      await db.query(`UPDATE Users SET ${updateString} WHERE userId = ?`, [...updateValues, this.#userId]);
    } else {
      const result = await db.query('CALL insertUser(?, ?, ?, ?, ?)', [
        this.#email,
        this.#passwordHash,
        this.#name,
        this.#birthDate,
        this.#gender
      ]);
      this.#userId = result;
    }
  }

  async saveProduct(productId) {
    return (await db.query('CALL saveProduct(?, ?)', [this.#userId, productId])).affectedRows != 0;
  }

  async unsaveProduct(productId) {
    return (await db.query('CALL unsaveProduct(?, ?)', [this.#userId, productId])).affectedRows != 0;
  }

  async hideProduct(productId) {
    return (await db.query('CALL hideProduct(?, ?)', [this.#userId, productId]))[0][0]['code'];
  }

  async unhideProduct(productId) {
    return (await db.query('CALL unhideProduct(?, ?)', [this.#userId, productId]))[0][0]['code'];
  }
}