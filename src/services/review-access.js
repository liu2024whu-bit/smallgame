// A convenience gate for a static maintenance page, not server authentication.
export const REVIEW_SESSION_KEY='smallgame:review:unlocked';
const PIN_HASH='2d4eaee2ca90d6eff65868f19978af7ba47a0f3e9e81a7087ac16950ce59baf1';
export async function acceptsReviewPin(value,crypto=globalThis.crypto){
  if(!/^\d{8}$/.test(value))return false;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('')===PIN_HASH;
}
