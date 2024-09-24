export function parseJsonSafely(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}
