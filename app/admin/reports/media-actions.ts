'use server'

import {
  createReportFileKey,
  createR2PresignedPutUrl,
  getPublicFilesBucketConfig,
  getR2PublicUrl,
  deleteR2Object,
} from '@/lib/r2'

type UploadRequest = { reportId: string; fileName: string }

export async function createReportFileUploadAction({ reportId, fileName }: UploadRequest) {
  const key = createReportFileKey(reportId, fileName)
  const config = getPublicFilesBucketConfig()
  const uploadUrl = createR2PresignedPutUrl({ key, bucket: config.bucket })
  const publicUrl = getR2PublicUrl(config, key)
  return { uploadUrl, publicUrl, r2Key: key }
}

export async function deleteReportFileAction(r2Key: string) {
  const config = getPublicFilesBucketConfig()
  return deleteR2Object({ key: r2Key, bucket: config.bucket })
}
