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

<style lang="sass" scoped>
@font-face
  font-family: 'Material Icons'
  font-style: normal
  font-weight: 400
  src: local('MaterialIcons-Regular'), url('../assets/fonts/MaterialIcons-Regular.ttf') format('truetype')
@font-face
  font-family: 'Material Icons-Outlined'
  font-style: normal
  font-weight: 400
  src: local('MaterialIconsOutlined-Regular'), url('../assets/fonts/MaterialIconsOutlined-Regular.otf') format('opentype')
@font-face
  font-family: 'Material Icons-Round'
  font-style: normal
  font-weight: 400
  src: local('MaterialIconsRound-Regular'), url('../assets/fonts/MaterialIconsRound-Regular.otf') format('opentype')
@font-face
  font-family: 'Material Icons-Sharp'
  font-style: normal
  font-weight: 400
  src: local('MaterialIconsSharp-Regular'), url('../assets/fonts/MaterialIconsSharp-Regular.otf') format('opentype')
@font-face
  font-family: 'Material Icons-TwoTone'
  font-style: normal
  font-weight: 400
  src: local('MaterialIconsTwoTone-Regular'), url('../assets/fonts/MaterialIconsTwoTone-Regular.otf') format('opentype')

.material-icons
  font-family: 'Material Icons'
  font-weight: normal
  font-style: normal
  font-size: 24px  /* Preferred icon size */
  display: inline-block
  line-height: 1
  text-transform: none
  letter-spacing: normal
  word-wrap: normal
  white-space: nowrap
  direction: ltr

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased

  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale

  /* Support for IE. */
  font-feature-settings: 'liga'

  &.outlined
    font-family: 'Material Icons-Outlined'
  &.rounded
    font-family: 'Material Icons-Round'
  &.sharp
    font-family: 'Material Icons-Sharp'
  &.two-tone
    font-family: 'Material Icons-TwoTone'
</style>
