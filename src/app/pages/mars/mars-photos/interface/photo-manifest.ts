export interface PhotoManifestResponse {
  photo_manifest: PhotoManifest
}
export interface PhotoManifest {
  name: string
  landing_date: string
  launch_date: string | any
  status: string | any
  max_sol: number
  max_date: string
  total_photos: number
  photos: Photo[]
}
export interface Photo {
  sol: number
  earth_date: string
  total_photos: number
  cameras: string[]
}