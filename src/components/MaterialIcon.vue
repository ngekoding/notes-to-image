<template>
  <span class="material-icons" :class="type" :style="styles">
    {{ name }}
  </span>
</template>

<script>
export default {
  name: "material-icon",
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "filled",
      validator(value) {
        return ["filled", "outlined", "rounded", "sharp", "two-tone"].includes(
          value
        );
      },
    },
    color: {
      type: String,
      default: "inherit",
    },
    size: {
      type: [Number, String],
      default: 24,
    },
  },
  computed: {
    styles: function () {
      return {
        fontSize: parseInt(this.size) + "px",
        color: this.color,
      };
    },
  },
};
</script>
