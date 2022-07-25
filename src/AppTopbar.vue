<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
			<span>SAKAI</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li>
				<button class="p-link layout-topbar-button">
					<i class="pi pi-user"></i>
					<span>Profile</span>
				</button>
			</li>
			<li>
				<button @click="confirmLogout" class="p-link layout-topbar-button">
					<i class="pi pi-power-off"></i>
					<span>Logout</span>
				</button>
			</li>
		</ul>
		<Dialog v-model:visible="logoutDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
			<div class="flex align-items-center justify-content-center">
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
				<span>Are you sure you want to logout?</span>
			</div>
			<template #footer>
				<Button label="No" icon="pi pi-times" class="p-button-text" @click="logoutDialog = false"/>
				<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="logout" />
			</template>
		</Dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			logoutDialog: false
		}
	},
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		onTopbarMenuToggle(event) {
            this.$emit('topbar-menu-toggle', event);
        },
		topbarImage() {
			return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
		},
		confirmLogout() {
			this.logoutDialog = true;
		},
		logout() {
			this.$store.dispatch("LOGOUT").then(() => {
				this.$router.push('/');
			})
		}
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>