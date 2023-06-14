<template>
  <base-page
    kebabName="node-list-map"
    title="Карта сети и список узлов"
  >
      <base-table/>
      <div id="map-div" class="map-div">
        <div id="map" class="map"></div>
        <div id="popup"></div>
      </div>
      <web-terminal/>
  </base-page>
</template>

<script>
import WebTerminal from '@/components/tools/WebTerminal.vue';
import useJSON from '@/composables/useJSON.js';
export default {
  components: { WebTerminal },
  name: 'NodesListMapView',
  setup(props) {
    const { json, updateJSON } = useJSON();
    return { json, updateJSON };
  },
};
</script>

<style lang="scss">

.page__node-list-map__dashboard {
  position: relative;
  display: grid;
  min-width: 100%;
  width: 100%;
  grid-template:
  "map      node-table" auto
  "terminal terminal  " min-content
  "json     json      " min-content
  /50% 50%;

  @media(max-width: 900px) {
    display: block;
    padding-right: 2vw;
  }
}
</style>