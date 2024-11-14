import type { CustomForm } from "~/types/custom-form"
import { useCustomFetch } from "./customFetch"

export function useCustomForm<T>(obj: Record<string, any>): CustomForm<T> {

    const initialObj = {...obj}
    const objKeys = Object.keys(obj)
    const data = ref(obj)
    const errors = ref<Record<string, any>>({})
    const {loading: processing, get: fGet, post: fPost, put: fPut} = useCustomFetch()

    function fill(o: Record<string, any>) {
        data.value = o
    }

    function setErrors(newErrors: Record<string, any>) {
        errors.value = newErrors
    }

    function clearErrors() {
        errors.value = {}
    }

    function reset() {
        Object.keys(obj).forEach(key => data.value[key] = initialObj[key])
    }


    async function get(url: string): Promise<any> {
        return fGet(url, data.value)
    }

    async function post(url: string): Promise<any> {

        clearErrors()

        return new Promise((resolve, reject) => {
            fPost(url, data.value)
                .then((response: any) => {
                    resolve(response)
                })
                .catch(({response}: any) => {
                    if(response.status == 422) {
                        handleValidationErrors(response._data.errors)
                    }

                    reject(response)
                })
        })
    }

    async function put(url: string): Promise<any> {
        clearErrors()

        return new Promise((resolve, reject) => {
            fPut(url, data.value)
                .then((response: any) => {
                    resolve(response)
                })
                .catch(({response}: any) => {
                    if(response.status == 422) {
                        console.log(response, 'response')
                        handleValidationErrors(response._data.errors)
                    }

                    reject(response)
                })
        })
    }

    const handler = {
        get: (target: any, prop: string) => {

            if(objKeys.includes(prop)) {
                return data.value[prop]
            }

            if(prop == 'errors') {
                return errors.value
            }

            if(prop == 'processing') {
                return processing.value
            }

            return Reflect.get(target, prop)
        },
        set: (target: any, prop: string, value: any) => {

            if(objKeys.includes(prop)) {
                data.value[prop] = value
            }

            return Reflect.set(target, prop, value)
        }
    }

    function handleValidationErrors(errs: any) {
        const incomingErrors = errs
        Object.keys(incomingErrors).forEach(i => {
            errors.value[i] = typeof incomingErrors[i] == 'string' ? incomingErrors[i] : incomingErrors[i].join('\n')
        })
    }

    const form = {
        data,
        errors,
        processing,
        clearErrors,
        reset,
        get,
        post,
        put,
        setErrors,
        fill
    }

    return new Proxy(form, handler)
}