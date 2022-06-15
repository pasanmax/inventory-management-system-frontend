export default class SupplierService {

    getProductsSmall() {
		return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
	}

	getSuppliers() {
		return fetch('data/supplier.json').then(res => res.json()).then(d => {
			return d
		});
    }

    getProductsWithOrdersSmall() {
		return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
	}
	
}