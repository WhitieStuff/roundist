class NodeShifter {
  currentProtocol = window.location.protocol
  currentHost = window.location.host
  currentPath = window.location.pathname
  currentQuery = window.location.search

  constructor() {
    rndLog('NodeShifter will add links to all nodes')

    this.addBasicLinks()
    if (options.nodeShifterTestQA) this.addTestQALinks()
  }

  addBasicLinks() {
    let basicLinks = [
      { title: '1', host: 'www.fundist.org' },
      { title: '2', host: 'www2.fundist.org' },
      { title: '3', host: 'www3.fundist.org' },
      { title: '5', host: 'www5.fundist.org' }
    ]
    this.insertLinksToLogo(basicLinks)
  }

  addTestQALinks(links) {
    rndLog('NodeShifter will add links to Test and QA')
    let testQALinks = [
      { title: 'Test', host: 'test.fundist.org' },
      { title: 'QA', host: 'qa.fundist.org' }
    ]
    this.insertLinksToLogo(testQALinks)
  }

  insertLinksToLogo(links) {
    let logo = document.querySelector('.fundist-logo')
    if (!logo) return rndLog('Logo not found')

    let linkList = document.createElement('ul')
    linkList.classList.add('rnd-logo__list')

    links.forEach(link => {
      let linkItem = document.createElement('li')
      linkItem.classList.add('rnd-logo__item')

      let linkLink = document.createElement('a')
      linkLink.innerHTML = link.title
      linkLink.href = `${this.currentProtocol}//${link.host}${this.currentPath}${this.currentQuery}`
      linkLink.classList.add('rnd-logo__link')

      linkItem.appendChild(linkLink)
      linkList.appendChild(linkItem)
    })

    logo.appendChild(linkList)
  }
}
