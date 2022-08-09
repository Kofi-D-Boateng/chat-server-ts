export class User {
  key: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  dob: string;
  constructor(
    key: string,
    username: string,
    email: string,
    password: string,
    createdAt: string,
    dob: string
  ) {
    this.key = key;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.dob = dob;
  }
}
