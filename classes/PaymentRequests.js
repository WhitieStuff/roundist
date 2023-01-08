class PaymentRequests {
  currentQuery = window.location.search
  currentParams = new URLSearchParams(currentQuery)

  constructor() {
    rndLog('PaymentRequests.js will modify the payment requests page')

    if (options.paymentRequests1440) this.add1440()
    if (options.paymentRequestsDetectDelta) this.detectDelta()
    if (options.paymentRequestsReqRes) this.setReqRes()
    if (options.paymentRequestsDayStart) this.addDayStartButton()
    if (options.paymentRequestsParse) this.parseRows()
  }

  add1440() {
    let select = document.querySelector('select[name=TimeDelta]')
    if (!select) return

    let currentDelta = this.currentParams.get('TimeDelta')
    if (currentDelta && currentDelta == 'p1440') return

    rndLog('PaymentRequests.js will add 1440 minutes delta option')

    let newOption = document.createElement('option')
    newOption.value = 'p1440'
    newOption.innerHTML = '.. 1140 m'

    select.appendChild(newOption)
  }

  detectDelta() {
    let currentDelta = this.currentParams.get('TimeDelta')
    if (!currentDelta) return

    let select = document.querySelector('select[name=TimeDelta]')
    if (!select) return

    let options = select.querySelectorAll('option')
    if (!options || !options.length) return

    rndLog('PaymentRequests.js will add current delta option')

    let optionPresents = false

    options.forEach(option => {
      let value = option.value
      if (value == currentDelta) optionPresents = true
    })

    if (optionPresents) return

    let title = currentDelta.match(/^p\d+$/)
      ? `.. ${currentDelta.replace('p', '')} m`
      : currentDelta.match(/^\d+s$/)
      ? `± ${currentDelta}`
      : `± ${currentDelta}m`

    let newOption = document.createElement('option')
    newOption.value = currentDelta
    newOption.innerHTML = title
    newOption.setAttribute('selected', 'selected')

    select.appendChild(newOption)
  }

  setReqRes() {
    let currentType = this.currentParams.get('Type')
    if (currentType) return

    let defaultOption = document.querySelector(
      'select[name=Type] option[value=req]'
    )
    if (!defaultOption) return
    defaultOption.removeAttribute('selected')

    let option = document.querySelector(
      'select[name=Type] option[value=req_resp]'
    )
    if (!option) return
    option.setAttribute('selected', 'selected')

    rndLog('PaymentRequests.js will set Request+Response by default')

    let title = document.querySelector(
      'select[name=Type] + span .select2-selection__rendered'
    )
    title.title = 'Request+Response'
    title.innerHTML = 'Request+Response'
  }

  addDayStartButton() {
    let input = document.querySelector('#DateTime')
    if (!input) return

    rndLog('PaymentRequests.js will add DayStart button')

    let button = document.querySelector('#fillNowButton')
    button.style.marginTop = 'unset'
    if (!button) return

    let parent = button.parentNode

    let dayStartButton = document.createElement('button')
    dayStartButton.classList.add('btn')
    dayStartButton.classList.add('btn-white')
    dayStartButton.classList.add('pull-right')
    dayStartButton.innerHTML = 'Start'
    dayStartButton.addEventListener('click', event => {
      event.stopImmediatePropagation()
      event.preventDefault()

      let rawDateTime = input.value
      if (!rawDateTime) return

      let newTimeDateTime = `${rawDateTime.split(' ')[0]} 00:00:00`

      input.value = newTimeDateTime
    })

    parent.style.display = 'flex'
    parent.parentElement.style.gridTemplateColumns = 'minmax(160px,auto) auto'
    parent.parentElement.parentElement.style.gridTemplateColumns =
      '210px auto 100px 100px 150px minmax(100px,1fr) 150px 70px'

    parent.appendChild(dayStartButton)
  }

  parseRows() {
    let rows = document.querySelectorAll('tbody tr')
    if (!rows || !rows.length) return

    rndLog('PaymentRequests.js will parse requests')

    rows.forEach(row => {
      let id = row.id
      let colID = row.querySelector('[name=col-ID]')
      let type = colID.innerHTML.includes('Payment initialization')
        ? 'init'
        : colID.innerHTML.includes('Requests')
        ? 'req'
        : colID.innerHTML.includes('Callbacks')
        ? 'callback'
        : 'other'

      let colRequest = row.querySelector('[name=col-Data]')
      let reqBody = colRequest.querySelector('div')
      let rawRequest = reqBody.innerHTML

      let colResponse = row.querySelector('[name=col-Response]')
      let resBody = colResponse.querySelector('div')
      let rawResponse = resBody.innerHTML

      this.parseRequest(colRequest, rawRequest, type, id)
      this.parseResponse(colResponse, rawResponse, type, id)
    })

    let header = document.querySelector('thead tr')
    if (!header) return

    let headRequest = header.querySelector('[name=col-Data]')
    let headResponse = header.querySelector('[name=col-Response]')

    if (headRequest) this.addHeaderToggler(headRequest, 'Data')
    if (headResponse) this.addHeaderToggler(headResponse, 'Response')
  }

  parseRequest(parent, rawRequest, type, id) {
    let newRequest = decodeURI(rawRequest)
    newRequest = newRequest.replace(/\\"/g, '"')
    newRequest = newRequest.replace(/\{"\{"/g, '{"')
    newRequest = newRequest.replace(/\}":""\}/g, '}')
    newRequest = newRequest.replace(/":"\{"/g, '":{"')
    newRequest = newRequest.replace(/\}"\}/g, '}}')
    newRequest = newRequest.replace(/\}\}"\}/g, '}}}')
    newRequest = newRequest.replace(/\}\}"\}/g, '}}}')
    newRequest = newRequest.replace(/&amp;/g, '&')
    newRequest = newRequest.replace(/&lt;/g, '<')
    newRequest = newRequest.replace(/&gt;/g, '>')
    // Escaping quotes in XML
    let xmlEscapes = newRequest.match(/<[^>]+"[^>]+>/g)
    if (xmlEscapes && xmlEscapes.length)
      xmlEscapes.forEach(part => {
        let newPart = part.replace(/"/g, `'`)
        newRequest = newRequest.replace(part, newPart)
      })
    let original = this.createOriginal(rawRequest, id, 'req')

    let parsed = this.parseRequestBody(newRequest, type)

    parent.innerHTML = ''
    parent.appendChild(original)
  }

  parseResponse(parent, rawResponse, type, id) {
    let newResponse = decodeURI(rawResponse)
    newResponse = newResponse.replace(/\\"/g, '"')
    newResponse = newResponse.replace(/\{"\{"/g, '{"')
    newResponse = newResponse.replace(/\}":""\}/g, '}')
    newResponse = newResponse.replace(/":"\{"/g, '":{"')
    newResponse = newResponse.replace(/\}"\}/g, '}}')
    newResponse = newResponse.replace(/\}\}"\}/g, '}}}')
    newResponse = newResponse.replace(/&amp;/g, '&')
    newResponse = newResponse.replace(/&lt;/g, '<')
    newResponse = newResponse.replace(/&gt;/g, '>')
    // Escaping quotes in XML
    let xmlEscapes = newResponse.match(/<[^>]+"[^>]+>/g)
    if (xmlEscapes && xmlEscapes.length)
      xmlEscapes.forEach(part => {
        let newPart = part.replace(/"/g, `'`)
        newResponse = newResponse.replace(part, newPart)
      })

    let original = this.createOriginal(rawResponse, id, 'res')

    parent.innerHTML = ''
    parent.appendChild(original)
  }

  createOriginal(rawRequest, id, type) {
    let wrapper = document.createElement('div')

    let original = document.createElement('div')
    original.classList.add('rnd-transaction-history__original')
    original.classList.add('word-break')
    original.id = `rnd-orig-${id}-${type}`
    original.state = false
    original.innerHTML = rawRequest

    let toggle = document.createElement('button')
    toggle.classList.add('rnd-transaction-history__toggle')
    toggle.innerHTML = 'Show original'
    toggle.for = `rnd-orig-${id}-${type}`
    toggle.addEventListener('click', event => {
      this.handleToggleClick(event.target)
    })

    wrapper.appendChild(toggle)
    wrapper.appendChild(original)

    return wrapper
  }

  handleToggleClick(toggle) {
    let id = toggle.for

    let original = document.querySelector(`#${id}`)
    if (!original) return

    let state = original.state

    state
      ? this.collapseOriginal(toggle, original)
      : this.expandOriginal(toggle, original)
  }

  expandOriginal(toggle, original) {
    toggle.classList.add('rnd-transaction-history__toggle_expanded')
    toggle.innerHTML = 'Collapse original'
    original.classList.add('rnd-transaction-history__original_expanded')
    original.state = true
  }

  collapseOriginal(toggle, original) {
    toggle.classList.remove('rnd-transaction-history__toggle_expanded')
    toggle.innerHTML = 'Show original'
    original.classList.remove('rnd-transaction-history__original_expanded')
    original.state = false
  }

  addHeaderToggler(parent, type) {
    let toggle = document.createElement('button')
    toggle.classList.add('rnd-transaction-history__toggle')
    toggle.classList.add('rnd-transaction-history__toggle_header')
    toggle.innerHTML = 'Show all originals'
    toggle.reqres = type
    toggle.state = false
    toggle.addEventListener('click', event => {
      this.handleHeaderToggleClick(event.target)
    })

    parent.appendChild(toggle)
  }

  handleHeaderToggleClick(target) {
    let type = target.reqres
    let state = target.state

    let cells = document.querySelectorAll(`tbody [name=col-${type}]`)
    if (!cells || !cells.length) return

    cells.forEach(cell => {
      let toggle = cell.querySelector('.rnd-transaction-history__toggle')
      let original = cell.querySelector('.rnd-transaction-history__original')

      if (state) {
        this.collapseOriginal(toggle, original)
      } else {
        this.expandOriginal(toggle, original)
      }
    })

    if (state) {
      target.state = false
      target.innerHTML = 'Show all originals'
      target.classList.remove('rnd-transaction-history__toggle_expanded')
    } else {
      target.state = true
      target.innerHTML = 'Collapse all originals'
      target.classList.add('rnd-transaction-history__toggle_expanded')
    }
  }

  parseRequestBody(request, type) {
    let parsed = null
    if (type == 'init') {
      try {
        parsed = JSON.parse(request)
      } catch (e) {
        parsed = null
      }
    }
    if (type == 'callback') {
      try {
        parsed = JSON.parse(request)
      } catch (e) {
        parsed = null
      }
    }
    if (type == 'req') {
      let method = request.match(/\sPOST\s/)
        ? 'POST'
        : request.match(/\sGET\s/)
        ? 'GET'
        : 'other'
      let temp = request.replace(/\sPOST\s/, '|').replace(/\sGET\s/, '|')
      let parts = temp.split('|')
      let url = parts[0]
      let body = parts[1]
      let bodyParsed = {}

      parsed = {
        URL: parts[0],
        method: method
      }

      let isJSON = body.includes('{') && body.includes('}')
      if (isJSON) {
        try {
          bodyParsed = JSON.parse(body)
        } catch (e) {
          bodyParsed = null
        }
      } else {
        try {
          let params = new URLSearchParams(body)
          for (const [key, value] of params) bodyParsed[key] = value
        } catch (e) {
          bodyParsed = null
        }
      }
      if (bodyParsed) parsed.request = bodyParsed
    }
    return parsed
  }
}
