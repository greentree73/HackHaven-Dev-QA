import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// TODO: Define Vote attributes interface
// Hint: Vote should have id, value, answerId, userId, createdAt
interface VoteAttributes {
  // TODO: Add properties here
  id: number;
  value: number;
  answerId: number;
  userId: number;
  createdAt?: Date;
  
}

interface VoteCreationAttributes extends Optional<
  VoteAttributes,
  "id" | "createdAt"
> {}

// TODO: Create the Vote class extending Model
class Vote
  extends Model<VoteAttributes, VoteCreationAttributes>
  implements VoteAttributes
{
  // TODO: Declare public properties
  public id!: number;
  public value!: number;
  public answerId!: number;
  public userId!: number;
  public createdAt!: Date;
}

// Initialize the Vote model
Vote.init(
  {
    // Define model attributes
    // id should be primaryKey and autoIncrement
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // value should be INTEGER (1 for upvote, -1 for downvote)
    value: {
      type: DataTypes.INTEGER,
      validate: {
        min: -1,
        max: 1,
      },
    },
    // answerId should reference answers table
    answerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "answers",
        key: "id",
      },
    },
    // userId should reference users table
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "vote",
    tableName: "votes",
    indexes: [
      // Add unique index for userId + answerId
      // This prevents a user from voting multiple times on same answer
      {
        unique: true,
        fields: ["userId", "answerId"],
      },
    ],
  },
);

export default Vote;
