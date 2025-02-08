import localforage from "localforage";

export async function saveImage(imageData: Blob, imageName: string) {
    if (import.meta.server) {
        return
    }
    await localforage.setItem(imageName, imageData)
}

export async function getImage(imageName: string): Promise<Blob | null> {
    if (import.meta.server) {
        return null
    }
    return await localforage.getItem(imageName)
}

export async function deleteImage(imageName: string) {
    if (import.meta.server) {
        return
    }
    await localforage.removeItem(imageName)
}