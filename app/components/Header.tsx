import Link from "next/link";
import { Locale, locales } from "../i18n";

// Add translations for header
const headerTranslations = {
  'en': {
    viewHighScores: 'HALL OF FAME',
  },
  'zh-TW': {
    viewHighScores: '名人堂',
  }
};

interface HeaderProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export default function Header({ locale, setLocale }: HeaderProps) {
  return (
    <header 
      className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 px-4 py-2 backdrop-blur-sm border-b border-gray-800"
      style={{ height: 'var(--header-height)', zIndex: 50 }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between h-full">
        {/* App Logo/Name - clickable home link */}
        <div className="flex items-center">
          <Link 
            href="/"
            className="font-mono text-sm sm:text-base tracking-wider hover:opacity-80 transition-opacity" 
            style={{ color: 'var(--theme-highlight)' }}
          >
            APOC
          </Link>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex items-center space-x-3 sm:space-x-6">
          {/* High Scores Link */}
          <Link 
            href="/highscores"
            className="text-gray-300 hover:text-gray-100 font-mono text-sm sm:text-base transition-colors"
            style={{ color: 'var(--theme-secondary)' }}
          >
            {headerTranslations[locale].viewHighScores}
          </Link>
          
          {/* Language Selector */}
          <select
            className="bg-gray-800 text-gray-200 p-1 sm:p-2 rounded-md border border-gray-700 text-sm"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label="Select language"
          >
            {Object.entries(locales).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  );
} 