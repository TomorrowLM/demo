import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FullScreenMixin extends Vue {
  get fullStatus() {
    return this.$store.state.common.fullscreenStatus;
  }

  activated() {
    window.addEventListener('fullscreenchange', this.changeFull);
  }

  deactivated() {
    if (!this.fullStatus) {
      window.removeEventListener('fullscreenchange', this.changeFull);
    }
  }

  // 全屏
  public fullScreen() {
    const element: any = document.documentElement;
    // 如果是全屏状态
    if (this.fullStatus) {
      // 如果浏览器有这个Function
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        (document as any).webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      this.$forceUpdate();
    } else {
      // 如果浏览器有这个Function
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
  }

  public changeFull() {
    let isFull =
      document.fullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenEnabled;
    if (isFull === undefined || isFull === null) isFull = false;
    this.$store.commit('changeFullStatus', isFull);
  }
}
