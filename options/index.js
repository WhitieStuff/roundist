let options = rndDefaults

chrome.storage.local.get('options', result => {
  if (result && result.options) loadOptions(result.options, options)
  drawPage()
})

function loadOptions(savedOptions, defaultOptions) {
  savedOptions.forEach(savedOption => {
    defaultOptions.forEach(defaultOption => {
      if (defaultOption.name != savedOption.name) return
      defaultOption.value = savedOption.value

      if (savedOption.subs && savedOption.subs.length)
        loadOptions(savedOption.subs, defaultOption.subs)
    })
  })
}

function drawPage() {
  let main = document.querySelector('#main')

  options.forEach((option, index) => {
    let newMarker = `rnd-options_${index}`

    let section = document.createElement('section')
    section.classList.add('rnd-options__section')
    section.marker = newMarker

    let optionHeaderCheckbox = document.createElement('input')
    optionHeaderCheckbox.type = 'checkbox'
    optionHeaderCheckbox.checked = option.value
    optionHeaderCheckbox.id = newMarker
    optionHeaderCheckbox.name = newMarker
    optionHeaderCheckbox.classList.add('rnd-options__section-header-checkbox')
    optionHeaderCheckbox.addEventListener('change', event =>
      handleHeaderCheckboxChange(event.target)
    )

    let optionHeaderLabel = document.createElement('label')
    optionHeaderLabel.innerHTML = option.title
    optionHeaderLabel.setAttribute('for', newMarker)
    optionHeaderLabel.classList.add('rnd-options__section-header-label')

    let optionHeaderToggle = document.createElement('div')
    optionHeaderToggle.classList.add('rnd-options__section-header-toggle')
    optionHeaderLabel.appendChild(optionHeaderToggle)

    let optionArticle = document.createElement('article')
    optionArticle.classList.add('rnd-options__article')

    if (option.subs && option.subs.length) {
      createLevel(optionArticle, option.subs, newMarker)
    }

    section.appendChild(optionHeaderCheckbox)
    section.appendChild(optionHeaderLabel)
    section.appendChild(optionArticle)
    main.appendChild(section)
  })

  checkOptionsState()

  function createLevel(currentLevel, subs, marker) {
    let newLevel = document.createElement('div')
    newLevel.setting = currentLevel.setting
    newLevel.marker = marker
    newLevel.setAttribute('marker', marker)
    newLevel.classList.add('rnd-options__level')
    subs.forEach((sub, index) => {
      let newMarker = `${marker}_${index}`

      let checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = sub.value
      checkbox.id = newMarker
      checkbox.name = newMarker
      checkbox.classList.add('rnd-options__section-checkbox')
      checkbox.addEventListener('change', event =>
        handleHeaderCheckboxChange(event.target)
      )

      let label = document.createElement('label')
      label.setAttribute('for', newMarker)
      label.classList.add('rnd-options__section-label')

      let toggle = document.createElement('div')
      toggle.classList.add('rnd-options__section-toggle')
      label.appendChild(toggle)
      label.innerHTML += sub.title

      newLevel.appendChild(checkbox)
      newLevel.appendChild(label)

      if (sub.subs && sub.subs.length)
        createLevel(newLevel, sub.subs, newMarker)
    })

    currentLevel.appendChild(newLevel)
  }

  function handleHeaderCheckboxChange(parent) {
    let parentID = parent.id
    let enabled = parent.checked
    let children = document.querySelectorAll(`[id^=${parentID}_]`)

    if (children && children.length)
      changeChildrenState(children, enabled, parent)

    updateOptions()
  }

  function changeChildrenState(children, parentEnabled, parent) {
    children.forEach(child => {
      child.removeAttribute('disabled')
    })
    children.forEach(child => {
      let grandParentEnabled = document.getElementById(
        parent.parentNode.marker
      ).checked
      if (!parentEnabled || !grandParentEnabled) {
        child.setAttribute('disabled', true)
      }

      let childID = child.id
      let childEnabled = child.checked
      let childChildren = document.querySelectorAll(`[id^=${childID}_]`)
      if (childChildren && childChildren.length)
        changeChildrenState(childChildren, childEnabled, child)
    })
  }

  function checkOptionsState() {
    let parentOptions = document.querySelectorAll('section > input')
    parentOptions.forEach(option => handleHeaderCheckboxChange(option))
  }
}

function updateOptions() {
  let checkboxes = document.querySelectorAll('[id^=rnd-options_]')
  checkboxes.forEach(checkbox => {
    let id = checkbox.id
    let levels = id.split('_')
    if (levels.length == 2) options[levels[1]].value = checkbox.checked
    if (levels.length == 3)
      options[levels[1]].subs[levels[2]].value = checkbox.checked
    if (levels.length == 4)
      options[levels[1]].subs[levels[2]].subs[levels[3]].value =
        checkbox.checked
    if (levels.length == 5)
      options[levels[1]].subs[levels[2]].subs[levels[3]].subs[levels[4]].value =
        checkbox.checked
  })
  saveOptions()
}

function saveOptions() {
  chrome.storage.local.set({ options: options }, function () {})
}

function resetOptions() {
  chrome.storage.local.set({ options: rndDefaults }, function () {})
}
