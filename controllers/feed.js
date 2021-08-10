/**
 * @author Juan Santa
 * @file feed.js
 * @description Controller for feed
 */

const path = require('path');
const fs = require('fs');
const { validationResult } = require("express-validator/check")

const Post = require('../Models/post');
const User= require('../Models/user');
/**
 * Get all posts
 * @type { GET }
 * @param {*} req request
 * @param {*} res response
 * @param {*} next function
 */
exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const itemsPerPage = 2;
    const totalItems = await Post.count();
    const posts = await Post.find()
        .populate('creator')
        .sort({createdAt: -1})
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);

    res.status(200).json({
      posts: posts,
       totalItems: totalItems
    })
  }catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }}
}

/**
 * Get post
 * @type { GET }
 * @param {*} req request
 * @param {*} res response
 * @param {*} next function
 */
exports.getPost = async (req, res, next) => {
  try {
    const id = req.params.postId;
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("Could not find post.");
      error.status = 500;
      throw error;
    }

    res.status(200).json({ message: 'Post fetched', post: post });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


/**
 * Create post
 * @type { POST }
 * @param {*} req request
 * @param {*} res response
 * @param {*} next function
 */
 exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { title, content } = req.body;

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
      
    }
    if (!req.file) {
      const error = new Error('No image provided');
      error.statusCode = 422;
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl: req.file.path,
      creator: req.userId
    });

    await post.save();

    const user = User.findById(req.userId);
    user.posts.push(post)

    await user.save();

    res.status(200).json({
      message: 'Post created successfully!',
      post: post,
      creator: { 
        _id: user._id.toString(),
        name: user.name
      }
    })
  }catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

/**
 * Create post
 * @type { PUT }
 * @param {*} req request
 * @param {*} res response
 * @param {*} next function
 */
exports.updatePost = async(req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
      
    }

    const postId = req.params.postId;
    const {title, content} = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      const error = new Error('No file picked.');
      error.statusCode = 422;
      throw error;
    }

    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 422;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 401;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;

    await post.save();

    res.status(200).json({
      message: 'Post updated!',
      post: post
    })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    
    next(error);
  }
}

/**
 * Create post
 * @type { DELETE }
 * @param {*} req request
 * @param {*} res response
 * @param {*} next function
 */
exports.deletePost = async(req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate('creator');

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 422;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 401;
      throw error;
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId)
    const user = User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    res.status(200).json({
      message: 'Deleted post.'
    })
    
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    
    next(error);
  }
}


// private methods

const clearImage = filePath => {
  filepath = path.join(__dirname, "..", filePath);
  fs.unlink(filepath, err => console.log(err));
}