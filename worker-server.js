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
