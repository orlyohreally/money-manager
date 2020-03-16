export interface User<Id = string> {
  _id: Id;
  firstName: string;
  lastName: string;
  email: string;
  icon?: string;
  password?: string;
  colorScheme?: string;
  isVerified?: boolean;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
