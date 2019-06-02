export interface User<Id = string> {
  _id: Id;
  firstName: string;
  lastName: string;
  colorScheme: string;
  createdAt: Date;
  updatedAt: Date;
}
