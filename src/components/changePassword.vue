<template>
  <div>
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="原密码" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPassword2">
        <el-input v-model="form.newPassword2" type="password" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value !== form.newPassword) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}

const rules: FormRules = {
  password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  newPassword2: [{ required: true, message: "请确认密码", trigger: "blur" },{ validator: validatePass2, trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  password: "",
  newPassword: "",
  newPassword2: "",
});
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      ElMessage.success("提交成功！");
    } else {
      return false;
    }
  });
};
</script>

<style scoped>
</style>
