<template>
<q-input class="fit" v-model="formattedDate" :mask="dateMask" id="date-input">
    <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date ref="qdate" :options="options" v-model="formattedDate" :mask="dateFormat" today-btn>
                    <div class="items-center justify-end row">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                </q-date>
            </q-popup-proxy>
        </q-icon>
    </template>
</q-input>
</template>

<script setup lang="ts">
import { date } from "quasar";

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    min: {
        type: String,
        required: false
    }
});
const emit = defineEmits(["update:modelValue"]);

const qdate = ref(null)

//Get client locale for date formatting
const clientLocale = navigator.language;
const dateFormat = 'DD/MM/YYYY';

//Make a mask for the q-input in the form of ##-##-#### or whatever locale.
const dateMask = dateFormat.replace(/[DMY]/g, "#");

//Format the date for display in the q-input.
const formattedDate = ref(
    date.formatDate(new Date(props.modelValue), dateFormat)
);

function options(d: String) {
    if(props.min) {
        return d > date.formatDate(new Date(props.min), 'YYYY/MM/DD')
    }

    return true
}

function changeView() {
    if(props.min && qdate.value) {
        const minDate = new Date(props.min)
        qdate.value.setCalendarTo(minDate.getUTCFullYear().toString(), minDate.toLocaleDateString('default', {month: '2-digit'}))
    }
}


watch(qdate, () => {
    changeView()
})

//Watchers to emit the updated date when changed.
watch(formattedDate, (newDateValue) => {
    //construct new date ISO string from the formattedDate.
    const newDate = date.extractDate(newDateValue, dateFormat);
    //convert to iso string
    const updatedDate = newDate.toISOString();
    emit("update:modelValue", updatedDate);
});
</script>