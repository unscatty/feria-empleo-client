import { validateUnauthorizedError } from '@/auth/auth.validatod';
import { rules } from '@/helpers/form';
import axios from 'axios';
import { head, isNull } from 'lodash';
import Vue from 'vue';

export class ApplyComponent {
  public data = new Vue({
    data: {
      modal: false,
      file: null,
      loading: false,
      rules: rules,
      position: null,
      candidate: null,
    },
  });

  constructor() {}

  public async getPosition(id: string) {
    try {
      this.data.position = await (await axios.get('job-posts/' + id)).data;
      console.log(this.data.position);
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
    const formData = new FormData();
    formData.append('file', this.data.file);

    if (isNull(this.data.candidate.resume)) {
      this.data.loading = false;
      this.data.modal = false;
      return;
    }

    try {
      this.data.loading = true;
      await axios.post(`/job-posts/${context.$route.params.id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return 'success';
    } catch (error) {
      return error?.response || error;

      //validateUnauthorizedError(error);
    } finally {
      this.data.loading = false;
      this.data.modal = false;
    }
  }

  public getCandidate() {
    axios
      .get('/candidate')
      .then((candidate: any) => {
        this.data.candidate = head(candidate.data);
        console.log(this.data.candidate);
      })
      .catch((error) => {
        validateUnauthorizedError(error);
      });
  }
}
