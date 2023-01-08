class Api {
  currentProtocol = window.location.protocol
  currentHost = window.location.host
  currentPath = window.location.pathname
  currentQuery = window.location.search
  currentLink = window.location.href
  currentLang = this.currentPath.split('/')[1]
  env = 'prod'
  apiID = null
  apiName = null
  apiKey = null
  stallID = null
  stallName = null
  networkID = null
  networkName = null

  constructor() {
    rndLog('Api.js will modify the API page')

    let env = this.currentHost.includes('www')
      ? 'prod'
      : this.currentHost.includes('test')
      ? 'test'
      : 'other'
    if (env != 'prod' && env != 'test') return
    this.env = env

    let apiID = this.currentPath.split('/')[4]
    this.apiID = apiID

    let nameCol = document.querySelector('#Name')
    this.apiName = nameCol.innerHTML

    let envStalls = stalls[env]
    envStalls.forEach(stall => {
      if (stall.api_id != apiID) return
      this.stallID = stall.stall_id
      this.stallName = stall.stall_name
      this.networkID = stall.net_id
      this.networkName = stall.net_name
    })
    if (!this.stallID) rndLog('API not found, please update stalls.js')

    if (options.apiCopyButtons) this.addCopyButtons()
    if (this.networkID && options.apiNetwork) this.addLink('Net')
    if (this.stallID && options.apiStall) this.addLink('Stall')
    if (options.apiTurnover) this.addTurnoverLink()
    if (options.apiMerchants) this.modifyMerchants()

    let keyCol = document.querySelector('#Key')
    if (!keyCol) return
    this.apiKey = keyCol.innerHTML
    
    if (this.apiKey && options.apiKey) this.insertButton(keyCol, this.apiKey)
    if (this.apiKey && options.apiKibana) this.insertSearchLink(keyCol, this.apiKey)
  }

  addCopyButtons() {
    let parent = document.querySelector('.nav-buttons')
    let childRight = document.querySelector('.nav-buttons__right')
    if (!parent || !childRight) return

    rndLog('Api.js will add copy buttons to header')

    let IDButton = options.apiCopyButtonsID
      ? this.createCopyButton(this.apiID)
      : null
    let loginButton = options.apiCopyButtonsName
      ? this.createCopyButton(this.apiName)
      : null
    let trackerButton = options.apiCopyButtonsTracker
      ? this.createCopyButton(
          'Tracker',
          `"${this.apiName} ${this.apiID}":${this.currentLink}`
        )
      : null
    let slackLink = options.apiCopyButtonsSlack
      ? this.createSlackLink(`${this.apiName} (${this.apiID})`)
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

  addLink(type) {
    let col = document.querySelector(`#ID${type}`)
    if (!col) return

    rndLog(`Api.js will add ${type} link`)

    let ID = type == 'Stall' ? this.stallID : this.networkID
    let name = type == 'Stall' ? this.stallName : this.networkName

    let link = document.createElement('a')
    link.innerHTML = `${name} (${ID})`
    link.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/${type}s/Info/${ID}`

    col.innerHTML = ''
    col.appendChild(link)
  }

  insertButton(parent, value) {
    let button = document.createElement('span')
    button.classList.add('rnd-user-search__button')
    button.classList.add('rnd-api__button')
    button.addEventListener('click', event => {
      event.stopImmediatePropagation()
      this.handleCopyClick(event.target, value)
    })

    parent.previousElementSibling.classList.add('rnd-api__key-title')
    parent.classList.add('rnd-api__key')
    parent.appendChild(button)
  }

  handleCopyClick(target, value) {
    target.classList.add('rnd-user-search__button_alt')
    this.copy(value)

    setTimeout(() => {
      target.classList.remove('rnd-user-search__button_alt')
    }, 300)
  }

  copy(value) {
    navigator.clipboard.writeText(value)
  }

  insertSearchLink(parent, value) {
    let link = document.createElement('a')
    link.href = `https://kibana.egamings.com/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(),filters:!(),index:'7a5716e0-f411-11e9-bfa7-d9276de69c4b',interval:auto,query:(language:kuery,query:'*${value}*'),sort:!(!('@timestamp',desc)))`
    link.classList.add('rnd-user-page__search-link')
    link.classList.add('rnd-api__search-link')

    parent.appendChild(link)
  }

  addTurnoverLink() {
    rndLog(`Api.js will add turnover link`)

    let nextChild = document.querySelector('#Type').previousElementSibling
    let parent = nextChild.parentNode

    let line = document.createElement('hr')
    line.classList.add('thin')

    let title = document.createElement('dt')
    title.setAttribute('name', `col-TurnoverDt`)
    title.innerHTML = `Turnover:`

    let value = document.createElement('dd')
    value.setAttribute('name', `col-TurnoverDd`)

    let link = document.createElement('a')
    link.innerHTML = `Go to ${this.stallName} turnover report`
    link.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Reports/Games?ReportType=extended&Month=1&IDNet%5B%5D=${this.networkID}&IDStall%5B%5D=${this.stallID}`

    value.appendChild(link)

    parent.insertBefore(title, nextChild)
    parent.insertBefore(value, nextChild)
    parent.insertBefore(line, nextChild)
  }

  modifyMerchants() {
    rndLog(`Api.js will add links to merchants turnovers`)

    let merchants = document.querySelectorAll('.provider_id')
    if (!merchants || !merchants.length) return

    merchants.forEach(merchant => {
      let merchantID = merchant.innerHTML.replace('(', '').replace(')', '').trim()

      let url = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Reports/Games?ReportType=extended&Month=1&IDNet%5B%5D=${this.networkID}&IDMerchant%5B%5D=${merchantID}&IDStall%5B%5D=${this.stallID}`
      let link = document.createElement('a')
      link.href = url
      link.innerHTML = `(${merchantID})`

      merchant.innerHTML = ' '
      merchant.appendChild(link)
    })
  }
}
