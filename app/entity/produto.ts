import BadRequestError from "../application/exception/BadRequestError";
import Categoria from "./categoria";

class Produto{
    constructor (
        readonly title: string, 
        readonly value ,
        readonly categoria: Categoria, 
        readonly description? : string,
        readonly id?
    ) {
        if (title == null || title == "") {
            throw new BadRequestError("O Titulo é requirido.");
        }

        if (value == null || isNaN(value) || value == "") {
            throw new BadRequestError("O Valor é requirido.");
        }

        this.value = parseFloat(value);
    }

}

export default Produto;