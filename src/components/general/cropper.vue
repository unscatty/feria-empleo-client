<template>
  <v-dialog v-model="show" max-width="750">
    <v-card>
      <v-card-title> Recortar imagen</v-card-title>
      <v-card-text>
        <cropper
          v-if="image"
          class="cropper mb-3"
          classname="cropper"
          :restrictions="pixelsRestriction"
          :stencil-props="{
            aspectRatio: 10 / 10,
          }"
          :src="image"
          @change="change"
        ></cropper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="
            $emit('uploadPicture', file);
            show = false;
          "
          >Recortar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'vue-property-decorator';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

@Component({
  components: { Cropper },
})
export default class AddEditJobPost extends Vue {
  // Props
  @Prop({ default: false }) dialog!: boolean;
  @Prop({ default: '' }) image!: string;
  @Prop({ default: null }) imageName!: string;

  // Refs
  @Ref('cropper') readonly cropperRef!: any;

  file: any = null;

  get show() {
    return this.dialog;
  }
  set show(value) {
    if (!value) {
      this.$emit('close');
    }
  }

  change({ canvas }: any) {
    this.file = this.dataURLtoFile(canvas.toDataURL(), this.imageName || 'newImage.jpeg');
  }
  dataURLtoFile(dataurl: any, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  pixelsRestriction() {
    return {
      minWidth: 300,
      minHeight: 300,
    };
  }
}
</script>

<style>
.cropper {
  height: 500px;
  background: #ddd;
}
</style>
