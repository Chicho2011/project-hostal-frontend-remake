<script setup lang="ts">
import Navbar from '~/components/navbar.vue';
</script>

<template>
    <div>
        <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders tw-bg-pink-100 tw-w-full tw-min-h-screen">
            <navbar></navbar>
            <q-page-container>
                <q-page class="tw-max-w-[1280px] tw-mx-auto tw-bg-pink-50 tw-shadow tw-p-5">
                    <slot />
                </q-page>
            </q-page-container>
        </q-layout>
    </div>
</template>