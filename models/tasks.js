module.exports = function(sequelize, DataTypes) {
  var Tasks = sequelize.define("Tasks", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tools: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeframe: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // Here we'll pass a second "classMethods" object into the define method
    // This is for any additional configuration we want to give our models
  });
  return Tasks;
};
