<template>
  <div class="signin">
    <BigLogo
      class="bg-logo"
      :r="300"
      :style="{ '--r': `300px` }"
      :show-bg="false"
    ></BigLogo>

    <div class="panel">
      <div class="title">
        <h2>
          Local Code
        </h2>
      </div>
      <!-- ref: https://docs.amplify.aws/ui/auth/authenticator/q/framework/vue#components -->
      <no-ssr>
        <amplify-authenticator
          username-alias="email"
          @handleAuthStateChange="onAuthChange"
        >
          <amplify-sign-up
            slot="sign-up"
            :form-fields.prop="formFields"
            username-alias="email"
            @handleAuthStateChange="onAuthChange"
          >
          </amplify-sign-up>
          <amplify-sign-in
            slot="sign-in"
            username-alias="email"
            @handleAuthStateChange="onAuthChange"
          ></amplify-sign-in>
        </amplify-authenticator>
      </no-ssr>
      <!-- NOTE: not sure if we neeed no-ssr -->

      <!-- LEGACY
      <a-form
        id="signin-form"
        class="form"
        :form="form"
        @submit.prevent="onSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'email',
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
            name="email"
            placeholder="E-mail"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="submit">
            Sign In
          </a-button>
          <a-button class="submit" @click="testSignIn">
            Sign In (Testing Account)
          </a-button>
        </a-form-item>
      </a-form>
      -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import BigLogo from '@/components/BigLogo'

export default {
  middleware: 'auth',
  components: {
    BigLogo,
  },
  data() {
    return {
      formFields: [
        // ref: https://github.com/aws-amplify/amplify-js/tree/master/packages/amplify-ui-components/src/components/amplify-form-field#properties
        {
          type: 'email',
          placeholder: 'Email',
          required: true,
        },
        {
          type: 'password',
          placeholder: 'Password',
          required: true,
        },
      ],
    }
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

  mounted() {
    if (window.location.search) this.signin()
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
          const { email } = values
          this.signup({ email })
        } else console.error(err)
      })
    },
    onSubmit(e) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const { email, password } = values

          this.$store
            .dispatch('auth/signin', { email, password })
            .then(({ user, err }) => {
              console.log(user, err)
              if (user) this.$message.success('Login succeeded!')
              else this.$message.error(err, 5)
            })
        } else console.error(err)
      })
    },
    onAuthChange(auth) {
      console.log('onAuthChange', auth)
      this.$store.dispatch('auth/check')
    },
    forgot() {
      console.log('forgot')
    },
    signup({ email }) {
      this.$store
        .dispatch('auth/signup', { email })
        .then(() => {
          this.$message.success('Email Sent')
          //  show guide
        })
        .catch(err => this.$message.error(err.$message, 5))
    },
    signin() {
      let email = window.localStorage.getItem('emailForSignIn')
      window.localStorage.removeItem('emailForSignIn')

      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation')
      }

      const link = window.location.href

      this.$store
        .dispatch('auth/signin', { email, link })
        .then(({ user, err }) => {
          console.log(user, err)
          if (user) this.$message.success('Login succeeded!')
          else this.$message.error(err, 5)
        })
    },
    testSignIn() {
      const username = 'ce.sandoval09@gmail.com'
      const password = 'a'
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
.signin {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  background-color: $bg-color;
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

.bg-logo {
  position: fixed;
  height: 100vh;
  width: 100vw;

  margin-left: calc(-1 * var(--r));
  margin-top: calc(-1 * var(--r));

  left: 75%;
  top: 80%;
}

.title {
  display: flex;
  justify-content: center;
  max-width: 200px;
  height: 48px;
  margin: 0 auto;
  margin-bottom: 40px;

  h2 {
    color: black;
    text-align: center;
    background: rgba(60, 222, 73, 0.3);
    margin: 16px;
  }
}
</style>
