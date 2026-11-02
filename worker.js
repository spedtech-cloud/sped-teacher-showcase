/* Single-file Cloudflare Worker: contains admin interface and secured backend. */
const ADMIN_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>SPEDTech \u00b7 Resource Administration</title>\n<style>\n:root{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#132941;background:#f5f7fb;color-scheme:light}*{box-sizing:border-box}body{margin:0}header{background:#002b49;color:white;padding:22px max(24px,calc((100% - 1100px)/2))}header strong{font-size:1.15rem}header small{display:block;color:#d2e0ec;font-size:.9rem;margin-top:4px}main{max-width:1100px;margin:auto;padding:24px}.grid{display:grid;grid-template-columns:1.1fr .9fr;gap:20px}section{background:white;border:1px solid #d9e2ee;border-radius:14px;padding:22px;margin-bottom:18px}h1{font-size:1.5rem;margin:0 0 10px}h2{font-size:1.2rem;margin:0 0 8px}p{line-height:1.55}label{display:block;font-size:.93rem;font-weight:650;margin:14px 0 5px}input,select,textarea,button{font:inherit}input:not([type=checkbox]),select,textarea{border:1px solid #93a7ba;border-radius:8px;padding:10px;width:100%;background:#fff;color:#132941}textarea{min-height:75px;resize:vertical}button{border:0;border-radius:9px;background:#002b49;color:white;padding:10px 15px;font-weight:700;cursor:pointer}button:disabled{opacity:.55;cursor:not-allowed}button{min-height:44px}a:focus-visible{outline:3px solid #b45309;outline-offset:3px}.secondary{background:#edf3f8;color:#002b49}.danger{background:#a51c30}.tiny{font-size:.85rem;color:#50637a}.note{border-left:4px solid #b87811;background:#fff8e6;padding:12px 15px;border-radius:5px}.good{border-left:4px solid #188352;background:#f0fcf4;padding:12px}.error{border-left:4px solid #b3261e;background:#fff1f0;padding:12px}.status{margin:12px 0;font-size:.94rem}.resource{border:1px solid #e1e8ef;padding:12px;border-radius:10px;margin:9px 0;display:flex;align-items:center;justify-content:space-between;gap:12px}.resource p{margin:3px 0}.resource button{flex:none}.links{display:flex;gap:12px;flex-wrap:wrap}a{color:#004b81}#selected{margin:6px 0 12px;font-size:.9rem}#list{max-height:620px;overflow-y:auto}.check{display:flex;gap:10px;align-items:start;margin:15px 0}.check input{margin-top:4px}*:focus-visible{outline:3px solid #e39e00;outline-offset:3px}.skip-link{position:absolute;top:-100px;left:12px;background:#fff;color:#002b49;padding:12px;z-index:10}.skip-link:focus{top:10px}footer{max-width:1100px;margin:0 auto;padding:10px 24px 40px;font-size:.85rem;color:#52647a}@media(max-width:850px){.grid{grid-template-columns:1fr}main{padding:14px}section{padding:16px}.resource{align-items:start}}\n@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}</style>\n</head>\n<body>\n<header><strong>SPEDTech \u00b7 Resource Administration</strong><small>Private publishing panel \u00b7 GitHub Pages remains public</small></header>\n<a class=\"skip-link\" href=\"#main\">Skip to main content</a>\n<main id=\"main\">\n  <h1>Manage the SPED Interactive Showcase</h1>\n  <p class=\"tiny\">Approved resources only. New resources are published directly to the public GitHub repository after administrator confirmation.</p>\n  <div class=\"note\" role=\"note\">Security reminder: never upload real learner data, photographs without permission, credentials or confidential school materials. Review HTML code and teaching suitability before publishing. A sandboxed gallery preview does not make downloaded HTML safe.</div>\n  <div id=\"status\" class=\"status\" role=\"status\" aria-live=\"polite\">Connecting to the catalogue\u2026</div>\n  <div class=\"grid\">\n    <section aria-labelledby=\"uploadTitle\">\n      <h2 id=\"uploadTitle\">Add a resource</h2>\n      <p class=\"tiny\">Upload one reviewed, self-contained HTML file and provide its teaching details. The catalogue is updated automatically.</p>\n      <form id=\"uploadForm\">\n        <label for=\"file\">Resource file (.html, maximum 150 KB)</label>\n        <input id=\"file\" type=\"file\" accept=\".html,text/html\" required>\n        <p id=\"selected\" class=\"tiny\">No file selected.</p>\n        <label for=\"title\">Resource title *</label><input id=\"title\" required maxlength=\"100\" placeholder=\"e.g. Grocery Shopping Practice\">\n        <label for=\"domain\">Learning domain / resource type *</label>\n        <select id=\"domain\" required><option value=\"\">Select a category</option>\n          <option>Communication and Language</option><option>Numeracy</option><option>Daily Living Skills</option><option>Social-Emotional Learning</option><option>Vocational Education</option><option>Arts</option><option>Physical Education</option><option>Digital Literacy</option><option>Healthy and Safe Relationships</option><option>Teaching Supports</option>\n        </select>\n        <label for=\"description\">Brief description *</label><textarea id=\"description\" maxlength=\"350\" required placeholder=\"What can learners do with this activity?\"></textarea>\n        <label for=\"objective\">Learning objective *</label><textarea id=\"objective\" maxlength=\"300\" required placeholder=\"Observable learning outcome\"></textarea>\n        <label for=\"use\">Suggested classroom use *</label><textarea id=\"use\" maxlength=\"400\" required></textarea>\n        <label for=\"approach\">Teaching approach</label><textarea id=\"approach\" maxlength=\"400\" placeholder=\"e.g. Model, guide, fade prompts\"></textarea>\n        <label for=\"check\">How to check learning</label><textarea id=\"check\" maxlength=\"400\" placeholder=\"Observe performance and prompts needed\"></textarea>\n        <label for=\"transfer\">Real-world transfer</label><textarea id=\"transfer\" maxlength=\"400\" placeholder=\"Where else will this skill be applied?\"></textarea>\n        <label for=\"adapt\">Adaptations (one per line)</label><textarea id=\"adapt\" maxlength=\"800\" placeholder=\"Fewer choices&#10;Familiar photographs\"></textarea>\n        <label for=\"tags\">Search tags (comma-separated)</label><input id=\"tags\" maxlength=\"240\" placeholder=\"Digital Literacy, Work Readiness\">\n        <label for=\"school\">Contributing school or creator *</label><input id=\"school\" maxlength=\"110\" value=\"Demonstration Resource\" required>\n        <label for=\"licence\">Licence / reuse terms *</label><input id=\"licence\" maxlength=\"250\" placeholder=\"e.g. Shared by creator with adaptation permission\" required>\n        <div class=\"check\"><input id=\"confirm\" type=\"checkbox\" required><label for=\"confirm\" style=\"margin:0;font-weight:500\">I confirm that SPEDTech has reviewed the teaching suitability, privacy, accessibility, code, and permission to publish and download this resource.</label></div>\n        <button id=\"uploadButton\" type=\"submit\">Upload and publish</button>\n      </form>\n    </section>\n    <section aria-labelledby=\"removeTitle\"><h2 id=\"removeTitle\">Published resources</h2><p class=\"tiny\"><strong>Spotlight:</strong> Select one resource to feature above the public gallery. Changing it replaces the previous Spotlight; no autoplay or carousel is used.</p>\n      <p class=\"tiny\">Removing an entry also deletes its HTML file from the latest GitHub repository revision. Git history may still retain older versions.</p>\n      <label for=\"filter\">Find a resource</label><input id=\"filter\" type=\"search\" placeholder=\"Search by name or domain\">\n      <div id=\"list\" aria-live=\"polite\"></div>\n      <button id=\"refresh\" type=\"button\" class=\"secondary\">Refresh list</button>\n    </section>\n  </div>\n  <p class=\"links\"><a href=\"https://spedtech-cloud.github.io/sped-teacher-showcase/\" target=\"_blank\" rel=\"noopener noreferrer\">View public showcase</a><a href=\"https://github.com/spedtech-cloud/sped-teacher-showcase\" target=\"_blank\" rel=\"noopener noreferrer\">Open repository</a></p>\n</main>\n<footer>SPEDTech administration proof of concept \u00b7 Only approved accounts can access this site when Cloudflare Access is configured.</footer>\n<script>\n(()=>{'use strict';\nconst $=id=>document.getElementById(id);let catalogue=[];let busy=false;\nfunction status(text,kind=''){const el=$('status');el.textContent=text;el.className='status '+kind;}\nasync function api(path,options={}){const r=await fetch(path,{credentials:'same-origin',cache:'no-store',...options});let data;try{data=await r.json()}catch{throw new Error('Server response was not JSON. Check Cloudflare Access and Worker configuration.')}if(!r.ok)throw new Error(data.error||'Request failed ('+r.status+')');return data;}\nfunction render(){const q=$('filter').value.trim().toLowerCase();const root=$('list');root.replaceChildren();const matches=catalogue.filter(r=>[r.title,r.domain,r.school].some(v=>String(v||'').toLowerCase().includes(q)));for(const r of matches){const item=document.createElement('div');item.className='resource';const left=document.createElement('div');const title=document.createElement('strong');title.textContent=r.title;const description=document.createElement('p');description.className='tiny';description.textContent=r.domain+' \u00b7 '+r.school;left.append(title,description);const actions=document.createElement('div');actions.className='links';const spotlight=document.createElement('button');spotlight.type='button';spotlight.className='secondary';spotlight.textContent=r.spotlight?'Clear Spotlight':'Set Spotlight';spotlight.setAttribute('aria-label',(r.spotlight?'Clear Spotlight for ':'Feature as Spotlight: ')+r.title);spotlight.disabled=busy;spotlight.addEventListener('click',()=>updateSpotlight(r));const btn=document.createElement('button');btn.type='button';btn.className='danger';btn.textContent='Remove';btn.setAttribute('aria-label','Remove '+r.title+' from the public showcase');btn.disabled=busy;btn.addEventListener('click',()=>removeResource(r));actions.append(spotlight,btn);item.append(left,actions);root.append(item)}if(!matches.length){const p=document.createElement('p');p.className='tiny';p.textContent='No matching resources.';root.append(p)} }\nasync function load(){status('Loading resources\u2026');try{const data=await api('/api/resources');catalogue=data.resources;render();status(catalogue.length+' resources in the public catalogue.','good')}catch(e){status(e.message,'error')}}\nasync function updateSpotlight(r){if(busy)return;busy=true;render();status((r.spotlight?'Clearing':'Setting')+' Spotlight\u2026');try{const data=await api('/api/spotlight',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:r.spotlight?null:r.id})});await load();status(data.message,'good')}catch(e){await load();status(e.message,'error')}finally{busy=false;render()}}\nasync function removeResource(r){if(busy)return;if(!confirm('Remove \"'+r.title+'\" from the public gallery and delete its HTML file from the current repository revision?'))return;busy=true;render();status('Removing '+r.title+'\u2026');try{const data=await api('/api/remove',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:r.id})});await load();status(data.message,'good')}catch(e){await load();status(e.message,'error')}finally{busy=false;render()}}\n$('uploadForm').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const file=$('file').files[0];if(!file){status('Select a resource HTML file.','error');return}if(file.size>150*1024){status('The HTML file exceeds 150 KB.','error');return}let html;try{html=await file.text()}catch{status('Unable to read the file.','error');return}busy=true;$('uploadButton').disabled=true;render();status('Publishing resource\u2026');const form={html,title:$('title').value,domain:$('domain').value,description:$('description').value,learningObjective:$('objective').value,suggestedUse:$('use').value,instructionalApproach:$('approach').value,assessmentCheck:$('check').value,transferTask:$('transfer').value,adaptations:$('adapt').value.split(/\\r?\\n/).map(x=>x.trim()).filter(Boolean),tags:$('tags').value.split(',').map(x=>x.trim()).filter(Boolean),school:$('school').value,license:$('licence').value,reviewConfirmed:$('confirm').checked};try{const data=await api('/api/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});$('uploadForm').reset();$('selected').textContent='No file selected.';await load();status(data.message,'good');}catch(err){await load();status(err.message,'error')}finally{busy=false;$('uploadButton').disabled=false;render()}});\n$('file').addEventListener('change',()=>{$('selected').textContent=$('file').files[0]?.name||'No file selected.'});$('filter').addEventListener('input',render);$('refresh').addEventListener('click',load);load();\n})();\n</script>\n</body></html>\n";

/* SPEDTech Private Admin — Cloudflare Worker backend.
 * Deploy only after protecting this entire Worker with Cloudflare Access.
 * This Worker ALSO requires a verified ctx.access identity and an explicit email allowlist.
 */
const REPOSITORY = 'spedtech-cloud/sped-teacher-showcase';
const BRANCH = 'main';
const DOMAINS = new Set([
  'Communication and Language', 'Numeracy', 'Daily Living Skills',
  'Social-Emotional Learning', 'Vocational Education', 'Arts',
  'Physical Education', 'Digital Literacy', 'Healthy and Safe Relationships',
  'Teaching Supports'
]);
const MAX_HTML_BYTES = 150 * 1024;
const MAX_BODY_BYTES = 250 * 1024;

function headers(extra={}) { return {
  'Cache-Control':'no-store, max-age=0',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Frame-Options':'DENY',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
  ...extra
}; }
function json(value, status=200) {return new Response(JSON.stringify(value),{status,headers:headers({'Content-Type':'application/json; charset=utf-8'})});}
function failure(message,status=400){return json({error:message},status);}
function safeText(x,max,required=false){if(typeof x!=='string')x='';x=x.trim();if(x.length>max)throw new Error('A field exceeds its character limit.');if(required&&!x)throw new Error('Complete every required resource field.');return x;}
function slug(title){return title.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60).replace(/-$/,'');}
function encodeBase64(s){const bytes=new TextEncoder().encode(s);let binary='';const size=8192;for(let i=0;i<bytes.length;i+=size)binary+=String.fromCharCode(...bytes.subarray(i,i+size));return btoa(binary);}
function decodeBase64(s){const raw=atob(s.replace(/\s/g,''));const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}
function ghPath(path){return `https://api.github.com/repos/${REPOSITORY}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;}
async function github(env,method,path,body){
  const u=new URL(ghPath(path));if(method==='GET')u.searchParams.set('ref',BRANCH);
  let response;
  try {response=await fetch(u.toString(), {method,headers:{
    'Accept':'application/vnd.github+json',
    'Authorization':`Bearer ${env.GITHUB_TOKEN}`,
    'User-Agent':'SPEDTech-Resource-Admin',
    'X-GitHub-Api-Version':'2022-11-28',
    ...(body?{'Content-Type':'application/json'}:{})},
    ...(body?{body:JSON.stringify(body)}:{})});}
  catch{throw new Error('Could not connect to GitHub.');}
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const error=new Error(response.status===409?'GitHub reported a revision conflict. Refresh and try again.':response.status===403?'GitHub denied this operation. Verify token permissions, expiry and branch rules.':response.status===404?'File or repository not found. Verify the GitHub settings.':response.status===422?'GitHub rejected the file change. Check filename and current repository state.':'GitHub request failed ('+response.status+').');error.status=response.status;throw error;}
  return data;
}
async function getFile(env,path){try{return await github(env,'GET',path);}catch(e){if(e.status===404)return null;throw e;}}
async function loadCatalogue(env){const response=await getFile(env,'resources.json');if(!response||!response.sha||!response.content)throw new Error('resources.json is not present or could not be read.');const arr=JSON.parse(decodeBase64(response.content));if(!Array.isArray(arr))throw new Error('resources.json is not an array.');return {items:arr,sha:response.sha};}
async function storeCatalogue(env,items,sha,label){return github(env,'PUT','resources.json',{message:label,content:encodeBase64(JSON.stringify(items,null,2)+'\n'),sha,branch:BRANCH});}
async function readPayload(request){
  if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))throw new Error('JSON requests only.');
  const declared=Number(request.headers.get('content-length')||0);if(declared>MAX_BODY_BYTES)throw new Error('Request is too large.');
  const payload=await request.text();if(new TextEncoder().encode(payload).length>MAX_BODY_BYTES)throw new Error('Request is too large.');
  try{return JSON.parse(payload);}catch{throw new Error('Invalid JSON request.');}
}
function buildResource(data){
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid resource details.');
  if(data.reviewConfirmed!==true)throw new Error('You must confirm the manual teaching, privacy, code and licence review.');
  const title=safeText(data.title,100,true),id=slug(title);
  if(id.length<3)throw new Error('Choose a resource title with at least three usable letters or numbers.');
  const domain=safeText(data.domain,80,true);
  if(!DOMAINS.has(domain))throw new Error('Select an approved resource category.');
  const html=typeof data.html==='string'?data.html:'';
  if(!/<!doctype\s+html|<html\b/i.test(html) || !/<body\b/i.test(html))throw new Error('Provide a standalone HTML document containing an HTML root and body.');
  if(new TextEncoder().encode(html).length>MAX_HTML_BYTES)throw new Error('HTML must be no larger than 150 KB.');
  const list=(value,max)=>{if(!Array.isArray(value)||value.length>10)throw new Error('Too many tags or adaptations.');return value.map(v=>safeText(v,max)).filter(Boolean);};
  const item={
    id,title,domain,
    school:safeText(data.school,110,true),
    description:safeText(data.description,350,true),
    learningObjective:safeText(data.learningObjective,300,true),
    suggestedUse:safeText(data.suggestedUse,400,true),
    instructionalApproach:safeText(data.instructionalApproach,400),
    assessmentCheck:safeText(data.assessmentCheck,400),
    transferTask:safeText(data.transferTask,400),
    adaptations:list(data.adaptations,200),tags:list(data.tags,80),
    hostingType:'local',previewUrl:`resources/${id}.html`,downloadUrl:`resources/${id}.html`,
    sourceUrl:null,creator:safeText(data.school,110,true),
    license:safeText(data.license,250,true),
    curriculumContext:'Suggested category only; mapping to the school’s relevant syllabus outcomes has not been independently verified.',
    reviewStatus:'Published following an administrator review declaration; teachers must check suitability for individual learners.',
    spotlight:false
  };
  return {item,html};
}
async function add(env,data){
  const {item,html}=buildResource(data);
  const current=await loadCatalogue(env);
  if(current.items.some(r=>r.id===item.id||r.previewUrl===item.previewUrl))return failure('A resource with this title or filename already exists.',409);
  if(await getFile(env,item.previewUrl))return failure('This HTML filename already exists in the repository. Choose a different title.',409);
  // Publish file before catalogue so gallery never points to a nonexistent file.
  await github(env,'PUT',item.previewUrl,{message:`Add SPED resource: ${item.title}`,content:encodeBase64(html),branch:BRANCH});
  try{await storeCatalogue(env,[...current.items,item],current.sha,`List SPED resource: ${item.title}`);}
  catch(e){return failure('HTML uploaded, but catalogue update failed: '+e.message+' An unlisted file may remain in resources/. Check GitHub before retrying.',409);}
  return json({message:`Published “${item.title}”. GitHub Pages may take a short time to update.`,id:item.id});
}
async function setSpotlight(env,data){
  if(!data||typeof data!=='object'||Array.isArray(data))return failure('Invalid Spotlight request.');
  const id=data.id===null?null:safeText(data.id,65,true);
  if(id!==null&&!/^[a-z0-9-]+$/.test(id))return failure('Invalid resource ID.');
  const current=await loadCatalogue(env);
  if(id!==null&&!current.items.some(r=>r.id===id&&r.hostingType==='local'))return failure('Resource not found or not eligible for Spotlight.',404);
  const found=current.items.find(r=>r.id===id);
  const items=current.items.map(r=>({...r,spotlight:id!==null&&r.id===id}));
  await storeCatalogue(env,items,current.sha,id===null?'Clear SPED resource Spotlight':`Spotlight SPED resource: ${found.title}`);
  return json({message:id===null?'Spotlight cleared.':`Spotlight is now “${found.title}”. Refresh the public site after publishing.`});
}
async function remove(env,data){
  const id=safeText(data?.id,65,true);
  if(!/^[a-z0-9-]+$/.test(id))return failure('Invalid resource ID.');
  const current=await loadCatalogue(env);
  const item=current.items.find(r=>r.id===id);
  if(!item)return failure('Resource not found. Refresh the list.',404);
  if(item.hostingType!=='local'||!/^resources\/[a-z0-9-]+\.html$/.test(item.previewUrl)||item.previewUrl!==item.downloadUrl)return failure('Only local HTML resources may be removed in this version.',400);
  // Remove gallery entry first, then HTML file. This avoids a broken public card.
  await storeCatalogue(env,current.items.filter(r=>r.id!==id),current.sha,`Unlist SPED resource: ${item.title}`);
  const file=await getFile(env,item.previewUrl);
  if(file){try{await github(env,'DELETE',item.previewUrl,{message:`Delete SPED resource: ${item.title}`,sha:file.sha,branch:BRANCH});}
    catch(e){return failure('Resource was removed from the catalogue, but GitHub could not delete the HTML file: '+e.message+'. Delete the orphan file manually.',409);}}
  return json({message:`Removed “${item.title}” from the showcase. GitHub history may retain older revisions.`});
}
function sameOrigin(request){const origin=request.headers.get('Origin');return origin===new URL(request.url).origin && request.headers.get('Sec-Fetch-Site')!=='cross-site';}
export default {
  async fetch(request, env, ctx){
    // Fail closed: no Cloudflare Access identity means no access, even to the UI.
    if(!ctx.access)return failure('Cloudflare Access is required. Protect this entire Worker before using it.',403);
    let email;
    try{email=(await ctx.access.getIdentity())?.email?.trim().toLowerCase();}catch{return failure('Could not verify administrator identity.',403);}
    const allowed=new Set(String(env.ADMIN_EMAILS||'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean));
    if(!email||!allowed.has(email))return failure('This account is not on the SPEDTech administrator allowlist.',403);
    if(!env.GITHUB_TOKEN || !/^.{20,}$/.test(env.GITHUB_TOKEN))return failure('GitHub token secret is not configured.',503);
    const url=new URL(request.url);
    if(url.pathname==='/'&&request.method==='GET')return new Response(ADMIN_HTML,{headers:headers({
      'Content-Type':'text/html; charset=utf-8',
      'Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'"
    })});
    if(url.pathname==='/api/resources'&&request.method==='GET'){
      try{const info=await loadCatalogue(env);return json({resources:info.items.map(({id,title,domain,school,hostingType,spotlight})=>({id,title,domain,school,hostingType,spotlight:spotlight===true}))});}catch(e){return failure(e.message,502);}
    }
    if((url.pathname==='/api/add'||url.pathname==='/api/remove'||url.pathname==='/api/spotlight')&&request.method==='POST'){
      if(!sameOrigin(request))return failure('Request origin was not accepted.',403);
      try{const data=await readPayload(request);return await (url.pathname==='/api/add'?add(env,data):url.pathname==='/api/spotlight'?setSpotlight(env,data):remove(env,data));}catch(e){return failure(e.message,e.status&&e.status>=400?e.status:400);}
    }
    return failure('Not found.',404);
  }
};
