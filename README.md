# Cars Platform Frontend

Nowoczesna aplikacja webowa do przeglądania, wyszukiwania i porównywania samochodów. Zbudowana z wykorzystaniem React 19 i Vite.

## 🚀 Stack technologiczny

| Technologia | Wersja | Opis |
|-------------|--------|------|
| React | 19.2 | Biblioteka UI |
| Vite | 8.0 | Build tool |
| Tailwind CSS | 4.3 | Framework CSS |
| React Router | 7.15 | Routing |
| TanStack React Query | 5.100 | Zarządzanie stanem serwera |
| Formik + Yup | 2.4 / 1.7 | Formularze i walidacja |
| i18next | 24.2 | Internacjonalizacja (PL/EN) |
| Axios | 1.16 | Klient HTTP |
| Playwright | 1.50 | Testy E2E |

## 📁 Struktura projektu

```
src/
├── api/                    # Klienci API
│   ├── apiClient.js        # Konfiguracja Axios
│   ├── auth.js             # Autentykacja
│   ├── brands.js           # Marki samochodów
│   ├── cars.js             # Samochody
│   ├── reviews.js          # Recenzje
│   ├── fuelReports.js      # Raporty zużycia paliwa
│   └── ...
├── components/             # Komponenty React
│   ├── forms/              # Komponenty formularzy
│   ├── layout/             # Layout (Header, Footer, Sidebar)
│   ├── shared/             # Współdzielone komponenty
│   └── ui/                 # Podstawowe elementy UI
├── contexts/               # React Context
│   ├── AuthContext.jsx     # Stan autentykacji
│   ├── ThemeContext.jsx    # Dark/Light mode
│   ├── LanguageContext.jsx # Język aplikacji
│   └── ToastContext.jsx    # Powiadomienia
├── features/               # Moduły funkcjonalne
│   ├── admin/              # Panel administracyjny
│   ├── brands/             # Funkcje marek
│   ├── cars/               # Funkcje samochodów
│   ├── comparison/         # Porównywarka
│   ├── fuelReports/        # Raporty paliwa
│   ├── profile/            # Profil użytkownika
│   └── reviews/            # Recenzje
├── hooks/                  # Custom hooks
│   ├── useAuth.js          # Hook autentykacji
│   ├── useDebounce.js      # Debouncing
│   ├── useTheme.js         # Motyw aplikacji
│   └── useToast.js         # Powiadomienia toast
├── i18n/                   # Tłumaczenia
│   └── locales/
│       ├── en/             # Angielski
│       └── pl/             # Polski
├── pages/                  # Strony aplikacji
│   ├── HomePage.jsx
│   ├── CarsSearchPage.jsx
│   ├── CarDetailsPage.jsx
│   ├── ComparisonPage.jsx
│   ├── ProfilePage.jsx
│   ├── AdminDashboard.jsx
│   └── ...
└── utils/                  # Funkcje pomocnicze
e2e/
├── tests/                  # Testy E2E
│   ├── auth/               # Testy autentykacji
│   ├── cars/               # Testy samochodów
│   ├── comparison/         # Testy porównywarki
│   └── ...
├── pages/                  # Page Object Model
└── fixtures/               # Dane testowe
```

## ✨ Główne funkcjonalności

- **Wyszukiwanie samochodów** - zaawansowane filtry (marka, model, rok, typ nadwozia, silnik, cena)
- **Porównywarka** - porównywanie do 4 samochodów jednocześnie
- **Szczegóły samochodu** - specyfikacje techniczne, galeria zdjęć
- **System recenzji** - dodawanie i przeglądanie recenzji użytkowników
- **Raporty zużycia paliwa** - rzeczywiste dane od użytkowników
- **Panel administracyjny** - moderacja recenzji i raportów
- **Profil użytkownika** - polubione samochody, historia
- **Dark/Light mode** - przełączanie motywu
- **Wielojęzyczność** - polski i angielski

## 🛠️ Instalacja

### Wymagania

- Node.js 22+
- npm lub yarn

### Uruchomienie lokalne

```bash
# Klonowanie repozytorium
git clone https://github.com/s27800/cars_platform_frontend.git
cd cars_platform_frontend

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### Zmienne środowiskowe

Utwórz plik `.env` w katalogu głównym:

```env
VITE_API_URL=http://localhost:8080/api
```

## 📜 Skrypty NPM

| Skrypt | Opis |
|--------|------|
| `npm run dev` | Uruchomienie serwera deweloperskiego |
| `npm run build` | Build produkcyjny |
| `npm run preview` | Podgląd buildu produkcyjnego |
| `npm run lint` | Sprawdzenie kodu ESLint |
| `npm run test:e2e` | Uruchomienie testów E2E |
| `npm run test:e2e:ui` | Testy E2E z interfejsem Playwright |
| `npm run test:e2e:debug` | Testy E2E w trybie debug |
| `npm run test:e2e:headed` | Testy E2E z widoczną przeglądarką |
| `npm run test:e2e:report` | Wyświetlenie raportu testów |

## 🧪 Testowanie

### Testy E2E (Playwright)

```bash
# Uruchomienie wszystkich testów
npm run test:e2e

# Testy z interfejsem graficznym
npm run test:e2e:ui

# Testy konkretnej kategorii
npm run test:e2e:auth       # Testy autentykacji
npm run test:e2e:cars       # Testy samochodów
npm run test:e2e:comparison # Testy porównywarki

# Pojedynczy plik testowy
npx playwright test auth.spec.ts
```

### Konfiguracja Playwright

Testy konfigurowane są w `playwright.config.ts`:
- Przeglądarki: Chromium, Firefox, WebKit
- Raportowanie: HTML, JUnit (CI)
- Screenshot przy błędzie
- Video przy pierwszym retry

## 🐳 Docker

### Build obrazu

```bash
docker build -t cars-platform-frontend .
```

### Uruchomienie kontenera

```bash
docker run -p 3000:80 cars-platform-frontend
```

## 🔗 Powiązane

- [Backend Repository](https://github.com/s27800/cars_platform_backend) - Spring Boot REST API
