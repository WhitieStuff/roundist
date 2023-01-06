class Stall {
  currentProtocol = window.location.protocol
  currentHost = window.location.host
  currentPath = window.location.pathname
  currentQuery = window.location.search
  currentLink = window.location.href
  currentLang = this.currentPath.split('/')[1]
  env = 'prod'
  stallID = null
  stallName = null
  networkID = null
  networkName = null
  apiID = null
  apiName = null

  constructor() {
    rndLog('Stall will modify the stall page')

    let env = this.currentHost.includes('www')
      ? 'prod'
      : this.currentHost.includes('test')
      ? 'test'
      : 'other'
    if (env != 'prod' && env != 'test') return
    this.env = env

    let stallID = this.currentPath.split('/')[4]
    this.stallID = stallID

    let nameCol = document.querySelector('#StallName')
    this.stallName = nameCol.innerHTML

    let envStalls = stalls[env]
    envStalls.forEach(stall => {
      if (stall.stall_id != stallID) return
      this.apiID = stall.api_id
      this.apiName = stall.api_name
      this.networkID = stall.net_id
      this.networkName = stall.net_name
    })
    if (!this.apiID) rndLog('Stall not found, please update stalls.js')

    if (options.stallCopyButtons) this.addCopyButtons()
    if (this.apiID && options.stallApi) this.addApiLink()
    if (this.networkID && options.stallNetwork) this.addNetworkLink()
  }

  addCopyButtons() {
    let parent = document.querySelector('.nav-buttons')
    let childRight = document.querySelector('.nav-buttons__right')
    if (!parent || !childRight) return

    rndLog('Stall will add copy buttons to header')

    let IDButton = options.stallCopyButtonsID
      ? this.createCopyButton(this.stallID)
      : null
    let loginButton = options.stallCopyButtonsName
      ? this.createCopyButton(this.stallName)
      : null
    let trackerButton = options.stallCopyButtonsTracker
      ? this.createCopyButton('Tracker', `"${this.stallName} ${this.stallID}":${this.currentLink}`)
      : null
    let slackLink = options.stallCopyButtonsSlack
      ? this.createSlackLink(`${this.stallName} (${this.stallID})`)
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

  addApiLink() {
    rndLog(`Stall will add API link`)

    let nextChild = document.querySelector('#StallMode').previousElementSibling
    let parent = nextChild.parentNode

    let line = document.createElement('hr')
    line.classList.add('thin')

    let title = document.createElement('dt')
    title.setAttribute('name', `col-ApiDd`)
    title.innerHTML = `API:`

    let value = document.createElement('dd')
    value.setAttribute('name', `col-ApiDd`)

      let link = document.createElement('a')
      link.innerHTML = `${this.apiName} (${this.apiID})`
      link.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Api/Info/${this.apiID}`

      value.appendChild(link)

    parent.insertBefore(title, nextChild)
    parent.insertBefore(value, nextChild)
    parent.insertBefore(line, nextChild)
  }

  addNetworkLink() {
    let networkCol = document.querySelector('#StallIDNet')
    if (!networkCol) return

    rndLog('Stall will add Network link')

    let link = document.createElement('a')
    link.innerHTML = `${this.networkName} (${this.networkID})`
    link.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Nets/Info/${this.networkID}`

    networkCol.innerHTML = ''
    networkCol.appendChild(link)
  }
}
