// Builds personalized Lever and Greenhouse autofill bookmarklets from
// a user profile. Returns a `javascript:void(...)` URL the user can drag
// to their bookmarks bar.
//
// The runtime logic mirrors the original CLI scripts at
// /Users/hannahwolf/help me code/resumes/lever_autofill.js and
// /Users/hannahwolf/help me code/resumes/greenhouse_autofill.js
// — only the values change per user.

/**
 * Wrap a JS string in the `javascript:` prefix and IIFE that browsers
 * accept as a bookmarklet URL. Encodes spaces and other URL-unsafe
 * characters.
 */
function toBookmarkletUrl(jsBody) {
  const wrapped = `(function(){${jsBody}})()`
  return 'javascript:void(' + encodeURIComponent(wrapped) + ')'
}

/** JSON-encode a string for safe injection into source code. */
function jsString(s) {
  return JSON.stringify(s || '')
}

// ── Lever ─────────────────────────────────────────────────────────────

export function buildLeverBookmarklet(profile) {
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
  const phoneDigits = (profile.phone || '').replace(/\D/g, '')

  const body = `
const d=document;
const NS=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
function s(el,v){if(!el)return;NS.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
const F=[
  ['input[name="name"]',${jsString(fullName)}],
  ['input[name="email"]',${jsString(profile.email)}],
  ['input[name="phone"]',${jsString(phoneDigits)}],
  ['input[name="org"]',${jsString(profile.currentCompany)}],
  ['input[name="urls[LinkedIn]"]',${jsString(profile.linkedinUrl)}],
  ['input[name="urls[Portfolio]"]',${jsString(profile.portfolioUrl)}],
  ['input[name="urls[GitHub]"]',${jsString(profile.githubUrl)}],
  ['input[name="location"]',${jsString(profile.location)}]
];
F.forEach(([sel,val])=>{const el=d.querySelector(sel);if(el&&val)s(el,val);});
d.querySelectorAll('select').forEach(sel=>{
  const c=sel.closest('.application-question')||sel.parentElement;
  const lab=((c&&c.querySelector('label')&&c.querySelector('label').textContent)||(c&&c.querySelector('.application-label')&&c.querySelector('.application-label').textContent)||'').toLowerCase();
  const opts=Array.from(sel.options);
  if(/eligible|authorized|employment|legally|work in/.test(lab)){
    const yes=opts.find(o=>o.text.trim().toLowerCase()===${jsString(profile.workAuth ? 'yes' : 'no')});
    if(yes){sel.value=yes.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}
  }else if(/sponsorship|visa/.test(lab)){
    const ans=opts.find(o=>o.text.trim().toLowerCase()===${jsString(profile.needsSponsorship ? 'yes' : 'no')});
    if(ans){sel.value=ans.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}
  }
});
console.log('Lever auto-fill complete. Review and submit manually.');
`.trim().replace(/\n\s*/g, '')

  return toBookmarkletUrl(body)
}

// ── Greenhouse ────────────────────────────────────────────────────────

export function buildGreenhouseBookmarklet(profile) {
  // Greenhouse formats phone numbers with dashes (NNN-NNN-NNNN)
  const phoneDashes = (profile.phone || '').replace(/\D/g, '').replace(
    /^(\d{3})(\d{3})(\d{4})$/,
    '$1-$2-$3'
  )

  const body = `
const d=document;
const NS=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
function s(el,v){if(!el||!v)return;NS.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
s(d.getElementById('first_name'),${jsString(profile.firstName)});
s(d.getElementById('last_name'),${jsString(profile.lastName)});
s(d.getElementById('email'),${jsString(profile.email)});
s(d.getElementById('phone'),${jsString(phoneDashes)});
const locSels=['input[name="job_application[location]"]','input#job_application_location','input[name="location"]','input[id*="location"]'];
for(const ls of locSels){const el=d.querySelector(ls);if(el){s(el,${jsString(profile.location)});break;}}
d.querySelectorAll('input[type="text"],input[type="url"],textarea').forEach(el=>{
  const id=(el.id||'').toLowerCase();const nm=(el.name||'').toLowerCase();
  if(/linkedin/.test(id+nm)&&!el.value)s(el,${jsString(profile.linkedinUrl)});
  if(/(portfolio|website|personal[\\s_-]*site|personal[\\s_-]*url)/.test(id+nm)&&!el.value)s(el,${jsString(profile.portfolioUrl)});
  if(/github/.test(id+nm)&&!el.value)s(el,${jsString(profile.githubUrl)});
  if(/(how[\\s_-]did[\\s_-]you[\\s_-]hear|hear[\\s_-]about|source|referral)/.test(id+nm)&&!el.value)s(el,'Job board search');
});
d.querySelectorAll('select').forEach(sel=>{
  const lab=(d.querySelector('label[for="'+sel.id+'"]')||{}).textContent||'';
  const L=lab.toLowerCase();
  const opts=Array.from(sel.options);
  if(/eligible|authorized|employment/.test(L)){
    const opt=opts.find(o=>o.text.trim().toLowerCase()===${jsString(profile.workAuth ? 'yes' : 'no')});
    if(opt){sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}
  }else if(/sponsorship|visa/.test(L)){
    const opt=opts.find(o=>o.text.trim().toLowerCase()===${jsString(profile.needsSponsorship ? 'yes' : 'no')});
    if(opt){sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}
  }
});
console.log('Greenhouse auto-fill complete. Review and submit manually.');
`.trim().replace(/\n\s*/g, '')

  return toBookmarkletUrl(body)
}
