import { validateUnauthorizedError } from "@/auth/auth.validatod";
import axios from "axios";
import { injectable } from "inversify";

@injectable()
export class UpdateCandidateService {

    public async updateCandidate(candidateDto: any): Promise<void> {
        try {
            await axios.put('/candidate/update', candidateDto, { headers: { ContentType: 'multipart/form-data' }});
        } catch (error) {
            validateUnauthorizedError(error);
        }
    }

    public async updateResume(formData: FormData): Promise<void> {
        try {
            await axios.put('/candidate/update/resume', formData, { headers: { ContentType: 'multipart/form-data' }});
        } catch(error) {
            validateUnauthorizedError(error);
        }
    }
}