import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import AuthService from "./auth/auth.service";
import { UpdateCandidateService } from "./pages/profile/edit/edit-candidate.service";
import { CompanyService } from "./services/company.service";
import { CurrentUserService } from "./services/current-user.service";

const serverHost = process.env.VUE_APP_SERVER_HOST;
const container = new Container();

// Auth service
container.bind(AuthService).toConstantValue(new AuthService());

// Company service
container.bind(CompanyService).toConstantValue(new CompanyService(
  serverHost,
  "company",
  10_000
));

// Current user service
container.bind(CurrentUserService).toConstantValue(new CurrentUserService(serverHost, 'users/current-user', 10_000));
container.bind(UpdateCandidateService).toConstantValue(new UpdateCandidateService());

const { lazyInject } = getDecorators(container);

export { container, lazyInject };