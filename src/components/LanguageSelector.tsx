import { ChevronDown } from 'lucide-react';

interface Language {
  id: string;
  name: string;
  icon?: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageSelector({ 
  languages, 
  selectedLanguage, 
  onLanguageChange 
}: LanguageSelectorProps) {
  const selectedLang = languages.find(lang => lang.id === selectedLanguage);

  return (
    <div className="relative inline-block">
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="appearance-none w-full min-w-[140px] bg-white/80 backdrop-blur-sm px-4 py-2 pr-8 rounded-lg border border-purple-100 shadow-sm text-sm font-medium text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer transition-colors duration-200"
      >
        {languages.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-purple-500" />
      </div>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-purple-600"></div>
      </div>
    </div>
  );
}