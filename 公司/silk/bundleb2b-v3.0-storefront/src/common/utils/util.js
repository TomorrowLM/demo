export const creatSrctipt = (url = '') => {
  const tagName = 'script'
  const doc = window.document
  const tag = doc.createElement(tagName)
  tag.src = url
  const heads = doc.getElementsByTagName('head')
  if (heads.length) heads[0].appendChild(tag)
  else doc.documentElement.appendChild(tag)
}

export const renderTemplate = ({
  hbsTemplate,
  containerSelector,
  templateConfig,
  template,
  insertType = 'afterbegin',
}) => {
  if (typeof hbsTemplate === 'function') template = hbsTemplate(templateConfig)
  const containerEl = document.querySelector(containerSelector)
  if (containerEl) containerEl.insertAdjacentHTML(insertType, template)
}

export const leftIncludes = (str1, str2) => {
  let i = 0
  let isLeftIncludes = true

  str1 = str1?.toLowerCase()
  str2 = str2?.toLowerCase()

  if (!str1) return false

  while (i < str2.length) {
    if (str2[i] !== str1[i]) {
      isLeftIncludes = false
      break
    }
    i += 1
  }
  return isLeftIncludes
}

export const on = (el, eventType, targetClassName, fn) => {
  const $trs = document.querySelectorAll(el)
  $trs.forEach($tr => {
    $tr.addEventListener(eventType, e => {
      const targetClassList = e.target.classList
      if (!targetClassList.contains(targetClassName)) return
      if (fn instanceof Function) fn($tr, e.target, e)
    })
  })
}

export const updateQty = (el, eventType, targetClassName, fn) => {
  const $trs = document.querySelectorAll(el)
  $trs.forEach($tr => {
    $tr.getElementsByClassName(targetClassName)[0].addEventListener(eventType, e => {
      const targetClassList = e.target.classList
      if (!targetClassList.contains(targetClassName)) return
      if (fn instanceof Function) fn($tr, e.target, e)
    })
  })
}


export const filterEmptyValuesFromForm = formData => {
  const res = new FormData();

  try {
      for (const [key, val] of formData) {
          if (val !== '') {
              res.append(key, val);
          }
      }
  } catch (e) {
      console.log(e); // eslint-disable-line no-console
  }

  return res;
};


export const filterEmptyFilesFromForm = formData => {
  const res = new FormData();

  try {
      for (const [key, val] of formData) {
          if (!(val instanceof File) || val.name || val.size) {
              res.append(key, val);
          }
      }
  } catch (e) {
      console.error(e); // eslint-disable-line no-console
  }

  return res;
};

export const normalizeFormData = formData => filterEmptyValuesFromForm(filterEmptyFilesFromForm(formData));

export const getStoreZoneDate = (date) => {
  const { store_time_zone: storeTimeZone } = window.jsContext.settings

  const localDate = date ? new Date(date) : new Date()
  const localTime = localDate.getTime()
  const localOffset = localDate.getTimezoneOffset() * 60000
  const utcTime = localTime + localOffset
  const timeZone = storeTimeZone
  const zonetime = utcTime + 3600000 * timeZone
  const zoneDate = new Date(zonetime)

  return zoneDate
}