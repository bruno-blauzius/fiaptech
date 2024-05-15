import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import Cliente from '../../../app/entity/cliente';
import Pedido from '../../../app/entity/pedido';
import { statusPedido } from '../../../app/entity/enum/statusPedido';
import Produto from '../../../app/entity/produto';
import Categoria from '../../../app/entity/categoria';

describe("Validando Pedido", () => {
    test("setStatus", () => {
      let dataClient = new Cliente(
        "Heitor Bernardo Victor Nogueira",
        "heitoBVN@gmail.com",
        "043.065.619-09"
      );

      let dataPedido = new Pedido(
        dataClient,
        statusPedido.CRIADO
      );

      dataPedido.setStatus(statusPedido.EM_PREPARACAO);
      expect(2).toEqual(dataPedido.getStatus());
    });

    test("Cria Pedido sem Cliente", () => {
      const dataPedido = () => {
        new Pedido(
          null,
          statusPedido.CRIADO
        );
      };
      expect(dataPedido).toThrow(Error);
    })

    test("Cria Pedido com Cliente", () => {
        let dataClient = new Cliente(
          "Heitor Bernardo Victor Nogueira",
          "heitoBVN@gmail.com",
          "043.065.619-09"
        );

        let dataPedido = new Pedido(
          dataClient,
          statusPedido.CRIADO
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(dataPedido.cliente.name);
        expect(0).toEqual(dataPedido.getStatus());
    })
    test("Cria Pedido com Cliente e  1 produtos", () => {
      let dataClient = new Cliente(
        "Heitor Bernardo Victor Nogueira",
        "heitoBVN@gmail.com",
        "043.065.619-09"
      );
      let dataProduto = new Produto(
        "X salada",
        10.50,
        new Categoria("Lanche","1"),
        "Um lanche com salada"
      );

      let dataPedido = new Pedido(
        dataClient,
        statusPedido.CRIADO,
      );
      dataPedido.adicionarProduto(dataProduto);

      expect("Heitor Bernardo Victor Nogueira").toEqual(dataPedido.cliente.name);
      expect(1).toEqual(dataPedido.getProdutos().length);
      expect(dataProduto).toEqual(dataPedido.getProdutos()[0]);
      expect(10.50).toEqual(dataPedido.getValorTotal());
      expect(0).toEqual(dataPedido.getStatus());
  })

  test("Cria Pedido com Cliente e 2 produtos", () => {
    let dataClient = new Cliente(
      "Heitor Bernardo Victor Nogueira",
      "heitoBVN@gmail.com",
      "043.065.619-09"
    );
    const dataProduto = [];
    dataProduto.push(new Produto("X-Salada", 10.50, new Categoria("Lanche", "1"), "Um lanche com salada"));
    dataProduto.push(new Produto("Coca-Cola", 3.00, new Categoria("Bebida", "2"), "Refrigerante de cola"));
    dataProduto.push(new Produto("Batata Frita", 5.00, new Categoria("Acompanhamento", "3"), "Batata frita crocante"));

    let dataPedido = new Pedido(
      dataClient,
      statusPedido.CRIADO,
    );

    dataProduto.forEach(produto => {
      dataPedido.adicionarProduto(produto);
    });
    
    expect("Heitor Bernardo Victor Nogueira").toEqual(dataPedido.cliente.name);
    expect(3).toEqual(dataPedido.getProdutos().length);
    expect(18.50).toEqual(dataPedido.getValorTotal());
    expect(0).toEqual(dataPedido.getStatus());
})
});
