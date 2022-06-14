<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
							<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedItems || !selectedItems.length" />
						</div>
					</template>

					<!-- <template v-slot:end>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template> -->
				</Toolbar>

				<DataTable ref="dt" :value="items" v-model:selection="selectedItems" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manage Items</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="code" header="Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.code}}
						</template>
					</Column>
					<Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.name}}
						</template>
					</Column>
					<!-- <Column header="Image" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Image</span>
							<img :src="'images/product/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
						</template>
					</Column> -->
					<Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">Price</span>
							{{formatCurrency(slotProps.data.price)}}
						</template>
					</Column>
					<Column field="category" header="Category" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Category</span>
							{{slotProps.data.category}}
						</template>
					</Column>
					<!-- <Column field="rating" header="Reviews" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Rating</span>
							<Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
						</template>
					</Column>
					<Column field="inventoryStatus" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Status</span>
							<span :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{slotProps.data.inventoryStatus}}</span>
						</template>
					</Column> -->
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editItem(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteItem(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="itemDialog" :style="{width: '450px'}" header="Item Details" :modal="true" class="p-fluid">
					<!-- <img :src="'images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
					<div class="field">
						<label for="name">Item Name</label>
						<InputText id="name" v-model.trim="item.name" required="true" autofocus :class="{'p-invalid': submitted && !item.name}" />
						<small class="p-invalid" v-if="submitted && !item.name">Name is required.</small>
					</div>
					<div class="field">
						<label for="description">Description</label>
						<Textarea id="description" v-model="item.description" required="true" rows="3" cols="20" />
					</div>
					<div class="field-checkbox mb-3">
						<Checkbox id="isActive" name="option" value="1" v-model="isActive" />
						<label for="isActive">Is Active</label>
					</div>
					<div class="field-checkbox mb-3">
						<Checkbox id="isReturnable" name="option" value="1" v-model="isReturnable" />
						<label for="isReturnable">Is Returnable</label>
					</div>
					<!-- <div class="field">
						<label for="inventoryStatus" class="mb-3">Inventory Status</label>
						<Dropdown id="inventoryStatus" v-model="item.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
							<template #value="slotProps">
								<div v-if="slotProps.value && slotProps.value.value">
									<span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
								</div>
								<div v-else-if="slotProps.value && !slotProps.value.value">
									<span :class="'product-badge status-' +slotProps.value.toLowerCase()">{{slotProps.value}}</span>
								</div>
								<span v-else>
									{{slotProps.placeholder}}
								</span>
							</template>
						</Dropdown>
					</div> -->

					<div class="field">
						<label class="mb-3">Category</label>
						<div class="formgrid grid">
							<div class="field-radiobutton col-6">
								<RadioButton id="category1" name="category" value="Accessories" v-model="item.category" />
								<label for="category1">Accessories</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="category2" name="category" value="Clothing" v-model="item.category" />
								<label for="category2">Clothing</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="category3" name="category" value="Electronics" v-model="item.category" />
								<label for="category3">Electronics</label>
							</div>
							<div class="field-radiobutton col-6">
								<RadioButton id="category4" name="category" value="Fitness" v-model="item.category" />
								<label for="category4">Fitness</label>
							</div>
						</div>
					</div>

					<div class="formgrid grid">
						<div class="field col">
							<label for="price">Price</label>
							<InputNumber id="price" v-model="item.price" mode="currency" currency="LKR" locale="en-US" />
						</div>
						<!-- <div class="field col">
							<label for="quantity">Quantity</label>
							<InputNumber id="quantity" v-model="item.quantity" integeronly />
						</div> -->
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveItem" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteItemDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="item">Are you sure you want to delete <b>{{item.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteItemDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteItem" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteItemsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="item">Are you sure you want to delete the selected items?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteItemsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedItems" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import ProductService from '../service/ProductService'; //this need to be ItemService

export default {
	name: 'Items',
	data() {
		return {
			test: [],
			items: null,
			itemDialog: false,
			deleteItemDialog: false,
			deleteItemsDialog: false,
			isActive: [],
			isReturnable: [],
			item: {},
			selectedItems: null,
			filters: {},
			submitted: false,
			// statuses: [
			// 	{label: 'INSTOCK', value: 'instock'},
			// 	{label: 'LOWSTOCK', value: 'lowstock'},
			// 	{label: 'OUTOFSTOCK', value: 'outofstock'}
			// ]
		}
	},
	productService: null,
	created() {
		this.productService = new ProductService();
		this.initFilters();
	},
	mounted() {
		this.productService.getProducts().then(data => this.items = data);
	},
	methods: {
		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'LKR'});
			return;
		},
		openNew() {
			this.item = {};
			this.isActive = [];
			this.isReturnable = [];
			this.submitted = false;
			this.itemDialog = true;
		},
		hideDialog() {
			this.itemDialog = false;
			this.submitted = false;
		},
		saveItem() {
			this.submitted = true;
			if (this.item.name.trim()) {
			if (this.item.id) {
				this.item.inventoryStatus = this.item.inventoryStatus.value ? this.item.inventoryStatus.value: this.item.inventoryStatus;
				this.items[this.findIndexById(this.item.id)] = this.item;
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Item Updated', life: 3000});
				}
				else {
					this.item.id = this.createId();
					this.item.code = this.createId();
					this.item.image = 'product-placeholder.svg';
					this.item.inventoryStatus = this.item.inventoryStatus ? this.item.inventoryStatus.value : 'INSTOCK';
					this.items.push(this.item);
					this.$toast.add({severity:'success', summary: 'Successful', detail: 'Item Created', life: 3000});
				}
				this.itemDialog = false;
				this.item = {};
			}
		},
		editItem(item) {
			this.item = {...item};
			this.itemDialog = true;
		},
		confirmDeleteItem(item) {
			this.item = item;
			this.deleteItemDialog = true;
		},
		deleteItem() {
			this.items = this.items.filter(val => val.id !== this.item.id);
			this.deleteItemDialog = false;
			this.item = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Item Deleted', life: 3000});
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		createId() {
			let id = '';
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for ( var i = 0; i < 5; i++ ) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteItemsDialog = true;
		},
		deleteSelectedItems() {
			this.items = this.items.filter(val => !this.selectedItems.includes(val));
			this.deleteItemsDialog = false;
			this.selectedItems = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Items Deleted', life: 3000});
		},
		initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        }
	}
}
</script>

<style scoped lang="scss">
@import '../assets/demo/badges.scss';
</style>
