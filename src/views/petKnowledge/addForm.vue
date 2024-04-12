<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      label-suffix="："
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="知识标题名称" prop="knowledgeName">
        <el-input
          v-model="form.knowledgeName"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="宠物类别" prop="applyPetType	">
        <el-select v-model="form.applyPetType" placeholder="请选择宠物类别">
          <el-option
            v-for="item in applyPetType"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="知识分类" prop="knowledgeType ">
        <el-select v-model="form.knowledgeType" placeholder="请选择知识分类">
          <el-option
            v-for="item in knowledgeType"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="知识文章内容" prop="content">
        <el-input
          placeholder="请输入知识文章内容"
          v-model="form.content"
          :rows="4"
          type="textarea"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { type FormInstance, type FormRules } from "element-plus";
import { useDictStore } from "@/store/dict";
const applyPetType = useDictStore().dict?.applyPetType;
const knowledgeType = useDictStore().dict?.knowledgeType;

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  edit: {
    type: Boolean,
    default: false,
  },
  updateData: {
    type: Function,
  },
});

const rules: FormRules = {
  knowledgeName: [{ required: true, message: "该项必填", trigger: "blur" }],
  applyPetType: [{ required: true, message: "该项必填", trigger: "blur" }],
  knowledgeType: [{ required: true, message: "该项必填", trigger: "blur" }],
  content: [{ required: true, message: "该项必填", trigger: "blur" }],
};
const formRef = ref<FormInstance>();

const defaultData = {
  knowledgeName: "",
  knowledgeType: "",
  applyPetType: "",
  content: "",
};
const loading = ref(false);
const form = ref({ ...(props.edit ? props.data : defaultData) });

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      loading.value = true;
      props.updateData(form.value);
      loading.value = false;
    } else {
      return false;
    }
  });
};
</script>

<style scoped></style>
