export interface CustomFormProps<T>{
    processing: boolean
    errors: Partial<Record<keyof T, any>> 
    clearErrors: () => void,
    reset: () => void,
    get: (url: string) => Promise<any>,
    post: (url: string) => Promise<any>,
    put: (url: string) => Promise<any>,
    destroy: (url: string) => Promise<any>,
    setErrors: (errors: Record<string, any>) => void,
    fill: (o: Record<string, any>) => void
}

export type CustomForm<T> = T & CustomFormProps<T>;