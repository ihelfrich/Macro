import { sources, chartGroups, questions } from "./data/sources.js";
import { mockSeries } from "./data/mock.js";

const DEFAULT_CONFIG = {
  baseUrl: "",
  apiKey: "",
  headers: {},
  refreshInterval: 300
};

const DEFAULT_VOICE = {
  name: "Dr. Ian Helfrich",
  tagline: "Chief Research Economist · Geospatial trade + macro systems",
  voiceLine: "Regimes beat headlines. Structure beats noise.",
  tone: "direct, decisive, data-first"
};

const DEFAULT_WEIGHTS = {
  inflation: 1,
  labor: 1,
  growth: 1,
  curve: 1,
  credit: 1,
  demand: 1
};

const DEFAULT_SCENARIOS = {
  oilShock: false,
  policyCut: false,
  creditTightening: false,
  demandSurge: false
};

const SCENARIO_LIBRARY = {
  oilShock: {
    label: "Oil shock",
    description: "+inflation, -growth",
    inflation: 0.4,
    growth: -0.2,
    scoreDelta: -6
  },
  policyCut: {
    label: "Policy cut",
    description: "-inflation, +growth",
    inflation: -0.2,
    growth: 0.3,
    scoreDelta: 4
  },
  creditTightening: {
    label: "Credit tightening",
    description: "-growth, +risk",
    inflation: 0.1,
    growth: -0.4,
    scoreDelta: -5
  },
  demandSurge: {
    label: "Demand surge",
    description: "+growth, +inflation",
    inflation: 0.3,
    growth: 0.4,
    scoreDelta: 5
  }
};

const TRANSACTION_LIBRARY = {
  haircut: {
    components: ["C"],
    note: "Personal services are final consumption; they land in C immediately."
  },
  mustang: {
    components: ["C", "I"],
    note: "Final sale counts in C, inventory falls so I decreases (net GDP unchanged vs production period)."
  },
  oldHouse: {
    components: [],
    note: "Existing assets do not add to GDP; only broker fees/services would."
  },
  newHouse: {
    components: ["I"],
    note: "New residential construction is investment."
  },
  fridge: {
    components: ["C"],
    note: "Household durable purchase is consumption; domestic production keeps NX unchanged."
  }
};

const state = {
  series: {},
  status: {},
  charts: {},
  config: { ...DEFAULT_CONFIG },
  voice: { ...DEFAULT_VOICE },
  weights: { ...DEFAULT_WEIGHTS },
  scenarios: { ...DEFAULT_SCENARIOS },
  activeQuestionId: null,
  refreshTimer: null,
  portraitDraft: null
};

const elements = {
  clock: document.getElementById("clock"),
  macroScore: document.getElementById("macroScore"),
  macroScoreNote: document.getElementById("macroScoreNote"),
  macroRegime: document.getElementById("macroRegime"),
  macroRegimeNote: document.getElementById("macroRegimeNote"),
  macroPulse: document.getElementById("macroPulse"),
  macroPulseNote: document.getElementById("macroPulseNote"),
  heroInsight: document.getElementById("heroInsight"),
  heroShift: document.getElementById("heroShift"),
  heroScenario: document.getElementById("heroScenario"),
  questionGrid: document.getElementById("questionGrid"),
  coverageBadge: document.getElementById("coverageBadge"),
  latestTable: document.getElementById("latestTable").querySelector("tbody"),
  lastRefresh: document.getElementById("lastRefresh"),
  dataStatus: document.getElementById("dataStatus"),
  refreshBtn: document.getElementById("refreshBtn"),
  connectBtn: document.getElementById("connectBtn"),
  drawer: document.getElementById("configDrawer"),
  closeDrawer: document.getElementById("closeDrawer"),
  saveConfig: document.getElementById("saveConfig"),
  baseUrl: document.getElementById("baseUrl"),
  apiKey: document.getElementById("apiKey"),
  headerJson: document.getElementById("headerJson"),
  refreshInterval: document.getElementById("refreshInterval"),
  ianName: document.getElementById("ianName"),
  ianTaglineDisplay: document.getElementById("ianTaglineDisplay"),
  ianVoiceLine: document.getElementById("ianVoiceLine"),
  ianPortrait: document.getElementById("ianPortrait"),
  ianPlaceholder: document.getElementById("ianPlaceholder"),
  updateVoiceBtn: document.getElementById("updateVoiceBtn"),
  voiceDrawer: document.getElementById("voiceDrawer"),
  closeVoiceDrawer: document.getElementById("closeVoiceDrawer"),
  saveVoice: document.getElementById("saveVoice"),
  ianNameInput: document.getElementById("ianNameInput"),
  ianTaglineInput: document.getElementById("ianTagline"),
  ianVoiceInput: document.getElementById("ianVoiceText"),
  ianToneInput: document.getElementById("ianTone"),
  ianPortraitInput: document.getElementById("ianPortraitInput"),
  ianCallHeadline: document.getElementById("ianCallHeadline"),
  ianCallDetail: document.getElementById("ianCallDetail"),
  callConfidence: document.getElementById("callConfidence"),
  copyCallBtn: document.getElementById("copyCallBtn"),
  shareCallBtn: document.getElementById("shareCallBtn"),
  driverList: document.getElementById("driverList"),
  baseScoreValue: document.getElementById("baseScoreValue"),
  scenarioScoreValue: document.getElementById("scenarioScoreValue"),
  scenarioDeltaValue: document.getElementById("scenarioDeltaValue"),
  resetWeightsBtn: document.getElementById("resetWeightsBtn"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  regimeMapNote: document.getElementById("regimeMapNote"),
  questionDrawer: document.getElementById("questionDrawer"),
  closeQuestionDrawer: document.getElementById("closeQuestionDrawer"),
  deepDiveTitle: document.getElementById("deepDiveTitle"),
  deepDiveNarrative: document.getElementById("deepDiveNarrative"),
  deepDiveStats: document.getElementById("deepDiveStats"),
  deepDiveChart: document.getElementById("deepDiveChart"),
  outputGap: document.getElementById("outputGap"),
  outputGapValue: document.getElementById("outputGapValue"),
  outputMomentum: document.getElementById("outputMomentum"),
  outputMomentumValue: document.getElementById("outputMomentumValue"),
  cycleDot: document.getElementById("cycleDot"),
  cycleResult: document.getElementById("cycleResult"),
  transactionSelect: document.getElementById("transactionSelect"),
  transactionChips: Array.from(document.querySelectorAll("#transactionChips .chip")),
  transactionOutput: document.getElementById("transactionOutput"),
  prodA: document.getElementById("prodA"),
  prodK: document.getElementById("prodK"),
  prodL: document.getElementById("prodL"),
  prodAlpha: document.getElementById("prodAlpha"),
  prodOutput: document.getElementById("prodOutput"),
  prodPerWorker: document.getElementById("prodPerWorker"),
  vaAgSales: document.getElementById("vaAgSales"),
  vaAgInputs: document.getElementById("vaAgInputs"),
  vaManSales: document.getElementById("vaManSales"),
  vaManInputs: document.getElementById("vaManInputs"),
  vaServSales: document.getElementById("vaServSales"),
  vaServInputs: document.getElementById("vaServInputs"),
  incWages: document.getElementById("incWages"),
  incProfits: document.getElementById("incProfits"),
  incTaxes: document.getElementById("incTaxes"),
  incDep: document.getElementById("incDep"),
  expC: document.getElementById("expC"),
  expI: document.getElementById("expI"),
  expG: document.getElementById("expG"),
  expX: document.getElementById("expX"),
  expM: document.getElementById("expM"),
  gdpValueAdded: document.getElementById("gdpValueAdded"),
  gdpIncome: document.getElementById("gdpIncome"),
  gdpExpenditure: document.getElementById("gdpExpenditure"),
  accountsSummary: document.getElementById("accountsSummary"),
  chocQ1: document.getElementById("chocQ1"),
  chocP1: document.getElementById("chocP1"),
  chocNom1: document.getElementById("chocNom1"),
  chocReal1: document.getElementById("chocReal1"),
  chocDef1: document.getElementById("chocDef1"),
  chocQ2: document.getElementById("chocQ2"),
  chocP2: document.getElementById("chocP2"),
  chocNom2: document.getElementById("chocNom2"),
  chocReal2: document.getElementById("chocReal2"),
  chocDef2: document.getElementById("chocDef2"),
  chocQ3: document.getElementById("chocQ3"),
  chocP3: document.getElementById("chocP3"),
  chocNom3: document.getElementById("chocNom3"),
  chocReal3: document.getElementById("chocReal3"),
  chocDef3: document.getElementById("chocDef3"),
  chocGrowth: document.getElementById("chocGrowth"),
  chocInflation: document.getElementById("chocInflation"),
  rateShock: document.getElementById("rateShock"),
  rateShockValue: document.getElementById("rateShockValue"),
  rateOutput: document.getElementById("rateOutput"),
  rateNote: document.getElementById("rateNote"),
  savY: document.getElementById("savY"),
  savC: document.getElementById("savC"),
  savG: document.getElementById("savG"),
  savT: document.getElementById("savT"),
  savPrivate: document.getElementById("savPrivate"),
  savPublic: document.getElementById("savPublic"),
  savNational: document.getElementById("savNational"),
  longRunGrowth: document.getElementById("longRunGrowth"),
  latestGrowth: document.getElementById("latestGrowth"),
  growthVol: document.getElementById("growthVol")
};

elements.weightInputs = Array.from(document.querySelectorAll("[data-weight]"));
elements.weightValueOutputs = Array.from(document.querySelectorAll("[data-weight-value]"));
elements.scenarioInputs = Array.from(document.querySelectorAll("[data-scenario]"));

const utils = {
  formatDate(dateStr) {
    if (!dateStr) return "--";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  },
  formatValue(value, unit) {
    if (value === null || value === undefined || Number.isNaN(value)) return "--";
    const rounded = Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2);
    return unit === "index" ? `${rounded}` : `${rounded}${unit || ""}`;
  },
  formatSigned(value, decimals = 2) {
    if (value === null || value === undefined || Number.isNaN(value)) return "--";
    const rounded = value.toFixed(decimals);
    return value > 0 ? `+${rounded}` : `${rounded}`;
  },
  formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || Number.isNaN(value)) return "--";
    return Number(value).toFixed(decimals);
  },
  latest(series) {
    if (!series || !series.length) return { value: null, date: null, t: null };
    return series[series.length - 1];
  },
  slope(series, periods = 6) {
    if (!series || series.length < 2) return 0;
    const slice = series.slice(-periods);
    if (slice.length < 2) return 0;
    const start = slice[0].value;
    const end = slice[slice.length - 1].value;
    return (end - start) / (slice.length - 1);
  },
  delta(series, steps = 3) {
    if (!series || series.length <= steps) return 0;
    const end = series[series.length - 1].value;
    const start = series[series.length - 1 - steps].value;
    return end - start;
  },
  answer(title, status, footnote) {
    return { title, status, footnote };
  },
  na() {
    return { title: "Waiting on data", status: "neutral", footnote: "Connect a live series" };
  },
  clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
};

const statusLabels = {
  good: "On track",
  warn: "Watch",
  neutral: "Neutral"
};

init();

function init() {
  loadConfig();
  loadVoice();
  loadLabSettings();
  initQuestionCards();
  initStudio();
  wireEvents();
  startClock();
  refreshData();
}

function loadConfig() {
  const stored = localStorage.getItem("macroConfig");
  if (stored) {
    try {
      state.config = { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch (err) {
      state.config = { ...DEFAULT_CONFIG };
    }
  }
  applyConfigToForm();
}

function applyConfigToForm() {
  elements.baseUrl.value = state.config.baseUrl || "";
  elements.apiKey.value = state.config.apiKey || "";
  elements.headerJson.value = JSON.stringify(state.config.headers || {}, null, 2);
  elements.refreshInterval.value = state.config.refreshInterval || 300;
}

function saveConfig() {
  const headers = parseHeaders(elements.headerJson.value);
  state.config = {
    baseUrl: elements.baseUrl.value.trim(),
    apiKey: elements.apiKey.value.trim(),
    headers,
    refreshInterval: Math.max(30, Number(elements.refreshInterval.value) || 300)
  };
  localStorage.setItem("macroConfig", JSON.stringify(state.config));
  applyConfigToForm();
  setupRefreshTimer();
}

function loadVoice() {
  const stored = localStorage.getItem("macroVoice");
  if (stored) {
    try {
      state.voice = { ...DEFAULT_VOICE, ...JSON.parse(stored) };
    } catch (err) {
      state.voice = { ...DEFAULT_VOICE };
    }
  }
  applyVoiceToUI();
  applyPortrait();
}

function applyVoiceToUI() {
  elements.ianName.textContent = state.voice.name;
  elements.ianTaglineDisplay.textContent = state.voice.tagline;
  elements.ianVoiceLine.textContent = `"${state.voice.voiceLine}"`;

  elements.ianNameInput.value = state.voice.name;
  elements.ianTaglineInput.value = state.voice.tagline;
  elements.ianVoiceInput.value = state.voice.voiceLine;
  elements.ianToneInput.value = state.voice.tone;
}

function applyPortrait() {
  const storedPortrait = localStorage.getItem("macroPortrait");
  if (storedPortrait) {
    elements.ianPortrait.src = storedPortrait;
  }
  const hidePlaceholder = () => elements.ianPlaceholder.classList.add("hidden");
  const showPlaceholder = () => elements.ianPlaceholder.classList.remove("hidden");
  elements.ianPortrait.addEventListener("load", hidePlaceholder);
  elements.ianPortrait.addEventListener("error", showPlaceholder);
  if (elements.ianPortrait.complete && elements.ianPortrait.naturalWidth > 0) {
    hidePlaceholder();
  }
}

function saveVoiceConfig() {
  state.voice = {
    name: elements.ianNameInput.value.trim() || DEFAULT_VOICE.name,
    tagline: elements.ianTaglineInput.value.trim() || DEFAULT_VOICE.tagline,
    voiceLine: elements.ianVoiceInput.value.trim() || DEFAULT_VOICE.voiceLine,
    tone: elements.ianToneInput.value.trim() || DEFAULT_VOICE.tone
  };
  localStorage.setItem("macroVoice", JSON.stringify(state.voice));
  applyVoiceToUI();

  if (state.portraitDraft) {
    localStorage.setItem("macroPortrait", state.portraitDraft);
    elements.ianPortrait.src = state.portraitDraft;
    state.portraitDraft = null;
  }
}

function loadLabSettings() {
  const storedWeights = localStorage.getItem("macroWeights");
  const storedScenarios = localStorage.getItem("macroScenarios");

  if (storedWeights) {
    try {
      state.weights = { ...DEFAULT_WEIGHTS, ...JSON.parse(storedWeights) };
    } catch (err) {
      state.weights = { ...DEFAULT_WEIGHTS };
    }
  }

  if (storedScenarios) {
    try {
      state.scenarios = { ...DEFAULT_SCENARIOS, ...JSON.parse(storedScenarios) };
    } catch (err) {
      state.scenarios = { ...DEFAULT_SCENARIOS };
    }
  }

  Object.keys(state.weights).forEach((key) => {
    const value = Number(state.weights[key]);
    state.weights[key] = Number.isFinite(value) ? value : DEFAULT_WEIGHTS[key];
  });

  Object.keys(state.scenarios).forEach((key) => {
    state.scenarios[key] = Boolean(state.scenarios[key]);
  });

  applyLabSettingsToUI();
}

function applyLabSettingsToUI() {
  elements.weightInputs.forEach((input) => {
    const key = input.dataset.weight;
    if (!key) return;
    input.value = state.weights[key] ?? 1;
    updateWeightDisplay(key);
  });

  elements.scenarioInputs.forEach((input) => {
    const key = input.dataset.scenario;
    if (!key) return;
    input.checked = Boolean(state.scenarios[key]);
  });
}

function saveLabSettings() {
  localStorage.setItem("macroWeights", JSON.stringify(state.weights));
  localStorage.setItem("macroScenarios", JSON.stringify(state.scenarios));
}

function updateWeightDisplay(key) {
  const output = elements.weightValueOutputs.find((item) => item.dataset.weightValue === key);
  if (output) {
    const value = Number(state.weights[key] ?? 1).toFixed(2);
    output.textContent = `${value}x`;
  }
}

function initStudio() {
  renderCycle();
  renderTransaction();
  renderAccounts();
  renderChocolate();
  renderRateShock();
  renderSavings();
  renderProduction();
  renderLongRunGrowth();
}

function parseHeaders(value) {
  if (!value || !value.trim()) return {};
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch (err) {
    return {};
  }
}

function wireEvents() {
  elements.connectBtn.addEventListener("click", () => elements.drawer.classList.add("open"));
  elements.closeDrawer.addEventListener("click", () => elements.drawer.classList.remove("open"));
  elements.saveConfig.addEventListener("click", () => {
    saveConfig();
    elements.drawer.classList.remove("open");
    refreshData();
  });
  elements.refreshBtn.addEventListener("click", refreshData);
  elements.drawer.addEventListener("click", (event) => {
    if (event.target === elements.drawer) {
      elements.drawer.classList.remove("open");
    }
  });

  elements.updateVoiceBtn.addEventListener("click", () => elements.voiceDrawer.classList.add("open"));
  elements.closeVoiceDrawer.addEventListener("click", () => elements.voiceDrawer.classList.remove("open"));
  elements.saveVoice.addEventListener("click", () => {
    saveVoiceConfig();
    elements.voiceDrawer.classList.remove("open");
    renderCall();
  });
  elements.voiceDrawer.addEventListener("click", (event) => {
    if (event.target === elements.voiceDrawer) {
      elements.voiceDrawer.classList.remove("open");
    }
  });

  elements.ianPortraitInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.portraitDraft = reader.result;
    };
    reader.readAsDataURL(file);
  });

  elements.weightInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.weight;
      if (!key) return;
      state.weights[key] = Number(input.value);
      updateWeightDisplay(key);
      saveLabSettings();
      renderHero();
      renderCall();
      renderSignalLab();
      renderRegimeMap();
    });
  });

  elements.scenarioInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const key = input.dataset.scenario;
      if (!key) return;
      state.scenarios[key] = input.checked;
      saveLabSettings();
      renderSignalLab();
      renderRegimeMap();
      renderHero();
      renderCall();
    });
  });

  elements.resetWeightsBtn.addEventListener("click", () => {
    state.weights = { ...DEFAULT_WEIGHTS };
    applyLabSettingsToUI();
    saveLabSettings();
    renderHero();
    renderCall();
    renderSignalLab();
    renderRegimeMap();
  });

  elements.copyCallBtn.addEventListener("click", copyCallToClipboard);
  elements.shareCallBtn.addEventListener("click", shareCall);

  elements.closeQuestionDrawer.addEventListener("click", closeQuestionDrawer);
  elements.questionDrawer.addEventListener("click", (event) => {
    if (event.target === elements.questionDrawer) {
      closeQuestionDrawer();
    }
  });

  wireStudioEvents();
}

function wireStudioEvents() {
  if (elements.outputGap) {
    elements.outputGap.addEventListener("input", renderCycle);
  }
  if (elements.outputMomentum) {
    elements.outputMomentum.addEventListener("input", renderCycle);
  }
  if (elements.transactionSelect) {
    elements.transactionSelect.addEventListener("change", renderTransaction);
  }

  const accountInputs = [
    elements.vaAgSales,
    elements.vaAgInputs,
    elements.vaManSales,
    elements.vaManInputs,
    elements.vaServSales,
    elements.vaServInputs,
    elements.incWages,
    elements.incProfits,
    elements.incTaxes,
    elements.incDep,
    elements.expC,
    elements.expI,
    elements.expG,
    elements.expX,
    elements.expM
  ];
  accountInputs.forEach((input) => input && input.addEventListener("input", renderAccounts));

  const chocInputs = [
    elements.chocQ1,
    elements.chocP1,
    elements.chocQ2,
    elements.chocP2,
    elements.chocQ3,
    elements.chocP3
  ];
  chocInputs.forEach((input) => input && input.addEventListener("input", renderChocolate));

  if (elements.rateShock) {
    elements.rateShock.addEventListener("input", renderRateShock);
  }

  const savingsInputs = [elements.savY, elements.savC, elements.savG, elements.savT];
  savingsInputs.forEach((input) => input && input.addEventListener("input", renderSavings));

  const prodInputs = [elements.prodA, elements.prodK, elements.prodL, elements.prodAlpha];
  prodInputs.forEach((input) => input && input.addEventListener("input", renderProduction));
}

function startClock() {
  const update = () => {
    const now = new Date();
    elements.clock.textContent = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };
  update();
  setInterval(update, 1000 * 20);
}

function setupRefreshTimer() {
  if (state.refreshTimer) clearInterval(state.refreshTimer);
  state.refreshTimer = setInterval(refreshData, state.config.refreshInterval * 1000);
}

async function refreshData() {
  setupRefreshTimer();
  const fetches = sources.map((source) => fetchSourceSeries(source));
  await Promise.all(fetches);
  updateCoverage();
  renderQuestions();
  renderHero();
  renderCall();
  renderSignalLab();
  renderRegimeMap();
  renderCharts();
  renderTable();
  renderLongRunGrowth();
  if (state.activeQuestionId) {
    renderDeepDive(state.activeQuestionId);
  }
  const now = new Date();
  elements.lastRefresh.textContent = now.toLocaleString();
}

async function fetchSourceSeries(source) {
  const { baseUrl } = state.config;
  let url = source.endpoint;
  if (!/^https?:/i.test(url)) {
    if (!baseUrl) {
      state.status[source.id] = "mock";
      state.series[source.id] = mockSeries[source.id] || [];
      return;
    }
    url = `${baseUrl.replace(/\/$/, "")}${source.endpoint}`;
  }

  const headers = buildHeaders();

  try {
    const response = await fetch(url, { headers, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    const series = normalizeSeries(json);
    if (!series.length) throw new Error("Empty series");
    state.series[source.id] = series;
    state.status[source.id] = "live";
  } catch (err) {
    state.series[source.id] = mockSeries[source.id] || [];
    state.status[source.id] = mockSeries[source.id] ? "mock" : "missing";
  }
}

function buildHeaders() {
  const headers = { ...state.config.headers };
  if (state.config.apiKey) {
    headers.Authorization = `Bearer ${state.config.apiKey}`;
  }
  return headers;
}

function normalizeSeries(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return normalizeArray(payload);
  if (payload.series) return normalizeSeries(payload.series);
  if (payload.data) return normalizeSeries(payload.data);
  if (payload.results) return normalizeSeries(payload.results);
  if (payload.result) return normalizeSeries(payload.result);
  if (payload.observations) return normalizeSeries(payload.observations);
  if (payload.items) return normalizeSeries(payload.items);
  if (typeof payload === "object") {
    const asArray = Object.entries(payload)
      .filter(([, value]) => typeof value === "number" || typeof value === "string")
      .map(([key, value]) => ({ date: key, value }));
    return normalizeArray(asArray);
  }
  return [];
}

function normalizeArray(arr) {
  const points = arr
    .map((item) => {
      if (Array.isArray(item)) {
        const [date, value] = item;
        return createPoint(date, value);
      }
      if (typeof item === "object" && item) {
        const dateKey = pickKey(item, ["date", "period", "time", "timestamp", "month", "quarter"]);
        const valueKey = pickKey(item, ["value", "v", "rate", "yoy", "index", "level", "close"]);
        return createPoint(item[dateKey], item[valueKey]);
      }
      return null;
    })
    .filter(Boolean);

  const cleaned = points
    .filter((point) => point && Number.isFinite(point.value) && point.date)
    .sort((a, b) => a.t - b.t);

  return cleaned;
}

function pickKey(obj, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return key;
  }
  return null;
}

function createPoint(dateRaw, valueRaw) {
  if (!dateRaw || valueRaw === null || valueRaw === undefined) return null;
  let date;
  if (typeof dateRaw === "number") {
    const timestamp = dateRaw > 1e12 ? dateRaw : dateRaw * 1000;
    date = new Date(timestamp).toISOString().slice(0, 10);
  } else {
    date = String(dateRaw).slice(0, 10);
  }
  const value = Number(valueRaw);
  if (!Number.isFinite(value)) return null;
  const t = new Date(date).getTime();
  if (!Number.isFinite(t)) return null;
  return { date, value, t };
}

function updateCoverage() {
  const total = sources.length;
  const live = Object.values(state.status).filter((s) => s === "live").length;
  const mock = Object.values(state.status).filter((s) => s === "mock").length;
  const missing = total - live - mock;
  elements.coverageBadge.textContent = `Coverage: ${live}/${total} live`;
  elements.dataStatus.textContent = `${live} live · ${mock} mock · ${missing} missing`;
}

function initQuestionCards() {
  elements.questionGrid.innerHTML = "";
  questions.forEach((question, index) => {
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.style.setProperty("--delay", `${0.1 + index * 0.08}s`);
    card.dataset.questionId = question.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open deep dive for ${question.prompt}`);
    card.innerHTML = `
      <div class="label">${question.prompt}</div>
      <div class="answer">--</div>
      <div class="footnote">--</div>
    `;
    card.addEventListener("click", () => openQuestionDrawer(question.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openQuestionDrawer(question.id);
      }
    });
    elements.questionGrid.appendChild(card);
  });
}

function renderQuestions() {
  questions.forEach((question) => {
    const card = elements.questionGrid.querySelector(`[data-question-id="${question.id}"]`);
    if (!card) return;
    const result = question.compute(state.series, utils);
    card.querySelector(".answer").textContent = result.title;
    card.querySelector(".footnote").textContent = result.footnote || "";
    card.querySelector(".answer").className = "answer";
    card.querySelector(".footnote").className = "footnote";
    card.dataset.status = result.status || "neutral";
  });
}

function renderHero() {
  const score = computeMacroScore(state.weights);
  elements.macroScore.textContent = score.toFixed(0);
  elements.macroScoreNote.textContent = score >= 65 ? "Expansion leaning" : score >= 45 ? "Balanced" : "Caution";

  const regime = computeRegime();
  elements.macroRegime.textContent = regime.label;
  elements.macroRegimeNote.textContent = regime.note;

  const pulse = score >= 70 ? "Expanding" : score >= 55 ? "Steady" : score >= 40 ? "Cooling" : "Risky";
  elements.macroPulse.textContent = pulse;
  elements.macroPulseNote.textContent = `Score ${score.toFixed(0)} / 100`;

  elements.heroInsight.textContent = regime.insight;
  elements.heroShift.textContent = buildShiftNarrative();
  elements.heroScenario.textContent = formatScenarioSummary("sentence");
}

function renderCall() {
  const score = computeMacroScore(state.weights);
  const regime = computeRegime();
  const pulse = score >= 70 ? "expanding" : score >= 55 ? "steady" : score >= 40 ? "cooling" : "risk-on pause";
  const posture = score >= 65 ? "lean risk-on" : score >= 50 ? "stay balanced" : "stay defensive";
  const callHeadline = `${regime.label} with ${pulse} pulse. I ${posture}.`;
  const scenarioLine = formatScenarioSummary("short");
  const detail = `${buildShiftNarrative()} ${scenarioLine}`.trim();

  elements.ianCallHeadline.textContent = callHeadline;
  elements.ianCallDetail.textContent = detail;

  const confidence = score >= 70 ? "High" : score >= 55 ? "Medium" : "Guarded";
  elements.callConfidence.textContent = `Conviction: ${confidence}`;

  const drivers = computeScoreDrivers(state.weights).slice(0, 3);
  if (drivers.length) {
    elements.driverList.innerHTML = drivers
      .map(
        (driver) => `
        <div class="driver-item">
          <span>${driver.label}</span>
          <span class="driver-impact">${utils.formatSigned(driver.impact, 1)}</span>
        </div>
      `
      )
      .join("");
  } else {
    elements.driverList.innerHTML = "<div class=\"driver-item\">Awaiting data</div>";
  }
}

function renderSignalLab() {
  const baseScore = computeMacroScore(state.weights);
  const scenarioDelta = computeScenarioDelta();
  const scenarioScore = utils.clamp(baseScore + scenarioDelta, 0, 100);

  elements.baseScoreValue.textContent = baseScore.toFixed(0);
  elements.scenarioScoreValue.textContent = scenarioScore.toFixed(0);
  elements.scenarioDeltaValue.textContent = `Delta ${utils.formatSigned(scenarioDelta, 1)}`;
  elements.scenarioDeltaValue.classList.remove("positive", "negative");
  elements.scenarioDeltaValue.classList.add(scenarioDelta >= 0 ? "positive" : "negative");

  elements.scenarioSummary.textContent = formatScenarioSummary("detailed");
}

function renderRegimeMap() {
  const inflation = state.series.cpi || state.series.core_pce;
  const growth = state.series.gdp;
  if (!inflation || !growth || !inflation.length || !growth.length) {
    elements.regimeMapNote.textContent = "Waiting on CPI + GDP.";
    return;
  }

  const trajectory = buildRegimeTrajectory(inflation, growth);
  if (!trajectory.length) {
    elements.regimeMapNote.textContent = "Need overlapping CPI + GDP dates.";
    return;
  }

  const current = trajectory[trajectory.length - 1];
  const impact = computeScenarioImpact();
  const scenarioPoint = {
    x: current.x + impact.inflation,
    y: current.y + impact.growth,
    label: "Scenario",
    date: current.date
  };
  const showScenario = impact.inflation !== 0 || impact.growth !== 0;

  const datasets = [
    {
      label: "History",
      data: trajectory,
      borderColor: "rgba(27,43,42,0.6)",
      backgroundColor: "rgba(27,43,42,0.2)",
      pointRadius: 3,
      showLine: true,
      tension: 0.2
    },
    {
      label: "Current",
      data: [current],
      borderColor: "#0f766e",
      backgroundColor: "rgba(15,118,110,0.6)",
      pointRadius: 6
    }
  ];

  if (showScenario) {
    datasets.push({
      label: "Scenario",
      data: [scenarioPoint],
      borderColor: "#ff7a3d",
      backgroundColor: "rgba(255,122,61,0.6)",
      pointRadius: 6
    });
  }

  const canvas = document.getElementById("chart-regime");
  if (!canvas) return;
  if (!state.charts.regime || state.charts.regime.canvas !== canvas) {
    if (state.charts.regime) state.charts.regime.destroy();
    state.charts.regime = new Chart(canvas, {
      type: "scatter",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#1b2b2a" } },
          tooltip: {
            callbacks: {
              label: (context) => {
                const raw = context.raw || {};
                const dateLabel = raw.date ? ` (${raw.date})` : "";
                return `${context.dataset.label}: ${raw.x?.toFixed?.(2)}% infl, ${raw.y?.toFixed?.(2)}% growth${dateLabel}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Inflation (%)", color: "#1b2b2a" },
            ticks: { color: "#5c6a68" }
          },
          y: {
            title: { display: true, text: "Growth (%)", color: "#1b2b2a" },
            ticks: { color: "#5c6a68" }
          }
        }
      }
    });
  } else {
    state.charts.regime.data.datasets = datasets;
    state.charts.regime.update();
  }

  const note = `Current: ${current.x.toFixed(2)}% inflation, ${current.y.toFixed(2)}% growth.`;
  const scenarioNote = showScenario
    ? `Scenario: ${(current.x + impact.inflation).toFixed(2)}% infl, ${(current.y + impact.growth).toFixed(2)}% growth.`
    : "No scenario overrides.";
  elements.regimeMapNote.textContent = `${note} ${scenarioNote}`;
}

function buildRegimeTrajectory(inflation, growth) {
  const trajectory = [];
  growth.forEach((gPoint) => {
    const inflPoint = findClosestPoint(inflation, gPoint.t);
    if (!inflPoint) return;
    trajectory.push({ x: inflPoint.value, y: gPoint.value, date: gPoint.date });
  });
  return trajectory;
}

function findClosestPoint(series, targetTime) {
  if (!series || !series.length || targetTime === null) return null;
  let closest = null;
  for (const point of series) {
    if (point.t <= targetTime) {
      closest = point;
    }
  }
  return closest || series[0];
}

function computeScenarioImpact() {
  const impact = { inflation: 0, growth: 0 };
  Object.entries(state.scenarios).forEach(([key, active]) => {
    if (!active) return;
    const scenario = SCENARIO_LIBRARY[key];
    if (!scenario) return;
    impact.inflation += scenario.inflation;
    impact.growth += scenario.growth;
  });
  return impact;
}

function computeScenarioDelta() {
  let delta = 0;
  Object.entries(state.scenarios).forEach(([key, active]) => {
    if (!active) return;
    const scenario = SCENARIO_LIBRARY[key];
    if (!scenario) return;
    delta += scenario.scoreDelta;
  });
  return delta;
}

function formatScenarioSummary(style = "short") {
  const active = Object.entries(state.scenarios)
    .filter(([, activeValue]) => activeValue)
    .map(([key]) => SCENARIO_LIBRARY[key])
    .filter(Boolean);

  if (!active.length) {
    if (style === "sentence") return "Scenario overrides: none.";
    if (style === "detailed") return "No overrides active.";
    return "No overrides.";
  }

  if (style === "sentence") {
    const labels = active.map((scenario) => scenario.label).join(", ");
    return `Scenario overrides: ${labels}.`;
  }

  if (style === "detailed") {
    return active.map((scenario) => `${scenario.label} (${scenario.description})`).join(" · ");
  }

  return `Active: ${active.map((scenario) => scenario.label).join(", ")}.`;
}

function renderCycle() {
  if (!elements.outputGap || !elements.outputMomentum) return;
  const gap = Number(elements.outputGap.value) || 0;
  const momentum = Number(elements.outputMomentum.value) || 0;

  if (elements.outputGapValue) {
    elements.outputGapValue.textContent = utils.formatSigned(gap, 1);
  }
  if (elements.outputMomentumValue) {
    elements.outputMomentumValue.textContent = utils.formatSigned(momentum, 1);
  }

  if (elements.cycleDot) {
    const x = utils.clamp(((gap + 4) / 8) * 100, 0, 100);
    const y = utils.clamp((1 - (momentum + 3) / 6) * 100, 0, 100);
    elements.cycleDot.style.left = `${x}%`;
    elements.cycleDot.style.top = `${y}%`;
  }

  let phase = "Transition";
  if (gap >= 0 && momentum >= 0) phase = "Expansion";
  if (gap >= 0 && momentum < 0) phase = "Peak";
  if (gap < 0 && momentum < 0) phase = "Contraction";
  if (gap < 0 && momentum >= 0) phase = "Trough";

  const unemployment = gap < 0 ? "rising" : "falling";
  const inflation = momentum > 0.1 ? "rising" : momentum < -0.1 ? "cooling" : "steady";

  if (elements.cycleResult) {
    elements.cycleResult.textContent = `Phase: ${phase}. Unemployment trend: ${unemployment}. Inflation momentum: ${inflation}.`;
  }
}

function renderTransaction() {
  if (!elements.transactionSelect || !elements.transactionOutput) return;
  const key = elements.transactionSelect.value;
  const detail = TRANSACTION_LIBRARY[key] || { components: [], note: "Select a transaction." };

  elements.transactionChips.forEach((chip) => {
    const label = chip.dataset.chip;
    if (!label) return;
    chip.classList.toggle("active", detail.components.includes(label));
  });

  elements.transactionOutput.textContent = detail.note;
}

function renderAccounts() {
  const num = (input) => Number(input?.value) || 0;

  const valueAdded =
    (num(elements.vaAgSales) - num(elements.vaAgInputs)) +
    (num(elements.vaManSales) - num(elements.vaManInputs)) +
    (num(elements.vaServSales) - num(elements.vaServInputs));

  const income = num(elements.incWages) + num(elements.incProfits) + num(elements.incTaxes) + num(elements.incDep);
  const expenditure = num(elements.expC) + num(elements.expI) + num(elements.expG) + (num(elements.expX) - num(elements.expM));

  if (elements.gdpValueAdded) elements.gdpValueAdded.textContent = utils.formatNumber(valueAdded, 2);
  if (elements.gdpIncome) elements.gdpIncome.textContent = utils.formatNumber(income, 2);
  if (elements.gdpExpenditure) elements.gdpExpenditure.textContent = utils.formatNumber(expenditure, 2);

  const maxVal = Math.max(valueAdded, income, expenditure);
  const minVal = Math.min(valueAdded, income, expenditure);
  const discrepancy = maxVal - minVal;
  if (elements.accountsSummary) {
    elements.accountsSummary.textContent = `Statistical discrepancy (max-min): ${utils.formatNumber(discrepancy, 2)}`;
  }
}

function renderChocolate() {
  const num = (input) => Number(input?.value) || 0;
  const q1 = num(elements.chocQ1);
  const p1 = num(elements.chocP1);
  const q2 = num(elements.chocQ2);
  const p2 = num(elements.chocP2);
  const q3 = num(elements.chocQ3);
  const p3 = num(elements.chocP3);

  const nom1 = q1 * p1;
  const nom2 = q2 * p2;
  const nom3 = q3 * p3;
  const real1 = q1 * p1;
  const real2 = q2 * p1;
  const real3 = q3 * p1;

  const def1 = real1 ? (nom1 / real1) * 100 : 0;
  const def2 = real2 ? (nom2 / real2) * 100 : 0;
  const def3 = real3 ? (nom3 / real3) * 100 : 0;

  if (elements.chocNom1) elements.chocNom1.textContent = utils.formatNumber(nom1, 2);
  if (elements.chocNom2) elements.chocNom2.textContent = utils.formatNumber(nom2, 2);
  if (elements.chocNom3) elements.chocNom3.textContent = utils.formatNumber(nom3, 2);
  if (elements.chocReal1) elements.chocReal1.textContent = utils.formatNumber(real1, 2);
  if (elements.chocReal2) elements.chocReal2.textContent = utils.formatNumber(real2, 2);
  if (elements.chocReal3) elements.chocReal3.textContent = utils.formatNumber(real3, 2);
  if (elements.chocDef1) elements.chocDef1.textContent = utils.formatNumber(def1, 1);
  if (elements.chocDef2) elements.chocDef2.textContent = utils.formatNumber(def2, 1);
  if (elements.chocDef3) elements.chocDef3.textContent = utils.formatNumber(def3, 1);

  const growth = real2 ? ((real3 - real2) / real2) * 100 : 0;
  const inflation = def2 ? ((def3 - def2) / def2) * 100 : 0;
  if (elements.chocGrowth) elements.chocGrowth.textContent = `${utils.formatNumber(growth, 2)}%`;
  if (elements.chocInflation) elements.chocInflation.textContent = `${utils.formatNumber(inflation, 2)}%`;
}

function renderRateShock() {
  if (!elements.rateShock) return;
  const bps = Number(elements.rateShock.value) || 0;
  const rateChange = bps / 100;

  if (elements.rateShockValue) {
    const sign = bps > 0 ? "+" : bps < 0 ? "" : "";
    elements.rateShockValue.textContent = `${sign}${bps} bps`;
  }

  const investmentImpact = -0.7 * rateChange;
  const consumptionImpact = -0.3 * rateChange;
  const gdpImpact = investmentImpact * 0.35 + consumptionImpact * 0.65;

  if (elements.rateOutput) {
    elements.rateOutput.textContent = `Investment impulse: ${utils.formatSigned(investmentImpact, 2)} pp · Consumption impulse: ${utils.formatSigned(
      consumptionImpact,
      2
    )} pp · GDP impulse: ${utils.formatSigned(gdpImpact, 2)} pp`;
  }

  if (elements.rateNote) {
    const tone = rateChange > 0 ? "Tightening" : rateChange < 0 ? "Easing" : "Neutral";
    const note =
      rateChange > 0
        ? "Tightening impulse. Expect softer durables and capex with a 2–4 quarter lag."
        : rateChange < 0
        ? "Easing impulse. Expect a lift in credit-sensitive demand with lags."
        : "Neutral stance. Watch incoming data for the next move.";
    elements.rateNote.textContent = `${tone}: ${note}`;
  }
}

function renderSavings() {
  const num = (input) => Number(input?.value) || 0;
  const y = num(elements.savY);
  const c = num(elements.savC);
  const g = num(elements.savG);
  const t = num(elements.savT);

  const privateSavings = y - t - c;
  const publicSavings = t - g;
  const nationalSavings = y - c - g;

  if (elements.savPrivate) elements.savPrivate.textContent = utils.formatNumber(privateSavings, 2);
  if (elements.savPublic) elements.savPublic.textContent = utils.formatNumber(publicSavings, 2);
  if (elements.savNational) elements.savNational.textContent = utils.formatNumber(nationalSavings, 2);
}

function renderProduction() {
  if (!elements.prodA) return;
  const num = (input) => Number(input?.value) || 0;
  const a = num(elements.prodA);
  const k = num(elements.prodK);
  const l = num(elements.prodL);
  const alpha = utils.clamp(Number(elements.prodAlpha?.value) || 0.33, 0.05, 0.95);

  const output = a * Math.pow(k, alpha) * Math.pow(l, 1 - alpha);
  const outputPerWorker = l ? output / l : 0;

  if (elements.prodOutput) elements.prodOutput.textContent = utils.formatNumber(output, 2);
  if (elements.prodPerWorker) elements.prodPerWorker.textContent = utils.formatNumber(outputPerWorker, 2);
}

function renderLongRunGrowth() {
  const series = state.series.gdp || [];
  if (!elements.longRunGrowth || !elements.latestGrowth || !elements.growthVol) return;
  if (!series.length) {
    elements.longRunGrowth.textContent = "Connect GDP series";
    elements.latestGrowth.textContent = "--";
    elements.growthVol.textContent = "--";
    return;
  }

  const latest = utils.latest(series);
  elements.latestGrowth.textContent = `${utils.formatNumber(latest.value, 2)}%`;

  const pointsPerYear = estimatePointsPerYear(series);
  const needed20 = Math.round(pointsPerYear * 20);
  const needed10 = Math.round(pointsPerYear * 10);

  if (series.length < needed20 || needed20 === 0) {
    elements.longRunGrowth.textContent = "Need ~20 years of GDP history";
  } else {
    const slice20 = series.slice(-needed20);
    const avg20 = slice20.reduce((sum, point) => sum + point.value, 0) / slice20.length;
    elements.longRunGrowth.textContent = `${utils.formatNumber(avg20, 2)}%`;
  }

  if (series.length < needed10 || needed10 === 0) {
    elements.growthVol.textContent = "Need ~10 years of history";
  } else {
    const slice10 = series.slice(-needed10);
    const mean = slice10.reduce((sum, point) => sum + point.value, 0) / slice10.length;
    const variance =
      slice10.reduce((sum, point) => sum + Math.pow(point.value - mean, 2), 0) / slice10.length;
    const std = Math.sqrt(variance);
    elements.growthVol.textContent = `${utils.formatNumber(std, 2)} pts`;
  }
}

function estimatePointsPerYear(series) {
  if (!series || series.length < 2) return 0;
  const recent = series.slice(-10);
  const deltas = [];
  for (let i = 1; i < recent.length; i += 1) {
    const delta = recent[i].t - recent[i - 1].t;
    if (Number.isFinite(delta) && delta > 0) deltas.push(delta);
  }
  if (!deltas.length) return 0;
  const avgDeltaDays = deltas.reduce((sum, val) => sum + val, 0) / deltas.length / (1000 * 60 * 60 * 24);
  if (!avgDeltaDays) return 0;
  return utils.clamp(Math.round(365 / avgDeltaDays), 1, 365);
}

function buildShiftNarrative() {
  const inflation = state.series.cpi || state.series.core_pce;
  const labor = state.series.unemployment;
  const rates = state.series.policy_rate;

  const inflationSlope = inflation ? utils.slope(inflation, 6) : 0;
  const laborSlope = labor ? utils.slope(labor, 6) : 0;
  const rateLatest = rates ? utils.latest(rates).value : null;

  const inflationLine = inflation
    ? `Inflation momentum ${inflationSlope < 0 ? "easing" : inflationSlope > 0 ? "rising" : "steady"}.`
    : "Inflation feed not connected.";
  const laborLine = labor
    ? `Labor market ${laborSlope > 0 ? "loosening" : laborSlope < 0 ? "tightening" : "stable"}.`
    : "Labor feed not connected.";
  const rateLine = rateLatest !== null ? `Policy rate at ${rateLatest.toFixed(2)}%.` : "Policy feed not connected.";

  return `${inflationLine} ${laborLine} ${rateLine}`;
}

function computeScoreDrivers(weights = state.weights) {
  return getScoreComponents(weights).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
}

function getScoreComponents(weights = state.weights) {
  const components = [];
  const cpi = state.series.cpi;
  const unemp = state.series.unemployment;
  const gdp = state.series.gdp;
  const ten = state.series.ten_year;
  const two = state.series.two_year;
  const credit = state.series.credit_spread;
  const pmi = state.series.pmi;
  const retail = state.series.retail_sales;

  if (cpi && cpi.length) {
    const impact = (utils.slope(cpi, 6) < 0 ? 12 : -8) * weights.inflation;
    components.push({ label: "Inflation trend", impact });
  }
  if (unemp && unemp.length) {
    const impact = (utils.slope(unemp, 6) > 0 ? -10 : 8) * weights.labor;
    components.push({ label: "Labor momentum", impact });
  }
  if (gdp && gdp.length) {
    const latest = utils.latest(gdp).value;
    const impact = (latest >= 2.5 ? 12 : latest >= 1.5 ? 6 : -8) * weights.growth;
    components.push({ label: "Growth level", impact });
  }
  if (ten && two && ten.length && two.length) {
    const spread = utils.latest(ten).value - utils.latest(two).value;
    const impact = (spread > 0 ? 6 : -6) * weights.curve;
    components.push({ label: "Curve shape", impact });
  }
  if (credit && credit.length) {
    const impact = (utils.slope(credit, 4) > 0 ? -5 : 4) * weights.credit;
    components.push({ label: "Credit stress", impact });
  }
  if (pmi && pmi.length) {
    const impact = (utils.latest(pmi).value >= 50 ? 4 : -4) * weights.demand;
    components.push({ label: "PMI demand", impact });
  }
  if (retail && retail.length) {
    const impact = (utils.latest(retail).value >= 2 ? 4 : -2) * weights.demand;
    components.push({ label: "Retail demand", impact });
  }

  return components;
}

function computeMacroScore(weights = state.weights) {
  let score = 50;
  const components = getScoreComponents(weights);
  components.forEach((component) => {
    score += component.impact;
  });
  return utils.clamp(score, 0, 100);
}

function computeRegime() {
  const inflation = state.series.cpi || state.series.core_pce;
  const growth = state.series.gdp;

  const inflationValue = inflation ? utils.latest(inflation).value : null;
  const growthValue = growth ? utils.latest(growth).value : null;

  if (inflationValue === null || growthValue === null) {
    return {
      label: "Transition",
      note: "Need CPI + GDP",
      insight: "Connect CPI and GDP to classify the regime."
    };
  }

  if (growthValue >= 2.2 && inflationValue <= 3) {
    return { label: "Goldilocks", note: "Solid growth, cooling inflation", insight: "Demand is holding without overheating." };
  }
  if (growthValue >= 2 && inflationValue > 3) {
    return { label: "Overheating", note: "Above trend + sticky inflation", insight: "Policy risk stays elevated while demand runs hot." };
  }
  if (growthValue < 1.2 && inflationValue > 3) {
    return { label: "Stagflation", note: "Soft growth, high inflation", insight: "Policy choices remain painful as growth softens." };
  }
  if (growthValue < 1.2 && inflationValue <= 3) {
    return { label: "Disinflation", note: "Below trend + cooling prices", insight: "Soft landing risk rises but pressure is easing." };
  }

  return { label: "Transition", note: "Mixed signals", insight: "Momentum is mixed across growth and inflation." };
}

function renderCharts() {
  chartGroups.forEach((group) => {
    const canvas = document.getElementById(`chart-${group.id}`);
    if (!canvas) return;

    const seriesData = group.series
      .map((id) => ({
        id,
        meta: sources.find((s) => s.id === id),
        values: state.series[id] || []
      }))
      .filter((series) => series.values.length);

    const labels = mergeLabels(seriesData.map((series) => series.values));

    const datasets = seriesData.map((series) => {
      const map = new Map(series.values.map((point) => [point.date, point.value]));
      return {
        label: series.meta ? series.meta.label : series.id,
        data: labels.map((label) => map.get(label) ?? null),
        borderColor: series.meta ? series.meta.color : "#1b2b2a",
        backgroundColor: "rgba(27,43,42,0.08)",
        borderWidth: 2,
        tension: 0.35,
        spanGaps: true
      };
    });

    if (!state.charts[group.id]) {
      state.charts[group.id] = new Chart(canvas, {
        type: "line",
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom", labels: { color: "#1b2b2a" } },
            tooltip: { mode: "index", intersect: false }
          },
          scales: {
            x: { ticks: { color: "#5c6a68" } },
            y: { ticks: { color: "#5c6a68" } }
          }
        }
      });
    } else {
      const chart = state.charts[group.id];
      chart.data.labels = labels;
      chart.data.datasets = datasets;
      chart.update();
    }
  });
}

function mergeLabels(seriesList) {
  const set = new Set();
  seriesList.forEach((series) => series.forEach((point) => set.add(point.date)));
  return Array.from(set).sort();
}

function renderTable() {
  elements.latestTable.innerHTML = "";
  sources.forEach((source) => {
    const series = state.series[source.id] || [];
    const latest = utils.latest(series);
    const trend = utils.slope(series, 6);
    const status = trend < 0 ? "good" : trend > 0 ? "warn" : "neutral";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${source.label}</td>
      <td>${utils.formatValue(latest.value, source.unit)}</td>
      <td>${utils.formatDate(latest.date)}</td>
      <td>${utils.formatSigned(trend, 3)}</td>
      <td><span class="status-pill ${status}">${statusLabels[status]}</span></td>
    `;
    elements.latestTable.appendChild(row);
  });
}

function openQuestionDrawer(questionId) {
  state.activeQuestionId = questionId;
  renderDeepDive(questionId);
  elements.questionDrawer.classList.add("open");
}

function closeQuestionDrawer() {
  state.activeQuestionId = null;
  elements.questionDrawer.classList.remove("open");
}

function renderDeepDive(questionId) {
  const question = questions.find((item) => item.id === questionId);
  if (!question) return;

  const result = question.compute(state.series, utils);
  elements.deepDiveTitle.textContent = question.prompt;
  elements.deepDiveNarrative.textContent = `${result.title}. ${result.footnote || ""}`.trim();

  const seriesData = question.sources
    .map((id) => ({
      id,
      meta: sources.find((s) => s.id === id),
      values: state.series[id] || []
    }))
    .filter((series) => series.values.length);

  const labels = mergeLabels(seriesData.map((series) => series.values));
  const datasets = seriesData.map((series) => {
    const map = new Map(series.values.map((point) => [point.date, point.value]));
    return {
      label: series.meta ? series.meta.label : series.id,
      data: labels.map((label) => map.get(label) ?? null),
      borderColor: series.meta ? series.meta.color : "#1b2b2a",
      backgroundColor: "rgba(27,43,42,0.08)",
      borderWidth: 2,
      tension: 0.3,
      spanGaps: true
    };
  });

  if (!state.charts.deepDive) {
    state.charts.deepDive = new Chart(elements.deepDiveChart, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#1b2b2a" } },
          tooltip: { mode: "index", intersect: false }
        },
        scales: {
          x: { ticks: { color: "#5c6a68" } },
          y: { ticks: { color: "#5c6a68" } }
        }
      }
    });
  } else {
    state.charts.deepDive.data.labels = labels;
    state.charts.deepDive.data.datasets = datasets;
    state.charts.deepDive.update();
  }

  if (!seriesData.length) {
    elements.deepDiveStats.innerHTML = \"<div class=\\\"stat-chip\\\">Awaiting data</div>\";
    return;
  }

  elements.deepDiveStats.innerHTML = seriesData
    .map((series) => {
      const latest = utils.latest(series.values);
      const change3 = utils.delta(series.values, 3);
      const change6 = utils.delta(series.values, 6);
      const unit = series.meta ? series.meta.unit : \"\";
      return `
        <div class=\"stat-chip\">
          <div class=\"stat-label\">${series.meta ? series.meta.label : series.id}</div>
          <div class=\"stat-value\">${utils.formatValue(latest.value, unit)}</div>
          <div class=\"stat-change\">3p ${utils.formatSigned(change3, 2)} · 6p ${utils.formatSigned(change6, 2)}</div>
        </div>
      `;
    })
    .join(\"\");
}

function copyCallToClipboard() {
  const text = `${elements.ianCallHeadline.textContent}\n${elements.ianCallDetail.textContent}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  }
}

function shareCall() {
  const text = `${elements.ianCallHeadline.textContent}\n${elements.ianCallDetail.textContent}`;
  if (navigator.share) {
    navigator.share({ title: "Ian's Macro Call", text });
  } else {
    copyCallToClipboard();
  }
}
