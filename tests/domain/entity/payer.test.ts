import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import Payer from '../../../app/entity/payer';

describe("Validando Entity Payer", () => {
    test("Instanciar Pagador", () => {
        let instance = new Payer(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(instance.name);
        expect("heitoBVN@gmail.com").toEqual(instance.email);
        expect("31759487740").toEqual(instance.document);
    });

    test("CPF com formatação", () => {
        let instance = new Payer(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect("Heitor Bernardo Victor Nogueira").toEqual(instance.name);
        expect("heitoBVN@gmail.com").toEqual(instance.email);
        expect("317.594.877-40").not.toEqual(instance.document);
    })
    test("CPF VÁLIDO", () => {
        let instance = new Payer(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect(instance.isValidCpf()).toEqual(true);
    });
    test("CPF INVÁLIDO", () => {
        expect(() => {
            let instance = new Payer(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "317.594.877-41"
            );
        }).toThrow("CPF inválido.");
    });
    test("E-MAIL VÁLIDO", () => {
        let instance = new Payer(
            "Heitor Bernardo Victor Nogueira",
            "heitoBVN@gmail.com",
            "317.594.877-40"
        );
        expect(instance.isValidEmail()).toEqual(true);
    });
    test("E-MAIL INVÁLIDO", () => {
        expect(() => {
            let instance = new Payer(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail",
                "317.594.877-40"
            );
        }).toThrow("E-mail inválido.");
    });
    test("Nome é obrigatório", () => {
        expect(() => {
            let instance = new Payer(
                "",
                "heitoBVN@gmail",
                "317.594.877-40"
            );
        }).toThrow("Nome é obrigatório.");
    });
    test("Email é obrigatório", () => {
        expect(() => {
            let instance = new Payer(
                "Heitor Bernardo Victor Nogueira",
                "",
                "317.594.877-40"
            );
        }).toThrow("E-mail é obrigatório.");
    });
    test("CPF é obrigatório", () => {
        expect(() => {
            let instance = new Payer(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                ""
            );
        }).toThrow("CPF é obrigatório.");
    });
});
