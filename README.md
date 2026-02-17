# Landing de socios - Young Universitario

Landing estática para captar socios en evento, optimizada para celular y lista para GitHub Pages.

## Publicar en GitHub Pages

1. Subí estos archivos al repo en la rama `main`.
2. Entrá a `Settings` > `Pages`.
3. En `Build and deployment`, elegí `Deploy from a branch`.
4. Seleccioná `main` y carpeta `/ (root)`.
5. Guardá y esperá el deploy.
6. Tu landing quedará publicada en la URL de GitHub Pages del repo.

## Cómo actualizar `config.js`

Editá solo este archivo para cambiar nombre, ciudad, precios y links:

```js
window.LANDING_CONFIG = {
  CLUB_NAME: 'Young Universitario',
  CITY: 'Young',
  INSTAGRAM_URL: 'https://instagram.com/tu_perfil',
  PRICE_MONTHLY: '$ 300 / mes',
  PRICE_YEARLY: '$ 3.000 / año',
  MP_LINK_MONTHLY: 'https://www.mercadopago.com/...',
  MP_LINK_YEARLY: 'https://www.mercadopago.com/...',
  FORM_URL: 'https://forms.gle/...',
  CONTACT_WHATSAPP: '+598XXXXXXXX',
  CONTACT_EMAIL: 'socios@younguniversitario.uy',
};
```

Notas:
- Si falta un link, dejalo como `"(Configurar link)"`.
- Los precios están como string para que los puedas editar libremente.
- Usá `CONTACT_WHATSAPP` o `CONTACT_EMAIL` (uno alcanza).

## Recomendación de QR para el evento

- QR principal (recomendado): 1 QR a la landing.
- Opcional: 2 QRs extra directos a pago mensual y pago anual.

## Checklist rápido para el evento

- Cartel visible con QR grande y texto corto.
- Una persona del club ayudando a escanear y pagar.
- Recordatorio verbal: "Después del pago, completá tus datos".
- Celular de apoyo con internet por si alguien no tiene datos.

## Guión de 10 segundos (equipo en el evento)

"Escaneá acá, elegí mensual o anual, pagás al toque y completás tus datos. Con eso ya quedás registrado para recibir tu carnet." 

## Snippet opcional para Instagram

### Copy para post

Ya podés hacerte socio de **Young Universitario**.
En 1 minuto: entrás al link, elegís plan, pagás y completás tus datos.

Tu apoyo nos ayuda a seguir creciendo en Young.

Link en bio.

### Copy para historias

¿Ya sos socio de Young Universitario?
Entrá al link, pagá y completá tus datos.
¡Te lleva 1 minuto!

### CTA link en bio

Hacete socio acá.
