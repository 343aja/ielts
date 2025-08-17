document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const enteredId = document.getElementById('studentId').value;
  const enteredPassword = document.getElementById('password').value;

  // Simulyatsiya qilingan login (json o'qib tekshirish)
  fetch('../data/students.json')
    .then(response => response.json())
    .then(students => {
      const user = students.find(
        student => student.id === enteredId && student.password === enteredPassword
      );

      if (user) {
        localStorage.setItem('studentId', enteredId); // foydalanuvchini eslab qolamiz
        window.location.href = 'dashboard.html';
      } else {
        document.getElementById('loginMessage').innerText = 'ID yoki parol noto‘g‘ri!';
      }
    })
    .catch(err => {
      console.error('Error reading student data:', err);
      document.getElementById('loginMessage').innerText = 'Server xatosi!';
    });
});
