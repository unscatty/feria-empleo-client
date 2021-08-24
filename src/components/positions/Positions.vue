<template>
  <v-card>
    <v-toolbar elevation="1" color="#f7f7f7">
      <v-toolbar-title>
        {{ position.company.name }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <span v-if="position.createdAt" class="position__creation-date">{{
        timeAgo(new Date(position.createdAt))
      }}</span>
    </v-toolbar>

    <v-list-item v-if="compacted" class="align-start mt-4">
      <v-list-item-avatar tile size="150">
        <v-img
          v-if="position.imageUrl"
          :src="position.imageUrl"
          class="image"
          height="100"
        ></v-img
      ></v-list-item-avatar>
      <v-list-item-content class="align-self-start mt-4">
        <div>
          {{ position.description }}
        </div>
      </v-list-item-content>
    </v-list-item>

    <v-img
      v-if="position.imageUrl && !compacted"
      :src="position.imageUrl"
      class="main-img"
    ></v-img>

    <v-card-title> {{ position.jobTitle }} </v-card-title>
    <v-card-text v-if="!compacted">
      <v-row>
        <v-col>
          <v-btn elevation="0" small dark color="#51a5fb">
            {{ formatType(position.jobType)   }}
          </v-btn>
          <strong class="ml-2"
            >{{ formatMoney(position.salaryMin) }} / mes</strong
          >
        </v-col>
        <v-col cols="12">
          <p>{{ position.description }}</p>
        </v-col>
        <v-col class="text-left">
          <router-link v-if="showSeeMore" :to="`/apply/${position.id}`">
            <span class="text-right d-block">Ver más</span>
          </router-link>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-if="compacted">
      <v-row>
        <v-col>
          <v-btn elevation="0" small dark color="#51a5fb">
            {{ formatType(position.jobType) }}
          </v-btn>
          <strong class="ml-2"
            >{{ formatMoney(position.salaryMax) }} / mes</strong
          >
        </v-col>

        <v-col class="text-left">
          <router-link v-if="showSeeMore" :to="`/apply/${position.id}`">
            <span class="text-right d-block">Ver más</span>
          </router-link>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { timeAgo } from '../../utils/time-ago';
import { formatMoney } from '../../utils/format-money';
import { Component, Vue, Prop } from "vue-property-decorator";
import { JobTypeEnum } from '@/utils/enums';
import { isEqual } from 'lodash';

@Component
export default class Positions extends Vue {

    @Prop(Object) readonly position: any;
    public compacted: boolean;
    public showSeeMore: boolean;

    constructor() {
        super();
        this.compacted = false;
        this.showSeeMore = true;
    }

    public timeAgo(time: Date) {
        return timeAgo(time);
    }

    public formatMoney(amount: number) {
        return formatMoney(amount);
    }

    public formatType(type: string) {
        return isEqual('full_time', type) ? JobTypeEnum.full_time : JobTypeEnum.part_time;
    }
}
</script>

<style scoped>
@import "./positions.css";
</style>