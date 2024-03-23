<template>
  <div class="container">
    <el-card style="max-width: 480px">
      <template #header>
        <h2 class="header-title">Verify our Toy</h2>
      </template>
      <div class="input-container">
        <label for="idNumber">Your toy key:</label>
        <input type="text" id="idNumber" v-model="idNumber" class="input-field">
        <el-button color="#7D7DFF" :dark="isDark" @click="verify" class="verify-button">Verify</el-button>
      </div>
    </el-card>
  </div>
</template>

<style>
@font-face {
  font-family: 'cjkFonts';
  src: url('/fonts/cjkFonts_allseto_v1.woff2') format('woff2');
  /* 如果您有其他字体格式，请添加相应的引用 */
  font-weight: normal;
  font-style: normal;
}

/* 应用字体到所有元素 */
* {
  font-family: 'cjkFonts', sans-serif;
}

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 修改这里，使容器垂直居上 */
  height: 100vh;
  margin-top: 20px; /* 调整容器距离顶部的间距 */
}

.header-title {
  font-size: 1.5rem;
  margin: 0;
}

.input-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.input-container label {
  margin-right: 10px;
  font-weight: bold;
}

.input-field {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.verify-button {
  margin-left: 10px;
  border-radius: 4px;
  font-weight: bold;
}
</style>

<script>
export default {
  data() {
    return {
      idNumber: '' // 初始为空
    };
  },
  methods: {
    verify() {
      // 在这里添加验证逻辑，可以根据需求进行更改
      // 例如：验证身份证号码格式等
      console.log('进行验证:', this.idNumber);
    }
  }
};
</script>
