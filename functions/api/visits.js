/**
 * Compteur de visites public (Cloudflare Pages Function).
 * GET  /api/visits : lit le total sans le changer.
 * POST /api/visits : ajoute 1 visite et renvoie le nouveau total.
 * Le total est gardé dans la base D1 « guindonville-visites » (liaison DB).
 * Rien d'autre n'est enregistré : ni adresse IP, ni navigateur.
 */
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export async function onRequestGet({ env }) {
  try {
    const row = await env.DB.prepare("SELECT total FROM compteur WHERE id = 'visites'").first();
    return json({ count: row ? row.total : 12345 });
  } catch (e) {
    return json({ error: 'Compteur indisponible' }, 503);
  }
}

export async function onRequestPost({ env }) {
  try {
    // Une seule requête, atomique : deux visites simultanées comptent bien pour deux.
    const row = await env.DB.prepare(
      "UPDATE compteur SET total = total + 1 WHERE id = 'visites' RETURNING total"
    ).first();
    return json({ count: row ? row.total : 12345 });
  } catch (e) {
    return json({ error: 'Compteur indisponible' }, 503);
  }
}
