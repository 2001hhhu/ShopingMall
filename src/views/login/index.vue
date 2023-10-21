<template>
  <div>
    <!-- 头部 -->
    <van-nav-bar title="登录" right-text="测试" left-arrow @click-left="$router.go(-1)" @click-right="onClickRight"/>
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
            {{ second === totalSecond ? '获取验证码' : second + '秒后重新发售' }}
          </button>
        </div>
      </div>

      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
import { getPiCode, getMsgCode, codeLogin } from '@/api/login.js'
// import { Toast } from 'vant'
export default {
  name: 'loginIndex',
  data () {
    return {
      piCode: '',
      picKey: '',
      picUrl: '',
      totalSecond: 60,
      second: 60,
      timer: null,
      mobile: '',
      picCode: '',
      msgCode: ''
    }
  },
  methods: {
    onClickLeft () {
      console.log('返回')
    },
    onClickRight () {
      console.log('按钮')
    },
    // 校验手机号和图形验证码
    validFn () {
      if (!(/^1[3-9]\d{9}$/.test(this.mobile))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!(/^\w{4}$/.test(this.picCode))) {
        this.$toast('请输入正确的验证码')
        return false
      }
      return true
    },
    async getPicCode () {
      // console.log(request)
      const { data: { base64, key } } = await getPiCode()
      this.picUrl = base64
      this.picKey = key
      // console.log(res)
      // Toast('创建成功')
    },
    async getCode () {
      if (!this.validFn()) {
        return
      }

      // console.log(1)
      if (!this.timer && this.second === this.totalSecond) {
        // 发送请求
        const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
        this.$toast('短信发送成功')
        console.log(res)
        this.timer = setInterval(() => {
          this.second--

          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = 60
          }
        }, 1000)
      }
    },
    async login () {
      if (!this.validFn()) {
        return
      }
      if (!/^\d{6}$/.test(this.msgCide)) {
        this.$toast('请输入正确的手机验证码')
      }
      const res = await codeLogin(this.mobile, this.msgCode)
      this.$store.commit('user/setUserInfo', res.data)
      console.log(res)
      // 回跳
      const url = this.$route.query.backUrl || '/'
      console.log(url)
      this.$router.replace(url)
    }
  },
  async created () {
    this.getPicCode()
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
