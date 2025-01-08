function debounce(el, binding) {
  let index = 0;
  let timer: any;
  el.addEventListener('click', () => {
    // console.log(el, binding);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (index === 0) {
      binding.value.fn(binding.value.type);
      index++;
    }
    timer = setTimeout(() => {
      console.log(binding.value);
      binding.value.fn(binding.value.type);
    }, 2000);
  });
}

export default {
  mounted(el, binding) {
    debounce(el, binding);
  },
  update(el, binding) {
    debounce(el, binding);
  }
};
