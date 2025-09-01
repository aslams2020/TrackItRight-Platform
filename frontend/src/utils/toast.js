export const toast = (msg) => {
  try {
    const el = document.createElement('div');
    el.innerText = msg;
    el.style.position = 'fixed';
    el.style.right = '20px';
    el.style.top = '60px';
    el.style.background = '#111';
    el.style.color = '#fff';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.zIndex = 9999;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  } catch (e) { /* ignore */ }
};
