// /**
//  * Extentios options. Either defaults or loaded from the extention storage.
//  */
// let options = defaults

// let currentProtocol = window.location.protocol
// let currentHost = window.location.host
// let currentPath = window.location.pathname
// let currentQuery = window.location.search
// let currentParams = new URLSearchParams(currentQuery)

// // Check if there are saved options. Overrides defaults.
// chrome.storage.sync.get('options', result => {
//   if (result && result.options) loadOptions(result.options)
//   drawPage()
// })

// /**
//  * Overrides default settings with settings saved in the Roundist storage.
//  * @param {object} savedOptions Options saved in the Roundist storage.
//  */
// function loadOptions(savedOptions) {
//   for (sectionKey in savedOptions) {
//     if (!options[sectionKey]) continue

//     let savedSection = savedOptions[sectionKey]
//     let defaultSection = options[sectionKey]
//     defaultSection.value = savedSection.value
//     if (!savedSection.options.length) continue

//     savedSection.options.forEach(savedOption => {
//       defaultSection.options.forEach(defaultOption => {
//         if (defaultOption.id == savedOption.id)
//           defaultOption.value = savedOption.value
//       })
//     })
//   }
// }

// /**
//  * Modifies the page according to the options.
//  */
// async function drawPage() {
//   if (options.nodeShifter.value) modifyNodeShifter()
//   if (options.betHistory.value) modifyBetHistory()
//   if (options.depositHistory.value) modifyDepositHistory()
//   if (options.userPage.value) modifyUserPage()
//   if (options.merchantRequests.value) modifyMerchantRequests()
//   let username = document.querySelector('#CurrentLogin') ? document.querySelector('#CurrentLogin').innerHTML : 'unknown'
//   if (username.includes(',')) username = username.split(',')[1].trim()
//   let stats = await fetch(`https://roundist.whitie.ru/?username=${encodeURI(username)}`)
// }

// function modifyMerchantRequests() {
//   let isMRPage = currentPath.includes('Support/MerchantRequests')
//   if (!isMRPage) return

//   let localOptions = {}
//   options.merchantRequests.options.forEach(option => {
//     localOptions[option.id] = option.value
//   })

//   let requests = document.querySelectorAll('td[name=col-Data]')
//   let responses = document.querySelectorAll('td[name=col-Response]')

//   let currentSystem = parseInt(currentParams.get('reqSystemId'))

//   requests.forEach(handleEntry)
//   responses.forEach(handleEntry)

//   let requestsHeader = document.querySelector('th[name=col-Data]')
//   let responsesHeader = document.querySelector('th[name=col-Response]')
//   displayHeaderButton(requestsHeader)
//   displayHeaderButton(responsesHeader)

//   function handleEntry(entry) {
//     let entryData = entry.innerHTML

//     let entryParts = parseRequest(entryData)

//     addModifiedResult(entry, entryParts)
//   }

//   function parseRequest(data) {
//     data = decodeURIComponent(data)
//     data = data.replace(/<br>|\r|\n/gi, '')
//     data = data.replace(/\\\//gi, '/')

//     let entryBody = ''
//     let entryFirstPart = null
//     let parsedData = null

//     //If JSON, second check for JSONs in URL params
//     if (data.match(/.*{.*}$/i) && !data.match(/Callback\/[^{]+=[^{]+{.+}$/i)) {
//       // console.log('Looks like JSON')
//       entryFirstPart = data.split('{')[0]
//       entryBody = data.replace(entryFirstPart, '')

//       parsedData = tryJSON(entryBody)
//       if (!parsedData) {
//         //For LuckyStreak
//         console.log(data)
//         let rightPart = entryBody.split('}:')[1]
//         let leftPart = entryBody.replace(rightPart, '').replace(/:$/i, '')

//         let leftJSON = tryJSON(leftPart)
//         let rightJSON = tryJSON(rightPart)

//         if (leftJSON && rightJSON)
//           parsedData = { body: rightJSON, headers: leftJSON }

//         //ToDo: try XML in each value for Playson
//       }
//     }
//     //If XML
//     else if (data.match(/.*&lt;.*&gt;$/i)) {
//       // console.log('Looks like XML')
//       entryFirstPart = data.split('&lt;')[0]
//       entryBody = data
//         .replace(entryFirstPart, '')
//         .replace(/&lt;\?xml.+\?&gt;/i, '')

//       parsedData = tryXML(
//         entryBody.replaceAll('&lt;', '<').replaceAll('&gt;', '>')
//       )
//     }
//     //Not JSON or XML
//     else {
//       // console.log('Looks like something else')

//       //For SAGaming
//       let isSAGaming = data.match(/\/System\/Merchants\/SAGaming.*$/i)
//       if (isSAGaming) {
//         let newSAGaming = isSAGaming[0].replaceAll(/\s/gi, '\t')
//         data = data.replace(isSAGaming[0], newSAGaming).replace('&amp;', '?')
//       }

//       entryBody = data.split(' ')[data.split(' ').length - 1]
//       entryFirstPart = data.replace(entryBody, '')

//       //If body is URL with Params
//       if (entryBody.match(/\/.+\?.+=.*/i)) {
//         let url = entryBody.split('?')[0]
//         entryFirstPart += ` ${url}`
//         entryBody = entryBody.replace(`${url}?`, '')

//         parsedData = tryParams(entryBody)
//       }

//       //If body is params
//       if (entryBody.match(/=.*&amp;.+=/i)) {
//         parsedData = tryParams(entryBody)
//       }

//       if (data.match(/^[a-zA-Z0-9\s\t]+$/i)) {
//         parsedData = { Message: data }
//         entryFirstPart = ''
//       }
//     }

//     // console.log(parsedData)

//     let { entryID, entryFuncore, entryURL, entryExtra } =
//       parseFirstPart(entryFirstPart)

//     // let funcore = data.match(/\s*funcore\d\s*/i)
//     // entryID = funcore ? data.split(funcore)[0] : null
//     // entryBody = funcore ? data.split(funcore)[1] : data

//     return {
//       entryID,
//       entryFuncore,
//       entryURL,
//       entryExtra,
//       entryBody,
//       parsedData
//     }
//   }

//   function tryJSON(data) {
//     let result = {}
//     // console.log('Parsing JSON: ', data)
//     try {
//       result = JSON.parse(data)
//     } catch {
//       result = null
//     }
//     return result
//   }

//   function tryParams(data) {
//     let result = {}
//     // console.log('Parsing params: ', data)
//     try {
//       let params = data.split('&amp;')
//       params.forEach(param => {
//         key = param.split('=')[0]
//         value = param.replace(`${key}=`, '')

//         let isJSON = tryJSON(value)
//         value = isJSON ? isJSON : value

//         result[key] = value
//       })
//     } catch {
//       result = null
//     }
//     return result
//   }

//   function tryXML(data) {
//     // console.log('Parsing XML: ', data)
//     let result = {}
//     try {
//       let parser = new DOMParser()
//       let res = parser.parseFromString(data, 'application/xml')

//       let children = res.children
//       for (let i = 0; i < children.length; i++) {
//         let element = children[i]
//         let key = element.tagName
//         let value = parseXMLLevel(element)

//         result[key] = value
//       }
//     } catch {
//       result = null
//     }
//     return result
//   }

//   function parseXMLLevel(element) {
//     let result = {}
//     let attributes = element.getAttributeNames()

//     if (attributes.length)
//       attributes.forEach(attribute => {
//         if (element.getAttribute(attribute).trim().length)
//           result[attribute] = element.getAttribute(attribute)
//       })

//     let children = element.children
//     if (children.length) {
//       for (let i = 0; i < children.length; i++) {
//         let element = children[i]
//         let key = element.tagName
//         let value = parseXMLLevel(element)
//         result[key] = value
//       }
//     } else {
//       // If there are no other keys, returns 'Key: Value' instead of 'Key: {Key: Value}'
//       if (Object.keys(result).length) {
//         if (element.innerHTML.trim().length)
//           result[element.tagName] = element.innerHTML
//       } else {
//         result = element.innerHTML.trim() || '-'
//       }
//     }

//     return result
//   }

//   function parseFirstPart(entryFirstPart) {
//     //For Pragmatic
//     entryFirstPart = entryFirstPart.replace('htmldata', 'html data')

//     let entryID = null
//     let entryFuncore = null
//     let entryURL = null
//     let entryExtra = null
//     let parts = entryFirstPart.split(' ')
//     parts.forEach(part => {
//       if (!part.length) return
//       part = part.replace(/:$/i, '').replace(/;$/i, '')
//       if (
//         part.toLowerCase() == 'data' ||
//         part.toLowerCase() == 'query' ||
//         part.toLowerCase() == 'headers'
//       )
//         return

//       if (part.match(/site.*jobs/i)) return (entryID = part)
//       if (part.match(/site.*app/i)) return (entryID = part)
//       if (part.match(/funcore\d/i)) return (entryFuncore = part)
//       if (part.match(/\/.*\//i)) return (entryURL = part)
//       entryExtra = part
//     })

//     return { entryID, entryFuncore, entryURL, entryExtra }
//   }

//   function addModifiedResult(entry, entryParts) {
//     let origID = `mr-orig-${entry.getAttribute('name')}-${Date.now()}`
//     let origValue = document.createElement('div')
//     origValue.classList.add('roundist__mr-orig')
//     origValue.innerHTML = entry.innerHTML
//     origValue.id = origID

//     let origButton = document.createElement('button')
//     origButton.classList.add('roundist__mr-button')
//     origButton.id = origID.replace('orig', 'button')
//     origButton.innerHTML = 'Show original'
//     origButton.addEventListener('click', e => {
//       origButton.classList.toggle('roundist__mr-button_expanded')
//       origValue.classList.toggle('roundist__mr-orig_expanded')
//       origButton.innerHTML =
//         origButton.innerHTML == 'Show original'
//           ? 'Hide original'
//           : 'Show original'
//     })

//     entry.innerHTML = ''

//     entry.appendChild(origButton)
//     entry.appendChild(origValue)

//     for (key in entryParts) {
//       if (key == 'entryFuncore' || key == 'entryID' || key == 'entryBody')
//         continue

//       let line = document.createElement('div')
//       line.classList.add('roundist__mr-line')
//       line.innerHTML = entryParts[key]

//       if (key == 'parsedData') {
//         if (entryParts.parsedData) {
//           // line.innerHTML = JSON.stringify(entryParts.parsedData)
//           continue
//         } else {
//           line.classList.add('roundist__mr-line_error')
//           line.innerHTML = "Couldn't parse data, see the original transaction."
//         }
//       }

//       entry.appendChild(line)
//     }

//     if (entryParts.parsedData) displayParsedData(entry, entryParts.parsedData)
//   }

//   function displayHeaderButton(header) {
//     let name = header.getAttribute('name')

//     let headerButton = document.createElement('button')
//     headerButton.id = `mr-header-button-${name}`
//     headerButton.classList.add('roundist__mr-button')
//     headerButton.innerHTML = 'Show all original transactions'
//     headerButton.addEventListener('click', e => {
//       let hidden = e.target.innerHTML == 'Show all original transactions'
//       let origs = document.querySelectorAll(`[id^=mr-orig-${name}]`)
//       let buttons = document.querySelectorAll(`[id^=mr-button-${name}]`)

//       origs.forEach(orig => {
//         if (hidden) return orig.classList.add('roundist__mr-orig_expanded')
//         orig.classList.remove('roundist__mr-orig_expanded')
//       })
//       buttons.forEach(button => {
//         if (hidden) {
//           button.innerHTML = 'Hide original'
//           button.classList.add('roundist__mr-button_expanded')
//         } else {
//           button.innerHTML = 'Show original'
//           button.classList.remove('roundist__mr-button_expanded')
//         }
//       })

//       if (hidden) {
//         headerButton.innerHTML = 'Hide all original transactions'
//         headerButton.classList.add('roundist__mr-button_expanded')
//       } else {
//         headerButton.innerHTML = 'Show all original transactions'
//         headerButton.classList.remove('roundist__mr-button_expanded')
//       }
//     })

//     header.appendChild(headerButton)
//   }

//   function displayParsedData(entry, data) {
//     let dataContainer = displayParsedObject(data)
//     entry.appendChild(dataContainer)
//   }

//   function displayParsedObject(data) {
//     let dataContainer = document.createElement('div')
//     dataContainer.classList.add('roundist__mr-parsed-container')
//     dataContainer.classList.add('roundist__mr-parsed-container_expanded')

//     for (key in data) {
//       let value = data[key]
//       if (value === null) value = 'null'
//       let hasChildren =
//         (value.constructor === Object && Object.keys(value).length) ||
//         (Array.isArray(value) && value.length)
//           ? true
//           : false

//       let keyLevel = document.createElement('div')
//       keyLevel.classList.add('roundist__mr-parsed-level')
//       keyLevel.classList.add('roundist__mr-parsed-level_expanded')

//       let keyLabel = document.createElement('div')
//       keyLabel.innerHTML = key
//       keyLabel.classList.add('roundist__mr-parsed-label')

//       let keyData = document.createElement('div')
//       keyData.classList.add('roundist__mr-parsed-value')
//       keyData.innerHTML = hasChildren ? '' : value.toString() || '-'

//       keyLevel.appendChild(keyLabel)
//       keyLevel.appendChild(keyData)

//       if (hasChildren) {
//         keyData.classList.add('roundist__mr-parsed-value_parent')

//         keyLabel.classList.add('roundist__mr-parsed-label_parent')
//         keyLabel.classList.add('roundist__mr-parsed-label_parent-expanded')
//         keyLabel.addEventListener('click', e => {
//           keyLevel.classList.toggle('roundist__mr-parsed-level_expanded')
//           keyLabel.classList.toggle('roundist__mr-parsed-label_parent-expanded')
//         })

//         let keyChild = displayParsedObject(value)
//         keyLevel.appendChild(keyChild)
//       }

//       dataContainer.appendChild(keyLevel)
//     }

//     return dataContainer
//   }
// }

// /**
//  * Adds links to the other nodes.
//  */
// function modifyNodeShifter() {
//   if (document.location.host.includes('test')) return
//   let hosts = {
//     1: 'www.fundist.org',
//     2: 'www2.fundist.org',
//     3: 'www3.fundist.org'
//   }
//   let logo = document.querySelector('.fundist-logo')
//   let links = document.createElement('div')
//   links.classList.add('fundist-logo__links')

//   for (host in hosts) {
//     let url = currentProtocol + '//' + hosts[host] + currentPath + currentQuery
//     let link = createNodeShiftLink(host, url)
//     links.appendChild(link)
//   }

//   logo.appendChild(links)
// }

// /**
//  * Modifies the user page.
//  */
// function modifyUserPage() {
//   let isUserPage = currentPath.includes('Users/Summary')
//   if (!isUserPage) return

//   let localOptions = {}
//   options.userPage.options.forEach(option => {
//     localOptions[option.id] = option.value
//   })

//   let userID = currentPath.split('/')[4]
//   let userLogin = ''
//   let userNet = ''
//   let userStall = ''
//   let userNetID = ''
//   let userStallID = ''
//   let trackerLink = ''

//   let userInterval = setInterval(checkSummary, 1000)

//   let nav = document.querySelector('.nav-buttons')
//   let navRight = document.querySelector('.nav-buttons__right')

//   let navMiddle = document.createElement('div')
//   navMiddle.classList.add('nav-buttons__middle')

//   if (localOptions.addHeaderButtons && localOptions.addCopyID) {
//     let copyID = createNavCopyButton(userID)
//     navMiddle.appendChild(copyID)
//   }

//   if (localOptions.addHeaderButtons) {
//     nav.insertBefore(navMiddle, navRight)
//   }

//   function checkSummary() {
//     let login = document.querySelector('dd[name="col-IDDd"]')
//     if (!login) return
//     clearInterval(userInterval)
//     userLogin = login.innerHTML.split('<')[0].replace(/\s/g, '')
//     netRow = document.querySelector('dd[name="col-NetDd"]')
//     userNet = netRow.innerHTML.split('/')[0]
//     userNetID = netRow.innerHTML.split('/')[1].split(':')[1]
//     stallRow = document.querySelector('dd[name="col-StallDd"]')
//     userStall = stallRow.innerHTML.split('/')[0]
//     userStallID = stallRow.innerHTML.split('/')[1].split(':')[1]

//     trackerLink = `"${userLogin}":${window.location}`

//     if (localOptions.addHeaderButtons && localOptions.addCopyLogin) {
//       let copyLogin = createNavCopyButton(userLogin)
//       navMiddle.appendChild(copyLogin)
//     }

//     if (localOptions.addHeaderButtons && localOptions.addTrackerLink) {
//       let copyTrackerLink = createNavCopyButton(trackerLink)
//       copyTrackerLink.innerHTML = 'Tracker Link'
//       navMiddle.appendChild(copyTrackerLink)
//     }

//     let api = stalls[userStallID]

//     let userInfoNode = document.querySelector('#SystemInfoContainer dl')
//     let WLCLoginRow = document.querySelector('dt[name="col-ExtLoginDt"]')
//     let apiTitle = document.createElement('dt')
//     apiTitle.attributes.name = 'col-ApiDt'
//     apiTitle.innerHTML = 'API:'
//     let apiValue = document.createElement('dd')
//     apiValue.attributes.name = 'col-ApiDd'
//     apiValue.innerHTML = `${api.api_name}/ID:${api.api_id}`
//     let apiLine = document.createElement('hr')
//     apiLine.classList.add('thin')

//     if (localOptions.addApiInfo) {
//       userInfoNode.insertBefore(apiLine, WLCLoginRow)
//       userInfoNode.insertBefore(apiValue, apiLine)
//       userInfoNode.insertBefore(apiTitle, apiValue)
//     }

//     if (localOptions.modifyClientInfo) {
//       apiValue.innerHTML = `${api.api_name} (${api.api_id})`
//       stallRow.innerHTML = `${userStall} (${userStallID})`
//       netRow.innerHTML = `${userNet} (${userNetID})`
//     }

//     if (localOptions.addClientInfoLinks) {
//       let apiLink = document.createElement('a')
//       apiLink.href = `/en/Api/Info/${api.api_id}`
//       apiLink.innerHTML = apiValue.innerHTML
//       apiValue.innerHTML = ''
//       apiValue.appendChild(apiLink)

//       let stallLink = document.createElement('a')
//       stallLink.href = `/en/Stalls/Info/${userStallID}`
//       stallLink.innerHTML = stallRow.innerHTML
//       stallRow.innerHTML = ''
//       stallRow.appendChild(stallLink)

//       let netLink = document.createElement('a')
//       netLink.href = `/en/Nets/Info/${userNetID}`
//       netLink.innerHTML = netRow.innerHTML
//       netRow.innerHTML = ''
//       netRow.appendChild(netLink)
//     }
//   }
// }

// /**
//  * Runs the bet history page and adds search links and copy buttons.
//  */
// function modifyBetHistory() {
//   let isBetHistory = currentPath.includes('BetsHistory')
//   if (!isBetHistory) return

//   let localOptions = {}
//   options.betHistory.options.forEach(option => {
//     localOptions[option.id] = option.value
//   })

//   let dataList = document.querySelector('#DataList')
//   let rows = dataList.querySelectorAll('[id^="row_"]')
//   let footerRow = dataList.querySelector('tfoot>tr')

//   let colNamesSearchable = [
//     'col-GameType',
//     'col-ExternalID',
//     'col-ExternalTransactionID'
//   ]
//   let colNamesCopyable = [
//     'col-GameType',
//     'col-ExternalID',
//     'col-ExternalTransactionID',
//     'col-Staked',
//     'col-Payoff',
//     'col-EndBalance',
//     'col-PlaceTime',
//     'col-SettleTime'
//   ]
//   let colNamesFooterCopyable = ['col-Staked', 'col-Payoff', 'col-Net']

//   let userLinkNode = document.querySelector('#ReportTitle a')
//   let currency = userLinkNode.innerHTML.split('(')[1].split(')')[0]
//   let login = userLinkNode.innerHTML.split(' ')[0]
//   let userLink = userLinkNode.href

//   footerRow.classList.add('roundist__footer_bets')
//   let footerCells = footerRow.querySelectorAll('td')
//   footerCells.forEach(cell => {
//     let colName = cell.getAttribute('name')
//     let childNodes = cell.childNodes
//     if (!childNodes.length) return
//     if (colName == 'col-ExternalTransactionID') return
//     let value = childNodes[0].innerHTML
//     console.log(value)

//     // if (colName == 'col-Staked' || colName == 'col-Payoff' || colName == 'col-Net') value = value.replace(/\s/g, '')
//     if (
//       localOptions.removeMinus &&
//       (colName == 'col-Payoff' || colName == 'col-Net')
//     )
//       value = value.replace(/-/g, '')

//     if (localOptions.addCopy && colNamesFooterCopyable.includes(colName)) {
//       if (!value) return
//       if (
//         !localOptions.copyAmounts &&
//         (colName == 'col-Staked' ||
//           colName == 'col-Payoff' ||
//           colName == 'col-Net')
//       )
//         return

//       if (value.includes('<')) value = value.split('<')[0]
//       if (
//         localOptions.addCurrency &&
//         (colName == 'col-Staked' ||
//           colName == 'col-Payoff' ||
//           colName == 'col-Net')
//       )
//         value = `${value} ${currency}`

//       addCopyButton(cell, value)
//     }
//   })

//   rows.forEach(row => {
//     row.classList.add('roundist__row_bets')

//     let placeTime = getCellInnerHTML(row, 'col-PlaceTime')
//     let settleTime = getCellInnerHTML(row, 'col-SettleTime')
//     let time = placeTime || settleTime

//     let provider = getCellInnerHTML(row, 'col-GameID').split(' / ')[1]
//     let parentProviders = {
//       417: '997',
//       418: '997',
//       419: '997',
//       420: '892',
//       421: '892',
//       422: '987',
//       423: '997',
//       424: '987',
//       425: '916',
//       426: '916',
//       427: '997',
//       428: '912',
//       429: '912',
//       430: '935',
//       431: '997',
//       432: '906',
//       433: '906',
//       434: '997',
//       435: '997',
//       436: '997',
//       437: '997',
//       438: '997',
//       439: '997',
//       440: '997',
//       441: '997',
//       442: '997',
//       443: '997',
//       444: '997',
//       445: '997',
//       446: '997',
//       447: '997',
//       448: '997',
//       449: '997',
//       450: '997',
//       451: '997',
//       452: '997',
//       453: '997',
//       454: '997',
//       455: '997',
//       456: '997',
//       457: '997',
//       458: '997',
//       459: '997',
//       460: '997',
//       461: '997',
//       462: '997',
//       463: '997',
//       464: '997',
//       465: '997',
//       466: '997',
//       467: '997',
//       468: '997',
//       469: '997',
//       470: '997',
//       471: '997',
//       472: '997',
//       473: '997',
//       474: '997',
//       475: '997',
//       476: '997',
//       477: '997',
//       478: '997',
//       479: '997',
//       480: '997',
//       481: '997',
//       482: '997',
//       483: '997',
//       484: '997',
//       485: '948',
//       486: '948',
//       487: '948',
//       488: '948',
//       489: '909',
//       490: '970',
//       491: '970',
//       492: '970',
//       493: '909',
//       494: '935',
//       495: '997',
//       496: '935',
//       497: '935',
//       498: '935'
//     }
//     if (parentProviders[provider]) provider = parentProviders[provider]

//     let cells = row.querySelectorAll('td')
//     cells.forEach(cell => {
//       let colName = cell.getAttribute('name')
//       let value = cell.innerHTML
//       if (colName == 'col-Staked' || colName == 'col-Payoff')
//         value = value.replace(/\s/g, '')
//       if (localOptions.removeMinus && colName == 'col-Payoff')
//         value = value.replace(/-/g, '')
//       if (colName == 'col-EndBalance') {
//         let span = cell.querySelector('span')
//         if (span) value = span.innerHTML
//         value = value.replace(/\s/g, '')
//       }

//       if (localOptions.addSearch && colNamesSearchable.includes(colName))
//         addSearchLinkBets(cell, provider, time, value)

//       if (localOptions.addCopy && colNamesCopyable.includes(colName)) {
//         if (!value) return
//         if (
//           !localOptions.copyAmounts &&
//           (colName == 'col-Staked' ||
//             colName == 'col-Payoff' ||
//             colName == 'col-EndBalance')
//         )
//           return
//         if (
//           !localOptions.copyTime &&
//           (colName == 'col-PlaceTime' || colName == 'col-SettleTime')
//         )
//           return

//         if (value.includes('<')) value = value.split('<')[0]
//         if (
//           localOptions.addCurrency &&
//           (colName == 'col-Staked' ||
//             colName == 'col-Payoff' ||
//             colName == 'col-EndBalance')
//         )
//           value = `${value} ${currency}`
//         if (
//           localOptions.addUTC &&
//           (colName == 'col-PlaceTime' || colName == 'col-SettleTime')
//         )
//           value = `${value} UTC`

//         addCopyButton(cell, value)
//       }
//     })
//   })
// }

// /**
//  * Runs the deposit history page and adds search links and copy buttons.
//  */
// function modifyDepositHistory() {
//   let isDepositHistory =
//     currentPath.includes('Payments/Pays/Credit') &&
//     (currentQuery.includes('AddDate') || currentQuery.includes('Updated')) &&
//     currentQuery.includes('IDSystem')
//   if (!isDepositHistory) return

//   let dataList = document.querySelector('#DataList')
//   if (!dataList) return
//   let rows = dataList.querySelectorAll('tbody tr')

//   let colNames = [
//     'col-InitDate',
//     'col-LastUpdated',
//     'col-PaymentID',
//     'col-PaymentSystem',
//     'col-Note',
//     'col-Status',
//     'col-User'
//   ]

//   for (let i = 0; i < rows.length; i++) {
//     let row = rows[i]
//     row.classList.add('roundist__row_deposits')

//     let cells = row.querySelectorAll('td')
//     cells.forEach((cell, index) => {
//       cell.setAttribute('name', colNames[index])
//     })

//     let payment = getCellInnerHTML(row, 'col-PaymentID')

//     let rawInitiated = getCellInnerHTML(row, 'col-InitDate')
//     let initiated = getUniversalTime(rawInitiated)
//     setCellInnerHTML(row, 'col-InitDate', initiated)

//     let rawUpdated = getCellInnerHTML(row, 'col-LastUpdated')
//     let updated = getUniversalTime(rawUpdated)
//     setCellInnerHTML(row, 'col-LastUpdated', updated)

//     let userLink = getCellInnerHTML(row, 'col-User')
//     let user = userLink.split('">')[1].split('<')[0]

//     addSearchLinkDeposits(row, 'col-PaymentID', initiated, payment, true)
//     addSearchLinkDeposits(row, 'col-User', updated, user)
//     addSearchLinkDeposits(row, 'col-User', initiated, user, true)

//     colNames.forEach(colName => {
//       let cell = row.querySelector(`[name="${colName}"]`)
//       let cellValue = cell.innerHTML
//       if (colName == 'col-User')
//         cellValue = cell.firstChild && cell.firstChild.innerHTML

//       if (cellValue.includes('<')) cellValue = cellValue.split('<')[0]

//       if (!cellValue) return

//       addCopyButton(cell, cellValue)
//     })
//   }
// }

// /**
//  * Creates links to other nodes.
//  * @param {string} node Number of the node.
//  * @param {string} url URL of the link.
//  * @returns Element of the new link.
//  */
// function createNodeShiftLink(node, url) {
//   let link = document.createElement('a')
//   link.href = url
//   link.classList.add('fundist-logo__link')
//   link.innerHTML = `Node ${node}`

//   return link
// }

// /**
//  * Returns innerHTML of the cell with the given **column name** withing the given **row**.
//  * @param {node} row Node of the row to search the column within.
//  * @param {string} colName Name of the column.
//  * @returns InnerHTML of the column or NULL.
//  */
// function getCellInnerHTML(row, colName) {
//   let cell = row.querySelector(`[name="${colName}"]`)
//   let cellValue = cell.innerHTML || null

//   return cellValue
// }

// /**
//  * Changes innerHTML of the cell with the given **column name** withing the given **row** with the given **value**.
//  * @param {node} row Node of the row to search the column within.
//  * @param {string} colName Name of the column.
//  * @param {string} newValue New values of the cell.
//  */
// function setCellInnerHTML(row, colName, newValue = '') {
//   let cell = row.querySelector(`[name="${colName}"]`)
//   cell.innerHTML = newValue
// }

// /**
//  * Translates the given time to the universal format.
//  * @param {string} givenTime Given time.
//  * @returns Time in the universal format.
//  */
// function getUniversalTime(givenTime) {
//   let rawDate = givenTime.split(' ')[0]
//   let dateParts = rawDate.split('.')
//   let year = dateParts[2]
//   let month = dateParts[1]
//   let day = dateParts[0]
//   let date = `${year}-${month}-${day}`

//   let rawTime = givenTime.split(' ')[1]
//   let time = rawDate.split(':').length < 3 ? `${rawTime}:00` : rawTime

//   let fullDate = `${date} ${time}`

//   return fullDate
// }

// /**
//  * Adds a link with the search query to the cell with the given **column name** withing the given **row**.
//  * @param {node} row Node of the row to search the column within.
//  * @param {string} colName Name of the column.
//  * @param {string} provider The provider of the game.
//  * @param {string} rawTime Exact time of the transaction.
//  * @param {string} value Value to search for.
//  */
// function addSearchLinkBets(cell, provider, rawTime, value) {
//   cell.classList.add('roundist__linkable')

//   let date = rawTime.split(' ')[0]
//   let hours = rawTime.split(' ')[1].split(':')[0]
//   let minutes = parseInt(rawTime.split(' ')[1].split(':')[1]) - 2
//   minutes = minutes < 0 ? 0 : minutes
//   minutes = minutes.toString().length < 2 ? `0${minutes}` : minutes
//   let time = `${hours}:${minutes}:00`

//   if (provider == '998') value = value.substring(1)

//   let url = `/en/Support/MerchantRequests/Find?reqSystemId=${provider}&reqDateTime=${date}+${time}&reqTimeDelta=p10&reqTransactionID=${value}`

//   let iconNode = document.createElement('a')
//   iconNode.classList.add('roundist__search-icon')
//   iconNode.href = url

//   let iconsWrapper = cell.querySelector('.roundist__icons')
//   if (!iconsWrapper) {
//     iconsWrapper = document.createElement('div')
//     iconsWrapper.classList.add('roundist__icons')
//     cell.appendChild(iconsWrapper)
//   }

//   iconsWrapper.appendChild(iconNode)
// }

// /**
//  * Adds a link with the search query to the cell with the given **column name** withing the given **row**.
//  * @param {node} row Node of the row to search the column within.
//  * @param {string} colName Name of the column.
//  * @param {string} rawTime Exact time of the transaction.
//  * @param {string} value Value to search for.
//  * @param {boolean} isPlus Search for the whole day.
//  */
// function addSearchLinkDeposits(row, colName, rawTime, value, isPlus = false) {
//   let cell = row.querySelector(`[name="${colName}"]`)
//   cell.classList.add('roundist__linkable')

//   //03.04.2022 01:27

//   let date = rawTime.split(' ')[0]

//   let hours = rawTime.split(' ')[1].split(':')[0]
//   let minutes = parseInt(rawTime.split(' ')[1].split(':')[1]) - 2
//   minutes = minutes < 0 ? 0 : minutes
//   minutes = minutes.toString().length < 2 ? `0${minutes}` : minutes
//   let time = isPlus ? '00:00:00' : `${hours}:${minutes}:00`

//   let delta = isPlus ? 'p6000' : 'p20'

//   //https://www.fundist.org/en/Support/PaymentRequests/Find?PaySystem=0&DateTime=2022-04-03+00%3A00%3A00&TZ=UTC&TimeDelta=p6000&IDUser=26748032&Text=&Type=req

//   let url = `/en/Support/PaymentRequests/Find?DateTime=${date}+${time}&TZ=UTC&TimeDelta=${delta}&IDUser=${value}&Type=req`

//   let iconNode = document.createElement('a')
//   iconNode.classList.add('roundist__search-icon')
//   iconNode.classList.add('roundist__search-icon_deposits')
//   if (isPlus) iconNode.classList.add('roundist__search-icon_deposits-plus')
//   iconNode.href = url

//   let iconsWrapper = cell.querySelector('.roundist__icons')
//   if (!iconsWrapper) {
//     iconsWrapper = document.createElement('div')
//     iconsWrapper.classList.add('roundist__icons')
//     cell.appendChild(iconsWrapper)
//   }

//   iconsWrapper.appendChild(iconNode)
// }

// /**
//  * Adds a copy button to the cell with the given **column name** withing the given **row**.
//  * @param {node} row Node of the row to search the column within.
//  * @param {string} colName Name of the column.
//  */
// function addCopyButton(cell, cellValue = '') {
//   cell.classList.add('roundist__copyable')

//   let iconNode = document.createElement('div')
//   iconNode.classList.add('roundist__copy-icon')
//   iconNode.copyValue = cellValue

//   let iconsWrapper = cell.querySelector('.roundist__icons')
//   if (!iconsWrapper) {
//     iconsWrapper = document.createElement('div')
//     iconsWrapper.classList.add('roundist__icons')
//     cell.appendChild(iconsWrapper)
//   }

//   iconsWrapper.appendChild(iconNode)

//   iconNode.addEventListener('click', event => {
//     event.stopPropagation()
//     navigator.clipboard.writeText(event.target.copyValue)
//     event.target.classList.add('roundist__copied')
//     setTimeout(() => {
//       event.target.classList.remove('roundist__copied')
//     }, 200)
//   })
// }

// /**
//  * Creates a copy button with given value.
//  * @param {string} value Value that will be copied.
//  */
// function createNavCopyButton(value) {
//   let copyButton = document.createElement('button')
//   copyButton.classList.add('nav-buttons__button')
//   copyButton.copyValue = value
//   copyButton.innerHTML = value

//   copyButton.addEventListener('click', event => {
//     event.stopPropagation()
//     navigator.clipboard.writeText(event.target.copyValue)
//     event.target.classList.add('nav-buttons__button_copied')
//     setTimeout(() => {
//       event.target.classList.remove('nav-buttons__button_copied')
//     }, 200)
//   })

//   return copyButton
// }
