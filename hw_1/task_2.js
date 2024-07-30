"use strict";

class Restaurant {
  constructor() {
    this.chefs = new Map();
    this.orders = new Map();
    this.dishes = new Map();
    this.typesOfDish = new Set();
    this.lastOrderId = 0;
  }

  addTypeOfDish(typeTitle) {
    this.typesOfDish.add(typeTitle);
  }

  addChef(chefName, dishType) {
    this.validateTypeOfDish(dishType);
    if (this.chefs.has(dishType)) {
      throw new Error(`Chef for dish type "${dishType}" already exists`);
    }
    this.chefs.set(dishType, chefName);
  }

  getChefByDishType(dishType) {
    return this.chefs.get(dishType);
  }

  addDish(dishTitle, dishType) {
    this.validateTypeOfDish(dishType);
    if (!this.dishes.has(dishType)) {
      this.dishes.set(dishType, [])
    }
    const dishes = this.dishes.get(dishType);
    for (const dish of dishes) {
      if (dish.title === dishTitle) throw new Error(`The "${dishType}" "${dishTitle}" dish is already there`);
    }
    this.dishes.get(dishType).push(new Dish(dishTitle, dishType));
  }

  getDish(dishType, dishTitle) {
    this.validateTypeOfDish(dishType);
    const dishes = this.dishes.get(dishType);
    for (const dish of dishes) {
      if (dish.title === dishTitle) return dish;
    }
    throw new Error(`Dish title "${dishTitle}" not present`)
  }

  createNewOrder(client) {
    this.lastOrderId++;
    const id = Symbol(this.lastOrderId);
    this.orders.set(id, new Order(id, client));
    return id;
  }

  getOrder(id) {
    return this.orders.get(id);
  }

  validateTypeOfDish(dishType) {
    if (!this.typesOfDish.has(dishType)) {
      throw new Error(`Dish type "${dishType}" not present`);
    }
  }
}

class Dish {
  constructor(title, type) {
    this.title = title;
    this.type = type;
  }
}

class Order {
  constructor(id, client) {
    this.id = id;
    this.client = client;
    this.dishes = new Map();
  }

  addItem(dish) {
    if (this.dishes.has(dish)) {
      this.dishes.set(dish, this.dishes.get(dish) + 1);
    } else {
      this.dishes.set(dish, 1);
    }
  }

  show() {
    console.log(`Заказ №${this.id.description}`);
    console.log(`Клиент ${this.client} заказал:`);

    for (const [dish, count] of this.dishes.entries()) {
      console.log(`(${dish.type}) - ${dish.title} - ${count}; Готовит повар ${restaurant.getChefByDishType(dish.type)}`);
    }
  }
}


class Client {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  toString() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const restaurant = new Restaurant();

restaurant.addTypeOfDish("Пицца");
restaurant.addTypeOfDish("Суши");
restaurant.addTypeOfDish("Десерт");

restaurant.addChef("Олег", "Пицца");
restaurant.addChef("Андрей", "Суши");
restaurant.addChef("Анна", "Десерт");

restaurant.addDish("Маргарита", "Пицца");
restaurant.addDish("Пепперони", "Пицца");
restaurant.addDish("Три сыра", "Пицца");
restaurant.addDish("Филадельфия", "Суши");
restaurant.addDish("Калифорния", "Суши");
restaurant.addDish("Чизмаки", "Суши");
restaurant.addDish("Сеякемаки", "Суши");
restaurant.addDish("Тирамису", "Десерт");
restaurant.addDish("Чизкейк", "Десерт");

let orderId = restaurant.createNewOrder(new Client("Алексей", "Иванов"));
let order = restaurant.getOrder(orderId);
order.addItem(restaurant.getDish("Пицца", "Пепперони"));
order.addItem(restaurant.getDish("Десерт", "Тирамису"));
order.addItem(restaurant.getDish("Десерт", "Тирамису"));
order.show();

orderId = restaurant.createNewOrder(new Client("Иван", "Сидоров"));
order = restaurant.getOrder(orderId);
order.addItem(restaurant.getDish("Пицца", "Маргарита"));
order.addItem(restaurant.getDish("Пицца", "Маргарита"));
order.addItem(restaurant.getDish("Суши", "Чизмаки"));
order.show();