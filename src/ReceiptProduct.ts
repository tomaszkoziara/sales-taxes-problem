import { Product, ProductCategory } from './Product';
import { Decimal } from 'decimal.js';

export class ReceiptProduct extends Product {

    taxesPerUnit: number;

    constructor(name: string, quantity: number, pricePerUnit: Decimal, category: ProductCategory, taxesPerUnit: number) {
        super(name, quantity, pricePerUnit, category);
        this.taxesPerUnit = taxesPerUnit;
    }

    getTotalPriceWithTaxes(): Decimal {

        return this.pricePerUnit
            .plus(this.taxesPerUnit)
            .times(this.quantity);

    }

}