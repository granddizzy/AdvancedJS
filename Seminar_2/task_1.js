// Задание 1 (тайминг 25 минут)
// Давайте создадим класс для управления банковским счетом. В этом классе будет приватное
// свойство для хранения текущего баланса, а также методы для внесения и снятия денег со счета.
// 1. Класс должен содержать приватное свойство #balance, которое инициализируется
// значением 0 и представляет собой текущий баланс счета.
// 2. Реализуйте геттер balance, который позволит получить информацию о текущем балансе.
// 3. Реализуйте метод deposit(amount), который позволит вносить средства на счет.
//   Убедитесь, что сумма внесения не отрицательная; в противном случае выбрасывайте
// ошибку.
// 4. Реализуйте метод withdraw(amount), который позволит снимать средства со счета.
//   Убедитесь, что сумма для снятия неотрицательная и что на счете достаточно средств; в
// противном случае выбрасывайте ошибку.
// 5. Реализуйте конструктор, который принимает начальный баланс в качестве аргумента.
//   Убедитесь, что начальный баланс не отрицательный; в противном случае выбрасывайте
// ошибку.
"use strict";

class BankAccount {
  #balance;

  constructor(initialBalance = 0) {
    if (initialBalance < 0) {
      throw new Error("Initial balance cannot be negative");
    }
    this.#balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    this.#validateAmount()
    this.#balance += amount;
  }

  withdraw(amount) {
    this.#validateAmount(amount);
    if (amount > this.#balance) {
      throw new Error("Insufficient funds");
    }
    this.#balance -= amount;
  }

  #validateAmount(amount) {
    if (!Number.isFinite(amount)) {
      throw new Error("Incorrect number");
    }
    if (amount < 0) {
      throw new Error("Withdrawal amount cannot be negative");
    }

    const parts = amount.toString().split(".");
    if (parts[1]?.length > 2) {
      throw new Error("The fractional part must not exceed 2 digits");
    }
  }
}