import { validateUnauthorizedError } from "@/auth/auth.validatod";
import { rules } from "@/helpers/form";
import axios from "axios";
import Vue from "vue";

export class ApplyComponent {

    public data = new Vue({
        data: {
            modal: false,
            file: null,
            loading: false,
            rules: rules,
            position: null
        }
    });

    constructor() {}

    public async getPosition(id: string) {
        try {
            this.data.position =  await (await axios.get("job-posts/"+id)).data;
        } catch (error) {
            validateUnauthorizedError(error);
        }
    }

    public validateId(id: string, context: any) {
        const isInvalidId = isNaN(parseInt(id));
        if (isInvalidId) {
            context.$router.replace('/');
        }
    }

    public async submitFile(context: any) {
        const isValid = context.$refs.form.validate();
        if (!isValid) {
          return;
        }
        const formData = new FormData();
        formData.append('file', this.data.file);
        try {
          this.data.loading = true;
          await axios.post(
            `/job-posts/${context.$route.params.id}/apply`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        } catch (error) {
            validateUnauthorizedError(error);
        } finally {
          this.data.loading = false;
          this.data.modal = false;
        }
      }
}