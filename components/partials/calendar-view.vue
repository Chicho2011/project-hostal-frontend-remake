<script lang="ts" setup>
import { useCustomFetch } from '~/composable/customFetch';
import type { Event } from '~/models/event';
import type { Service } from '~/models/service';
import { useServiceStore } from '~/store/service-store';
import EventForm from '../event-form.vue';

//stores
const serviceStore = useServiceStore()

//composables
const {data, loading, get: fetchMonthlyEvents} = useCustomFetch<Event[]>()
const {openEventForm} = useEventForm()

//refs
const service = ref<Service>()
const {services} = storeToRefs(serviceStore)
const handlePage = useMonthChange()
const currentInitDate = ref('')

//computeds
const attributes = computed(() => {
    
    const result = data.value?.filter(i => i.service_id == service.value?.id).map(i => ({
        highlight: color(i),
        dates: [
            [
                i.starts_at,
                i.only_nights_ends_at
            ]
        ],
        key: i.id
    }))

    if(!result || result?.length == 0)
        return []

    return result
})

//hooks
await fetchMonthlyEvents('my-events/monthly')

onMounted(async () => {
    if(services.value.length > 0)
        service.value = services.value[0]
})

//functions
function color(event: Event) {
    if(event.blocker) {
        return 'red'
    }

    return 'green'
}

function handleDayClick(e: any) {

    const options = {
        ok: () => {
            const route = currentInitDate.value ? `my-events/monthly?date=${currentInitDate.value}` : 'my-events/monthly'
            fetchMonthlyEvents(route)
        }
    }

    if(e.attributes.length == 0) {
        openEventForm({starts_at: e.year + '/' + e.month + '/' + e.day, service_id: service.value?.id}, options)
        return
    }

    if(e.attributes.length > 0 && e.attributes[0].key) {
        const key = e.attributes[0].key
        const event = data.value?.find(i => i.id == key)

        if(event) openEventForm(event, options)
    }
}

function useEventForm() {
    const $q = useQuasar()

    const openEventForm = (
        event?: Event | Pick<Event, 'starts_at' | 'service_id'> | Pick<Event, 'starts_at'>,
        options?: {ok?: () => void, cancel?: () => void}
    ) => {
        $q.dialog({
            component: EventForm,
            componentProps: {
                event: event
            },
        })
        .onOk(() => {
            if(options?.ok != undefined) {
                options.ok()
            } 
        })
        .onCancel(() => {
            if(options?.cancel != undefined) {
                options.cancel()
            }
        })
    }

    return {
        openEventForm
    }
}

function useMonthChange() {
    let timeout: number | null = null

    function handlePage(page: any[]) {

        if(timeout) clearTimeout(timeout)

        const p = page[0].id + '-01'

        currentInitDate.value = p

        timeout = setTimeout(() => {
            fetchMonthlyEvents(`my-events/monthly?date=${p}`)
        }, 300)
    }

    return handlePage
}


</script>    
<template>
    <div class="tw-w-full">
        <q-select
            v-model="service"
            :options="services"
            option-label="name"
            label="Habitación"
            class="tw-mb-10"
        ></q-select>
        <VCalendar 
            timezone="UTC" 
            :attributes="attributes" 
            expanded
            @dayclick="handleDayClick"
            @did-move="handlePage"
            ></VCalendar>
    </div>
</template>
<style>
</style>