import { defineStore } from "pinia";
import { ref } from "vue";
import type { Image } from "../types/homeType";

export const useHomeStore = defineStore('home', () =>{
    const images = ref<Image[]>([
        {
            url: './src/assets/image/image1.png',
            title: '广州',
            description: '夏季精选'
        },
        {
            url: './src/assets/image/image2.png',
            title: '广州',
            description: '夏季精选'
        },

        {
            url: './src/assets/image/image3.png',
            title: '广州',
            description: '夏季精选'
        }
    ]);
    return{
        images
    }

}); 