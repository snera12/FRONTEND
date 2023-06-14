<script setup>
import { toRefs, computed } from 'vue';
import { mapProblems } from '@/utils/mapProblems.js';
import ProblemsListEl from '@/components/elements/ProblemsListEl.vue';
import MaintaincePlateEl from '@/components/elements/MaintaincePlateEl.vue';
import ProblemsDateTimeEl from '@/components/elements/ProblemsDateTimeEl.vue';

const CMP_NAME = 'problem-card';

// eslint-disable-next-line no-undef
const props = defineProps({
  problemsCollections: {
    type: Array,
    default: ()=>[{
      key: '',
      nodeName: '',
      nodeShowName: '',
      problemTypeLabel: '',
      problems: [],
    }],
    required: true,
  },
  showSmallLvl: {
    type: Boolean,
    default: false
  },
  dateTime: {
    type: String,
    default: '',
  }
});
const {problemsCollections, showSmallLvl} = toRefs(props);

const problemsList = computed(() => mapProblems(props.problemsCollections[0].problems));
</script>
<template>
  <div class="problem-card">
    <div class="problem-card__title problem-card-modal-drag noselect">
      Проблемы на узле
      <span class="problem-card__title__node problem-card-modal-drag">
        &laquo;{{ problemsCollections[0].nodeShowName }}&raquo;.
      </span>
      <span class="problem-card__title__type problem-card-modal-drag">
        {{problemsCollections[0].problemTypeLabel}}:
      </span>
    </div>
    <div :class="CMP_NAME + '__body'">
      <maintaince-plate-el
        v-if="problemsList.onMaintenanceItems.length"
        :className="CMP_NAME + '__body'"
        :items="problemsList.onMaintenanceItems"
      />
      <problems-list-el
        :className="CMP_NAME + '__body'"
        :problems="problemsList.problems"
        :showSmallLvl="showSmallLvl"
      />
    </div>
    <div :class="CMP_NAME + '__footer'">
      <problems-date-time-el
        v-if="dateTime"
        :className="CMP_NAME + '__footer'"
        :dateTime="dateTime"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.problem-card {
  display: block;
  min-height: min(150px, 10vw);
  max-height: calc(100vh - 100px);
  overflow-x: hidden;
  overflow-y: hidden;

  &-modal-drag:hover{
    cursor: move;
  }
  &__title {
    padding: 0 2rem;
    font-size: 21px;
    text-align: center;
    &__type, &__node{
      font-weight: bold;
    }
  }
  &__title:hover {
    cursor: move;
  }
  &__body {
    overflow-y: auto;
    max-height: calc(100vh - 175px);
  }
  &__footer {
    height: 25px;
    min-height: 25px;
    margin-bottom: -12px;
  }
}
</style>