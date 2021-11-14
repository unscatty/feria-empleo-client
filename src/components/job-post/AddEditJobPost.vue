<template>
  <div class="text-center">
    <v-dialog v-model="show" max-width="650">
      <v-card>
        <v-card-title style="background: #1a7eba" class="headline text-center white--text">
          Agregar vacante
        </v-card-title>
        <v-container grid-list-md class="pa-5">
          <v-form ref="form" :disabled="loading" lazy-validation>
            <v-row class="px-1">
              <v-col cols="6">
                <v-text-field
                  v-model="form.jobTitle"
                  :rules="[rules.required]"
                  label="Nombre de la vacante"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="form.experience"
                  :items="experienceItems"
                  :rules="[rules.required]"
                  label="Experiencia"
                ></v-select>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="form.jobMode"
                  :items="jobPostModes"
                  :rules="[rules.required]"
                  label="Modalidad"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="form.jobType"
                  :items="jobPostTypes"
                  :rules="[rules.required]"
                  label="Jornada"
                ></v-select>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.salaryMin"
                  label="Salario mínimo"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.salaryMax"
                  label="Salario máximo"
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-combobox
                  v-model="form.skillSets"
                  :items="skillSetItems"
                  label="Habilidades necesarias"
                  item-text="name"
                  multiple
                  chips
                  deletable-chips
                  return-object
                ></v-combobox>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="Descripción de la vacante"
                  counter
                  :rules="[rules.maxLength(500, form.description)]"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-label class="mb-3">Requerimientos</v-label>
                <Wysiwyg v-model="form.requirements"></Wysiwyg>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="inputImage"
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
          <v-btn :loading="loading" color="#FF5072" dark @click="save"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator';
import { diffObjects, rules } from '@/helpers/form';
import { jobPostTypes, jobPostModes, experienceItems } from '@/constants/job-post';
import Cropper from '@/components/general/cropper.vue';
import Wysiwyg from '@/components/general/wysiwyg.vue';

import { namespace } from 'vuex-class';
import { VForm } from '@/models/form';
import { IJobPost, JobPostMode, JobPostType } from '@/models/job-post/job-post.interface';
const jobPost = namespace('JobPost');
@Component({ components: { Cropper, Wysiwyg } })
export default class AddEditJobPost extends Vue {
  // Props
  @Prop({ default: false }) dialog!: boolean;
  @Prop({ default: null }) position!: any;
  @Prop({ default: false }) isUpdate!: boolean;

  // Store
  @jobPost.Action
  public createJobPost!: (data: IJobPost) => void;

  @jobPost.Action
  public updateJobPost!: ({ id, data }: any) => void;

  @jobPost.State
  public skillSets!: any[];

  // Variables
  public inputImage: any = null;
  public image: any = null;
  public imageName: any = null;
  public imagePreview: any = null;

  public rules = rules;
  public loading = false;
  public dialogCropper = false;
  public jobPostTypes = jobPostTypes;
  public jobPostModes = jobPostModes;
  public experienceItems = experienceItems;
  public form: any = {
    jobType: JobPostType.FULL_TIME,
    jobMode: JobPostMode.HOME_OFFICE,
  };
  // used to know affected values when update job post
  public oldForm: any = {};

  // Refs
  @Ref('form') readonly formRef!: VForm;
  @Ref('cropper') readonly cropperRef!: any;

  get isEdit() {
    return this.position != null;
  }

  get skillSetItems() {
    return this.skillSets.map((s) => ({ name: s.name }));
  }

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
      if (this.isEdit) {
        const { tags, image } = this.position;
        const skillSets = tags;
        const data = { ...this.position, skillSets, image: null, company: null };
        if (image && image.imageURL) {
          this.imagePreview = image.imageURL;
        }
        this.form = { ...data };
        this.oldForm = { ...data };
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

  async save() {
    const isValid = this.formRef.validate();
    if (!isValid) {
      return;
    }
    this.loading = true;
    const data = {
      ...this.form,
      salaryMin: Number(this.form.salaryMin),
      salaryMax: Number(this.form.salaryMax),
    };

    if (this.form.skillSets) {
      data.skillSets = [];
      for (const skill of this.form.skillSets) {
        if (typeof skill === 'string' || skill instanceof String) {
          data.skillSets.push({ name: skill });
        } else {
          data.skillSets.push({ name: skill.name });
        }
      }
    }

    if (this.isUpdate) {
      // Update
      const formDiff = diffObjects(this.form, this.oldForm);
      // no changes made
      if (formDiff && Object.keys(formDiff).length === 0) {
        this.loading = false;
        this.$emit('close');
      }

      await this.updateJobPost({ id: this.position.id, data: formDiff });
    } else {
      // Create
      await this.createJobPost(data);
    }

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
      jobType: JobPostType.FULL_TIME,
      jobMode: JobPostMode.HOME_OFFICE,
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
