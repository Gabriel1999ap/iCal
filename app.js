document.addEventListener("DOMContentLoaded", function () {
  // Inicializa a descrição para a frequência "DAILY"
  let frequency = document.getElementById("frequency").value;
  displayFrequencyDetails(frequency);

  // Lidar com o checkbox de intervalo
  document
    .getElementById("enableInterval")
    .addEventListener("change", function () {
      let intervalField = document.getElementById("intervalField");
      if (this.checked) {
        intervalField.style.display = "block";
      } else {
        intervalField.style.display = "none";
      }
    });
});

document.getElementById("frequency").addEventListener("change", function () {
  let frequency = this.value;
  displayFrequencyDetails(frequency);
  document.getElementById("weeklyOptions").style.display =
    frequency === "WEEKLY" ? "block" : "none";
  document.getElementById("monthlyOptions").style.display =
    frequency === "MONTHLY" ? "block" : "none";
  document.getElementById("hourOptions").style.display =
    frequency === "MINUTELY" ? "none" : "block";
  document.getElementById("minuteOptions").style.display =
    frequency === "MINUTELY" ? "block" : "none";

  // Exibir campos extras para intervalo
  let intervalUnitField = document.getElementById("intervalUnitField");
  intervalUnitField.style.display =
    frequency === "INTERVAL_NEW" ? "block" : "none";
});

function displayFrequencyDetails(frequency) {
  let details = "";
  switch (frequency) {
    case "DAILY":
      details = "A frequência diária é para eventos que ocorrem todos os dias.";
      break;
    case "WEEKLY":
      details =
        "A frequência semanal permite selecionar os dias da semana em que o evento ocorre.";
      break;
    case "MONTHLY":
      details =
        "A frequência mensal permite selecionar os dias do mês em que o evento ocorre.";
      break;
    case "YEARLY":
      details =
        "A frequência anual é para eventos que ocorrem uma vez por ano na mesma data.";
      break;
    case "HOURLY":
      details = "A frequência horária é para eventos que ocorrem a cada hora.";
      break;
    case "MINUTELY_DAILY":
      details =
        "A frequência a cada minuto permite personalizar os minutos em que o evento ocorre.";
      break;
    default:
      details = "";
  }
  document.getElementById("frequencyDetails").style.display = details
    ? "block"
    : "none";
  document.getElementById("details").value = details;
}

function clearField(id) {
  document.getElementById(id).value = "";
}

function generateICal() {
  let frequency = document.getElementById("frequency").value;
  let interval = 1; // Valor padrão para intervalo
  let enableInterval = document.getElementById("enableInterval").checked;

  // Se o intervalo estiver ativado e o campo estiver preenchido, pega o valor
  if (enableInterval) {
    interval = document.getElementById("interval").value || 1; // Se o valor estiver vazio, assume 1
  }

  let days = [];
  let hours = [];
  let minutes = [];

  if (frequency === "WEEKLY") {
    document
      .querySelectorAll('input[name="days"]:checked')
      .forEach((checkbox) => days.push(checkbox.value));
  } else if (frequency === "MONTHLY") {
    let dayOfMonth = document.getElementById("daysOfMonth").value.trim();
    if (dayOfMonth) {
      days = dayOfMonth.split(",").map((day) => day.trim());
    }
  }

  // Verificar horários selecionados
  document.querySelectorAll('input[type="time"]').forEach((input) => {
    if (input.value) {
      let [hour, minute] = input.value.split(":");
      hours.push(hour);
      minutes.push(minute);
    }
  });

  // Se for "A Cada Minuto", usa os minutos personalizados
  if (frequency === "MINUTELY_DAILY") {
    frequency = "DAILY";

    let customMinutes = document.getElementById("customMinutes").value.trim();
    if (customMinutes) {
      minutes = customMinutes.split(",").map((min) => min.trim());
    } else {
      // Caso não tenha inserido, usa todos os minutos (0-59)
      minutes = Array.from({ length: 60 }, (_, i) => i.toString());
    }
  }

    // Se for "Intervalo", pega a unidade selecionada
    if (frequency === "INTERVAL_NEW") {
      frequency = document.getElementById("intervalUnit").value;
    }

  let icalExpression = `FREQ=${frequency}`;

  // Adiciona o INTERVAL apenas se o checkbox de intervalo estiver marcado e o valor for válido
  if (enableInterval && interval > 0) {
    icalExpression += `;INTERVAL=${interval}`;
  }

  if (frequency === "WEEKLY" && days.length) {
    icalExpression += `;BYDAY=${days.join(",")}`;
  }

  if (frequency === "MONTHLY" && days.length) {
    icalExpression += `;BYMONTHDAY=${days.join(",")}`;
  }

  if (hours.length) {
    icalExpression += `;BYHOUR=${hours.join(",")}`;
  }

  if (minutes.length) {
    if (minutes.every((min) => min === "00")) {
      minutes = ["00"];
    }
    icalExpression += `;BYMINUTE=${minutes.join(",")}`;
  }

  // Garantir que o ponto e vírgula no final da expressão esteja presente
  icalExpression += ";";

  document.getElementById("icalResult").value = icalExpression;
}

function copyToClipboard() {
  let copyText = document.getElementById("icalResult");
  copyText.select();
  copyText.setSelectionRange(0, 99999); // Para dispositivos móveis
  document.execCommand("copy");
  alert("Texto copiado para a área de transferência!");
}
