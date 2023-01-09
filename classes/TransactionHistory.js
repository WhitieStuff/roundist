class TransactionHistory {
  currentProtocol = window.location.protocol
  currentHost = window.location.host
  currentPath = window.location.pathname
  currentQuery = window.location.search
  currentLink = window.location.href
  currentLang = this.currentPath.split('/')[1]

  constructor () {
    let rows = document.querySelectorAll('tbody tr')
    if (!rows || !rows.length) return

    rndLog('TransactionHistory.js will modify the transaction history page')

    rows.forEach(row => {
      row.classList.add('rnd-transaction-history_row')

      let initDateCol = row.querySelector('td')
      let lastUpdatedDateCol = initDateCol.nextElementSibling
      let paymentIDCol = lastUpdatedDateCol.nextElementSibling
      let paySystemCol = paymentIDCol.nextElementSibling
      let noteCol = paySystemCol.nextElementSibling
      let statusCol = noteCol.nextElementSibling
      let userCol = statusCol.nextElementSibling

      let paymentID = paymentIDCol.innerHTML
      let rawInitDate = initDateCol.innerHTML
      let newInitDate = normalizeDateAlt(rawInitDate)
      let rawLastUpdatedDate = lastUpdatedDateCol.innerHTML
      let newLastUpdatedDate = normalizeDateAlt(rawLastUpdatedDate)
      let userID = userCol.querySelector('a').innerHTML

      if (options.transactionHistoryDates) this.modifyDates(initDateCol, newInitDate)
      if (options.transactionHistoryDates) this.modifyDates(lastUpdatedDateCol, newLastUpdatedDate)
      if (options.transactionHistoryCopy) this.insertButton(paymentIDCol, paymentID)
      if (options.transactionHistorySearch) this.insertSearchLink(paymentIDCol, paymentID, newInitDate)
      if (options.transactionHistorySearch) this.insertSearchLink(userCol, userID, newInitDate)
    })
  }

  modifyDates(column, datetime) {
    column.innerHTML = datetime
  }

  insertButton(parent, value) {
    let button = document.createElement('span')
    button.classList.add('rnd-user-search__button')
    button.classList.add('rnd-api__button')
    button.addEventListener('click', event => {
      event.stopImmediatePropagation()
      this.handleCopyClick(event.target, value)
    })

    let wrapper = document.createElement('div')
    wrapper.classList.add('rnd-transaction-history__wrapper')
    wrapper.innerHTML = parent.innerHTML

    parent.innerHTML = ''

    // parent.previousElementSibling.classList.add('rnd-api__key-title')
    // parent.classList.add('rnd-api__key')
    wrapper.appendChild(button)
    parent.appendChild(wrapper)
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

  insertSearchLink(parent, value, datetime) {
    let link20 = document.createElement('a')
    link20.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Support/PaymentRequests/Find?PaySystem=0&DateTime=${encodeURI(datetime)}&TZ=UTC&TimeDelta=p20&IDUser=${value}&Text=&Type=req_resp`
    link20.classList.add('rnd-user-page__search-link')
    link20.classList.add('rnd-api__search-link')

    let dayStart = getDateStart(datetime)
    let link1440 = document.createElement('a')
    link1440.href = `${this.currentProtocol}//${this.currentHost}/${this.currentLang}/Support/PaymentRequests/Find?PaySystem=0&DateTime=${encodeURI(dayStart)}&TZ=UTC&TimeDelta=p1440&IDUser=${value}&Text=&Type=req_resp`
    link1440.classList.add('rnd-user-page__search-link')
    link1440.classList.add('rnd-user-page__search-link_plus')
    link1440.classList.add('rnd-api__search-link')

    let wrapper = document.createElement('div')
    wrapper.classList.add('rnd-transaction-history__wrapper')
    wrapper.innerHTML = parent.innerHTML

    let transactionHeader = document.querySelector('thead td:nth-child(3)')
    let userHeader = document.querySelector('thead td:nth-child(7)')

    if (options.transactionHistorySearch20) wrapper.appendChild(link20)
    if (options.transactionHistorySearch1440) wrapper.appendChild(link1440)

    if (options.transactionHistorySearch20 || options.transactionHistorySearch1440) transactionHeader.classList.add('rnd-transaction-history-1')
    if ((options.transactionHistorySearch20 || options.transactionHistorySearch1440) && options.transactionHistoryCopy) transactionHeader.classList.add('rnd-transaction-history-2')
    if (options.transactionHistorySearch1440 && options.transactionHistorySearch1440) transactionHeader.classList.add('rnd-transaction-history-2')
    if (options.transactionHistorySearch1440 && options.transactionHistorySearch1440 && options.transactionHistoryCopy) transactionHeader.classList.add('rnd-transaction-history-3')

    if (options.transactionHistorySearch20 || options.transactionHistorySearch1440) userHeader.classList.add('rnd-transaction-history-1')
    if (options.transactionHistorySearch1440 && options.transactionHistorySearch1440) userHeader.classList.add('rnd-transaction-history-2')

    parent.innerHTML = ''
    parent.appendChild(wrapper)
  }
}