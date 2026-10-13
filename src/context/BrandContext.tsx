import React, { createContext, useContext, useState, useEffect } from 'react';
import { TestTube } from 'lucide-react';
import api from '../lib/api';

interface BrandContextType {
  logoUrl: string;
  platformName: string;
  platformTagline: string;
  supportEmail: string;
  settings: Record<string, any>;
  updateLogo: (url: string) => void;
  reloadBrand: () => Promise<void>;
}

const BrandContext = createContext<BrandContextType>({
  logoUrl: '',
  platformName: 'Genes India',
  platformTagline: 'ART Bank & Cryo-Repository',
  supportEmail: 'support@genesindia.com',
  settings: {},
  updateLogo: () => {},
  reloadBrand: async () => {}
});

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [platformName, setPlatformName] = useState<string>('Genes India');
  const [platformTagline, setPlatformTagline] = useState<string>('ART Bank & Cryo-Repository');
  const [supportEmail, setSupportEmail] = useState<string>('support@genesindia.com');

  const applyFavicon = (url: string) => {
    if (!url) return;
    try {
      const link: HTMLLinkElement | null = 
        document.querySelector("link[rel*='icon']") || 
        document.querySelector("link[rel='shortcut icon']");
      if (link) {
        link.href = url;
      }
      const appleLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
      if (appleLink) {
        appleLink.href = url;
      }
    } catch (e) {
      console.warn('Favicon update error:', e);
    }
  };

  const loadBrandSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data) {
        setSettings(res.data);
        if (res.data.logoUrl) {
          setLogoUrl(res.data.logoUrl);
          applyFavicon(res.data.logoUrl);
        }
        if (res.data.platformName) {
          setPlatformName(res.data.platformName);
        }
        if (res.data.platformTagline) {
          setPlatformTagline(res.data.platformTagline);
        }
        if (res.data.supportEmail) {
          setSupportEmail(res.data.supportEmail);
        }
      }
    } catch (err) {
      console.error('Failed to load branding settings', err);
    }
  };

  useEffect(() => {
    loadBrandSettings();
  }, []);

  const updateLogo = (url: string) => {
    setLogoUrl(url);
    applyFavicon(url);
  };

  return (
    <BrandContext.Provider 
      value={{
        logoUrl,
        platformName,
        platformTagline,
        supportEmail,
        settings,
        updateLogo,
        reloadBrand: loadBrandSettings
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ 
  className = '', 
  imageClassName = '', 
  showText = true, 
  variant = 'dark',
  size = 'md'
}: BrandLogoProps) {
  const { logoUrl, platformName, platformTagline } = useBrand();

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={platformName} 
          className={`object-contain rounded-lg transition-transform ${
            size === 'sm' ? 'h-7 w-auto max-w-[120px]' : 
            size === 'lg' ? 'h-11 w-auto max-w-[180px]' : 
            'h-9 w-auto max-w-[150px]'
          } ${imageClassName}`} 
        />
      ) : (
        <div className={`rounded-xl flex items-center justify-center shrink-0 ${
          size === 'sm' ? 'w-7 h-7 bg-blue-600 p-1.5' : 
          size === 'lg' ? 'w-11 h-11 bg-blue-600 p-2.5' : 
          'w-9 h-9 bg-blue-600 p-2'
        }`}>
          <TestTube className="w-full h-full text-white" />
        </div>
      )}

      {showText && (
        <div className="flex flex-col min-w-0">
          <span className={`font-bold tracking-tight leading-none truncate ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
          } ${isLight ? 'text-white' : 'text-slate-900'}`}>
            {platformName}
          </span>
          <span className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 truncate ${
            isLight ? 'text-blue-300' : 'text-blue-600'
          }`}>
            {platformTagline}
          </span>
        </div>
      )}
    </div>
  );
}
