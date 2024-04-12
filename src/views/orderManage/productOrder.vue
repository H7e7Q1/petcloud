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
            <el-col :span="8">
              <el-form-item label="关键词" prop="keyword">
                <el-input
                  v-model="searchForm.keyword"
                  placeholder="请输入关键词"
                  class="search-input"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单编号" prop="orderNumber">
                <el-input
                  v-model="searchForm.orderNumber"
                  placeholder="请输入订单编号"
                  class="search-input"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单状态" prop="orderStatus">
                <el-select
                  v-model="searchForm.orderStatus"
                  placeholder="请选择订单状态"
                  clearable
                >
                  <el-option
                    v-for="item in orderStatus"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24" fixed="true">
            <div class="search_btn_box">
              <el-button
                type="primary"
                class="search_btn"
                :icon="Search"
                @click="handleSearch"
              >
                搜索
              </el-button>
              <el-button @click="resetFields"> 重置 </el-button>
            </div>
          </el-col>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="deliveryTime" label="发货时间"></el-table-column>
        <el-table-column
          prop="expressCompany"
          label="快递公司"
        ></el-table-column>
        <el-table-column prop="expressNumber" label="快递单号">
        </el-table-column>
        <el-table-column label="订单编号" prop="orderNumber"></el-table-column>
        <el-table-column label="订单状态" prop="orderStatus">
          <template #default="scope">
            {{
              orderStatus?.find((el) => el.value == scope.row.orderStatus)
                ?.label
            }}
          </template>
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="payTime" label="支付时间"></el-table-column>
        <el-table-column prop="receiveTime" label="收货时间"></el-table-column>
        <el-table-column
          width="224"
          prop="receivingAddress"
          label="收货地址"
        ></el-table-column>
        <el-table-column
          prop="receivingPhone"
          label="收货人电话"
        ></el-table-column>
        <el-table-column
          prop="receivingUsername"
          label="收货人"
        ></el-table-column>
        <el-table-column prop="totalPrice" label="总金额"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(scope.row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="searchForm.page"
          :page-size="searchForm.size"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Search } from "@element-plus/icons-vue";

import { getProductOrderPage, deletePetService } from "@/api/productOrder";
import { useDictStore } from "@/store/dict";
const orderStatus = useDictStore().dict?.productOrderStatus;

// 搜索栏
const searchForm = reactive({
  keyword: "",
  orderNumber: "",
  orderStatus: "",
  page: 1,
  size: 10,
});

const formRef = ref();
// 重置
const resetFields = () => {
  formRef.value.resetFields();
  getData();
};
// 表格数据类型
interface TableItem {
  id: number;
  deliveryTime: string;
  expressCompany: string;
  expressNumber: string;
  orderNumber: string;
  orderStatus: string;
  orderTime: string;
  payTime: string;
  receiveTime: string;
  receivingAddress: string;
  receivingPhone: string;
  receivingUsername: string;
  totalPrice: string;
}
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  const res = await getProductOrderPage({
    ...searchForm,
  });
  tableData.value = res.data.records;
  pageTotal.value = res.data.total;
};

getData();

// 查询操作
const handleSearch = () => {
  searchForm.page = 1;
  getData();
};

// 分页导航
const handlePageChange = (val: number) => {
  searchForm.page = val;
  getData();
};

// 删除操作
const handleDelete = (row: TableItem) => {
  // 二次确认删除
  ElMessageBox.confirm("确定要删除吗？", "提示", {
    type: "warning",
  })
    .then(async () => {
      await deletePetService(row.id);
      ElMessage.success("删除成功");
      getData();
    })
    .catch(() => {});
};
</script>

<style scoped>
.search-box {
  margin-bottom: 20px;
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
