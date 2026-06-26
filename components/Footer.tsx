'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Clock, Facebook, FileText, Globe, Heart, Instagram, Mail, MapPin, Newspaper, Phone, Stethoscope } from 'lucide-react'

import { reports } from '@/lib/news'
import { buildNewsHref, SITE_CONTACTS, SITE_ROUTES, SITE_SOCIAL_LINKS } from '@/lib/site-config'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import Section from '@/components/ui/Section'

const socialLinks = [
  {
    ...SITE_SOCIAL_LINKS.facebook,
    icon: Facebook,
    expandedWidth: 'hover:max-w-[128px] focus-visible:max-w-[128px]',
  },
  {
    ...SITE_SOCIAL_LINKS.instagram,
    icon: Instagram,
    expandedWidth: 'hover:max-w-[136px] focus-visible:max-w-[136px]',
  },
  {
    ...SITE_SOCIAL_LINKS.chystota,
    icon: Globe,
    expandedWidth: 'hover:max-w-[250px] focus-visible:max-w-[250px]',
  },
]

const quickLinks = [
  { label: 'Тварини', href: SITE_ROUTES.animals },
  { label: 'Як допомогти', href: SITE_ROUTES.help },
  { label: 'Послуги', href: SITE_ROUTES.services },
  { label: 'Контакти', href: SITE_ROUTES.contacts },
  { label: 'Новини', href: SITE_ROUTES.news },
]

type FooterNewsItem = {
  id: string
  slug: string
  title: string
  published_at: string | null
}

export default function Footer() {
  const year = new Date().getFullYear()
  const [latestNews, setLatestNews] = useState<FooterNewsItem[]>([])
  const latestReport = reports[0]

  useEffect(() => {
    let isMounted = true
    const supabase = getSupabaseBrowserClient()

    async function loadLatestNews() {
      const { data } = await supabase
        .from('news_posts')
        .select('id, slug, title, published_at')
        .eq('is_published', true)
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(2)

      if (isMounted) {
        setLatestNews((data ?? []) as FooterNewsItem[])
      }
    }

    void loadLatestNews()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <footer className="bg-text-main text-white">
      <Section className="py-9 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.8fr)_minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-x-8 xl:grid-cols-[360px_220px_240px_300px] xl:justify-between">
          <section className="min-w-0 overflow-hidden">
            <Link href={SITE_ROUTES.home} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <Heart className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-base font-black leading-snug">Центр допомоги тваринам</span>
                <span className="mt-1 block text-sm leading-6 text-white/54">
                  {SITE_CONTACTS.city}, {SITE_CONTACTS.street}
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/58">
              Відлов, лікування, стерилізація, прилаштування та консультації для власників домашніх улюбленців.
            </p>

            <div className="mt-5 flex max-w-full gap-2 overflow-hidden">
              {socialLinks.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className={`group flex h-10 max-w-10 items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] px-[11px] text-white/62 transition-[max-width,border-color,background-color,color] duration-300 hover:border-orange-300/40 hover:bg-primary hover:text-white focus-visible:border-orange-300/40 focus-visible:bg-primary focus-visible:text-white focus-visible:outline-none ${item.expandedWidth}`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span className="ml-2 whitespace-nowrap text-sm font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {item.label}
                    </span>
                  </a>
                )
              })}
            </div>
          </section>

          <FooterSection title="Контакти" icon={Phone}>
            <FooterContact href={SITE_CONTACTS.phoneHref} icon={Phone}>
              {SITE_CONTACTS.phoneDisplay}
            </FooterContact>
            <FooterContact href={SITE_CONTACTS.emailHref} icon={Mail}>
              {SITE_CONTACTS.email}
            </FooterContact>
            <FooterContact href={SITE_ROUTES.contactsSchedule} icon={Clock}>
              {SITE_CONTACTS.scheduleShort}
            </FooterContact>
            <FooterContact href={SITE_CONTACTS.mapHref} icon={MapPin} external>
              {SITE_CONTACTS.addressShort}
            </FooterContact>
          </FooterSection>

          <FooterSection title="Навігація" icon={FileText}>
            {quickLinks.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
            {latestReport ? <FooterLink href={SITE_ROUTES.news}>{latestReport.title}</FooterLink> : null}
          </FooterSection>

          <FooterSection title="Новини" icon={Newspaper}>
            {latestNews.map((item) => (
              <Link
                key={item.id}
                href={buildNewsHref(item.slug ?? item.id)}
                className="group block border-b border-white/8 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="line-clamp-2 text-sm font-bold leading-5 text-white/78 transition group-hover:text-white">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs font-bold text-orange-200/72">{formatFooterNewsDate(item.published_at)}</span>
              </Link>
            ))}
            <FooterLink href={SITE_ROUTES.news}>Всі новини</FooterLink>
          </FooterSection>
        </div>

        <Link
          href={SITE_ROUTES.services}
          className="group mt-8 grid gap-4 border-y border-white/10 py-5 transition hover:border-orange-200/35 md:grid-cols-[auto_minmax(0,1fr)] md:items-center lg:grid-cols-[auto_minmax(0,1fr)_auto]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/6 text-orange-200 transition group-hover:bg-primary group-hover:text-white">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-black uppercase tracking-[0.14em] text-white">Комерційні послуги центру</span>
            <span className="mt-1 block max-w-3xl text-sm leading-6 text-white/56">
              Окремі послуги для домашніх тварин: актуальні деталі, умови та запис на сторінці послуг.
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-black text-orange-200 transition group-hover:text-white md:col-start-2 lg:col-start-auto">
            Детальніше
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 text-center text-xs font-semibold leading-5 text-white/38 lg:flex-row lg:justify-between lg:text-left">
          <p className="max-w-4xl">© {year} Центр надання допомоги безпритульним тваринам м. Черкаси.</p>
          <p className="shrink-0">Розробка та дизайн by Yaroslav Solomianyi.</p>
        </div>
      </Section>
    </footer>

  )
}

function formatFooterNewsDate(value: string | null) {
  if (!value) {
    return 'Без дати'
  }
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Без дати'
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function FooterSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="group min-w-0 overflow-hidden">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-white sm:text-[15px]">
          <Icon className="h-4 w-4 shrink-0 text-orange-200" />
          <span className="truncate">{title}</span>
        </h3>

        <span className="mt-2 block h-0.5 w-full rounded-full bg-primary transition-all duration-300 lg:w-10 lg:group-hover:w-full" />
      </div>

      <div className="min-w-0 space-y-2.5">{children}</div>
    </section>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 text-sm font-semibold leading-5 text-white/58 transition hover:text-white"
    >
      <span className="min-w-0 break-words">{children}</span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/24 transition group-hover:translate-x-0.5 group-hover:text-orange-200" />
    </Link>
  )
}

function FooterContact({
  href,
  icon: Icon,
  children,
  external = false,
}: {
  href: string
  icon: LucideIcon
  children: ReactNode
  external?: boolean
}) {
  const className = 'flex items-center gap-2.5 text-sm font-semibold leading-5 text-white/58 transition hover:text-white'
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0 text-orange-200/82" />
      <span className="min-w-0 truncate">{children}</span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}
