# Comprehensive Guide to Econ 205: Principles of Macroeconomics

**Course:** Econ 205 — Principles of Macroeconomics  
**Term:** Spring 2026  
**Instructor:** Dr. Ian Helfrich  
**Institution:** (Add institution if desired)

---

## 1. Course Overview
This course provides a foundational understanding of the aggregate economy. It moves beyond individual markets (Microeconomics) to analyze the economy as a whole, focusing on key indicators like GDP, inflation, and unemployment, and the forces that drive long-run growth and short-run fluctuations (business cycles).

The course is integrated with the **Macro Signal Room**, a live data dashboard that allows students to track real-time economic indicators alongside theoretical concepts.

---

## 2. Core Curriculum & Topics

Based on Problem Set 2 and the Course Software (`app.js`), the course is structured into the following modules:

### Module 1: Measuring the Macroeconomy
*Focus: How do we quantify economic health?*

*   **Gross Domestic Product (GDP):**
    *   **Definition:** The market value of all final goods and services produced within a country in a given period.
    *   **Approaches:**
        *   **Expenditure Approach:** $Y = C + I + G + NX$
        *   **Income Approach:** Wages + Profits + Rents + Taxes + Depreciation.
        *   **Value-Added Approach:** Output Value - Intermediate Inputs.
    *   **Nominal vs. Real GDP:** Distinguishing price changes from output changes.
    *   **GDP Deflator:** A measure of the price level ($Nominal / Real \times 100$). 
*   **The Cost of Living:**
    *   **CPI (Consumer Price Index):** Measuring inflation experienced by consumers.
    *   **Inflation Rate:** Percentage change in the price index.
*   **Unemployment:**
    *   **Measurement:** Calculated by the BLS (Employed vs. Unemployed vs. Labor Force).
    *   **Types:** Frictional, Structural, Cyclical.

### Module 2: The Real Economy in the Long Run
*Focus: Why are some countries rich and others poor?*

*   **Production & Growth:**
    *   **The Production Function:** $Y = A F(L, K, H, N)$
        *   $L$: Labor
        *   $K$: Physical Capital
        *   $H$: Human Capital
        *   $N$: Natural Resources
        *   $A$: Technological Knowledge
    *   **Productivity:** The key driver of living standards.
*   **Saving, Investment, and the Financial System:**
    *   **National Savings:** $S = Y - C - G$ (in a closed economy).
    *   **Market for Loanable Funds:** How interest rates equilibrate supply (savings) and demand (investment).
    *   **Crowding Out:** How government deficits reduce investment.

### Module 3: Short-Run Economic Fluctuations
*Focus: Why does the economy boom and bust?*

*   **The Business Cycle:**
    *   **Phases:** Expansion $\rightarrow$ Peak $\rightarrow$ Contraction $\rightarrow$ Trough.
    *   **Key Relationships:**
        *   **Okun's Law:** Inverse relationship between GDP growth and Unemployment.
        *   **Phillips Curve:** Inverse relationship between Unemployment and Inflation (short-run).
*   **Aggregate Demand & Aggregate Supply (AD-AS):**
    *   Explaining short-run deviations from the long-run trend.
    *   **Shocks:** Demand shocks (spending changes) vs. Supply shocks (oil prices, technology).

---

## 3. Key Formulas & Concepts (Cheatsheet)

| Concept | Formula / Definition |
| :--- | :--- |
| **GDP (Expenditure)** | $Y = C + I + G + NX$ |
| **GDP Deflator** | $\frac{\text{Nominal GDP}}{\text{Real GDP}} \times 100$ |
| **Inflation Rate** | $\frac{\text{Deflator}_2 - \text{Deflator}_1}{\text{Deflator}_1} \times 100$ |
| **Real Interest Rate** | $\text{Nominal Interest Rate} - \text{Inflation Rate}$ |
| **Private Savings** | $Y - T - C$ |
| **Public Savings** | $T - G$ |
| **National Savings** | Private + Public ($Y - C - G$) |
| **Unemployment Rate** | $\frac{\text{Unemployed}}{\text{Labor Force}} \times 100$ |
| **Labor Force Part. Rate**| $\frac{\text{Labor Force}}{\text{Adult Population}} \times 100$ |

---

## 4. Interactive Labs (The Macro Studio)

The course utilizes a custom web application (`/Macreconomics_github`) to visualize these concepts.

*   **Transaction Library:** A tool to classify economic actions (e.g., buying a used house vs. a new house) into GDP components.
*   **Scenario Builder:** Simulates economic shocks:
    *   *Oil Shock:* $\uparrow$ Inflation, $\downarrow$ Growth.
    *   *Policy Cut:* $\downarrow$ Inflation, $\uparrow$ Growth.
    *   *Credit Tightening:* $\downarrow$ Growth, $\uparrow$ Risk.
*   **Live Dashboard:** Tracks real-world data feeds for CPI, Unemployment, and Yield Curves to bridge theory with reality.

---

## 5. Recommended Textbooks
*Based on the topic sequence and problem set structure, the following standard texts are highly recommended:*

1.  **Principles of Macroeconomics** by N. Gregory Mankiw.
    *   *Alignment:* The breakdown of "Ten Principles," "Thinking Like an Economist," followed by "The Data of Macroeconomics" matches the problem set perfectly.
2.  **Macroeconomics** by Krugman & Wells.
    *   *Alternative:* Strong focus on business cycle narratives which aligns with the "Macro Signal Room" approach.
