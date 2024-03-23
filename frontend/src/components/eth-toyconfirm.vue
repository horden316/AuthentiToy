<template>
  <div class="container">
    <el-card style="max-width: 480px">
      <template #header>
        <h2 class="header-title ">Your toys are ready to ship</h2>
      </template>
      <div class="input-container">
        <label for="idNumber" >This toy ID is:</label>
        <input type="text" id="idNumber" v-model="idNumber" class="input-field">
      </div>
    </el-card>
  </div>
</template>

<style>

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
      console.log('Verifying:', this.idNumber);
    }
  }
};
</script>
