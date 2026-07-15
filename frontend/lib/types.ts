export interface Wine {
  id: number
  title: string
  variety: string | null
  country: string | null
  province: string | null
  region_1: string | null
  region_2: string | null
  winery: string | null
  designation: string | null
  points: number | null
  price: number | null
  description: string
  taster_name: string | null
}

export interface ChatApiResponse {
  text: string
  wines?: Wine[]
}
