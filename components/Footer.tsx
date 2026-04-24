import {
  Clock,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-text-main text-white pt-16 sm:pt-20 lg:pt-24 pb-10">
      <div className="mx-auto max-w-[calc(80rem+4rem)] px-4 sm:px-6 lg:px-8">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
          {/* LOGO + TEXT */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shrink-0">
                <Heart className="text-white w-6 h-6" />
              </div>

              <div className="text-xl sm:text-2xl font-black leading-tight break-words">
                Центр надання допомоги безпритульним тваринам
                <span className="text-primary"> м. Черкаси</span>
              </div>
            </div>

            <p className="text-gray-400 text-base sm:text-lg max-w-lg leading-relaxed">
              Центр надання допомоги безпритульним тваринам м. Черкаси — це
              муніципальна служба заснована на базі Черкаської служби чистоти,
              що займається відловом, лікуванням, стерилізацією та
              прилаштуванням тварин. Працюємо задля гуманного та безпечного
              міста.
            </p>

            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/dog_help_cherkassy/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors duration-200"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61561672820969"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors duration-200"
              >
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </a>
              <a
                href="https://chistota.ck.ua"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-colors duration-200"
              >
                <Globe className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </a>
            </div>
          </div>

          {/* CONTACTS */}
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-primary">
              Контактні дані
            </h4>

            <div className="space-y-5">
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">Телефон</p>
                  <p className="font-semibold">+38 (0472) 123-456</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-yellow-300 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Електронна пошта
                  </p>
                  <p className="font-semibold">chistota_ck@ukr.net</p>
                </div>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-primary-second">
              Інформація
            </h4>

            <div className="space-y-5">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Години роботи
                  </p>
                  <p className="font-semibold">08:00 — 17:00</p>
                  <p className="text-sm text-gray-400">Понеділок-Четвер</p>
                  <p className="font-semibold">08:00 — 16:00</p>
                  <p className="text-sm text-gray-400">П&apos;ятниця</p>
                  <p className="font-semibold">08:00 — 17:00</p>
                  <p className="text-sm text-gray-400">Субота, Неділя</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Місцезнаходження
                  </p>
                  <p className="font-semibold break-words">
                    вул. Івана Мазепи, 117
                  </p>
                  <p className="text-sm text-gray-400">Черкаси, Україна</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-8 border-t border-white/10 flex flex-col gap-4 text-center md:text-left md:flex-row md:justify-between md:items-center">
          {/* COPYRIGHT */}
          <p className="text-gray-500 text-sm leading-relaxed">
            © {year} Центр надання допомоги безпритульним тваринам м. Черкаси.
            <br />
            Всі права захищено. Розробка та дизайн by Yaroslav Solomianyi.
          </p>

          {/* LINKS */}
          <div className="flex justify-center md:justify-end flex-wrap gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Public Offer
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
