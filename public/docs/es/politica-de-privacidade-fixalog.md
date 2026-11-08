# Política de Privacidad - Fixalog

La aplicación **Fixalog** fue desarrollada por el ecosistema Aresta Climb como una herramienta técnica orientada a la seguridad, documentación y auditoría de protecciones en vías de escalada.

Esta política describe de forma clara y transparente qué permisos se utilizan, cómo se almacenan sus datos localmente y cómo se protege su información.

---

## 1. Principio de Almacenamiento Local y Soberanía de Datos (Offline-First)

Fixalog fue construido con una arquitectura estrictamente **offline-first**:
- Sus datos de identidad (nombre, correo electrónico público, clave pública y certificado de equipador) y todos los informes en curso se almacenan **exclusivamente en la base de datos local (SQLite)** de su dispositivo.
- Ninguna fotografía, video o coordenada geográfica de vías auditadas se transmite automáticamente a servidores remotos sin su orden explícita de compartir o exportar.

---

## 2. Permisos del Dispositivo Solicitados

### A. Cámara
- **Finalidad:** Captura de fotos y videos detallados de los anclajes fijos.
- **Uso:** Los archivos multimedia se almacenan en la carpeta de sesión local y se incrustan en el informe pericial EPUB 3 y PDF firmado. Nunca se accede a la cámara en segundo plano.

### B. Ubicación Precisa (GPS)
- **Finalidad:** Registro de coordenadas geográficas en el momento de la inspección.
- **Uso:** Asegura que el informe técnico compruebe la ubicación exacta de la intervención en la pared.

---

## 3. Criptografía y Firma Digital

Los informes técnicos generados por Fixalog utilizan claves criptográficas locales del equipador para firmar digitalmente los informes (XML-DSig X.509). La clave privada permanece protegida en el almacenamiento seguro de su dispositivo (Secure Storage / Keystore) y nunca se envía a servidores externos.

---

## 4. Datos de Diagnóstico y Monitoreo de Errores (Crashlytics y Sentry)

Para garantizar la estabilidad continua de la aplicación, Fixalog recopila informes técnicos anónimos de fallos a través de **Firebase Crashlytics** y **Sentry**, sin incluir fotos de anclajes, coordenadas GPS de inspección ni claves privadas.

---

## 5. Servicios de Terceros

- [Apple](https://www.apple.com/legal/privacy/)
- [Google Play Services](https://policies.google.com/privacy)
- [Firebase](https://firebase.google.com/support/privacy)
- [Sentry](https://sentry.io/privacy/)
- [GitHub](https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement)
- [Supabase](https://supabase.com/privacy)

---

## 6. Sus Derechos (RGPD / LGPD)

Como los datos permanecen bajo su control directo en su propio dispositivo, puede modificar o eliminar sus datos de identidad, borrar el historial de informes locales y revocar los permisos de Cámara y Ubicación en cualquier momento.

---

## 7. Contacto y Vigencia

Para consultas sobre esta política, visite [arestaclimb.com](https://arestaclimb.com) o escriba a **contato@arestaclimb.com**. Esta política entra en vigor el 25 de octubre de 2026.
