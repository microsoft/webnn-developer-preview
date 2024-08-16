const KNOWN_COMPATIBLE_CHROMIUM_VERSION = {
  'stable-diffusion-1.5': '129.0.6617.0',
  'sd-turbo': '129.0.6617.0',
  'segment-anything': '129.0.6617.0',
  'whisper-base': '129.0.6617.0',
  'image-classification': '129.0.6617.0'
}

export const showCompatibleChromiumVersion = () => {
  const path = location.pathname.toLowerCase();
  const matchingEntry = Object.entries(KNOWN_COMPATIBLE_CHROMIUM_VERSION).find(([key]) => path.includes(key));
  if (matchingEntry) {
    const chromiumVersionElement = document.querySelector('#chromiumversion');
    const [key, version] = matchingEntry;
    chromiumVersionElement.innerHTML = `Known compatible Chromium version: 
      <a href="https://github.com/microsoft/webnn-developer-preview#breaking-changes" title="Known compatible Chromium version">
        ${version} 
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
          <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 
            17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 
            0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 
            227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
      </a>
    `;
  }
}

export const loadScript = async (id, url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = resolve;
    script.onerror = reject;
    script.id = id;
    script.src = url;
    if (url.startsWith("http")) {
      script.crossOrigin = "anonymous";
    }
    document.body.append(script);
  });
};

export const removeElement = async (id) => {
  let el = document.querySelector(id);
  if (el) {
    el.parentNode.removeChild(el);
  }
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getQueryValue = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};

export const getQueryVariable = (name, defaults) => {
  const query = window.location.search.substring(1);
  let vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == name) {
      return pair[1];
    }
  }
  return defaults;
};

export const updateQueryStringParameter = (uri, key, value) => {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
};

export const log = (i) => {
  console.log(i);
  if (getMode()) {
    document.getElementById("status").innerText += `\n[${getTime()}] ${i}`;
  } else {
    document.getElementById("status").innerText += `\n${i}`;
  }
};

export const logError = (i) => {
  console.error(i);
  if (getMode()) {
    document.getElementById("status").innerText += `\n[${getTime()}] ${i}`;
  } else {
    document.getElementById("status").innerText += `\n${i}`;
  }
};

export const randomNumber = () => {
  // generate 6 digital random number between 100, 000 and 999,999
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
};

export const padNumber = (num, fill) => {
  let len = ("" + num).length;
  return Array(fill > len ? fill - len + 1 || 0 : 0).join(0) + num;
};

export const getDateTime = () => {
  let date = new Date(),
    m = padNumber(date.getMonth() + 1, 2),
    d = padNumber(date.getDate(), 2),
    hour = padNumber(date.getHours(), 2),
    min = padNumber(date.getMinutes(), 2),
    sec = padNumber(date.getSeconds(), 2);
  return `${m}/${d} ${hour}:${min}:${sec}`;
};

export const getTime = () => {
  let date = new Date(),
    hour = padNumber(date.getHours(), 2),
    min = padNumber(date.getMinutes(), 2),
    sec = padNumber(date.getSeconds(), 2);
  return `${hour}:${min}:${sec}`;
};

// Get the latest dev version of ONNX Runtime Web dists
const getLatestOrtWebDevVersion = async () => {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/');
    const htmlString = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    let selectElement = doc.querySelector('select.versions.select-css');
    let options = Array.from(selectElement.querySelectorAll('option')).map(
      (option) => option.value
    );
    let filteredOptions = options.filter(item => item.includes('-dev.'));
    return filteredOptions[0].replace('onnxruntime-web@', '');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const ORT_BASE_URL = 'https://www.npmjs.com/package/onnxruntime-web/v/';
const ORT_CDN_URL = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@';
const ortLink = (version) => `${ORT_BASE_URL}${version}?activeTab=versions`;

const loadScriptWithMessage = async (version, url) => {
  try {
    await loadScript('onnxruntime-web', url);
    return `ONNX Runtime Web: <a href="${ortLink(version)}">${version}</a>`;
  } catch (error) {
    console.error('Failed to load ORT script:', error);
    return 'Failed to load ONNX Runtime Web';
  }
};

export const setupORT = async () => {
  const ortVersionElement = document.querySelector('#ortversion');
  removeElement('onnxruntime-web');
  const queryOrt = getQueryValue('ort')?.toLowerCase();
  let versionHtml;
  if (queryOrt?.includes('-dev.')) {
    versionHtml = await loadScriptWithMessage(queryOrt, `${ORT_CDN_URL}${queryOrt}/dist/ort.all.min.js`);
  } else if (queryOrt === 'test') {
    await loadScript('onnxruntime-web', '../../assets/dist/ort.all.min.js');
    versionHtml = 'ONNX Runtime Web: Test version';
  } else {
    const latestVersion = await getLatestOrtWebDevVersion();
    versionHtml = await loadScriptWithMessage(latestVersion, `${ORT_CDN_URL}${latestVersion}/dist/ort.all.min.js`);
  }
  ortVersionElement.innerHTML = versionHtml;
};

export const webNnStatus = async () => {
  let result = {};
  try {
    const context = await navigator.ml.createContext();
    if (context) {
      try {
        const builder = new MLGraphBuilder(context);
        if (builder) {
          result.webnn = true;
          return result;
        } else {
          result.webnn = false;
          return result;
        }
      } catch (e) {
        result.webnn = false;
        result.error = e.message;
        return result;
      }
    } else {
      result.webnn = false;
      return result;
    }
  } catch (ex) {
    result.webnn = false;
    result.error = ex.message;
    return result;
  }
};

export const random = () => {
  return (Math.random() * (1000 - 1) + 1).toFixed(2);
};

export const getMedian = (arr) => {
  const sorted = arr.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2.0);

  if (sorted.length % 2 === 0) {
    return (parseFloat(sorted[middle - 1]) + parseFloat(sorted[middle])) / 2.0;
  } else {
    return parseFloat(sorted[middle].toFixed(2));
  }
};

export const getAverage = (arr) => {
  const avg = arr.reduce((a, b) => a + b) / arr.length;
  return parseFloat(avg).toFixed(2);
}

export const getMinimum = (arr) => {
  const minimum = Math.min(...arr);
  return parseFloat(minimum).toFixed(2);
}

export const asyncErrorHandling = (promise, errorExt) => {
  return promise
    .then(data => [null, data])
    .catch(err => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
      }

      return [err, undefined]
    })
}

export const getMode = () => {
  return (getQueryValue("mode") === "normal") ? false : true;
};