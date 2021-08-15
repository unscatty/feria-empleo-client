import axios from "axios";

const CHAT_LIMIT = 5;


export class TopChartComponent {
    public topPositions: any[];
    public limit: number;
    public endpoint: string;

    constructor(enpoint: string) {
        this.topPositions = [];
        this.limit = CHAT_LIMIT;
        this.endpoint = enpoint;
    }

    public async getPositions(): Promise<void> {
        try {
            this.topPositions =  await (await axios.get(this.endpoint, { params: { limit: this.limit } })).data;
        } catch (error) {
            this.topPositions = [];
        }
    }

    public goToPosition(context: any, positionId: number) {
        context.$router.push({ name: 'position', params: { id: positionId } });
    }


}