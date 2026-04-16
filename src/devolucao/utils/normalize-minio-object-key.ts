/**
 * `tag` no banco pode ser: nome correto do objeto, URL presignada antiga, ou etag (bug legado).
 * presignedGetObject precisa apenas do object key dentro do bucket.
 */
export function normalizeMinioObjectKey(
  tag: string,
  bucketName: string,
): string {
  const trimmed = tag.trim();
  if (!trimmed) return trimmed;

  const looksLikePlainKey =
    !trimmed.includes('://') &&
    !trimmed.includes('http%') &&
    !trimmed.includes('X-Amz') &&
    trimmed.length < 400;

  if (looksLikePlainKey) {
    return trimmed;
  }

  const checklistOrSimilar =
    /\d+-bau-(aberto|fechado)\.[a-z0-9]+/i.exec(trimmed)?.[0] ??
    /bau-(aberto|fechado)-\d+\.[a-z0-9]+/i.exec(trimmed)?.[0];

  if (checklistOrSimilar) {
    return checklistOrSimilar;
  }

  try {
    let working = trimmed;
    if (trimmed.includes('https%3A') || trimmed.includes('http%3A')) {
      const marker = trimmed.includes('https%3A') ? 'https%3A' : 'http%3A';
      const idx = trimmed.indexOf(marker);
      const outerQ = trimmed.indexOf('?', idx);
      const encodedChunk =
        outerQ === -1 ? trimmed.slice(idx) : trimmed.slice(idx, outerQ);
      working = decodeURIComponent(encodedChunk);
    }

    const url = working.startsWith('http')
      ? new URL(working)
      : new URL(
          `https://placeholder${working.startsWith('/') ? '' : '/'}${working}`,
        );

    const segments = url.pathname.split('/').filter(Boolean);
    const bucketIdx = segments.lastIndexOf(bucketName);
    if (bucketIdx !== -1 && bucketIdx < segments.length - 1) {
      const afterBucket = segments.slice(bucketIdx + 1).join('/');
      if (afterBucket.includes('http%')) {
        const innerDecoded = decodeURIComponent(
          afterBucket.split('?')[0].split('%3F')[0],
        );
        try {
          const innerUrl = new URL(innerDecoded);
          const innerSegs = innerUrl.pathname.split('/').filter(Boolean);
          const innerIdx = innerSegs.lastIndexOf(bucketName);
          if (innerIdx !== -1 && innerIdx < innerSegs.length - 1) {
            return innerSegs.slice(innerIdx + 1).join('/');
          }
          return innerSegs[innerSegs.length - 1] ?? trimmed;
        } catch {
          return afterBucket;
        }
      }
      return afterBucket.split('?')[0];
    }

    const last = segments[segments.length - 1];
    if (last?.match(/\.(webp|jpe?g|png)$/i)) {
      return last;
    }
  } catch {
    // fallthrough
  }

  return trimmed;
}
