import { ReceiptProduct } from "./ReceiptProduct";

export class Receipt {

    salesTaxes: number;
    total: number;
    products: ReceiptProduct[];

    constructor(salesTaxes: number, total: number, products: ReceiptProduct[]) {
        this.salesTaxes = salesTaxes;
        this.total = total;
        this.products = products;
    }

}