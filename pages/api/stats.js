export default async function handler(req, res) {
  const allStats = {
    damagedBuildings: { total: 140000, fullyDestroyed: 40000, severelyDamaged: 50000 },
    debrisVolume: null,
    fundingNeedsBySector: { totalCostEstimate: { min: 250000, max: 1000000 } }
  };

  const byGov = {
    Aleppo: { total: 30000, fullyDestroyed: 8000, severelyDamaged: 10000 },
    Damascus: { total: 20000, fullyDestroyed: 5000, severelyDamaged: 7000 },
    Homs: { total: 25000, fullyDestroyed: 6000, severelyDamaged: 9000 },
    Idlib: { total: 15000, fullyDestroyed: 4000, severelyDamaged: 6000 },
    "Deir ez-Zor": { total: 12000, fullyDestroyed: 3000, severelyDamaged: 5000 },
    Raqqa: { total: 10000, fullyDestroyed: 2500, severelyDamaged: 4500 },
    "Rural Damascus": { total: 18000, fullyDestroyed: 4500, severelyDamaged: 7500 },
    Daraa: { total: 15000, fullyDestroyed: 4000, severelyDamaged: 6000 }
  };

  const { gov } = req.query;

  let statsData;
  if (gov && gov !== 'All' && byGov[gov]) {
    statsData = {
      damagedBuildings: byGov[gov],
      debrisVolume: null,
      fundingNeedsBySector: allStats.fundingNeedsBySector
    };
  } else {
    statsData = allStats;
  }

  return res.status(200).json(statsData);
}