
export function getPKString (dbEntity) {
  if ('_row_key' in dbEntity) { return '_row_key' }

  return `${dbEntity.Program}_${dbEntity.start_date}`
}
