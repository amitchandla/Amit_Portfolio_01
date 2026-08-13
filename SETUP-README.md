# Setup Guide — Amit Portfolio

Sab files ready hain: `index.html`, `style.css`, `script.js`, `auth.js`, `supabase-config.js`.
Bas neeche diye 3 steps follow karo taaki Login/Signup, Contact Form aur GitHub sign-in
**live** kaam karein.

## 1. Supabase Project Banao (Login/Signup + Contact Form Backend)

1. https://supabase.com par jaake free account banao aur **New Project** create karo.
2. Project ban jaane ke baad: **Project Settings → API** open karo.
3. Wahan se `Project URL` aur `anon public` key copy karo.
4. `supabase-config.js` file kholo aur ye do lines apni values se replace karo:

```js
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
```

⚠️ Sirf **anon public** key use karo, kabhi bhi `service_role` key website me mat daalna —
wo secret hai.

### Contact Form ke liye table banao

Supabase dashboard me **SQL Editor** open karke ye query run karo:

```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

create policy "Anyone can send a message"
  on messages for insert
  to anon
  with check (true);
```

Ab jo bhi tumhare contact form se message bhejega, wo `messages` table me save ho jayega —
tum Supabase dashboard ke **Table Editor** me jaake sab messages dekh sakte ho.

## 2. GitHub Login Connect Karo

1. GitHub par jaake ek OAuth App banao: https://github.com/settings/developers → **New OAuth App**
2. **Authorization callback URL** me Supabase ka callback URL daalna hai — ye tumhe
   Supabase dashboard → **Authentication → Providers → GitHub** section me mil jayega
   (kuch aisa dikhega: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`)
3. GitHub OAuth App banne ke baad uski **Client ID** aur **Client Secret** copy karo.
4. Wapas Supabase dashboard → **Authentication → Providers → GitHub** me jaake enable
   karo aur ye Client ID/Secret paste karo, phir Save.

Bas — ab "Continue with GitHub" button working ho jayega (modal me login/signup form ke
neeche hai).

## 3. Email Confirmation (Optional but recommended)

Default me Supabase signup ke baad confirmation email bhejta hai. Agar turant login allow
karwana hai testing ke liye, to: **Authentication → Providers → Email → "Confirm email"**
ko off kar sakte ho (production me on rakhna better hai).

## 4. WhatsApp Button

Already working hai — `index.html` me ye line dekho:

```html
<a href="https://wa.me/917015559332?text=..." class="whatsapp-float">
```

Number already `+91 7015559332` set hai. Message text change karna ho to `?text=` ke
baad wali value edit kar do (spaces ko `%20` se replace karna).

## 5. Resume File

Hero section me "Download Resume" button `assets/Amit_Resume.pdf` ko point kar raha hai.
Apna resume PDF `assets/Amit_Resume.pdf` path par daal do (ya button ka `href` change kar
do apni file ke naam se).

## 6. Data Backup (Supabase se export)

Do tarike hain apna contact-form data backup lene ke:

### A) Admin panel se (asaan, koi coding nahi)

1. `admin.html` file bhi tumhare project me hai — usme ye line dhundo aur apni email daalo:

```js
const ADMIN_EMAIL = "Amitchandla2001@gmail.com";
```

2. Site par jaake homepage se **Sign in** karo (usi email se jo upar likhi hai).
3. Phir `admin.html` open karo (e.g. `yourdomain.com/admin.html`).
4. Wahan **Export CSV** ya **Export JSON** button dabao — sare contact-form messages
   ek file me download ho jayenge, tumhare computer par.

Bas itna hi — jab bhi backup chahiye ho, admin.html kholo aur export kar lo.

### B) Supabase khud automatic backups leta hai (extra safety)

Free plan me Supabase daily backups rakhta hai kuch din ke liye. Agar full database ka
backup manually lena ho (sab tables, sirf messages nahi), Supabase CLI se ye command
chalao:

```bash
supabase db dump --db-url "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f backup.sql
```

(`[PASSWORD]` aur `[HOST]` tumhe Supabase dashboard → **Project Settings → Database**
me mil jayenge.) Ye ek `.sql` file banayega jisse zarurat padne par database wapas
restore kar sakte ho.

## 7. GitHub se Connect Karna

### A) Project ko GitHub repo par push karna

1. https://github.com par jaake **New repository** banao (e.g. `amit-portfolio`), empty rakho
   (README add mat karo).
2. Apne computer par jahan ye files hain, wahan terminal khol ke ye commands chalao:

```bash
cd path/to/portfolio-folder
git init
git add .
git commit -m "Initial portfolio upload"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/amit-portfolio.git
git push -u origin main
```

3. Refresh karke GitHub par apni repo check karo — saari files (`index.html`, `style.css`,
   `admin.html`, etc.) dikhni chahiye.

Ab jab bhi koi change karo, dobara push karne ke liye bas:

```bash
git add .
git commit -m "update"
git push
```

### B) "Continue with GitHub" login button check karna

Ye button Section 2 me kiya GitHub OAuth setup use karta hai (Supabase Authentication →
Providers → GitHub). Test karne ke liye:

1. Site open karo, **Sign in** → **Continue with GitHub** dabao.
2. GitHub ka authorize page khulega, allow karo.
3. Wapas site par redirect hoke tumhara naam navbar me dikhna chahiye.

Agar ye kaam na kare, sabse common wajah hoti hai GitHub OAuth App ka
**callback URL** galat hona — dubara Section 2 ke steps check kar lena.

## 8. Deploy (GitHub Pages / Cloudflare Pages / Netlify)

Ye pure static files hain (no build step), isliye kahin bhi directly deploy ho jayenge:

- **GitHub Pages:** Repo banao, saari files push karo, Settings → Pages → branch select karo.
- **Cloudflare Pages:** Repo connect karo, build command empty rakho, output directory `/`.
- **Netlify:** Folder drag-and-drop kar do deploy hone ke liye.

Bas itna hi — files already production-ready hain, sirf apne Supabase aur GitHub keys
daalne hain.
