/*
tarayıcıların depolama alanları
localStorage ve sessionStorage, tarayıcının sundupu iki farklı web depolama alanı

*/

//localStorage'a veri ekleme
localStorage.setItem("kullaniciAdi", "hülya");
//localStorage'den veri çekme
const kullaniciAdi = localStorage.getItem("kullaniciAdi");
console.log(kullaniciAdi);
