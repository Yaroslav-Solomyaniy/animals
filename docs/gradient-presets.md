# Gradient presets

Набір градієнтів, які вже добре виглядають у проєкті. Тримай їх тут як швидку палітру для CTA, сервісних карток і теплих промо-блоків.

## Soft Orange / Cyan

М'який світлий градієнт для карток, промо-блоків і секцій із темним текстом.

```tsx
bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_42%,#ecfeff_100%)]
```

Tailwind shorthand variant:

```tsx
bg-linear-to-br from-[#fff7ed] via-white to-[#ecfeff]
```

Used in:

- `app/page.tsx` - block "Комерційні послуги центру"
- `app/services/page.tsx` - block "Для власників собак і котів"

## Green / Teal / Orange

Насичений full-width CTA з головної сторінки. Добре працює з білим текстом і білими CTA-картками поверх.

```tsx
bg-[linear-gradient(135deg,#1f6f50_0%,#12685f_56%,#f97316_150%)]
```

Nice extras:

```tsx
text-white
shadow-[0_26px_90px_rgba(18,104,95,0.18)]
```

Used in:

- `app/page.tsx` - CTA "Готові змінити чиєсь життя?"

## Coral / Berry / Teal

Теплий, але не кислотний CTA: корал, м'який помаранчевий, ягідний проміжний тон і бірюзовий вихід.

```tsx
bg-[linear-gradient(135deg,#be4b42_0%,#d96f49_42%,#9f4b6b_78%,#249c9a_142%)]
```

Nice extras:

```tsx
text-white
shadow-[0_26px_90px_rgba(190,75,66,0.16)]
```

Used in:

- `app/services/page.tsx` - CTA "Потрібна ветеринарна послуга?"

## Dark Card with Color Glow (CTA картки)

Темні картки з кольоровим світінням — єдиний стиль для CTA-гридів. Світло розливається з верхнього правого кута на більшу частину картки.

```tsx
// Обгортка картки
<div className="relative overflow-hidden rounded-4xl bg-gray-900 p-8">

  {/* Кольоровий glow — замінити GLOW_COLOR на потрібний rgba */}
  <div
    className="pointer-events-none absolute inset-0"
    style={{ background: `radial-gradient(ellipse 180% 140% at 90% -20%, GLOW_COLOR, transparent 60%)` }}
  />

  {/* Контент */}
  <Icon className="relative mb-6 h-10 w-10 text-COLOR-400" />
  <h3 className="relative text-2xl font-black text-white">{title}</h3>
  <p className="relative mt-3 leading-7 text-gray-400">{description}</p>
  <LinkButton href={href} variant="light" size="lg" className="relative mt-8">
    {label}
  </LinkButton>
</div>
```

Кольори glow по темах:
- Помаранчевий: `rgba(242,116,56,0.40)`
- Блакитний: `rgba(14,165,233,0.40)`
- Зелений: `rgba(16,185,129,0.40)`
- Фіолетовий: `rgba(139,92,246,0.40)`

Used in:
- `app/help-for-us/page.tsx` - CTA секція (зараз конвертована у світлий стиль)

---

## Shared CTA Accent

Діагональна світла форма справа, добре працює на темних або насичених full-width CTA.

```tsx
<span
  aria-hidden="true"
  className="absolute inset-y-0 right-0 hidden w-[46%] bg-white/8 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] lg:block"
/>
```

Тонкі лінії зверху/знизу для full-width CTA:

```tsx
<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/45 to-transparent" />
<div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />
```
