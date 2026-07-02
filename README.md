# LUMA OS Shopify Theme

Boutique Shopify OS 2.0 au style liquid glass : interface sombre, surfaces translucides, reflets doux, hero immersif, collection, fiche produit, panier, recherche et pages standard.

## Structure

- `layout/theme.liquid` : layout principal Shopify
- `assets/luma.css` : design global liquid glass
- `assets/luma.js` : menu mobile, header sticky, variantes produit
- `sections/` : sections configurables Shopify
- `templates/` : templates JSON Shopify OS 2.0
- `snippets/product-card.liquid` : carte produit reutilisable

## Importer dans Shopify

1. Zippe le contenu de ce dossier, pas le dossier parent.
2. Dans Shopify Admin, va dans `Online Store > Themes`.
3. Clique `Add theme > Upload zip file`.
4. Choisis ton fichier `.zip`.
5. Ouvre `Customize` pour choisir les images, collections, menus et textes.

## Mettre sur GitHub

Depuis VS Code ou un terminal avec Git installe :

```powershell
git init
git add .
git commit -m "Initial LUMA OS Shopify theme"
git branch -M main
git remote add origin https://github.com/TON-COMPTE/TON-REPO.git
git push -u origin main
```

## Notes

Le theme est volontairement sans dependances externes pour rester facile a importer dans Shopify. Ajoute tes vrais produits, images et menus dans l'admin Shopify pour finaliser la boutique.
