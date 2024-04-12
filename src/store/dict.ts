import { defineStore } from 'pinia';
export const useDictStore = defineStore('dict', {
    state: () => {
        return {
            dict: {
                petSex:[
                    {
                        label: '公',
                        value: 'MALE'
                    },
                    {
                        label: '母',
                        value: 'FEMALE'
                    }
                ],
                //适用宠物分类
                applyPetType: [
                    {
                        label: '牧羊犬',
                        value: 'SHEPHERD_DOG'
                    },
                    {
                        label: '哈士奇',
                        value: 'SIBERIAN_HUSKY_DOG'
                    },
                    {
                        label: '拉布拉多',
                        value: 'LABRADOR_DOG'
                    },
                    {
                        label: '柴犬',
                        value: 'FIREWOOD_DOG'
                    },
                    {
                        label: '美国短尾猫',
                        value: 'AMERICAN_BOBTAIL_CAT'
                    },
                    {
                        label: '布偶猫',
                        value: 'PUPPET_CAT'
                    },
                    {
                        label: '波斯猫',
                        value: 'PERSIAN_CAT'
                    },
                    {
                        label: '狸花猫',
                        value: 'RACCOON_CAT'
                    }
                ],
                //知识分类
                knowledgeType: [
                    {
                        label: '喂养知识',
                        value: 'FEED'
                    },
                    {
                        label: '清洁知识',
                        value: 'CLEAN'
                    },
                    {
                        label: '生理知识',
                        value: 'BIRTH'
                    },
                    {
                        label: '疫苗知识',
                        value: 'VACCINE'
                    },
                ],
                //服务分了
                serviceType: [
                    {
                        label: '医疗服务',
                        value: 'MEDICAL'
                    },
                    {
                        label: '美容服务',
                        value: 'BEAUTY'
                    },
                    {
                        label: '寄养服务',
                        value: 'FURTION'
                    },
                    {
                        label: '训练服务',
                        value: 'TRAIN'
                    },
                    {
                        label: '保险服务',
                        value: 'INSURANCE'
                    },
                    {
                        label: '其它服务',
                        value: 'OTHER'
                    },
                ],
                //知识分类
                productType: [
                    {
                        label: '狗狗主粮',
                        value: 'DOG_MAIN_FOOD'
                    },
                    {
                        label: '猫咪主粮',
                        value: 'CAT_MAIN_FOOD'
                    },
                    {
                        label: '狗狗零食',
                        value: 'DOG_SNACK'
                    },
                    {
                        label: '猫咪零食',
                        value: 'CAT_SNACK'
                    },
                    {
                        label: '狗狗玩具',
                        value: 'DOG_TOY'
                    },
                    {
                        label: '猫猫玩具',
                        value: 'CAT_TOY'
                    },
                    {
                        label: '常用药',
                        value: 'COMMON_MEDICINE'
                    },
                    {
                        label: '驱虫清洁',
                        value: 'DISINFECTANT_CLEANER'
                    },
                    {
                        label: '生活日常',
                        value: 'LIFE_DAILY'
                    },
                    {
                        label: '宠物服饰',
                        value: 'PET_CLOTHING'
                    }
                ],
                //订单状态
                productOrderStatus: [
                    {
                        label: '待支付',
                        value: 'WAIT_PAY'
                    },
                    {
                        label: '待发货',
                        value: 'WAIT_DELIVERY'
                    },

                    {
                        label: '待收货',
                        value: 'WAIT_RECEIVE'
                    },
                    {
                        label: '已完成',
                        value: 'FINISHED'
                    },
                    {
                        label: '已取消',
                        value: 'CANCELLED'
                    }
                ],
                //订单状态
                petOrderStatus: [
                    {
                        label: '待支付',
                        value: 'WAIT_PAY'
                    },
                    {
                        label: '待发货',
                        value: 'WAIT_DELIVERY'
                    },

                    {
                        label: '待收货',
                        value: 'WAIT_RECEIVE'
                    },
                    {
                        label: '已完成',
                        value: 'FINISHED'
                    },
                    {
                        label: '已取消',
                        value: 'CANCELLED'
                    }
                ],
                 //订单状态
                 petServiceOrderStatus: [
                    {
                        label: '待支付',
                        value: 'WAIT_PAY'
                    },
                    {
                        label: '已完成',
                        value: 'FINISHED'
                    },
                    {
                        label: '已取消',
                        value: 'CANCELLED'
                    }
                ]
            }
        };
    },
    getters: {
        getUserInfo: (state) => state.dict,
    },
    persist: true
});
