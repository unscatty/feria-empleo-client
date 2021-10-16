import { validateUnauthorizedError } from '@/auth/auth.validatod';
import axios from 'axios';
import { head } from 'lodash';
import VTooltip from 'v-tooltip';
import Vue from 'vue';

Vue.use(VTooltip);

export class ProfileComponent {
  public data = new Vue({
    data: {
      candidate: null,
      contact: null,
    },
  });

  public getCandidate() {
    axios
      .get('/candidate')
      .then((candidate: any) => {
        console.log(candidate);

        this.data.candidate = head(candidate.data);
      })
      .catch((error) => {
        validateUnauthorizedError(error);
      });
  }

  public getContactDetails() {
    axios
      .get('/candidate/contact')
      .then((contactDetails: any) => {
        this.data.contact = head(contactDetails.data);
        console.log(this.data.contact);
      })
      .catch((error) => {
        validateUnauthorizedError(error);
      });
  }
}
