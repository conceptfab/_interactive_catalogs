# Szablon katalogow - struktura tresci

Nazwa folderu glownego = nazwa kolekcji (np. QX, QS, TS).

## Plik konfiguracyjny globalny

`public/config.json` - ustawienia dla calej aplikacji:

- `brandName` - nazwa marki w nawigacji
- `siteTitle` - tytul na stronie glownej
- `siteSubtitle` - podtytul na stronie glownej
- `footerText` - tekst w stopce
- `catalogListTitle` - naglowek listy katalogow

## Struktura

```text
config.json                 <- konfiguracja globalna (w public/)
catalogs/
  index.json                <- lista katalogow (dodaj nowy ID do tablicy)
  QX/                       <- folder = nazwa kolekcji
    config.json             <- definicje globalne (meta, sections)
    hero/
      content.json
      slider.json           <- nowy plik: ustawienia slidera + opisy slajdow
      hero_00.jpg
      hero_01.jpg
      ...
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

1. Skopiuj folder `QX` i zmien nazwe na nazwe kolekcji (np. `QS`).
2. Edytuj `config.json` - meta, sections.
3. Edytuj pliki `content.json` w kazdej sekcji.
4. Podmien obrazy w podfolderach (nazwy plikow zgodne z `content.json`).
5. Dodaj nowy identyfikator do tablicy `catalogs` w `index.json`.

## Hero - nowy model slidera per katalog

W kazdym folderze `QX-*/hero/` konfigurujesz slider osobno przez `slider.json`.

### `hero/content.json`

Trzyma tylko tresci sekcji hero (bez ustawien slidera):

```json
{
  "brandLabel": "",
  "collectionName": "QX Series",
  "tagline": "Modular desk system engineered for the modern workspace.",
  "taglineLine2": "Where precision meets flexibility.",
  "ctaLabel": "Explore Collection",
  "heroImage": "hero-office.jpg",
  "heroImageAlt": "QX desk system in a modern open-space office with people working"
}
```

### `hero/slider.json`

Trzyma ustawienia slidera, definicje slajdow (kolejnosc + opisy) oraz styl opisu tylko dla tego katalogu:

```json
{
  "settings": {
    "autoAdvance": true,
    "interval": 5000,
    "pauseOnHover": true,
    "transitionMs": 900,
    "showArrows": true,
    "showDots": true,
    "initialSlide": 0
  },
  "slides": [
    {
      "image": "hero_00.jpg",
      "alt": "Accessible alt text",
      "description": "Visible description/caption for this slide"
    },
    {
      "image": "hero_01.jpg"
    }
  ],
  "descriptionStyle": {
    "enabled": true,
    "position": "bottom-left",
    "offsetPx": 34,
    "textColor": "#F4ECE4",
    "backgroundColor": "rgba(17,15,13,0.55)",
    "backdropBlurPx": 8,
    "paddingX": 18,
    "paddingY": 10,
    "borderRadiusPx": 14,
    "fontSizePx": 14,
    "fontWeight": 600,
    "letterSpacingEm": 0.02,
    "maxWidth": "520px",
    "textAlign": "left",
    "uppercase": false
  }
}
```

- `slides` definiuje kolejnosc slajdow.
- `alt` jest opcjonalny (fallback do `heroImageAlt`).
- `description` jest opcjonalny i moze byc wyswietlany na hero.
- `descriptionStyle` dziala per katalog `QX-*` (zmiana w jednym `slider.json` nie zmienia innych).
- Jesli `slider.json` nie istnieje, aplikacja fallbackuje do auto-detekcji `hero_00.jpg`, `hero_01.jpg`, itd.

## Sciezki do obrazow

W `content.json` uzywaj nazw plikow wzglednych do folderu sekcji:

- `hero/hero-office.jpg` -> w `hero/content.json`: `"heroImage": "hero-office.jpg"`
- `hero/hero_00.jpg`, `hero_01.jpg`, ... -> automatycznie wykrywane fallbackowo
- `gallery/packshot.jpg` -> w `gallery/content.json`: `"image": "packshot.jpg"` (w obiekcie images)
