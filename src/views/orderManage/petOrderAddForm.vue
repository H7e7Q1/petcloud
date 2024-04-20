<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      label-suffix="："
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="快递公司" prop="expressCompany	">
        <el-select v-model="form.expressCompany" placeholder="请选择快递公司">
          <el-option
            v-for="item in expressCompany"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号" prop="expressNumber">
        <el-input
          v-model="form.expressNumber"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type FormInstance, type FormRules } from "element-plus";
import { useDictStore } from "@/store/dict";
const expressCompany = useDictStore().dict?.expressCompany;

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  updateData: {
    type: Function,
  },
});

const rules: FormRules = {
  expressCompany: [{ required: true, message: "该项必填", trigger: "blur" }],
  expressNumber: [{ required: true, message: "该项必填", trigger: "blur" }],
};
const formRef = ref<FormInstance>();

const defaultData = {
  expressCompany: "",
  expressNumber: "",
  orderId:''
};
const loading = ref(false);
const form = ref({ ...defaultData,orderId:props.data.id });

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
