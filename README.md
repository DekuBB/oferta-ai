# OfertaAI — Web + Telegram

Aplikacja MVP, która przyjmuje zdjęcia produktu i generuje gotową ofertę sprzedażową.

## Co działa

- webowy upload 1–8 zdjęć,
- analiza zdjęć przez OpenAI Vision,
- struktura: tytuł, kategoria, marka, model, stan, kolor, materiał, zestaw, specyfikacja, widoczne wady, opis, cena sugerowana, zakres ceny, confidence,
- tryb DEMO bez klucza API,
- edycja tytułu/opisu/ceny,
- kopiowanie opisu i eksport TXT,
- endpoint Telegram webhook,
- `/start` i `/help`,
- analiza zdjęcia wysłanego do bota,
- healthcheck,
- opcjonalny schemat Supabase.

## 1. Uruchomienie lokalne

Wymagany Node.js 20+.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Linux/macOS:
```bash
cp .env.example .env.local
npm install
npm run dev
```

Otwórz `http://localhost:3000`.

Bez `OPENAI_API_KEY` aplikacja działa w trybie DEMO.

## 2. OpenAI

W `.env.local` ustaw:

```env
OPENAI_API_KEY=twoj_klucz
OPENAI_MODEL=gpt-5.6-luna
```

Klucz nigdy nie trafia do przeglądarki. Analiza wykonywana jest po stronie serwera.

## 3. Telegram

1. W Telegramie otwórz @BotFather.
2. Utwórz bota przez `/newbot`.
3. Skopiuj token do `TELEGRAM_BOT_TOKEN`.
4. Wdróż aplikację na Vercel.
5. Ustaw:
```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=losowy_tajny_tekst
TELEGRAM_WEBHOOK_URL=https://twoja-domena.vercel.app/api/telegram/webhook
```
6. Uruchom:
```bash
node scripts/set-telegram-webhook.mjs
```

Jeżeli korzystasz z Vercel, najprościej ustawić te zmienne również lokalnie i uruchomić skrypt z terminala.

## 4. Vercel

```bash
npm install -g vercel
vercel
vercel --prod
```

W Vercel → Settings → Environment Variables dodaj:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

Po zmianie zmiennych zrób redeploy.

## 5. Supabase — następny etap

Projekt zawiera `supabase/schema.sql`. Uruchom go w SQL Editor Supabase, a następnie dodaj:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

MVP w tej paczce nie wymusza bazy, żeby można było wystartować od razu.

## Bezpieczeństwo

- Nie umieszczaj `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN` ani `SUPABASE_SERVICE_ROLE_KEY` w kodzie.
- Nie commituj `.env.local`.
- Zdjęcia są przesyłane do backendu i przekazywane do modelu AI.
- Cena jest sugestią, nie automatyczną wyceną rynkową.

## Następne rozszerzenia

1. trwała historia ofert w Supabase,
2. obsługa albumów Telegram `media_group_id`,
3. PDF/DOCX/XLSX,
4. automatyczne formaty OLX / Allegro / Facebook Marketplace / eBay,
5. wyszukiwanie cen rynkowych,
6. publikowanie ofert przez oficjalne API tam, gdzie jest dostępne,
7. logowanie użytkowników i limity,
8. panel ustawień promptu i języka.
