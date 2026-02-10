import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import index from '../models/index';
                                         
// Define Question attributes interface
// Hint: Question should have id, title, body, userId, createdAt, updatedAt
interface QuestionAttributes {
  // Add properties here
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id' | 'createdAt' | 'updatedAt' > {}

// Create the Question class extending Model
class Question
  extends Model<QuestionAttributes, QuestionCreationAttributes>
  implements QuestionAttributes
{
  // Declare public properties
  public id!: number;
  public title!: string;
  public body!: string;
  public userId!: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  
}

// Initialize the Question model
Question.init(
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // title should not be null with minimum length
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 255],
      },
    },
    // body should be TEXT type and not null
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // userId should be an integer and not null
    // - userId should reference the users table
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: true,
  },
);

export default Question;
