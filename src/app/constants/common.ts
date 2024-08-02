import { DisabledDateType } from '@douyinfe/semi-ui/lib/es/datePicker';

export const MAX_YEAR = 2100;
export const MIN_YEAR = 1901;

export const commonDisabledDate: DisabledDateType = (date) => {
  if (!date) {
    return false;
  }
  const year = date.getFullYear();
  if (year > MAX_YEAR || year < MIN_YEAR) {
    return true;
  }
  return false;
};
