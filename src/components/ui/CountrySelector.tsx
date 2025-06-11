'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
  phoneCode: string;
}

const COUNTRIES: Country[] = [
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', phoneCode: '+20' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', phoneCode: '+966' },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات', flag: '🇦🇪', phoneCode: '+971' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', phoneCode: '+965' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', phoneCode: '+974' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', phoneCode: '+973' },
  { code: 'OM', name: 'Oman', nameAr: 'عمان', flag: '🇴🇲', phoneCode: '+968' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', phoneCode: '+962' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧', phoneCode: '+961' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', phoneCode: '+964' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', flag: '🇸🇾', phoneCode: '+963' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦', phoneCode: '+212' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳', phoneCode: '+216' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿', phoneCode: '+213' },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', flag: '🇱🇾', phoneCode: '+218' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', flag: '🇸🇩', phoneCode: '+249' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', flag: '🇾🇪', phoneCode: '+967' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', flag: '🇵🇸', phoneCode: '+970' },
  { code: 'US', name: 'United States', nameAr: 'أمريكا', flag: '🇺🇸', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', nameAr: 'بريطانيا', flag: '🇬🇧', phoneCode: '+44' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', flag: '🇫🇷', phoneCode: '+33' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', phoneCode: '+49' },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', flag: '🇮🇹', phoneCode: '+39' },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', flag: '🇪🇸', phoneCode: '+34' },
  { code: 'CA', name: 'Canada', nameAr: 'كندا', flag: '🇨🇦', phoneCode: '+1' },
  { code: 'AU', name: 'Australia', nameAr: 'أستراليا', flag: '🇦🇺', phoneCode: '+61' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', phoneCode: '+90' },
  { code: 'IN', name: 'India', nameAr: 'الهند', flag: '🇮🇳', phoneCode: '+91' },
  { code: 'PK', name: 'Pakistan', nameAr: 'باكستان', flag: '🇵🇰', phoneCode: '+92' },
  { code: 'BD', name: 'Bangladesh', nameAr: 'بنجلاديش', flag: '🇧🇩', phoneCode: '+880' },
  { code: 'MY', name: 'Malaysia', nameAr: 'ماليزيا', flag: '🇲🇾', phoneCode: '+60' },
  { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا', flag: '🇮🇩', phoneCode: '+62' },
  { code: 'TH', name: 'Thailand', nameAr: 'تايلاند', flag: '🇹🇭', phoneCode: '+66' },
  { code: 'CN', name: 'China', nameAr: 'الصين', flag: '🇨🇳', phoneCode: '+86' },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان', flag: '🇯🇵', phoneCode: '+81' },
  { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية', flag: '🇰🇷', phoneCode: '+82' },
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', flag: '🇧🇷', phoneCode: '+55' },
  { code: 'MX', name: 'Mexico', nameAr: 'المكسيك', flag: '🇲🇽', phoneCode: '+52' },
  { code: 'RU', name: 'Russia', nameAr: 'روسيا', flag: '🇷🇺', phoneCode: '+7' },
  { code: 'ZA', name: 'South Africa', nameAr: 'جنوب أفريقيا', flag: '🇿🇦', phoneCode: '+27' }
];

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  className?: string;
  disabled?: boolean;
}

export function CountrySelector({ 
  selectedCountry, 
  onCountryChange, 
  className = '',
  disabled = false 
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES);

  useEffect(() => {
    const filtered = COUNTRIES.filter(country =>
      country.nameAr.includes(searchTerm) ||
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.phoneCode.includes(searchTerm)
    );
    setFilteredCountries(filtered);
  }, [searchTerm]);

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300' 
            : 'bg-white text-gray-900 border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="font-medium">{selectedCountry.phoneCode}</span>
          <span className="text-sm text-gray-600">{selectedCountry.nameAr}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن دولة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 focus:bg-blue-50 focus:outline-none transition-colors"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 text-right">
                    <div className="font-medium text-gray-900">{country.nameAr}</div>
                    <div className="text-sm text-gray-500">{country.name}</div>
                  </div>
                  <div className="font-medium text-blue-600">{country.phoneCode}</div>
                </button>
              ))
            ) : (
              <div className="px-3 py-8 text-center text-gray-500">
                لا توجد دول مطابقة للبحث
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export الدول للاستخدام في أماكن أخرى
export { COUNTRIES };
export type { Country }; 