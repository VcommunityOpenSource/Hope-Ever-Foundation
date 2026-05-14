# Hope Ever Foundation — Website Project

A static multi-page website for Hope Ever Foundation, a registered non-profit
operating across 14 districts of Tamil Nadu since 2012.

---

## Tech Stack

- Plain HTML5, CSS3, Vanilla JavaScript — no frameworks, no build tools
- Font: Google Fonts (to be chosen — suggested: Inter or Lato)
- Icons: SVGs in assets/images/icons/ or a CDN like Lucide / Font Awesome
- Hosting: GitHub Pages / Netlify / any static host

---

## Color Palette

| Token            | Value     | Usage                          |
|------------------|-----------|--------------------------------|
| Primary Green    | #0F6E56   | Navbar, headings, buttons      |
| Accent Amber     | #D4872A   | Highlights, tags, CTAs         |
| Background       | #F9F6F1   | Page background (warm off-white)|
| Text Primary     | #1A1A1A   | Body text                      |
| Text Secondary   | #5A5A5A   | Captions, meta info            |
| White            | #FFFFFF   | Cards, footer columns          |
| Border           | #E2DDD6   | Card borders, dividers         |

Define all as CSS variables in css/global.css under :root { }

---

## Page Structure

### Pages (root level)
| File           | Page              | Notes                            |
|----------------|-------------------|----------------------------------|
| index.html     | Home              | Hero, who we are, mission/vision, impact counters, partner strip |
| about.html     | About Us          | History, team, map, recognition, partners |
| projects.html  | Projects          | 12 project cards with sector filter |
| programs.html  | Programs          | 5 thematic program areas         |
| gallery.html   | Gallery           | Year filter tabs + lightbox grid |
| contact.html   | Contact Us        | Form + map + address             |
| 404.html       | Not Found         | Friendly error page              |

### Individual Project Pages (projects/ folder)
Each file is a full detail page for one project.

| File                      | Project Name                                      |
|---------------------------|---------------------------------------------------|
| javvadhu-hills.html       | Land Holding & Horticulture, Javvadhu Hills       |
| agri-training.html        | Agricultural Training Center & Livestock Program  |
| surabi-magalir.html       | Surabi Magalir Membattu Iyakkam                   |
| kolping-india.html        | Kolping India Project                             |
| nsdc-skill.html           | NSDC Handicraft & Skill Development               |
| organic-farm.html         | Organic Farming Livelihood Program (ASCI)         |
| child-rights.html         | Child Rights Awareness (CECOWOR & ACA Denmark)    |
| women-skill.html          | Women Empowerment through Skill Development       |
| agarbatti.html            | Agarbatti & Home-based Livelihoods                |
| step-youth.html           | SMILE Twin e-Learning Programme (STeP)            |
| healthcare-bfsi.html      | Healthcare & BFSI Skill Training                  |
| employability.html        | Core Employability & Add-on Programs              |

---

## CSS Architecture

All pages link stylesheets in this order:
  1. css/global.css      — variables, reset, typography (ALWAYS FIRST)
  2. css/navbar.css      — shared navbar styles
  3. css/footer.css      — shared footer styles
  4. css/[page].css      — page-specific styles
  5. css/animations.css  — scroll reveal, counters, transitions

### css/global.css must define:
- :root color variables
- :root font-size and spacing scale
- CSS reset (box-sizing, margin, padding)
- Base typography (h1–h6, p, a)
- Utility classes (.container, .section, .btn, .tag)
- Responsive breakpoints as comments for reference

---

## JS Architecture

| File               | Responsibility                                              |
|--------------------|-------------------------------------------------------------|
| main.js            | Initialises all modules, shared utilities                   |
| navbar.js          | Mobile hamburger menu, sticky scroll, active link highlight |
| counter.js         | Animated number counters on homepage (IntersectionObserver) |
| gallery.js         | Year tab filter + lightbox viewer                           |
| projects.js        | Sector filter tabs on projects.html                         |
| contact.js         | Form validation and submission feedback                     |
| scroll-reveal.js   | Fade-in on scroll using IntersectionObserver                |

Load all JS at bottom of <body> with defer attribute.
navbar.js and main.js load on every page.
Other files load only on the page that needs them.

---

## Components

components/navbar.html and components/footer.html hold the shared HTML.
Inject them into every page using fetch() in main.js like this:

  fetch('/components/navbar.html')
    .then(r => r.text())
    .then(html => document.getElementById('navbar-placeholder').innerHTML = html)

Every page HTML file must have:
  <div id="navbar-placeholder"></div>   ← at top of body
  <div id="footer-placeholder"></div>   ← at bottom of body

---

## Image Guidelines

| Folder                        | Content                        | Format | Notes                        |
|-------------------------------|--------------------------------|--------|------------------------------|
| assets/images/common/         | Logo, hero, favicon, og-image  | PNG/JPG| og-image must be 1200×630px  |
| assets/images/partners/       | Partner org logos              | PNG    | Transparent bg, ~80px height |
| assets/images/projects/[name] | cover, thumb, img-01, img-02   | JPG    | cover: 1200×600, thumb: 600×400 |
| assets/images/gallery/[year]/ | Event photos by category       | JPG    | Name: YYYY-category-NN.jpg   |
| assets/images/team/           | Staff headshots                | JPG    | Square crop, consistent size |
| assets/images/icons/          | Social + UI SVG icons          | SVG    | Inline-friendly SVGs         |
| assets/certificates/          | Certificate preview thumbnails | JPG    | Shown on About page          |

Naming rules — always lowercase, hyphens only, no spaces:
  GOOD:  organic-farm-training-01.jpg
  BAD:   Organic Farm Training 1.JPG
  BAD:   organic_farm_training_1.jpg

---

## Docs Folder

| File                    | Purpose                                   |
|-------------------------|-------------------------------------------|
| 12aa-certificate.pdf    | Income Tax 12AA exemption certificate     |
| 80g-certificate.pdf     | Income Tax 80G donor deduction certificate|
| trust-deed.pdf          | Registration under Indian Trust Act 1882  |
| annual-report-2023.pdf  | Annual report (update each year)          |
| terms-and-conditions.pdf| Donor and program participation T&C       |

All PDFs are linked from the About page Recognition section.
The assets/certificates/ folder holds JPG thumbnail previews of the certificates
shown visually on the page before the download link.

---

## Navbar (persistent — every page)

Links: Home | About Us | Projects | Programs & Initiatives | Gallery | Contact Us
Logo: assets/images/common/logo.png (dark bg → logo-white.png)
Behaviour: sticky on scroll, hamburger on mobile, active page highlighted

---

## Footer (persistent — every page)

Five columns:
  1. Logo + one-line tagline + 80G donation note
  2. Quick links (all 6 nav pages)
  3. Contact — address, phone (tel:), email (mailto:)
  4. Social — Instagram, Facebook, YouTube icons linking externally
  5. Recognition — 12AA and 80G badge text

Bottom bar: © 2025 Hope Ever Foundation. All rights reserved.

External links to add (fill in actual handles/numbers):
  Instagram : https://instagram.com/HANDLE
  Facebook  : https://facebook.com/PAGE
  YouTube   : https://youtube.com/CHANNEL
  Email     : mailto:info@hopeeverfoundation.org
  Phone     : tel:+91XXXXXXXXXX
  Address   : [Full street address], Tamil Nadu, India

---

## Home Page Sections

  1. Hero          — full-width bg image, tagline, 2 CTA buttons
  2. Who We Are    — short intro paragraph + founding year + trust act note
  3. Mission       — To raise awareness and build community capacity...
  4. Vision        — To ensure sustainable livelihoods...
  5. Impact Numbers— 10 animated counters (see below)
  6. Partner Strip — scrolling logo strip of 15 partner orgs
  7. Footer

Impact counter values:
  1,650+   Youth trained in skill development
  400+     Farmers transitioned to organic farming
  50+      Villages with Child Rights Clubs
  1,480    SC/ST youth trained under NSDC
  500+     Healthcare (GDA) trainees since 2020
  85+      Women trained in trades & enterprise
  14       Districts covered across Tamil Nadu
  13+      Years of operation
  30%      Average income increase (NSDC youth)
  50%      Crop yield increase (organic farmers)

---

## About Page Sections

  1. Our History      — founded 2012, Indian Trust Act 1882, decade of work
  2. Our Team         — 16 professionals, roles listed, headshot grid
  3. Geographic Cover — Tamil Nadu district list + map visual with 14 pins
  4. Recognition      — 12AA cert thumbnail + download, 80G cert thumbnail + download,
                        Trust Deed download, T&C link
  5. Our Partners     — table/grid of 15 partner orgs with logo + role description

Districts covered:
  Chennai, Kanchipuram, Thiruvallur, Thiruvannamalai, Cuddalore, Trichy,
  Dindigul, Villupuram, Ariyalur, Pondicherry, Pudhukottai, Sivagangai,
  Namakkal, Kanyakumari

---

## Projects Page

Display as a card grid with sector filter tabs at top.
Each card shows: thumb image, project title, duration, partner, sector tag, short
excerpt (2 lines), and a "Read More" button linking to projects/[slug].html

Filter tags:
  All | Livelihoods | Skill Development | Women | Child Rights | Agriculture | M&E | Health

Projects list (slug → title):
  javvadhu-hills    → Land Holding & Horticulture, Javvadhu Hills   [Agriculture, Livelihoods]
  agri-training     → Agricultural Training Center & Livestock       [Agriculture, Livelihoods]
  surabi-magalir    → Surabi Magalir Membattu Iyakkam                [Women, Livelihoods]
  kolping-india     → Kolping India Project                          [Livelihoods, Women]
  nsdc-skill        → NSDC Handicraft & Skill Development            [Skill Development]
  organic-farm      → Organic Farming Livelihood Program             [Agriculture, Livelihoods]
  child-rights      → Child Rights Awareness                         [Child Rights]
  women-skill       → Women Empowerment through Skill Development    [Women, Skill Development]
  agarbatti         → Agarbatti & Home-based Livelihoods             [Women, Livelihoods]
  step-youth        → SMILE Twin e-Learning Programme (STeP)         [Skill Development]
  healthcare-bfsi   → Healthcare & BFSI Skill Training               [Health, Skill Development]
  employability     → Core Employability & Add-on Programs           [Skill Development]

---

## Programs Page

Five thematic sections, each with icon, title, and paragraph:

  1. Monitoring & Evaluation (M&E)
     Logical frameworks, baseline/endline studies, SIA, SMPs, MIS dashboards,
     mobile-based data collection, real-time monitoring.

  2. Livelihoods & Enterprise Development
     Organic farming, solar/biogas enterprises, artisan development
     (weaving, pottery, folk art), BDS (financial literacy, market access).

  3. Skill Development
     NSDC & ASCI partnerships, vocational training in tailoring, IT, retail,
     healthcare (GDA), BFSI, handicrafts, carpentry, renewable energy.
     Includes soft skills, entrepreneurship, digital literacy, placement support.

  4. Capacity Building
     SHG training, Child Rights Clubs, youth groups, Panchayati Raj institutions,
     project staff, duty bearers. Methods: experiential learning, participatory
     workshops, simulation, digital tools.

  5. Research & Evidence-Based Planning
     Participatory Rural Appraisals (PRA), FGDs, KIIs, household surveys,
     statistical analysis, policy research for state and national advocacy.

---

## Gallery Page

  - Year filter tabs: 2012–2015 | 2016–2018 | 2019–2020 | 2021 | 2022 | 2023 | 2024 | 2025
  - Category sub-filter: All | Training | Field Activities | Events | Partner Visits
  - Layout: Masonry or uniform grid
  - Click: opens lightbox with prev/next navigation
  - Images stored in: assets/images/gallery/[year]/[category]/

---

## Contact Page

  Form fields:
    Full Name (text, required)
    Email (email, required)
    Phone (tel, optional)
    Subject (select: Partnership / Volunteer / Donation / Media / General)
    Message (textarea, required)
    Submit button

  Also display:
    Physical address block
    Phone with tel: link
    Email with mailto: link
    Instagram / Facebook / YouTube icon links
    Embedded Google Map (iframe) of office location

---

## SEO Checklist (each page)

  <title>Page Title — Hope Ever Foundation</title>
  <meta name="description" content="...">
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:image" content="/assets/images/common/og-image.jpg">
  <meta property="og:type" content="website">
  <link rel="canonical" href="https://yourdomain.com/page.html">
  <link rel="icon" href="/assets/images/common/favicon.ico">

---

## Accessibility Checklist

  - All images must have descriptive alt="" text
  - Color contrast ratio minimum 4.5:1 for body text
  - All form fields have associated <label> elements
  - Keyboard navigation must work for navbar and lightbox
  - Use semantic HTML: <header>, <nav>, <main>, <section>, <footer>, <article>
  - Focus styles must be visible (never remove outline without replacement)

---

## Organisation Info (for footer and contact page)

  Name        : Hope Ever Foundation
  Type        : Non-profit Trust
  Registered  : Indian Trust Act, 1882
  Tax Status  : Recognized under Sections 12AA and 80G, Income Tax Act
  Founded     : 2012
  Coverage    : 14 districts, Tamil Nadu, India
  Team Size   : 16 professionals

  !! Replace placeholders below with actual details !!
  Address     : [INSERT FULL ADDRESS]
  Phone       : [INSERT PHONE NUMBER]
  Email       : [INSERT EMAIL ADDRESS]
  Instagram   : [INSERT HANDLE]
  Facebook    : [INSERT PAGE URL]
  YouTube     : [INSERT CHANNEL URL]

---

## Partner Organisations

  NITI Aayog                        — Strategic development partnership
  NABARD                            — Agricultural and rural finance programs
  TAHDCO                            — SC/ST community development programs
  NSDC                              — Skill training (6+ year partnership)
  ASCI                              — Organic farming livelihood program
  EDII                              — Entrepreneurship and enterprise support
  SMILE Foundation                  — Youth e-learning & skill development (STeP)
  Manos Unidas, Spain               — Agricultural Training Center funding
  Child Aid ACA, Denmark            — Child rights awareness program
  CECOWOR                           — Child rights project co-implementation
  BIRDS                             — Women empowerment & youth skill programs
  Kolping India / Nandri Foundation — Thiruvannamalai rural project
  SSH, Dindigul                     — Surabi Magalir women's program
  State Planning Commission, TN     — Javvadhu Hills horticulture assessment

---

## Build Order Recommendation

  Start in this order to avoid re-work:

  Step 1  css/global.css         — variables, reset, typography, utilities
  Step 2  components/navbar.html + css/navbar.css + js/navbar.js
  Step 3  components/footer.html + css/footer.css
  Step 4  js/main.js             — fetch and inject navbar + footer
  Step 5  index.html + css/home.css + js/counter.js + js/scroll-reveal.js
  Step 6  about.html + css/about.css
  Step 7  projects.html + css/projects.css + js/projects.js
  Step 8  Individual project pages (projects/*.html)
  Step 9  programs.html + css/programs.css
  Step 10 gallery.html + css/gallery.css + js/gallery.js
  Step 11 contact.html + css/contact.css + js/contact.js
  Step 12 404.html
  Step 13 robots.txt + sitemap.xml
  Step 14 SEO meta tags pass on all pages
  Step 15 Accessibility audit pass on all pages

---

*README last updated: 2025*
*Organisation: Hope Ever Foundation, Tamil Nadu, India*
