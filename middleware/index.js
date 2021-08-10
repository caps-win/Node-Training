/**
 * @author Juan Santa
 * @file index.js
 * @description Expose all middleware functions
 */

// middleware
const corsMiddleware = require('./cors');


module.exports = {
  cors: corsMiddleware.cors,
}