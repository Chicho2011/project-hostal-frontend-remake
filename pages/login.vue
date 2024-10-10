<script lang="ts" setup>
import { useQuasar } from 'quasar';

const $q = useQuasar()

definePageMeta({
    middleware: ['sanctum:guest']
})

const credentials = ref<{
    email: string,
    password: string
}>({
    email: '',
    password: ''
})

const errors = ref<{
    email: string | string[] | undefined,
    password: string | string[] | undefined
}>({
    email: '',
    password: ''
})

const clearErrors = (...args: string[]) => {
    if(args.length == 0) {
        args = Object.keys(errors.value)
    }

    args.forEach(i => {
        errors.value[i] = ''
    })
}

const loading = ref<Boolean>(false)

const loginUser = async () => {
    clearErrors()
    login(credentials.value)
        // .then()
        .catch((error) => {
            if(error.status == 422) {
                const incomingErrors = error.data.errors
                Object.keys(incomingErrors).forEach(i => {
                    errors.value[i] = typeof incomingErrors[i] == 'string' ? incomingErrors[i] : incomingErrors[i].join('\n')
                })
            } else if([401, 403].includes(error.status)) {
                $q.notify({
                    type: 'negative',
                    message: error.data.message
                })
            }
        })
        .finally(() => loading.value = false)
}

const {login} = useSanctumAuth()

</script>
<template>
    <div class="tw-w-full tw-h-[100vh] tw-flex tw-bg-pink-100">
        <div class="tw-w-96 tw-h-fit tw-mx-auto tw-my-auto tw-justify-center tw-text-center tw-gap-4 tw-flex tw-flex-col">
            <span class="tw-text-xl tw-text-purple-950 tw-tracking-widest">LOGIN</span>
            <q-card class="tw-p-5">
                <q-card-section class="tw-flex tw-flex-col tw-gap-4">
                    <q-input 
                        type="email"
                        v-model="credentials.email"
                        :error="!!errors?.email"
                        :error-message="errors?.email"
                        label="Email"
                        outlined
                        square
                        ></q-input>
                    <q-input 
                        type="password"
                        v-model="credentials.password"
                        label="Password"
                        outlined
                        square
                        :error="!!errors?.password"
                        :error-message="errors?.password"
                        ></q-input>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn @click="loginUser()" :loading="loading" padding="4px 16px" class="tw-bg-red-500 tw-text-blue-50" rounded label="Entrar"></q-btn>
                </q-card-actions>
            </q-card>
        </div>
    </div>
</template>