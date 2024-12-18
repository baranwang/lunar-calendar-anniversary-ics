import { useFormDays } from '@/app/hooks/use-form-days';
import { compressToBase64 } from '@/lib/compress';
import { Form, TextArea } from '@douyinfe/semi-ui';
import { useMemo } from 'react';
import useSWR from 'swr';

export const Subscription: React.FC = () => {
  const { days } = useFormDays();

  const configStr = useMemo(() => {
    if (!days?.length) {
      return null;
    }
    return JSON.stringify(days.map((item) => [item.day, item.temp]));
  }, [days]);

  const { data: icsUrl } = useSWR(['config', configStr], async ([_, configString]) => {
    if (!configString) {
      return null;
    }
    const params = await compressToBase64(configString);
    const url = new URL(`/ics/${encodeURIComponent(params)}`, window.location.origin);
    return url.toString();
  });

  if (!icsUrl) {
    return null;
  }
  return (
    <Form.Slot label='订阅地址'>
      <TextArea value={icsUrl} />
    </Form.Slot>
  );
};
