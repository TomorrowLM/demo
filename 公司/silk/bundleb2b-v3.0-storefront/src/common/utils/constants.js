export const B3CompanyStatus = {
  PENDING: '0',
  APPROVED: '1',
  REJECT: '2',
}

export const B3Role = {
  ADMIN: '0',
  SENIOR: '1',
  JUNIOR: '2',
  SALESREP: '3',
}

export const QuoteStatus = {
  New: '0',
  Sent: '1',
  Ordered: '2',
  Expired: '3',
  Opened: '4',
  Draft: '5',
  AwaitingApproval: '6',
  Rejected: '7',
}

export const B3ShoppListStatus = {
  0: 'Approved',
  20: 'Deleted',
  30: 'Draft',
  40: 'Ready for Approval',
}

export const shoppingListStatusDefaultOptions = [
  {
    id: '1',
    title: 'Show All Status',
    status: 'all',
    isShow: false,
  },
  {
    id: '3',
    title: 'Show Ready for Approval',
    status: '40',
    isShow: true,
  },
  {
    id: '2',
    title: 'Show Draft',
    status: '30',
    isShow: true,
    extraIsShowField: 'isShowDraftBtn',
  },
  {
    id: '0',
    title: 'Show Approved',
    status: '0',
    isShow: true,
  },
]

export const getB3ConstantLabel = (B3Constant, status) => {
  let label = ''
  Object.entries(B3Constant).forEach(([key, value]) => {
    if (value === status) label = key
  })
  return label
}

export const shortMonths = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
}

export const b3ExtraFieldTypes = {
  0: 'text',
  1: 'number',
  2: 'multiline',
}
