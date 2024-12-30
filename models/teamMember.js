module.exports = (sequelize, DataTypes) => {
  const TeamMember = sequelize.define("TeamMember", {
    email: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
  });

  TeamMember.associate = (models) => {
    TeamMember.belongsTo(models.Company, {
      foreignKey: "companyId",
      as: "company",
    });
  };

  return TeamMember;
};
