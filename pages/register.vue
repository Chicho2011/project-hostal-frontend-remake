<script lang="ts" setup>
import { useForm } from '~/composable/form';

definePageMeta({
    layout: 'auth'
})

const {data, validationErrors, loading, post, clearErrors} = useForm({
    name: null,
    email: null,
    password: null,
    password_confirmation: null
})

const register = () => {
    clearErrors()
    post('/api/register')
        .then(() => {
            const {login} = useSanctumAuth()
            login({email: data.value.email, password: data.value.password})
        })
}

</script>
<template>
    <NuxtLayout>
        <template #title>
            Register
        </template>
        <q-card class="tw-p-5">
            <q-card-section class="tw-flex tw-flex-col tw-gap-4">
                <q-input 
                    type="text"
                    v-model="data.name"
                    :error="!!validationErrors?.name"
                    :error-message="validationErrors?.name"
                    label="Name"
                    outlined
                    square
                    ></q-input>
                <q-input 
                    type="email"
                    v-model="data.email"
                    :error="!!validationErrors?.email"
                    :error-message="validationErrors?.email"
                    label="Email"
                    outlined
                    square
                    ></q-input>
                <q-input 
                    type="password"
                    v-model="data.password"
                    :error="!!validationErrors?.password"
                    :error-message="validationErrors?.password"
                    label="Password"
                    outlined
                    square
                    ></q-input>
                <q-input 
                    type="password"
                    v-model="data.password_confirmation"
                    :error="!!validationErrors?.password_confirmation"
                    :error-message="validationErrors?.password_confirmation"
                    label="Password confirmation"
                    outlined
                    square
                    ></q-input>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn @click="register" :loading="loading" padding="4px 16px" class="tw-bg-red-500 tw-text-blue-50" rounded label="Entrar"></q-btn>
            </q-card-actions>
        </q-card>
    </NuxtLayout>
</template>