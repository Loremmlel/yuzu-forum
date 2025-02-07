import {UserModel} from "~/server/models/user";
import {isValidName} from "~/utils/validate";


export default defineEventHandler(async (event) => {
    const {username}: { username: string } = await readBody(event)

    const userInfo = await getCookieTokenInfo(event)
    if (!userInfo) {
        return yuzuError(event, 10115, 205)
    }
    if (!isValidName(username)) {
        return yuzuError(event, 10117)
    }
    const user = await UserModel.findOne({uid: userInfo.uid})
    if (!user) {
        return yuzuError(event, 10101)
    }
    if (user.point < 1017) {
        return yuzuError(event, 10118)
    }
    const duplicated = await UserModel.countDocuments({
        name: {$regex: new RegExp(`^${username}$`, 'i')}
    })
    if (duplicated) {
        return yuzuError(event, 10105)
    }
    await UserModel.updateOne(
        {uid: userInfo.uid},
        {$set: {name: username}, $inc: {point: -17}}
    )
    return '更新用户名成功!'
})