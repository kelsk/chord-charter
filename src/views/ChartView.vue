<template>
  <div>
    <h1>
    Charts {{$route.params.title}}
    </h1>
    <router-view :key="$route.params.title">
    </router-view>
  </div>
</template>
<script>

export default {
  name: 'Charts',
  components: {
  }
}
</script>