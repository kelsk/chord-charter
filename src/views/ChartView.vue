<template>
  <div>
    <main class="chart__container">
    <ChartLibrary>
    </ChartLibrary>
    <router-view :key="$route.params.title">
    </router-view>
    </main>
  </div>
</template>
<script>
import ChartLibrary from '../components/ChartLibrary.vue'

export default {
  name: 'Charts',
  components: {
    ChartLibrary,
  },
}
</script>