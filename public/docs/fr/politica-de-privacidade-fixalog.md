# Politique de Confidentialité - Fixalog

L'application **Fixalog** a été développée par l'écosystème Aresta Climb comme un outil technique dédié à la sécurité, à la documentation et à l'audit des ancrages sur les voies d'escalade.

Cette politique décrit de manière claire et transparente quelles autorisations sont utilisées, comment vos données sont stockées localement et comment vos informations sont protégées.

---

## 1. Principe de Stockage Local et Souveraineté des Données (Offline-First)

Fixalog est conçu selon une architecture strictement **offline-first** :
- Vos données d'identité (nom, e-mail public, clé publique et certificat) ainsi que tous vos rapports sont stockés **exclusivement dans la base de données locale (SQLite)** de votre appareil.
- Aucune photo, vidéo ou coordonnée GPS de voie auditée n'est transmise automatiquement à des serveurs distants sans votre action explicite de partage ou d'exportation.

---

## 2. Autorisations de l'Appareil Demandées

### A. Caméra
- **Finalité :** Capture de photos et vidéos détaillées des ancrages fixes.
- **Utilisation :** Les médias sont stockés dans le dossier local de session et intégrés aux rapports EPUB 3 et PDF signés.

### B. Localisation Précise (GPS)
- **Finalité :** Enregistrement des coordonnées géographiques au moment de l'inspection.
- **Utilisation :** Garantit que le rapport technique atteste de l'emplacement exact de l'intervention sur la falaise.

---

## 3. Cryptographie et Signature Numérique

Les rapports générés par Fixalog utilisent vos clés cryptographiques locales pour signer numériquement les rapports (XML-DSig X.509). La clé privée reste protégée dans le stockage sécurisé de votre appareil (Secure Storage / Keystore) et n'est jamais envoyée à un serveur externe.

---

## 4. Données de Diagnostic et Suivi des Erreurs (Crashlytics et Sentry)

Afin d'assurer la stabilité continue de l'application, Fixalog collecte des rapports d'erreur anonymes via **Firebase Crashlytics** et **Sentry**, sans jamais inclure de photos d'ancrages, de coordonnées GPS d'inspection ni de clés privées.

---

## 5. Services Tiers

- [Apple](https://www.apple.com/legal/privacy/)
- [Google Play Services](https://policies.google.com/privacy)
- [Firebase](https://firebase.google.com/support/privacy)
- [Sentry](https://sentry.io/privacy/)
- [GitHub](https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement)
- [Supabase](https://supabase.com/privacy)

---

## 6. Vos Droits (RGPD / LGPD)

Vos données restant sous votre contrôle direct sur votre appareil, vous pouvez à tout moment modifier ou supprimer vos données d'identité, effacer l'historique des rapports locaux et révoquer les autorisations de Caméra et de Localisation.

---

## 7. Contact et Entrée en Vigueur

Pour toute question concernant cette politique, visitez [arestaclimb.com](https://arestaclimb.com) ou contactez **contato@arestaclimb.com**. Cette politique entre en vigueur le 25 octobre 2026.
