// ============================================================
// LEVER AUTO-FILL BOOKMARKLET
// Run on any jobs.lever.co/*/apply page
// Does NOT click submit — review before submitting manually
// ============================================================

// --- BOOKMARKLET (copy this entire line as a bookmark URL) ---
// javascript:void((function(){const%20d=document,s=(el,v)=>{if(!el)return;const%20nSet=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;nSet.call(el,v);el.dispatchEvent(new%20Event('input',{bubbles:true}));el.dispatchEvent(new%20Event('change',{bubbles:true}))},f=[['input[name=%22name%22]','Hannah%20Cowan'],['input[name=%22email%22]','Tsotdirector@gmail.com'],['input[name=%22phone%22]','5055773197'],['input[name=%22org%22]','The%20Science%20of%20Tattooing'],['input[name=%22urls[LinkedIn]%22]','https://linkedin.com/in/hannah-m-cowan'],['input[name=%22urls[Portfolio]%22]','https://TattoosByHannah.com'],['input[name=%22location%22]','Walnut%20Creek,%20CA']];f.forEach(([sel,val])=>{const%20el=d.querySelector(sel);if(el){s(el,val);console.log('Filled:',sel,'->',val)}else{console.warn('Not%20found:',sel)}});d.querySelectorAll('select').forEach(sel=>{const%20label=(sel.closest('.application-question')?.querySelector('label')?.textContent||'').toLowerCase();const%20opts=[...sel.options];if(/eligible|authorized|employment/.test(label)){const%20yes=opts.find(o=>o.text.trim().toLowerCase()==='yes');if(yes){sel.value=yes.value;sel.dispatchEvent(new%20Event('change',{bubbles:true}));console.log('Selected%20Yes%20for:',label.trim())}}else%20if(/sponsorship|visa/.test(label)){const%20no=opts.find(o=>o.text.trim().toLowerCase()==='no');if(no){sel.value=no.value;sel.dispatchEvent(new%20Event('change',{bubbles:true}));console.log('Selected%20No%20for:',label.trim())}}});console.log('Lever%20auto-fill%20complete.%20Review%20and%20submit%20manually.')})())

// ============================================================
// READABLE VERSION (paste into browser DevTools console)
// ============================================================

(function () {
  const doc = document;
  const filled = [];
  const missed = [];

  /**
   * Sets an input value and dispatches events so React/Lever
   * recognizes the change (native setter + input/change events).
   */
  function setInputValue(el, value) {
    if (!el) return false;
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeSetter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  // --- TEXT FIELDS ---
  const fields = [
    ['input[name="name"]', "Hannah Cowan"],
    ['input[name="email"]', "Tsotdirector@gmail.com"],
    ['input[name="phone"]', "5055773197"],
    ['input[name="org"]', "The Science of Tattooing"],
    ['input[name="urls[LinkedIn]"]', "https://linkedin.com/in/hannah-m-cowan"],
    ['input[name="urls[Portfolio]"]', "https://TattoosByHannah.com"],
    ['input[name="location"]', "Walnut Creek, CA"],
  ];

  fields.forEach(([selector, value]) => {
    const el = doc.querySelector(selector);
    if (el && setInputValue(el, value)) {
      filled.push(selector);
      console.log(`Filled: ${selector} -> ${value}`);
    } else {
      missed.push(selector);
      console.warn(`Not found: ${selector}`);
    }
  });

  // --- DROPDOWN / SELECT FIELDS ---
  // Lever uses <select> elements for yes/no questions.
  // We match based on the label text near the select.
  doc.querySelectorAll("select").forEach((sel) => {
    // Walk up to the question container and grab the label text
    const container =
      sel.closest(".application-question") ||
      sel.closest(".application-dropdown") ||
      sel.parentElement;
    const labelText = (
      container?.querySelector("label")?.textContent ||
      container?.querySelector(".application-label")?.textContent ||
      ""
    ).toLowerCase();

    const options = [...sel.options];

    // Work authorization / employment eligibility -> Yes
    if (/eligible|authorized|employment/.test(labelText)) {
      const yesOpt = options.find(
        (o) => o.text.trim().toLowerCase() === "yes"
      );
      if (yesOpt) {
        sel.value = yesOpt.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        filled.push(`select (${labelText.trim().substring(0, 50)}...) -> Yes`);
        console.log(`Selected Yes for: ${labelText.trim()}`);
      }
    }

    // Visa sponsorship -> No
    if (/sponsorship|visa/.test(labelText)) {
      const noOpt = options.find((o) => o.text.trim().toLowerCase() === "no");
      if (noOpt) {
        sel.value = noOpt.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        filled.push(`select (${labelText.trim().substring(0, 50)}...) -> No`);
        console.log(`Selected No for: ${labelText.trim()}`);
      }
    }
  });

  // --- SUMMARY ---
  console.log("-----------------------------------");
  console.log(`Lever auto-fill complete.`);
  console.log(`  Filled: ${filled.length} fields`);
  console.log(`  Missed: ${missed.length} fields`);
  if (missed.length) console.log("  Missing selectors:", missed);
  console.log("Review the form and submit manually.");
  console.log("-----------------------------------");
})();
