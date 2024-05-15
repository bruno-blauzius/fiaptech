import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import Categoria from '../../../app/entity/categoria';
import Produto from '../../../app/entity/produto';

describe("Validando Entity Produto", () => {
    test("Instanciar Produto com minimo de parametros", () => {
        let produto = new Produto(
            "Produto Teste",
            10,
            new Categoria("Categoria Teste", 1)
        );
        expect("Produto Teste").toEqual(produto.title);
        expect(10).toEqual(produto.value);
        expect("Categoria Teste").toEqual(produto.categoria.name);
        expect(1).toEqual(produto.categoria.id);
    });

    test("Instanciar Produto todos os parametros", () => {
        let produto = new Produto(
            "Produto Teste",
            10,
            new Categoria("Categoria Teste", 1),
            "DESCRIÇÃO DO PRODUTO",
            1
        );
        expect("Produto Teste").toEqual(produto.title);
        expect("DESCRIÇÃO DO PRODUTO").toEqual(produto.description);
        expect(10).toEqual(produto.value);
        expect("Categoria Teste").toEqual(produto.categoria.name);
        expect(1).toEqual(produto.categoria.id);
        expect(1).toEqual(produto.id);
    });

    test("Instanciar Produto todos os parametros", () => {
        expect(() => {
            let produto = new Produto(
                "Produto Teste",
                10,
                new Categoria("", 1)
            );
        }).toThrow("O nome da categoria é obrigatório.");
    });

    test("Instanciar Produto sem title", () => {
        expect(() => {
            let produto = new Produto(
                "",
                10,
                new Categoria("Categoria Teste", 1)
            );
        }).toThrow("O Titulo é requirido.");
    });

    test("Instanciar Produto sem value", () => {
        expect(() => {
            let produto = new Produto(
                "Produto Teste",
                "",
                new Categoria("Categoria Teste", 1)
            );
        }).toThrow("O Valor é requirido.");
    });

    test("Instanciar Produto com categoria sem nome", () => {
        expect(() => {
            let produto = new Produto(
                "Produto Teste",
                10,
                new Categoria("", 1)
            );
        }).toThrow("O nome da categoria é obrigatório.");
    });

});
