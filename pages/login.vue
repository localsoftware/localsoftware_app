<template>
  <div class="login">
    <div class="panel">
      <div class="logo">
        <h2 class="mock">
          LOGO
        </h2>
      </div>
      <a-form id="login-form" :form="form" class="form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              },
            ]"
            name="username"
            placeholder="E-mail"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                ],
              },
            ]"
            name="password"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            <a-tooltip slot="addonAfter" placement="top">
              <template slot="title">
                <span>forgot?</span>
              </template>
              <a-icon class="forgot" type="question-circle" @click="forgot" />
            </a-tooltip>
          </a-input>
        </a-form-item>
        <!-- 
        <a-form-item v-bind="tailFormItemLayout">
          <a-checkbox v-decorator="['agreement', { valuePropName: 'checked' }]">
            I have read the
            <a href="">
              agreement
            </a>
          </a-checkbox>
        </a-form-item>
        -->
        <a-form-item>
          <a-button type="primary" html-type="submit" class="submit">
            Log in
          </a-button>
          Or
          <a href="">
            Sign up now!
          </a>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  watch: {
    user(user) {
      console.log({ user })
      if (user) this.$router.push({ path: '/app/layers' })
    },
  },
  fetch({ req, store, redirect }) {
    if (store.state.auth.user) {
      return redirect('/app')
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const { username, password } = values
          this.login({ username, password })
        } else console.error(err)
      })
    },
    forgot() {
      console.log('forgot')
    },
    login({ username, password }) {
      this.$store.dispatch('auth/login', { username, password }).then(user => {
        console.log(user)
        if (user) this.$message.success('Login succeeded!')
        else this.$message.error('Something may not be correct!', 5)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.panel {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  flex-direction: column;
}

.form {
  max-width: 380px;

  .forgot {
    cursor: pointer;
  }
  .submit {
    width: 100%;
  }
}

.logo {
  display: flex;
  justify-content: center;
  max-width: 92px;
  height: 48px;
  margin: 0 auto;
  margin-bottom: 40px;

  .mock {
    color: black;
    text-align: center;
    background: rgba(60, 222, 73, 0.3);
    margin: 16px;
  }
}
</style>
