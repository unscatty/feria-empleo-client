<template>
  <div>
    <tiptap-vuetify v-bind:value="value" v-on:input="updateValue" :extensions="extensions" />
  </div>
</template>

<script lang="ts">
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from 'tiptap-vuetify';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({ components: { TiptapVuetify } })
export default class Wysiwyg extends Vue {
  @Prop({ default: '' }) value!: string;

  updateValue(value: any) {
    this.$emit('input', value);
  }

  extensions = [
    History,
    Blockquote,
    Link,
    Underline,
    Strike,
    Italic,
    ListItem,
    BulletList,
    OrderedList,
    [
      Heading,
      {
        options: {
          levels: [1, 2, 3],
        },
      },
    ],
    Bold,
    Code,
    HorizontalRule,
    Paragraph,
    HardBreak,
  ];
}
</script>

<style>
.tiptap-vuetify-editor__content,
.ProseMirror {
  min-height: 200px;
}
</style>
