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
              <el-form-item label="知识标题名称" prop="knowledgeName">
                <el-input
                  v-model="searchForm.knowledgeName"
                  placeholder="请输入知识标题名称"
                  class="search-input"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="宠物分类" prop="applyPetType">
                <el-select
                  v-model="searchForm.applyPetType"
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
            <el-col :span="8">
              <el-form-item label="知识分类" prop="knowledgeType ">
                <el-select
                  v-model="searchForm.knowledgeType"
                  placeholder="请选择知识分类"
                >
                  <el-option
                    v-for="item in knowledgeType"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24">
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
      <div class="top_operate">
        <el-button
          type="primary"
          :icon="CirclePlusFilled"
          @click="visible = true"
        >
          新增
        </el-button>
      </div>

      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="knowledgeName"
          label="知识标题名称"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="knowledgeType" align="center" label="知识分类">
          <template #default="scope">{{ scope.row.knowledgeType }}</template>
        </el-table-column>
        <el-table-column prop="content" label="知识内容" align="center">
        </el-table-column>

        <el-table-column label="适用宠物分类" prop="applyPetType">
          <template #default="scope">
            {{
              applyPetType?.find((el) => el.value == scope.row.applyPetType)
                ?.label
            }}
          </template>
        </el-table-column>
        <el-table-column prop="isListing" align="center" label="是否上架">
          <template #default="scope">{{
            scope.row.isListing ? "是" : "否"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
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
      :title="idEdit ? '编辑宠物知识' : '新增宠物知识'"
      v-model="visible"
      width="640px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <addForm :data="rowData" :edit="idEdit" :updateData="updateData" />
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
import addForm from "./addForm.vue";

import {
  getPetSchoolPage,
  deletePetSchool,
  petSchoolOnSelf,
  getPetOrderPage,
} from "@/api/petKnowledge";
// import TableEdit from '../components/table-edit.vue';
import { useDictStore } from "@/store/dict";
const applyPetType = useDictStore().dict?.applyPetType;
const knowledgeType = useDictStore().dict?.knowledgeType;

// 搜索栏
const searchForm = reactive({
  knowledgeName: "",
  applyPetType: "",
  knowledgeType: "",
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
  applyPetType: string;
  content: string;
  createTime: string;
  isListing: string;
  knowledgeName: string;
  knowledgeType: string;
}
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = async () => {
  const res = await getPetSchoolPage({
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
    .then(async() => {
      await deletePetSchool(row.id);
      ElMessage.success("删除成功");
      getData();
    })
    .catch(() => {});
};
// 删除操作
const isListingHandle = (row: TableItem) => {
  // 二次确认删除
  ElMessageBox.confirm(`确定要${row.isListing?'下架':'上架'}吗？`, "提示", {
    type: "warning",
  })
    .then(async() => {
      await petSchoolOnSelf(row.id);
      ElMessage.success("删除成功");
      getData();
    })
    .catch(() => {});
};

const visible = ref(false);
const idEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: TableItem) => {
  rowData.value = row;
  idEdit.value = true;
  visible.value = true;
};
const updateData = async (params) => {
  try {
    await getPetOrderPage({
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
