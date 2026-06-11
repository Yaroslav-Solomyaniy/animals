import React from 'react'
import { Clock3 } from 'lucide-react'
import { SITE_CONTACTS, SITE_ROUTES } from '@/lib/site-config'
import { LinkButton } from '@/components/ui/Button'

const GoWalks = () => {
  return (
    <section className="px-4 pb-14 pt-8 sm:px-6 sm:pb-18 lg:px-8">
      <div className="mx-auto max-w-336 rounded-3xl border border-orange-100 bg-text-main p-6 text-white shadow-[0_28px_90px_rgba(31,41,55,0.18)] sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8 lg:p-10">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-orange-100">
            <Clock3 className="h-4 w-4" />
            {SITE_CONTACTS.walkSchedule}
          </div>
          <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl">Заплануйте прогулянку з твариною на найближчі вихідні</h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/72">
            Приходьте самі, з друзями або родиною. Для тварин це не просто прогулянка, а шанс відчути людську увагу й довіру.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
          <LinkButton href={SITE_CONTACTS.phoneHref} size="lg" className="h-13 w-full rounded-2xl px-6 lg:w-64">
            Подзвонити
          </LinkButton>
          <LinkButton href={SITE_ROUTES.contacts} variant="light" size="lg" className="h-13 w-full rounded-2xl px-6 lg:w-64">
            Контакти центру
          </LinkButton>
          <LinkButton
            href={SITE_ROUTES.contacts}
            variant="outline"
            size="lg"
            className="bg-white/10 text-white border-white h-13 w-full rounded-2xl px-6 lg:w-64"
          >
            Заповнити форму
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

export default GoWalks
