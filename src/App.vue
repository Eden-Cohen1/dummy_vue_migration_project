<template>
  <div id="app" :class="themeClass">
    <router-view />
  </div>
</template>

<script>
import themeMixin from '@/mixins/themeMixin'

export default {
  name: 'App',
  mixins: [themeMixin],
  created() {
    // Theme is loaded from localStorage by themeMixin's created hook
  }
}
</script>
