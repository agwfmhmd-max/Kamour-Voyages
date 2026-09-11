# Kamour Voyages — Vercel

## Déploiement
1. Décompressez le dossier.
2. Importez le projet dans Vercel ou ارفع المجلد إلى Vercel.
3. Le site fonctionne immédiatement en **mode démonstration**.
4. Pour activer la recherche hôtelière avec disponibilités/prix via Amadeus, ajoutez dans Vercel > Settings > Environment Variables:
   - `AMADEUS_CLIENT_ID`
   - `AMADEUS_CLIENT_SECRET`
5. Redéployez.

## Ce qui est inclus
- Site vitrine professionnel FR/AR.
- Recherche d'hôtels.
- Catalogue hôtelier de démonstration.
- Formulaire de demande de réservation.
- Envoi direct de la demande vers WhatsApp Kamour Voyages.
- Demande de billets d'avion.
- Assistance visa.
- Services et contact.
- API Vercel `/api/hotels` prête pour Amadeus.
- API Vercel `/api/book` prête pour connecter un CRM/base de données.
- Images et branding Kamour issus des visuels fournis.

## Important pour une vraie réservation en ligne
Le site ne demande pas de carte bancaire au client. En production, la confirmation de réservation et le paiement doivent être branchés à un fournisseur/partenaire hôtelier et à un système sécurisé. Amadeus documente la recherche, la disponibilité et la réservation d'hôtels via ses APIs. 
