import {BannedModel} from "~/server/models/banned";

async function getBannedTotal() {
    return (await BannedModel.find()).length;
}

export default defineEventHandler(async () => {
    return await getBannedTotal();
})