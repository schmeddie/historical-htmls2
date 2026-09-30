# Historical HTMLs

Eight modern websites parodied as if they existed in earlier eras. Each is a single, self-contained HTML file in `sites/`. It uses only inline SVG, emoji, and Google Fonts, with no images or frameworks. A pre-rendered PDF of each page is in `pdf/`.

| Era | Parody | Original |
| --- | --- | --- |
| 1334 BC, Egypt | Ankhstagram | Instagram |
| 44 BC, Rome | Ubi | Uber |
| 893, Vikings | Fjordbnb | Airbnb |
| 1347, Medieval | Amazeon | Amazon |
| 1599, Elizabethan | Globeflix | Netflix |
| 1789, French Revolution | X | Twitter/X |
| 1813, Regency | Tinderbox | Tinder |
| 1851, Victorian | LinkedIron | LinkedIn |

Open `index.html` for a gallery.

## Re-rendering the PDFs

```sh
npm install
npm run render            # all pages → pdf/
npm run render -- --png   # also write full-page PNGs to previews/
```

The pages are designed at a desktop width of 1440px, and each PDF is one tall page.
