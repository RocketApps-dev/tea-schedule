import { Either, left, right } from "@/core/logic/Either";
import { InvalidNameError } from "../../errors/InvalidNameError";

export class Name {
  private readonly name: string;

  get value() {
    return this.name;
  }

  private constructor(name: string) {
    this.name = name;
  }

  static validate(name: string): boolean {
    if (!name || name.trim().length < 5 || name.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(name: string): Either<InvalidNameError, Name> {
    if (!this.validate(name)) {
      return left(new InvalidNameError(name));
    }

    return right(new Name(name));
  }
}
