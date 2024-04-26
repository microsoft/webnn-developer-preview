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
  document.getElementById("status").innerText += `\n[${getDateTime()}] ${i}`;
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

export const getOrtDevVersion = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/"
  );
  const htmlString = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  let selectElement = doc.querySelector(".path li");
  selectElement = doc.querySelector("select.versions.select-css");
  const options = Array.from(selectElement.querySelectorAll("option")).map(
    (option) => option.value
  );
  return options[0].replace("onnxruntime-web@", "");
};

export const setupORT = async () => {
  const ortversion = document.querySelector("#ortversion");
  removeElement("onnxruntime-web");
  let ortVersion = await getOrtDevVersion();
  let ortLink = "";
  if (ortVersion && ortVersion.length > 4) {
    await loadScript(
      "onnxruntime-web",
      `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ortVersion}/dist/ort.all.min.js`
    );
    ortLink = `https://www.npmjs.com/package/onnxruntime-web/v/${ortVersion}`;
    ortversion.innerHTML = `ONNX Runtime Web: <a href="${ortLink}">${ortVersion}</a>`;
  } else {
    await loadScript("onnxruntime-web", "../dist/ort.all.min.js");
    ortversion.innerHTML = `ONNX Runtime Web: Test version`;
  }
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