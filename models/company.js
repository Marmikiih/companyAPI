module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define("Company", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    resetToken:DataTypes.STRING
  });

  Company.associate = (models) => {
    Company.hasMany(models.TeamMember, {
      foreignKey: "companyId",
      as: "teamMembers",
    });
  };

  return Company;
};
