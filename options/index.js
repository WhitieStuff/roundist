let options = defaults

chrome.storage.sync.get('options', (result) => {
  if (result && result.options) loadOptions(result.options)
  drawPage()
})

function loadOptions(savedOptions) {
  for (sectionKey in savedOptions) {
    if (!options[sectionKey]) continue

    let savedSection = savedOptions[sectionKey]
    let defaultSection = options[sectionKey]
    defaultSection.value = savedSection.value
    if (!savedSection.options.length) continue
    
    savedSection.options.forEach(savedOption => {
      defaultSection.options.forEach(defaultOption => {
        if (defaultOption.id == savedOption.id) defaultOption.value = savedOption.value
      })
    })
  }
}

function drawPage() {
  let main = document.querySelector('#main')
  let nav = document.querySelector('#nav')
  let navList = document.querySelector('#navList')
  let sections = document.querySelector('#sections')

  if (!options) return
  for (sectionKey in options) {
    let parent = options[sectionKey]

    let navItem = createNavItem(sectionKey)
    navList.appendChild(navItem)

    let section = createSection(sectionKey)
    sections.appendChild(section)
  }

  openTab('betHistory')
}

function openTab(sectionKey) {
  let sections = document.querySelectorAll('.rnd-section')
  for (let i = 0; i < sections.length; i++)
    sections[i].classList.remove('rnd-section_active')

  let section = document.querySelector(`#section-${sectionKey}`)
  section.classList.add('rnd-section_active')

  let navButtons = document.querySelectorAll('.rnd-nav__button')
  for (let i = 0; i < navButtons.length; i++)
    navButtons[i].classList.remove('rnd-nav__button_active')

  let button = document.querySelector(`#nav-${sectionKey}`)
  button.classList.add('rnd-nav__button_active')

  updateChildren(sectionKey, sectionKey)
  options[sectionKey].options.forEach((option) => {
    updateChildren(option.id, sectionKey)
  })
}

function createNavItem(sectionKey) {
  let option = options[sectionKey]

  let navItem = document.createElement('li')
  navItem.classList.add('rnd-nav__item')
  let navButton = document.createElement('button')
  navButton.classList.add('rnd-nav__button')
  navButton.id = `nav-${sectionKey}`
  navButton.innerHTML = option.title
  navButton.sectionKey = sectionKey
  navButton.addEventListener('click', (event) => {
    openTab(event.target.sectionKey)
  })
  navItem.appendChild(navButton)

  return navItem
}

function createSection(sectionKey) {
  let parent = options[sectionKey]

  let section = document.createElement('section')
  section.classList.add('rnd-section')
  section.id = `section-${sectionKey}`

  let title = document.createElement('h2')
  title.classList.add('rnd-section__title')
  title.innerHTML = parent.title
  section.appendChild(title)

  let mainOption = createOption(parent, sectionKey)
  section.appendChild(mainOption)

  parent.options.forEach((option) => {
    let newOption = createOption(option, sectionKey)
    section.appendChild(newOption)
  })

  return section
}

function createOption(option, sectionKey) {
  let newOption = document.createElement('div')
  newOption.classList.add('rnd-section__option')
  newOption.setAttribute('name', option.id)

  let input = document.createElement('input')
  input.classList.add('rnd-section__checkbox')
  input.type = 'checkbox'
  input.setAttribute('name', `toggle-${option.id}`)
  input.id = `toggle-${option.id}`
  input.baseKey = option.id
  input.parent = option.parent
  input.sectionKey = sectionKey
  input.checked = option.value
  newOption.appendChild(input)

  let label = document.createElement('label')
  label.classList.add('rnd-section__label')
  label.setAttribute('for', `toggle-${option.id}`)
  label.innerHTML = option.title
  newOption.appendChild(label)

  input.addEventListener('change', (event) => {
    switchOption(event.target)
  })

  return newOption
}

function switchOption(checkbox) {
  let section = options[checkbox.sectionKey]

  if (checkbox.baseKey == checkbox.sectionKey) {
    section.value = checkbox.checked
  } else {
    section.options.forEach((option, index) => {
      if (option.id == checkbox.baseKey) option.value = checkbox.checked
    })
  }

  updateChildren(checkbox.baseKey, checkbox.sectionKey)
  saveOptions()
}

function updateChildren(baseKey, sectionKey) {
  let section = options[sectionKey]

  section.options.forEach((option) => {
    let optionKey = option.id
    let parentKey = option.parent
    if (parentKey != baseKey) return

    let sectionCheckbox = document.querySelector(`#toggle-${sectionKey}`)
    let sectionLocked = !sectionCheckbox.checked

    let parentCheckbox = document.querySelector(`#toggle-${parentKey}`)
    let parentLocked = parentCheckbox.disabled
    let parentValue = parentCheckbox.checked


    let isLocked = () => {
      if (parentKey == sectionKey) return sectionLocked
      if (parentLocked) return parentLocked
      return !parentValue
    }

    let locked = isLocked()

    let checkbox = document.querySelector(`#toggle-${optionKey}`)
    checkbox.disabled = locked
    if (locked) {
      checkbox.parentElement.classList.add('rnd-section__option_disabled')
    } else {
      checkbox.parentElement.classList.remove('rnd-section__option_disabled')
    }

    updateChildren(optionKey, sectionKey)
  })
}

function saveOptions() {
  chrome.storage.sync.set({ options: options }, function () {})
}

function resetOptions() {
  chrome.storage.sync.set({ options: defaults }, function () {})
}
