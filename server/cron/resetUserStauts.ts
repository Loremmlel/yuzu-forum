import { defineCronHandler } from '#nuxt/cron'
import {UserModel} from "~/server/models/user";

export default defineCronHandler('daily', () => {
    try {
        UserModel.updateMany({}, {
            $set: {
                dailyCheckIn: 0,
                dailyTopicCount: 0,
                dailyGameCount: 0,
                dailyImageCount: 0
            }
        })
        console.log('reset user daily status success')
    } catch (e) {
        console.error('reset user daily status failed\n', e)
    }
})