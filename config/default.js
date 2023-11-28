module.exports = {
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6, // Aantal iteraties
      memoryCost: 2 ** 17, // Maximaal geheugen
    },
    jwt: {
      secret:
        "eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked",
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: "budget.hogent.be",
      audience: "budget.hogent.be",
    },
  },
};
