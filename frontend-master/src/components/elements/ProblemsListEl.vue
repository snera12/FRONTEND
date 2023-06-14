<script setup>
import { onMounted, ref, toRefs } from 'vue';
import { getCasesOfSeverityLevels, SEVERITY_LEVELS_RUS } from '@/utils/ApiUtils.js';
import { openNewWindow } from '@/utils/utils';

const SEVERITY_LEVEL_SMALL = 2;
const severityLvls = getCasesOfSeverityLevels();
const lvls = Object.keys(SEVERITY_LEVELS_RUS).sort((x, y) => x < y ? 1 : -1);
const CSS_EL_NAME = 'problems-list';

// eslint-disable-next-line no-undef
const props = defineProps({
  problems: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  showSmallLvl: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: 'problems-list-el-class'
  }
});
const cmpCss = ref('');
onMounted(()=>cmpCss.value = `${props.className}__${CSS_EL_NAME}`);
const { problems, showSmallLvl } = toRefs(props);
const getClasses = suffixes => {
  const classes = [];
  suffixes.forEach(suf => {
    classes.push(`${CSS_EL_NAME}__${suf}`);
    classes.push(`${cmpCss.value}__${suf}`);
  });
  return classes;
};
</script>
<template>
  <div v-for="lvl in lvls" :key="lvl">
    <div
      v-if="problems[lvl] && !(+lvl === SEVERITY_LEVEL_SMALL && !showSmallLvl)"
      :class="getClasses(['severity', `severity-${severityLvls[lvl]}`])"
    >
      <div :class="getClasses(['severity__title'])">
        {{SEVERITY_LEVELS_RUS[lvl]}}:
      </div>
      <div v-for="problem in problems[lvl]" :key="problem.id">
        <span
          v-if="problem.isSuppressed"
          :class="getClasses(['problem-suppressed'])"
        >
          [Проблема подавлена]<!--
        --></span>
        <span
          v-if="problem.isMaintenance"
          :class="getClasses(['problem-maintenance'])"
        >
          [Т.О.]<!--
        --></span>
        <span
          @click="openNewWindow(problem.link)"
          :class="getClasses(['problem'])"
        >
          <span v-if="problem.isSuppressed || problem.isMaintenance" >&nbsp;</span>
          <b>{{problem.itemName}}:</b> {{problem.message}};
        </span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.problems-list {
  display: block;
  position: relative;
  max-height: min(700px, 45vh);
  overflow-x: hidden;
  overflow-y: auto;

  &__severity {
    display: block;
    border-left-style: solid;
    border-left-width: 10px;
    margin-top: 1rem;
    padding-left: 1rem;
    &__title {
      text-decoration: underline;
      margin-bottom: 0.5rem;
    }
    &-critical {
      border-color: var(--critical-problem-color);
    }
    &-high {
      border-color: var(--high-problem-color);
    }
    &-middle {
      border-color: var(--middle-problem-color);
    }
    &-small {
      border-color: var(--small-problem-color);
    }
  }
  &__problem-suppressed, &__problem-maintenance{
    background: var(--maintenance-problem-color);
  }
  &__problem:hover {
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: var(--main-link-color);
  }
}
@media print {
  .problems-list {
    &__severity {
      &-critical {
        position: relative !important;
        padding-left: 5px !important;
        border: var(--critical-problem-border);
        border-style: double;
        border-left-width: 20px !important;
      }
      &-high {
        border: var(--high-problem-border);
      }
      &-middle {
        border: var(--middle-problem-border);
        border-color: grey;
      }
      &-small {
        border: var(--small-problem-border);
      }
      &-critical, &-high, &-middle, &-small {
        border-width: 0 0 0 10px;
      }
    }  
    &__problem-suppressed, &__problem-maintenance{
      background: rgb(200,200,200);
    }
  }
}
</style>