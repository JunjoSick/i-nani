function updateClock() {
    var now = new Date();
    var hour = (now.getUTCHours() + 9) % 24; // Korea is UTC+9
    var minute = now.getUTCMinutes();
    var second = now.getUTCSeconds();
    var formattedHour = hour < 10 ? '0' + hour : hour.toString();
    var formattedMinute = minute < 10 ? '0' + minute : minute.toString();
    var formattedSecond = second < 10 ? '0' + second : second.toString();
    var filtri = "https://easylist-downloads.adblockplus.org/antiadblockfilters.txt \nhttps://raw.githubusercontent.com/bogachenko/fuckfuckadblock/master/fuckfuckadblock.txt \nhttps://raw.githubusercontent.com/gioxx/xfiles/master/filtri.txt \nhttps://big.oisd.nl";
    
    console.log(filtri);

    document.getElementById('clock').innerText = formattedHour + ':' + formattedMinute + ':' + formattedSecond;

    if (formattedHour === '04' && formattedMinute === '20') {
        document.body.classList.add('special-background');
    } else {
        document.body.classList.remove('special-background');
    }
}
setInterval(updateClock, 1000);

document.getElementById('mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});
