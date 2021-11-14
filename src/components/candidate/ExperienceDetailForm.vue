<template>
  <v-form ref="form" lazy-validation>
    <v-row>
      <slot />
      <v-col cols="6" class="pt-0">
        <v-text-field
          v-model="form.jobTitle"
          :rules="[rules.required]"
          label="Puesto"
          type="text"
        />
      </v-col>
      <v-col cols="6" class="pt-0">
        <v-text-field
          v-model="form.companyName"
          label="Empresa"
          :rules="[rules.required]"
          type="text"
        />
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-textarea v-model="form.jobDescription" label="Actividades y logros" type="text" />
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
              :rules="[rules.required]"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="form.startDate" type="month" @input="menuStartDate = false">
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="4" class="pt-0">
        <v-menu
          v-model="menuEndDate"
          :disabled="form.currentlyInSchool"
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
          <v-date-picker v-model="form.endDate" type="month" @input="menuEndDate = false">
          </v-date-picker>
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
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

import { levelItems } from '@/constants/candidate';
@Component
export default class ExperienceDetailsForm extends Vue {
  @Prop({
    default: {
      startDate: new Date(),
    },
  })
  form!: any;
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
