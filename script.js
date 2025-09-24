// Data untuk autosave
let formData = {
  nama: '',
  email: '',
  pesan: ''
};

let autoSaveTimer;
document.addEventListener('DOMContentLoaded', function() {
  loadSavedData();
  const pesanTextarea = document.getElementById('pesan');
  const pesanCount = document.getElementById('pesan-count');
  pesanTextarea.addEventListener('input', function() {
    const count = this.value.length;
    pesanCount.textContent = `${count}/500 karakter`;
    if (count > 450) {
      pesanCount.classList.add('warning');
    } else if (count > 490) {
      pesanCount.classList.add('error');
    } else {
      pesanCount.classList.remove('warning', 'error');
    }
    
    autoSave();
  });
  
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', autoSave);
  });
  
  document.getElementById('data-form').addEventListener('submit', function(e) {
    e.preventDefault();
    submitForm();
  });
});

function nextStep(step) {
  // Validasi step saat ini sebelum lanjut
  if (step === 2 && !validateStep1()) return;
  if (step === 3 && !validateStep2()) return;
  
  document.querySelectorAll('.form-step').forEach(stepEl => {
    stepEl.classList.remove('active');
  });
  document.getElementById(`step${step}`).classList.add('active');
  
  document.querySelectorAll('.step').forEach(stepIndicator => {
    stepIndicator.classList.remove('active', 'completed');
  });
  
  for (let i = 1; i <= step; i++) {
    const stepEl = document.getElementById(`step-${i}`);
    if (i === step) {
      stepEl.classList.add('active');
    } else {
      stepEl.classList.add('completed');
    }
  }
  
  const progress = (step / 3) * 100;
  document.getElementById('form-progress').style.width = `${progress}%`;
  
  if (step === 3) {
    updateReview();
  }
}

function prevStep(step) {
  nextStep(step);
}

function validateStep1() {
  const nama = document.getElementById('nama').value.trim();
  const email = document.getElementById('email').value.trim();
  
  if (!nama) {
    alert('Harap masukkan nama lengkap');
    return false;
  }
  
  if (!email || !isValidEmail(email)) {
    alert('Harap masukkan email yang valid');
    return false;
  }
  
  return true;
}

function validateStep2() {
  const pesan = document.getElementById('pesan').value.trim();
  
  if (!pesan) {
    alert('Harap masukkan pesan');
    return false;
  }
  
  if (pesan.length < 10) {
    alert('Pesan terlalu pendek. Minimal 10 karakter');
    return false;
  }
  
  return true;
}

function autoSave() {
  clearTimeout(autoSaveTimer);
  formData.nama = document.getElementById('nama').value;
  formData.email = document.getElementById('email').value;
  formData.pesan = document.getElementById('pesan').value;
  localStorage.setItem('formData', JSON.stringify(formData));
  const statusEl = document.getElementById('auto-save-status');
  statusEl.textContent = 'Menyimpan...';
  autoSaveTimer = setTimeout(() => {
    statusEl.textContent = 'Data tersimpan otomatis';
    setTimeout(() => {
      statusEl.textContent = '';
    }, 2000);
  }, 500);
}

function loadSavedData() {
  const saved = localStorage.getItem('formData');
  if (saved) {
    formData = JSON.parse(saved);
    document.getElementById('nama').value = formData.nama;
    document.getElementById('email').value = formData.email;
    document.getElementById('pesan').value = formData.pesan;
    
    const pesanCount = document.getElementById('pesan-count');
    pesanCount.textContent = `${formData.pesan.length}/500 karakter`;
  }
}

function updateReview() {
  document.getElementById('review-nama').textContent = formData.nama;
  document.getElementById('review-email').textContent = formData.email;
  document.getElementById('review-pesan').textContent = formData.pesan;
}

function submitForm() {
  const submission = {
    ...formData,
    timestamp: new Date().toISOString(),
    id: Date.now()
  };
  
  let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
  submissions.push(submission);
  localStorage.setItem('formSubmissions', JSON.stringify(submissions));
  
  localStorage.removeItem('formData');
  formData = { nama: '', email: '', pesan: '' };
  
  const confirmation = document.getElementById('confirmation-message');
  confirmation.style.display = 'block';
  
  setTimeout(() => {
    confirmation.style.display = 'none';
    document.getElementById('data-form').reset();
    nextStep(1);
  }, 3000);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
