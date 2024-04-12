<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      label-suffix="："
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="品牌名称" prop="brandName">
        <el-input
          v-model="form.brandName"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品类别" prop="productType">
        <el-select v-model="form.productType" placeholder="请选择宠物类别">
          <el-option
            v-for="item in productType"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
      <el-form-item label="价格" prop="price">
        <el-input v-model="form.price" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="库存量" prop="stock">
        <el-input v-model="form.stock" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="商品标题" prop="title">
        <el-input v-model="form.title" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="标题照片" prop="titlePhoto">
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
          :on-remove="
            (uploadFile, uploadFiles) => onRemove(uploadFile, 'titlePhoto')
          "
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情图片" prop="detailPhoto">
        <el-upload
          :file-list="form.detailPhoto"
          class="upload-demo"
          action="api/noauth/upload/image"
          :limit="1"
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
          :on-exceed="() => onExceed(1)"
          :before-upload="(uploadFile) => beforeUpload(uploadFile)"
          :on-success="(response) => onSuccess(response, 'detailPhoto')"
          :on-error="(error) => onError(error)"
          :on-remove="
            (uploadFile, uploadFiles) => onRemove(uploadFile, 'detailPhoto')
          "
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="轮播图" prop="carouselPhotos">
        <el-upload
          :file-list="form.carouselPhotos"
          class="upload-demo"
          action="api/noauth/upload/image"
          multiple
          :limit="5"
          :on-preview="handlePictureCardPreview"
          list-type="picture-card"
          :on-exceed="() => onExceed(5)"
          :before-upload="(uploadFile) => beforeUpload(uploadFile)"
          :on-success="(response) => onSuccess(response, 'carouselPhotos')"
          :on-error="(error) => onError(error)"
          :on-remove="
            (uploadFile, uploadFiles) => onRemove(uploadFile, 'carouselPhotos')
          "
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
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
const productType = useDictStore().dict?.productType;

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
  brandName: [{ required: true, message: "该项必填", trigger: "blur" }],
  productType: [{ required: true, message: "该项必填", trigger: "blur" }],
  isRecommend: [{ required: true, message: "该项必填", trigger: "blur" }],
  isTopping: [{ required: true, message: "该项必填", trigger: "blur" }],
  price: [{ required: true, message: "该项必填", trigger: "blur" }],
  stock: [{ required: true, message: "该项必填", trigger: "blur" }],
  title: [{ required: true, message: "该项必填", trigger: "blur" }],
  titlePhoto: [{ required: true, message: "该项必填", trigger: "blur" }],
  detailPhoto: [{ required: true, message: "该项必填", trigger: "blur" }],
  carouselPhotos: [{ required: true, message: "该项必填", trigger: "blur" }],
};
const formRef = ref<FormInstance>();

const defaultData = {
  brandName: "",
  productType: "",
  isRecommend: false,
  isTopping: false,
  price: "",
  stock: "",
  title: "",
  titlePhoto: [],
  detailPhoto: [],
  carouselPhotos: [],
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
  if (type == "carouselPhotos") {
    form.value[type].push(res.data);
  } else {
    form.value[type] = [res.data];
  }
  loading.value = false;
  ElMessage.success(res.message);
};
const onRemove = (uploadFile, type) => {
  if (type !== "carouselPhotos") {
    form.value[type] = [];
    return;
  }
  if (!uploadFile.response) return;
  let url = uploadFile.response.data;
  let index = form.value[type].findIndex((el) => el == url);
  form.value[type].splice(index, 1);
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
        detailPhoto: form.value.detailPhoto[0]?.url,
        carouselPhotos: form.value.carouselPhotos.map((el) => el.url),
      };
      props.updateData(data);
    } else {
      return false;
    }
  });
};
</script>

<style scoped></style>
