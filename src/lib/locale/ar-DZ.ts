
import { ar } from 'date-fns/locale';

const formatters: any = {
  ...ar.formatters,
};

const localize: any = {
  ...ar.localize,
  month: (n: number) =>
    [
      'جانفي',
      'فيفري',
      'مارس',
      'أفريل',
      'ماي',
      'جوان',
      'جويلية',
      'أوت',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ][n],
};

const options: any = {
    ...ar.options,
}


export const arDZ: any = {
  ...ar,
  formatters: formatters,
  localize: localize,
  options: options,
};

    