import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import cliente from '../../../app/entity/cliente';

describe("Validando Entity Cliente", () => {
    test("Instanciar Cliente", () => {
        let dataClient = new cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(dataClient.name);
        expect("heitoBVN@gmail.com").toEqual(dataClient.email);
        expect("31759487740").toEqual(dataClient.cpf_cnpj);
    })
    test("CPF com formatação", () => {
        let dataClient = new cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(dataClient.name);
        expect("heitoBVN@gmail.com").toEqual(dataClient.email);
        expect("317.594.877-40").not.toEqual(dataClient.cpf_cnpj);
    })
    test("CPF VÁLIDO", () => {
        let dataClient = new cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect(dataClient.isValidCpf()).toEqual(true);
    });
    test("CPF INVÁLIDO", () => {
        expect(() => {
            let dataClient = new cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "317.594.877-41"
            );
        }).toThrow("CPF do cliente é inválido.");
    });
    test("E-MAIL VÁLIDO", () => {
        let dataClient = new cliente(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect(dataClient.isValidEmail()).toEqual(true);
    });
    test("E-MAIL INVÁLIDO", () => {
        expect(() => {
            let dataClient = new cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail",
                "317.594.877-40"
            );
        }).toThrow("E-mail do cliente é inválido.");
    });
});