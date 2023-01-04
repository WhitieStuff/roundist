class UserPage {
  currentProtocol = window.location.protocol
  currentHost = window.location.host
  currentPath = window.location.pathname
  currentQuery = window.location.search
  currentLink = window.location.href
  userID = null

  constructor() {
    rndLog('UserPage will modify the user page')

    let notFound = document.querySelector('#responseCode')
    if (notFound && options.userPage404)
      return this.handle404(notFound.parentNode)

    // this.addCopyButtons() and this.addApiStallNet() will be called there.
    this.trySystemInfo()
    if (options.userPageDeposits) this.tryDeposits()
  }

  handle404(parent) {
    rndLog('User not found. Links to other nodes will be added')

    let newTitle = document.createElement('h3')
    newTitle.classList.add('font-bold')
    newTitle.innerHTML = 'Try other nodes:'

    let basicLinks = [
      { title: '1', host: 'www.fundist.org' },
      { title: '2', host: 'www2.fundist.org' },
      { title: '3', host: 'www3.fundist.org' },
      { title: '5', host: 'www5.fundist.org' }
    ]
    this.insertLinksToLogo(basicLinks, newTitle)

    parent.appendChild(newTitle)
  }

  insertLinksToLogo(links, parent) {
    let linkList = document.createElement('ul')
    linkList.classList.add('rnd-logo__list')

    links.forEach(link => {
      let linkLink = document.createElement('a')
      linkLink.innerHTML = link.title
      linkLink.href = `${this.currentProtocol}//${link.host}${this.currentPath}${this.currentQuery}`
      linkLink.classList.add('rnd-404__link')

      parent.appendChild(linkLink)
    })
  }

  trySystemInfo() {
    let systemInfoInterval = setInterval(() => {
      let systemInfoContainer = document.querySelector(
        '#SystemInfoContainer dt'
      )
      if (!systemInfoContainer) return

      clearInterval(systemInfoInterval)
      if (options.userPageCopyButtons) this.addCopyButtons()
      if (options.userPageApiStallNet) this.addApiStallNet()
    }, 500)
  }

  async addCopyButtons() {
    let parent = document.querySelector('.nav-buttons')
    let childRight = document.querySelector('.nav-buttons__right')
    if (!parent || !childRight) return

    rndLog('UserPage will add copy buttons to header')

    let loginElement = document.querySelector('[name=col-IDDd]')
    let login = loginElement ? loginElement.innerHTML.replace('/n', '') : ''
    if (login.includes('button')) login = login.split('<')[0].trim()

    let id = this.currentPath.split('/')[4]
    this.userID = id

    let IDButton = options.userPageCopyButtonsID
      ? this.createCopyButton(id)
      : null
    let loginButton = options.userPageCopyButtonsLogin
      ? this.createCopyButton(login)
      : null
    let trackerButton = options.userPageCopyButtonsTracker
      ? this.createCopyButton('Tracker', `"${login}":${this.currentLink}`)
      : null
    let slackLink = options.userPageCopyButtonsSlack
      ? this.createSlackLink(login)
      : null

    let navMiddle = document.createElement('div')
    navMiddle.classList.add('rnd-user-page__nav-middle')

    if (IDButton) navMiddle.appendChild(IDButton)
    if (loginButton) navMiddle.appendChild(loginButton)
    if (trackerButton) navMiddle.appendChild(trackerButton)
    if (slackLink) navMiddle.appendChild(slackLink)

    parent.insertBefore(navMiddle, childRight)
  }

  createCopyButton(title = '', copyValue = title) {
    let button = document.createElement('button')
    button.innerHTML = title
    button.classList.add('rnd-user-page__copy-button')
    button.addEventListener('click', event => {
      event.stopImmediatePropagation()
      navigator.clipboard.writeText(copyValue)
    })

    return button
  }

  createSlackLink(login = '') {
    let link = document.createElement('a')
    link.innerHTML = login
    link.href = this.currentLink
    link.classList.add('rnd-user-page__copy-link')

    return link
  }

  addApiStallNet() {
    let netLine = document.querySelector('[name=col-NetDd]')
    let stallLine = document.querySelector('[name=col-StallDd]')
    let extLine = document.querySelector('[name=col-ExtLoginDt]')
    if (!netLine || !stallLine || !extLine) return

    let netID = netLine.innerHTML.split(':')[1]
    let stallID = stallLine.innerHTML.split(':')[1]
    let apiID = ''
    let apiName = ''

    let env = this.currentHost.includes('www')
      ? 'prod'
      : this.currentHost.includes('test')
      ? 'test'
      : 'other'
    if (env != 'prod' && env != 'test') return

    rndLog('UserPage will add links to Api/Stall/Net')

    let envStalls = stalls[env]

    envStalls.forEach(stall => {
      if (stall.stall_id != stallID) return
      apiID = stall.api_id
      apiName = stall.api_name
    })

    if (!apiID) return rndLog('Api not found, please update stalls.js')

    let netURL = `${this.currentProtocol}//${this.currentHost}/en/Nets/Info/${netID}`
    let stallURL = `${this.currentProtocol}//${this.currentHost}/en/Stalls/Info/${stallID}`
    let apiURL = `${this.currentProtocol}//${this.currentHost}/en/Api/Info/${apiID}`

    let apiText = `${apiName}/ID:${apiID}`

    netLine.innerHTML = `<a href="${netURL}">${netLine.innerHTML}</a>`
    stallLine.innerHTML = `<a href="${stallURL}">${stallLine.innerHTML}</a>`

    let apiTitle = document.createElement('dt')
    apiTitle.setAttribute('name', 'col-ApiDt')
    apiTitle.innerHTML = 'API:'

    let apiLine = document.createElement('dd')
    apiLine.setAttribute('name', 'col-ApiDd')
    apiLine.innerHTML = `<a href="${apiURL}">${apiName}/ID:${apiID}</a>`

    let hr = document.createElement('hr')
    hr.classList.add('thin')

    extLine.parentNode.insertBefore(apiTitle, extLine)
    extLine.parentNode.insertBefore(apiLine, extLine)
    extLine.parentNode.insertBefore(hr, extLine)
  }

  tryDeposits() {
    let depositsInterval = setInterval(() => {
      let lastDeposit = document.querySelector(
        '#lastDepositsAllTable'
      )
      if (!lastDeposit) return

      clearInterval(depositsInterval)
      this.modifyDeposists()
    }, 500)
  }

  modifyDeposists() {
    let parent = document.querySelector('#LastDepositsContainer')
    if (!parent) return rndLog('Deposits not found')

    rndLog('UserPage will modify deposits')

    let rows = document.querySelectorAll('#LastDepositsContainer tbody tr')
    if (!rows) return

    rows.forEach(row => {
      let date = row.querySelector('[name=col-Date], [name=col_Date]')
      let ID = row.querySelector('[name=col-ID], [name=col_ID]')
      let externalTID = row.querySelector('[name=col-ExternalTID], [name=col_ExternalTID]')
      let note = row.querySelector('[name=col-Note], [name=col_Note]')
      note.style.maxWidth='500px'

      let rawDateTime = date ? date.innerHTML : null
      let newDateTime = rawDateTime ? normalizeDate(rawDateTime) : rawDateTime

      if (options.userPageDepositsDates && newDateTime) date.innerHTML = newDateTime

      if (!options.userPageDepositsSearch) return

      let dayStart = newDateTime ? getDateStart(newDateTime) : null
      if (!dayStart) return

      let IDSearchUrl = ID && ID.innerHTML.length ? `${this.currentProtocol}//${this.currentHost}/en/Support/PaymentRequests/Find?PaySystem=0&DateTime=${encodeURI(dayStart)}&TZ=UTC&TimeDelta=p2880&IDUser=&Text=${ID.innerHTML}&Type=req_resp` : null
      let extIDSearchUrl = externalTID && externalTID.innerHTML.length ? `${this.currentProtocol}//${this.currentHost}/en/Support/PaymentRequests/Find?PaySystem=0&DateTime=${encodeURI(dayStart)}&TZ=UTC&TimeDelta=p2880&IDUser=&Text=${externalTID.innerHTML}&Type=req_resp` : null
      let userIDSearchUrl = this.userID ? `${this.currentProtocol}//${this.currentHost}/en/Support/PaymentRequests/Find?PaySystem=0&DateTime=${encodeURI(dayStart)}&TZ=UTC&TimeDelta=p2880&IDUser=&Text=${this.userID}&Type=req_resp` : null
      if (options.userPageDepositsSearchID && IDSearchUrl) this.addDepositSearchLink(ID, IDSearchUrl)
      if (options.userPageDepositsSearchExtID && extIDSearchUrl) this.addDepositSearchLink(externalTID, extIDSearchUrl)
      if (options.userPageDepositsSearchUserID && userIDSearchUrl) this.addDepositSearchLink(date, userIDSearchUrl)
    })
  }

  /**
   * Inserts search link to the given column.
   * @param {Element} parent Column element. 
   * @param {string} url Search URL.
   * @param {boolean} type Alt icon if true.
   */
  addDepositSearchLink(parent, url, plus = false) {
    let link = document.createElement('a')
    link.href = url
    link.classList.add('rnd-user-page__search-link')

    parent.appendChild(link)
  }
}
