import { useCustomFetch } from "~/composable/customFetch";
import type { Service } from "~/models/service";

export const useServiceStore = defineStore('useServiceStore', {
    state: (): {services: Service[], loading: boolean} => ({
        services: [],
        loading: false
    }),
    actions: {
        async fetchServices() {
            const {data, get} = useCustomFetch<Service[]>()

            this.loading = true

            return get('services')
                .then(() => this.services = data.value as Service[])
                .finally(() => this.loading = false)
        }
    }
})