import React from 'react';
import {LinkButton} from "@/components/ui/Button";
import {ChevronRight, Heart} from "lucide-react";

const JoinMission = () => {
    return (
        <section
            className="relative overflow-hidden bg-[linear-gradient(135deg,#1f6f50_0%,#12685f_56%,#f97316_150%)] px-4 py-20 text-white sm:px-6 lg:px-8">
        <span
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[46%] bg-white/8 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:block"
        />

            <div className="relative mx-auto grid max-w-336 gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
                <div className="max-w-3xl">
                    <p className="mb-6 inline-flex h-12 items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 text-sm font-extrabold uppercase tracking-[0.16em] text-orange-100 shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
                        <Heart className="h-4 w-4 text-orange-200"/>
                        Один крок
                    </p>
                    <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                        Готові змінити чиєсь життя?
                    </h2>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
                        Оберіть просту дію: познайомитись із тваринами, підтримати центр
                        або залишити заявку на допомогу.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        {['Знайомство', 'Підтримка', 'Заявка'].map((step) => (
                            <span
                                key={step}
                                className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-extrabold text-white/86"
                            >
                  {step}
                </span>
                        ))}
                    </div>
                </div>

                <div
                    className="rounded-[28px] border border-white/16 bg-white p-5 text-gray-950 shadow-[0_28px_90px_rgba(15,23,42,0.24)]">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">
                            Почати зараз
                        </p>
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-primary">
                2 хвилини
              </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <LinkButton
                            href="/animals"
                            size="lg"
                            className="w-full justify-between rounded-2xl"
                        >
                            Знайти друга
                            <ChevronRight className="h-5 w-5"/>
                        </LinkButton>
                        <LinkButton
                            href="#help"
                            variant="dark"
                            size="lg"
                            className="w-full justify-between rounded-2xl"
                        >
                            Як допомогти
                            <Heart className="h-5 w-5"/>
                        </LinkButton>
                    </div>

                    <p className="mt-5 rounded-2xl bg-[#F1FFF8] px-4 py-4 text-sm font-bold leading-6 text-secondary">
                        Усиновлення, волонтерство і донати працюють разом, коли кожен
                        крок зрозумілий.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default JoinMission;