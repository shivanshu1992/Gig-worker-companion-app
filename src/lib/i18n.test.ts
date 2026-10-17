import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, getTranslation } from './i18n/translations';

describe('Localization & Translations (i18n) Engine', () => {
  it('supports English, Hindi, and Punjabi dictionaries', () => {
    expect(TRANSLATIONS.en).toBeDefined();
    expect(TRANSLATIONS.hi).toBeDefined();
    expect(TRANSLATIONS.pa).toBeDefined();
  });

  it('provides complete navigation keys in all 3 languages', () => {
    const requiredNavKeys = [
      'dashboard',
      'earnings',
      'assistant',
      'safety',
      'rights',
      'documents',
      'grievances',
      'profile',
    ] as const;

    for (const key of requiredNavKeys) {
      expect(TRANSLATIONS.en.nav[key]).toBeTruthy();
      expect(TRANSLATIONS.hi.nav[key]).toBeTruthy();
      expect(TRANSLATIONS.pa.nav[key]).toBeTruthy();
    }
  });

  it('provides complete dashboard translation keys in English and Hindi', () => {
    expect(TRANSLATIONS.en.dashboard.todayEarnings).toBe("Today's Net Earnings");
    expect(TRANSLATIONS.hi.dashboard.todayEarnings).toBe('आज की शुद्ध कमाई (Net)');

    expect(TRANSLATIONS.en.dashboard.logNewShift).toBeTruthy();
    expect(TRANSLATIONS.hi.dashboard.logNewShift).toBeTruthy();

    expect(TRANSLATIONS.en.dashboard.askAi).toBeTruthy();
    expect(TRANSLATIONS.hi.dashboard.askAi).toBeTruthy();

    expect(TRANSLATIONS.en.dashboard.checkSchemes).toBeTruthy();
    expect(TRANSLATIONS.hi.dashboard.checkSchemes).toBeTruthy();

    expect(TRANSLATIONS.en.dashboard.draftGrievance).toBeTruthy();
    expect(TRANSLATIONS.hi.dashboard.draftGrievance).toBeTruthy();
  });

  it('provides complete rights & grievance translation keys in all languages', () => {
    expect(TRANSLATIONS.en.rights.title).toBeTruthy();
    expect(TRANSLATIONS.hi.rights.title).toBeTruthy();
    expect(TRANSLATIONS.pa.rights.title).toBeTruthy();

    expect(TRANSLATIONS.en.grievances.title).toBeTruthy();
    expect(TRANSLATIONS.hi.grievances.title).toBeTruthy();
    expect(TRANSLATIONS.pa.grievances.title).toBeTruthy();
  });

  it('getTranslation falls back to English when unknown language is requested', () => {
    const fallback = getTranslation('fr' as any);
    expect(fallback.appName).toBe(TRANSLATIONS.en.appName);

    const hi = getTranslation('hi');
    expect(hi.appName).toBe(TRANSLATIONS.hi.appName);

    const pa = getTranslation('pa');
    expect(pa.appName).toBe(TRANSLATIONS.pa.appName);
  });
});
