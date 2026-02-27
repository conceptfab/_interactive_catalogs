# Szablon katalogów – struktura treści

Nazwa folderu głównego = nazwa kolekcji (np. QX, QS, TS).

## Plik konfiguracyjny globalny

`public/config.json` – ustawienia dla całej aplikacji:

- `brandName` – nazwa marki w nawigacji
- `siteTitle` – tytuł na stronie głównej
- `siteSubtitle` – podtytuł na stronie głównej
- `footerText` – tekst w stopce
- `catalogListTitle` – nagłówek listy katalogów

## Struktura

```
config.json                 ← konfiguracja globalna (w public/)
catalogs/
  index.json              ← lista katalogów (dodaj nowy ID do tablicy)
  QX/                     ← folder = nazwa kolekcji
    config.json           ← definicje globalne (meta, sections)
    hero/
      content.json
      hero-office.jpg
    overview/
      content.json
      packshot.jpg
    gallery/
      content.json
      packshot.jpg
      hero-office.jpg
      ...
    variants/
      content.json
      packshot.jpg
    dimensions/
      content.json
    materials/
      content.json
      detail.jpg
    features/
      content.json
    assembly/
      content.json
```

## Dodawanie nowego katalogu

1. Skopiuj folder `QX` i zmień nazwę na nazwę kolekcji (np. `QS`).
2. Edytuj `config.json` – meta, sections.
3. Edytuj pliki `content.json` w każdej sekcji.
4. Podmień obrazy w podfolderach (nazwy plików zgodne z content.json).
5. Dodaj `"QS"` do tablicy `catalogs` w `index.json`.

## Hero – slider

W folderze `hero/` możesz dodać pliki `hero_00.jpg`, `hero_01.jpg`, `hero_02.jpg` itd. – aplikacja wykryje je automatycznie i utworzy slider.

Opcje slidera w `hero/content.json`:

```json
"slider": {
  "autoAdvance": true,
  "interval": 5000,
  "pauseOnHover": true,
  "transitionMs": 500,
  "showArrows": true,
  "showDots": true,
  "initialSlide": 0
}
```

- `autoAdvance` – automatyczne przewijanie (domyślnie `true`)
- `interval` – odstęp między slajdami w ms (domyślnie `5000`)
- `pauseOnHover` – pauza przy najechaniu myszką (domyślnie `true`)
- `transitionMs` – czas animacji przejścia w ms (domyślnie `500`)
- `showArrows` – pokazuj strzałki prev/next (domyślnie `true`)
- `showDots` – pokazuj wskaźniki (kropki) (domyślnie `true`)
- `initialSlide` – indeks początkowego slajdu, 0-based (domyślnie `0`)

## Ścieżki do obrazów

W `content.json` używaj nazw plików względnych do folderu sekcji:

- `hero/hero-office.jpg` → w hero/content.json: `"heroImage": "hero-office.jpg"`
- `hero/hero_00.jpg`, `hero_01.jpg`, … – automatycznie wykrywane dla slidera
- `gallery/packshot.jpg` → w gallery/content.json: `"image": "packshot.jpg"` (w obiekcie images)
