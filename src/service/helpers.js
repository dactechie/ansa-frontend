import { checkAssign } from '@/utils'

function calculateSLK (clientData) {
  let f = clientData.Firstname.replace(/([^a-z-]+)/gi, '')
  let s = clientData.Surname.replace(/([^a-z-]+)/gi, '')
  const d = clientData.DOB.replace(/-/g, '')
  let x = clientData.Sex

  f = f.toUpperCase().padEnd(2 - f.length, '9')
  s = s.toUpperCase().padEnd(5 - f.length, '9')
  const namePart = `${s[1]}${s[2]}${s[4]}${f[1]}${f[2]}`

  switch (x) {
    case 'male':
      x = 1; break
    case 'female':
      x = 2; break
    default:
      x = 9
  }
  return `${namePart}${d}${x}`
}

export function setupLookup (survey, options) {
  const lookupDetails = {}
  if (survey.data.DB_ID) {
    const clientId = survey.data.DB_ID
    const idType = survey.data.DB_ID_TYPE
    if (!clientId || !idType) {
      console.log('reruning undefined from setuplookp')
      return undefined
    }
    lookupDetails.ClientID = clientId
    lookupDetails.IDType = idType
  } else {
    console.log('survey data ', survey.data)
    const result = checkAssign(lookupDetails, options.errors,
      {
        Firstname: survey.data.first_name,
        Surname: survey.data.last_name,
        Sex: survey.data.sex,
        DOB: survey.data.DOB
      })
    if (result !== 1) { console.log(' ERRORRRRRRRRRRRRRRRRR lookupdetails : ', lookupDetails) } else {
      lookupDetails.ClientID = calculateSLK(lookupDetails)
      lookupDetails.IDType = 'SLK'
    }

    console.log(`Lookup Details ${JSON.stringify(lookupDetails)}`)
  }
  return lookupDetails
}
