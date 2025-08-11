<template>
  <div class="side">
    <div :style="{ height: layerListHeight }" class="layerList">
      <div class="search">
        <a-input
          placeholder="search"
          :value="search"
          @input="e => $emit('update:search', e.target.value)"
          class="input"
        >
        </a-input>
        <div class="date">
          <a-icon type="down" />
          Date
        </div>
        <div class="ctr">
          <span class="display">
            <a-icon type="eye" />
            <span> {{ fLayers.length }} / {{ layers.length }} </span>
          </span>
          <!-- <span
            v-if="!disableShowAll"
            v-show="fLayers.length < layers.length"
            @click="showAllLayers"
            class="showAllBtn"
          >
            <a-icon type="fullscreen-exit" />
            <span> Show All </span>
          </span> -->
          <span @click="showAllLayers" class="showAllBtn">
            <a-icon type="fullscreen-exit" />
            <span> Show All </span>
          </span>
        </div>
      </div>
      <div ref="list" v-if="showList" class="list">
        <div
          v-for="layer in fLayers"
          :key="layer.id"
          :class="{ selected: layer[selectedAttr] }"
          @mouseenter="hoverLayerName(layer)"
          @mouseleave="hoverLayerName({})"
          class="layerCard"
          @contextmenu.stop.prevent="$emit('onLayerCtxMenu', layer.id)"
        >
          <span class="icon">
            <!-- FILE ICON -->
            <svg
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1484 1H0.810547V13.5H15.4051V4.5L11.1484 1Z"
                :stroke="layer.color"
                stroke-width="2"
              />
            </svg>
          </span>
          <span class="name">
            {{ layer[nameAttr] }}
            ({{ layer.progress }})
          </span>

          <span class="info">
            <slot v-if="layer.state === 'PROCESSED'" :layer="layer" name="info">
            </slot>
            <span v-else-if="layer.state === 'CREATED'">
              <fa-icon class="mr-2" icon="spinner" pulse />
            </span>
            <span v-else-if="layer.state === 'PROCESSING'">
              <progress class="progress" :value="layer.progress" max="100">
                {{ layer.progress }}
              </progress>
            </span>
            <span v-else-if="layer.state === 'FAILED'">
              <fa-icon class="mr-2" icon="exclamation-triangle" />
            </span>
          </span>

          <span class="action">
            <slot
              v-if="layer.state === 'PROCESSED'"
              :layer="layer"
              :fitLayerBounds="fitLayerBounds"
              name="action"
            >
            </slot>
            <span v-else>
              <span class="mr-2" @click.stop="$emit('onLayerDelete', layer.id)">
                <fa-icon icon="trash-alt" />
              </span>

              <!-- <fa-icon class="mr-2" icon="undo-alt" /> -->
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { featureCollection, bbox as getBBox } from '@turf/turf'

export default {
  props: {
    fitBounds: {
      required: true,
      type: Array,
      default: () => [],
    },
    layers: {
      required: true,
      type: Array,
      default: () => [],
    },
    fLayers: {
      required: true,
      type: Array,
      default: () => [],
    },
    highlight: {
      required: true,
      type: Object,
      default: () => ({}),
    },
    search: {
      required: true,
      type: String,
      default: '',
    },
    nameAttr: {
      required: true,
      type: String,
      default: '',
    },
    selectedAttr: {
      type: String,
      default: '',
    },
    showList: {
      type: Boolean,
      default: true,
    },
    disableShowAll: {
      type: Boolean,
      default: false,
    },
    layerListHeight: {
      type: String,
      default: '90%',
    },
  },
  data() {
    return {}
  },
  watch: {
    fLayers() {
      console.log('[SideLayerList] layers updated')
      this.$nextTick(() => {
        this.setListIO()
      })
    },
    showList(showList) {
      if (showList)
        this.$nextTick(() => {
          this.setListIO()
        })
    },
  },
  mounted() {
    this.fitAllLayerBounds(this.layers)

    this.$nextTick(() => {
      this.setListIO()
    })
  },
  beforeDestroy() {
    if (this.listIO) this.listIO.disconnect()
  },
  methods: {
    setListIO() {
      if (this.listIO) this.listIO.disconnect()

      this.listIO = new IntersectionObserver(this.handleListIO, {
        // option
        root: this.$refs.list,
        threshold: [0, 0.3, 0.6, 0.9, 1],
      })

      for (const element of document.querySelectorAll('.layerCard')) {
        this.listIO.observe(element)
      }
    },
    handleListIO(entries) {
      entries.map(({ target, intersectionRatio }) => {
        target.style.opacity =
          intersectionRatio === 1 ? 1 : intersectionRatio / 2
      })
    },
    showAllLayers() {
      this.fitAllLayerBounds(this.layers)
      this.$emit('update:search', '')
    },
    fitAllLayerBounds(layers) {
      console.log('fitAllLayerBounds', {
        layers: layers.map(({ bbox }) => bbox),
      })
      const layersCollection = featureCollection(layers.map(({ bbox }) => bbox))

      this.$emit('update:fitBounds', getBBox(layersCollection))
    },
    hoverLayerName(layer) {
      // console.log(`hoverLayerName(${layerId})`)
      this.$emit('update:highlight', layer)
    },
    fitLayerBounds(layer) {
      // this.map.fitBounds(getBBox(layer.bbox))
      this.$emit('update:fitBounds', getBBox(layer.bbox))
    },
    clearSearch() {
      this.$emit('update:search', '')
    },
  },
}
</script>
<style scoped></style>
<style lang="scss" scoped>
.side {
  position: absolute;

  top: 0px;
  left: 0px;

  padding-top: 25px;
  padding-left: 25px;

  $w: 350px;
  width: $w;
  height: 100%;

  pointer-events: none;

  color: white;

  z-index: 10;
}

.input {
  color: white;
  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 15px;

  width: 65%;
}
.date {
  width: 35%;

  height: 32px;
  line-height: 32px;
  text-align: center;
  float: right;
}

.layerList {
  width: 100%;
  // height: 100%;

  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  .search {
    height: 32px;
    padding: 0px 20px;

    /*
    /deep/ .input {
      * {
        color: white;
      }

      input {
        &:focus {
          box-shadow: none;
        }
      }
    }
    */

    .clearSearch {
      cursor: pointer;
    }

    .ctr {
      height: 0px;
      padding: 0px;

      font-size: 0.7rem;

      /deep/ * {
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        vertical-align: middle;
      }

      > * {
        line-height: 1.5;
      }

      .display {
        margin-left: 0.5rem;
      }

      .showAllBtn {
        cursor: pointer;
        // text-decoration: underline;
        position: absolute;
        right: 0px;
        padding: 0 20px;
        z-index: 100;
      }
    }
  }

  .list {
    max-height: calc(100% - 32px);
    overflow-y: auto;
    padding: 15px 20px;
    position: relative;

    &::-webkit-scrollbar {
      // background-color: #ffffff00;
      width: 0px;
    }

    .layerCard {
      // padding: 10px;
      margin: 6px 0px;
      // border-radius: 0.4rem;

      position: relative;
      overflow: visible;

      $h: 30px;
      border-radius: $h;
      height: $h;
      padding: 0px $h / 2;
      width: 100%;

      // background-color: white;
      background-color: rgba(255, 255, 0, 0.3);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);

      transition: opacity 0.5s;

      &.selected {
        box-shadow: inset 0px 0px 6px 3px white;
      }

      > * {
        margin: 0px;
        vertical-align: middle;
      }

      .icon {
        $s: 16px;
        width: $s;
        height: $s;
        margin: 0px;
        display: inline-flex;
      }

      $name-w: 120px;
      --name-w: 80%;
      .name {
        font-size: 14px;
        line-height: $h;
        letter-spacing: 0.2px;

        width: var(--name-w);
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        text-overflow: ellipsis;

        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
      }

      --show-action: 0;
      --display-info: flex;
      --display-action: none;

      &:hover {
        --show-action: 1;
        --display-info: none;
        --display-action: inline-block;
        --name-w: calc(#{$name-w} * 1);
      }

      .info {
        position: absolute;
        right: 0px;
        top: 0px;
        // margin-right: $h / 1.5;

        height: $h * 0.6;
        margin-top: $h * 0.2;
        margin-right: $h * 0.5;

        letter-spacing: 0.6px;

        display: var(--display-info);

        flex-direction: column;
        justify-content: space-around;
        align-items: start;

        // width: calc(100% - #{$name-w} - #{2 * $h});
        width: auto;

        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

        > * {
          margin: 0px;
          font-size: 0.7em;
          text-align: center;
        }
      }

      .action {
        position: absolute;
        right: $h / 2;
        top: 0px;

        line-height: $h;

        transition: opacity 0.1s;
        opacity: var(--show-action);
        display: var(--display-action);

        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 100%;

        > * {
          cursor: pointer;
          margin-left: 2px;
        }
      }
    }
  }

  .layerName {
    cursor: pointer;
  }

  .progress {
    --progress-bg: #000;
    --progress-color: #fff;

    appearance: none;

    width: 20px;
    height: 4px;

    border: 1px solid white;
    border-radius: 4px;
    overflow: hidden;

    background-color: var(--progress-bg);

    &::-webkit-progress-bar {
      background-color: var(--progress-bg);
    }
    &::-webkit-progress-value {
      background-color: var(--progress-color);
    }
    &::-moz-progress-bar {
      background-color: var(--progress-bg);
    }
  }
}
</style>
