import { defineStore } from "pinia";
import { ref } from "vue";
import type { Image, LikeProduct } from "../types/shopType";
export const useShopStore = defineStore('shop', () =>{
    const shopList = ref<Image[]>([
        {   
            storeName: 'PCMY旗舰店',
            name: 'PCMY 心想事橙红色圆领',
            color: '红色',
            size: 'XL',
            originalPrice: 159,
            salePrice: 158.42,
            discount: 0.58,
            image: 'https://gw.alicdn.com/bao/uploaded/i2/2206530235135/O1CN01PcgoDS1nnsoMjcBLl_!!2206530235135.jpg_.webp' // 替换为实际图片路径
        },
        {   
            storeName: 'CH 高端女装',
            name: '美式复古水洗工装男裤',
            color: '灰色',
            size: 'XL',
            originalPrice: 88,
            salePrice: 87.42,
            discount: 0.58,
            image: 'https://gw.alicdn.com/bao/uploaded/i3/1124265575/O1CN01GZW9fI1r3OvFS2K6H_!!1124265575.jpg_.webp' // 替换为实际图片路径
        },
        {   
            storeName: 'Awencoat 贝妍旗舰店',
            name: '贝妍新款睡衣女春秋季长袖家居服',
            color: '黑色',
            size: 'XL',
            originalPrice: 159,
            salePrice: 158.42,
            discount: 0.58,
            image: 'https://gw.alicdn.com/bao/uploaded/i2/746267782/O1CN010AS6sE27MD6brtJZS_!!746267782.jpg_.webp' // 替换为实际图片路径
        },
        {   
            storeName: '北极熊旗舰店',
            name: '羊羔绒外套，保暖加厚',
            color: '藏蓝色',
            size: 'L',
            originalPrice: 178,
            salePrice: 167.42,
            discount: 0.58,
            image: 'https://gw.alicdn.com/bao/uploaded/i3/2213079057901/O1CN01Z2eZ2T28EiKSgQdmo_!!2213079057901.jpg_.webp' // 替换为实际图片路径
        }
    ])
    const likeProduct = ref<LikeProduct[]>([
        {
            name: 'iphone16',
            price: 7899.00,
            description: '美观精致',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i4/713805254/O1CN01cztPpw1ogNxTqZ4D4_!!4611686018427383238-0-item_pic.jpg_.webp',
            layout: 'left'
        },
        {
            name: '德国CENVUE手摇铃',
            price: 125.00,
            description: '3个月~1岁婴儿',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i1/2216581355649/O1CN01Hb0N0G1rbIOMKPCVP_!!2216581355649.jpg_.webp',
            layout: 'right'
        }, 
        {
            name: 'Redmi Book 16',
            price: 3999.00,
            description: '科技办公',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i3/2200779971053/O1CN01JlXjqr1JeK4mUlffw_!!2200779971053.jpg_.webp',
            layout: 'right'
        },
        {
            name: '华为mate70',
            price: 5899.00,
            description: '遥遥领先',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i3/2402302075/O1CN01vfc5Mj1RCOrNLqacX_!!2402302075.jpg_.webp',
            layout: 'right'
        },
        {
            name: '儿童自行车',
            price: 348.00,
            description: '学龄前儿童',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i4/1087961154/O1CN01kZU9Ve1KOa4sE8fW2_!!1087961154.jpg_.webp',
            layout: 'right'
        },
        {
            name: '三折叠',
            price: 21089.00,
            description: '高端大气',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i4/1125595151/O1CN01xpb3KO1nvD7ki4aWg_!!1125595151.png_.webp',
            layout: 'left'
        },
        {
            name: '夏季少女碎花裙',
            price: 158.42,
            description: '黑色',
            sales: '销量1000+',
            image: 'https://gw.alicdn.com/bao/uploaded/i3/920063449/O1CN01i2p3Wc1bLh14Hzvo7_!!920063449.jpg_.webp',
            layout: 'left'
        },
        {
            name: 'Awencoat 工装裤',
            price: 167.42,
            description: '白灰色',
            sales: '销量1000+',
            image: 'https://gw.alicdn.com/bao/uploaded/i3/1124265575/O1CN01GZW9fI1r3OvFS2K6H_!!1124265575.jpg_.webp',
            layout: 'left'
        },
        {
            name: 'PCMY 心想事橙红色圆领',
            price: 158.42,
            description: '红色',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i4/2206530235135/O1CN01cUqzBS1nnsoOCsY0S_!!2206530235135.jpg_.webp',
            layout: 'left'
        },
        {
            name: '双面防水马甲',
            price: 158.42,
            description: '黑色',
            sales: '销量1000+',
            image: 'https://img.alicdn.com/imgextra/i2/2361180970/O1CN01EbgaAo1J2InIxglpl_!!2361180970-0-lubanu-s.jpg_.webp',
            layout: 'left'
        }   
    ]);
    return {
        shopList,
        likeProduct
    }
})