const mongoose = require('mongoose');

// Define the schema for environment variables
const envVarSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true }
});

// Create a model from the schema
const EnvVar = mongoose.model('EnvVar', envVarSchema);

// Export the model for use in other modules
module.exports = EnvVar;
