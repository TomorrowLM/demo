<template>
  <div>
    <power info="info"></power>
  </div>
</template>

<script>
import power from "./components/power-outages";

export default {
  name: "App",
  data: function () {
    return {
      info: 0,
    };
  },
  components: {
    power,
  },
};
</script>
