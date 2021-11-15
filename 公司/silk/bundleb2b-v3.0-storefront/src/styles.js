import { merge } from 'lodash'

const {
  'body-bg': bodyBg,
  'button--default-borderColor': borderColor,
  'color-greyLight': greyLight,
} = window.jsContext.themeSettings ?? {}

const isBold = bodyBg === '#444444'

const useStyles = window.b3themeConfig ?.useStyles ?? {}
const useClasses = window.b3themeConfig ?.useClasses ?? {}

const componentClasses = merge({}, {
  // global
  'global.shoppingListModal.header': {},
  'global.shoppingListModal.header.title': {},
  'global.shoppingListModal.header.close': {},
  'global.shoppingListModal.body': {},
  'global.shoppingListModal.actions.container': {},
  'global.shoppingListModal.button.cancel': {},
  'global.shoppingListModal.button.save': {},
  'global.shoppingListModal.form.container': {},
  'global.shoppingListModal.form.item': {},
  'global.shoppingListModal.form.item.label': {},
  'global.shoppingListModal.form.item.input': {},
  'global.shoppingListModal.form.item.textarea': {},
  'global.shoppingListModal.form.item.required': {},
  // tpa
  'tpa.mobile.entryButton': {},
  'tpa.entryButton': {},
  // addressBook
  'addressBook.panel.container': {},
  'addressBook.panel.title': {},
  'addressBook.panel.info.container': {},
  'addressBook.panel.info': {},
  'addressBook.panel.phone.label': {},
  'addressBook.panel.phone': {},
  'addressBook.actions.container': {},
  'addressBook.search.input': {},
  'addressBook.search.icon': {},
  'addressBook.filter.button': {},
  'addressBook.filter.button.icon': {},
  'addressBook.actions.addNew.button': {},
  'addressBook.filter.container': {},
  'addressBook.filter.item.container': {},
  'addressBook.filter.item.input': {},
  'addressBook.filter.item.label': {},
  'addressBook.filter.item.select': {},
  'addressBook.filter.item.checkbox.container': {},
  'addressBook.filter.item.checkbox': {},
  'addressBook.filter.item.checkbox.label': {},
  'addressBook.filter.cancel.button': {},
  'addressBook.filter.apply.button': {},
  'addressBook.table.container': {},
  'addressBook.table.thead.th': {},
  'addressBook.td.shipping.icon': {},
  'addressBook.td.billing.icon': {},
  'addressBook.td.action.icon': {},
  'addressBook.td.action.container': {},
  'addressBook.td.action.item': {},
  'addressBook.modal.header': {},
  'addressBook.modal.header.title': {},
  'addressBook.modal.header.close': {},
  'addressBook.modal.body': {},
  'addressBook.modal.form.checkbox': {},
  'addressBook.modal.form.checkbox.checked': {},
  'addressBook.modal.form.checkbox.label': {},
  'addressBook.modal.form.item.container': {},
  'addressBook.modal.form.item.input': {},
  'addressBook.modal.form.item.label': {},
  'addressBook.modal.form.item.select': {},
  'addressBook.modal.form.item.required': {},
  'addressBook.modal.form.button.container': {},
  'addressBook.modal.form.button.save': {},
  'addressBook.modal.form.button.cancel': {},
  // buyAgain
  'buyAgain.actions.container': {},
  'buyAgain.search.container': {},
  'buyAgain.search.input': {},
  'buyAgain.dateFilter.container': {},
  'buyAgain.dateFilter.from.input': {},
  'buyAgain.dateFilter.from.icon': {},
  'buyAgain.dateFilter.to.input': {},
  'buyAgain.dateFilter.to.icon': {},
  'buyAgain.table': {},
  'buyAgain.thead.th': {},
  'buyAgain.tbody.td': {},
  'buyAgain.td.qty.container': {},
  'buyAgain.td.qty.decrease': {},
  'buyAgain.td.qty.increase': {},
  'buyAgain.td.qty.input': {},
  'buyAgain.td.actions.container': {},
  'buyAgain.td.actions.button.addToCart': {},
  'buyAgain.td.actions.button.addToShoppingList': {},
  'buyAgain.unit.container': {},
  'buyAgain.unit.num': {},
  'buyAgain.shoppingListModal.header': {},
  'buyAgain.shoppingListModal.header.title': {},
  'buyAgain.shoppingListModal.header.close': {},
  'buyAgain.shoppingListModal.body': {},
  'buyAgain.shoppingListModal.list.container': {},
  'buyAgain.shoppingListModal.list.item': {},
  'buyAgain.shoppingListModal.list.item.active': {},
  'buyAgain.shoppingListModal.list.item.hover': {},
  'buyAgain.shoppingListModal.pagination.container': {},
  'buyAgain.shoppingListModal.actions.container': {},
  'buyAgain.shoppingListModal.button.addToNew': {},
  'buyAgain.shoppingListModal.button.add': {},
  'buyAgain.shoppingListModal.button.cancel': {},
  // create & edit quote
  'createQuote.head.container': {},
  'createQuote.head.title': {},
  'createQuote.head.actions.container': {},
  'createQuote.head.button.cancel': {},
  'createQuote.head.button.draft': {},
  'createQuote.head.button.update': {},
  'createQuote.head.button.preview': {},
  'createQuote.body.container': {},
  'createQuote.body.title': {},
  'createQuote.body.form.item.container': {},
  'createQuote.body.form.item.label': {},
  'createQuote.body.form.item.input': {},
  'createQuote.body.form.item.select': {},
  'createQuote.body.search.container': {},
  'createQuote.body.search.title': {},
  'createQuote.body.search.label': {},
  'createQuote.body.search.input': {},
  'createQuote.body.search.button': {},
  'createQuote.body.search.button.icon': {},
  'createQuote.body.search.add.button': {},
  'createQuote.table': {},
  'createQuote.thead.th': {},
  'createQuote.tbody.td': {},
  'createQuote.td.product': {},
  'createQuote.td.product.img': {},
  'createQuote.td.price': {},
  'createQuote.td.discount.container': {},
  'createQuote.td.discount.label': {},
  'createQuote.td.discount.input': {},
  'createQuote.td.newPrice.container': {},
  'createQuote.td.newPrice.label': {},
  'createQuote.td.newPrice.input': {},
  'createQuote.td.quantity.container': {},
  'createQuote.td.quantity.label': {},
  'createQuote.td.quantity.input': {},
  'createQuote.td.lineTotal.container': {},
  'createQuote.td.lineTotal.delete.icon': {},
  'createQuote.checkInfo.container': {},
  'createQuote.checkInfo.list.container': {},
  'createQuote.checkInfo.list.item': {},
  'createQuote.checkInfo.list.item.label': {},
  'createQuote.checkInfo.list.item.value': {},
  'createQuote.infomation.container': {},
  'createQuote.infomation.title': {},
  'createQuote.infomation.subtitle': {},
  'createQuote.infomation.textarea': {},
  'createQuote.foot.actions.container': {},
  'createQuote.foot.button.cancel': {},
  'createQuote.foot.button.draft': {},
  'createQuote.foot.button.update': {},
  'createQuote.foot.button.preview': {},
  'createQuote.companyModal.header': {},
  'createQuote.companyModal.header.input': {},
  'createQuote.companyModal.header.close': {},
  'createQuote.companyModal.body': {},
  'createQuote.companyModal.list.container': {},
  'createQuote.companyModal.list.item': {},
  'createQuote.companyModal.list.item.active': {},
  'createQuote.companyModal.list.item.hover': {},
  'createQuote.companyModal.pagination.container': {},
  'createQuote.companyModal.actions.container': {},
  'createQuote.companyModal.button.cancel': {},
  'createQuote.companyModal.button.save': {},
  'createQuote.addressModal.header': {},
  'createQuote.addressModal.header.input': {},
  'createQuote.addressModal.header.button': {},
  'createQuote.addressModal.header.button.icon': {},
  'createQuote.addressModal.header.close': {},
  'createQuote.addressModal.body': {},
  'createQuote.addressModal.list.item': {},
  'createQuote.addressModal.pagination.container': {},
  // dashboard
  'dashboard.head.container': {},
  'dashboard.head.info.container': {},
  'dashboard.head.info.left': {},
  'dashboard.head.info.right': {},
  'dashboard.panel.container': {},
  'dashboard.userInfo.container': {},
  'dashboard.userInfo.name.container': {},
  'dashboard.userInfo.name.label': {},
  'dashboard.userInfo.name.value': {},
  'dashboard.userInfo.email.container': {},
  'dashboard.userInfo.email.label': {},
  'dashboard.userInfo.email.value': {},
  'dashboard.companyInfo.container': {},
  'dashboard.companyInfo.title': {},
  'dashboard.companyInfo.num': {},
  'dashboard.actions.container': {},
  'dashboard.search.container': {},
  'dashboard.search.input': {},
  'dashboard.pagination.container': {},
  'dashboard.table': {},
  'dashboard.thead.th': {},
  'dashboard.tbody.tr': {},
  'dashboard.td': {},
  'dashboard.td.button.begin': {},
  'dashboard.td.button.selected': {},
  'dashboard.td.button.end.container': {},
  'dashboard.td.button.end': {},
  // order
  'order.container': {},
  'order.content.container': {},
  'order.aside.container': {},
  'order.content.title': {},
  'order.content.list.container': {},
  'order.content.list.item.container': {},
  'order.content.list.item.product.container': {},
  'order.content.list.item.product.price': {},
  'order.content.list.item.product.title': {},
  'order.content.list.item.checkbox': {},
  'order.content.list.item.checkbox.checked': {},
  'order.checkInfo.container': {},
  'order.checkInfo.dd': {},
  'order.checkInfo.dt': {},
  'order.checkInfo.totalPrice': {},
  'order.aside.item.container': {},
  'order.aside.item.title': {},
  'order.aside.item.orderInfo.container': {},
  'order.aside.item.orderInfo.item.label': {},
  'order.aside.item.orderInfo.item.value': {},
  'order.aside.address.list.container': {},
  'order.aside.address.list.item': {},
  'order.aside.actions.container': {},
  'order.aside.button.print': {},
  'order.aside.button.reorder': {},
  'order.aside.button.addToNewShoppingList': {},
  // orders
  'orders.statusActions.container': {},
  'orders.button.showMy': {},
  'orders.button.showAll': {},
  'orders.search.container': {},
  'orders.search.input': {},
  'orders.search.button': {},
  'orders.search.button.icon': {},
  'orders.search.filters.button': {},
  'orders.search.filters.button.icon': {},
  'orders.dateFilter.container': {},
  'orders.dateFilter.from.input': {},
  'orders.dateFilter.to.input': {},
  'orders.dateFilter.from.icon': {},
  'orders.dateFilter.to.icon': {},
  'orders.search.filters.container': {},
  'orders.search.filters.items.container': {},
  'orders.search.filters.item.container': {},
  'orders.search.filters.item.input': {},
  'orders.search.filters.item.label': {},
  'orders.search.filters.actions.container': {},
  'orders.search.filters.button.clear': {},
  'orders.search.filters.button.apply': {},
  'orders.table': {},
  'orders.thead.th': {},
  'orders.tbody.td': {},
  'orders.td.status': {},
  'orders.td.action.container': {},
  'orders.td.action.button.reorder': {},
  'orders.td.action.button.addToShoppingList': {},
  // qop
  'qop.mobile.entryButton': {},
  'qop.entryButton': {},
  'qop.container': {},
  'qop.left.panel.container': {},
  'qop.left.panel': {},
  'qop.left.panel.title': {},
  'qop.left.panel.subtitle': {},
  'qop.left.panel.upload.container': {},
  'qop.left.panel.upload.label': {},
  'qop.left.panel.button.addToCart': {},
  'qop.right.panel.container': {},
  'qop.right.panel': {},
  'qop.right.panel.title': {},
  'qop.right.panel.subtitle': {},
  'qop.right.panel.remove': {},
  'qop.right.panel.sku.input': {},
  'qop.right.panel.qty.input': {},
  'qop.right.panel.button.container': {},
  'qop.right.panel.button.addRow': {},
  'qop.right.panel.button.addToCart': {},
  // quotes
  'quotes.container': {},
  'quotes.head.container': {},
  'quotes.head.title': {},
  'quotes.head.button.createQuote': {},
  'quotes.table': {},
  'quotes.thead.th': {},
  'quotes.tbody.td': {},
  'quotes.td.action.icon': {},
  'quotes.td.action.panel.container': {},
  'quotes.td.action.panel.item': {},
  'quotes.unit.container': {},
  'quotes.unit.num': {},
  // rfq
  'rfq.container': {},
  // quote detail
  'quote.container': {},
  'quote.head.container': {},
  'quote.head.left.container': {},
  'quote.head.left.icon': {},
  'quote.head.right.container': {},
  'quote.button.print': {},
  'quote.button.print.icon': {},
  'quote.button.pdf': {},
  'quote.button.pdf.icon': {},
  'quote.button.email': {},
  'quote.button.email.icon': {},
  'quote.button.cancel': {},
  'quote.button.update': {},
  'quote.button.saveDraft': {},
  'quote.button.publish': {},
  'quote.draft.tag.container': {},
  'quote.draft.tag': {},
  'quote.info.container': {},
  'quote.info.items.container': {},
  'quote.info.item.container': {},
  'quote.info.item.title': {},
  'quote.info.item.text': {},
  'quote.table': {},
  'quote.thead.th': {},
  'quote.tbody.tr': {},
  'quote.tbody.td': {},
  'quote.tbody.td.img': {},
  'quote.checkInfo.wraper': {},
  'quote.checkInfo.container': {},
  'quote.checkInfo.item.container': {},
  'quote.checkInfo.item.label': {},
  'quote.checkInfo.item.value': {},
  'quote.additional.container': {},
  'quote.additional.title': {},
  'quote.additional.text': {},
  'quote.foot.container': {},
  'quote.emailModal.header': {},
  'quote.emailModal.header.title': {},
  'quote.emailModal.header.close': {},
  'quote.emailModal.form.container': {},
  'quote.emailModal.form.email.input': {},
  'quote.emailModal.form.email.label': {},
  'quote.emailModal.form.email.icon': {},
  'quote.emailModal.form.button.container': {},
  'quote.emailModal.form.button.cancel': {},
  'quote.emailModal.form.button.send': {},
  // shoppinglists
  'shoppinglists.head.container': {},
  'shoppinglists.head.title': {},
  'shoppinglists.head.button.container': {},
  'shoppinglists.head.button.create': {},
  'shoppinglists.table': {},
  'shoppinglists.thead.th': {},
  'shoppinglists.tbody.tr': {},
  'shoppinglists.tbody.td': {},
  'shoppinglists.td.action.icon': {},
  'shoppinglists.td.action.panel.container': {},
  'shoppinglists.td.action.panel.item': {},
  'shoppinglists.unit.container': {},
  'shoppinglists.unit.num': {},
  // shoppinglist
  'shoppinglist.head.container': {},
  'shoppinglist.head.title': {},
  'shoppinglist.button.editInfo': {},
  'shoppinglist.info.container': {},
  'shoppinglist.info.label': {},
  'shoppinglist.info.select': {},
  'shoppinglist.button.update': {},
  'shoppinglist.products.container': {},
  'shoppinglist.left.wraper': {},
  'shoppinglist.left.container': {},
  'shoppinglist.left.title': {},
  'shoppinglist.left.form.container': {},
  'shoppinglist.left.form.item.container': {},
  'shoppinglist.left.form.item.label': {},
  'shoppinglist.left.form.item.input': {},
  'shoppinglist.left.button.singleSku': {},
  'shoppinglist.left.button.singleSku.icon': {},
  'shoppinglist.left.button.multipleSku': {},
  'shoppinglist.left.button.multipleSku.icon': {},
  'shoppinglist.left.button.more': {},
  'shoppinglist.left.button.choose': {},
  'shoppinglist.left.button.addToList': {},
  'shoppinglist.right.wraper': {},
  'shoppinglist.right.unit.container': {},
  'shoppinglist.right.unit.num': {},
  'shoppinglist.right.table': {},
  'shoppinglist.right.thead.th': {},
  'shoppinglist.right.checkbox': {},
  'shoppinglist.right.tbody.tr': {},
  'shoppinglist.right.tbody.td': {},
  'shoppinglist.right.td.img': {},
  'shoppinglist.right.td.qty.input': {},
  'shoppinglist.right.button.deleteSelected': {},
  'shoppinglist.right.button.updateQty': {},
  'shoppinglist.right.button.editOption': {},
  'shoppinglist.right.button.editOption.icon': {},
  'shoppinglist.right.button.delete': {},
  'shoppinglist.right.button.delete.icon': {},
  'shoppinglist.right.item.grand.total': {},
  'shoppinglist.bottom.cart.wraper': {},
  'shoppinglist.bottom.cart.container': {},
  'shoppinglist.bottom.cart.content.container': {},
  'shoppinglist.bottom.cart.button.toggle': {},
  'shoppinglist.bottom.cart.button.addToCart': {},
  'shoppinglist.bottom.cart.button.goToCheckout': {},
  'shoppinglist.editModal.header.container': {},
  'shoppinglist.editModal.header.title': {},
  'shoppinglist.editModal.header.close': {},
  'shoppinglist.editModal.body': {},
  'shoppinglist.editModal.form.container': {},
  'shoppinglist.editModal.form.item.container': {},
  'shoppinglist.editModal.form.item.label': {},
  'shoppinglist.editModal.form.item.input': {},
  'shoppinglist.editModal.form.item.textarea': {},
  'shoppinglist.editModal.form.item.required': {},
  'shoppinglist.editModal.button.container': {},
  'shoppinglist.editModal.button.save': {},
  'shoppinglist.editModal.button.cancel': {},
  // user management
  'userManagement.title.container': {},
  'userManagement.title.text': {},
  'userManagement.table': {},
  'userManagement.thead.th': {},
  'userManagement.tbody.tr': {},
  'userManagement.tbody.td': {},
  'userManagement.td.actions.container': {},
  'userManagement.td.button.edit': {},
  'userManagement.td.button.delete': {},
  'userManagement.unit.container': {},
  'userManagement.unit.num': {},
  'userManagement.button.container': {},
  'userManagement.button.addNew': {},
  'userManagement.modal.header.container': {},
  'userManagement.modal.header.title': {},
  'userManagement.modal.header.close': {},
  'userManagement.modal.body': {},
  'userManagement.modal.form.container': {},
  'userManagement.modal.form.item.container': {},
  'userManagement.modal.form.item.input': {},
  'userManagement.modal.form.item.select': {},
  'userManagement.modal.form.item.label': {},
  'userManagement.modal.form.item.required': {},
  'userManagement.modal.form.button.container': {},
  'userManagement.modal.form.button.save': {},
  'userManagement.modal.form.button.cancel': {},
  // pdp
  'pdp.button.addToShoppingList': {},
  'pdp.button.addToShoppingList.icon': {},
}, useStyles)

const basicClass = {
  'g__date-filter-container': {
    float: 'right',
    position: 'relative',
    marginTop: '10px',
    marginBottom: '10px',
  },
  'g__date-filter-container-input': {
    width: '32%',
    height: '36px',
    lineHeight: '36px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    padding: '0.75rem 0.5rem',
    borderStyle: 'solid',
    borderWidth: '1px',
    marginLeft: '4px',
    textAlign: 'center',
    minWidth: '120px',
    marginRight: '10px',
    color: '#333',
  },
  'g__date-filter-container-input--m': {
    width: '160px',
    padding: '0.75rem 1rem',
    // paddingLeft: '30px!important',
  },
  'g__err-tips': {
    display: 'block',
    color: '#e4393c',
  },
  'g__tip-color': {
    color: '#e4393c',
  },
  'g__tip-border-color': {
    borderColor: '#e4393c',
  },
  'g__[disabled]': {
    cursor: 'not-allowed',
    opacity: '0.7',
  },
  'g__draft-container': {
    textAlign: 'right',
  },
  'g__draft-container-h3': {
    display: 'inline-block',
    background: '#444444',
    color: '#ffffff',
    padding: '0 20px',
    borderRadius: '4px',
    transform: 'translateY(2rem)',
    margin: 0,
  },
  'g__[data-row]': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  'g__[data-row-end]': {
    justifyContent: 'flex-end',
  },
  'g__csv-check-info': {
    marginTop: '15px',
    marginBottom: '15px',
    color: '#990000',
    fontWeight: '700',
  },
  'g__col-checkbox': {
    display: 'table-cell',
    paddingTop: '43px',
  },
  'g__col-checkbox-input': {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  'g__col-product-info': {
    display: 'table-cell',
    width: '90%',
    fontSize: 0,
  },
  'g__col-product-info--s': {
    width: '50%',
  },
  'g__additional-info': {
    width: '100%',
    resize: 'none',
    borderColor: '#ddd',
    minHeight: '100px',
  },
  'g__product-search-btn': {
    marginLeft: '10px',
  },
  'g__head-prfix': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  'g__title-wrap': {
    marginBottom: '3rem',
    position: 'relative',
  },
  'g__title-wrap-title': {
    display: 'inline-block',
    marginTop: 0,
    marginBottom: '1rem',
    marginRight: '15px',
    fontSize: '25px',
    fontWeight: '400',
  },
  'g__title-wrap-title--s': {
    fontSize: '40px',
    marginBottom: '3rem',
  },
  'g__title-wrap-title-small': {
    marginTop: 0,
    marginBottom: '2.5rem',
    color: 'inherit',
    fontWeight: '400',
    fontSize: '30px',
    lineHeight: '1',
  },
  'g__title-wrap-title-desc': {
    marginBottom: '1rem',
  },
  'g__title-wrap-title-actions': {
    marginBottom: '2rem',
  },
  'g__title-wrap-title-actions--s': {
    marginTop: '2rem',
    float: 'right',
  },
  'g__clearfix-before-after': {
    content: '',
    display: 'table',
    clear: 'both',
  },
  'g__float-left': {
    float: 'left',
  },
  'g__float-right': {
    float: 'right',
  },
  'g__button-small': {
    fontSize: '14px',
    padding: '7px 10px',
  },
  'g__button-action--hover': {
    textDecoration: 'underline',
  },
  'g__button-square': {
    width: '30px',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center',
  },
  'g__form-label': {
    fontWeight: 600,
  },
  'g__form-label-small': {
    float: 'none',
    color: '#e02b27',
  },
  'g__form-action': {
    float: 'left',
    width: '100%',
  },
  'g__form-action-right': {
    textAlign: 'right',
  },
  'g__action-link': {
    textDecoration: 'none',
    display: 'inline-block',
  },
  'g__action-link--hover': {
    textDecoration: 'underline',
  },
  'g__action-link-btn': {
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: '5px',
  },
  g__action: {
    cursor: 'pointer',
  },
  'g__action-fright': {
    float: 'right',
    marginRight: 0,
  },
  'g__table-thead-th-td': {
    verticalAlign: 'bottom',
    padding: '5px 5px',
    textAlign: 'left',
  },
  'g__table-thead-th-td--s': {
    padding: '11px 10px',
  },
  g__table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  'g__table-thead--s': {
    display: 'table-header-group',
  },
  'g__table-tbody-tr': {
    display: 'table-row',
    paddingTop: '6px',
  },
  'g__table-tbody-tr--s': {
    display: 'block',
    borderTop: '1px solid #ccc',
    paddingTop: 0,
  },
  'g__table-tbody-tr-dropdown': {
    background: isBold ? greyLight : bodyBg,
  },
  'g__table-td-label': {
    backgroundColor: '#e6e6e6',
    padding: '2px',
    borderRadius: '3px',
    marginRight: '5px',
    fontSize: '12px',
    fontStyle: 'italic',
    fontWeight: '400',
  },
  'g__table-td--s': {
    display: 'table-cell',
    borderTop: '1px solid #ccc',
    verticalAlign: 'top',
  },
  'g__text-right': {
    textAlign: 'right',
  },
  'g__text-left': {
    textAlign: 'left',
  },
  'g__text-center': {
    textAlign: 'center',
  },
  'g__font-title': {
    fontSize: '18px',
  },
  'g__table-toolbar': {
    overflow: 'hidden',
  },
  'g__table-toolbar-top': {
    clear: 'both',
  },
  'g__margin-right-0': {
    marginRight: 0,
  },
  'g__margin-left-0': {
    marginLeft: 0,
  },
  'g__margin-left-25': {
    marginLeft: '25px',
  },
  'g__margin-right-5': {
    marginRight: '5px',
  },
  'g__margin-bottom-0': {
    marginRight: 0,
  },
  g__border: {
    border: '1px solid #999',
  },
  'g__fontweight-700': {
    fontWeight: 700,
  },
  'g__color-333': {
    color: '#333',
  },
  'g__search-product-table': {
    position: 'relative',
    border: '1px solid #eee',
    width: '50%',
  },
  'g__search-product-table--m': {
    width: '100%',
  },
  'g__search-product-table-tbody-td': {
    borderTop: 'none',
  },
  'g__search-product-table-checkbox': {
    width: '16px',
    height: '16px',
  },
  'g__search-product-table-product-figure': {
    width: '50px',
  },
  'g__search-product-table-product-figure--s': {
    width: '70px',
  },
  'g__search-product-table-product-price': {
    position: 'absolute',
    top: '5px',
    right: '5px',
  },
  'g__search-product-table-product-price--s': {
    position: 'relative',
    top: 'auto',
    right: 'auto',
  },
  'g__search-product-table-qty': {
    width: '80px',
    position: 'absolute',
    right: '-87px',
    top: 0,
  },
  'g__search-product-table-qty--s': {
    top: 'auto',
  },
  'g__search-product-table-qty-input': {
    width: '60px',
  },
  'g__search-product-table-option-container': {
    marginTop: '0.5rem',
    marginBottom: 0,
  },
  'g__search-product-table-option-label': {
    marginBottom: '5px',
  },
  'g__search-product-table-option-field': {
    marginBottom: '0.75rem',
  },
  quote__count: {
    padding: '0 10px 10px 10px',
  },
  'quote__select-email-container-modal-close': {
    height: '2.28571rem',
    width: '2.28571rem',
    color: '#757575',
    fontSize: '26px',
    lineHeight: '2.28571rem',
    padding: 0,
    position: 'absolute',
    textAlign: 'center',
    textDecoration: 'none',
    zIndex: '50',
    right: 0,
    top: 0,
  },
  'quote__select-email-container': {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: bodyBg,
    zIndex: '99',
  },
  'quote__send-email-container-input-label': {
    fontSize: '17px',
    padding: '10px 0',
  },
  'quote__send-email-container-tips': {
    fontStyle: 'italic',
    padding: '0 20px',
    fontSize: '15px',
    textAlign: 'justify',
  },
  'quote__send-email-container-actions-btn': {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '20px 20px 10px 20px',
  },
  'quote__send-email-container-select-btn': {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: '10',
    fontSize: '30px',
    cursor: 'pointer',
  },
  'quote__td-img': {
    width: '60px',
  },
  quote__info: {
    alignItems: 'flex-start',
  },
  'quote__actions-container': {
    textAlign: 'right',
  },
  'quote__info-title': {
    fontWeight: 'bold',
    padding: '11px 5px',
    textTransform: 'inherit',
    marginBottom: 0,
    paddingBottom: 0,
  },
  quote__item: {
    fontSize: '14px',
    padding: '11px 5px 0 11px',
  },
  'quote__address-container': {
    display: 'inline-block',
    padding: '10px',
  },
  'quote__select-address': {
    position: 'relative',
    cursor: 'pointer',
    border: '1px solid #dddddd',
  },
  'quote__select-address-after': {
    display: 'block',
    content: '',
    position: 'absolute',
    right: '-10px',
    bottom: '-10px',
    width: '0;',
    height: 0,
    borderWidth: '10px',
    borderStyle: 'solid',
    borderColor: 'transparent transparent #dddddd  transparent',
    transform: 'rotateZ(135deg)',
  },
  'quote__action-btn': {
    cursor: 'pointer',
    width: '20px',
  },
  'create-quote__quote-box': {
    padding: '10px 25px',
    marginBottom: '20px',
  },
  'create-quote__quote-box-form-field': {
    maxWidth: '620px',
  },
  'create-quote__search-box': {
    display: 'flex',
    position: 'relative',
  },
  'create-quote__action-item': {
    marginBottom: 0,
  },
  'create-quote__page-title': {
    margin: 0,
  },
  'create-quote__add-btn': {
    marginBottom: 0,
  },
  dashboard__wrap: {
    overflow: 'hidden',
    clear: 'both',
  },
  'dashboard__info-wrap': {
    overflow: 'hidden',
    clear: 'both',
  },
  'dashboard__info-wrap-user-info': {
    minWidth: '360px',
    height: '132px',
    boxSizing: 'border-box',
    padding: '39px 26px',
    backgroundColor: isBold ? 'none' : '#ebebeb',
    width: '100%',
    float: 'left',
    marginBottom: '10px',
    border: isBold ? `1px solid ${borderColor}` : 'none',
  },
  'dashboard__info-wrap-user-info--m': {
    width: 'auto',
    marginBottom: 0,
  },
  'dashboard__info-wrap-user-name': {
    marginBottom: '10px',
  },
  'dashboard__info-user-label': {
    fontWeight: 700,
  },
  'dashboard__info-list-record': {
    minWidth: '262px',
    height: '132px',
    paddingTop: '16px',
    float: 'left',
    boxSizing: 'border-box',
    textAlign: 'center',
    border: '1px solid',
    width: '100%',
    borderColor: isBold ? borderColor : 'gray',
  },
  'dashboard__info-list-record--m': {
    float: 'right',
    width: 'auto',
  },
  'dashboard__info-record-total': {
    fontSize: '30px',
    fontWeight: 800,
  },
  'dashboard__table-filter-icon': {
    display: 'inline-block',
    borderRight: '6px solid transparent',
    borderLeft: '6px solid transparent',
    borderTop: '6px solid #000',
    marginLeft: '3px',
  },
  'dashboard__asc-filter-icon': {
    borderBottom: '6px solid #000',
    borderTop: 'none',
  },
  dashboard__pagination: {
    marginTop: '20px',
    width: '100%',
  },
  'dashboard__pagination--m': {
    width: '20%',
    float: 'right',
  },
  'dashboard__search-container': {
    marginTop: '20px',
    width: '100%',
  },
  'dashboard__search-container--m': {
    width: '25%',
    float: 'left',
  },
  'dashboard__view-action': {
    textDecoration: 'none',
    cursor: 'pointer',
    margin: 0,
  },
  'dashboard__td-last--m': {
    width: '250px',
  },
  login__infobox: {
    backgroundColor: '#666',
    color: '#fff',
    lineHeight: '15px',
    position: 'absolute',
    width: '1.28571rem',
    top: '56px',
    right: 0,
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
  'login__infobox-container': {
    padding: '0 1.28rem',
    display: 'none',
    justifyContent: 'space-between',
  },
  'login__infobox-container--m': {
    display: 'flex',
  },
  'login__infobox-company-name': {
    maxWidth: '40%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '40px',
  },
  'login__infobox-company-name--m': {
    maxWidth: '50%',
  },
  'login__infobox--m': {
    float: 'right',
    position: 'relative',
    top: 0,
    width: '100vw',
  },
  'login__infobox-before': {
    display: 'block',
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    borderTop: '20px solid #666666',
    borderRight: '20px solid #ffffff',
    borderBottom: '20px solid #666666',
  },
  'login__infobox-extends': {
    width: '100%',
  },
  'login__infobox-extends-before': {
    display: 'block',
    content: '',
    position: 'absolute',
    top: '50%',
    left: 0,
    height: 0,
    width: 0,
    transform: 'translateY(-50%)',
    borderTop: '10px solid #666666',
    borderLeft: '10px solid #FFFFFF',
    borderBottom: '10px solid #666666',
    borderRight: 'none',
  },
  'buy-again__search': {
    width: '25%',
    minWidth: '220px',
  },
  'buy-again__search--s': {
    width: '91%',
  },
  'buy-again__table-options-container': {
    marginTop: '15px',
  },
  'buy-again__table-btn-small': {
    display: 'block',
    width: '170px',
    minWidth: '170px',
    margin: '10px auto',
  },
  'buy-again__table-qty-container': {
    display: 'flex',
    justifyContent: 'center',
  },
  'buy-again__table-qty-wrap': {
    marginTop: '30px',
    width: '150px',
    display: 'flex',
    border: '1px solid #eee',
    borderRadius: '10px',
  },
  'buy-again__table-qty-btn': {
    fontSize: '20px',
    width: '40px',
    textAlign: 'center',
    lineHeight: '36px',
    cursor: 'context-menu',
    userSelect: 'none',
  },
  'buy-again__table-qty-input': {
    border: 'none',
    height: '36px',
    lineHeight: '36px',
    flex: '1',
    textAlign: 'center',
    maxWidth: '68px',
  },
  'quick-order-pad__container': {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  'quick-order-pad__result-message': {
    padding: '15px 0',
    color: '#008a06',
  },
  'quick-order-pad__csv-check-info': {
    marginTop: '15px',
    marginBottom: '15px',
    color: '#990000',
    fontWeight: '700',
  },
  'quick-order-pad__error-info': {
    color: '#990000',
    fontWeight: '700',
  },
  'quick-order-pad__error-info-icon': {
    fontSize: '12px',
  },
  'quick-order-pad__add-to-cart': {
    float: 'right',
    right: '120px',
  },
  'quick-order-pad__table': {
    marginBottom: '40px',
  },
  'quick-order-pad__table-th': {
    fontWeight: '700',
    fontSize: '20px',
    paddingLeft: 0,
    paddingRight: 0,
  },
  'quick-order-pad__table-th-has-line': {
    borderBottom: '1px solid #ccc',
  },
  'quick-order-pad__table-td': {
    border: 'none',
    padding: '9px 12px',
    verticalAlign: 'top',
  },
  'quick-order-pad__action-left': {
    width: '20px',
    paddingTop: '15px',
    paddingLeft: 0,
    paddingRight: 8,
  },
  'quick-order-pad__sku': {
    width: '50%',
    paddingLeft: 0,
  },
  'quick-order-pad__sku--m': {
    width: '100%',
  },
  'quick-order-pad__sku-input': {
    width: '100%',
  },
  'quick-order-pad__qty': {
    width: '20%',
    textAlign: 'center',
    paddingLeft: 0,
  },
  'quick-order-pad__qty--m': {
    width: '100%',
  },
  'quick-order-pad__price': {
    paddingTop: '15px',
    textAlign: 'center',
    display: 'none',
  },
  'quick-order-pad__remove-icon': {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '12px',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '12px',
    cursor: 'pointer',
  },
  'quick-order-pad__input': {
    height: '38px',
    borderRadius: 0,
    borderColor: '#ccc',
  },
  'quick-order-pad__input--focus': {
    borderColor: '#ccc',
  },
  'quick-order-pad__upload-drop': {
    minHeight: '300px',
    position: 'relative',
    width: '100%',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '1.2',
    border: '1px solid transparent',
    backgroundColor: isBold ? 'none' : '#ebebeb',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center 70%',
    backgroundImage: 'url("data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABUCAYAAACx6ghoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZTE1MmI3YS02NjUyLTI4NDUtOWQxYi04NzdkOGNjNzQ4MmUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzJEODc2OTMxOTZGMTFFOTlDMTVBQjUzMjBFQzVBMzUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzJEODc2OTIxOTZGMTFFOTlDMTVBQjUzMjBFQzVBMzUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTQ2YTE4MmItNjM5Yy0wNDRlLWJjODgtM2ViZWE5NzZiODBhIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBlMTUyYjdhLTY2NTItMjg0NS05ZDFiLTg3N2Q4Y2M3NDgyZSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmgbOSUAAAbCSURBVHja7J1bbBRVHMZPqV3RolRFbipWAWmwKhiC9UpLNFoN8ZKoWCOJindFXzRWKy1C8YZaVNDwoolIFBOjqInRmMYQKLRi6oNXKLSFFkUfRFDQ6uL3Zc6QYe0yu7M7Z86ZPV/yhdDu7uycX8/tf875T1FHR4fQVOPgKvgMeIL0CPgo+Bj4d/hf+Ce4H94Kd8JfwT+IAtQRGn2XIvgC+Cb4Krjc5/XHyX9PH+R3ffCn8Gr4c3igEGAWaVAzWcvuge+GTwvh83fBK+Dl8M44wxwS4bWPhpvgbviZkEBSI+EGeZ0W+EQLM7+aBX8LN8LHK7pmAn4Q7oLnwcUWZm4aBq+E18CnRtisL4XXwxMtzGCqhNlB36zJvU+HN8kBl4WZhWrhNrhCs/tnLV0FL5ajaQvTR7PhD2QTq6vq4TdM70fDhnmD7CNLDCiLOfK7FluY/9dM+E3DCoetyMsW5qGaBL8npwOmiQGM+y1MR4ydvg0PN7j7eR6eZmEK8SI8xfCBYUJ2EUcWMsxL4DtjMm3jNKrBpC+cz1UTjliXxWG+5tHDcsrSleb3o+GL4TPhMXAZ/Ae8G/4R3gB/DSdNg8lVj0oRL7GZXQjXeX5WLKdc9wpnyc6vdeuXU56XhLM0F5rytQTGPmYbPFbET0k5Ot8iu5FX4ckBPucv+FnhRJv269xn3hJTkG4ZPQQ/CbcGBOnW8ieEE9Ycr3Mze7uIt+7L42dxpL8OvlI4W1y0qpnctlElrLLRKPgT4exr0grmjRqNYLmpi2FEbgZ7TnOg3PHwkXBWbrSBeakmhcMBWI3s17bDj8CPaw6UA6slusBMaNLEEmQ13Jvy88UGTPznwufqAHOqcDZmRaluWSN70/y+WXOgZFCvA8yzNADJGtnj87pmOS3QVVcLZ4N3pDAnaFAjezJ8/SJ4vqYwS+RUJVKYYyK6+R4JsjvL9y3UGOiFUcMsiwhkdQCQXqCNGsKsiBpmqSE1MlUMzTVpBnN01DBVLt72SpDb8vR5CzQDOjRqmAMKQVbnEaQX6AJNYCajhrnXwBqZqiZNgP6c6wcEXTVJyMjFeSHf4HYJcmvI1yHQoohHut9FAZMHYVsUzDFVgXTVKIFGFVzYoBImt05yj4+Kgz87JMguxQXq1kzVQP+B31cFs1JebLwikNURgPQCZQ1VGc/9OB99ZiYDIC5xtSkEWRMhSOGpmc2KrnVAOKs7ImyY7B+5gDpMIcgtmkwVGvJVyD7ijoP2sGFynXK1osAAQc7UCKQrLm4/FfI1auVgj7v+zg8DJrdd8Ki6irXKPglys9BTjykAerJw9h3zaD5zGdUFiQEM9gYux7wr1GTl6JNNq64gvUCfVnStc+C34C/hi3KFyaZluoIvvVvzGpmqejm/ViXu4vhCOGl1EkFgVsi/QhV6TTjnMUwSgarM9kU+3JjGbGMjsoXZItQdWTfxuPlQEU3upBnwWuFzasAbNGD7fLnCL3iHcHZ0t8u5VjZigH9XDoGScQHeVybnnlH9EbLVbJWcfvGDqXoHG8ODqwK+l+8LGlYcq0FQIqiY4fNDOWjcl66ZZdD8MmFlgrhS9cLh+sw5ItqkiFbZiXPSa9LBvN6Wj3F6RaScUyHMcqFfGjQrf50EP5oKc4YtF2P1AHyCF+ZUWybGis3srV6Yk22ZGK25Xpin2PIwWpPcMQ9hjrLlYbyucGGW2rIwXlUuzIQtC+N1tgvzb1sWxqvchfmbLQvjxbSwxxJmvy2LWKiUMDfbcoiFhliY8dFewlxvy8F48dGTewhznfyPlbniuCfpjmbbbXkYre/dqQn1TiENFGJ4T23eG+MO6n0GfXkGloNm0pwSQ5jcLH1wd96v8OvCyTtugpg4cKX8I8wmgsXHPC6KGUiyW+uFSTF/OPeylhhyE3Xi0ET4hSqeCxpI7T+YMKnFlo1R4ubxZekGA8xctcOWkTHioyy/SQeT2/5vs/NOI8RHa9T7DdM/E2qOf1vlpiXu/NJvzsWMVWtseWmrjbJLzGgCzWaWD9ZuteWmnXgCbPZgU7LDRUP+hK91J6RWWmgPPEukSdHqF9riUfVa2+RqBXJjuhdkEqdkmO864WRQTtoyjaxprfFrJTMNOrMPnS9r6U5btkrFUB3Dl5v8XpjtCgITJfA4w3LhJO+zCk9sEXmanRlZMgrkBFkO4vonn1rHbfEr5OTVKn9iJeHzrvm03OZsKk0ua3vMA3uXcJI9zJMd8wHLIrBY+5jzh3kLeJI968zX+XqyrauRwnn66zR4onAyYfIsC/d1Dre8DrZs+2Vl4Ga6Tjmw6cy1MvwnwADJWi5TnuWVTAAAAABJRU5ErkJggg==")',
    borderColor: isBold ? borderColor : 'transparent',
  },
  'quick-order-pad__upload-drop-before': {
    display: 'block',
    content: '',
    width: '100%',
    paddingTop: '68%',
  },
  'quick-order-pad__upload-drop-span': {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40px',
  },
  'quick-order-pad__upload-title': {
    fontSize: '20px',
    fontWeight: '700',
    marginTop: '10px',
    marginBottom: '10px',
  },
  'quick-order-pad__wrap': {
    width: '40%',
  },
  'quick-order-pad__wrap--m': {
    width: '100%',
  },
  'quick-order-pad__right': {
    width: '58%',
    borderLeft: '1px solid #666666',
  },
  'quick-order-pad__right--m': {
    width: '100%',
    borderLeft: 'none',
  },
  'quick-order-pad__card': {
    maxWidth: '620px',
    margin: '0 auto',
    padding: '10px 25px',
  },
  'quick-order-pad__card-error-info': {
    display: 'none',
    position: 'absolute',
    top: '8px',
    right: '5px',
    color: '#900',
  },
  'user-manage__form-actions': {
    textAlign: 'left',
  },
  'user-manage__cancel-btn': {
    position: 'relative',
    height: '100%',
    marginLeft: '2rem',
    padding: '.85714rem 2.28571rem',
    fontSize: '1rem',
    top: 0,
  },
  'user-manage__col-actions': {
    paddingRight: '83px',
    textAlign: 'right',
  },
  'user-manage__actions-split': {
    display: 'inline-block',
    margin: '0 8px',
    marginTop: '1px',
    color: '#a6a6a6',
    fontSize: '12px',
    verticalAlign: 'top',
    height: '32px',
    lineHeight: '32px',
  },
  'shopping-list__column-wrap': {
    margin: '0 -10px',
  },
  'shopping-list__column-wrap-after': {
    display: 'block',
    content: '',
    clear: 'both',
    height: 0,
    visibility: 'hidden',
  },
  'shopping-list__column-wrap-left-right': {
    padding: '0 10px',
  },
  'shopping-list__column-wrap-grand-total': {
    fontSize: '18px',
    fontWeight: '700',
    display: 'block',
    textAlign: 'right',
  },
  'shopping-list__column-wrap-left--m': {
    float: 'left',
    width: '40%',
  },
  'shopping-list__column-wrap-right--m': {
    float: 'right',
    width: '60%',
  },
  'shopping-list__rename': {
    fontSize: '14px',
    fontStyle: 'italic',
    marginTop: '-70px',
    lineHeight: '53px',

  },
  'shopping-list__form-wrap': {
    marginBottom: '20px',
    overflow: 'hidden',
    padding: '20px 24px 5px',
    border: '1px solid #a0a0a0',
  },
  'shopping-list__form-wrap-form-label': {
    fontWeight: 700,
  },
  'shopping-list__form-wrap-form-label-mb': {
    marginBottom: '10px',
  },
  'shopping-list__form-field': {
    width: '100%',
    float: 'left',
  },
  'shopping-list__form-wrap-form-field-last': {
    marginBottom: 0,
  },
  'shopping-list__form-wrap-form-field-large': {
    float: 'left',
    width: 'calc(100% - 70px)',
  },
  'shopping-list__form-wrap-form-field-larger': {
    float: 'left',
    width: 'calc(100% - 52px)',
  },
  'shopping-list__form-wrap-form-field-small': {
    float: 'left',
    width: '60px',
    marginLeft: '10px',
  },
  'shopping-list__form-wrap-form-field-smaller': {
    float: 'left',
    width: '42px',
    marginLeft: '10px',
  },
  'shopping-list__form-wrap-form-field-split': {
    float: 'left',
    marginBottom: '1.25rem',
  },
  'shopping-list__form-wrap-btn-search': {
    paddingLeft: 0,
    paddingRight: 0,
    height: '42px',
    width: '100%',
    fontSize: '16px',
    textAlign: 'center',
  },
  'shoppinglist__action-btn': {
    cursor: 'pointer',
    width: '20px',
  },
  'shopping-list__form-wrap-input-desc': {
    marginTop: '8px',
  },
  'shopping-list__detail-container': {
    lineHeight: '1.8',
    marginBottom: '1.5rem',
  },
  'shopping-list__detail-container-select': {
    width: '160px',
  },
  'shopping-list__mobile-td-lable': {
    display: 'block',
    marginRight: 0,
    backgroundColor: 'transparent',
  },
  'shopping-list__label-unviable': {
    display: 'block',
    color: '#cc4749',
    textTransform: 'uppercase',
    fontWeight: '400',
    fontStyle: 'normal',
    marginTop: '5px',
  },
  'shopping-list__thead-th': {
    fontWeight: '400',
    paddingTop: '18px',
    paddingBottom: '18px',
    verticalAlign: 'middle',
    lineHeight: '16px',
  },
  'shopping-list__thead-th-checkbox': {
    position: 'relative',
    width: '40px',
  },
  'shopping-list__thead-th-input': {
    width: '16px',
    height: '16px',
  },
  'shopping-list__thead-th-product': {
    paddingLeft: '100px',
  },
  'shopping-list__thead-th-btn-remove-all': {
    position: 'absolute',
    left: '40px',
    whiteSpace: 'nowrap',
    width: '130px',
  },
  '': {
    display: 'table-row',
    fontSize: 0,
  },
  '--hover': {
    backgroundColor: isBold ? 'none' : '#ebebeb',
  },
  '-actions--hover': {
    opacity: 1,
  },
  '-catalog': {
    backgroundColor: '#eee',
    opacity: '0.6',
  },
  '-catalog--hover': {
    backgroundColor: '#eee',
  },
  '-catalog-actions--hover': {
    opacity: 0,
  },
  'shopping-list__tbody-td': {
    fontSize: '1rem',
    paddingTop: '20px',
  },
  'shopping-list__tbody-td-checkbox': {
    display: 'table-cell',
    paddingTop: '43px',
  },
  'shopping-list__tbody-td-checkbox-input': {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  'shopping-list__tbody-product-item': {
    display: 'inline-block',
    width: '33.33%',
    verticalAlign: 'top',
  },
  'shopping-list__tbody-product-item--s': {
    display: 'table-cell',
    width: 'auto',
  },
  'shopping-list__tbody-product-image-container': {
    position: 'relative',
    width: '65px',
    height: '65px',
    display: 'inline-block',
    marginRight: '25px',
    verticalAlign: 'top',
    backgroundColor: '#fff',
  },
  'shopping-list__tbody-product-img': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    maxWidth: '65px',
    maxHeight: '65px',
  },
  'shopping-list__tbody-product-description': {
    display: 'inline-block',
    verticalAlign: 'top',
    fontSize: '14px',
    width: 'calc(100% - 90px)',
  },
  'shopping-list__tbody-product-title': {
    fontSize: '14px',
    lineHeight: '1.2',
    marginBottom: '5px',
  },
  'shopping-list__tbody-product-title--s': {
    lineHeight: '1.5',
    marginBottom: '25px',
  },
  'shopping-list__tbody-product-attr': {
    fontSize: '12px',
    color: 'inherit',
  },
  'shopping-list__tbody-text-input': {
    textAlign: 'center',
    width: '54px',
    height: '32px',
    lineHeight: '32px',
    display: 'inline-block',
  },
  'shopping-list__col-actions-container': {
    position: 'relative',
    paddingBottom: '95px',
  },
  'shopping-list__tbody-td-col-actions': {
    position: 'absolute',
    bottom: '-3px',
    right: '5px',
    width: '172px',
    textAlign: 'left',
    fontSize: 0,
  },
  'shopping-list__tbody-td-col-actions--m': {
    opacity: 0,
    bottom: '6px',
  },
  'shopping-list__tbody-td-btn': {
    marginBottom: '5px',
    marginRight: '5px',
  },
  'shopping-list__tbody-td-btn-next': {
    marginLeft: 0,
  },
  'shopping-list__tbody-td-action-icon': {
    display: 'inline-block',
    cursor: 'pointer',
    color: '#8f8f8f',
    fontSize: '16px',
    textDecoration: 'none',
  },
  'shopping-list__tbody-td-action-icon--hover': {
    color: '#333',
  },
  'shopping-list__tbody-td-action-icon-next': {
    marginLeft: '30px',
  },
  'shopping-list__bottom-cart-container': {
    position: 'fixed',
    bottom: '-114px',
    left: 0,
    width: '100%',
    zIndex: '1',
    backgroundColor: '#ebebeb',
    transition: 'bottom .2s ease',
    color: isBold ? '#3d3c42' : 'inherit',
  },
  'shopping-list__bottom-cart-inner': {
    position: 'relative',
    padding: '35px 0',
  },
  'shopping-list__bottom-cart-toggle-btn': {
    position: 'absolute',
    top: '-44px',
    left: 0,
    height: '44px',
    lineHeight: '44px',
    padding: '0 15px',
    fontWeight: '700',
    color: '#3d3c42',
    textDecoration: 'none',
    textTransform: 'uppercase',
    backgroundColor: '#ebebeb',
  },
  'shopping-list__bottom-cart-toggle-btn--m': {
    padding: '0 35px',
  },
  'shopping-list__bottom-cart-toggle-btn-icon': {
    fontSize: '16px',
  },
  'shopping-list__bottom-cart-update-btn': {
    position: 'absolute',
    top: '-44px',
    right: 0,
    height: '44px',
    lineHeight: '44px',
    padding: '0 45px',
    fontWeight: '700',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#006bb4',
    borderColor: '#006bb4',
    color: isBold ? '#fff' : '',
  },
  'shopping-list__bottom-cart-info': {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    textAlign: 'right',
    lineHeight: '44px',
  },
  'shopping-list__bottom-cart-info-text': {
    fontWeight: '700',
    display: 'inline-block',
  },
  'shopping-list__bottom-cart-info-btn': {
    marginBottom: 0,
    fontWeight: '700',
    paddingLeft: '22px',
    paddingRight: '22px',
    color: '#fff',
  },
  'shopping-list__bottom-cart-info-a': {
    textDecoration: 'none',
    color: '#3d3c42',
  },
  'shopping-list__upload-container': {
    position: 'relative',
    display: 'inline-block',
    marginRight: '50px',
    width: '120px',
  },
  'shopping-list__upload-mockup': {
    width: '100%',
    cursor: 'pointer',
    paddingLeft: '10px',
    paddingRight: '10px',
    textAlign: 'center',
    marginBottom: 0,
  },
  'shopping-list__upload-btn': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
  'shopping-list__upload-input-description': {
    display: 'inline-block',
    marginTop: '-10px',
  },
  'shopping-list__upload-': {},
  'shopping-lists__table-td-first--s': {
    width: '28%',
  },
  'shopping-lists__table-td-not-first--s': {
    paddingLeft: '3%',
  },
  'shopping-lists__table-td-not-last--s': {
    paddingRight: '3%',
  },
  'shopping-lists__table-tr-name': {
    maxWidth: '100px',
    overflow: 'hidden',
  },
  'shopping-lists__table-tr-description': {
    maxWidth: '100px',
    overflow: 'hidden',
  },
  'address-book__list-container': {
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    marginLeft: 0,
    marginRight: 0,
  },
  'address-book__list-default-address': {
    width: '100%',
    padding: 0,
  },
  'address-book__list-address-title': {
    fontWeight: 700,
  },
  'address-book__list-pannel': {
    minHeight: '200px',
    padding: '1.5rem',
  },
  'address-book__search-container': {
    verticalAlign: 'top',
    display: 'inline-block',
    position: 'relative',
    width: '15rem',
    marginRight: '40px',
  },
  'address-book__search-input-text': {
    paddingLeft: '8px',
    height: '30px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px 0 0 4px',
  },
  'address-book__search-btn': {
    margin: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
    right: '-35px',
    top: 0,
    border: '1px solid #ccc',
    borderRadius: '0 4px 4px 0',
    borderLeft: 'none',
  },
  'address-book__search-clear': {
    right: '0px',
    top: 0,
    border: 'none',
  },
  'address-book__filter-box': {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  'address-book__filter-item': {
    marginLeft: '-10px',
    marginRight: '-10px',
    width: '20%',
    padding: '5px 10px',
  },
  'address-book__filter-item-shape': {
    width: '40%',
  },
  'address-book__filter-checkbox-label': {
    display: 'inline-block',
    marginLeft: '5px',
    marginRight: '20px',
  },
  'address-book__filter-btn-box': {
    width: '100%',
    textAlign: 'right',
    padding: '7px 0',
    margin: 0,
  },
  'address-book__filter-type-content': {
    padding: '5px',
  },
  'address-book__filter-select': {
    height: '33px',
    width: '100%',
    padding: '0 0.75rem',
    backgroundPosition: 'right 0.57143rem top 0.31429rem',
  },
  'address-book__filter-label': {
    display: 'block',
  },
  'address-book__table-td': {
    verticalAlign: 'middle',
  },
  'address-book__table-td-i': {
    cursor: 'pointer',
  },
  'address-book__table-th-sort': {
    minWidth: '130px',
    cursor: 'pointer',
  },
  'address-book__table-td-overflow': {
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  'address-book__table-thumbnail': {
    maxWidth: '70px',
  },
  'address-book__table-action-fields': {
    width: '100px',
  },
  'address-book__table-action-fields-btn': {
    marginBottom: 0,
    border: 'none',
  },
  'address-book__table-dropdown-container': {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'top',
    left: 0,
  },
  'address-book__table-dropdown-menu': {
    left: 0,
    width: '210px',
    maxWidth: '210px',
  },
  'address-book__table-dropdown-btn': {
    paddingLeft: '10px',
    paddingRight: '10px',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  'address-book__status-label': {
    fontWeight: '700',
    maxWidth: '105px',
    textAlign: 'center',
    marginBottom: 0,
  },
  'orders__table-thead-th': {
    padding: '11px 10px',
  },
  'order__info-btn': {
    marginRight: '5px',
    marginLeft: 0,
  },
  'order__info-btn-next': {
    marginLeft: 0,
    display: 'block',
  },
}

const styles = merge({}, basicClass, useClasses)

export default {
  b2bWrap: {
    '& .quote__count': styles.quote__count,
    '& .filter-by-date': {
      ...styles['g__date-filter-container'],
      '& #orderFromDate,& #orderToDate': {
        ...styles['g__date-filter-container-input'],
        '@media (min-width: 801px)': {
          ...styles['g__date-filter-container-input--m'],
        },
      },
      '& .fa-calendar': {
        color: '#ccc',
        '&.from, &.to': {
          position: 'absolute',
          left: '66px',
          top: '10px',
        },
        '&.to': {
          left: '260px',
        },
        '@media (max-width: 801px)': {
          display: 'none',
        },
      },
    },
    '& #product_search_results .search-product-table': {
      width: '100%',
    },
    '.err-tips': styles['g__err-tips'],
    '& .select_email_container .modal_close': styles['quote__select-email-container-modal-close'],
    '& .select_email_container': styles['quote__select-email-container'],
    '& .quote-email-container .quote-input span': styles['quote__send-email-container-input-label'],
    '& .quote-email-container .quote-tips': styles['quote__send-email-container-tips'],
    '& .quote-email-container .quote-actions-btn': styles['quote__send-email-container-actions-btn'],
    '& .email_select_btn': styles['quote__send-email-container-select-btn'],
    '& [disabled]': styles['g__[disabled]'],
    '& .quote-list-table': {
      marginTop: '20px',
    },
    '& .quote-list-table>thead>tr>th.t-align-c': {
      width: '150px',
      textAlign: 'center',
    },
    '& .quote-list-table thead>tr>th': {
      textAlign: 'left',
    },
    '& #product_list_table .product-item-price': {
      width: '100px',
      '@media (max-width: 500px)': {
        width: 'auto',
      },
    },
    '& .b2b-hide': {
      display: 'none',
    },
    '& .draft-container': {
      ...styles['g__draft-container'],
      '& h3': styles['g__draft-container-h3'],
    },
    '& .product-item-td.product-item-img img': styles['quote__td-img'],
    '& .quote-detail .quote-info': styles.quote__info,
    '& .quote-detail .quote-info .addresses': styles['g__float-left'],
    '& .quote-detail .quote-info .float-right': {
      ...styles['g__float-right'],
      '@media (max-width: 500px)': {
        float: 'left',
      },
    },
    '& .quote-detail-actions': styles['quote__actions-container'],
    '& [data-row]': styles['g__[data-row]'],
    '& [data-row][data-row-end]': styles['g__[data-row-end]'],
    '& .quote-item-title': styles['quote__info-title'],
    '& .quote-item': styles.quote__item,
    '& .csv-check-info': styles['g__csv-check-info'],
    '& td.col-checkbox': {
      ...styles['g__col-checkbox'],
      '& input': styles['g__col-checkbox-input'],
      '& .col-product-info': styles['g__col-product-info'],
    },
    '& .additional_infor': styles['g__additional-info'],
    '& .quote-box': styles['create-quote__quote-box'],
    '& .quote-box .form-field': styles['create-quote__quote-box-form-field'],
    '& .quote-search': styles['create-quote__search-box'],
    '& #search_single_sku': styles['g__product-search-btn'],
    '& .create-quote-actions a': styles['create-quote__action-item'],
    '& .quote-title': styles['create-quote__page-title'],
    '& .b2b-head-flex': styles['g__head-prfix'],
    '& table>thead>tr>th': styles['g__table-thead-th-td'],
    '& .clearfix': {
      '&:before, &:after': styles['g__clearfix-before-after'],
    },
    '& .float-left': styles['g__float-left'],
    '& .float-right': styles['g__float-right'],
    '& .button--small': {
      ...styles['g__button-small'],
      '&.square': styles['g__button-square'],
      '@media (max-width: 500px)': {
        marginRight: '1rem',
      },
    },
    '& .b2b-column-wrap': {
      ...styles['shopping-list__column-wrap'],
      '&:after': styles['shopping-list__column-wrap-after'],
      '& .b2b-column-left': {
        ...styles['shopping-list__column-wrap-left-right'],
        '@media (min-width: 801px)': styles['shopping-list__column-wrap-left--m'],
      },
      '& .b2b-column-right': {
        ...styles['shopping-list__column-wrap-left-right'],
        '& .grand-total': styles['shopping-list__column-wrap-grand-total'],
        '@media (min-width: 801px)': styles['shopping-list__column-wrap-right--m'],
      },
    },
    '& button.action': {
      '&:hover': styles['g__button-action--hover'],
    },
    '& .form-label': styles['g__form-label'],
    '& .form-label small': styles['g__form-label-small'],
    '& .form-action': {
      ...styles['g__form-action'],
      '&.right': styles['g__form-action-right'],
    },
    '& .title-wrap': {
      ...styles['g__title-wrap'],
      '@media (max-width: 500px)': {
        marginBottom: 0,
        '& .title-actions': {
          marginBottom: '0!important',
        },
      },
      '& .page-title': {
        ...styles['g__title-wrap-title'],
        '@media (min-width: 551px)': {
          ...styles['g__title-wrap-title--s'],
        },
      },
      '& .page-title-small': styles['g__title-wrap-title-small'],
      '& .page-title-desc': styles['g__title-wrap-title-desc'],
      '& .title-actions': {
        ...styles['g__title-wrap-title-actions'],
        '@media (min-width: 551px)': styles['g__title-wrap-title-actions--s'],
      },
      '& .rename-shopping-list': styles['shopping-list__rename'],
    },
    '& .actions-split': styles['user-manage__actions-split'],
    '& .action-link': {
      ...styles['g__action-link'],
      '&:hover': styles['g__action-link--hover'],
    },
    '& .action': {
      ...styles.g__action,
      '&.fright': styles['g__action-fright'],
    },
    '& .form-wrap': {
      ...styles['shopping-list__form-wrap'],
      '& .form-label': styles['shopping-list__form-wrap-form-label'],
      '& .form-label--mb': styles['shopping-list__form-wrap-form-label-mb'],
      '& .form-field': {
        ...styles['shopping-list__form-field'],
        '&:last-child': styles['shopping-list__form-wrap-form-field-last'],
        '&.large': styles['shopping-list__form-wrap-form-field-large'],
        '&.larger': styles['shopping-list__form-wrap-form-field-larger'],
        '&.small': styles['shopping-list__form-wrap-form-field-small'],
        '&.smaller': styles['shopping-list__form-wrap-form-field-smaller'],
        '&.form-field--split': styles['shopping-list__form-wrap-form-field-split'],
      },
      '& .button--search': styles['shopping-list__form-wrap-btn-search'],
      '& .form-input-desc': styles['shopping-list__form-wrap-input-desc'],
    },
    '& table': styles.g__table,
    '& table>thead': {
      '@media (min-width: 551px)': styles['g__table-thead--s'],
    },
    '& table>tbody>tr': {
      ...styles['g__table-tbody-tr'],
      '@media (max-width: 500px)': styles['g__table-tbody-tr--s'],
      '& .dropdown-menu': styles['g__table-tbody-tr-dropdown'],
    },
    '& table>thead>tr>th,& table>tbody>tr>td': {
      ...styles['g__table-thead-th-td'],
      '@media (min-width: 551px)': {
        ...styles['g__table-thead-th-td--s'],
        '&.t-align-r': styles['g__text-right'],
        '&.t-align-c': styles['g__text-center'],
      },
      '&.actions-field': {
        '& a': {
          ...styles['g__action-link'],
          '&:hover': styles['g__action-link--hover'],
        },
        '& .button-item': styles['g__action-link-btn'],
      },
    },
    '& table>tbody>tr>td': {
      '& .cell-line-name': styles['g__font-title'],
      '& .mobile-td-lable': styles['g__table-td-label'],
      '@media (min-width: 551px)': {
        ...styles['g__table-td--s'],
        '& .mobile-td-lable': {
          display: 'none',
        },
      },
    },
    '& .table-toolbar': {
      ...styles['g__table-toolbar'],
      '&.top': styles['g__table-toolbar-top'],
      '& .number-items': {
        ...styles['g__float-left'],
        '&+.action-links': {
          ...styles['g__float-right'],
          '& .action-link,& .action-label': {
            ...styles['g__margin-right-0'],
          },
          '& .action-link+.action-link,& .action-link+.action-label': {
            ...styles['g__margin-left-25'],
          },
          '& .action-label + .action-link': {
            ...styles['g__margin-left-25'],
          },
        },
      },
      '& .action-links': {
        '& .action-link,& .action-label': styles['g__margin-right-5'],
        '& .action-link': {
          '& +.action-link': styles['g__margin-left-0'],
        },
        '& .action-label': {
          cursor: 'pointer',
        },
      },
      '& .fright': styles['g__float-right'],
    },
    '& .user-management-table': {
      '&.table-active-user': {
        '& tbody tr[data-status=inactive]': {
          display: 'none',
        },
      },
      '&.table-inactive-user': {
        '& tbody tr[data-status=active]': {
          display: 'none',
        },
      },
      '& .col-actions': styles['user-manage__col-actions'],
    },
    '& .shopping-list-detail': styles['shopping-list__detail-container'],
    '& .shopping-list-status': {
      '& select': styles['shopping-list__detail-container-select'],
    },
    '& .shopping-lists-table': {
      '@media (min-width: 551px)': {
        '& >thead>tr>th,& >tbody>tr>td': {
          '&:first-child': styles['shopping-lists__table-td-first--s'],
          '&:not(:first-child)': styles['shopping-lists__table-td-not-first--s'],
          '&:not(:last-child)': styles['shopping-lists__table-td-not-last--s'],
        },
      },
      '&[css-status="40"]': {
        '& tbody tr[data-status="30"],& tbody tr[data-status="0"]': {
          display: 'none',
        },
      },
      '&[css-status="30"]': {
        '& tbody tr[data-status="40"],& tbody tr[data-status="0"]': {
          display: 'none',
        },
      },
      '&[css-status="0"]': {
        '& tbody tr[data-status="30"],& tbody tr[data-status="40"]': {
          display: 'none',
        },
      },
    },
    '& #shopping_list_table': {
      '& tbody>tr': {
        '@media (max-width: 500px)': {
          display: 'initial',
        },
      },
      '& .mobile-td-lable': {
        ...styles['shopping-list__mobile-td-lable'],
        '@media (min-width: 801px)': {
          display: 'none',
        },
      },
      '& .t-align-r': styles['g__text-right'],
      '& .label-unviable': styles['shopping-list__label-unviable'],
      '& >thead>tr>th': {
        ...styles['shopping-list__thead-th'],
        '&.th-checkbox': {
          ...styles['shopping-list__thead-th-checkbox'],
          '& input': styles['shopping-list__thead-th-input'],
        },
        '&.th-product-item': styles['shopping-list__thead-th-product'],
        '& .button--removeall': styles['shopping-list__thead-th-btn-remove-all'],
        '& .button': {
          ...styles['g__margin-bottom-0'],
        },
      },
      '& >tbody>tr': {
        ...styles[''],
        '&:hover': {
          ...styles['--hover'],
          '& .action-lists': styles['-actions--hover'],
        },
        '&[data-in-catalog="false"]': {
          ...styles['-catalog'],
          '&:hover': {
            ...styles['-catalog--hover'],
            '& .action-lists': styles['-catalog-actions--hover'],
          },
        },
      },
      '& >tbody>tr>td': {
        ...styles['shopping-list__tbody-td'],
      },
      '& td.col-checkbox': {
        ...styles['shopping-list__tbody-td-checkbox'],
        '& input': styles['shopping-list__tbody-td-checkbox-input'],
      },
      '& td.col-product-info': {
        ...styles['g__col-product-info'],
        '@media (min-width: 551px)': styles['g__col-product-info--s'],
      },
      '& td.col-product-price,& td.col-product-qty, & td.col-action': {
        ...styles['shopping-list__tbody-product-item'],
        '@media (min-width: 551px)': styles['shopping-list__tbody-product-item--s'],
      },
      '& .col-product-qty': {
        '& input': {
          ...styles.g__border,
        },
      },
      '& .product-iamge': {
        ...styles['shopping-list__tbody-product-image-container'],
        '& img': styles['shopping-list__tbody-product-img'],
      },
      '& .product-description': {
        ...styles['shopping-list__tbody-product-description'],
      },
      '& .product-title': {
        ...styles['shopping-list__tbody-product-title'],
        '@media (min-width: 551px)': styles['shopping-list__tbody-product-title--s'],
        '& a': {
          ...styles['g__action-link'],
          '&:hover': styles['g__action-link'],
        },
      },
      '& .product-attribute': {
        ...styles['shopping-list__tbody-product-attr'],
        '& span': styles['g__fontweight-700'],
      },
      '& .product-options': {
        ...styles['g__color-333'],
        '& span': styles['g__fontweight-700'],
      },
      '& .product-sku': {
        marginBottom: '2px',
      },
      '& .product-price,& .product-subtotal': {
        ...styles['g__fontweight-700'],
        ...styles['g__font-title'],
      },
      '& .input-text': styles['shopping-list__tbody-text-input'],
      '& .col-action': {
        ...styles['shopping-list__col-actions-container'],
        '& .action-lists': {
          ...styles['shopping-list__tbody-td-col-actions'],
          '@media (min-width: 801px)': styles['shopping-list__tbody-td-col-actions--m'],
          '& .button': {
            ...styles['shopping-list__tbody-td-btn'],
            '&+.button': styles['shopping-list__tbody-td-btn-next'],
          },
          '& .action-icon': {
            ...styles['shopping-list__tbody-td-action-icon'],
            '&:hover': {
              ...styles['shopping-list__tbody-td-action-icon--hover'],
            },
            '&+.action-icon': styles['shopping-list__tbody-td-action-icon-next'],
          },
        },
      },
      '& .no-option-value-tip': {
        ...styles['g__tip-color'],
      },
      '@media (max-width: 500px)': {
        '& thead': {
          display: 'none',
        },
        '& tr': {
          border: 'none',
        },
        '& .action-lists': {
          display: 'flex',
          alignItems: 'flex-end',
          width: 'auto!important',
          '& a.data-delete-item': {
            width: 30,
            height: 30,
          },
        },
        '& [data-row]': {
          display: 'initial',
        },
      },

    },
    '& .search-product-table': {
      ...styles['g__search-product-table'],
      '@media (max-width: 800px)': styles['g__search-product-table--m'],
      '& tbody >tr': {
        position: 'relative',
      },
      '& tbody >tr>td': styles['g__search-product-table-tbody-td'],
      '& .col-checkbox': {
        '& input': {
          ...styles['g__search-product-table-checkbox'],
        },
      },
      '& .col-product-figure,& .col-product-info': {
        display: 'table-cell',
      },
      '& .col-product-figure': {
        ...styles['g__search-product-table-product-figure'],
        '@media (min-width: 551px)': {
          ...styles['g__search-product-table-product-figure--s'],
        },
      },
      '& .col-product-price': {
        ...styles['g__search-product-table-product-price'],
        '@media (min-width: 551px)': {
          ...styles['g__search-product-table-product-price--s'],
        },
      },
      '& .product-price': styles['g__fontweight-700'],
      '& .product-qty-col': {
        ...styles['g__search-product-table-qty'],
        '@media (min-width: 551px)': {
          ...styles['g__search-product-table-qty--s'],
        },
        '& input': {
          ...styles['g__search-product-table-qty-input'],
        },
      },
      '& .option-form': {
        ...styles['g__search-product-table-option-container'],
        '& .form-label': {
          ...styles['g__search-product-table-option-label'],
        },
        '& .form-field': {
          ...styles['g__search-product-table-option-field'],
        },
      },
    },
    '& .order-lists-table > thead > tr > th': styles['orders__table-thead-th'],
    '& .quote_adress_container': styles['quote__address-container'],
    '& .quote_select_address': {
      ...styles['quote__select-address'],
      '&:after': {
        ...styles['quote__select-address-after'],
      },
    },
    '& .sort-thead': {
      '@media (max-width: 551px)': {
        display: 'block',
        '& tr': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        },
        '& th': {
          flex: 1,
          fontWeight: 'normal',
          border: '1px solid #ccc',
          textAlign: 'center',
          borderRadius: 3,
          margin: 3,
          fontSize: '0.8rem',
        },
        '& th:not([data-sort-th])': {
          display: 'none',
        },
      },
    },
    '@media (max-width: 500px)': {
      '& #quote_total .cart-total': {
        display: 'flex',
        justifyContent: 'flex-end',
      },
      '& .b2b-head-flex': {
        flexFlow: 'column',
        alignItems: 'flex-start',
        '& .create-quote-actions, & .quote-detail-actions': {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          width: '100%',
        },
      },
      '& .product-item-td,& .product-item-quantity': {
        display: 'flex',
        '& img': {
          width: 'auto',
        },
        '&::before': {
          minWidth: '78px',
        },
      },
      '& .product-item-tr td:last-child': {
        display: 'flex',
        justifyContent: 'flex-end',
        '& .fa': {
          fontSize: '1.2rem',
        },
      },
      '& .product-item-tr td:nth-last-child(4)': {
        '& label': {
          position: 'relative',
          left: -8,
        },
      },
    },
    '& .upload-container': {
      ...styles['shopping-list__upload-container'],
      '& .uploadFile-mockup': {
        ...styles['shopping-list__upload-mockup'],
      },
      '& .action-upload': styles['shopping-list__upload-btn'],
      '&+.form-input-desc': styles['shopping-list__upload-input-description'],
    },
  },
  Dashboard: {
    ...styles.dashboard__wrap,
    '& .b2b-wrap': {
      '& .sale-info-wrap': {
        ...styles['dashboard__info-wrap'],
        '& .sale-rep-user-info': {
          ...styles['dashboard__info-wrap-user-info'],
          '@media (min-width: 801px)': {
            ...styles['dashboard__info-wrap-user-info--m'],
          },
          '& p': {
            ...styles['g__margin-bottom-0'],
          },
          '& .sale-user-name': {
            ...styles['dashboard__info-wrap-user-name'],
          },
          '& .user-label': {
            ...styles['dashboard__info-user-label'],
          },
        },
        '& .sale-reo-list-record': {
          ...styles['dashboard__info-list-record'],
          '@media (min-width: 801px)': {
            ...styles['dashboard__info-list-record--m'],
          },
        },
        '& .record-total': {
          ...styles['dashboard__info-record-total'],
        },
      },
    },
    '& tbody tr:nth-child(even)': {
      backgroundColor: isBold ? 'none' : '#ebebeb',
    },
    '& .t-align-c': styles['g__text-center'],
    '& .t-align-left': styles['g__text-left'],
    '& .filter-icon': {
      ...styles['dashboard__table-filter-icon'],
    },
    '& .asc .filter-icon': {
      ...styles['dashboard__asc-filter-icon'],
    },
    '& .pagination': {
      ...styles.dashboard__pagination,
      '@media (min-width: 801px)': {
        ...styles['dashboard__pagination--m'],
      },
    },
    '& .search': {
      ...styles['dashboard__search-container'],
      '@media (min-width: 801px)': {
        ...styles['dashboard__search-container--m'],
      },
    },
    '& .col-sale-actions': {
      ...styles['g__text-left'],
      '& .view-action': {
        ...styles['dashboard__view-action'],
      },
      '@media (min-width: 801px)': {
        ...styles['g__text-center'],
      },
    },
    '@media (min-width: 801px)': {
      '& table tr td': {
        '&:last-child': {
          ...styles['dashboard__td-last--m'],
        },
        '&:nth-child(1),&:nth-child(2)': {
          width: '24%',
        },
      },
    },
    '@media (max-width: 500px)': {
      '& .table-wrap': {
        overflow: 'auto',
        '& table>tbody>tr': {
          display: 'block',
        },
      },
    },
  },
  Login: {
    '&.salerep-infobox': {
      ...merge(styles.login__infobox, componentClasses['dashboard.head.container']),
      '& .container': {
        ...styles['login__infobox-container'],
        '& >span:nth-child(1)': {
          ...styles['login__infobox-company-name'],
        },
        '@media (min-width: 801px)': {
          ...styles['login__infobox-container--m'],
          '& >span:nth-child(1)': styles['login__infobox-company-name--m'],
        },
      },
      '@media (min-width: 801px)': {
        ...styles['login__infobox--m'],
        '&:before': {
          display: 'none!important',
        },
      },
      '&:before': {
        ...styles['login__infobox-before'],
      },
      '&.saler-extends': {
        ...styles['login__infobox-extends'],
        '& .container': {
          display: 'flex',
        },
        '&:before': {
          ...styles['login__infobox-extends-before'],
        },
      },
    },
  },
  BuyAgain: {
    '& .buy-again-search': {
      '@media (max-width: 800px)': styles['buy-again__search--s'],
      ...styles['buy-again__search'],
    },
    '& .buy-again-lists-table': {
      '& .options-wraper': {
        ...styles['buy-again__table-options-container'],
        '& p': styles['g__margin-bottom-0'],
      },
      '& .button--small': {
        ...styles['buy-again__table-btn-small'],
        '@media (max-width: 500px)': {
          margin: '10px 0',
        },
      },
      '& .qty-container': {
        ...styles['buy-again__table-qty-container'],
        '@media (max-width: 500px)': {
          justifyContent: 'start',
          alignItems: 'center',
          '& .qty-wraper': {
            marginTop: 0,
          },
        },
      },
      '& .qty-wraper': {
        ...styles['buy-again__table-qty-wrap'],
        '& .btn-qty-decrease, & .btn-qty-increase': {
          ...styles['buy-again__table-qty-btn'],
        },
        '& .form-input': styles['buy-again__table-qty-input'],
      },
      '@media (max-width: 500px)': {
        '& tr': {
          borderTop: '1px solid #ccc',
        },
      },
    },
    '& .table-wrap': {
      '@media (max-width: 800px)': {
        width: '100%',
      },
    },
  },
  quickOrderPad: {
    '&.quick-pad-container': {
      ...styles['quick-order-pad__container'],
      '& .result-message': {
        ...styles['quick-order-pad__result-message'],
      },
      '& .th-col-message': styles['g__tip-color'],
      '& .err-qty [data-qty], & .err-sku .col-sku [data-sku]': styles['g__tip-border-color'],
      '& .csv-check-info': {
        ...styles['quick-order-pad__csv-check-info'],
      },
      '& .error-info-line': {
        ...styles['quick-order-pad__error-info'],
        '& .fa': styles['quick-order-pad__error-info-icon'],
      },
      '& .csv-error-summary': {
        marginTop: '5px',
      },
      '& .add_to_cart_csv': {
        width: '100%',
      },
      '& .add_to_cart': {
        '@media screen and (max-width: 800px)': {
          float: 'none',
          right: '0',
        },
        ...styles['quick-order-pad__add-to-cart'],
      },
    },
    '& .quick-order-pad-table': {
      ...styles['quick-order-pad__table'],
      '& thead>tr>th': {
        ...styles['quick-order-pad__table-th'],
        '& &.th-col-quantity, &.th-col-price': {
          ...styles['g__text-center'],
        },
      },

      '& thead.has-line>tr>th': {
        ...styles['quick-order-pad__table-th-has-line'],
      },
      '& tbody>tr>td': {
        ...styles['quick-order-pad__table-td'],
      },
      '& .col-action-left': {
        ...styles['quick-order-pad__action-left'],
      },
      '& .col-sku': {
        ...styles['quick-order-pad__sku'],
        '@media screen and (max-width: 800px)': {
          ...styles['quick-order-pad__sku--m'],
        },
        '& input': {
          ...styles['quick-order-pad__sku-input'],
        },
      },

      '& .col-qty': {
        ...styles['quick-order-pad__qty'],
        '& input': {
          ...styles['g__text-center'],
        },
        '@media screen and (max-width: 800px)': {
          ...styles['quick-order-pad__qty--m'],
        },
      },

      '& .col-price': {
        ...styles['quick-order-pad__price'],
      },

      '& .remove-icon': {
        ...styles['quick-order-pad__remove-icon'],
      },
      '& input': {
        ...styles['quick-order-pad__input'],
        '& &:focus': {
          ...styles['quick-order-pad__input--focus'],
        },
      },
    },
    '& .file-upload-drop': {
      ...styles['quick-order-pad__upload-drop'],
      '&:before': styles['quick-order-pad__upload-drop-before'],
      '& span': {
        ...styles['quick-order-pad__upload-drop-span'],
      },
    },
    '& .file-upload-title': {
      ...styles['quick-order-pad__upload-title'],
    },
    '& .upload-container': {
      display: 'none!important',
    },
    '& .quick-order-pad-wrap': {
      ...styles['quick-order-pad__wrap'],
      '@media screen and (max-width: 800px)': {
        ...styles['quick-order-pad__wrap--m'],
      },
      '&.quick-pad-right': {
        ...styles['quick-order-pad__right'],
        '@media screen and (max-width: 800px)': {
          ...styles['quick-order-pad__right--m'],
        },
      },
    },
    '& .quick-order-pad': {
      ...styles['quick-order-pad__card'],
      '& .error-info': {
        ...styles['quick-order-pad__card-error-info'],
      },
    },
    '@media (max-width: 500px)': {
      '& .quick-order-pad tbody tr': {
        display: 'table-row',
      },
    },
  },
  UserManagement: {
    '& .form-actions': {
      ...styles['user-manage__form-actions'],
    },
    '& .b3cacel-btn': {
      ...styles['user-manage__cancel-btn'],
      '@media (max-width: 500px)': {
        marginLeft: '0.85rem',
      },
    },
    '& .title-wrap': componentClasses['userManagement.title.container'],
    '& .title-wrap .page-title': componentClasses['userManagement.title.text'],
    '& .table-wrap table': componentClasses['userManagement.table'],
    '& .table-wrap table .actions-split': {
      '@media (max-width: 500px)': {
        display: 'none',
      },
    },
    '& .table-wrap table .actions-field': {
      '@media (max-width: 500px)': {
        display: 'flex',
      },
    },
    '& .table-wrap thead th': componentClasses['userManagement.thead.th'],
    '& .table-wrap tbody td': {
      ...componentClasses['userManagement.tbody.td'],
      verticalAlign: 'middle',
    },
    '& .table-wrap tbody tr': componentClasses['userManagement.tbody.tr'],
  },
  ShoppingList: {
    '&.bottom-cart-container': {
      ...styles['shopping-list__bottom-cart-container'],
      '&.is-open': {
        bottom: '0px',
      },
      '.container': {
        '@media (max-width: 500px)': {
          padding: '0',
        },
      },
      '& .bottom-cart-inner': {
        '&>a,&>button': {
          '@media (max-width: 800px)': {
            fontSize: '12px',
          },
        },
        ...styles['shopping-list__bottom-cart-inner'],
      },
      '& .bottom-cart-toggle': {
        ...styles['shopping-list__bottom-cart-toggle-btn'],
        '@media (min-width: 801px)': {
          ...styles['shopping-list__bottom-cart-toggle-btn--m'],
        },
        '& .fa-chevron-down,& .fa-chevron-up': {
          ...styles['shopping-list__bottom-cart-toggle-btn-icon'],
        },
        '& .fa-chevron-down': {
          display: 'none',
        },
        '&.is-open': {
          '& .fa-chevron-down': {
            display: 'inline',
          },
          '& .fa-chevron-up': {
            display: 'none',
          },
        },
      },
      '& .bottom-cart-updatelist': {
        ...styles['shopping-list__bottom-cart-update-btn'],
      },
      '& .bottom-cart-content': {
        '& .cart-info': {
          ...styles['shopping-list__bottom-cart-info'],
          '& li': {
            ...styles['shopping-list__bottom-cart-info-text'],
            '& .button': {
              ...styles['shopping-list__bottom-cart-info-btn'],
            },
            '& a': styles['shopping-list__bottom-cart-info-a'],
          },
        },
      },
    },
    '& #shopping_lists_table tr': {
      '& .cell-line-name': styles['shopping-lists__table-tr-name'],
      '& .cell-line-description': styles['shopping-lists__table-tr-description'],
    },
    '& .table-wrap #shopping_item_remove': {
      bottom: 0,
    },
    '& .table-wrap table': componentClasses['shoppinglist.right.table'],
    '& .table-wrap table thead th': componentClasses['shoppinglist.right.thead.th'],
    '& .table-wrap table tbody tr': componentClasses['shoppinglist.right.tbody.tr'],
    '& .table-wrap table tbody td': componentClasses['shoppinglist.right.tbody.td'],
    '& .table-wrap table input[type=checkbox]': componentClasses['shoppinglist.right.checkbox'],
  },
  Quotes: {
    '& #create_new_quote_button': {
      ...styles['create-quote__add-btn'],
    },
    '& [quote-list-action]': styles['quote__action-btn'],
    '& .show-action': {
      display: 'block',
      left: 0,
    },
    '& .table-wrap': {
      '@media (max-width: 500px)': {
        overflowX: 'auto',
        '& tr': {
          borderTop: '1px solid #cccccc',
        },
      },
      '& .dropdown-menu': {
        '@media (max-width: 500px)': {
          display: 'flex',
          position: 'static',
          background: 'none',
          margin: 0,
          '& .button': {
            marginRight: '10px',
          },
        },
        '& a': {
          '@media (max-width: 500px)': {
            padding: '0',
          },
        },
        '@media (min-width: 501px)': {
          '& .button': {
            display: 'block',
            textAlign: 'center',
            border: 'none',
            fontSize: '13px!important',
          },
        },
      },
      '& [quote-list-action]': {
        '@media (max-width: 500px)': {
          display: 'none',
        },
      },
    },
    '& .pagination-list': {
      '@media (min-width: 768px)': {
        paddingTop: '10px',
      },
    },
  },
  AddressBook: {
    '& .address-lists-wrap': {
      '& .addressList': {
        '@media (max-width: 800px)': {
          flexWrap: 'wrap',
        },
        ...styles['address-book__list-container'],
        '& .address-default': {
          ...styles['address-book__list-default-address'],
          '@media (min-width: 801px)': {
            width: '50%',
          },
          '&+.address-default': {
            '@media (min-width: 801px)': {
              marginLeft: '30px',
            },
          },
          '& .address-title': {
            ...styles['address-book__list-address-title'],
          },
          '& .panel--address': {
            '& .panel-body': {
              ...styles['address-book__list-pannel'],
            },
          },
        },
      },
      '& .search-toolbar': {
        '& .search-input-box': {
          ...styles['address-book__search-container'],
          '& input[type="text"]': {
            ...styles['address-book__search-input-text'],
          },
          '& .button': {
            ...styles['address-book__search-btn'],
            '&.button-clear': {
              ...styles['address-book__search-clear'],
            },
          },
        },
        '& .button-float-right': styles['g__float-right'],
      },
      '& .filter-box': {
        ...styles['address-book__filter-box'],
        '& .filter-item': {
          ...styles['address-book__filter-item'],
          '@media (max-width: 500px)': {
            width: 'auto',
          },
          '&.address-type': {
            ...styles['address-book__filter-item-shape'],
            '& input[type="checkbox"]': {
              '& +label': styles['address-book__filter-checkbox-label'],
            },
          },
          '&.button-box': styles['address-book__filter-btn-box'],
          '& .address-type-content': styles['address-book__filter-type-content'],
          '& input[type="text"],& select': styles['address-book__filter-select'],
          '& label': styles['address-book__filter-label'],
        },
      },
      '& .address-lists-table': {
        '& tbody > tr > td': {
          ...styles['address-book__table-td'],
          '& i': styles['address-book__table-td-i'],
        },
        '& th[data-sort-th]': styles['address-book__table-th-sort'],
        '& td[data-width-overflow]': styles['address-book__table-td-overflow'],
        '& .col-thumbnail': styles['address-book__table-thumbnail'],
        '& .actions-field': {
          ...styles['address-book__table-action-fields'],
          '& .button': styles['address-book__table-action-fields-btn'],
          '& .dropdown-action-wrap': {
            ...styles['address-book__table-dropdown-container'],
            '& .dropdown-menu': {
              ...styles['address-book__table-dropdown-menu'],
              '@media (max-width: 500px)': {
                display: 'flex',
                position: 'static',
                background: 'none',
                flexWrap: 'wrap',
                margin: 0,
                width: '80vw',
                '& .button': {
                  marginRight: '10px',
                  border: '1px solid #ccc',
                  flex: 1,
                  textAlign: 'center',
                  marginBottom: '5px',
                },
              },
              '& a': {
                '@media (max-width: 500px)': {
                  padding: '0',
                },
              },
              '@media (min-width: 501px)': {
                '& .button': {
                  display: 'block',
                  textAlign: 'center',
                  border: 'none',
                  fontSize: '13px!important',
                },
              },
            },
            '& .td-action-dropdown': {
              '@media (max-width: 500px)': {
                display: 'none',
              },
            },
            '& .button': styles['address-book__table-dropdown-btn'],
          },
        },
      },
      '& .account-orderStatus-label': {
        ...styles['address-book__status-label'],
      },
      '& .hide': {
        display: 'none',
      },
    },
  },
  OrderDetail: {
    '&.b2b-order-details': {
      '& .order-details-info': {
        '& .button': {
          ...styles['order__info-btn'],
          '& +.button': {
            ...styles['order__info-btn-next'],
          },
        },
      },
    },
  },
  Orders: {
    '&.filter-box': {
      width: '100%',
      marginTop: '76px',
      display: 'flex',
      flexFlow: 'column',
    },
    '& .filter-items': {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    '& .filter-btn-items': {
      justifyContent: 'flex-end',
    },
    '&.table-wrap': {
      width: '100%',
    },
    '&.table-wrap table': componentClasses['orders.table'],
    '&.table-wrap thead th': componentClasses['orders.thead.th'],
    '&.table-wrap tbody td': componentClasses['orders.tbody.td'],
    '&.table-wrap tbody td .order-status-text': componentClasses['orders.td.status'],
    '&.table-wrap tbody td.actions-field': componentClasses['orders.td.action.container'],
    '&.table-wrap tbody td.actions-field .reorder-items': componentClasses['orders.td.action.button.reorder'],
    '&.table-wrap tbody td.actions-field .add-shopping-items': componentClasses['orders.td.action.button.addToShoppingList'],
  },
  QuoteDetail: {
    '& .additional_infor .additional_desc': {
      wordBreak: 'break-all',
    },
    '& .quote-info': componentClasses['quote.info.container'],
    '& .quote_info,& .addresses': componentClasses['quote.info.items.container'],
    '& .item-container': componentClasses['quote.info.item.container'],
    '& .quote-info .quote-item-title': componentClasses['quote.info.item.title'],
    '& .quote-info .quote-item': componentClasses['quote.info.item.text'],
    '& .table-wrap table': componentClasses['quote.table'],
    '& .table-wrap thead th': componentClasses['quote.thead.th'],
    '& .table-wrap tbody tr': componentClasses['quote.tbody.tr'],
    '& .table-wrap tbody td': componentClasses['quote.tbody.td'],
    '& .table-wrap tbody td img': componentClasses['quote.tbody.td.img'],
  },
  ShoppingLists: {
    '& .title-wrap': componentClasses['shoppinglists.head.container'],
    '& .title-wrap .page-title': componentClasses['shoppinglists.head.title'],
    '& .title-wrap .title-actions': componentClasses['shoppinglists.head.button.container'],
    '& .title-wrap .title-actions #shopping_list_new': componentClasses['shoppinglists.head.button.create'],
    '& .table-wrap table': componentClasses['shoppinglists.table'],
    '& .table-wrap thead th': componentClasses['shoppinglists.thead.th'],
    '& .table-wrap tbody tr': componentClasses['shoppinglists.tbody.tr'],
    '& .table-wrap tbody td': componentClasses['shoppinglists.tbody.td'],
    '& [shopping-list-action]': styles['shoppinglist__action-btn'],
    '& .show-action': {
      display: 'block',
      left: 0,
    },
    '& .table-wrap': {
      '@media (max-width: 500px)': {
        overflowX: 'auto',
        '& tr': {
          borderTop: '1px solid #cccccc',
        },
      },
      '& .dropdown-menu': {
        '@media (max-width: 500px)': {
          display: 'flex',
          position: 'static',
          background: 'none',
          margin: 0,
          '& .button': {
            marginRight: '10px',
          },
        },
        '& a': {
          '@media (max-width: 500px)': {
            padding: '0',
          },
        },
        '@media (min-width: 501px)': {
          '& .button': {
            display: 'block',
            textAlign: 'center',
            border: 'none',
            fontSize: '13px!important',
          },
        },
      },
      '& [shopping-list-action]': {
        '@media (max-width: 500px)': {
          display: 'none',
        },
      },
    },
    '& .pagination-list': {
      '@media (min-width: 768px)': {
        paddingTop: '10px',
      },
    },
  },
  'addressBook.table.wrap': {
    width: '100%',
    overflow: 'auto',
    '& .address-lists-table': {
      '& td': {
        display: 'tabel-cell',
      },
      '& tr': {
        display: ' table-row',
      },
    },
  },
  ...componentClasses,
  'addressBook.modal.form.checkbox.container': {
    '& input[type=checkbox] + label:before': componentClasses['addressBook.modal.form.checkbox'],
    '& input[type=checkbox]:checked + label:before': componentClasses['addressBook.modal.form.checkbox.checked'],
  },
  'buyAgain.shoppingListModal.listWraper': {
    '& li:hover': componentClasses['buyAgain.shoppingListModal.list.item.hover'],
    '& li.active': componentClasses['buyAgain.shoppingListModal.list.item.active'],
  },
  'createQuote.companyModal.listWraper': {
    '& li:hover': componentClasses['createQuote.companyModal.list.item.hover'],
    '& li.active': componentClasses['createQuote.companyModal.list.item.active'],
  },
  'order.checkbox.container': {
    '& .form-checkbox + .form-label::before': componentClasses['order.content.list.item.checkbox'],
    '& .form-checkbox + .form-label::after': componentClasses['order.content.list.item.checkbox.checked'],
  },
}
