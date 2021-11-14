<template>
  <div class="text-center">
    <v-dialog v-model="show" max-width="650">
      <v-card>
        <v-card-title style="background: #1a7eba" class="headline text-center white--text">
          Invitar empresa
        </v-card-title>
        <v-container grid-list-md class="pa-5">
          <v-form ref="form" :disabled="loading" lazy-validation>
            <v-row class="px-1">
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  :rules="[rules.required]"
                  label="Nombre de la empresa"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  :rules="[rules.required]"
                  label="Email de la empresa"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="inputImage"
                  :rules="[rules.required]"
                  label="Imagen"
                  accept="image/*"
                  @change="setImage($event)"
                >
                </v-file-input>

                <Cropper
                  :dialog="dialogCropper"
                  :image="image"
                  :image-name="imageName"
                  @uploadPicture="onCropperResult"
                  @close="dialogCropper = false"
                ></Cropper>
              </v-col>

              <v-col v-if="imagePreview" class="text-center justify-center d-flex" cols="12">
                <v-img max-height="200" max-width="200" contain :src="imagePreview"> </v-img>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="loading" color="darken-1" text @click="show = false">Cancelar</v-btn>
          <v-btn :loading="loading" color="#FF5072" dark @click="send"> Invitar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator';
import { rules } from '@/helpers/form';
import Cropper from '@/components/general/cropper.vue';

import { VForm } from '@/models/form';
import { CompanyService } from '@/services/company.service';
import { CompanyInvite } from '@/models/company/company-forms';

@Component({ components: { Cropper } })
export default class InviteModal extends Vue {
  // Props
  @Prop({ default: false }) dialog!: boolean;
  @Prop({ default: null }) position!: any;
  @Prop({ default: false }) isUpdate!: boolean;
  @Prop({ required: true, type: CompanyService })
  service!: CompanyService;

  // Variables
  public inputImage: any = null;
  public image: any = null;
  public imageName: any = null;
  public imagePreview: any = null;

  public rules = rules;
  public loading = false;
  public dialogCropper = false;
  public form: CompanyInvite = {
    name: '',
    email: '',
    image: null,
  };

  // Refs
  @Ref('form') readonly formRef!: VForm;

  get show() {
    return this.dialog;
  }

  set show(value) {
    if (!value) {
      this.resetForm();
      this.$emit('close');
    }
  }

  @Watch('dialog')
  dialogChange(value: boolean) {
    if (value) {
      if (this.formRef) {
        this.formRef.resetValidation();
      }
    }
  }
  @Watch('dialogCropper')
  dialogCropperChange(value: boolean) {
    // if cropper is closed and no action is taken
    // remove value from input
    if (!value && !this.form.image) {
      this.inputImage = null;
    }
  }

  async send() {
    const isValid = this.formRef.validate();
    if (!isValid) {
      return;
    }

    this.loading = true;
    const companyInvitation = this.form;

    const response = await this.service.invite(companyInvitation);

    console.log(response);

    this.$emit('invited', response);

    this.loading = false;
    this.$emit('close');
  }

  onCropperResult(data: any) {
    this.form.image = data;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(data);
  }

  resetForm() {
    this.form = {
      name: '',
      email: '',
      image: null,
    };

    this.image = null;
    this.inputImage = null;
    this.imagePreview = null;
  }

  setImage(file: any) {
    if (!file) {
      this.imagePreview = null;
      return;
    }
    this.imageName = file.name;
    if (!file.type.includes('image/')) {
      alert('Please select an image file');
      return;
    }
    if (typeof FileReader === 'function') {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
        this.dialogCropper = true;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Sorry, FileReader API not supported');
    }
  }
}
</script>
