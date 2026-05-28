export type AnimalRow = {
  id: string
  slug: string
  name: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  status: 'draft' | 'available' | 'reserved' | 'adopted' | 'hidden'
  short_description: string | null
  full_story: string | null
  public_badges: string[] | null
  adoption_status: 'ready' | 'needs_care' | null
  approximate_age_label: string | null
  is_vaccinated: boolean | null
  is_neutered: boolean | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type AnimalPhotoRow = {
  id: string
  animal_id: string
  r2_key: string | null
  public_url: string | null
  alt: string | null
  sort_order: number
  is_main: boolean
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

export type VolunteerRequestRow = {
  id: string
  status: 'new' | 'contacted' | 'approved' | 'rejected' | 'closed'
  name: string
  phone: string
  email: string | null
  email_status: 'sent' | 'failed' | 'not_configured'
  email_error: string | null
  admin_notes: string | null
  created_at: string | null
  updated_at: string | null
}
