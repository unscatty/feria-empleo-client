<template>
  <div>
    <v-row>
      <v-col class="text-center text-md-center">
        <div class="v-input__slot">
          <v-checkbox
            v-model="updateImage"
            label="Cambiar imagen"
            hide-details
            class="align-center justify-center"
          >
            Hola
          </v-checkbox>
        </div>
        <v-avatar tile size="250">
          <img :src="imageToShow" alt="Company image" />
        </v-avatar>
        <div class="text-center mt-6">
          <v-btn
            class="ma-2"
            rounded
            :disabled="!updateImage"
            :loading="isSelectingFile"
            color="success"
            @click="upload"
            ><v-icon left> mdi-cloud-upload </v-icon>{{ uploadButtonText }}</v-btn
          >
          <v-btn class="ma-2" :disabled="!updateImage" text icon color="black" @click="openCropper"
            ><v-icon> mdi-crop </v-icon></v-btn
          >
          <v-btn v-if="false" class="ma-2" text icon color="error" @click="perform"
            ><v-icon> mdi-reload </v-icon></v-btn
          >
          <input
            ref="uploader"
            class="d-none"
            type="file"
            accept="image/*"
            @change="onFileChanged"
          />
        </div>
        <cropper-dialog
          v-if="imageToCrop"
          ref="cropRef"
          :image="imageToCrop"
          :image-type="fileMimeType"
          :title="croppertTitle"
          :show-dialog="showCropperDialog"
          @close="onCropClosed"
          @cropped="onCropResult"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import CropperDialog from '@/components/general/cropper.dialog.vue';
import Actionable from '@/helpers/actionable.interface';
import { filenameAndExtension, truncate } from '@/helpers/text';
import ICompany from '@/models/company/company.interface';
import CompanyStore, { COMPANY_STORE_NAME } from '@/store/modules/company';
import { CropResult, getMimeType, readAsArrayBuffer } from '@/utils/cropper.util';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const companyStore = namespace(COMPANY_STORE_NAME);

@Component({ components: { CropperDialog } })
export default class AvatarChange extends Vue implements Actionable {
  cropResult: CropResult = {
    blob: null,
    imageSrc: '',
  };

  imageToShow_ = '';

  // If image needs to be updated
  updateImage = false;

  // Cropper variables
  showCropperDialog = false;
  imageToCrop_ = '';
  isCroppingFile = false;
  croppertTitle: 'Recortar imagen' | 'Debes recortar la imagen' = 'Recortar imagen';

  // File upload variables
  uploadButtonDefaultText = 'Subir imagen';
  isSelectingFile = false;
  lastSelectedFileName = '';
  selectedFileName = '';
  fileMimeType: string = null;
  lastCroppedImage = '';

  @companyStore.State('toUpdate')
  readonly companyToUpdate: ICompany;

  @companyStore.Action
  setImageFile: typeof CompanyStore.prototype.setImageFile;

  @Watch('updateImage')
  updateImageChanged(value: boolean) {
    if (value) {
      this.imageToShow = this.imageToCrop;
    } else {
      this.imageToShow = this.companyToUpdate.imageURL;
    }
  }

  get uploadButtonText() {
    if (this.selectedFileName !== '') {
      const [filename, extension] = filenameAndExtension(this.selectedFileName);

      return truncate(filename, this.uploadButtonDefaultText.length - extension.length) + extension;
    }

    return this.uploadButtonDefaultText;
  }

  perform() {
    if (this.cropResult.blob) {
      const imageFile = new File(
        [this.cropResult.blob],
        this.selectedFileName || 'previous-image-crop'
      );

      this.setImageFile({ imageFile, update: this.updateImage });
    }
  }

  upload() {
    this.isSelectingFile = true;

    window.addEventListener('focus', () => (this.isSelectingFile = false), { once: true });
    const uploaderRef = this.$refs.uploader as any;
    // Click file input
    uploaderRef.click();
  }

  get imageToShow() {
    return this.imageToShow_ || this.companyToUpdate.imageURL || '';
  }

  set imageToShow(value) {
    this.imageToShow_ = value;
  }

  get imageToCrop() {
    return this.imageToCrop_ || this.imageToShow;
  }

  set imageToCrop(value) {
    this.imageToCrop_ = value;
  }

  async onFileChanged(e: Event) {
    const { files } = e.target as HTMLInputElement;

    if (files && files[0]) {
      const selectedFile = files[0];

      this.lastSelectedFileName = this.selectedFileName;
      this.selectedFileName = selectedFile.name;

      const blobURL = URL.createObjectURL(selectedFile);
      const mimeType = getMimeType(await readAsArrayBuffer(selectedFile));

      this.lastCroppedImage = this.imageToCrop;
      this.imageToCrop = blobURL;
      this.fileMimeType = mimeType;

      this.isCroppingFile = true;

      this.croppertTitle = 'Debes recortar la imagen';
      this.openCropper();
    }
  }

  openCropper() {
    this.showCropperDialog = true;
  }

  onCropResult(result: CropResult) {
    this.cropResult = result;

    URL.revokeObjectURL(this.imageToCrop);

    this.imageToShow = this.cropResult.imageSrc;
    this.imageToCrop = this.cropResult.imageSrc;

    if (this.isCroppingFile) {
      this.isCroppingFile = false;
    }
  }

  reset() {
    this.cropResult = {
      blob: null,
      imageSrc: '',
    };

    this.fileMimeType = null;
    this.imageToCrop = this.companyToUpdate.imageURL;
    this.imageToShow = this.companyToUpdate.imageURL;
    this.selectedFileName = '';
  }

  revertToLastImage() {
    this.imageToCrop = this.lastCroppedImage;
  }

  fileCropCanceled() {
    this.revertToLastImage();
    this.selectedFileName = this.lastSelectedFileName;
    this.fileMimeType = null;

    this.isCroppingFile = false;
  }

  onCropClosed() {
    this.showCropperDialog = false;
    this.croppertTitle = 'Recortar imagen';

    if (this.isCroppingFile) {
      this.fileCropCanceled();
    }
  }

  destroyed() {
    URL.revokeObjectURL(this.imageToCrop);
  }
}
</script>

<style lang="scss" scoped>
.v-input__slot {
  align-items: left;
  justify-content: center;
}
</style>
