import { ObjectId } from "mongodb";

import { Family, FamilyMember, FamilyView } from "@shared/types";
import { modelTransformer } from "@src/utils";
import { IFamiliesDao } from "./FamiliesService";
import { FamilyModel, getFamiliesView, getMemberFamiliesView } from "./models";
import { FamilyMemberModel, getFamilyMembersView } from "./models/FamilyMember";

export class FamiliesDao implements IFamiliesDao {
  public async createFamily(family: Partial<Family>): Promise<Family> {
    const newFamily = new FamilyModel(family);
    await newFamily.save();
    return newFamily.toJSON(modelTransformer) as Family;
  }

  public async getFamily(
    familyId: string
  ): Promise<
    Family & {
      membersCount: number;
      equalPayments: boolean;
      userRoles: string[];
    }
  > {
    const familiesView = await getFamiliesView();
    return (await familiesView
      .find({ _id: new ObjectId(familyId) })
      .toArray())[0];
  }

  public async getMemberFamily(
    familyId: string,
    userId: string
  ): Promise<FamilyView> {
    const memberFamiliesView = await getMemberFamiliesView();
    return (await memberFamiliesView
      .find({ _id: new ObjectId(familyId), userId: new ObjectId(userId) })
      .toArray())[0];
  }

  public async updateFamily(familyId: string, family: Family): Promise<Family> {
    if (family._id) {
      delete family._id;
    }
    return FamilyModel.findOneAndUpdate(
      { _id: new ObjectId(familyId) },
      family,
      {
        new: true
      }
    )
      .lean()
      .exec();
  }

  public async deleteFamily(familyId: string): Promise<void> {
    await FamilyMemberModel.deleteMany({
      "_id.familyId": new ObjectId(familyId)
    })
      .lean()
      .exec();
    return FamilyModel.deleteOne({ _id: new ObjectId(familyId) })
      .lean()
      .exec();
  }

  public async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    const familyMembersView = await getFamilyMembersView();
    return familyMembersView
      .find({ familyId: new ObjectId(familyId) })
      .toArray();
  }

  public async createFamilyMember(
    familyId: string,
    familyMember: { roles: string[]; _id: string }
  ): Promise<FamilyMember> {
    const newFamilyMember = new FamilyMemberModel({
      roles: familyMember.roles,
      _id: { familyId, userId: familyMember._id }
    });
    await newFamilyMember.save();
    return newFamilyMember.toJSON({
      versionKey: false,
      transform: (
        doc,
        ret: { _id: { userId: ObjectId; familyId: ObjectId } }
      ) => ({
        ...ret,
        _id: ret._id.userId.toString()
      })
    }) as FamilyMember;
  }

  public async getMemberFamilies(userId: string): Promise<FamilyView[]> {
    const memberFamiliesView = await getMemberFamiliesView();
    return memberFamiliesView.find({ userId: new ObjectId(userId) }).toArray();
  }

  public async getFamilyMember(
    userId: string,
    familyId: string
  ): Promise<FamilyMember> {
    return FamilyMemberModel.findOne({
      "_id.familyId": new ObjectId(familyId),
      "_id.userId": new ObjectId(userId)
    })
      .lean()
      .exec();
  }

  public async updateMemberPercentage(
    memberId: { userId: string; familyId: string },
    paymentPercentage: number
  ): Promise<void> {
    return FamilyMemberModel.findOneAndUpdate(
      {
        "_id.userId": new ObjectId(memberId.userId),
        "_id.familyId": new ObjectId(memberId.familyId)
      },
      { paymentPercentage }
    )
      .lean()
      .exec();
  }
}
