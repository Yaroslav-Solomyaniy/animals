import React from 'react'
import { ArrowRight, MessageCircle, Phone, Sparkles, Stethoscope } from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import { ServiceOrderDialog } from '@/components/ServiceOrderDialog'

const NeedService = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#be4b42_0%,#d96f49_42%,#9f4b6b_78%,#249c9a_142%)] px-8 py-8 text-white shadow-[0_26px_90px_rgba(190,75,66,0.16)] sm:py-10 lg:py-16">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[46%] bg-white/8 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:block"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />

      <div className="relative mx-auto max-w-336">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-[1fr_320px] md:items-center md:gap-8 lg:grid-cols-[1fr_480px] lg:gap-10">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-extrabold text-orange-100 shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:text-sm">
              <Sparkles className="h-4 w-4" />
              Запис на послугу
            </p>
            <h2 className="max-w-3xl text-[28px] font-black leading-tight text-white sm:text-4xl lg:text-5xl">Потрібна ветеринарна послуга?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/78 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              Зателефонуйте або напишіть нам. Ми уточнимо симптоми, підкажемо потрібну процедуру і запропонуємо зручний час.
            </p>

            <div className="mt-5 grid max-w-2xl gap-2 sm:mt-7 sm:grid-cols-3 sm:gap-3 lg:mt-8">
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
              <div className="grid grid-cols-1 gap-2">
                <LinkButton href={SITE_CONTACTS.phoneHref} size="sm" className="h-10 w-full justify-between rounded-2xl px-4 text-sm sm:h-11">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                    Зателефонувати
                  </span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </LinkButton>
                <ServiceOrderDialog
                  trigger={
                    <button className="flex h-10 w-full items-center justify-between rounded-2xl bg-gray-200 px-4 text-sm font-bold text-gray-900 transition hover:bg-gray-300 sm:h-11">
                      <span className="inline-flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        Заповнити форму
                      </span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  }
                />
                <LinkButton href={SITE_ROUTES.services} variant="dark" size="sm" className="h-10 w-full justify-between rounded-2xl px-4 text-sm sm:h-11">
                  Перелік послуг
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
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
