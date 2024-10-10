<script lang="ts" setup>
import { useCustomFetch } from '~/composable/customFetch';
import type { Service } from '~/models/service';

definePageMeta({
    middleware: ['auth']
})

//composables
const user = useSanctumUser()
const {data: services, loading, get: fetchServices} = useCustomFetch<Service[]>()

//refs
const tab = ref('dashboard')

//computed
const rooms = computed(() => {
    return services.value?.filter(i => i.type == 'LODGING')
})

const others = computed(() => {
    return services.value?.filter(i => i.type == 'OTHERS')
})

//hooks
onMounted(async () => {
    await fetchServices('services')
})

//functions

</script>
<template>

    <q-tabs
        v-model="tab"
        dense
        class="tw-w-full tw-mb-10"
    >
        <q-tab name="dashboard" label="Dashboard"></q-tab>
        <q-tab name="calendar" label="Calendario"></q-tab>
    </q-tabs>

    <q-tab-panels
        v-model="tab"
        animated class="tw-bg-transparent"
    >
        <q-tab-panel name="dashboard">
            <div class="tw-w-full">
                <h1 class="tw-text-2xl tw-font-bold">
                    Habitaciones
                </h1>
                <q-separator size="2px" color="gray"></q-separator>
            </div>
            <div class="tw-w-full tw-flex tw-flex-wrap tw-gap-4 tw-py-2">
                <template v-if="!loading">
                    <div class="tw-self-center" v-if="rooms?.length == 0">No tiene habitaciones</div>
                    <template v-else>
                        <div class="tw-w-[45%] tw-cursor-pointer tw-rounded tw-p-2 tw-border tw-border-gray-400" :class="{'tw-bg-green-200': room.today_vacancy, 'tw-bg-red-200': !room.today_vacancy}" v-for="room in rooms" :key="room.id">
                            <div class="tw-flex tw-gap-2">
                                <span class="tw-text-sm tw-font-bold">
                                    {{ room.name }}
                                </span>
                                <i class="tw-rounded-full tw-w-2 tw-h-2 tw-self-center" :style="{backgroundColor: room.color}"></i>
                            </div>
                            <div class="tw-text-right">
                                <span class="tw-text-[0.6rem] tw-self-center"><span v-if="room.today_vacancy">Libre</span><span v-else>Ocupado</span></span>
                            </div>
                        </div>
                    </template>
                </template>
                <div class="tw-self-center tw-w-full tw-text-center" v-else>
                    <span>Cargando...</span>
                </div>
            </div>
            <div class="tw-w-full tw-mt-20">
                <h1 class="tw-text-2xl tw-font-bold">
                    Próximos
                </h1>
                <q-separator size="2px" color="gray"></q-separator>
            </div>
            <div class="tw-w-full tw-flex tw-flex-wrap tw-gap-4 tw-py-2">
                <div class="tw-self-center" v-if="true">No hay ningún evento próximo</div>
            </div>
        </q-tab-panel>
        <q-tab-panel name="calendar">
            
        </q-tab-panel>
    </q-tab-panels>


</template>