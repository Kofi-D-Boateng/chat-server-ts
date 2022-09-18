export class User {
  id: string;
  position: number;
  username: string;
  constructor(id: string, position: number = 0, username: string) {
    this.id = id;
    this.position = position;
    this.username = username;
  }
}
