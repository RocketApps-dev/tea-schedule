import {
  UserLevel,
  Users as UsersPersistence,
  UserStatus,
} from "@prisma/client";
import {
  Users,
  UserLevel as UserLevelDomain,
  UserStatus as UserStatusDomain,
} from "../domain/entities/users/users";

import { Name } from "../domain/entities/users/name";
import { Email } from "../domain/entities/users/email";
import { Password } from "../domain/entities/users/password";

export class UsersMappers {
  static async toPersistence(raw: Users) {
    return {
      id: raw.id,
      email: raw.email.value,
      name: raw.name.value,
      password: await raw.password.getHashedValue(),
      level: UserLevel[raw.level],
      status: UserStatus[raw.status],
    };
  }

  static toDomain(raw: UsersPersistence): Users {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);

    if (nameOrError.isLeft()) {
      throw nameOrError.value;
    }

    if (emailOrError.isLeft()) {
      throw emailOrError.value;
    }

    if (passwordOrError.isLeft()) {
      throw passwordOrError.value;
    }

    const usersOrError = Users.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
        level: UserLevelDomain[raw.level],
        status: UserStatusDomain[raw.status],
      },
      raw.id
    );

    if (usersOrError.isRight()) {
      return usersOrError.value;
    }

    return null;
  }
}
