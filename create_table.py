import sqlite3

conn = sqlite3.connect('database.db')
print("Подключение успешно")
conn.execute("""
create table clinics
(
    id                 BIGINT,
    name               TEXT,
    short_name         TEXT,
    chief_clinic       TEXT,
    people             BIGINT,
    therapeutic_area   BIGINT,
    pediatric_area     BIGINT,
    gynecological_area BIGINT,
    square             FLOAT,
    latitude           FLOAT,
    longitude          FLOAT,
    color              TEXT,
    fillColor          TEXT
)
""")
conn.execute("""
create table data
(
    id               BIGINT,
    name             TEXT,
    clinic           TEXT,
    address          TEXT,
    iconCaption      TEXT,
    "marker-color"   TEXT,
    stroke           TEXT,
    "stroke-width"   FLOAT,
    "stroke-opacity" FLOAT,
    fill             TEXT,
    "fill-opacity"   FLOAT,
    type             TEXT,
    coordinates      TEXT,
    description      TEXT
)
""")
print("Создание таблиц успешно")
conn.close()