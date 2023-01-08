class Merchants {
  constructor () {
    rndLog('Merchants.js will modify the merchants page')

    if (options.merchantsExpand) this.expandMerchants()
  }

  expandMerchants() {
    let buttons = document.querySelectorAll('[name=col-Btn]')
    if (!buttons) return

    rndLog('Merchants.js will expand all submerchants')

    buttons.forEach(button => button.click())
  }
}