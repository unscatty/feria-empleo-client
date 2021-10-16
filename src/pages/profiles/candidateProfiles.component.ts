import { validateUnauthorizedError } from "@/auth/auth.validatod";
import axios from "axios";
import { head } from "lodash";
import Vue from "vue";
import VTooltip from 'v-tooltip';

Vue.use(VTooltip);

export class CandidateProfilesComponent {

    public data = new Vue({
        data: {
            candidate: null,
            contact: null
        }
    })

    public getCandidate(id: string) {
        axios.get("/candidate/" + id)
            .then((candidate: any) => {
                this.data.candidate = candidate.data;
            })
            .catch((error) => {
                validateUnauthorizedError(error);
            })
    }

    public getContactDetails(id: string) {
        axios.get('/candidate/contact/'+id)
            .then((contactDetails: any) => {
                this.data.contact = head(contactDetails.data);
            })
            .catch((error) =>  {
                validateUnauthorizedError(error);
            })
    }
}