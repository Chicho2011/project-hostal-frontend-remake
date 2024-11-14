<script lang="ts" setup>
import { useCustomForm } from '~/composable/custom-form';
import { useCustomFetch } from '~/composable/customFetch';
import type { Event } from '~/models/event';
import { useServiceStore } from '~/store/service-store';

const BLOCK = 'Bloqueo'

//composables
const $q = useQuasar()
const {destroy, loading: deleting} = useEventDelete()

//stores
const serviceStore = useServiceStore()

//props
const props = defineProps<{
    event: Event | Pick<Event, 'starts_at' | 'service_id'> | Pick<Event, 'starts_at'>
}>()

//refs
const form = useCustomForm<Event>({
    id: undefined,
    starts_at: '',
    ends_at: '',
    name: '',
    note: '',
    status: '',
    service_id: null,
    user_id: null,
    blocker: false
})
const {services} = storeToRefs(serviceStore)

//emits
defineEmits([...useDialogPluginComponent.emits])
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

//computeds

//hooks
onMounted(() => {
    if(isEvent(props.event)) {
        form.fill(props.event)
        form.blocker = !!props.event.blocker
    }
    else {
        form.starts_at = props.event.starts_at

        if('service_id' in props.event)
            form.service_id = props.event.service_id
    }
})

//functions
function buildTitle() {
    if(!props.event || !isEvent(props.event))
        return 'Crear reservación'

    return 'Editar reservación'
}

function isEvent(o: any): o is Event {
    return 'status' in o
}

function handleSave() {
    if(form.id == undefined) {
        form
            .post('events')
            .then(() => {
                onDialogOK()
            })

        return
    }

    form
        .put(`events/${form.id}`)
        .then(() => {
            onDialogOK()
        })
}

function handleCancel() {
    onDialogCancel()
}

function handleDelete() {
    if(form.id)
        $q.dialog({
            message: '¿Deseas borrar esta reservación?',
            cancel: 'No',
            color: 'black',
            ok: {
                label: 'Si',
                color: 'red',
            },
            title: 'Borrar',
        })
        .onOk(() => {
            destroy(`events/${form.id}`)
            .then((response: any) => {
                $q.notify({
                    type: 'positive',
                    message: response.message,
                })

                onDialogOK()
            })
        })
}

function handleBlocking(val: boolean) {
    if(val) {
        form.name = BLOCK
        return
    }

    form.name = ''
}

function useEventDelete() {
    const {destroy, loading} = useCustomFetch()

    return {destroy, loading}
}

</script>
<template>
    <q-dialog
        ref="dialogRef"
    >
        <q-card style="width: 100%;">
            <q-card-section>
                <div class="tw-flex tw-justify-between">
                    <h1 class="tw-text-xl tw-font-bold">{{ buildTitle() }}</h1>
                    <q-toggle
                        v-model="form.blocker"
                        @update:model-value="handleBlocking"
                        color="red"
                        label="Bloquear"
                    />
                </div>
            </q-card-section>
            <q-card-section class="tw-grid tw-grid-cols-1 tw-gap-6">
                <q-select
                    readonly
                    hide-dropdown-icon
                    v-model="form.service_id"
                    :options="services"
                    option-label="name"
                    option-value="id"
                    map-options
                    label="Habitación"
                    outlined
                ></q-select>
                <q-input :disable="form.blocker" hide-bottom-space :error="!!form.errors.name" :error-message="form.errors.name" v-model="form.name" label="Nombre" outlined></q-input>
                <custom-date-picker hide-bottom-space :error="!!form.errors.starts_at" :error-message="form.errors.starts_at" inline v-model="form.starts_at" label="Desde" outlined></custom-date-picker>
                <custom-date-picker :min="form.starts_at" hide-bottom-space :error="!!form.errors.ends_at" :error-message="form.errors.ends_at" inline v-model="form.ends_at" label="Hasta" outlined></custom-date-picker>
                <q-input hide-bottom-space :error="!!form.errors.note" :error-message="form.errors.note" v-model="form.note" label="Notas" outlined type="textarea"></q-input>
            </q-card-section>
            <q-card-actions class="tw-bottom-0 tw-w-full">
                <div class="tw-flex tw-flex-between tw-w-full">
                    <div class="tw-w-full">
                        <q-btn v-if="form.id" flat @click="handleDelete" color="red" label="Borrar"></q-btn>
                    </div>
                    <div class="tw-flex tw-gap-2 tw-w-full">
                        <q-btn flat @click="handleCancel" label="Cerrar"></q-btn>
                        <q-btn color="blue" @click="handleSave" label="Guardar"></q-btn>
                    </div>
                </div>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>