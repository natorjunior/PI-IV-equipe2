-- 1. Insere a imagem genérica para TODOS os Whey Proteins
INSERT INTO midias (id_suplemento, tipo_midia, nome, caminho_midia)
SELECT 
    id_suplemento,
    'IMAGEM',
    'Imagem Genérica Whey Protein',
    'resources/whey_generico.jpg'  
FROM 
    suplementos
WHERE 
    tipo_suplemento = 'WHEY_PROTEIN';

-- 2. Insere a imagem genérica para TODAS as Creatinas
INSERT INTO midias (id_suplemento, tipo_midia, nome, caminho_midia)
SELECT 
    id_suplemento,
    'IMAGEM',
    'Imagem Genérica Creatina',
    'resources/creatina_generica.jpg' 
FROM 
    suplementos
WHERE 
    tipo_suplemento = 'CREATINA';