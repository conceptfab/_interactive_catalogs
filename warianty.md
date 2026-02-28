# Warianty wizualne katalogu QX — analiza i propozycje

## Analiza istniejących kierunków (QX-0 → QX-2)

### QX-0 — Baza / Neutral Studio

- **Charakter:** czysty, neutralny punkt wyjścia — achromatic white-grey palette
- **Tło:** `#f8f8f8` (niemal biały), całkowicie bez barwy
- **Akcent:** ciemny grafit `hsl(0 0% 8%)` — zero koloru
- **Typografia:** Inter (system-level feel), `--radius: 0.25rem` — ostre rogi
- **Klimat:** katalog techniczny, zero ozdobników, maksymalna czytelność; jak karta produktu z arkusza danych
- **Charakterystyczny detal:** brak tła globalne (::before nie istnieje), minimalne zaokrąglenia ujednolicone

### QX-1 — Warm Editorial

- **Charakter:** przyjemne, ludzkie, z ciepłym oddechem — bliżej lifestyle niż technologii
- **Tło:** `hsl(42 27% 95%)` — ciepława kremowa biel z domieszką słomy
- **Akcent:** terra cotta / ceglasty `hsl(16 70% 43%)`
- **Typografia:** Outfit (nagłówki) + Manrope (body), `--radius: 1.1rem` — bardzo zaokrąglone
- **Klimat:** editorial/magazynowy, karty unoszą się i mają blur+cień, gradient tła jak w luksusowym folderze
- **Charakterystyczny detal:** fixed `::before` pseudo-element z radial-gradient w kolorze akcentu; karty `.step-card` z efektem `backdrop-filter: blur`

### QX-2 — Tech / Monospace Minimal

- **Charakter:** chłodny, precyzyjny, skojarzenia z CAD/inżynierią, UI terminala
- **Tło:** niemal identyczne z QX-0 ale z lekkim odcieniem blue-grey `hsl(220 …)`
- **Akcent:** ciemny blue-grey `hsl(220 7% 23%)` — niechromatic
- **Typografia:** Roboto Mono (wszędzie), `--radius: 1rem` (zaokrąglone kontenery) ale obrazy 4px
- **Klimat:** monospace = "inżynier patrzy na specs"; dashed borders na buttonach; sekcje bez tła; divider to przerywana linia
- **Charakterystyczny detal:** dashed hranice na buttonach, gigantyczne etykiety sekcji `font-weight: 100`, brak dekoracyjnych gradientów tła

---

## Osie różnicowania (mapa przestrzeni wizualnej)

```
         CHŁODNE ←————————————————————→ CIEPŁE
             │  QX-2 (mono, dashed)      │
    ZIMNE &  │                    QX-1   │  WARM &
    PRECYZ.  │                  (editori.│  ORGANIC
             │  QX-0 (neutral baseline)  │
         CIEMNE ←————————————————————→ JASNE
```

QX-3 i QX-4 muszą zajmować nowe miejsca w tej siatce i unikać nakładania z istniejącymi.

---

## Propozycje QX-3 i QX-4

### Layout — kluczowa różnica od QX-0/1/2

QX-0, QX-1 i QX-2 wszystkie opierają się na centralnej kolumnie `max-w-7xl mx-auto` — content jest zawsze "w środku". Dla QX-3 i QX-4 porzucamy tę zasadę:

- **Sekcje rozlewają się na całą szerokość okna** — padding boczny zastąpiony asymetrycznym marginesem lub zerowym gutter
- Kontenery wewnętrzne (tekst, lista cech) mogą mieć ograniczenie szerokości, ale **tło sekcji, obrazy i bloki kolorystyczne sięgają krawędzi**
- Podejście: `width: 100%` + `padding: 0` na sekcjach; siatka budowana przez CSS Grid z `fr` jednostkami bez max-width wrappera
- Wizualny efekt: strona "oddycha" całą szerokością — bardziej lookbookowy/plakatowy charakter
- QX-3: ciemne bloki wypełniają ekran edge-to-edge — dramatyczny kontrast
- QX-4: pełnoszerokościowe panele z naturalnymi materiałami — jak strona marki meblarskiej

---

### QX-3 — Proposal A: „Dark Precision"

> **Oś:** ciemne + precyzyjne ↔ kontrast z QX-0/QX-1 (jasne) i QX-2 (chłodne-jasne)

**Klimat:** nocny tryb premium — katalog technicznego produktu widziany jak skaner 3D w ciemnym studio. Kontrastowe, high-end, poważne.

**Paleta:**

- `--background: 220 18% 8%` — antracyt z lekkim niebieskim odcieniem
- `--foreground: 0 0% 94%` — zimna, czysta biel
- `--surface: 220 15% 12%`
- `--surface-elevated: 220 14% 16%`
- `--accent: 196 80% 52%` — neonowy akwamaryn/cyan — jedyny punkt koloru
- `--border: 220 14% 22%`
- `--muted-foreground: 220 10% 55%`

**Typografia:**

- `--font-display: 'Sora', sans-serif` — geometryczny, czysty
- `--font-body: 'Inter', sans-serif`
- `--radius: 0.5rem` — niemal ostry, minimalne zaokrąglenia

**Charakterystyczne detale:**

- Tło globalne: zero pseudo-elementów / bez gradientów — czysta ciemność
- Karty: `border: 1px solid hsl(var(--border))` + subtelny `box-shadow` w kolorze akcentu przy hover
- Przyciski: `background: hsl(var(--accent) / 0.12)`, border `1px solid hsl(var(--accent) / 0.4)`, kolor tekstu = akcent
- Divider sekcji: cienka linia `1px solid hsl(var(--border) / 0.6)`
- Hero: overlay bardzo ciemny `hsl(220 18% 4% / 0.8)` — produkt w dramatycznym oświetleniu
- Etykiety sekcji: `text-transform: uppercase; letter-spacing: 0.2em; font-weight: 200` — jak w QX-2 ale w zimnym tonie i bez monofontu
- Nav: `backdrop-filter: blur(20px); background: hsl(220 18% 8% / 0.85)` — niewidoczna granica między scroll a contentem

**Dlaczego inny od QX-2:** QX-2 jest jasny + monospace; QX-3 jest ciemny + geometryczny sans-serif + jeden kolor neonowy.

---

### QX-3 — Proposal B: „Soft Volume" *(alternatywna propozycja)*

> Gdyby dark nie pasował do linii — miękkie, przestrzenne, wolumetryczne.

**Klimat:** katalog jak „rendered product sheet" z 3D design studiów. Przestrzeń i światło, bez pretensji.

**Paleta:**

- `--background: 220 14% 96%` — lekka szaro-niebieska podstawa
- `--accent: 245 60% 58%` — lawendowo-indygo
- Bez jasnych bieli sekcji — sekcje różnicowane *gradientem* z bg: transparent do lekkiego tła

**Typografia:** `'Outfit'` + `'Inter'`, `--radius: 1.5rem` — bardzo miękkie karty

---

### QX-4 — „Blush / Feminine Warm"

> **Oś:** ciepłe + miękkie + kobiecy charakter — porzucamy surowość materiałów na rzecz delikatności i ciepła

**Klimat:** katalog premium beauty/lifestyle lub soft interior design — jak lookbook marki kosmetycznej albo home fragrance. Ciepłe różowe tony, kremowa biel, dusty rose akcent. Subtelne, przytulne i wyraźnie kobiece.

**Paleta:**

- `--background: 15 30% 96%` — bardzo jasny różano-kremowy (blush biel)
- `--foreground: 10 18% 18%` — głęboka ciepła czerń z domieszką brązu
- `--surface: 18 28% 91%` — lekki puder różowy
- `--surface-elevated: 20 18% 99%` — prawie biały z ciepłym odcieniem
- `--accent: 340 42% 52%` — **dusty rose** — ani zbyt słodka, ani zbyt agresywna
- `--muted: 18 22% 87%`
- `--muted-foreground: 10 12% 42%`
- `--border: 15 20% 82%` — różowo-beżowy, miękki border
- `--warm-light: 20 40% 90%` — tła badge'y i etykiet

**Typografia:**

- `--font-display: 'Outfit', sans-serif` — `font-weight: 300` — lekki, elegancki, nie ciężki
- `--font-body: 'Inter', sans-serif`
- `--radius: 1.25rem` — miękkie, zaokrąglone, bliżej QX-1
- Etykiety sekcji: `letter-spacing: 0.25em; font-weight: 400; text-transform: uppercase`

**Filtry obrazków — kluczowy wyróżnik QX-4:**

Wszystkie zdjęcia dostają subtelny ciepły filtr CSS — jak fotografia w świetle złotej godziny:

```css
/* Produkty: delikatna ciepła patyna */
.catalog-qx4 img {
  filter: sepia(12%) saturate(115%) hue-rotate(-8deg) brightness(1.03);
}
/* Hero: mocniejszy ton */
.catalog-qx4 #cover img {
  filter: sepia(20%) saturate(120%) hue-rotate(-10deg) brightness(1.0) contrast(0.95);
}
/* Overlay hero: różowo-brązowy zamiast czarnego */
.catalog-qx4 #cover .hero-overlay-layer {
  background: linear-gradient(
    180deg,
    hsl(12 40% 18% / 0.18) 0%,
    hsl(340 30% 20% / 0.72) 100%
  ) !important;
}
/* Gallery/packshot: warm vignette przez mix-blend-mode */
.catalog-qx4 #overview figure::after,
.catalog-qx4 #gallery .group::after {
  content: '';
  position: absolute;
  inset: 0;
  background: hsl(15 60% 60% / 0.06);
  mix-blend-mode: multiply;
  pointer-events: none;
  border-radius: inherit;
}
```

**Charakterystyczne detale:**

- Tło globalne `::before`: różowy radial gradient — `radial-gradient(60rem 40rem at 30% -10%, hsl(340 50% 80% / 0.12), transparent 60%), linear-gradient(180deg, hsl(15 30% 97%), hsl(18 25% 94%))`
- Karty: `border: 1px solid hsl(var(--border))` + `box-shadow: 0 4px 20px hsl(340 30% 50% / 0.06)` — różowe cienie
- Przyciski primary: `background: hsl(var(--accent))`, shimmer efekt przy hover
- Przyciski secondary: `border: 1.5px solid hsl(var(--accent) / 0.5)`, brak wypełnienia
- Nav: kremowy `background: hsl(20 18% 99% / 0.92)`, `backdrop-filter: blur(10px)`

**Dlaczego inny od QX-1:** QX-1 = terra cotta + blur karty + Manrope; QX-4 = dusty rose + **filtry CSS na zdjęciach** + Outfit 300 + brak blur.

---

## Tabela porównawcza — 5 katalogów

| | QX-0 | QX-1 | QX-2 | QX-3 (Dark) | QX-4 (Blush) |
|---|---|---|---|---|---|
| **Tło** | near-white neutral | kremowy (warm) | cool grey | dark anthracite | piaskowiec (warm) |
| **Akcent** | graphite | terra cotta | dark grey | neon cyan | forest green |
| **Font display** | Inter | Outfit | Roboto Mono | Sora | Manrope |
| **Font body** | Inter | Manrope | Roboto Mono | Inter | Inter |
| **Radius** | 0.25rem | 1.1rem | 1rem | 0.5rem | 0.75rem |
| **Blur/glass** | nie | tak (step-card) | subtle | nie | nie |
| **Bg gradient** | nie | tak (fixed) | nie | nie | tak (różowy radial) |
| **Filtry img** | nie | nie | nie | nie | **tak (sepia+warm)** |
| **Layout** | `max-w-7xl` centrowany | `max-w-7xl` centrowany | `max-w-7xl` centrowany | **full-bleed edge-to-edge** | **full-bleed edge-to-edge** |
| **Klimat** | techniczno-neutralny | editorial/lifestyle | mono/inżynierski | premium dark studio | kobiecy/lifestyle |
| **Temperatura** | neutralna | ciepła | zimna | zimna+neon | ciepła |
| **Jasność** | jasny | jasny | jasny | ciemny | jasny |
| **Akcent** | graphite | terra cotta | dark grey | neon cyan | dusty rose |

---

## Animacje UI — zróżnicowanie QX-3 vs QX-4

### Obecny stan (QX-0/1/2)

Projekt używa **framer-motion** z ujednoliconym wzorcem:

- Wejście: `opacity: 0 → 1` + `y: 24px → 0` (lub `x: ±40px`) przy `useInView`
- Stagger: `delay: 0.1 * index` na kartach i listach
- Interakcja: `hover:scale-105` przez Tailwind, `translateY(-1px)` na buttonach
- Feature panel: `opacity + y:12px` przy zmianie aktywnej zakładki
- Hero: animowany pasek `width: 20%→80%→50%` — placeholder w Features

Wszystkie trzy warianty mają **ten sam język ruchu** — to dobra okazja do nadania QX-3 i QX-4 własnego charakteru.

---

### QX-3 — „Dark Precision" — animacje: **precyzja + mechanika**

**Filozofia:** ruch, który wygląda jak precyzyjne urządzenie — skokowy, kontrolowany, zero "miękkich" spring.

| Element | Obecny (QX-0/1/2) | QX-3 propozycja |
|---|---|---|
| **Wejście sekcji** | fade + slide-Y (0.6s ease) | **clip-path reveal** — `clipPath: 'inset(0 100% 0 0)' → 'inset(0 0% 0 0)'`, `duration: 0.5s, ease: [0.25, 0, 0, 1]` |
| **Stagger kart** | `delay: i * 0.1` fade+Y | **cascade X** — karty wchodzą od lewej, `x: -20px → 0`, bez Y, `stiffness: 300, damping: 30` (spring, ale twarde) |
| **Hover karta** | `scale(1.05)` | `border-color` zmiana do akcentu + `box-shadow` pulse `0 0 12px hsl(accent/0.3)` — bez skalowania |
| **Feature tab** | `opacity + y:12` (0.3s) | **instantaneous** `duration: 0.15s` liniowy — jak przełącznik, bez „miękkości" |
| **Nav active** | płynna zmiana koloru | `underline` rysowany od lewej: `scaleX: 0 → 1`, `transformOrigin: left`, `duration: 0.25s` |
| **Scroll indicator hero** | `animate y: [0,8,0]` (2s) | **blink** — `opacity: [1, 0.3, 1]` co 1.2s, `linear` — jak kursor terminala |
| **CTA button hover** | `translateY(-1px)` | **border "fill"** — pseudo-element `scaleX: 0→1` od lewej, kolor akcentu, `duration: 0.3s` |
| **Section label** | statyczny tekst | **typewriter** — `framer-motion` `animate` litera po literze przez `clip-path` lub custom `useAnimate` |

**Easing dominujący:** `cubic-bezier(0.25, 0, 0, 1)` — "industrial ease out" — szybko zaczyna, natychmiastowo kończy.  
**Spring:** `stiffness: 400, damping: 40` — zero bounce, twarda sprężyna.  
**Czas:** krótszy niż standard — max `0.4s` dla wejść, `0.2s` dla interakcji.

---

### QX-4 — „Warm Concrete / Material" — animacje: **organiczność + ciężar**

**Filozofia:** ruch, który oddaje materię — wolniejszy, z odczuwalną wagą, bez skakania.

| Element | Obecny (QX-0/1/2) | QX-4 propozycja |
|---|---|---|
| **Wejście sekcji** | fade + slide-Y (0.6s ease) | **fade only** — bez przesunięcia Y, `opacity: 0→1`, `duration: 0.9s, ease: 'easeOut'` — jak odsłanianie przez naturalny ruch kamery |
| **Stagger kart** | `delay: i * 0.1` | **wolniejszy stagger** `i * 0.18s` + większy `y: 40px→0` — poczucie ciężaru przy wchodzeniu |
| **Hover karta** | `scale(1.05)` | `scale(1.02)` wolniejszy `duration: 0.4s` + lekkie `boxShadow` deepen — subtelne, materialne |
| **Feature tab** | `opacity + y:12` (0.3s) | `opacity + y:8` ale `duration: 0.5s, ease: easeInOut` — wolno, jak przewracanie kartki |
| **Nav active** | płynna zmiana koloru | `height 0→3px` border-bottom z `ease: easeOut 0.35s` — rośnie jak roślina |
| **Scroll indicator hero** | `animate y: [0,8,0]` (2s) | `y: [0, 12, 0]` **wolniejszy** `duration: 3s, ease: easeInOut` — jak oddech / kołysanie |
| **CTA button hover** | `translateY(-1px)` | `translateY(-3px)` `duration: 0.35s` + `backgroundColor` fade do pełnego akcentu |
| **Packshot image** | `hover:scale-[1.03] duration-700` | `scale(1.04)` `duration: 1.2s ease-out` — bardzo powolne, jak powiększenie z drenem |
| **Section dividers** | statyczne linie | **width: 0→100%** reveal przy inView, `duration: 0.8s, delay: 0.2s` — linia rysuje się|

**Easing dominujący:** czysty `easeInOut` lub `easeOut` — bez agresywnych cubic-bezier.  
**Spring:** `mass: 1.5, stiffness: 120, damping: 25` — z odczuwalną masą.  
**Czas:** dłuższy niż standard — `0.7-1.0s` dla wejść, `0.3-0.4s` dla interakcji.

---

### Podsumowanie kontrastu animacyjnego

| | QX-3 (Dark Precision) | QX-4 (Warm Material) |
|---|---|---|
| **Metafora ruchu** | przełącznik / skaner | materiał / natura |
| **Czas wejść** | krótki `0.3–0.5s` | długi `0.7–1.0s` |
| **Easing** | sharp cubic-bezier `(0.25,0,0,1)` | `easeInOut` |
| **Spring bounce** | brak (overdamped) | subtelny (mass 1.5) |
| **Interakcja hover** | glow / border-fill | powolne scale / shadow |
| **Specjalny efekt** | clip-path reveal, typewriter | fade-only, rysowana linia |
| **Ogólne odczucie** | mechaniczne, precyzyjne | organiczne, ciężkie |

---

## Hero Slider — propozycja mozaikowego layoutu

### Problem z obecnym sliderem (QX-0/1/2)

Wszystkie trzy warianty używają **identycznej struktury slidera**: fullscreen obraz tła + overlay + wycentrowany tekst. Różnią się kolorem overlaya i typografią, ale proporcje i mechanika są takie same. To kolejna oś do zróżnicowania QX-3 i QX-4.

---

### Mozaika / Patchwork — layout hero dla QX-3 i QX-4

**Idea:** zamiast jednego fullscreen zdjęcia — **siatka zdjęć**, gdzie elementy wymieniają się niezależnie lub grupami:

```
┌─────────────────┬────────────┐
│                 │  [img B]   │
│   [img A]       ├────────────┤
│   (duży)        │  [img C]   │
│                 ├────────────┤
│                 │  [img D]   │
└─────────────────┴────────────┘
```

- Lewa kolumna: **1 duży obraz** (ok. 60-65% szerokości, pełna wysokość viewportu)
- Prawa kolumna: **3 mniejsze obrazy** ułożone pionowo (ok. 35-40% szerokości, każdy ~33vh)
- Razem tworzą jeden spójny „kadr" — mozaikę

**Mechanika wymiany:**

Dwa warianty animacji, różne dla QX-3 i QX-4:

#### QX-3 — wymiana sekwencyjna (mechaniczna)

- Duży obraz zmienia się niezależnie co ~6s
- Małe obrazy wymieniają się z przesunięciem `delay: 0.15s` między sobą — jak aktualizacja danych na dashboardzie
- Przejście: `clip-path: inset(0 0 100% 0) → inset(0)` — obraz „spada" z góry
- Po zmianie dużego obrazu — małe obrazy synchronizują się z nowym zestawem (po 0.6s)
- Efekt: ekran żyje, ale kontrolowanie, precyzyjnie

#### QX-4 — wymiana organiczna (oddychająca)

- Wszystkie 4 obrazy wymieniają się z **cross-fade** jednocześnie, ale mały delay między lewą a prawą kolumną (`0.3s`)
- Przejście: `opacity 0→1` z `duration: 1.2s easeInOut` — powolne, miękkie
- Duży obraz zmienia się co ~7s, małe co ~5s — nie są zsynchronizowane → tworzą zawsze nową kombinację
- Efekt: strona jako żywy kolaż, nieuchwytny, zmysłowy

**CSS Grid dla mozaiki:**

```css
.hero-mosaic {
  display: grid;
  grid-template-columns: 62fr 38fr;
  grid-template-rows: repeat(3, 1fr);
  height: 100svh;
  width: 100%;
  gap: 3px; /* lub 0 dla edge-to-edge */
}

.hero-mosaic .hero-main {
  grid-row: 1 / 4; /* zajmuje całą lewą kolumnę */
  position: relative;
  overflow: hidden;
}

.hero-mosaic .hero-thumb {
  position: relative;
  overflow: hidden;
}
```

**Tekst i CTA w mozaice:**

- Nie na tle obrazka (jak w QX-0/1/2) lecz jako **osobna warstwa** — np. absolutnie pozycjonowany panel w lewym dolnym rogu dużego obrazu, lub jako osobna kolumna pod siatką
- Alternatywnie: tekst nad prawą kolumną (ponad trzema kadrami) z ciemnym panelem backdrop

**Filtry w QX-4 Blush + mozaika:**

Każdy z 4 segmentów mozaiki może mieć **nieznacznie różną intensywność filtra**:

```css
.catalog-qx4 .hero-main img {
  filter: sepia(20%) saturate(120%) hue-rotate(-10deg);
}
.catalog-qx4 .hero-thumb:nth-child(1) img {
  filter: sepia(10%) saturate(110%) hue-rotate(-5deg) brightness(1.05);
}
.catalog-qx4 .hero-thumb:nth-child(2) img {
  filter: sepia(15%) saturate(125%) hue-rotate(-12deg);
}
.catalog-qx4 .hero-thumb:nth-child(3) img {
  filter: sepia(8%) saturate(108%) hue-rotate(-6deg) brightness(1.08);
}
```

Efekt: kolaż wygląda jak ułożony z fotografii z różnych sesji, ale spójny tonalnie.

---

### Porównanie sliderów — wszystkie warianty

| | QX-0/1/2 | QX-3 (Dark) | QX-4 (Blush) |
|---|---|---|---|
| **Layout** | fullscreen 1 kadr | mozaika 62/38, gap 3px | mozaika 62/38, gap 0 |
| **Wymiana** | cross-fade 0.5s | clip-path reveal sekwencyjny | cross-fade 1.2s organiczny |
| **Synchronizacja** | wszystkie slajdy razem | duży niezależny, małe z delay | brak synchronizacji (losowe) |
| **Tekst** | overlay wycentrowany | panel dolny-lewy, Sora 300 | panel osobna kolumna |
| **Filtry** | brak | brak | per-segment, różna intensywność |
| **Proporcje** | 100vw × 100svh | 100vw × 100svh | 100vw × 100svh |

---

## Rekomendacja

**QX-3 jako Dark Precision** — wypełnia lukę „ciemny" której żaden wariant jeszcze nie pokrywa.  
**QX-4 jako Warm Concrete/Material** — daje ciepły klimat ale materiałowo zdystansowany od editorial QX-1.

Razem QX-3 + QX-4 znacznie poszerzają zakres wizualny systemu bez powielania istniejących kierunków, a dobór fontów (Sora / Manrope) unika kolizji z już użytymi kombinacjami.
