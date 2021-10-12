import { lazyInject } from "@/app.container";
import { validateUnauthorizedError } from "@/auth/auth.validatod";
import { ISkill } from "@/models/skills/ISkill";
import axios from "axios";
import { findIndex, head, isEmpty, isEqual, isNull } from "lodash";
import Vue from "vue";
import { UpdateCandidateService } from "./edit-candidate.service";

const INDEX_NOT_FOUND = -1;

export class EditProfileComponent extends Vue {

    @lazyInject(UpdateCandidateService)
    private candidateService: UpdateCandidateService;

    public resume: File = null;
    public data = new Vue({
        data: { 
            candidate: null,
            contact: null,
            newSkill: null
        }
    })

    public getCandidate(): Promise<void> {
        axios.get("/candidate")
            .then((candidate: any) => {
                this.data.candidate = head(candidate.data);
                console.log(this.data.candidate);
                
            })
            .catch((error) => {
                validateUnauthorizedError(error);
            })
        return;
    }

    public getContactDetails(): Promise<void> {
        axios.get('/candidate/contact')
            .then((contactDetails: any) => {
                this.data.contact = head(contactDetails.data);
                if (isEmpty(this.data.contact) ) {
                    this.setEmptyContact();
                }
            })
            .catch((error) =>  {
                this.setEmptyContact();
                validateUnauthorizedError(error);
            })
        return;
    }

    public saveSkill() {
        this.data.candidate.skillSets.push({ name: this.data.newSkill, slug: this.data.newSkill});
        this.data.newSkill = "";
    }

    public removeSkill(item: ISkill) {
        const index = findIndex(this.data.candidate.skillSets, (skill: ISkill) => { return isEqual(skill.name, item.name)});
        if (index != INDEX_NOT_FOUND) {
            this.data.candidate.skillSets.splice(index, 1)
        }
    }

    public saveCandidate() {
        const formData = new FormData();
        formData.append('resume', this.resume);

        const candidateDto = {
            name: this.data.candidate.name,
            email: this.data.candidate.email,
            experienceDetails: this.data.candidate.experienceDetails,
            updateSkillSets: this.data.candidate.skillSets,
            contactDetails: this.data.contact,
            resume: formData
        };
        this.candidateService.updateCandidate(candidateDto)
        .then(() => {
            if (!isNull(this.resume)) {
                this.candidateService.updateResume(formData);
            }
        })
    }

    private setEmptyContact() {
        this.data.contact = {
            phone: "",
            address: "",
            linkedinUrl: "",
            facebookUrl: "",
            githubUrl: "",
            webSite: ""
        };
    }
}