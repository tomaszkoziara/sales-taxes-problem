import { Decimal } from 'decimal.js';

export class Product {

    name: string;
    quantity: number;
    pricePerUnit: Decimal;
    category: ProductCategory;
    isImported: boolean;

    constructor(name: string, quantity: number, pricePerUnit: Decimal, category: ProductCategory, isImported: boolean = false) {
        this.name = name;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.category = category;
        this.isImported = isImported;
    }

}

export enum ProductCategory {
    Books, Food, MedicalProducts, Other
}