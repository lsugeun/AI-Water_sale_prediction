// 모델 로드
let model;
async function loadModel() {
    model = await tf.loadLayersModel('tfjs_model/model.json');
    console.log('모델 로드 완료');
}

loadModel();

// 날씨 정보 가져오기 함수
async function getWeatherInfo() {
    const apiKey = '01a321558e9c9c9d2eee962d9639c192';
    const city = 'Asan,KR';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const temperature = data.main.temp;
            const humidity = data.main.humidity;

            // 가져온 온도와 습도 값을 화면에 표시하거나 모델에 전달
            document.getElementById('temperature').value = temperature;
            document.getElementById('humidity').value = humidity;

            // 모델에 입력값 전달하여 예측
            const prediction = await predict(temperature, humidity);

            // 예측값을 화면에 표시
            document.getElementById('prediction').innerText = prediction.toFixed(2);
        } else {
            console.error('날씨 정보를 가져오지 못했습니다.');
        }
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
    }
}

// 예측 함수
async function predict(temperature, humidity) {
    // 입력 데이터를 모델에 전달하여 예측
    const input = tf.tensor2d([[temperature, humidity]]);
    const output = model.predict(input);
    const prediction = output.dataSync()[0];
    return prediction;
}
