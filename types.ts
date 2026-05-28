export interface Animal {
  id: string
  databaseId?: string
  slug?: string
  name: string
  age: string
  gender: 'Самець' | 'Самка'
  size: 'Малий' | 'Середній' | 'Великий'
  stayDuration: string
  badge?: string
  adoptionStatus?: 'ready' | 'needs_care' | null
  imageUrl: string
  galleryImages?: string[]
  character: string[]
  isVaccinated: boolean
  isNeutered: boolean
  description: string
  fullStory?: string
  publishedAt?: string | null
  createdAt?: string | null
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



export interface PetStoryChapter {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  bgGradient: string;
}

export interface PetDetail {
  label: string;
  value: string;
  icon: string;
  status?: 'success' | 'warning' | 'info';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PetProfile {
  name: string;
  age: string;
  gender: string;
  size: string;
  vaccinated: boolean;
  sterilized: boolean;
  character: string[];
  badges: string[];
  fullStory: string;
  chapters: PetStoryChapter[];
  faq: FAQItem[];
}
