import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import Cliente from '../../../app/entity/cliente';
import Pedido from '../../../app/entity/pedido';
import { statusPedido } from '../../../app/entity/enum/statusPedido';
import Produto from '../../../app/entity/produto';
import Categoria from '../../../app/entity/categoria';


import User from '../../../app/entity/user';

describe("isValidName", () => {
  test("com nome válido retorna true", () => {
    let user = new User("Lucas Sapienza", "sapienzalucas@gmail.com");
    expect(user.isValidName()).toBeTruthy();
  });

  test("com nome inválido retorna false", () => {
    let user = new User("", "sapienzalucas@gmail.com");
    expect(user.isValidName()).toBeFalsy();
  });
});

describe("isValidEmail", () => {
  test("com email válido retorna true", () => {
    let user = new User("Lucas Sapienza", "sapienzalucas@gmail.com");
    expect(user.isValidEmail()).toBeTruthy();
  });
});
