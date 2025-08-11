<template>
  <a-carousel
    arrows
    :slides-to-show="2"
    :dots="false"
    :adaptive-height="true"
    :center-mode="true"
  >
    <div slot="prevArrow" class="custom-slick-arrow" style="left: 20px;">
      <a-icon type="left" />
    </div>
    <div slot="nextArrow" class="custom-slick-arrow" style="right: 20px">
      <a-icon type="right" />
    </div>

    <div>
      <div class="box grabbable">
        <img
          src="~/assets/case_studies/160426-LC-Book_Page_010.jpg"
          width="100%"
        />
      </div>
    </div>
    <div>
      <div class="box grabbable">
        <img
          src="~/assets/case_studies/160426-LC-Book_Page_011.jpg"
          width="100%"
        />
      </div>
    </div>
    <div>
      <div class="box grabbable">
        <img
          src="~/assets/case_studies/160426-LC-Book_Page_012.jpg"
          width="100%"
        />
      </div>
    </div>

    <div>
      <div class="box grabbable">
        <img
          src="~/assets/case_studies/160426-LC-Book_Page_013.jpg"
          width="100%"
        />
      </div>
    </div>

    <div>
      <div class="box grabbable">
        <img
          src="~/assets/case_studies/160426-LC-Book_Page_017.jpg"
          width="100%"
        />
      </div>
    </div>
  </a-carousel>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.box {
  // width: 30vw;
  // height: 30vw;
  margin-right: 10px;
  background-color: white;
  overflow: scroll;
  min-width: 30vw;
  // min-height: 40vw;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  overflow: hidden;
}
</style>
<style scoped>
.grabbable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}

.ant-carousel {
  position: relative;
  /* margin-top: 0; */
}

.ant-carousel >>> .slick-list h3 {
  /* height: 85vh; */
}

.ant-carousel >>> .slick-slide h3 {
  color: #000;
}

.ant-carousel >>> .slick-slide {
  text-align: center;
  overflow: hidden;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 40px;
  height: 60px;
  font-size: 40px;
  color: #000;
  background-color: rgba(31, 45, 61, 0);
  opacity: 0.3;
  z-index: 20;
}

.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}

.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 1;
}
</style>
