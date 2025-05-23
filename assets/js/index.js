import { $, getWebnnStatus } from "./common_utils.js";

async function webnnChecker() {
    const webnnStatus = await getWebnnStatus();
    const status = $("#log");
    const browser = $("#browser");
    const chromium = $("#chromium");
    const webnn = $("#webnn");
    const message = $("#message");
    let isEdge = false;
    if (navigator.userAgentData) {
        navigator.userAgentData.getHighEntropyValues(["fullVersionList"]).then(ua => {
            for (let i of ua.fullVersionList) {
                if (i.brand.toLowerCase().indexOf("brand") === -1) {
                    if (i.brand.toLowerCase().indexOf("chromium") > -1) {
                        chromium.innerHTML = `<span class="name">${i.brand}</span> <span class="value">${i.version}<span>`;
                    } else {
                        browser.innerHTML = `<span class="name">${i.brand}</span> <span class="value">${i.version}<span>`;
                    }
                    if (i.brand.toLowerCase().indexOf("edge") > -1) {
                        isEdge = true;
                    }
                }
            }
            if (!webnnStatus.webnn) {
                status.setAttribute("class", "red");
                webnn.innerHTML = "Not Supported";
                if (isEdge) {
                    message.innerHTML = `<a href="../../install.html" title="WebNN Installation Guide">Installation Guide</a>`;
                } else {
                    message.innerHTML = `<a href="https://github.com/webmachinelearning/webnn-samples/#webnn-installation-guides" title="WebNN Installation Guide for Non-Edge Browsers">Installation Guide for Non-Edge Browsers</a>`;
                }
            } else {
                webnn.innerHTML = "Supported";
            }
        });
    } else {
        status.setAttribute("class", "red");
        status.innerHTML = `<a href="https://github.com/webmachinelearning/webnn-samples/#webnn-installation-guides" title="WebNN Installation Guide for Non-Edge Browsers">WebNN Installation Guide for Non-Edge Browsers</a>`;
    }
}

function updateDeviceTypeLinks() {
    const npuLinks = document.querySelectorAll(".npu_link");
    npuLinks.forEach(link => {
        link.setAttribute("class", "npu_link");
    });
}

async function ui() {
    updateDeviceTypeLinks();
    await webnnChecker();
}

document.addEventListener("DOMContentLoaded", ui, false);
