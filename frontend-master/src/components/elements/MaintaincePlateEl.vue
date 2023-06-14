<script setup>
import { onMounted, ref, toRefs } from 'vue';

const CSS_EL_NAME = 'maintaince-plate';

// eslint-disable-next-line no-undef
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    required: true,
  },
  className: {
    type: String,
    default: 'problems-list-el-class'
  }
});
const cmpCss = ref('');
onMounted(()=>cmpCss.value = `${props.className}__${CSS_EL_NAME}`);
const { items } = toRefs(props);
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
  <div :class="getClasses(['maintenance'])">
    <div :class="getClasses(['maintenance__attention'])">
      Внимание!
    </div>
    <div :class="getClasses(['maintenance__msg'])">
      На <b>{{items.join(', ')}}</b> в настоящий момент
      производится техническое обслуживание. Важность отмеченных проблем не
      соответствует действительности.
    </div>
  </div>
</template>
<style lang="scss" scoped>
.maintaince-plate{
 &__maintenance {
    display: block;
    margin-top: 1rem;
    border: 2px solid var(--maintenance-problem-color);
    &__attention {
      background: var(--maintenance-problem-color);
      text-align: center;
    }
    &__msg {
      padding: 0.25rem 0.5rem;
    }
    @media print {
      border: 2px solid grey;
      &__attention {
        background: grey !important;
        font-weight: bold;
      }
    }
  }
}
</style>