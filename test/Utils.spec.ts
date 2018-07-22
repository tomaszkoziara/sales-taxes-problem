import * as chai from 'chai';
import Utils from '../src/Utils';
import { Decimal } from 'decimal.js';

describe("Utils", () => {
    describe("roundUpToNearest5Cent", () => {

        it("shouldRoungUpProperly", () => {
            chai.assert.equal(Utils.roundUpToNearest5Cent(new Decimal(7.125)).toNumber(), 7.15);
            chai.assert.equal(Utils.roundUpToNearest5Cent(new Decimal(7.101)).toNumber(), 7.15);
        });

    });
});