<template>
  <v-form ref="form" lazy-validation>
    <v-row>
      <slot />

      <v-col cols="12" class="candidate-registration__input-item">
        <v-select
          v-model="form.level"
          :rules="[rules.required]"
          :items="levelItems"
          label="Nivel"
        ></v-select>
      </v-col>
      <v-col cols="6" class="candidate-registration__input-item">
        <v-text-field
          v-model="form.institutionName"
          :rules="[rules.required]"
          label="Escuela"
          type="text"
        />
      </v-col>
      <v-col cols="6" class="candidate-registration__input-item">
        <v-text-field
          v-model="form.degree"
          :rules="[rules.required]"
          label="Titulo o carrera"
          type="text"
        />
      </v-col>
      <v-col cols="4" class="candidate-registration__input-item">
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
              :rules="[rules.required]"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="form.startDate" type="month" @input="menuStartDate = false">
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="4" class="candidate-registration__input-item">
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
        <v-checkbox v-model="form.currentlyInSchool" label="Sigo estudiando"></v-checkbox>
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

import { levelItems } from '../../constants/candidate';
@Component
export default class EducationDetailsForm extends Vue {
  @Prop({
    default: {
      startDate: new Date(),
      currentlyInSchool: false,
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
