<template>
  <div>
    <div class="container">
      <div class="search-box">
        <el-form
          ref="formRef"
          :model="searchForm"
          label-suffix="："
          label-width="100px"
        >
          <el-row justify="space-between">
            <el-col :span="8">
              <el-form-item label="宠物名称" prop="petName">
                <el-input
                  v-model="searchForm.petName"
                  placeholder="请输入宠物名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="petSex">
                <el-select
                  v-model="searchForm.petSex"
                  clearable
                  placeholder="请选择性别"
                >
                  <el-option
                    v-for="item in petSex"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="宠物分类" prop="petCategory">
                <el-select
                  v-model="searchForm.petCategory"
                  placeholder="请选择宠物类别"
                  clearable
                >
                  <el-option
                    v-for="item in applyPetType"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否绝育" prop="sterilization">
                <el-input
                  v-model="searchForm.sterilization"
                  autocomplete="new-password"
                ></el-input>
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
          新增宠物
        </el-button>
      </div>

      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="宠物名称" prop="petName"> </el-table-column>
        <el-table-column label="宠物性别" width="100" prop="petSex">
          <template #default="scope">
            {{ petSex?.find((el) => el.value == scope.row.petSex)?.label }}
          </template>
        </el-table-column>
        <el-table-column label="宠物分类" min-width="110" prop="petCategory">
          <template #default="scope">
            {{
              applyPetType?.find((el) => el.value == scope.row.petCategory)
                ?.label
            }}
          </template>
        </el-table-column>
        <el-table-column label="出生日期" min-width="110" prop="birthday">
        </el-table-column>
        <el-table-column label="年龄" min-width="80" prop="age">
        </el-table-column>
        <el-table-column label="价格" min-width="100" prop="petPrice">
        </el-table-column>
        <el-table-column label="绝育情况" min-width="120" prop="sterilization">
        </el-table-column>
        <el-table-column label="状态" min-width="110" prop="status">
          <template #default="scope">
            {{ sellStatus?.find((el) => el.value == scope.row.status)?.label }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.status == 'UN_SHELVES'"
              type="primary"
              size="small"
              :icon="Edit"
              @click="handleEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="scope.row.status == 'UN_SHELVES'"
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.status !== 'SELL'"
              :type="scope.row.status !== 'UN_SHELVES' ? 'warning' : 'success'"
              size="small"
              @click="isListingHandle(scope.row)"
            >
              {{ scope.row.status !== "UN_SHELVES" ? "下架" : "上架" }}
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
      :title="idEdit ? '更新宠物信息' : '新增宠物信息'"
      v-model="visible"
      width="660px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <patForm
        v-if="visible"
        :data="rowData"
        :edit="idEdit"
        :updateData="updateData"
      />
    </el-dialog>
    <el-dialog
      title="查看用户详情"
      v-model="visible1"
      width="700px"
      destroy-on-close
    >
      <!-- <TableDetail :data="rowData" /> -->
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
import {
  getPetPage,
  saveOrUpdatePet,
  deletePet,
  petOnSelf,
} from "@/api/petManage";
import patForm from "./addForm.vue";

import { useDictStore } from "@/store/dict";
const applyPetType = useDictStore().dict?.applyPetType;
const petSex = useDictStore().dict?.petSex;
const sellStatus = useDictStore().dict?.sellStatus;
const loading = ref(false);
const formRef = ref();
// 重置
const resetFields = () => {
  formRef.value.resetFields();
  getData();
};
// 搜索栏
const searchForm = reactive({
  petName: "",
  petSex: "",
  petCategory: "",
  sterilization: "",
  page: 1,
  size: 10,
});

// 表格数据类型
interface TableItem {
  id: string;
  status: string;
  petName: string;
  petSex: string;
  petCategory: string;
  birthday: string;
  petColour: string;
  isRecommend: boolean;
  isTopping: boolean;
  petTitlePhoto: string;
  petDetailPhoto: string;
  petCarouselPhotos: [];
  petPrice: string;
  sterilization: string;
}

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  loading.value = true;
  const res = await getPetPage({
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
      await deletePet(row.id);
      ElMessage.success("删除成功");
      getData();
    })
    .catch(() => {});
};
// 下架上架操作
const isListingHandle = (row: TableItem) => {
  // 二次确认下架上架
  ElMessageBox.confirm(
    `确定要${row.status !== "UN_SHELVES" ? "下架" : "上架"}吗？`,
    "提示",
    {
      type: "warning",
    }
  )
    .then(async () => {
      await petOnSelf(row.id);
      ElMessage.success(`${row.status !== "UN_SHELVES" ? "下架" : "上架"}成功`);
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
    petTitlePhoto: [{ name: "", url: row.petTitlePhoto }],
    petDetailPhoto: [{ name: "", url: row.petDetailPhoto }],
    petCarouselPhotos: row.petCarouselPhotos?.map((el) => {
      return {
        name: "",
        url: el,
      };
    }),
  };
  rowData.value = data;
  idEdit.value = true;
  visible.value = true;
};
const updateData = async (params) => {
  try {
    await saveOrUpdatePet({
      ...params,
    });
    ElMessage.success("提交成功");
    getData();
  } catch (error) {
    console.log(error)
  }

  closeDialog();
};

const closeDialog = () => {
  visible.value = false;
  idEdit.value = false;
};

const visible1 = ref(false);
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
