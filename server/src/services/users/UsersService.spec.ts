import { User } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { UsersDao } from "./UsersDao";
import { UsersService } from "./UsersService";

let mockGetUser: jest.Mock<() => User>;
let mockUpdateUser: jest.Mock<() => Promise<User>>;
let mockValidateImageForLoading: jest.Mock<() => () => void>;
let mockLoadImage: jest.Mock<() => string>;

jest.mock("@src/services/users/UsersDao", () => ({
  UsersDao: class {
    public getUser() {
      return mockGetUser();
    }
    public updateUser() {
      return mockUpdateUser();
    }
  }
}));

jest.mock("@src/services/image-manager/ImageManagerService", () => ({
  ImageManagerService: class {
    public validateImageForLoading() {
      return mockValidateImageForLoading();
    }
    public loadImage() {
      return mockLoadImage();
    }
  }
}));

jest.mock("@src/services/image-manager/ImageManagerDao");

describe("UsersService", () => {
  let service: UsersService;
  let dao: UsersDao;
  let imageLoaderService: ImageManagerService;

  const mockedRegisteredUser: User = {
    _id: "_id",
    firstName: "firstName-1",
    lastName: "lastName-1",
    email: "email-1@gmail.com",
    icon: "https://assets/icon.png"
  };

  const mockedBase64String = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA";
  const mockedLoadedImage = "https://assets/loadedImage.png";

  beforeEach(() => {
    dao = new UsersDao();
    imageLoaderService = new ImageManagerService({
      dao: new ImageManagerDao()
    });
    service = new UsersService({
      dao,
      imageLoaderService
    });

    mockValidateImageForLoading = jest.fn();
    mockLoadImage = jest.fn();

    mockGetUser = jest.fn();
    mockUpdateUser = jest.fn();
  });

  it("updateUser should call imageLoaderService.loadImage when imageLoaderService.validateImageForLoading is successfull and icon is updated", async () => {
    mockGetUser.mockReturnValue(mockedRegisteredUser);
    spyOn(imageLoaderService, "loadImage");
    await service.updateUser(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      icon: mockedBase64String
    });

    expect(imageLoaderService.loadImage).toHaveBeenCalledTimes(1);
    expect(imageLoaderService.loadImage).toHaveBeenCalledWith(
      mockedBase64String,
      `users/${mockedRegisteredUser._id}`
    );
  });

  it("updateUser should not call imageLoaderService.loadImage when imageLoaderService.validateImageForLoading is successfull and icon is not updated", async () => {
    mockGetUser.mockReturnValue(mockedRegisteredUser);
    spyOn(imageLoaderService, "loadImage");
    await service.updateUser(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      firstName: "updatedFirstName"
    });
    expect(imageLoaderService.loadImage).not.toHaveBeenCalled();
  });

  it("updateUser should not call imageLoaderService.loadImage and should throw error when imageLoaderService.validateImageForLoading is not successfull but icon is updated", async () => {
    mockGetUser.mockReturnValue(mockedRegisteredUser);
    mockValidateImageForLoading.mockImplementation(() => {
      throw new Error("Invalid image format");
    });
    spyOn(imageLoaderService, "loadImage");
    await expect(
      service.updateUser(mockedRegisteredUser._id, {
        ...mockedRegisteredUser,
        icon: mockedBase64String
      })
    ).rejects.toThrowError("Invalid image format");

    expect(imageLoaderService.loadImage).not.toHaveBeenCalled();
  });

  it("updateUser should call dao.updateUser with loaded icon when icon is updated", async () => {
    mockGetUser.mockReturnValue(mockedRegisteredUser);
    mockLoadImage.mockResolvedValue(mockedLoadedImage);
    spyOn(dao, "updateUser");
    await service.updateUser(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      icon: mockedBase64String
    });

    expect(dao.updateUser).toHaveBeenCalledTimes(1);
    expect(dao.updateUser).toHaveBeenCalledWith(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      icon: mockedLoadedImage
    });
  });

  it("updateUser should call dao.updateUser when icon is not updated", async () => {
    mockGetUser.mockReturnValue(mockedRegisteredUser);
    mockLoadImage.mockResolvedValue(mockedLoadedImage);
    spyOn(dao, "updateUser");
    await service.updateUser(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      firstName: "updatedFirstName"
    });

    expect(dao.updateUser).toHaveBeenCalledTimes(1);
    expect(dao.updateUser).toHaveBeenCalledWith(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      firstName: "updatedFirstName"
    });
  });

  it("updateUser should call dao.updateUser with empty icon when updated icon is empty", async () => {
    mockGetUser.mockReturnValue(mockedRegisteredUser);
    mockLoadImage.mockResolvedValue(mockedLoadedImage);
    spyOn(dao, "updateUser");
    await service.updateUser(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      icon: "",
      lastName: "updatedLastName"
    });

    expect(dao.updateUser).toHaveBeenCalledTimes(1);
    expect(dao.updateUser).toHaveBeenCalledWith(mockedRegisteredUser._id, {
      ...mockedRegisteredUser,
      icon: "",
      lastName: "updatedLastName"
    });
  });
});
