export interface Animal {
  id: string
  name: string
  age: string
  gender: 'Самець' | 'Самка'
  size: 'Малий' | 'Середній' | 'Великий'
  stayDuration: string
  badge?: string
  imageUrl: string
  character: string[]
  isVaccinated: boolean
  isNeutered: boolean
  description: string
}

export interface StatItem {
  label: string
  value: string
  icon?: string
}

export interface Service {
  id: string
  title: string
  description: string
  iconName: string
  isPaid?: boolean
}

export interface Report {
  id: string
  month: string
  year: string
  fileUrl: string
  summary: string
}
