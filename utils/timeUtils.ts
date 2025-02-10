import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime)

const languageOptions = {
    'en-us': {
        second: 'sec',
        seconds: 'secs',
        minute: 'min',
        minutes: 'mins',
        hour: 'hour',
        hours: 'hours',
        day: 'day',
        days: 'days',
        week: 'week',
        weeks: 'weeks',
        month: 'month',
        months: 'months',
        year: 'year',
        years: 'years'
    },
    'ja-jp': {
        second: '秒',
        seconds: '秒',
        minute: '分',
        minutes: '分',
        hour: '時間',
        hours: '時間',
        day: '日',
        days: '日',
        week: '週',
        weeks: '週',
        month: '月',
        months: '月',
        year: '年',
        years: '年'
    },
    'zh-cn': {
        second: '秒',
        seconds: '秒',
        minute: '分钟',
        minutes: '分钟',
        hour: '小时',
        hours: '小时',
        day: '天',
        days: '天',
        week: '周',
        weeks: '周',
        month: '月',
        months: '月',
        year: '年',
        years: '年'
    }
}

function replaceTimeUnits(input: string, language: Language) {
    const languageOption = languageOptions[language] ?? languageOptions['zh-cn']
    const replacements: Record<string, string> = {
        an: '1',
        a: '1',
        second: languageOption.second,
        seconds: languageOption.seconds,
        minute: languageOption.minute,
        minutes: languageOption.minutes,
        hour: languageOption.hour,
        hours: languageOption.hours,
        day: languageOption.day,
        days: languageOption.days,
        week: languageOption.week,
        weeks: languageOption.weeks,
        month: languageOption.month,
        months: languageOption.months,
        year: languageOption.year,
        years: languageOption.years
    }
    const regex = new RegExp(Object.keys(replacements).join('|'), 'gi')
    return input.replace(regex, (match) => replacements[match.toLowerCase()] ?? match)
}

export function formatTimeDiff(pastTime: number | Date | string, language: Language) {
    const now = dayjs()
    const diffInSeconds = now.diff(pastTime, 'second')

    const time = () => {
        if (diffInSeconds < 60) {
            return now.to(pastTime, true)
        } else if (diffInSeconds < 3600) {
            return now.to(pastTime, true)
        } else if (diffInSeconds < 86400) {
            return now.to(pastTime, true)
        } else if (diffInSeconds < 604800) {
            return now.to(pastTime, true)
        } else if (diffInSeconds < 2592000) {
            return now.to(pastTime, true)
        } else if (diffInSeconds< 31536000) {
            return now.to(pastTime, true)
        } else {
            return now.to(pastTime, true)
        }
    }

    if (time() === 'a few seconds') {
        return language === 'en-us' ? 'a few seconds' : '数秒前'
    }
    return replaceTimeUnits(time(), language).replace(/s\b/g, '')
}

export function hourDiff(upvoteTime: number, hours: number) {
    if (upvoteTime === 0 || upvoteTime == null) {
        return false
    }
    const currentTime = dayjs()
    const time = dayjs(upvoteTime)

    return currentTime.diff(time, 'hour') <= hours
}

export function formatDate(time: Date | number, locale: string, config?: { showYear?: boolean, isPrecise?: boolean }) {
    let formatString = 'DD-MM'
    if (config?.showYear) {
        formatString = locale === 'en-us' ? 'MM-DD-YYYY' : 'YYYY-MM-DD'
    }
    if (config?.isPrecise) {
        formatString = `${formatString} - HH:mm`
    }
    return dayjs(time).format(formatString)
}