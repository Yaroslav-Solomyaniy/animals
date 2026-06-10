import React from 'react'
import { ChevronRight, Heart, PawPrint} from 'lucide-react'

import { LinkButton } from '@/components/ui/Button'
import { SITE_ROUTES } from '@/lib/site-config'

const missionSteps = ['Знайомство', 'Підтримка', 'Заявка']

const JoinMission = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1f6f50_0%,#12685f_56%,#f97316_150%)] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[42%] bg-white/8 [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)] lg:block"
      />

      <div className="relative mx-auto grid max-w-336 gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-center md:gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10">
        <div className="min-w-0 max-w-3xl">
          <p className="mb-4 inline-flex h-10 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 text-xs font-extrabold uppercase tracking-[0.12em] text-orange-100 shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:mb-5 sm:h-11 sm:px-5 sm:text-sm">
            <Heart className="h-4 w-4 text-orange-200" />
            Великий шлях починається з кроку
          </p>

          <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Готові змінити чиєсь життя?
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:mt-5 sm:text-lg sm:leading-8">
            Оберіть просту дію: познайомитись із тваринами, підтримати центр
            або залишити заявку на допомогу.
          </p>


          <div className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
            {missionSteps.map((step) => (
              <span
                key={step}
                className="rounded-full border border-white/16 bg-white/10 px-3 py-2 text-xs font-extrabold text-white/86 sm:px-4 sm:text-sm"
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full rounded-3xl border border-white/16 bg-white p-4 text-gray-950 shadow-[0_28px_90px_rgba(15,23,42,0.24)] sm:p-5 lg:rounded-[28px] lg:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary sm:text-sm">
              Почати зараз
            </p>
            <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-primary">
              2 хвилини
            </span>
          </div>

          <div className="grid gap-3">
            <LinkButton
              href={SITE_ROUTES.animals}
              size="md"
              className="h-11 w-full justify-between rounded-xl px-4 text-sm sm:h-12"
            >
              Знайти друга
              <ChevronRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton
              href="#help"
              variant="dark"
              size="md"
              className="h-11 w-full justify-between rounded-xl px-4 text-sm sm:h-12"
            >
              Як допомогти
              <Heart className="h-4 w-4" />
            </LinkButton>
            <LinkButton
              href={SITE_ROUTES.walks}
              variant="outline"
              size="md"
              className="h-11 w-full justify-between rounded-xl px-4 text-sm sm:h-12"
            >
              Прогулянки з тваринами
              <PawPrint className="h-4 w-4" />
            </LinkButton>
          </div>

          <p className="mt-4 rounded-2xl bg-[#F1FFF8] px-4 py-3 text-sm font-bold leading-6 text-secondary sm:py-4">
            Усиновлення, волонтерство і донати працюють разом, коли кожен крок
            зрозумілий.
          </p>
        </div>
      </div>
    </section>
  )
}

export default JoinMission
