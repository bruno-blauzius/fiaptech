import { describe } from 'node:test';
import { expect } from '@jest/globals';
import { test, it } from '@jest/globals';
import BadRequestError from '../../../app/application/exception/BadRequestError';

describe("Teste de exception", () => {
    test("BadRequestError", async () => {
        try {
            throw new BadRequestError("Deu Erro aqui");
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestError);
        }
    });
});