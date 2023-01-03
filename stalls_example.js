/**
 * List of stall with API data.
 * DO NOT DISCLOSE.
 * select concat("{api_id: ", a.ID,", api_name: '", a.Name,"', stall_id: ", s.ID,", stall_name: '", s.Name,"', net_id: ", n.ID,", net_name: '", n.Name, "'},") from Api a join Stalls s on s.ID=a.IDStall join Nets n on n.ID=a.IDNet;
 */
const stalls = {
  prod: [
    {
      api_id: 1,
      api_name: 'ApiName',
      stall_id: 1,
      stall_name: 'StallName',
      net_id: 1,
      net_name: 'NetName'
    }
  ],
  test: [
    {
      api_id: 1,
      api_name: 'ApiName',
      stall_id: 1,
      stall_name: 'StallName',
      net_id: 1,
      net_name: 'NetName'
    }
  ]
}
