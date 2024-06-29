import { dbService } from "../../services/db.service.js";
import { logger } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";
import mongodb from "mongodb";
const { ObjectId } = mongodb;

const PAGE_SIZE = 3;

// async function query(filterBy = { txt: "" }) {
async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy);
  // async function query() {
  try {
    // const criteria = {
    //   vendor: { $regex: filterBy.txt, $options: "i" },
    // };

    const collection = await dbService.getCollection("story");
    var storyCursor = await collection.find(criteria);

    // if (filterBy.pageIdx !== undefined) {
    //   storyCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE);
    // }

    const storys = storyCursor.toArray();
    return storys;
    // return collection;
  } catch (err) {
    logger.error("cannot find storys", err);
    throw err;
  }
}

async function getById(storyId) {
  try {
    const collection = await dbService.getCollection("story");
    const story = await collection.findOne({ _id: ObjectId(storyId) });
    story.createdAt = ObjectId(story._id).getTimestamp();

    return story;
  } catch (err) {
    logger.error(`while finding story ${storyId}`, err);
    throw err;
  }
}

async function remove(storyId) {
  try {
    const collection = await dbService.getCollection("story");
    await collection.deleteOne({ _id: ObjectId(storyId) });
    return storyId;
  } catch (err) {
    logger.error(`cannot remove story ${storyId}`, err);
    throw err;
  }
}

async function add(story) {
  try {
    const collection = await dbService.getCollection("story");
    await collection.insertOne(story);
    return story;
  } catch (err) {
    logger.error("cannot insert story", err);
    throw err;
  }
}

async function update(story) {
  try {
    const storyToSave = {
      vendor: story.vendor,
      price: story.price,
    };
    const collection = await dbService.getCollection("story");
    await collection.updateOne(
      { _id: ObjectId(story._id) },
      { $set: storyToSave }
    );
    return story;
  } catch (err) {
    logger.error(`cannot update story ${storyId}`, err);
    throw err;
  }
}

async function addStoryMsg(storyId, msg) {
  try {
    msg.id = utilService.makeId();
    const collection = await dbService.getCollection("story");
    await collection.updateOne(
      { _id: ObjectId(storyId) },
      { $push: { msgs: msg } }
    );
    return msg;
  } catch (err) {
    logger.error(`cannot add story msg ${storyId}`, err);
    throw err;
  }
}

async function removeStoryMsg(storyId, msgId) {
  try {
    const collection = await dbService.getCollection("story");
    await collection.updateOne(
      { _id: ObjectId(storyId) },
      { $pull: { msgs: { id: msgId } } }
    );
    return msgId;
  } catch (err) {
    logger.error(`cannot add story msg ${storyId}`, err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: "i" };
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ];
  }
  // if (filterBy.minBalance) {
  //   criteria.score = { $gte: filterBy.minBalance };
  // }
  return criteria;
}

export const storyService = {
  remove,
  query,
  getById,
  add,
  update,
  addStoryMsg,
  removeStoryMsg,
};
