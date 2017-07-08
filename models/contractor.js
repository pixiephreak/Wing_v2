module.exports = function(sequelize, DataTypes) {
  var Contractor = sequelize.define("Contractor", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    work: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
    // Here we'll pass a second "classMethods" object into the define method
    // This is for any additional configuration we want to give our models
  });
  return Contractor;
};
