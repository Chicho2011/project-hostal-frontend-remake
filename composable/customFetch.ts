export function useCustomFetch<T>() {

    const loading = ref(false)
    const data = ref<T>()
    const runtimeConfig = useRuntimeConfig()

    const baseUrl = runtimeConfig.public.API_ENDPOINT + '/api/'

    const headers = {
        'Accept': 'application/json'
    }

    const client = useSanctumClient()

    const get = (url: string, params?: Record<string, any>): Promise<any> => {
        loading.value = true
        return new Promise((resolve, reject) => {
            client(url, {
                baseURL: baseUrl,
                method: 'GET',
                body: params,
                headers: headers
            })
            .then((response: any) => {
                data.value = response.data
                resolve(response)
            })
            .catch((errorResponse: any) => {
                reject(errorResponse)
            })
            .finally(() => {
                loading.value = false
            })
        })
    }

    return {
        data,
        loading,
        get
    }
}