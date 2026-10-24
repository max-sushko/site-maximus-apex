const menuToggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(menuToggle)menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open)});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();


/* Scroll drum effect: stable page surfaces behind both fixed bars. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const main = document.querySelector('main');
  const surfaces = [...document.querySelectorAll('main > section')];
  const footer = document.querySelector('.footer');
  if (!main || !surfaces.length || reducedMotion.matches) return;

  surfaces.forEach(surface => surface.classList.add('drum-surface'));
  document.body.classList.add('drum-scroll-enabled');
  let frame = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const isMobile = window.matchMedia('(max-width: 800px)').matches;
  const curlAngle = isMobile ? 24 : 38;
  const depthStrength = isMobile ? 72 : 100;
  const liftStrength = isMobile ? 6 : 10;
  const distanceAngle = isMobile ? 6 : 10;

  const updateDrum = () => {
    frame = 0;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
    const viewportHeight = window.innerHeight;
    const focusLine = headerHeight + viewportHeight * 0.42;
    const footerTop = viewportHeight - footerHeight;
    const mainTop = main.getBoundingClientRect().top;

    surfaces.forEach(surface => {
      // Read layout geometry, not the section's already transformed visual rectangle.
      const layoutTop = mainTop + surface.offsetTop;
      const layoutHeight = surface.offsetHeight;
      const layoutBottom = layoutTop + layoutHeight;
      const center = layoutTop + Math.min(layoutHeight, viewportHeight) * 0.5;
      const distance = clamp((center - focusLine) / (viewportHeight * 0.78), -1, 1);
      const topCurl = clamp((headerHeight - layoutTop) / (viewportHeight * 0.7), 0, 1);
      const bottomCurl = clamp((layoutBottom - footerTop) / (viewportHeight * 0.7), 0, 1);
      const rotation = distance * distanceAngle + topCurl * curlAngle - bottomCurl * curlAngle;
      const depth = -(Math.abs(distance) * 42 + topCurl * depthStrength + bottomCurl * depthStrength);
      const scale = 1 - Math.abs(distance) * 0.025 - topCurl * 0.04 - bottomCurl * 0.04;
      const lift = topCurl * -liftStrength + bottomCurl * liftStrength;

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
