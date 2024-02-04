<template>
  <div>
    <el-dialog width="50%" append-to-body :visible.sync="visible">
      <div>
        <div class="app-info-tips-text">请妥善保管您的App Id和App Secret，防止泄露。</div>
        <div class="app-info-text"><span class="app-info-tips-text">App Id：</span>{{ appCode }}</div>
        <div class="app-info-text"><span class="app-info-tips-text">App Secret：</span>{{ appSecret }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onOk">知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'DialogModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      appCode: {
        type: String,
        default: ''
      },
      appSecret: {
        type: String,
        default: ''
      },
    },
    watch: {
      appCode(val) {
      }
    },
    methods: {
      onOk() {
        this.$emit('toggleClick');
      }
    }
  };
</script>
<style lang="scss" scoped>
.app-info-tips-text {
  font-size: 14px;
  color: #666;
}
.app-info-text {
  font-size: 18px;
  color: #333;
  padding-top: 10px;
}
</style>
