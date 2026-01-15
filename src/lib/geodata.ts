export const provinces = [
  { value: 'western', label: 'Western' },
  { value: 'central', label: 'Central' },
  { value: 'southern', label: 'Southern' },
  { value: 'northern', label: 'Northern' },
  { value: 'eastern', label: 'Eastern' },
  { value: 'north-western', label: 'North Western' },
  { value: 'north-central', label: 'North Central' },
  { value: 'uva', label: 'Uva' },
  { value: 'sabaragamuwa', label: 'Sabaragamuwa' },
];

export const districtsByProvince: { [key: string]: { value: string; label: string }[] } = {
  western: [
    { value: 'colombo', label: 'Colombo' },
    { value: 'gampaha', label: 'Gampaha' },
    { value: 'kalutara', label: 'Kalutara' },
  ],
  central: [
    { value: 'kandy', label: 'Kandy' },
    { value: 'matale', label: 'Matale' },
    { value: 'nuwara-eliya', label: 'Nuwara Eliya' },
  ],
  southern: [
    { value: 'galle', label: 'Galle' },
    { value: 'matara', label: 'Matara' },
    { value: 'hambantota', label: 'Hambantota' },
  ],
  northern: [
    { value: 'jaffna', label: 'Jaffna' },
    { value: 'kilinochchi', label: 'Kilinochchi' },
    { value: 'mannar', label: 'Mannar' },
    { value: 'vavuniya', label: 'Vavuniya' },
    { value: 'mullaitivu', label: 'Mullaitivu' },
  ],
  eastern: [
    { value: 'batticaloa', label: 'Batticaloa' },
    { value: 'ampara', label: 'Ampara' },
    { value: 'trincomalee', label: 'Trincomalee' },
  ],
  'north-western': [
    { value: 'kurunegala', label: 'Kurunegala' },
    { value: 'puttalam', label: 'Puttalam' },
  ],
  'north-central': [
    { value: 'anuradhapura', label: 'Anuradhapura' },
    { value: 'polonnaruwa', label: 'Polonnaruwa' },
  ],
  uva: [
    { value: 'badulla', label: 'Badulla' },
    { value: 'monaragala', label: 'Monaragala' },
  ],
  sabaragamuwa: [
    { value: 'ratnapura', label: 'Ratnapura' },
    { value: 'kegalle', label: 'Kegalle' },
  ],
};
