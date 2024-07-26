// Mengambil elemen HTML dengan id "jam", "menit", dan "detik"
let jam = document.getElementById("jam");
let menit = document.getElementById("menit");
let detik = document.getElementById("detik");

// Update waktu menurut waktu pada perangkat
setInterval(() => {

    // Mendapatkan waktu saat ini dari perangkat
    let waktu = new Date();

    // Mengatur konten teks untuk elemen "jam"
    // Menambahkan angka nol di depan jika jam kurang dari 10
    jam.textContent = (waktu.getHours() < 10 ? "0" : "") + waktu.getHours();

    // Mengatur konten teks untuk elemen "menit"
    // Menambahkan angka nol di depan jika menit kurang dari 10
    menit.textContent = (waktu.getMinutes() < 10 ? "0" : "") + waktu.getMinutes();

    // Mengatur konten teks untuk elemen "detik"
    // Menambahkan angka nol di depan jika detik kurang dari 10
    detik.textContent = (waktu.getSeconds() < 10 ? "0" : "") + waktu.getSeconds();
}, 1000); // Interval waktu 1000 milidetik (1 detik)
