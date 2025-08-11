<template>
  <div class="signin">
    <BigLogo
      class="bg-logo"
      :r="logoR"
      :style="{ '--r': `${logoR}px` }"
    ></BigLogo>

    <div class="panel">
      <div class="card">
        <div class="title">
          <h3><b>LOCAL CODE</b></h3>
        </div>

        <a-form
          id="signin-form"
          :form="form"
          class="form"
          @submit="handleSubmit"
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
              class="email-input"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button class="submit-button" type="primary" html-type="submit">
              Sign In
            </a-button>
            <a-button class="submit-button" type="primary">
              Create Account
            </a-button>
            <a-button class="submit-button" @click="testSignIn">
              Sign In (Testing Account)
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BigLogo from '@/components/BigLogo'
import Icon from '@/components/Icon'

export default {
  layout: 'standard',
  components: {
    BigLogo,
    Icon,
  },
  data() {
    return {
      logoR: 700,
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
    this.logoR = 0.5 * window.innerWidth
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
      const username = 'mtx55514@cuoly.com'
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
.card {
  background-color: #ffffff55;
  padding: 7em 3em;
  z-index: 20;
}

.form {
  max-width: 300px;
  display: block;
  text-align: center;

  .email-input {
    border-radius: 10px;
    border: 1px solid $btn-color;
  }

  .forgot {
    cursor: pointer;
  }
  .submit-button {
    border-radius: 10px;
    border: 1px solid $btn-color;
    display: inline-block;
    width: 100%;
    color: white;
    background-color: $btn-bg-color;

    &:hover {
      background-color: $btn-bg-color-hover;
      color: $btn-bg-color;
      border: 1px solid $btn-bg-color;
    }
  }

  .alternateSignIn {
    display: flex;
    justify-content: center;
  }
}

.bg-logo {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  margin-left: calc(-1 * var(--r));
  margin-top: calc(-1 * var(--r));

  left: 0%;
  top: 50%;
}

.title {
  display: flex;
  justify-content: center;
  max-width: 300px;
  height: 48px;
  margin: 0 auto;
  margin-bottom: 40px;

  h3 {
    font-size: 40px;
    font-weight: 400;
    // font-family: 'Rosboto', sans-serif;
  }
  h2 {
    color: black;
    text-align: center;
    margin: 16px;
  }
}
</style>
