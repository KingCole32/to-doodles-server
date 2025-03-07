export interface DoodleUser {
  id: number,
  username: string,
  email: string,
  password: string
}

export interface Doodle {
  id: number,
  title: string,
  body: string,
  status: boolean,
  deadline: Date,
  completed: Date
  updated: Date
}

export interface Tag {
  id: number,
  tag_name: string
}