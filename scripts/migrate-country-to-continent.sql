-- Migration : regroupement des zones géographiques par continent
-- À exécuter UNE SEULE FOIS dans Supabase > SQL Editor

UPDATE opportunities SET country = 'europe'       WHERE country IN ('france');
UPDATE opportunities SET country = 'amerique_nord' WHERE country IN ('canada', 'usa');

-- Vérification post-migration
SELECT country, COUNT(*) FROM opportunities GROUP BY country ORDER BY country;
