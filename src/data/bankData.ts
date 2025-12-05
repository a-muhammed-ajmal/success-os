// UAE Banks Data
export const UAEBanks = [
  'Emirates NBD',
  'Abu Dhabi Commercial Bank (ADCB)',
  'First Abu Dhabi Bank (FAB)',
  'Dubai Islamic Bank (DIB)',
  'Emirates Islamic Bank',
  'Mashreq Bank',
  'RAKBANK',
  'Commercial Bank of Dubai (CBD)',
  'Abu Dhabi Islamic Bank (ADIB)',
  'Sharjah Islamic Bank',
  'National Bank of Fujairah (NBF)',
  'National Bank of Ras Al Khaimah (RAKBANK)',
  'Ajman Bank',
  'Noor Bank',
  'HSBC UAE',
  'Standard Chartered UAE',
  'Citibank UAE',
  'Barclays UAE',
  'National Bank of Umm Al Qaiwain',
  'Invest Bank',
  'United Arab Bank',
  'Arab Bank',
  'Bank of Sharjah',
  'Commercial Bank International (CBI)',
  'Finance House',
  'Habib Bank AG Zurich',
  'ICICI Bank',
  'Lloyds Bank',
  'Mashreqbank',
  'Other',
].sort();

// Emirates Islamic Bank Credit Card Products
export const EIBCreditCards = [
  'Emirates Islamic Skywards Signature Credit Card',
  'Emirates Islamic Skywards Premium Credit Card',
  'Emirates Islamic Titanium Credit Card',
  'Emirates Islamic Platinum Credit Card',
  'Emirates Islamic Gold Credit Card',
  'Emirates Islamic Infinite Credit Card',
  'Emirates Islamic World Credit Card',
  'Emirates Islamic Business Credit Card',
  'Emirates Islamic Covered Card',
].sort();

// Helper function to get EIB credit cards
export const getEIBCreditCards = (): string[] => {
  return EIBCreditCards;
};

// Helper function to check if bank is Emirates Islamic Bank
export const isEmiratesIslamicBank = (bankName: string | null): boolean => {
  return bankName === 'Emirates Islamic Bank';
};
