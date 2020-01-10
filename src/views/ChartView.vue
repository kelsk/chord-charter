<template>
  <div>
    <h1>
    Charts {{$route.params.title}}
    </h1>
    <router-view>
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