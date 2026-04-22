import type { Animal, Service, StatItem } from '@/types'

export const MOCK_ANIMALS: Animal[] = [
  {
    id: '1',
    name: 'Бакс',
    age: '2 роки',
    gender: 'Самець',
    size: 'Середній',
    stayDuration: '3 місяці',
    badge: 'Готовий до адопції',
    imageUrl:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=900',
    character: ['Активний', 'Дружній до дітей'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Бакс - енергійний пес, який обожнює прогулянки та ігри з мʼячем. Шукає активну родину.',
  },
  {
    id: '2',
    name: 'Луна',
    age: '1 рік',
    gender: 'Самка',
    size: 'Малий',
    stayDuration: '1 місяць',
    badge: 'Новенька',
    imageUrl:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=900',
    character: ['Спокійна', 'Лагідна'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Луна - ніжна і спокійна кішка, любить тихі вечори, ласку та мʼякі пледи.',
  },
  {
    id: '3',
    name: 'Макс',
    age: '4 роки',
    gender: 'Самець',
    size: 'Великий',
    stayDuration: '5 місяців',
    badge: 'Готовий до адопції',
    imageUrl:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=900',
    character: ['Вірний', 'Охоронний'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Макс - великий і розумний пес, який стане надійним другом та захисником.',
  },
  {
    id: '4',
    name: 'Міла',
    age: '6 місяців',
    gender: 'Самка',
    size: 'Малий',
    stayDuration: '2 тижні',
    badge: 'Новенька',
    imageUrl:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=900',
    character: ['Грайлива', 'Цікава'],
    isVaccinated: true,
    isNeutered: false,
    description:
      'Міла - маленький клубочок радості, дуже допитлива і завжди готова до гри.',
  },
  {
    id: '5',
    name: 'Рекс',
    age: '3 роки',
    gender: 'Самець',
    size: 'Великий',
    stayDuration: '4 місяці',
    badge: 'Потребує уваги',
    imageUrl:
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=900',
    character: ['Активний', 'Вірний'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Рекс - активний і відданий пес, якому потрібен господар, що любить рух.',
  },
  {
    id: '6',
    name: 'Соня',
    age: '2 роки',
    gender: 'Самка',
    size: 'Середній',
    stayDuration: '2 місяці',
    badge: 'Готова до адопції',
    imageUrl:
      'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&q=80&w=900',
    character: ['Спокійна', 'Дружня'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Соня - спокійна і врівноважена собака, чудово підходить для сімʼї.',
  },
  {
    id: '7',
    name: 'Тобі',
    age: '1.5 року',
    gender: 'Самець',
    size: 'Малий',
    stayDuration: '1 місяць',
    badge: 'Новенький',
    imageUrl:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=900',
    character: ['Грайливий', 'Енергійний'],
    isVaccinated: true,
    isNeutered: false,
    description:
      'Тобі - веселий і рухливий пес, який обожнює ігри, прогулянки та увагу.',
  },
  {
    id: '8',
    name: 'Белла',
    age: '5 років',
    gender: 'Самка',
    size: 'Середній',
    stayDuration: '6 місяців',
    badge: 'Чекає на родину',
    imageUrl:
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=900',
    character: ['Лагідна', 'Терпляча'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Белла - дуже добра й терпляча собака, ідеальна для спокійної родини.',
  },
  {
    id: '9',
    name: 'Граф',
    age: '6 років',
    gender: 'Самець',
    size: 'Великий',
    stayDuration: '8 місяців',
    badge: 'Потребує господаря',
    imageUrl:
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=900',
    character: ['Спокійний', 'Розумний'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Граф - мудрий і спокійний пес, який стане чудовим компаньйоном.',
  },
  {
    id: '10',
    name: 'Кіра',
    age: '3 роки',
    gender: 'Самка',
    size: 'Середній',
    stayDuration: '3 місяці',
    badge: 'Готова до адопції',
    imageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=900',
    character: ['Активна', 'Дружелюбна'],
    isVaccinated: true,
    isNeutered: true,
    description:
      'Кіра - активна і дружня собака, яка швидко знаходить контакт з людьми.',
  },
]

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Гуманне відловлювання',
    description:
      'Професійна команда для допомоги безпритульним тваринам у районах Черкас.',
    iconName: 'Shield',
    isPaid: false,
  },
  {
    id: '2',
    title: 'Стерилізація',
    description:
      'Безкоштовно для безпритульних тварин та доступні пакети для домашніх улюбленців.',
    iconName: 'Activity',
    isPaid: true,
  },
  {
    id: '3',
    title: 'Лікування',
    description:
      'Сучасна клініка з обладнанням для операцій, вакцинацій та реабілітації.',
    iconName: 'HeartPulse',
    isPaid: true,
  },
]

export const MOCK_STATS: StatItem[] = [
  { label: 'Тварин прилаштовано', value: '1 240+' },
  { label: 'Стерилізацій проведено', value: '3 100+' },
  { label: 'Професійних ветеринарів', value: '15' },
  { label: 'Екстрена допомога', value: '24/7' },
]
