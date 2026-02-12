import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// TODO: Define Answer attributes interface
// Hint: Answer should have id, body, questionId, userId, createdAt, updatedAt
interface AnswerAttributes {
  //  Add properties here
  id: number;
  body: string;
  questionId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'|'createdAt'|'updatedAt' > {}

// TODO: Create the Answer class extending Model
class Answer
  extends Model<AnswerAttributes, AnswerCreationAttributes>
  implements AnswerAttributes
{
  // TODO: Declare public properties
  public id!: number;
  public body!: string;
  public questionId!: number;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  
}

// Initialize the Answer model
Answer.init(
  {
    // Define model attributes
    // id should be primaryKey and autoIncrement
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // body should be TEXT type and not null
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // questionId should reference questions table
    questionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "questions",
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
    modelName: "Answer",
    tableName: "answers",
    timestamps: true,
  },
);

export default Answer;



