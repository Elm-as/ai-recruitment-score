# 🏢 Guide Entreprise - Authentification et Licences

## Vue d'ensemble

L'Assistant IA de Recrutement est désormais une solution B2B complète avec authentification entreprise, gestion d'équipe et système de licences. Ce guide détaille toutes les fonctionnalités liées à l'authentification et à la gestion d'entreprise.

---

## 🔐 Système d'Authentification

### Architecture Multi-tenant

L'application utilise une architecture multi-tenant où :
- Chaque **entreprise** a son propre espace isolé
- Les données d'une entreprise sont **complètement séparées** des autres
- Les **utilisateurs** appartiennent à une entreprise et ne peuvent accéder qu'aux données de celle-ci
- L'authentification vérifie à la fois l'utilisateur ET la licence de l'entreprise

### Flux d'Inscription

1. **Page d'accueil** → Redirection vers la page de connexion
2. **"Créer un compte entreprise"** → Formulaire d'inscription
3. **Informations entreprise** :
   - Nom de l'entreprise
   - Email de contact de l'entreprise (utilisé comme domaine de référence)
4. **Compte administrateur** :
   - Nom complet de l'administrateur
   - Email professionnel (DOIT correspondre au domaine de l'entreprise)
   - Création automatique du rôle "Propriétaire"
5. **Choix de licence** :
   - Essai gratuit (14 jours)
   - Starter (49€/mois)
   - Professional (149€/mois)
   - Enterprise (sur mesure)
6. **Validation** :
   - Vérification que les emails appartiennent au même domaine
   - Vérification qu'aucun compte n'existe avec ces emails
   - Création de l'entreprise et de l'utilisateur
   - Connexion automatique

### Flux de Connexion

1. **Saisie de l'email** professionnel
2. **Validation** :
   - Recherche de l'utilisateur par email
   - Vérification de l'entreprise associée
   - Vérification du statut de la licence (active/expirée)
   - Mise à jour de la date de dernière connexion
3. **Accès accordé** → Redirection vers l'application

### Sécurité

- **Isolation des données** : Les requêtes filtrent automatiquement par `companyId`
- **Validation de domaine** : Les nouveaux utilisateurs doivent avoir un email du même domaine
- **Validation de licence** : La connexion échoue si la licence est expirée
- **Session persistante** : L'état d'authentification est sauvegardé dans le KV store

---

## 📊 Système de Licences

### Types de Licences

#### 🆓 Essai Gratuit (Trial)
- **Durée** : 14 jours
- **Utilisateurs** : 3 maximum
- **Postes** : 5 maximum
- **Candidats par poste** : 50 maximum
- **Fonctionnalités** :
  - ❌ Opérations groupées
  - ❌ Analyses avancées
  - ❌ Modèles d'emails
  - ❌ Accès API
  - ❌ Personnalisation

#### 💼 Starter - 49€/mois
- **Durée** : 365 jours (renouvellement annuel)
- **Utilisateurs** : 5 maximum
- **Postes** : 20 maximum
- **Candidats par poste** : 200 maximum
- **Fonctionnalités** :
  - ✅ Opérations groupées
  - ❌ Analyses avancées
  - ✅ Modèles d'emails
  - ❌ Accès API
  - ❌ Personnalisation

#### 🚀 Professional - 149€/mois
- **Durée** : 365 jours (renouvellement annuel)
- **Utilisateurs** : 15 maximum
- **Postes** : 100 maximum
- **Candidats par poste** : 1000 maximum
- **Fonctionnalités** :
  - ✅ Opérations groupées
  - ✅ Analyses avancées
  - ✅ Modèles d'emails
  - ❌ Accès API
  - ❌ Personnalisation

#### 🌟 Enterprise - Sur mesure
- **Durée** : 365 jours (renouvellement annuel)
- **Utilisateurs** : Illimité
- **Postes** : Illimité
- **Candidats par poste** : Illimité
- **Fonctionnalités** :
  - ✅ Opérations groupées
  - ✅ Analyses avancées
  - ✅ Modèles d'emails
  - ✅ Accès API
  - ✅ Personnalisation complète

### Gestion des Limites

L'application applique automatiquement les limites de licence :

#### Limites d'Utilisateurs
- Vérification avant l'ajout d'un nouvel utilisateur
- Désactivation du bouton "Ajouter un utilisateur" si limite atteinte
- Message d'erreur explicite : "Limite d'utilisateurs atteinte"

#### Limites de Postes
- Vérification avant la création d'un nouveau poste
- Message d'erreur si limite atteinte
- Suggestion de mise à niveau vers un plan supérieur

#### Limites de Candidats
- Vérification par poste (pas globale)
- Désactivation de l'ajout de candidats si limite atteinte pour ce poste
- Compteur visible dans l'interface

#### Gating de Fonctionnalités
Les fonctionnalités premium sont désactivées/masquées selon le plan :
- **Opérations groupées** : Checkboxes de sélection multiple cachées si indisponible
- **Analyses avancées** : Boutons de comparaison désactivés
- **Modèles d'emails** : Bouton "Emails" masqué si indisponible
- **API** : Endpoints non exposés (fonctionnalité future)
- **Personnalisation** : Options de branding masquées (fonctionnalité future)

### Expiration et Renouvellement

#### Alertes d'Expiration
- **30 jours avant** : Badge orange dans l'onglet Entreprise
- **Message** : "⚠️ Expire dans X jours"
- **Recommandation** : Renouveler avant l'expiration

#### Comportement après Expiration
- **Connexion bloquée** : Message "Licence expirée"
- **Données préservées** : Aucune perte de données
- **Renouvellement** : Contact nécessaire pour réactiver

---

## 👥 Gestion des Utilisateurs

### Rôles et Permissions

#### 👑 Propriétaire (Owner)
- **Créé à l'inscription** de l'entreprise
- **Permissions** :
  - ✅ Créer/supprimer des postes
  - ✅ Ajouter/supprimer des candidats
  - ✅ Générer des questions et analyser
  - ✅ Ajouter/supprimer des utilisateurs
  - ✅ Voir toutes les statistiques d'entreprise
  - ✅ Accès complet à tous les onglets
- **Restrictions** :
  - Un seul propriétaire par entreprise
  - Ne peut pas changer son propre rôle
  - Ne peut pas se supprimer lui-même

#### 🔧 Administrateur (Admin)
- **Créé par** : Propriétaire ou autre Admin
- **Permissions** :
  - ✅ Créer/supprimer des postes
  - ✅ Ajouter/supprimer des candidats
  - ✅ Générer des questions et analyser
  - ✅ Ajouter/supprimer des utilisateurs
  - ✅ Voir toutes les statistiques d'entreprise
  - ❌ Modifier le type de licence
- **Cas d'usage** : Responsables RH, managers de recrutement

#### ✏️ Recruteur (Recruiter)
- **Créé par** : Propriétaire ou Admin
- **Permissions** :
  - ✅ Créer/supprimer des postes
  - ✅ Ajouter/supprimer des candidats
  - ✅ Générer des questions et analyser
  - ✅ Utiliser toutes les fonctionnalités d'évaluation
  - ❌ Ajouter/supprimer des utilisateurs
  - ❌ Voir l'onglet Entreprise
- **Cas d'usage** : Recruteurs opérationnels, chargés de recrutement

#### 👁️ Observateur (Viewer)
- **Créé par** : Propriétaire ou Admin
- **Permissions** :
  - ✅ Voir les postes et candidats
  - ✅ Voir les analyses et scores
  - ✅ Voir l'historique
  - ❌ Créer/modifier/supprimer quoi que ce soit
  - ❌ Générer des questions ou analyses
  - ❌ Ajouter des candidats
- **Cas d'usage** : Direction, stakeholders, auditeurs

### Ajout d'Utilisateurs

**Prérequis** : Être Propriétaire ou Admin

1. **Onglet Entreprise** → "Ajouter un utilisateur"
2. **Formulaire** :
   - Nom complet du nouvel utilisateur
   - Email professionnel (même domaine que l'entreprise)
   - Rôle à attribuer (Admin/Recruteur/Observateur)
3. **Validations** :
   - Email doit contenir @
   - Email doit appartenir au domaine de l'entreprise
   - Email ne doit pas déjà exister dans le système
   - Limite d'utilisateurs de la licence non atteinte
4. **Création** :
   - Nouvel utilisateur ajouté à la base
   - Peut maintenant se connecter avec son email
   - Toast de confirmation

### Liste des Membres

Dans l'**onglet Entreprise** :
- Carte "Membres de l'équipe"
- Liste de tous les utilisateurs de l'entreprise
- Affichage : Nom, Email, Rôle
- Badge visuel : 👑 pour le propriétaire
- Scroll si plus de 5 utilisateurs

---

## 📈 Interface de Gestion d'Entreprise

### Onglet "Entreprise"

Accessible via le 4ème onglet de navigation (icône Buildings).

#### Section 1 : Informations de Licence

**Carte gauche** affiche :
- Nom de l'entreprise
- Email de l'entreprise
- Type de licence (badge coloré)
- Statut : Active ✅ ou Expirée ❌
- Date d'expiration
- Alerte si expiration < 30 jours
- Liste des fonctionnalités :
  - Opérations groupées ✓/✗
  - Analyses avancées ✓/✗
  - Modèles d'emails ✓/✗
  - Accès API ✓/✗
  - Personnalisation ✓/✗

#### Section 2 : Statistiques d'Utilisation

**Carte droite** affiche :
- **Utilisateurs** : X / Y maximum (ou Illimité)
  - Barre de progression visuelle
  - Pourcentage d'utilisation
- **Postes** : X / Y maximum (ou Illimité)
  - Barre de progression visuelle
  - Pourcentage d'utilisation
- **Liste des membres** :
  - Tous les utilisateurs de l'équipe
  - Nom, email, rôle
  - Scroll si liste longue

#### Actions Disponibles

- **Bouton "Ajouter un utilisateur"** (si Propriétaire/Admin)
  - Visible en haut à droite
  - Désactivé si limite atteinte
  - Ouvre un dialog de création

---

## 🔄 Migration et Données

### Données Existantes

Si vous aviez déjà utilisé l'application **avant l'authentification** :
- Les données (postes, candidats) sont **préservées**
- Lors de la première connexion après l'authentification :
  - Créez un compte entreprise
  - Les anciennes données resteront accessibles
  - Recommandé : recréer les postes dans le nouveau système

### Structure des Données

#### Entreprise (Company)
```typescript
{
  id: string
  name: string
  email: string
  createdAt: number
  license: {
    type: 'trial' | 'starter' | 'professional' | 'enterprise'
    maxUsers: number | -1 (illimité)
    maxPositions: number | -1
    maxCandidatesPerPosition: number | -1
    features: {
      bulkOperations: boolean
      advancedAnalytics: boolean
      emailTemplates: boolean
      apiAccess: boolean
      customBranding: boolean
    }
    startDate: number
    expiryDate: number
    isActive: boolean
  }
}
```

#### Utilisateur (User)
```typescript
{
  id: string
  companyId: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'recruiter' | 'viewer'
  createdAt: number
  lastLoginAt?: number
}
```

#### Session (AuthSession)
```typescript
{
  companyId: string
  userId: string
  isAuthenticated: boolean
}
```

---

## 💡 Cas d'Usage Typiques

### Petite Startup (2-3 recruteurs)
- **Licence** : Essai gratuit puis Starter
- **Utilisateurs** : Fondateur (Owner) + 1-2 Recruteurs
- **Usage** : 5-10 postes par an, évaluations rapides
- **Budget** : 49€/mois = coût d'un déjeuner d'équipe

### PME RH (5-10 recruteurs)
- **Licence** : Professional
- **Utilisateurs** : DRH (Owner), RH Managers (Admin), Recruteurs (Recruiter), Direction (Viewer)
- **Usage** : 20-50 postes par an, analyses approfondies
- **Budget** : 149€/mois = rentabilisé sur 1-2 recrutements

### Grande Entreprise / Cabinet de Recrutement
- **Licence** : Enterprise
- **Utilisateurs** : Illimité, équipes multiples
- **Usage** : 100+ postes, workflow complexe, intégrations
- **Budget** : Sur mesure, inclut support premium et API

---

## 🛠️ Administration et Maintenance

### Bonnes Pratiques

1. **Nommage des utilisateurs** : Utilisez les vrais noms pour la traçabilité
2. **Emails professionnels** : Évitez les emails personnels (@gmail, etc.)
3. **Rôles appropriés** : Ne donnez pas Admin à tout le monde
4. **Monitoring des limites** : Vérifiez régulièrement l'onglet Entreprise
5. **Anticipation** : Mettez à niveau AVANT d'atteindre les limites
6. **Renouvellement** : Renouvelez 30 jours avant l'expiration

### Support et Questions

Pour toute question sur :
- Les licences et tarifs
- La migration de données
- Les fonctionnalités Enterprise
- Le support technique

Contactez l'équipe via l'onglet FAQ ou directement par email.

---

## 🚀 Évolutions Futures

### Roadmap B2B

- **Authentification SSO** : Google Workspace, Microsoft 365
- **API complète** : Intégrations avec ATS, Slack, etc.
- **Webhooks** : Notifications automatiques
- **Tableau de bord avancé** : Métriques de recrutement
- **Multi-équipes** : Sous-groupes au sein d'une entreprise
- **White-label** : Personnalisation complète de l'interface
- **Audit logs** : Traçabilité complète des actions
- **RGPD avancé** : Export de données, droit à l'oubli

---

**Dernière mise à jour** : Janvier 2025  
**Version** : 2.0.0 (Enterprise Edition)
