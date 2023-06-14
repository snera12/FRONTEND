<script setup>
import { toRefs, computed } from 'vue';
import { mapProblems } from '@/utils/mapProblems.js';
import ProblemsListEl from '@/components/elements/ProblemsListEl.vue';
import MaintaincePlateEl from '@/components/elements/MaintaincePlateEl.vue';
import ProblemsDateTimeEl from '@/components/elements/ProblemsDateTimeEl.vue';

const SEVERITY_LEVEL_SMALL = 2;
const CMP_NAME = 'problems-collection-card';
const dragClass = CMP_NAME + '-modal-drag';

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

const showNames = computed(() => {
  const list = {};
  const sets = props.problemsCollections;
  if (!sets.length) return list;
  sets.forEach(problems => {
    const { nodeName, nodeShowName } = problems;
    if (!list[nodeName]) list[nodeName] = nodeShowName;
  });
  return list;
});

const nodeNames = computed(() => {
  const names = [];
  const sets = props.problemsCollections;
  if (!sets.length) return names;
  if (sets.length === 1) return [sets[0].nodeName];
  sets.forEach(problems => {
    if (!names.includes(problems.nodeName)) names.push(problems.nodeName);
  });
  return names.sort();
});

const sortedByNodeName = computed(() => {
  const sorted = {};
  const sets = props.problemsCollections;
  if (!sets.length) return {};
  nodeNames.value.forEach((nodeName, n) => {
    sorted[n] = {
      nodeName,
      maxSeverity: 0,
      sets: [],
      setsNoSmall: []
    };
    sets.filter(set => set.nodeName === nodeName)
      .forEach((set, i) => {
        const {key, problemTypeLabel} = set;
        const curSet = {key, problemTypeLabel};
      
        const mapped = mapProblems(set.problems);
        // mapProblems keys are {problems, onMaintenanceItems, maxSeverity};
        Object.keys(mapped).forEach(key => curSet[key] = mapped[key]);
        sorted[n].sets.push(curSet);

        const max = curSet.maxSeverity;
        if (max > +SEVERITY_LEVEL_SMALL) sorted[n].setsNoSmall.push(curSet);
        if (max > sorted[n].maxSeverity) sorted[n].maxSeverity = max;
      });
  });
  return sorted;
});

const showedNodes = computed(()=> {
  const nums = [];
  if (!props.problemsCollections.length) return nums;
  Object.values(sortedByNodeName.value).forEach((node, i) => {
    if (!(node.maxSeverity === +SEVERITY_LEVEL_SMALL && !showSmallLvl)) nums.push(i);
  });
  return nums;
});

const { showSmallLvl } = toRefs(props);

</script>
<template>
  <div :class="CMP_NAME">
    <div :class="[CMP_NAME + '__title', dragClass, 'noselect']">
      <span 
        v-if="nodeNames.length > 1"
        :class="[CMP_NAME +'__title__nodes', dragClass]"
      >
        Проблемы на узлах:
        <span
          v-for="num in showedNodes" :key="num"
          :class="dragClass"
        >
          &laquo;{{ showNames[nodeNames[num]] }}&raquo;<!--
          --><span v-if="num+1 < showedNodes.length" :class="dragClass">; </span>
        </span>.<br><hr :class="dragClass">
      </span>
      <span v-else>
        Проблемы на узле:
        <span
          :class="[CMP_NAME +'__title__node', dragClass]">
          &laquo;{{ showNames[nodeNames[0]] }}&raquo;.
        </span>
      </span>
    </div>
    <div :class="CMP_NAME + '__body'">
      <div
        v-for="num in showedNodes" :key="num"
        :id="`${CMP_NAME}__node-${num}`"
        :class="[CMP_NAME + '__body__node', 
          `${CMP_NAME}__body__node-${num === 0 ? 'first' : 'next'}`]"
      >
        <div
          v-if="showedNodes.length > 1"
          :class="CMP_NAME + '__body__node__name'"
        >
          {{ nodeNames[num] }}
        </div>
        <div
          v-for="(set, i) in (showSmallLvl ?
            sortedByNodeName[num].sets :
            sortedByNodeName[num].setsNoSmall)" :key="i"
          :id="`${CMP_NAME}__node-${num}__set-${i}`"
          :class="[CMP_NAME + '__body__node__set',
            `${CMP_NAME}__body__node__set-${i === 0 ? 'first' : 'next'}`]"
        >
          <div
            :class="[CMP_NAME + '__body__node__set__type',
              num === 0 && i === 0 ? CMP_NAME + '-modal-drag' : '']"
          >
            {{set.problemTypeLabel}}:
          </div>
          <maintaince-plate-el
            v-if="set.onMaintenanceItems.length"
            :items="set.onMaintenanceItems"
            :className="CMP_NAME + '__body__node__set'"
          />
          <div :class="CMP_NAME + '__body__node__set__problems'">
            <problems-list-el
              :className="CMP_NAME + '__body__node__set__problems'"
              :problems="set.problems"
              :showSmallLvl="showSmallLvl"
            />
          </div>
        </div>
        <hr v-if="nodeNames.length > 1">
      </div>
    </div>
    <problems-date-time-el
      v-if="dateTime"
      :className="CMP_NAME"
      :dateTime="dateTime"
    />
  </div>
</template>
<style lang="scss" scoped>
.problems-collection-card {
  display: block;
  min-height: min(150px, 10vw);
  max-height: max(800px, 50vw);
  overflow-x: hidden;
  overflow-y: hidden;

  hr {
    height: 0px;
    border: none;
    border-top: 2px solid var(--print-middle-color);
  }
  &-modal-drag:hover{
    cursor: move;
  }
  &__title{
    padding: 0 2rem;
    font-size: 21px;
    text-align: center;
    &__node, &__nodes {
      font-weight: bold;
    }
  }
  &__title:hover{
    cursor: move;
  }
  &__body {
    display: block;
    position: relative;
    max-height: min(700px, 45vh);
    overflow-x: hidden;
    overflow-y: auto;

    &__node {
      // &-first {} &-next {}
      &__name {
        padding: 2rem 2rem 0 2rem;
        font-size: 21px;
        text-align: center;
        font-weight: bold;
      }
      &-first &__name{
        padding-top: 1rem;
      }
      &__set {
        // &-first {} &-next {}
        &-hide {
          display: none;
        }
        &__type{
          padding: 2rem 2rem 0 2rem;
          font-size: 21px;
          text-align: center;
          font-weight: bold;
        }
        &-first &__type {
          padding-top: 0;
        }
        &__problems {
          display: block;
          position: relative;
        }
      }
    }
  }
}
.modal-size-print .problems-collection-card {
  max-height: none;
  overflow-y: auto;
}

.modal-size-print .problems-collection-card__body {
  max-height: none;
  height: max-content;
  overflow-y: auto;
}
</style>