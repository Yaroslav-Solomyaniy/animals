---
name: responsive
description: >
  Застосовуй цей скіл ЗАВЖДИ, коли потрібно зробити блок/компонент адаптивним у цьому проєкті.
  Тригери: «зроби адаптивним», «додай адаптивність», «responsive», «мобільна версія»,
  «не адаптивно», «виглядає погано на мобільному», або коли створюєш новий компонент
  і треба одразу вписати responsive-класи. Скіл містить єдиний еталонний шаблон
  адаптивності для проєкту shelter (Next.js + Tailwind v4).
---

# Responsive Skill — Shelter Project

## Стек і контекст

- **Tailwind CSS v4** — використовується через `@import 'tailwindcss'` в `globals.css`.
- Брейкпоінти: `sm` (640 px), `md` (768 px), `lg` (1024 px), `xl` (1280 px).
- Кастомний контейнер: `max-w-336` (84 rem / 1344 px).
- Кольори: `primary` (#f27438), `secondary` (#2d6a4f), `text-main` (#1f2937).
- Компонент `<Section>` автоматично додає `px-4 sm:px-6 lg:px-8` і `max-w-336` — не дублюй їх вручну всередині нього.

---

## Єдиний шаблон адаптивності

Нижче — повна система токенів. Вибирай відповідний рівень для кожного елемента.

### 1. Секція (вертикальні відступи)

```
py-12 sm:py-16 md:py-20 lg:py-24          ← стандарт для більшості секцій
py-10 sm:py-12 lg:py-16                    ← компактна секція / підсекція
pb-10 sm:pb-12 lg:pb-16                    ← тільки знизу (після Section)
```

### 2. Горизонтальні відступи (якщо НЕ в `<Section>`)

```
px-4 sm:px-6 lg:px-8
```

### 3. Типографіка

| Роль | Класи |
|---|---|
| Label / tag (мітка над заголовком) | `text-xs font-extrabold uppercase tracking-[0.14em] sm:text-sm` |
| Підзаголовок / body | `text-sm leading-6 text-gray-500 sm:text-base sm:leading-7` |
| Body великий | `text-base leading-7 text-gray-500 sm:text-lg sm:leading-8` |
| Заголовок малий (картка) | `text-xl font-bold text-text-main sm:text-2xl` |
| Заголовок середній | `text-2xl font-extrabold leading-tight text-text-main sm:text-3xl md:text-4xl` |
| Заголовок секції | `text-3xl font-extrabold leading-tight text-text-main sm:text-4xl md:text-5xl` |
| Заголовок великий (hero) | `text-3xl font-black leading-tight text-text-main sm:text-4xl md:text-5xl lg:text-6xl` |

### 4. Відступи між заголовками та контентом

```
mb-3 sm:mb-4                               ← label → heading
mb-4 sm:mb-5 lg:mb-6                       ← heading → paragraph у картці
mb-7 sm:mb-9 md:mb-10 lg:mb-14            ← header-блок секції → основний контент
mt-4 sm:mt-5                               ← paragraph після heading
```

### 5. Картки — padding

```
p-4 sm:p-6                                 ← мала картка
p-4 sm:p-6 lg:p-8                          ← стандартна картка
p-4 sm:p-6 lg:p-10                         ← велика / featured картка
px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12  ← hero-блок (Welcome)
```

### 6. Картки — рамки та тіні

```
rounded-2xl sm:rounded-3xl                 ← картка всередині секції
rounded-3xl sm:rounded-4xl                 ← велика картка / модальне вікно
rounded-[28px] sm:rounded-[36px]           ← SectionFrame (orange-neon / section-frame)
```

### 7. Іконки та їх контейнери

```
Іконка мала:      h-4 w-4 sm:h-5 sm:w-5
Іконка середня:   h-5 w-5 sm:h-6 sm:w-6
Іконка велика:    h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8
Іконка XL:        h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12

Контейнер S:      h-9 w-9 rounded-xl sm:h-10 sm:w-10 sm:rounded-2xl
Контейнер M:      h-11 w-11 rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl
Контейнер L:      h-12 w-12 rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl
```

### 8. Кнопки (висота)

```
h-10 w-full rounded-xl text-sm font-bold sm:h-11 sm:font-extrabold     ← у формах всередині карток
h-10 rounded-xl px-4 text-sm sm:h-11 sm:px-5                           ← компактна кнопка
h-11 rounded-xl px-4 text-sm sm:h-12 sm:px-5                           ← стандартна кнопка
h-11 rounded-2xl px-6 sm:h-12 lg:h-13 lg:w-64                          ← велика CTA-кнопка
```

### 9. Сітки

#### 2 колонки
```jsx
<div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
```

#### 3 колонки
```jsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
```

#### Асиметрична (текст + блок)
```jsx
<div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-center md:gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10">
```

#### Секція header + CTA (заголовок зліва, кнопка справа)
```jsx
<div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-6">
```

### 10. Горизонтальний flex → grid на мобільному

```
flex flex-col gap-3 sm:flex-row sm:gap-4               ← кнопки / теги в рядок з sm
flex flex-col gap-3 sm:flex-row lg:flex-col lg:gap-3   ← кнопки в рядок на sm, знову стовпчик на lg
flex flex-wrap gap-2 sm:gap-3                          ← теги / чіпи
```

### 11. Negative margin для full-bleed карусель

```
-mx-4 sm:-mx-6 lg:-mx-8     ← зовні контейнера
px-4 sm:px-6 lg:px-8        ← всередині, на самому списку
```

---

## Процес застосування скілу

Отримавши блок для адаптивності:

1. **Визнач тип елемента** (секція / картка / типографіка / іконка / сітка / кнопка).
2. **Підбери токени** з таблиць вище — не вигадуй нових значень.
3. **Перевір**, чи блок знаходиться всередині `<Section>` — якщо так, не додавай `px-4 sm:px-6 lg:px-8` і `max-w-336` ще раз.
4. **Застосуй зміни** мінімальними diff-ами: тільки додавай відсутні breakpoint-класи, не переписуй логіку.
5. **Не додавай** медіа-запити вручну (`@media`). Лише Tailwind-утиліти.

---

## Приклади

### Секція без адаптивності → з адаптивністю

**До:**
```jsx
<section className="py-12 px-4 bg-white">
  <h2 className="text-2xl font-bold mb-4">Заголовок</h2>
  <p className="text-sm text-gray-500">Текст</p>
</section>
```

**Після:**
```jsx
<Section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
  <h2 className="mb-4 sm:mb-5 text-3xl font-extrabold leading-tight text-text-main sm:text-4xl md:text-5xl">
    Заголовок
  </h2>
  <p className="text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">Текст</p>
</Section>
```

---

### Картка без адаптивності → з адаптивністю

**До:**
```jsx
<div className="rounded-2xl border bg-white p-4 shadow">
  <Gift className="h-6 w-6 mb-4 text-primary" />
  <h3 className="text-lg font-bold">Назва</h3>
  <p className="text-sm text-gray-500 mt-2">Опис</p>
</div>
```

**Після:**
```jsx
<div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-soft
                sm:rounded-4xl sm:p-6 lg:p-8">
  <div className="mb-5 h-12 w-12 rounded-xl bg-primary/10 text-primary
                  sm:mb-6 sm:h-14 sm:w-14 sm:rounded-2xl
                  flex items-center justify-center">
    <Gift className="h-6 w-6 sm:h-7 sm:w-7" />
  </div>
  <h3 className="mb-3 text-xl font-bold text-text-main sm:text-2xl">Назва</h3>
  <p className="text-sm leading-6 text-gray-500 sm:text-base sm:leading-7 mt-2">Опис</p>
</div>
```

---

### Сітка карток

**До:**
```jsx
<div className="grid gap-4">
  {cards.map(…)}
</div>
```

**Після (3 колонки):**
```jsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
  {cards.map(…)}
</div>
```

---

## Що НЕ робити

- Не використовувати довільні значення (наприклад, `py-[52px]`) — тільки стандартні кроки шкали.
- Не додавати `xl:`-брейкпоінти без чіткої потреби (у проєкті вони зустрічаються рідко і тільки для каруселі).
- Не дублювати `px-4 sm:px-6 lg:px-8` всередині `<Section contained>` — компонент вже містить їх.
- Не міняти логіку компонента — тільки додавати responsive-класи.
- Не використовувати `@media` CSS — тільки Tailwind-утиліти.
