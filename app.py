import json

from flask import Flask, jsonify
from flask import render_template
import sqlite3

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html")


# Эндпоинт для получения данных о всех медицинских организациях
@app.route('/clinics')
def get_clinics():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute('SELECT * FROM clinics')
    clinics = cur.fetchall()
    conn.close()
    return jsonify(clinics)


# Эндпоинт для получения данных о клиниках и районах
@app.route('/data')
def get_data():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute(
        'SELECT data.*, clinics.color, clinics.fillColor, clinics.id FROM data left join clinics on data.clinic = clinics.short_name')
    data = cur.fetchall()
    conn.close()
    formatted_data = []
    for row in data:
        coordinates = row[12]
        if coordinates and isinstance(coordinates, str):  # Проверяем наличие и тип данных
            try:
                formatted_data.append({
                    'type': row[11],
                    'coordinates': json.loads(coordinates),
                    'id': row[0],
                    'description': row[13],
                    'clinic': row[2],
                    'clinicID': row[16],
                    'color': row[14],
                    'stroke': row[15],
                    'strokeWidth': row[7],
                    'strokeOpacity': row[8],
                    'fill': row[15],
                    'fillOpacity': row[10]
                })
            except json.decoder.JSONDecodeError:
                print(f"Invalid JSON data in row {row[0]}")  # Обрабатываем некорректные данные
        else:
            print(f"No valid data in row {row[0]}")  # Обрабатываем отсутствие данных
    return jsonify(formatted_data)
