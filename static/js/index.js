ymaps.ready(init);

function init() {
    // Создаем карту и сохраняем объект в переменную map
    var map = new ymaps.Map("map", {
        center: [51.660781, 39.200296],
        zoom: 12
    });

    // Загрузка данных из API
    fetch('/clinics')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('myMap');
            let voronezhAdded = false; // Флаг для проверки добавления Воронежа в список

            // Проходимся по каждому элементу в списке и создаем опцию для select
            data.forEach(clinic => {
                const option = document.createElement('option');
                option.value = clinic[0]; // id
                option.textContent = clinic[2]; // short_name
                select.appendChild(option);

                // Проверяем, если short_name равен "Воронеж" и его еще нет в списке, добавляем его
                if (clinic[2] === 'Воронеж' && !voronezhAdded) {
                    select.value = clinic[0]; // Устанавливаем значение по умолчанию в "Воронеж"
                    voronezhAdded = true; // Устанавливаем флаг в true, чтобы избежать дублирования
                }
            });

            // Обработчик события изменения выбора в выпадающем списке
            select.addEventListener('change', () => {
                const selectedId = select.value;
                const selectedClinic = data.find(clinic => clinic[0] == selectedId);

                // Отображаем информацию о выбранной медицинской организации
                const clinicInfoDiv = document.getElementById('clinicInfo');
                clinicInfoDiv.innerHTML = `
                            <p>${selectedClinic[1]}</p>
                            <p>Главный врач: ${selectedClinic[3]}</p>
                            <p>Население: ${selectedClinic[4]}</p>
                            <p>Площадь: ${selectedClinic[8]} кв. км.</p>
                            <p>Участки взрослые: ${selectedClinic[5]}</p>
                            <p>Участки детские: ${selectedClinic[6]}</p>
                            <p>Участки акушерские: ${selectedClinic[7]}</p>
                        `;

                // Открываем balloonContent для соответствующего Polygon на карте в той же точке
                map.geoObjects.each((geoObject) => {
                    if (geoObject.geometry.getType() === 'Polygon' && geoObject.properties.get('clinic') === selectedClinic[2]) {
                        var polygonGeometry = geoObject.geometry.getCoordinates()[0]; // Получаем координаты полигона
                        var polygonCenter = polygonGeometry.reduce((acc, val) => [acc[0] + val[0] / polygonGeometry.length, acc[1] + val[1] / polygonGeometry.length], [0, 0]); // Вычисляем центр полигона
                        geoObject.balloon.open(polygonCenter, geoObject.properties.get('balloonContent')); // Открываем balloonContent в центре полигона
                    }
                });
                                // Перемещаем центр карты в выбранную медицинскую организацию
                map.setCenter([selectedClinic[10], selectedClinic[9]], 12, {
                    checkZoomRange: true,
                    duration: 500
                });
            });

            // Вызываем событие изменения значения в выпадающем списке для отображения информации о Воронеже
            select.dispatchEvent(new Event('change'));
        })
        .catch(error => console.error('Error:', error));

    // Добавляем функционал для отображения объектов на карте
    function displayObjects(data) {
        data.forEach(item => {
            if (item.type === 'Point') {
                var descriptionLines = item.description.split(';');
                // Сформировать HTML-код для balloonContent
                var balloonContent = '';
                descriptionLines.forEach(line => {
                    balloonContent += `<p>${line.trim()}</p>`; // Добавить каждую строку в <p> элемент
                });

                // Если объект - точка, добавляем маркер
                var marker = new ymaps.Placemark(item.coordinates, {
                    balloonContent: balloonContent,
                    clinic: item.clinic,
                }, {
                    preset: 'islands#' + item.color + 'MedicalCircleIcon',
                });
                marker.properties.set('clinicId', item.id); // Добавляем clinicId в свойства маркера
                map.geoObjects.add(marker); // Добавляем маркер на карту
            } else if (item.type === 'Polygon') {
                // Если объект - полигон, добавляем его на карту
                try {
                    var polygon = new ymaps.Polygon(item.coordinates, {
                        balloonContent: item.description,
                        clinic: item.clinic,
                    }, {
                        fillColor: item.fill,
                        fillOpacity: item.fillOpacity,
                        strokeColor: item.stroke,
                        strokeOpacity: item.strokeOpacity,
                        strokeWidth: item.strokeWidth
                    });
                    polygon.properties.set('clinicId', item.id); // Добавляем clinicId в свойства полигона
                    map.geoObjects.add(polygon); // Добавляем полигон на карту
                } catch (error) {
                    console.error('Error adding polygon:', error);
                    console.log('Problematic coordinates:', item.coordinates);
                }
            }
        });
        // Обработчик клика на маркере или полигоне
        map.geoObjects.events.add('click', function (e) {
            var target = e.get('target'); // Получаем объект, на который кликнули
            var clinicId = target.properties.get('clinicId'); // Получаем id медицинской организации
            // Находим соответствующий элемент в выпадающем списке
            var select = document.getElementById('myMap');
            // Находим option с соответствующим текстовым содержимым clinic
            var option = Array.from(select.options).find(option => option.textContent === target.properties.get('clinic'));
            if (option) {
                select.value = option.value; // Устанавливаем значение в выпадающем списке
                // Вызываем событие изменения значения в выпадающем списке
                select.dispatchEvent(new Event('change'));
            }
        });
    }

    // Загрузка данных о клиниках и районах
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Отобразить объекты на карте
            displayObjects(data);
        })
        .catch(error => console.error('Error:', error));
}
