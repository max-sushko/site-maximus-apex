const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(menuToggle)menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open)});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();


/* Scroll drum effect: curl page surfaces behind both fixed bars. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const surfaces = [...document.querySelectorAll('main > section')];
  const footer = document.querySelector('.footer');
  if (!surfaces.length || reducedMotion.matches) return;

  surfaces.forEach(surface => surface.classList.add('drum-surface'));
  document.body.classList.add('drum-scroll-enabled');
  let frame = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateDrum = () => {
    frame = 0;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
    const viewportHeight = window.innerHeight;
    const focusLine = headerHeight + viewportHeight * 0.42;
    const footerTop = viewportHeight - footerHeight;

    surfaces.forEach(surface => {
      const rect = surface.getBoundingClientRect();
      const center = rect.top + Math.min(rect.height, viewportHeight) * 0.5;
      const distance = clamp((center - focusLine) / (viewportHeight * 0.78), -1, 1);
      const topCurl = clamp((headerHeight - rect.top) / (viewportHeight * 0.7), 0, 1);
      const bottomCurl = clamp((rect.bottom - footerTop) / (viewportHeight * 0.7), 0, 1);
      const rotation = distance * 10 + topCurl * 38 - bottomCurl * 38;
      const depth = -(Math.abs(distance) * 42 + topCurl * 100 + bottomCurl * 100);
      const scale = 1 - Math.abs(distance) * 0.025 - topCurl * 0.05 - bottomCurl * 0.05;
      const lift = topCurl * -10 + bottomCurl * 10;

      surface.style.transform =
        'translate3d(0,' + lift.toFixed(2) + 'px,' + depth.toFixed(2) + 'px) ' +
        'rotateX(' + rotation.toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';
      surface.style.filter =
        'brightness(' + (1 - (topCurl + bottomCurl) * 0.08).toFixed(3) + ')';
    });
  };

  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateDrum);
  };

  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate, {passive:true});
  reducedMotion.addEventListener?.('change', () => window.location.reload());
  updateDrum();
})();
