<script setup>
import { SEVERITY_LEVELS_RUS, getCasesOfSeverityLevels } from '@/utils/ApiUtils.js';
const lvls = Object.keys(SEVERITY_LEVELS_RUS).sort((a, b) => b - a);
const severities = getCasesOfSeverityLevels();
</script>

<template>
  <div id="legend" :class="'table-legend'">
    <span :class="'table-legend__title'">Условные обозначения: </span>
    <span
      v-for="lvl in lvls" :key="lvl" 
      :class="`table-legend__lvl-${severities[lvl]}`"
    >
      <span :class="`table-legend__lvl-${severities[lvl]}__counter`">
        &nbsp;{{6-lvl}}&nbsp;
      </span>
      <span :class="`table-legend__lvl-${severities[lvl]}__text`">
        {{SEVERITY_LEVELS_RUS[lvl]}}
      </span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .table-legend {
    @media screen {
      display: none;
    }
    font-size: 9pt;
    @media print {
      display: block;
      margin-top: 6px;
      padding: 12px 0px 0px 6px;
      width: minmax(80%, 640px);
      min-height: 16px;
      height: 16px;
      &__title {
        font-size: 12px;
        padding: 12px;
        font-weight: bold;
      }
      &__lvl {
        &-small, &-middle, &-high, &-critical {
          padding: 9px 24px;
          &__counter {
            margin: 2px 4px;
          }
        }
        &-small {
          padding-right: 0px;
        }
        &-critical__counter {
          border: var(--critical-problem-border);
        }
        &-high__counter {
          border: var(--high-problem-border);
        }
        &-middle__counter {
          border: var(--middle-problem-border);
        }
        &-small__counter {
          border: var(--small-problem-border);
        }
      }
    }
  }
</style>