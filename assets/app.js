/* Static, dependency-free showcase. User-contributed metadata is always displayed as text. */
(() => {
  'use strict';
  const DOMAINS = ['Daily Living Skills', 'Numeracy', 'Communication & Language', 'Social Emotional Learning', 'Vocational Education', 'Visual Arts', 'Physical Education', 'Others'];
  const ICONS = {'Daily Living Skills':'☀️','Numeracy':'🧮','Communication & Language':'💬','Social Emotional Learning':'⭐','Vocational Education':'🗂️','Visual Arts':'🎨','Physical Education':'🎵','Others':'⏱️'};
  const $ = selector => document.querySelector(selector);
  const state = { resources: [], lastOpener: null, previewPath: null };
  const grid = $('#galleryGrid');
  const dialog = $('#resourceDialog');
  const previewFrame = $('#previewFrame');
  const previewError = $('#previewError');

  function element(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined && content !== null) el.textContent = String(content);
    return el;
  }
  function localPath(value) { return typeof value === 'string' && /^resources\/[a-z0-9-]+\.html$/.test(value); }
  function secureUrl(value) {
    if (typeof value !== 'string') return false;
    try { const url = new URL(value); return url.protocol === 'https:' && url.username === '' && url.password === ''; } catch { return false; }
  }
  function usableResource(item) {
    return item && typeof item.id === 'string' && /^[a-z0-9-]+$/.test(item.id)
      && typeof item.title === 'string' && item.title.length > 0
      && typeof item.description === 'string' && typeof item.domain === 'string'
      && typeof item.school === 'string'
      && (item.hostingType === 'local' ? localPath(item.previewUrl) && localPath(item.downloadUrl) : item.hostingType === 'external' && secureUrl(item.previewUrl));
  }
  function addText(parent, tag, className, content) { const el = element(tag, className, content); parent.append(el); return el; }
  function button(className, label, onClick) { const el = element('button', className, label); el.type='button'; el.addEventListener('click', onClick); return el; }
  function optional(source, fallback='Not supplied') { return typeof source === 'string' && source.trim() ? source : fallback; }

  function makeCard(resource) {
    const card = element('article', 'resource-card');
    card.setAttribute('aria-label', resource.title);
    const top = element('div', 'resource-top');
    const icon = addText(top, 'span', 'resource-icon', ICONS[resource.domain] || '◈');
    icon.setAttribute('aria-hidden', 'true');
    addText(top, 'span', 'resource-type', resource.hostingType === 'local' ? 'Interactive HTML' : 'External website');
    const body = element('div', 'resource-body');
    addText(body, 'p', 'resource-domain', resource.domain);
    addText(body, 'h3', '', resource.title);
    addText(body, 'p', 'resource-description', resource.description);
    addText(body, 'p', 'use-heading', 'Suggested classroom use');
    addText(body, 'p', 'suggested-use', optional(resource.suggestedUse, 'Please review before classroom use.'));
    const tags = element('div', 'resource-tags');
    (Array.isArray(resource.tags) ? resource.tags.slice(0, 4) : []).forEach(tag => { if (typeof tag === 'string') addText(tags, 'span', 'tag', tag); });
    body.append(tags);
    const footer = element('div', 'resource-footer');
    addText(footer, 'p', 'contributor', 'Contributor: ' + resource.school);
    const actions = element('div', 'primary-actions' + (resource.hostingType === 'external' ? ' single-action' : ''));
    if (resource.hostingType === 'local') {
      actions.append(button('button primary', 'Try It', ev => openPreview(resource, ev.currentTarget)));
      actions.append(button('button secondary', '↓ Download HTML', ev => downloadResource(resource, ev.currentTarget)));
    } else {
      const external = element('a', 'button primary', 'Try It ↗');
      external.href = resource.previewUrl;
      external.target = '_blank'; external.rel = 'noopener noreferrer';
      external.setAttribute('aria-label', 'Try ' + resource.title + ' on external website (opens a new tab)');
      actions.append(external);
      if (secureUrl(resource.downloadUrl)) {
        const download = element('a', 'button secondary', 'Source / ZIP ↗');
        download.href = resource.downloadUrl; download.target='_blank';download.rel='noopener noreferrer';
        actions.append(download); actions.classList.remove('single-action');
      }
    }
    footer.append(actions, button('about-button', 'About this resource →', ev => openAbout(resource, ev.currentTarget)));
    card.append(top, body, footer);
    return card;
  }

  function results() {
    const search = $('#searchInput').value.trim().toLocaleLowerCase();
    const domain = $('#domainFilter').value;
    const school = $('#schoolFilter').value;
    const filtered = state.resources.filter(r => {
      if (domain && r.domain !== domain) return false;
      if (school && r.school !== school) return false;
      if (!search) return true;
      const fields = [r.title,r.description,r.domain,r.school,r.suggestedUse,...(Array.isArray(r.tags) ? r.tags : [])];
      return fields.some(v => typeof v === 'string' && v.toLocaleLowerCase().includes(search));
    });
    grid.replaceChildren(...filtered.map(makeCard));
    const label = `${filtered.length} of ${state.resources.length} resources shown`;
    $('#resultsCount').textContent = label;
    $('#srResults').textContent = label;
    $('#emptyState').hidden = filtered.length !== 0;
  }
  function populateFilters() {
    const domainSelect = $('#domainFilter');
    const schoolSelect = $('#schoolFilter');
    domainSelect.replaceChildren(new Option('All learning domains', ''));
    DOMAINS.forEach(d => domainSelect.append(new Option(d, d)));
    schoolSelect.replaceChildren(new Option('All contributors', ''));
    [...new Set(state.resources.map(r => r.school))].sort().forEach(s => schoolSelect.append(new Option(s,s)));
  }
  function resetFilters() {
    $('#searchInput').value = '';
    $('#domainFilter').value = '';
    $('#schoolFilter').value = '';
    results();
  }
  async function loadResources() {
    grid.setAttribute('aria-busy', 'true');
    $('#loadError').hidden = true; $('#emptyState').hidden = true;
    try {
      const response = await fetch('resources.json', {cache:'no-store'});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('The catalogue must be an array.');
      const unique = new Set();
      const filtered = data.filter(r => { if (!usableResource(r) || unique.has(r.id)) return false; unique.add(r.id); return true; });
      if (!filtered.length) throw new Error('No valid resource entries were found.');
      state.resources = filtered;
      populateFilters();
      $('#collectionTotal').textContent = `${filtered.length} resources`;
      results();
      if (filtered.length < data.length) $('#srResults').textContent += '. Some invalid catalogue entries were omitted.';
    } catch (error) {
      console.error('Catalogue unavailable:',error);
      state.resources=[]; grid.replaceChildren();
      $('#resultsCount').textContent='0 resources shown';
      $('#collectionTotal').textContent='';
      $('#loadError').hidden=false;
      $('#loadErrorText').textContent = location.protocol === 'file:'
        ? 'The gallery needs a web address to read resources.json. Publish to GitHub Pages; standalone resource HTML files can still be opened directly.'
        : 'Check that resources.json exists in the same folder as index.html and contains valid JSON. If you just published, refresh the page.';
      $('#srResults').textContent = 'Unable to load resource catalogue.';
    } finally { grid.setAttribute('aria-busy','false'); }
  }
  async function verifyLocal(path) {
    try {
      const r = await fetch(path, {method:'HEAD',cache:'no-store'});
      if (r.status === 405 || r.status === 501) {
        const fallback = await fetch(path,{method:'GET',cache:'no-store'});
        return fallback.ok && (fallback.headers.get('content-type') || '').includes('text/html');
      }
      return r.ok && !(r.headers.get('content-type') || '').includes('text/plain');
    } catch { return false; }
  }
  function setupDialog(resource, kicker, opener) {
    state.lastOpener=opener;
    $('#modalKicker').textContent=kicker;
    $('#modalTitle').textContent=resource.title;
    $('#modalDescription').textContent=resource.domain + ' · ' + resource.school;
    $('#previewPane').hidden=true; $('#aboutPane').hidden=true;
    previewFrame.removeAttribute('src'); previewError.hidden=true;
    state.previewPath=null;
    dialog.showModal();
    $('#closeModal').focus();
  }
  async function openPreview(resource, opener) {
    setupDialog(resource,'INTERACTIVE PREVIEW',opener);
    $('#previewPane').hidden=false;
    previewFrame.hidden=true;
    const loading = $('#previewError');
    loading.textContent='Checking resource availability…';
    loading.hidden=false;
    const path = resource.previewUrl;
    const found = await verifyLocal(path);
    if (!dialog.open || state.lastOpener !== opener) return;
    if (!found) {
      loading.textContent='This file could not be loaded. Check the file name and path in resources.json, or use “Open in new tab” to inspect it.';
      $('#reloadPreview').disabled=true;
    } else {
      loading.hidden=true;
      state.previewPath=path;
      $('#reloadPreview').disabled=false;
      previewFrame.src=path;
      previewFrame.hidden=false;
      previewFrame.title=`${resource.title} — sandboxed resource preview`;
    }
    $('#openNewTab').href=path;
    $('#openNewTab').setAttribute('aria-label',`Open ${resource.title} in a new tab`);
  }
  async function downloadResource(resource, opener) {
    if (!localPath(resource.downloadUrl)) return;
    const original=opener.textContent;
    opener.disabled=true;opener.textContent='Checking file…';
    const found=await verifyLocal(resource.downloadUrl);
    if (found) {
      const link=document.createElement('a');
      link.href=resource.downloadUrl;
      link.download=resource.downloadUrl.split('/').pop();
      document.body.append(link);link.click();link.remove();
      $('#srResults').textContent=`Download requested: ${resource.title}.`;
    } else {
      $('#srResults').textContent=`Cannot download ${resource.title}: the HTML file is unavailable.`;
      window.alert('The HTML file could not be found. Ask the showcase administrator to check resources.json and the resources/ folder.');
    }
    opener.textContent=original;opener.disabled=false;
  }
  function aboutField(parent,title,value) {
    addText(parent,'h3','',title);
    addText(parent,'p','',optional(value));
  }
  function openAbout(resource,opener) {
    setupDialog(resource,'ABOUT THIS RESOURCE',opener);
    const container=$('#aboutPane');container.replaceChildren();container.hidden=false;
    addText(container,'p','badge-line',resource.hostingType === 'local' ? 'Locally hosted, standalone HTML' : 'External site · Opens separately');
    aboutField(container,'Description',resource.description);
    aboutField(container,'Learning objective',resource.learningObjective);
    aboutField(container,'Suggested classroom use',resource.suggestedUse);
    addText(container,'h3','', 'Possible adaptations');
    const list=element('ul');
    const adaptations = Array.isArray(resource.adaptations) ? resource.adaptations : [];
    if (!adaptations.length) addText(list,'li','', 'No suggestions supplied.');
    else adaptations.forEach(s => {if(typeof s==='string')addText(list,'li','',s);});
    container.append(list);
    const source=element('section','about-source');
    aboutField(source,'Contributed by', optional(resource.creator,resource.school));
    aboutField(source,'Licence / reuse',resource.license);
    if (secureUrl(resource.sourceUrl)) {
      addText(source,'h3','','Source information');
      const link=element('a','',resource.sourceUrl);link.href=resource.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';
      source.append(link);
    }
    if(resource.hostingType==='external')addText(source,'p','','This link leads to a third-party website. It is not hosted by this prototype and has not been approved for classroom use.');
    container.append(source);
  }
  function closeDialog() {if(dialog.open)dialog.close();}
  $('#filterForm').addEventListener('submit',e=>e.preventDefault());
  $('#filterForm').addEventListener('reset',e=>{e.preventDefault();resetFilters();});
  $('#searchInput').addEventListener('input',results);
  $('#domainFilter').addEventListener('change',results);
  $('#schoolFilter').addEventListener('change',results);
  $('#emptyReset').addEventListener('click',resetFilters);
  $('#retryButton').addEventListener('click',loadResources);
  $('#closeModal').addEventListener('click',closeDialog);
  $('#reloadPreview').addEventListener('click',() => {if(state.previewPath){previewFrame.src='about:blank';previewFrame.src=state.previewPath;}});
  dialog.addEventListener('close',() => {
    previewFrame.removeAttribute('src');
    const opener=state.lastOpener;
    state.lastOpener=null;state.previewPath=null;
    if (opener && opener.isConnected) opener.focus();
  });
  dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog();});
  // Native <dialog>.showModal() supplies initial focus containment. This additionally cycles Tab
  // across visible focusable controls for browser implementations with incomplete dialog trapping.
  dialog.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeDialog();return;}
    if(e.key!=='Tab')return;
    const focusable=[...dialog.querySelectorAll('a[href],button:not([disabled]),iframe')].filter(el => !el.hidden && !el.closest('[hidden]') && el.getClientRects().length);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
  });
  $('#contrastButton').addEventListener('click', e=>{
    const on=document.body.classList.toggle('high-contrast');
    const control=e.currentTarget;
    control.setAttribute('aria-pressed',String(on));
    control.replaceChildren();
    const symbol=element('span','','◐');symbol.setAttribute('aria-hidden','true');
    control.append(symbol,document.createTextNode(` High contrast: ${on?'On':'Off'}`));
  });
  loadResources();
})();
