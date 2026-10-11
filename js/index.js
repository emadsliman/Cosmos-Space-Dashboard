// section hidden & activeLink
var navLinks = document.querySelectorAll(".nav-link");
var sections = document.querySelectorAll(".app-section");

function showSection(sectionName) {
  for (var i = 0; i < sections.length; i++) {
    var currentSection = sections[i];

    if (currentSection.dataset.section === sectionName) {
      currentSection.classList.remove("hidden");
    } else {
      currentSection.classList.add("hidden");
    }
  }
}
function setActiveLink(activeLink) {
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove("bg-blue-500/10", "text-blue-400");
    navLinks[i].classList.add("text-slate-300", "hover:bg-slate-800");
  }

  activeLink.classList.remove("text-slate-300", "hover:bg-slate-800");
  activeLink.classList.add("bg-blue-500/10", "text-blue-400");
}

for (var j = 0; j < navLinks.length; j++) {
  navLinks[j].addEventListener("click", function (event) {
    event.preventDefault();
    var sectionName = this.dataset.section; 
    showSection(sectionName);
    setActiveLink(this); 
  });
}

// img today
var API_KEY = "bU7WaOFtMVnWeJGvbySkFHQt5WestD49c69xOgQa";

var apodImage = document.getElementById("apod-image");
var apodLoading = document.getElementById("apod-loading");
var apodDate = document.getElementById("apod-date");
var apodTitle = document.getElementById("apod-title");
var apodDateDetail = document.getElementById("apod-date-detail");
var apodExplanation = document.getElementById("apod-explanation");
var apodCopyright = document.getElementById("apod-copyright");
var apodDateInfo = document.getElementById("apod-date-info");
var apodMediaType = document.getElementById("apod-media-type");

function getApod(date) {
  var url = "https://api.nasa.gov/planetary/apod?api_key=" + API_KEY;

  if (date) {
    url += "&date=" + date;
  }

  apodLoading.classList.remove("hidden");
  apodImage.classList.add("hidden");

  var httpReq = new XMLHttpRequest();
  httpReq.open("get", url);
  httpReq.responseType = "json";
  httpReq.send();

  httpReq.addEventListener("load", function () {
    if (httpReq.status === 200) {
      showApod(httpReq.response);
    } else {
      console.log("Error:", httpReq.status);
    }

    apodLoading.classList.add("hidden");
    apodImage.classList.remove("hidden");
  });
}

function showApod(data) {
  console.log(data);

  apodImage.src = data.url;
  apodImage.alt = data.title;
  apodTitle.textContent = data.title;
  apodExplanation.textContent = data.explanation;
  apodDate.textContent = "Astronomy Picture of the Day - " + data.date;
  apodDateInfo.textContent = data.date;
  apodMediaType.textContent = data.media_type;

  apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${data.date}`;

  if (data.copyright) {
    apodCopyright.textContent = "© " + data.copyright;
  } else {
    apodCopyright.textContent = "© NASA";
  }
}
getApod();


// ===== الرحلات القادمة =====
var launchesGrid = document.getElementById("launches-grid");
var launchesCount = document.getElementById("launches-count");
var launchesCountMobile = document.getElementById("launches-count-mobile");

function getLaunches() {
  var httpReq = new XMLHttpRequest();
  httpReq.open(
    "get",
    "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
  );
  httpReq.responseType = "json";
  httpReq.send();

  httpReq.addEventListener("load", function () {
    if (httpReq.status >= 200 && httpReq.status < 400) {
      var launches = httpReq.response.results;
      displayLaunches(launches);
    } else {
      console.log("Error:", httpReq.status);
    }
  });
}

// بترجع التاريخ بالشكل: Oct 10, 2026
function formatDate(net) {
  var date = new Date(net);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// بترجع الساعة بالشكل: 23:00 UTC (لو الوقت مؤكد)
function formatTime(launch) {
  if (launch.net_precision) {
    var precision = launch.net_precision.abbrev;
    if (precision === "MIN" || precision === "SEC") {
      return launch.net.split("T")[1].slice(0, 5) + " UTC";
    }
  }
  return "Time TBD";
}

// بترجع لون الـ badge حسب حالة الرحلة
function getStatusClass(abbrev) {
  if (abbrev === "Go") {
    return "bg-green-500";
  } else if (abbrev === "TBC") {
    return "bg-blue-500";
  } else {
    return "bg-slate-700";
  }
}
var featuredLaunch = document.getElementById("featured-launch");

// بتحسب عدد الأيام المتبقية
function getDaysUntil(net) {
  var now = new Date();
  var launchDate = new Date(net);
  var diff = launchDate - now; // الفرق بالمللي ثانية
  var days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    days = 0; // لو الرحلة عدّت نعرض صفر
  }
  return days;
}

// لون نص الحالة (استخدمنا ألوان موجودة في الـ CSS)
function getStatusText(abbrev) {
  if (abbrev === "Go") {
    return "text-green-400";
  } else if (abbrev === "TBC") {
    return "text-blue-400";
  } else {
    return "text-yellow-400";
  }
}

function displayFeatured(launch) {
  var imageSrc = "./assets/images/launch-placeholder.png";
  if (launch.image) {
    imageSrc = launch.image.image_url;
  }

  var description = "No description available.";
  if (launch.mission && launch.mission.description) {
    description = launch.mission.description;
  }

  featuredLaunch.innerHTML = `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i>
                Featured Launch
              </span>
              <span class="px-4 py-1.5 bg-slate-700 ${getStatusText(launch.status.abbrev)} rounded-full text-sm font-semibold">
                ${launch.status.abbrev}
              </span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">${launch.name}</h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${launch.launch_service_provider.name}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${launch.rocket.configuration.name}</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-blue-400"></i>
              <div>
                <p class="text-2xl font-bold text-blue-400">${getDaysUntil(launch.net)}</p>
                <p class="text-xs text-slate-400">Days Until Launch</p>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-calendar"></i>
                  Launch Date
                </p>
                <p class="font-semibold">${formatDate(launch.net)}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-clock"></i>
                  Launch Time
                </p>
                <p class="font-semibold">${formatTime(launch)}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt"></i>
                  Location
                </p>
                <p class="font-semibold text-sm">${launch.pad.location.name}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-globe"></i>
                  Country
                </p>
                <p class="font-semibold">${launch.pad.country.alpha_3_code}</p>
              </div>
            </div>
            <p class="text-slate-300 leading-relaxed mb-6">${description}</p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i>
              View Full Details
            </button>
            <div class="icons self-end md:self-center">
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
              </button>
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
            <img class="absolute inset-0 w-full h-full object-cover" src="${imageSrc}" alt="${launch.name}" onerror="this.src='./assets/images/launch-placeholder.png'" />
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function displayLaunches(launches) {
  var cartona = "";

  for (var i = 1; i < launches.length; i++) {
    var launch = launches[i];

    // لو الرحلة معندهاش صورة نحط الصورة الجاهزة
    var imageSrc = "./assets/images/launch-placeholder.png";
    if (launch.image) {
      imageSrc = launch.image.image_url;
    }

    cartona += `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
        <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
          <img class="w-full h-full object-cover" src="${imageSrc}" alt="${launch.name}" />
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 ${getStatusClass(launch.status.abbrev)} text-white backdrop-blur-sm rounded-full text-xs font-semibold">
              ${launch.status.abbrev}
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              ${launch.name}
            </h4>
            <p class="text-sm text-slate-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launch.launch_service_provider.name}
            </p>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-slate-500 w-4"></i>
              <span class="text-slate-300">${formatDate(launch.net)}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-slate-500 w-4"></i>
              <span class="text-slate-300">${formatTime(launch)}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-slate-500 w-4"></i>
              <span class="text-slate-300">${launch.rocket.configuration.name}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
              <span class="text-slate-300 line-clamp-1">${launch.pad.location.name}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
              Details
            </button>
            <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  displayFeatured(launches[0]);
  launchesGrid.innerHTML = cartona;

  // نحدث العداد اللي في الهيدر
  launchesCount.textContent = launches.length + " Launches";
  launchesCountMobile.textContent = launches.length;
}

getLaunches();

// ===== الكواكب =====
var planetCards = document.querySelectorAll(".planet-card");
var planetsList = []; // هنخزن فيها الكواكب بعد ما توصل من الـ API

function getPlanets() {
  var httpReq = new XMLHttpRequest();
  httpReq.open(
    "get",
    "https://solar-system-opendata-proxy.vercel.app/api/planets"
  );
  httpReq.responseType = "json";
  httpReq.send();

  httpReq.addEventListener("load", function () {
    if (httpReq.status >= 200 && httpReq.status < 400) {
      planetsList = httpReq.response.bodies;
      showPlanet("earth"); // أول ما البيانات توصل نعرض الأرض
    } else {
      console.log("Error:", httpReq.status);
    }
  });
}

// بتدور على الكوكب بالاسم الإنجليزي
function findPlanet(id) {
  for (var i = 0; i < planetsList.length; i++) {
    if (planetsList[i].englishName.toLowerCase() === id) {
      return planetsList[i];
    }
  }
}

// بتحول الرقم لنص مقروء: 6371.0084 -> "6,371"
function formatNumber(num, digits) {
  return num.toLocaleString("en-US", { maximumFractionDigits: digits });
}

// فانكشنز صغيرة بتختصر علينا تكرار getElementById
function setText(id, text) {
  document.getElementById(id).textContent = text;
}

function setHTML(id, html) {
  document.getElementById(id).innerHTML = html;
}

function showPlanet(id) {
  var planet = findPlanet(id);

  if (planet) {
    displayPlanet(planet);
  }
}

function displayPlanet(planet) {
  // الصورة والاسم والوصف
  var image = document.getElementById("planet-detail-image");
  image.src = planet.image;
  image.alt = planet.englishName;
  setText("planet-detail-name", planet.englishName);
  setText("planet-detail-description", planet.description);

  // المربعات الأساسية
  setText("planet-distance", formatNumber(planet.semimajorAxis / 1000000, 1) + "M km");
  setText("planet-radius", formatNumber(planet.meanRadius, 0) + " km");
  setHTML(
    "planet-mass",
    formatNumber(planet.mass.massValue, 2) + " × 10<sup>" + planet.mass.massExponent + "</sup> kg"
  );
  setText("planet-density", formatNumber(planet.density, 2) + " g/cm³");
  setText("planet-orbital-period", formatNumber(planet.sideralOrbit, 0) + " days");
  setText("planet-gravity", formatNumber(planet.gravity, 1) + " m/s²");

  // الدوران: الرقم السالب معناه إن الكوكب بيلف عكس الاتجاه
  var rotation = formatNumber(Math.abs(planet.sideralRotation), 1) + " hours";
  if (planet.sideralRotation < 0) {
    rotation += " (retrograde)";
  }
  setText("planet-rotation", rotation);

  // الأقمار: ممكن تبقى null لو الكوكب ملوش أقمار
  var moonsCount = 0;
  if (planet.moons) {
    moonsCount = planet.moons.length;
  }
  setText("planet-moons", moonsCount);

  // Discovery Info
  if (planet.discoveredBy) {
    setText("planet-discoverer", planet.discoveredBy);
  } else {
    setText("planet-discoverer", "Known since antiquity");
  }

  if (planet.discoveryDate) {
    setText("planet-discovery-date", planet.discoveryDate);
  } else {
    setText("planet-discovery-date", "Ancient");
  }

  setText("planet-body-type", planet.bodyType + " (" + planet.type + ")");
  setHTML(
    "planet-volume",
    formatNumber(planet.vol.volValue, 2) + " × 10<sup>" + planet.vol.volExponent + "</sup> km³"
  );

  // Orbital Characteristics
  setText("planet-perihelion", formatNumber(planet.perihelion / 1000000, 1) + "M km");
  setText("planet-aphelion", formatNumber(planet.aphelion / 1000000, 1) + "M km");
  setText("planet-eccentricity", planet.eccentricity);
  setText("planet-inclination", formatNumber(planet.inclination, 2) + "°");
  setText("planet-axial-tilt", formatNumber(planet.axialTilt, 2) + "°");
  setText("planet-escape", formatNumber(planet.escape / 1000, 1) + " km/s");

  // الحرارة بتيجي بالكلفن، والقيمة 0 معناها إن مفيش بيانات
  if (planet.avgTemp === 0) {
    setText("planet-temp", "N/A");
  } else {
    setText("planet-temp", Math.round(planet.avgTemp - 273.15) + "°C");
  }

  // Quick Facts: بنبنيها من بيانات الكوكب نفسه
  var facts = [
    planet.type + " planet",
    "Number of known moons: " + moonsCount,
    "Gravity is " + formatNumber(planet.gravity / 9.80665, 2) + "× Earth's gravity",
    "One year lasts " + formatNumber(planet.sideralOrbit, 0) + " Earth days",
  ];

  var cartona = "";
  for (var i = 0; i < facts.length; i++) {
    cartona += `
      <li class="flex items-start">
        <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
        <span class="text-slate-300">${facts[i]}</span>
      </li>
    `;
  }
  document.getElementById("planet-facts").innerHTML = cartona;
}

// لما المستخدم يدوس على كارت كوكب
for (var j = 0; j < planetCards.length; j++) {
  planetCards[j].addEventListener("click", function () {
    var id = this.dataset.planetId; // من data-planet-id
    showPlanet(id);
  });
}

getPlanets();