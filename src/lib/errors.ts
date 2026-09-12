
export class AuthError extends Error {
  constructor(message = "Não autenticado.") {
    super(message);
    this.name = "AuthError";
  }
}

export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessError";
  }
}