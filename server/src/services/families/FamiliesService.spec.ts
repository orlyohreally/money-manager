import { Family, FamilyMember, Roles, User } from "@shared/types";
import { FamiliesDao } from "@src/services/families/FamiliesDao";
import { FamiliesService } from "@src/services/families/FamiliesService";
import { ImageManagerDao } from "@src/services/image-manager/ImageManagerDao";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { Response } from "express";
import * as httpMocks from "node-mocks-http";

const mockGetFamilyMember = jest.fn();
const mockGetFamilyMembers = jest.fn();

jest.mock("@src/services/families/FamiliesDao", () => ({
  FamiliesDao: class {
    public getFamilyMember() {
      return mockGetFamilyMember();
    }
    public createFamilyMember() {
      return jest.fn();
    }
    public getFamilyMembers() {
      return mockGetFamilyMembers();
    }
  }
}));

jest.mock("@src/services/families/FamiliesService");
jest.mock("@src/services/image-manager/ImageManagerDao");
jest.mock("@src/services/image-manager/ImageManagerService");

describe("FamiliesService", () => {
  let service: FamiliesService;
  let dao: FamiliesDao;
  let imageLoaderService: ImageManagerService;

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    // (ImageManagerService as jest.Mock<ImageManagerService>).mockClear();

    dao = new FamiliesDao();
    imageLoaderService = new ImageManagerService({
      dao: new ImageManagerDao()
    });
    service = new FamiliesService({
      dao,
      imageLoaderService
    });
  });

  it("userCanEditFamily should return true for family Owner", async () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedFamilyMember: FamilyMember = {
      roles: [Roles.Member, Roles.Owner]
    } as FamilyMember;

    mockGetFamilyMember.mockReturnValue(mockedFamilyMember);
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedFamily: Family = {
      _id: "mocked family id"
    } as Family;
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedUser: User = { _id: "mocked user id" } as User;
    const nextSpy = jest.fn();
    const response = httpMocks.createResponse();
    const request = httpMocks.createRequest({
      params: { familyId: "familyId" },
      body: { family: mockedFamily, user: mockedUser }
    });
    await service.userCanEditFamily(request, response as Response, nextSpy);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it("userCanUpdateFamily should return true for family Admin", async () => {
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedFamilyMember: FamilyMember = {
      _id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: "",
      roles: [Roles.Admin]
    } as FamilyMember;

    mockGetFamilyMember.mockReturnValue(mockedFamilyMember);
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedFamily: Family = {
      _id: "mocked family id"
    } as Family;
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedUser: User = { _id: "mocked user id" } as User;
    const nextSpy = jest.fn();
    const response = httpMocks.createResponse();
    const request = httpMocks.createRequest({
      params: { familyId: "familyId" },
      body: { family: mockedFamily, user: mockedUser }
    });
    await service.userCanEditFamily(request, response, nextSpy);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it("userCanUpdateFamily should return false for just Member", async () => {
    const response = httpMocks.createResponse();
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedFamilyMember: FamilyMember = {
      _id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      icon: "",
      roles: [Roles.Member]
    } as FamilyMember;

    mockGetFamilyMember.mockReturnValue(mockedFamilyMember);
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedFamily: Family = {
      _id: "mocked family id"
    } as Family;
    // tslint:disable-next-line: no-object-literal-type-assertion
    const mockedUser: User = { _id: "mocked user id" } as User;
    const nextSpy = jest.fn();
    const request = httpMocks.createRequest({
      params: { familyId: "familyId" },
      body: { family: mockedFamily, user: mockedUser }
    });
    await service.userCanEditFamily(request, response, nextSpy);
    expect(response.statusCode).toBe(403);
  });

  it("createFamilyMember should call dao.createFamilyMember with updated roles list when Member role is missing", async () => {
    spyOn(dao, "createFamilyMember");
    await service.createFamilyMember("userId", "familyId", [Roles.Owner]);
    expect(dao.createFamilyMember).toBeCalledTimes(1);
    expect(dao.createFamilyMember).toBeCalledWith("familyId", {
      _id: "userId",
      roles: [Roles.Owner, Roles.Member]
    });
  });

  it("createFamilyMember should call dao.createFamilyMember with specified roles list", async () => {
    spyOn(dao, "createFamilyMember");
    await service.createFamilyMember("userId", "familyId", [
      Roles.Admin,
      Roles.Member
    ]);
    expect(dao.createFamilyMember).toBeCalledTimes(1);
    expect(dao.createFamilyMember).toBeCalledWith("familyId", {
      _id: "userId",
      roles: [Roles.Admin, Roles.Member]
    });
  });

  it("getFamilyMembers should respond response from dao.getFamilyMembers", async () => {
    const mockedFamilyMembers: {
      _id: string;
      firstName: string;
      lastName: string;
      createdAt: Date;
      roles: string[];
    }[] = [
      {
        _id: "userId",
        firstName: "firstName",
        lastName: "lastName",
        createdAt: new Date(),
        roles: [Roles.Member]
      }
    ];
    mockGetFamilyMembers.mockReturnValue(mockedFamilyMembers);
    const members = await service.getFamilyMembers("familyId");
    expect(members).toBe(mockedFamilyMembers);
  });
});
