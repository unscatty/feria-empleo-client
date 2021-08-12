import axios from "axios";
import { isEmpty, isEqual } from "lodash";

const NOT_FOUND = -1;
export interface IFilters {
    type: string | null,
    modality: string | null,
    experience: string | null,
    employerId: string | null,
} 
export class HomeComponent {

    public positions: any[];
    public employers: any[];
    public positionsUrl: string;
    public initialPositionsUrl: string;
    public filters: IFilters;

    constructor() {
        this.positions = [];
        this.employers = [];
        this.positionsUrl = '/job-posts',
        this.initialPositionsUrl = this.positionsUrl;
        this.filters = {
            type: null, modality: null, experience: null,  employerId: null
        }
    }

    public showMessage(): void {
        console.log("Hello world");
        // Vue.prototype.$AuthService.logout();
    }

    public async getPositions() {
        this.positions = await (await axios.get(this.positionsUrl)).data.items;
        if (!isEmpty(this.positions)) {
            for (const currentPosition of this.positions) {
                const employerName = currentPosition.employer_name;
                const isPresent = (element: any) => element == employerName;
                if (isEqual(this.employers.findIndex(isPresent), NOT_FOUND))
                  this.employers.push(employerName);
            }
        }
    }

    public async getFilteredPositions() {
        this.positionsUrl = this.initialPositionsUrl + this.createQuery(this.filters);
        this.getPositions();
    }

    private createQuery(filters: IFilters): string {
        let query = '?';
        if (filters.type != null) {
          query += `type=${filters.type}&`;
        }
        if (filters.modality != null) {
          query += `modality=${filters.modality}&`;
        }
        if (filters.experience != null) {
          query += `experience=${filters.experience}&`;
        }
        if (filters.employerId != null) {
          query += `employerId=${filters.employerId}`;
        }
        return query;
    }

}