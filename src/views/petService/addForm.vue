<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      label-suffix="："
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="服务标题" prop="serviceTitle">
        <el-input
          v-model="form.serviceTitle"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否上架" prop="isListing">
        <el-switch
          v-model="form.isListing"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="是否推荐" prop="isRecommend">
        <el-switch
          v-model="form.isRecommend"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="是否置顶" prop="isTopping">
        <el-switch
          v-model="form.isTopping"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="价格" prop="petPrice">
        <el-input
          v-model="form.petPrice"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务宣传语" prop="publicize">
        <el-input v-model="form.publicize" :rows="3" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="服务时长" prop="serviceDuration">
        <el-input
          v-model="form.serviceDuration"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务时段" prop="servicePeriod">
        <el-input
          v-model="form.servicePeriod"
          autocomplete="new-password"
        ></el-input>
        <!-- <el-time-picker
          v-model="form.servicePeriod"
          is-range
          range-separator="To"
          start-placeholder="Start time"
          end-placeholder="End time"
          format="HH/DD/SS"
          value-format="HH-DD-SS"
        /> -->
      </el-form-item>
      <el-form-item label="服务类别" prop="serviceType">
        <el-select
          v-model="form.serviceType"
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

      <el-form-item label="宠物标题照片" prop="titlePhoto">
        <el-upload
          :file-list="form.titlePhoto"
          class="upload-demo"
          action="api/noauth/upload/image"
          :limit="1"
          list-type="picture-card"
          :on-exceed="() => onExceed(1)"
          :on-preview="handlePictureCardPreview"
          :before-upload="(uploadFile) => beforeUpload(uploadFile)"
          :on-success="(response) => onSuccess(response, 'titlePhoto')"
          :on-error="(error) => onError(error)"
          :on-remove="() => onRemove('titlePhoto')"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import {
  type FormInstance,
  type FormRules,
  type UploadProps,
  ElMessage,
  ElMessageBox,
} from "element-plus";
import { fileLimitation } from "@/utils/index";
import { useDictStore } from "@/store/dict";
const serviceType = useDictStore().dict?.serviceType;

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
  serviceTitle: [{ required: true, message: "该项必填", trigger: "blur" }],
  isListing: [{ required: true, message: "该项必填", trigger: "blur" }],
  isRecommend: [{ required: true, message: "该项必填", trigger: "blur" }],
  isTopping: [{ required: true, message: "该项必填", trigger: "blur" }],
  petPrice: [{ required: true, message: "该项必填", trigger: "blur" }],
  publicize: [{ required: true, message: "该项必填", trigger: "blur" }],
  serviceDuration: [{ required: true, message: "该项必填", trigger: "blur" }],
  servicePeriod: [{ required: true, message: "该项必填", trigger: "blur" }],
  serviceType: [{ required: true, message: "该项必填", trigger: "blur" }],
  titlePhoto: [{ required: true, message: "该项必填", trigger: "blur" }],
};
const formRef = ref<FormInstance>();

const defaultData = {
  id: "",
  serviceTitle: "",
  isListing: false,
  isRecommend: false,
  isTopping: false,
  petPrice: "",
  publicize: "",
  serviceDuration:'',
  servicePeriod: "",
  serviceType: "",
  titlePhoto: [],
};
const loading = ref(false);
const form = ref({ ...(props.edit ? props.data : defaultData) });

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

const onExceed = (num) => {
  ElMessage.warning(`最多支持上传${num}张`);
};

const beforeUpload = (uploadFile) => {
  loading.value = true;
  let flag = fileLimitation(uploadFile);
  !flag && (loading.value = false);
  return flag;
};
const onSuccess = (res, type) => {
  if (res.code != 200) return ElMessage.error(res.message);
  console.log(res.data);
  form.value[type] = [res.data];
  loading.value = false;
  ElMessage.success(res.message);
};
const onRemove = (type) => {
  form.value[type] = [];
};
const onError = (error) => {
  ElMessage.error(error.message);
  loading.value = false;
};
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let data = {
        ...form.value,
        titlePhoto: form.value.titlePhoto[0]?.url,
      };
      props.updateData(data);
    } else {
      return false;
    }
  });
};
</script>

<style scoped></style>
