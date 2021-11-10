<template>
  <v-form ref="form" lazy-validation>
    <v-row>
      <slot />

      <v-col cols="12" class="candidate-registration__input-item">
        <v-select :rules="[rules.required]" v-model="form.level" :items="levelItems" label="Nivel"></v-select>
      </v-col>
      <v-col cols="6" class="candidate-registration__input-item">
        <v-text-field :rules="[rules.required]" label="Escuela" v-model="form.institutionName" type="text" />
      </v-col>
      <v-col cols="6" class="candidate-registration__input-item">
        <v-text-field :rules="[rules.required]" label="Titulo o carrera" v-model="form.degree" type="text" />
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
          <v-date-picker type="month" v-model="form.startDate" @input="menuStartDate = false">
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="4" class="candidate-registration__input-item">
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
  form!: Object;
  @Ref('form') readonly formRef!: VForm;

  menuStartDate: any = null;
  menuEndDate: any = null;

  levelItems: any[] = levelItems;

  @Watch('form')
  changeForm() {
    console.log(this.form);
  }

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
