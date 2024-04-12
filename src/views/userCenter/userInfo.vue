<template>
  <div class="content" v-loading="loading">
    <el-form
      class="form"
      ref="formRef"
      label-suffix="："
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-row :gutter="20">
        <!-- <el-col :span="10">
          <el-form-item label="商家账号" prop="id">
            <el-input  v-model="form.id"> </el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="10">
          <el-form-item label="商家姓名" prop="contactName">
            <el-input v-model="form.contactName"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="店铺名称" prop="storeName">
            <el-input v-model="form.storeName" autocomplete="new-password">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" autocomplete="new-password">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="更换头像" prop="storeLogo">
            <el-upload
              class="avatar-uploader"
              action="api/noauth/upload/image"
              limit="1"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="form.storeLogo"
                :src="'https://212j1413x1.vicp.fun' + form.storeLogo"
                class="avatar"
              />
              <div class="upload_btn" v-else>
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules, UploadProps } from "element-plus";
import { fileLimitation } from "@/utils/index";
import { updateAdminInfo } from "@/api/index";
import { useUserInfoStore } from "@/store/userInfo";
const userStore = useUserInfoStore();
// form.
const validatePhone = (rule: any, value: any, callback: any) => {
  const rexPhone = /^1[3-9]\d{9}$/;
  if (!rexPhone.test(value)) {
    callback(new Error("请输入正确手机号"));
  } else {
    callback();
  }
};

const rules: FormRules = {
  // id: [{ required: true, message: "请输入商家账号", trigger: "blur" }],
  contactName: [{ required: true, message: "请输入商家姓名", trigger: "blur" }],
  storeName: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
  contactPhone: [{ validator: validatePhone, trigger: "change" }],
};

const formRef = ref<FormInstance>();
const form = ref({
  // id: "",
  contactName: "",
  storeName: "",
  contactPhone: "",
  storeLogo: "",
});
form.value = userStore.userInfo;

// 上传头像相关
const loading = ref(false);
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  loading.value = true;
  let flag = fileLimitation(rawFile);
  !flag && (loading.value = false);
  return flag;
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  form.value.storeLogo = response.data;
};

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await updateAdminInfo({
          ...form.value,
        });
        userStore.getAdminInfoHandle();
        ElMessage.success("提交成功！");
      } catch (error) {}
      loading.value = false;
    } else {
      return false;
    }
  });
};
</script>

<style scoped>
.content {
  background-color: white;
}
.form {
  margin-top: 20px;
}
.avatar{
  width:140px;
}
.avatar-uploader {
  width: 178px;
  text-align: center;
  height: 178px;
  line-height: 178px;
  display: block;
  font-size: 60px;
}
.upload_btn {
  width: 178px;
  text-align: center;
  height: 178px;
  border: 1px solid #dcdfe6;
}
</style>
