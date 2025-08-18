export interface Iss {
    message: string
    iss_position: IssPosition
    timestamp: number
    //     name: string
    //     id: number
    //     latitude: number
    //     longitude: number
    //     altitude: number
    //     velocity: number
    //     visibility: string
    //     footprint: number
    //     timestamp: number
    //     daynum: number
    //     solar_lat: number
    //     solar_lon: number
    //     units: string
}

export interface IssPosition {
    longitude: string
    latitude: string
}
