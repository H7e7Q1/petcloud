import { ElMessage } from "element-plus";
export const fileLimitation = (file) => {
    const allowedFileExtensions = [
        '.pdf',
        '.jpeg',
        '.jpg',
        '.png',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx'
    ];
    const isLt5M = file.size / 1024 / 1024 < 5;
    const isLt50M = file.size / 1024 / 1024 < 50;
    const maxFileNameLength = 200;
    const fileName = file.name;
    if (fileName.length > maxFileNameLength) {
        ElMessage.warning('文件名长度不能超过200个字符');
        return false;
    }

    const fileExtension = fileName
        .substring(fileName.lastIndexOf('.'))
        .toLowerCase();
    if (!allowedFileExtensions.includes(fileExtension.toLowerCase())) {
        ElMessage.warning('只支持上传 PDF、图片、Word 和 Excel 文件');
        return false;
    }

    if (fileExtension === '.pdf' && !isLt50M) {
        ElMessage.warning('PDF文件大小不能超过50MB');
        return false;
    } else if (fileExtension !== '.pdf' && !isLt5M) {
        ElMessage.warning('文件大小不能超过5MB');
        return false;
    }

    return true;
};