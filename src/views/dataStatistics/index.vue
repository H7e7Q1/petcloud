<template>
  <div>
    <div class="container">
      <div class="search-box">
        <el-form
          ref="formRef"
          :model="searchForm"
          label-suffix="："
          label-width="120px"
        >
          <el-row justify="space-between">
            <el-col :span="6">
              <el-form-item label="时间范围" prop="time">
                <el-date-picker
                  v-model="searchForm.time"
                  type="datetimerange"
                  :shortcuts="shortcuts"
                  range-separator="To"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                />
              </el-form-item>
            </el-col>
            <el-button type="primary" :icon="Search" @click="handleSearch">
              查询
            </el-button>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Delete,
  Edit,
  Search,
  CirclePlusFilled,
  View,
} from "@element-plus/icons-vue";

import { fetchData } from "@/api/index";

// 搜索栏
const searchForm = reactive({
  name: "",
  time: "",
  pageIndex: 1,
  pageSize: 10,
});
const shortcuts = [
  {
    text: "最近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return [start, end];
    },
  },
  {
    text: "最近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return [start, end];
    },
  },
  {
    text: "最近一年",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getFullYear() - 1);
      return [start, end];
    },
  },
];

let dataInfo =ref()
const getData = async () => {
  const {data} = await fetchData();
  dataInfo.value = data
};

getData();

// 查询操作
const handleSearch = () => {
  getData();
};
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 200px;
}

.top_operate {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
