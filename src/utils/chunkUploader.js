export function createFileChunks(file, CHUNK_SIZE = 500 * 1024) {
  const chunks = [];
  let start = 0;

  while (start < file.size) {
    chunks.push(file.slice(start, start + CHUNK_SIZE));
    start += CHUNK_SIZE;
  }

  return chunks;
}
