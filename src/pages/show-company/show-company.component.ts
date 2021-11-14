import { validateUnauthorizedError } from "@/auth/auth.validatod";
import axios from "axios";
import Vue from "vue";

export class ShowCompanyComponent {

    public data = new Vue({
        data: {
            initialPositions: [],
            filteredPositions: [],
            company: null,
            filterText: ''
        }
    });

    public filterPosition(): void {
        console.log(this.data.filterText);
        this.data.filterText = this.data.filterText.toLowerCase();
        const exp = '^.*' + this.data.filterText + '.*$';
        const regex = new RegExp(exp, 'g');
        const matches = [];
        for (const position of this.data.initialPositions) {
            if (regex.test(position.jobTitle.toLowerCase())) {
                matches.push(position);
            }
        }
        this.data.filteredPositions = matches;
    }

    public async getEmployerById(id: string): Promise<void> {
        try {
            this.data.company =  await (await axios.get("company/" + id)).data
        } catch (error) {
            validateUnauthorizedError(error);
        }
    }

    public async getPositionsByCompany(): Promise<void> {
        try {
            this.data.initialPositions = await (await axios.get("job-posts?companyId="+ this.data.company.id)).data.items;
            this.data.filteredPositions = this.data.initialPositions;
        } catch (error) {
            validateUnauthorizedError(error);
        }
    }
}
