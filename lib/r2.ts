import 'server-only'

import { createHmac, createHash, randomUUID } from 'node:crypto'

type R2BucketConfig = {
  bucket: string
  publicUrl: string
}

type PresignedUrlOptions = {
  key: string
  bucket: string
  method?: 'PUT' | 'DELETE'
  expiresIn?: number
}

const r2Config = {
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  bucket: process.env.CLOUDFLARE_R2_BUCKET,
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  animalPhotosFolder: process.env.CLOUDFLARE_R2_ANIMAL_PHOTOS_FOLDER,
  newsImagesFolder: process.env.CLOUDFLARE_R2_NEWS_IMAGES_FOLDER,
  filesFolder: process.env.CLOUDFLARE_R2_FILES_FOLDER,
  avatarsFolder: process.env.CLOUDFLARE_R2_AVATARS_FOLDER,
}

export function getAnimalPhotosBucketConfig(): R2BucketConfig {
  return {
    bucket: requiredEnv(r2Config.bucket, 'CLOUDFLARE_R2_BUCKET'),
    publicUrl: requiredEnv(r2Config.publicUrl, 'CLOUDFLARE_R2_PUBLIC_URL').replace(/\/+$/, ''),
  }
}

export function getNewsImagesBucketConfig(): R2BucketConfig {
  return {
    bucket: requiredEnv(r2Config.bucket, 'CLOUDFLARE_R2_BUCKET'),
    publicUrl: requiredEnv(r2Config.publicUrl, 'CLOUDFLARE_R2_PUBLIC_URL').replace(/\/+$/, ''),
  }
}

export function createAnimalPhotoKey(animalId: string, fileName: string) {
  const folder = normalizeFolder(requiredEnv(r2Config.animalPhotosFolder, 'CLOUDFLARE_R2_ANIMAL_PHOTOS_FOLDER'))
  return `${folder}/${animalId}/${randomUUID()}${getFileExtension(fileName)}`
}

export function createNewsImageKey(newsId: string, fileName: string) {
  const folder = normalizeFolder(requiredEnv(r2Config.newsImagesFolder, 'CLOUDFLARE_R2_NEWS_IMAGES_FOLDER'))
  return `${folder}/${newsId}/${randomUUID()}${getFileExtension(fileName)}`
}

export function createNewsVideoKey(newsId: string, fileName: string) {
  const folder = normalizeFolder(requiredEnv(r2Config.newsImagesFolder, 'CLOUDFLARE_R2_NEWS_IMAGES_FOLDER'))
  return `${folder}/${newsId}/videos/${randomUUID()}${getFileExtension(fileName)}`
}

export function createNewsFileKey(newsId: string, fileName: string) {
  const folder = normalizeFolder(requiredEnv(r2Config.filesFolder, 'CLOUDFLARE_R2_FILES_FOLDER'))
  return `${folder}/news/${newsId}/${randomUUID()}${getFileExtension(fileName)}`
}

export function getNewsVideosBucketConfig(): R2BucketConfig {
  return {
    bucket: requiredEnv(r2Config.bucket, 'CLOUDFLARE_R2_BUCKET'),
    publicUrl: requiredEnv(r2Config.publicUrl, 'CLOUDFLARE_R2_PUBLIC_URL').replace(/\/+$/, ''),
  }
}

export function getPublicFilesBucketConfig(): R2BucketConfig {
  return {
    bucket: requiredEnv(r2Config.bucket, 'CLOUDFLARE_R2_BUCKET'),
    publicUrl: requiredEnv(r2Config.publicUrl, 'CLOUDFLARE_R2_PUBLIC_URL').replace(/\/+$/, ''),
  }
}

export function createReportFileKey(reportId: string, fileName: string) {
  const folder = normalizeFolder(r2Config.filesFolder ?? 'files')
  return `${folder}/reports/${reportId}/${randomUUID()}${getFileExtension(fileName)}`
}

export function createAvatarKey(userId: string, fileName: string) {
  const folder = normalizeFolder(requiredEnv(r2Config.avatarsFolder, 'CLOUDFLARE_R2_AVATARS_FOLDER'))
  return `${folder}/${userId}${getFileExtension(fileName)}`
}

export function createContactAttachmentKey(fileName: string) {
  const folder = normalizeFolder(r2Config.filesFolder ?? 'files')
  return `${folder}/contacts/${randomUUID()}${getFileExtension(fileName)}`
}

export function getR2PublicUrl(config: R2BucketConfig, key: string) {
  return `${config.publicUrl}/${key.split('/').map(encodeRfc3986).join('/')}`
}

export function createR2PresignedPutUrl(options: Omit<PresignedUrlOptions, 'method'>) {
  return createR2PresignedUrl({ ...options, method: 'PUT' })
}

export async function deleteR2Object({ key, bucket }: Pick<PresignedUrlOptions, 'key' | 'bucket'>) {
  const response = await fetch(createR2PresignedUrl({ key, bucket, method: 'DELETE' }), {
    method: 'DELETE',
  })

  return response.ok
}

function createR2PresignedUrl({ key, bucket, method = 'PUT', expiresIn = 300 }: PresignedUrlOptions) {
  const accountId = requiredEnv(r2Config.accountId, 'CLOUDFLARE_R2_ACCOUNT_ID')
  const accessKeyId = requiredEnv(r2Config.accessKeyId, 'CLOUDFLARE_R2_ACCESS_KEY_ID')
  const secretAccessKey = requiredEnv(r2Config.secretAccessKey, 'CLOUDFLARE_R2_SECRET_ACCESS_KEY')
  const host = `${bucket}.${accountId}.r2.cloudflarestorage.com`
  const path = `/${key.split('/').map(encodeRfc3986).join('/')}`
  const now = new Date()
  const date = formatDate(now)
  const timestamp = formatTimestamp(now)
  const credentialScope = `${date}/auto/s3/aws4_request`
  const queryParams: Record<string, string> = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Content-Sha256': 'UNSIGNED-PAYLOAD',
    'X-Amz-Credential': `${accessKeyId}/${credentialScope}`,
    'X-Amz-Date': timestamp,
    'X-Amz-Expires': String(expiresIn),
    'X-Amz-SignedHeaders': 'host',
  }
  const canonicalQuery = canonicalizeQuery(queryParams)
  const canonicalRequest = [
    method,
    path,
    canonicalQuery,
    `host:${host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n')
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    credentialScope,
    hashHex(canonicalRequest),
  ].join('\n')
  const signingKey = getSigningKey(secretAccessKey, date)
  const signature = hmacHex(signingKey, stringToSign)

  return `https://${host}${path}?${canonicalQuery}&X-Amz-Signature=${signature}`
}

// ─── Server-side authenticated R2 operations ─────────────────────────────────

export type R2Object = {
  key: string
  size: number
  lastModified: Date
}

export type R2ListResult = {
  objects: R2Object[]
  prefixes: string[] // "folders"
}

export type R2BucketStats = {
  totalSize: number
  objectCount: number
}

async function r2AuthGet(path: string, queryParams: Record<string, string>): Promise<string> {
  const accountId = requiredEnv(r2Config.accountId, 'CLOUDFLARE_R2_ACCOUNT_ID')
  const bucket = requiredEnv(r2Config.bucket, 'CLOUDFLARE_R2_BUCKET')
  const accessKeyId = requiredEnv(r2Config.accessKeyId, 'CLOUDFLARE_R2_ACCESS_KEY_ID')
  const secretAccessKey = requiredEnv(r2Config.secretAccessKey, 'CLOUDFLARE_R2_SECRET_ACCESS_KEY')

  const host = `${bucket}.${accountId}.r2.cloudflarestorage.com`
  const now = new Date()
  const date = formatDate(now)
  const timestamp = formatTimestamp(now)
  const credentialScope = `${date}/auto/s3/aws4_request`
  const emptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

  const canonicalQuery = canonicalizeQuery(queryParams)
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${emptyHash}\nx-amz-date:${timestamp}\n`
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'

  const canonicalRequest = ['GET', path, canonicalQuery, canonicalHeaders, signedHeaders, emptyHash].join('\n')
  const stringToSign = ['AWS4-HMAC-SHA256', timestamp, credentialScope, hashHex(canonicalRequest)].join('\n')
  const signingKey = getSigningKey(secretAccessKey, date)
  const signature = hmacHex(signingKey, stringToSign)

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const res = await fetch(`https://${host}${path}?${canonicalQuery}`, {
    headers: {
      'Authorization': authorization,
      'x-amz-content-sha256': emptyHash,
      'x-amz-date': timestamp,
    },
  })

  if (!res.ok) throw new Error(`R2 request failed: ${res.status} ${await res.text()}`)
  return res.text()
}

function parseXmlBlocks(xml: string, tag: string): string[] {
  return [...xml.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map(m => m[1])
}

function parseXmlValue(block: string, tag: string): string {
  return block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? ''
}

export async function listR2Objects(prefix = '', delimiter = '/'): Promise<R2ListResult> {
  const params: Record<string, string> = { 'list-type': '2' }
  if (prefix) params.prefix = prefix
  if (delimiter) params.delimiter = delimiter

  const xml = await r2AuthGet('/', params)

  const objects: R2Object[] = parseXmlBlocks(xml, 'Contents').map(block => ({
    key: parseXmlValue(block, 'Key'),
    size: parseInt(parseXmlValue(block, 'Size') || '0', 10),
    lastModified: new Date(parseXmlValue(block, 'LastModified')),
  }))

  const prefixes = parseXmlBlocks(xml, 'CommonPrefixes').map(block =>
    parseXmlValue(block, 'Prefix')
  )

  return { objects, prefixes }
}

export async function getR2BucketStats(): Promise<R2BucketStats> {
  // List all objects without delimiter to get full stats
  const params: Record<string, string> = { 'list-type': '2', 'max-keys': '1000' }
  const xml = await r2AuthGet('/', params)

  const objects = parseXmlBlocks(xml, 'Contents')
  const totalSize = objects.reduce((sum, block) => sum + parseInt(parseXmlValue(block, 'Size') || '0', 10), 0)

  return { totalSize, objectCount: objects.length }
}

// ─────────────────────────────────────────────────────────────────────────────

function requiredEnv(value: string | undefined, name: string) {
  if (!value) {throw new Error(`${name} is not configured`)}
  return value
}

function getFileExtension(fileName: string) {
  const normalized = fileName.toLowerCase().trim()
  const match = normalized.match(/\.[a-z0-9]+$/)
  return match?.[0] ?? '.jpg'
}

function normalizeFolder(value: string) {
  return value.replace(/^\/+|\/+$/g, '')
}

function canonicalizeQuery(params: Record<string, string>) {
  return Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join('&')
}

function encodeRfc3986(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}

function formatTimestamp(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '')
}

function hashHex(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function hmac(key: Buffer | string, value: string) {
  return createHmac('sha256', key).update(value).digest()
}

function hmacHex(key: Buffer, value: string) {
  return createHmac('sha256', key).update(value).digest('hex')
}

function getSigningKey(secretAccessKey: string, date: string) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, date)
  const regionKey = hmac(dateKey, 'auto')
  const serviceKey = hmac(regionKey, 's3')
  return hmac(serviceKey, 'aws4_request')
}
