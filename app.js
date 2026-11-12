// @ts-check
/** @type {Language} */
let language = 'zh';

const grid = document.getElementById('project-grid');
const dialog = document.getElementById('project-dialog');
const media = document.getElementById('dialog-media');
const galleryControls = document.getElementById('gallery-controls');
if (!(grid instanceof HTMLElement) || !(dialog instanceof HTMLDialogElement) || !(media instanceof HTMLElement) || !(galleryControls instanceof HTMLElement)) throw new Error('Missing portfolio elements');
/** @type {Project | undefined} */
let activeProject;
let selectedFilter = 'all';
/** @param {Project['category']} category */
function categoryName(category) {
  const labels = {game:{zh:'遊戲開發',en:'GAME DEVELOPMENT'},model:{zh:'3D 場景',en:'3D ENVIRONMENT'},animation:{zh:'動畫',en:'ANIMATION'}};
  return labels[category][language];
}
function renderProjects() {
  if (!grid) return;
  grid.replaceChildren();
  projects.forEach(project => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `project ${project.id}`; button.dataset.project = project.id;
    button.hidden = selectedFilter !== 'all' && selectedFilter !== project.category;
    const visual = document.createElement('div'); visual.className = 'project-visual';
    const image = document.createElement('img'); image.src = `assets/${project.image}`; image.alt = project.title[language]; image.loading = 'lazy'; image.width = 1000; image.height = 563;
    const label = document.createElement('span'); label.className = 'project-label'; label.textContent = categoryName(project.category);
    const indicator = document.createElement('span'); indicator.className = 'media-indicator'; indicator.textContent = project.video ? '▷' : '+'; indicator.setAttribute('aria-hidden','true');
    visual.append(image,label,indicator);
    const meta = document.createElement('div'); meta.className = 'project-meta';
    const title = document.createElement('h3'); title.textContent = project.title[language];
    const tech = document.createElement('span'); tech.textContent = project.meta;
    meta.append(title,tech);
    const subtitle = document.createElement('p'); subtitle.textContent = project.subtitle[language];
    button.append(visual,meta,subtitle); button.addEventListener('click',()=>openProject(project)); grid.append(button);
  });
}
/** @param {Project} project */
function openProject(project) {
  if (!(dialog instanceof HTMLDialogElement) || !media || !galleryControls) return;
  activeProject = project;
  const detailLink = document.getElementById('project-detail-link');
  if (detailLink instanceof HTMLAnchorElement) detailLink.href = `project.html?id=${project.id}&lang=${language}`;
  for (const [id,value] of [['dialog-title',project.title[language]],['dialog-description',project.description[language]],['dialog-category',categoryName(project.category)]]) {
    const element = document.getElementById(id); if (element) element.textContent = value;
  }
  media.replaceChildren(); galleryControls.replaceChildren();
  if (project.video) {
    const video = document.createElement('video'); video.controls = true; video.playsInline = true; video.preload = 'none'; video.poster = `assets/${project.image}`; video.src = project.video; media.append(video);
  } else {
    const image = document.createElement('img'); image.src = `assets/${project.image}`; image.alt = project.title[language]; media.append(image);
    project.gallery?.forEach((file,index)=> {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = String(index+1).padStart(2,'0'); button.setAttribute('aria-label',`${language === 'zh' ? '角度' : 'View'} ${index+1}`); button.setAttribute('aria-pressed',String(index===0));
      button.addEventListener('click',()=>{image.src=`assets/${file}`; galleryControls.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}); galleryControls.append(button);
    });
  }
  if (!dialog.open) dialog.showModal();
}
/** @param {Language} next */
function setLanguage(next) {
  language = next; document.documentElement.lang = next === 'zh' ? 'zh-Hant' : 'en';
  document.querySelectorAll('[data-zh][data-en]').forEach(element=>{if (element instanceof HTMLElement) element.textContent = (element.dataset[next] ?? '').replace(/\\n/g,'\n');});
  document.querySelectorAll('[data-lang]').forEach(element=>{if(element instanceof HTMLButtonElement) element.setAttribute('aria-pressed',String(element.dataset.lang===next));});
  const heroImage = document.querySelector('.hero-image img');
  if(heroImage instanceof HTMLImageElement) heroImage.alt=next==='zh'?'Punk Street — 霓虹燈與管道交錯的立體街景模型':'Punk Street — a layered 3D streetscape of neon lights and pipes';
  renderProjects();
  document.querySelectorAll('[data-case]').forEach(element=>{if(element instanceof HTMLAnchorElement) element.href=`project.html?id=${element.dataset.case}&lang=${next}`;});
  if (dialog instanceof HTMLDialogElement && dialog.open && activeProject) openProject(activeProject);
}
document.querySelectorAll('[data-lang]').forEach(element=>element.addEventListener('click',()=>{if(element instanceof HTMLElement){const next=element.dataset.lang;if(next==='zh'||next==='en')setLanguage(next);}}));
document.querySelectorAll('[data-filter]').forEach(element=>element.addEventListener('click',()=>{if(!(element instanceof HTMLElement))return;selectedFilter=element.dataset.filter ?? 'all';document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button===element)));renderProjects();}));
document.querySelector('.hero-image')?.addEventListener('click',()=>openProject(projects[0]));
document.getElementById('close-dialog')?.addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{const video=media.querySelector('video');if(video instanceof HTMLVideoElement){video.pause();video.removeAttribute('src');video.load();}media.replaceChildren();activeProject=undefined;});
setLanguage(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh');
