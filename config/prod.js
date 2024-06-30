export default {
  // dbURL:
  //   process.env.MONGO_URL ||
  //   "mongodb+srv://theUser:thePass@cluster0-klgzh.mongodb.net/test?retryWrites=true&w=majority",
  dbURL:
    process.env.MONGO_URL ||
    "mongodb+srv://sarit:ke68DuLQPg7BAhMC@storydb.yetc9l9.mongodb.net/?retryWrites=true&w=majority&appName=storyDB",
  dbName: process.env.DB_NAME || "story_db",
};
