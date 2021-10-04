import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import AuthService from "./auth/auth.service";
import { UpdateCandidateService } from "./pages/profile/edit/edit-candidate.service";
import { CompanyService } from "./services/company.service";

const container = new Container();

// Auth service
container.bind(AuthService).toConstantValue(new AuthService());

// Company service
container.bind(CompanyService).toConstantValue(new CompanyService(
  process.env.VUE_APP_SERVER_HOST,
  "company",
  10_000
));

container.bind(UpdateCandidateService).toConstantValue(new UpdateCandidateService());

const { lazyInject } = getDecorators(container);

export { container, lazyInject };