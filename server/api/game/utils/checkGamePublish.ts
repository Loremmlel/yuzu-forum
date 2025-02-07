import {isValidYzLanguage} from "~/utils/validate";
import {vndbPattern} from "~/utils/pattern";

export function checkGamePublish(
    vndbId: string,
    name: YuzuLanguage,
    introduction: YuzuLanguage,
    aliases?: string[]
) {
    if (!vndbId.trim()) {
        return 10601
    }
    if (!vndbPattern.test(vndbId)) {
        return 10602
    }
    if (!isValidYzLanguage(name, 233)) {
        return 10603
    }
    if (!isValidYzLanguage(introduction, 100007)) {
        return 10606
    }
    if (!aliases) {
        return 0
    }
    if (aliases.length > 17) {
        return 10611
    }
    for (const alias of aliases) {
        if (alias.length > 500) {
            return 10612
        }
    }
    return 0
}