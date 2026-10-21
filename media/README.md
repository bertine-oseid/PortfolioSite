# media

Her ligger korte videoer og bilder som brukes på nettsiden, for eksempel
forhåndsvisningene i video-flisene.

## Hvilke filer passer?

- **Format:** `.mp4` (H.264) eller `.webm`. Bilder: `.jpg`, `.png` eller `.webp`.
- **Kort og uten lyd:** Forhåndsvisningen spilles alltid av uten lyd, så lyd er
  bare ekstra vekt. Noen få sekunder er nok.
- **Størrelse:**
  - En fil på Cloudflare Pages kan være **maks 25 MB**. Større filer blir ikke
    med på nettsiden.
  - Forhåndsvisninger bør helst være **under 5 MB**, så de laster raskt, også på
    mobil.
- **Filnavn:** små bokstaver, ingen mellomrom eller æ/ø/å, for eksempel
  `showreel-2026.mp4`.

Hele videoen legger du ikke her. Den kan ligge for eksempel på Google Drive, og
du limer inn lenken i feltet «Lenke til hele videoen».

## Slik bruker du en fil herfra

1. Last opp filen til denne mappen på github.com
   (**Add file → Upload files**).
2. Vent til Cloudflare har bygget siden på nytt (et minutt eller to).
3. Gå til `/admin`, legg til eller rediger en video-flis, og skriv filnavnet med
   mappen foran i feltet «Forhåndsvisning», for eksempel `media/showreel-2026.mp4`.
4. Trykk **Lagre**.
