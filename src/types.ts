export namespace Schema {
  export type User = {
    email: string;
    password: string;
    username: string;
    nickname: string;
    age: string;
    gender: 'male' | 'female';
  };
}
