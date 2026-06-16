'use client'

import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Heart,
  HeartHandshake,
  Home,
  Leaf,
  MessageCircleQuestion,
  Palette,
  PawPrint,
  Ruler,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Syringe,
  VenusAndMars,
  Zap,
} from 'lucide-react'
import { motion } from 'motion/react'

import type { Animal } from '@/types'
import AnimalCard from '@/components/AnimalCard'
import { LinkButton } from '@/components/ui/Button'
import ImageLightbox from '@/components/news/ImageLightbox'
import ShareMenu from '@/components/ui/ShareMenu'
import { buildDonateHref } from '@/lib/donate-search-params'
import { buildAnimalHref, SITE_ROUTES } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import Section from '@/components/ui/Section'

type AnimalProfileClientProps = {
  animal: Animal
  galleryImages: string[]
  relatedAnimals: Animal[]
}

type Tone = 'orange' | 'green' | 'sky' | 'slate'

const surfaceClass = 'rounded-[26px] border border-gray-200 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.06)]'

export default function AnimalProfileClient({ animal, galleryImages, relatedAnimals }: AnimalProfileClientProps) {
  const images = useMemo(
    () => Array.from(new Set([animal.imageUrl, ...galleryImages].filter(Boolean))).slice(0, 6),
    [animal.imageUrl, galleryImages]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const displayName = animal.name?.trim() || 'Новий друг'
  const profile = buildProfile(animal, displayName)
  const donationHref = buildDonateHref({ animalId: animal.id, gift: 'treat' })

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f5] text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <Section as="div" contained={false} className="flex flex-col gap-5 py-5">
          <LinkButton href={SITE_ROUTES.animals} variant="ghost" size="sm" className="w-fit bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
            До каталогу
          </LinkButton>

          <div className="grid gap-5 lg:grid-cols-[9fr_11fr] lg:items-stretch">
            <PhotoJournal animal={animal} images={images} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />

            <aside className={cn(surfaceClass, 'flex min-w-0 flex-col p-5 sm:p-6')}>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge icon={BadgeCheck} label={profile.status} tone={animal.adoptionStatus === 'needs_care' ? 'orange' : 'green'} />
                <StatusBadge icon={Camera} label={`${images.length} фото`} tone="slate" />
                <span className="ml-auto inline-flex h-8 items-center rounded-2xl bg-primary px-3 text-[11px] font-black tracking-wider text-white shadow-sm">
                  #{animal.id}
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Картка знайомства</p>
                  {animal.publishedAt && (
                    <p className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 shadow-sm">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {new Date(animal.publishedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <h1 className="mt-2 break-words text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl">{displayName}</h1>
                <p className="mt-4 max-w-2xl break-words text-base font-semibold leading-7 text-gray-600">{profile.intro}</p>
              </div>

              <div className="mt-5 space-y-3">
                <SoftInfoPanel
                  icon={PawPrint}
                  title="Паспорт"
                  tone="slate"
                  items={[
                    { icon: CalendarDays, label: 'Орієнт. вік', value: formatAge(animal.age) },
                    { icon: VenusAndMars, label: 'Стать', value: animal.gender },
                    { icon: Ruler, label: 'Розмір', value: animal.size },
                    { icon: Palette, label: 'Забарвлення', value: animal.color ?? '—' },
                  ]}
                />
                <SoftInfoPanel
                  icon={ShieldCheck}
                  title="Здоров'я"
                  tone="slate"
                  items={[
                    {
                      icon: Syringe,
                      label: 'Вакцинація',
                      value: animal.isVaccinated ? 'Проведена' : 'Не проведена',
                      tone: animal.isVaccinated ? 'green' : 'orange',
                    },
                    {
                      icon: ShieldCheck,
                      label: profile.neuterLabel,
                      value: animal.isNeutered ? 'Проведена' : 'Не проведена',
                      tone: animal.isNeutered ? 'green' : 'orange',
                    },
                  ]}
                />
              </div>

              <div className="mt-auto pt-5 flex flex-col gap-3">
                <LinkButton
                  href={SITE_ROUTES.contacts}
                  size="lg"
                  className="h-14 w-full rounded-2xl text-base shadow-[0_18px_42px_rgba(242,116,56,0.22)]"
                >
                  <HeartHandshake className="h-5 w-5" />
                  Познайомитись
                </LinkButton>

                <div className="grid grid-cols-[1fr_1fr] gap-3">
                  <ShareMenu
                    path={buildAnimalHref(animal.id)}
                    title={`${displayName} шукає родину`}
                    text={profile.intro}
                    label="Поширити"
                    variant="button"
                    className="[&>button]:h-11 [&>button]:w-full [&>button]:rounded-2xl [&>button]:text-sm"
                  />
                  <LinkButton href={donationHref} variant="outline" size="sm" className="h-11 rounded-2xl text-sm">
                    <Heart className="h-4 w-4" />
                    Підтримати
                  </LinkButton>
                </div>
                <LinkButton href={SITE_ROUTES.contacts} variant="ghost" size="sm" className="h-9 w-full rounded-2xl text-xs">
                  <MessageCircleQuestion className="h-4 w-4" />
                  Запитати деталі
                </LinkButton>
              </div>
            </aside>
          </div>
        </Section>
      </section>

      <Section contained={false} className="grid gap-4 py-8 lg:grid-cols-[1fr_450px]">
        <IntroPanel title="Про характер" eyebrow="Коротко без зайвого" text={profile.story} />
        <CharacterTraits traits={animal.character} />
      </Section>

      <section className="border-y border-gray-200 bg-white">
        <Section as="div" contained={false} className="py-8">
          <SectionHeading
            eyebrow="План знайомства"
            title="Три прості кроки"
            text={`Для ${displayName} важливо не поспішати: спершу коротка розмова, потім спокійна зустріч і вже після цього рішення.`}
          />

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {profile.steps.slice(0, 3).map((step, index) => (
              <StepCard key={step.title} index={index + 1} {...step} />
            ))}
          </div>
        </Section>
      </section>

      {relatedAnimals.length > 0 ? (
        <section className="border-t border-gray-200 bg-white">
          <Section as="div" contained={false} className="py-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Ще кілька знайомств"
                title="Схожі анкети"
                text="Якщо серце ще вагається, подивіться на інших тварин, які теж чекають на свою людину."
              />
              <LinkButton href={SITE_ROUTES.animals} variant="secondary" className="w-full rounded-2xl sm:w-auto">
                Всі тварини
              </LinkButton>
            </div>

            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
              {relatedAnimals.map((relatedAnimal, index) => (
                <motion.a
                  key={relatedAnimal.id}
                  href={`/animals/${relatedAnimal.id}`}
                  initial={{opacity: 0, y: 12}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1]}}
                  whileHover={{scale: 1.02}}
                  className="group relative block overflow-hidden rounded-[20px] shadow-sm"
                >
                  <img
                    src={relatedAnimal.imageUrl}
                    alt={relatedAnimal.name}
                    referrerPolicy="no-referrer"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-gray-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 text-sm font-extrabold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {relatedAnimal.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </Section>
        </section>
      ) : null}
    </main>
  )
}

function PhotoJournal({
  animal,
  images,
  selectedIndex,
  onSelect,
}: {
  animal: Animal
  images: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  const selectedImage = images[selectedIndex] ?? animal.imageUrl
  const canGoBack = selectedIndex > 0
  const canGoForward = selectedIndex < images.length - 1

  const lightboxImages = images.map((src, i) => ({
    src,
    alt: `${animal.name} - фото ${i + 1}`,
  }))

  return (
    <section className={cn(surfaceClass, 'flex h-full max-w-full flex-col overflow-hidden')}>
      <ImageLightbox images={lightboxImages} initialIndex={selectedIndex}>
        {(openLightbox) => (
          <div className="relative min-h-[420px] flex-1 cursor-zoom-in overflow-hidden" onClick={openLightbox}>
            {images.map((img, i) => (
              <motion.img
                key={img}
                src={img}
                alt={`${animal.name} - фото ${i + 1}`}
                referrerPolicy="no-referrer"
                animate={{ opacity: i === selectedIndex ? 1 : 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-gray-950/70 via-gray-950/8 to-transparent" />

            <div className="absolute left-4 right-4 top-4 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelect(index)}
                  className="h-1.5 flex-1 cursor-pointer rounded-full bg-white/25 transition-colors hover:bg-white/50"
                  aria-label={`Показати фото ${index + 1}`}
                  aria-pressed={index === selectedIndex}
                >
                  <span
                    className={cn('block h-full rounded-full transition-colors', index === selectedIndex ? 'bg-white' : 'bg-transparent')}
                  />
                </button>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div className="ml-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
                <SliderButton
                  icon={ChevronLeft}
                  label="Попереднє фото"
                  disabled={!canGoBack}
                  onClick={() => canGoBack && onSelect(selectedIndex - 1)}
                />
                <SliderButton
                  icon={ChevronRight}
                  label="Наступне фото"
                  disabled={!canGoForward}
                  onClick={() => canGoForward && onSelect(selectedIndex + 1)}
                />
              </div>
            </div>
          </div>
        )}
      </ImageLightbox>
    </section>
  )
}

function SliderButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: LucideIcon
  label: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/90 text-gray-900 shadow-sm backdrop-blur transition-all duration-200 hover:border-primary/40 hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

function StatusBadge({ icon: Icon, label, tone }: { icon: LucideIcon; label: string; tone: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold',
        toneClasses(tone)
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  )
}

type InfoItem = {
  icon: LucideIcon
  label: string
  value: string
  tone?: Tone
}

function SoftInfoPanel({ icon: Icon, title, items, tone }: { icon: LucideIcon; title: string; items: InfoItem[]; tone: Tone }) {
  return (
    <motion.section whileHover="hovered" initial="rest" animate="rest" className={cn('rounded-[24px] border p-4', toneClasses(tone))}>
      <div className="flex items-center gap-2">
        <motion.span
          variants={{ rest: { scale: 1 }, hovered: { scale: 1.15 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm"
        >
          <Icon className="h-5 w-5 text-primary" />
        </motion.span>
        <h2 className="text-base font-extrabold">{title}</h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {items.map((item) => {
          const ItemIcon = item.icon

          return (
            <motion.div
              key={`${item.label}-${item.value}`}
              whileHover="hovered"
              initial="rest"
              animate="rest"
              className={cn(
                'group flex min-w-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 shadow-sm transition-colors',
                item.tone ? toneClasses(item.tone) : 'bg-white/72'
              )}
            >
              <motion.span
                variants={{ rest: { scale: 1, color: 'currentColor' }, hovered: { scale: 1.18 } }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm group-hover:text-primary"
              >
                <ItemIcon className="h-4 w-4" />
              </motion.span>
              <span className="min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wide opacity-55">{item.label}</span>
                <span className="block truncate text-sm font-extrabold">{item.value}</span>
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

function IntroPanel({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <article className={cn(surfaceClass, 'p-5 sm:p-6')}>
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-extrabold leading-tight text-gray-950 sm:text-3xl">{title}</h2>
      <p className="mt-4 text-base font-semibold leading-7 text-gray-600">{text}</p>
    </article>
  )
}

function CharacterTraits({ traits }: { traits: string[] }) {
  const icons = [Sparkles, Heart, PawPrint, Smile, Star, Zap, Leaf, Sun]
  if (!traits.length) return null

  return (
    <article className={cn(surfaceClass, 'flex flex-col p-5 sm:p-6')}>
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Характер та звички</p>
      <h2 className="mt-2 text-2xl font-extrabold leading-tight text-gray-950">Яким він є насправді</h2>
      <div className="mt-5 flex flex-col gap-2">
        {traits.map((trait, i) => {
          const TraitIcon = icons[i % icons.length]
          return (
            <motion.div
              key={trait}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2.5 shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <TraitIcon className="h-3.5 w-3.5 text-primary" />
              </span>
              <span className="text-sm font-bold text-orange-800">{trait}</span>
            </motion.div>
          )
        })}
      </div>
    </article>
  )
}

function InsightCard({ icon: Icon, title, text, tone }: { icon: LucideIcon; title: string; text: string; tone: Tone }) {
  return (
    <article className={cn(surfaceClass, 'p-4')}>
      <span className={cn('flex h-10 w-10 items-center justify-center rounded-2xl border', toneClasses(tone))}>
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-extrabold leading-tight text-gray-950">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">{text}</p>
    </article>
  )
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-extrabold leading-tight text-gray-950 sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-gray-600">{text}</p>
    </div>
  )
}

function StepCard({ icon: Icon, title, text, index }: { icon: LucideIcon; title: string; text: string; index: number }) {
  return (
    <article className="rounded-[24px] border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-black text-gray-300">0{index}</span>
      </div>
      <h3 className="mt-4 text-base font-extrabold text-gray-950">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">{text}</p>
    </article>
  )
}

function buildProfile(animal: Animal, displayName: string) {
  const character = animal.character.filter(Boolean)
  const firstTrait = character[0] ?? 'Лагідний контакт'
  const secondTrait = character[1] ?? 'Спокійне знайомство'

  return {
    status: getCareStatus(animal),
    neuterLabel: animal.gender === 'Самець' ? 'Кастрація' : 'Стерилізація',
    intro:
      trimToSentence(animal.description, 190) || `${displayName} чекає на людину, яка готова знайомитися спокійно, уважно і без поспіху.`,
    story:
      trimToSentence(animal.fullStory || animal.description, 360) ||
      `${displayName} вже має свій маленький ритм у центрі: придивляється до людей, радіє увазі й поступово вчиться довіряти. Найкращий старт для знайомства - тиха розмова, трохи терпіння і відчуття безпеки.`,
    characterCards: [
      {
        icon: Sparkles,
        title: firstTrait,
        text: `${displayName} не потребує гучних обіцянок. Достатньо спокійної уваги, стабільності й доброго першого контакту.`,
        tone: 'orange' as Tone,
      },
      {
        icon: Heart,
        title: secondTrait,
        text: 'Найкраще знайомство проходить без поспіху: коротка зустріч, прогулянка або розмова з командою центру.',
        tone: 'green' as Tone,
      },
    ],
    steps: [
      {
        icon: MessageCircleQuestion,
        title: 'Розмова',
        text: 'Розкажіть про умови, досвід і очікування від нового друга.',
      },
      {
        icon: PawPrint,
        title: 'Знайомство',
        text: 'Команда підкаже темп, поведінку і перший безпечний контакт.',
      },
      {
        icon: ShieldCheck,
        title: 'Підготовка',
        text: 'Уточнюємо здоров’я, документи, догляд і базові рекомендації.',
      },
      {
        icon: Home,
        title: 'Переїзд',
        text: 'Перші дні проходять у тиші, стабільності й без перевантаження.',
      },
    ],
  }
}

function getCareStatus(animal: Animal) {
  if (animal.adoptionStatus === 'needs_care') {
    return 'Потребує турботи'
  }
  if (animal.adoptionStatus === 'ready') {
    return 'Готовий до знайомства'
  }
  if (animal.isVaccinated && animal.isNeutered) {
    return 'Можна знайомитись'
  }

  return 'Очікує родинуu'
}

function trimToSentence(value: string | undefined, limit: number) {
  const text = value?.replace(/\s+/g, ' ').trim()

  if (!text) {
    return ''
  }
  if (text.length <= limit) {
    return text
  }
  return `${text.slice(0, limit).replace(/[,\s]+$/g, '')}...`
}

function formatAge(value: string): string {
  const match = value.match(/^(\d+)\.(\d+)$/)
  if (!match) return value
  const years = parseInt(match[1], 10)
  const months = parseInt(match[2], 10)
  const parts: string[] = []
  if (years > 0) {
    const y = years % 10,
      y2 = years % 100
    parts.push(`${years} ${y2 >= 11 && y2 <= 14 ? 'років' : y === 1 ? 'рік' : y >= 2 && y <= 4 ? 'роки' : 'років'}`)
  }
  if (months > 0) {
    const m = months % 10,
      m2 = months % 100
    parts.push(`${months} ${m2 >= 11 && m2 <= 14 ? 'місяців' : m === 1 ? 'місяць' : m >= 2 && m <= 4 ? 'місяці' : 'місяців'}`)
  }
  return parts.length > 0 ? parts.join(' ') : value
}

function toneClasses(tone: Tone) {
  return {
    orange: 'border-orange-200 bg-orange-50 text-orange-800',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    sky: 'border-sky-200 bg-sky-50 text-sky-800',
    slate: 'border-gray-200 bg-gray-50 text-gray-700',
  }[tone]
}
