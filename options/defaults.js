const defaults = {
  betHistory: {
    mainTitle: 'Bet History',
    id: 'betHistory',
    parent: 'betHistory',
    value: true,
    title: 'Modify bet history',
    options: [
      {
        id: 'addSearch',
        parent: 'betHistory',
        value: true,
        title: 'Add search links for round IDs'
      },
      // {
      //   id: 'useDelta',
      //   parent: 'addSearch',
      //   value: true,
      //   title: 'Search for 10min instead of &#177;2min'
      // },
      {
        id: 'addCopy',
        parent: 'betHistory',
        value: true,
        title: 'Add copy buttons'
      },
      {
        id: 'copyAmounts',
        parent: 'addCopy',
        value: true,
        title: 'Copy bet and win amounts'
      },
      {
        id: 'addCurrency',
        parent: 'copyAmounts',
        value: true,
        title: 'Add currency'
      },
      {
        id: 'removeMinus',
        parent: 'copyAmounts',
        value: true,
        title: 'Remove minus from wins'
      },
      {
        id: 'copyTime',
        parent: 'addCopy',
        value: true,
        title: 'Copy bet and settle time'
      },
      {
        id: 'addUTC',
        parent: 'copyTime',
        value: true,
        title: 'Add UTC'
      }
    ]
  },
  depositHistory: {
    mainTitle: 'Deposit History',
    id: 'depositHistory',
    parent: 'depositHistory',
    value: true,
    title: 'Modify deposit history',
    options: []
  },
  nodeShifter: {
    mainTitle: 'Node Shifter',
    id: 'nodeShifter',
    parent: 'nodeShifter',
    value: true,
    title: 'Add node shift buttons',
    options: []
  },
  userPage: {
    mainTitle: 'User Page',
    id: 'userPage',
    parent: 'userPage',
    value: true,
    title: 'Modify user page',
    options: [
      {
        id: 'addHeaderButtons',
        parent: 'userPage',
        value: true,
        title: 'Add copy buttons to header'
      },
      {
        id: 'addCopyID',
        parent: 'addHeaderButtons',
        value: true,
        title: 'Add ID copy button'
      },
      {
        id: 'addCopyLogin',
        parent: 'addHeaderButtons',
        value: true,
        title: 'Add login copy button'
      },
      {
        id: 'addTrackerLink',
        parent: 'addHeaderButtons',
        value: true,
        title: 'Add user link for tracker'
      },
      {
        id: 'addApiInfo',
        parent: 'userPage',
        value: true,
        title: 'Add API info'
      },
      {
        id: 'modifyClientInfo',
        parent: 'userPage',
        value: false,
        title: 'Modify client info'
      },
      {
        id: 'addClientInfoLinks',
        parent: 'userPage',
        value: true,
        title: 'Add client info links'
      }
    ]
  },
  merchantRequests: {
    mainTitle: 'Merchant Requests',
    id: 'merchantRequests',
    parent: 'merchantRequests',
    value: true,
    title: 'Modify MR',
    options: []
  }
}