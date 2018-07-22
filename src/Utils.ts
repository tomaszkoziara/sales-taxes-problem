import { Decimal } from 'decimal.js';

export default class Utils {

    static roundUpToNearest5Cent(numberToRound: Decimal): Decimal {
        const fiveCents = new Decimal(0.05);
        if (numberToRound.mod(fiveCents).isZero()) {
            return numberToRound;
        }
        const multiplier = numberToRound.div(fiveCents).ceil();
        return fiveCents.times(multiplier);
        // return numberToRound.toDecimalPlaces(2).times(20).minus(0.5).ceil().div(20);
    }

    static toCurrencyNumber(decimal: Decimal): number {
        return decimal.toDecimalPlaces(2).toNumber();
    }

}