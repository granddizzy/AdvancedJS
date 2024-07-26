// У вас есть базовый список пользователей. Некоторые из них имеют информацию о своем премиум-аккаунте, а
// некоторые – нет.
//   Ваша задача – создать структуру классов для этих пользователей и функцию для получения информации о
// наличии премиум-аккаунта, используя Опциональную цепочку вызовов методов, оператор нулевого слияния
// и instanceof.
// 1. Создайте базовый класс User с базовой информацией (например, имя и фамилия).
// 2. Создайте классы PremiumUser и RegularUser, которые наследуются от User. Класс
// PremiumUser должен иметь свойство premiumAccount (допустим, дата истечения срока
// действия), а у RegularUser такого свойства нет.
// 3. Создайте функцию getAccountInfo(user), которая принимает объект класса User и
// возвращает информацию о наличии и сроке действия премиум-аккаунта, используя
// Опциональную цепочку вызовов методов и оператор нулевого слияния.
// 4. В функции getAccountInfo используйте instanceof для проверки типа переданного
// пользователя и дайте соответствующий ответ.

"use strict";

class AbstractUser {
  constructor(firstName, lastName) {
    if (new.target === AbstractUser) {
      throw new Error("Cannot instantiate an abstract class directly");
    }

    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class PremiumUser extends AbstractUser {
  constructor(firstName, lastName, premiumAccountExpiration) {
    super(firstName, lastName);
    this.premiumAccountExpiration = premiumAccountExpiration;
  }
}

class RegularUser extends AbstractUser {
  constructor(firstName, lastName) {
    super(firstName, lastName);
  }
}

function getAccountInfo(user) {
  if (user instanceof PremiumUser) {
    const expiration = user.premiumAccountExpiration ?? "No expiration date available";
    return `Premium account expires on: ${expiration}`;
  } else if (user instanceof RegularUser) {
    return "User does not have a premium account";
  } else {
    return "Unknown user type";
  }
}

const premiumUser = new PremiumUser("John", "Doe", "2025-12-31");
const regularUser = new RegularUser("Jane", "Smith");

console.log(getAccountInfo(premiumUser));
console.log(getAccountInfo(regularUser));