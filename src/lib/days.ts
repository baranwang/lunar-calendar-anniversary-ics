import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PluginLunar } from "dayjs-plugin-lunar";
import handlebars from 'handlebars';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(PluginLunar);

dayjs.tz.setDefault('Asia/Shanghai');

export { dayjs };

export const fetchAnniversary = async (startDate: Date, titleTemplate: string) => {
  const startDay = dayjs(startDate);
  const compileTitle = handlebars.compile(titleTemplate);
  const lunarStartYear = startDay.toLunarYear().getYear();

  return Array.from({ length: 2100 - lunarStartYear }, (_, offset) => {
    const targetDate = startDay.addLunar(offset + 1, 'year');
    const anniversaryLunarYearDiff = targetDate.toLunarYear().getYear() - lunarStartYear;
    return {
      year: targetDate.year(),
      month: targetDate.month() + 1,
      date: targetDate.date(),
      title: compileTitle({ years: anniversaryLunarYearDiff })
    };
  });
};
