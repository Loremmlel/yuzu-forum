import {GameResourceStoreTemp} from "~/store/types/game/resource";
import {languageOptions, platformOptions, typeOptions} from "~/components/game/utils/option";
import {isValidURL} from "~/utils/validate";
import {resourceSizePattern} from "~/utils/pattern";

export function checkGameResourcePublish(link: GameResourceStoreTemp) {
    if (!typeOptions.filter((item) => item !== 'all').includes(link.type)) {
        return 10613
    }

    if (!link.link.length || link.link.length > 107) {
        return 10614
    }

    for (const l of link.link) {
        if (l.trim().length > 1007) {
            return 10615
        }

        if (!isValidURL(l)) {
            return 10636
        }
    }

    if (
        !languageOptions.filter((item) => item !== 'all').includes(link.language)
    ) {
        return 10616
    }

    if (
        !platformOptions.filter((item) => item !== 'all').includes(link.platform)
    ) {
        return 10617
    }

    if (!resourceSizePattern.test(link.size)) {
        return 10618
    }

    if (link.code.length > 1007) {
        return 10619
    }

    if (link.password.length > 1007) {
        return 10620
    }

    if (link.note.length > 1007) {
        return 10621
    }

    return 0
}