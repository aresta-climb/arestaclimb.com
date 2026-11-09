# Datenschutzerklärung - Fixalog

Die Anwendung **Fixalog** wurde vom Aresta-Climb-Ökosystem als technisches Werkzeug für Sicherheit, Dokumentation und Prüfung von Sicherungspunkten in Kletterrouten entwickelt.

Diese Richtlinie beschreibt klar und transparent, welche Berechtigungen verwendet werden, wie Ihre Daten lokal gespeichert werden und wie Ihre Informationen geschützt sind.

---

## 1. Prinzip der Lokalen Speicherung und Datensouveränität (Offline-First)

Fixalog wurde mit einer strikten **Offline-First**-Architektur entwickelt:
- Ihre Identitätsdaten (Name, öffentliche E-Mail, öffentlicher Schlüssel und Zertifikat) sowie alle laufenden Berichte werden **ausschließlich in der lokalen Datenbank (SQLite)** Ihres Geräts gespeichert.
- Keine Fotos, Videos oder GPS-Koordinaten geprüfter Routen werden ohne Ihren ausdrücklichen Befehl zum Teilen oder Exportieren an externe Server übertragen.

---

## 2. Angeforderte Geräteberechtigungen

### A. Kamera
- **Zweck:** Aufnahme detaillierter Fotos und Videos der fixen Sicherungspunkte.
- **Verwendung:** Mediendateien werden im lokalen Sitzungsordner gespeichert und in den signierten EPUB-3- und PDF-Bericht eingebettet.

### B. Genauer Standort (GPS)
- **Zweck:** Erfassung der geografischen Koordinaten zum Zeitpunkt der Prüfung.
- **Verwendung:** Stellt sicher, dass der technische Bericht den genauen Ort des Eingriffs am Fels belegt.

---

## 3. Kryptografie und Digitale Signatur

Von Fixalog erstellte Berichte verwenden Ihre lokalen kryptografischen Schlüssel zur digitalen Signatur (X.509 XML-DSig). Der private Schlüssel verbleibt geschützt im sicheren Speicher Ihres Geräts (Secure Storage / Keystore) und wird niemals an externe Server gesendet.

---

## 4. Diagnosedaten und Fehlerüberwachung (Crashlytics und Sentry)

Zur Gewährleistung der Anwendungsstabilität erfasst Fixalog anonyme Absturzberichte über **Firebase Crashlytics** und **Sentry**, ohne jemals Hakenfotos, GPS-Koordinaten oder private Schlüssel einzubeziehen.

---

## 5. Drittanbieterdienste

- [Apple](https://www.apple.com/legal/privacy/)
- [Google Play Services](https://policies.google.com/privacy)
- [Firebase](https://firebase.google.com/support/privacy)
- [Sentry](https://sentry.io/privacy/)
- [GitHub](https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement)
- [Supabase](https://supabase.com/privacy)

---

## 6. Ihre Rechte (DSGVO / LGPD)

Da Ihre Daten unter Ihrer direkten Kontrolle auf Ihrem eigenen Gerät verbleiben, können Sie Ihre Identitätsdaten und lokalen Berichte jederzeit ändern oder löschen sowie Kamera- und Standortberechtigungen widerrufen.

---

## 7. Kontakt und Inkrafttreten

Bei Fragen besuchen Sie [arestaclimb.com](https://arestaclimb.com) oder kontaktieren Sie **contato@arestaclimb.com**. Diese Richtlinie tritt am 25. Oktober 2026 in Kraft.
