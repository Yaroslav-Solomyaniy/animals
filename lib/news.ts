export type NewsBlockWidth = 'narrow' | 'medium' | 'wide' | 'full'
export type NewsBlockHeight = 'small' | 'medium' | 'large'

type NewsBlockBase = {
  width?: NewsBlockWidth
  height?: NewsBlockHeight
}

export type NewsContentBlock =
  | ({
      type: 'paragraph'
      text: string
    } & NewsBlockBase)
  | ({
      type: 'image'
      src: string
      alt: string
      caption?: string
    } & NewsBlockBase)
  | ({
      type: 'video'
      src: string
      title: string
      caption?: string
    } & NewsBlockBase)
  | ({
      type: 'table'
      title?: string
      columns: string[]
      rows: string[][]
    } & NewsBlockBase)
  | ({
      type: 'buttons'
      buttons: Array<{
        label: string
        href: string
        variant?: 'primary' | 'outline'
      }>
    } & NewsBlockBase)
  | ({
      type: 'gallery'
      images: Array<{
        src: string
        alt: string
      }>
    } & NewsBlockBase)
  | ({
      type: 'slider'
      images: Array<{
        src: string
        alt: string
      }>
      caption?: string
    } & NewsBlockBase)

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  heroImages?: Array<{
    src: string
    alt: string
  }>
  readingTime: string
  publishedTime: string
  relatedAnimalId?: string
  content: NewsContentBlock[]
}

export type ReportItem = {
  title: string
  date: string
  description: string
}

export const news: NewsItem[] = [
  {
    id: '1',
    title: 'Успішна операція: врятовано собаку після ДТП',
    excerpt:
      'Завдяки швидкій реакції волонтерів та професіоналізму ветеринарів собака повністю одужує після травм.',
    date: '15 квітня 2026',
    category: 'Історії порятунку',
    image:
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=1400',
    heroImages: [
      {
        src: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=1400',
        alt: 'Собака після порятунку',
      },
      {
        src: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&q=80&w=1400',
        alt: 'Собака під час відновлення',
      },
      {
        src: 'https://images.unsplash.com/photo-1601758177266-bc599de87707?auto=format&fit=crop&q=80&w=1400',
        alt: 'Тварина поруч із волонтером',
      },
    ],
    readingTime: '4 хв читання',
    publishedTime: '18:40',
    relatedAnimalId: '3',
    content: [
      {
        type: 'paragraph',
        width: 'narrow',
        text: 'Пізно ввечері до центру надійшло повідомлення про собаку, яку знайшли біля дороги після ДТП. Волонтери швидко виїхали на місце, обережно транспортували тварину до ветеринарної клініки та передали лікарям для термінового огляду.',
      },
      {
        type: 'paragraph',
        width: 'narrow',
        text: 'Перші години були найважчими: пес мав забої, сильний стрес і потребував постійного контролю. Завдяки злагодженій роботі ветеринарів вдалося стабілізувати стан, провести необхідні процедури та уникнути ускладнень.',
      },
      {
        type: 'image',
        width: 'medium',
        height: 'medium',
        src: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&q=80&w=1400',
        alt: 'Собака під час відновлення після лікування',
        caption: 'Перші дні після стабілізації стану.',
      },
      {
        type: 'video',
        width: 'medium',
        height: 'medium',
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        title: 'Демонстраційне відео для новинного блоку',
        caption:
          'Так виглядатиме відео в новині. У реальному контенті тут буде файл із R2 або зовнішній embed.',
      },
      {
        type: 'table',
        width: 'wide',
        title: 'Що було зроблено',
        columns: ['Етап', 'Результат'],
        rows: [
          ['Огляд', 'Стан стабілізовано'],
          ['Лікування', 'Проведені необхідні процедури'],
          ['Реабілітація', 'Тварина поступово відновлюється'],
        ],
      },
      {
        type: 'slider',
        width: 'medium',
        height: 'medium',
        caption:
          'Слайдер підходить для серії фото з однієї події, коли сітка займає забагато місця.',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=1200',
            alt: 'Фото з події 1',
          },
          {
            src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1200',
            alt: 'Фото з події 2',
          },
          {
            src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200',
            alt: 'Фото з події 3',
          },
        ],
      },
      {
        type: 'gallery',
        width: 'wide',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&q=80&w=900',
            alt: 'Галерея: тварина на прогулянці',
          },
          {
            src: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=900',
            alt: 'Галерея: тварина біля волонтера',
          },
          {
            src: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&q=80&w=900',
            alt: 'Галерея: собака дивиться в камеру',
          },
        ],
      },
      {
        type: 'paragraph',
        width: 'narrow',
        text: 'Зараз собака поступово відновлюється, їсть самостійно, реагує на людей і вже починає довіряти тим, хто поруч. Попереду ще реабілітація, але найважливіше вже сталося: життя врятовано.',
      },
      {
        type: 'buttons',
        width: 'medium',
        buttons: [
          {
            label: 'Підтримати лікування',
            href: '/help-for-us',
            variant: 'primary',
          },
          {
            label: 'Переглянути тварин',
            href: '/animals',
            variant: 'outline',
          },
        ],
      },
      {
        type: 'paragraph',
        width: 'narrow',
        text: 'Ми вдячні кожному, хто не проходить повз тварин у біді. Один дзвінок, одна поїздка, одна пожертва на лікування можуть змінити всю історію.',
      },
    ],
  },
  {
    id: '2',
    title: 'Нові родини для підопічних центру',
    excerpt:
      'Ще кілька тварин переїхали у теплі домівки. Дякуємо кожному, хто обирає усиновлення.',
    date: '1 квітня 2026',
    category: 'Усиновлення',
    image:
      'https://images.unsplash.com/photo-1601758177266-bc599de87707?auto=format&fit=crop&q=80&w=1400',
    readingTime: '3 хв читання',
    publishedTime: '12:15',
    relatedAnimalId: '1',
    content: [
      {
        type: 'paragraph',
        text: 'Цього тижня кілька наших підопічних нарешті поїхали додому. Для когось це перший власний лежак, для когось перша спокійна ніч поруч із людиною, а для нас це найкраще підтвердження, що робота має сенс.',
      },
      {
        type: 'paragraph',
        text: 'Перед переїздом кожна родина пройшла знайомство, консультацію з командою та отримала рекомендації щодо адаптації. Ми завжди просимо не поспішати й дати тварині час звикнути до нового простору.',
      },
      {
        type: 'gallery',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=900',
            alt: 'Собака у новій родині',
          },
          {
            src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=900',
            alt: 'Тварина вдома',
          },
          {
            src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=900',
            alt: 'Прогулянка з собакою',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'Перші фото з дому вже показують головне: тварини розслабляються, цікавляться новим життям і поступово починають відчувати себе своїми.',
      },
      {
        type: 'paragraph',
        text: 'Дякуємо всім, хто обирає адопцію. Ви не просто забираєте тварину з притулку, ви відкриваєте місце для наступного врятованого хвостика.',
      },
    ],
  },
  {
    id: '3',
    title: 'Новий етап програми стерилізації',
    excerpt:
      'Міська програма стабілізації популяції продовжує працювати гуманно та системно.',
    date: '20 березня 2026',
    category: 'Програми',
    image:
      'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=1400',
    readingTime: '5 хв читання',
    publishedTime: '09:30',
    content: [
      {
        type: 'paragraph',
        text: 'Програма стерилізації переходить у новий етап. Команда продовжує працювати з безпритульними тваринами, щоб гуманно стабілізувати популяцію та зменшити кількість тварин, які народжуються просто на вулиці.',
      },
      {
        type: 'paragraph',
        text: 'Стерилізація — це не разова акція, а системна робота. Вона включає відлов, огляд, операцію, післяопераційний догляд і повернення або прилаштування тварини залежно від її стану та характеру.',
      },
      {
        type: 'paragraph',
        text: 'Особливу увагу приділяємо безпеці: кожна тварина проходить ветеринарний огляд, отримує необхідні процедури та перебуває під наглядом до повного відновлення.',
      },
      {
        type: 'paragraph',
        text: 'Ми відкриті до співпраці з мешканцями міста, волонтерами та ОСББ. Якщо у вашому районі є тварини, які потребують допомоги, звертайтеся до центру.',
      },
    ],
  },
  {
    id: '4',
    title: 'Оновлення вольєрів у притулку',
    excerpt:
      'Завдяки підтримці небайдужих людей центр покращує умови для тварин, які чекають на дім.',
    date: '1 березня 2026',
    category: 'Інфраструктура',
    image:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1400',
    readingTime: '3 хв читання',
    publishedTime: '16:05',
    content: [
      {
        type: 'paragraph',
        text: 'У притулку триває оновлення вольєрів. Для тварин це не просто ремонт, а більше тепла, безпеки та спокою в період, поки вони чекають на свою родину.',
      },
      {
        type: 'paragraph',
        text: 'Ми замінюємо зношені елементи, покращуємо захист від вологи й вітру, додаємо зручніші зони для відпочинку та робимо простір простішим у щоденному догляді.',
      },
      {
        type: 'paragraph',
        text: 'Такі зміни можливі завдяки підтримці людей, які донатять матеріали, допомагають руками або закривають частину витрат. Кожен внесок тут дуже відчутний.',
      },
      {
        type: 'paragraph',
        text: 'Попереду ще багато роботи, але вже зараз тварини отримують комфортніші умови, а команда — більше можливостей якісно доглядати за ними.',
      },
    ],
  },
]

export const reports: ReportItem[] = [
  {
    title: 'Фінансовий звіт за квартал',
    date: 'Квітень 2026',
    description: 'Надходження, витрати та потреби центру за звітний період.',
  },
  {
    title: 'Звіт про діяльність центру',
    date: 'Січень 2026',
    description: 'Підсумки роботи, допомоги тваринам та волонтерських подій.',
  },
  {
    title: 'Потреби центру',
    date: 'Оновлюється регулярно',
    description:
      'Корм, медикаменти, доглядові засоби та інша актуальна допомога.',
  },
]

export function getNewsById(id: string) {
  return news.find((item) => item.id === id)
}

export function getRelatedNews(id: string, limit = 3) {
  return news.filter((item) => item.id !== id).slice(0, limit)
}
