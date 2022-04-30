import { Either, left, right } from "@/core/logic/Either";
import { Email } from "../../domain/entities/users/email";
import { Name } from "../../domain/entities/users/name";
import { Password } from "../../domain/entities/users/password";
import {
  UserLevel,
  Users,
  UserStatus,
} from "../../domain/entities/users/users";
import { IUsersRepository } from "../../repositories/IUsersRepository";

type CreateNewUsersAccountRequest = {
  name: string;
  email: string;
  password: string;
  userType: string;
};

type CreateNewUsersAccountResponse = Either<Error, Object>;

export class CreateNewUsersAccount {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async perform({
    name,
    email,
    password,
    userType,
  }: CreateNewUsersAccountRequest): Promise<CreateNewUsersAccountResponse> {
    try {
      const nameOrError = Name.create(name);
      const emailOrError = Email.create(email);
      const passwordOrError = Password.create(password);

      if (nameOrError.isLeft()) {
        return left(nameOrError.value);
      }

      if (emailOrError.isLeft()) {
        return left(emailOrError.value);
      }

      if (passwordOrError.isLeft()) {
        return left(passwordOrError.value);
      }

      const userOrError = Users.create({
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
        level:
          userType == "teacher" ? UserLevel.TEACHER : UserLevel.RESPONSIBLES,
        status: UserStatus.ACTIVE,
      });

      if (userOrError.isLeft()) {
        return left(userOrError.value);
      }

      const user = userOrError.value;

      const alreadyExists = await this.usersRepository.exists(email);

      if (alreadyExists) {
        return left(new Error("Email already exists"));
      }

      await this.usersRepository.create(user);

      return right({});
    } catch (error) {
      return left(error);
    }
  }
}
