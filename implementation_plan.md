# Implementacja QX-3 i QX-4

Projekt ma już foldery `/public/catalogs/QX-3` i `/public/catalogs/QX-4` z plikami danych (skopiowanymi z QX-2, ale ze `theme: "qx0"`). Trzeba:
1. Ustawić poprawny theme (`qx3` / `qx4`) w config.json
2. Dodać CSS dla obu wariantów do `globals.css`
3. Stworzyć nowy komponent `MosaicHeroSection` (mozaika 62/38)
4. Zaktualizować `page.tsx` by rozpoznawał `qx3` i `qx4` (nav variant, logo, hero type)
5. Opcjonalnie: zaktualizować animacje w sekcjach przez `catalogId` prop

---

## Proposed Changes

### Config i dane

#### [MODIFY] QX-3/config.json
Zmiana `"theme": "qx0"` → `"theme": "qx3"`. Zmiana `collectionName` i `description`.

#### [MODIFY] QX-4/config.json
Zmiana `"theme": "qx0"` → `"theme": "qx4"`. Zmiana `collectionName` i `description`.

---

### CSS — motyw wizualny

#### [MODIFY] [globals.css](file:///f:/___APPS/_interactive_catalogs/src/app/globals.css)

**`.catalog-qx3` — Dark Precision:**
- Ciemne tło antracytowe: `--background: 220 18% 8%`
- Neon cyan akcent: `--accent: 196 80% 52%`
- Font: Sora display, Inter body, `--radius: 0.5rem`
- Brak pseudo-elementów tła (czysta ciemność)
- Przyciski: transparentne z cyan borderem i glow
- Sekcje: full-bleed (padding 0 na sekcjach, max-w usunięty)
- Divider: `1px solid hsl(var(--border) / 0.6)`
- Nav: `backdrop-filter: blur(20px)` na ciemnym tle
- Animacje sekcji: `clip-path` reveal (wymagane CSS transitions)

**`.catalog-qx4` — Blush / Feminine Warm:**
- Różano-kremowe tło: `--background: 15 30% 96%`
- Dusty rose akcent: `--accent: 340 42% 52%`
- Font: Outfit (weight 300) display, Inter body, `--radius: 1.25rem`
- Tło radial gradient z różowym hitem (::before)
- **Filtry CSS na obrazkach** (`filter: sepia(12%) saturate(115%) hue-rotate(-8deg) brightness(1.03)`)
- Hero overlay: różowo-brązowy gradient
- Karty: różowe shadow `hsl(340 30% 50% / 0.06)`
- Sekcje: full-bleed
- Na `#cover`: per-segment filtry dla mozaiki

---

### Nowy komponent

#### [NEW] [MosaicHeroSection.tsx](file:///f:/___APPS/_interactive_catalogs/src/components/catalog/MosaicHeroSection.tsx)

Komponent obsługujący mozaikowy layout hero:
- Grid CSS: `62fr 38fr`, lewa kolumna = 1 duży obraz pełnej wysokości, prawa = 3 mniejsze równomiernie
- Slot na 4+ zdjęcia z `slider.json` (pierwsze = główne, 2-4 = thumnaile, dalsze rotują w głównym)
- **QX-3 variant**: wymiana przez `clip-path inset` (mechaniczna), duży co 6s, małe z delay 0.15s
- **QX-4 variant**: cross-fade 1.2s, desynchronizacja (duży co 7s, małe co 5s)
- Tekst i CTA pozycjonowane absolutnie nad lewym obrazem (dolny lewy róg)
- Prop `variant: 'qx3' | 'qx4'` steruje mechaniką i filtrami

Interfejs danych: reuse istniejącego `HeroData` (te same pola `heroSlides`, `slider`)

---

### Zmiany w istniejących plikach

#### [MODIFY] [page.tsx](file:///f:/___APPS/_interactive_catalogs/src/app/catalog/%5BcatalogId%5D/page.tsx)

- Dodać obsługę `qx3` i `qx4` w `navVariant` (można reuse `'default'` lub nowy `'qx3'`/`'qx4'`)
- Render `<MosaicHeroSection>` zamiast `<HeroSection>` gdy theme = `qx3` lub `qx4`
- Przekazanie `variant` do MosaicHeroSection

#### [MODIFY] [CatalogNav.tsx](file:///f:/___APPS/_interactive_catalogs/src/components/catalog/CatalogNav.tsx)

- Dodać `qx3` i `qx4` do typu `variant`
- QX-3: nav ciemny, underline animowany clip-path od lewej (nowa klasa CSS)
- QX-4: nav kremowy, border-bottom rośnie przy hover

---

## Verification Plan

### Ręczna weryfikacja w przeglądarce

Aplikacja jest już uruchomiona (`npm run dev`).

1. Otworzyć `http://localhost:3000/catalog/QX-3` i sprawdzić:
   - Ciemne tło antracytowe, cyan akcenty
   - Mozaikowy hero (62/38 grid)
   - Mechaniczna wymiana slajdów (clip-path reveal)
   - Sekcje full-bleed (treść od krawędzi do krawędzi)
   - Sora font w nagłówkach

2. Otworzyć `http://localhost:3000/catalog/QX-4` i sprawdzić:
   - Różano-kremowe tło
   - Mozaikowy hero z organicznym cross-fade
   - Ciepłe filtry CSS na zdjęciach (lekki sepia/warm tone)
   - Outfit 300 w nagłówkach, zaokrąglone karty 1.25rem

3. Sprawdzić QX-0/1/2 — powinny być **bez zmian**
4. Sprawdzić responsywność: mosaic na mobile powinien przejść do single-column (media query)

> [!NOTE]
> Port dev servera może być inny niż 3000 — sprawdzić terminal `npm run dev`
