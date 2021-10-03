export const jobPostTypes = [
  { text: 'Tiempo completo', value: 'full_time' },
  { text: 'Medio tiempo', value: 'part_time' },
];

export const jobPostModes = [
  { text: 'Presencial', value: 'office' },
  { text: 'Mixto', value: 'hybrid' },
  { text: 'Remoto', value: 'home_office' },
];

export const experienceItems = [
  { text: 'Sin experiencia', value: 'none' },
  { text: '1 año', value: '1y' },
  { text: '2 años', value: '2y' },
  { text: '3 años en adelante', value: '3yy' },
];

export const salaryItems = [
  { text: 'Hasta $5,000', value: { salaryMaxLte: 5000 } },
  { text: '$5,000 - $15,000', value: { salaryMinGte: 5000, salaryMaxLte: 15000 } },
  { text: '$15,000 - $30,000', value: { salaryMinGte: 15000, salaryMaxLte: 30000 } },
  { text: '$30,000 - $45,000', value: { salaryMinGte: 30000, salaryMaxLte: 45000 } },
  { text: '$45,000 - $60,000', value: { salaryMinGte: 45000, salaryMaxLte: 60000 } },
  { text: '$60,000 o más', value: { salaryMinGte: 60000 } },
];
