import { defineStore } from 'pinia';
import { getAdminInfo } from "@/api/index";
export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            userInfo: {
                "id": '',
                "contactName": '',
                "contactPhone": '',
                "storeLogo": '',
                "storeName": '',
                "username": ''
            }
        };
    },
    getters: {
        getUserInfo: (state) => state.userInfo,
    },
    actions: {
        async getAdminInfoHandle() {
            const res = await getAdminInfo()
            this.userInfo = res.data
        }
    },
    persist: true
});
