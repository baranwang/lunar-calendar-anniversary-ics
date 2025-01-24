import dayjs from 'dayjs';
import { PluginLunar } from "dayjs-plugin-lunar";
import handlebars from 'handlebars';

dayjs.extend(PluginLunar);

export { dayjs }

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
