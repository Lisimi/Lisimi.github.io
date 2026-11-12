// @ts-check
const parameters = new URLSearchParams(location.search);
const projectId = parameters.get('id');
const creativeProject = projects.find(project => project.id === projectId);
const professionalProject = professionalCases.find(project => project.id === projectId);
const currentProject = creativeProject ?? professionalProject;
/** @type {Language} */
let detailLanguage = parameters.get('lang') === 'en' ? 'en' : 'zh';
/** @param {string} id @returns {HTMLElement} */
function requiredElement(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element: ${id}`);
  return element;
}
/** @param {Language} language */
function renderDetail(language) {
  detailLanguage = language;
  document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en';
  const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url);
  document.querySelectorAll('[data-zh][data-en]').forEach(element => {
    if (element instanceof HTMLElement) element.textContent = element.dataset[language] ?? '';
  });
  document.querySelectorAll('[data-lang]').forEach(element => {
    if (element instanceof HTMLElement) element.setAttribute('aria-pressed', String(element.dataset.lang === language));
  });
  document.querySelectorAll('.home-link').forEach(element => {
    if (element instanceof HTMLAnchorElement) element.href = `index.html?lang=${language}${creativeProject ? '#play' : '#work'}`;
  });
  if (!currentProject) {
    requiredElement('case-title').textContent = language === 'zh' ? '找不到這個項目' : 'Project not found';
    requiredElement('case-description').textContent = language === 'zh' ? '請返回作品集選擇項目。' : 'Return to the portfolio to choose a project.';
    requiredElement('case-aside').hidden = true;
    document.querySelector('.project-next')?.setAttribute('hidden', '');
    return;
  }
  document.title = `${currentProject.title[language]} — Simon Li`;
  const description = currentProject.description[language];
  const descriptionMeta = document.querySelector('meta[name="description"]');
  descriptionMeta?.setAttribute('content', description);
  requiredElement('case-title').textContent = currentProject.title[language];
  requiredElement('case-description').textContent = description;
  requiredElement('case-category').textContent = professionalProject ? professionalProject.category[language] : ({game:{zh:'遊戲開發',en:'Game development'},model:{zh:'3D 場景',en:'3D environment'},animation:{zh:'動畫製作',en:'Animation'}})[creativeProject?.category ?? 'game'][language];
  const tags = requiredElement('case-tools'); tags.replaceChildren();
  (professionalProject?.tools ?? creativeProject?.meta ?? '').split(' · ').forEach(tool => {
    const tag = document.createElement('span'); tag.textContent = tool; tags.append(tag);
  });
  const sections = professionalProject?.sections ?? creativeSections[currentProject.id] ?? [];
  const content = requiredElement('case-sections'); const nav = requiredElement('section-navigation');
  content.replaceChildren(); nav.replaceChildren();
  sections.forEach((section, index) => {
    const article = document.createElement('section'); article.className = 'case-section'; article.id = `section-${index}`;
    const heading = document.createElement('h2'); heading.textContent = section.heading[language];
    const body = document.createElement('p'); body.textContent = section.body[language]; article.append(heading, body); content.append(article);
    const link = document.createElement('a'); link.href = `#section-${index}`; link.textContent = `${String(index + 1).padStart(2, '0')}  ${section.heading[language]}`; nav.append(link);
  });
  requiredElement('case-note').textContent = professionalProject ? (professionalProject.id === 'bim' ? bilingual('Feelings Group\n主要實習項目 · 持續開發', 'Feelings Group\nPrimary internship project · Ongoing') : bilingual('Feelings Group\nAI 實習項目', 'Feelings Group\nAI internship project'))[language] : bilingual('個人作品集\n遊戲與 3D 創作', 'Personal portfolio\nGames & 3D work')[language];
  const mediaSection = requiredElement('case-media-section'); mediaSection.hidden = !creativeProject?.gallery;
  requiredElement('case-lead').hidden = !creativeProject;
  requiredElement('lead-caption').textContent = creativeProject?.video ? bilingual('完整影片 · 保留原音軌', 'Full video · Original audio track')[language] : bilingual('場景全貌', 'Environment overview')[language];
  const leadMedia = requiredElement('lead-media');
  const media = requiredElement('case-media');
  // Keep an existing video mounted when switching languages.
  if (creativeProject && leadMedia.childElementCount === 0) {
    if (creativeProject.video) {
      const video = document.createElement('video'); video.src = creativeProject.video; video.poster = `assets/${creativeProject.image}`; video.controls = true; video.playsInline = true; video.preload = 'none'; leadMedia.append(video);
    } else {
      media.classList.add('detail-gallery');
      const hero = document.createElement('img'); hero.src = `assets/${creativeProject.image}`; leadMedia.append(hero);
      (creativeProject.gallery ?? [creativeProject.image]).slice(1).forEach((file, index) => {
        const figure = document.createElement('figure'); const image = document.createElement('img'); image.src = `assets/${file}`; image.loading = 'lazy';
        const caption = document.createElement('figcaption'); caption.textContent = String(index + 2).padStart(2, '0'); figure.append(image, caption); media.append(figure);
      });
    }
  }
  leadMedia.querySelectorAll('img').forEach(image => {image.alt = currentProject.title[language];});
  media.querySelectorAll('img').forEach((image,index) => {image.alt = `${currentProject.title[language]} — ${language === 'zh' ? '角度' : 'View'} ${index+2}`;});
  requiredElement('case-media-caption').textContent = creativeProject?.video ? bilingual('完整影片 · 保留原音軌', 'Full video · Original audio track')[language] : bilingual('多角度場景展示', 'Environment views')[language];
  const allProjects = [...professionalCases, ...projects];
  const index = allProjects.findIndex(project => project.id === currentProject.id);
  const next = allProjects[(index + 1) % allProjects.length];
  const nextLink = requiredElement('next-project');
  if (nextLink instanceof HTMLAnchorElement) {nextLink.href = `project.html?id=${next.id}&lang=${language}`; nextLink.textContent = next.title[language];}
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
  if (!(button instanceof HTMLElement)) return;
  const language = button.dataset.lang;
  if (language === 'zh' || language === 'en') renderDetail(language);
}));
renderDetail(detailLanguage);
