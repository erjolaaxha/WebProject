CREATE DATABASE ELITEGYM

USE ELITEGYM

CREATE TABLE ANETAR (
    AnetarID INT PRIMARY KEY IDENTITY(1,1),
    Emri NVARCHAR(50) NOT NULL,
    Mbiemri NVARCHAR(50) NOT NULL,
    Datelindja DATE,
    Gjinia NVARCHAR(10),
    Email NVARCHAR(100) UNIQUE,
    NrTelefoni NVARCHAR(20),
    Qyteti NVARCHAR(50),
    Rruga NVARCHAR(100),
    DataRegjistrimit DATE DEFAULT GETDATE()
)

ALTER TABLE ANETAR
ADD Mosha AS (DATEDIFF(YEAR, Datelindja, GETDATE()))

CREATE TABLE ABONIM (
    AbonimID INT PRIMARY KEY IDENTITY(1,1),
    AnetarID INT UNIQUE NOT NULL,
    Tipi NVARCHAR(50),
    Cmimi DECIMAL(10,2),
    Statusi NVARCHAR(20),
    DataFillimit DATE,
    DataMbarimit DATE,
    CONSTRAINT FK_ABONIM_ANETAR
        FOREIGN KEY (AnetarID)
        REFERENCES ANETAR(AnetarID)
)

CREATE TABLE INSTRUKTOR (
    InstruktorID INT PRIMARY KEY IDENTITY(1,1),
    Emri NVARCHAR(50),
    Mbiemri NVARCHAR(50),
    Specializimi NVARCHAR(100),
    NrTelefoni NVARCHAR(20),
    Email NVARCHAR(100)
)

CREATE TABLE KLASA (
    KlasaID INT PRIMARY KEY IDENTITY(1,1),
    EmriKlases NVARCHAR(100),
    Tipi NVARCHAR(50),
    Kapaciteti INT,
    Kohezgjatja INT,
    InstruktorID INT NOT NULL,
    CONSTRAINT FK_KLASA_INSTRUKTOR
        FOREIGN KEY (InstruktorID)
        REFERENCES INSTRUKTOR(InstruktorID)
)

CREATE TABLE ORARI (
    OrariID INT PRIMARY KEY IDENTITY(1,1),
    Dita NVARCHAR(20),
    OraFillimit TIME,
    OraMbarimit TIME,
    Salla NVARCHAR(50),
    KlasaID INT NOT NULL,
    CONSTRAINT FK_ORARI_KLASA
        FOREIGN KEY (KlasaID)
        REFERENCES KLASA(KlasaID)
)

CREATE TABLE PERSONAL_TRAINER (
    TrainerID INT PRIMARY KEY IDENTITY(1,1),
    Emri NVARCHAR(50),
    Mbiemri NVARCHAR(50),
    Specializimi NVARCHAR(100),
    NrTelefoni NVARCHAR(20),
    Email NVARCHAR(100)
)

CREATE TABLE SEANCE_PERSONALE (
    SeanceID INT PRIMARY KEY IDENTITY(1,1),
    DataSeances DATE,
    Ora TIME,
    Kohezgjatja INT,
    TrainerID INT NOT NULL,
    AnetarID INT NOT NULL,
    CONSTRAINT FK_SEANCE_TRAINER
        FOREIGN KEY (TrainerID)
        REFERENCES PERSONAL_TRAINER(TrainerID),
    CONSTRAINT FK_SEANCE_ANETAR
        FOREIGN KEY (AnetarID)
        REFERENCES ANETAR(AnetarID)
)

CREATE TABLE MATJE_ANTROPOMETRIKE (
    MatjeID INT PRIMARY KEY IDENTITY(1,1),
    AnetarID INT NOT NULL,
    DataMatjes DATE,
    Pesha DECIMAL(5,2),
    Gjatesia DECIMAL(5,2),
    PerqindjaYndyres DECIMAL(5,2),
    MasaMuskujve DECIMAL(5,2),
    BMI AS (
        CASE 
            WHEN Gjatesia > 0 
            THEN Pesha / POWER((Gjatesia / 100.0), 2)
            ELSE NULL
        END
    ),
    CONSTRAINT FK_MATJE_ANETAR
        FOREIGN KEY (AnetarID)
        REFERENCES ANETAR(AnetarID)
)

ALTER TABLE MATJE_ANTROPOMETRIKE
DROP COLUMN BMI

ALTER TABLE MATJE_ANTROPOMETRIKE
ADD BMI AS (
    CASE 
        WHEN Gjatesia > 0 
        THEN CAST(
            Pesha / POWER((Gjatesia / 100.0), 2)
            AS DECIMAL(5,2)
        )
        ELSE NULL
    END
)

CREATE TABLE MERR_PJESE (
    AnetarID INT NOT NULL,
    KlasaID INT NOT NULL,
    PRIMARY KEY (AnetarID, KlasaID),
    CONSTRAINT FK_MERRPJESE_ANETAR
        FOREIGN KEY (AnetarID)
        REFERENCES ANETAR(AnetarID),
    CONSTRAINT FK_MERRPJESE_KLASA
        FOREIGN KEY (KlasaID)
        REFERENCES KLASA(KlasaID)
)

INSERT INTO ANETAR
(Emri, Mbiemri, Datelindja, Gjinia, Email, NrTelefoni, Qyteti, Rruga, DataRegjistrimit) VALUES
('Andi', 'Kelmendi', '2001-05-14', 'Mashkull', 'andi.kelmendi@gmail.com', '069-1234567', 'Tirane', 'Rruga e Kavajes Nr.12', GETDATE()),
('Sara', 'Berisha', '1998-11-22', 'Femer', 'sara.berisha@gmail.com', '068-7654321', 'Prishtine', 'Rruga B Nr.7', GETDATE()),
('Erjon', 'Hoxha', '1995-03-08', 'Mashkull', 'erjon.hoxha@gmail.com', '067-9988776', 'Durres', 'Lagjia 13 Plazh', GETDATE()),
('Kejsi', 'Meta', '2003-09-17', 'Femer', 'kejsi.meta@gmail.com', '069-4455667', 'Shkoder', 'Rruga Kole Idromeno', GETDATE()),
('Ardit', 'Leka', '1999-01-30', 'Mashkull', 'ardit.leka@gmail.com', '068-2233445', 'Vlore', 'Rruga Transballkanike', GETDATE()),
('Blerta', 'Gashi', '2000-06-11', 'Femer', 'blerta.gashi@gmail.com', '069-8881111', 'Peje', 'Rruga UCK', GETDATE()),
('Gent', 'Krasniqi', '1997-12-05', 'Mashkull', 'gent.krasniqi@gmail.com', '067-1112233', 'Prizren', 'Rruga Adem Jashari', GETDATE()),
('Elona', 'Shehu', '2002-08-19', 'Femer', 'elona.shehu@gmail.com', '068-9988112', 'Tirane', 'Rruga Myslym Shyri', GETDATE()),
('Dion', 'Rama', '1996-04-02', 'Mashkull', 'dion.rama@gmail.com', '069-7776665', 'Durres', 'Rruga Taulantia', GETDATE()),
('Arta', 'Bajrami', '2004-07-21', 'Femer', 'arta.bajrami@gmail.com', '067-5551122', 'Ferizaj', 'Rruga Deshmoret', GETDATE()),
('Florian', 'Peci', '1993-10-15', 'Mashkull', 'florian.peci@gmail.com', '068-4447788', 'Shkoder', 'Rruga Marin Barleti', GETDATE()),
('Melisa', 'Hoti', '2001-01-27', 'Femer', 'melisa.hoti@gmail.com', '069-2323232', 'Gjakove', 'Rruga Nene Tereza', GETDATE()),
('Kristi', 'Dema', '1998-09-09', 'Mashkull', 'kristi.dema@gmail.com', '067-9898989', 'Korce', 'Bulevardi Republika', GETDATE()),
('Jona', 'Ahmeti', '2005-03-13', 'Femer', 'jona.ahmeti@gmail.com', '068-7878787', 'Elbasan', 'Rruga Qemal Stafa', GETDATE()),
('Lorik', 'Mustafa', '1994-11-01', 'Mashkull', 'lorik.mustafa@gmail.com', '069-5656565', 'Mitrovice', 'Rruga Skenderbeu', GETDATE()),
('Anisa', 'Tafa', '2000-12-30', 'Femer', 'anisa.tafa@gmail.com', '067-4545454', 'Vlore', 'Rruga Pavarsia', GETDATE()),
('Bledi', 'Canaj', '1992-05-26', 'Mashkull', 'bledi.canaj@gmail.com', '068-9090909', 'Fier', 'Rruga Jakov Xoxa', GETDATE()),
('Tea', 'Islami', '2003-06-08', 'Femer', 'tea.islami@gmail.com', '069-1010101', 'Lezhe', 'Rruga Beselidhja', GETDATE()),
('Alban', 'Zeneli', '1997-02-18', 'Mashkull', 'alban.zeneli@gmail.com', '067-3434343', 'Kukes', 'Rruga Hasan Prishtina', GETDATE()),
('Rina', 'Osmani', '2001-09-25', 'Femer', 'rina.osmani@gmail.com', '068-7878111', 'Prishtine', 'Rruga Garibaldi', GETDATE())


INSERT INTO INSTRUKTOR (Emri, Mbiemri, Specializimi, NrTelefoni, Email) VALUES
('Arben', 'Musa', 'Cardio, CrossFit', '069-1234001', 'arben.musa@elitegym.com'),
('Drita', 'Hoxha', 'Yoga, Pilates', '069-1234002', 'drita.hoxha@elitegym.com'),
('Blerim', 'Kola', 'Boxing, MMA',  '069-1234003', 'blerim.kola@elitegym.com'),
('Sara', 'Leka', 'Yoga, Zumba',  '069-1234004', 'sara.leka@elitegym.com'),
('Genti', 'Vrapi', 'Strength, CrossFit', '069-1234005', 'genti.vrapi@elitegym.com'),
('Ana',  'Çela',  'Cardio, Dance',  '069-1234006', 'ana.cela@elitegym.com')


INSERT INTO PERSONAL_TRAINER (Emri, Mbiemri, Specializimi, NrTelefoni, Email) VALUES
('Klajdi', 'Berisha', 'Bodybuilding, Nutrition',  '069-7001001', 'klajdi@elitegym.com'),
('Mirela', 'Daka',  'Weight Loss, Cardio', '069-7001002', 'mirela@elitegym.com'),
('Ergys', 'Hyseni',  'CrossFit, Strength',  '069-7001003', 'ergys@elitegym.com'),
('Olta',  'Gjoka',  'Yoga, Flexibility',  '069-7001004', 'olta@elitegym.com')


INSERT INTO KLASA (InstruktorID, EmriKlases, Tipi, Kapaciteti, Kohezgjatja) VALUES
(1, 'Cardio Blast',  'Cardio',  20, 60),
(5, 'Power Strength', 'Strength', 15, 75),
(3, 'Boxing Fundamentals','Boxing', 12, 60),
(2, 'Morning Yoga', 'Yoga', 25, 90),
(1, 'CrossFit WOD', 'CrossFit', 18, 60),
(4, 'Zumba Dance', 'Cardio', 22, 60),
(6, 'Dance Cardio', 'Cardio',  20, 60)


INSERT INTO ORARI (KlasaID, Dita, OraFillimit, OraMbarimit, Salla) VALUES
(1, 'E Hënë', '07:00','08:00','Salla A'),
(1, 'E Mërkurë', '18:00','19:00','Salla A'),
(2, 'E Martë', '09:00','10:15','Salla B'),
(2, 'E Enjte', '16:00','17:15','Salla B'),
(3, 'E Hënë', '20:00','21:00','Salla C'),
(4, 'E Martë', '07:00','08:30','Salla A'),
(4, 'E Premte', '11:00','12:30','Salla A'),
(5, 'E Mërkurë', '09:00','10:00','Salla C'),
(6, 'E Shtunë', '10:00','11:00','Salla B'),
(7, 'E Diel', '09:00','10:00','Salla A')


INSERT INTO ABONIM (AnetarID,Tipi,Cmimi,DataFillimit,DataMbarimit,Statusi) VALUES
(1, 'Elite - 1 Vit', 249, '2025-01-01','2025-12-31','Aktiv'),
(2, 'Pro - 6 Muaj',  139, '2025-03-01','2025-08-31','Aktiv'),
(3, 'Klasik - 3 Muaj', 75, '2025-02-01','2025-04-30','Skaduar'),
(4, 'Start - 1 Muaj', 29, '2025-04-01','2025-04-30','Skaduar'),
(5, 'Elite - 1 Vit', 249, '2025-01-15','2026-01-14','Aktiv'),
(6, 'Pro - 6 Muaj',  139, '2025-04-01','2025-09-30','Aktiv'),
(7, 'Klasik - 3 Muaj', 75, '2025-03-01','2025-05-31','Aktiv'),
(8, 'Start - 1 Muaj',  29, '2025-05-01','2025-05-31','Aktiv'),
(9, 'Elite - 1 Vit',  249, '2024-06-01','2025-05-31','Aktiv'),
(10,'Pro - 6 Muaj',  139, '2025-02-01','2025-07-31','Aktiv'),
(11,'Klasik - 3 Muaj', 75, '2025-01-01','2025-03-31','Skaduar'),
(12,'Start - 1 Muaj',  29, '2025-04-10','2025-05-09','Aktiv'),
(13,'Pro - 6 Muaj', 139, '2025-03-15','2025-09-14','Aktiv'),
(14,'Elite - 1 Vit', 249, '2025-01-01','2025-12-31','Aktiv'),
(15,'Klasik - 3 Muaj', 75, '2025-04-01','2025-06-30','Aktiv'),
(16,'Start - 1 Muaj', 29, '2025-03-01','2025-03-31','Skaduar'),
(17,'Pro - 6 Muaj', 139, '2025-02-15','2025-08-14','Aktiv'),
(18,'Klasik - 3 Muaj', 75, '2025-05-01','2025-07-31','Aktiv'),
(19,'Elite - 1 Vit', 249, '2024-09-01','2025-08-31','Aktiv'),
(20,'Start - 1 Muaj', 29, '2025-04-20','2025-05-19','Aktiv')


INSERT INTO SEANCE_PERSONALE (DataSeances, Ora, Kohezgjatja, TrainerID, AnetarID) VALUES
('2025-05-01', '10:00', 60, 1, 1),
('2025-05-02', '11:00', 45, 2, 2),
('2025-05-03', '09:30', 60, 3, 3),
('2025-05-04', '17:00', 90, 4, 4),
('2025-05-05', '08:00', 60, 1, 5),
('2025-05-06', '18:00', 45, 2, 6),
('2025-05-07', '12:00', 60, 3, 7),
('2025-05-08', '16:00', 75, 4, 8),
('2025-05-09', '09:00', 60, 1, 9),
('2025-05-10', '13:00', 45, 2, 10),
('2025-05-11', '15:00', 60, 3, 11),
('2025-05-12', '10:30', 90, 4, 12),
('2025-05-13', '08:30', 60, 1, 13),
('2025-05-14', '19:00', 45, 2, 14),
('2025-05-15', '11:30', 60, 3, 15),
('2025-05-16', '14:00', 75, 4, 16),
('2025-05-17', '09:00', 60, 1, 17),
('2025-05-18', '17:30', 45, 2, 18),
('2025-05-19', '12:30', 60, 3, 19),
('2025-05-20', '18:30', 90, 4, 20)

INSERT INTO MATJE_ANTROPOMETRIKE
(AnetarID, DataMatjes, Pesha, Gjatesia, PerqindjaYndyres, MasaMuskujve) VALUES
(1, '2025-05-01', 78.5, 180, 15.2, 40.1),
(2, '2025-05-01', 60.2, 168, 22.5, 28.4),
(3, '2025-05-02', 85.0, 182, 18.0, 42.3),
(4, '2025-05-02', 55.4, 165, 24.1, 25.6),
(5, '2025-05-03', 90.7, 185, 20.2, 44.0),
(6, '2025-05-03', 58.0, 170, 21.0, 27.5),
(7, '2025-05-04', 82.1, 178, 17.3, 39.8),
(8, '2025-05-04', 63.5, 167, 23.0, 29.1),
(9, '2025-05-05', 88.9, 183, 19.5, 43.2),
(10,'2025-05-05', 57.8, 164, 24.8, 26.4),
(11,'2025-05-06', 92.0, 186, 21.5, 45.0),
(12,'2025-05-06', 59.7, 169, 22.0, 28.2),
(13,'2025-05-07', 80.0, 177, 16.9, 38.5),
(14,'2025-05-07', 54.2, 163, 25.4, 24.9),
(15,'2025-05-08', 86.5, 181, 18.7, 41.7),
(16,'2025-05-08', 61.0, 166, 23.6, 27.8),
(17,'2025-05-09', 95.3, 188, 22.1, 46.5),
(18,'2025-05-09', 56.8, 165, 24.0, 26.0),
(19,'2025-05-10', 79.4, 176, 17.0, 37.9),
(20,'2025-05-10', 62.3, 168, 22.7, 29.0)


INSERT INTO MERR_PJESE (AnetarID, KlasaID) VALUES
(1,1),
(1,5),
(2,4),
(2,6),
(3,3),
(4,4),
(4,7),
(5,2),
(5,5),
(6,1),
(6,6),
(7,3),
(7,5),
(8,4),
(9,2),
(9,5),
(10,6),
(11,1),
(11,3),
(12,4),
(13,2),
(13,5),
(14,7),
(15,3),
(15,5),
(16,1),
(17,2),
(17,5),
(18,6),
(19,1),
(19,3),
(20,4)

select * from ANETAR