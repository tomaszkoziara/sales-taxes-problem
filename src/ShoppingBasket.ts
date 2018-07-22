import { Product, ProductCategory } from './Product';
import { Receipt } from './Receipt';
import { ReceiptProduct } from './ReceiptProduct';
import Utils from './Utils';
import { Decimal } from 'decimal.js';

export class ShoppingBasket {

    static readonly baseTaxPercentage = 10;
    static readonly importTaxPercentage = 5;

    products: Product[];

    constructor() {
        this.products = [];
    }

    addProduct(product: Product): void {
        this.products.push(product);
    }

    checkout(): Receipt {

        let total = new Decimal(0);
        let salesTaxes = new Decimal(0);
        const receiptProducts: ReceiptProduct[] = [];

        for (let i = 0; i < this.products.length; i++) {
            const currentProduct = this.products[i];

            let taxesPercentage = new Decimal(0);
            if (!this.isTaxExempt(currentProduct)) {
                taxesPercentage = taxesPercentage.plus(ShoppingBasket.baseTaxPercentage);
            }
            if (this.isImported(currentProduct)) {
                taxesPercentage = taxesPercentage.plus(ShoppingBasket.importTaxPercentage);
            }

            const taxesPerUnit = this.calculateTaxes(currentProduct.pricePerUnit, taxesPercentage);

            const unitPriceWithTaxes = currentProduct.pricePerUnit.plus(taxesPerUnit).toDecimalPlaces(2);
            const totalPriceWithTaxesForItem = unitPriceWithTaxes.times(currentProduct.quantity);
            total = total.plus(totalPriceWithTaxesForItem);

            const totalTaxesForItem = taxesPerUnit.times(currentProduct.quantity);
            salesTaxes = salesTaxes.plus(totalTaxesForItem);

            receiptProducts.push(this.createReceiptProduct(currentProduct, Utils.toCurrencyNumber(taxesPerUnit)));
        }

        return new Receipt(Utils.toCurrencyNumber(salesTaxes),
            Utils.toCurrencyNumber(total),
            receiptProducts);

    }

    printReceipt(): string {

        const receipt = this.checkout();
        let receiptString = '';

        for (let i = 0; i < receipt.products.length; i++) {

            let currentProduct = receipt.products[i];
            receiptString += currentProduct.quantity + ' '
                + currentProduct.name
                + ': '
                + currentProduct.getTotalPriceWithTaxes().toFixed(2)
                + '\n';

        }

        receiptString += 'Sales Taxes: ' + receipt.salesTaxes.toFixed(2) + '\n';
        receiptString += 'Total: ' + receipt.total.toFixed(2);

        return receiptString;

    }

    private isImported(product: Product) {
        return product.isImported;
    }

    private createReceiptProduct(product: Product, taxesPerUnit: number) {
        return new ReceiptProduct(product.name,
            product.quantity,
            product.pricePerUnit,
            product.category,
            taxesPerUnit);
    }

    private isTaxExempt(product: Product): boolean {
        return product.category === ProductCategory.Books ||
            product.category === ProductCategory.Food ||
            product.category === ProductCategory.MedicalProducts;
    }

    private calculateTaxes(pricePerUnit: Decimal, taxesPercentage: Decimal): Decimal {
        let taxesPerUnit = new Decimal(0);

        if (taxesPercentage.isZero()) {
            return taxesPerUnit;
        }

        let actualTaxesPerUnit = pricePerUnit.times(taxesPercentage).div(100);
        taxesPerUnit = Utils.roundUpToNearest5Cent(actualTaxesPerUnit);

        return taxesPerUnit;
    }

}