// ============================================================
// GREENHOUSE AUTO-FILL BOOKMARKLET
// Run on any boards.greenhouse.io application page
// Does NOT click submit — review before submitting manually
// ============================================================

// --- BOOKMARKLET (copy this entire line as a bookmark URL) ---
// javascript:void((function(){const%20d=document,filled=[],missed=[],s=(el,v)=>{if(!el)return%20false;const%20tag=el.tagName.toLowerCase();if(tag==='input'||tag==='textarea'){const%20proto=tag==='textarea'?HTMLTextAreaElement:HTMLInputElement;const%20ns=Object.getOwnPropertyDescriptor(proto.prototype,'value').set;ns.call(el,v);el.dispatchEvent(new%20Event('input',{bubbles:true}));el.dispatchEvent(new%20Event('change',{bubbles:true}));return%20true}return%20false},f=[['#first_name','Hannah'],['#last_name','Cowan'],['#email','Tsotdirector@gmail.com'],['#phone','505-577-3197']];f.forEach(([sel,val])=>{const%20el=d.querySelector(sel);if(el&&s(el,val)){filled.push(sel);console.log('Filled:',sel,'->',val)}else{missed.push(sel);console.warn('Not%20found:',sel)}});const%20loc=d.querySelector('input[name*=location],input[id*=location],input[autocomplete=address-level2]');if(loc&&s(loc,'Walnut%20Creek,%20CA')){filled.push('location');console.log('Filled:%20location')}d.querySelectorAll('input,textarea').forEach(el=>{const%20n=(el.name||'').toLowerCase(),id=(el.id||'').toLowerCase(),lbl=(el.closest('.field')?.querySelector('label')?.textContent||'').toLowerCase();if(/linkedin/.test(n+id+lbl)&&!el.value){s(el,'https://linkedin.com/in/hannah-m-cowan');filled.push('linkedin');console.log('Filled:%20LinkedIn')}if(/(portfolio|website|personal)/.test(n+id+lbl)&&!el.value){s(el,'https://TattoosByHannah.com');filled.push('portfolio');console.log('Filled:%20Portfolio')}if(/(how%20did%20you%20hear|hear%20about|source|referral)/.test(lbl)&&el.tagName==='TEXTAREA'&&!el.value){s(el,'Job%20board%20search');filled.push('how-heard');console.log('Filled:%20How%20did%20you%20hear')}});console.log('Greenhouse%20auto-fill%20complete.%20Filled:',filled.length,'Missed:',missed.length,'Review%20and%20submit%20manually.')})())

// ============================================================
// READABLE VERSION (paste into browser DevTools console)
// ============================================================

(function () {
  const doc = document;
  const filled = [];
  const missed = [];

  /**
   * Sets a value on an input or textarea and fires events
   * so React/Greenhouse picks up the change.
   */
  function setFieldValue(el, value) {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") {
      const proto =
        tag === "textarea" ? HTMLTextAreaElement : HTMLInputElement;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        proto.prototype,
        "value"
      ).set;
      nativeSetter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    return false;
  }

  /**
   * Helper: get label text for a field by walking up to
   * Greenhouse's .field container.
   */
  function getLabelText(el) {
    const container =
      el.closest(".field") ||
      el.closest(".field-wrap") ||
      el.closest(".form-group") ||
      el.parentElement;
    return (
      container?.querySelector("label")?.textContent || ""
    ).toLowerCase();
  }

  // --- CORE FIELDS (by ID) ---
  const coreFields = [
    ["#first_name", "Hannah"],
    ["#last_name", "Cowan"],
    ["#email", "Tsotdirector@gmail.com"],
    ["#phone", "505-577-3197"],
  ];

  coreFields.forEach(([selector, value]) => {
    const el = doc.querySelector(selector);
    if (el && setFieldValue(el, value)) {
      filled.push(selector);
      console.log(`Filled: ${selector} -> ${value}`);
    } else {
      missed.push(selector);
      console.warn(`Not found: ${selector}`);
    }
  });

  // --- LOCATION FIELD ---
  // Greenhouse location fields vary; try several selectors
  const locationSelectors = [
    'input[name*="location"]',
    'input[id*="location"]',
    'input[autocomplete="address-level2"]',
    'input[name="job_application[location]"]',
  ];
  let locationFilled = false;
  for (const sel of locationSelectors) {
    const el = doc.querySelector(sel);
    if (el && setFieldValue(el, "Walnut Creek, CA")) {
      filled.push("location");
      console.log(`Filled: location (${sel}) -> Walnut Creek, CA`);
      locationFilled = true;
      break;
    }
  }
  if (!locationFilled) {
    missed.push("location");
    console.warn("Not found: location field (tried multiple selectors)");
  }

  // --- LINKEDIN, PORTFOLIO, AND "HOW DID YOU HEAR" FIELDS ---
  // Greenhouse uses dynamic field names, so we scan all inputs/textareas
  // and match by name, id, or nearby label text.
  doc.querySelectorAll("input, textarea").forEach((el) => {
    const name = (el.name || "").toLowerCase();
    const id = (el.id || "").toLowerCase();
    const label = getLabelText(el);
    const combined = name + " " + id + " " + label;

    // LinkedIn URL field
    if (/linkedin/.test(combined) && !el.value) {
      if (setFieldValue(el, "https://linkedin.com/in/hannah-m-cowan")) {
        filled.push("linkedin");
        console.log("Filled: LinkedIn -> https://linkedin.com/in/hannah-m-cowan");
      }
    }

    // Portfolio / website field
    if (/(portfolio|website|personal\s*site|personal\s*url)/.test(combined) && !el.value) {
      if (setFieldValue(el, "https://TattoosByHannah.com")) {
        filled.push("portfolio");
        console.log("Filled: Portfolio -> https://TattoosByHannah.com");
      }
    }

    // "How did you hear about us" textarea
    if (
      /(how did you hear|hear about|source|referral)/.test(label) &&
      el.tagName.toLowerCase() === "textarea" &&
      !el.value
    ) {
      if (setFieldValue(el, "Job board search")) {
        filled.push("how-heard");
        console.log("Filled: How did you hear -> Job board search");
      }
    }
  });

  // --- SELECT DROPDOWNS (work auth / visa) ---
  // Some Greenhouse forms use selects for eligibility questions
  doc.querySelectorAll("select").forEach((sel) => {
    const label = getLabelText(sel);
    const options = [...sel.options];

    if (/eligible|authorized|employment/.test(label)) {
      const yesOpt = options.find(
        (o) => o.text.trim().toLowerCase() === "yes"
      );
      if (yesOpt) {
        sel.value = yesOpt.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        filled.push("work-auth -> Yes");
        console.log(`Selected Yes for: ${label.trim()}`);
      }
    }

    if (/sponsorship|visa/.test(label)) {
      const noOpt = options.find(
        (o) => o.text.trim().toLowerCase() === "no"
      );
      if (noOpt) {
        sel.value = noOpt.value;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        filled.push("visa-sponsorship -> No");
        console.log(`Selected No for: ${label.trim()}`);
      }
    }
  });

  // --- SUMMARY ---
  console.log("-----------------------------------");
  console.log("Greenhouse auto-fill complete.");
  console.log(`  Filled: ${filled.length} fields`);
  console.log(`  Missed: ${missed.length} fields`);
  if (missed.length) console.log("  Missing selectors:", missed);
  console.log("Review the form and submit manually.");
  console.log("-----------------------------------");
})();
