const BaseModel = require('./model');
const db = require('../services/db');

module.exports = class Product extends BaseModel {
  #productId;
  #title;
  #rating;
  #ratingAmount;
  #price;
  #description;
  #url;
  #image;
  #hidden;
  #platformId;
  #categoryId;
  tableName = 'Products';

  constructor(properties = {}) {
    super();
    Object.assign(this, properties);
    this.initialized = true;
  }

  get productId() { return this.#productId; }
  get title() { return this.#title; }
  get rating() { return this.#rating; }
  get ratingAmount() { return this.#ratingAmount; }
  get price() { return this.#price; }
  get description() { return this.#description; }
  get url() { return this.#url; }
  get image() { return this.#image; }
  get hidden() { return this.#hidden; }
  get platformId() { return this.#platformId; }
  get categoryId() { return this.#categoryId; }

  set productId(value) {
    this.#productId = value;
  }
  set title(value) {
    if (this.#title !== value) {
      if (this.initialized)
        this.changedFields.add('title');
      this.#title = value;
    }
  }
  set rating(value) {
    if (this.#rating !== value) {
      if (this.initialized)
        this.changedFields.add('rating');
      this.#rating = value;
    }
  }
  set ratingAmount(value) {
    if (this.#ratingAmount !== value) {
      if (this.initialized)
        this.changedFields.add('ratingAmount');
      this.#ratingAmount = value;
    }
  }
  set price(value) {
    if (this.#price !== value) {
      if (this.initialized)
        this.changedFields.add('price');
      this.#price = value;
    }
  }
  set description(value) {
    if (this.#description !== value) {
      if (this.initialized)
        this.changedFields.add('description');
      this.#description = value;
    }
  }
  set url(value) {
    if (this.#url !== value) {
      if (this.initialized)
        this.changedFields.add('url');
      this.#url = value;
    }
  }
  set image(value) {
    if (this.#image !== value) {
      if (this.initialized)
        this.changedFields.add('image');
      this.#image = value;
    }
  }
  set hidden(value) {
    if (this.#hidden !== value) {
      if (this.initialized)
        this.changedFields.add('hidden');
      this.#hidden = value;
    }
  }
  set platformId(value) {
    if (this.#platformId !== value) {
      if (this.initialized)
        this.changedFields.add('platformId');
      this.#platformId = value;
    }
  }
  set categoryId(value) {
    if (this.#categoryId !== value) {
      if (this.initialized)
        this.changedFields.add('categoryId');
      this.#categoryId = value;
    }
  }

  async save() {
    if (this.#productId) {
      let updateString = '';
      let updateValues = [];
      for (const [index, field] of [...this.changedFields].entries()) {
        updateString += field + ' = ?' + (index === this.changedFields.size - 1 ? '' : ', ');
        updateValues.push(this[field]);
      }
      await db.query(`UPDATE Products SET ${updateString} WHERE productId = ?`, [...updateValues, this.#productId]);
    } else {
      const result = await db.query(`CALL insertProduct(?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        this.#title,
        this.#rating,
        this.#price,
        this.#description,
        this.#url,
        this.#image,
        this.#platformId,
        this.#categoryId,
        this.#ratingAmount
      ]);
      this.#productId = result;
    }
  }
}