document.addEventListener("DOMContentLoaded", function (event) { /*tüm script'ler altta, jquery daha yok!*/

    //Context
    var actLanguageCode = (typeof language === 'undefined') ? null : language.toLowerCase();
    var actHotelKey = (typeof activeHotelKey === 'undefined') ? null : activeHotelKey.toLowerCase();
    var placeKey = (typeof specialPlaceKey === 'undefined') ? null : specialPlaceKey.toLowerCase();     /*Değer 'homes' ise AjwaHomes sayfalarından birindeyiz (Rooms.aspx|RoomDetail.aspx with placeid) */
    console.log("effActiveHotelKey: " + actHotelKey);
    console.log("effPlaceKey: " + placeKey);
    console.log("actLanguageCode: " + actLanguageCode);

    //Bindings
    var selHotel = GetHotelSelect();
    selHotel.on('change', function (e) {
        var selectedHotelVal = selHotel.val().toLowerCase();        //DisplayName bu
        var selectedHotelKey = GetSelectedHotelKey();
        if (selectedHotelKey == "cappadocia") {
            BindHotels(selectedHotelKey);
            $(".loyalty-link").hide();

        }
        else if (selectedHotelKey == "sultanahmet") {
            $(".loyalty-link").show();
            BindHotels(selectedHotelKey);
            if (placeKey == "homes") SetAccosSelected(1);        //homes'u seçiyor.
        }
        BindModifyBooking(actLanguageCode);
    });
    var selAcco = GetAccoSelect();
    selAcco.on('change', function (e) {
        BindModifyBooking(actLanguageCode);
    });

    //Decide
    if (actHotelKey != null) {
        //Hotel Specific
        SetHotelSelectedByKey(actHotelKey);
        BindHotels(actHotelKey);
        if (placeKey == "homes") SetAccosSelected(1);        //homes'u seçiyor.
        $("div.hotel-select").hide();
    }
    else {
        //GROUP (çatı)  //TODO: Karak verilecek.
        //a) default seçmek için
        SetHotelSelected(0);
        var firstKey = GetHotelKeyByIndex(0);       //İlk otel. Bu sıra Admin'den değiştirilebilir.    
        BindHotels(firstKey);
        //b) Kaybedip hepsini basmak için
        //BindHotels("group");
        //$("div.hotel-select").hide();
    }

    //Refresh (latest binds)
    BindModifyBooking(actLanguageCode);
});

function BindHotels(hotelKey) {
    BindAccos(hotelKey);
}

/* Index'e göre accomadation'ı seçtirir.
indexes 0:sultanahmet, 1:homes, 2:cappadocia
*/
function SetAccosSelected(index) {
    var sel = GetAccoSelect();
    sel.find("option:eq(" + index + ")").prop('selected', true);
    NotifyAccoUpdate();
}
function SetHotelSelected(index) {
    var sel = GetHotelSelect();
    sel.find("option:eq(" + index + ")").prop('selected', true);
    NotifyHotelUpdate();
}
function SetHotelSelectedByKey(hotelKey) {
    var sel = GetHotelSelect();
    sel.find("option[key='" + hotelKey + "']").prop('selected', true);
    NotifyHotelUpdate();
}
function GetHotelKeyByIndex(index) {
    var sel = GetHotelSelect();
    return sel.find("option:eq(" + index + ")").attr("key");

}
function BindAccos(accoKey) {
    HideAccoItem("cappadocia");
    HideAccoItem("sultanahmet");
    HideAccoItem("sultanahmet-homes");

    if (accoKey == "sultanahmet") {
        ShowAccoItem("sultanahmet");
        ShowAccoItem("sultanahmet-homes");
        SetAccosSelected(0);
    }
    else if (accoKey == "cappadocia") {
        ShowAccoItem("cappadocia");
        SetAccosSelected(2);
    }
    else {  //group mode
        ShowAccoItem("sultanahmet");
        ShowAccoItem("sultanahmet-homes");
        ShowAccoItem("cappadocia");
        SetAccosSelected(0);
    }
    NotifyAccoUpdate();
}
//ul ve li ile runtime select duplicate edildiği için her ikisini birden set ediyoruz! ref:Chosen.js yapıyor. Tüm combo'lar chosen ile main.master.js'de aktive ediliyor. https://harvesthq.github.io/chosen/
function NotifyAccoUpdate() {       //chosen.js'nin saçma uygulaması. Her update'ten sonra çağır.
    GetAccoSelect().trigger("chosen:updated");
}
function NotifyHotelUpdate() {
    GetHotelSelect().trigger("chosen:updated");
}
function GetHotelSelect() {
    return $('select.js-hotel-select');
}
function GetAccoSelect() {
    return $('select.js-rooms-select');
}
function HideAccoItem(accoKey) {
    var item = GetAccoSelectItem(accoKey);
    item.hide();
}
function ShowAccoItem(accoKey) {
    var item = GetAccoSelectItem(accoKey);
    item.show();
}
function GetAccoSelectItem(accoKey) {
    var selector = "option[key='" + accoKey + "']";
    var opt = GetAccoSelect().find(selector);
    return opt;
}
function GetModifyBookingBtn() {
    return $("a.modify-booking");
}
function SetModifyBooking(link) {
    GetModifyBookingBtn().attr("href", link);
}
function GetSelectedAccoKey() {
    var selAcco = GetAccoSelect();
    return selAcco.find("option:selected").attr("key");
}
function GetSelectedHotelKey() {
    var selHotel = GetHotelSelect();
    return selHotel.find("option:selected").attr("key");
}
function BindModifyBooking(languageCode) {
    var selAcco = GetAccoSelect();
    var selectedAccoKey = GetSelectedAccoKey();

    //pick url
    var engurl = "";
    if (selectedAccoKey == "cappadocia") { engurl = "https://be.synxis.com/signin?chain=10237&currency=EUR&hotel=47061&level=hotel&locale=en-US&productcurrency=EUR"; }
    else if (selectedAccoKey == "sultanahmet") { engurl = "https://reservations.verticalbooking.com/premium/cancel_modify.html?id_albergo=14793&dc=3014&id_stile=14268&lingua_int=eng"; }
    else if (selectedAccoKey == "sultanahmet-homes") { engurl = "https://ajwahomes.barboon.net/booking/AJWA-HOMES"; }

    //set lang
    var lingua = GetLingua(languageCode);
    var finalUrl = engurl.replace("lingua_int=eng", "lingua_int=" + lingua);

    SetModifyBooking(finalUrl);
}
var _langObject = { en: "eng", ru: "rus", tr: "tur", ar: "eng" };        //DRY:Aynı logic booking-module.js'de de var.
function GetLingua(languageCode) {
    return _langObject[languageCode];
}
