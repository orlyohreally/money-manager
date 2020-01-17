export interface User<Id = string> {
  _id: Id;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  icon: string;
  colorScheme: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
