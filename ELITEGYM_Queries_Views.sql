--1. Te gjithe anetaret qe kane abonim aktiv
SELECT A.Emri, A.Mbiemri, AB.Tipi, AB.Statusi
FROM ANETAR AS A
JOIN ABONIM AS AB
ON A.AnetarID = AB.AnetarID
WHERE AB.Statusi = 'Aktiv'

--2. Anetaret qe ndjekin klasen “CrossFit WOD”

SELECT A.Emri, A.Mbiemri, K.EmriKlases
FROM ANETAR AS A
JOIN MERR_PJESE AS MP
ON A.AnetarID = MP.AnetarID
JOIN KLASA AS K
ON MP.KlasaID = K.KlasaID
WHERE K.EmriKlases = 'CrossFit WOD'

--3. Instruktoret dhe klasat qe ata zhvillojne

SELECT I.Emri, I.Mbiemri, K.EmriKlases
FROM INSTRUKTOR AS I
JOIN KLASA AS K
ON I.InstruktorID = K.InstruktorID

--4. Orari i te gjitha klasave sipas dites

SELECT K.EmriKlases, O.Dita, O.OraFillimit, O.OraMbarimit, O.Salla
FROM KLASA AS K
JOIN ORARI AS O
ON K.KlasaID = O.KlasaID
ORDER BY O.Dita

--5. Anetaret qe kane BMI mbi 25

SELECT A.Emri, A.Mbiemri, M.BMI
FROM ANETAR AS A
JOIN MATJE_ANTROPOMETRIKE AS M
ON A.AnetarID = M.AnetarID
WHERE M.BMI > 25

--6. Personal trainer-at dhe numri i seancave qe kane zhvilluar

SELECT PT.Emri, PT.Mbiemri, COUNT(SP.SeanceID) AS NrSeancave
FROM PERSONAL_TRAINER AS PT
JOIN SEANCE_PERSONALE AS SP
ON PT.TrainerID = SP.TrainerID
GROUP BY PT.Emri, PT.Mbiemri

--7. Anetaret qe marrin pjese ne me shume se nje klase

SELECT A.Emri, A.Mbiemri, COUNT(MP.KlasaID) AS NrKlasave
FROM ANETAR AS A
JOIN MERR_PJESE AS MP
ON A.AnetarID = MP.AnetarID
GROUP BY A.Emri, A.Mbiemri
HAVING COUNT(MP.KlasaID) > 1

--8. Klasat me kapacitet me te madh se 20 persona

SELECT EmriKlases, Tipi, Kapaciteti
FROM KLASA
WHERE Kapaciteti > 20

--9. Anetaret qe kane abonim te skaduar

SELECT A.Emri, A.Mbiemri, AB.Tipi, AB.DataMbarimit
FROM ANETAR AS A
JOIN ABONIM AS AB
ON A.AnetarID = AB.AnetarID
WHERE AB.Statusi = 'Skaduar'

--10. Mesatarja e peshes se anetareve

SELECT AVG(Pesha) AS MesatarjaPesha
FROM MATJE_ANTROPOMETRIKE

--11. 3 Klasat me numrin me te madh te pjesemarresve

SELECT TOP 3 
K.EmriKlases, COUNT(MP.AnetarID) AS NrPjesemarresve
FROM KLASA AS K
JOIN MERR_PJESE AS MP
ON K.KlasaID = MP.KlasaID
GROUP BY K.EmriKlases
ORDER BY NrPjesemarresve DESC

--12. Anetaret qe kane zhvilluar seanca personale me trainer

SELECT A.Emri, A.Mbiemri, PT.Emri AS EmriTrainerit,
PT.Mbiemri AS MbiemriTrainerit,
SP.DataSeances,
CONVERT(VARCHAR(5), SP.Ora, 108) AS Ora
FROM ANETAR AS A
JOIN SEANCE_PERSONALE AS SP
ON A.AnetarID = SP.AnetarID
JOIN PERSONAL_TRAINER AS PT
ON SP.TrainerID = PT.TrainerID
ORDER BY SP.DataSeances



--VIEW 1 : Raporti i anetareve dhe abonimeve
--Ky raport i intereson recepsionit ose menaxherit te palestres per te pare statusin e abonimeve te çdo anetari.

CREATE VIEW VIEW_ANETAR_ABONIM AS
SELECT A.AnetarID, A.Emri, A.Mbiemri, AB.Tipi, AB.Statusi, AB.DataFillimit, AB.DataMbarimit
FROM ANETAR AS A
JOIN ABONIM AS AB
ON A.AnetarID = AB.AnetarID

SELECT * FROM VIEW_ANETAR_ABONIM

--VIEW 2 : Raporti i klasave dhe instruktoreve
--Ky raport perdoret per organizimin e klasave dhe monitorimin e instruktoreve.

CREATE VIEW VIEW_KLASA_INSTRUKTOR AS
SELECT K.KlasaID, K.EmriKlases, K.Tipi, K.Kapaciteti,
I.Emri AS EmriInstruktorit,
I.Mbiemri AS MbiemriInstruktorit
FROM KLASA AS K
JOIN INSTRUKTOR AS I
ON K.InstruktorID = I.InstruktorID

SELECT * FROM VIEW_KLASA_INSTRUKTOR

--VIEW 3 : Raporti i matjeve antropometrike
--Ky raport ndihmon trainer-at dhe nutricionistet te monitorojne progresin fizik te anetareve.

CREATE VIEW VIEW_MATJE_BMI AS
SELECT A.Emri, A.Mbiemri, M.Pesha, M.Gjatesia, M.BMI, M.PerqindjaYndyres, M.MasaMuskujve
FROM ANETAR AS A
JOIN MATJE_ANTROPOMETRIKE AS M
ON A.AnetarID = M.AnetarID

SELECT * FROM VIEW_MATJE_BMI

