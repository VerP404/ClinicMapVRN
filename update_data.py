import sqlite3
import pandas as pd
from sqlalchemy import create_engine


engine = create_engine('sqlite:///data.db')
print("Подключение к базе установлено! Началась загрузка данных")
# Загрузка данных из excel файла подразделения
df = pd.read_excel('Загрузить в БД.xlsx')
df.to_sql('data', engine, if_exists='replace', index=False)

# Загрузка данных из excel файла справочник МО
df_mo = pd.read_excel('МО ВРН.xlsx')
df_mo.to_sql('clinics', engine, if_exists='replace', index=False)
print("Данные загружены!")
