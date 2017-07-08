module.exports = function(sequelize, DataTypes) {
  var Customer = sequelize.define("Customer", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
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
    streetaddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    streetaddress2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: false
    }
    // Here we'll pass a second "classMethods" object into the define method
    // This is for any additional configuration we want to give our models
  });
  return Customer;
};
