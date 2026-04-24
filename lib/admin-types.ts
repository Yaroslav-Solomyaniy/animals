export type AnimalRow = {
  id: string
  slug: string
  name: string
  species: 'dog' | 'cat'
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  status: 'draft' | 'available' | 'reserved' | 'adopted' | 'hidden'
  short_description: string | null
  full_story: string | null
  birth_date: string | null
  approximate_age_label: string | null
  shelter_arrival_date: string | null
  is_vaccinated: boolean | null
  is_neutered: boolean | null
  is_featured: boolean | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type NewsPostRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content_blocks: unknown[] | null
  cover_url: string | null
  cover_r2_key: string | null
  related_animal_id: string | null
  is_published: boolean | null
  published_at: string | null
}

export type ReportRow = {
  id: string
  title: string
  month: string | null
  year: string | null
  summary: string | null
  file_url: string | null
  file_r2_key: string | null
  is_published: boolean | null
  published_at: string | null
}
