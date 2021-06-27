import template from './B3Spinner.html'

class B3Spinner {
  constructor() {
    this.dom = null
    this.id = 'b2b_loading_overlay'
    this.render()
  }

  render() {
    const { id } = this
    const loadingSVG = require('./loading.gif').default
    const html = template({
      loadingSVG,
      id,
    })
    document.body.insertAdjacentHTML('beforeend', html)
    this.dom = document.querySelector(`#${id}`)
  }

  show() {
    this.dom.style.display = 'block'
  }

  hide() {
    this.dom.style.display = 'none'
  }
}

window.B3Spinner = new B3Spinner()
