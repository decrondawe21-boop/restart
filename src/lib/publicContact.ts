export interface PublicContactInfo {
  companyName: string;
  companyNameUpper: string;
  addressLine: string;
  cityLine: string;
  phone: string;
  email: string;
  primaryWebsite: string;
  primaryWebsiteUrl: string;
  secondaryWebsite: string;
  secondaryWebsiteUrl: string;
  registrationNote: string;
  companyMeta: string;
}

export const publicContact: PublicContactInfo = {
  companyName: 'David Kozák International s.r.o.',
  companyNameUpper: 'DAVID KOZÁK INTERNATIONAL S.R.O.',
  addressLine: 'Drážďanská 517/52',
  cityLine: '400 07 Ústí nad Labem',
  phone: '+420 778 564 279',
  email: 'restart@dk-i.cz',
  primaryWebsite: 'restartintegrace.dk-i.cz',
  primaryWebsiteUrl: 'https://restartintegrace.dk-i.cz',
  secondaryWebsite: 'www.international.david-kozak.com',
  secondaryWebsiteUrl: 'https://international.david-kozak.com',
  registrationNote: 'Zapsaná v obchodním rejstříku vedeném Krajským soudem v Ústí nad Labem, oddíl C, vložka 53832',
  companyMeta: 'IČO: 23143614 | DIČ: CZ23143614'
};
