import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Integration = sequelize.define('Integration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.STRING, // github, openai, etc.
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  config: {
    type: DataTypes.JSON, // Store non-sensitive config
  },
  // In a real app, credentials should be encrypted. 
  // For this MVP, we will rely on env vars mostly, but store user-specific tokens here if needed.
  encryptedCredentials: { 
    type: DataTypes.TEXT,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default Integration;
