<template>
<h1>org-info-manage</h1>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";


const mechanism_id = ref(); //接收路由参数（登录用户所属的机构编号）
const route = useRoute()

onMounted(()=>{
  mechanism_id.value=route.params.id
  // console.log(mechanism_id.value)

})
</script>

<style scoped>

</style>