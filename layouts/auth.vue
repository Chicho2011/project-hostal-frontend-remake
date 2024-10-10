<script lang="ts" setup></script>
<template>
    <div class="tw-w-full tw-h-[100vh] tw-flex tw-bg-pink-100">
        <div class="tw-w-96 tw-h-fit tw-mx-auto tw-my-auto tw-justify-center tw-text-center tw-gap-4 tw-flex tw-flex-col">
            <span class="tw-text-xl tw-text-purple-950 tw-tracking-widest">
                <slot name="title"></slot>
            </span>
            <slot />
        </div>
    </div>
</template>