# Landing de socios - Young Universitario

Landing 100% estática (GitHub Pages) con pagos por link de Mercado Pago + formulario embebido que envía a webhook de n8n.

## Archivos

- `index.html`
- `config.js`
- `script.js`

## Configuración rápida (`config.js`)

Editá solo este archivo:

```js
window.LANDING_CONFIG = {
  CLUB_NAME: 'Young Universitario',
  CITY: 'Young, Uruguay',
  INSTAGRAM_URL: 'https://instagram.com/tu_perfil',
  PRICE_MONTHLY: '600 pesos uruguayos',
  PRICE_YEARLY: '1000 pesos uruguayos',
  MP_LINK_MONTHLY: 'https://www.mercadopago.com/...',
  MP_LINK_YEARLY: 'https://www.mercadopago.com/...',
  CONTACT_WHATSAPP: '+598XXXXXXXX',
  CONTACT_EMAIL: 'contacto@club.com',
  N8N_WEBHOOK_URL: 'https://n8n.tudominio.com/webhook/....',
  FORM_KEY: 'tu_clave_secreta',
};
```

Notas:
- Si falta un link, dejalo como `"(Configurar link)"`.
- Para contacto alcanza con `CONTACT_WHATSAPP` o `CONTACT_EMAIL`.
- `N8N_WEBHOOK_URL` y `FORM_KEY` son obligatorios para enviar el formulario.

## Deploy en GitHub Pages

1. Subí los cambios a la rama `main`.
2. En GitHub, abrí el repo y entrá a `Settings` > `Pages`.
3. En `Build and deployment` elegí:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
4. Guardá y esperá 1-3 minutos.
5. Abrí la URL pública de Pages.

## Test del webhook con curl

Reemplazá `WEBHOOK_URL` y `FORM_KEY`:

```bash
curl -X POST "WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-FORM-KEY: FORM_KEY" \
  -d '{
    "createdAt":"2026-02-18T12:00:00.000Z",
    "pageUrl":"https://deleonaparicio.github.io/young-universitario-socios/",
    "utm_source":"instagram",
    "utm_medium":"social",
    "utm_campaign":"socios_evento",
    "utm_content":"story",
    "utm_term":"",
    "nombre":"Juan Perez",
    "ci":"12345678",
    "telefono":"+59899999999",
    "email":"",
    "plan":"mensual",
    "payment_ref":"MP-12345"
  }'
```

Respuesta esperada en n8n:
- Ideal: `{"ok": true, "message": "..."}`
- Si responde error HTTP o CORS, la web mostrará mensaje de error.

## Troubleshooting

- Error CORS:
  - Revisá que el webhook permita origen desde GitHub Pages.
  - En n8n, habilitá CORS para tu dominio de Pages.
- URL incorrecta:
  - Verificá `N8N_WEBHOOK_URL` en `config.js`.
- Clave inválida:
  - Verificá `FORM_KEY` y el header `X-FORM-KEY` en n8n.
- No envía dos veces seguidas:
  - Hay rate-limit cliente de 45 segundos para evitar doble envío accidental.
- Form no envía:
  - Revisá campos obligatorios y checkbox de términos.

## Recomendación de QR para evento

- Recomendado: 1 QR a la landing.
- Opcional: 2 QRs directos a pagos mensual/anual para filas rápidas.
