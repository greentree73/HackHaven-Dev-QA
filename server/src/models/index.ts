import Question from "./Question";
import Answer from "./Answer";
import Vote from "./Vote";
import User from "./User";
// Define associations
// Hint: A Question belongs to a User
Question.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
// Hint: A User can have many Questions
User.hasMany(Question, {
  foreignKey: "userId",
  as: "questions",
  onDelete: "CASCADE",
});
// An Answer belongs to a User
Answer.belongsTo(User, {
  foreignKey: "userId",
  as: "user",  
});
// A User can have many Answers
User.hasMany(Answer, {
  foreignKey: "userId",
  as: "answers",
  onDelete: "CASCADE",
});
// An Answer belongs to a Question
Answer.belongsTo(Question,{ 
  foreignKey: "questionId",
  as: "question",  
});
// Hint: A Question can have many Answers
Question.hasMany(Answer, {
  foreignKey: "questionId",
  as: "answers",
  onDelete: "CASCADE",
});
// Hint: A Vote belongs to a User
Vote.belongsTo(User, { 
    foreignKey: "userId", 
    as: "user" 
});

// Hint: A User can have many Votes
User.hasMany(Vote, { 
    foreignKey: "userId", 
    as: "votes" 
});

// Hint: A Vote belongs to an Answer
Vote.belongsTo(Answer,{
      foreignKey: "answerId", 
      as: "answer" 
});

// Hint: An Answer can have many Votes
Answer.hasMany(Vote, {
     foreignKey: "answerId", 
     as: "votes" 
});

export { Question, Answer, Vote, User };



