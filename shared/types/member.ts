export interface User<Id = string> {
  _id: Id;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  colorScheme: string;
  createdAt: Date;
  updatedAt: Date;
}
