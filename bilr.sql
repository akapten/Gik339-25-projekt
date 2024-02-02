DROP TABLE IF EXISTS bilr;

CREATE TABLE IF NOT EXISTS bilr(
id            INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
,regnr        VARCHAR(16) NOT NULL
,model       VARCHAR(9) NOT NULL
,mfr          VARCHAR(9) NOT NULL
,color        VARCHAR(6) NOT NULL  
);

INSERT INTO bilr(id, regnr, model, mfr, color) VALUES (1, 'ABC132', 'XC60', 'Volvo', 'black');

INSERT INTO bilr(id, regnr, model, mfr, color) VALUES (2, 'FJG459', 'CLA', 'Mercedes-Benz', 'purple');

INSERT INTO bilr(id, regnr, model, mfr, color) VALUES (3, 'ASD543', 'GOLF', 'Volkswagen', 'gray');

select * from bilr;