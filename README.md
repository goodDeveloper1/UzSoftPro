# UzSoftPro - Modern Web Application

A modern, high-performance web application built with **Next.js 15**, **React 19**, and **TypeScript**. Features a sleek dark-themed UI with advanced animations, interactive components, and responsive design.

## 🚀 Tech Stack

### Core Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19.0.0** - Latest React with server components support
- **TypeScript 5** - Type-safe development

### Styling & Animation
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12** - Advanced animation library
- **Motion 12** - Motion primitives for React
- **Geist UI** - Modern design system

### UI Components & Utilities
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **COBE** - Interactive globe visualizations
- **Tailwind Merge** - Smart class name merging
- **Class Variance Authority** - CSS-in-JS variants

### Development Tools
- **ESLint 9** - Code linting
- **PostCSS 4** - CSS processing
- **TW Animate CSS** - Tailwind animation utilities

## 📁 Project Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── loading.tsx               # Loading component
│   ├── about/                    # About page
│   ├── portfolio/                # Portfolio page
│   ├── team/                     # Team page
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   └── api/                      # API routes
│       └── contact/route.ts      # Contact API endpoint
├── components/                   # Reusable React components
│   ├── hero.tsx                  # Hero section
│   ├── features.tsx              # Features showcase
│   ├── testimonials.tsx          # Testimonials carousel
│   ├── faq-section.tsx           # FAQ accordion
│   ├── new-release-promo.tsx     # Release promotion
│   ├── sticky-footer.tsx         # Floating footer
│   ├── globe.tsx                 # Interactive globe
│   ├── pixelcards.tsx            # Pixel-style cards
│   ├── pulse-card.tsx            # Animated pulse cards
│   ├── gridbeam.tsx              # Grid beam effects
│   ├── marquee.tsx               # Scrolling marquee
│   ├── scramble.tsx              # Text scramble animation
│   ├── following-pointer.tsx     # Cursor following effect
│   ├── badge.tsx                 # Badge component
│   ├── home-badge.tsx            # Home-specific badge
│   └── ui/                       # Base UI components
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card wrapper
│       ├── input.tsx             # Input field
│       ├── label.tsx             # Form label
│       └── badge.tsx             # Badge component
├── lib/                          # Utility functions
│   ├── fonts.ts                  # Font configuration
│   ├── load-script.ts            # Script loader utility
│   └── utils.ts                  # Common utilities
├── public/                       # Static assets
│   ├── images/                   # Team member photos, logos
│   └── icons/                    # SVG icons
├── components.json               # Component configuration
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.*             # Tailwind configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
└── package.json                  # Dependencies & scripts
```

## 🎨 Key Features

- **Dark Theme** - Beautiful dark mode UI as default
- **Responsive Design** - Mobile-first, fully responsive layouts
- **Advanced Animations** - Smooth transitions using Framer Motion
- **Interactive Elements** - Cursor-following effects, scramble text, globe visualizations
- **Component Library** - Reusable UI components using Radix UI primitives
- **API Integration** - Contact form API endpoint
- **Performance Optimized** - Uses Next.js 15 with Turbopack for fast development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📄 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero section, features, testimonials |
| `/about` | About page |
| `/portfolio` | Portfolio showcase |
| `/team` | Team members page |
| `/login` | Login authentication page |
| `/signup` | User registration page |
| `/api/contact` | Contact form API endpoint |

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint linter |

## 📦 Key Dependencies

- `next` - React framework
- `react` - UI library
- `framer-motion` - Animation library
- `tailwindcss` - Styling
- `@radix-ui/*` - Accessible components
- `lucide-react` - Icons
- `cobe` - Globe visualization

## 🎯 Configuration Files

- **`next.config.ts`** - Next.js config (image domains, ESLint settings)
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.*`** - Tailwind CSS settings
- **`postcss.config.mjs`** - PostCSS processors
- **`components.json`** - Component registry

## 📝 Notes

- The application uses **dark theme by default** with theme switching via Next.js themes
- All components are built with accessibility in mind using Radix UI
- The project uses **absolute imports** (e.g., `@/components/...`)

## 📧 Contact API

The contact form submits to `/api/contact` endpoint for handling inquiries.

---

**Repository:** UzSoftPro  
**Owner:** goodDeveloper1  
**Branch:** main
