import { isEqual } from "lodash";
import { StatusCodes } from "http-status-codes";
import Vue from "vue";

export function validateUnauthorizedError(error: any) {
    const response = error.response;
    if (isEqual(response.status, StatusCodes.UNAUTHORIZED)) {
        Vue.prototype.$AuthService.logout();
    }
}