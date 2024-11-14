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

    const post = (url: string, body?: Record<string, any>): Promise<any> => {
        loading.value = true

        return new Promise((resolve, reject) => {
            client(url, {
                baseURL: baseUrl,
                method: 'POST',
                body: body,
                headers: headers,
                onResponseError: (error: any) => {
                    reject(error)
                }
            })
            .then((response: any) => {
                resolve(response)
            })
            .finally(() => {
                loading.value = false
            })
        })
    }

    const put = (url: string, body?: Record<string, any>): Promise<any> => {
        loading.value = true

        return new Promise((resolve, reject) => {
            client(url, {
                baseURL: baseUrl,
                method: 'PUT',
                body: body,
                headers: headers,
                onResponseError: (error: any) => {
                    reject(error)
                }
            })
            .then((response: any) => {
                resolve(response)
            })
            .finally(() => {
                loading.value = false
            })
        })
    }

    const destroy = (url: string): Promise<any> => {
        loading.value = true

        return new Promise((resolve, reject) => {
            client(url, {
                baseURL: baseUrl,
                method: 'DELETE',
                headers: headers,
                onResponseError: (error: any) => {
                    reject(error)
                }
            })
            .then((response: any) => {
                resolve(response)
            })
            .finally(() => {
                loading.value = false
            })
        })
    }

    return {
        data,
        loading,
        get,
        post,
        put,
        destroy
    }
}