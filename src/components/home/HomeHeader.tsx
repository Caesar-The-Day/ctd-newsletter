import { Link } from 'react-router-dom';

const navLink =
  'px-2 py-1 text-muted-foreground transition-colors hover:text-foreground';

const HomeHeader = () => (
  <header className="sticky top-0 z-50 border-b border-border bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/85">
    <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/images/shared/caesartheday-logo.png"
          alt="CaesarTheDay logo"
          className="h-11 w-11"
        />
        <span className="leading-tight">
          <span className="font-display block text-lg font-semibold md:text-xl">
            Veni. Vidi. Vici.
          </span>
          <span className="block text-xs text-muted-foreground">by CaesarTheDay®</span>
        </span>
      </Link>

      <nav className="flex flex-wrap items-center gap-2 text-sm md:gap-3">
        <a href="#regions" className={navLink}>
          Regions
        </a>
        <a href="#map" className={navLink}>
          Map
        </a>
        <a href="#about" className={navLink}>
          About Caesar
        </a>
        <a
          href="#signup"
          className="ml-2 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground transition-colors hover:bg-terracotta-deep"
        >
          Get new regions
        </a>
      </nav>
    </div>
  </header>
);

export default HomeHeader;
