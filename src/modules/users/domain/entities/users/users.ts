import { Name } from "./name";
import { Email } from "./email";
import { Entity } from "@/core/domain/Entity";
import { Password } from "./password";
import { Either, right } from "@/core/logic/Either";
import { InvalidNameError } from "../../errors/InvalidNameError";
import { InvalidEmailUserError } from "../../errors/InvalidEmailUserError";
import { InvalidPasswordLengthError } from "../../errors/InvalidPasswordLengthError";

export enum UserType {
  ADMIN,
  TEACHER,
  RESPONSIBLES,
}

export enum UserStatus {
  ACTIVE,
  INACTIVE,
}

export enum UserLevel {
  ADMIN,
  TEACHER_MANAGER,
  TEACHER,
  RESPONSIBLES_MANAGER,
  RESPONSIBLES,
}

type UsersProps = {
  name: Name;
  email: Email;
  password: Password;
  avatar?: string;
  status: UserStatus;
  level: UserLevel;
};

export class Users extends Entity<UsersProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get avatar() {
    return this.props.avatar;
  }

  get status() {
    return this.props.status;
  }

  get level() {
    return this.props.level;
  }

  private constructor(props: UsersProps, id?: string) {
    super(props, id);
  }

  static create(
    props: UsersProps,
    id?: string
  ): Either<
    InvalidNameError | InvalidEmailUserError | InvalidPasswordLengthError,
    Users
  > {
    const users = new Users(props, id);

    return right(users);
  }
}
