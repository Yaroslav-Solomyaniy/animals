import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { PetProfile } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Flame,
  Heart,
  Sparkles,
  Gift,
  CheckCircle,
  ShieldCheck,
  Check,
  Calendar,
  Info,
  ChevronDown,
  MapPin,
  Tag,
  Badge,
  AlertCircle
} from 'lucide-react';

interface StoryViewProps {
  data: PetProfile;
  onDonateTreat: () => void;
  onOpenAdopt: () => void;
  treatCount: number;
}

export default function StoryView({ data, onDonateTreat, onOpenAdopt, treatCount }: StoryViewProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  const nextSlide = () => {
    if (activeSlide < data.chapters.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  // Detailed medical record checklist for the passport card summary
  const medicalTimeline = [
    { title: 'Вакцинація проти інфекцій (DHPPi+L)', status: 'Виконано 14.03.2026', done: true },
    { title: 'Щеплення проти сказу (Rabies)', status: 'Виконано 14.03.2026', done: true },
    { title: 'Стерилізація / Хірургічне втручання', status: 'Виконано 20.10.2025', done: true },
    { title: 'Чіпування та реєстрація (ID номер)', status: 'Виконано 05.11.2025', done: true },
    { title: 'Обробка від паразитів (гельмінти/кліщі)', status: 'Оновлено 12.05.2026', done: true },
  ];

  return (
    <div className="mx-auto w-full max-w-336 space-y-12 px-4 font-sans sm:px-6 lg:px-8">
      
      {/* 1. EMOTIONAL SEQUENTIAL SLIDER (Top rated visual module) */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-zinc-100 flex flex-col md:flex-row min-h-[580px]">
        {/* Visual Media Side */}
        <div className="md:w-1/2 relative bg-zinc-900 min-h-[350px] md:min-h-auto overflow-hidden">
          {/* Progress Indicators */}
          <div className="absolute top-4 left-0 right-0 z-30 flex gap-1.5 px-4">
            {data.chapters.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className="h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
              >
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{
                    width: idx === activeSlide ? '100%' : idx < activeSlide ? '100%' : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={data.chapters[activeSlide].image}
                alt={data.chapters[activeSlide].title}
                className="w-full h-full object-cover brightness-95 focus:outline-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
            </motion.div>
          </AnimatePresence>

          {/* Quick Pet Overlay Name */}
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              {data.badges.map((b, i) => (
                <span
                  key={i}
                  className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/10"
                >
                  {b}
                </span>
              ))}
            </div>
            <h3 className="text-3.5xl font-extrabold tracking-tight text-white">{data.name}</h3>
            <p className="text-xs text-zinc-300 font-medium mt-0.5">
              {data.gender} • {data.age} • Компактний пес до 10 кг
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-3 z-30">
            {activeSlide > 0 && (
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              >
                <ChevronLeft className="w-5 h-5 pointer-events-none" />
              </button>
            )}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-3 z-30">
            {activeSlide < data.chapters.length - 1 && (
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              >
                <ChevronRight className="w-5 h-5 pointer-events-none" />
              </button>
            )}
          </div>
        </div>

        {/* Narrative Side */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between bg-zinc-50/50">
          <div>
            {/* Header / Accent Ribbon */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-xl bg-orange-100/80 text-orange-600">
                {getIcon(data.chapters[activeSlide].icon)}
              </div>
              <div>
                <span className="text-xs text-zinc-400 font-bold tracking-wider block uppercase">
                  Книга історій • Розділ {activeSlide + 1}
                </span>
                <span className="text-sm font-semibold text-zinc-700">
                  {activeSlide === 0 ? 'Дитинство та краса' : activeSlide === 1 ? 'Жахлива ніч' : 'Світла надія'}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-950 tracking-tight leading-snug">
                  {data.chapters[activeSlide].title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-normal whitespace-pre-line">
                  {data.chapters[activeSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quote block inside narrative section */}
            {activeSlide === 0 && (
              <div className="mt-6 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 italic text-xs text-zinc-500">
                &quot;Він яскравий, як тепла осінь. Коли дивишся в його очі, розумієш, що це найщиріше сонечко...&quot;
              </div>
            )}
            {activeSlide === 1 && (
              <div className="mt-6 p-4 bg-red-500/5 rounded-2xl border border-red-500/10 italic text-xs text-zinc-500">
                &quot;Дім згорів ущент, але любов у душі Рижика вціліла. Йому потрібне безпечне небо над головою.&quot;
              </div>
            )}
            {activeSlide === 2 && (
              <div className="mt-6 p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10 italic text-xs text-zinc-700">
                <span className="font-semibold block not-italic text-teal-800 text-[11px] mb-1">
                  🐾 Особливий статус: Забронювати хвостика
                </span>
                Він уже повністю підготовлений до знайомства! Можна приїхати у гості.
              </div>
            )}
          </div>

          {/* Interactive triggers in the storybook */}
          <div className="mt-10 pt-6 border-t border-zinc-200/60 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onDonateTreat}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#e87042] font-semibold text-xs border border-orange-200/50 active:scale-95 transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                Дати смаколик ({treatCount})
              </button>

              <button
                onClick={onOpenAdopt}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#e87042] hover:bg-[#d65e31] text-white font-semibold text-xs shadow-md shadow-orange-500/15 active:scale-95 transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Стати другом
              </button>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-zinc-400 font-sans tracking-wide">
                *Ваші смаколики зберігаються у локальній базі браузера
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE COMPREHENSIVE DETAILS HUB (The "Everything about Ryzhik" section requested by the user) */}
      <div className="space-y-8">
        {/* Elegant Section Tite Separator */}
        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#e87042] block">
              повне досьє
            </span>
            <h2 className="text-2.5xl font-extrabold text-zinc-900 tracking-tight mt-1">
              Усі подробиці про Рижика
            </h2>
          </div>
          <div className="text-xs text-zinc-500 bg-zinc-200/50 px-3.5 py-1.5 rounded-xl flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Оновлено медичною картою притулку: 2026-05-28
          </div>
        </div>

        {/* Layout: Bento Grid & Two-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Biometrics & Medical Passport cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Passport/Biometrics File Card */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200/70 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
                📂 Фізичні та анкетні дані
              </h4>
              
              <div className="divide-y divide-zinc-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-500 font-medium">Стать:</span>
                  <span className="font-bold text-zinc-900">{data.gender} / Male</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-500 font-medium">Вік:</span>
                  <span className="font-bold text-zinc-900">{data.age} / 6 Years</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-500 font-medium">Розмір та вага:</span>
                  <span className="font-bold text-zinc-900">{data.size} (9.8 кг)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-500 font-medium font-sans">Вовна / Шубка:</span>
                  <span className="font-semibold text-amber-700">Яскраво-руда, пухнаста</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-zinc-500 font-medium">Номер мікрочіпа:</span>
                  <span className="font-bold text-teal-600 font-mono">UA-903901-20</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">Локація притулку:</span>
                  <span className="font-semibold text-zinc-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Київська зона
                  </span>
                </div>
              </div>

              {/* Character tag tags cloud inside the file card */}
              <div className="pt-3 border-t border-zinc-100 space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Звички та риси:</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.character.map((char, index) => (
                    <span 
                      key={index}
                      className="text-[10px] font-semibold bg-orange-50 text-[#e87042] border border-orange-100 px-2 py-0.5 rounded-md"
                    >
                      ✦ {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinical & Veterinary Passport Card */}
            <div className="bg-zinc-900 text-zinc-100 rounded-2xl p-5 border border-zinc-850 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Ветеринарний статус
                </h4>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                  ПОВНІСТЮ ЗДОРОВИЙ
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {medicalTimeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5 p-2 bg-zinc-800/40 rounded-xl border border-zinc-800/50">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-200 text-[11px] leading-tight">{item.title}</p>
                      <p className="text-[9px] text-zinc-400 font-mono">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-zinc-800/30 rounded-xl border border-white/5 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Всі ветеринарні маніпуляції документовані у паперовому та цифровому паспорті України.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Full biography article & interactive Expandable FAQs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Elegant Letter / Complete Biography Section */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-zinc-200/70 shadow-sm space-y-5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">
                ✦ ПОВНА ІСТОРІЯ ЖИТТЯ ТА РЯТУНКУ
              </span>
              
              <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                Хто ж такий Рижик і чому він опинився у притулку?
              </h3>

              <div className="space-y-4 text-sm text-zinc-600 leading-relaxed font-sans">
                {data.fullStory.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line text-zinc-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex gap-3.5 items-start">
                <span className="text-xl">💡</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  <span className="font-bold text-zinc-900 block mb-0.5">Чому Рижик — ідеальний компаньйон?</span>
                  Собаки, які мали досвід домашнього виховання у похилому віці або з турботливою людиною, орієнтуються на звички господаря моментально. Йому не потрібне довготривале навчання — він вже знає та дотримується усіх домашніх регламентів.
                </p>
              </div>
            </div>

            {/* Interactive FAQ accordion block */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/70 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">
                ✦ ЧАСТІ ЗАПИТАННЯ ТА ВІДПОВІДІ (FAQ)
              </span>

              <h4 className="text-lg font-bold text-zinc-900 tracking-tight">
                Що ще корисно знати перед адопцією?
              </h4>

              <div className="space-y-2.5">
                {data.faq.map((item, idx) => {
                  const isOpened = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border border-zinc-100 rounded-xl overflow-hidden transition-all bg-zinc-50/50 hover:bg-zinc-50"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpened ? null : idx)}
                        className="w-full py-3.5 px-4 text-left flex justify-between items-center gap-3 cursor-pointer select-none"
                      >
                        <span className="text-xs sm:text-sm font-bold text-zinc-800 leading-snug">
                          {item.question}
                        </span>
                        <ChevronDown 
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                            isOpened ? 'rotate-180 text-[#e87042]' : ''
                          }`} 
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpened && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 pt-1 text-xs text-zinc-600 leading-relaxed whitespace-pre-line border-t border-zinc-100/50 bg-white">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
