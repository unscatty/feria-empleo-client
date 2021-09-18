import { isEqual } from "lodash";
import { StatusCodes } from "http-status-codes";
import { container } from "@/app.container";
import AuthService from "./auth.service";

export function validateUnauthorizedError(error: any) {
    const authService = container.get(AuthService);
    const response = error.response;

    if (isEqual(response.status, StatusCodes.UNAUTHORIZED)) {
        authService.login().then().catch(error => { console.error(error); })
    }
}