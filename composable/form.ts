interface RequestOptions {
    onSuccess?: (data: any) => {},
    onError?: (response: any) => {},
    onFinal?: () => {},
}

export function useForm(fields: Object) {
    const data = ref(fields)
    const loading = ref(false)
    const validationErrors = ref({})
    const runtimeConfig = useRuntimeConfig()

    const clearErrors = (...args: string[]) => {
        if(args.length == 0) {
            args = Object.keys(validationErrors.value)
        }

        args.forEach(i => {
            validationErrors.value[i] = ''
        })
    }

    async function post(url: string, options?: RequestOptions) {
        loading.value = true
        await $fetch(runtimeConfig.public.API_ENDPOINT+url, {
                    method: 'post',
                    body: data.value
                })
                .then((d) => {
                    if(options && options.onSuccess) {
                        options.onSuccess(d)
                    }
                })
                .catch((response) => {
                    if(response.status == '422') {
                        const incomingErrors = response.data.errors
                        Object.keys(incomingErrors).forEach(i => {
                            validationErrors.value[i] = typeof incomingErrors[i] == 'string' ? incomingErrors[i] : incomingErrors[i].join('\n')
                        })
                    }

                    if(options && options.onError) {
                        options.onError(response)
                    }
                })
                .finally(() => {
                    loading.value = false
                    if(options && options.onFinal) {
                        options.onFinal()
                    }
                })
    }

    return {
        data,
        loading,
        validationErrors,
        post,
        clearErrors
    }
}