import {
  ArrowRight,
  HeartPulse,
  RotateCcw,
  Shield,
  Stethoscope,
} from 'lucide-react'
import CityProgramBlocks from '@/components/city-program/city-programs-blocks'

const services = [
  {
    icon: Shield,
    title: 'Відлов',
    text: 'Гуманний відлов безпритульних тварин без шкоди для людей і тварин.',
  },
  {
    icon: Stethoscope,
    title: 'Стерилізація',
    text: 'Медична операція для стабілізації популяції безпритульних собак.',
  },
  {
    icon: HeartPulse,
    title: 'Вакцинація',
    text: 'Захист від сказу та інших хвороб, медичний догляд і спостереження.',
  },
  {
    icon: RotateCcw,
    title: 'Повернення',
    text: 'Кліпсування та випуск у безпечне середовище після процедур.',
  },
]

export default function CityProgram() {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto grid max-w-[calc(80rem+4rem)] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <CityProgramBlocks />

        <div>
          <p className="mb-3 text-sm font-extrabold tracking-wider text-primary uppercase">
            Міська програма
          </p>
          <h2 className="mb-5 text-4xl font-extrabold leading-tight text-text-main md:text-5xl">
            Допомога безпритульним тваринам у Черкасах
          </h2>
          <div className="mb-8 max-w-2xl space-y-3 text-lg leading-8 text-gray-500">
            <p>
              Вже понад 3 роки Центр надання допомоги безпритульним тваринам на
              базі Черкаської служби чистоти дарує тваринам надію на нове життя.
            </p>
            <p>
              У притулку є просторі вольєри, регулярне харчування, медичний
              догляд і щоденна турбота про чотирилапих.
            </p>
          </div>

          <div className="space-y-5">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <div
                  key={service.title}
                  className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="mb-2 text-xl font-extrabold text-text-main">
                      {service.title}
                    </h3>
                    <p className="leading-7 text-gray-500">{service.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-7 max-w-2xl border-l-4 border-primary pl-4 text-sm font-bold leading-7 text-text-main">
            Гуманне ставлення до тварин - це ознака цивілізованого міста.
          </p>

          <a
            href="/services"
            className="mt-7 inline-flex items-center gap-2 font-extrabold text-primary transition-colors hover:text-secondary"
          >
            Детальніше про всі послуги які надає центр
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
