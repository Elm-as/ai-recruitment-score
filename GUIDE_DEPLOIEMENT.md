# 🚀 Guide de Déploiement - AI Recruitment Assistant

## 📋 Table des matières

1. [Introduction](#introduction)
2. [Prérequis](#prérequis)
3. [Options de déploiement](#options-de-déploiement)
4. [Déploiement avec GitHub Spark](#déploiement-avec-github-spark)
5. [Déploiement avec nom de domaine personnalisé](#déploiement-avec-nom-de-domaine-personnalisé)
6. [Configuration DNS](#configuration-dns)
7. [Configuration HTTPS/SSL](#configuration-httpsssl)
8. [Variables d'environnement](#variables-denvironnement)
9. [Maintenance et mises à jour](#maintenance-et-mises-à-jour)
10. [Dépannage](#dépannage)

---

## Introduction

Ce guide vous accompagne dans le déploiement de votre plateforme AI Recruitment Assistant. L'application utilise **GitHub Spark**, une plateforme qui simplifie considérablement le déploiement et l'hébergement.

### Architecture technique
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend/API**: GitHub Spark Runtime (inclut LLM API, KV storage, auth)
- **Stockage**: Spark KV (key-value store intégré)

---

## Prérequis

### Compte GitHub
- Un compte GitHub actif
- Accès à GitHub Spark (disponible en beta)

### Outils nécessaires
- Git installé localement
- Node.js 18+ et npm
- Un éditeur de code (VS Code recommandé)

### Pour nom de domaine personnalisé
- Un nom de domaine acheté (ex: GoDaddy, Namecheap, OVH, Gandi)
- Accès au panneau de configuration DNS du domaine

---

## Options de déploiement

### Option 1: Déploiement Spark (Recommandé)
✅ Le plus simple et rapide  
✅ Hébergement gratuit/inclus  
✅ HTTPS automatique  
✅ Mises à jour instantanées  
✅ Peut être lié à un domaine personnalisé  

### Option 2: Hébergement externe avec Vercel/Netlify
⚠️ Nécessite des adaptations  
⚠️ Perte des fonctionnalités Spark (LLM, KV)  
⚠️ Coûts d'hébergement supplémentaires  

**Recommandation**: Utilisez le déploiement Spark natif pour bénéficier de toutes les fonctionnalités.

---

## Déploiement avec GitHub Spark

### Étape 1: Vérifier que le projet est prêt

```bash
# Assurez-vous que toutes les dépendances sont installées
npm install

# Testez le build local
npm run build

# Si le build échoue, corrigez les erreurs avant de continuer
```

### Étape 2: Commit et push du code

```bash
# Vérifiez l'état de votre dépôt
git status

# Ajoutez tous les fichiers modifiés
git add .

# Créez un commit avec un message descriptif
git commit -m "Production ready: AI Recruitment Assistant v1.0"

# Poussez vers GitHub
git push origin main
```

### Étape 3: Déploiement via GitHub Spark

#### Via l'interface Spark
1. Ouvrez votre projet dans GitHub Spark
2. Cliquez sur le bouton **"Deploy"** ou **"Publish"** dans l'interface
3. Spark va automatiquement:
   - Builder l'application
   - Créer un environnement de production
   - Générer une URL publique (format: `your-app-name.spark.github.io`)

#### Vérification du déploiement
- Attendez la fin du build (généralement 1-3 minutes)
- Visitez l'URL fournie
- Testez toutes les fonctionnalités clés:
  - ✅ Authentification
  - ✅ Création de postes
  - ✅ Upload de CV
  - ✅ Analyse IA
  - ✅ Exportation PDF
  - ✅ Dashboard

### Étape 4: Configuration post-déploiement

#### Vérifier les permissions Spark
Assurez-vous que votre application a accès à:
- ✅ Spark LLM API (gpt-4o, gpt-4o-mini)
- ✅ Spark KV Storage (pour la persistance des données)
- ✅ Spark User API (pour l'authentification)

Ces permissions sont généralement activées par défaut dans un projet Spark.

---

## Déploiement avec nom de domaine personnalisé

### Étape 1: Acheter un nom de domaine

#### Registrars recommandés
- **Namecheap** (recommandé pour débutants)
- **Google Domains** / **Squarespace Domains**
- **OVH** (Europe)
- **Gandi** (Europe)
- **GoDaddy**

**Coût**: 10-30€/an selon l'extension (.com, .fr, .io, etc.)

### Étape 2: Configurer le domaine dans Spark

#### Via l'interface GitHub Spark
1. Accédez aux **Settings** de votre Spark
2. Naviguez vers **Custom Domain**
3. Entrez votre nom de domaine: `votredomaine.com`
4. Spark va générer les enregistrements DNS nécessaires

#### Exemple de configuration
```
Type: CNAME
Host: www
Value: your-app-name.spark.github.io
TTL: 3600
```

### Étape 3: Configuration DNS chez votre registrar

#### Exemple avec Namecheap
1. Connectez-vous à Namecheap
2. Allez dans **Domain List** > Sélectionnez votre domaine
3. Cliquez sur **Manage** > **Advanced DNS**
4. Ajoutez les enregistrements suivants:

```
Type          Host    Value                              TTL
CNAME         www     your-app-name.spark.github.io      Automatic
A Record      @       185.199.108.153                    Automatic
A Record      @       185.199.109.153                    Automatic
A Record      @       185.199.110.153                    Automatic
A Record      @       185.199.111.153                    Automatic
```

⚠️ **Note**: Remplacez les IPs ci-dessus par celles fournies par GitHub Spark.

#### Exemple avec OVH
1. Connectez-vous à l'espace client OVH
2. Allez dans **Web Cloud** > **Noms de domaine**
3. Sélectionnez votre domaine > **Zone DNS**
4. Cliquez sur **Ajouter une entrée**
5. Ajoutez les mêmes enregistrements que ci-dessus

#### Exemple avec Gandi
1. Connectez-vous à Gandi
2. Allez dans **Noms de domaine** > Sélectionnez votre domaine
3. Cliquez sur **Enregistrements DNS**
4. Ajoutez les enregistrements nécessaires

### Étape 4: Vérification de la propagation DNS

La propagation DNS peut prendre de **10 minutes à 48 heures** (généralement 1-4 heures).

#### Vérifier la propagation
```bash
# Vérifier le CNAME
dig www.votredomaine.com CNAME

# Vérifier les A Records
dig votredomaine.com A

# Ou utilisez un outil en ligne
# https://dnschecker.org
```

#### Outils de vérification en ligne
- https://dnschecker.org
- https://www.whatsmydns.net
- https://mxtoolbox.com/SuperTool.aspx

---

## Configuration DNS

### Configuration minimale requise

#### Pour `www.votredomaine.com`
```
Type: CNAME
Host: www
Value: your-app-name.spark.github.io
TTL: 3600
```

#### Pour `votredomaine.com` (apex/root)
```
Type: A
Host: @
Value: [IP fournie par GitHub Spark]
TTL: 3600
```

### Configuration avancée

#### Redirection www vers non-www (ou inverse)
Configurez dans les paramètres de votre registrar ou ajoutez:
```
Type: URL Redirect
Host: votredomaine.com
Value: https://www.votredomaine.com
Type: Permanent (301)
```

#### Sous-domaines additionnels
```
Type: CNAME
Host: app
Value: your-app-name.spark.github.io
TTL: 3600
```
Accessible via: `app.votredomaine.com`

---

## Configuration HTTPS/SSL

### Certificat SSL automatique avec GitHub Spark

GitHub Spark fournit **automatiquement** des certificats SSL via **Let's Encrypt**.

#### Étapes d'activation
1. Une fois le DNS propagé, retournez dans Spark Settings
2. Allez dans **Custom Domain** > **SSL/TLS**
3. Cliquez sur **Enable HTTPS**
4. Attendez 5-10 minutes pour la génération du certificat

#### Vérification HTTPS
- Visitez `https://votredomaine.com`
- Vérifiez que le cadenas 🔒 apparaît dans la barre d'adresse
- Cliquez sur le cadenas pour voir les détails du certificat

### Forcer HTTPS
Activez le redirect HTTP → HTTPS dans les paramètres Spark:
```
Settings > Custom Domain > Force HTTPS: ON
```

---

## Variables d'environnement

### Variables Spark (gérées automatiquement)

Les variables suivantes sont gérées par le runtime Spark:
- `SPARK_LLM_API_KEY` - Clé API pour les modèles LLM
- `SPARK_KV_ENDPOINT` - Endpoint du stockage KV
- `SPARK_USER_API` - API d'authentification utilisateur

**Vous n'avez rien à configurer manuellement.**

### Variables d'application (optionnelles)

Si vous souhaitez ajouter des variables personnalisées:

1. Créez un fichier `.env.production` (à la racine)
```env
VITE_APP_NAME="AI Recruitment Assistant"
VITE_COMPANY_EMAIL="support@votredomaine.com"
VITE_MAX_FILE_SIZE_MB=10
```

2. Accédez-y dans le code:
```typescript
const appName = import.meta.env.VITE_APP_NAME
```

⚠️ **Sécurité**: Ne stockez JAMAIS de clés secrètes dans les variables `VITE_*` (elles sont exposées côté client).

---

## Maintenance et mises à jour

### Déploiement de mises à jour

#### Méthode 1: Via Git (Recommandé)
```bash
# Faites vos modifications
git add .
git commit -m "feat: amélioration du dashboard"
git push origin main

# Spark redéploie automatiquement
```

#### Méthode 2: Via l'interface Spark
1. Modifiez les fichiers dans l'éditeur Spark
2. Cliquez sur **Deploy** / **Publish**
3. Attendez la fin du build

### Gestion des versions

#### Créer une release
```bash
# Tag de version
git tag -a v1.0.0 -m "Version 1.0.0 - Production"
git push origin v1.0.0
```

#### Rollback en cas de problème
```bash
# Revenez à une version antérieure
git revert HEAD
git push origin main

# Ou revenez à un tag spécifique
git checkout v1.0.0
git push origin main --force
```

### Monitoring et logs

#### Via GitHub Spark Dashboard
- Accédez à **Analytics** dans Spark
- Consultez:
  - Nombre de visites
  - Erreurs runtime
  - Utilisation API LLM
  - Stockage KV utilisé

#### Logs d'erreurs côté client
Ajoutez un service de monitoring (optionnel):
- **Sentry** (recommandé)
- **LogRocket**
- **Bugsnag**

---

## Dépannage

### Problème 1: Le site ne se charge pas

#### Symptômes
- Page blanche
- Erreur 404
- "Site not found"

#### Solutions
```bash
# 1. Vérifiez que le build a réussi
npm run build

# 2. Vérifiez les logs Spark
# Ouvrez Spark Dashboard > Deployments > Voir les logs

# 3. Vérifiez le DNS
dig www.votredomaine.com

# 4. Videz le cache du navigateur
Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
```

### Problème 2: DNS ne se propage pas

#### Solutions
1. **Patience**: Attendez jusqu'à 48h (généralement 1-4h)
2. **Vérifiez la configuration**: Utilisez https://dnschecker.org
3. **Contactez votre registrar**: Support technique du fournisseur
4. **TTL trop élevé**: Réduisez le TTL à 300-3600 secondes

### Problème 3: HTTPS ne fonctionne pas

#### Solutions
1. Attendez 10-15 minutes après activation HTTPS
2. Vérifiez que DNS est bien propagé (requis pour SSL)
3. Dans Spark Settings: Désactivez puis réactivez HTTPS
4. Videz le cache: `chrome://net-internals/#sockets` > Flush

### Problème 4: L'analyse IA ne fonctionne pas

#### Symptômes
- Erreur "LLM request failed"
- Timeout lors de l'analyse

#### Solutions
```typescript
// Vérifiez les quotas dans le code
// src/lib/ai-analysis.ts

// Réduisez la taille des prompts si nécessaire
const maxTokens = 4000 // au lieu de 8000
```

1. Vérifiez les quotas Spark LLM
2. Réduisez la taille des CV (max 5-7 pages)
3. Utilisez `gpt-4o-mini` pour les gros documents

### Problème 5: Les données ne persistent pas

#### Solutions
```typescript
// Vérifiez l'utilisation de useKV
import { useKV } from '@github/spark/hooks'

// ✅ CORRECT
const [data, setData] = useKV('key', defaultValue)
setData((current) => [...current, newItem])

// ❌ INCORRECT (perte de données)
setData([...data, newItem]) // 'data' peut être stale
```

### Problème 6: Erreurs de build

#### Solutions
```bash
# 1. Nettoyez le cache
rm -rf node_modules package-lock.json
npm install

# 2. Vérifiez les types TypeScript
npm run type-check

# 3. Vérifiez les imports manquants
npm run build -- --mode production
```

---

## Checklist pré-déploiement

### ✅ Code
- [ ] Tous les tests passent
- [ ] Build réussit sans erreurs (`npm run build`)
- [ ] Pas de `console.log` ou debug code
- [ ] Variables d'environnement configurées
- [ ] Pas de secrets/clés exposés

### ✅ Fonctionnalités
- [ ] Authentification fonctionne
- [ ] Création de postes OK
- [ ] Upload et analyse CV OK
- [ ] Génération PDF OK
- [ ] Dashboard affiche les stats
- [ ] Responsive sur mobile/tablet/desktop

### ✅ Performance
- [ ] Images optimisées
- [ ] Bundle size raisonnable (<500kb gzippé)
- [ ] Pas de requêtes API inutiles

### ✅ SEO et Meta (optionnel)
- [ ] Titre `<title>` descriptif dans `index.html`
- [ ] Meta description ajoutée
- [ ] Favicon présent

### ✅ Domaine et DNS
- [ ] Nom de domaine acheté
- [ ] Enregistrements DNS configurés
- [ ] DNS propagé (vérifié)
- [ ] HTTPS activé et fonctionnel

---

## Support et ressources

### Documentation officielle
- [GitHub Spark Docs](https://docs.github.com/spark)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Communauté
- GitHub Discussions (votre repo)
- Stack Overflow (tag: github-spark)

### Contact support
- GitHub Spark Support (via votre dashboard Spark)
- Support registrar (pour problèmes DNS)

---

## Exemple de déploiement complet

### Scénario: Déployer sur `recrutement-ia.fr`

#### Étape 1: Build et test local
```bash
npm run build
npm run preview
# Testez sur http://localhost:4173
```

#### Étape 2: Push vers GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

#### Étape 3: Déploiement Spark
- Ouvrez Spark Dashboard
- Cliquez sur **Deploy**
- Notez l'URL: `recrutement-ia.spark.github.io`

#### Étape 4: Configuration DNS (OVH)
```
Type    Host    Value
CNAME   www     recrutement-ia.spark.github.io
A       @       185.199.108.153
```

#### Étape 5: Activation HTTPS
- Attendez propagation DNS (1-2h)
- Spark Settings > Enable HTTPS
- Attendez 10 minutes

#### Étape 6: Test final
- Visitez `https://www.recrutement-ia.fr`
- Testez toutes les fonctionnalités
- Vérifiez sur mobile

✅ **Déploiement terminé!**

---

## Conseils de production

### Performance
1. **Lazy loading**: Les composants lourds sont chargés à la demande
2. **Cache**: Spark gère le cache automatiquement
3. **CDN**: Assets servis via CDN global

### Sécurité
1. **HTTPS obligatoire**: Forcez la redirection HTTP → HTTPS
2. **Authentification**: Déjà implémentée avec mot de passe hashé
3. **Validation**: Toutes les entrées utilisateur sont validées

### Sauvegarde
1. **Export régulier**: Utilisez la fonction d'export PDF/JSON
2. **Backup KV**: Contactez support Spark pour backup automatique
3. **Git**: Votre code est sauvegardé sur GitHub

### Monitoring
1. **Analytics**: Ajoutez Google Analytics (optionnel)
2. **Uptime**: Utilisez Uptime Robot ou Pingdom
3. **Erreurs**: Intégrez Sentry pour tracker les bugs

---

## FAQ Déploiement

### Q: Combien coûte l'hébergement Spark?
**R**: GitHub Spark est en beta et actuellement gratuit. Les tarifs futurs seront annoncés.

### Q: Puis-je utiliser plusieurs domaines?
**R**: Oui, configurez plusieurs enregistrements DNS pointant vers votre Spark.

### Q: Mes données sont-elles sécurisées?
**R**: Oui, stockées via Spark KV avec chiffrement. Respect RGPD.

### Q: Puis-je migrer vers un autre hébergeur?
**R**: Partiellement. Le code frontend est portable, mais vous perdrez Spark LLM/KV.

### Q: Quelle est la limite de stockage?
**R**: Consultez les quotas Spark dans votre dashboard (généralement 100MB-1GB par app).

### Q: Combien de requêtes LLM puis-je faire?
**R**: Vérifiez vos quotas Spark. Optimisez les prompts pour réduire les tokens.

---

## Conclusion

Vous avez maintenant toutes les informations pour déployer votre plateforme AI Recruitment Assistant en production avec un nom de domaine personnalisé.

### Prochaines étapes recommandées
1. ✅ Testez exhaustivement en production
2. 📊 Configurez le monitoring
3. 📱 Testez sur différents appareils
4. 📧 Configurez les emails (optionnel)
5. 📈 Analysez les métriques d'utilisation

**Bon déploiement! 🚀**

---

*Dernière mise à jour: 2024*
