<template>
  <v-form ref="form" lazy-validation>
    <v-row>
      <slot />
      <v-col cols="6" class="pt-0">
        <v-text-field :rules="[rules.required]" label="Puesto" v-model="form.jobTitle" type="text" />
      </v-col>
      <v-col cols="6" class="pt-0">
        <v-text-field label="Empresa" :rules="[rules.required]" v-model="form.companyName" type="text" />
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-textarea label="Actividades y logros" v-model="form.jobDescription" type="text" />
      </v-col>
      <v-col cols="4" class="pt-0">
        <v-menu
          ref="menu"
          v-model="menuStartDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="form.startDate"
              label="Inicio"
              readonly
              v-bind="attrs"
              v-on="on"
              :rules="[rules.required]"
            ></v-text-field>
          </template>
          <v-date-picker type="month" v-model="form.startDate" @input="menuStartDate = false">
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="4" class="pt-0">
        <v-menu
          :disabled="form.currentlyInSchool"
          v-model="menuEndDate"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="form.endDate"
              :disabled="form.currentlyInSchool"
              label="Termino"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker type="month" v-model="form.endDate" @input="menuEndDate = false"> </v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="4">
        <v-checkbox v-model="form.isCurrentjob" label="Aún trabajo aquí"></v-checkbox>
      </v-col>

      <v-col>
        <slot name="footer" :onSubmit="onSubmit"></slot>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { rules } from '@/helpers/form';
import { VForm } from '@/models/form';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

import { levelItems } from '@/constants/candidate';
@Component
export default class ExperienceDetailsForm extends Vue {
  @Prop({
    default: {
      startDate: new Date(),
    },
  })
  form!: Object;
  @Ref('form') readonly formRef!: VForm;

  menuStartDate: any = null;
  menuEndDate: any = null;

  levelItems: any[] = levelItems;

  get rules() {
    return rules;
  }

  onSubmit() {
    const isValid = this.formRef.validate();
    if (!isValid) {
      return;
    }
    this.$emit('onSubmitForm', this.form);
  }
}
</script>

<style></style>
