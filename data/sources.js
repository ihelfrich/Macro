export const sources = [
  {
    id: "cpi_yoy",
    label: "CPI Inflation (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Inflation",
    tags: ["prices", "cpi"],
    color: "#ff7a3d"
  },
  {
    id: "core_cpi_yoy",
    label: "Core CPI (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Inflation",
    tags: ["prices", "core"],
    color: "#f39c35"
  },
  {
    id: "pce_yoy",
    label: "PCE Inflation (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Inflation",
    tags: ["prices", "pce"],
    color: "#e07a5f"
  },
  {
    id: "core_pce_yoy",
    label: "Core PCE (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Inflation",
    tags: ["prices", "core"],
    color: "#e0b75a"
  },
  {
    id: "breakeven_10y",
    label: "10Y Breakeven Inflation",
    unit: "%",
    cadence: "monthly",
    category: "Inflation",
    tags: ["expectations", "rates"],
    color: "#f2c94c"
  },
  {
    id: "unemployment",
    label: "Unemployment Rate",
    unit: "%",
    cadence: "monthly",
    category: "Labor",
    tags: ["labor", "jobs"],
    color: "#1b998b"
  },
  {
    id: "payrolls_yoy",
    label: "Payrolls (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Labor",
    tags: ["labor", "jobs"],
    color: "#2a9d8f"
  },
  {
    id: "wage_yoy",
    label: "Wage Growth (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Labor",
    tags: ["labor", "wages"],
    color: "#4fb286"
  },
  {
    id: "participation",
    label: "Labor Force Participation",
    unit: "%",
    cadence: "monthly",
    category: "Labor",
    tags: ["labor"],
    color: "#5bba6f"
  },
  {
    id: "job_openings_yoy",
    label: "Job Openings (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Labor",
    tags: ["labor", "jolts"],
    color: "#2f9e77"
  },
  {
    id: "gdp_yoy",
    label: "Real GDP (YoY)",
    unit: "%",
    cadence: "quarterly",
    category: "Growth",
    tags: ["growth", "output"],
    color: "#3b82f6"
  },
  {
    id: "indpro_yoy",
    label: "Industrial Production (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Growth",
    tags: ["manufacturing"],
    color: "#0b7285"
  },
  {
    id: "retail_sales_yoy",
    label: "Real Retail Sales (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Growth",
    tags: ["consumption"],
    color: "#4c6ef5"
  },
  {
    id: "real_pce_yoy",
    label: "Real PCE (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Growth",
    tags: ["consumption"],
    color: "#228be6"
  },
  {
    id: "pmi",
    label: "ISM PMI",
    unit: "index",
    cadence: "monthly",
    category: "Growth",
    tags: ["survey"],
    color: "#2f4c4a"
  },
  {
    id: "sentiment",
    label: "Consumer Sentiment",
    unit: "index",
    cadence: "monthly",
    category: "Growth",
    tags: ["survey"],
    color: "#8ecae6"
  },
  {
    id: "fed_funds",
    label: "Fed Funds Rate",
    unit: "%",
    cadence: "monthly",
    category: "Rates",
    tags: ["policy"],
    color: "#1d4d4b"
  },
  {
    id: "two_year",
    label: "2Y Treasury Yield",
    unit: "%",
    cadence: "monthly",
    category: "Rates",
    tags: ["rates"],
    color: "#5c7cfa"
  },
  {
    id: "ten_year",
    label: "10Y Treasury Yield",
    unit: "%",
    cadence: "monthly",
    category: "Rates",
    tags: ["rates"],
    color: "#364fc7"
  },
  {
    id: "curve_10y2y",
    label: "10Y-2Y Spread",
    unit: "pts",
    cadence: "monthly",
    category: "Rates",
    tags: ["curve"],
    color: "#4263eb"
  },
  {
    id: "curve_10y3m",
    label: "10Y-3M Spread",
    unit: "pts",
    cadence: "monthly",
    category: "Rates",
    tags: ["curve"],
    color: "#5c5f66"
  },
  {
    id: "baa_spread",
    label: "Baa - 10Y Spread",
    unit: "pts",
    cadence: "monthly",
    category: "Credit",
    tags: ["credit"],
    color: "#d64550"
  },
  {
    id: "high_yield_spread",
    label: "High Yield OAS",
    unit: "pts",
    cadence: "monthly",
    category: "Credit",
    tags: ["credit"],
    color: "#b23a48"
  },
  {
    id: "housing_starts_yoy",
    label: "Housing Starts (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Housing",
    tags: ["housing"],
    color: "#00a896"
  },
  {
    id: "permits_yoy",
    label: "Building Permits (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Housing",
    tags: ["housing"],
    color: "#02c39a"
  },
  {
    id: "home_price_yoy",
    label: "Case-Shiller Home Price (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Housing",
    tags: ["housing"],
    color: "#06d6a0"
  },
  {
    id: "m2_yoy",
    label: "M2 Money Stock (YoY)",
    unit: "%",
    cadence: "monthly",
    category: "Money",
    tags: ["money"],
    color: "#d97706"
  },
  {
    id: "m2_velocity",
    label: "M2 Velocity",
    unit: "ratio",
    cadence: "quarterly",
    category: "Money",
    tags: ["money"],
    color: "#f59f00"
  }
];

export const chartGroups = [
  {
    id: "inflation",
    title: "Inflation + Expectations",
    series: ["cpi_yoy", "core_cpi_yoy", "pce_yoy", "core_pce_yoy", "breakeven_10y"],
    note: "YoY % unless noted"
  },
  {
    id: "labor",
    title: "Labor Market Pulse",
    series: ["unemployment", "payrolls_yoy", "wage_yoy", "participation"],
    note: "Tightness vs rebalancing"
  },
  {
    id: "growth",
    title: "Growth + Demand",
    series: ["gdp_yoy", "indpro_yoy", "retail_sales_yoy", "real_pce_yoy", "pmi"],
    note: "Production + consumption"
  },
  {
    id: "rates",
    title: "Rates + Curve",
    series: ["fed_funds", "two_year", "ten_year", "curve_10y2y"],
    note: "Policy vs market pricing"
  },
  {
    id: "credit",
    title: "Credit Conditions",
    series: ["baa_spread", "high_yield_spread", "curve_10y3m"],
    note: "Spreads and inversion risk"
  },
  {
    id: "housing",
    title: "Housing Momentum",
    series: ["housing_starts_yoy", "permits_yoy", "home_price_yoy"],
    note: "Construction + prices"
  }
];

export const questions = [
  {
    id: "inflation_trend",
    prompt: "Is inflation cooling or re-accelerating?",
    sources: ["cpi_yoy", "core_pce_yoy"],
    compute: (data, utils) => {
      const cpi = data.cpi_yoy;
      const pce = data.core_pce_yoy;
      if (!cpi && !pce) return utils.na();
      const series = cpi || pce;
      const slope = utils.slope(series, 6);
      const latest = utils.latest(series);
      const direction = slope < -0.02 ? "Cooling" : slope > 0.02 ? "Re-accelerating" : "Holding steady";
      return utils.answer(
        direction,
        slope < 0 ? "good" : slope > 0 ? "warn" : "neutral",
        `${utils.formatValue(latest.value, "%")} as of ${utils.formatDate(latest.date)}`
      );
    }
  },
  {
    id: "labor_heat",
    prompt: "Is the labor market loosening?",
    sources: ["unemployment", "wage_yoy"],
    compute: (data, utils) => {
      const unemp = data.unemployment;
      if (!unemp) return utils.na();
      const slope = utils.slope(unemp, 6);
      const latest = utils.latest(unemp);
      const direction = slope > 0.03 ? "Loosening" : slope < -0.02 ? "Tightening" : "Stable";
      return utils.answer(
        direction,
        slope > 0 ? "warn" : "good",
        `${utils.formatValue(latest.value, "%")} unemployment, 6m trend ${utils.formatSigned(slope, 2)} pts`
      );
    }
  },
  {
    id: "growth_momentum",
    prompt: "Is growth holding above stall speed?",
    sources: ["gdp_yoy", "pmi", "retail_sales_yoy"],
    compute: (data, utils) => {
      const gdp = data.gdp_yoy;
      if (!gdp) return utils.na();
      const latest = utils.latest(gdp);
      const status = latest.value >= 2 ? "good" : latest.value >= 1 ? "neutral" : "warn";
      const label = latest.value >= 2.5 ? "Above trend" : latest.value >= 1 ? "Below trend" : "At risk";
      return utils.answer(label, status, `Real GDP ${utils.formatValue(latest.value, "%")} YoY`);
    }
  },
  {
    id: "curve",
    prompt: "Is the yield curve still inverted?",
    sources: ["curve_10y2y"],
    compute: (data, utils) => {
      const spreadSeries = data.curve_10y2y;
      if (!spreadSeries) return utils.na();
      const latest = utils.latest(spreadSeries);
      const status = latest.value < 0 ? "warn" : "good";
      const label = latest.value < 0 ? "Inverted" : "Positive";
      return utils.answer(
        label,
        status,
        `10Y-2Y spread ${utils.formatSigned(latest.value, 2)} pts`
      );
    }
  },
  {
    id: "risk",
    prompt: "Are credit conditions tightening?",
    sources: ["high_yield_spread"],
    compute: (data, utils) => {
      const spread = data.high_yield_spread;
      if (!spread) return utils.na();
      const slope = utils.slope(spread, 4);
      const latest = utils.latest(spread);
      const label = slope > 0.03 ? "Tightening" : slope < -0.02 ? "Easing" : "Stable";
      const status = slope > 0 ? "warn" : "good";
      return utils.answer(
        label,
        status,
        `Spread ${utils.formatValue(latest.value, "pts")}, 4m change ${utils.formatSigned(slope, 2)} pts`
      );
    }
  }
];
