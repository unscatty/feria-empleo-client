import { container } from "@/app.container";
import AuthService from "@/auth/auth.service";
import { CompanyService } from "@/services/company.service";
import { CurrentUserService } from "@/services/current-user.service";
import { CustomNavGuard } from "@/utils/custom-route.types";
import { NavigationGuardNext } from "vue-router";

// Registers company from login redirection
const CompanyRegisterGuard: CustomNavGuard = async (_, __, next: NavigationGuardNext) => {
  console.log('executing company registration guard');
  
  const authService = container.get(AuthService);
  const companyService = container.get(CompanyService);
  const currentUserService = container.get(CurrentUserService);

  // Register company
  try {
    const state = authService.getState();
    const response = await companyService.register(state);

    currentUserService.raw = response;

    next()
  } catch (err) {
    // FIXME: check for error type and import redirect route
    next('/');
  }
}

export default CompanyRegisterGuard;