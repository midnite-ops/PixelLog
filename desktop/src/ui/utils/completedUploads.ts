import type { UploadItem } from "../../../types"

const STORAGE_KEY = 'completedUploads'

export function getCompletedUploads(): UploadItem[]{
    const completedUploads = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")

    return completedUploads
}

export function saveCompletedUploads(upload : UploadItem){
    const completedUploads = getCompletedUploads()
    completedUploads.push(upload)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedUploads))
}