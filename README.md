# Cars Platform Frontend

Aplikacja webowa do przeglądania, wyszukiwania i porównywania samochodów. Zbudowana w React 19 i Vite.

## Stack technologiczny

| Technologia | Wersja | Rola |
|-------------|--------|------|
| React | 19.2 | Biblioteka UI |
| Vite | 8.0 | Narzędzie budujące i serwer deweloperski |
| Tailwind CSS | 4.3 | Stylowanie |
| React Router | 7.15 | Routing |
| TanStack React Query | 5.100 | Stan serwera i cache zapytań |
| Formik + Yup | 2.4 / 1.7 | Formularze i walidacja |
| i18next | 24.2 | Internacjonalizacja (PL/EN) |
| Axios | 1.16 | Klient HTTP |
| Vitest | 4.1 | Testy jednostkowe |
| Testing Library | 16.3 | Testowanie komponentów |
| Playwright | 1.50 | Testy E2E |

## Architektura

Projekt jest zorganizowany wertykalnie: **jeden pakiet na funkcjonalność**. Pakiet
zawiera własne wywołania API, komponenty i strony, więc cała funkcjonalność mieści
się w jednym katalogu.

```
src/
├── app/                    # punkt kompozycji aplikacji
│   ├── main.jsx            # montowanie Reacta, providery
│   ├── App.jsx             # definicje tras
│   ├── index.css           # style globalne (Tailwind)
│   └── layout/             # powłoka: Header, Footer, MainLayout
│
├── features/               # pakiety funkcjonalne
│   ├── admin/              # moderacja: api.js + 4 strony panelu
│   ├── auth/               # logowanie i rejestracja
│   ├── brands/             # marki → modele → generacje (3 moduły API, 4 strony)
│   ├── cars/               # wyszukiwarka i karta samochodu
│   ├── comparison/         # porównywarka do 4 aut
│   ├── dataProposals/      # propozycje poprawek danych
│   ├── fuelReports/        # raporty spalania
│   ├── home/               # strona główna
│   ├── profile/            # profil i aktywność użytkownika
│   ├── reviews/            # opinie i oceny
│   └── staticPages/        # O nas, FAQ, regulamin, polityka, 404
│
├── shared/                 # elementy używane przez więcej niż jedną funkcjonalność
│   ├── api/                # apiClient (Axios), queryClient, auth, tags, likes, userSettings
│   ├── components/         # ProtectedRoute, ErrorBoundary
│   │   └── ui/             # 25 komponentów bazowych (Button, Modal, Input, …)
│   ├── contexts/           # Auth, Theme, Language, Toast
│   ├── hooks/              # useAuth, useTheme, useLanguage, useToast, useDebounce, useUserSettings
│   └── utils/              # constants.js, helpers.js, toastBus.js
│
├── i18n/                   # konfiguracja i18next
│   └── locales/{en,pl}/    # 10 przestrzeni nazw na język
│
└── test/                   # setup Vitest i wspólne narzędzia testowe
```

### Zasady zależności

| Warstwa | Może importować z |
|---------|-------------------|
| `app/` | `features/`, `shared/` |
| `features/X/` | własnego pakietu, publicznego `index.js` innego pakietu, `shared/` |
| `shared/` | wyłącznie `shared/` |

`shared/` nigdy nie zależy od `features/` — dlatego powłoka aplikacji (Header
osadzający wyszukiwarkę z pakietu `cars`) leży w `app/`, a nie w `shared/`.

Dostęp między pakietami: komponenty przez barrel (`import { CarCard } from '../cars'`),
funkcje API przez ścieżkę bezpośrednią (`import { getCarById } from '../cars/api'`),
żeby barrel nie wciągał drzewa komponentów do modułu, który potrzebuje tylko HTTP.

### Konwencje

- **Komentarze** — każdy eksportowany komponent poprzedza jednolinijkowy opis;
  komponenty o nieoczywistym kontrakcie propsów mają blok JSDoc z `@param`;
  funkcje niebędące komponentami (API, helpery, hooki) mają JSDoc zawsze.
- **Klucze React Query** — `[domena, zakres, ...parametry]`, np. `['cars', 'detail', id]`,
  `['admin', 'pendingReviews', page, size]`. Dzięki hierarchii unieważnienie
  `['admin', 'pendingReviews']` obejmuje zarówno listę stronicowaną, jak i licznik
  na pulpicie.
- **Czasy świeżości** — wyłącznie `STALE_TIME.SHORT/MEDIUM/LONG` z `shared/utils/constants.js`.
- **localStorage** — wszystkie klucze w `STORAGE_KEYS`, bo przestrzeń nazw jest wspólna.
- **Teksty** — żadnych napisów widocznych dla użytkownika w kodzie, łącznie
  z `aria-label`. Brakujący klucz ma być widoczny, dlatego `t()` nie dostaje
  tekstu zapasowego.
- **Formularze** — Formik z `useFormik`, schemat Yup w `useMemo` zależnym od `t`,
  zawsze pod nazwą `validationSchema`.

## Główne funkcjonalności

- **Wyszukiwanie samochodów** — filtry po marce, modelu, generacji, typie nadwozia,
  silniku, napędzie, skrzyni, osiągach i spalaniu
- **Porównywarka** — do 4 samochodów jednocześnie, z podświetleniem najlepszych wartości
- **Szczegóły samochodu** — specyfikacja techniczna, galeria, podobne modele
- **Opinie** — 11 kategorii ocen, moderowane przed publikacją
- **Raporty spalania** — rzeczywiste dane od użytkowników, moderowane
- **Propozycje poprawek** — zgłaszanie zmian w danych technicznych i tagach
- **Panel administracyjny** — moderacja opinii, raportów i propozycji
- **Profil użytkownika** — własne opinie, raporty i propozycje wraz ze statusem
- **Tryb jasny i ciemny** — z zapisem na koncie
- **Wielojęzyczność** — polski i angielski, z automatycznym wykryciem języka przeglądarki

## Instalacja

Wymagania: Node.js 22+.

```bash
git clone https://github.com/s27800/cars_platform_frontend.git
cd cars_platform_frontend
npm install
npm run dev
```

Serwer deweloperski startuje na `http://localhost:3000` (port ustawiony w `vite.config.js`).

### Zmienne środowiskowe

Plik `.env` w katalogu głównym:

```env
VITE_API_URL=http://localhost:8080/api
```

## Skrypty NPM

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Serwer deweloperski |
| `npm run build` | Build produkcyjny |
| `npm run preview` | Podgląd buildu produkcyjnego |
| `npm run lint` | ESLint |
| `npm run test` | Testy jednostkowe w trybie watch |
| `npm run test:run` | Testy jednostkowe jednorazowo |
| `npm run test:ui` | Testy jednostkowe z interfejsem Vitest |
| `npm run test:coverage` | Testy jednostkowe z raportem pokrycia |
| `npm run test:e2e` | Testy E2E |
| `npm run test:e2e:ui` | Testy E2E z interfejsem Playwright |
| `npm run test:e2e:debug` | Testy E2E w trybie debug |
| `npm run test:e2e:headed` | Testy E2E z widoczną przeglądarką |
| `npm run test:e2e:report` | Raport z ostatniego przebiegu E2E |
| `npm run test:e2e:auth` | Testy E2E oznaczone `@auth` |
| `npm run test:e2e:cars` | Testy E2E oznaczone `@cars` |
| `npm run test:e2e:comparison` | Testy E2E oznaczone `@comparison` |

## Testowanie

### Testy jednostkowe (Vitest + Testing Library)

**70 plików, 819 testów.** Testy leżą w katalogu `__tests__` obok kodu, który sprawdzają.

| Obszar | Pliki testowe |
|--------|---------------|
| `shared/components/ui` | 22 |
| `shared/components` (bez `ui`) | 1 |
| `shared/api` | 6 |
| `shared/contexts` | 4 |
| `shared/hooks` | 5 |
| `shared/utils` | 2 |
| `app/layout` | 3 |
| `features/*` | 27 |

```bash
npm run test:run        # jednorazowo
npm run test            # tryb watch
npm run test:coverage   # z raportem pokrycia
```

Konfiguracja w `vitest.config.js`: środowisko jsdom, setup w `src/test/setup.js`,
pokrycie liczone providerem v8 dla `src/app/layout`, `src/shared` i `src/features`.

### Testy E2E (Playwright)

**16 plików spec.** Konfiguracja w `playwright.config.ts`.

| Katalog | Pliki |
|---------|-------|
| `auth` | 3 |
| `cars` | 4 |
| `comparison` | 3 |
| `navigation` | 2 |
| `admin` | 1 |
| `fuel-reports` | 1 |
| `profile` | 1 |
| `reviews` | 1 |

Uruchamiane w pięciu konfiguracjach przeglądarek — Chromium, Firefox, WebKit oraz
mobilne Pixel 5 i iPhone 12 — po projekcie `setup`, który loguje użytkownika
testowego. Wzorzec Page Object w `e2e/pages/`.

```bash
npm run test:e2e
npx playwright test auth.spec.ts     # pojedynczy plik
```

## Docker

```bash
docker build -t cars-platform-frontend .
docker run -p 3000:80 cars-platform-frontend
```

## Powiązane

- [Backend Repository](https://github.com/s27800/cars_platform_backend) — Spring Boot REST API
