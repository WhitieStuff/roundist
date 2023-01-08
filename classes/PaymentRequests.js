class PaymentRequests {
  currentQuery = window.location.search
  currentParams = new URLSearchParams(currentQuery)

  constructor() {
    rndLog('PaymentRequests.js will modify the payment requests page')

    if (options.paymentRequests1440) this.add1440()
    if (options.paymentRequestsDetectDelta) this.detectDelta()
    if (options.paymentRequestsReqRes) this.setReqRes()
    if (options.paymentRequestsDayStart) this.addDayStartButton()
    // ToDo: Catch bad transactions and see what can be done.
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
        : colID.innerHTML.includes('Requests') ||
        colID.innerHTML.includes('HizliPapara') ||
        colID.innerHTML.includes('Maldopay Mkarekod DEP')
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
    let newRequest = this.replaceBadParts(rawRequest)

    let original = this.createOriginal(rawRequest, id, 'req')

    let parsed = this.parseRequestBody(newRequest, type)
    if (!parsed)
      parsed = {
        Roundist: "Couldn't parse data, refer to the original transaction."
      }

    let parsedBody = this.createParsedBody(parsed)

    parent.innerHTML = ''
    parent.appendChild(original)
    parent.appendChild(parsedBody)
  }

  parseResponse(parent, rawResponse, type, id) {
    let newResponse = this.replaceBadParts(rawResponse)

    let original = this.createOriginal(rawResponse, id, 'res')

    let parsed = this.parseResponseBody(newResponse, type)
    if (!parsed)
      parsed = {
        Roundist: "Couldn't parse data, refer to the original transaction."
      }

    let parsedBody = this.createParsedBody(parsed)

    parent.innerHTML = ''
    parent.appendChild(original)
    parent.appendChild(parsedBody)
  }

  replaceBadParts(rawRequest) {
    let newRequest = decodeURIComponent(rawRequest)
    newRequest = newRequest.replace(/\\"/g, '"')
    // For RBMPay callbacks bug.
    newRequest = newRequest.replace(/\{"\{"/g, '{"')
    newRequest = newRequest.replace(/\}":""\}/g, '}')
    // For nested jsons.
    newRequest = newRequest.replace(/":"\{"/g, '":{"')
    newRequest = newRequest.replace(/\}"\}/g, '}}')
    newRequest = newRequest.replace(/\}",/g, '},')
    // For deeper nested jsons.
    newRequest = newRequest.replace(/\}\}"\}/g, '}}}')
    newRequest = newRequest.replace(/\}\}\}"/g, '}}}')
    // For Paycos escapes.
    newRequest = newRequest.replace(/\\\\"/g, '"')
    newRequest = newRequest.replace(/\\\\u003e/g, '')
    newRequest = newRequest.replace(/"\{"/g, '{"')
    // For URL params.
    newRequest = newRequest.replace(/&amp;/g, '&')
    // For XML.
    newRequest = newRequest.replace(/&lt;/g, '<')
    newRequest = newRequest.replace(/&gt;/g, '>')
    // Escaping quotes in XML like APCOPay callbacks.
    let xmlEscapes = newRequest.match(/<[^>]+"[^>]+>/g)
    if (xmlEscapes && xmlEscapes.length)
      xmlEscapes.forEach(part => {
        let newPart = part.replace(/"/g, `'`)
        newRequest = newRequest.replace(part, newPart)
      })

    return newRequest
  }

  createOriginal(rawRequest, id, type) {
    let wrapper = document.createElement('div')

    let original = document.createElement('div')
    original.classList.add('rnd-payment-requests__original')
    original.classList.add('word-break')
    original.id = `rnd-orig-${id}-${type}`
    original.state = false
    original.innerHTML = rawRequest

    let toggle = document.createElement('button')
    toggle.classList.add('rnd-payment-requests__toggle')
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
    toggle.classList.add('rnd-payment-requests__toggle_expanded')
    toggle.innerHTML = 'Collapse original'
    original.classList.add('rnd-payment-requests__original_expanded')
    original.state = true
  }

  collapseOriginal(toggle, original) {
    toggle.classList.remove('rnd-payment-requests__toggle_expanded')
    toggle.innerHTML = 'Show original'
    original.classList.remove('rnd-payment-requests__original_expanded')
    original.state = false
  }

  addHeaderToggler(parent, type) {
    let toggle = document.createElement('button')
    toggle.classList.add('rnd-payment-requests__toggle')
    toggle.classList.add('rnd-payment-requests__toggle_header')
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
      let toggle = cell.querySelector('.rnd-payment-requests__toggle')
      let original = cell.querySelector('.rnd-payment-requests__original')

      if (state) {
        this.collapseOriginal(toggle, original)
      } else {
        this.expandOriginal(toggle, original)
      }
    })

    if (state) {
      target.state = false
      target.innerHTML = 'Show all originals'
      target.classList.remove('rnd-payment-requests__toggle_expanded')
    } else {
      target.state = true
      target.innerHTML = 'Collapse all originals'
      target.classList.add('rnd-payment-requests__toggle_expanded')
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

      if (method == 'POST' || method == 'GET') {
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
      } else {
        let soap = request.match(/<.*SOAP/)

        if (soap) {
          let url = request.split('<')[0]
          let body = request.replace(url, '')

          url = url.replace(':', '')
          let parsedBody = {}
          try {
            let parser = new DOMParser()
            let res = parser.parseFromString(body, 'application/xml')

            let children = res.children
            for (let i = 0; i < children.length; i++) {
              let element = children[i]
              let key = element.tagName
              let value = this.parseXMLLevel(element)

              parsedBody[key] = value
            }
          } catch {
            parsedBody = null
          }

          if (parsedBody) parsed = { url, request: parsedBody }
        }
      }
      if (!parsed)
        try {
          let bodyParsed = JSON.parse(request)
          if (bodyParsed) parsed = bodyParsed
        } catch (e) {
          parsed = null
        }
    }
    if (!parsed) parsed = {'Roundist couldn\'t parse it, refer to the original transaction':request}
    return parsed
  }

  parseXMLLevel(element) {
    let result = {}
    let attributes = element.getAttributeNames()

    if (attributes.length)
      attributes.forEach(attribute => {
        if (element.getAttribute(attribute).trim().length)
          result[attribute] = element.getAttribute(attribute)
      })

    let children = element.children
    if (children.length) {
      for (let i = 0; i < children.length; i++) {
        let element = children[i]
        let key = element.tagName
        let value = this.parseXMLLevel(element)
        result[key] = value
      }
    } else {
      // If there are no other keys, returns 'Key: Value' instead of 'Key: {Key: Value}'
      if (Object.keys(result).length) {
        if (element.innerHTML.trim().length)
          result[element.tagName] = element.innerHTML
      } else {
        result = element.innerHTML.trim() || '-'
      }
    }

    return result
  }

  parseResponseBody(response, type) {
    let parsed = null
    if (type == 'init') {
      try {
        let parts = response.split('[')
        let code = parts[0].replace(',', '')
        let rawMessage = `[${parts[1]}`
        let message = JSON.parse(rawMessage)

        parsed = { code, message }
      } catch (e) {
        parsed = null
      }
    }
    if (type == 'callback') {
      try {
        parsed = JSON.parse(response)
      } catch (e) {
        parsed = null
      }
      if (!parsed)
        try {
          let parts = response.split('{')
          let status = parts[0]
          let responseBody = response.replace(status, '')
          status = status.replace(/:/g, '')

          let message = JSON.parse(responseBody)

          parsed = { status, message }
        } catch (e) {
          parsed = { response }
        }
    }
    if (type == 'req') {
      try {
        let json = response.match(/{.*}/)

        let parts = response.split('{')
        let status = parts[0]
        let responseBody = response.replace(status, '')

        let parsedBody = JSON.parse(responseBody)

        parsed = { status, response: parsedBody }
      } catch (e) {
        parsed = null
      }
      if (!parsed)
        try {
          let soap = response.match(/\?xml/)
          if (soap) {
            let message = response.split('<')[0]
            let body = response.replace(message, '')

            let parsedBody = {}
            try {
              let parser = new DOMParser()
              let res = parser.parseFromString(body, 'application/xml')

              let children = res.children
              for (let i = 0; i < children.length; i++) {
                let element = children[i]
                let key = element.tagName
                let value = this.parseXMLLevel(element)

                parsedBody[key] = value
              }
            } catch {
              parsedBody = null
            }

            if (parsedBody) parsed = { response: parsedBody }
          }
        } catch (e) {
          parsed = null
        }
      if (!parsed) parsed = { response }
    }
    if (!parsed) parsed = {'Roundist couldn\'t parse it, refer to the original transaction':response}
    return parsed
  }

  createParsedBody(parsed) {
    let wrapper = document.createElement('div')
    wrapper.classList.add('rnd-payment-requests__parsed-wrapper')

    let level = this.createParsedBodyLevel(parsed)

    wrapper.appendChild(level)
    return wrapper
  }

  createParsedBodyLevel(parsed) {
    let level = document.createElement('div')
    level.classList.add('rnd-payment-requests__parsed-level')

    for (let key in parsed) {
      let current = parsed[key]

      let label = document.createElement('div')
      label.classList.add('rnd-payment-requests__parsed-label')
      label.innerHTML = key

      if (
        key == 'RemotePort' ||
        key == 'RemoteUser' ||
        key == 'HttpReferrer'
      )
        continue

      let colon = document.createElement('div')
      colon.classList.add('rnd-payment-requests__parsed-colon')
      colon.innerHTML = ':'

      let tempValue = document.createElement('div')
      tempValue.classList.add('rnd-payment-requests__parsed-value')
      current = current == '' || current == '[]' ? '---' : current
      tempValue.innerHTML = current

      let value =
        typeof current === 'object'
          ? this.createParsedBodyLevel(current)
          : tempValue
      // let value = tempValue

      let line = document.createElement('div')
      line.classList.add('rnd-payment-requests__parsed-line')

      line.appendChild(label)
      line.appendChild(colon)

      level.appendChild(line)
      if (typeof current !== 'object') {
        line.appendChild(value)
      } else {
        level.appendChild(value)
      }
    }

    return level
  }
}
