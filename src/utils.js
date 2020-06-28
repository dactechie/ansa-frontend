// const ONE_HOUR = 60 * 60 * 1000

export function objectFlip (obj) {
  const ret = {}
  Object.keys(obj).forEach(key => {
    ret[obj[key]] = key
  })
  return ret
}

export function checkAssign (objectToAssign, errors, data) {
  for (const x in Object.keys(data)) {
    const sourceObj = data[x]
    if (!sourceObj || sourceObj[x]) {
      errors[x] = `Missing ${x}`
      return -1
    }
    objectToAssign[x] = sourceObj[x]
  }
  return 1
}

export async function promisify (object, fn, ...args) {
  return new Promise((resolve, reject) => {
    const promiseHandling = (err, result) => {
      if (err) { reject(err) } else { resolve(result) }
    }
    args.push(promiseHandling)
    fn.apply(object, args)
  })
};

export function isValidLookupIds (clientIdType) {
  console.log('here', clientIdType)
  const clientId = clientIdType[1]
  // TODO : use SLK-pattern from schema/schema.json
  const result = (clientIdType[0] === 'SLK')
    ? /[A-Z0-9]{5}(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])(19|20)[0-9]{2}(1|2|9)/.test(clientId)
    : Number.isInteger(clientId)
  console.log('result of isValidLookuipIds ', result)
  console.log((clientIdType[0] === 'SLK'))
  return result
}
