class UserSearch {
  constructor () {
    rndLog('UserSearch will add copy buttons')

    if (options.userSearchCopyID) this.addIDCopyButtons()
    if (options.userSearchCopyLogin) this.addLoginCopyButtons()
  }

  addIDCopyButtons() {
    let IDLinks = document.querySelectorAll('.col-UserID a')
    if (!IDLinks) return

    IDLinks.forEach(IDLink => {
      let value = IDLink.innerHTML.split(' ')[1]
      this.insertButton(IDLink, value)
    })
  }

  addLoginCopyButtons() {
    let loginLinks = document.querySelectorAll('.col-Login a')
    if (!loginLinks) return

    loginLinks.forEach(loginLink => {
      let value = loginLink.innerHTML
      this.insertButton(loginLink, value)
    })
  }

  insertButton(link, value) {
    let button = document.createElement('span')
    button.classList.add('rnd-user-search__button')
    button.addEventListener('click', event => {
      event.stopImmediatePropagation()
      this.handleCopyClick(event.target, value)
    })

    link.parentNode.insertBefore(button, link.nextSibling)
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
}