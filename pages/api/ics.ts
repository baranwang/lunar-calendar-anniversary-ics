// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import solarlunar from 'solarlunar'
import * as ics from 'ics'

const getTitle = (title: string, type: string, years: number) => {
  switch (type) {
    case 'd':
      return years > 0 ? `${title} ${years} 周年忌日` : `${title}忌日`
    case 'b':
      return years > 0 ? `${title} ${years} 岁生日` : `${title}生日`
    default:
      return `${title}${type}`
  }
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { d = '' } = req.query
  if (typeof d === 'string') {
    d = [d]
  }
  const nowYear = new Date().getFullYear()
  const events: ics.EventAttributes[] = d.map(item => {
    const [title, type, ...date] = item.split(',')
    const { cYear: year, lMonth: month, lDay: day, isLeap } = solarlunar.solar2lunar(...date)
    return Array.from({ length: nowYear - year + 11 }, (_, i) => {
      let solarlunarDate = solarlunar.lunar2solar(i + year, month, day, isLeap)
      if (!solarlunarDate || typeof solarlunarDate !== 'object') {
        solarlunarDate = solarlunar.lunar2solar(i + year, month, day)
      }
      let { cYear, cMonth, cDay } = solarlunarDate
      return {
        start: [cYear, cMonth, cDay] as [number, number, number],
        duration: { days: 1 },
        title: getTitle(title, type, i),
      }
    })
  }).flat()

  const { error, value } = ics.createEvents(events)
  if (error) {
    return res.status(500).send(error)
  }
  res.setHeader('Content-Type', 'text/calendar')
  res.status(200).send(value)
}
