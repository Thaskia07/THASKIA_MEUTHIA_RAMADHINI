// Mendapatkan referensi ke elemen-elemen DOM
const surahListContainer = document.querySelector(".urutanSurah"); // Elemen yang menampilkan daftar surah
const select = document.getElementById("quran"); // Dropdown untuk memilih surah
const container = document.querySelector(".varian"); // Elemen yang menampilkan detail surah
const backButton = document.createElement("button"); // Tombol untuk kembali ke daftar surah
let activeAudio = null; // Menyimpan referensi audio yang sedang diputar
let isSurahListVisible = true; // Menandakan apakah daftar surah sedang terlihat


// Fungsi untuk menghapus semua anak elemen dari elemen DOM
const clearElement = (element) => {
   // Selama masih ada elemen anak, hapus elemen anak tersebut
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// Fungsi untuk membuat elemen surah
const createSurahElement = (surah) => {
    // Membuat elemen div untuk surah
  const surahElement = document.createElement("div");
  surahElement.classList.add("surah");

   // Membuat elemen untuk nomor surah
  const surahNumberElement = document.createElement("p");
  surahNumberElement.classList.add("surah-number");
  surahNumberElement.textContent = `Surah ${surah.nomor}`;
  surahElement.appendChild(surahNumberElement);

   // Membuat elemen untuk nama surah
  const surahNameElement = document.createElement("p");
  surahNameElement.classList.add("surah-name");
  surahNameElement.textContent = surah.nama;
  surahElement.appendChild(surahNameElement);

  // Membuat elemen untuk arti surah
  const surahTranslationElement = document.createElement("p");
  surahTranslationElement.classList.add("surah-translation");
  surahTranslationElement.textContent = surah.arti;
  surahElement.appendChild(surahTranslationElement);


    // Menambahkan event listener untuk memuat data surah saat surah diklik
  surahElement.addEventListener("click", () => fetchSurahData(surah.nomor));

  return surahElement;
};

// Fungsi untuk membuat elemen ayat
const createAyahElement = (ayah) => {
  // Membuat elemen div untuk ayat
  const ayahContainer = document.createElement("div");
  ayahContainer.classList.add("ayah-container");

  // Membuat elemen untuk nomor ayat
  const ayahNumber = document.createElement("p");
  ayahNumber.classList.add("no");
  ayahNumber.textContent = `Ayat ke - ${ayah.nomorAyat}`;
  ayahContainer.appendChild(ayahNumber);

  // Membuat elemen untuk teks Arab dari ayat
  const arabicText = document.createElement("p");
  arabicText.classList.add("ayat");
  arabicText.textContent = ayah.teksArab;
  ayahContainer.appendChild(arabicText);

    // Menambahkan elemen audio jika tersedia
  if (ayah.audio && ayah.audio["01"]) {
    const audioPlayer = document.createElement("audio");
    audioPlayer.controls = true; // Menampilkan kontrol pemutar audio
    audioPlayer.src = ayah.audio["01"]; // Menetapkan sumber audio
     // Menambahkan event listener untuk mengelola pemutaran audio
    audioPlayer.addEventListener("play", () => {
      if (activeAudio && activeAudio !== audioPlayer) {
        activeAudio.pause(); // Hentikan pemutaran audio yang sedang berlangsung
      }
      activeAudio = audioPlayer;  // Set audio aktif menjadi audio player ini
    });
    ayahContainer.appendChild(audioPlayer);
  }


  // Membuat elemen untuk terjemahan teks ayat
  const translationText = document.createElement("p");
  translationText.classList.add("ayat-indonesia");
  translationText.textContent = ayah.teksIndonesia;
  ayahContainer.appendChild(translationText);

  return ayahContainer;
};

// Fungsi untuk memuat daftar surah dari API
const loadSurahList = (quranData) => {
  // Menghapus semua anak elemen dalam surahListContainer dan select
  clearElement(surahListContainer);
  clearElement(select); // Menghapus semua elemen anak dari select

  // Menambahkan elemen option default ke select
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Pilih Surah";
  select.appendChild(defaultOption);

   // Menambahkan setiap surah ke dalam daftar surah dan dropdown
  quranData.data.forEach((surah) => {
    const surahElement = createSurahElement(surah);
    surahListContainer.appendChild(surahElement);

    const option = document.createElement("option");
    option.value = surah.nomor;
    option.textContent = `${surah.nomor}. ${surah.namaLatin}`;
    select.appendChild(option);
  });

  // Menambahkan event listener ke select untuk memuat data surah saat dipilih
  select.addEventListener("change", (event) => {
    if (event.target.value) {
      fetchSurahData(event.target.value);
    }
  });
};

// Memanggil API untuk mendapatkan data daftar surah
fetch("https://equran.id/api/v2/surat")
  .then(response => response.json())
  .then(quranData => loadSurahList(quranData)) // Mengolah data surah yang diterima dari API
  .catch(err => console.error(err)); // Menangani kesalahan jika terjadi error saat fetch

// Fungsi untuk mendapatkan data surah berdasarkan nomor surah
const fetchSurahData = (surahNumber) => {
  fetch(`https://equran.id/api/v2/surat/${surahNumber}`)
    .then(response => response.json())
    .then(surahData => {
      // Menghapus semua anak elemen dalam container
      clearElement(container);

        // Membuat elemen untuk menampilkan detail surah
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("title");

       // Membuat elemen untuk nama surah
      const nameSurah = document.createElement("h2");
      nameSurah.classList.add("surah-name");
      nameSurah.textContent = surahData.data.namaLatin;
      titleDiv.appendChild(nameSurah);

      // Membuat elemen untuk arti surah
      const translateName = document.createElement("p");
      translateName.classList.add("surah-translation");
      translateName.textContent = surahData.data.arti;
      titleDiv.appendChild(translateName);

       // Membuat elemen untuk jenis surah (Mekah/Madinah)
      const type = document.createElement("p");
      type.classList.add("surah-type");
      type.textContent = `Golongan: ${surahData.data.tempatTurun}`;
      titleDiv.appendChild(type);

       // Membuat elemen untuk jumlah ayat
      const ayat = document.createElement("p");
      ayat.classList.add("num-ayat");
      ayat.textContent = `Jumlah ayat: ${surahData.data.jumlahAyat} Ayat`;
      titleDiv.appendChild(ayat);

      container.appendChild(titleDiv);

       // Menambahkan elemen ayat ke dalam container
      surahData.data.ayat.forEach((ayah) => {
        const ayahElement = createAyahElement(ayah);
        container.appendChild(ayahElement);
      });

         // Menambahkan tombol "Back to Surah List" jika belum ada
      if (!document.querySelector(".back-to-list-button")) {
        backButton.classList.add("back-to-list-button");
        backButton.textContent = "Back to Surah List";
        document.body.appendChild(backButton);

          // Event listener untuk tombol "Back to Surah List"
        backButton.addEventListener("click", () => {
          surahListContainer.style.display = "block"; // Menampilkan daftar surah
          isSurahListVisible = true;
          clearElement(container); // Menghapus semua elemen anak dari container
          backButton.style.display = "none"; // Menyembunyikan tombol "Back"
          activeAudio = null; // Mengatur ulang audio aktif
        });
      }

       // Menyembunyikan daftar surah dan menampilkan tombol "Back" jika daftar surah sedang terlihat
      if (isSurahListVisible) {
        surahListContainer.style.display = "none";
        isSurahListVisible = false;
        backButton.style.display = "block";
      }
    })
    .catch(err => console.error(err)); // Menangani kesalahan jika terjadi error saat fetch
};

// Fungsi untuk mengecek apakah elemen berada di viewport
const isElementInViewport = (element) => {
  const bounding = element.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Fungsi untuk mengelola animasi elemen berdasarkan viewport
const animateElements = () => {
  const animatedElements = document.querySelectorAll(".vid-con .scCardVid");
  animatedElements.forEach(element => {
    if (isElementInViewport(element)) {
      element.classList.add("animate-in");
      element.classList.remove("animate-out");
    } else {
      element.classList.add("animate-out");
      element.classList.remove("animate-in");
    }
  });
};

// Menambahkan event listener untuk animasi saat scroll dan saat halaman dimuat
window.addEventListener("scroll", animateElements);
window.addEventListener("load", animateElements);

// Fungsi untuk slide video rekomendasi
document.addEventListener("DOMContentLoaded", function () {
    // Mendapatkan elemen-elemen DOM yang diperlukan
  const scVideo = document.querySelector(".scVideo"); // Kontainer yang akan diubah posisinya
  const scCardVid = document.querySelectorAll(".scCardVid"); // Semua elemen video yang ada di slider
  const prev = document.querySelector(".arrow-left"); // Tombol untuk slide ke kiri
  const next = document.querySelector(".arrow-right"); // Tombol untuk slide ke kanan
  const totalSlides = scCardVid.length;  // Total jumlah slide
  let currentIndex = 0;  // Indeks slide saat ini

   // Fungsi untuk memperbarui posisi slide
  function updateSlidePosition() {
    // Menggeser kontainer video ke kiri berdasarkan indeks slide saat ini
    scVideo.style.transform = `translateX(-${currentIndex * 100 / totalSlides}%)`;
  }

  // Event listener untuk tombol prev (kiri)
  prev.addEventListener("click", function () {
     // Jika indeks saat ini adalah 0 (slide pertama), kembali ke slide terakhir
    // Jika tidak, geser ke slide sebelumnya
    currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
    updateSlidePosition(); // Perbarui posisi slide
  });

   // Event listener untuk tombol next (kanan)
  next.addEventListener("click", function () {
     // Jika indeks saat ini adalah slide terakhir, kembali ke slide pertama
    // Jika tidak, geser ke slide berikutnya
    currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
    updateSlidePosition(); // Perbarui posisi slide
  });
});



