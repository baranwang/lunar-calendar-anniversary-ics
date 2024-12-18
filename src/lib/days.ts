import handlebars from 'handlebars';
import { LunarDay, LunarYear, SolarDay } from "tyme4ts";

export const fetchAnniversary = async (startDate: Date, titleTemplate: string) => {
  const lunarStartDate = SolarDay.fromYmd(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate()
  ).getLunarDay();

  const compileTitle = handlebars.compile(titleTemplate);

  return Array.from({ length: 2100 - lunarStartDate.getYear() }, (_, offset) => {
    const targetLunarYear = lunarStartDate.getYear() + offset + 1;
    let targetLunarMonth = lunarStartDate.getMonth();

    // 处理闰月逻辑
    if (
      targetLunarMonth < 0 &&
      LunarYear.fromYear(targetLunarYear).getLeapMonth() !== -targetLunarMonth
    ) {
      targetLunarMonth = -targetLunarMonth;
    }

    const targetSolarDate = LunarDay.fromYmd(
      targetLunarYear,
      targetLunarMonth,
      lunarStartDate.getDay()
    ).getSolarDay();

    // 计算农历年份差
    const anniversaryLunarYearDiff = targetLunarYear - lunarStartDate.getYear();

    return {
      year: targetSolarDate.getYear(),
      month: targetSolarDate.getMonth(),
      date: targetSolarDate.getDay(),
      title: compileTitle({ years: anniversaryLunarYearDiff })
    };
  });
};