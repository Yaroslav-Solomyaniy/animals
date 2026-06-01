export const SITE_ROUTES = {
  home: '/',
  animals: '/animals',
  walks: '/walks',
  services: '/services',
  help: '/help-for-us',
  reportAndNews: '/report-and-news',
  contacts: '/contacts',
  contactsSchedule: '/contacts#schedule',
  donate: '/donate',
} as const

export const SITE_CONTACTS = {
  phoneDisplay: '+38 (093) 296-60-97',
  phoneHref: 'tel:+380932966097',
  email: 'chistota_ck@ukr.net',
  emailHref: 'mailto:chistota_ck@ukr.net',
  city: 'Черкаси',
  street: 'вул. Івана Мазепи, 117',
  addressShort: 'Івана Мазепи, 117',
  addressFull: 'м. Черкаси, вул. Івана Мазепи, 117',
  mapHref: 'https://maps.google.com/?q=Черкаси,+вул.+Івана+Мазепи,+117',
  scheduleShort: 'Пн-Чт 8:00-17:00',
  scheduleFull: 'Пн-Чт 8:00-17:00 | Пт 08:00-16:00 | Сб-Нд: 08:00-17:00',
  walkSchedule: 'Вихідні, 11:00-14:00',
} as const

export const SITE_SOCIAL_LINKS = {
  facebook: {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61561672820969',
  },
  instagram: {
    label: 'Instagram',
    href: 'https://www.instagram.com/dog_help_cherkassy/',
  },
  chystota: {
    label: 'Черкаська служба чистоти',
    href: 'https://chistota.ck.ua',
  },
} as const

export const SITE_NAV_LINKS = [
  { name: 'Головна', href: SITE_ROUTES.home },
  { name: 'Книга хвостиків', href: SITE_ROUTES.animals },
  { name: 'Прогулянки', href: SITE_ROUTES.walks },
  { name: 'Послуги', href: SITE_ROUTES.services },
  { name: 'Як можна допомогти', href: SITE_ROUTES.help },
  { name: 'Звіти та новини', href: SITE_ROUTES.reportAndNews },
  { name: 'Контакти', href: SITE_ROUTES.contacts },
] as const

export const buildAnimalHref = (slugOrId: string) =>
  `${SITE_ROUTES.animals}/${slugOrId}`

export const buildNewsHref = (id: string) =>
  `${SITE_ROUTES.reportAndNews}/${id}`
