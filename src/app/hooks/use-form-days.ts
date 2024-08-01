import { useFormState } from '@douyinfe/semi-ui';
import { useMemo } from 'react';

export type FormType = {
  days: {
    day: Date;
    temp: string;
  }[];
};

export function useFormDays() {
  const formState = useFormState<FormType>();

  const daysStr = JSON.stringify(formState.values?.days?.filter((item) => item.day && item.temp) ?? []);

  const days = useMemo<FormType['days']>(() => JSON.parse(daysStr), [daysStr]);

  return { days };
}
