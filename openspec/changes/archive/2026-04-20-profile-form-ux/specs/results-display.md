### Requirement: Bouton "Réserver un coaching" toujours affiché dans la modale
La modale de détail SHALL toujours afficher un bouton "Réserver un coaching / suivi" dans le pied de modale, même si aucun `source_url` n'est disponible.

#### Scenario: Bouton coaching affiché avec source_url présent
- **WHEN** une opportunité a un `source_url` et la modale est ouverte
- **THEN** le pied de modale affiche deux boutons : "Postuler sur le site officiel" (primaire) et "Réserver un coaching / suivi" (secondaire outline)

#### Scenario: Bouton coaching affiché sans source_url
- **WHEN** une opportunité n'a pas de `source_url` et la modale est ouverte
- **THEN** le pied de modale affiche uniquement le bouton "Réserver un coaching / suivi" (secondaire outline), sans erreur

#### Scenario: Lien coaching redirige vers /coaching
- **WHEN** l'utilisateur clique sur "Réserver un coaching / suivi"
- **THEN** il est redirigé vers la page `/coaching`
