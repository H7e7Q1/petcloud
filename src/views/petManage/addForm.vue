<template>
  <div v-loading="loading">
    <el-form
      ref="formRef"
      label-suffix="："
      :rules="rules"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="宠物名称" prop="petName">
        <el-input v-model="form.petName" autocomplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="petSex">
        <el-select v-model="form.petSex" placeholder="请选择性别">
          <el-option
            v-for="item in petSex"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="宠物类别" prop="petCategory">
        <el-select v-model="form.petCategory" placeholder="请选择宠物类别">
          <el-option
            v-for="item in applyPetType"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="宠物颜色" prop="petColour">
        <el-input
          v-model="form.petColour"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          style="width: 100%"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择出生日期"
        />
      </el-form-item>
      <el-form-item label="价格" prop="petPrice">
        <el-input
          v-model="form.petPrice"
          autocomplete="new-password"
        ></el-input>
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
      <el-form-item label="绝育情况" prop="sterilization">
        <el-input
          v-model="form.sterilization"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="宠物标题照片" prop="petTitlePhoto">
        <el-upload
          :file-list="form.petTitlePhoto"
          class="upload-demo"
          action="api/noauth/upload/image"
          :limit="1"
          list-type="picture-card"
          :on-exceed="() => onExceed(1)"
          :on-preview="handlePictureCardPreview"
          :before-upload="(uploadFile) => beforeUpload(uploadFile)"
          :on-success="(response) => onSuccess(response, 'petTitlePhoto')"
          :on-error="(error) => onError(error)"
          :on-remove="
            (uploadFile, uploadFiles) => onRemove(uploadFile, 'petTitlePhoto')
          "
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="宠物详情图片" prop="petDetailPhoto">
        <el-upload
          :file-list="form.petDetailPhoto"
          class="upload-demo"
          action="api/noauth/upload/image"
          :limit="1"
          list-type="picture-card"
          :on-exceed="() => onExceed(1)"
          :on-preview="handlePictureCardPreview"
          :before-upload="(uploadFile) => beforeUpload(uploadFile)"
          :on-success="(response) => onSuccess(response, 'petDetailPhoto')"
          :on-error="(error) => onError(error)"
          :on-remove="
            (uploadFile, uploadFiles) => onRemove(uploadFile, 'petDetailPhoto')
          "
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="宠物轮播图" prop="petCarouselPhotos">
        <el-upload
          :file-list="form.petCarouselPhotos"
          class="upload-demo"
          action="api/noauth/upload/image"
          multiple
          :limit="5"
          list-type="picture-card"
          :on-exceed="() => onExceed(5)"
          :before-upload="(uploadFile) => beforeUpload(uploadFile)"
          :on-success="(response) => onSuccess(response, 'petCarouselPhotos')"
          :on-error="(error) => onError(error)"
          :on-preview="handlePictureCardPreview"
          :on-remove="
            (uploadFile, uploadFiles) =>
              onRemove(uploadFile, 'petCarouselPhotos')
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
const applyPetType = useDictStore().dict?.applyPetType;
const petSex = useDictStore().dict?.petSex;

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
  petName: [{ required: true, message: "该项必填", trigger: "blur" }],
  petSex: [{ required: true, message: "该项必填", trigger: "blur" }],
  petCategory: [{ required: true, message: "该项必填", trigger: "blur" }],
  birthday: [{ required: true, message: "该项必填", trigger: "blur" }],
  petColour: [{ required: true, message: "该项必填", trigger: "blur" }],
  isRecommend: [{ required: true, message: "该项必填", trigger: "blur" }],
  isTopping: [{ required: true, message: "该项必填", trigger: "blur" }],
  petTitlePhoto: [{ required: true, message: "该项必填", trigger: "blur" }],
  petDetailPhoto: [{ required: true, message: "该项必填", trigger: "blur" }],
  petCarouselPhotos: [{ required: true, message: "该项必填", trigger: "blur" }],
  petPrice: [{ required: true, message: "该项必填", trigger: "blur" }],
  sterilization: [{ required: true, message: "该项必填", trigger: "blur" }],
};
const formRef = ref<FormInstance>();

const defaultData = {
  petName: "",
  petSex: "",
  petCategory: "",
  petColour: "",
  isRecommend: false,
  isTopping: false,
  petTitlePhoto: [],
  petDetailPhoto: [],
  petCarouselPhotos: [],
  birthday: "",
  petPrice: "",
  sterilization: "",
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
  if (type == "petCarouselPhotos") {
    form.value[type].push(res.data);
  } else {
    form.value[type] = [res.data];
  }
  loading.value = false;
  ElMessage.success(res.message);
};

const onRemove = (uploadFile, type) => {
  if (type !== "petCarouselPhotos") {
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
        petTitlePhoto: form.value.petTitlePhoto[0]?.url,
        petDetailPhoto: form.value.petDetailPhoto[0]?.url,
        petCarouselPhotos: form.value.petCarouselPhotos.map((el) => el.url),
      };
      props.updateData(data);
    } else {
      return false;
    }
  });
};
</script>

<style scoped></style>
