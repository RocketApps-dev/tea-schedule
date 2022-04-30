import { Controller } from "@/core/infra/Controller";
import { clientError, fail, HttpResponse, ok } from "@/core/infra/HttpResponse";
import { Validator } from "@/core/infra/Validator";
import { CreateNewUsersAccount } from "./CreateNewUsersAccount";

type CreateNewUsersAccountControllerRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  userType: string;
};

export class CreateNewUsersAccountController implements Controller {
  constructor(
    private readonly validation: Validator<CreateNewUsersAccountControllerRequest>,
    private readonly createNewUsersAccount: CreateNewUsersAccount
  ) {}

  async handle(
    request: CreateNewUsersAccountControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(request);

      if (validationResult.isLeft()) {
        return clientError(validationResult.value);
      }

      const { name, email, password, userType } = request;

      const result = await this.createNewUsersAccount.perform({
        name,
        email,
        password,
        userType,
      });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return clientError(error);
        }
      }

      return ok(result.value);
    } catch (error) {
      return fail(error);
    }
  }
}
