import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Workflow = sequelize.define('Workflow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'draft',
  },
  triggerType: {
    type: DataTypes.STRING, // e.g., 'webhook', 'schedule', 'manual'
  },
  triggerConfig: {
    type: DataTypes.JSON, // Configuration for the trigger
  },
  steps: {
    type: DataTypes.JSON, // Definition of the workflow steps
  },
}, {
  timestamps: true,
});

export default Workflow;
