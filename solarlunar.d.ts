interface SolarLunarOutput {
  lYear: number,
  lMonth: number,
  lDay: number,
  animal: string,
  monthCn: string,
  dayCn: string,
  cYear: number,
  cMonth: number,
  cDay: number,
  gzYear: string,
  gzMonth: string,
  gzDay: string,
  isToday: boolean,
  isLeap: boolean,
  nWeek: number,
  ncWeek: string,
  isTerm: boolean,
  term: string

}
declare module 'solarlunar' {
  function solar2lunar(...date: (number | string)[]): SolarLunarOutput
  function lunar2solar(year: number, month: number, day: number, isLeapMonth?: boolean): SolarLunarOutput
}