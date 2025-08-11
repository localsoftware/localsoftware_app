<template>
  <div class="container">
    <section id="0">
      <BigLogo class="logo" :r="logoR" :show-bg="false" />
      <div
        class="content"
        :style="{
          'padding-left': `${150}px`,
          'padding-right': `${150}px`,
          display: 'flex',
        }"
      >
        <div style="padding-top: 10%;" class="leftSide">
          <h3>
            <b>LOCAL CODE</b>
          </h3>
          <p>
            DESKTOP TOOLS
          </p>
          <p>
            Installation
          </p>
        </div>

        <div class="rightSide">
          <div>
            <p>
              <b>1 - Open your command window </b>
            </p>
            <div>
              If you are a Windows user you can do that by going to your system
              search bar and typing: cmd
            </div>
            <div>
              If you are a Mac user you can do that by going to in your spolight
              search button and typing: Terminal
            </div>
          </div>

          <div style="padding-top :20px;">
            <p>
              <b> 2 - Type: </b>
            </p>
            <div>
              For Windows users:
            </div>
            <code>
              "C:\Program Files\Rhino 6\System\Yak.exe" install localcode
            </code>
            <p>
              If your Rhino is not instaled on your C: directory, you should
              change the path
            </p>
            <div>
              For Mac users:
            </div>
            <code>
              "/Applications/Rhino 7.app/Contents/Resources/bin/yak" install
              localcode
            </code>
          </div>

          <div style="padding-top :20px;">
            <p>
              <b>3 - Press enter </b>
            </p>

            <div>You should get the following message:</div>
            <div style="background-color: #eee;">
              <div><code>Downloading LocalCode (1.0.3)... </code></div>
              <div>
                <code>
                  Downloaded LocalCode (1.0.3) Installing LocalCode (1.0.3)...
                </code>
              </div>
              <div><code>Successfully installed LocalCode (1.0.3) </code></div>
            </div>

            <div style="padding-top :20px;">
              <b>
                4- Go to Rhino, open grasshopper and find your version of
                LocalCode on the tab: Extra
              </b>
            </div>
          </div>

          <div style="padding-top :20px;">
            <p>
              <b>Alternative Installation Method</b>
            </p>
            <div>
              Use Rhino 7's Package Manager. You can access the package manager
              by typing on Rhino's command line:
            </div>
            <div>
              <code>
                _PackageManager
              </code>
            </div>
            <div>Search for <b>LocalCode</b> and install it.</div>
            <div style="padding-top :20px;">
              <img src="testpackagemanager-wip.jpeg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
>
<script>
import BigLogo from '@/components/BigLogo'

export default {
  layout: 'standard',
  components: {
    BigLogo,
  },
  data: function() {
    return { logoR: 500 }
  },
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  color: $text-color-dark;
  font-size: 1.2em;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
code {
  background-color: #eee;
  border-radius: 3px;
  font-size: 16px;
  line-height: 16px;
  // font-family: courier, monospace !important;
  padding: 0 3px;
}

.logo {
  position: absolute;
  z-index: 0;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 1.075em;
}

section {
  z-index: 100;
  height: 100vh;
  position: relative;

  .content {
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);

    height: 100%;
    padding-top: 3rem;
    padding-bottom: 3rem;

    .rightSide {
      float: right;
      width: 60%;

      // font-family: 'Nunito', sans-serif;
      font-size: 16px;
    }

    .leftSide {
      float: left;
      padding-right: 2em;
      width: 40%;
      text-align: right;

      h3 {
        // font-family: 'Roboto', sans-serif;
        margin: 0px;
        width: 100%;
        font-size: 64px;
        font-weight: 300;
        color: black;
      }

      p {
        // font-family: 'Nunito', sans-serif;
        width: 100%;
        margin-bottom: 10px;
        line-height: 32px;
        color: #b4ae00;
        font-size: 32px;
      }
    }
  }
}
</style>
