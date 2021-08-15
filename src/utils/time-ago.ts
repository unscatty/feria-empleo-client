import moment from 'moment';
moment.updateLocale('es', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: (number) => `hace ${number} segundos`,
    ss: 'hace %ds segundos',
    m: 'hace un 1 minuto',
    mm: 'hace %d minutos',
    h: 'hace 1 hora',
    hh: 'hace %d horas',
    d: 'hace 1 dia',
    dd: 'hace %d dias',
    M: 'hace 1 mes',
    MM: 'hace %d meses',
    y: 'hace 1 año',
    yy: 'hace %d años',
  },
});
export const timeAgo = (time: Date) => {
  return moment(time).fromNow(true);
};
