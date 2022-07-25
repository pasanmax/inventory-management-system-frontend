<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
               <!-- <img :src="'layout/images/logo-' + logoColor + '.svg'" alt="Sakai logo" class="mb-5" style="width:81px; height:60px;">
                    -->
            </div>
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <img src="" alt="" height="50" class="mb-3">
                        <div class="text-900 text-3xl font-medium mb-3">Welcome !!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>
                
                    
                    <div class="w-full md:w-10 mx-auto">
                        <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                        <InputText id="username" v-model="state.authRequest.userName" type="text" class="w-full mb-3" placeholder="Username" style="padding:1rem;" />
                        <span v-if="v$.authRequest.userName.$error" style="color:red">
                            {{ v$.authRequest.userName.$errors[0].$message }}
                        </span>
                
                        <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password" v-model="state.authRequest.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem" :feedback="false"></Password>
                        <span v-if="v$.authRequest.password.$error" style="color:red">
                            {{ v$.authRequest.password.$errors[0].$message }}
                        </span>
                
                        <div class="flex align-items-center justify-content-between mb-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                                <label for="rememberme">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <div v-if="message" class="mb-5" style="color:red">
                            {{ message }}
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="login"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import AuthService from '../service/AuthService';
import useValidate from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { reactive, computed } from 'vue';

export default {
    setup() {
        const state = reactive({
            authRequest: {
                userName: '',
                password: '',
            },
        });

        const rules = computed(() => {
            return {
                authRequest: {
                    userName: { required: helpers.withMessage('Username is required', required) },
                    password: { required: helpers.withMessage('Password is required', required), minLength: minLength(8) },
                },
            }
        });

        const v$ = useValidate(rules, state);

        return {
            state,
            v$,
        }
    },
    data() {
        return {
            checked: false,
            message: ""
        }
    },
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        }
    },
    methods: {
        async login() {
            this.v$.$validate()
            if(!this.v$.$error) {
                // await AuthService.login(this.state.authRequest).then(response => {
                //     //console.log(res.data);
                //     localStorage.setItem('user', response.data.token);
                //     this.$router.push('/dashboard');
                // }).catch(e => {
                //     console.log(e);
                //     this.message =
                //         (e.response &&
                //         e.response.data &&
                //         e.response.data.message) ||
                //         e.message ||
                //         e.toString();
                // });
                this.$store.dispatch("LOGIN", this.state.authRequest)
                .then(() => this.$router.push('/dashboard'))
                .catch(e => {
                    console.log(e);
                    this.message =
                        (e.response &&
                        e.response.data &&
                        e.response.data.message) ||
                        e.message ||
                        e.toString();
                });
            }
        },
    }
}
</script>

<style scoped>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}
</style>