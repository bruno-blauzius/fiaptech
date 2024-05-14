import Checkout from "../../../entity/checkout";
import IPaymentMethods from "../../../interfaces/IPaymentsMethods";
import PaymentoMethods from "../../../entity/enum/PaymentoMethods";
import { StatusCheckout } from '../../../entity/enum/statusCheckout';
import { v4 as uuidv4 } from 'uuid';
const fetch = require("node-fetch");

class MPagamento implements IPaymentMethods {

    public auth_token: string;

    public url: string;

    public notification_url: string;

    public response;


    constructor () {
        this.auth_token = process.env.MP_CLIENT_SECRET
        this.url = process.env.MP_URL;
        this.notification_url = process.env.MP_NOTIFICATION_URL;
    }

    statusPagamentoMapping = () => {
        switch (this.response['status']) {
            case 'pending':
                return StatusCheckout.AGUARDANDO_PAGAMENTO;
            case 'approved':
            case 'authorized':
                return StatusCheckout.PAGAMENTO_EFETUADO;
            case 'in_process':
            case 'in_mediation':
                return StatusCheckout.AGUARDANDO_PAGAMENTO;
            case 'rejected':
            case 'cancelled':
            case 'refunded':
            case 'charged_back':
                return StatusCheckout.PAGAMENTO_CANCELADO;
            default:
                return StatusCheckout.AGUARDANDO_PAGAMENTO;
        }
    }

    aguardandoPagamento = () : boolean => {
        return this.response['status_detail'] == 'pending_waiting_transfer';
    }

    public store = async (checkout: Checkout) : Promise<Checkout> => {
        if (checkout.metodoPagamento.payment_method_id == PaymentoMethods.PIX) {
            return await this.pix(checkout);
        } else if ([PaymentoMethods.CARD_DEBIT, PaymentoMethods.CARD_CREDIT].includes(checkout.metodoPagamento.payment_method_id)) {
            return await this.card(checkout);
        } else {
            throw new Error("Payment Method not implemented.");
        }
    }

    pix = async (checkout : Checkout) : Promise<Checkout> => {
        const response =  await fetch(`${this.url}payments`,{
            method: 'POST',
            body: JSON.stringify({
                "transaction_amount" :checkout.pedido.getValorTotal(),
                "description" : `MERCADO PAGO PAGAMENTO PIX - Compra segura cliente ${checkout.metodoPagamento.payer.email}`,
                "payment_method_id" : "pix",
                "external_reference" : checkout.uuid,
                "notification_url" : this.notification_url,
                "payer" : {
                    "email" : checkout.metodoPagamento.payer.email,
                }
            }),
            headers: {
                "Content-Type" : "application/json",
                "X-Idempotency-Key" : uuidv4(),
                "Authorization" : `Bearer ${this.auth_token}`
            }
        });

        if (response.status >= 300) {
            throw new Error("Não foi possível realizar o pagamento na MP.");
        }

        this.response = await response.json();
        checkout.payload = JSON.stringify(this.response);

        /**
         * atualizo o checkout de pagamento com o retorno de sucesso ou erro do gateway
         */
        if (this.aguardandoPagamento()) {
            checkout.setStatus(StatusCheckout.AGUARDANDO_CONFIMACAO_PAGAMENTO);
        }

        console.log('========================================================================================')
        console.log(`Payment QR Code:`, this.response['point_of_interaction']['transaction_data']['ticket_url'])
        console.log('========================================================================================')

        return checkout;
    }

    card = async (checkout : Checkout) : Promise<Checkout> => {
        throw new Error("Method not implemented.");
    }

    public find = async (id: BigInt) => {
        throw new Error("Method not implemented.");
    }

    public sync = async (checkout: Checkout) => {
        const response =  await fetch(`${this.url}payments/${checkout.external_reference}`,{
            method: 'GET',
            headers: {
                "Content-Type" : "application/json",
                "X-Idempotency-Key" : uuidv4(),
                "Authorization" : `Bearer ${this.auth_token}`
            }
        });

        if (response.status >= 300) {
            throw new Error(response.statusText);
        }

        this.response = await response.json();

        return this.statusPagamentoMapping();
    }
}

export default MPagamento;

