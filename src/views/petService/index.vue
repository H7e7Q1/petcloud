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
              <el-form-item label="服务类别" prop="serviceType">
                <el-select
                  v-model="searchForm.serviceType"
                  placeholder="请选择服务类别"
                  clearable
                >
                  <el-option
                    v-for="item in serviceType"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
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
          </el-row>
        </el-form>
      </div>
      <div class="top_operate">
        <el-button
          type="primary"
          :icon="CirclePlusFilled"
          @click="visible = true"
        >
          新增服务
        </el-button>
      </div>

      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="serviceTitle" label="服务标题">
        </el-table-column>
        <el-table-column prop="isListing" label="是否上架">
          <template #default="scope">
            {{ scope.row.isListing ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="isRecommend" label="是否推荐">
          <template #default="scope">
            {{ scope.row.isRecommend ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="isTopping" label="是否置顶">
          <template #default="scope">
            {{ scope.row.isTopping ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="petPrice" label="价格"> </el-table-column>
        <el-table-column prop="publicize" label="服务宣传语"> </el-table-column>
        <el-table-column prop="serviceDuration" label="服务时长">
        </el-table-column>
        <el-table-column prop="servicePeriod" label="服务时段">
        </el-table-column>
        <el-table-column label="服务类别" prop="serviceType">
          <template #default="scope">
            {{
              serviceType?.find((el) => el.value == scope.row.serviceType)
                ?.label
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="宠物标题照片" prop="titlePhoto">
          <template #default="scope">
            <img :src="scope.row.titlePhoto" alt="宠物标题照片" />
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="isListingHandle(scope.row)"
            >
              {{ scope.row.isListing?'下架':'上架' }}
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
      :title="idEdit ? '编辑服务' : '新增服务'"
      v-model="visible"
      width="640px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <patForm
        :data="rowData"
        :edit="idEdit"
        :updateData="updateData"
      />
    </el-dialog>
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
import patForm from "./addForm.vue";
import {
  getPetServicePage,
  deletePetService,
  petServiceOnSelf,
  saveOrUpdatePetService,
} from "@/api/petService";

import { useDictStore } from "@/store/dict";
const serviceType = useDictStore().dict?.serviceType;
const formRef = ref();
// 重置
const resetFields = () => {
  formRef.value.resetFields();
  getData();
};
// 搜索栏
const searchForm = reactive({
  serviceType: "",
  page: 1,
  size: 10,
});

// 表格数据类型
interface TableItem {
  id: number;
  serviceTitle: string;
  isListing: boolean;
  isRecommend: boolean;
  isTopping: boolean;
  petPrice: string;
  publicize: string;
  serviceDuration: string;
  servicePeriod: string;
  serviceType: string;
  titlePhoto: string;
}
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  const res = await getPetServicePage({
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
// 下架上架操作
const isListingHandle = (row: TableItem) => {
  // 二次确认删除
  ElMessageBox.confirm(`确定要${row.isListing?'下架':'上架'}吗？`, "提示", {
    type: "warning",
  })
    .then(async() => {
      await petServiceOnSelf(row.id);
      ElMessage.success(`${row.isListing?'下架':'上架'}成功`);
      getData();
    })
    .catch(() => {});
};
const visible = ref(false);
const idEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: TableItem) => {
  let data = {
    ...row,
    titlePhoto: [{ name: "", url: row.titlePhoto }],
  };
  rowData.value = data;
  idEdit.value = true;
  visible.value = true;
};
const updateData = async (params) => {
  try {
    await saveOrUpdatePetService({
      ...params,
    });
    ElMessage.success("提交成功");
    getData();
  } catch (error) {
    ElMessage.error(error.message);
  }
  closeDialog();
};

const closeDialog = () => {
  visible.value = false;
  idEdit.value = false;
};

const visible1 = ref(false);
const handleView = (row: TableItem) => {
  rowData.value = row;
  visible1.value = true;
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
