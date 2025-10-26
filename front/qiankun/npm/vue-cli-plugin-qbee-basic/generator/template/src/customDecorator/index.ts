import { get } from 'lodash';
import { createDecorator } from 'vue-class-component';

export function QTMapState(path: string) {
  return createDecorator((options, key) => {
    if (!options.computed) options.computed = {};

    options.computed[key] = function() {
      const temp = (this.$store as any).state;
      return get(temp, path, '');
    };
  });
}

export function QTMapGetter(path: string) {
  return createDecorator((options, key) => {
    if (!options.computed) options.computed = {};

    options.computed[key] = function() {
      const temp = (this.$store as any).getters;
      return get(temp, path, '');
    };
  });
}
