// ============================================================
//  BLOG POSTS — Add or edit posts here
//
//  BILINGUAL SUPPORT
//  ──────────────────
//  Each post has a `no` and `en` block containing:
//    title, excerpt, body (Markdown)
//
//  The `id`, `date`, and `tags` fields are shared
//  (language-independent).
// ============================================================

const BLOG_POSTS = [
  {
    id:   "hello-world",
    date: "2025-05-01",
    tags: ["personal", "design"],

    no: {
      title:   "Hei, verden — hvorfor jeg bygde denne siden",
      excerpt: "Enhver personlig nettside er en handling der du bestemmer hvem du er på internett. Her er min.",
      body: `
# Hei, verden

Enhver personlig nettside er en liten handling der du bestemmer hvem du er på internett.

Jeg har hatt noen varianter — en Squarespace-side, en nøktern GitHub-profil, et Notion-dokument noen en gang kalte "sjarmerende, men vanskelig å navigere". Denne føles riktig.

## Hvorfor bento?

Rutenettet gjenspeiler hvordan jeg faktisk tenker: parallelt, med mye kontekstbytte. En sosial lenke lever ved siden av et blogginnlegg ved siden av et sitat. Det er den ærlige versjonen av en profesjonell identitet.

## Hva du finner her

- **Lenker** til stedene jeg er aktiv på nett
- **Skriving** — innimellom essays og notater (dette er ett av dem)
- **Arbeid** — til slutt en ordentlig prosjektdel

Takk for at du stoppet innom. Hvis du vil si hei, er e-postflisen rett der på forsiden.
      `,
    },

    en: {
      title:   "Hello, world — why I built this site",
      excerpt: "Every personal site is an act of deciding who you are on the internet. Here's mine.",
      body: `
# Hello, world

Every personal site is a small act of deciding who you are on the internet.

I've had a few incarnations — a Squarespace page, a sparse GitHub profile, a Notion doc someone once called "charming but hard to navigate." This one feels right.

## Why bento?

The grid layout reflects how I actually think: in parallel, with lots of context switching. A social link lives next to a blog post lives next to a quote. That's the honest version of a professional identity.

## What you'll find here

- **Links** to the places I'm active online
- **Writing** — occasional essays and notes (this is one)
- **Work** — eventually a proper projects section

Thanks for stopping by. If you want to say hello, the email tile is right there on the home page.
      `,
    },
  },

  {
    id:   "design-in-public",
    date: "2025-04-18",
    tags: ["design", "process"],

    no: {
      title:   "Om å designe i det offentlige",
      excerpt: "Å dele uferdig arbeid er ubehagelig. Det er også den raskeste måten å bli bedre på.",
      body: `
# Om å designe i det offentlige

Å dele uferdig arbeid er ubehagelig. Wireframen din er rotete. Typografien er feil. Mellomrommene er gale. Du *vet* at det ikke er klart.

Men her er poenget: å vente på at det er klart er slik godt arbeid forsvinner for alltid.

## Ubehaget er poenget

Når du designer privat, er du den eneste dommeren. Du bruker dine egne standarder — som nesten alltid er enten for strenge eller for milde, avhengig av dagen. Du får aldri den rekalibreringen som kommer fra et utenifraperspektiv.

Offentlig arbeid bedømmes av fremmede. Det er ubehagelig. Det er også *presis* tilbakemelding som din indre kritiker aldri kan gi deg.

## En praksis, ikke en forestilling

Skiftet jeg måtte gjøre: slutte å tenke på offentlig design som en forestilling (se hva jeg laget) og begynne å tenke på det som praksis (her er hva jeg jobber gjennom).

Et raskt Figma-skjermbilde med "finner ut navigasjonen for et klientprosjekt — ikke solgt på hierarkiet ennå" inviterer til samarbeid. Et polert Dribbble-skudd inviterer til likes.

Begge har sin plass. Men hvis du vil bli faktisk bedre, slår praksis forestilling.
      `,
    },

    en: {
      title:   "On designing in public",
      excerpt: "Sharing unfinished work is uncomfortable. It's also the fastest way to get better.",
      body: `
# On designing in public

Sharing unfinished work is uncomfortable. Your wireframe is a mess. Your type pairing is wrong. The spacing is off. You *know* it's not ready.

But here's the thing: waiting for ready is how good work disappears forever.

## The discomfort is the point

When you design privately, you're the only judge. You apply your own standards — which are almost always either too harsh or too lenient, depending on the day. You never get the recalibration that comes from an outside perspective.

Public work is judged by strangers. That's uncomfortable. It's also *precise* feedback that your internal critic can never give you.

## A practice, not a performance

The shift I had to make: stop thinking of public design as performance (look what I made) and start thinking of it as practice (here's what I'm working through).

A quick Figma screenshot with "figuring out the navigation for a client project — not sold on the hierarchy yet" invites collaboration. A polished Dribbble shot invites likes.

Both have their place. But if you want to actually get better, practice beats performance.
      `,
    },
  },

  {
    id:   "tools-2025",
    date: "2025-03-30",
    tags: ["tools", "productivity"],

    no: {
      title:   "Verktøyene jeg bruker i 2025",
      excerpt: "Et øyeblikksbilde av min nåværende stack — design, skriving, utvikling og det som er i mellom.",
      body: `
# Verktøyene jeg bruker i 2025

Et øyeblikksbilde av stabelen som driver arbeidslivet mitt nå.

## Design
- **Figma** — fortsatt standarden for UI/UX. Dev Mode-forbedringene gjorde endelig overleveringen utholdelig.
- **Framer** — for interaktive prototyper og den opprinnelige inspirasjonen til denne siden.

## Utvikling
- **VS Code** — ingenting har avløst det for meg, til tross for at jeg prøvde Cursor i en måned.
- **Vercel** — å deploye her er virkelig magisk. Push til main, det er live.
- **GitHub** — åpenbart.

## Skriving
- **Obsidian** — den koblede notisgrafen gjør faktisk det den lover når du slutter å kjempe mot den.
- **iA Writer** — for lengre utkast der jeg trenger å forsvinne fra distraksjoner.

## Produktivitet
- **Linear** — selv for soloarbeid. Tastatursnarveiene alene rettferdiggjør det.
- **Raycast** — erstattet Spotlight så fullstendig at jeg glemmer at macOS har sitt eget søk.

---

Ingenting her er særlig overraskende. Verktøyene som fungerer er de du faktisk bruker.
      `,
    },

    en: {
      title:   "The tools I'm using in 2025",
      excerpt: "A snapshot of my current stack — design, writing, development, and the stuff in between.",
      body: `
# The tools I'm using in 2025

A snapshot of the stack that currently runs my work life.

## Design
- **Figma** — still the standard for UI/UX. The Dev Mode improvements finally made handoff bearable.
- **Framer** — for interactive prototypes and this site's original inspiration.

## Development
- **VS Code** — nothing has unseated it for me despite trying Cursor for a month.
- **Vercel** — deploying here is genuinely magical. Push to main, it's live.
- **GitHub** — obviously.

## Writing
- **Obsidian** — the linked notes graph actually does what it promises once you stop fighting it.
- **iA Writer** — for longer drafts where I need to disappear from distraction.

## Productivity
- **Linear** — even for solo projects. The keyboard shortcuts alone justify it.
- **Raycast** — replaced Spotlight so completely I forget macOS has its own search.

---

Nothing here is particularly surprising. The tools that work are the ones you actually use.
      `,
    },
  },
];
