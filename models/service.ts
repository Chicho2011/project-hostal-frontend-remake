export interface Service {
    id: number
    name: string
    type: 'LODGING' | 'OTHERS'
    color: string
    description?: string
    inner_code?: string
    today_vacancy?: boolean
}