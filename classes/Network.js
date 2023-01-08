class Network {
  currentProtocol = window.location.protocol
  currentHost = window.location.host
  currentPath = window.location.pathname
  currentQuery = window.location.search
  currentLink = window.location.href
  currentLang = this.currentPath.split('/')[1]
  env = 'prod'
  networkID = null
  networkName = null
  currentAPIs = []
  currentStalls = []

  constructor() {
    rndLog('Network.js will modify the network page')

    let env = this.currentHost.includes('www')
      ? 'prod'
      : this.currentHost.includes('test')
      ? 'test'
      : 'other'
    if (env != 'prod' && env != 'test') return
    this.env = env

    let networkID = this.currentPath.split('/')[4]
    this.networkID = networkID

    let nameCol = document.querySelector('dd[name=col-NameDd]')
    this.networkName = nameCol.innerHTML

    let envStalls = stalls[env]
    envStalls.forEach(stall => {
      if (stall.net_id != networkID) return
      this.currentAPIs.push({ id: stall.api_id, name: stall.api_name })
      this.currentStalls.push({
        id: stall.stall_id,
        name: stall.stall_name
      })
    })
    if (!this.currentAPIs || !this.currentAPIs.length) rndLog('Network not found, please update stalls.js')

    if (options.networkCopyButtons) this.addCopyButtons()
    if (options.networkApi) this.addLinks('Api', this.currentAPIs)
    if (options.networkStalls) this.addLinks('Stalls', this.currentStalls)
    if (options.networkTurnover) this.addTurnoverLink()
    if (options.networkMerchants) this.modifyMerchants()
  }

  addLinks(type, list) {
    rndLog(`Network.js will add ${type} list`)

    let nextChild = document.querySelector('dt[name=col-CountryDt]')
    let parent = nextChild.parentNode

    let line = document.createElement('hr')
    line.classList.add('thin')

    let title = document.createElement('dt')
    title.setAttribute('name', `col-${type}Dt`)
    title.innerHTML = `${type} list:`

    let value = document.createElement('dd')
    value.setAttribute('name', `col-${type}Dd`)

    list.forEach((item, index) => {
      let link = document.createElement('a')
      link.innerHTML = `${item.name} (${item.id})`
      link.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/${type}/Info/${item.id}`

      let comma = document.createElement('span')
      comma.innerHTML = ', '

      value.appendChild(link)
      if (index != list.length - 1) value.appendChild(comma)
    })

    parent.insertBefore(title, nextChild)
    parent.insertBefore(value, nextChild)
    parent.insertBefore(line, nextChild)
  }

  modifyMerchants() {
    rndLog(`Network.js will add links to merchants turnovers`)

    let merchants = document.querySelectorAll('.provider_name')
    if (!merchants || !merchants.length) return

    merchants.forEach(merchant => {
      let merchantIDCol = merchant.nextElementSibling
      if (!merchantIDCol) return
      let merchantID = merchantIDCol.innerHTML.replace('(', '').replace(')', '')

      let merchantName = merchant.innerHTML

      let url = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Reports/Games?ReportType=extended&Month=1&IDNet%5B%5D=${this.networkID}&IDMerchant%5B%5D=${merchantID}`
      let link = document.createElement('a')
      link.href = url
      link.innerHTML = merchantName

      merchant.innerHTML = ''
      merchant.appendChild(link)
    })
  }

  addTurnoverLink() {
    rndLog(`Network.js will add turnover link`)

    let nextChild = document.querySelector('dt[name=col-CountryDt]')
    let parent = nextChild.parentNode

    let line = document.createElement('hr')
    line.classList.add('thin')

    let title = document.createElement('dt')
    title.setAttribute('name', `col-TurnoverDt`)
    title.innerHTML = `Turnover:`

    let value = document.createElement('dd')
    value.setAttribute('name', `col-TurnoverDd`)

    let link = document.createElement('a')
    link.innerHTML = `Go to ${this.networkName} turnover report`
    link.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Reports/Games?ReportType=extended&Month=1&IDNet%5B%5D=${this.networkID}`

    value.appendChild(link)

    parent.insertBefore(title, nextChild)
    parent.insertBefore(value, nextChild)
    parent.insertBefore(line, nextChild)
  }

  addCopyButtons() {
    let parent = document.querySelector('.nav-buttons')
    let childRight = document.querySelector('.nav-buttons__right')
    if (!parent || !childRight) return

    rndLog('Network.js will add copy buttons to header')

    let IDButton = options.networkCopyButtonsID
      ? this.createCopyButton(this.networkID)
      : null
    let loginButton = options.networkCopyButtonsName
      ? this.createCopyButton(this.networkName)
      : null
    let trackerButton = options.networkCopyButtonsTracker
      ? this.createCopyButton('Tracker', `"${this.networkName} ${this.networkID}":${this.currentLink}`)
      : null
    let slackLink = options.networkCopyButtonsSlack
      ? this.createSlackLink(`${this.networkName} (${this.networkID})`)
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
      event.target.classList.add('rnd-user-page__copy-button_pressed')
      setInterval(() => {
        event.target.classList.remove('rnd-user-page__copy-button_pressed')
      }, 300)
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
}
