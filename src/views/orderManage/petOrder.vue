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
        v-loading="loading"
        header-cell-class-name="table-header"
      >
        <el-table-column
          label="订单编号"
          min-width="180"
          prop="orderNumber"
        ></el-table-column>
        <el-table-column label="订单状态" min-width="140" prop="orderStatus">
          <template #default="scope">
            {{
              orderStatus?.find((el) => el.value == scope.row.orderStatus)
                ?.label
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTime"
          min-width="180"
          label="下单时间"
        ></el-table-column>
        <el-table-column
          prop="payTime"
          min-width="180"
          label="支付时间"
        ></el-table-column>
        <el-table-column
          prop="deliveryTime"
          min-width="180"
          label="发货时间"
        ></el-table-column>
        <el-table-column prop="expressCompany" label="快递公司" min-width="180">
          <template #default="scope">
            {{
              expressCompany?.find((el) => el.value == scope.row.expressCompany)
                ?.label
            }}
          </template>
        </el-table-column>
        <el-table-column prop="expressNumber" min-width="180" label="快递单号">
        </el-table-column>
        <el-table-column
          prop="receiveTime"
          min-width="180"
          label="收货时间"
        ></el-table-column>
        <el-table-column
          min-width="224"
          prop="receivingAddress"
          label="收货地址"
        ></el-table-column>
        <el-table-column
          min-width="180"
          prop="receivingPhone"
          label="收货人电话"
        ></el-table-column>
        <el-table-column
          min-width="180"
          prop="receivingUsername"
          label="收货人"
        ></el-table-column>
        <el-table-column
          prop="totalPrice"
          min-width="120"
          label="总金额"
        ></el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.orderStatus == 'WAIT_PAY'"
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(scope.row)"
            >
              取消
            </el-button>
            <el-button
              v-if="scope.row.orderStatus == 'WAIT_DELIVERY'"
              type="warning"
              size="small"
              @click="handleDelivery(scope.row)"
            >
              发货
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
    <el-dialog
      title="填写发货信息"
      v-model="visible"
      width="640px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <addForm :data="rowData" :updateData="updateData" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, Search } from "@element-plus/icons-vue";
import addForm from "./addForm.vue";

import { getPetOrderPage, toCancel, toDelivery } from "@/api/petOrder";
import { useDictStore } from "@/store/dict";
const orderStatus = useDictStore().dict?.petOrderStatus;
const expressCompany = useDictStore().dict?.expressCompany;

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
const loading = ref(false);
const getData = async () => {
  loading.value = true;
  const res = await getPetOrderPage({
    ...searchForm,
  });
  tableData.value = res.data.records;
  pageTotal.value = res.data.total;
  loading.value = false;
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
      await toCancel(row.id);
      ElMessage.success("删除成功");
      getData();
    })
    .catch(() => {});
};

const visible = ref(false);
const rowData = ref({});
const handleDelivery = (row: TableItem) => {
  rowData.value = row;
  visible.value = true;
};
const updateData = async (params) => {
  try {
    await toDelivery({
      ...params,
    });
    ElMessage.success("提交成功");
    getData();
  } catch (error) {
    console.log(error);
  }
  closeDialog();
};
const closeDialog = () => {
  visible.value = false;
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
