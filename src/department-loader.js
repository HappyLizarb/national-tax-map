(function initDepartmentLoader(root) {
  const summaries = root.DepartmentSpendingData ||= {};
  const pending = new Map();

  function hasNonzeroAmount(row) {
    return Number(Array.isArray(row) ? row[2] : row.amount) !== 0;
  }

  // Keep source zeros in the ledger, but omit them from every rendered report layer.
  function visibleReport(report) {
    const visible = { ...report };
    for (const key of ["departments", "rows", "supplementalRows", "largeAccountRows", "accountRows"]) {
      if (visible[key]) visible[key] = visible[key].filter(hasNonzeroAmount);
    }
    for (const key of ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"]) {
      if (visible[key]) visible[key] = visible[key].map((panel) => ({ ...panel, rows: panel.rows.filter(hasNonzeroAmount) }));
    }
    return visible;
  }

  function loadSummary(scope) {
    if (summaries[scope]) return Promise.resolve(visibleReport(summaries[scope]));
    if (pending.has(scope)) return pending.get(scope);
    const url = root.DepartmentDataIndex?.[scope];
    if (!url) return Promise.reject(new Error("No department summary for " + scope));
    const request = loadScript(url).then(() => {
      if (!summaries[scope]) throw new Error("Invalid department summary for " + scope);
      return visibleReport(summaries[scope]);
    });
    pending.set(scope, request);
    return request.finally(() => pending.delete(scope));
  }

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url + "?v=5";
      script.onload = () => { script.remove(); resolve(); };
      script.onerror = () => { script.remove(); reject(new Error("Unable to load " + url)); };
      document.head.append(script);
    });
  }

  async function loadDetail(url) {
    const response = await fetch(url + "?v=5");
    if (!response.ok) throw new Error("Unable to load " + url);
    return visibleReport(await response.json());
  }

  root.DepartmentData = { loadSummary, loadDetail };
})(typeof globalThis === "object" ? globalThis : window);
