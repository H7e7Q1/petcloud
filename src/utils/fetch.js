import axios from "axios";
import qs from "qs";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const baseURL = import.meta.env.VITE_BASE_URL;
const TIMEOUT_MILLISECONDS = 60000; // 超时链接
const instance = axios.create({
  baseURL: baseURL,
  timeout: TIMEOUT_MILLISECONDS,
});
instance.interceptors.request.use(
  (config) => {
    // 每个接口新增时间戳
    // let timestamp = new Date().getTime()
    // if (config.url && config.url.includes('?')) {
    //   config.url = `${config.url}&t=${timestamp}`
    // } else {
    //   config.url = `${config.url}?t=${timestamp}`
    // }
    //PUT POST DELETE方式提交的数据格式化
    if (
      (config.method === "post" ||
        config.method === "put" ||
        config.method === "delete") &&
      config.headers["Content-Type"] !== "application/json"
    ) {
      config.data = qs.stringify(config.data);
    }
    const token = localStorage.getItem("token");
    // 在发送请求之前 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers["satoken"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (res) => {
    if (res.data.code.toString().startsWith(2)) {
      return res.data;
    } else if (res.data.code == 401) {
      ElMessageBox.confirm("登录信息已过期，请重新登录", {
        title: "提示",
        confirmButtonText: "确定",
        showCancelButton: false,
        showClose: false,
        type: "warning",
      }).then(() => {
        localStorage.removeItem("token");
        router.go(0);
      });
    } else {
      let resErr = {
        message: res.data.message,
      };
      ElMessage.error({
        message: res.data.message,
      });
      return Promise.reject(resErr);
    }
  },
  (error) => {
    switch (error.response && error.response.status) {
      case 400:
        error.message = "请求错误(400)";
        ElMessage.error({
          message: error.response.data.msg || error.message,
        });
        break;
      case 401:
        error.message = "登录信息已过期，请重新登录"; // (401)
        ElMessageBox.confirm(error.response.data.msg || error.message, {
          title: "提示",
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          type: "warning",
        }).then(() => {
          localStorage.removeItem("token");
          router.push("/login");
        });
        break;
      case 403:
        error.message = "拒绝访问(403)";
        break;
      case 404:
        error.message = "请求出错(404)";
        break;
      case 408:
        error.message = "请求超时(408)";
        ElMessage.error({
          message: error.response.data.msg || error.message,
        });
        break;
      case 500:
        error.message = "服务器错误(500)";
        ElMessage.error({
          message: error.response.data.msg || error.message,
        });
        break;
      case 501:
        error.message = "服务未实现(501)";
        break;
      case 502:
        error.message = "网络错误(502)";
        break;
      case 503:
        error.message = "服务不可用(503)";
        break;
      case 504:
        error.message = "网络超时(504)";
        break;
      case 505:
        error.message = "HTTP版本不受支持(505)";
        break;
    }
    if (
      error.code === "ECONNABORTED" &&
      error.message.indexOf("timeout") !== -1
    ) {
      ElMessage.error({
        message: "网络异常",
      });
    }
    return Promise.reject(error);
  }
);
export default instance;
