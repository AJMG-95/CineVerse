# CineVerse

Aplicación **Angular 20** para explorar **películas y series** (tendencias, populares, mejor valoradas, detalles, búsqueda, similares, listas, etc.).
UI con **Tailwind CSS v4.1** + **DaisyUI 5.1**, carruseles con **Swiper 12**, datos servidos por **TMDb** a través de un **proxy en Cloudflare** (la API key **no** es pública).

> ℹ️ La clave **no** se expone en el cliente: todas las peticiones pasan por un **proxy** (Cloudflare Worker) que añade la credencial en el edge.

---

## 🧩 Tech Stack

- **Framework**: Angular **20.2.1** (standalone, CLI)
- **Estilos**: Tailwind CSS **4.1.x** + DaisyUI **5.1.x**
- **UI extra**: Swiper **12.x**
- **Librerías**: RxJS **7.8.x**
- **Tooling**: TypeScript **5.8.x**, Prettier
- **Testing**: Karma + Jasmine

**Dependencias clave (package.json):**
- `@angular/*` 20.1.x
- `tailwindcss` ^4.1.12
- `@tailwindcss/postcss` ^4.1.12
- `daisyui` ^5.1.3
- `swiper` ^12.0.1
- `rxjs` ~7.8.0

---

## 📦 Instalación

### Requisitos
- Node **18+** (o 20+)
- npm **9+**

### Instalar dependencias
```bash
npm ci
# o
npm install
```

## 🛠️ Desarrollo
```bash
npm start
# abre http://localhost:4200
```

## 🏗️ Construcción (producción)
```bash
npm run build
```

## 🧪 Tests
### Ejecutar unit tests (Karma + Jasmine)
```bash
npm test
```

## 🌐 API mediante proxy (Cloudflare)

Para evitar exponer la API key de TMDb en el cliente, todas las peticiones van contra un endpoint proxy en Cloudflare.

El proxy:

- Reenvía la petición a https://api.themoviedb.org/3/...
- Inyecta la credencial (header Authorization: Bearer ... o api_key=...)
- Gestiona CORS y cabeceras
