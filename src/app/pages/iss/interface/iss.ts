export interface Iss {
    message: string
    timestamp: number
    iss_position: IssPosition
}
  
export interface IssPosition {
    latitude: string
    longitude: string
}
