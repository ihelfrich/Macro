export const sources = [
  {
    id: "cpi",
    label: "CPI Inflation (YoY)",
    endpoint: "/macro/cpi",
    unit: "%",
    cadence: "monthly",
    color: "#ff7a3d"
  },
  {
    id: "core_pce",
    label: "Core PCE (YoY)",
    endpoint: "/macro/core-pce",
    unit: "%",
    cadence: "monthly",
    color: "#e0b75a"
  },
  {
    id: "unemployment",
    label: "Unemployment Rate",
    endpoint: "/macro/unemployment",
    unit: "%",
    cadence: "monthly",
    color: "#0f766e"
  },
  {
    id: "wage_growth",
    label: "Wage Growth (YoY)",
    endpoint: "/macro/wages",
    unit: "%",
    cadence: "monthly",
    color: "#285e5a"
  },
  {
    id: "gdp",
    label: "Real GDP (YoY)",
    endpoint: "/macro/gdp",
    unit: "%",
    cadence: "quarterly",
    color: "#3d6b60"
  },
  {
    id: "retail_sales",
    label: "Real Retail Sales (YoY)",
    endpoint: "/macro/retail-sales",
    unit: "%",
    cadence: "monthly",
    color: "#c86b3c"
  },
  {
    id: "pmi",
    label: "PMI",
    endpoint: "/macro/pmi",
    unit: "index",
    cadence: "monthly",
    color: "#2f4c4a"
  },
  {
    id: "policy_rate",
    label: "Policy Rate",
    endpoint: "/rates/policy",
    unit: "%",
    cadence: "monthly",
    color: "#1d4d4b"
  },
  {
    id: "ten_year",
    label: "10Y Yield",
    endpoint: "/rates/10y",
    unit: "%",
    cadence: "monthly",
    color: "#354f5d"
  },
  {
    id: "two_year",
    label: "2Y Yield",
    endpoint: "/rates/2y",
    unit: "%",
    cadence: "monthly",
    color: "#6b7a74"
  },
  {
    id: "credit_spread",
    label: "Credit Spread",
    endpoint: "/risk/credit-spread",
    unit: "%",
    cadence: "monthly",
    color: "#b8562c"
  }
];

export const chartGroups = [
  {
    id: "inflation",
    title: "Inflation Glidepath",
    series: ["cpi", "core_pce"],
    note: "YoY %"
  },
  {
    id: "labor",
    title: "Labor Tightness",
    series: ["unemployment", "wage_growth"],
    note: "Lower unemployment + cooling wages = easing pressure"
  },
  {
    id: "growth",
    title: "Growth & Demand",
    series: ["gdp", "retail_sales", "pmi"],
    note: "Quarterly GDP with monthly demand indicators"
  },
  {
    id: "rates",
    title: "Rates & Curve",
    series: ["policy_rate", "two_year", "ten_year"],
    note: "Policy vs market repricing"
  }
];

export const questions = [
  {
    id: "inflation_trend",
    prompt: "Is inflation cooling or re-accelerating?",
    sources: ["cpi", "core_pce"],
    compute: (data, utils) => {
      const cpi = data.cpi;
      const pce = data.core_pce;
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
    sources: ["unemployment", "wage_growth"],
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
    sources: ["gdp", "pmi", "retail_sales"],
    compute: (data, utils) => {
      const gdp = data.gdp;
      if (!gdp) return utils.na();
      const latest = utils.latest(gdp);
      const status = latest.value >= 2 ? "good" : latest.value >= 1 ? "neutral" : "warn";
      const label = latest.value >= 2.5 ? "Above trend" : latest.value >= 1 ? "Below trend" : "At risk";
      return utils.answer(
        label,
        status,
        `Real GDP ${utils.formatValue(latest.value, "%")} YoY`
      );
    }
  },
  {
    id: "curve",
    prompt: "Is the yield curve still inverted?",
    sources: ["ten_year", "two_year"],
    compute: (data, utils) => {
      const ten = data.ten_year;
      const two = data.two_year;
      if (!ten || !two) return utils.na();
      const spread = utils.latest(ten).value - utils.latest(two).value;
      const status = spread < 0 ? "warn" : "good";
      const label = spread < 0 ? "Inverted" : "Positive";
      return utils.answer(
        label,
        status,
        `10Y-2Y spread ${utils.formatSigned(spread, 2)} pts`
      );
    }
  },
  {
    id: "risk",
    prompt: "Are credit conditions tightening?",
    sources: ["credit_spread"],
    compute: (data, utils) => {
      const spread = data.credit_spread;
      if (!spread) return utils.na();
      const slope = utils.slope(spread, 4);
      const latest = utils.latest(spread);
      const label = slope > 0.03 ? "Tightening" : slope < -0.02 ? "Easing" : "Stable";
      const status = slope > 0 ? "warn" : "good";
      return utils.answer(
        label,
        status,
        `Spread ${utils.formatValue(latest.value, "%")}, 4m change ${utils.formatSigned(slope, 2)} pts`
      );
    }
  }
];
