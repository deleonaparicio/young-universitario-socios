# Landing de socios - Young Universitario

Landing estática mobile-first para campaña de socios, lista para GitHub Pages.

## Archivos

- `index.html`
- `config.js`
- `script.js`

## Deploy en GitHub Pages

1. Subí los cambios a la rama `main`.
2. Entrá al repo en GitHub.
3. Andá a `Settings` > `Pages`.
4. En `Build and deployment` elegí:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
5. Guardá y esperá el deploy.
6. Abrí la URL publicada.

## Configurar links y precios

Editá solo `config.js`:

```js
window.LANDING_CONFIG = {
  CLUB_NAME: 'Young Universitario',
  CITY: 'Young, Uruguay',
  INSTAGRAM_URL: 'https://instagram.com/tu_perfil',
  PRICE_MONTHLY: '600 pesos uruguayos',
  PRICE_YEARLY: '1000 pesos uruguayos',
  MP_LINK_MONTHLY: 'https://www.mercadopago.com/...',
  MP_LINK_YEARLY: 'https://www.mercadopago.com/...',
  FORM_URL: 'https://forms.gle/...',
  CONTACT_WHATSAPP: '+598XXXXXXXX',
};
```

Si te falta algún link, dejalo como `"(Configurar link)"` y la UI lo marca como pendiente.

## Recomendación para evento

- Usar 1 QR principal apuntando a la landing.
- Tener 1 persona ayudando a escanear, pagar y completar datos.
- Mensaje corto: "Pagás y después completás tus datos para el carnet".
