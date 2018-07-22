import * as chai from 'chai';
import { ShoppingBasket } from '../src/ShoppingBasket';
import { Product, ProductCategory } from '../src/Product';
import { Receipt } from '../src/Receipt';
import { Decimal } from 'decimal.js';


describe("ShoppingBasket", () => {
    describe("getReceipt", () => {
        it("should apply no taxes on books", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("book", 1, new Decimal(12.49), ProductCategory.Books));
            let receipt = shoppingBasket.checkout();

            chai.assert.equal(receipt.salesTaxes, 0);
            chai.assert.equal(receipt.total, 12.49);
            chai.assert.equal(receipt.products.length, 1);

        });

        it("should apply no taxes on food", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("chocolate bar", 1, new Decimal(0.85), ProductCategory.Food));
            let receipt = shoppingBasket.checkout();

            chai.assert.equal(receipt.salesTaxes, 0);
            chai.assert.equal(receipt.total, 0.85);
            chai.assert.equal(receipt.products.length, 1);

        });

        it("should apply no taxes on medical products", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("packet of headache pills", 1, new Decimal(9.75), ProductCategory.MedicalProducts));
            let receipt = shoppingBasket.checkout();

            chai.assert.equal(receipt.salesTaxes, 0);
            chai.assert.equal(receipt.total, 9.75);
            chai.assert.equal(receipt.products.length, 1);

        });

        it("should apply base tax on non-exempt products", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("music CD", 1, new Decimal(14.99), ProductCategory.Other));
            let receipt = shoppingBasket.checkout();

            chai.assert.equal(receipt.salesTaxes, 1.50);
            chai.assert.equal(receipt.total, 16.49);
            chai.assert.equal(receipt.products.length, 1);

        });

        it("should apply import tax on base tax exempt products", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("imported box of chocolates", 1, new Decimal(10.00), ProductCategory.Food, true));
            let receipt = shoppingBasket.checkout();

            chai.assert.equal(receipt.salesTaxes, 0.50);
            chai.assert.equal(receipt.total, 10.50);
            chai.assert.equal(receipt.products.length, 1);

        });

        it("should apply base and import taxes on non-exempt products", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("imported bottle of perfume", 1, new Decimal(47.50), ProductCategory.Other, true));
            let receipt = shoppingBasket.checkout();

            chai.assert.equal(receipt.salesTaxes, 7.15);
            chai.assert.equal(receipt.total, 54.65);
            chai.assert.equal(receipt.products.length, 1);

        });

        it("should sum up prices and taxes for multiple instances", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("music CD", 2, new Decimal(14.99), ProductCategory.Other));
            shoppingBasket.addProduct(new Product("imported box of chocolates", 3, new Decimal(10.00), ProductCategory.Food, true));
            shoppingBasket.addProduct(new Product("imported bottle of perfume", 4, new Decimal(47.50), ProductCategory.Other, true));
            shoppingBasket.addProduct(new Product("chocolate bar", 2, new Decimal(0.85), ProductCategory.Food));
            let receipt = shoppingBasket.checkout();

            chai.assert.equal(receipt.salesTaxes, 33.1);
            chai.assert.equal(receipt.total, 284.78);
            chai.assert.equal(receipt.products.length, 4);

        });

        it("should resolve case 1", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("book", 1, new Decimal(12.49), ProductCategory.Books));
            shoppingBasket.addProduct(new Product("music CD", 1, new Decimal(14.99), ProductCategory.Other));
            shoppingBasket.addProduct(new Product("chocolate bar", 1, new Decimal(0.85), ProductCategory.Food));
            let receiptString = shoppingBasket.printReceipt();

            chai.assert.equal(receiptString, '1 book: 12.49\n'
                + '1 music CD: 16.49\n'
                + '1 chocolate bar: 0.85\n'
                + 'Sales Taxes: 1.50\n'
                + 'Total: 29.83');

        });

        it("should resolve case 2", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("imported box of chocolates", 1, new Decimal(10.00), ProductCategory.Food, true));
            shoppingBasket.addProduct(new Product("imported bottle of perfume", 1, new Decimal(47.50), ProductCategory.Other, true));
            let receipt = shoppingBasket.printReceipt();

            chai.assert.equal(receipt, '1 imported box of chocolates: 10.50\n'
                + '1 imported bottle of perfume: 54.65\n'
                + 'Sales Taxes: 7.65\n'
                + 'Total: 65.15');

        });

        it("should resolve case 3", () => {

            let shoppingBasket = new ShoppingBasket();
            shoppingBasket.addProduct(new Product("imported bottle of perfume", 1, new Decimal(27.99), ProductCategory.Other, true));
            shoppingBasket.addProduct(new Product("bottle of perfume", 1, new Decimal(18.99), ProductCategory.Other));
            shoppingBasket.addProduct(new Product("packet of headache pills", 1, new Decimal(9.75), ProductCategory.MedicalProducts));
            shoppingBasket.addProduct(new Product("box of imported chocolates", 1, new Decimal(11.25), ProductCategory.Food, true));
            let receipt = shoppingBasket.printReceipt();

            chai.assert.equal(receipt, '1 imported bottle of perfume: 32.19\n'
                + '1 bottle of perfume: 20.89\n'
                + '1 packet of headache pills: 9.75\n'
                + '1 box of imported chocolates: 11.85\n'
                + 'Sales Taxes: 6.70\n'
                + 'Total: 74.68');

        });
    });
});