import { EventType } from '@/app/api/preview/route';
import { MAX_YEAR } from '@/app/constants/common';
import { useFormDays } from '@/app/hooks/use-form-days';
import { Calendar, Card, DatePicker } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import type { CalendarProps } from '@douyinfe/semi-ui/lib/es/calendar/interface';

import styles from './preview.module.scss';

export const Preview: React.FC = () => {
  const { days = [] } = useFormDays();

  const [displayValue, setDisplayValue] = useState(new Date());

  const { data } = useSWR(['api/preview', days], ([url, params]) => {
    if (!params.length) {
      return Promise.resolve([]);
    }
    return fetch(url, { body: JSON.stringify({ days: params }), method: 'POST' })
      .then((res) => res.json() as Promise<EventType[]>)
      .then((res) =>
        res?.map<NonNullable<CalendarProps['events']>[number]>((item, index) => ({
          key: index.toString(),
          start: new Date(item.start),
          allDay: true,
          children: <div className={styles['preview-item']}>{item.title}</div>,
        }))
      );
  });

  useEffect(() => {
    if (data?.length) {
      setDisplayValue(data[0].start!);
    }
  }, [data]);

  const { data: calendar } = useSWR(['api/calendar', displayValue], ([url, date]) => fetch(`${url}/${date.getTime()}`).then((res) => res.json() as Promise<Record<number, string>>));

  return (
    <Calendar
      header={
        <DatePicker
          type='month'
          value={displayValue}
          disabledDate={(date) => {
            if (!date) {
              return false;
            }
            if (date.getFullYear() > MAX_YEAR) {
              return true;
            }
            return false;
          }}
          onChange={setDisplayValue as any}
        />
      }
      displayValue={displayValue}
      mode='month'
      height='calc(100vh - 32px)'
      events={data}
      markWeekend
      weekStartsOn={1}
      dateGridRender={(_, date) => {
        const timestamp = date?.valueOf();
        if (calendar && timestamp) {
          return <span className={styles['lunar-text']}>{calendar[timestamp]}</span>;
        }
        return null;
      }}
    />
  );
};