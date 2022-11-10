const settingsButton = document.querySelector('#settingsButton')

settingsButton.addEventListener('click', event => {
  chrome.runtime.openOptionsPage()
})