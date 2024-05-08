class User {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;

  constructor({ id = 0, email = '', password = '', firstname = '', lastname = '' }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

export default User;