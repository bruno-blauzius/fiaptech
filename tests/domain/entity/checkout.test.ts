import { UUID } from 'crypto';
import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test } from '@jest/globals';

import Payer from '../../../app/entity/payer';
import Cliente from '../../../app/entity/cliente';
import Cartao from '../../../app/entity/cartao';
import Pedido from '../../../app/entity/pedido';
import Checkout from '../../../app/entity/checkout';
import { statusPedido } from '../../../app/entity/enum/statusPedido';
import { StatusCheckout } from '../../../app/entity/enum/statusCheckout';
import Pix from '../../../app/entity/pix';

describe("Validando Entity Checkout", () => {
    test("Instanciar Checkout by CARD", () => {

        let instance = new Checkout(
            new Pedido(
                new Cliente(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "043.065.619-09"
                  ),
                statusPedido.CRIADO
            ),
            new Cartao(
                new Payer(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "317.594.877-40"
                ),
                '4171-9043-4466-6522',
                '155',
                '9/2026'
            )
        );
        /**
         * payer
         */
        expect("Heitor Bernardo Victor Nogueira").toEqual(instance.metodoPagamento.payer.name);
        expect("heitoBVN@gmail.com").toEqual(instance.metodoPagamento.payer.email);
        expect("31759487740").toEqual(instance.metodoPagamento.payer.document);
        /**
         * card
         */
        expect("4171-9043-4466-6522").toEqual(instance.metodoPagamento.number);
        expect("155").toEqual(instance.metodoPagamento.cvv);
        expect("9/2026").toEqual(instance.metodoPagamento.expirationDate);

        expect(statusPedido.CRIADO).toEqual(instance.pedido.getStatus());
        expect(StatusCheckout.AGUARDANDO_PAGAMENTO).toEqual(instance.getStatus());
        expect(instance.uuid).not.toBeNull();
    });

    test("Instanciar Checkout by PIX", () => {

        let instance = new Checkout(
            new Pedido(
                new Cliente(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "043.065.619-09"
                  ),
                statusPedido.CRIADO
            ),
            new Pix(
                new Payer(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "317.594.877-40"
                )
            )
        );
        /**
         * payer
         */
        expect("Heitor Bernardo Victor Nogueira").toEqual(instance.metodoPagamento.payer.name);
        expect("heitoBVN@gmail.com").toEqual(instance.metodoPagamento.payer.email);
        expect("31759487740").toEqual(instance.metodoPagamento.payer.document);

        expect(statusPedido.CRIADO).toEqual(instance.pedido.getStatus());
        expect(StatusCheckout.AGUARDANDO_PAGAMENTO).toEqual(instance.getStatus());
        expect(instance.uuid).not.toBeNull();
    });

    test("getPaymentMethod", () => {
        let instance = new Checkout(
            new Pedido(
                new Cliente(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "043.065.619-09"
                  ),
                statusPedido.CRIADO
            ),
            new Pix(
                new Payer(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "317.594.877-40"
                )
            )
        );

        expect(1).toEqual(instance.getPaymentMethod());
    });
});
