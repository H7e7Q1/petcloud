<template>
  <div>
    <el-row :gutter="20">
      <el-col
        style="margin-bottom: 20px"
        :span="8"
        v-for="(item, index) in datatTotalObj"
      >
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div :class="[`grid-con-${index + 1}`, 'grid-content']">
            <el-icon class="grid-con-icon">
              <component :is="item.icon"></component>
            </el-icon>
            <div class="grid-cont-right">
              <div class="grid-num">{{ item.value }}</div>
              <div>{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="bar"
            class="schart"
            canvasId="bar"
            :options="options"
          ></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="line"
            class="schart"
            canvasId="line"
            :options="options2"
          ></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from "vue-schart";
import { reactive, ref, nextTick } from "vue";
import {
  homeTotal,
  homeTotalOrderWeek,
  homeTotalOrderHalfYear,
} from "@/api/index";
const datatTotalObj = ref([
  {
    key: "todayOrderCount",
    label: "今日成交单数",
    icon: "Goods",
    value: "",
  },
  {
    key: "todayTurnover",
    label: "今日营业额",
    icon: "Money",
    value: "",
  },
  {
    key: "totalOrderCount",
    label: "总成交单数",
    icon: "ShoppingTrolley",
    value: "",
  },
  {
    key: "totalStockCount",
    label: "总库存量",
    icon: "Coin",
    value: "",
  },
  {
    key: "totalTurnover",
    label: "总营业额",
    icon: "ShoppingBag",
    value: "",
  },
  {
    key: "totalUserCount",
    label: "用户总数",
    icon: "User",
    value: "",
  },
]);
const bar = ref();
const line = ref();
const dataTotal = ref({});
const homeTotalFn = async () => {
  try {
    const { data } = await homeTotal();
    datatTotalObj.value.map((el) => {
      el.value = data[el.key];
    });
  } catch (error) {
    console.log(error);
  }
};
homeTotalFn();

const orderWeekTotal = ref({
  nameList: [],
  valueList1: [],
  valueList2: [],
  valueList3: [],
});
const options = ref({
  type: "bar",
  title: {
    text: "最近一周订单趋势图",
  },
  xRorate: 25,
  labels: orderWeekTotal.value.nameList,
  datasets: [],
});
const homeTotalOrderWeekFn = async () => {
  try {
    const { data } = await homeTotalOrderWeek();
    orderWeekTotal.value = { ...data };
    options.value.labels = data.nameList;
    options.value.datasets = [
      {
        label: "宠物",
        data: data.valueList1,
      },
      {
        label: "商品",
        data: data.valueList2,
      },
      {
        label: "服务的销售额",
        data: data.valueList3,
      },
    ];
    // bar.value.renderChart();
  } catch (error) {
    console.log(error);
  }
};
homeTotalOrderWeekFn();

const orderYearTotal = ref({
  nameList: [],
  valueList1: [],
  valueList2: [],
  valueList3: [],
});
const options2 = ref({
  type: "line",
  title: {
    text: "最近半年订单趋势图",
  },
  labels: [],
  datasets: [],
});
const homeTotalHalfYearFn = async () => {
  try {
    const { data } = await homeTotalOrderHalfYear();
    orderYearTotal.value = { ...data };
    options2.value.labels = data.nameList;
    options2.value.datasets = [
      {
        label: "宠物",
        data: data.valueList1,
      },
      {
        label: "商品",
        data: data.valueList2,
      },
      {
        label: "服务的销售额",
        data: data.valueList3,
      },
    ];
    // line.value.renderChart();
  } catch (error) {
    console.log(error);
  }
};
homeTotalHalfYearFn();
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.grid-con-4 .grid-con-icon {
  background: rgb(242 198 67);
}

.grid-con-4 .grid-num {
  color: rgb(242 198 67);
}

.grid-con-5 .grid-con-icon {
  background: rgb(129 68 243);
}

.grid-con-5 .grid-num {
  color: rgb(129 68 243);
}

.grid-con-6 .grid-con-icon {
  background: rgb(235 69 244);
}

.grid-con-6 .grid-num {
  color: rgb(235 69 244);
}
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
