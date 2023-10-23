<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active">
      <van-tab title="all"></van-tab>
      <van-tab title="payment"></van-tab>
      <van-tab title="delivery"></van-tab>
      <van-tab title="received"></van-tab>
      <van-tab title="commnet"></van-tab>
    </van-tabs>

    <OrderListItem v-for="item in list" :key="item.order_id" :item="item"></OrderListItem>
  </div>
</template>

<script>
import OrderListItem from '@/components/OrderListItem.vue'
import { getMyOrderList } from '@/api/order.js'
export default {
  name: 'OrderPage',
  data () {
    return {
      active: this.$route.query.dataType || 'all',
      page: 1,
      list: []
    }
  },
  components: {
    OrderListItem
  },
  methods: {
    async getOrderList () {
      const { data: { list } } = await getMyOrderList(this.active, this.page)
      list.data.forEach((item) => {
        item.total_num = 0
        item.goods.forEach(goods => {
          item.total_num += goods.total_num
        })
      })
      this.list = list.data
    }
  },
  watch: {
    active: {
      immediate: true,
      handler () {
        this.getOrderList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
}
.van-tabs {
  position: sticky;
  top: 0;
}
</style>
