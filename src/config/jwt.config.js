module.exports = {
  secret: process.env.JWT_SECRET || "nima_jewellers_secret",
  expiresIn: "7d",
};
