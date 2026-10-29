// Quiz popup: one question per step, opened by the "Join for free" button.

const dialog = document.getElementById("quiz");
const form = document.getElementById("quiz-form");
const steps = [...form.querySelectorAll("[data-step]")];
const backBtn = document.getElementById("quiz-back");
const nextBtn = document.getElementById("quiz-next");
const errorBox = document.getElementById("quiz-error");
const progressBar = document.getElementById("quiz-progress-bar");
const countText = document.getElementById("quiz-count");

let current = 0;
let finished = false;

// Sends the quiz answers to the GoHighLevel workflow's Inbound Webhook, which
// creates the contact. The URL lives in index.html (data-webhook-url).
async function submitLead(answers) {
  const { company, ...lead } = answers;
  if (company) return; // spam trap was filled in: a bot, so quietly drop it

  const url = form.dataset.webhookUrl;
  if (!url) {
    console.log("No webhook URL set yet, so nothing was sent:", lead);
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, source: "30-Day Challenge quiz", page: location.href }),
  });
  if (!res.ok) throw new Error(`Webhook answered ${res.status}`);
}

function showStep(i) {
  current = i;
  steps.forEach((step, n) => { step.hidden = n !== i; });
  errorBox.textContent = "";
  backBtn.hidden = i === 0;
  nextBtn.innerHTML = i === steps.length - 1 ? "Submit &rarr;" : "Next &rarr;";
  progressBar.style.width = `${(i / steps.length) * 100}%`;
  countText.textContent = `Question ${i + 1} of ${steps.length}`;
  steps[i].querySelector("input[type=email], input[type=text]")?.focus();
}

function showEnd(name) {
  finished = name === "success";
  form.hidden = true;
  dialog.querySelectorAll(".quiz__end").forEach((el) => { el.hidden = el.id !== `end-${name}`; });
}

function restart() {
  form.reset();
  form.hidden = false;
  dialog.querySelectorAll(".quiz__end").forEach((el) => { el.hidden = true; });
  showStep(0);
}

function stepIsValid() {
  const inputs = [...steps[current].querySelectorAll("input")];
  if (inputs[0].type === "radio") {
    if (!inputs.some((input) => input.checked)) {
      errorBox.textContent = "Please pick an answer.";
      return false;
    }
    return true;
  }
  const input = inputs[0];
  input.value = input.value.trim();
  if (!input.checkValidity()) {
    errorBox.textContent = input.type === "email" ? "Please enter a valid email address." : "Please enter your first name.";
    input.focus();
    return false;
  }
  return true;
}

document.querySelectorAll("[data-open-quiz]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!finished) restart();
    dialog.showModal();
  });
});

dialog.querySelector("[data-close-quiz]").addEventListener("click", () => dialog.close());

// Clicking the dark area outside the popup closes it.
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

// Picking a multiple-choice answer moves on by itself.
form.addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  const endsQuiz = e.target.dataset.endsQuiz;
  const from = current;
  setTimeout(() => {
    if (current !== from) return; // already moved on (e.g. a fast double click)
    endsQuiz ? showEnd(endsQuiz) : showStep(current + 1);
  }, 250);
});

backBtn.addEventListener("click", () => showStep(current - 1));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!stepIsValid()) return;
  if (current < steps.length - 1) {
    showStep(current + 1);
    return;
  }
  nextBtn.disabled = true;
  try {
    await submitLead(Object.fromEntries(new FormData(form)));
    showEnd("success");
  } catch (err) {
    errorBox.textContent = "Something went wrong. Please try again.";
  } finally {
    nextBtn.disabled = false;
  }
});
