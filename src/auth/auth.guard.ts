import Vue from "vue"
import { isEmpty } from "lodash"

export class AuthGuard extends Vue{

    public static canActivate(to: any, from: any, next: any): void {
        const isAuthenticated: boolean = !isEmpty(Vue.prototype.$AuthService.getToken());
        if (to.name !== 'Login' && !isAuthenticated) Vue.prototype.$AuthService.login();
        else next();
    }
}