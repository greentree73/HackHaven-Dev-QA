import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/database';

// TODO: Define the User attributes interface
// Hint: User should have id, username, email, password, createdAt, updatedAt
interface UserAttributes {
  // TODO: Add properties here
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//  Define optional attributes for creation (id, timestamps are auto-generated)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'|'createdAt'|'updatedAt'> {}

//  Create the User class extending Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  //  Declare public properties here
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  }

//  Initialize the User model
User.init(
  {
    //  Define your model attributes here
    // Remember:
    // - id should be primaryKey and autoIncrement
    // - username should be unique and not null
    // - email should be unique, not null, and validated as email
    // - password should be not null with minimum length
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 6,
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      // TODO: Add beforeCreate hook to hash password
      // Hint: Check if password exists and hash it with bcrypt
      // async beforeCreate(user: User) { ... }
      async beforeCreate(user: User) {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },

      // TODO: Add beforeUpdate hook to hash password if changed
      // Hint: Use user.changed('password') to check if password was modified
      // async beforeUpdate(user: User) { ... }
      async beforeUpdate(user: User) {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    }
  }
);

export default User;
