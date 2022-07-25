// export default class SupplierService {

//     getProductsSmall() {
// 		return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
// 	}

// 	getSuppliers() {
// 		return fetch('data/supplier.json').then(res => res.json()).then(d => {
// 			return d
// 		});
//     }

//     getProductsWithOrdersSmall() {
// 		return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
// 	}
	
// }
import http from '../http-common';
export default class SupplierService {

	getAll() {
		return http.get("/suppliers");
	}

	getById(id) {
		return http.get(`/suppliers/${id}`);
	}

	create(data) {
		return http.post("/suppliers", data);
	}

	update(id,data) {
		return http.put(`/suppliers/${id}`, data);
	}

	delete(id) {
		return http.delete(`/suppliers/${id}`);
	}
}

//export default new SupplierService();