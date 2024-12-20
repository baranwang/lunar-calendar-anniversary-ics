import dayjs from 'dayjs';
import { PluginLunar } from "dayjs-plugin-lunar";
import handlebars from 'handlebars';

dayjs.extend(PluginLunar);

export { dayjs }

export const fetchAnniversary = async (startDate: Date, titleTemplate: string) => {
  const lunarStartDate = dayjs.lunar(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
  const compileTitle = handlebars.compile(titleTemplate);
  const lunarStartYear = lunarStartDate.toLunarYear().getYear();

  return Array.from({ length: 2100 - lunarStartYear }, (_, offset) => {
    const targetDate = lunarStartDate.addLunar(offset + 1, 'year')
    const anniversaryLunarYearDiff = targetDate.toLunarYear().getYear() - lunarStartYear;
    return {
      year: targetDate.year(),
      month: targetDate.month() + 1,
      date: targetDate.date(),
      title: compileTitle({ years: anniversaryLunarYearDiff })
    };
  });
};