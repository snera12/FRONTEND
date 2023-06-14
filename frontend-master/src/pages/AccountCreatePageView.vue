<script setup>
import AccountUserView from '@/views/AccountUserView.vue';
</script>

<template>
  <base-page
    kebabName="accounts-create"
    path="accounts/create"
    title="Добавить пользователя"
  >
    <template #dashboard>
      <account-user-view :showTitle="false"/>
    </template>
  </base-page>
</template>

<style lang="scss">
</style>