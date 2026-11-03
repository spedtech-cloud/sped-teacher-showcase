/* SPED Interactive Showcase v1.1 — static, dependency-free public resource gallery.
 * Catalogue text is inserted using textContent; approved external links are opened separately.
 */
(() => {
  'use strict';
  const SKILL_AREAS = ['Everyday Digital Skills', 'Learning with Technology', 'Digital Work Skills', 'Device Operation & Care', 'Checking Online Information', 'Online Communication', 'Online Safety'];
  const CONTEXTS = ['Living', 'Learning', 'Working', 'Online Safety'];
  const SUPPORT_TYPE = 'Teaching Supports';
  const ICONS = {'Everyday Digital Skills':'🔎','Learning with Technology':'📝','Digital Work Skills':'🗂️','Device Operation & Care':'⚙️','Checking Online Information':'✅','Online Communication':'💬','Online Safety':'🛡️'};
  const $ = selector => document.querySelector(selector);
  const state = {resources: [], lastOpener: null, previewPath: null, announceTimer: null};
  const grid = $('#galleryGrid');
  const dialog = $('#resourceDialog');
  const previewFrame = $('#previewFrame');
  const previewError = $('#previewError');
  const modalStatus = $('#modalStatus');

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined && content !== null) node.textContent = String(content);
    return node;
  }
  function add(parent, tag, className, content) {
    const node = el(tag, className, content);
    parent.append(node);
    return node;
  }
  function button(className, label, action) {
    const control = el('button', className, label);
    control.type = 'button';
    control.addEventListener('click', action);
    return control;
  }
  function optional(value, fallback = 'Not supplied; please check before classroom use.') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }
  function localFile(url, extensions = ['html']) {
    if (typeof url !== 'string') return false;
    return new RegExp('^resources\\/[a-z0-9-]+\\.(' + extensions.join('|') + ')$').test(url);
  }
  function secureUrl(value) {
    if (typeof value !== 'string' || value.trim() !== value) return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname && !url.username && !url.password;
    } catch { return false; }
  }
  function externalDownloadUrl(value, previewUrl) {
    if (!secureUrl(value) || value === previewUrl) return false;
    try {
      const path = decodeURIComponent(new URL(value).pathname);
      return /\.(html?|zip)$/i.test(path);
    } catch { return false; }
  }
  function validResource(item) {
    if (!item || typeof item !== 'object' || !/^[a-z0-9-]+$/.test(item.id || '') ||
        typeof item.title !== 'string' || !item.title.trim() ||
        typeof item.description !== 'string' || !item.description.trim()) return false;
    if (item.hostingType === 'external') return secureUrl(item.previewUrl);
    return (item.hostingType === undefined || item.hostingType === 'local') && localFile(item.previewUrl) &&
      (item.downloadUrl == null || localFile(item.downloadUrl, ['html','zip']));
  }
  function isExternal(resource) { return resource.hostingType === 'external'; }
  function resourceType(resource) {
    if (typeof resource.resourceType === 'string' && resource.resourceType.trim()) return resource.resourceType.trim();
    if (resource.domain === SUPPORT_TYPE) return 'Teaching support · ' + (isExternal(resource) ? 'External website' : 'Interactive HTML');
    return isExternal(resource) ? 'External website' : 'Interactive HTML';
  }
  function hasDownload(resource) {
    if (isExternal(resource)) return externalDownloadUrl(resource.downloadUrl, resource.previewUrl);
    return localFile(resource.downloadUrl, ['html','zip']);
  }
  function downloadLabel(resource) { return /\.zip(?:$|\?)/i.test(resource.downloadUrl || '') ? 'Download Files' : 'Download HTML'; }
  function downloadAction(resource) {
    if (!hasDownload(resource)) return null;
    if (isExternal(resource)) {
      const link = el('a', 'button secondary', downloadLabel(resource) + ' ↗');
      link.href = resource.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Download source files for ' + resource.title + ' (opens a new tab)');
      return link;
    }
    const downloadButton = button('button secondary', '↓ ' + downloadLabel(resource), event => downloadResource(resource, event.currentTarget));
    downloadButton.setAttribute('aria-label', downloadLabel(resource) + ' for ' + resource.title);
    return downloadButton;
  }
  function tryAction(resource) {
    if (isExternal(resource)) {
      const link = el('a', 'button primary', 'Try It — external ↗');
      link.href = resource.previewUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Try ' + resource.title + ' on external website (opens a new tab)');
      return link;
    }
    const tryButton = button('button primary', 'Try It', event => openPreview(resource, event.currentTarget));
    tryButton.setAttribute('aria-label', 'Try ' + resource.title + ' in an interactive preview');
    return tryButton;
  }
  function makeActions(resource, className = 'primary-actions') {
    const actions = el('div', className);
    actions.append(tryAction(resource));
    const download = downloadAction(resource);
    if (download) actions.append(download);
    else {
      actions.classList.add('single-action');
      add(actions, 'span', 'download-unavailable', 'Source files unavailable for download');
    }
    return actions;
  }
  function domainText(resource) {
    return ['Digital Literacy', optional(resource.skillArea, 'General digital skill')].join(' · ');
  }
  function makeCard(resource) {
    const card = el('article', 'resource-card');
    card.setAttribute('aria-label', resource.title);
    const top = el('div', 'resource-top');
    const icon = add(top, 'span', 'resource-icon', ICONS[resource.skillArea] || '💻');
    icon.setAttribute('aria-hidden', 'true');
    add(top, 'span', 'resource-type', resourceType(resource));
    const body = el('div', 'resource-body');
    add(body, 'p', 'resource-domain', domainText(resource));
    add(body, 'h3', '', resource.title);
    add(body, 'p', 'resource-description', resource.description);
    add(body, 'p', 'use-heading', 'Learning objective');
    add(body, 'p', 'resource-objective', optional(resource.learningObjective, 'Learning objective not provided; please check with the creator.'));
    add(body, 'p', 'use-heading', 'Suggested classroom use');
    add(body, 'p', 'suggested-use', optional(resource.suggestedUse, 'Suggested use not provided; review before classroom use.'));
    const tags = el('div', 'resource-tags');
    (Array.isArray(resource.tags) ? resource.tags.slice(0, 3) : []).forEach(tag => {
      if (typeof tag === 'string') add(tags, 'span', 'tag', tag);
    });
    body.append(tags);
    const footer = el('div', 'resource-footer');
    add(footer, 'p', 'contributor', 'Contributor: ' + optional(resource.school, 'Not specified'));
    footer.append(makeActions(resource));
    const aboutButton = button('about-button', 'About this resource →', event => openAbout(resource, event.currentTarget));
    aboutButton.setAttribute('aria-label', 'About ' + resource.title);
    footer.append(aboutButton);
    card.append(top, body, footer);
    return card;
  }
  function renderSpotlight() {
    const section = $('#spotlight');
    const host = $('#spotlightContent');
    if (!section || !host) return;
    const resource = state.resources.find(r => r.spotlight === true);
    host.replaceChildren();
    section.hidden = !resource;
    if (!resource) return;
    const card = el('article', 'spotlight-card');
    add(card, 'p', 'spotlight-eyebrow', domainText(resource));
    add(card, 'h3', '', resource.title);
    add(card, 'p', '', resource.description);
    add(card, 'p', 'spotlight-label', 'Learning objective');
    add(card, 'p', '', optional(resource.learningObjective, 'Objective not provided.'));
    add(card, 'p', 'spotlight-label', 'Suggested classroom use');
    add(card, 'p', '', optional(resource.suggestedUse, 'Review before classroom use.'));
    const actions = makeActions(resource, 'spotlight-actions');
    const aboutButton = button('button tertiary', 'About this resource', event => openAbout(resource, event.currentTarget));
    aboutButton.setAttribute('aria-label', 'About featured resource: ' + resource.title);
    actions.append(aboutButton);
    card.append(actions);
    host.append(card);
  }
  function filteredResources() {
    const search = $('#searchInput').value.trim().toLocaleLowerCase();
    const skillArea = $('#domainFilter').value;
    const context = $('#schoolFilter').value;
    return state.resources.filter(r => {
      if (skillArea && r.skillArea !== skillArea) return false;
      if (context && r.context !== context) return false;
      if (!search) return true;
      const fields = [r.title, r.description, r.learningObjective, r.suggestedUse, r.skillArea, r.context,
        r.resourceType, ...(Array.isArray(r.tags) ? r.tags : [])];
      return fields.some(s => typeof s === 'string' && s.toLocaleLowerCase().includes(search));
    });
  }
  function announce(message, delayed = false) {
    if (state.announceTimer) clearTimeout(state.announceTimer);
    if (delayed) state.announceTimer = setTimeout(() => {$('#srResults').textContent = message;}, 200);
    else $('#srResults').textContent = message;
  }
  function results() {
    const filtered = filteredResources();
    grid.replaceChildren(...filtered.map(makeCard));
    const label = `${filtered.length} of ${state.resources.length} resources shown`;
    $('#resultsCount').textContent = label;
    announce(label, true);
    $('#emptyState').hidden = filtered.length !== 0;
  }
  function populateFilters() {
    const skillSelect = $('#domainFilter');
    const contextSelect = $('#schoolFilter');
    skillSelect.replaceChildren(new Option('All digital skill areas', ''));
    SKILL_AREAS.filter(d => state.resources.some(r => r.skillArea === d)).forEach(d => skillSelect.append(new Option(d,d)));
    contextSelect.replaceChildren(new Option('All contexts', ''));
    CONTEXTS.filter(d => state.resources.some(r => r.context === d)).forEach(d => contextSelect.append(new Option(d,d)));
  }
  function resetFilters() {
    $('#searchInput').value = '';
    $('#domainFilter').value = '';
    $('#schoolFilter').value = '';
    results();
  }
  async function loadResources() {
    grid.setAttribute('aria-busy','true');
    $('#loadError').hidden = true;
    $('#emptyState').hidden = true;
    try {
      const response = await fetch('resources.json',{cache:'no-store'});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const all = await response.json();
      if (!Array.isArray(all)) throw new Error('The resource catalogue must be an array.');
      const seen = new Set();
      const valid = all.filter(r => {
        if (!validResource(r) || seen.has(r.id)) return false;
        seen.add(r.id); return true;
      });
      if (!valid.length) throw new Error('No valid catalogue entries were found.');
      state.resources = valid;
      renderSpotlight();
      populateFilters();
      $('#collectionTotal').textContent = `${valid.length} resources`;
      results();
      if (valid.length !== all.length) announce(`${valid.length} resources loaded. ${all.length-valid.length} invalid entries omitted.`);
    } catch (error) {
      console.error('Catalogue error:',error);
      state.resources=[]; grid.replaceChildren(); renderSpotlight();
      $('#collectionTotal').textContent=''; $('#resultsCount').textContent='0 resources shown';
      $('#loadError').hidden=false;
      $('#loadErrorText').textContent = location.protocol === 'file:'
        ? 'Open the published website or use a local web server. The gallery cannot load JSON when opened as a file.'
        : 'Check resources.json beside index.html and refresh. The catalogue could not be loaded.';
      announce('Unable to load the resource catalogue.');
    } finally {grid.setAttribute('aria-busy','false');}
  }
  async function verifyLocal(path) {
    if (!localFile(path,['html','zip'])) return false;
    try {
      let response = await fetch(path,{method:'HEAD',cache:'no-store'});
      if (response.status === 405 || response.status === 501) response = await fetch(path,{method:'GET',cache:'no-store'});
      return response.ok && !(response.headers.get('content-type') || '').includes('text/plain');
    } catch {return false;}
  }
  function setModalState(message) {if (modalStatus) modalStatus.textContent = message;}
  function setupDialog(resource, kicker, opener) {
    state.lastOpener=opener;
    $('#modalKicker').textContent=kicker;
    $('#modalTitle').textContent=resource.title;
    $('#modalDescription').textContent = domainText(resource) + ' · ' + resourceType(resource);
    $('#previewPane').hidden=true; $('#aboutPane').hidden=true;
    previewFrame.removeAttribute('src'); previewFrame.hidden=true;
    previewError.hidden=true; previewError.textContent='';
    state.previewPath=null;
    $('#openNewTab').removeAttribute('href');
    $('#reloadPreview').disabled=true;
    dialog.showModal();
    $('#closeModal').focus();
    setModalState(kicker === 'INTERACTIVE PREVIEW' ? 'Preview dialog opened for ' + resource.title : 'Resource details opened for ' + resource.title);
  }
  async function openPreview(resource, opener) {
    setupDialog(resource, 'INTERACTIVE PREVIEW', opener);
    $('#previewPane').hidden=false;
    const loading = previewError;
    loading.textContent='Checking resource availability…'; loading.hidden=false;
    const path = resource.previewUrl;
    const found = await verifyLocal(path);
    if (!dialog.open || state.lastOpener !== opener) return;
    $('#openNewTab').href=path;
    $('#openNewTab').setAttribute('aria-label','Open ' + resource.title + ' in a new tab');
    if (!found) {
      loading.textContent='The HTML preview is unavailable. Check the resource file and path; you can try opening it in a new tab.';
      setModalState('Preview not available for ' + resource.title);
      return;
    }
    loading.hidden=true;
    state.previewPath=path;
    $('#reloadPreview').disabled=false;
    previewFrame.title = resource.title + ' — sandboxed interactive preview';
    previewFrame.src=path;
    previewFrame.hidden=false;
    setModalState('Preview ready for ' + resource.title);
  }
  async function downloadResource(resource, control) {
    if (!hasDownload(resource) || isExternal(resource)) return;
    const label = control.textContent;
    control.disabled=true; control.textContent='Checking file…';
    try {
      if (!await verifyLocal(resource.downloadUrl)) {
        window.alert('The download file could not be found. Please notify the showcase maintainer.');
        announce('Download unavailable for ' + resource.title);
        return;
      }
      const link = el('a'); link.href = resource.downloadUrl;
      link.download = resource.downloadUrl.split('/').pop();
      document.body.append(link); link.click(); link.remove();
      announce('Download requested for ' + resource.title);
    } finally { control.disabled=false; control.textContent=label; }
  }
  function detailField(host, label, value, fallback) {
    add(host, 'h3','',label);
    add(host, 'p','',optional(value, fallback));
  }
  function externalSourceLink(host, label, url) {
    if (!secureUrl(url)) return;
    add(host,'h3','',label);
    const link = add(host,'a','source-link',url);
    link.href = url; link.target = '_blank'; link.rel='noopener noreferrer';
    link.setAttribute('aria-label', label + ' (opens in a new tab)');
  }
  function openAbout(resource, opener) {
    setupDialog(resource,'ABOUT THIS RESOURCE',opener);
    const host = $('#aboutPane');host.replaceChildren();host.hidden=false;
    add(host,'p','badge-line',resourceType(resource));
    detailField(host,'Description',resource.description,'Description not provided.');
    detailField(host,'Learning area', 'Digital Literacy', 'Digital literacy.');
    detailField(host,'Digital skill area',resource.skillArea,'Not specified.');
    detailField(host,'Teaching context',resource.context,'Not specified.');
    detailField(host,'Resource type',resourceType(resource),'Resource type not specified.');
    detailField(host,'Learning objective',resource.learningObjective,'Learning objective not provided; confirm before use.');
    detailField(host,'Suggested classroom use',resource.suggestedUse,'Suggested use not provided; review before classroom use.');
    add(host,'h3','','Possible adaptations');
    const list = el('ul');
    const adaptations = Array.isArray(resource.adaptations) ? resource.adaptations.filter(x => typeof x === 'string' && x.trim()) : [];
    if (adaptations.length) adaptations.forEach(x => add(list,'li','',x));
    else add(list,'li','','No adaptations supplied; consider visual complexity, response options, prompting, pacing and task difficulty.');
    host.append(list);
    const more = el('section','about-teaching');
    detailField(more,'Curriculum relevance (illustrative)',resource.curriculumContext,'No verified TLS alignment supplied.');
    detailField(more,'Teaching approach',resource.instructionalApproach,'Not supplied.');
    detailField(more,'What to observe',resource.assessmentCheck,'Not supplied.');
    detailField(more,'Transfer beyond the screen',resource.transferTask,'Not supplied.');
    host.append(more);
    const source=el('section','about-source');
    detailField(source,'Contributing school',resource.school,'Not specified.');
    detailField(source,'Creator',resource.creator,'Creator not verified or not supplied.');
    detailField(source,'Review status',resource.reviewStatus,'Not independently reviewed.');
    detailField(source,'Download and reuse permissions',resource.reusePermission || resource.license,
      'Permissions not specified; contact the rights holder before redistributing or adapting.');
    if (secureUrl(resource.sourceUrl)) externalSourceLink(source,'Source information',resource.sourceUrl);
    else detailField(source,'Source information',null,'No source information supplied.');
    externalSourceLink(source,'Source repository',resource.sourceRepositoryUrl);
    if (isExternal(resource)) {
      if (!hasDownload(resource)) add(source,'p','download-unavailable', 'Source files unavailable for download. The external site link is for previewing, not downloading.');
      add(source,'p','','External websites open separately and are not embedded in this showcase. Review their suitability before classroom use.');
    }
    host.append(source);
  }
  function closeDialog(){if (dialog.open)dialog.close();}
  $('#filterForm').addEventListener('submit',event=>event.preventDefault());
  $('#filterForm').addEventListener('reset',event=>{event.preventDefault();resetFilters();});
  $('#searchInput').addEventListener('input',results);
  $('#domainFilter').addEventListener('change',results);
  $('#schoolFilter').addEventListener('change',results);
  $('#emptyReset').addEventListener('click',resetFilters);
  $('#retryButton').addEventListener('click',loadResources);
  $('#closeModal').addEventListener('click',closeDialog);
  $('#reloadPreview').addEventListener('click',()=>{
    if (!state.previewPath)return;
    previewFrame.src='about:blank'; previewFrame.src=state.previewPath;
    setModalState('Preview reset');
  });
  dialog.addEventListener('close',()=>{
    previewFrame.removeAttribute('src');
    setModalState('Dialog closed');
    const opener=state.lastOpener;
    state.lastOpener=null;state.previewPath=null;
    if (opener && opener.isConnected) opener.focus();
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
  dialog.addEventListener('keydown',event=>{
    if (event.key==='Escape') {event.preventDefault();closeDialog();return;}
    if (event.key!=='Tab') return;
    const focusable=[...dialog.querySelectorAll('a[href],button:not([disabled]),iframe')]
      .filter(node=> !node.hidden && !node.closest('[hidden]') && node.getClientRects().length);
    if (!focusable.length) return;
    const first=focusable[0], last=focusable[focusable.length-1];
    if (event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  });
  loadResources();
})();
