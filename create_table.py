import sqlite3
import pandas as pd
from sqlalchemy import create_engine

conn = sqlite3.connect('data.db')
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

engine = create_engine('sqlite:///data.db')

# Загрузка данных из excel файла подразделения
df = pd.read_excel('Загрузить в БД.xlsx')
df.to_sql('data', engine, if_exists='replace', index=False)

# Загрузка данных из excel файла справочник МО
df_mo = pd.read_excel('МО ВРН.xlsx')
df_mo.to_sql('clinics', engine, if_exists='replace', index=False)