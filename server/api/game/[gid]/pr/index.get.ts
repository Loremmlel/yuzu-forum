import {GamePRModel} from "~/server/models/gamePR";
import {UserModel} from "~/server/models/user";
import {GamePRDetails} from "~/types/api/gamePR";
import {ErrorCode} from "~/error/errorCode";

export default defineEventHandler(async (event) => {
    const {gprid}: { gprid: string } = await getQuery(event)
    if (!gprid) {
        return yuzuError(event, ErrorCode.InvalidRequestParametersOrMissing)
    }

    const pr = await GamePRModel.findOne({gprid})
        .populate('user', 'uid avatar name', UserModel)
        .lean()
    if (!pr) {
        return yuzuError(event, ErrorCode.ResourceLinkNotFound)
    }

    return {
        gprid: pr.gprid,
        gid: pr.gid,
        index: pr.index,
        status: pr.status,
        time: pr.created,
        completedTime: pr.completedTime,
        user: {
            uid: pr.user[0].uid,
            name: pr.user[0].name,
            avatar: pr.user[0].avatar
        },
        game: pr.game
    } as GamePRDetails
})