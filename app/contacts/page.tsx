import {
  ArrowRight,
  Clock3,
  Facebook,
  Footprints,
  Globe2,
  HeartHandshake,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Stethoscope,
} from 'lucide-react'

import BorderGlow from '@/components/ui/BorderGlow'
import PageHero from '@/components/ui/PageHero'
import SectionFrame from '@/components/ui/SectionFrame'
import StorybookDecorations from '@/components/ui/StorybookDecorations'
import { Button, LinkButton } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/FormControls'


const contactCards = [
  {
    icon: Phone,
    label: 'Телефон',
    title: '+38 (093) 296-60-97',
    text: 'Підкажемо щодо тварин, візиту або допомоги центру.',
    href: 'tel:+380932966097',
    tone: 'bg-orange-50 text-orange-600',
  },
  {
    icon: MapPin,
    label: 'Адреса',
    title: 'м. Черкаси, вул. Івана Мазепи, 117',
    text: 'Перед візитом краще зателефонувати, щоб узгодити зручний час.',
    href: 'https://maps.google.com/?q=Черкаси,+вул.+Івана+Мазепи,+117',
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Clock3,
    label: 'Графік',
    title: 'Пн-Чт 8:00-17:00 | Пт 08:00-16:00 | Сб-Нд: 08:00-17:00',
    text: 'Підбирайте зручний час для зустрічі з улюбленцем чи керівництвом',
    href: '#schedule',
    tone: 'bg-emerald-50 text-emerald-600',
  },
]

const reasons = [
  {
    icon: Footprints,
    title: 'Волонтерські прогулянки',
    text: 'Щовихідних з 11:00 до 14:00 за попереднім записом.',
    color: 'border-sky-100 bg-sky-50/70 text-sky-700',
  },
  {
    icon: HeartHandshake,
    title: 'Усиновлення або знайомство',
    text: 'Допоможемо підібрати собаку за характером і темпом життя.',
    color: 'border-rose-100 bg-rose-50/70 text-rose-700',
  },
  {
    icon: Stethoscope,
    title: 'Комерційні послуги',
    text: 'Для домашніх тварин також доступні окремі послуги центру.',
    color: 'border-violet-100 bg-violet-50/70 text-violet-700',
  },
]

const schedule = [
  ['Понеділок - Четвер', '8:00 - 17:00'],
  ['П’ятниця', '8:00 - 16:00'],
  ['Субота - Неділя', '8:00 - 17:00'],
]

export default function ContactsPage() {
  return (
    <main className="storybook-bg text-gray-950">
      <StorybookDecorations />
      <PageHero
        eyebrow="Контакти центру"
        title="Подзвоніть, напишіть нам чи завітайте в гості до улюбленця"
        description="Ми поруч, якщо ви хочете усиновити тварину, записатися на волонтерську прогулянку, підтримати центр або дізнатися про послуги для домашніх улюбленців."
        icon={MessageCircle}
      >
        <div className="orange-neon rounded-[28px] bg-gray-950 p-6 text-white sm:p-8">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-orange-200">
            <Phone className="h-6 w-6" />
          </span>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-orange-200">
            Швидкий зв’язок
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Найпростіше - подзвонити
          </h2>
          <p className="mt-4 leading-7 text-white/70">
            Узгодьте візит, прогулянку, питання щодо послуг або допомоги одним дзвінком.
          </p>
          <LinkButton
            href="tel:+380932966097"
            variant="primary"
            size="lg"
            className="group mt-7 w-full justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/18 text-white transition-colors duration-300 group-hover:bg-white/25">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="hidden text-sm font-semibold text-white/75">
                  Зателефонувати
                </span>
                <span className="text-sm font-black text-white sm:text-base">
                  +38 (093) 296-60-97
                </span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-white" />
          </LinkButton>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold">
            <LinkButton
              href="mailto:info@animalcare.ck.ua"
              variant="light"
              size="md"
              className="justify-start border-white/15 bg-white/8 px-4 text-left text-white"
            >
              <Mail className="mb-2 h-4 w-4 text-orange-300" />
              Написати
            </LinkButton>
            <LinkButton
              href="/services"
              variant="light"
              size="md"
              className="justify-start border-white/15 bg-white/8 px-4 text-left text-white"
            >
              <Stethoscope className="mb-2 h-4 w-4 text-sky-300" />
              Послуги
            </LinkButton>
          </div>
        </div>
      </PageHero>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto grid max-w-7xl gap-4 p-4 sm:p-6 md:grid-cols-3 lg:p-8">
          {contactCards.map((card) => {
            const Icon = card.icon
            return (
              <a
                key={card.title}
                href={card.href}
                className="flex flex-col rounded-[28px] border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
              >
                <span
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
                  {card.label}
                </span>
                <h2 className="mt-2 text-lg font-bold text-gray-950">
                  {card.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-gray-600">
                  {card.text}
                </p>
              </a>
            )
          })}
        </SectionFrame>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto grid max-w-7xl gap-8 p-4 sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div className="space-y-4">
            {reasons.map((reason) => {
              const Icon = reason.icon
              return (
                <div
                  key={reason.title}
                  className={`rounded-[28px] border p-6 ${reason.color}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-950">
                        {reason.title}
                      </h3>
                      <p className="mt-2 leading-7 text-gray-600">
                        {reason.text}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            <div
              id="schedule"
              className="rounded-[28px] border border-gray-100 bg-gray-50 p-6"
            >
              <h3 className="text-xl font-bold text-gray-950">
                Графік відвідування
              </h3>
              <div className="mt-5 space-y-3">
                {schedule.map(([days, time]) => (
                  <div
                    key={days}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-base font-semibold"
                  >
                    <span className="text-gray-600">{days}</span>
                    <span className="text-gray-950">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <BorderGlow
            borderRadius={32}
            glowRadius={22}
            colors={['#fb923c', '#f59e0b', '#38bdf8']}
            glowColor="249 115 22"
            fillOpacity={0.08}
          >
            <form className="p-6 sm:p-8 lg:p-10">
              <div className="mb-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                    Форма зв’язку
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-gray-950">
                    Залиште повідомлення
                  </h2>
                  <p className="mt-3 max-w-xl leading-7 text-gray-600">
                    Напишіть, з якого питання звертаєтесь. Для запису на
                    прогулянку залиште телефон, щоб ми могли підтвердити час.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Ваше ім’я
                  </span>
                  <input
                    type="text"
                    placeholder="Ім’я та прізвище"
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 font-medium outline-none transition focus:border-orange-300 focus:bg-white"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Телефон
                  </span>
                  <Input
                    type="tel"
                    placeholder="+38 (0__) ___-__-__"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Email
                  </span>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Тема
                  </span>
                  <Select>
                    <option>Усиновлення</option>
                    <option>Волонтерська прогулянка</option>
                    <option>Комерційні послуги</option>
                    <option>Інше питання</option>
                  </Select>
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm font-semibold text-gray-700">
                  Повідомлення
                </span>
                <textarea
                  rows={5}
                  placeholder="Коротко опишіть, чим можемо допомогти"
                  className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 font-medium outline-none transition focus:border-orange-300 focus:bg-white"
                />
              </label>
              <Button
                type="button"
                size="lg"
                className="mt-6 w-full sm:w-auto"
              >
                Надіслати повідомлення
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </BorderGlow>
        </SectionFrame>
      </section>

      <section className="px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <SectionFrame className="mx-auto grid max-w-7xl gap-8 p-4 sm:p-6 lg:grid-cols-[1fr_1.25fr] lg:p-8">
          <div className="rounded-4xl border border-gray-100 bg-white p-6 sm:p-8">
            <div className="max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Соціальні мережі
              </p>
              <h2 className="mt-4 text-3xl font-black text-gray-950">
                Дізнавайтесь більше про нас
              </h2>
              <p className="mt-4 leading-7 text-gray-600">
                Публікуємо історії тварин, оголошення про прогулянки, потреби та
                новини Центру надання допомоги безпритульним тваринам м.Черкаси
              </p>
            </div>
            <div className="mt-8 grid gap-3">
              <LinkButton
                href="https://www.instagram.com/dog_help_cherkassy/"
                target="_blank"
                rel="noreferrer"
                variant="light"
                size="lg"
                className="group h-16 justify-between border-rose-100 bg-rose-50/70 px-5 text-base text-gray-900"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-rose-600">
                    <Instagram className="h-5 w-5" />
                  </span>
                  Instagram
                </span>
                <ArrowRight className="h-4 w-4 text-rose-500 transition group-hover:translate-x-1" />
              </LinkButton>
              <LinkButton
                href="https://www.facebook.com/profile.php?id=61561672820969"
                target="_blank"
                rel="noreferrer"
                variant="light"
                size="lg"
                className="group h-16 justify-between border-sky-100 bg-sky-50/70 px-5 text-base text-gray-900"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-sky-600">
                    <Facebook className="h-5 w-5" />
                  </span>
                  Facebook
                </span>
                <ArrowRight className="h-4 w-4 text-sky-500 transition group-hover:translate-x-1" />
              </LinkButton>
              <LinkButton
                href="https://chistota.ck.ua"
                target="_blank"
                rel="noreferrer"
                variant="light"
                size="lg"
                className="group h-16 justify-between border-emerald-100 bg-emerald-50/70 px-5 text-base text-gray-900"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-emerald-600">
                    <Globe2 className="h-5 w-5" />
                  </span>
                  Черкаська служба чистоти
                </span>
                <ArrowRight className="h-4 w-4 text-emerald-500 transition group-hover:translate-x-1" />
              </LinkButton>
            </div>
          </div>

          <div className="rounded-4xl border border-gray-100 bg-white p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Як нас знайти?
            </p>
            <h2 className="mt-4 text-3xl font-black text-gray-950">
              Ми на карті
            </h2>
            <iframe
              title="Мапа розташування центру допомоги тваринам"
              src="https://www.google.com/maps?q=Черкаси,+вул.+Івана+Мазепи,+117&output=embed"
              className="h-105 w-full mt-5 rounded-2xl"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </SectionFrame>
      </section>
    </main>
  )
}
