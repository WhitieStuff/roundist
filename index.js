// /**
//  * Extentios options. Either defaults or loaded from the extention storage.
//  */
let rawOptions = rndDefaults
let options = {}

let currentProtocol = window.location.protocol
let currentHost = window.location.host
let currentPath = window.location.pathname
let currentQuery = window.location.search
let currentParams = new URLSearchParams(currentQuery)

// Check if there are saved options. Overrides defaults.
chrome.storage.local.get('options', result => {
  loadOptions(rawOptions)
  if (result && result.options) loadOptions(result.options)

  drawPage()
})

/**
 * Overrides default settings with settings saved in the Roundist storage.
 * @param {object} savedOptions Options saved in the Roundist storage.
 * @param {object} defaultOptions Options saved as defaults.
 */
function loadOptions(rawOptions) {
  rawOptions.forEach(rawOption => {
    options[rawOption.name] = rawOption.value
    if (rawOption.subs && rawOption.subs.length) loadOptions(rawOption.subs)
  })
}

/**
 * Modifies the page according to the options.
 */
async function drawPage() {
  // Return if login page
  let loginForm = document.querySelector('#LoginForm')
  if (loginForm) return

  // A bit of stats
  let username = document.querySelector('#CurrentLogin')
    ? document.querySelector('#CurrentLogin').innerHTML.toLocaleLowerCase()
    : 'unknown'
  if (username.includes(',')) username = username.split(',')[1].trim()
  let stats = await fetch(
    `https://roundist.whitie.ru/?username=${encodeURI(username)}`
  )

  rndLog(options)

  let nodeShifter = options.nodeShifter ? new NodeShifter() : null
  let userSearch =
    options.userSearch &&
    currentPath.includes('Users') &&
    !currentPath.includes('Summary') &&
    !currentPath.includes('Unconfirmed')
      ? new UserSearch()
      : null
  let userPage =
    options.userPage && currentPath.includes('Users/Summary')
      ? new UserPage()
      : null
  let network =
    options.network && currentPath.includes('Nets/Info') ? new Network() : null
  let stall =
    options.stall && currentPath.includes('Stalls/Info') ? new Stall() : null
  let api = options.api && currentPath.includes('Api/Info') ? new Api() : null
}
