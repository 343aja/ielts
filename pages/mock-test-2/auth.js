document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Form qayta yuklanishini oldini oladi
  
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
  
      if (!firstName || !lastName) {
        alert("Iltimos, First name va Last name kiriting!");
        return;
      }
  
      // Fayl mazmuni
      const content = `${firstName} ${lastName}`;
  
      // Blob obyekt yaratamiz
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
  
      // Yuklab olish uchun <a> yaratamiz
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_name.txt"; // fayl nomi
      document.body.appendChild(a);
      a.click();
  
      // Tozalash
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setTimeout(() => {
        window.location.href = './listening.html'; // o'zingizga kerakli sahifa nomini yozing
      }, 1000)
    });
  });
  