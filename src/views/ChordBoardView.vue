<template>
  <div>
    <h1>
      ChordBoards
    </h1>
    <ChordBoard></ChordBoard>
  </div>
</template>
<script>
import ChordBoard from '../components/ChordBoard.vue'
export default {
  name: 'ChordBoards',
  components: {
    ChordBoard
  },
  data() {
    return {
      chord: 'CHORD!'
    }
  },
}
</script>