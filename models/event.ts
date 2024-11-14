export interface Event {
    id: number
    starts_at: string
    ends_at: string
    only_nights_ends_at: string
    name: string
    note: string
    status: string
    service_id: number
    user_id: number
    blocker: boolean
}