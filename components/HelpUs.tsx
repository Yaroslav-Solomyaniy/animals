'use client'
import Image from 'next/image';
import React, {useActionState, useState} from 'react';
import {Button, LinkButton} from "@/components/ui/Button";
import {AnimatePresence, motion} from "motion/react";
import {CheckCircle2, ChevronRight, Footprints, Gift, Heart, MapPin, PhoneCall, X} from "lucide-react";
import {getFormProps, getInputProps, useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod/v4";
import {createVolunteerRequestAction} from "@/app/volunteer/actions";
import {volunteerFormSchema} from "@/lib/admin-schemas";
import {Field} from "@/components/admin/forms/shared";
import {Input} from "@/components/ui/FormControls";
import UkrainianPhoneInput from "@/components/ui/UkrainianPhoneInput";
import {buildDonateHref} from "@/lib/donate-search-params";
import {SITE_CONTACTS, SITE_ROUTES} from "@/lib/site-config";
import dogImage from "@/public/dog.png";

const helpControlClass =
    'h-10 w-full rounded-xl text-sm font-bold normal-case tracking-normal sm:h-12 sm:font-extrabold'
const helpInputClass =
    'h-10 w-full rounded-xl px-4 py-0 text-sm font-bold leading-none sm:h-12'

const HelpUs = () => {

    return (
        <section id="help" className="bg-transparent py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-336 px-4 sm:px-6 lg:px-8">
                <h2 className="mb-10 text-center text-3xl font-extrabold text-text-main sm:mb-14 sm:text-4xl md:text-5xl lg:mb-20">
                    Як ви можете нам допомогти
                </h2>

                <div className="grid items-stretch gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:gap-8">
                    <CentreNeedList/>
                    <DonateForm/>
                    <div className="md:col-span-2 lg:col-span-1">
                        <VolunteerForm/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HelpUs;

const CentreNeedList = () => {

    return (
        <motion.div
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{delay: 0.1}}
            className="group flex h-full min-h-0 flex-col rounded-3xl border border-gray-100 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 sm:rounded-4xl sm:p-6 lg:min-h-130 lg:p-8"
        >
            <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors duration-300 group-hover:bg-secondary group-hover:text-white sm:mb-6 sm:h-14 sm:w-14">
                <Gift className="h-6 w-6 sm:h-7 sm:w-7"/>
            </div>
            <h3 className="mb-3 text-xl font-bold text-text-main sm:text-2xl">
                Список необхідного
            </h3>
            <p className="mb-5 text-sm leading-6 text-gray-500 sm:mb-6 sm:leading-relaxed">
                Тваринам постійно потрібна підтримка. Актуальні речі можна уточнити телефоном
                або переглянути у повному списку необхідного.
            </p>

            <div className="mb-5 grid gap-3">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-text-main">
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                        Що найчастіше потрібно
                    </div>
                    <p className="text-sm leading-6 text-gray-500">
                        Корм, ліки, засоби догляду та речі для комфорту тварин.
                    </p>
                </div>
            </div>

            <div className="mb-5 grid gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm leading-6 text-gray-600 sm:mb-6">
                <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                        <span className="block font-black text-text-main">Адреса передачі</span>
                        м. Черкаси, вул. Івана Мазепи, 117
                    </span>
                </p>
                <p className="flex items-start gap-3">
                    <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                        <span className="block font-black text-text-main">Перед візитом</span>
                        Краще зателефонувати:
                        {' '}
                        <a className="font-black text-primary" href={SITE_CONTACTS.phoneHref}>
                            {SITE_CONTACTS.phoneDisplay}
                        </a>
                    </span>
                </p>
            </div>

            <LinkButton
                href={`${SITE_ROUTES.help}#necessary-things`}
                className={`mt-auto ${helpControlClass}`}
            >
                Необхідні речі <ChevronRight className="h-4 w-4"/>
            </LinkButton>
        </motion.div>
    )
}
const DonateForm = () => {
    const [donationAmount, setDonationAmount] = useState('500')
    const [customDonationAmount, setCustomDonationAmount] = useState('')
    const normalizedCustomDonationAmount = normalizeDonationAmount(customDonationAmount)
    const activeDonationAmount = normalizedCustomDonationAmount || donationAmount
    const isCustomDonationAmount = Boolean(normalizedCustomDonationAmount)

    return (
        <motion.div
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            className="group flex h-full min-h-0 flex-col rounded-3xl border border-primary bg-primary p-4 text-white shadow-primary transition-all duration-300 hover:-translate-y-1 hover:border-white/40 sm:rounded-4xl sm:p-6 lg:min-h-130 lg:p-8"
        >
            <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 transition-colors duration-300 group-hover:bg-white group-hover:text-primary sm:mb-6 sm:h-14 sm:w-14">
                <Heart className="h-6 w-6 sm:h-7 sm:w-7"/>
            </div>
            <h3 className="mb-3 text-xl font-bold sm:text-2xl">Підтримка коштами</h3>
            <p className="mb-5 text-sm leading-6 text-white/80 sm:mb-6 sm:leading-relaxed lg:mb-8">
                Твій внесок допомагає забезпечити безпритульних тварин ліками,
                їжею та теплим прихистком.
            </p>

            <div className="mb-4 rounded-2xl border border-white/18 bg-white/10 p-4 text-xs leading-5 text-white/80 sm:mb-5 sm:text-sm sm:leading-6">
                <span className="mb-1 block font-black text-white">
                    Куди піде допомога
                </span>
                Корм, лікування, стерилізація та щоденний догляд за тваринами центру.
            </div>

            <div className="mb-3 grid grid-cols-3 gap-2 sm:mb-4">
                {['200', '500', '1000'].map((amount) => (
                    <Button
                        key={amount}
                        onClick={() => {
                            setDonationAmount(amount)
                            setCustomDonationAmount('')
                        }}
                        variant="ghost"
                        size="sm"
                        showIcon={false}
                        className={[
                            `${helpControlClass} border-white/35 px-2 text-white hover:border-white/70 hover:bg-white/20 hover:text-white sm:px-3`,
                            !isCustomDonationAmount && donationAmount === amount
                                ? 'border-white bg-white text-primary shadow-md shadow-orange-900/15 hover:bg-white hover:text-primary'
                                : 'bg-white/10',
                        ].join(' ')}
                    >
                        ₴{amount}
                    </Button>
                ))}
            </div>

            <div className="relative mb-4 sm:mb-5">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-white/50">
                  ₴
                </span>
                <input
                    type="text"
                    placeholder="Ввести самостійно"
                    value={customDonationAmount}
                    onChange={(event) => setCustomDonationAmount(event.target.value.replace(/\D/g, '').slice(0, 7))}
                    className={`${helpInputClass} border border-white/10 bg-white/10 pr-4 pl-8 text-white transition-all placeholder:text-white/40 focus:border-white/30 focus:outline-none`}
                />
            </div>

            <div className="mb-4 flex items-end justify-between gap-3 rounded-2xl border border-white/25 bg-white/10 p-4 text-sm text-white shadow-sm backdrop-blur sm:mb-5 sm:block">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-white/65 sm:text-xs">
                    {isCustomDonationAmount ? 'Ви ввели суму:' : 'Ви обрали суму:'}
                </span>
                <strong className="block shrink-0 text-xl font-black leading-none text-white sm:mt-1 sm:text-base">
                    ₴{activeDonationAmount}
                </strong>
            </div>

            <Button
                variant="light"
                className={`mt-auto ${helpControlClass}`}
                onClick={() => {
                    window.location.href = buildDonateHref({
                        gift: 'general',
                        amount: activeDonationAmount,
                    })
                }}
            >
                Надіслати допомогу
            </Button>
        </motion.div>
    )
}

function normalizeDonationAmount(value: string) {
    const amount = Number(value)

    return Number.isFinite(amount) && amount > 0 ? String(amount) : ''
}
const VolunteerForm = () => {
    const formDefaultValues = {name: '', phone: '', email: ''}
    const [dismissedModalId, setDismissedModalId] = useState<string | null>(null)

    const [lastResult, formAction, pending] = useActionState(createVolunteerRequestAction, undefined)
    const [form, fields] = useForm({
        lastResult,
        defaultValue: formDefaultValues ,
        onValidate({formData}) {
            return parseWithZod(formData, {
                schema: volunteerFormSchema,
                disableAutoCoercion: true,
            })
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    })
    const isSuccessModalOpen = Boolean(lastResult?.modalId && lastResult.modalId !== dismissedModalId)

    return (
        <motion.div
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{delay: 0.2}}
            className="group relative flex min-h-0 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 sm:rounded-4xl sm:p-6 md:h-full lg:min-h-130 lg:p-8"
        >
            <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Footprints className="h-7 w-7"/>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-text-main">
                Волонтерам
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-gray-500">
                Волонтерські прогулянки проводяться у вихідні. Залиште свої
                контакти, і ми зв’яжемося з вами для запису.
            </p>

            <form {...getFormProps(form)} action={formAction} className="mt-auto space-y-4">
                {form.errors?.length ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        {form.errors.join(', ')}
                    </div>
                ) : null}
                <Field label="ПІБ" errors={fields.name.errors}>
                    <Input
                        {...getInputProps(fields.name, { type: 'text' })}
                        className={helpInputClass}
                        placeholder="Ваше імʼя"
                    />
                </Field>
                <Field label="Телефон" errors={fields.phone.errors}>
                    <UkrainianPhoneInput
                        {...getInputProps(fields.phone, { type: 'tel' })}
                        className={helpInputClass}
                    />
                </Field>
                <Field label="Електронна пошта" errors={fields.email.errors}>
                    <Input
                        {...getInputProps(fields.email, {type: 'email'})}
                        className={helpInputClass}
                        placeholder="name@example.com"
                    />
                </Field>
                <div className="rounded-xl border border-primary/20 bg-orange-50 px-4 py-3 text-xs font-bold text-primary">
                    Доступно у вихідні з 11:00 до 14:00 за попереднім записом.
                </div>
                <Button
                    type="submit"
                    variant="outline"
                    className={helpControlClass}
                    disabled={pending}
                >
                    {pending ? 'Відправка...' : 'Залишити заявку'}
                </Button>
            </form>
            <VolunteerSuccessModal
                open={isSuccessModalOpen}
                emailSent={Boolean(lastResult?.emailSent)}
                message={lastResult?.message}
                onClose={() => setDismissedModalId(lastResult?.modalId ?? null)}
            />
        </motion.div>
    )
}

function VolunteerSuccessModal({
    open,
    emailSent,
    message,
    onClose,
}: {
    open: boolean
    emailSent: boolean
    message?: string
    onClose: () => void
}) {
    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    onMouseDown={onClose}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="volunteer-success-title"
                        className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
                        initial={{opacity: 0, y: 18, scale: 0.96}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 18, scale: 0.96}}
                        transition={{duration: 0.22}}
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Закрити"
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-950"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="grid md:grid-cols-[0.95fr_1.05fr]">
                            <div className="relative min-h-64 bg-orange-50 md:min-h-full">
                                <Image
                                    src={dogImage}
                                    alt="Собака центру допомоги тваринам"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent" />
                            </div>
                            <div className="p-7 sm:p-8">
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold uppercase text-emerald-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Success
                                </span>
                                <h3 id="volunteer-success-title" className="mt-5 text-3xl font-extrabold text-text-main">
                                    Заявку прийнято
                                </h3>
                                <p className="mt-4 text-base leading-7 text-slate-600">
                                    {message ?? 'Дякуємо! Ми звʼяжемося з вами для запису на волонтерську прогулянку.'}
                                </p>
                                {!emailSent ? (
                                    <p className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-primary">
                                        Email ще треба перевірити, але заявка вже є в адмінці.
                                    </p>
                                ) : null}
                                <Button type="button" className="mt-6 w-full" onClick={onClose}>
                                    Добре
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}
