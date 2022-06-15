<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
							<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedSuppliers || !selectedSuppliers.length" />
						</div>
					</template>

					<!-- <template v-slot:end>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template> -->
				</Toolbar>

				<DataTable ref="dt" :value="suppliers" v-model:selection="selectedSuppliers" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} supplierss" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manage Suppliers</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column field="ID" header="ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">id</span>
							{{slotProps.data.id}}
						</template>
					</Column>
					<Column field="fname" header="First Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">fname</span>
							{{slotProps.data.fname}}
						</template>
					</Column>
					<Column field="lname" header="Last Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">lname</span>
							{{slotProps.data.lname}}
						</template>
					</Column>
					<Column field="contactNo" header="Contact No" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">contactNo</span>
							{{slotProps.data.contactNo}}
						</template>
					</Column>
					<Column field="companyName" header="Company Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">companyName</span>
							{{slotProps.data.companyName}}
						</template>
					</Column>
					<Column field="website" header="Company Website" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">website</span>
							{{slotProps.data.website}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editSupplier(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteSupplier(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="supplierDialog" :style="{width: '450px'}" header="Supplier Details" :modal="true" class="p-fluid">
					<!-- <img :src="'images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> --><div class="field">
						<label for="fname">First Name</label>
						<InputText id="fname" v-model.trim="supplier.fname" required="true" autofocus :class="{'p-invalid': submitted && !supplier.fname}" />
						<small class="p-invalid" v-if="submitted && !supplier.fname">First Name is required.</small>
					</div>
					<div class="field">
						<label for="lname">Last Name</label>
						<InputText id="lname" v-model.trim="supplier.lname" required="true" autofocus :class="{'p-invalid': submitted && !supplier.lname}" />
						<small class="p-invalid" v-if="submitted && !supplier.lname">Last Name is required.</small>
					</div>
					<div class="field">
						<label for="email">Email</label>
						<InputText id="email" v-model.trim="supplier.email" required="true" autofocus :class="{'p-invalid': submitted && !supplier.email}" />
						<small class="p-invalid" v-if="submitted && !supplier.email">Email is required.</small>
					</div>
					<div class="field">
						<label for="nic">NIC</label>
						<InputText id="nic" v-model.trim="supplier.nic" required="true" autofocus :class="{'p-invalid': submitted && !supplier.nic}" />
						<small class="p-invalid" v-if="submitted && !supplier.nic">NIC is required.</small>
					</div>
					<div class="field">
						<label for="contactNo">Contact No</label>
						<InputNumber id="contactNo" v-model.trim="supplier.contactNo" required="true" autofocus :useGrouping="false" :class="{'p-invalid': submitted && !supplier.contactNo}" />
						<small class="p-invalid" v-if="submitted && !supplier.contactNo">Contact No is required.</small>
					</div>
					<div class="field-checkbox mb-3">
						<Checkbox id="isActive" name="isActive" value="true" v-model="isActive" />
						<label for="isActive">Is Active</label>
					</div>
					<label class="font-bold">Company Details</label>
					<div class="field mt-3">
						<label for="companyName">Company Name</label>
						<InputText id="companyName" v-model.trim="supplier.companyName" required="true" autofocus :class="{'p-invalid': submitted && !supplier.companyName}" />
						<small class="p-invalid" v-if="submitted && !supplier.companyName">Company Name is required.</small>
					</div>
					<div class="field">
						<label for="yearEstablished">Year Established</label>
						<Calendar id="yearEstablished" :showIcon="true" :showButtonBar="true" v-model="supplier.yearEstablished" required="true" autofocus :class="{'p-invalid': submitted && !supplier.yearEstablished}"></Calendar>
						<small class="p-invalid" v-if="submitted && !supplier.yearEstablished">Year Established is required.</small>
					</div>
					<div class="field">
						<label for="website">Company Website</label>
						<InputText id="website" v-model.trim="supplier.website" autofocus />
					</div>
					<div class="field">
						<label for="description">Description</label>
						<Textarea id="description" v-model="supplier.description" rows="3" cols="20" />
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveSupplier" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteSupplierDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="supplier">Are you sure you want to delete <b>{{supplier.fname + ' ' + supplier.lname}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteSupplierDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSupplier" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteSuppliersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="supplier">Are you sure you want to delete the selected suppliers?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteSuppliersDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedSupplierss" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import SupplierService from '../service/SupplierService';

export default {
	name: 'Suppliers',
	data() {
		return {
			suppliers: null,
			supplierDialog: false,
			deleteSupplierDialog: false,
			deleteSuppliersDialog: false,
			isActive: [],
			supplier: {},
			selectedSuppliers: null,
			filters: {},
			submitted: false
		}
	},
	SupplierService: null,
	created() {
		this.SupplierService = new SupplierService();
		this.initFilters();
	},
	mounted() {
		this.SupplierService.getSuppliers().then(data => this.suppliers = data);
	},
	methods: {
		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'LKR'});
			return;
		},
		openNew() {
			this.supplier = {};
			this.submitted = false;
			this.supplierDialog = true;
		},
		hideDialog() {
			this.supplierDialog = false;
			this.submitted = false;
		},
		saveSupplier() {
			this.submitted = true;
			if (this.supplier.fname.trim() && this.supplier.lname.trim()) {
			if (this.supplier.id) {
				this.supplier.inventoryStatus = this.item.inventoryStatus.value ? this.item.inventoryStatus.value: this.item.inventoryStatus;
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
		editSupplier(supplier) {
			this.supplier = {...supplier};
			this.supplierDialog = true;
		},
		confirmDeleteSupplier(supplier) {
			this.supplier = supplier;
			this.deleteSupplierDialog = true;
		},
		deleteSupplier() {
			this.suppliers = this.suppliers.filter(val => val.id !== this.supplier.id);
			this.deleteSupplierDialog = false;
			this.supplier = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Supplier Deleted', life: 3000});
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.suppliers.length; i++) {
				if (this.suppliers[i].id === id) {
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
			this.deleteSuppliersDialog = true;
		},
		deleteSelectedSupplliers() {
			this.suppliers = this.suppliers.filter(val => !this.selectedSuppliers.includes(val));
			this.deleteSuppliersDialog = false;
			this.selectedSuppliers = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Suppliers Deleted', life: 3000});
		},
		initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        },
		isActiveStatus(status) {
			if(status) {
				return true;
			} else {
				return false;
			}
		}
	}
}
</script>

<style scoped lang="scss">
@import '../assets/demo/badges.scss';
</style>
