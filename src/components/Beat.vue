<template>
  <div class="beat" v-on:click="editBeat">
    <input class="beat__input" v-if="editing" v-bind:placeholder="beat.chord"
    v-on:change="saveBeat($event.target.value)"/>
    <span v-else>
    {{beat.chord}}
    </span>
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
      window.addEventListener('focusout', () => {this.editing = false})
    },
    saveBeat(chord) {
      this.edit(chord, this.beatId)
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
.beat__input {
  font-size: 1.5rem;
  display: inline-block;
  max-width: 40px;
  overflow: visible;
  text-align: left;
  margin: 0;
  border: 0;
  padding: 0;
}
</style>