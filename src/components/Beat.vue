<template>
  <div class="beat" v-on:click="editBeat">
    <input v-if="editing" v-bind:placeholder="beat.chord"
    v-on:change="saveBeat($event.target.value)">
    {{beat.chord}}
  </div>
</template>

<script>
export default {
  name: 'Beat',
  props: {
    beat: Object,
    edit: { type: Function },
  },
  data() {
    return {
      beatId: this.beat.id,
      editing: false,
    }
  },
  methods: {
    editBeat() {
      this.editing = true;
      this.$emit('editing');
      window.addEventListener('focusout', () => {this.editing = false; window.console.log('no longer editing beat ')})
    },
    saveBeat(chord) {
      this.edit(chord, this.beatId)
      window.console.log('saveBeat: saved beat ', chord);
    }
  }
}
</script>

<style scoped>
.beat {
  display: inline-block;
  padding: 0;
  text-align: left;
}
input {
  font-size: 2rem;
  max-width: 20%;
  text-align: left;
  margin: 0;
  border: 0;
}
</style>