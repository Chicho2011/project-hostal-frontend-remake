<script lang="ts" setup>
import CalendarView from '~/components/partials/calendar-view.vue';
import { useCustomFetch } from '~/composable/customFetch';
import type { Service } from '~/models/service';
import { useServiceStore } from '~/store/service-store';

definePageMeta({
    middleware: ['auth']
})
//stores
const serviceStore = useServiceStore()

//composables
const user = useSanctumUser()
const {data: nextEvents, fetch: fetchNextEvents} = useNextEvents()

//refs
const {services} = storeToRefs(serviceStore)
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
    await serviceStore.fetchServices()
})


//functions
function useNextEvents() {
    const {get} = useCustomFetch()
    const data = ref([])

    function fetch() {
        get('/my-events/next').then((response: any) => data.value = response.data)
    }

    return {data, fetch}
}

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
        <q-tab-panel name="dashboard" @vue:mounted="fetchNextEvents">
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
                    Próximas entradas del mes
                </h1>
                <q-separator size="2px" color="gray"></q-separator>
            </div>
            <div class="tw-w-full tw-flex tw-flex-wrap tw-gap-4 tw-py-2">
                <div class="tw-self-center" v-if="nextEvents.length == 0">No hay ningún evento próximo</div>
                <div class="tw-w-full tw-flex tw-flex-col tw-gap-4 tw-mt-4" v-else>
                    <div v-for="(value, key, i) in nextEvents">
                        <span class="tw-font-bold tw-text-xl">{{ key }}</span>
                        <div class="tw-pl-5 tw-flex tw-flex-col tw-gap-4 tw-mt-4">
                            <q-card v-for="(event, j) in value">
                                <q-card-section>
                                    <div class="tw-flex tw-flex-col">
                                        <span :style="{color: event.service_color}" class="tw-mb-2 tw-font-bold">
                                            {{ event.service_name }}
                                        </span>
                                        <span class="tw-text-lg tw-font-bold">{{ event.name }}</span>
                                        <span class="tw-text-xs">salida: <span class="tw-font-bold">{{ event.ends_at_formatted }}</span></span>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </div>
            </div>
        </q-tab-panel>
        <q-tab-panel name="calendar">
            <CalendarView></CalendarView>
        </q-tab-panel>
    </q-tab-panels>


</template>