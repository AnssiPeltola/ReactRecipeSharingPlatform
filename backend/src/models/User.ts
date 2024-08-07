class User {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  nickname: string;
  bio: string;
  location: string;
  instagram: string;
  tiktok: string;
  experience_level: string;

  constructor({
    id = 0,
    email = "",
    password = "",
    firstname = "",
    lastname = "",
    nickname = "",
    bio = "",
    location = "",
    instagram = "",
    tiktok = "",
    experience_level = "",
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.nickname = nickname;
    this.bio = bio;
    this.location = location;
    this.instagram = instagram;
    this.tiktok = tiktok;
    this.experience_level = experience_level;
  }
}

export default User;
