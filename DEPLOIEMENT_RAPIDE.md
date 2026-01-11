# 🎯 Guide Rapide: Publier votre Spark

## 🚀 Déploiement en 3 étapes

### Option 1: Déploiement Spark (Recommandé)

```bash
# 1. Vérifiez que tout fonctionne
npm run build

# 2. Commitez vos changements
git add .
git commit -m "Ready for production"
git push origin main

# 3. Dans l'interface Spark, cliquez sur "Deploy" ou "Publish"
```

✅ **C'est tout!** Votre app est en ligne sur `votre-app.spark.github.io`

---

## 🌐 Ajouter un nom de domaine personnalisé

### Étape 1: Acheter un domaine
- Allez sur **Namecheap**, **OVH**, ou **Gandi**
- Achetez votre domaine (ex: `mon-recrutement.fr`)
- Coût: 10-30€/an

### Étape 2: Configurer dans Spark
1. Dans Spark Settings → **Custom Domain**
2. Entrez votre domaine: `mon-recrutement.fr`
3. Spark vous donne les enregistrements DNS à configurer

### Étape 3: Configurer le DNS
Allez dans le panneau DNS de votre registrar et ajoutez:

```
Type: CNAME
Host: www
Value: votre-app.spark.github.io
TTL: 3600

Type: A
Host: @
Value: [IP fournie par Spark]
TTL: 3600
```

### Étape 4: Activer HTTPS
1. Attendez 1-2h (propagation DNS)
2. Dans Spark Settings → **Enable HTTPS**
3. Attendez 10 minutes
4. Visitez `https://mon-recrutement.fr` ✅

---

## 📋 Checklist avant déploiement

- [ ] `npm run build` réussit sans erreur
- [ ] Toutes les fonctionnalités testées
- [ ] Responsive sur mobile
- [ ] Pas de `console.log` dans le code
- [ ] Code poussé sur GitHub

---

## 🆘 Problèmes courants

### Le site ne charge pas
```bash
# Vérifiez les logs dans Spark Dashboard
# Videz le cache: Ctrl+Shift+R
```

### DNS ne marche pas
- Attendez 1-4h (jusqu'à 48h maximum)
- Vérifiez sur https://dnschecker.org
- Vérifiez la configuration DNS

### HTTPS ne s'active pas
- Vérifiez que le DNS est bien propagé (requis)
- Désactivez puis réactivez HTTPS dans Spark Settings

---

## 📚 Guide complet

Pour plus de détails, consultez: **[GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)**

---

**Bon déploiement! 🎉**
