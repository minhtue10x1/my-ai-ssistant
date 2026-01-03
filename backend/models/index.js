import User from './User.js';
import Workflow from './Workflow.js';
import Integration from './Integration.js';

// Define Associations
User.hasMany(Workflow, { foreignKey: 'userId' });
Workflow.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Integration, { foreignKey: 'userId' });
Integration.belongsTo(User, { foreignKey: 'userId' });

export {
  User,
  Workflow,
  Integration
};
