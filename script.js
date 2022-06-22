var darktheme = "Dark Theme"
var lighttheme = "Light Theme"

const toggleSwitch = document.getElementById('checkbox');
const themeInfo = document.getElementById('themeinfo');

if(localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  toggleSwitch.checked = true;
  themeInfo.innerHTML = darktheme;
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  toggleSwitch.checked = false;
  themeInfo.innerHTML = lighttheme;
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeInfo.innerHTML = darktheme;
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeInfo.innerHTML = lighttheme;
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);