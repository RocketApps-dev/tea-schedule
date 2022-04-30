import { JWT } from "../../domain/entities/users/jwt";
import { Either, left, right } from "@/core/logic/Either";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InvalidEmailOrPasswordError } from "./errors/InvalidEmailOrPasswordError";
import { UserNotFoundWithThisEmailError } from "./errors/UserNotFoundWithThisEmailError";
import { UserLevel, UserStatus } from "../../domain/entities/users/users";

type AuthenticationsUsersRequest = {
  username: string;
  password: string;
};

type AuthenticationsUsersResponse = Either<
  Error,
  AuthenticationsUsersResponseProps
>;

type AuthenticationsUsersResponseProps = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    level: string;
    status: string;
  };
};

export class AuthenticationsUsers {
  constructor(private usersRepository: IUsersRepository) {}

  async perform({
    username,
    password,
  }: AuthenticationsUsersRequest): Promise<AuthenticationsUsersResponse> {
    const user = await this.usersRepository.findByEmail(username);

    if (!user) {
      return left(new UserNotFoundWithThisEmailError(username));
    }

    const isPasswordValid = await user.password.comparePassword(password);

    if (!isPasswordValid) {
      return left(new InvalidEmailOrPasswordError());
    }

    const { token } = JWT.signUser(user);

    return right({
      token,
      user: {
        id: user.id,
        name: user.name.value,
        email: user.email.value,
        level: UserLevel[user.level],
        status: UserStatus[user.status],
      },
    });
  }
}
