# 🤖 Assistant IA de Recrutement

Un outil intelligent et complet de gestion du recrutement qui utilise l'intelligence artificielle pour analyser les candidatures, attribuer des scores automatiques, générer des questions d'entretien personnalisées et faciliter tout le processus de sélection des candidats.

**🏢 Maintenant disponible pour les entreprises avec système d'authentification, gestion d'équipe et licences professionnelles !**

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [🆕 Système d'authentification entreprise](#-système-dauthentification-entreprise)
- [Fonctionnalités principales](#-fonctionnalités-principales)
- [Guide d'utilisation](#-guide-dutilisation)
- [Fonctionnalités avancées](#-fonctionnalités-avancées)
- [Interface et design](#-interface-et-design)
- [Technologies utilisées](#-technologies-utilisées)
- [🚀 Déploiement et publication](#-déploiement-et-publication)

---

## 🎯 Vue d'ensemble

L'Assistant IA de Recrutement est une application web moderne conçue pour automatiser et optimiser le processus de recrutement. Il permet aux recruteurs de :

- ✅ **S'authentifier en toute sécurité** avec un compte entreprise
- ✅ **Gérer une équipe** de recruteurs avec différents rôles
- ✅ Créer et gérer des postes à pourvoir
- ✅ Analyser automatiquement les CV des candidats (PDF et HTML)
- ✅ Obtenir des scores objectifs basés sur l'IA pour chaque candidat
- ✅ Générer des questions d'entretien techniques personnalisées
- ✅ Évaluer les réponses des candidats avec l'IA
- ✅ Comparer plusieurs candidats côte à côte
- ✅ Gérer un historique complet des recrutements
- ✅ Générer des modèles d'emails professionnels

**🌍 Multilingue** : Interface disponible en français et en anglais  
**🎨 Thèmes** : Mode clair, sombre et automatique (selon les préférences système)  
**📱 Responsive** : Optimisé pour tous les appareils (mobile, tablette, desktop)  
**🔒 Sécurisé** : Authentification par entreprise avec gestion des licences et des utilisateurs

---

## 🆕 Système d'authentification entreprise

### 🏢 Créer un compte entreprise

1. **Accédez à l'application** - vous serez redirigé vers la page de connexion
2. **Cliquez sur "Créer un compte entreprise"**
3. **Remplissez les informations de l'entreprise** :
   - Nom de l'entreprise
   - Email de l'entreprise
4. **Créez votre compte administrateur** :
   - Votre nom complet
   - Votre email professionnel (doit correspondre au domaine de l'entreprise)
5. **Choisissez votre forfait de licence** :
   - **Essai gratuit (14 jours)** : 3 utilisateurs, 5 postes, 50 candidats
   - **Starter (49€/mois)** : 5 utilisateurs, 20 postes, 200 candidats + opérations groupées + emails
   - **Professional (149€/mois)** : 15 utilisateurs, 100 postes, 1000 candidats + analyses avancées
   - **Enterprise (sur mesure)** : Illimité + API + personnalisation
6. **Validez** - votre compte est créé et vous êtes automatiquement connecté

### 🔐 Se connecter

1. **Entrez votre email professionnel**
2. **Connectez-vous** - l'application vérifie :
   - Votre compte utilisateur
   - L'entreprise associée
   - Le statut de la licence (active/expirée)
3. **Accédez à votre espace** - vous voyez uniquement les données de votre entreprise

### 👥 Gérer l'équipe

Propriétaires et administrateurs peuvent ajouter des membres à l'équipe :

1. **Accédez à l'onglet "Entreprise"**
2. **Cliquez sur "Ajouter un utilisateur"**
3. **Remplissez les informations** :
   - Nom du nouvel utilisateur
   - Email professionnel (même domaine que l'entreprise)
   - Rôle à attribuer
4. **Validez** - le nouvel utilisateur peut maintenant se connecter

#### Rôles et permissions

- **👑 Propriétaire** : Accès complet, créé lors de l'inscription, ne peut pas être modifié
- **🔧 Administrateur** : Accès complet sauf modification de licence, peut gérer les utilisateurs
- **✏️ Recruteur** : Peut créer des postes, ajouter des candidats, analyser, générer des questions
- **👁️ Observateur** : Accès en lecture seule, peut consulter mais pas modifier

### 📊 Gestion de la licence

**Onglet Entreprise** affiche :
- **Type de licence** et statut (active/expirée)
- **Date d'expiration** avec alerte 30 jours avant
- **Utilisation actuelle** :
  - Nombre d'utilisateurs vs limite
  - Nombre de postes vs limite
  - Barres de progression visuelles
- **Fonctionnalités disponibles** :
  - ✓ Opérations groupées (Starter+)
  - ✓ Analyses avancées (Professional+)
  - ✓ Modèles d'emails (Starter+)
  - ✓ Accès API (Enterprise uniquement)
  - ✓ Personnalisation (Enterprise uniquement)

### 💳 Système de paiement et abonnement

#### Gestion de l'abonnement

L'onglet **Entreprise** inclut maintenant une section complète de gestion d'abonnement :

- **Statut actuel** : Active, En retard, Expiré, Essai
- **Plan actuel** : Trial, Starter, Professional ou Enterprise
- **Date d'expiration** : Affichage du nombre de jours restants
- **Méthode de paiement** : Carte enregistrée (derniers 4 chiffres)
- **Prochain paiement** : Date et montant du prochain prélèvement
- **Historique des paiements** : Liste des 3 derniers paiements avec montants et statuts

**Bouton "Gérer l'abonnement"** pour accéder à la page de paiement complète.

#### Rappels de paiement automatiques

Le système affiche automatiquement des bannières de rappel :

- **7 jours avant expiration** : Bannière jaune avec option de renouveler
- **3 jours avant expiration** : Bannière orange "Expire bientôt"
- **Paiement en retard** : Bannière rouge avec action immédiate requise
- **Rappels répétés** : Tous les 2 jours si la bannière est ignorée

Les rappels peuvent être temporairement ignorés mais réapparaissent automatiquement.

#### Page de paiement

Accessible via "Gérer l'abonnement", permet de :

1. **Choisir un plan** :
   - Trial (gratuit, 14 jours)
   - Starter (€49/mois ou €490/an)
   - Professional (€149/mois ou €1,490/an - Populaire)
   - Enterprise (€499/mois ou €4,990/an)

2. **Sélectionner le cycle de facturation** :
   - Mensuel
   - Annuel (économisez 17% - 2 mois gratuits)

3. **Voir les fonctionnalités incluses** pour chaque plan

4. **Entrer les informations de paiement** :
   - Numéro de carte
   - Date d'expiration (MM/AA)
   - Code CVC
   - Nom sur la carte

5. **Traiter le paiement** :
   - Intégration Stripe (simulée en développement)
   - Confirmation instantanée
   - Mise à jour automatique de l'abonnement
   - Enregistrement dans l'historique

#### Page de blocage (abonnement expiré)

Quand l'abonnement expire ou le paiement est en retard :

- **Blocage complet** : Impossible d'accéder aux fonctionnalités
- **Page dédiée** affichant :
  - Statut de l'abonnement (expiré/retard)
  - Date d'expiration
  - Plan actuel
  - Liste des fonctionnalités bloquées
  - Bouton prominent "Renouveler maintenant"
  - Option de contact support
- **Restauration immédiate** après paiement réussi

#### Prix des abonnements

| Plan | Mensuel | Annuel | Utilisateurs | Postes | Candidats | Fonctionnalités |
|------|---------|---------|--------------|--------|-----------|-----------------|
| **Trial** | Gratuit | - | 3 | 5 | 50 | Basiques |
| **Starter** | €49 | €490 | 5 | 20 | 200 | + Bulk, Emails |
| **Professional** | €149 | €1,490 | 15 | 100 | 1000 | + Analytics |
| **Enterprise** | €499 | €4,990 | ∞ | ∞ | ∞ | + API, Branding |

#### Fonctionnalités de test (Propriétaire uniquement)

Dans l'onglet Entreprise, les propriétaires voient une carte de debug pour tester :
- **Expirer l'abonnement** : Simule une expiration immédiate
- **Restaurer l'abonnement** : Renouvelle pour 1 an
- Utile pour tester les rappels et la page de blocage

---
  - ✓ Accès API (Enterprise)
  - ✓ Personnalisation (Enterprise)

**Limites appliquées automatiquement** :
- Impossible d'ajouter plus d'utilisateurs que la limite
- Impossible de créer plus de postes que la limite
- Impossible d'ajouter plus de candidats par poste que la limite
- Fonctionnalités premium désactivées selon le forfait
- Connexion bloquée si licence expirée

### 🚪 Se déconnecter

1. **Cliquez sur votre nom** en haut à droite
2. **Sélectionnez "Déconnexion"**
3. Vous êtes redirigé vers la page de connexion

---

## ⭐ Fonctionnalités principales

### 1. 📝 Gestion des postes

#### Créer un nouveau poste
- Cliquez sur le bouton **"Nouveau Poste"** dans l'onglet Postes
- Remplissez les informations :
  - **Titre du poste** : ex. "Développeur Full-Stack Senior"
  - **Description** : détails sur le rôle, l'équipe, les responsabilités
  - **Exigences** : compétences techniques requises, années d'expérience, diplômes
  - **Nombre de postes** : combien de personnes vous souhaitez recruter
- Validez pour créer le poste

#### Gérer les postes existants
- **Voir les détails** : Cliquez sur une carte de poste pour voir tous les candidats
- **Archiver** : Utilisez l'icône d'archive pour masquer un poste sans le supprimer
- **Supprimer** : Supprimez définitivement un poste (avec annulation possible dans les 5 secondes)
- **Restaurer** : Les postes archivés peuvent être réactivés depuis l'historique

### 2. 👥 Ajout et analyse des candidats

#### Ajouter un candidat
1. Sélectionnez un poste
2. Cliquez sur **"Ajouter un candidat"**
3. Deux options disponibles :
   - **Télécharger un fichier** : PDF ou HTML contenant le CV
   - **Coller le texte** : Copier-coller les informations du candidat
4. Remplissez le nom du candidat
5. Cliquez sur **"Analyser avec l'IA"**

#### Analyse automatique par IA
Lorsqu'un candidat est soumis, l'IA analyse automatiquement :
- ✨ **Score global** (0-100) : évaluation objective de l'adéquation au poste
- 💪 **Forces** : points forts du candidat par rapport aux exigences
- ⚠️ **Faiblesses** : lacunes ou domaines d'amélioration
- 📊 **Moyenne** : score moyen du candidat affiché près de son rang
- 🔄 **Classement automatique** : les candidats sont triés du meilleur au moins bon score

#### Import de fichiers
- **Formats supportés** : PDF et HTML uniquement
- **Extraction automatique** : le texte est extrait et analysé par l'IA
- **Taille recommandée** : fichiers CV standards (1-5 pages)
- **⚡ Optimisation intelligente des CV volumineux** :
  - Les CV trop longs sont automatiquement optimisés pour éviter les erreurs de limite de tokens
  - Le système extrait et priorise les sections les plus pertinentes :
    - 🎯 Profil et résumé professionnel
    - 💼 Compétences techniques
    - 📋 Expérience professionnelle
    - 🎓 Formation et diplômes
  - Les informations non essentielles sont filtrées (métadonnées PDF, formatage excessif)
  - Garantit une analyse rapide et précise même pour les CVs de plusieurs pages
  - Message informatif affiché lors de l'upload pour informer l'utilisateur

### 3. 🎯 Classement et gestion des candidats

#### Visualisation du classement
- Les candidats sont **automatiquement classés** par score décroissant
- **Score moyen** affiché à côté du rang de chaque candidat
- **Badges visuels** :
  - 🥇 Position #1, #2, #3 avec couleurs distinctives
  - 🎯 Seuils de score personnalisables

#### Organisation personnalisée avec presets
L'application offre un système de classement personnalisé très puissant :

- **Réorganisation par glisser-déposer** : Cliquez et maintenez sur une carte de candidat, puis faites-la glisser pour changer l'ordre
- **Créer des presets** : Sauvegardez vos classements personnalisés avec un nom
  - Cliquez sur **"Gérer les presets"**
  - Organisez les candidats dans l'ordre souhaité
  - Cliquez sur **"Sauvegarder comme preset"**
  - Donnez un nom explicite (ex. "Candidats pour entretien final", "Priorité compétences techniques")
- **Appliquer des presets** : Restaurez instantanément un classement sauvegardé
- **Indicateur visuel** : Le preset actif est mis en évidence
- **Multiples presets** : Créez autant de classements que nécessaire (par critère, par étape du processus, etc.)

**Cas d'usage** :
- Créer un preset "Score IA" (ordre par défaut)
- Créer un preset "Priorisation RH" (après entretiens téléphoniques)
- Créer un preset "Décision finale" (après entretiens techniques)
- Créer un preset "Meilleurs soft skills" (classement subjectif)

#### Gestion en masse
- **Sélection multiple** : Cochez les cases pour sélectionner plusieurs candidats
- **Suppression groupée** : Supprimez plusieurs candidats en une fois
- **Annulation** : Un bouton "Annuler" apparaît pendant 5 secondes après toute suppression

#### Filtres et recherche
- Filtrez par période (date de soumission)
- Recherchez par nom de candidat
- Filtrez par statut (actifs, archivés)

### 4. 💬 Questions d'entretien techniques

#### Génération de questions
- Cliquez sur **"Générer des questions"** sur la carte d'un candidat
- L'IA crée **6 à 8 questions techniques personnalisées** :
  - Basées sur le profil du candidat
  - Adaptées au poste visé
  - **Uniquement techniques** : pas de questions comportementales ou sociales
  - Ciblées sur les compétences à vérifier

**Types de questions générées** :
- Questions sur l'expérience technique spécifique
- Problèmes de résolution technique
- Questions sur les technologies mentionnées dans le CV
- Vérification de la profondeur des connaissances techniques

#### Enregistrement des réponses
1. Cliquez sur **"Répondre"** à côté d'une question
2. Saisissez la réponse complète du candidat (pendant l'entretien)
3. Cliquez sur **"Sauvegarder la réponse"**

#### Évaluation des réponses par IA
Après avoir enregistré une réponse :
1. Cliquez sur **"Évaluer la réponse"**
2. L'IA analyse la réponse et fournit :
   - **Score technique** (0-100) pour la profondeur
   - **Score de précision** (0-100) pour l'exactitude
   - **Score de complétude** (0-100) pour l'exhaustivité
   - **Feedback détaillé** : points forts et axes d'amélioration
   - **Suggestions** : ce qui manque ou pourrait être approfondi

#### Questions de suivi intelligentes
Après avoir évalué une réponse :
1. Cliquez sur **"Générer des questions de suivi"**
2. L'IA crée **3 à 5 nouvelles questions techniques** qui :
   - Approfondissent la réponse initiale du candidat
   - Testent la compréhension au-delà du niveau superficiel
   - Explorent les cas limites ou détails d'implémentation
   - Vérifient la cohérence des connaissances techniques

**Avantages** :
- Permet d'explorer en profondeur chaque sujet
- Adaptatif selon la qualité de la réponse initiale
- Évite les questions génériques
- Crée un entretien technique dynamique et approfondi

### 5. 📊 Comparaison de candidats

#### Comparer les scores
- Cliquez sur **"Comparer les candidats"** dans la vue détaillée du poste
- Sélectionnez 2 à 4 candidats à comparer
- Visualisez côte à côte :
  - Scores globaux
  - Scores des réponses aux questions d'entretien
  - Comparaison des évaluations techniques
  - Moyennes et statistiques

#### Tableau de comparaison
- **Vue synthétique** : tous les scores alignés dans un tableau
- **Codage couleur** : identification rapide des meilleurs/moins bons scores
- **Export possible** : copiez les données pour vos rapports

### 6. 📧 Génération d'emails professionnels

L'application peut générer automatiquement des emails professionnels pour communiquer avec les candidats et les responsables du recrutement.

#### Types d'emails disponibles
1. **Email de présélection** (pour les responsables RH)
   - Résumé des meilleurs candidats
   - Scores et points de données clés
   - Analyses et recommandations

2. **Invitation à un entretien** (pour les candidats)
   - Ton accueillant et professionnel
   - Détails sur la prochaine étape
   - Informations pratiques

3. **Email de refus** (pour les candidats)
   - Ton respectueux et encourageant
   - Remerciements pour la candidature
   - Message positif

#### Comment générer des emails
1. Ouvrez la vue détaillée d'un poste
2. Cliquez sur **"Emails"**
3. **Sélectionnez les candidats** :
   - Cochez individuellement les candidats
   - Ou utilisez les raccourcis "Top 3", "Top 5", "Top 10"
4. **Choisissez le type d'email** dans le menu déroulant
5. **(Optionnel)** Ajoutez des instructions personnalisées pour l'IA
6. Cliquez sur **"Générer les emails"**
7. **Prévisualisez** tous les emails générés
8. **Copiez** chaque email individuellement avec le bouton de copie
9. Collez dans votre client email

**Fonctionnalités** :
- ✅ Génération en masse (plusieurs candidats à la fois)
- ✅ Personnalisation par candidat (scores, forces, faiblesses)
- ✅ Bilingue (français et anglais selon la langue de l'interface)
- ✅ Instructions personnalisées pour adapter le ton/contenu
- ✅ Copie en un clic vers le presse-papiers

### 7. 🔄 Suggestions de postes alternatifs

#### Redirection intelligente
- Pour les candidats avec un **bon profil mais qui ne correspondent pas parfaitement** au poste
- L'IA suggère automatiquement **d'autres postes ouverts** qui pourraient mieux convenir
- **Explication de l'adéquation** : pourquoi le candidat serait mieux pour cet autre poste

#### Réaffectation de candidats
- Possibilité de déplacer un candidat vers un autre poste
- Conservation de toutes les données d'analyse
- Évite de perdre de bons candidats

### 8. 📚 Historique et archives

#### Onglet Historique
Accédez à l'historique complet de tous vos recrutements :
- **Tous les postes** : actifs, archivés et fermés
- **Tous les candidats** : avec leurs scores et analyses
- **Filtres avancés** :
  - Par période (sélection de plage de dates)
  - Par nom de poste
  - Par nom de candidat
  - Par statut (actifs uniquement / archivés uniquement)
- **Recherche** : recherche textuelle dans les postes et candidats

#### Gestion des archives
- **Archiver un poste** : Masque le poste des vues actives sans perdre les données
- **Voir les archives** : Bouton dédié pour afficher uniquement les postes archivés
- **Restaurer** : Réactivez un poste archivé en un clic
- **Conservation** : Toutes les données sont conservées indéfiniment

#### Analyse rétrospective
- Consultez les décisions passées
- Récupérez les analyses de candidats précédents
- Apprenez des recrutements précédents

---

## 🚀 Guide d'utilisation

### Workflow complet de recrutement

#### Étape 1 : Créer le poste
```
1. Cliquez sur "Nouveau Poste"
2. Entrez : Titre, Description, Exigences, Nombre de postes
3. Sauvegardez
```

#### Étape 2 : Ajouter les candidats
```
1. Cliquez sur le poste créé
2. Cliquez sur "Ajouter un candidat"
3. Téléchargez le CV (PDF/HTML) ou collez les informations
4. Entrez le nom du candidat
5. Cliquez sur "Analyser avec l'IA"
6. Répétez pour chaque candidat
```

#### Étape 3 : Examiner les classements
```
1. Les candidats sont automatiquement classés par score
2. Consultez les scores, forces et faiblesses
3. Identifiez les meilleurs candidats
4. (Optionnel) Réorganisez manuellement par glisser-déposer
5. (Optionnel) Sauvegardez votre classement comme preset
```

#### Étape 4 : Préparer les entretiens
```
1. Pour chaque candidat sélectionné, cliquez sur "Générer des questions"
2. Obtenez 6-8 questions techniques personnalisées
3. Utilisez-les pendant l'entretien
4. Enregistrez les réponses du candidat en temps réel
```

#### Étape 5 : Évaluer les entretiens
```
1. Après l'entretien, cliquez sur "Évaluer la réponse" pour chaque question
2. Obtenez des scores automatiques (profondeur, précision, complétude)
3. Consultez le feedback détaillé de l'IA
4. (Optionnel) Générez des questions de suivi pour approfondir
```

#### Étape 6 : Comparer et décider
```
1. Cliquez sur "Comparer les candidats"
2. Sélectionnez 2-4 candidats finalistes
3. Comparez les scores d'entretien côte à côte
4. Prenez votre décision finale
```

#### Étape 7 : Communiquer les résultats
```
1. Cliquez sur "Emails"
2. Sélectionnez les candidats retenus → Générez des invitations
3. Sélectionnez les candidats refusés → Générez des emails de refus
4. Sélectionnez le top 5 → Générez un email de synthèse pour le manager
5. Copiez et envoyez les emails
```

#### Étape 8 : Archiver
```
1. Une fois le recrutement terminé, archivez le poste
2. Les données restent accessibles dans l'historique
3. Possibilité de restaurer si nécessaire
```

---

## 🎨 Interface et design

### Thèmes disponibles
L'application supporte trois modes de thème :

- **☀️ Mode Clair** : Interface lumineuse avec fond blanc/bleu très clair
- **🌙 Mode Sombre** : Interface sombre pour réduire la fatigue oculaire
- **💻 Mode Système** : S'adapte automatiquement aux préférences de votre appareil

**Changer de thème** : Cliquez sur l'icône soleil/lune en haut à droite

### Langues disponibles
- **🇫🇷 Français** : Interface complète en français, analyses IA en français
- **🇬🇧 English** : Interface complète en anglais, analyses IA en anglais

**Changer de langue** : Cliquez sur l'icône globe 🌍 en haut à droite

### Design responsive
- **📱 Mobile** : Interface optimisée pour téléphones (< 768px)
  - Navigation simplifiée
  - Cartes empilées verticalement
  - Contrôles tactiles agrandis
  
- **📱 Tablette** : Mise en page adaptative (768px - 1024px)
  - Grille à 2 colonnes
  - Barre latérale rétractable
  
- **💻 Desktop** : Expérience complète (> 1024px)
  - Grille à 3 colonnes
  - Toutes les fonctionnalités visibles
  - Comparaisons côte à côte

### Animations
L'interface inclut des animations subtiles et professionnelles :
- ✨ Transitions fluides entre les vues (300ms)
- 🎯 Effet de survol sur les cartes interactives
- 📊 Animations de chargement pendant les analyses IA
- 🎭 Feedback visuel pour toutes les actions utilisateur
- ⚡ Effet de glisser-déposer pour la réorganisation

---

## 🔧 Fonctionnalités avancées

### Annulation des actions (Undo)
- **5 secondes** pour annuler après :
  - Suppression d'un candidat
  - Suppression de plusieurs candidats
  - Suppression d'un poste
  - Archivage d'un poste
- Une notification toast apparaît avec le bouton "Annuler"
- Fonctionne même après navigation entre les vues

### Persistance des données
- **Stockage local** : Toutes les données sont sauvegardées dans votre navigateur
- **Pas de serveur** : Vos données restent privées et locales
- **Pas de compte requis** : Utilisez l'application immédiatement
- **Conservation permanente** : Les données persistent entre les sessions

### Performance
- **Chargement rapide** : Interface réactive et optimisée
- **Analyses IA** : Temps de réponse généralement < 5 secondes
- **Gestion mémoire** : Support de centaines de candidats sans ralentissement

### Accessibilité
- **Navigation au clavier** : Tous les contrôles sont accessibles au clavier
- **Contraste élevé** : Ratios de contraste WCAG AA respectés
- **Focus visible** : Indicateurs clairs pour la navigation au clavier
- **Tailles de cible** : Boutons et contrôles suffisamment grands (44×44px minimum)

---

## 💡 Technologies utilisées

### Frontend
- **React 19** avec TypeScript
- **Tailwind CSS 4** pour le styling
- **Framer Motion** pour les animations
- **shadcn/ui** pour les composants UI

### Composants UI
- Dialogues et modales (Radix UI)
- Boutons et formulaires
- Cartes et badges
- Onglets et accordéons
- Zones de défilement
- Notifications toast (Sonner)

### IA et traitement
- **Spark LLM API** : Analyse de CV, génération de questions, évaluation de réponses
- **Extraction de texte** : Support PDF et HTML
- **Modèles** : GPT-4o et GPT-4o-mini

### Icônes
- **Phosphor Icons** : Bibliothèque d'icônes moderne et cohérente

### Fonctionnalités React
- **useKV** : Hook de persistance de données local
- **useState/useEffect** : Gestion d'état
- **React Hook Form** : Gestion de formulaires
- **Drag and Drop** : DnD Kit pour la réorganisation

---

## 📖 Conseils d'utilisation

### ✅ Bonnes pratiques

**Pour les descriptions de postes** :
- Soyez précis sur les compétences techniques requises
- Listez les technologies spécifiques (frameworks, langages, outils)
- Indiquez le niveau d'expérience attendu
- Mentionnez les certifications si pertinentes

**Pour l'import de CV** :
- Privilégiez les PDF structurés plutôt que les images scannées
- Les CV HTML fonctionnent très bien
- Assurez-vous que le texte est sélectionnable dans le PDF
- Les CV de 1-3 pages donnent les meilleurs résultats

**Pour les questions d'entretien** :
- Générez les questions après avoir analysé tous les candidats
- Prenez des notes détaillées des réponses pendant l'entretien
- Évaluez les réponses rapidement après l'entretien
- Utilisez les questions de suivi pour creuser les points importants

**Pour la comparaison** :
- Comparez maximum 4 candidats à la fois pour rester lisible
- Utilisez les presets pour sauvegarder différentes vues
- Créez un preset "Score IA" et un preset "Score humain" pour combiner objectivité et subjectivité

### ⚠️ Limitations

- **Formats de fichiers** : Seuls PDF et HTML sont supportés (pas de .docx, .jpg, .png)
- **Taille des fichiers** : Recommandé < 5 MB par fichier
- **Analyses IA** : Nécessite une connexion internet active
- **Données locales** : Les données sont stockées localement (effacées si vous nettoyez le navigateur)
- **Pas de synchronisation** : Les données ne sont pas synchronisées entre appareils

### 🆘 Résolution de problèmes

**"Erreur lors de l'analyse du candidat"**
- Vérifiez votre connexion internet
- Assurez-vous que le CV contient du texte lisible
- Essayez de réduire la taille du fichier
- Réessayez après quelques secondes

**Les questions ne se génèrent pas**
- Vérifiez que le candidat a bien été analysé (score visible)
- Actualisez la page et réessayez
- Vérifiez votre connexion internet

**Le glisser-déposer ne fonctionne pas**
- Assurez-vous de maintenir le clic pendant le déplacement
- Essayez sur un écran plus grand (pas optimal sur très petit mobile)
- Actualisez la page si le problème persiste

**Les données ont disparu**
- Vérifiez que vous n'avez pas nettoyé les données du navigateur
- Les données sont liées au navigateur et au domaine
- Utilisez toujours le même navigateur pour accéder à vos données

---

## 🎓 Cas d'usage

### Startup tech recrute développeurs
1. Créer des postes pour "Dev Frontend React", "Dev Backend Node.js", "Dev Full-Stack"
2. Importer 50 CV reçus par email (PDF)
3. Laisser l'IA scorer automatiquement tous les candidats
4. Créer un preset "Top 10 Frontend" et un preset "Top 10 Backend"
5. Générer les questions pour les 20 meilleurs
6. Comparer les 5 finalistes avec les scores d'entretien
7. Envoyer les emails d'invitation/refus

### Cabinet de recrutement
1. Créer plusieurs postes pour différents clients
2. Analyser les candidatures au fur et à mesure
3. Utiliser l'historique pour retrouver d'anciens candidats pour de nouveaux postes
4. Générer des synthèses email pour les clients avec les meilleurs profils
5. Archiver les postes pourvus tout en gardant les données

### Équipe RH grande entreprise
1. Créer un poste avec 100 candidatures
2. Utiliser les scores IA pour présélectionner le top 20
3. Générer les questions techniques pour chacun
4. Organiser les entretiens en plusieurs vagues
5. Utiliser les presets pour suivre l'évolution ("Round 1", "Round 2", "Finalistes")
6. Comparer les scores d'entretien pour la décision finale
7. Archiver avec tout l'historique pour audit futur

---

## 📝 Notes importantes

### Confidentialité et sécurité
- ✅ **Authentification sécurisée** : Système de connexion par entreprise avec mots de passe hashés
- ✅ **Isolation des données** : Chaque entreprise accède uniquement à ses propres données
- ✅ **Stockage sécurisé** : Données stockées via Spark KV avec chiffrement
- ✅ **Analyses IA** : Les CV sont traités par l'API LLM de GitHub Spark de manière sécurisée
- ✅ **RGPD compliant** : Respect de la confidentialité et protection des données personnelles

### Support
Cette application est un outil d'aide à la décision. Les scores et analyses IA sont des suggestions pour faciliter votre travail, mais la décision finale de recrutement vous appartient toujours.

---

## 🚀 Déploiement et publication

### Déployer votre application

Cette application est conçue pour être déployée avec **GitHub Spark**, ce qui permet un déploiement simple et rapide.

#### Guide rapide

```bash
# 1. Vérifiez que tout fonctionne
npm run build

# 2. Commitez et poussez vos changements
git add .
git commit -m "Ready for production"
git push origin main

# 3. Dans l'interface Spark, cliquez sur "Deploy" ou "Publish"
```

✅ Votre application sera en ligne sur `votre-app.spark.github.io`

#### Ajouter un nom de domaine personnalisé

1. **Achetez un nom de domaine** (ex: Namecheap, OVH, Gandi)
2. **Configurez le domaine dans Spark** (Settings → Custom Domain)
3. **Ajoutez les enregistrements DNS** fournis par Spark
4. **Activez HTTPS** après propagation DNS (1-2h)

#### Documentation complète

Pour des instructions détaillées sur le déploiement, consultez :

- 📘 **[DEPLOIEMENT_RAPIDE.md](./DEPLOIEMENT_RAPIDE.md)** - Guide en 3 étapes
- 📗 **[GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)** - Documentation complète avec:
  - Configuration DNS détaillée
  - Mise en place HTTPS/SSL
  - Gestion des domaines personnalisés
  - Dépannage et support
  - Checklist pré-déploiement
  - Monitoring et maintenance

### Caractéristiques techniques du déploiement

- ✅ **HTTPS automatique** avec certificats Let's Encrypt
- ✅ **CDN global** pour performances optimales
- ✅ **Déploiement continu** depuis GitHub
- ✅ **Mises à jour instantanées** via git push
- ✅ **API LLM intégrée** (GPT-4o, GPT-4o-mini)
- ✅ **Stockage persistant** via Spark KV
- ✅ **Zéro configuration** d'infrastructure

---

## 🚀 Démarrage rapide

1. **Créez un compte entreprise** avec le bouton "Créer un compte"
2. **Choisissez votre licence** selon vos besoins
3. **Connectez-vous** avec vos identifiants
4. **Créez votre premier poste** avec le bouton "Nouveau Poste"
5. **Ajoutez des candidats** en téléchargeant leurs CV
6. **Laissez l'IA analyser** et voir les scores apparaître
7. **Explorez les fonctionnalités** : questions, comparaisons, emails, dashboard

---

**Bonne utilisation ! 🎉**

Pour toute question ou suggestion d'amélioration, n'hésitez pas à contribuer au projet.
