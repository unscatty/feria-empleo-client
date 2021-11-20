<template>
  <v-dialog v-model="show" max-width="750">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <cropper
          ref="cropper"
          class="cropper mb-3"
          image-restriction="stencil"
          :restrictions="sizeRestrictions"
          :auto-zoom="true"
          :stencil-size="{
            width: 480,
            height: 480,
          }"
          cross-origin
          :stencil-props="{
            aspectRatio: 1,
          }"
          :trasition-time="0"
          :src="image"
          @error="onError"
        ></cropper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="crop">Recortar</v-btn>
        <v-btn color="secondary darken-1" text @click="cancel">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Ui from '@/store/modules/ui';
import { canvasToBlob, CropResult } from '@/utils/cropper.util';
import { Cropper, SizeRestrictions } from 'vue-advanced-cropper';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const uiStore = namespace('Ui');

@Component({ components: { Cropper } })
export default class CropperDialog extends Vue {
  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: false, default: undefined })
  imageType: string;

  @Prop({ type: String, required: false, default: 'Recortar imagen' })
  title: string;

  @Prop({
    type: Object,
    required: false,
    default: (): Partial<SizeRestrictions> => ({
      minWidth: 300,
      minHeight: 300,
    }),
  })
  sizeRestrictions: Partial<SizeRestrictions>;

  @Prop({ default: false })
  showDialog: boolean;

  @Ref('cropper')
  readonly cropperRef: Cropper;

  @uiStore.Action
  showToast: typeof Ui.prototype.showToast;

  get show() {
    return this.showDialog;
  }

  set show(value) {
    if (!value) {
      this.close();
    }
  }

  cancel() {
    this.show = false;
  }

  @Emit()
  close() {
    return;
  }

  @Emit()
  cropped(result: CropResult) {
    return result;
  }

  async crop() {
    const result = await this.getCropResult();

    this.cropped(result);

    // Close
    this.show = false;
  }

  async getCropResult(): Promise<CropResult> {
    const result: CropResult = {
      blob: undefined,
      imageSrc: '',
    };

    const { canvas } = this.cropperRef.getResult();

    result.blob = await canvasToBlob(canvas, this.imageType || undefined);
    result.imageSrc = URL.createObjectURL(result.blob);

    return result;
  }

  onError() {
    // Show error message
    this.showToast({
      text: 'No se puede recortar esta imagen',
      color: 'error',
    });

    // Close dialog
    this.show = false;
  }
}
</script>

<style lang="scss" scoped>
.cropper {
  height: 500px;
  background: #ddd;
}
</style>
