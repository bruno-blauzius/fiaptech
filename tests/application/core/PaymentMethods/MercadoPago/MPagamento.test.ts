import { describe } from 'node:test';
import { expect, jest, it } from '@jest/globals';
import MPagamento from '../../../../../app/gateways/paymentsMethods/MercadoPago/MPagamento';
import Checkout from '../../../../../app/entity/checkout';
import Pedido from '../../../../../app/entity/pedido';
import Cliente from '../../../../../app/entity/cliente';
import { statusPedido } from '../../../../../app/entity/enum/statusPedido';
import { StatusCheckout } from '../../../../../app/entity/enum/statusCheckout';
import Produto from '../../../../../app/entity/produto';
import Categoria from '../../../../../app/entity/categoria';
import PaymentMethods from '../../../../../app/entity/enum/PaymentoMethods';
import Pix from '../../../../../app/entity/pix';
import Cartao from '../../../../../app/entity/cartao';
import Payer from '../../../../../app/entity/payer';

const nockBack = require('nock').back
nockBack.setMode('record')
nockBack.fixtures = 'tests/nockFixtures'

describe("MPagamento", () => {
    let mercado_pago: MPagamento;
    let pedido: Pedido;
    let checkout: Checkout;

    it('statusPagamentoMapping com status pending deve retornar AGUARDANDO_PAGAMENTO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'pending',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.AGUARDANDO_PAGAMENTO);
    });

    it('statusPagamentoMapping com status approved deve retornar PAGAMENTO_EFETUADO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'approved',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.PAGAMENTO_EFETUADO);
    });

    it('statusPagamentoMapping com status authorized deve retornar PAGAMENTO_EFETUADO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'authorized',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.PAGAMENTO_EFETUADO);
    });

    it('statusPagamentoMapping com status in_process deve retornar AGUARDANDO_PAGAMENTO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'in_process',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.AGUARDANDO_PAGAMENTO);
    });

    it('statusPagamentoMapping com status in_mediation deve retornar AGUARDANDO_PAGAMENTO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'in_mediation',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.AGUARDANDO_PAGAMENTO);
    });

    it('statusPagamentoMapping com status rejected deve retornar PAGAMENTO_CANCELADO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'rejected',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.PAGAMENTO_CANCELADO);
    });

    it('statusPagamentoMapping com status cancelled deve retornar PAGAMENTO_CANCELADO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'cancelled',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.PAGAMENTO_CANCELADO);
    });

    it('statusPagamentoMapping com status refunded deve retornar PAGAMENTO_CANCELADO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'refunded',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.PAGAMENTO_CANCELADO);
    });

    it('statusPagamentoMapping com status charged_back deve retornar PAGAMENTO_CANCELADO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'charged_back',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.PAGAMENTO_CANCELADO);
    });

    it('statusPagamentoMapping com status default deve retornar AGUARDANDO_PAGAMENTO', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status: 'default',
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.statusPagamentoMapping()).toEqual(StatusCheckout.AGUARDANDO_PAGAMENTO);
    });

    it('aguardandoPagamento com status pending_waiting_transfer deve retornar true', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status_detail: 'pending_waiting_transfer'
        }

        expect(mercado_pago.aguardandoPagamento()).toBeTruthy();
    });

    it('aguardandoPagamento com status default deve retornar false', () => {
        mercado_pago = new MPagamento();
        mercado_pago.response = {
            status_detail: 'default'
        }

        expect(mercado_pago.aguardandoPagamento()).toBeFalsy();
    });

    it('store com metodo de pagamento PIX deve retornar checkout', async () => {
        mercado_pago = new MPagamento();
        pedido = new Pedido(
            new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "043.065.619-09"
            ),
            statusPedido.CRIADO
        );

        let produto = new Produto("X-Salada", 10.50, new Categoria("Lanche", "1"), "Um lanche com salada");
        pedido.adicionarProduto(produto)

        checkout = new Checkout(
            pedido,
            new Pix(
                new Payer(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "043.065.619-09"
                )
            )
        );
        checkout.setPaymentMethod(PaymentMethods.PIX);
        mercado_pago.pix = jest.fn<(checkout: Checkout) => Promise<Checkout>>().mockResolvedValue(checkout);

        const response = await mercado_pago.store(checkout);
        expect(response).toBeInstanceOf(Checkout);
        expect(mercado_pago.pix).toHaveBeenCalledWith(checkout);
    });

    it('store com metodo de pagamento CARD_DEBIT deve retornar checkout', async () => {
        mercado_pago = new MPagamento();
        pedido = new Pedido(
            new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "043.065.619-09"
            ),
            statusPedido.CRIADO
        );

        let produto = new Produto("X-Salada", 10.50, new Categoria("Lanche", "1"), "Um lanche com salada");
        pedido.adicionarProduto(produto)

        checkout = new Checkout(
            pedido,
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

        checkout.setPaymentMethod(PaymentMethods.CARD_DEBIT);
        mercado_pago.card = jest.fn<(checkout: Checkout) => Promise<Checkout>>().mockResolvedValue(checkout);

        const response = await mercado_pago.store(checkout);
        expect(response).toBeInstanceOf(Checkout);
        expect(mercado_pago.card).toHaveBeenCalledWith(checkout);
    });

    it('store com metodo de pagamento CARD_CREDIT deve retornar checkout', async () => {
        mercado_pago = new MPagamento();
        pedido = new Pedido(
            new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "043.065.619-09"
            ),
            statusPedido.CRIADO
        );

        let produto = new Produto("X-Salada", 10.50, new Categoria("Lanche", "1"), "Um lanche com salada");
        pedido.adicionarProduto(produto)

        checkout = new Checkout(
            pedido,
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

        checkout.setPaymentMethod(PaymentMethods.CARD_CREDIT);
        mercado_pago.card = jest.fn<(checkout: Checkout) => Promise<Checkout>>().mockResolvedValue(checkout);

        const response = await mercado_pago.store(checkout);
        expect(response).toBeInstanceOf(Checkout);
        expect(mercado_pago.card).toHaveBeenCalledWith(checkout);
    });

    it('store com metodo de pagamento não implementado deve retornar erro', async () => {
        mercado_pago = new MPagamento();
        pedido = new Pedido(
            new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "043.065.619-09"
            ),
            statusPedido.CRIADO
        );

        let produto = new Produto("X-Salada", 10.50, new Categoria("Lanche", "1"), "Um lanche com salada");
        pedido.adicionarProduto(produto)

        checkout = new Checkout(
            pedido,
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

        checkout.setPaymentMethod(PaymentMethods.CARD_CREDIT);

        expect(async () => { await mercado_pago.store(checkout)}).rejects.toThrow();
    });

    it('realizar o pagamento via pix deve retornar checkout', async () => {
        mercado_pago = new MPagamento();
        pedido = new Pedido(
            new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "043.065.619-09"
            ),
            statusPedido.CRIADO
        );

        let produto = new Produto("X-Salada", 10.50, new Categoria("Lanche", "1"), "Um lanche com salada");
        pedido.adicionarProduto(produto)

        checkout = new Checkout(
            pedido,
            new Pix(
                new Payer(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "043.065.619-09"
                )
            )
        );
        checkout.uuid = '25c2ff41-6f2e-4ad3-ab30-ccb2a2fa159a';

        checkout.setPaymentMethod(PaymentMethods.PIX);
        mercado_pago.response = {
            status: 'pending',
            status_detail: 'pending_waiting_transfer'
        }

        const { nockDone, context } = await nockBack('MPagamento/pix-success.json')
        const response = await mercado_pago.pix(checkout);
        nockDone()

        expect(response).toBeInstanceOf(Checkout);
    });

    it('find deve retornar erro', async () => {
        mercado_pago = new MPagamento();
        expect(async () => { return await mercado_pago.find(BigInt(1));}).rejects.toThrow();
    });

    it('sync retorna status do pagamento', async () => {
        mercado_pago = new MPagamento();
        pedido = new Pedido(
            new Cliente(
                "Heitor Bernardo Victor Nogueira",
                "heitoBVN@gmail.com",
                "043.065.619-09"
            ),
            statusPedido.CRIADO
        );

        checkout = new Checkout(
            pedido,
            new Pix(
                new Payer(
                    "Heitor Bernardo Victor Nogueira",
                    "heitoBVN@gmail.com",
                    "043.065.619-09"
                )
            )
        );
        checkout.external_reference = '1318173202';

        const { nockDone, context } = await nockBack('MPagamento/sync-success.json')
        const response = await mercado_pago.sync(checkout);
        nockDone()

        expect(response).toEqual(StatusCheckout.AGUARDANDO_PAGAMENTO);
    });
});
