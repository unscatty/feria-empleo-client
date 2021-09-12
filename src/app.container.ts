import { container } from "inversify-props";
import AuthService from "./auth/auth.service";

export default function buildDependencyContainer(): void {
  container.addSingleton<AuthService>(AuthService);
}