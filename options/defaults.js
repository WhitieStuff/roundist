const rndDefaults = [
  {
    name: 'nodeShifter',
    title: 'Node Shifter',
    value: true,
    subs: [
      {
        name: 'nodeShifterTestQA',
        title: 'Add Test and QA enviroments links',
        value: true,
        subs: []
      }
    ]
  },
  {
    name: 'userSearch',
    title: 'User Search',
    value: true,
    subs: [
      {
        name: 'userSearchCopyID',
        title: 'Add "User ID" copy button',
        value: true,
        subs: []
      },
      {
        name: 'userSearchCopyLogin',
        title: 'Add "User Login" copy button',
        value: true,
        subs: []
      }
    ]
  },
  {
    name: 'userPage',
    title: 'User Page',
    value: true,
    subs: [
      {
        name: 'userPageCopyButtons',
        title: 'Add copy buttons to the header',
        value: true,
        subs: [
          {
            name: 'userPageCopyButtonsID',
            title: 'Copy ID',
            value: true,
            subs: []
          },
          {
            name: 'userPageCopyButtonsLogin',
            title: 'Copy login',
            value: true,
            subs: []
          },
          {
            name: 'userPageCopyButtonsTracker',
            title: 'Copy tracker link',
            value: true,
            subs: []
          },
          {
            name: 'userPageCopyButtonsSlack',
            title: 'Link for Slack',
            value: true,
            subs: []
          }
        ]
      },
      {
        name: 'userPageApiStallNet',
        title: 'Add API/Stall/Network links',
        value: true,
        subs: []
      },
      {
        name: 'userPageDeposits',
        title: 'Modify deposits',
        value: true,
        subs: [
          {
            name: 'userPageDepositsDates',
            title: 'Dates to YYYY-MM-DD',
            value: true,
            subs: []
          },
          {
            name: 'userPageDepositsSearch',
            title: 'Add search buttons',
            value: true,
            subs: [
              {
                name: 'userPageDepositsSearchID',
                title: 'Transaction ID search button',
                value: true,
                subs: []
              },
              {
                name: 'userPageDepositsSearchExtID',
                title: 'Transaction ExtID search button',
                value: true,
                subs: []
              },
              {
                name: 'userPageDepositsSearchUserID',
                title: 'User ID search button',
                value: true,
                subs: []
              }
            ]
          }
        ]
      },
      {
        name: 'userPage404',
        title: 'Add node links to 404',
        value: true,
        subs: []
      },
      {
        name: 'userPageFreerounds',
        title: 'Add freerounds search buttons',
        value: true,
        subs: []
      },
      {
        name: 'userPageLastLogins',
        title: 'Add links to ApiRequests in the LastLogin history',
        value: true,
        subs: []
      }
    ]
  },
  {
    name: 'network',
    title: 'Network',
    value: true,
    subs: [
      {
        name: 'networkStalls',
        title: 'List children stalls links',
        value: true,
        subs: []
      },
      {
        name: 'networkApi',
        title: 'List children APIs links',
        value: true,
        subs: []
      },
      {
        name: 'networkCopyButtons',
        title: 'Add copy buttons to header',
        value: true,
        subs: [
          {
            name: 'networkCopyButtonsID',
            title: 'Copy ID',
            value: true,
            subs: []
          },
          {
            name: 'networkCopyButtonsName',
            title: 'Copy name',
            value: true,
            subs: []
          },
          {
            name: 'networkCopyButtonsTracker',
            title: 'Copy Tracker link',
            value: true,
            subs: []
          },
          {
            name: 'networkCopyButtonsSlack',
            title: 'Slack link',
            value: true,
            subs: []
          }
        ]
      },
      {
        name: 'networkTurnover',
        title: 'Add links to network turnover',
        value: true,
        subs: []
      },
      {
        name: 'networkMerchants',
        title: 'Add links to merchants turnovers',
        value: true,
        subs: []
      }
    ]
  },
  {
    name: 'stall',
    title: 'Stall (Site)',
    value: true,
    subs: [
      {
        name: 'stallNetwork',
        title: 'Add a link to the parent Network',
        value: true,
        subs: []
      },
      {
        name: 'stallApi',
        title: 'Add a link to the bound API',
        value: true,
        subs: []
      },
      {
        name: 'stallCopyButtons',
        title: 'Add copy buttons to header',
        value: true,
        subs: [
          {
            name: 'stallCopyButtonsID',
            title: 'Copy ID',
            value: true,
            subs: []
          },
          {
            name: 'stallCopyButtonsName',
            title: 'Copy name',
            value: true,
            subs: []
          },
          {
            name: 'stallCopyButtonsTracker',
            title: 'Copy Tracker link',
            value: true,
            subs: []
          },
          {
            name: 'stallCopyButtonsSlack',
            title: 'Slack link',
            value: true,
            subs: []
          }
        ]
      }
    ]
  },
  {
    name: 'api',
    title: 'Api',
    value: true,
    subs: [
      {
        name: 'apiNetwork',
        title: 'Add a link to the parent Network',
        value: true,
        subs: []
      },
      {
        name: 'apiStall',
        title: 'Add a link to the bound Stall',
        value: true,
        subs: []
      },
      {
        name: 'apiKey',
        title: 'Add "Key" copy button',
        value: true,
        subs: []
      },
      {
        name: 'apiKibana',
        title: 'Add a link to Kibana search',
        value: true,
        subs: []
      },
      {
        name: 'apiTurnover',
        title: 'Add link to API turnover',
        value: true,
        subs: []
      },
      {
        name: 'apiMerchants',
        title: 'Add links to merchants turnovers',
        value: true,
        subs: []
      },
      {
        name: 'apiCopyButtons',
        title: 'Add copy buttons to header',
        value: true,
        subs: [
          {
            name: 'apiCopyButtonsID',
            title: 'Copy ID',
            value: true,
            subs: []
          },
          {
            name: 'apiCopyButtonsName',
            title: 'Copy name',
            value: true,
            subs: []
          },
          {
            name: 'apiCopyButtonsTracker',
            title: 'Copy Tracker link',
            value: true,
            subs: []
          },
          {
            name: 'apiCopyButtonsSlack',
            title: 'Slack link',
            value: true,
            subs: []
          }
        ]
      }
    ]
  },
  {
    name: 'apiRequests',
    title: 'Api Requests',
    value: true,
    subs: [
      {
        name: 'apiRequestsDecode',
        title: 'Decode URL parameters',
        value: true,
        subs: []
      },
      {
        name: 'apiRequestsNewTab',
        title: 'Add distinct links to each request',
        value: true,
        subs: []
      },
      {
        name: 'apiRequestsMerchantRequests',
        title: 'Add links to Merchant Requests',
        value: true,
        subs: [
          {
            name: 'apiRequestsMerchantRequestID',
            title: 'User ID search',
            value: true,
            subs: []
          },
          {
            name: 'apiRequestsMerchantRequetsLogin',
            title: 'Login search',
            value: true,
            subs: []
          }
        ]
      },
      {
        name: 'apiRequestsKibana',
        title: 'Add Kibana link',
        value: true,
        subs: []
      },
      {
        name: 'apiRequestsLocation',
        title: 'Add GeoIP location for UserIP / RegistrationIP',
        value: true,
        subs: []
      }
    ]
  },
  {
    name: 'betHistory',
    title: 'Bet History',
    value: true,
    subs: [
      {
        name: 'betHistoryCopy',
        title: 'Add copy buttons',
        value: true,
        subs: [
          {
            name: 'betHistoryCopyCurrency',
            title: 'Add currencies to amounts',
            value: true,
            subs: []
          }
        ]
      },
      {
        name: 'betHistorySearch',
        title: 'Add search buttons',
        value: true,
        subs: [
          {
            name: 'betHistorySearchRound',
            title: 'Round ID / Ext ID / Action ID',
            value: true,
            subs: []
          },
          {
            name: 'betHistorySearchUser',
            title: 'User ID / Login / Login without prefix',
            value: true,
            subs: []
          }
        ]
      }
    ]
  },
  {
    name: 'transactionHistory',
    title: 'Transaction History',
    value: true,
    subs: [
      {
        name: 'transactionHistoryDates',
        title: 'Dates to YYYY-MM-DD',
        value: true,
        subs: []
      },
      {
        name: 'transactionHistoryCopy',
        title: 'Add copy buttons',
        value: true,
        subs: []
      },
      {
        name: 'transactionHistorySearch',
        title: 'Add search buttons',
        value: true,
        subs: [
          {
            name: 'transactionHistorySearch20',
            title: '10 minutes',
            value: true,
            subs: []
          },
          {
            name: 'transactionHistorySearch1440',
            title: 'Whole day',
            value: true,
            subs: []
          }
        ]
      }
    ]
  },
  {
    name: 'merchants',
    title: 'Merchants',
    value: true,
    subs: [
      {
        name: 'merchantsExpand',
        title: 'Expand submerchants',
        value: true,
        subs: []
      }
    ]
  },
  {
    name: 'paymentRequests',
    title: 'Payment Requests',
    value: true,
    subs: [
      {
        name: 'paymentRequestsParse',
        title: 'Decode payment requests (experimental)',
        value: true,
        subs: []
      },
      {
        name: 'paymentRequestsDayStart',
        title: 'Add "Day Start" button',
        value: true,
        subs: []
      },
      {
        name: 'paymentRequests1440',
        title: 'Add 1440m option',
        value: true,
        subs: []
      },
      {
        name: 'paymentRequestsDetectDelta',
        title: 'Use delta from current query',
        value: true,
        subs: []
      },
      {
        name: 'paymentRequestsReqRes',
        title: 'Request+Response by default',
        value: true,
        subs: []
      }
    ]
  },
  {
    name: 'merchantRequests',
    title: 'Merchant Requests',
    value: true,
    subs: [
      {
        name: 'merchantRequestsHideEvo',
        title: 'Hide Evolution blocks',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequestsRound',
        title: 'Add "Round Time" button',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequestsReqRes',
        title: 'Request+Response by default',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequests10',
        title: '10 minutes by default',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequests1530',
        title: 'Add 15m and 30m options (beware!)',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequestsKibanaOW',
        title: 'Add Kibana link to req_id',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequestsKibanaNginx',
        title: 'Add Kibana link to Nginx request ID',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequestsQuery',
        title: 'Add checkboxes for DB query',
        value: true,
        subs: []
      },
      {
        name: 'merchantRequestsParse',
        title: 'Parse requests if possible',
        value: true,
        subs: []
      }
    ]
  }
]
