<template>
    <div class="flex items-start py-2 pr-4">
        <div class="rounded-lg bg-blue-500 px-4 py-2 ml-4 text-white relative max-w-66">
            <div class="avatar absolute top-1 -left-7">
                <van-icon
                    class="iconfont"
                    size="1.5rem"
                    class-prefix="icon"
                    name="aislogo"
                    color="pink"
                />
            </div>
            <p v-html="Text" class="whitespace-pre-wrap"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
    msg: string;
}

const props = defineProps<Props>();
const Text = ref(processText(props.msg));

function processText(text: string) {
    // &emsp;的作用是在文本中插入四个不可分割的空格，以保持文本的排版格式。
    let processedText = text.replace(/\t/g, "&emsp;");
    // <br>标签是HTML中的一个空标签，用于在文本中插入换行符。
    processedText = processedText.replace(/\n/g, "<br>");
    // 移除#和*
    processedText = processedText.replace(/#/g, "");
    processedText = processedText.replace(/\*/g, "");
    return processedText;
}

</script>

<style lang="less" scoped>
/* Add any additional styles here */

</style>