

export const getTreeValue = (value: any) => {
  if (value) {
    let newValue: any = []
    JSON.parse(value).forEach((item: any, index: number) => {
      if (item.city.length == 0) {//选择的省
        newValue.push(item.province_code)
      } else {//选择的市
        item.city.forEach((cityItem: any, cityIndex: number) => {
          newValue.push(item.province_code + "_" + cityItem.city_code)
        })
      }
    })
    return newValue
  } else {
    return []
  }
}

export const agentFormat = (agentList: any, agentSet: any) => {
  agentList.forEach((agentListItem: any, agentListIndex: number) => {
    agentListItem.disabled = false
    agentSet.forEach((item: any, index: number) => {
      if (agentListItem.value == item.agentId) {
        agentList[agentListIndex].disabled = true
      }
    })
  })
  return agentList
}