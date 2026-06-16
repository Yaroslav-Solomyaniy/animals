import React from 'react'
import { ArrowRight, MessageCircle, Phone, Sparkles, Stethoscope } from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'

const NeedService = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#be4b42_0%,#d96f49_42%,#9f4b6b_78%,#249c9a_142%)] px-4 py-18 text-white shadow-[0_26px_90px_rgba(190,75,66,0.16)] sm:px-6 lg:px-8">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[46%] bg-white/8 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:block"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />

      <div className="relative mx-auto max-w-336">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-orange-100 shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
              <Sparkles className="h-4 w-4" />
              Запис на послугу
            </p>
            <h2 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">Потрібна ветеринарна послуга?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              Зателефонуйте або напишіть нам. Ми уточнимо симптоми, підкажемо потрібну процедуру і запропонуємо зручний час.
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {['Огляд', 'Підбір процедури', 'Зручний час'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/16 bg-white/10 px-4 py-3 shadow-sm">
                  <p className="text-sm font-extrabold text-white/88">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-white/16 bg-white p-4 text-gray-950 shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
            <div className="rounded-[26px] bg-gray-50 p-4 text-gray-950">
              <div className="mb-4 flex items-center justify-between gap-4 px-1">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-gray-500">Швидкий контакт</p>
              </div>
              <div className="flex flex-col gap-3">
                <LinkButton href={SITE_CONTACTS.phoneHref} size="lg" className="w-full justify-between rounded-2xl">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Зателефонувати
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </LinkButton>
                <LinkButton href={SITE_ROUTES.contacts} variant="secondary" size="lg" className="w-full justify-between rounded-2xl">
                  Заповнити форму
                  <MessageCircle className="h-5 w-5" />
                </LinkButton>
                <LinkButton href={SITE_ROUTES.services} variant="dark" size="lg" className="w-full justify-between rounded-2xl">
                  Перелік послуг
                  <Stethoscope className="h-5 w-5" />
                </LinkButton>
              </div>
            </div>
            <p className="mt-4 rounded-[22px] border border-orange-100 bg-orange-50 px-4 py-4 text-sm font-semibold leading-6 text-orange-900/75">
              Якщо ситуація термінова, краще одразу телефонувати. Так команда швидше зорієнтується і підкаже наступний крок.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NeedService
