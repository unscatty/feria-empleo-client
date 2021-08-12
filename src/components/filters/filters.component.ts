export class FiltersComponent {

    public employers: string[];
    public type1Selected: string | boolean;
    public type2Selected: string | boolean;
    public modality1Selected: string | boolean;
    public modality2Selected: string | boolean;
    public experience: string | null;
    public employerId: number | null;

    constructor() {
        this.employers = [];
        this.type1Selected = 'on';
        this.type2Selected = 'on';
        this.modality1Selected = 'on';
        this.modality2Selected = 'on';
        this.employerId = null;
        this.experience = null;
    }

    public selectType(context: any, type: string): void {
        context.$emit('type', type);
    }

    public clearType(context: any): void {
        this.type1Selected = false;
        this.type2Selected = false;
        context.$emit('type', null);
    }

    public selectModality(context: any, modality: string): void {
        context.$emit('modality', modality);
    }

    public clearModality(context: any): void {
        this.modality1Selected = false;
        this.modality2Selected = false;
        context.$emit('modality', null);
    }

    public selectExperience(context: any, experience: any): void {
        context.$emit('experience', experience.target.value);
    }

    public clearExperience(context: any): void {
        this.experience = null;
        context.$emit('experience', null);
    }

    public selectCompany(context: any, companyId: any) {
        context.$emit('employerId', companyId.target.value);
    }

    public clearCompany(context: any): void {
        this.employerId = null;
        context.$emit('employerId', null);
    }

    public clearAllFilters(context: any): void {
        this.clearType(context);
        this.clearModality(context);
        this.clearExperience(context);
        this.clearCompany(context);
        context.$emit('type', null);
    }

}