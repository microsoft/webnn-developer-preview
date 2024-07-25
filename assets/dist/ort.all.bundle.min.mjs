/*!
 * ONNX Runtime Web v1.19.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var J0=Object.create;var bo=Object.defineProperty;var Q0=Object.getOwnPropertyDescriptor;var ev=Object.getOwnPropertyNames;var tv=Object.getPrototypeOf,rv=Object.prototype.hasOwnProperty;var Ta=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(e,n)=>(typeof require<"u"?require:e)[n]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var C=(r,e)=>()=>(r&&(e=r(r=0)),e);var Je=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),sn=(r,e)=>{for(var n in e)bo(r,n,{get:e[n],enumerable:!0})},Fl=(r,e,n,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ev(e))!rv.call(r,o)&&o!==n&&bo(r,o,{get:()=>e[o],enumerable:!(t=Q0(e,o))||t.enumerable});return r};var un=(r,e,n)=>(n=r!=null?J0(tv(r)):{},Fl(e||!r||!r.__esModule?bo(n,"default",{value:r,enumerable:!0}):n,r)),Pn=r=>Fl(bo({},"__esModule",{value:!0}),r);var yo,Dr,vr,nv,xo,vo=C(()=>{"use strict";yo=new Map,Dr=[],vr=(r,e,n)=>{if(e&&typeof e.init=="function"&&typeof e.createInferenceSessionHandler=="function"){let t=yo.get(r);if(t===void 0)yo.set(r,{backend:e,priority:n});else{if(t.priority>n)return;if(t.priority===n&&t.backend!==e)throw new Error(`cannot register backend "${r}" using priority ${n}`)}if(n>=0){let o=Dr.indexOf(r);o!==-1&&Dr.splice(o,1);for(let i=0;i<Dr.length;i++)if(yo.get(Dr[i]).priority<=n){Dr.splice(i,0,r);return}Dr.push(r)}return}throw new TypeError("not a valid backend")},nv=async r=>{let e=yo.get(r);if(!e)return"backend not found.";if(e.initialized)return e.backend;if(e.aborted)return e.error;{let n=!!e.initPromise;try{return n||(e.initPromise=e.backend.init(r)),await e.initPromise,e.initialized=!0,e.backend}catch(t){return n||(e.error=`${t}`,e.aborted=!0),e.error}finally{delete e.initPromise}}},xo=async r=>{let e=r.executionProviders||[],n=e.map(u=>typeof u=="string"?u:u.name),t=n.length===0?Dr:n,o,i=[],s=new Set;for(let u of t){let l=await nv(u);typeof l=="string"?i.push({name:u,err:l}):(o||(o=l),o===l&&s.add(u))}if(!o)throw new Error(`no available backend found. ERR: ${i.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:l}of i)n.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${l}`);let a=e.filter(u=>s.has(typeof u=="string"?u:u.name));return[o,new Proxy(r,{get:(u,l)=>l==="executionProviders"?a:Reflect.get(u,l)})]}});var Ml=C(()=>{"use strict";vo()});var Vl,Gl=C(()=>{"use strict";Vl="1.19.0"});var Ul,It,_a=C(()=>{"use strict";Gl();Ul="warning",It={wasm:{},webgl:{},webgpu:{},versions:{common:Vl},set logLevel(r){if(r!==void 0){if(typeof r!="string"||["verbose","info","warning","error","fatal"].indexOf(r)===-1)throw new Error(`Unsupported logging level: ${r}`);Ul=r}},get logLevel(){return Ul}};Object.defineProperty(It,"logLevel",{enumerable:!0})});var le,Wl=C(()=>{"use strict";_a();le=It});var Hl,ql,Kl=C(()=>{"use strict";Hl=(r,e)=>{let n=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);n.width=r.dims[3],n.height=r.dims[2];let t=n.getContext("2d");if(t!=null){let o,i;e?.tensorLayout!==void 0&&e.tensorLayout==="NHWC"?(o=r.dims[2],i=r.dims[3]):(o=r.dims[3],i=r.dims[2]);let s=e?.format!==void 0?e.format:"RGB",a=e?.norm,u,l;a===void 0||a.mean===void 0?u=[255,255,255,255]:typeof a.mean=="number"?u=[a.mean,a.mean,a.mean,a.mean]:(u=[a.mean[0],a.mean[1],a.mean[2],0],a.mean[3]!==void 0&&(u[3]=a.mean[3])),a===void 0||a.bias===void 0?l=[0,0,0,0]:typeof a.bias=="number"?l=[a.bias,a.bias,a.bias,a.bias]:(l=[a.bias[0],a.bias[1],a.bias[2],0],a.bias[3]!==void 0&&(l[3]=a.bias[3]));let f=i*o,c=0,p=f,b=f*2,h=-1;s==="RGBA"?(c=0,p=f,b=f*2,h=f*3):s==="RGB"?(c=0,p=f,b=f*2):s==="RBG"&&(c=0,b=f,p=f*2);for(let g=0;g<i;g++)for(let T=0;T<o;T++){let w=(r.data[c++]-l[0])*u[0],v=(r.data[p++]-l[1])*u[1],S=(r.data[b++]-l[2])*u[2],$=h===-1?255:(r.data[h++]-l[3])*u[3];t.fillStyle="rgba("+w+","+v+","+S+","+$+")",t.fillRect(T,g,1,1)}if("toDataURL"in n)return n.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},ql=(r,e)=>{let n=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),t;if(n!=null){let o,i,s;e?.tensorLayout!==void 0&&e.tensorLayout==="NHWC"?(o=r.dims[2],i=r.dims[1],s=r.dims[3]):(o=r.dims[3],i=r.dims[2],s=r.dims[1]);let a=e!==void 0&&e.format!==void 0?e.format:"RGB",u=e?.norm,l,f;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?f=[0,0,0,0]:typeof u.bias=="number"?f=[u.bias,u.bias,u.bias,u.bias]:(f=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(f[3]=u.bias[3]));let c=i*o;if(e!==void 0&&(e.format!==void 0&&s===4&&e.format!=="RGBA"||s===3&&e.format!=="RGB"&&e.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let p=4,b=0,h=1,g=2,T=3,w=0,v=c,S=c*2,$=-1;a==="RGBA"?(w=0,v=c,S=c*2,$=c*3):a==="RGB"?(w=0,v=c,S=c*2):a==="RBG"&&(w=0,S=c,v=c*2),t=n.createImageData(o,i);for(let P=0;P<i*o;b+=p,h+=p,g+=p,T+=p,P++)t.data[b]=(r.data[w++]-f[0])*l[0],t.data[h]=(r.data[v++]-f[1])*l[1],t.data[g]=(r.data[S++]-f[2])*l[2],t.data[T]=$===-1?255:(r.data[$++]-f[3])*l[3]}else throw new Error("Can not access image data");return t}});var Ia,jl,Xl,Zl,Yl,Jl=C(()=>{"use strict";wo();Ia=(r,e)=>{if(r===void 0)throw new Error("Image buffer must be defined");if(e.height===void 0||e.width===void 0)throw new Error("Image height and width must be defined");if(e.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:n,width:t}=e,o=e.norm??{mean:255,bias:0},i,s;typeof o.mean=="number"?i=[o.mean,o.mean,o.mean,o.mean]:i=[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],typeof o.bias=="number"?s=[o.bias,o.bias,o.bias,o.bias]:s=[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];let a=e.format!==void 0?e.format:"RGBA",u=e.tensorFormat!==void 0&&e.tensorFormat!==void 0?e.tensorFormat:"RGB",l=n*t,f=u==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),c=4,p=0,b=1,h=2,g=3,T=0,w=l,v=l*2,S=-1;a==="RGB"&&(c=3,p=0,b=1,h=2,g=-1),u==="RGBA"?S=l*3:u==="RBG"?(T=0,v=l,w=l*2):u==="BGR"&&(v=0,w=l,T=l*2);for(let P=0;P<l;P++,p+=c,h+=c,b+=c,g+=c)f[T++]=(r[p]+s[0])/i[0],f[w++]=(r[b]+s[1])/i[1],f[v++]=(r[h]+s[2])/i[2],S!==-1&&g!==-1&&(f[S++]=(r[g]+s[3])/i[3]);return u==="RGBA"?new ht("float32",f,[1,4,n,t]):new ht("float32",f,[1,3,n,t])},jl=async(r,e)=>{let n=typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement,t=typeof ImageData<"u"&&r instanceof ImageData,o=typeof ImageBitmap<"u"&&r instanceof ImageBitmap,i=typeof r=="string",s,a=e??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=f=>f instanceof HTMLCanvasElement||f instanceof OffscreenCanvas?f.getContext("2d"):null;if(n){let f=u();f.width=r.width,f.height=r.height;let c=l(f);if(c!=null){let p=r.height,b=r.width;if(e!==void 0&&e.resizedHeight!==void 0&&e.resizedWidth!==void 0&&(p=e.resizedHeight,b=e.resizedWidth),e!==void 0){if(a=e,e.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");a.tensorFormat="RGBA",a.height=p,a.width=b}else a.tensorFormat="RGBA",a.height=p,a.width=b;c.drawImage(r,0,0),s=c.getImageData(0,0,b,p).data}else throw new Error("Can not access image data")}else if(t){let f,c;if(e!==void 0&&e.resizedWidth!==void 0&&e.resizedHeight!==void 0?(f=e.resizedHeight,c=e.resizedWidth):(f=r.height,c=r.width),e!==void 0&&(a=e),a.format="RGBA",a.height=f,a.width=c,e!==void 0){let p=u();p.width=c,p.height=f;let b=l(p);if(b!=null)b.putImageData(r,0,0),s=b.getImageData(0,0,c,f).data;else throw new Error("Can not access image data")}else s=r.data}else if(o){if(e===void 0)throw new Error("Please provide image config with format for Imagebitmap");let f=u();f.width=r.width,f.height=r.height;let c=l(f);if(c!=null){let p=r.height,b=r.width;return c.drawImage(r,0,0,b,p),s=c.getImageData(0,0,b,p).data,a.height=p,a.width=b,Ia(s,a)}else throw new Error("Can not access image data")}else{if(i)return new Promise((f,c)=>{let p=u(),b=l(p);if(!r||!b)return c();let h=new Image;h.crossOrigin="Anonymous",h.src=r,h.onload=()=>{p.width=h.width,p.height=h.height,b.drawImage(h,0,0,p.width,p.height);let g=b.getImageData(0,0,p.width,p.height);a.height=p.height,a.width=p.width,f(Ia(g.data,a))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Ia(s,a);throw new Error("Input data provided is not supported - aborted tensor creation")},Xl=(r,e)=>{let{width:n,height:t,download:o,dispose:i}=e,s=[1,t,n,4];return new ht({location:"texture",type:"float32",texture:r,dims:s,download:o,dispose:i})},Zl=(r,e)=>{let{dataType:n,dims:t,download:o,dispose:i}=e;return new ht({location:"gpu-buffer",type:n??"float32",gpuBuffer:r,dims:t,download:o,dispose:i})},Yl=(r,e,n)=>new ht({location:"cpu-pinned",type:r,data:e,dims:n??[e.length]})});var Br,On,Ql,ec,tc=C(()=>{"use strict";Br=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array]]),On=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Ql=!1,ec=()=>{if(!Ql){Ql=!0;let r=typeof BigInt64Array<"u"&&BigInt64Array.from,e=typeof BigUint64Array<"u"&&BigUint64Array.from,n=typeof Float16Array<"u"&&Float16Array.from;r&&(Br.set("int64",BigInt64Array),On.set(BigInt64Array,"int64")),e&&(Br.set("uint64",BigUint64Array),On.set(BigUint64Array,"uint64")),n?(Br.set("float16",Float16Array),On.set(Float16Array,"float16")):Br.set("float16",Uint16Array)}}});var rc,nc,oc=C(()=>{"use strict";wo();rc=r=>{let e=1;for(let n=0;n<r.length;n++){let t=r[n];if(typeof t!="number"||!Number.isSafeInteger(t))throw new TypeError(`dims[${n}] must be an integer, got: ${t}`);if(t<0)throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${t}`);e*=t}return e},nc=(r,e)=>{switch(r.location){case"cpu":return new ht(r.type,r.data,e);case"cpu-pinned":return new ht({location:"cpu-pinned",data:r.data,type:r.type,dims:e});case"texture":return new ht({location:"texture",texture:r.texture,type:r.type,dims:e});case"gpu-buffer":return new ht({location:"gpu-buffer",gpuBuffer:r.gpuBuffer,type:r.type,dims:e});default:throw new Error(`tensorReshape: tensor location ${r.location} is not supported`)}}});var ht,wo=C(()=>{"use strict";Kl();Jl();tc();oc();ht=class{constructor(e,n,t){ec();let o,i;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,o=e.type,i=e.dims,e.location){case"cpu-pinned":{let a=Br.get(o);if(!a)throw new TypeError(`unsupported type "${o}" to create tensor from pinned buffer`);if(!(e.data instanceof a))throw new TypeError(`buffer should be of type ${a.name}`);this.cpuData=e.data;break}case"texture":{if(o!=="float32")throw new TypeError(`unsupported type "${o}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(o!=="float32"&&o!=="float16"&&o!=="int32"&&o!=="int64"&&o!=="uint32"&&o!=="uint8"&&o!=="bool")throw new TypeError(`unsupported type "${o}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,u;if(typeof e=="string")if(o=e,u=t,e==="string"){if(!Array.isArray(n))throw new TypeError("A string tensor's data must be a string array.");a=n}else{let l=Br.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(n)){if(e==="float16"&&l===Uint16Array)throw new TypeError("Creating a float16 tensor from number array is not supported. Please use Uint16Array as data.");e==="uint64"||e==="int64"?a=l.from(n,BigInt):a=l.from(n)}else if(n instanceof l)a=n;else throw new TypeError(`A ${o} tensor's data must be type of ${l}`)}else if(u=n,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")o="string",a=e;else if(l==="boolean")o="bool",a=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else{let l=On.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);o=l,a=e}if(u===void 0)u=[a.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");i=u,this.cpuData=a,this.dataLocation="cpu"}let s=rc(i);if(this.cpuData&&s!==this.cpuData.length)throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=o,this.dims=i,this.size=s}static async fromImage(e,n){return jl(e,n)}static fromTexture(e,n){return Xl(e,n)}static fromGpuBuffer(e,n){return Zl(e,n)}static fromPinnedBuffer(e,n,t){return Yl(e,n,t)}toDataURL(e){return Hl(this,e)}toImageData(e){return ql(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let n=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=n,e&&this.disposer&&(this.disposer(),this.disposer=void 0),n}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return nc(this,e)}}});var it,To=C(()=>{"use strict";wo();it=ht});var _o,ic,St,yt,Sa=C(()=>{"use strict";_a();_o=(r,e)=>{(typeof It.trace>"u"?!It.wasm.trace:!It.trace)||console.timeStamp(`${r}::ORT::${e}`)},ic=(r,e)=>{let n=new Error().stack?.split(/\r\n|\r|\n/g)||[],t=!1;for(let o=0;o<n.length;o++){if(t&&!n[o].includes("TRACE_FUNC")){let i=`FUNC_${r}::${n[o].trim().split(" ")[1]}`;e&&(i+=`::${e}`),_o("CPU",i);return}n[o].includes("TRACE_FUNC")&&(t=!0)}},St=r=>{(typeof It.trace>"u"?!It.wasm.trace:!It.trace)||ic("BEGIN",r)},yt=r=>{(typeof It.trace>"u"?!It.wasm.trace:!It.trace)||ic("END",r)}});var Io,ac=C(()=>{"use strict";vo();To();Sa();Io=class r{constructor(e){this.handler=e}async run(e,n,t){St();let o={},i={};if(typeof e!="object"||e===null||e instanceof it||Array.isArray(e))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof n=="object"){if(n===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(n instanceof it)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(n)){if(n.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let l of n){if(typeof l!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(l)===-1)throw new RangeError(`'fetches' contains invalid output name: ${l}.`);o[l]=null}if(typeof t=="object"&&t!==null)i=t;else if(typeof t<"u")throw new TypeError("'options' must be an object.")}else{let l=!1,f=Object.getOwnPropertyNames(n);for(let c of this.outputNames)if(f.indexOf(c)!==-1){let p=n[c];(p===null||p instanceof it)&&(l=!0,s=!1,o[c]=p)}if(l){if(typeof t=="object"&&t!==null)i=t;else if(typeof t<"u")throw new TypeError("'options' must be an object.")}else i=n}}else if(typeof n<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let l of this.inputNames)if(typeof e[l]>"u")throw new Error(`input '${l}' is missing in 'feeds'.`);if(s)for(let l of this.outputNames)o[l]=null;let a=await this.handler.run(e,o,i),u={};for(let l in a)if(Object.hasOwnProperty.call(a,l)){let f=a[l];f instanceof it?u[l]=f:u[l]=new it(f.type,f.data,f.dims)}return yt(),u}async release(){return this.handler.dispose()}static async create(e,n,t,o){St();let i,s={};if(typeof e=="string"){if(i=e,typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(e instanceof Uint8Array){if(i=e,typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(e instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&e instanceof SharedArrayBuffer){let f=e,c=0,p=e.byteLength;if(typeof n=="object"&&n!==null)s=n;else if(typeof n=="number"){if(c=n,!Number.isSafeInteger(c))throw new RangeError("'byteOffset' must be an integer.");if(c<0||c>=f.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${f.byteLength}).`);if(p=e.byteLength-c,typeof t=="number"){if(p=t,!Number.isSafeInteger(p))throw new RangeError("'byteLength' must be an integer.");if(p<=0||c+p>f.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${f.byteLength-c}].`);if(typeof o=="object"&&o!==null)s=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(typeof t<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof n<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(f,c,p)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[a,u]=await xo(s),l=await a.createInferenceSessionHandler(i,u);return yt(),new r(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}}});var ov,sc=C(()=>{"use strict";ac();ov=Io});var uc=C(()=>{"use strict"});var lc=C(()=>{"use strict"});var cc=C(()=>{"use strict"});var fc=C(()=>{"use strict"});var iv,So,dc=C(()=>{"use strict";vo();To();iv="Training backend could not be resolved. Make sure you're using the correct configuration & WebAssembly files.",So=class r{constructor(e,n,t){this.handler=e,this.hasOptimizerModel=n,this.hasEvalModel=t}get trainingInputNames(){return this.handler.inputNames}get trainingOutputNames(){return this.handler.outputNames}get evalInputNames(){if(this.hasEvalModel)return this.handler.evalInputNames;throw new Error("This training session has no evalModel loaded.")}get evalOutputNames(){if(this.hasEvalModel)return this.handler.evalOutputNames;throw new Error("This training session has no evalModel loaded.")}static async create(e,n){let t=e.evalModel||"",o=e.optimizerModel||"",i=n||{},[s,a]=await xo(i);if(s.createTrainingSessionHandler){let u=await s.createTrainingSessionHandler(e.checkpointState,e.trainModel,t,o,a);return new r(u,!!e.optimizerModel,!!e.evalModel)}else throw new Error(iv)}typeNarrowingForRunStep(e,n,t,o,i){let s={},a={};if(typeof t!="object"||t===null||t instanceof it||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let u=!0;if(typeof o=="object"){if(o===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(o instanceof it)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(o)){if(o.length===0)throw new TypeError("'fetches' cannot be an empty array.");u=!1;for(let l of o){if(typeof l!="string")throw new TypeError("'fetches' must be a string array or an object.");if(n.indexOf(l)===-1)throw new RangeError(`'fetches' contains invalid output name: ${l}.`);s[l]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let l=!1,f=Object.getOwnPropertyNames(o);for(let c of n)if(f.indexOf(c)!==-1){let p=o[c];(p===null||p instanceof it)&&(l=!0,u=!1,s[c]=p)}if(l){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=o}}else if(typeof o<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let l of e)if(typeof t[l]>"u")throw new Error(`input '${l}' is missing in 'feeds'.`);if(u)for(let l of n)s[l]=null;return[s,a]}convertHandlerReturnTypeToMapOfTensors(e){let n={};for(let t in e)if(Object.hasOwnProperty.call(e,t)){let o=e[t];o instanceof it?n[t]=o:n[t]=new it(o.type,o.data,o.dims)}return n}async lazyResetGrad(){await this.handler.lazyResetGrad()}async runTrainStep(e,n,t){let[o,i]=this.typeNarrowingForRunStep(this.trainingInputNames,this.trainingOutputNames,e,n,t),s=await this.handler.runTrainStep(e,o,i);return this.convertHandlerReturnTypeToMapOfTensors(s)}async runOptimizerStep(e){if(this.hasOptimizerModel)await this.handler.runOptimizerStep(e||{});else throw new Error("This TrainingSession has no OptimizerModel loaded.")}async runEvalStep(e,n,t){if(this.hasEvalModel){let[o,i]=this.typeNarrowingForRunStep(this.evalInputNames,this.evalOutputNames,e,n,t),s=await this.handler.runEvalStep(e,o,i);return this.convertHandlerReturnTypeToMapOfTensors(s)}else throw new Error("This TrainingSession has no EvalModel loaded.")}async getParametersSize(e=!0){return this.handler.getParametersSize(e)}async loadParametersBuffer(e,n=!0){let t=await this.getParametersSize(n);if(e.length!==4*t)throw new Error("Size of the buffer passed into loadParametersBuffer must match the number of parameters in the model. Please use getParametersSize method to check.");return this.handler.loadParametersBuffer(e,n)}async getContiguousParameters(e=!0){return this.handler.getContiguousParameters(e)}async release(){return this.handler.dispose()}}});var av,pc=C(()=>{"use strict";dc();av=So});var $a={};sn($a,{InferenceSession:()=>ov,TRACE:()=>_o,TRACE_FUNC_BEGIN:()=>St,TRACE_FUNC_END:()=>yt,Tensor:()=>it,TrainingSession:()=>av,env:()=>le,registerBackend:()=>vr});var ft=C(()=>{"use strict";Ml();Wl();sc();To();uc();lc();Sa();cc();fc();pc()});function wr(r,e,n,t){if(e===void 0)return uv(r);if(n===void 0)$o(r,e,1);else if(typeof n=="number"&&t===void 0)$o(r,e,n);else if(typeof n=="string"&&t===void 0)$o(r,n,1,e);else if(typeof n=="string"&&typeof t=="number")$o(r,n,t,e);else throw new TypeError("input is valid")}function uv(r){return{verbose:wr.verbose.bind(null,r),info:wr.info.bind(null,r),warning:wr.warning.bind(null,r),error:wr.error.bind(null,r),fatal:wr.fatal.bind(null,r)}}function $o(r,e,n,t){let o=En[t||""]||En[""];hc[r]<hc[o.minimalSeverity]||(o.logDateTime&&(e=`${new Date().toISOString()}|${e}`),o.logSourceLocation,sv[o.provider].log(r,e,t))}var Aa,Pa,hc,sv,gc,En,Re,Po,Oo,Eo,Ao,Pt=C(()=>{"use strict";Aa=class{log(e,n,t){}},Pa=class{log(e,n,t){console.log(`${this.color(e)} ${t?"\x1B[35m"+t+"\x1B[0m ":""}${n}`)}color(e){switch(e){case"verbose":return"\x1B[34;40mv\x1B[0m";case"info":return"\x1B[32mi\x1B[0m";case"warning":return"\x1B[30;43mw\x1B[0m";case"error":return"\x1B[31;40me\x1B[0m";case"fatal":return"\x1B[101mf\x1B[0m";default:throw new Error(`unsupported severity: ${e}`)}}},hc={verbose:1e3,info:2e3,warning:4e3,error:5e3,fatal:6e3},sv={none:new Aa,console:new Pa},gc={provider:"console",minimalSeverity:"warning",logDateTime:!0,logSourceLocation:!1},En={"":gc};(u=>{function r(l,f){u("verbose",l,f)}u.verbose=r;function e(l,f){u("info",l,f)}u.info=e;function n(l,f){u("warning",l,f)}u.warning=n;function t(l,f){u("error",l,f)}u.error=t;function o(l,f){u("fatal",l,f)}u.fatal=o;function i(l){En={},s("",l||{})}u.reset=i;function s(l,f){if(l==="*")i(f);else{let c=En[l]||gc;En[l]={provider:f.provider||c.provider,minimalSeverity:f.minimalSeverity||c.minimalSeverity,logDateTime:f.logDateTime===void 0?c.logDateTime:f.logDateTime,logSourceLocation:f.logSourceLocation===void 0?c.logSourceLocation:f.logSourceLocation}}}u.set=s;function a(l){let f={};l.logLevel&&(f.minimalSeverity=l.logLevel),s("",f)}u.setWithEnv=a})(wr||={});Re=wr,Po=class{constructor(e,n,t,o,i,s){this.category=e;this.name=n;this.startTime=t;this.endCallback=o;this.timer=i;this.ctx=s}async end(){return this.endCallback(this)}async checkTimer(){if(this.ctx===void 0||this.timer===void 0)throw new Error("No webgl timer found");return this.ctx.endTimer(),this.ctx.waitForQueryAndGetTime(this.timer)}},Oo=class{constructor(e,n,t,o){this.category=e;this.name=n;this.startTime=t;this.endTime=o}},Eo=class{constructor(e,n,t){this._started=!1;this._flushPointer=0;this._started=!1,this._maxNumberEvents=e===void 0?1e4:e,this._flushBatchSize=n===void 0?10:n,this._flushIntervalInMilliseconds=t===void 0?5e3:t}static create(e){return e===void 0?new this:new this(e.maxNumberEvents,e.flushBatchSize,e.flushIntervalInMilliseconds)}start(){this._started=!0,this._timingEvents=[],this._flushTime=Ao(),this._flushPointer=0}stop(){for(this._started=!1;this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer])}event(e,n,t,o){let i=this._started?this.begin(e,n,o):void 0,s=!1,a=t();if(a&&typeof a.then=="function")return s=!0,new Promise((u,l)=>{a.then(async f=>{i&&await i.end(),u(f)},async f=>{i&&await i.end(),l(f)})});if(!s&&i){let u=i.end();if(u&&typeof u.then=="function")return new Promise((l,f)=>{u.then(()=>{l(a)},c=>{f(c)})})}return a}begin(e,n,t){if(!this._started)throw new Error("profiler is not started yet");if(t===void 0){let o=Ao();return this.flush(o),new Po(e,n,o,i=>this.endSync(i))}else{let o=t.beginTimer();return new Po(e,n,0,async i=>this.end(i),o,t)}}async end(e){let n=await e.checkTimer();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new Oo(e.category,e.name,e.startTime,n)),this.flush(n))}endSync(e){let n=Ao();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new Oo(e.category,e.name,e.startTime,n)),this.flush(n))}logOneEvent(e){Re.verbose(`Profiler.${e.category}`,`${(e.endTime-e.startTime).toFixed(2)}ms on event '${e.name}' at ${e.endTime.toFixed(2)}`)}flush(e){if(this._timingEvents.length-this._flushPointer>=this._flushBatchSize||e-this._flushTime>=this._flushIntervalInMilliseconds){for(let n=this._flushPointer;this._flushPointer<n+this._flushBatchSize&&this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer]);this._flushTime=Ao()}}get started(){return this._started}},Ao=typeof performance<"u"&&performance.now?()=>performance.now():Date.now});function bc(r,e,n){for(let t of n){let o=t[0],i=t[1],s=t[2],a=t[3],u=t[4];if(r.opType===o){for(let l of e)if((l.domain===i||l.domain==="ai.onnx"&&i==="")&&lv(l.version,s))return{opImpl:a,opInit:u}}}throw new TypeError(`cannot resolve operator '${r.opType}' with opsets: ${e.map(t=>`${t.domain||"ai.onnx"} v${t.version}`).join(", ")}`)}function lv(r,e){if(e.endsWith("+")){let n=Number.parseInt(e.substring(0,e.length-1),10);return!isNaN(n)&&n<=r}else if(e.split("-").length===2){let n=e.split("-"),t=Number.parseInt(n[0],10),o=Number.parseInt(n[1],10);return!isNaN(t)&&!isNaN(o)&&t<=r&&r<=o}else return Number.parseInt(e,10)===r}var yc=C(()=>{"use strict"});var xc=Je(Oa=>{"use strict";Oa.__esModule=!0;var cv=function(){function r(e){if(!e)throw new TypeError("Invalid argument; `value` has no value.");this.value=r.EMPTY,e&&r.isGuid(e)&&(this.value=e)}return r.isGuid=function(e){var n=e.toString();return e&&(e instanceof r||r.validator.test(n))},r.create=function(){return new r([r.gen(2),r.gen(1),r.gen(1),r.gen(1),r.gen(3)].join("-"))},r.createEmpty=function(){return new r("emptyguid")},r.parse=function(e){return new r(e)},r.raw=function(){return[r.gen(2),r.gen(1),r.gen(1),r.gen(1),r.gen(3)].join("-")},r.gen=function(e){for(var n="",t=0;t<e;t++)n+=((1+Math.random())*65536|0).toString(16).substring(1);return n},r.prototype.equals=function(e){return r.isGuid(e)&&this.value===e.toString()},r.prototype.isEmpty=function(){return this.value===r.EMPTY},r.prototype.toString=function(){return this.value},r.prototype.toJSON=function(){return{value:this.value}},r.validator=new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$","i"),r.EMPTY="00000000-0000-0000-0000-000000000000",r}();Oa.Guid=cv});function Me(r,e,n){this.low=r|0,this.high=e|0,this.unsigned=!!n}function dt(r){return(r&&r.__isLong__)===!0}function vc(r){var e=Math.clz32(r&-r);return r?31-e:e}function Lr(r,e){var n,t,o;return e?(r>>>=0,(o=0<=r&&r<256)&&(t=Tc[r],t)?t:(n=ke(r,0,!0),o&&(Tc[r]=n),n)):(r|=0,(o=-128<=r&&r<128)&&(t=wc[r],t)?t:(n=ke(r,r<0?-1:0,!1),o&&(wc[r]=n),n))}function Et(r,e){if(isNaN(r))return e?fr:Nt;if(e){if(r<0)return fr;if(r>=$c)return Oc}else{if(r<=-Ic)return xt;if(r+1>=Ic)return Pc}return r<0?Et(-r,e).neg():ke(r%cn|0,r/cn|0,e)}function ke(r,e,n){return new Me(r,e,n)}function Ca(r,e,n){if(r.length===0)throw Error("empty string");if(typeof e=="number"?(n=e,e=!1):e=!!e,r==="NaN"||r==="Infinity"||r==="+Infinity"||r==="-Infinity")return e?fr:Nt;if(n=n||10,n<2||36<n)throw RangeError("radix");var t;if((t=r.indexOf("-"))>0)throw Error("interior hyphen");if(t===0)return Ca(r.substring(1),e,n).neg();for(var o=Et(Co(n,8)),i=Nt,s=0;s<r.length;s+=8){var a=Math.min(8,r.length-s),u=parseInt(r.substring(s,s+a),n);if(a<8){var l=Et(Co(n,a));i=i.mul(l).add(Et(u))}else i=i.mul(o),i=i.add(Et(u))}return i.unsigned=e,i}function zt(r,e){return typeof r=="number"?Et(r,e):typeof r=="string"?Ca(r,e):ke(r.low,r.high,typeof e=="boolean"?e:r.unsigned)}var Ot,wc,Tc,Co,_c,fv,cn,$c,Ic,Sc,Nt,fr,ln,Ac,Ea,Pc,Oc,xt,U,dr,ka=C(()=>{Ot=null;try{Ot=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}Me.prototype.__isLong__;Object.defineProperty(Me.prototype,"__isLong__",{value:!0});Me.isLong=dt;wc={},Tc={};Me.fromInt=Lr;Me.fromNumber=Et;Me.fromBits=ke;Co=Math.pow;Me.fromString=Ca;Me.fromValue=zt;_c=65536,fv=1<<24,cn=_c*_c,$c=cn*cn,Ic=$c/2,Sc=Lr(fv),Nt=Lr(0);Me.ZERO=Nt;fr=Lr(0,!0);Me.UZERO=fr;ln=Lr(1);Me.ONE=ln;Ac=Lr(1,!0);Me.UONE=Ac;Ea=Lr(-1);Me.NEG_ONE=Ea;Pc=ke(-1,2147483647,!1);Me.MAX_VALUE=Pc;Oc=ke(-1,-1,!0);Me.MAX_UNSIGNED_VALUE=Oc;xt=ke(0,-2147483648,!1);Me.MIN_VALUE=xt;U=Me.prototype;U.toInt=function(){return this.unsigned?this.low>>>0:this.low};U.toNumber=function(){return this.unsigned?(this.high>>>0)*cn+(this.low>>>0):this.high*cn+(this.low>>>0)};U.toString=function(e){if(e=e||10,e<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(xt)){var n=Et(e),t=this.div(n),o=t.mul(n).sub(this);return t.toString(e)+o.toInt().toString(e)}else return"-"+this.neg().toString(e);for(var i=Et(Co(e,6),this.unsigned),s=this,a="";;){var u=s.div(i),l=s.sub(u.mul(i)).toInt()>>>0,f=l.toString(e);if(s=u,s.isZero())return f+a;for(;f.length<6;)f="0"+f;a=""+f+a}};U.getHighBits=function(){return this.high};U.getHighBitsUnsigned=function(){return this.high>>>0};U.getLowBits=function(){return this.low};U.getLowBitsUnsigned=function(){return this.low>>>0};U.getNumBitsAbs=function(){if(this.isNegative())return this.eq(xt)?64:this.neg().getNumBitsAbs();for(var e=this.high!=0?this.high:this.low,n=31;n>0&&!(e&1<<n);n--);return this.high!=0?n+33:n+1};U.isZero=function(){return this.high===0&&this.low===0};U.eqz=U.isZero;U.isNegative=function(){return!this.unsigned&&this.high<0};U.isPositive=function(){return this.unsigned||this.high>=0};U.isOdd=function(){return(this.low&1)===1};U.isEven=function(){return(this.low&1)===0};U.equals=function(e){return dt(e)||(e=zt(e)),this.unsigned!==e.unsigned&&this.high>>>31===1&&e.high>>>31===1?!1:this.high===e.high&&this.low===e.low};U.eq=U.equals;U.notEquals=function(e){return!this.eq(e)};U.neq=U.notEquals;U.ne=U.notEquals;U.lessThan=function(e){return this.comp(e)<0};U.lt=U.lessThan;U.lessThanOrEqual=function(e){return this.comp(e)<=0};U.lte=U.lessThanOrEqual;U.le=U.lessThanOrEqual;U.greaterThan=function(e){return this.comp(e)>0};U.gt=U.greaterThan;U.greaterThanOrEqual=function(e){return this.comp(e)>=0};U.gte=U.greaterThanOrEqual;U.ge=U.greaterThanOrEqual;U.compare=function(e){if(dt(e)||(e=zt(e)),this.eq(e))return 0;var n=this.isNegative(),t=e.isNegative();return n&&!t?-1:!n&&t?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1};U.comp=U.compare;U.negate=function(){return!this.unsigned&&this.eq(xt)?xt:this.not().add(ln)};U.neg=U.negate;U.add=function(e){dt(e)||(e=zt(e));var n=this.high>>>16,t=this.high&65535,o=this.low>>>16,i=this.low&65535,s=e.high>>>16,a=e.high&65535,u=e.low>>>16,l=e.low&65535,f=0,c=0,p=0,b=0;return b+=i+l,p+=b>>>16,b&=65535,p+=o+u,c+=p>>>16,p&=65535,c+=t+a,f+=c>>>16,c&=65535,f+=n+s,f&=65535,ke(p<<16|b,f<<16|c,this.unsigned)};U.subtract=function(e){return dt(e)||(e=zt(e)),this.add(e.neg())};U.sub=U.subtract;U.multiply=function(e){if(this.isZero())return this;if(dt(e)||(e=zt(e)),Ot){var n=Ot.mul(this.low,this.high,e.low,e.high);return ke(n,Ot.get_high(),this.unsigned)}if(e.isZero())return this.unsigned?fr:Nt;if(this.eq(xt))return e.isOdd()?xt:Nt;if(e.eq(xt))return this.isOdd()?xt:Nt;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Sc)&&e.lt(Sc))return Et(this.toNumber()*e.toNumber(),this.unsigned);var t=this.high>>>16,o=this.high&65535,i=this.low>>>16,s=this.low&65535,a=e.high>>>16,u=e.high&65535,l=e.low>>>16,f=e.low&65535,c=0,p=0,b=0,h=0;return h+=s*f,b+=h>>>16,h&=65535,b+=i*f,p+=b>>>16,b&=65535,b+=s*l,p+=b>>>16,b&=65535,p+=o*f,c+=p>>>16,p&=65535,p+=i*l,c+=p>>>16,p&=65535,p+=s*u,c+=p>>>16,p&=65535,c+=t*f+o*l+i*u+s*a,c&=65535,ke(b<<16|h,c<<16|p,this.unsigned)};U.mul=U.multiply;U.divide=function(e){if(dt(e)||(e=zt(e)),e.isZero())throw Error("division by zero");if(Ot){if(!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1)return this;var n=(this.unsigned?Ot.div_u:Ot.div_s)(this.low,this.high,e.low,e.high);return ke(n,Ot.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?fr:Nt;var t,o,i;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return fr;if(e.gt(this.shru(1)))return Ac;i=fr}else{if(this.eq(xt)){if(e.eq(ln)||e.eq(Ea))return xt;if(e.eq(xt))return ln;var s=this.shr(1);return t=s.div(e).shl(1),t.eq(Nt)?e.isNegative()?ln:Ea:(o=this.sub(e.mul(t)),i=t.add(o.div(e)),i)}else if(e.eq(xt))return this.unsigned?fr:Nt;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();i=Nt}for(o=this;o.gte(e);){t=Math.max(1,Math.floor(o.toNumber()/e.toNumber()));for(var a=Math.ceil(Math.log(t)/Math.LN2),u=a<=48?1:Co(2,a-48),l=Et(t),f=l.mul(e);f.isNegative()||f.gt(o);)t-=u,l=Et(t,this.unsigned),f=l.mul(e);l.isZero()&&(l=ln),i=i.add(l),o=o.sub(f)}return i};U.div=U.divide;U.modulo=function(e){if(dt(e)||(e=zt(e)),Ot){var n=(this.unsigned?Ot.rem_u:Ot.rem_s)(this.low,this.high,e.low,e.high);return ke(n,Ot.get_high(),this.unsigned)}return this.sub(this.div(e).mul(e))};U.mod=U.modulo;U.rem=U.modulo;U.not=function(){return ke(~this.low,~this.high,this.unsigned)};U.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32};U.clz=U.countLeadingZeros;U.countTrailingZeros=function(){return this.low?vc(this.low):vc(this.high)+32};U.ctz=U.countTrailingZeros;U.and=function(e){return dt(e)||(e=zt(e)),ke(this.low&e.low,this.high&e.high,this.unsigned)};U.or=function(e){return dt(e)||(e=zt(e)),ke(this.low|e.low,this.high|e.high,this.unsigned)};U.xor=function(e){return dt(e)||(e=zt(e)),ke(this.low^e.low,this.high^e.high,this.unsigned)};U.shiftLeft=function(e){return dt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?ke(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):ke(0,this.low<<e-32,this.unsigned)};U.shl=U.shiftLeft;U.shiftRight=function(e){return dt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?ke(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):ke(this.high>>e-32,this.high>=0?0:-1,this.unsigned)};U.shr=U.shiftRight;U.shiftRightUnsigned=function(e){return dt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?ke(this.low>>>e|this.high<<32-e,this.high>>>e,this.unsigned):e===32?ke(this.high,0,this.unsigned):ke(this.high>>>e-32,0,this.unsigned)};U.shru=U.shiftRightUnsigned;U.shr_u=U.shiftRightUnsigned;U.rotateLeft=function(e){var n;return dt(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?ke(this.high,this.low,this.unsigned):e<32?(n=32-e,ke(this.low<<e|this.high>>>n,this.high<<e|this.low>>>n,this.unsigned)):(e-=32,n=32-e,ke(this.high<<e|this.low>>>n,this.low<<e|this.high>>>n,this.unsigned))};U.rotl=U.rotateLeft;U.rotateRight=function(e){var n;return dt(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?ke(this.high,this.low,this.unsigned):e<32?(n=32-e,ke(this.high<<n|this.low>>>e,this.low<<n|this.high>>>e,this.unsigned)):(e-=32,n=32-e,ke(this.low<<n|this.high>>>e,this.high<<n|this.low>>>e,this.unsigned))};U.rotr=U.rotateRight;U.toSigned=function(){return this.unsigned?ke(this.low,this.high,!1):this};U.toUnsigned=function(){return this.unsigned?this:ke(this.low,this.high,!0)};U.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()};U.toBytesLE=function(){var e=this.high,n=this.low;return[n&255,n>>>8&255,n>>>16&255,n>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]};U.toBytesBE=function(){var e=this.high,n=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,n>>>24,n>>>16&255,n>>>8&255,n&255]};Me.fromBytes=function(e,n,t){return t?Me.fromBytesLE(e,n):Me.fromBytesBE(e,n)};Me.fromBytesLE=function(e,n){return new Me(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,n)};Me.fromBytesBE=function(e,n){return new Me(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],n)};dr=Me});var k,ko=C(()=>{k={};k.Offset;k.Table;k.SIZEOF_SHORT=2;k.SIZEOF_INT=4;k.FILE_IDENTIFIER_LENGTH=4;k.SIZE_PREFIX_LENGTH=4;k.Encoding={UTF8_BYTES:1,UTF16_STRING:2};k.int32=new Int32Array(2);k.float32=new Float32Array(k.int32.buffer);k.float64=new Float64Array(k.int32.buffer);k.isLittleEndian=new Uint16Array(new Uint8Array([1,0]).buffer)[0]===1;k.Long=function(r,e){this.low=r|0,this.high=e|0};k.Long.create=function(r,e){return r==0&&e==0?k.Long.ZERO:new k.Long(r,e)};k.Long.prototype.toFloat64=function(){return(this.low>>>0)+this.high*4294967296};k.Long.prototype.equals=function(r){return this.low==r.low&&this.high==r.high};k.Long.ZERO=new k.Long(0,0);k.Builder=function(r){if(r)var e=r;else var e=1024;this.bb=k.ByteBuffer.allocate(e),this.space=e,this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1};k.Builder.prototype.clear=function(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1};k.Builder.prototype.forceDefaults=function(r){this.force_defaults=r};k.Builder.prototype.dataBuffer=function(){return this.bb};k.Builder.prototype.asUint8Array=function(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())};k.Builder.prototype.prep=function(r,e){r>this.minalign&&(this.minalign=r);for(var n=~(this.bb.capacity()-this.space+e)+1&r-1;this.space<n+r+e;){var t=this.bb.capacity();this.bb=k.Builder.growByteBuffer(this.bb),this.space+=this.bb.capacity()-t}this.pad(n)};k.Builder.prototype.pad=function(r){for(var e=0;e<r;e++)this.bb.writeInt8(--this.space,0)};k.Builder.prototype.writeInt8=function(r){this.bb.writeInt8(this.space-=1,r)};k.Builder.prototype.writeInt16=function(r){this.bb.writeInt16(this.space-=2,r)};k.Builder.prototype.writeInt32=function(r){this.bb.writeInt32(this.space-=4,r)};k.Builder.prototype.writeInt64=function(r){this.bb.writeInt64(this.space-=8,r)};k.Builder.prototype.writeFloat32=function(r){this.bb.writeFloat32(this.space-=4,r)};k.Builder.prototype.writeFloat64=function(r){this.bb.writeFloat64(this.space-=8,r)};k.Builder.prototype.addInt8=function(r){this.prep(1,0),this.writeInt8(r)};k.Builder.prototype.addInt16=function(r){this.prep(2,0),this.writeInt16(r)};k.Builder.prototype.addInt32=function(r){this.prep(4,0),this.writeInt32(r)};k.Builder.prototype.addInt64=function(r){this.prep(8,0),this.writeInt64(r)};k.Builder.prototype.addFloat32=function(r){this.prep(4,0),this.writeFloat32(r)};k.Builder.prototype.addFloat64=function(r){this.prep(8,0),this.writeFloat64(r)};k.Builder.prototype.addFieldInt8=function(r,e,n){(this.force_defaults||e!=n)&&(this.addInt8(e),this.slot(r))};k.Builder.prototype.addFieldInt16=function(r,e,n){(this.force_defaults||e!=n)&&(this.addInt16(e),this.slot(r))};k.Builder.prototype.addFieldInt32=function(r,e,n){(this.force_defaults||e!=n)&&(this.addInt32(e),this.slot(r))};k.Builder.prototype.addFieldInt64=function(r,e,n){(this.force_defaults||!e.equals(n))&&(this.addInt64(e),this.slot(r))};k.Builder.prototype.addFieldFloat32=function(r,e,n){(this.force_defaults||e!=n)&&(this.addFloat32(e),this.slot(r))};k.Builder.prototype.addFieldFloat64=function(r,e,n){(this.force_defaults||e!=n)&&(this.addFloat64(e),this.slot(r))};k.Builder.prototype.addFieldOffset=function(r,e,n){(this.force_defaults||e!=n)&&(this.addOffset(e),this.slot(r))};k.Builder.prototype.addFieldStruct=function(r,e,n){e!=n&&(this.nested(e),this.slot(r))};k.Builder.prototype.nested=function(r){if(r!=this.offset())throw new Error("FlatBuffers: struct must be serialized inline.")};k.Builder.prototype.notNested=function(){if(this.isNested)throw new Error("FlatBuffers: object serialization must not be nested.")};k.Builder.prototype.slot=function(r){this.vtable[r]=this.offset()};k.Builder.prototype.offset=function(){return this.bb.capacity()-this.space};k.Builder.growByteBuffer=function(r){var e=r.capacity();if(e&3221225472)throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");var n=e<<1,t=k.ByteBuffer.allocate(n);return t.setPosition(n-e),t.bytes().set(r.bytes(),n-e),t};k.Builder.prototype.addOffset=function(r){this.prep(k.SIZEOF_INT,0),this.writeInt32(this.offset()-r+k.SIZEOF_INT)};k.Builder.prototype.startObject=function(r){this.notNested(),this.vtable==null&&(this.vtable=[]),this.vtable_in_use=r;for(var e=0;e<r;e++)this.vtable[e]=0;this.isNested=!0,this.object_start=this.offset()};k.Builder.prototype.endObject=function(){if(this.vtable==null||!this.isNested)throw new Error("FlatBuffers: endObject called without startObject");this.addInt32(0);for(var r=this.offset(),e=this.vtable_in_use-1;e>=0&&this.vtable[e]==0;e--);for(var n=e+1;e>=0;e--)this.addInt16(this.vtable[e]!=0?r-this.vtable[e]:0);var t=2;this.addInt16(r-this.object_start);var o=(n+t)*k.SIZEOF_SHORT;this.addInt16(o);var i=0,s=this.space;e:for(e=0;e<this.vtables.length;e++){var a=this.bb.capacity()-this.vtables[e];if(o==this.bb.readInt16(a)){for(var u=k.SIZEOF_SHORT;u<o;u+=k.SIZEOF_SHORT)if(this.bb.readInt16(s+u)!=this.bb.readInt16(a+u))continue e;i=this.vtables[e];break}}return i?(this.space=this.bb.capacity()-r,this.bb.writeInt32(this.space,i-r)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-r,this.offset()-r)),this.isNested=!1,r};k.Builder.prototype.finish=function(r,e,n){var t=n?k.SIZE_PREFIX_LENGTH:0;if(e){var o=e;if(this.prep(this.minalign,k.SIZEOF_INT+k.FILE_IDENTIFIER_LENGTH+t),o.length!=k.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: file identifier must be length "+k.FILE_IDENTIFIER_LENGTH);for(var i=k.FILE_IDENTIFIER_LENGTH-1;i>=0;i--)this.writeInt8(o.charCodeAt(i))}this.prep(this.minalign,k.SIZEOF_INT+t),this.addOffset(r),t&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)};k.Builder.prototype.finishSizePrefixed=function(r,e){this.finish(r,e,!0)};k.Builder.prototype.requiredField=function(r,e){var n=this.bb.capacity()-r,t=n-this.bb.readInt32(n),o=this.bb.readInt16(t+e)!=0;if(!o)throw new Error("FlatBuffers: field "+e+" must be set")};k.Builder.prototype.startVector=function(r,e,n){this.notNested(),this.vector_num_elems=e,this.prep(k.SIZEOF_INT,r*e),this.prep(n,r*e)};k.Builder.prototype.endVector=function(){return this.writeInt32(this.vector_num_elems),this.offset()};k.Builder.prototype.createString=function(r){if(r instanceof Uint8Array)var e=r;else for(var e=[],n=0;n<r.length;){var t,o=r.charCodeAt(n++);if(o<55296||o>=56320)t=o;else{var i=r.charCodeAt(n++);t=(o<<10)+i+(65536-56623104-56320)}t<128?e.push(t):(t<2048?e.push(t>>6&31|192):(t<65536?e.push(t>>12&15|224):e.push(t>>18&7|240,t>>12&63|128),e.push(t>>6&63|128)),e.push(t&63|128))}this.addInt8(0),this.startVector(1,e.length,1),this.bb.setPosition(this.space-=e.length);for(var n=0,s=this.space,a=this.bb.bytes();n<e.length;n++)a[s++]=e[n];return this.endVector()};k.Builder.prototype.createLong=function(r,e){return k.Long.create(r,e)};k.ByteBuffer=function(r){this.bytes_=r,this.position_=0};k.ByteBuffer.allocate=function(r){return new k.ByteBuffer(new Uint8Array(r))};k.ByteBuffer.prototype.clear=function(){this.position_=0};k.ByteBuffer.prototype.bytes=function(){return this.bytes_};k.ByteBuffer.prototype.position=function(){return this.position_};k.ByteBuffer.prototype.setPosition=function(r){this.position_=r};k.ByteBuffer.prototype.capacity=function(){return this.bytes_.length};k.ByteBuffer.prototype.readInt8=function(r){return this.readUint8(r)<<24>>24};k.ByteBuffer.prototype.readUint8=function(r){return this.bytes_[r]};k.ByteBuffer.prototype.readInt16=function(r){return this.readUint16(r)<<16>>16};k.ByteBuffer.prototype.readUint16=function(r){return this.bytes_[r]|this.bytes_[r+1]<<8};k.ByteBuffer.prototype.readInt32=function(r){return this.bytes_[r]|this.bytes_[r+1]<<8|this.bytes_[r+2]<<16|this.bytes_[r+3]<<24};k.ByteBuffer.prototype.readUint32=function(r){return this.readInt32(r)>>>0};k.ByteBuffer.prototype.readInt64=function(r){return new k.Long(this.readInt32(r),this.readInt32(r+4))};k.ByteBuffer.prototype.readUint64=function(r){return new k.Long(this.readUint32(r),this.readUint32(r+4))};k.ByteBuffer.prototype.readFloat32=function(r){return k.int32[0]=this.readInt32(r),k.float32[0]};k.ByteBuffer.prototype.readFloat64=function(r){return k.int32[k.isLittleEndian?0:1]=this.readInt32(r),k.int32[k.isLittleEndian?1:0]=this.readInt32(r+4),k.float64[0]};k.ByteBuffer.prototype.writeInt8=function(r,e){this.bytes_[r]=e};k.ByteBuffer.prototype.writeUint8=function(r,e){this.bytes_[r]=e};k.ByteBuffer.prototype.writeInt16=function(r,e){this.bytes_[r]=e,this.bytes_[r+1]=e>>8};k.ByteBuffer.prototype.writeUint16=function(r,e){this.bytes_[r]=e,this.bytes_[r+1]=e>>8};k.ByteBuffer.prototype.writeInt32=function(r,e){this.bytes_[r]=e,this.bytes_[r+1]=e>>8,this.bytes_[r+2]=e>>16,this.bytes_[r+3]=e>>24};k.ByteBuffer.prototype.writeUint32=function(r,e){this.bytes_[r]=e,this.bytes_[r+1]=e>>8,this.bytes_[r+2]=e>>16,this.bytes_[r+3]=e>>24};k.ByteBuffer.prototype.writeInt64=function(r,e){this.writeInt32(r,e.low),this.writeInt32(r+4,e.high)};k.ByteBuffer.prototype.writeUint64=function(r,e){this.writeUint32(r,e.low),this.writeUint32(r+4,e.high)};k.ByteBuffer.prototype.writeFloat32=function(r,e){k.float32[0]=e,this.writeInt32(r,k.int32[0])};k.ByteBuffer.prototype.writeFloat64=function(r,e){k.float64[0]=e,this.writeInt32(r,k.int32[k.isLittleEndian?0:1]),this.writeInt32(r+4,k.int32[k.isLittleEndian?1:0])};k.ByteBuffer.prototype.getBufferIdentifier=function(){if(this.bytes_.length<this.position_+k.SIZEOF_INT+k.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");for(var r="",e=0;e<k.FILE_IDENTIFIER_LENGTH;e++)r+=String.fromCharCode(this.readInt8(this.position_+k.SIZEOF_INT+e));return r};k.ByteBuffer.prototype.__offset=function(r,e){var n=r-this.readInt32(r);return e<this.readInt16(n)?this.readInt16(n+e):0};k.ByteBuffer.prototype.__union=function(r,e){return r.bb_pos=e+this.readInt32(e),r.bb=this,r};k.ByteBuffer.prototype.__string=function(r,e){r+=this.readInt32(r);var n=this.readInt32(r),t="",o=0;if(r+=k.SIZEOF_INT,e===k.Encoding.UTF8_BYTES)return this.bytes_.subarray(r,r+n);for(;o<n;){var i,s=this.readUint8(r+o++);if(s<192)i=s;else{var a=this.readUint8(r+o++);if(s<224)i=(s&31)<<6|a&63;else{var u=this.readUint8(r+o++);if(s<240)i=(s&15)<<12|(a&63)<<6|u&63;else{var l=this.readUint8(r+o++);i=(s&7)<<18|(a&63)<<12|(u&63)<<6|l&63}}}i<65536?t+=String.fromCharCode(i):(i-=65536,t+=String.fromCharCode((i>>10)+55296,(i&1024-1)+56320))}return t};k.ByteBuffer.prototype.__indirect=function(r){return r+this.readInt32(r)};k.ByteBuffer.prototype.__vector=function(r){return r+this.readInt32(r)+k.SIZEOF_INT};k.ByteBuffer.prototype.__vector_len=function(r){return this.readInt32(r+this.readInt32(r))};k.ByteBuffer.prototype.__has_identifier=function(r){if(r.length!=k.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: file identifier must be length "+k.FILE_IDENTIFIER_LENGTH);for(var e=0;e<k.FILE_IDENTIFIER_LENGTH;e++)if(r.charCodeAt(e)!=this.readInt8(this.position_+k.SIZEOF_INT+e))return!1;return!0};k.ByteBuffer.prototype.createLong=function(r,e){return k.Long.create(r,e)}});var ee,Cn=C(()=>{"use strict";ko();(e=>{let r;(t=>{let n;(i=>{let o;(S=>(S[S.UNDEFINED=0]="UNDEFINED",S[S.FLOAT=1]="FLOAT",S[S.INT=2]="INT",S[S.STRING=3]="STRING",S[S.TENSOR=4]="TENSOR",S[S.GRAPH=5]="GRAPH",S[S.FLOATS=6]="FLOATS",S[S.INTS=7]="INTS",S[S.STRINGS=8]="STRINGS",S[S.TENSORS=9]="TENSORS",S[S.GRAPHS=10]="GRAPHS",S[S.SPARSE_TENSOR=11]="SPARSE_TENSOR",S[S.SPARSE_TENSORS=12]="SPARSE_TENSORS"))(o=i.AttributeType||={})})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{let o;(l=>(l[l.UNKNOWN=0]="UNKNOWN",l[l.VALUE=1]="VALUE",l[l.PARAM=2]="PARAM"))(o=i.DimensionValueType||={})})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{let o;(F=>(F[F.UNDEFINED=0]="UNDEFINED",F[F.FLOAT=1]="FLOAT",F[F.UINT8=2]="UINT8",F[F.INT8=3]="INT8",F[F.UINT16=4]="UINT16",F[F.INT16=5]="INT16",F[F.INT32=6]="INT32",F[F.INT64=7]="INT64",F[F.STRING=8]="STRING",F[F.BOOL=9]="BOOL",F[F.FLOAT16=10]="FLOAT16",F[F.DOUBLE=11]="DOUBLE",F[F.UINT32=12]="UINT32",F[F.UINT64=13]="UINT64",F[F.COMPLEX64=14]="COMPLEX64",F[F.COMPLEX128=15]="COMPLEX128",F[F.BFLOAT16=16]="BFLOAT16",F[F.FLOAT8E4M3FN=17]="FLOAT8E4M3FN",F[F.FLOAT8E4M3FNUZ=18]="FLOAT8E4M3FNUZ",F[F.FLOAT8E5M2=19]="FLOAT8E5M2",F[F.FLOAT8E5M2FNUZ=20]="FLOAT8E5M2FNUZ"))(o=i.TensorDataType||={})})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{let o;(u=>(u[u.Primitive=0]="Primitive",u[u.Fused=1]="Fused"))(o=i.NodeType||={})})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{let o;(f=>(f[f.NONE=0]="NONE",f[f.tensor_type=1]="tensor_type",f[f.sequence_type=2]="sequence_type",f[f.map_type=3]="map_type"))(o=i.TypeInfoValue||={})})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsShape(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsShape(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}dim(a,u){let l=this.bb.__offset(this.bb_pos,4);return l?(u||new e.experimental.fbs.Dimension).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}dimLength(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.__vector_len(this.bb_pos+a):0}static startShape(a){a.startObject(1)}static addDim(a,u){a.addFieldOffset(0,u,0)}static createDimVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startDimVector(a,u){a.startVector(4,u,4)}static endShape(a){return a.endObject()}static createShape(a,u){return o.startShape(a),o.addDim(a,u),o.endShape(a)}}i.Shape=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsDimension(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsDimension(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}value(a){let u=this.bb.__offset(this.bb_pos,4);return u?(a||new e.experimental.fbs.DimensionValue).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}denotation(a){let u=this.bb.__offset(this.bb_pos,6);return u?this.bb.__string(this.bb_pos+u,a):null}static startDimension(a){a.startObject(2)}static addValue(a,u){a.addFieldOffset(0,u,0)}static addDenotation(a,u){a.addFieldOffset(1,u,0)}static endDimension(a){return a.endObject()}static createDimension(a,u,l){return o.startDimension(a),o.addValue(a,u),o.addDenotation(a,l),o.endDimension(a)}}i.Dimension=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsDimensionValue(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsDimensionValue(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}dimType(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.readInt8(this.bb_pos+a):0}dimValue(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.readInt64(this.bb_pos+a):this.bb.createLong(0,0)}dimParam(a){let u=this.bb.__offset(this.bb_pos,8);return u?this.bb.__string(this.bb_pos+u,a):null}static startDimensionValue(a){a.startObject(3)}static addDimType(a,u){a.addFieldInt8(0,u,0)}static addDimValue(a,u){a.addFieldInt64(1,u,a.createLong(0,0))}static addDimParam(a,u){a.addFieldOffset(2,u,0)}static endDimensionValue(a){return a.endObject()}static createDimensionValue(a,u,l,f){return o.startDimensionValue(a),o.addDimType(a,u),o.addDimValue(a,l),o.addDimParam(a,f),o.endDimensionValue(a)}}i.DimensionValue=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsTensorTypeAndShape(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsTensorTypeAndShape(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}elemType(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.readInt32(this.bb_pos+a):0}shape(a){let u=this.bb.__offset(this.bb_pos,6);return u?(a||new e.experimental.fbs.Shape).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}static startTensorTypeAndShape(a){a.startObject(2)}static addElemType(a,u){a.addFieldInt32(0,u,0)}static addShape(a,u){a.addFieldOffset(1,u,0)}static endTensorTypeAndShape(a){return a.endObject()}static createTensorTypeAndShape(a,u,l){return o.startTensorTypeAndShape(a),o.addElemType(a,u),o.addShape(a,l),o.endTensorTypeAndShape(a)}}i.TensorTypeAndShape=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsMapType(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsMapType(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}keyType(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.readInt32(this.bb_pos+a):0}valueType(a){let u=this.bb.__offset(this.bb_pos,6);return u?(a||new e.experimental.fbs.TypeInfo).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}static startMapType(a){a.startObject(2)}static addKeyType(a,u){a.addFieldInt32(0,u,0)}static addValueType(a,u){a.addFieldOffset(1,u,0)}static endMapType(a){return a.endObject()}static createMapType(a,u,l){return o.startMapType(a),o.addKeyType(a,u),o.addValueType(a,l),o.endMapType(a)}}i.MapType=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsSequenceType(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsSequenceType(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}elemType(a){let u=this.bb.__offset(this.bb_pos,4);return u?(a||new e.experimental.fbs.TypeInfo).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}static startSequenceType(a){a.startObject(1)}static addElemType(a,u){a.addFieldOffset(0,u,0)}static endSequenceType(a){return a.endObject()}static createSequenceType(a,u){return o.startSequenceType(a),o.addElemType(a,u),o.endSequenceType(a)}}i.SequenceType=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}nodeIndex(){return this.bb.readUint32(this.bb_pos)}srcArgIndex(){return this.bb.readInt32(this.bb_pos+4)}dstArgIndex(){return this.bb.readInt32(this.bb_pos+8)}static createEdgeEnd(a,u,l,f){return a.prep(4,12),a.writeInt32(f),a.writeInt32(l),a.writeInt32(u),a.offset()}}i.EdgeEnd=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsNodeEdge(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsNodeEdge(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}nodeIndex(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.readUint32(this.bb_pos+a):0}inputEdges(a,u){let l=this.bb.__offset(this.bb_pos,6);return l?(u||new e.experimental.fbs.EdgeEnd).__init(this.bb.__vector(this.bb_pos+l)+a*12,this.bb):null}inputEdgesLength(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.__vector_len(this.bb_pos+a):0}outputEdges(a,u){let l=this.bb.__offset(this.bb_pos,8);return l?(u||new e.experimental.fbs.EdgeEnd).__init(this.bb.__vector(this.bb_pos+l)+a*12,this.bb):null}outputEdgesLength(){let a=this.bb.__offset(this.bb_pos,8);return a?this.bb.__vector_len(this.bb_pos+a):0}static startNodeEdge(a){a.startObject(3)}static addNodeIndex(a,u){a.addFieldInt32(0,u,0)}static addInputEdges(a,u){a.addFieldOffset(1,u,0)}static startInputEdgesVector(a,u){a.startVector(12,u,4)}static addOutputEdges(a,u){a.addFieldOffset(2,u,0)}static startOutputEdgesVector(a,u){a.startVector(12,u,4)}static endNodeEdge(a){return a.endObject()}static createNodeEdge(a,u,l,f){return o.startNodeEdge(a),o.addNodeIndex(a,u),o.addInputEdges(a,l),o.addOutputEdges(a,f),o.endNodeEdge(a)}}i.NodeEdge=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsNode(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsNode(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}name(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}docString(a){let u=this.bb.__offset(this.bb_pos,6);return u?this.bb.__string(this.bb_pos+u,a):null}domain(a){let u=this.bb.__offset(this.bb_pos,8);return u?this.bb.__string(this.bb_pos+u,a):null}sinceVersion(){let a=this.bb.__offset(this.bb_pos,10);return a?this.bb.readInt32(this.bb_pos+a):0}index(){let a=this.bb.__offset(this.bb_pos,12);return a?this.bb.readUint32(this.bb_pos+a):0}opType(a){let u=this.bb.__offset(this.bb_pos,14);return u?this.bb.__string(this.bb_pos+u,a):null}type(){let a=this.bb.__offset(this.bb_pos,16);return a?this.bb.readInt32(this.bb_pos+a):0}executionProviderType(a){let u=this.bb.__offset(this.bb_pos,18);return u?this.bb.__string(this.bb_pos+u,a):null}inputs(a,u){let l=this.bb.__offset(this.bb_pos,20);return l?this.bb.__string(this.bb.__vector(this.bb_pos+l)+a*4,u):null}inputsLength(){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.__vector_len(this.bb_pos+a):0}outputs(a,u){let l=this.bb.__offset(this.bb_pos,22);return l?this.bb.__string(this.bb.__vector(this.bb_pos+l)+a*4,u):null}outputsLength(){let a=this.bb.__offset(this.bb_pos,22);return a?this.bb.__vector_len(this.bb_pos+a):0}attributes(a,u){let l=this.bb.__offset(this.bb_pos,24);return l?(u||new e.experimental.fbs.Attribute).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}attributesLength(){let a=this.bb.__offset(this.bb_pos,24);return a?this.bb.__vector_len(this.bb_pos+a):0}inputArgCounts(a){let u=this.bb.__offset(this.bb_pos,26);return u?this.bb.readInt32(this.bb.__vector(this.bb_pos+u)+a*4):0}inputArgCountsLength(){let a=this.bb.__offset(this.bb_pos,26);return a?this.bb.__vector_len(this.bb_pos+a):0}inputArgCountsArray(){let a=this.bb.__offset(this.bb_pos,26);return a?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+a),this.bb.__vector_len(this.bb_pos+a)):null}implicitInputs(a,u){let l=this.bb.__offset(this.bb_pos,28);return l?this.bb.__string(this.bb.__vector(this.bb_pos+l)+a*4,u):null}implicitInputsLength(){let a=this.bb.__offset(this.bb_pos,28);return a?this.bb.__vector_len(this.bb_pos+a):0}static startNode(a){a.startObject(13)}static addName(a,u){a.addFieldOffset(0,u,0)}static addDocString(a,u){a.addFieldOffset(1,u,0)}static addDomain(a,u){a.addFieldOffset(2,u,0)}static addSinceVersion(a,u){a.addFieldInt32(3,u,0)}static addIndex(a,u){a.addFieldInt32(4,u,0)}static addOpType(a,u){a.addFieldOffset(5,u,0)}static addType(a,u){a.addFieldInt32(6,u,0)}static addExecutionProviderType(a,u){a.addFieldOffset(7,u,0)}static addInputs(a,u){a.addFieldOffset(8,u,0)}static createInputsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startInputsVector(a,u){a.startVector(4,u,4)}static addOutputs(a,u){a.addFieldOffset(9,u,0)}static createOutputsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startOutputsVector(a,u){a.startVector(4,u,4)}static addAttributes(a,u){a.addFieldOffset(10,u,0)}static createAttributesVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startAttributesVector(a,u){a.startVector(4,u,4)}static addInputArgCounts(a,u){a.addFieldOffset(11,u,0)}static createInputArgCountsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addInt32(u[l]);return a.endVector()}static startInputArgCountsVector(a,u){a.startVector(4,u,4)}static addImplicitInputs(a,u){a.addFieldOffset(12,u,0)}static createImplicitInputsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startImplicitInputsVector(a,u){a.startVector(4,u,4)}static endNode(a){return a.endObject()}static createNode(a,u,l,f,c,p,b,h,g,T,w,v,S,$){return o.startNode(a),o.addName(a,u),o.addDocString(a,l),o.addDomain(a,f),o.addSinceVersion(a,c),o.addIndex(a,p),o.addOpType(a,b),o.addType(a,h),o.addExecutionProviderType(a,g),o.addInputs(a,T),o.addOutputs(a,w),o.addAttributes(a,v),o.addInputArgCounts(a,S),o.addImplicitInputs(a,$),o.endNode(a)}}i.Node=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsValueInfo(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsValueInfo(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}name(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}docString(a){let u=this.bb.__offset(this.bb_pos,6);return u?this.bb.__string(this.bb_pos+u,a):null}type(a){let u=this.bb.__offset(this.bb_pos,8);return u?(a||new e.experimental.fbs.TypeInfo).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}static startValueInfo(a){a.startObject(3)}static addName(a,u){a.addFieldOffset(0,u,0)}static addDocString(a,u){a.addFieldOffset(1,u,0)}static addType(a,u){a.addFieldOffset(2,u,0)}static endValueInfo(a){return a.endObject()}static createValueInfo(a,u,l,f){return o.startValueInfo(a),o.addName(a,u),o.addDocString(a,l),o.addType(a,f),o.endValueInfo(a)}}i.ValueInfo=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsTypeInfo(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsTypeInfo(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}denotation(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}valueType(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.readUint8(this.bb_pos+a):0}value(a){let u=this.bb.__offset(this.bb_pos,8);return u?this.bb.__union(a,this.bb_pos+u):null}static startTypeInfo(a){a.startObject(3)}static addDenotation(a,u){a.addFieldOffset(0,u,0)}static addValueType(a,u){a.addFieldInt8(1,u,0)}static addValue(a,u){a.addFieldOffset(2,u,0)}static endTypeInfo(a){return a.endObject()}static createTypeInfo(a,u,l,f){return o.startTypeInfo(a),o.addDenotation(a,u),o.addValueType(a,l),o.addValue(a,f),o.endTypeInfo(a)}}i.TypeInfo=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsOperatorSetId(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsOperatorSetId(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}domain(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}version(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.readInt64(this.bb_pos+a):this.bb.createLong(0,0)}static startOperatorSetId(a){a.startObject(2)}static addDomain(a,u){a.addFieldOffset(0,u,0)}static addVersion(a,u){a.addFieldInt64(1,u,a.createLong(0,0))}static endOperatorSetId(a){return a.endObject()}static createOperatorSetId(a,u,l){return o.startOperatorSetId(a),o.addDomain(a,u),o.addVersion(a,l),o.endOperatorSetId(a)}}i.OperatorSetId=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsTensor(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsTensor(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}name(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}docString(a){let u=this.bb.__offset(this.bb_pos,6);return u?this.bb.__string(this.bb_pos+u,a):null}dims(a){let u=this.bb.__offset(this.bb_pos,8);return u?this.bb.readInt64(this.bb.__vector(this.bb_pos+u)+a*8):this.bb.createLong(0,0)}dimsLength(){let a=this.bb.__offset(this.bb_pos,8);return a?this.bb.__vector_len(this.bb_pos+a):0}dataType(){let a=this.bb.__offset(this.bb_pos,10);return a?this.bb.readInt32(this.bb_pos+a):0}rawData(a){let u=this.bb.__offset(this.bb_pos,12);return u?this.bb.readUint8(this.bb.__vector(this.bb_pos+u)+a):0}rawDataLength(){let a=this.bb.__offset(this.bb_pos,12);return a?this.bb.__vector_len(this.bb_pos+a):0}rawDataArray(){let a=this.bb.__offset(this.bb_pos,12);return a?new Uint8Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+a),this.bb.__vector_len(this.bb_pos+a)):null}stringData(a,u){let l=this.bb.__offset(this.bb_pos,14);return l?this.bb.__string(this.bb.__vector(this.bb_pos+l)+a*4,u):null}stringDataLength(){let a=this.bb.__offset(this.bb_pos,14);return a?this.bb.__vector_len(this.bb_pos+a):0}static startTensor(a){a.startObject(6)}static addName(a,u){a.addFieldOffset(0,u,0)}static addDocString(a,u){a.addFieldOffset(1,u,0)}static addDims(a,u){a.addFieldOffset(2,u,0)}static createDimsVector(a,u){a.startVector(8,u.length,8);for(let l=u.length-1;l>=0;l--)a.addInt64(u[l]);return a.endVector()}static startDimsVector(a,u){a.startVector(8,u,8)}static addDataType(a,u){a.addFieldInt32(3,u,0)}static addRawData(a,u){a.addFieldOffset(4,u,0)}static createRawDataVector(a,u){a.startVector(1,u.length,1);for(let l=u.length-1;l>=0;l--)a.addInt8(u[l]);return a.endVector()}static startRawDataVector(a,u){a.startVector(1,u,1)}static addStringData(a,u){a.addFieldOffset(5,u,0)}static createStringDataVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startStringDataVector(a,u){a.startVector(4,u,4)}static endTensor(a){return a.endObject()}static createTensor(a,u,l,f,c,p,b){return o.startTensor(a),o.addName(a,u),o.addDocString(a,l),o.addDims(a,f),o.addDataType(a,c),o.addRawData(a,p),o.addStringData(a,b),o.endTensor(a)}}i.Tensor=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsSparseTensor(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsSparseTensor(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}values(a){let u=this.bb.__offset(this.bb_pos,4);return u?(a||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}indices(a){let u=this.bb.__offset(this.bb_pos,6);return u?(a||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}dims(a){let u=this.bb.__offset(this.bb_pos,8);return u?this.bb.readInt64(this.bb.__vector(this.bb_pos+u)+a*8):this.bb.createLong(0,0)}dimsLength(){let a=this.bb.__offset(this.bb_pos,8);return a?this.bb.__vector_len(this.bb_pos+a):0}static startSparseTensor(a){a.startObject(3)}static addValues(a,u){a.addFieldOffset(0,u,0)}static addIndices(a,u){a.addFieldOffset(1,u,0)}static addDims(a,u){a.addFieldOffset(2,u,0)}static createDimsVector(a,u){a.startVector(8,u.length,8);for(let l=u.length-1;l>=0;l--)a.addInt64(u[l]);return a.endVector()}static startDimsVector(a,u){a.startVector(8,u,8)}static endSparseTensor(a){return a.endObject()}static createSparseTensor(a,u,l,f){return o.startSparseTensor(a),o.addValues(a,u),o.addIndices(a,l),o.addDims(a,f),o.endSparseTensor(a)}}i.SparseTensor=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsAttribute(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsAttribute(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}name(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}docString(a){let u=this.bb.__offset(this.bb_pos,6);return u?this.bb.__string(this.bb_pos+u,a):null}type(){let a=this.bb.__offset(this.bb_pos,8);return a?this.bb.readInt32(this.bb_pos+a):0}f(){let a=this.bb.__offset(this.bb_pos,10);return a?this.bb.readFloat32(this.bb_pos+a):0}i(){let a=this.bb.__offset(this.bb_pos,12);return a?this.bb.readInt64(this.bb_pos+a):this.bb.createLong(0,0)}s(a){let u=this.bb.__offset(this.bb_pos,14);return u?this.bb.__string(this.bb_pos+u,a):null}t(a){let u=this.bb.__offset(this.bb_pos,16);return u?(a||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}g(a){let u=this.bb.__offset(this.bb_pos,18);return u?(a||new e.experimental.fbs.Graph).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}floats(a){let u=this.bb.__offset(this.bb_pos,20);return u?this.bb.readFloat32(this.bb.__vector(this.bb_pos+u)+a*4):0}floatsLength(){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.__vector_len(this.bb_pos+a):0}floatsArray(){let a=this.bb.__offset(this.bb_pos,20);return a?new Float32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+a),this.bb.__vector_len(this.bb_pos+a)):null}ints(a){let u=this.bb.__offset(this.bb_pos,22);return u?this.bb.readInt64(this.bb.__vector(this.bb_pos+u)+a*8):this.bb.createLong(0,0)}intsLength(){let a=this.bb.__offset(this.bb_pos,22);return a?this.bb.__vector_len(this.bb_pos+a):0}strings(a,u){let l=this.bb.__offset(this.bb_pos,24);return l?this.bb.__string(this.bb.__vector(this.bb_pos+l)+a*4,u):null}stringsLength(){let a=this.bb.__offset(this.bb_pos,24);return a?this.bb.__vector_len(this.bb_pos+a):0}tensors(a,u){let l=this.bb.__offset(this.bb_pos,26);return l?(u||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}tensorsLength(){let a=this.bb.__offset(this.bb_pos,26);return a?this.bb.__vector_len(this.bb_pos+a):0}graphs(a,u){let l=this.bb.__offset(this.bb_pos,28);return l?(u||new e.experimental.fbs.Graph).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}graphsLength(){let a=this.bb.__offset(this.bb_pos,28);return a?this.bb.__vector_len(this.bb_pos+a):0}static startAttribute(a){a.startObject(13)}static addName(a,u){a.addFieldOffset(0,u,0)}static addDocString(a,u){a.addFieldOffset(1,u,0)}static addType(a,u){a.addFieldInt32(2,u,0)}static addF(a,u){a.addFieldFloat32(3,u,0)}static addI(a,u){a.addFieldInt64(4,u,a.createLong(0,0))}static addS(a,u){a.addFieldOffset(5,u,0)}static addT(a,u){a.addFieldOffset(6,u,0)}static addG(a,u){a.addFieldOffset(7,u,0)}static addFloats(a,u){a.addFieldOffset(8,u,0)}static createFloatsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addFloat32(u[l]);return a.endVector()}static startFloatsVector(a,u){a.startVector(4,u,4)}static addInts(a,u){a.addFieldOffset(9,u,0)}static createIntsVector(a,u){a.startVector(8,u.length,8);for(let l=u.length-1;l>=0;l--)a.addInt64(u[l]);return a.endVector()}static startIntsVector(a,u){a.startVector(8,u,8)}static addStrings(a,u){a.addFieldOffset(10,u,0)}static createStringsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startStringsVector(a,u){a.startVector(4,u,4)}static addTensors(a,u){a.addFieldOffset(11,u,0)}static createTensorsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startTensorsVector(a,u){a.startVector(4,u,4)}static addGraphs(a,u){a.addFieldOffset(12,u,0)}static createGraphsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startGraphsVector(a,u){a.startVector(4,u,4)}static endAttribute(a){return a.endObject()}static createAttribute(a,u,l,f,c,p,b,h,g,T,w,v,S,$){return o.startAttribute(a),o.addName(a,u),o.addDocString(a,l),o.addType(a,f),o.addF(a,c),o.addI(a,p),o.addS(a,b),o.addT(a,h),o.addG(a,g),o.addFloats(a,T),o.addInts(a,w),o.addStrings(a,v),o.addTensors(a,S),o.addGraphs(a,$),o.endAttribute(a)}}i.Attribute=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsGraph(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsGraph(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}initializers(a,u){let l=this.bb.__offset(this.bb_pos,4);return l?(u||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}initializersLength(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.__vector_len(this.bb_pos+a):0}nodeArgs(a,u){let l=this.bb.__offset(this.bb_pos,6);return l?(u||new e.experimental.fbs.ValueInfo).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}nodeArgsLength(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.__vector_len(this.bb_pos+a):0}nodes(a,u){let l=this.bb.__offset(this.bb_pos,8);return l?(u||new e.experimental.fbs.Node).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}nodesLength(){let a=this.bb.__offset(this.bb_pos,8);return a?this.bb.__vector_len(this.bb_pos+a):0}maxNodeIndex(){let a=this.bb.__offset(this.bb_pos,10);return a?this.bb.readUint32(this.bb_pos+a):0}nodeEdges(a,u){let l=this.bb.__offset(this.bb_pos,12);return l?(u||new e.experimental.fbs.NodeEdge).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}nodeEdgesLength(){let a=this.bb.__offset(this.bb_pos,12);return a?this.bb.__vector_len(this.bb_pos+a):0}inputs(a,u){let l=this.bb.__offset(this.bb_pos,14);return l?this.bb.__string(this.bb.__vector(this.bb_pos+l)+a*4,u):null}inputsLength(){let a=this.bb.__offset(this.bb_pos,14);return a?this.bb.__vector_len(this.bb_pos+a):0}outputs(a,u){let l=this.bb.__offset(this.bb_pos,16);return l?this.bb.__string(this.bb.__vector(this.bb_pos+l)+a*4,u):null}outputsLength(){let a=this.bb.__offset(this.bb_pos,16);return a?this.bb.__vector_len(this.bb_pos+a):0}sparseInitializers(a,u){let l=this.bb.__offset(this.bb_pos,18);return l?(u||new e.experimental.fbs.SparseTensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}sparseInitializersLength(){let a=this.bb.__offset(this.bb_pos,18);return a?this.bb.__vector_len(this.bb_pos+a):0}static startGraph(a){a.startObject(8)}static addInitializers(a,u){a.addFieldOffset(0,u,0)}static createInitializersVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startInitializersVector(a,u){a.startVector(4,u,4)}static addNodeArgs(a,u){a.addFieldOffset(1,u,0)}static createNodeArgsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startNodeArgsVector(a,u){a.startVector(4,u,4)}static addNodes(a,u){a.addFieldOffset(2,u,0)}static createNodesVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startNodesVector(a,u){a.startVector(4,u,4)}static addMaxNodeIndex(a,u){a.addFieldInt32(3,u,0)}static addNodeEdges(a,u){a.addFieldOffset(4,u,0)}static createNodeEdgesVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startNodeEdgesVector(a,u){a.startVector(4,u,4)}static addInputs(a,u){a.addFieldOffset(5,u,0)}static createInputsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startInputsVector(a,u){a.startVector(4,u,4)}static addOutputs(a,u){a.addFieldOffset(6,u,0)}static createOutputsVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startOutputsVector(a,u){a.startVector(4,u,4)}static addSparseInitializers(a,u){a.addFieldOffset(7,u,0)}static createSparseInitializersVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startSparseInitializersVector(a,u){a.startVector(4,u,4)}static endGraph(a){return a.endObject()}static createGraph(a,u,l,f,c,p,b,h,g){return o.startGraph(a),o.addInitializers(a,u),o.addNodeArgs(a,l),o.addNodes(a,f),o.addMaxNodeIndex(a,c),o.addNodeEdges(a,p),o.addInputs(a,b),o.addOutputs(a,h),o.addSparseInitializers(a,g),o.endGraph(a)}}i.Graph=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsModel(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsModel(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}irVersion(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.readInt64(this.bb_pos+a):this.bb.createLong(0,0)}opsetImport(a,u){let l=this.bb.__offset(this.bb_pos,6);return l?(u||new e.experimental.fbs.OperatorSetId).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}opsetImportLength(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.__vector_len(this.bb_pos+a):0}producerName(a){let u=this.bb.__offset(this.bb_pos,8);return u?this.bb.__string(this.bb_pos+u,a):null}producerVersion(a){let u=this.bb.__offset(this.bb_pos,10);return u?this.bb.__string(this.bb_pos+u,a):null}domain(a){let u=this.bb.__offset(this.bb_pos,12);return u?this.bb.__string(this.bb_pos+u,a):null}modelVersion(){let a=this.bb.__offset(this.bb_pos,14);return a?this.bb.readInt64(this.bb_pos+a):this.bb.createLong(0,0)}docString(a){let u=this.bb.__offset(this.bb_pos,16);return u?this.bb.__string(this.bb_pos+u,a):null}graph(a){let u=this.bb.__offset(this.bb_pos,18);return u?(a||new e.experimental.fbs.Graph).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}graphDocString(a){let u=this.bb.__offset(this.bb_pos,20);return u?this.bb.__string(this.bb_pos+u,a):null}static startModel(a){a.startObject(9)}static addIrVersion(a,u){a.addFieldInt64(0,u,a.createLong(0,0))}static addOpsetImport(a,u){a.addFieldOffset(1,u,0)}static createOpsetImportVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startOpsetImportVector(a,u){a.startVector(4,u,4)}static addProducerName(a,u){a.addFieldOffset(2,u,0)}static addProducerVersion(a,u){a.addFieldOffset(3,u,0)}static addDomain(a,u){a.addFieldOffset(4,u,0)}static addModelVersion(a,u){a.addFieldInt64(5,u,a.createLong(0,0))}static addDocString(a,u){a.addFieldOffset(6,u,0)}static addGraph(a,u){a.addFieldOffset(7,u,0)}static addGraphDocString(a,u){a.addFieldOffset(8,u,0)}static endModel(a){return a.endObject()}static createModel(a,u,l,f,c,p,b,h,g,T){return o.startModel(a),o.addIrVersion(a,u),o.addOpsetImport(a,l),o.addProducerName(a,f),o.addProducerVersion(a,c),o.addDomain(a,p),o.addModelVersion(a,b),o.addDocString(a,h),o.addGraph(a,g),o.addGraphDocString(a,T),o.endModel(a)}}i.Model=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsKernelCreateInfos(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsKernelCreateInfos(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}nodeIndices(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.readUint32(this.bb.__vector(this.bb_pos+u)+a*4):0}nodeIndicesLength(){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.__vector_len(this.bb_pos+a):0}nodeIndicesArray(){let a=this.bb.__offset(this.bb_pos,4);return a?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+a),this.bb.__vector_len(this.bb_pos+a)):null}kernelDefHashes(a){let u=this.bb.__offset(this.bb_pos,6);return u?this.bb.readUint64(this.bb.__vector(this.bb_pos+u)+a*8):this.bb.createLong(0,0)}kernelDefHashesLength(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.__vector_len(this.bb_pos+a):0}static startKernelCreateInfos(a){a.startObject(2)}static addNodeIndices(a,u){a.addFieldOffset(0,u,0)}static createNodeIndicesVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addInt32(u[l]);return a.endVector()}static startNodeIndicesVector(a,u){a.startVector(4,u,4)}static addKernelDefHashes(a,u){a.addFieldOffset(1,u,0)}static createKernelDefHashesVector(a,u){a.startVector(8,u.length,8);for(let l=u.length-1;l>=0;l--)a.addInt64(u[l]);return a.endVector()}static startKernelDefHashesVector(a,u){a.startVector(8,u,8)}static endKernelCreateInfos(a){return a.endObject()}static createKernelCreateInfos(a,u,l){return o.startKernelCreateInfos(a),o.addNodeIndices(a,u),o.addKernelDefHashes(a,l),o.endKernelCreateInfos(a)}}i.KernelCreateInfos=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsSubGraphSessionState(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsSubGraphSessionState(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}graphId(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}sessionState(a){let u=this.bb.__offset(this.bb_pos,6);return u?(a||new e.experimental.fbs.SessionState).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}static startSubGraphSessionState(a){a.startObject(2)}static addGraphId(a,u){a.addFieldOffset(0,u,0)}static addSessionState(a,u){a.addFieldOffset(1,u,0)}static endSubGraphSessionState(a){let u=a.endObject();return a.requiredField(u,4),u}static createSubGraphSessionState(a,u,l){return o.startSubGraphSessionState(a),o.addGraphId(a,u),o.addSessionState(a,l),o.endSubGraphSessionState(a)}}i.SubGraphSessionState=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsSessionState(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsSessionState(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}kernels(a){let u=this.bb.__offset(this.bb_pos,4);return u?(a||new e.experimental.fbs.KernelCreateInfos).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}subGraphSessionStates(a,u){let l=this.bb.__offset(this.bb_pos,6);return l?(u||new e.experimental.fbs.SubGraphSessionState).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+l)+a*4),this.bb):null}subGraphSessionStatesLength(){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.__vector_len(this.bb_pos+a):0}static startSessionState(a){a.startObject(2)}static addKernels(a,u){a.addFieldOffset(0,u,0)}static addSubGraphSessionStates(a,u){a.addFieldOffset(1,u,0)}static createSubGraphSessionStatesVector(a,u){a.startVector(4,u.length,4);for(let l=u.length-1;l>=0;l--)a.addOffset(u[l]);return a.endVector()}static startSubGraphSessionStatesVector(a,u){a.startVector(4,u,4)}static endSessionState(a){return a.endObject()}static createSessionState(a,u,l){return o.startSessionState(a),o.addKernels(a,u),o.addSubGraphSessionStates(a,l),o.endSessionState(a)}}i.SessionState=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={});(e=>{let r;(t=>{let n;(i=>{class o{constructor(){this.bb=null;this.bb_pos=0}__init(a,u){return this.bb_pos=a,this.bb=u,this}static getRootAsInferenceSession(a,u){return(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static getSizePrefixedRootAsInferenceSession(a,u){return a.setPosition(a.position()+k.SIZE_PREFIX_LENGTH),(u||new o).__init(a.readInt32(a.position())+a.position(),a)}static bufferHasIdentifier(a){return a.__has_identifier("ORTM")}ortVersion(a){let u=this.bb.__offset(this.bb_pos,4);return u?this.bb.__string(this.bb_pos+u,a):null}model(a){let u=this.bb.__offset(this.bb_pos,6);return u?(a||new e.experimental.fbs.Model).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}sessionState(a){let u=this.bb.__offset(this.bb_pos,8);return u?(a||new e.experimental.fbs.SessionState).__init(this.bb.__indirect(this.bb_pos+u),this.bb):null}static startInferenceSession(a){a.startObject(3)}static addOrtVersion(a,u){a.addFieldOffset(0,u,0)}static addModel(a,u){a.addFieldOffset(1,u,0)}static addSessionState(a,u){a.addFieldOffset(2,u,0)}static endInferenceSession(a){return a.endObject()}static finishInferenceSessionBuffer(a,u){a.finish(u,"ORTM")}static finishSizePrefixedInferenceSessionBuffer(a,u){a.finish(u,"ORTM",!0)}static createInferenceSession(a,u,l,f){return o.startInferenceSession(a),o.addOrtVersion(a,u),o.addModel(a,l),o.addSessionState(a,f),o.endInferenceSession(a)}}i.InferenceSession=o})(n=t.fbs||={})})(r=e.experimental||={})})(ee||={})});var Cc=Je((US,Ec)=>{"use strict";Ec.exports=dv;function dv(r,e){for(var n=new Array(arguments.length-1),t=0,o=2,i=!0;o<arguments.length;)n[t++]=arguments[o++];return new Promise(function(a,u){n[t]=function(f){if(i)if(i=!1,f)u(f);else{for(var c=new Array(arguments.length-1),p=0;p<c.length;)c[p++]=arguments[p];a.apply(null,c)}};try{r.apply(e||null,n)}catch(l){i&&(i=!1,u(l))}})}});var Lc=Je(Bc=>{"use strict";var Do=Bc;Do.length=function(e){var n=e.length;if(!n)return 0;for(var t=0;--n%4>1&&e.charAt(n)==="=";)++t;return Math.ceil(e.length*3)/4-t};var fn=new Array(64),Dc=new Array(123);for(Ft=0;Ft<64;)Dc[fn[Ft]=Ft<26?Ft+65:Ft<52?Ft+71:Ft<62?Ft-4:Ft-59|43]=Ft++;var Ft;Do.encode=function(e,n,t){for(var o=null,i=[],s=0,a=0,u;n<t;){var l=e[n++];switch(a){case 0:i[s++]=fn[l>>2],u=(l&3)<<4,a=1;break;case 1:i[s++]=fn[u|l>>4],u=(l&15)<<2,a=2;break;case 2:i[s++]=fn[u|l>>6],i[s++]=fn[l&63],a=0;break}s>8191&&((o||(o=[])).push(String.fromCharCode.apply(String,i)),s=0)}return a&&(i[s++]=fn[u],i[s++]=61,a===1&&(i[s++]=61)),o?(s&&o.push(String.fromCharCode.apply(String,i.slice(0,s))),o.join("")):String.fromCharCode.apply(String,i.slice(0,s))};var kc="invalid encoding";Do.decode=function(e,n,t){for(var o=t,i=0,s,a=0;a<e.length;){var u=e.charCodeAt(a++);if(u===61&&i>1)break;if((u=Dc[u])===void 0)throw Error(kc);switch(i){case 0:s=u,i=1;break;case 1:n[t++]=s<<2|(u&48)>>4,s=u,i=2;break;case 2:n[t++]=(s&15)<<4|(u&60)>>2,s=u,i=3;break;case 3:n[t++]=(s&3)<<6|u,i=0;break}}if(i===1)throw Error(kc);return t-o};Do.test=function(e){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)}});var Nc=Je((HS,Rc)=>{"use strict";Rc.exports=Bo;function Bo(){this._listeners={}}Bo.prototype.on=function(e,n,t){return(this._listeners[e]||(this._listeners[e]=[])).push({fn:n,ctx:t||this}),this};Bo.prototype.off=function(e,n){if(e===void 0)this._listeners={};else if(n===void 0)this._listeners[e]=[];else for(var t=this._listeners[e],o=0;o<t.length;)t[o].fn===n?t.splice(o,1):++o;return this};Bo.prototype.emit=function(e){var n=this._listeners[e];if(n){for(var t=[],o=1;o<arguments.length;)t.push(arguments[o++]);for(o=0;o<n.length;)n[o].fn.apply(n[o++].ctx,t)}return this}});var Wc=Je((qS,Uc)=>{"use strict";Uc.exports=zc(zc);function zc(r){return typeof Float32Array<"u"?function(){var e=new Float32Array([-0]),n=new Uint8Array(e.buffer),t=n[3]===128;function o(u,l,f){e[0]=u,l[f]=n[0],l[f+1]=n[1],l[f+2]=n[2],l[f+3]=n[3]}function i(u,l,f){e[0]=u,l[f]=n[3],l[f+1]=n[2],l[f+2]=n[1],l[f+3]=n[0]}r.writeFloatLE=t?o:i,r.writeFloatBE=t?i:o;function s(u,l){return n[0]=u[l],n[1]=u[l+1],n[2]=u[l+2],n[3]=u[l+3],e[0]}function a(u,l){return n[3]=u[l],n[2]=u[l+1],n[1]=u[l+2],n[0]=u[l+3],e[0]}r.readFloatLE=t?s:a,r.readFloatBE=t?a:s}():function(){function e(t,o,i,s){var a=o<0?1:0;if(a&&(o=-o),o===0)t(1/o>0?0:2147483648,i,s);else if(isNaN(o))t(2143289344,i,s);else if(o>34028234663852886e22)t((a<<31|2139095040)>>>0,i,s);else if(o<11754943508222875e-54)t((a<<31|Math.round(o/1401298464324817e-60))>>>0,i,s);else{var u=Math.floor(Math.log(o)/Math.LN2),l=Math.round(o*Math.pow(2,-u)*8388608)&8388607;t((a<<31|u+127<<23|l)>>>0,i,s)}}r.writeFloatLE=e.bind(null,Fc),r.writeFloatBE=e.bind(null,Mc);function n(t,o,i){var s=t(o,i),a=(s>>31)*2+1,u=s>>>23&255,l=s&8388607;return u===255?l?NaN:a*(1/0):u===0?a*1401298464324817e-60*l:a*Math.pow(2,u-150)*(l+8388608)}r.readFloatLE=n.bind(null,Vc),r.readFloatBE=n.bind(null,Gc)}(),typeof Float64Array<"u"?function(){var e=new Float64Array([-0]),n=new Uint8Array(e.buffer),t=n[7]===128;function o(u,l,f){e[0]=u,l[f]=n[0],l[f+1]=n[1],l[f+2]=n[2],l[f+3]=n[3],l[f+4]=n[4],l[f+5]=n[5],l[f+6]=n[6],l[f+7]=n[7]}function i(u,l,f){e[0]=u,l[f]=n[7],l[f+1]=n[6],l[f+2]=n[5],l[f+3]=n[4],l[f+4]=n[3],l[f+5]=n[2],l[f+6]=n[1],l[f+7]=n[0]}r.writeDoubleLE=t?o:i,r.writeDoubleBE=t?i:o;function s(u,l){return n[0]=u[l],n[1]=u[l+1],n[2]=u[l+2],n[3]=u[l+3],n[4]=u[l+4],n[5]=u[l+5],n[6]=u[l+6],n[7]=u[l+7],e[0]}function a(u,l){return n[7]=u[l],n[6]=u[l+1],n[5]=u[l+2],n[4]=u[l+3],n[3]=u[l+4],n[2]=u[l+5],n[1]=u[l+6],n[0]=u[l+7],e[0]}r.readDoubleLE=t?s:a,r.readDoubleBE=t?a:s}():function(){function e(t,o,i,s,a,u){var l=s<0?1:0;if(l&&(s=-s),s===0)t(0,a,u+o),t(1/s>0?0:2147483648,a,u+i);else if(isNaN(s))t(0,a,u+o),t(2146959360,a,u+i);else if(s>17976931348623157e292)t(0,a,u+o),t((l<<31|2146435072)>>>0,a,u+i);else{var f;if(s<22250738585072014e-324)f=s/5e-324,t(f>>>0,a,u+o),t((l<<31|f/4294967296)>>>0,a,u+i);else{var c=Math.floor(Math.log(s)/Math.LN2);c===1024&&(c=1023),f=s*Math.pow(2,-c),t(f*4503599627370496>>>0,a,u+o),t((l<<31|c+1023<<20|f*1048576&1048575)>>>0,a,u+i)}}}r.writeDoubleLE=e.bind(null,Fc,0,4),r.writeDoubleBE=e.bind(null,Mc,4,0);function n(t,o,i,s,a){var u=t(s,a+o),l=t(s,a+i),f=(l>>31)*2+1,c=l>>>20&2047,p=4294967296*(l&1048575)+u;return c===2047?p?NaN:f*(1/0):c===0?f*5e-324*p:f*Math.pow(2,c-1075)*(p+4503599627370496)}r.readDoubleLE=n.bind(null,Vc,0,4),r.readDoubleBE=n.bind(null,Gc,4,0)}(),r}function Fc(r,e,n){e[n]=r&255,e[n+1]=r>>>8&255,e[n+2]=r>>>16&255,e[n+3]=r>>>24}function Mc(r,e,n){e[n]=r>>>24,e[n+1]=r>>>16&255,e[n+2]=r>>>8&255,e[n+3]=r&255}function Vc(r,e){return(r[e]|r[e+1]<<8|r[e+2]<<16|r[e+3]<<24)>>>0}function Gc(r,e){return(r[e]<<24|r[e+1]<<16|r[e+2]<<8|r[e+3])>>>0}});var Hc=Je((exports,module)=>{"use strict";module.exports=inquire;function inquire(moduleName){try{var mod=eval("quire".replace(/^/,"re"))(moduleName);if(mod&&(mod.length||Object.keys(mod).length))return mod}catch(r){}return null}});var Kc=Je(qc=>{"use strict";var Da=qc;Da.length=function(e){for(var n=0,t=0,o=0;o<e.length;++o)t=e.charCodeAt(o),t<128?n+=1:t<2048?n+=2:(t&64512)===55296&&(e.charCodeAt(o+1)&64512)===56320?(++o,n+=4):n+=3;return n};Da.read=function(e,n,t){var o=t-n;if(o<1)return"";for(var i=null,s=[],a=0,u;n<t;)u=e[n++],u<128?s[a++]=u:u>191&&u<224?s[a++]=(u&31)<<6|e[n++]&63:u>239&&u<365?(u=((u&7)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,s[a++]=55296+(u>>10),s[a++]=56320+(u&1023)):s[a++]=(u&15)<<12|(e[n++]&63)<<6|e[n++]&63,a>8191&&((i||(i=[])).push(String.fromCharCode.apply(String,s)),a=0);return i?(a&&i.push(String.fromCharCode.apply(String,s.slice(0,a))),i.join("")):String.fromCharCode.apply(String,s.slice(0,a))};Da.write=function(e,n,t){for(var o=t,i,s,a=0;a<e.length;++a)i=e.charCodeAt(a),i<128?n[t++]=i:i<2048?(n[t++]=i>>6|192,n[t++]=i&63|128):(i&64512)===55296&&((s=e.charCodeAt(a+1))&64512)===56320?(i=65536+((i&1023)<<10)+(s&1023),++a,n[t++]=i>>18|240,n[t++]=i>>12&63|128,n[t++]=i>>6&63|128,n[t++]=i&63|128):(n[t++]=i>>12|224,n[t++]=i>>6&63|128,n[t++]=i&63|128);return t-o}});var Xc=Je((jS,jc)=>{"use strict";jc.exports=pv;function pv(r,e,n){var t=n||8192,o=t>>>1,i=null,s=t;return function(u){if(u<1||u>o)return r(u);s+u>t&&(i=r(t),s=0);var l=e.call(i,s,s+=u);return s&7&&(s=(s|7)+1),l}}});var Yc=Je((XS,Zc)=>{"use strict";Zc.exports=at;var kn=_r();function at(r,e){this.lo=r>>>0,this.hi=e>>>0}var Rr=at.zero=new at(0,0);Rr.toNumber=function(){return 0};Rr.zzEncode=Rr.zzDecode=function(){return this};Rr.length=function(){return 1};var mv=at.zeroHash="\0\0\0\0\0\0\0\0";at.fromNumber=function(e){if(e===0)return Rr;var n=e<0;n&&(e=-e);var t=e>>>0,o=(e-t)/4294967296>>>0;return n&&(o=~o>>>0,t=~t>>>0,++t>4294967295&&(t=0,++o>4294967295&&(o=0))),new at(t,o)};at.from=function(e){if(typeof e=="number")return at.fromNumber(e);if(kn.isString(e))if(kn.Long)e=kn.Long.fromString(e);else return at.fromNumber(parseInt(e,10));return e.low||e.high?new at(e.low>>>0,e.high>>>0):Rr};at.prototype.toNumber=function(e){if(!e&&this.hi>>>31){var n=~this.lo+1>>>0,t=~this.hi>>>0;return n||(t=t+1>>>0),-(n+t*4294967296)}return this.lo+this.hi*4294967296};at.prototype.toLong=function(e){return kn.Long?new kn.Long(this.lo|0,this.hi|0,!!e):{low:this.lo|0,high:this.hi|0,unsigned:!!e}};var Tr=String.prototype.charCodeAt;at.fromHash=function(e){return e===mv?Rr:new at((Tr.call(e,0)|Tr.call(e,1)<<8|Tr.call(e,2)<<16|Tr.call(e,3)<<24)>>>0,(Tr.call(e,4)|Tr.call(e,5)<<8|Tr.call(e,6)<<16|Tr.call(e,7)<<24)>>>0)};at.prototype.toHash=function(){return String.fromCharCode(this.lo&255,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,this.hi&255,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)};at.prototype.zzEncode=function(){var e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this};at.prototype.zzDecode=function(){var e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this};at.prototype.length=function(){var e=this.lo,n=(this.lo>>>28|this.hi<<4)>>>0,t=this.hi>>>24;return t===0?n===0?e<16384?e<128?1:2:e<2097152?3:4:n<16384?n<128?5:6:n<2097152?7:8:t<128?9:10}});var _r=Je(Ba=>{"use strict";var re=Ba;re.asPromise=Cc();re.base64=Lc();re.EventEmitter=Nc();re.float=Wc();re.inquire=Hc();re.utf8=Kc();re.pool=Xc();re.LongBits=Yc();re.isNode=!!(typeof global<"u"&&global&&global.process&&global.process.versions&&global.process.versions.node);re.global=re.isNode&&global||typeof window<"u"&&window||typeof self<"u"&&self||Ba;re.emptyArray=Object.freeze?Object.freeze([]):[];re.emptyObject=Object.freeze?Object.freeze({}):{};re.isInteger=Number.isInteger||function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e};re.isString=function(e){return typeof e=="string"||e instanceof String};re.isObject=function(e){return e&&typeof e=="object"};re.isset=re.isSet=function(e,n){var t=e[n];return t!=null&&e.hasOwnProperty(n)?typeof t!="object"||(Array.isArray(t)?t.length:Object.keys(t).length)>0:!1};re.Buffer=function(){try{var r=re.inquire("buffer").Buffer;return r.prototype.utf8Write?r:null}catch{return null}}();re._Buffer_from=null;re._Buffer_allocUnsafe=null;re.newBuffer=function(e){return typeof e=="number"?re.Buffer?re._Buffer_allocUnsafe(e):new re.Array(e):re.Buffer?re._Buffer_from(e):typeof Uint8Array>"u"?e:new Uint8Array(e)};re.Array=typeof Uint8Array<"u"?Uint8Array:Array;re.Long=re.global.dcodeIO&&re.global.dcodeIO.Long||re.global.Long||re.inquire("long");re.key2Re=/^true|false|0|1$/;re.key32Re=/^-?(?:0|[1-9][0-9]*)$/;re.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;re.longToHash=function(e){return e?re.LongBits.from(e).toHash():re.LongBits.zeroHash};re.longFromHash=function(e,n){var t=re.LongBits.fromHash(e);return re.Long?re.Long.fromBits(t.lo,t.hi,n):t.toNumber(!!n)};function Jc(r,e,n){for(var t=Object.keys(e),o=0;o<t.length;++o)(r[t[o]]===void 0||!n)&&(r[t[o]]=e[t[o]]);return r}re.merge=Jc;re.lcFirst=function(e){return e.charAt(0).toLowerCase()+e.substring(1)};function Qc(r){function e(n,t){if(!(this instanceof e))return new e(n,t);Object.defineProperty(this,"message",{get:function(){return n}}),Error.captureStackTrace?Error.captureStackTrace(this,e):Object.defineProperty(this,"stack",{value:new Error().stack||""}),t&&Jc(this,t)}return e.prototype=Object.create(Error.prototype,{constructor:{value:e,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return r},set:void 0,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+": "+this.message},writable:!0,enumerable:!1,configurable:!0}}),e}re.newError=Qc;re.ProtocolError=Qc("ProtocolError");re.oneOfGetter=function(e){for(var n={},t=0;t<e.length;++t)n[e[t]]=1;return function(){for(var o=Object.keys(this),i=o.length-1;i>-1;--i)if(n[o[i]]===1&&this[o[i]]!==void 0&&this[o[i]]!==null)return o[i]}};re.oneOfSetter=function(e){return function(n){for(var t=0;t<e.length;++t)e[t]!==n&&delete this[e[t]]}};re.toJSONOptions={longs:String,enums:String,bytes:String,json:!0};re._configure=function(){var r=re.Buffer;if(!r){re._Buffer_from=re._Buffer_allocUnsafe=null;return}re._Buffer_from=r.from!==Uint8Array.from&&r.from||function(n,t){return new r(n,t)},re._Buffer_allocUnsafe=r.allocUnsafe||function(n){return new r(n)}}});var Va=Je((YS,nf)=>{"use strict";nf.exports=Pe;var Ct=_r(),La,Lo=Ct.LongBits,ef=Ct.base64,tf=Ct.utf8;function Dn(r,e,n){this.fn=r,this.len=e,this.next=void 0,this.val=n}function Na(){}function hv(r){this.head=r.head,this.tail=r.tail,this.len=r.len,this.next=r.states}function Pe(){this.len=0,this.head=new Dn(Na,0,0),this.tail=this.head,this.states=null}var rf=function(){return Ct.Buffer?function(){return(Pe.create=function(){return new La})()}:function(){return new Pe}};Pe.create=rf();Pe.alloc=function(e){return new Ct.Array(e)};Ct.Array!==Array&&(Pe.alloc=Ct.pool(Pe.alloc,Ct.Array.prototype.subarray));Pe.prototype._push=function(e,n,t){return this.tail=this.tail.next=new Dn(e,n,t),this.len+=n,this};function za(r,e,n){e[n]=r&255}function gv(r,e,n){for(;r>127;)e[n++]=r&127|128,r>>>=7;e[n]=r}function Fa(r,e){this.len=r,this.next=void 0,this.val=e}Fa.prototype=Object.create(Dn.prototype);Fa.prototype.fn=gv;Pe.prototype.uint32=function(e){return this.len+=(this.tail=this.tail.next=new Fa((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this};Pe.prototype.int32=function(e){return e<0?this._push(Ma,10,Lo.fromNumber(e)):this.uint32(e)};Pe.prototype.sint32=function(e){return this.uint32((e<<1^e>>31)>>>0)};function Ma(r,e,n){for(;r.hi;)e[n++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[n++]=r.lo&127|128,r.lo=r.lo>>>7;e[n++]=r.lo}Pe.prototype.uint64=function(e){var n=Lo.from(e);return this._push(Ma,n.length(),n)};Pe.prototype.int64=Pe.prototype.uint64;Pe.prototype.sint64=function(e){var n=Lo.from(e).zzEncode();return this._push(Ma,n.length(),n)};Pe.prototype.bool=function(e){return this._push(za,1,e?1:0)};function Ra(r,e,n){e[n]=r&255,e[n+1]=r>>>8&255,e[n+2]=r>>>16&255,e[n+3]=r>>>24}Pe.prototype.fixed32=function(e){return this._push(Ra,4,e>>>0)};Pe.prototype.sfixed32=Pe.prototype.fixed32;Pe.prototype.fixed64=function(e){var n=Lo.from(e);return this._push(Ra,4,n.lo)._push(Ra,4,n.hi)};Pe.prototype.sfixed64=Pe.prototype.fixed64;Pe.prototype.float=function(e){return this._push(Ct.float.writeFloatLE,4,e)};Pe.prototype.double=function(e){return this._push(Ct.float.writeDoubleLE,8,e)};var bv=Ct.Array.prototype.set?function(e,n,t){n.set(e,t)}:function(e,n,t){for(var o=0;o<e.length;++o)n[t+o]=e[o]};Pe.prototype.bytes=function(e){var n=e.length>>>0;if(!n)return this._push(za,1,0);if(Ct.isString(e)){var t=Pe.alloc(n=ef.length(e));ef.decode(e,t,0),e=t}return this.uint32(n)._push(bv,n,e)};Pe.prototype.string=function(e){var n=tf.length(e);return n?this.uint32(n)._push(tf.write,n,e):this._push(za,1,0)};Pe.prototype.fork=function(){return this.states=new hv(this),this.head=this.tail=new Dn(Na,0,0),this.len=0,this};Pe.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Dn(Na,0,0),this.len=0),this};Pe.prototype.ldelim=function(){var e=this.head,n=this.tail,t=this.len;return this.reset().uint32(t),t&&(this.tail.next=e.next,this.tail=n,this.len+=t),this};Pe.prototype.finish=function(){for(var e=this.head.next,n=this.constructor.alloc(this.len),t=0;e;)e.fn(e.val,n,t),t+=e.len,e=e.next;return n};Pe._configure=function(r){La=r,Pe.create=rf(),La._configure()}});var sf=Je((JS,af)=>{"use strict";af.exports=Jt;var of=Va();(Jt.prototype=Object.create(of.prototype)).constructor=Jt;var Ir=_r();function Jt(){of.call(this)}Jt._configure=function(){Jt.alloc=Ir._Buffer_allocUnsafe,Jt.writeBytesBuffer=Ir.Buffer&&Ir.Buffer.prototype instanceof Uint8Array&&Ir.Buffer.prototype.set.name==="set"?function(e,n,t){n.set(e,t)}:function(e,n,t){if(e.copy)e.copy(n,t,0,e.length);else for(var o=0;o<e.length;)n[t++]=e[o++]}};Jt.prototype.bytes=function(e){Ir.isString(e)&&(e=Ir._Buffer_from(e,"base64"));var n=e.length>>>0;return this.uint32(n),n&&this._push(Jt.writeBytesBuffer,n,e),this};function yv(r,e,n){r.length<40?Ir.utf8.write(r,e,n):e.utf8Write?e.utf8Write(r,n):e.write(r,n)}Jt.prototype.string=function(e){var n=Ir.Buffer.byteLength(e);return this.uint32(n),n&&this._push(yv,n,e),this};Jt._configure()});var Wa=Je((QS,df)=>{"use strict";df.exports=je;var Mt=_r(),Ua,cf=Mt.LongBits,xv=Mt.utf8;function Vt(r,e){return RangeError("index out of range: "+r.pos+" + "+(e||1)+" > "+r.len)}function je(r){this.buf=r,this.pos=0,this.len=r.length}var uf=typeof Uint8Array<"u"?function(e){if(e instanceof Uint8Array||Array.isArray(e))return new je(e);throw Error("illegal buffer")}:function(e){if(Array.isArray(e))return new je(e);throw Error("illegal buffer")},ff=function(){return Mt.Buffer?function(n){return(je.create=function(o){return Mt.Buffer.isBuffer(o)?new Ua(o):uf(o)})(n)}:uf};je.create=ff();je.prototype._slice=Mt.Array.prototype.subarray||Mt.Array.prototype.slice;je.prototype.uint32=function(){var e=4294967295;return function(){if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Vt(this,10);return e}}();je.prototype.int32=function(){return this.uint32()|0};je.prototype.sint32=function(){var e=this.uint32();return e>>>1^-(e&1)|0};function Ga(){var r=new cf(0,0),e=0;if(this.len-this.pos>4){for(;e<4;++e)if(r.lo=(r.lo|(this.buf[this.pos]&127)<<e*7)>>>0,this.buf[this.pos++]<128)return r;if(r.lo=(r.lo|(this.buf[this.pos]&127)<<28)>>>0,r.hi=(r.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return r;e=0}else{for(;e<3;++e){if(this.pos>=this.len)throw Vt(this);if(r.lo=(r.lo|(this.buf[this.pos]&127)<<e*7)>>>0,this.buf[this.pos++]<128)return r}return r.lo=(r.lo|(this.buf[this.pos++]&127)<<e*7)>>>0,r}if(this.len-this.pos>4){for(;e<5;++e)if(r.hi=(r.hi|(this.buf[this.pos]&127)<<e*7+3)>>>0,this.buf[this.pos++]<128)return r}else for(;e<5;++e){if(this.pos>=this.len)throw Vt(this);if(r.hi=(r.hi|(this.buf[this.pos]&127)<<e*7+3)>>>0,this.buf[this.pos++]<128)return r}throw Error("invalid varint encoding")}je.prototype.bool=function(){return this.uint32()!==0};function Ro(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}je.prototype.fixed32=function(){if(this.pos+4>this.len)throw Vt(this,4);return Ro(this.buf,this.pos+=4)};je.prototype.sfixed32=function(){if(this.pos+4>this.len)throw Vt(this,4);return Ro(this.buf,this.pos+=4)|0};function lf(){if(this.pos+8>this.len)throw Vt(this,8);return new cf(Ro(this.buf,this.pos+=4),Ro(this.buf,this.pos+=4))}je.prototype.float=function(){if(this.pos+4>this.len)throw Vt(this,4);var e=Mt.float.readFloatLE(this.buf,this.pos);return this.pos+=4,e};je.prototype.double=function(){if(this.pos+8>this.len)throw Vt(this,4);var e=Mt.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,e};je.prototype.bytes=function(){var e=this.uint32(),n=this.pos,t=this.pos+e;if(t>this.len)throw Vt(this,e);if(this.pos+=e,Array.isArray(this.buf))return this.buf.slice(n,t);if(n===t){var o=Mt.Buffer;return o?o.alloc(0):new this.buf.constructor(0)}return this._slice.call(this.buf,n,t)};je.prototype.string=function(){var e=this.bytes();return xv.read(e,0,e.length)};je.prototype.skip=function(e){if(typeof e=="number"){if(this.pos+e>this.len)throw Vt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Vt(this);while(this.buf[this.pos++]&128);return this};je.prototype.skipType=function(r){switch(r){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(r=this.uint32()&7)!==4;)this.skipType(r);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+r+" at offset "+this.pos)}return this};je._configure=function(r){Ua=r,je.create=ff(),Ua._configure();var e=Mt.Long?"toLong":"toNumber";Mt.merge(je.prototype,{int64:function(){return Ga.call(this)[e](!1)},uint64:function(){return Ga.call(this)[e](!0)},sint64:function(){return Ga.call(this).zzDecode()[e](!1)},fixed64:function(){return lf.call(this)[e](!0)},sfixed64:function(){return lf.call(this)[e](!1)}})}});var gf=Je((e$,hf)=>{"use strict";hf.exports=Nr;var mf=Wa();(Nr.prototype=Object.create(mf.prototype)).constructor=Nr;var pf=_r();function Nr(r){mf.call(this,r)}Nr._configure=function(){pf.Buffer&&(Nr.prototype._slice=pf.Buffer.prototype.slice)};Nr.prototype.string=function(){var e=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+e,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+e,this.len))};Nr._configure()});var yf=Je((t$,bf)=>{"use strict";bf.exports=Bn;var Ha=_r();(Bn.prototype=Object.create(Ha.EventEmitter.prototype)).constructor=Bn;function Bn(r,e,n){if(typeof r!="function")throw TypeError("rpcImpl must be a function");Ha.EventEmitter.call(this),this.rpcImpl=r,this.requestDelimited=!!e,this.responseDelimited=!!n}Bn.prototype.rpcCall=function r(e,n,t,o,i){if(!o)throw TypeError("request must be specified");var s=this;if(!i)return Ha.asPromise(r,s,e,n,t,o);if(!s.rpcImpl){setTimeout(function(){i(Error("already ended"))},0);return}try{return s.rpcImpl(e,n[s.requestDelimited?"encodeDelimited":"encode"](o).finish(),function(u,l){if(u)return s.emit("error",u,e),i(u);if(l===null){s.end(!0);return}if(!(l instanceof t))try{l=t[s.responseDelimited?"decodeDelimited":"decode"](l)}catch(f){return s.emit("error",f,e),i(f)}return s.emit("data",l,e),i(null,l)})}catch(a){s.emit("error",a,e),setTimeout(function(){i(a)},0);return}};Bn.prototype.end=function(e){return this.rpcImpl&&(e||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}});var vf=Je(xf=>{"use strict";var vv=xf;vv.Service=yf()});var Tf=Je((n$,wf)=>{"use strict";wf.exports={}});var Sf=Je(If=>{"use strict";var vt=If;vt.build="minimal";vt.Writer=Va();vt.BufferWriter=sf();vt.Reader=Wa();vt.BufferReader=gf();vt.util=_r();vt.rpc=vf();vt.roots=Tf();vt.configure=_f;function _f(){vt.util._configure(),vt.Writer._configure(vt.BufferWriter),vt.Reader._configure(vt.BufferReader)}_f()});var Af=Je((i$,$f)=>{"use strict";$f.exports=Sf()});var dn=Je((a$,Pf)=>{"use strict";var Ve=Af(),H=Ve.Reader,Xe=Ve.Writer,A=Ve.util,I=Ve.roots.default||(Ve.roots.default={});I.onnx=function(){var r={};return r.Version=function(){var e={},n=Object.create(e);return n[e[0]="_START_VERSION"]=0,n[e[1]="IR_VERSION_2017_10_10"]=1,n[e[2]="IR_VERSION_2017_10_30"]=2,n[e[3]="IR_VERSION_2017_11_3"]=3,n[e[4]="IR_VERSION_2019_1_22"]=4,n[e[5]="IR_VERSION_2019_3_18"]=5,n[e[6]="IR_VERSION_2019_9_19"]=6,n[e[7]="IR_VERSION_2020_5_8"]=7,n[e[8]="IR_VERSION_2021_7_30"]=8,n[e[9]="IR_VERSION"]=9,n}(),r.AttributeProto=function(){function e(n){if(this.floats=[],this.ints=[],this.strings=[],this.tensors=[],this.graphs=[],this.sparseTensors=[],this.typeProtos=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.name="",e.prototype.refAttrName="",e.prototype.docString="",e.prototype.type=0,e.prototype.f=0,e.prototype.i=A.Long?A.Long.fromBits(0,0,!1):0,e.prototype.s=A.newBuffer([]),e.prototype.t=null,e.prototype.g=null,e.prototype.sparseTensor=null,e.prototype.tp=null,e.prototype.floats=A.emptyArray,e.prototype.ints=A.emptyArray,e.prototype.strings=A.emptyArray,e.prototype.tensors=A.emptyArray,e.prototype.graphs=A.emptyArray,e.prototype.sparseTensors=A.emptyArray,e.prototype.typeProtos=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(10).string(t.name),t.f!=null&&Object.hasOwnProperty.call(t,"f")&&o.uint32(21).float(t.f),t.i!=null&&Object.hasOwnProperty.call(t,"i")&&o.uint32(24).int64(t.i),t.s!=null&&Object.hasOwnProperty.call(t,"s")&&o.uint32(34).bytes(t.s),t.t!=null&&Object.hasOwnProperty.call(t,"t")&&I.onnx.TensorProto.encode(t.t,o.uint32(42).fork()).ldelim(),t.g!=null&&Object.hasOwnProperty.call(t,"g")&&I.onnx.GraphProto.encode(t.g,o.uint32(50).fork()).ldelim(),t.floats!=null&&t.floats.length){o.uint32(58).fork();for(var i=0;i<t.floats.length;++i)o.float(t.floats[i]);o.ldelim()}if(t.ints!=null&&t.ints.length){o.uint32(66).fork();for(var i=0;i<t.ints.length;++i)o.int64(t.ints[i]);o.ldelim()}if(t.strings!=null&&t.strings.length)for(var i=0;i<t.strings.length;++i)o.uint32(74).bytes(t.strings[i]);if(t.tensors!=null&&t.tensors.length)for(var i=0;i<t.tensors.length;++i)I.onnx.TensorProto.encode(t.tensors[i],o.uint32(82).fork()).ldelim();if(t.graphs!=null&&t.graphs.length)for(var i=0;i<t.graphs.length;++i)I.onnx.GraphProto.encode(t.graphs[i],o.uint32(90).fork()).ldelim();if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(106).string(t.docString),t.tp!=null&&Object.hasOwnProperty.call(t,"tp")&&I.onnx.TypeProto.encode(t.tp,o.uint32(114).fork()).ldelim(),t.typeProtos!=null&&t.typeProtos.length)for(var i=0;i<t.typeProtos.length;++i)I.onnx.TypeProto.encode(t.typeProtos[i],o.uint32(122).fork()).ldelim();if(t.type!=null&&Object.hasOwnProperty.call(t,"type")&&o.uint32(160).int32(t.type),t.refAttrName!=null&&Object.hasOwnProperty.call(t,"refAttrName")&&o.uint32(170).string(t.refAttrName),t.sparseTensor!=null&&Object.hasOwnProperty.call(t,"sparseTensor")&&I.onnx.SparseTensorProto.encode(t.sparseTensor,o.uint32(178).fork()).ldelim(),t.sparseTensors!=null&&t.sparseTensors.length)for(var i=0;i<t.sparseTensors.length;++i)I.onnx.SparseTensorProto.encode(t.sparseTensors[i],o.uint32(186).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.AttributeProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.name=t.string();break}case 21:{s.refAttrName=t.string();break}case 13:{s.docString=t.string();break}case 20:{s.type=t.int32();break}case 2:{s.f=t.float();break}case 3:{s.i=t.int64();break}case 4:{s.s=t.bytes();break}case 5:{s.t=I.onnx.TensorProto.decode(t,t.uint32());break}case 6:{s.g=I.onnx.GraphProto.decode(t,t.uint32());break}case 22:{s.sparseTensor=I.onnx.SparseTensorProto.decode(t,t.uint32());break}case 14:{s.tp=I.onnx.TypeProto.decode(t,t.uint32());break}case 7:{if(s.floats&&s.floats.length||(s.floats=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.floats.push(t.float());else s.floats.push(t.float());break}case 8:{if(s.ints&&s.ints.length||(s.ints=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.ints.push(t.int64());else s.ints.push(t.int64());break}case 9:{s.strings&&s.strings.length||(s.strings=[]),s.strings.push(t.bytes());break}case 10:{s.tensors&&s.tensors.length||(s.tensors=[]),s.tensors.push(I.onnx.TensorProto.decode(t,t.uint32()));break}case 11:{s.graphs&&s.graphs.length||(s.graphs=[]),s.graphs.push(I.onnx.GraphProto.decode(t,t.uint32()));break}case 23:{s.sparseTensors&&s.sparseTensors.length||(s.sparseTensors=[]),s.sparseTensors.push(I.onnx.SparseTensorProto.decode(t,t.uint32()));break}case 15:{s.typeProtos&&s.typeProtos.length||(s.typeProtos=[]),s.typeProtos.push(I.onnx.TypeProto.decode(t,t.uint32()));break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.name!=null&&t.hasOwnProperty("name")&&!A.isString(t.name))return"name: string expected";if(t.refAttrName!=null&&t.hasOwnProperty("refAttrName")&&!A.isString(t.refAttrName))return"refAttrName: string expected";if(t.docString!=null&&t.hasOwnProperty("docString")&&!A.isString(t.docString))return"docString: string expected";if(t.type!=null&&t.hasOwnProperty("type"))switch(t.type){default:return"type: enum value expected";case 0:case 1:case 2:case 3:case 4:case 5:case 11:case 13:case 6:case 7:case 8:case 9:case 10:case 12:case 14:break}if(t.f!=null&&t.hasOwnProperty("f")&&typeof t.f!="number")return"f: number expected";if(t.i!=null&&t.hasOwnProperty("i")&&!A.isInteger(t.i)&&!(t.i&&A.isInteger(t.i.low)&&A.isInteger(t.i.high)))return"i: integer|Long expected";if(t.s!=null&&t.hasOwnProperty("s")&&!(t.s&&typeof t.s.length=="number"||A.isString(t.s)))return"s: buffer expected";if(t.t!=null&&t.hasOwnProperty("t")){var o=I.onnx.TensorProto.verify(t.t);if(o)return"t."+o}if(t.g!=null&&t.hasOwnProperty("g")){var o=I.onnx.GraphProto.verify(t.g);if(o)return"g."+o}if(t.sparseTensor!=null&&t.hasOwnProperty("sparseTensor")){var o=I.onnx.SparseTensorProto.verify(t.sparseTensor);if(o)return"sparseTensor."+o}if(t.tp!=null&&t.hasOwnProperty("tp")){var o=I.onnx.TypeProto.verify(t.tp);if(o)return"tp."+o}if(t.floats!=null&&t.hasOwnProperty("floats")){if(!Array.isArray(t.floats))return"floats: array expected";for(var i=0;i<t.floats.length;++i)if(typeof t.floats[i]!="number")return"floats: number[] expected"}if(t.ints!=null&&t.hasOwnProperty("ints")){if(!Array.isArray(t.ints))return"ints: array expected";for(var i=0;i<t.ints.length;++i)if(!A.isInteger(t.ints[i])&&!(t.ints[i]&&A.isInteger(t.ints[i].low)&&A.isInteger(t.ints[i].high)))return"ints: integer|Long[] expected"}if(t.strings!=null&&t.hasOwnProperty("strings")){if(!Array.isArray(t.strings))return"strings: array expected";for(var i=0;i<t.strings.length;++i)if(!(t.strings[i]&&typeof t.strings[i].length=="number"||A.isString(t.strings[i])))return"strings: buffer[] expected"}if(t.tensors!=null&&t.hasOwnProperty("tensors")){if(!Array.isArray(t.tensors))return"tensors: array expected";for(var i=0;i<t.tensors.length;++i){var o=I.onnx.TensorProto.verify(t.tensors[i]);if(o)return"tensors."+o}}if(t.graphs!=null&&t.hasOwnProperty("graphs")){if(!Array.isArray(t.graphs))return"graphs: array expected";for(var i=0;i<t.graphs.length;++i){var o=I.onnx.GraphProto.verify(t.graphs[i]);if(o)return"graphs."+o}}if(t.sparseTensors!=null&&t.hasOwnProperty("sparseTensors")){if(!Array.isArray(t.sparseTensors))return"sparseTensors: array expected";for(var i=0;i<t.sparseTensors.length;++i){var o=I.onnx.SparseTensorProto.verify(t.sparseTensors[i]);if(o)return"sparseTensors."+o}}if(t.typeProtos!=null&&t.hasOwnProperty("typeProtos")){if(!Array.isArray(t.typeProtos))return"typeProtos: array expected";for(var i=0;i<t.typeProtos.length;++i){var o=I.onnx.TypeProto.verify(t.typeProtos[i]);if(o)return"typeProtos."+o}}return null},e.fromObject=function(t){if(t instanceof I.onnx.AttributeProto)return t;var o=new I.onnx.AttributeProto;switch(t.name!=null&&(o.name=String(t.name)),t.refAttrName!=null&&(o.refAttrName=String(t.refAttrName)),t.docString!=null&&(o.docString=String(t.docString)),t.type){default:if(typeof t.type=="number"){o.type=t.type;break}break;case"UNDEFINED":case 0:o.type=0;break;case"FLOAT":case 1:o.type=1;break;case"INT":case 2:o.type=2;break;case"STRING":case 3:o.type=3;break;case"TENSOR":case 4:o.type=4;break;case"GRAPH":case 5:o.type=5;break;case"SPARSE_TENSOR":case 11:o.type=11;break;case"TYPE_PROTO":case 13:o.type=13;break;case"FLOATS":case 6:o.type=6;break;case"INTS":case 7:o.type=7;break;case"STRINGS":case 8:o.type=8;break;case"TENSORS":case 9:o.type=9;break;case"GRAPHS":case 10:o.type=10;break;case"SPARSE_TENSORS":case 12:o.type=12;break;case"TYPE_PROTOS":case 14:o.type=14;break}if(t.f!=null&&(o.f=Number(t.f)),t.i!=null&&(A.Long?(o.i=A.Long.fromValue(t.i)).unsigned=!1:typeof t.i=="string"?o.i=parseInt(t.i,10):typeof t.i=="number"?o.i=t.i:typeof t.i=="object"&&(o.i=new A.LongBits(t.i.low>>>0,t.i.high>>>0).toNumber())),t.s!=null&&(typeof t.s=="string"?A.base64.decode(t.s,o.s=A.newBuffer(A.base64.length(t.s)),0):t.s.length>=0&&(o.s=t.s)),t.t!=null){if(typeof t.t!="object")throw TypeError(".onnx.AttributeProto.t: object expected");o.t=I.onnx.TensorProto.fromObject(t.t)}if(t.g!=null){if(typeof t.g!="object")throw TypeError(".onnx.AttributeProto.g: object expected");o.g=I.onnx.GraphProto.fromObject(t.g)}if(t.sparseTensor!=null){if(typeof t.sparseTensor!="object")throw TypeError(".onnx.AttributeProto.sparseTensor: object expected");o.sparseTensor=I.onnx.SparseTensorProto.fromObject(t.sparseTensor)}if(t.tp!=null){if(typeof t.tp!="object")throw TypeError(".onnx.AttributeProto.tp: object expected");o.tp=I.onnx.TypeProto.fromObject(t.tp)}if(t.floats){if(!Array.isArray(t.floats))throw TypeError(".onnx.AttributeProto.floats: array expected");o.floats=[];for(var i=0;i<t.floats.length;++i)o.floats[i]=Number(t.floats[i])}if(t.ints){if(!Array.isArray(t.ints))throw TypeError(".onnx.AttributeProto.ints: array expected");o.ints=[];for(var i=0;i<t.ints.length;++i)A.Long?(o.ints[i]=A.Long.fromValue(t.ints[i])).unsigned=!1:typeof t.ints[i]=="string"?o.ints[i]=parseInt(t.ints[i],10):typeof t.ints[i]=="number"?o.ints[i]=t.ints[i]:typeof t.ints[i]=="object"&&(o.ints[i]=new A.LongBits(t.ints[i].low>>>0,t.ints[i].high>>>0).toNumber())}if(t.strings){if(!Array.isArray(t.strings))throw TypeError(".onnx.AttributeProto.strings: array expected");o.strings=[];for(var i=0;i<t.strings.length;++i)typeof t.strings[i]=="string"?A.base64.decode(t.strings[i],o.strings[i]=A.newBuffer(A.base64.length(t.strings[i])),0):t.strings[i].length>=0&&(o.strings[i]=t.strings[i])}if(t.tensors){if(!Array.isArray(t.tensors))throw TypeError(".onnx.AttributeProto.tensors: array expected");o.tensors=[];for(var i=0;i<t.tensors.length;++i){if(typeof t.tensors[i]!="object")throw TypeError(".onnx.AttributeProto.tensors: object expected");o.tensors[i]=I.onnx.TensorProto.fromObject(t.tensors[i])}}if(t.graphs){if(!Array.isArray(t.graphs))throw TypeError(".onnx.AttributeProto.graphs: array expected");o.graphs=[];for(var i=0;i<t.graphs.length;++i){if(typeof t.graphs[i]!="object")throw TypeError(".onnx.AttributeProto.graphs: object expected");o.graphs[i]=I.onnx.GraphProto.fromObject(t.graphs[i])}}if(t.sparseTensors){if(!Array.isArray(t.sparseTensors))throw TypeError(".onnx.AttributeProto.sparseTensors: array expected");o.sparseTensors=[];for(var i=0;i<t.sparseTensors.length;++i){if(typeof t.sparseTensors[i]!="object")throw TypeError(".onnx.AttributeProto.sparseTensors: object expected");o.sparseTensors[i]=I.onnx.SparseTensorProto.fromObject(t.sparseTensors[i])}}if(t.typeProtos){if(!Array.isArray(t.typeProtos))throw TypeError(".onnx.AttributeProto.typeProtos: array expected");o.typeProtos=[];for(var i=0;i<t.typeProtos.length;++i){if(typeof t.typeProtos[i]!="object")throw TypeError(".onnx.AttributeProto.typeProtos: object expected");o.typeProtos[i]=I.onnx.TypeProto.fromObject(t.typeProtos[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.floats=[],i.ints=[],i.strings=[],i.tensors=[],i.graphs=[],i.typeProtos=[],i.sparseTensors=[]),o.defaults){if(i.name="",i.f=0,A.Long){var s=new A.Long(0,0,!1);i.i=o.longs===String?s.toString():o.longs===Number?s.toNumber():s}else i.i=o.longs===String?"0":0;o.bytes===String?i.s="":(i.s=[],o.bytes!==Array&&(i.s=A.newBuffer(i.s))),i.t=null,i.g=null,i.docString="",i.tp=null,i.type=o.enums===String?"UNDEFINED":0,i.refAttrName="",i.sparseTensor=null}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.f!=null&&t.hasOwnProperty("f")&&(i.f=o.json&&!isFinite(t.f)?String(t.f):t.f),t.i!=null&&t.hasOwnProperty("i")&&(typeof t.i=="number"?i.i=o.longs===String?String(t.i):t.i:i.i=o.longs===String?A.Long.prototype.toString.call(t.i):o.longs===Number?new A.LongBits(t.i.low>>>0,t.i.high>>>0).toNumber():t.i),t.s!=null&&t.hasOwnProperty("s")&&(i.s=o.bytes===String?A.base64.encode(t.s,0,t.s.length):o.bytes===Array?Array.prototype.slice.call(t.s):t.s),t.t!=null&&t.hasOwnProperty("t")&&(i.t=I.onnx.TensorProto.toObject(t.t,o)),t.g!=null&&t.hasOwnProperty("g")&&(i.g=I.onnx.GraphProto.toObject(t.g,o)),t.floats&&t.floats.length){i.floats=[];for(var a=0;a<t.floats.length;++a)i.floats[a]=o.json&&!isFinite(t.floats[a])?String(t.floats[a]):t.floats[a]}if(t.ints&&t.ints.length){i.ints=[];for(var a=0;a<t.ints.length;++a)typeof t.ints[a]=="number"?i.ints[a]=o.longs===String?String(t.ints[a]):t.ints[a]:i.ints[a]=o.longs===String?A.Long.prototype.toString.call(t.ints[a]):o.longs===Number?new A.LongBits(t.ints[a].low>>>0,t.ints[a].high>>>0).toNumber():t.ints[a]}if(t.strings&&t.strings.length){i.strings=[];for(var a=0;a<t.strings.length;++a)i.strings[a]=o.bytes===String?A.base64.encode(t.strings[a],0,t.strings[a].length):o.bytes===Array?Array.prototype.slice.call(t.strings[a]):t.strings[a]}if(t.tensors&&t.tensors.length){i.tensors=[];for(var a=0;a<t.tensors.length;++a)i.tensors[a]=I.onnx.TensorProto.toObject(t.tensors[a],o)}if(t.graphs&&t.graphs.length){i.graphs=[];for(var a=0;a<t.graphs.length;++a)i.graphs[a]=I.onnx.GraphProto.toObject(t.graphs[a],o)}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.tp!=null&&t.hasOwnProperty("tp")&&(i.tp=I.onnx.TypeProto.toObject(t.tp,o)),t.typeProtos&&t.typeProtos.length){i.typeProtos=[];for(var a=0;a<t.typeProtos.length;++a)i.typeProtos[a]=I.onnx.TypeProto.toObject(t.typeProtos[a],o)}if(t.type!=null&&t.hasOwnProperty("type")&&(i.type=o.enums===String?I.onnx.AttributeProto.AttributeType[t.type]===void 0?t.type:I.onnx.AttributeProto.AttributeType[t.type]:t.type),t.refAttrName!=null&&t.hasOwnProperty("refAttrName")&&(i.refAttrName=t.refAttrName),t.sparseTensor!=null&&t.hasOwnProperty("sparseTensor")&&(i.sparseTensor=I.onnx.SparseTensorProto.toObject(t.sparseTensor,o)),t.sparseTensors&&t.sparseTensors.length){i.sparseTensors=[];for(var a=0;a<t.sparseTensors.length;++a)i.sparseTensors[a]=I.onnx.SparseTensorProto.toObject(t.sparseTensors[a],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.AttributeProto"},e.AttributeType=function(){var n={},t=Object.create(n);return t[n[0]="UNDEFINED"]=0,t[n[1]="FLOAT"]=1,t[n[2]="INT"]=2,t[n[3]="STRING"]=3,t[n[4]="TENSOR"]=4,t[n[5]="GRAPH"]=5,t[n[11]="SPARSE_TENSOR"]=11,t[n[13]="TYPE_PROTO"]=13,t[n[6]="FLOATS"]=6,t[n[7]="INTS"]=7,t[n[8]="STRINGS"]=8,t[n[9]="TENSORS"]=9,t[n[10]="GRAPHS"]=10,t[n[12]="SPARSE_TENSORS"]=12,t[n[14]="TYPE_PROTOS"]=14,t}(),e}(),r.ValueInfoProto=function(){function e(n){if(n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.name="",e.prototype.type=null,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(t,o){return o||(o=Xe.create()),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(10).string(t.name),t.type!=null&&Object.hasOwnProperty.call(t,"type")&&I.onnx.TypeProto.encode(t.type,o.uint32(18).fork()).ldelim(),t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(26).string(t.docString),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.ValueInfoProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.name=t.string();break}case 2:{s.type=I.onnx.TypeProto.decode(t,t.uint32());break}case 3:{s.docString=t.string();break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.name!=null&&t.hasOwnProperty("name")&&!A.isString(t.name))return"name: string expected";if(t.type!=null&&t.hasOwnProperty("type")){var o=I.onnx.TypeProto.verify(t.type);if(o)return"type."+o}return t.docString!=null&&t.hasOwnProperty("docString")&&!A.isString(t.docString)?"docString: string expected":null},e.fromObject=function(t){if(t instanceof I.onnx.ValueInfoProto)return t;var o=new I.onnx.ValueInfoProto;if(t.name!=null&&(o.name=String(t.name)),t.type!=null){if(typeof t.type!="object")throw TypeError(".onnx.ValueInfoProto.type: object expected");o.type=I.onnx.TypeProto.fromObject(t.type)}return t.docString!=null&&(o.docString=String(t.docString)),o},e.toObject=function(t,o){o||(o={});var i={};return o.defaults&&(i.name="",i.type=null,i.docString=""),t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.type!=null&&t.hasOwnProperty("type")&&(i.type=I.onnx.TypeProto.toObject(t.type,o)),t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.ValueInfoProto"},e}(),r.NodeProto=function(){function e(n){if(this.input=[],this.output=[],this.attribute=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.input=A.emptyArray,e.prototype.output=A.emptyArray,e.prototype.name="",e.prototype.opType="",e.prototype.domain="",e.prototype.attribute=A.emptyArray,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.input!=null&&t.input.length)for(var i=0;i<t.input.length;++i)o.uint32(10).string(t.input[i]);if(t.output!=null&&t.output.length)for(var i=0;i<t.output.length;++i)o.uint32(18).string(t.output[i]);if(t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(26).string(t.name),t.opType!=null&&Object.hasOwnProperty.call(t,"opType")&&o.uint32(34).string(t.opType),t.attribute!=null&&t.attribute.length)for(var i=0;i<t.attribute.length;++i)I.onnx.AttributeProto.encode(t.attribute[i],o.uint32(42).fork()).ldelim();return t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(50).string(t.docString),t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(58).string(t.domain),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.NodeProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.input&&s.input.length||(s.input=[]),s.input.push(t.string());break}case 2:{s.output&&s.output.length||(s.output=[]),s.output.push(t.string());break}case 3:{s.name=t.string();break}case 4:{s.opType=t.string();break}case 7:{s.domain=t.string();break}case 5:{s.attribute&&s.attribute.length||(s.attribute=[]),s.attribute.push(I.onnx.AttributeProto.decode(t,t.uint32()));break}case 6:{s.docString=t.string();break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.input!=null&&t.hasOwnProperty("input")){if(!Array.isArray(t.input))return"input: array expected";for(var o=0;o<t.input.length;++o)if(!A.isString(t.input[o]))return"input: string[] expected"}if(t.output!=null&&t.hasOwnProperty("output")){if(!Array.isArray(t.output))return"output: array expected";for(var o=0;o<t.output.length;++o)if(!A.isString(t.output[o]))return"output: string[] expected"}if(t.name!=null&&t.hasOwnProperty("name")&&!A.isString(t.name))return"name: string expected";if(t.opType!=null&&t.hasOwnProperty("opType")&&!A.isString(t.opType))return"opType: string expected";if(t.domain!=null&&t.hasOwnProperty("domain")&&!A.isString(t.domain))return"domain: string expected";if(t.attribute!=null&&t.hasOwnProperty("attribute")){if(!Array.isArray(t.attribute))return"attribute: array expected";for(var o=0;o<t.attribute.length;++o){var i=I.onnx.AttributeProto.verify(t.attribute[o]);if(i)return"attribute."+i}}return t.docString!=null&&t.hasOwnProperty("docString")&&!A.isString(t.docString)?"docString: string expected":null},e.fromObject=function(t){if(t instanceof I.onnx.NodeProto)return t;var o=new I.onnx.NodeProto;if(t.input){if(!Array.isArray(t.input))throw TypeError(".onnx.NodeProto.input: array expected");o.input=[];for(var i=0;i<t.input.length;++i)o.input[i]=String(t.input[i])}if(t.output){if(!Array.isArray(t.output))throw TypeError(".onnx.NodeProto.output: array expected");o.output=[];for(var i=0;i<t.output.length;++i)o.output[i]=String(t.output[i])}if(t.name!=null&&(o.name=String(t.name)),t.opType!=null&&(o.opType=String(t.opType)),t.domain!=null&&(o.domain=String(t.domain)),t.attribute){if(!Array.isArray(t.attribute))throw TypeError(".onnx.NodeProto.attribute: array expected");o.attribute=[];for(var i=0;i<t.attribute.length;++i){if(typeof t.attribute[i]!="object")throw TypeError(".onnx.NodeProto.attribute: object expected");o.attribute[i]=I.onnx.AttributeProto.fromObject(t.attribute[i])}}return t.docString!=null&&(o.docString=String(t.docString)),o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.input=[],i.output=[],i.attribute=[]),o.defaults&&(i.name="",i.opType="",i.docString="",i.domain=""),t.input&&t.input.length){i.input=[];for(var s=0;s<t.input.length;++s)i.input[s]=t.input[s]}if(t.output&&t.output.length){i.output=[];for(var s=0;s<t.output.length;++s)i.output[s]=t.output[s]}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.opType!=null&&t.hasOwnProperty("opType")&&(i.opType=t.opType),t.attribute&&t.attribute.length){i.attribute=[];for(var s=0;s<t.attribute.length;++s)i.attribute[s]=I.onnx.AttributeProto.toObject(t.attribute[s],o)}return t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.NodeProto"},e}(),r.TrainingInfoProto=function(){function e(n){if(this.initializationBinding=[],this.updateBinding=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.initialization=null,e.prototype.algorithm=null,e.prototype.initializationBinding=A.emptyArray,e.prototype.updateBinding=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.initialization!=null&&Object.hasOwnProperty.call(t,"initialization")&&I.onnx.GraphProto.encode(t.initialization,o.uint32(10).fork()).ldelim(),t.algorithm!=null&&Object.hasOwnProperty.call(t,"algorithm")&&I.onnx.GraphProto.encode(t.algorithm,o.uint32(18).fork()).ldelim(),t.initializationBinding!=null&&t.initializationBinding.length)for(var i=0;i<t.initializationBinding.length;++i)I.onnx.StringStringEntryProto.encode(t.initializationBinding[i],o.uint32(26).fork()).ldelim();if(t.updateBinding!=null&&t.updateBinding.length)for(var i=0;i<t.updateBinding.length;++i)I.onnx.StringStringEntryProto.encode(t.updateBinding[i],o.uint32(34).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.TrainingInfoProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.initialization=I.onnx.GraphProto.decode(t,t.uint32());break}case 2:{s.algorithm=I.onnx.GraphProto.decode(t,t.uint32());break}case 3:{s.initializationBinding&&s.initializationBinding.length||(s.initializationBinding=[]),s.initializationBinding.push(I.onnx.StringStringEntryProto.decode(t,t.uint32()));break}case 4:{s.updateBinding&&s.updateBinding.length||(s.updateBinding=[]),s.updateBinding.push(I.onnx.StringStringEntryProto.decode(t,t.uint32()));break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.initialization!=null&&t.hasOwnProperty("initialization")){var o=I.onnx.GraphProto.verify(t.initialization);if(o)return"initialization."+o}if(t.algorithm!=null&&t.hasOwnProperty("algorithm")){var o=I.onnx.GraphProto.verify(t.algorithm);if(o)return"algorithm."+o}if(t.initializationBinding!=null&&t.hasOwnProperty("initializationBinding")){if(!Array.isArray(t.initializationBinding))return"initializationBinding: array expected";for(var i=0;i<t.initializationBinding.length;++i){var o=I.onnx.StringStringEntryProto.verify(t.initializationBinding[i]);if(o)return"initializationBinding."+o}}if(t.updateBinding!=null&&t.hasOwnProperty("updateBinding")){if(!Array.isArray(t.updateBinding))return"updateBinding: array expected";for(var i=0;i<t.updateBinding.length;++i){var o=I.onnx.StringStringEntryProto.verify(t.updateBinding[i]);if(o)return"updateBinding."+o}}return null},e.fromObject=function(t){if(t instanceof I.onnx.TrainingInfoProto)return t;var o=new I.onnx.TrainingInfoProto;if(t.initialization!=null){if(typeof t.initialization!="object")throw TypeError(".onnx.TrainingInfoProto.initialization: object expected");o.initialization=I.onnx.GraphProto.fromObject(t.initialization)}if(t.algorithm!=null){if(typeof t.algorithm!="object")throw TypeError(".onnx.TrainingInfoProto.algorithm: object expected");o.algorithm=I.onnx.GraphProto.fromObject(t.algorithm)}if(t.initializationBinding){if(!Array.isArray(t.initializationBinding))throw TypeError(".onnx.TrainingInfoProto.initializationBinding: array expected");o.initializationBinding=[];for(var i=0;i<t.initializationBinding.length;++i){if(typeof t.initializationBinding[i]!="object")throw TypeError(".onnx.TrainingInfoProto.initializationBinding: object expected");o.initializationBinding[i]=I.onnx.StringStringEntryProto.fromObject(t.initializationBinding[i])}}if(t.updateBinding){if(!Array.isArray(t.updateBinding))throw TypeError(".onnx.TrainingInfoProto.updateBinding: array expected");o.updateBinding=[];for(var i=0;i<t.updateBinding.length;++i){if(typeof t.updateBinding[i]!="object")throw TypeError(".onnx.TrainingInfoProto.updateBinding: object expected");o.updateBinding[i]=I.onnx.StringStringEntryProto.fromObject(t.updateBinding[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.initializationBinding=[],i.updateBinding=[]),o.defaults&&(i.initialization=null,i.algorithm=null),t.initialization!=null&&t.hasOwnProperty("initialization")&&(i.initialization=I.onnx.GraphProto.toObject(t.initialization,o)),t.algorithm!=null&&t.hasOwnProperty("algorithm")&&(i.algorithm=I.onnx.GraphProto.toObject(t.algorithm,o)),t.initializationBinding&&t.initializationBinding.length){i.initializationBinding=[];for(var s=0;s<t.initializationBinding.length;++s)i.initializationBinding[s]=I.onnx.StringStringEntryProto.toObject(t.initializationBinding[s],o)}if(t.updateBinding&&t.updateBinding.length){i.updateBinding=[];for(var s=0;s<t.updateBinding.length;++s)i.updateBinding[s]=I.onnx.StringStringEntryProto.toObject(t.updateBinding[s],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TrainingInfoProto"},e}(),r.ModelProto=function(){function e(n){if(this.opsetImport=[],this.metadataProps=[],this.trainingInfo=[],this.functions=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.irVersion=A.Long?A.Long.fromBits(0,0,!1):0,e.prototype.opsetImport=A.emptyArray,e.prototype.producerName="",e.prototype.producerVersion="",e.prototype.domain="",e.prototype.modelVersion=A.Long?A.Long.fromBits(0,0,!1):0,e.prototype.docString="",e.prototype.graph=null,e.prototype.metadataProps=A.emptyArray,e.prototype.trainingInfo=A.emptyArray,e.prototype.functions=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.irVersion!=null&&Object.hasOwnProperty.call(t,"irVersion")&&o.uint32(8).int64(t.irVersion),t.producerName!=null&&Object.hasOwnProperty.call(t,"producerName")&&o.uint32(18).string(t.producerName),t.producerVersion!=null&&Object.hasOwnProperty.call(t,"producerVersion")&&o.uint32(26).string(t.producerVersion),t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(34).string(t.domain),t.modelVersion!=null&&Object.hasOwnProperty.call(t,"modelVersion")&&o.uint32(40).int64(t.modelVersion),t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(50).string(t.docString),t.graph!=null&&Object.hasOwnProperty.call(t,"graph")&&I.onnx.GraphProto.encode(t.graph,o.uint32(58).fork()).ldelim(),t.opsetImport!=null&&t.opsetImport.length)for(var i=0;i<t.opsetImport.length;++i)I.onnx.OperatorSetIdProto.encode(t.opsetImport[i],o.uint32(66).fork()).ldelim();if(t.metadataProps!=null&&t.metadataProps.length)for(var i=0;i<t.metadataProps.length;++i)I.onnx.StringStringEntryProto.encode(t.metadataProps[i],o.uint32(114).fork()).ldelim();if(t.trainingInfo!=null&&t.trainingInfo.length)for(var i=0;i<t.trainingInfo.length;++i)I.onnx.TrainingInfoProto.encode(t.trainingInfo[i],o.uint32(162).fork()).ldelim();if(t.functions!=null&&t.functions.length)for(var i=0;i<t.functions.length;++i)I.onnx.FunctionProto.encode(t.functions[i],o.uint32(202).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.ModelProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.irVersion=t.int64();break}case 8:{s.opsetImport&&s.opsetImport.length||(s.opsetImport=[]),s.opsetImport.push(I.onnx.OperatorSetIdProto.decode(t,t.uint32()));break}case 2:{s.producerName=t.string();break}case 3:{s.producerVersion=t.string();break}case 4:{s.domain=t.string();break}case 5:{s.modelVersion=t.int64();break}case 6:{s.docString=t.string();break}case 7:{s.graph=I.onnx.GraphProto.decode(t,t.uint32());break}case 14:{s.metadataProps&&s.metadataProps.length||(s.metadataProps=[]),s.metadataProps.push(I.onnx.StringStringEntryProto.decode(t,t.uint32()));break}case 20:{s.trainingInfo&&s.trainingInfo.length||(s.trainingInfo=[]),s.trainingInfo.push(I.onnx.TrainingInfoProto.decode(t,t.uint32()));break}case 25:{s.functions&&s.functions.length||(s.functions=[]),s.functions.push(I.onnx.FunctionProto.decode(t,t.uint32()));break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.irVersion!=null&&t.hasOwnProperty("irVersion")&&!A.isInteger(t.irVersion)&&!(t.irVersion&&A.isInteger(t.irVersion.low)&&A.isInteger(t.irVersion.high)))return"irVersion: integer|Long expected";if(t.opsetImport!=null&&t.hasOwnProperty("opsetImport")){if(!Array.isArray(t.opsetImport))return"opsetImport: array expected";for(var o=0;o<t.opsetImport.length;++o){var i=I.onnx.OperatorSetIdProto.verify(t.opsetImport[o]);if(i)return"opsetImport."+i}}if(t.producerName!=null&&t.hasOwnProperty("producerName")&&!A.isString(t.producerName))return"producerName: string expected";if(t.producerVersion!=null&&t.hasOwnProperty("producerVersion")&&!A.isString(t.producerVersion))return"producerVersion: string expected";if(t.domain!=null&&t.hasOwnProperty("domain")&&!A.isString(t.domain))return"domain: string expected";if(t.modelVersion!=null&&t.hasOwnProperty("modelVersion")&&!A.isInteger(t.modelVersion)&&!(t.modelVersion&&A.isInteger(t.modelVersion.low)&&A.isInteger(t.modelVersion.high)))return"modelVersion: integer|Long expected";if(t.docString!=null&&t.hasOwnProperty("docString")&&!A.isString(t.docString))return"docString: string expected";if(t.graph!=null&&t.hasOwnProperty("graph")){var i=I.onnx.GraphProto.verify(t.graph);if(i)return"graph."+i}if(t.metadataProps!=null&&t.hasOwnProperty("metadataProps")){if(!Array.isArray(t.metadataProps))return"metadataProps: array expected";for(var o=0;o<t.metadataProps.length;++o){var i=I.onnx.StringStringEntryProto.verify(t.metadataProps[o]);if(i)return"metadataProps."+i}}if(t.trainingInfo!=null&&t.hasOwnProperty("trainingInfo")){if(!Array.isArray(t.trainingInfo))return"trainingInfo: array expected";for(var o=0;o<t.trainingInfo.length;++o){var i=I.onnx.TrainingInfoProto.verify(t.trainingInfo[o]);if(i)return"trainingInfo."+i}}if(t.functions!=null&&t.hasOwnProperty("functions")){if(!Array.isArray(t.functions))return"functions: array expected";for(var o=0;o<t.functions.length;++o){var i=I.onnx.FunctionProto.verify(t.functions[o]);if(i)return"functions."+i}}return null},e.fromObject=function(t){if(t instanceof I.onnx.ModelProto)return t;var o=new I.onnx.ModelProto;if(t.irVersion!=null&&(A.Long?(o.irVersion=A.Long.fromValue(t.irVersion)).unsigned=!1:typeof t.irVersion=="string"?o.irVersion=parseInt(t.irVersion,10):typeof t.irVersion=="number"?o.irVersion=t.irVersion:typeof t.irVersion=="object"&&(o.irVersion=new A.LongBits(t.irVersion.low>>>0,t.irVersion.high>>>0).toNumber())),t.opsetImport){if(!Array.isArray(t.opsetImport))throw TypeError(".onnx.ModelProto.opsetImport: array expected");o.opsetImport=[];for(var i=0;i<t.opsetImport.length;++i){if(typeof t.opsetImport[i]!="object")throw TypeError(".onnx.ModelProto.opsetImport: object expected");o.opsetImport[i]=I.onnx.OperatorSetIdProto.fromObject(t.opsetImport[i])}}if(t.producerName!=null&&(o.producerName=String(t.producerName)),t.producerVersion!=null&&(o.producerVersion=String(t.producerVersion)),t.domain!=null&&(o.domain=String(t.domain)),t.modelVersion!=null&&(A.Long?(o.modelVersion=A.Long.fromValue(t.modelVersion)).unsigned=!1:typeof t.modelVersion=="string"?o.modelVersion=parseInt(t.modelVersion,10):typeof t.modelVersion=="number"?o.modelVersion=t.modelVersion:typeof t.modelVersion=="object"&&(o.modelVersion=new A.LongBits(t.modelVersion.low>>>0,t.modelVersion.high>>>0).toNumber())),t.docString!=null&&(o.docString=String(t.docString)),t.graph!=null){if(typeof t.graph!="object")throw TypeError(".onnx.ModelProto.graph: object expected");o.graph=I.onnx.GraphProto.fromObject(t.graph)}if(t.metadataProps){if(!Array.isArray(t.metadataProps))throw TypeError(".onnx.ModelProto.metadataProps: array expected");o.metadataProps=[];for(var i=0;i<t.metadataProps.length;++i){if(typeof t.metadataProps[i]!="object")throw TypeError(".onnx.ModelProto.metadataProps: object expected");o.metadataProps[i]=I.onnx.StringStringEntryProto.fromObject(t.metadataProps[i])}}if(t.trainingInfo){if(!Array.isArray(t.trainingInfo))throw TypeError(".onnx.ModelProto.trainingInfo: array expected");o.trainingInfo=[];for(var i=0;i<t.trainingInfo.length;++i){if(typeof t.trainingInfo[i]!="object")throw TypeError(".onnx.ModelProto.trainingInfo: object expected");o.trainingInfo[i]=I.onnx.TrainingInfoProto.fromObject(t.trainingInfo[i])}}if(t.functions){if(!Array.isArray(t.functions))throw TypeError(".onnx.ModelProto.functions: array expected");o.functions=[];for(var i=0;i<t.functions.length;++i){if(typeof t.functions[i]!="object")throw TypeError(".onnx.ModelProto.functions: object expected");o.functions[i]=I.onnx.FunctionProto.fromObject(t.functions[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.opsetImport=[],i.metadataProps=[],i.trainingInfo=[],i.functions=[]),o.defaults){if(A.Long){var s=new A.Long(0,0,!1);i.irVersion=o.longs===String?s.toString():o.longs===Number?s.toNumber():s}else i.irVersion=o.longs===String?"0":0;if(i.producerName="",i.producerVersion="",i.domain="",A.Long){var s=new A.Long(0,0,!1);i.modelVersion=o.longs===String?s.toString():o.longs===Number?s.toNumber():s}else i.modelVersion=o.longs===String?"0":0;i.docString="",i.graph=null}if(t.irVersion!=null&&t.hasOwnProperty("irVersion")&&(typeof t.irVersion=="number"?i.irVersion=o.longs===String?String(t.irVersion):t.irVersion:i.irVersion=o.longs===String?A.Long.prototype.toString.call(t.irVersion):o.longs===Number?new A.LongBits(t.irVersion.low>>>0,t.irVersion.high>>>0).toNumber():t.irVersion),t.producerName!=null&&t.hasOwnProperty("producerName")&&(i.producerName=t.producerName),t.producerVersion!=null&&t.hasOwnProperty("producerVersion")&&(i.producerVersion=t.producerVersion),t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),t.modelVersion!=null&&t.hasOwnProperty("modelVersion")&&(typeof t.modelVersion=="number"?i.modelVersion=o.longs===String?String(t.modelVersion):t.modelVersion:i.modelVersion=o.longs===String?A.Long.prototype.toString.call(t.modelVersion):o.longs===Number?new A.LongBits(t.modelVersion.low>>>0,t.modelVersion.high>>>0).toNumber():t.modelVersion),t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.graph!=null&&t.hasOwnProperty("graph")&&(i.graph=I.onnx.GraphProto.toObject(t.graph,o)),t.opsetImport&&t.opsetImport.length){i.opsetImport=[];for(var a=0;a<t.opsetImport.length;++a)i.opsetImport[a]=I.onnx.OperatorSetIdProto.toObject(t.opsetImport[a],o)}if(t.metadataProps&&t.metadataProps.length){i.metadataProps=[];for(var a=0;a<t.metadataProps.length;++a)i.metadataProps[a]=I.onnx.StringStringEntryProto.toObject(t.metadataProps[a],o)}if(t.trainingInfo&&t.trainingInfo.length){i.trainingInfo=[];for(var a=0;a<t.trainingInfo.length;++a)i.trainingInfo[a]=I.onnx.TrainingInfoProto.toObject(t.trainingInfo[a],o)}if(t.functions&&t.functions.length){i.functions=[];for(var a=0;a<t.functions.length;++a)i.functions[a]=I.onnx.FunctionProto.toObject(t.functions[a],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.ModelProto"},e}(),r.StringStringEntryProto=function(){function e(n){if(n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.key="",e.prototype.value="",e.create=function(t){return new e(t)},e.encode=function(t,o){return o||(o=Xe.create()),t.key!=null&&Object.hasOwnProperty.call(t,"key")&&o.uint32(10).string(t.key),t.value!=null&&Object.hasOwnProperty.call(t,"value")&&o.uint32(18).string(t.value),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.StringStringEntryProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.key=t.string();break}case 2:{s.value=t.string();break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){return typeof t!="object"||t===null?"object expected":t.key!=null&&t.hasOwnProperty("key")&&!A.isString(t.key)?"key: string expected":t.value!=null&&t.hasOwnProperty("value")&&!A.isString(t.value)?"value: string expected":null},e.fromObject=function(t){if(t instanceof I.onnx.StringStringEntryProto)return t;var o=new I.onnx.StringStringEntryProto;return t.key!=null&&(o.key=String(t.key)),t.value!=null&&(o.value=String(t.value)),o},e.toObject=function(t,o){o||(o={});var i={};return o.defaults&&(i.key="",i.value=""),t.key!=null&&t.hasOwnProperty("key")&&(i.key=t.key),t.value!=null&&t.hasOwnProperty("value")&&(i.value=t.value),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.StringStringEntryProto"},e}(),r.TensorAnnotation=function(){function e(n){if(this.quantParameterTensorNames=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.tensorName="",e.prototype.quantParameterTensorNames=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.tensorName!=null&&Object.hasOwnProperty.call(t,"tensorName")&&o.uint32(10).string(t.tensorName),t.quantParameterTensorNames!=null&&t.quantParameterTensorNames.length)for(var i=0;i<t.quantParameterTensorNames.length;++i)I.onnx.StringStringEntryProto.encode(t.quantParameterTensorNames[i],o.uint32(18).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.TensorAnnotation;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.tensorName=t.string();break}case 2:{s.quantParameterTensorNames&&s.quantParameterTensorNames.length||(s.quantParameterTensorNames=[]),s.quantParameterTensorNames.push(I.onnx.StringStringEntryProto.decode(t,t.uint32()));break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.tensorName!=null&&t.hasOwnProperty("tensorName")&&!A.isString(t.tensorName))return"tensorName: string expected";if(t.quantParameterTensorNames!=null&&t.hasOwnProperty("quantParameterTensorNames")){if(!Array.isArray(t.quantParameterTensorNames))return"quantParameterTensorNames: array expected";for(var o=0;o<t.quantParameterTensorNames.length;++o){var i=I.onnx.StringStringEntryProto.verify(t.quantParameterTensorNames[o]);if(i)return"quantParameterTensorNames."+i}}return null},e.fromObject=function(t){if(t instanceof I.onnx.TensorAnnotation)return t;var o=new I.onnx.TensorAnnotation;if(t.tensorName!=null&&(o.tensorName=String(t.tensorName)),t.quantParameterTensorNames){if(!Array.isArray(t.quantParameterTensorNames))throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: array expected");o.quantParameterTensorNames=[];for(var i=0;i<t.quantParameterTensorNames.length;++i){if(typeof t.quantParameterTensorNames[i]!="object")throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: object expected");o.quantParameterTensorNames[i]=I.onnx.StringStringEntryProto.fromObject(t.quantParameterTensorNames[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.quantParameterTensorNames=[]),o.defaults&&(i.tensorName=""),t.tensorName!=null&&t.hasOwnProperty("tensorName")&&(i.tensorName=t.tensorName),t.quantParameterTensorNames&&t.quantParameterTensorNames.length){i.quantParameterTensorNames=[];for(var s=0;s<t.quantParameterTensorNames.length;++s)i.quantParameterTensorNames[s]=I.onnx.StringStringEntryProto.toObject(t.quantParameterTensorNames[s],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TensorAnnotation"},e}(),r.GraphProto=function(){function e(n){if(this.node=[],this.initializer=[],this.sparseInitializer=[],this.input=[],this.output=[],this.valueInfo=[],this.quantizationAnnotation=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.node=A.emptyArray,e.prototype.name="",e.prototype.initializer=A.emptyArray,e.prototype.sparseInitializer=A.emptyArray,e.prototype.docString="",e.prototype.input=A.emptyArray,e.prototype.output=A.emptyArray,e.prototype.valueInfo=A.emptyArray,e.prototype.quantizationAnnotation=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.node!=null&&t.node.length)for(var i=0;i<t.node.length;++i)I.onnx.NodeProto.encode(t.node[i],o.uint32(10).fork()).ldelim();if(t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(18).string(t.name),t.initializer!=null&&t.initializer.length)for(var i=0;i<t.initializer.length;++i)I.onnx.TensorProto.encode(t.initializer[i],o.uint32(42).fork()).ldelim();if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(82).string(t.docString),t.input!=null&&t.input.length)for(var i=0;i<t.input.length;++i)I.onnx.ValueInfoProto.encode(t.input[i],o.uint32(90).fork()).ldelim();if(t.output!=null&&t.output.length)for(var i=0;i<t.output.length;++i)I.onnx.ValueInfoProto.encode(t.output[i],o.uint32(98).fork()).ldelim();if(t.valueInfo!=null&&t.valueInfo.length)for(var i=0;i<t.valueInfo.length;++i)I.onnx.ValueInfoProto.encode(t.valueInfo[i],o.uint32(106).fork()).ldelim();if(t.quantizationAnnotation!=null&&t.quantizationAnnotation.length)for(var i=0;i<t.quantizationAnnotation.length;++i)I.onnx.TensorAnnotation.encode(t.quantizationAnnotation[i],o.uint32(114).fork()).ldelim();if(t.sparseInitializer!=null&&t.sparseInitializer.length)for(var i=0;i<t.sparseInitializer.length;++i)I.onnx.SparseTensorProto.encode(t.sparseInitializer[i],o.uint32(122).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.GraphProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.node&&s.node.length||(s.node=[]),s.node.push(I.onnx.NodeProto.decode(t,t.uint32()));break}case 2:{s.name=t.string();break}case 5:{s.initializer&&s.initializer.length||(s.initializer=[]),s.initializer.push(I.onnx.TensorProto.decode(t,t.uint32()));break}case 15:{s.sparseInitializer&&s.sparseInitializer.length||(s.sparseInitializer=[]),s.sparseInitializer.push(I.onnx.SparseTensorProto.decode(t,t.uint32()));break}case 10:{s.docString=t.string();break}case 11:{s.input&&s.input.length||(s.input=[]),s.input.push(I.onnx.ValueInfoProto.decode(t,t.uint32()));break}case 12:{s.output&&s.output.length||(s.output=[]),s.output.push(I.onnx.ValueInfoProto.decode(t,t.uint32()));break}case 13:{s.valueInfo&&s.valueInfo.length||(s.valueInfo=[]),s.valueInfo.push(I.onnx.ValueInfoProto.decode(t,t.uint32()));break}case 14:{s.quantizationAnnotation&&s.quantizationAnnotation.length||(s.quantizationAnnotation=[]),s.quantizationAnnotation.push(I.onnx.TensorAnnotation.decode(t,t.uint32()));break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.node!=null&&t.hasOwnProperty("node")){if(!Array.isArray(t.node))return"node: array expected";for(var o=0;o<t.node.length;++o){var i=I.onnx.NodeProto.verify(t.node[o]);if(i)return"node."+i}}if(t.name!=null&&t.hasOwnProperty("name")&&!A.isString(t.name))return"name: string expected";if(t.initializer!=null&&t.hasOwnProperty("initializer")){if(!Array.isArray(t.initializer))return"initializer: array expected";for(var o=0;o<t.initializer.length;++o){var i=I.onnx.TensorProto.verify(t.initializer[o]);if(i)return"initializer."+i}}if(t.sparseInitializer!=null&&t.hasOwnProperty("sparseInitializer")){if(!Array.isArray(t.sparseInitializer))return"sparseInitializer: array expected";for(var o=0;o<t.sparseInitializer.length;++o){var i=I.onnx.SparseTensorProto.verify(t.sparseInitializer[o]);if(i)return"sparseInitializer."+i}}if(t.docString!=null&&t.hasOwnProperty("docString")&&!A.isString(t.docString))return"docString: string expected";if(t.input!=null&&t.hasOwnProperty("input")){if(!Array.isArray(t.input))return"input: array expected";for(var o=0;o<t.input.length;++o){var i=I.onnx.ValueInfoProto.verify(t.input[o]);if(i)return"input."+i}}if(t.output!=null&&t.hasOwnProperty("output")){if(!Array.isArray(t.output))return"output: array expected";for(var o=0;o<t.output.length;++o){var i=I.onnx.ValueInfoProto.verify(t.output[o]);if(i)return"output."+i}}if(t.valueInfo!=null&&t.hasOwnProperty("valueInfo")){if(!Array.isArray(t.valueInfo))return"valueInfo: array expected";for(var o=0;o<t.valueInfo.length;++o){var i=I.onnx.ValueInfoProto.verify(t.valueInfo[o]);if(i)return"valueInfo."+i}}if(t.quantizationAnnotation!=null&&t.hasOwnProperty("quantizationAnnotation")){if(!Array.isArray(t.quantizationAnnotation))return"quantizationAnnotation: array expected";for(var o=0;o<t.quantizationAnnotation.length;++o){var i=I.onnx.TensorAnnotation.verify(t.quantizationAnnotation[o]);if(i)return"quantizationAnnotation."+i}}return null},e.fromObject=function(t){if(t instanceof I.onnx.GraphProto)return t;var o=new I.onnx.GraphProto;if(t.node){if(!Array.isArray(t.node))throw TypeError(".onnx.GraphProto.node: array expected");o.node=[];for(var i=0;i<t.node.length;++i){if(typeof t.node[i]!="object")throw TypeError(".onnx.GraphProto.node: object expected");o.node[i]=I.onnx.NodeProto.fromObject(t.node[i])}}if(t.name!=null&&(o.name=String(t.name)),t.initializer){if(!Array.isArray(t.initializer))throw TypeError(".onnx.GraphProto.initializer: array expected");o.initializer=[];for(var i=0;i<t.initializer.length;++i){if(typeof t.initializer[i]!="object")throw TypeError(".onnx.GraphProto.initializer: object expected");o.initializer[i]=I.onnx.TensorProto.fromObject(t.initializer[i])}}if(t.sparseInitializer){if(!Array.isArray(t.sparseInitializer))throw TypeError(".onnx.GraphProto.sparseInitializer: array expected");o.sparseInitializer=[];for(var i=0;i<t.sparseInitializer.length;++i){if(typeof t.sparseInitializer[i]!="object")throw TypeError(".onnx.GraphProto.sparseInitializer: object expected");o.sparseInitializer[i]=I.onnx.SparseTensorProto.fromObject(t.sparseInitializer[i])}}if(t.docString!=null&&(o.docString=String(t.docString)),t.input){if(!Array.isArray(t.input))throw TypeError(".onnx.GraphProto.input: array expected");o.input=[];for(var i=0;i<t.input.length;++i){if(typeof t.input[i]!="object")throw TypeError(".onnx.GraphProto.input: object expected");o.input[i]=I.onnx.ValueInfoProto.fromObject(t.input[i])}}if(t.output){if(!Array.isArray(t.output))throw TypeError(".onnx.GraphProto.output: array expected");o.output=[];for(var i=0;i<t.output.length;++i){if(typeof t.output[i]!="object")throw TypeError(".onnx.GraphProto.output: object expected");o.output[i]=I.onnx.ValueInfoProto.fromObject(t.output[i])}}if(t.valueInfo){if(!Array.isArray(t.valueInfo))throw TypeError(".onnx.GraphProto.valueInfo: array expected");o.valueInfo=[];for(var i=0;i<t.valueInfo.length;++i){if(typeof t.valueInfo[i]!="object")throw TypeError(".onnx.GraphProto.valueInfo: object expected");o.valueInfo[i]=I.onnx.ValueInfoProto.fromObject(t.valueInfo[i])}}if(t.quantizationAnnotation){if(!Array.isArray(t.quantizationAnnotation))throw TypeError(".onnx.GraphProto.quantizationAnnotation: array expected");o.quantizationAnnotation=[];for(var i=0;i<t.quantizationAnnotation.length;++i){if(typeof t.quantizationAnnotation[i]!="object")throw TypeError(".onnx.GraphProto.quantizationAnnotation: object expected");o.quantizationAnnotation[i]=I.onnx.TensorAnnotation.fromObject(t.quantizationAnnotation[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.node=[],i.initializer=[],i.input=[],i.output=[],i.valueInfo=[],i.quantizationAnnotation=[],i.sparseInitializer=[]),o.defaults&&(i.name="",i.docString=""),t.node&&t.node.length){i.node=[];for(var s=0;s<t.node.length;++s)i.node[s]=I.onnx.NodeProto.toObject(t.node[s],o)}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.initializer&&t.initializer.length){i.initializer=[];for(var s=0;s<t.initializer.length;++s)i.initializer[s]=I.onnx.TensorProto.toObject(t.initializer[s],o)}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.input&&t.input.length){i.input=[];for(var s=0;s<t.input.length;++s)i.input[s]=I.onnx.ValueInfoProto.toObject(t.input[s],o)}if(t.output&&t.output.length){i.output=[];for(var s=0;s<t.output.length;++s)i.output[s]=I.onnx.ValueInfoProto.toObject(t.output[s],o)}if(t.valueInfo&&t.valueInfo.length){i.valueInfo=[];for(var s=0;s<t.valueInfo.length;++s)i.valueInfo[s]=I.onnx.ValueInfoProto.toObject(t.valueInfo[s],o)}if(t.quantizationAnnotation&&t.quantizationAnnotation.length){i.quantizationAnnotation=[];for(var s=0;s<t.quantizationAnnotation.length;++s)i.quantizationAnnotation[s]=I.onnx.TensorAnnotation.toObject(t.quantizationAnnotation[s],o)}if(t.sparseInitializer&&t.sparseInitializer.length){i.sparseInitializer=[];for(var s=0;s<t.sparseInitializer.length;++s)i.sparseInitializer[s]=I.onnx.SparseTensorProto.toObject(t.sparseInitializer[s],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.GraphProto"},e}(),r.TensorProto=function(){function e(n){if(this.dims=[],this.floatData=[],this.int32Data=[],this.stringData=[],this.int64Data=[],this.externalData=[],this.doubleData=[],this.uint64Data=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.dims=A.emptyArray,e.prototype.dataType=0,e.prototype.segment=null,e.prototype.floatData=A.emptyArray,e.prototype.int32Data=A.emptyArray,e.prototype.stringData=A.emptyArray,e.prototype.int64Data=A.emptyArray,e.prototype.name="",e.prototype.docString="",e.prototype.rawData=A.newBuffer([]),e.prototype.externalData=A.emptyArray,e.prototype.dataLocation=0,e.prototype.doubleData=A.emptyArray,e.prototype.uint64Data=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.dims!=null&&t.dims.length){o.uint32(10).fork();for(var i=0;i<t.dims.length;++i)o.int64(t.dims[i]);o.ldelim()}if(t.dataType!=null&&Object.hasOwnProperty.call(t,"dataType")&&o.uint32(16).int32(t.dataType),t.segment!=null&&Object.hasOwnProperty.call(t,"segment")&&I.onnx.TensorProto.Segment.encode(t.segment,o.uint32(26).fork()).ldelim(),t.floatData!=null&&t.floatData.length){o.uint32(34).fork();for(var i=0;i<t.floatData.length;++i)o.float(t.floatData[i]);o.ldelim()}if(t.int32Data!=null&&t.int32Data.length){o.uint32(42).fork();for(var i=0;i<t.int32Data.length;++i)o.int32(t.int32Data[i]);o.ldelim()}if(t.stringData!=null&&t.stringData.length)for(var i=0;i<t.stringData.length;++i)o.uint32(50).bytes(t.stringData[i]);if(t.int64Data!=null&&t.int64Data.length){o.uint32(58).fork();for(var i=0;i<t.int64Data.length;++i)o.int64(t.int64Data[i]);o.ldelim()}if(t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(66).string(t.name),t.rawData!=null&&Object.hasOwnProperty.call(t,"rawData")&&o.uint32(74).bytes(t.rawData),t.doubleData!=null&&t.doubleData.length){o.uint32(82).fork();for(var i=0;i<t.doubleData.length;++i)o.double(t.doubleData[i]);o.ldelim()}if(t.uint64Data!=null&&t.uint64Data.length){o.uint32(90).fork();for(var i=0;i<t.uint64Data.length;++i)o.uint64(t.uint64Data[i]);o.ldelim()}if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(98).string(t.docString),t.externalData!=null&&t.externalData.length)for(var i=0;i<t.externalData.length;++i)I.onnx.StringStringEntryProto.encode(t.externalData[i],o.uint32(106).fork()).ldelim();return t.dataLocation!=null&&Object.hasOwnProperty.call(t,"dataLocation")&&o.uint32(112).int32(t.dataLocation),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.TensorProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{if(s.dims&&s.dims.length||(s.dims=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.dims.push(t.int64());else s.dims.push(t.int64());break}case 2:{s.dataType=t.int32();break}case 3:{s.segment=I.onnx.TensorProto.Segment.decode(t,t.uint32());break}case 4:{if(s.floatData&&s.floatData.length||(s.floatData=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.floatData.push(t.float());else s.floatData.push(t.float());break}case 5:{if(s.int32Data&&s.int32Data.length||(s.int32Data=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.int32Data.push(t.int32());else s.int32Data.push(t.int32());break}case 6:{s.stringData&&s.stringData.length||(s.stringData=[]),s.stringData.push(t.bytes());break}case 7:{if(s.int64Data&&s.int64Data.length||(s.int64Data=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.int64Data.push(t.int64());else s.int64Data.push(t.int64());break}case 8:{s.name=t.string();break}case 12:{s.docString=t.string();break}case 9:{s.rawData=t.bytes();break}case 13:{s.externalData&&s.externalData.length||(s.externalData=[]),s.externalData.push(I.onnx.StringStringEntryProto.decode(t,t.uint32()));break}case 14:{s.dataLocation=t.int32();break}case 10:{if(s.doubleData&&s.doubleData.length||(s.doubleData=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.doubleData.push(t.double());else s.doubleData.push(t.double());break}case 11:{if(s.uint64Data&&s.uint64Data.length||(s.uint64Data=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.uint64Data.push(t.uint64());else s.uint64Data.push(t.uint64());break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.dims!=null&&t.hasOwnProperty("dims")){if(!Array.isArray(t.dims))return"dims: array expected";for(var o=0;o<t.dims.length;++o)if(!A.isInteger(t.dims[o])&&!(t.dims[o]&&A.isInteger(t.dims[o].low)&&A.isInteger(t.dims[o].high)))return"dims: integer|Long[] expected"}if(t.dataType!=null&&t.hasOwnProperty("dataType")&&!A.isInteger(t.dataType))return"dataType: integer expected";if(t.segment!=null&&t.hasOwnProperty("segment")){var i=I.onnx.TensorProto.Segment.verify(t.segment);if(i)return"segment."+i}if(t.floatData!=null&&t.hasOwnProperty("floatData")){if(!Array.isArray(t.floatData))return"floatData: array expected";for(var o=0;o<t.floatData.length;++o)if(typeof t.floatData[o]!="number")return"floatData: number[] expected"}if(t.int32Data!=null&&t.hasOwnProperty("int32Data")){if(!Array.isArray(t.int32Data))return"int32Data: array expected";for(var o=0;o<t.int32Data.length;++o)if(!A.isInteger(t.int32Data[o]))return"int32Data: integer[] expected"}if(t.stringData!=null&&t.hasOwnProperty("stringData")){if(!Array.isArray(t.stringData))return"stringData: array expected";for(var o=0;o<t.stringData.length;++o)if(!(t.stringData[o]&&typeof t.stringData[o].length=="number"||A.isString(t.stringData[o])))return"stringData: buffer[] expected"}if(t.int64Data!=null&&t.hasOwnProperty("int64Data")){if(!Array.isArray(t.int64Data))return"int64Data: array expected";for(var o=0;o<t.int64Data.length;++o)if(!A.isInteger(t.int64Data[o])&&!(t.int64Data[o]&&A.isInteger(t.int64Data[o].low)&&A.isInteger(t.int64Data[o].high)))return"int64Data: integer|Long[] expected"}if(t.name!=null&&t.hasOwnProperty("name")&&!A.isString(t.name))return"name: string expected";if(t.docString!=null&&t.hasOwnProperty("docString")&&!A.isString(t.docString))return"docString: string expected";if(t.rawData!=null&&t.hasOwnProperty("rawData")&&!(t.rawData&&typeof t.rawData.length=="number"||A.isString(t.rawData)))return"rawData: buffer expected";if(t.externalData!=null&&t.hasOwnProperty("externalData")){if(!Array.isArray(t.externalData))return"externalData: array expected";for(var o=0;o<t.externalData.length;++o){var i=I.onnx.StringStringEntryProto.verify(t.externalData[o]);if(i)return"externalData."+i}}if(t.dataLocation!=null&&t.hasOwnProperty("dataLocation"))switch(t.dataLocation){default:return"dataLocation: enum value expected";case 0:case 1:break}if(t.doubleData!=null&&t.hasOwnProperty("doubleData")){if(!Array.isArray(t.doubleData))return"doubleData: array expected";for(var o=0;o<t.doubleData.length;++o)if(typeof t.doubleData[o]!="number")return"doubleData: number[] expected"}if(t.uint64Data!=null&&t.hasOwnProperty("uint64Data")){if(!Array.isArray(t.uint64Data))return"uint64Data: array expected";for(var o=0;o<t.uint64Data.length;++o)if(!A.isInteger(t.uint64Data[o])&&!(t.uint64Data[o]&&A.isInteger(t.uint64Data[o].low)&&A.isInteger(t.uint64Data[o].high)))return"uint64Data: integer|Long[] expected"}return null},e.fromObject=function(t){if(t instanceof I.onnx.TensorProto)return t;var o=new I.onnx.TensorProto;if(t.dims){if(!Array.isArray(t.dims))throw TypeError(".onnx.TensorProto.dims: array expected");o.dims=[];for(var i=0;i<t.dims.length;++i)A.Long?(o.dims[i]=A.Long.fromValue(t.dims[i])).unsigned=!1:typeof t.dims[i]=="string"?o.dims[i]=parseInt(t.dims[i],10):typeof t.dims[i]=="number"?o.dims[i]=t.dims[i]:typeof t.dims[i]=="object"&&(o.dims[i]=new A.LongBits(t.dims[i].low>>>0,t.dims[i].high>>>0).toNumber())}if(t.dataType!=null&&(o.dataType=t.dataType|0),t.segment!=null){if(typeof t.segment!="object")throw TypeError(".onnx.TensorProto.segment: object expected");o.segment=I.onnx.TensorProto.Segment.fromObject(t.segment)}if(t.floatData){if(!Array.isArray(t.floatData))throw TypeError(".onnx.TensorProto.floatData: array expected");o.floatData=[];for(var i=0;i<t.floatData.length;++i)o.floatData[i]=Number(t.floatData[i])}if(t.int32Data){if(!Array.isArray(t.int32Data))throw TypeError(".onnx.TensorProto.int32Data: array expected");o.int32Data=[];for(var i=0;i<t.int32Data.length;++i)o.int32Data[i]=t.int32Data[i]|0}if(t.stringData){if(!Array.isArray(t.stringData))throw TypeError(".onnx.TensorProto.stringData: array expected");o.stringData=[];for(var i=0;i<t.stringData.length;++i)typeof t.stringData[i]=="string"?A.base64.decode(t.stringData[i],o.stringData[i]=A.newBuffer(A.base64.length(t.stringData[i])),0):t.stringData[i].length>=0&&(o.stringData[i]=t.stringData[i])}if(t.int64Data){if(!Array.isArray(t.int64Data))throw TypeError(".onnx.TensorProto.int64Data: array expected");o.int64Data=[];for(var i=0;i<t.int64Data.length;++i)A.Long?(o.int64Data[i]=A.Long.fromValue(t.int64Data[i])).unsigned=!1:typeof t.int64Data[i]=="string"?o.int64Data[i]=parseInt(t.int64Data[i],10):typeof t.int64Data[i]=="number"?o.int64Data[i]=t.int64Data[i]:typeof t.int64Data[i]=="object"&&(o.int64Data[i]=new A.LongBits(t.int64Data[i].low>>>0,t.int64Data[i].high>>>0).toNumber())}if(t.name!=null&&(o.name=String(t.name)),t.docString!=null&&(o.docString=String(t.docString)),t.rawData!=null&&(typeof t.rawData=="string"?A.base64.decode(t.rawData,o.rawData=A.newBuffer(A.base64.length(t.rawData)),0):t.rawData.length>=0&&(o.rawData=t.rawData)),t.externalData){if(!Array.isArray(t.externalData))throw TypeError(".onnx.TensorProto.externalData: array expected");o.externalData=[];for(var i=0;i<t.externalData.length;++i){if(typeof t.externalData[i]!="object")throw TypeError(".onnx.TensorProto.externalData: object expected");o.externalData[i]=I.onnx.StringStringEntryProto.fromObject(t.externalData[i])}}switch(t.dataLocation){default:if(typeof t.dataLocation=="number"){o.dataLocation=t.dataLocation;break}break;case"DEFAULT":case 0:o.dataLocation=0;break;case"EXTERNAL":case 1:o.dataLocation=1;break}if(t.doubleData){if(!Array.isArray(t.doubleData))throw TypeError(".onnx.TensorProto.doubleData: array expected");o.doubleData=[];for(var i=0;i<t.doubleData.length;++i)o.doubleData[i]=Number(t.doubleData[i])}if(t.uint64Data){if(!Array.isArray(t.uint64Data))throw TypeError(".onnx.TensorProto.uint64Data: array expected");o.uint64Data=[];for(var i=0;i<t.uint64Data.length;++i)A.Long?(o.uint64Data[i]=A.Long.fromValue(t.uint64Data[i])).unsigned=!0:typeof t.uint64Data[i]=="string"?o.uint64Data[i]=parseInt(t.uint64Data[i],10):typeof t.uint64Data[i]=="number"?o.uint64Data[i]=t.uint64Data[i]:typeof t.uint64Data[i]=="object"&&(o.uint64Data[i]=new A.LongBits(t.uint64Data[i].low>>>0,t.uint64Data[i].high>>>0).toNumber(!0))}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.dims=[],i.floatData=[],i.int32Data=[],i.stringData=[],i.int64Data=[],i.doubleData=[],i.uint64Data=[],i.externalData=[]),o.defaults&&(i.dataType=0,i.segment=null,i.name="",o.bytes===String?i.rawData="":(i.rawData=[],o.bytes!==Array&&(i.rawData=A.newBuffer(i.rawData))),i.docString="",i.dataLocation=o.enums===String?"DEFAULT":0),t.dims&&t.dims.length){i.dims=[];for(var s=0;s<t.dims.length;++s)typeof t.dims[s]=="number"?i.dims[s]=o.longs===String?String(t.dims[s]):t.dims[s]:i.dims[s]=o.longs===String?A.Long.prototype.toString.call(t.dims[s]):o.longs===Number?new A.LongBits(t.dims[s].low>>>0,t.dims[s].high>>>0).toNumber():t.dims[s]}if(t.dataType!=null&&t.hasOwnProperty("dataType")&&(i.dataType=t.dataType),t.segment!=null&&t.hasOwnProperty("segment")&&(i.segment=I.onnx.TensorProto.Segment.toObject(t.segment,o)),t.floatData&&t.floatData.length){i.floatData=[];for(var s=0;s<t.floatData.length;++s)i.floatData[s]=o.json&&!isFinite(t.floatData[s])?String(t.floatData[s]):t.floatData[s]}if(t.int32Data&&t.int32Data.length){i.int32Data=[];for(var s=0;s<t.int32Data.length;++s)i.int32Data[s]=t.int32Data[s]}if(t.stringData&&t.stringData.length){i.stringData=[];for(var s=0;s<t.stringData.length;++s)i.stringData[s]=o.bytes===String?A.base64.encode(t.stringData[s],0,t.stringData[s].length):o.bytes===Array?Array.prototype.slice.call(t.stringData[s]):t.stringData[s]}if(t.int64Data&&t.int64Data.length){i.int64Data=[];for(var s=0;s<t.int64Data.length;++s)typeof t.int64Data[s]=="number"?i.int64Data[s]=o.longs===String?String(t.int64Data[s]):t.int64Data[s]:i.int64Data[s]=o.longs===String?A.Long.prototype.toString.call(t.int64Data[s]):o.longs===Number?new A.LongBits(t.int64Data[s].low>>>0,t.int64Data[s].high>>>0).toNumber():t.int64Data[s]}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.rawData!=null&&t.hasOwnProperty("rawData")&&(i.rawData=o.bytes===String?A.base64.encode(t.rawData,0,t.rawData.length):o.bytes===Array?Array.prototype.slice.call(t.rawData):t.rawData),t.doubleData&&t.doubleData.length){i.doubleData=[];for(var s=0;s<t.doubleData.length;++s)i.doubleData[s]=o.json&&!isFinite(t.doubleData[s])?String(t.doubleData[s]):t.doubleData[s]}if(t.uint64Data&&t.uint64Data.length){i.uint64Data=[];for(var s=0;s<t.uint64Data.length;++s)typeof t.uint64Data[s]=="number"?i.uint64Data[s]=o.longs===String?String(t.uint64Data[s]):t.uint64Data[s]:i.uint64Data[s]=o.longs===String?A.Long.prototype.toString.call(t.uint64Data[s]):o.longs===Number?new A.LongBits(t.uint64Data[s].low>>>0,t.uint64Data[s].high>>>0).toNumber(!0):t.uint64Data[s]}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.externalData&&t.externalData.length){i.externalData=[];for(var s=0;s<t.externalData.length;++s)i.externalData[s]=I.onnx.StringStringEntryProto.toObject(t.externalData[s],o)}return t.dataLocation!=null&&t.hasOwnProperty("dataLocation")&&(i.dataLocation=o.enums===String?I.onnx.TensorProto.DataLocation[t.dataLocation]===void 0?t.dataLocation:I.onnx.TensorProto.DataLocation[t.dataLocation]:t.dataLocation),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TensorProto"},e.DataType=function(){var n={},t=Object.create(n);return t[n[0]="UNDEFINED"]=0,t[n[1]="FLOAT"]=1,t[n[2]="UINT8"]=2,t[n[3]="INT8"]=3,t[n[4]="UINT16"]=4,t[n[5]="INT16"]=5,t[n[6]="INT32"]=6,t[n[7]="INT64"]=7,t[n[8]="STRING"]=8,t[n[9]="BOOL"]=9,t[n[10]="FLOAT16"]=10,t[n[11]="DOUBLE"]=11,t[n[12]="UINT32"]=12,t[n[13]="UINT64"]=13,t[n[14]="COMPLEX64"]=14,t[n[15]="COMPLEX128"]=15,t[n[16]="BFLOAT16"]=16,t[n[17]="FLOAT8E4M3FN"]=17,t[n[18]="FLOAT8E4M3FNUZ"]=18,t[n[19]="FLOAT8E5M2"]=19,t[n[20]="FLOAT8E5M2FNUZ"]=20,t}(),e.Segment=function(){function n(t){if(t)for(var o=Object.keys(t),i=0;i<o.length;++i)t[o[i]]!=null&&(this[o[i]]=t[o[i]])}return n.prototype.begin=A.Long?A.Long.fromBits(0,0,!1):0,n.prototype.end=A.Long?A.Long.fromBits(0,0,!1):0,n.create=function(o){return new n(o)},n.encode=function(o,i){return i||(i=Xe.create()),o.begin!=null&&Object.hasOwnProperty.call(o,"begin")&&i.uint32(8).int64(o.begin),o.end!=null&&Object.hasOwnProperty.call(o,"end")&&i.uint32(16).int64(o.end),i},n.encodeDelimited=function(o,i){return this.encode(o,i).ldelim()},n.decode=function(o,i){o instanceof H||(o=H.create(o));for(var s=i===void 0?o.len:o.pos+i,a=new I.onnx.TensorProto.Segment;o.pos<s;){var u=o.uint32();switch(u>>>3){case 1:{a.begin=o.int64();break}case 2:{a.end=o.int64();break}default:o.skipType(u&7);break}}return a},n.decodeDelimited=function(o){return o instanceof H||(o=new H(o)),this.decode(o,o.uint32())},n.verify=function(o){return typeof o!="object"||o===null?"object expected":o.begin!=null&&o.hasOwnProperty("begin")&&!A.isInteger(o.begin)&&!(o.begin&&A.isInteger(o.begin.low)&&A.isInteger(o.begin.high))?"begin: integer|Long expected":o.end!=null&&o.hasOwnProperty("end")&&!A.isInteger(o.end)&&!(o.end&&A.isInteger(o.end.low)&&A.isInteger(o.end.high))?"end: integer|Long expected":null},n.fromObject=function(o){if(o instanceof I.onnx.TensorProto.Segment)return o;var i=new I.onnx.TensorProto.Segment;return o.begin!=null&&(A.Long?(i.begin=A.Long.fromValue(o.begin)).unsigned=!1:typeof o.begin=="string"?i.begin=parseInt(o.begin,10):typeof o.begin=="number"?i.begin=o.begin:typeof o.begin=="object"&&(i.begin=new A.LongBits(o.begin.low>>>0,o.begin.high>>>0).toNumber())),o.end!=null&&(A.Long?(i.end=A.Long.fromValue(o.end)).unsigned=!1:typeof o.end=="string"?i.end=parseInt(o.end,10):typeof o.end=="number"?i.end=o.end:typeof o.end=="object"&&(i.end=new A.LongBits(o.end.low>>>0,o.end.high>>>0).toNumber())),i},n.toObject=function(o,i){i||(i={});var s={};if(i.defaults){if(A.Long){var a=new A.Long(0,0,!1);s.begin=i.longs===String?a.toString():i.longs===Number?a.toNumber():a}else s.begin=i.longs===String?"0":0;if(A.Long){var a=new A.Long(0,0,!1);s.end=i.longs===String?a.toString():i.longs===Number?a.toNumber():a}else s.end=i.longs===String?"0":0}return o.begin!=null&&o.hasOwnProperty("begin")&&(typeof o.begin=="number"?s.begin=i.longs===String?String(o.begin):o.begin:s.begin=i.longs===String?A.Long.prototype.toString.call(o.begin):i.longs===Number?new A.LongBits(o.begin.low>>>0,o.begin.high>>>0).toNumber():o.begin),o.end!=null&&o.hasOwnProperty("end")&&(typeof o.end=="number"?s.end=i.longs===String?String(o.end):o.end:s.end=i.longs===String?A.Long.prototype.toString.call(o.end):i.longs===Number?new A.LongBits(o.end.low>>>0,o.end.high>>>0).toNumber():o.end),s},n.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},n.getTypeUrl=function(o){return o===void 0&&(o="type.googleapis.com"),o+"/onnx.TensorProto.Segment"},n}(),e.DataLocation=function(){var n={},t=Object.create(n);return t[n[0]="DEFAULT"]=0,t[n[1]="EXTERNAL"]=1,t}(),e}(),r.SparseTensorProto=function(){function e(n){if(this.dims=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.values=null,e.prototype.indices=null,e.prototype.dims=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.values!=null&&Object.hasOwnProperty.call(t,"values")&&I.onnx.TensorProto.encode(t.values,o.uint32(10).fork()).ldelim(),t.indices!=null&&Object.hasOwnProperty.call(t,"indices")&&I.onnx.TensorProto.encode(t.indices,o.uint32(18).fork()).ldelim(),t.dims!=null&&t.dims.length){o.uint32(26).fork();for(var i=0;i<t.dims.length;++i)o.int64(t.dims[i]);o.ldelim()}return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.SparseTensorProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.values=I.onnx.TensorProto.decode(t,t.uint32());break}case 2:{s.indices=I.onnx.TensorProto.decode(t,t.uint32());break}case 3:{if(s.dims&&s.dims.length||(s.dims=[]),(a&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)s.dims.push(t.int64());else s.dims.push(t.int64());break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.values!=null&&t.hasOwnProperty("values")){var o=I.onnx.TensorProto.verify(t.values);if(o)return"values."+o}if(t.indices!=null&&t.hasOwnProperty("indices")){var o=I.onnx.TensorProto.verify(t.indices);if(o)return"indices."+o}if(t.dims!=null&&t.hasOwnProperty("dims")){if(!Array.isArray(t.dims))return"dims: array expected";for(var i=0;i<t.dims.length;++i)if(!A.isInteger(t.dims[i])&&!(t.dims[i]&&A.isInteger(t.dims[i].low)&&A.isInteger(t.dims[i].high)))return"dims: integer|Long[] expected"}return null},e.fromObject=function(t){if(t instanceof I.onnx.SparseTensorProto)return t;var o=new I.onnx.SparseTensorProto;if(t.values!=null){if(typeof t.values!="object")throw TypeError(".onnx.SparseTensorProto.values: object expected");o.values=I.onnx.TensorProto.fromObject(t.values)}if(t.indices!=null){if(typeof t.indices!="object")throw TypeError(".onnx.SparseTensorProto.indices: object expected");o.indices=I.onnx.TensorProto.fromObject(t.indices)}if(t.dims){if(!Array.isArray(t.dims))throw TypeError(".onnx.SparseTensorProto.dims: array expected");o.dims=[];for(var i=0;i<t.dims.length;++i)A.Long?(o.dims[i]=A.Long.fromValue(t.dims[i])).unsigned=!1:typeof t.dims[i]=="string"?o.dims[i]=parseInt(t.dims[i],10):typeof t.dims[i]=="number"?o.dims[i]=t.dims[i]:typeof t.dims[i]=="object"&&(o.dims[i]=new A.LongBits(t.dims[i].low>>>0,t.dims[i].high>>>0).toNumber())}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.dims=[]),o.defaults&&(i.values=null,i.indices=null),t.values!=null&&t.hasOwnProperty("values")&&(i.values=I.onnx.TensorProto.toObject(t.values,o)),t.indices!=null&&t.hasOwnProperty("indices")&&(i.indices=I.onnx.TensorProto.toObject(t.indices,o)),t.dims&&t.dims.length){i.dims=[];for(var s=0;s<t.dims.length;++s)typeof t.dims[s]=="number"?i.dims[s]=o.longs===String?String(t.dims[s]):t.dims[s]:i.dims[s]=o.longs===String?A.Long.prototype.toString.call(t.dims[s]):o.longs===Number?new A.LongBits(t.dims[s].low>>>0,t.dims[s].high>>>0).toNumber():t.dims[s]}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.SparseTensorProto"},e}(),r.TensorShapeProto=function(){function e(n){if(this.dim=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.dim=A.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.dim!=null&&t.dim.length)for(var i=0;i<t.dim.length;++i)I.onnx.TensorShapeProto.Dimension.encode(t.dim[i],o.uint32(10).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.TensorShapeProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.dim&&s.dim.length||(s.dim=[]),s.dim.push(I.onnx.TensorShapeProto.Dimension.decode(t,t.uint32()));break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.dim!=null&&t.hasOwnProperty("dim")){if(!Array.isArray(t.dim))return"dim: array expected";for(var o=0;o<t.dim.length;++o){var i=I.onnx.TensorShapeProto.Dimension.verify(t.dim[o]);if(i)return"dim."+i}}return null},e.fromObject=function(t){if(t instanceof I.onnx.TensorShapeProto)return t;var o=new I.onnx.TensorShapeProto;if(t.dim){if(!Array.isArray(t.dim))throw TypeError(".onnx.TensorShapeProto.dim: array expected");o.dim=[];for(var i=0;i<t.dim.length;++i){if(typeof t.dim[i]!="object")throw TypeError(".onnx.TensorShapeProto.dim: object expected");o.dim[i]=I.onnx.TensorShapeProto.Dimension.fromObject(t.dim[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.dim=[]),t.dim&&t.dim.length){i.dim=[];for(var s=0;s<t.dim.length;++s)i.dim[s]=I.onnx.TensorShapeProto.Dimension.toObject(t.dim[s],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TensorShapeProto"},e.Dimension=function(){function n(o){if(o)for(var i=Object.keys(o),s=0;s<i.length;++s)o[i[s]]!=null&&(this[i[s]]=o[i[s]])}n.prototype.dimValue=null,n.prototype.dimParam=null,n.prototype.denotation="";var t;return Object.defineProperty(n.prototype,"value",{get:A.oneOfGetter(t=["dimValue","dimParam"]),set:A.oneOfSetter(t)}),n.create=function(i){return new n(i)},n.encode=function(i,s){return s||(s=Xe.create()),i.dimValue!=null&&Object.hasOwnProperty.call(i,"dimValue")&&s.uint32(8).int64(i.dimValue),i.dimParam!=null&&Object.hasOwnProperty.call(i,"dimParam")&&s.uint32(18).string(i.dimParam),i.denotation!=null&&Object.hasOwnProperty.call(i,"denotation")&&s.uint32(26).string(i.denotation),s},n.encodeDelimited=function(i,s){return this.encode(i,s).ldelim()},n.decode=function(i,s){i instanceof H||(i=H.create(i));for(var a=s===void 0?i.len:i.pos+s,u=new I.onnx.TensorShapeProto.Dimension;i.pos<a;){var l=i.uint32();switch(l>>>3){case 1:{u.dimValue=i.int64();break}case 2:{u.dimParam=i.string();break}case 3:{u.denotation=i.string();break}default:i.skipType(l&7);break}}return u},n.decodeDelimited=function(i){return i instanceof H||(i=new H(i)),this.decode(i,i.uint32())},n.verify=function(i){if(typeof i!="object"||i===null)return"object expected";var s={};if(i.dimValue!=null&&i.hasOwnProperty("dimValue")&&(s.value=1,!A.isInteger(i.dimValue)&&!(i.dimValue&&A.isInteger(i.dimValue.low)&&A.isInteger(i.dimValue.high))))return"dimValue: integer|Long expected";if(i.dimParam!=null&&i.hasOwnProperty("dimParam")){if(s.value===1)return"value: multiple values";if(s.value=1,!A.isString(i.dimParam))return"dimParam: string expected"}return i.denotation!=null&&i.hasOwnProperty("denotation")&&!A.isString(i.denotation)?"denotation: string expected":null},n.fromObject=function(i){if(i instanceof I.onnx.TensorShapeProto.Dimension)return i;var s=new I.onnx.TensorShapeProto.Dimension;return i.dimValue!=null&&(A.Long?(s.dimValue=A.Long.fromValue(i.dimValue)).unsigned=!1:typeof i.dimValue=="string"?s.dimValue=parseInt(i.dimValue,10):typeof i.dimValue=="number"?s.dimValue=i.dimValue:typeof i.dimValue=="object"&&(s.dimValue=new A.LongBits(i.dimValue.low>>>0,i.dimValue.high>>>0).toNumber())),i.dimParam!=null&&(s.dimParam=String(i.dimParam)),i.denotation!=null&&(s.denotation=String(i.denotation)),s},n.toObject=function(i,s){s||(s={});var a={};return s.defaults&&(a.denotation=""),i.dimValue!=null&&i.hasOwnProperty("dimValue")&&(typeof i.dimValue=="number"?a.dimValue=s.longs===String?String(i.dimValue):i.dimValue:a.dimValue=s.longs===String?A.Long.prototype.toString.call(i.dimValue):s.longs===Number?new A.LongBits(i.dimValue.low>>>0,i.dimValue.high>>>0).toNumber():i.dimValue,s.oneofs&&(a.value="dimValue")),i.dimParam!=null&&i.hasOwnProperty("dimParam")&&(a.dimParam=i.dimParam,s.oneofs&&(a.value="dimParam")),i.denotation!=null&&i.hasOwnProperty("denotation")&&(a.denotation=i.denotation),a},n.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},n.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TensorShapeProto.Dimension"},n}(),e}(),r.TypeProto=function(){function e(t){if(t)for(var o=Object.keys(t),i=0;i<o.length;++i)t[o[i]]!=null&&(this[o[i]]=t[o[i]])}e.prototype.tensorType=null,e.prototype.sequenceType=null,e.prototype.mapType=null,e.prototype.optionalType=null,e.prototype.sparseTensorType=null,e.prototype.denotation="";var n;return Object.defineProperty(e.prototype,"value",{get:A.oneOfGetter(n=["tensorType","sequenceType","mapType","optionalType","sparseTensorType"]),set:A.oneOfSetter(n)}),e.create=function(o){return new e(o)},e.encode=function(o,i){return i||(i=Xe.create()),o.tensorType!=null&&Object.hasOwnProperty.call(o,"tensorType")&&I.onnx.TypeProto.Tensor.encode(o.tensorType,i.uint32(10).fork()).ldelim(),o.sequenceType!=null&&Object.hasOwnProperty.call(o,"sequenceType")&&I.onnx.TypeProto.Sequence.encode(o.sequenceType,i.uint32(34).fork()).ldelim(),o.mapType!=null&&Object.hasOwnProperty.call(o,"mapType")&&I.onnx.TypeProto.Map.encode(o.mapType,i.uint32(42).fork()).ldelim(),o.denotation!=null&&Object.hasOwnProperty.call(o,"denotation")&&i.uint32(50).string(o.denotation),o.sparseTensorType!=null&&Object.hasOwnProperty.call(o,"sparseTensorType")&&I.onnx.TypeProto.SparseTensor.encode(o.sparseTensorType,i.uint32(66).fork()).ldelim(),o.optionalType!=null&&Object.hasOwnProperty.call(o,"optionalType")&&I.onnx.TypeProto.Optional.encode(o.optionalType,i.uint32(74).fork()).ldelim(),i},e.encodeDelimited=function(o,i){return this.encode(o,i).ldelim()},e.decode=function(o,i){o instanceof H||(o=H.create(o));for(var s=i===void 0?o.len:o.pos+i,a=new I.onnx.TypeProto;o.pos<s;){var u=o.uint32();switch(u>>>3){case 1:{a.tensorType=I.onnx.TypeProto.Tensor.decode(o,o.uint32());break}case 4:{a.sequenceType=I.onnx.TypeProto.Sequence.decode(o,o.uint32());break}case 5:{a.mapType=I.onnx.TypeProto.Map.decode(o,o.uint32());break}case 9:{a.optionalType=I.onnx.TypeProto.Optional.decode(o,o.uint32());break}case 8:{a.sparseTensorType=I.onnx.TypeProto.SparseTensor.decode(o,o.uint32());break}case 6:{a.denotation=o.string();break}default:o.skipType(u&7);break}}return a},e.decodeDelimited=function(o){return o instanceof H||(o=new H(o)),this.decode(o,o.uint32())},e.verify=function(o){if(typeof o!="object"||o===null)return"object expected";var i={};if(o.tensorType!=null&&o.hasOwnProperty("tensorType")){i.value=1;{var s=I.onnx.TypeProto.Tensor.verify(o.tensorType);if(s)return"tensorType."+s}}if(o.sequenceType!=null&&o.hasOwnProperty("sequenceType")){if(i.value===1)return"value: multiple values";i.value=1;{var s=I.onnx.TypeProto.Sequence.verify(o.sequenceType);if(s)return"sequenceType."+s}}if(o.mapType!=null&&o.hasOwnProperty("mapType")){if(i.value===1)return"value: multiple values";i.value=1;{var s=I.onnx.TypeProto.Map.verify(o.mapType);if(s)return"mapType."+s}}if(o.optionalType!=null&&o.hasOwnProperty("optionalType")){if(i.value===1)return"value: multiple values";i.value=1;{var s=I.onnx.TypeProto.Optional.verify(o.optionalType);if(s)return"optionalType."+s}}if(o.sparseTensorType!=null&&o.hasOwnProperty("sparseTensorType")){if(i.value===1)return"value: multiple values";i.value=1;{var s=I.onnx.TypeProto.SparseTensor.verify(o.sparseTensorType);if(s)return"sparseTensorType."+s}}return o.denotation!=null&&o.hasOwnProperty("denotation")&&!A.isString(o.denotation)?"denotation: string expected":null},e.fromObject=function(o){if(o instanceof I.onnx.TypeProto)return o;var i=new I.onnx.TypeProto;if(o.tensorType!=null){if(typeof o.tensorType!="object")throw TypeError(".onnx.TypeProto.tensorType: object expected");i.tensorType=I.onnx.TypeProto.Tensor.fromObject(o.tensorType)}if(o.sequenceType!=null){if(typeof o.sequenceType!="object")throw TypeError(".onnx.TypeProto.sequenceType: object expected");i.sequenceType=I.onnx.TypeProto.Sequence.fromObject(o.sequenceType)}if(o.mapType!=null){if(typeof o.mapType!="object")throw TypeError(".onnx.TypeProto.mapType: object expected");i.mapType=I.onnx.TypeProto.Map.fromObject(o.mapType)}if(o.optionalType!=null){if(typeof o.optionalType!="object")throw TypeError(".onnx.TypeProto.optionalType: object expected");i.optionalType=I.onnx.TypeProto.Optional.fromObject(o.optionalType)}if(o.sparseTensorType!=null){if(typeof o.sparseTensorType!="object")throw TypeError(".onnx.TypeProto.sparseTensorType: object expected");i.sparseTensorType=I.onnx.TypeProto.SparseTensor.fromObject(o.sparseTensorType)}return o.denotation!=null&&(i.denotation=String(o.denotation)),i},e.toObject=function(o,i){i||(i={});var s={};return i.defaults&&(s.denotation=""),o.tensorType!=null&&o.hasOwnProperty("tensorType")&&(s.tensorType=I.onnx.TypeProto.Tensor.toObject(o.tensorType,i),i.oneofs&&(s.value="tensorType")),o.sequenceType!=null&&o.hasOwnProperty("sequenceType")&&(s.sequenceType=I.onnx.TypeProto.Sequence.toObject(o.sequenceType,i),i.oneofs&&(s.value="sequenceType")),o.mapType!=null&&o.hasOwnProperty("mapType")&&(s.mapType=I.onnx.TypeProto.Map.toObject(o.mapType,i),i.oneofs&&(s.value="mapType")),o.denotation!=null&&o.hasOwnProperty("denotation")&&(s.denotation=o.denotation),o.sparseTensorType!=null&&o.hasOwnProperty("sparseTensorType")&&(s.sparseTensorType=I.onnx.TypeProto.SparseTensor.toObject(o.sparseTensorType,i),i.oneofs&&(s.value="sparseTensorType")),o.optionalType!=null&&o.hasOwnProperty("optionalType")&&(s.optionalType=I.onnx.TypeProto.Optional.toObject(o.optionalType,i),i.oneofs&&(s.value="optionalType")),s},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(o){return o===void 0&&(o="type.googleapis.com"),o+"/onnx.TypeProto"},e.Tensor=function(){function t(o){if(o)for(var i=Object.keys(o),s=0;s<i.length;++s)o[i[s]]!=null&&(this[i[s]]=o[i[s]])}return t.prototype.elemType=0,t.prototype.shape=null,t.create=function(i){return new t(i)},t.encode=function(i,s){return s||(s=Xe.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&s.uint32(8).int32(i.elemType),i.shape!=null&&Object.hasOwnProperty.call(i,"shape")&&I.onnx.TensorShapeProto.encode(i.shape,s.uint32(18).fork()).ldelim(),s},t.encodeDelimited=function(i,s){return this.encode(i,s).ldelim()},t.decode=function(i,s){i instanceof H||(i=H.create(i));for(var a=s===void 0?i.len:i.pos+s,u=new I.onnx.TypeProto.Tensor;i.pos<a;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=i.int32();break}case 2:{u.shape=I.onnx.TensorShapeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof H||(i=new H(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")&&!A.isInteger(i.elemType))return"elemType: integer expected";if(i.shape!=null&&i.hasOwnProperty("shape")){var s=I.onnx.TensorShapeProto.verify(i.shape);if(s)return"shape."+s}return null},t.fromObject=function(i){if(i instanceof I.onnx.TypeProto.Tensor)return i;var s=new I.onnx.TypeProto.Tensor;if(i.elemType!=null&&(s.elemType=i.elemType|0),i.shape!=null){if(typeof i.shape!="object")throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");s.shape=I.onnx.TensorShapeProto.fromObject(i.shape)}return s},t.toObject=function(i,s){s||(s={});var a={};return s.defaults&&(a.elemType=0,a.shape=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(a.elemType=i.elemType),i.shape!=null&&i.hasOwnProperty("shape")&&(a.shape=I.onnx.TensorShapeProto.toObject(i.shape,s)),a},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Tensor"},t}(),e.Sequence=function(){function t(o){if(o)for(var i=Object.keys(o),s=0;s<i.length;++s)o[i[s]]!=null&&(this[i[s]]=o[i[s]])}return t.prototype.elemType=null,t.create=function(i){return new t(i)},t.encode=function(i,s){return s||(s=Xe.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&I.onnx.TypeProto.encode(i.elemType,s.uint32(10).fork()).ldelim(),s},t.encodeDelimited=function(i,s){return this.encode(i,s).ldelim()},t.decode=function(i,s){i instanceof H||(i=H.create(i));for(var a=s===void 0?i.len:i.pos+s,u=new I.onnx.TypeProto.Sequence;i.pos<a;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=I.onnx.TypeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof H||(i=new H(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")){var s=I.onnx.TypeProto.verify(i.elemType);if(s)return"elemType."+s}return null},t.fromObject=function(i){if(i instanceof I.onnx.TypeProto.Sequence)return i;var s=new I.onnx.TypeProto.Sequence;if(i.elemType!=null){if(typeof i.elemType!="object")throw TypeError(".onnx.TypeProto.Sequence.elemType: object expected");s.elemType=I.onnx.TypeProto.fromObject(i.elemType)}return s},t.toObject=function(i,s){s||(s={});var a={};return s.defaults&&(a.elemType=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(a.elemType=I.onnx.TypeProto.toObject(i.elemType,s)),a},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Sequence"},t}(),e.Map=function(){function t(o){if(o)for(var i=Object.keys(o),s=0;s<i.length;++s)o[i[s]]!=null&&(this[i[s]]=o[i[s]])}return t.prototype.keyType=0,t.prototype.valueType=null,t.create=function(i){return new t(i)},t.encode=function(i,s){return s||(s=Xe.create()),i.keyType!=null&&Object.hasOwnProperty.call(i,"keyType")&&s.uint32(8).int32(i.keyType),i.valueType!=null&&Object.hasOwnProperty.call(i,"valueType")&&I.onnx.TypeProto.encode(i.valueType,s.uint32(18).fork()).ldelim(),s},t.encodeDelimited=function(i,s){return this.encode(i,s).ldelim()},t.decode=function(i,s){i instanceof H||(i=H.create(i));for(var a=s===void 0?i.len:i.pos+s,u=new I.onnx.TypeProto.Map;i.pos<a;){var l=i.uint32();switch(l>>>3){case 1:{u.keyType=i.int32();break}case 2:{u.valueType=I.onnx.TypeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof H||(i=new H(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.keyType!=null&&i.hasOwnProperty("keyType")&&!A.isInteger(i.keyType))return"keyType: integer expected";if(i.valueType!=null&&i.hasOwnProperty("valueType")){var s=I.onnx.TypeProto.verify(i.valueType);if(s)return"valueType."+s}return null},t.fromObject=function(i){if(i instanceof I.onnx.TypeProto.Map)return i;var s=new I.onnx.TypeProto.Map;if(i.keyType!=null&&(s.keyType=i.keyType|0),i.valueType!=null){if(typeof i.valueType!="object")throw TypeError(".onnx.TypeProto.Map.valueType: object expected");s.valueType=I.onnx.TypeProto.fromObject(i.valueType)}return s},t.toObject=function(i,s){s||(s={});var a={};return s.defaults&&(a.keyType=0,a.valueType=null),i.keyType!=null&&i.hasOwnProperty("keyType")&&(a.keyType=i.keyType),i.valueType!=null&&i.hasOwnProperty("valueType")&&(a.valueType=I.onnx.TypeProto.toObject(i.valueType,s)),a},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Map"},t}(),e.Optional=function(){function t(o){if(o)for(var i=Object.keys(o),s=0;s<i.length;++s)o[i[s]]!=null&&(this[i[s]]=o[i[s]])}return t.prototype.elemType=null,t.create=function(i){return new t(i)},t.encode=function(i,s){return s||(s=Xe.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&I.onnx.TypeProto.encode(i.elemType,s.uint32(10).fork()).ldelim(),s},t.encodeDelimited=function(i,s){return this.encode(i,s).ldelim()},t.decode=function(i,s){i instanceof H||(i=H.create(i));for(var a=s===void 0?i.len:i.pos+s,u=new I.onnx.TypeProto.Optional;i.pos<a;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=I.onnx.TypeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof H||(i=new H(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")){var s=I.onnx.TypeProto.verify(i.elemType);if(s)return"elemType."+s}return null},t.fromObject=function(i){if(i instanceof I.onnx.TypeProto.Optional)return i;var s=new I.onnx.TypeProto.Optional;if(i.elemType!=null){if(typeof i.elemType!="object")throw TypeError(".onnx.TypeProto.Optional.elemType: object expected");s.elemType=I.onnx.TypeProto.fromObject(i.elemType)}return s},t.toObject=function(i,s){s||(s={});var a={};return s.defaults&&(a.elemType=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(a.elemType=I.onnx.TypeProto.toObject(i.elemType,s)),a},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Optional"},t}(),e.SparseTensor=function(){function t(o){if(o)for(var i=Object.keys(o),s=0;s<i.length;++s)o[i[s]]!=null&&(this[i[s]]=o[i[s]])}return t.prototype.elemType=0,t.prototype.shape=null,t.create=function(i){return new t(i)},t.encode=function(i,s){return s||(s=Xe.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&s.uint32(8).int32(i.elemType),i.shape!=null&&Object.hasOwnProperty.call(i,"shape")&&I.onnx.TensorShapeProto.encode(i.shape,s.uint32(18).fork()).ldelim(),s},t.encodeDelimited=function(i,s){return this.encode(i,s).ldelim()},t.decode=function(i,s){i instanceof H||(i=H.create(i));for(var a=s===void 0?i.len:i.pos+s,u=new I.onnx.TypeProto.SparseTensor;i.pos<a;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=i.int32();break}case 2:{u.shape=I.onnx.TensorShapeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof H||(i=new H(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")&&!A.isInteger(i.elemType))return"elemType: integer expected";if(i.shape!=null&&i.hasOwnProperty("shape")){var s=I.onnx.TensorShapeProto.verify(i.shape);if(s)return"shape."+s}return null},t.fromObject=function(i){if(i instanceof I.onnx.TypeProto.SparseTensor)return i;var s=new I.onnx.TypeProto.SparseTensor;if(i.elemType!=null&&(s.elemType=i.elemType|0),i.shape!=null){if(typeof i.shape!="object")throw TypeError(".onnx.TypeProto.SparseTensor.shape: object expected");s.shape=I.onnx.TensorShapeProto.fromObject(i.shape)}return s},t.toObject=function(i,s){s||(s={});var a={};return s.defaults&&(a.elemType=0,a.shape=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(a.elemType=i.elemType),i.shape!=null&&i.hasOwnProperty("shape")&&(a.shape=I.onnx.TensorShapeProto.toObject(i.shape,s)),a},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.SparseTensor"},t}(),e}(),r.OperatorSetIdProto=function(){function e(n){if(n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.domain="",e.prototype.version=A.Long?A.Long.fromBits(0,0,!1):0,e.create=function(t){return new e(t)},e.encode=function(t,o){return o||(o=Xe.create()),t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(10).string(t.domain),t.version!=null&&Object.hasOwnProperty.call(t,"version")&&o.uint32(16).int64(t.version),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.OperatorSetIdProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.domain=t.string();break}case 2:{s.version=t.int64();break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){return typeof t!="object"||t===null?"object expected":t.domain!=null&&t.hasOwnProperty("domain")&&!A.isString(t.domain)?"domain: string expected":t.version!=null&&t.hasOwnProperty("version")&&!A.isInteger(t.version)&&!(t.version&&A.isInteger(t.version.low)&&A.isInteger(t.version.high))?"version: integer|Long expected":null},e.fromObject=function(t){if(t instanceof I.onnx.OperatorSetIdProto)return t;var o=new I.onnx.OperatorSetIdProto;return t.domain!=null&&(o.domain=String(t.domain)),t.version!=null&&(A.Long?(o.version=A.Long.fromValue(t.version)).unsigned=!1:typeof t.version=="string"?o.version=parseInt(t.version,10):typeof t.version=="number"?o.version=t.version:typeof t.version=="object"&&(o.version=new A.LongBits(t.version.low>>>0,t.version.high>>>0).toNumber())),o},e.toObject=function(t,o){o||(o={});var i={};if(o.defaults)if(i.domain="",A.Long){var s=new A.Long(0,0,!1);i.version=o.longs===String?s.toString():o.longs===Number?s.toNumber():s}else i.version=o.longs===String?"0":0;return t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),t.version!=null&&t.hasOwnProperty("version")&&(typeof t.version=="number"?i.version=o.longs===String?String(t.version):t.version:i.version=o.longs===String?A.Long.prototype.toString.call(t.version):o.longs===Number?new A.LongBits(t.version.low>>>0,t.version.high>>>0).toNumber():t.version),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.OperatorSetIdProto"},e}(),r.OperatorStatus=function(){var e={},n=Object.create(e);return n[e[0]="EXPERIMENTAL"]=0,n[e[1]="STABLE"]=1,n}(),r.FunctionProto=function(){function e(n){if(this.input=[],this.output=[],this.attribute=[],this.attributeProto=[],this.node=[],this.opsetImport=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.name="",e.prototype.input=A.emptyArray,e.prototype.output=A.emptyArray,e.prototype.attribute=A.emptyArray,e.prototype.attributeProto=A.emptyArray,e.prototype.node=A.emptyArray,e.prototype.docString="",e.prototype.opsetImport=A.emptyArray,e.prototype.domain="",e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=Xe.create()),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(10).string(t.name),t.input!=null&&t.input.length)for(var i=0;i<t.input.length;++i)o.uint32(34).string(t.input[i]);if(t.output!=null&&t.output.length)for(var i=0;i<t.output.length;++i)o.uint32(42).string(t.output[i]);if(t.attribute!=null&&t.attribute.length)for(var i=0;i<t.attribute.length;++i)o.uint32(50).string(t.attribute[i]);if(t.node!=null&&t.node.length)for(var i=0;i<t.node.length;++i)I.onnx.NodeProto.encode(t.node[i],o.uint32(58).fork()).ldelim();if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(66).string(t.docString),t.opsetImport!=null&&t.opsetImport.length)for(var i=0;i<t.opsetImport.length;++i)I.onnx.OperatorSetIdProto.encode(t.opsetImport[i],o.uint32(74).fork()).ldelim();if(t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(82).string(t.domain),t.attributeProto!=null&&t.attributeProto.length)for(var i=0;i<t.attributeProto.length;++i)I.onnx.AttributeProto.encode(t.attributeProto[i],o.uint32(90).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof H||(t=H.create(t));for(var i=o===void 0?t.len:t.pos+o,s=new I.onnx.FunctionProto;t.pos<i;){var a=t.uint32();switch(a>>>3){case 1:{s.name=t.string();break}case 4:{s.input&&s.input.length||(s.input=[]),s.input.push(t.string());break}case 5:{s.output&&s.output.length||(s.output=[]),s.output.push(t.string());break}case 6:{s.attribute&&s.attribute.length||(s.attribute=[]),s.attribute.push(t.string());break}case 11:{s.attributeProto&&s.attributeProto.length||(s.attributeProto=[]),s.attributeProto.push(I.onnx.AttributeProto.decode(t,t.uint32()));break}case 7:{s.node&&s.node.length||(s.node=[]),s.node.push(I.onnx.NodeProto.decode(t,t.uint32()));break}case 8:{s.docString=t.string();break}case 9:{s.opsetImport&&s.opsetImport.length||(s.opsetImport=[]),s.opsetImport.push(I.onnx.OperatorSetIdProto.decode(t,t.uint32()));break}case 10:{s.domain=t.string();break}default:t.skipType(a&7);break}}return s},e.decodeDelimited=function(t){return t instanceof H||(t=new H(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.name!=null&&t.hasOwnProperty("name")&&!A.isString(t.name))return"name: string expected";if(t.input!=null&&t.hasOwnProperty("input")){if(!Array.isArray(t.input))return"input: array expected";for(var o=0;o<t.input.length;++o)if(!A.isString(t.input[o]))return"input: string[] expected"}if(t.output!=null&&t.hasOwnProperty("output")){if(!Array.isArray(t.output))return"output: array expected";for(var o=0;o<t.output.length;++o)if(!A.isString(t.output[o]))return"output: string[] expected"}if(t.attribute!=null&&t.hasOwnProperty("attribute")){if(!Array.isArray(t.attribute))return"attribute: array expected";for(var o=0;o<t.attribute.length;++o)if(!A.isString(t.attribute[o]))return"attribute: string[] expected"}if(t.attributeProto!=null&&t.hasOwnProperty("attributeProto")){if(!Array.isArray(t.attributeProto))return"attributeProto: array expected";for(var o=0;o<t.attributeProto.length;++o){var i=I.onnx.AttributeProto.verify(t.attributeProto[o]);if(i)return"attributeProto."+i}}if(t.node!=null&&t.hasOwnProperty("node")){if(!Array.isArray(t.node))return"node: array expected";for(var o=0;o<t.node.length;++o){var i=I.onnx.NodeProto.verify(t.node[o]);if(i)return"node."+i}}if(t.docString!=null&&t.hasOwnProperty("docString")&&!A.isString(t.docString))return"docString: string expected";if(t.opsetImport!=null&&t.hasOwnProperty("opsetImport")){if(!Array.isArray(t.opsetImport))return"opsetImport: array expected";for(var o=0;o<t.opsetImport.length;++o){var i=I.onnx.OperatorSetIdProto.verify(t.opsetImport[o]);if(i)return"opsetImport."+i}}return t.domain!=null&&t.hasOwnProperty("domain")&&!A.isString(t.domain)?"domain: string expected":null},e.fromObject=function(t){if(t instanceof I.onnx.FunctionProto)return t;var o=new I.onnx.FunctionProto;if(t.name!=null&&(o.name=String(t.name)),t.input){if(!Array.isArray(t.input))throw TypeError(".onnx.FunctionProto.input: array expected");o.input=[];for(var i=0;i<t.input.length;++i)o.input[i]=String(t.input[i])}if(t.output){if(!Array.isArray(t.output))throw TypeError(".onnx.FunctionProto.output: array expected");o.output=[];for(var i=0;i<t.output.length;++i)o.output[i]=String(t.output[i])}if(t.attribute){if(!Array.isArray(t.attribute))throw TypeError(".onnx.FunctionProto.attribute: array expected");o.attribute=[];for(var i=0;i<t.attribute.length;++i)o.attribute[i]=String(t.attribute[i])}if(t.attributeProto){if(!Array.isArray(t.attributeProto))throw TypeError(".onnx.FunctionProto.attributeProto: array expected");o.attributeProto=[];for(var i=0;i<t.attributeProto.length;++i){if(typeof t.attributeProto[i]!="object")throw TypeError(".onnx.FunctionProto.attributeProto: object expected");o.attributeProto[i]=I.onnx.AttributeProto.fromObject(t.attributeProto[i])}}if(t.node){if(!Array.isArray(t.node))throw TypeError(".onnx.FunctionProto.node: array expected");o.node=[];for(var i=0;i<t.node.length;++i){if(typeof t.node[i]!="object")throw TypeError(".onnx.FunctionProto.node: object expected");o.node[i]=I.onnx.NodeProto.fromObject(t.node[i])}}if(t.docString!=null&&(o.docString=String(t.docString)),t.opsetImport){if(!Array.isArray(t.opsetImport))throw TypeError(".onnx.FunctionProto.opsetImport: array expected");o.opsetImport=[];for(var i=0;i<t.opsetImport.length;++i){if(typeof t.opsetImport[i]!="object")throw TypeError(".onnx.FunctionProto.opsetImport: object expected");o.opsetImport[i]=I.onnx.OperatorSetIdProto.fromObject(t.opsetImport[i])}}return t.domain!=null&&(o.domain=String(t.domain)),o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.input=[],i.output=[],i.attribute=[],i.node=[],i.opsetImport=[],i.attributeProto=[]),o.defaults&&(i.name="",i.docString="",i.domain=""),t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.input&&t.input.length){i.input=[];for(var s=0;s<t.input.length;++s)i.input[s]=t.input[s]}if(t.output&&t.output.length){i.output=[];for(var s=0;s<t.output.length;++s)i.output[s]=t.output[s]}if(t.attribute&&t.attribute.length){i.attribute=[];for(var s=0;s<t.attribute.length;++s)i.attribute[s]=t.attribute[s]}if(t.node&&t.node.length){i.node=[];for(var s=0;s<t.node.length;++s)i.node[s]=I.onnx.NodeProto.toObject(t.node[s],o)}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.opsetImport&&t.opsetImport.length){i.opsetImport=[];for(var s=0;s<t.opsetImport.length;++s)i.opsetImport[s]=I.onnx.OperatorSetIdProto.toObject(t.opsetImport[s],o)}if(t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),t.attributeProto&&t.attributeProto.length){i.attributeProto=[];for(var s=0;s<t.attributeProto.length;++s)i.attributeProto[s]=I.onnx.AttributeProto.toObject(t.attributeProto[s],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ve.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.FunctionProto"},e}(),r}();Pf.exports=I});function pn(r,e){if(!r)throw new Error(typeof e=="string"?e:e())}function Rn(r){return new TextDecoder().decode(r)}var Ge,zr,qa,gt,No,lt,wt,J,Ln,Fr,Mr,Vr,De=C(()=>{"use strict";ko();ka();Ge=un(dn());Gr();zr=class{static arraysEqual(e,n){if(e.length!==n.length)return!1;for(let t=0;t<e.length;t++)if(e[t]!==n[t])return!1;return!0}},qa=class{static preprocessInputShapes(e,n){let t=e.length===1?[1,e[0]]:e,o=n.length===1?[n[0],1]:n;return[t,o]}static postprocessOutputShape(e,n,t){n===1&&e.splice(e.length-2,1),t===1&&e.pop()}static calcMatMulShape(e,n){return e[1]!==n[0]?void 0:[e[0],n[1]]}},gt=class r{static calcShape(e,n,t=!1){let o=e.length,i=n.length;if(o===0)return n;if(i===0)return e;let s=Math.max(e.length,n.length),a=new Array(s);if(t){if(o<2||i<2)return;let u=qa.calcMatMulShape([e[o-2],e[o-1]],[n[i-2],n[i-1]]);if(u===void 0)return;[a[s-2],a[s-1]]=u}for(let u=t?3:1;u<=s;u++){let l=o-u<0?1:e[o-u],f=i-u<0?1:n[i-u];if(l!==f&&l>1&&f>1)return;a[s-u]=Math.max(l,f)}return a}static index(e,n){let t=new Array(n.length);return r.fillIndex(e,n,t),t}static fillIndex(e,n,t){let o=e.length-n.length;for(let i=0;i<n.length;i++)t[i]=e[o+i]%n[i]}static calc(e,n,t,o,i){let s=r.calcShape(e.dims,n.dims);if(s){if(o&&!J.areEqual(s,e.dims))return;let a=J.size(s),u=o?e:new Qe(s,i||e.type);if(s.length===0)u.set([],t(e.get([]),n.get([])));else{let l=new Array(s.length),f=new Array(e.dims.length),c=new Array(n.dims.length),p=0,b=0,h=!1,g=!1;e.dims.length===0&&(p=e.get([]),h=!0),n.dims.length===0&&(b=n.get([]),g=!0);let T;for(let w=0;w<a;w++){T=w;for(let v=s.length-1;v>=0;v--)l[v]=T%s[v],T=Math.floor(T/s[v]);h||(r.fillIndex(l,e.dims,f),p=e.get(f)),g||(r.fillIndex(l,n.dims,c),b=n.get(c)),u.set(l,t(p,b))}}return u}}static isValidBroadcast(e,n){let t=e.length,o=n.length;if(t>o)return!1;for(let i=1;i<=t;i++)if(e[t-i]!==1&&e[t-i]!==n[o-i])return!1;return!0}static getBroadcastDims(e,n){let t=e.length,o=[];for(let i=0;i<t;i++){let s=t-1-i,a=e[s]||1;(n[n.length-1-i]||1)>1&&a===1&&o.unshift(s)}return o}},No=class{static getShapeOfGemmResult(e,n,t,o,i){if(e.length!==2||t.length!==2)throw new Error("shape need to be of size 2");let s,a,u;n?(s=e[1],a=e[0]):(s=e[0],a=e[1]);let l=-1;if(o?(u=t[0],l=1):(u=t[1],l=0),t[l]!==a)throw new Error("dimension mismatch");if(s<=0||u<=0||a<=0)throw new Error("invalid shape specified");if(i&&!gt.isValidBroadcast(i,[s,u]))throw new Error("gemm: invalid bias shape for broadcast");return[s,u,a]}},lt=class r{static tensorDataTypeFromProto(e){switch(e){case Ge.onnx.TensorProto.DataType.INT8:return"int8";case Ge.onnx.TensorProto.DataType.UINT8:return"uint8";case Ge.onnx.TensorProto.DataType.BOOL:return"bool";case Ge.onnx.TensorProto.DataType.INT16:return"int16";case Ge.onnx.TensorProto.DataType.UINT16:return"uint16";case Ge.onnx.TensorProto.DataType.INT32:return"int32";case Ge.onnx.TensorProto.DataType.UINT32:return"uint32";case Ge.onnx.TensorProto.DataType.FLOAT:return"float32";case Ge.onnx.TensorProto.DataType.DOUBLE:return"float64";case Ge.onnx.TensorProto.DataType.STRING:return"string";case Ge.onnx.TensorProto.DataType.INT64:return"int32";case Ge.onnx.TensorProto.DataType.UINT64:return"uint32";default:throw new Error(`unsupported data type: ${Ge.onnx.TensorProto.DataType[e]}`)}}static tensorDataTypeStringToEnum(e){switch(e){case"int8":return Ge.onnx.TensorProto.DataType.INT8;case"uint8":return Ge.onnx.TensorProto.DataType.UINT8;case"bool":return Ge.onnx.TensorProto.DataType.BOOL;case"int16":return Ge.onnx.TensorProto.DataType.INT16;case"uint16":return Ge.onnx.TensorProto.DataType.UINT16;case"int32":return Ge.onnx.TensorProto.DataType.INT32;case"uint32":return Ge.onnx.TensorProto.DataType.UINT32;case"float32":return Ge.onnx.TensorProto.DataType.FLOAT;case"float64":return Ge.onnx.TensorProto.DataType.DOUBLE;case"string":return Ge.onnx.TensorProto.DataType.STRING;case"int64":return Ge.onnx.TensorProto.DataType.INT64;case"uint64":return Ge.onnx.TensorProto.DataType.UINT64;default:throw new Error(`unsupported data type: ${e}`)}}static tensorDimsFromProto(e){return e.map(n=>dr.isLong(n)?n.toNumber():n)}static tensorValueTypeFromProto(e){return{tensorType:r.tensorDataTypeFromProto(e.elemType),shape:{dims:r.tensorDimsFromProto(e.shape.dim.map(n=>n.dimValue))}}}static tensorDimsFromORTFormat(e){let n=[];for(let t=0;t<e.dimsLength();t++)n.push(wt.longToNumber(e.dims(t)));return n}static tensorAttributesFromORTFormat(e){let n=[];for(let t=0;t<e.attributesLength();t++)n.push(e.attributes(t));return n}},wt=class{static longToNumber(e,n){return dr.isLong(e)?e.toNumber():e instanceof k.Long?dr.fromValue({low:e.low,high:e.high,unsigned:n??!1}).toNumber():e}static isLong(e){return dr.isLong(e)||e instanceof k.Long}},J=class r{static size(e){return r.getSizeFromDimensionRange(e,0,e.length)}static sizeFromDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,n,e.length)}static sizeToDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,0,n)}static getSizeFromDimensionRange(e,n,t){let o=1;for(let i=n;i<t;i++){if(e[i]<=0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");o*=e[i]}return o}static computeStrides(e){let n=e.length;if(n===0)return[];if(n===1)return[1];let t=new Array(n);t[n-1]=1,t[n-2]=e[n-1];for(let o=n-3;o>=0;--o)t[o]=t[o+1]*e[o+1];return t}static transpose(e){return e.slice().reverse()}static indicesToOffset(e,n,t){t===void 0&&(t=e.length);let o=0;for(let i=0;i<t;++i)o+=n[i]*e[i];return o}static offsetToIndices(e,n){let t=n.length;if(t===0)return[];if(t===1)return[e*n[0]];let o=new Array(n.length);for(let i=0;i<o.length-1;++i)o[i]=Math.floor(e/n[i]),e-=o[i]*n[i];return o[o.length-1]=e,o}static normalizeAxis(e,n){if(e<-n&&e>=n)throw new Error("unsupported axis for this operation.");return e<0?e+n:e}static normalizeAxes(e,n){return e.map(t=>this.normalizeAxis(t,n))}static incrementIndex(e,n,t){if(n.length===0||e.length===0)throw new Error("Index incrementing unsupported for scalar Tensor");if(t===void 0)t=n.length;else if(t<=0||t>n.length)throw new Error("Incorrect axis to increment on");for(let o=t-1;o>=0&&(e[o]++,!(e[o]<n[o]));--o)e[o]=0}static calculateReshapedDims(e,n){if(n.length===0){if(e.length===0||r.size(e)===1)return[];throw new Error("cannot reshape to a scalar Tensor")}let t=n.length,o=new Array(t),i=-1,s=1;for(let u=0;u<t;u++){if(n[u]<-1)throw new Error("a dimension in shape hints cannot be less than -1");if(n[u]===-1){if(i!==-1)throw new Error("at most one dimension in shape hints can be -1");i=u}else{if(n[u]===0){if(u>=e.length)throw new Error("the dimension with value zero exceeds the dimension size of the input tensor");o[u]=e[u]}else o[u]=n[u];s*=o[u]}}let a=r.size(e);if(i!==-1){if(a%s!==0)throw new Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${e}] Output shape: [${n}]`);o[i]=a/s}else if(s!==a)throw new Error("reshapedDims and originalDims don't have matching sizes");return o}static sortBasedOnPerm(e,n){return n?n.map(t=>e[t]):e.slice().reverse()}static padShape(e,n){let t=e.length;return e.map((o,i)=>o+n[i]+n[i+t])}static areEqual(e,n){return e.length!==n.length?!1:e.every((t,o)=>t===n[o])}static validateDimsAndCalcSize(e){if(e.length>6)throw new TypeError("Only rank 0 to 6 is supported for tensor shape.");let n=1;for(let t of e){if(!Number.isInteger(t))throw new TypeError(`Invalid shape: ${t} is not an integer`);if(t<0||t>2147483647)throw new TypeError(`Invalid shape: length ${t} is not allowed`);n*=t}return n}static flattenShape(e,n){n<0&&(n+=e.length);let t=e.reduce((s,a)=>s*a,1),o=e.slice(n).reduce((s,a)=>s*a,1);return[t/o,o]}static squeezeShape(e,n){let t=new Array;n=r.normalizeAxes(n,e.length);for(let o=0;o<e.length;o++){let i=n.indexOf(o)>=0;if(i&&e[o]!==1)throw new Error("squeeze an axis of size different than 1");(n.length===0&&e[o]>1||n.length>0&&!i)&&t.push(e[o])}return t}static unsqueezeShape(e,n){let t=new Array(e.length+n.length);t.fill(0);for(let i=0;i<n.length;i++){let s=r.normalizeAxis(n[i],t.length);if(s>=t.length)throw new Error("'axes' has an out of range axis");if(t[s]!==0)throw new Error("'axes' has a duplicate axis");t[s]=1}let o=0;for(let i=0;i<t.length;i++)t[i]===0&&(t[i]=e[o++]);if(o!==e.length)throw new Error("the unsqueezed dimension could not be established");return t}},Ln=class r{static splitShape(e,n,t,o){if(t.length===0){if(!o)throw new Error("need to know number of outputs when the 'split' attribute is not specified");r.determineSplit(e[n],o,t)}let i=[],s=[0];for(let a=0;a<t.length;++a){a!==0&&s.push(s[a-1]+t[a-1]);let u=e.slice();u[n]=t[a],i.push(u)}return[i,s]}static determineSplit(e,n,t){if(e%n!==0)throw new Error("cannot split tensor to equal sized parts");for(let o=0;o<n;++o)t.push(e/n)}},Fr=class r{static adjustPoolAttributes(e,n,t,o,i,s){if(!e&&t.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let a=0;a<n.length-2;a++)a>=t.length?t.push(n[a+2]):t[a]=n[a+2];for(let a=0;a<t.length;a++)if(a<o.length){if(o[a]<0)throw new Error("strides should be greater than or equal to 1")}else o.push(1);for(let a=0;a<t.length;a++)if(a<i.length){if(i[a]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let a=0;a<t.length*2;a++)if(a<s.length){if(s[a]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let a=0;a<t.length;a++){if(t[a]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[a]>=t[a]||s[a+t.length]>=t[a])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(e,n,t,o,i,s){if(s){if(i.length!==2*(e.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==e.length-2)throw new Error("length of strides should be the length of data dimensions");if(o.length!==e.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let a=0;a<e.length-2;a++)r.adjustPadAndReturnShape(e[a+2],n[a],t[a],o[a],i,a,a+e.length-2,s)}}static computePoolOutputShape(e,n,t,o,i,s,a){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let u=[n[0],n[1]];return r.computeShapeHelper(e,n,u,t,o,i,s,a),u}static computeConvOutputShape(e,n,t,o,i,s,a){if(e.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[e[0],n[0]];return r.computeShapeHelper(!1,e,u,t,o,i,s,a),u}static computeShapeHelper(e,n,t,o,i,s,a,u){if(e)for(let l=0;l<n.length-2;l++)t.push(1);else for(let l=0;l<n.length-2;l++)t.push(r.adjustPadAndReturnShape(n[l+2],o[l],i[l],s[l],a,l,l+n.length-2,u))}static adjustPadAndReturnShape(e,n,t,o,i,s,a,u){let l=t*(o-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return i[s]=0,i[a]=0,Math.floor((e-l)/n+1);case"SAME_LOWER":case"SAME_UPPER":if(t!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((e+n-1)/n-1)*n+o-e;return i[s]=Math.floor(u==="SAME_LOWER"?(c+1)/2:c/2),i[a]=c-i[s],Math.floor((e+c-o)/n+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((e+i[s]+i[a]-l)/n+1)}},Mr=-34028234663852886e22,Vr=34028234663852886e22});function wv(r){switch(r){case"bool":case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;case"float64":return 8;default:throw new Error(`cannot calculate sizeof() on type ${r}`)}}function Of(r){switch(r){case ve.onnx.TensorProto.DataType.UINT8:case ve.onnx.TensorProto.DataType.INT8:case ve.onnx.TensorProto.DataType.BOOL:return 1;case ve.onnx.TensorProto.DataType.UINT16:case ve.onnx.TensorProto.DataType.INT16:return 2;case ve.onnx.TensorProto.DataType.FLOAT:case ve.onnx.TensorProto.DataType.INT32:case ve.onnx.TensorProto.DataType.UINT32:return 4;case ve.onnx.TensorProto.DataType.INT64:case ve.onnx.TensorProto.DataType.DOUBLE:case ve.onnx.TensorProto.DataType.UINT64:return 8;default:throw new Error(`cannot calculate sizeof() on type ${ve.onnx.TensorProto.DataType[r]}`)}}function Tv(r,e){return new(kf(e))(r)}function kf(r){switch(r){case"bool":case"uint8":return Uint8Array;case"int8":return Int8Array;case"int16":return Int16Array;case"uint16":return Uint16Array;case"int32":return Int32Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"float32":return Float32Array;case"float64":return Float64Array;default:throw new Error("unspecified error")}}function ja(r,e){if(e===ve.onnx.TensorProto.DataType.INT64||e===Ka.TensorDataType.INT64){if(r.greaterThanOrEqual(2147483648)||r.lessThan(-2147483648))throw new TypeError("int64 is not supported")}else if(e===ve.onnx.TensorProto.DataType.UINT32||e===Ka.TensorDataType.UINT32||e===ve.onnx.TensorProto.DataType.UINT64||e===Ka.TensorDataType.UINT64){if(r.greaterThanOrEqual(4294967296)||r.lessThan(0))throw new TypeError("uint64 is not supported")}else throw new TypeError(`not a LONG type: ${ve.onnx.TensorProto.DataType[e]}`);return r.toNumber()}function Ef(r,e,n){switch(e){case ve.onnx.TensorProto.DataType.BOOL:case ve.onnx.TensorProto.DataType.UINT8:return r.getUint8(n);case ve.onnx.TensorProto.DataType.INT8:return r.getInt8(n);case ve.onnx.TensorProto.DataType.UINT16:return r.getUint16(n,!0);case ve.onnx.TensorProto.DataType.INT16:return r.getInt16(n,!0);case ve.onnx.TensorProto.DataType.FLOAT:return r.getFloat32(n,!0);case ve.onnx.TensorProto.DataType.INT32:return r.getInt32(n,!0);case ve.onnx.TensorProto.DataType.UINT32:return r.getUint32(n,!0);case ve.onnx.TensorProto.DataType.INT64:return ja(dr.fromBits(r.getUint32(n,!0),r.getUint32(n+4,!0),!1),e);case ve.onnx.TensorProto.DataType.DOUBLE:return r.getFloat64(n,!0);case ve.onnx.TensorProto.DataType.UINT64:return ja(dr.fromBits(r.getUint32(n,!0),r.getUint32(n+4,!0),!0),e);default:throw new Error(`cannot read from DataView for type ${ve.onnx.TensorProto.DataType[e]}`)}}var Cf,ve,Ka,Qe,Gr=C(()=>{"use strict";Cf=un(xc());ka();Cn();ve=un(dn());De();Ka=ee.experimental.fbs,Qe=class r{constructor(e,n,t,o,i,s=Cf.Guid.create()){this.dims=e;this.type=n;this.dataProvider=t;this.asyncDataProvider=o;this.cache=i;this.dataId=s;this.size=J.validateDimsAndCalcSize(e);let a=this.size,u=t===void 0&&o===void 0&&i===void 0;if(i!==void 0&&i.length!==a)throw new RangeError("Input dims doesn't match data length.");if(n==="string"){if(i!==void 0&&(!Array.isArray(i)||!i.every(l=>typeof l=="string")))throw new TypeError("cache should be a string array");u&&(this.cache=new Array(a))}else{if(i!==void 0){let l=kf(n);if(!(i instanceof l))throw new TypeError(`cache should be type ${l.name}`)}if(u){let l=new ArrayBuffer(a*wv(n));this.cache=Tv(l,n)}}}get data(){if(this.cache===void 0){let e=this.dataProvider(this.dataId);if(e.length!==this.size)throw new Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");this.cache=e}return this.cache}get stringData(){if(this.type!=="string")throw new TypeError("data type is not string");return this.data}get integerData(){switch(this.type){case"uint8":case"int8":case"uint16":case"int16":case"int32":case"uint32":case"bool":return this.data;default:throw new TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)")}}get floatData(){switch(this.type){case"float32":case"float64":return this.data;default:throw new TypeError("data type is not float (float32, float64)")}}get numberData(){if(this.type!=="string")return this.data;throw new TypeError("type cannot be non-number (string)")}get(e){return this.data[J.indicesToOffset(e,this.strides)]}set(e,n){this.data[J.indicesToOffset(e,this.strides)]=n}async getData(){return this.cache===void 0&&(this.cache=await this.asyncDataProvider(this.dataId)),this.cache}get strides(){return this._strides||(this._strides=J.computeStrides(this.dims)),this._strides}static fromProto(e){if(!e)throw new Error("cannot construct Value from an empty tensor");let n=lt.tensorDataTypeFromProto(e.dataType),t=lt.tensorDimsFromProto(e.dims),o=new r(t,n);if(n==="string")e.stringData.forEach((i,s)=>{o.data[s]=Rn(i)});else if(e.rawData&&typeof e.rawData.byteLength=="number"&&e.rawData.byteLength>0){let i=o.data,s=new DataView(e.rawData.buffer,e.rawData.byteOffset,e.rawData.byteLength),a=Of(e.dataType),u=e.rawData.byteLength/a;if(e.rawData.byteLength%a!==0)throw new Error("invalid buffer length");if(i.length!==u)throw new Error("buffer length mismatch");for(let l=0;l<u;l++){let f=Ef(s,e.dataType,l*a);i[l]=f}}else{let i;switch(e.dataType){case ve.onnx.TensorProto.DataType.FLOAT:i=e.floatData;break;case ve.onnx.TensorProto.DataType.INT32:case ve.onnx.TensorProto.DataType.INT16:case ve.onnx.TensorProto.DataType.UINT16:case ve.onnx.TensorProto.DataType.INT8:case ve.onnx.TensorProto.DataType.UINT8:case ve.onnx.TensorProto.DataType.BOOL:i=e.int32Data;break;case ve.onnx.TensorProto.DataType.INT64:i=e.int64Data;break;case ve.onnx.TensorProto.DataType.DOUBLE:i=e.doubleData;break;case ve.onnx.TensorProto.DataType.UINT32:case ve.onnx.TensorProto.DataType.UINT64:i=e.uint64Data;break;default:throw new Error("unspecific error")}if(i==null)throw new Error("failed to populate data from a tensorproto value");let s=o.data;if(s.length!==i.length)throw new Error("array length mismatch");for(let a=0;a<i.length;a++){let u=i[a];dr.isLong(u)?s[a]=ja(u,e.dataType):s[a]=u}}return o}static fromData(e,n,t){return new r(n,t,void 0,void 0,e)}static fromOrtTensor(e){if(!e)throw new Error("cannot construct Value from an empty tensor");let n=lt.tensorDimsFromORTFormat(e),t=lt.tensorDataTypeFromProto(e.dataType()),o=new r(n,t);if(t==="string")for(let i=0;i<e.stringDataLength();i++)o.data[i]=e.stringData(i);else if(e.rawDataArray()&&typeof e.rawDataLength()=="number"&&e.rawDataLength()>0){let i=o.data,s=new DataView(e.rawDataArray().buffer,e.rawDataArray().byteOffset,e.rawDataLength()),a=Of(e.dataType()),u=e.rawDataLength()/a;if(e.rawDataLength()%a!==0)throw new Error("invalid buffer length");if(i.length!==u)throw new Error("buffer length mismatch");for(let l=0;l<u;l++){let f=Ef(s,e.dataType(),l*a);i[l]=f}}return o}}});function oe(r){return r===1?_v:Iv}function Df(r){let e=oe(r);return`${e.version}
      precision highp float;
      ${e.attribute} vec3 position;
      ${e.attribute} vec2 textureCoord;

      ${e.varyingVertex} vec2 TexCoords;

      void main()
      {
          gl_Position = vec4(position, 1.0);
          TexCoords = textureCoord;
      }`}function Bf(r){let e=oe(r);return`${e.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${e.varyingFrag} vec2 TexCoords;
    ${e.outputDeclaration}
    const vec2 halfCR = vec2(0.5, 0.5);

    // Custom vector types to handle higher dimenalities.
    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    `}function Lf(r,e){let n=oe(r);return`
  void main() {
    int indices[${e}];
    toVec(TexCoords, indices);
    vec4 result = vec4(process(indices));
    ${n.output} = result;
  }
  `}var _v,Iv,He=C(()=>{"use strict";_v={version:"",attribute:"attribute",varyingVertex:"varying",varyingFrag:"varying",texture2D:"texture2D",output:"gl_FragColor",outputDeclaration:""},Iv={version:"#version 300 es",attribute:"in",varyingVertex:"out",varyingFrag:"in",texture2D:"texture",output:"outputColor",outputDeclaration:"out vec4 outputColor;"}});var Se=C(()=>{"use strict"});async function Xa(r,e=t=>0,n){return new Promise((t,o)=>{let i=0,s=()=>{if(r()){t();return}i++;let a=e(i);if(n!=null&&i>=n){o();return}setTimeout(s,a)};s()})}function zo(r){return pn(typeof r<"u"&&r.length!==0,()=>"empty string found for sampler name"),"get"+r.charAt(0).toUpperCase()+r.slice(1)}function Rf(r){return pn(typeof r<"u"&&r.length!==0,()=>"empty string found for sampler name"),"get"+r.charAt(0).toUpperCase()+r.slice(1)+"AtOutCoords"}function mn(r,e){let n=JSON.parse(JSON.stringify(r));return n=e,n}function hn(r,e){return e.map(n=>r[n]).join(", ")}function bt(r){if(r<=1)return"int";if(r===2)return"ivec2";if(r===3)return"ivec3";if(r===4)return"ivec4";if(r===5)return"ivec5";if(r===6)return"ivec6";throw Error(`GPU for rank ${r} is not yet supported`)}function Gt(r=6){return["x","y","z","w","u","v"].slice(0,r)}var Qt=C(()=>{"use strict";De()});function Sv(r,e){return Gt(e).map(n=>`${r}.${n}`)}function gn(r,e){return e===1?[r]:Sv(r,e)}function er(){return`
    float getChannel(vec4 frag, int dim) {
      int modCoord = imod(dim, 2);
      return modCoord == 0 ? frag.r : frag.g;
    }

    float getChannel(vec4 frag, vec2 innerDims) {
      vec2 modCoord = mod(innerDims, 2.);
      return modCoord.x == 0. ?
        (modCoord.y == 0. ? frag.r : frag.g) :
        (modCoord.y == 0. ? frag.b : frag.a);
    }
  `}var Ur=C(()=>{"use strict";Qt()});function Av(r,e,n){if(r===0)return"false";if(r===1)return`rc > ${e[0]}`;let t="";for(let o=r-2;o<r;o++)t+=`${n[o]} >= ${e[o-r+2]}`,o<r-1&&(t+="||");return t}function Pv(r,e){let n=r.length;if(n===0)return"getA(), 0, 0, 0";if(n===1)return`getA(rc),
            rc + 1 >= ${r[0]} ? 0. : getA(rc + 1),
            0, 0`;let t="r, c",o="r, cp1",i="rp1, c",s="rp1, cp1",a="";if(n>2)for(let u=0;u<n-2;++u)a=a+`${e[u]},`;return`getA(${a}${t}),
          rEdge ? 0. : getA(${a}${i}),
          cEdge ? 0. : getA(${a}${o}),
          rEdge || cEdge ? 0. : getA(${a}${s})`}function Ov(r,e,n,t){return r===0||r===1?"":`
    int r = ${e[r-2]};
    int c = ${e[r-1]};
    int rp1 = ${e[r-2]} + 1;
    int cp1 = ${e[r-1]} + 1;
    bool rEdge = rp1 >= ${t};
    bool cEdge = cp1 >= ${n};
    `}var Nf,$v,zf,Ff=C(()=>{"use strict";He();Se();Qt();Ur();Nf={name:"pack",inputNames:["A"],inputTypes:[1]},$v=(r,e)=>{let n=oe(r.session.backend.glContext.version),t=e.dims,o=t.length,i=e.dims.length,s=bt(i),a=gn("rc",i),u=Ov(i,a,t[t.length-2],t[t.length-1]),l;o===0?l=[1,1]:o===1?l=[t[0],1]:l=[t[i-1],t[i-2]];let f=Av(i,l,a),c=Pv(t,a),p=`
        void main() {
          ${s} rc = getOutputCoords();

          if(${f}) {
            ${n.output} = vec4(0);
          } else {
            ${u}

            ${n.output} = vec4(${c});
          }
        }
      `;return{...Nf,hasMain:!0,output:{dims:e.dims,type:e.type,textureType:2},shaderSource:p}},zf=(r,e)=>({...Nf,get:()=>$v(r,e)})});function Za(r){if(r.length===0)return[1,1,1];let e=1;for(let n=0;n<r.length-2;++n)e*=r[n];return[e,r.length>1?r[r.length-2]:1,r[r.length-1]]}function Vf(r,e){let n=!1;return r.length===0||e.length===0?n=!0:r.length<2||e.length<2?n=r[r.length-1]===e[e.length-1]:n=r[r.length-1]===e[e.length-1]&&r[r.length-2]===e[e.length-2],n}function kv(r){let e=J.computeStrides(r),n=["b","r","c"],t="index";return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${e.map((i,s)=>{let a=`int ${n[s]} = ${t} / ${i}`,u=s===e.length-1?`int ${n[s+1]} = ${t} - ${n[s]} * ${i}`:`index -= ${n[s]} * ${i}`;return`${a}; ${u};`}).join("")}
      return ivec3(b, r, c);
    }
  `}function Dv(r){let e=J.computeStrides(r);return`
  int getFlattenedIndex(ivec3 coords) {
    // reverse y, z order
    return coords.x * ${e[0]} + coords.z * ${e[1]} + coords.y;
  }
`}var Ev,Cv,Mf,Gf=C(()=>{"use strict";De();He();Se();Ur();Ev=r=>({name:"Reshape (packed)",inputTypes:[2],inputNames:["A"],cacheHint:`${r}`}),Cv=(r,e,n,t)=>{let o=e.dims,i=t,s="";for(let l=0;l<4;l++){let f="";switch(l){case 0:f="outputCoords = rc;";break;case 1:f="outputCoords = ivec3(rc.x, rc.y+1, rc.z);";break;case 2:f="outputCoords = ivec3(rc.x, rc.y, rc.z+1);";break;case 3:f="outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";break;default:throw new Error}s+=`
        ${f}
        ${l>0?"if(outputCoords.y < rows && outputCoords.z < cols){":""}
          int flattenedIndex = getFlattenedIndex(outputCoords);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);
          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${l}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);

        ${l>0?"}":""}
      `}let a=oe(r.session.backend.glContext.version),u=`
      ${kv(o)}
      ${Dv(i)}
      ${er()}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.0);

        ivec3 outputCoords;
        int rows = ${i[2]};
        int cols = ${i[1]};

        ${s}
        ${a.output} = result;
      }
    `;return{...n,output:{dims:i,type:e.type,textureType:2},shaderSource:u,hasMain:!0}},Mf=(r,e,n)=>{let t=Ev(n);return{...t,get:()=>Cv(r,e,t,n)}}});var Ya,Uf=C(()=>{"use strict";He();Se();Ya=(r,e)=>{let n=e.shape,t=oe(r.session.backend.glContext.version),o=`
    const float FLOAT_MAX = 1.70141184e38;
    const float FLOAT_MIN = 1.17549435e-38;

    bool isNaN(float val) {
      return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;
    }

    highp vec4 encodeAsUint8(highp float v) {
      if (isNaN(v)) {
        return vec4(255, 255, 255, 255);
      }

      highp float av = abs(v);

      if(av < FLOAT_MIN) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      } else if(v > FLOAT_MAX) {
        return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
      } else if(v < -FLOAT_MAX) {
        return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
      }

      highp vec4 c = vec4(0,0,0,0);

      highp float e = floor(log2(av));
      highp float m = exp2(fract(log2(av))) - 1.0;

      c[2] = floor(128.0 * m);
      m -= c[2] / 128.0;
      c[1] = floor(32768.0 * m);
      m -= c[1] / 32768.0;
      c[0] = floor(8388608.0 * m);

      highp float ebias = e + 127.0;
      c[3] = floor(ebias / 2.0);
      ebias -= c[3] * 2.0;
      c[2] += floor(ebias) * 128.0;

      c[3] += 128.0 * step(0.0, -v);

      return c / 255.0;
    }

    void main() {
      float value = ${t.texture2D}(X,TexCoords).r;
      ${t.output} = encodeAsUint8(value);
    }`,i={name:"Uint8Encode",inputTypes:[0],inputNames:["X"],output:{dims:n,type:e.tensor.type,textureType:3},shaderSource:o,hasMain:!0};return r.executeProgram(i,[e.tensor])}});function Lv(r,e){if(r===1)return"rc";let n="";for(let t=0;t<r;t++)n+=e[t],t<r-1&&(n+=",");return n}var Wf,Bv,Hf,qf=C(()=>{"use strict";He();Se();Qt();Ur();Wf={name:"unpack",inputNames:["A"],inputTypes:[2]},Bv=(r,e)=>{let n=e.dims.length,t=gn("rc",n),o=t.slice(-2),i=bt(n),s=er(),u=e.dims.length===0?"":Lv(n,t),l=n<=1?"rc":`vec2(${o.join(",")})`,f=oe(r.session.backend.glContext.version),c=`
    ${s}
    void main() {
      ${i} rc = getOutputCoords();

       // Sample the texture with the coords to get the rgba channel value.
       vec4 packedInput = getA(${u});

       ${f.output} = vec4(getChannel(packedInput, ${l}), 0, 0, 0);
     }
   `;return{...Wf,hasMain:!0,output:{dims:e.dims,type:e.type,textureType:0},shaderSource:c}},Hf=(r,e)=>({...Wf,get:()=>Bv(r,e)})});var Fo,Nn,Mo,zn=C(()=>{"use strict";Pt();Fo=class{constructor(e,n=1){if(n===1)this.internalFormat=e.R32F,this.format=e.RED,this.textureType=e.FLOAT,this.channelSize=n;else if(n===4)this.internalFormat=e.RGBA32F,this.format=e.RGBA,this.textureType=e.FLOAT,this.channelSize=n;else throw new Error(`Invalid number of channels: ${n}`)}encode(e,n){let t,o;return e.constructor!==Float32Array&&(Re.warning("Encoder","data was not of type Float32; creating new Float32Array"),o=new Float32Array(e)),n*this.channelSize>e.length?(Re.warning("Encoder","Source data too small. Allocating larger array"),o=e,t=this.allocate(n*this.channelSize),o.forEach((i,s)=>t[s]=i)):(o=e,t=o),t}allocate(e){return new Float32Array(e*4)}decode(e,n){return this.channelSize===1?e.filter((o,i)=>i%4===0).subarray(0,n):e.subarray(0,n)}},Nn=class{constructor(e,n=1,t){if(n!==1&&n!==4)throw new Error(`Invalid number of channels: ${n}`);this.internalFormat=e.RGBA,this.format=e.RGBA,this.channelSize=n,this.textureType=t||e.FLOAT}encode(e,n){let t=e;return this.channelSize===1&&(Re.verbose("Encoder","Exploding into a larger array"),t=this.allocate(n),e.forEach((o,i)=>t[i*4]=o)),t}allocate(e){return new Float32Array(e*4)}decode(e,n){return this.channelSize===1?e.filter((o,i)=>i%4===0).subarray(0,n):e.subarray(0,n)}},Mo=class{constructor(e,n=1){this.channelSize=4;if(n===1)this.internalFormat=e.ALPHA,this.format=e.ALPHA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=n;else if(n===4)this.internalFormat=e.RGBA,this.format=e.RGBA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=n;else throw new Error(`Invalid number of channels: ${n}`)}encode(e,n){return new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}allocate(e){return new Uint8Array(e*this.channelSize)}decode(e,n){if(e instanceof Uint8Array)return e.subarray(0,n);throw new Error(`Invalid array type: ${e.constructor}`)}}});var Fn,Kf,Ja,jf=C(()=>{"use strict";De();Se();Fn=(r,e,n)=>{let t=n===0||n===1?1:4,o=n===2,i=n===1||n===2,s=n===4?e.length-1:void 0,a=n===4?e.map((u,l)=>l===e.length-1?u*4:u):void 0;return Ja(r,e,t,a,{isPacked:o,reverseWH:i,breakAxis:s})},Kf=(r,e,n)=>{let t=Fn(r,e,n);return[t.width,t.height]},Ja=(r,e,n=1,t,o)=>{let i=!!(o&&o.isPacked),[s,a]=r.computeTextureWH(i&&t||e,o),u=e.length,l=e.slice(0);if(u===0&&(l=[1]),n===1)t=e;else if(i){if(n!==4)throw new Error("a packed texture must be 4-channel");t=e,u>0&&(l[u-1]=Math.ceil(l[u-1]/2)),u>1&&(l[u-2]=Math.ceil(l[u-2]/2))}else if(!t)throw new Error("Unpacked shape is needed when using channels > 1");return{width:s,height:a,channels:n,isPacked:i,shape:l,strides:J.computeStrides(l),unpackedShape:t,reversedWH:o&&o.reverseWH}}});var Nv,Vo,Zf=C(()=>{"use strict";Pt();Gr();De();Ff();Gf();Uf();qf();zn();jf();Se();Nv=(r,e)=>{let n=e.map(o=>`${o.unpackedShape.join(",")};${o.width}x${o.height}`).join("_"),t=r.name;return r.cacheHint&&(t+="["+r.cacheHint+"]"),t+=":"+n,t},Vo=class{constructor(e){this.session=e;this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map}calculateTextureWidthAndHeight(e,n){return Kf(this.session.layoutStrategy,e,n)}executeProgram(e,n){if(n.length<e.inputNames.length)throw new Error(`Input size mustn't be less than ${e.inputNames.length}.`);if(e.inputNames.length!==e.inputTypes.length)throw new Error("input names size does not match input types");let t=[];for(let l=0;l<e.inputNames.length;++l)t[l]=this.getOrCreateTextureData(n[l],e.inputTypes[l]);let o=Nv(e,t),i=this.session.programManager.getArtifact(o),s=i?i.programInfo:typeof e.get=="function"?e.get():e,a=Fn(this.session.layoutStrategy,s.output.dims,s.output.textureType),u=this.createTextureData(a,s.output.type);return i||(i=this.session.programManager.build(s,t,u),this.session.programManager.setArtifact(o,i)),this.runProgram(i,t,u),u}run(e,n){return this.executeProgram(e,n).tensor}runProgram(e,n,t){for(let o=0;o<n.length;++o)if(!!n[o].isPacked!=(e.programInfo.inputTypes[o]===2))throw new Error(`input[${o}] property packed inconsistent`);if(!!t.isPacked!=(e.programInfo.output.textureType===2))throw new Error("output property packed inconsistent");this.session.programManager.run(e,n,t)}getOrCreateTextureData(e,n){let t=this.getTextureData(e.dataId,n===2);if(!t&&(t=this.getTextureData(e.dataId,n!==2),t))return n===2?this.pack(t):this.unpack(t);if(!t){let o=Fn(this.session.layoutStrategy,e.dims,n);if(n===4){let a=e.dims;if(a.length===4){let u=[a[0],Math.ceil(a[1]*a[2]*a[3]/4)],l=Fn(this.session.layoutStrategy,u,n),f=e.numberData;if(a[1]*a[2]*a[3]%4!==0){let c=a[0],p=a[1]*a[2]*a[3],b=Math.ceil(p*1/4)*4,h=c*b;f=new Float32Array(h);for(let g=0;g<c;++g){let T=g*p,w=g*b+g%1*p;f.set(e.numberData.subarray(T,T+p),w)}}return this.createTextureData(l,e.type,f,e,1)}}if(n===2){let i=Ja(this.session.layoutStrategy,e.dims,1,[],{reverseWH:!0}),s=this.createTextureData(i,e.type,e.numberData,e,1);t=this.pack(s)}else t=this.createTextureData(o,e.type,e.numberData,e,1)}return t}createTextureDataFromLayoutBindTensor(e,n,t,o){return this.createTextureData(e,n,t,o,1)}createTextureData(e,n,t,o,i){Re.verbose("InferenceHandler",`Creating TextureData: layout:[${JSON.stringify(e)}]`);let s=this.session.textureManager.createTextureFromLayout(n,e,t,i);return this.createTextureDataFromTexture(e,n,s,o)}reshapeUnpacked(e,n){let t=this.getOrCreateTextureData(e,0),o={channels:t.channels,height:t.height,width:t.width,shape:n.length!==0?n:[1],strides:J.computeStrides(n),unpackedShape:n};return this.createTextureDataFromTexture(o,e.type,t.texture).tensor}reshapePacked(e,n){let t=this.getOrCreateTextureData(e,2);if(Vf(e.dims,n)){let l={channels:t.channels,height:t.height,width:t.width,shape:n.length!==0?n:[1],strides:J.computeStrides(n),unpackedShape:n,isPacked:!0};return this.createTextureDataFromTexture(l,e.type,t.texture).tensor}let o=Za(e.dims),i=Za(n),s=this.reshapePacked(e,o),a=this.run(Mf(this,s,i),[s]);return this.reshapePacked(a,n)}cast(e,n){let t=this.getOrCreateTextureData(e,0);return this.createTextureDataFromTexture(t,n,t.texture).tensor}createTextureDataFromTexture(e,n,t,o,i){let s={...e,tensor:o||new Qe(e.unpackedShape,n,a=>this.readTexture(s),async a=>this.readTextureAsync(s),void 0,i),texture:t};return this.setTextureData(s.tensor.dataId,s,e.isPacked),s}getTextureData(e,n=!1){return this.session.isInitializer(e)?this.session.getTextureData(e,n):n?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,n,t=!1){this.session.isInitializer(e)?this.session.setTextureData(e,n,t):(t?this.packedTextureDataCache:this.unpackedTextureDataCache).set(e,n)}isTextureLayoutCached(e,n=!1){return!!this.getTextureData(e.dataId,n)}dispose(){this.session.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.unpackedTextureDataCache=new Map}readTexture(e){return e.isPacked?this.readTexture(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTexture(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(Ya(this,e))}async readTextureAsync(e){return e.isPacked?this.readTextureAsync(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTextureAsync(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(Ya(this,e))}pack(e){return this.executeProgram(zf(this,e.tensor),[e.tensor])}unpack(e){return this.executeProgram(Hf(this,e.tensor),[e.tensor])}}});var Qa,be,st=C(()=>{"use strict";Qa=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},be=r=>new Qa(r)});var Yf,Jf,Qf,zv,Fv,ed=C(()=>{"use strict";st();He();Se();Yf={name:"BatchNormalization",inputNames:["A","Scale","B","Mean","Variance"],inputTypes:[0,0,0,0,0]},Jf=(r,e,n)=>(Fv(e),[r.run({...Yf,cacheHint:n.cacheKey,get:()=>zv(r,e,n)},e)]),Qf=r=>{let e=r.attributes.getFloat("epsilon",1e-5),n=r.attributes.getFloat("momentum",.9),t=r.attributes.getInt("spatial",1);return be({epsilon:e,momentum:n,spatial:t})},zv=(r,e,n)=>{let t=oe(r.session.backend.glContext.version),o=e[0].dims.length,[i,s]=r.calculateTextureWidthAndHeight(e[1].dims,0),a=`
  float process(int[${o}] indices) {
    vec2 position = offsetToCoords(indices[1], ${i}, ${s});
    float scale = getColorAsFloat(${t.texture2D}(Scale, position));
    float mean = getColorAsFloat(${t.texture2D}(Mean, position));
    float variance = getColorAsFloat(${t.texture2D}(Variance, position));
    float b = getColorAsFloat(${t.texture2D}(B, position));

    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${n.epsilon})) ) + b;
  }`;return{...Yf,output:{dims:e[0].dims,type:e[0].type,textureType:0},shaderSource:a}},Fv=r=>{if(!r||r.length!==5)throw new Error("BatchNormalization requires 5 inputs.");let e=r[0],n=r[1],t=r[2],o=r[3],i=r[4];if(e.dims.length<3||n.dims.length!==1||t.dims.length!==1||o.dims.length!==1||i.dims.length!==1)throw new Error("invalid input shape.");if(n.dims[0]!==e.dims[1]||t.dims[0]!==e.dims[1]||o.dims[0]!==e.dims[1]||i.dims[0]!==e.dims[1])throw new Error("invalid input shape.");if(e.type!=="float32"&&e.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||t.type!=="float32"&&t.type!=="float64"||o.type!=="float32"&&o.type!=="float64"||i.type!=="float32"&&i.type!=="float64")throw new Error("invalid input tensor types.")}});var Go,kt,X,Mn,Uo,pr=C(()=>{"use strict";Go=class{constructor(e,n,t,o){this.glContext=e;this.programInfo=n;this.inputTextureLayouts=t;this.outputTextureLayout=o}},kt=class{constructor(e){this.context=e}},X=class{constructor(e,n){this.routineBody=e;this.dependencies=n}},Mn=class{constructor(e,n,t){this.name=e;t?this.dependencies=t:this.dependencies=[],n&&(this.routineBody=n)}addDependency(e){e&&this.dependencies.push(e)}},Uo=class{static returnOrderedNodes(e){if(!e||e.length===0)return[];if(e.length===1)return e;let n=new Set,t=new Set,o=new Array;return this.createOrderedNodes(e,n,t,o),o}static createOrderedNodes(e,n,t,o){for(let i=0;i<e.length;++i)this.dfsTraverse(e[i],n,t,o)}static dfsTraverse(e,n,t,o){if(!e||t.has(e.name))return;if(n.has(e.name))throw new Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");n.add(e.name);let i=e.dependencies;if(i&&i.length>0)for(let s=0;s<i.length;++s)this.dfsTraverse(i[s],n,t,o);o.push(e),t.add(e.name),n.delete(e.name)}}});function Vv(){let r="add_";return{body:`
  float ${r}(float a, float b) {
    return a + b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 + v2;
  }
  `,name:r,type:0}}function Gv(){let r="div_";return{body:`
  float ${r}(float a, float b) {
    return a / b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 / v2;
  }
  `,name:r,type:0}}function Uv(){let r="mul_";return{body:`
  float ${r}(float a, float b) {
    return a * b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 * v2;
  }
  `,name:r,type:0}}function Wv(){let r="sub_";return{body:`
  float ${r}(float a, float b) {
    return a - b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 - v2;
  }
  `,name:r,type:0}}function Hv(){let r="equal_";return{body:`
  float ${r}(float a, float b) {
    return float(a == b);
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4(equal(v1, v2));
  }
  `,name:r,type:0}}function qv(){let r="greater_";return{body:`
  float ${r}(float a, float b) {
    return float(a > b);
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4( v1.r > v2.r ,
      v1.g > v2.g,
      v1.b > v2.b,
      v1.a > v2.a );
  }
  `,name:r,type:0}}function Kv(){let r="less_";return{body:`
  float ${r}(float a, float b) {
    return float(a < b);
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4( v1.r < v2.r ,
                v1.g < v2.g,
                v1.b < v2.b,
                v1.a < v2.a );
  }
  `,name:r,type:0}}function jv(){let r="and_";return{body:`
  float ${r}(float a, float b) {
    return float( bool(a) && bool(b) );
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r && b2.r ,
                b1.g && b2.g,
                b1.b && b2.b,
                b1.a && b2.a );
  }
  `,name:r,type:0}}function Xv(){let r="or_";return{body:`
  float ${r}(float a, float b) {
    return float( bool(a) || bool(b) );
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r || b2.r ,
                b1.g || b2.g,
                b1.b || b2.b,
                b1.a || b2.a );
  }
  `,name:r,type:0}}function Zv(){let r="xor_";return{body:`
  float ${r}(float a, float b) {
    return float( bool(a) ^^ bool(b) );
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r ^^ b2.r ,
                b1.g ^^ b2.g,
                b1.b ^^ b2.b,
                b1.a ^^ b2.a );
  }
  `,name:r,type:0}}function Yv(){return Qv("pow")}function Jv(){let r="prelu_";return{body:`
  float ${r}(float a, float b) {
    return a < 0.0 ? a * b: a;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4(
      v1.r < 0.0 ? v1.r * v2.r: v1.r,
      v1.g < 0.0 ? v1.g * v2.g: v1.g,
      v1.b < 0.0 ? v1.b * v2.b: v1.b,
      v1.a < 0.0 ? v1.a * v2.a: v1.a
      );
  }
  `,name:r,type:0}}function Qv(r){let e=`${r}_`;return{body:`
  float ${e}(float a, float b) {
    return ${r}(a, b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return ${r}(v1, v2);
  }
  `,name:e,type:0}}var Dt,ew,td,rd,nd,od,id,ad,sd,ud,ld,cd,fd,dd,pd=C(()=>{"use strict";De();pr();He();Se();Dt=(r,e,n,t=e[0].type,o)=>{let i=r.session.pack?2:0;return{name:n.name,inputNames:["A","B"],inputTypes:[i,i],cacheHint:o,get:()=>ew(r,e,n,t)}},ew=(r,e,n,t=e[0].type)=>{let o=r.session.pack?2:0,i=!J.areEqual(e[0].dims,e[1].dims),s=e[0].dims,a=r.session.pack;if(i){let f=gt.calcShape(e[0].dims,e[1].dims,!1);if(!f)throw new Error("Can't perform binary op on the given tensors");s=f;let c=s.length,p=e[0].dims.length!==0?e[0].dims.length:1,b=e[1].dims.length!==0?e[1].dims.length:1,h=e[0].dims.length!==0?"bcastIndices_A(indices, aindices);":"aindices[0] = 0;",g=e[1].dims.length!==0?"bcastIndices_B(indices, bindices);":"bindices[0] = 0;",T=oe(r.session.backend.glContext.version),w=a?`
      ${n.body}
      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        vec4 result = ${n.name}(a, b);
        ${T.output} = result;
      }`:`
      ${n.body}
      float process(int indices[${c}]) {
        int aindices[${p}];
        int bindices[${b}];
        ${h}
        ${g}
        return ${n.name}(_A(aindices), _B(bindices));
      }`;return{name:n.name,inputNames:["A","B"],inputTypes:[o,o],output:{dims:s,type:t,textureType:o},shaderSource:w,hasMain:a}}let u=oe(r.session.backend.glContext.version),l=`
    ${n.body}
    void main() {
      vec4 v1 = ${u.texture2D}(A, TexCoords);
      vec4 v2 = ${u.texture2D}(B, TexCoords);
      vec4 result = ${n.name}(v1, v2);
      ${u.output} = result;
    }
    `;return{name:n.name,inputNames:["A","B"],inputTypes:[o,o],output:{dims:e[0].dims,type:t,textureType:o},shaderSource:l,hasMain:!0}},td=(r,e)=>[r.run(Dt(r,e,Vv()),e)],rd=(r,e)=>[r.run(Dt(r,e,jv(),"bool"),e)],nd=(r,e)=>[r.run(Dt(r,e,Gv()),e)],od=(r,e)=>[r.run(Dt(r,e,Hv(),"bool"),e)],id=(r,e)=>[r.run(Dt(r,e,qv(),"bool"),e)],ad=(r,e)=>[r.run(Dt(r,e,Kv(),"bool"),e)],sd=(r,e)=>[r.run(Dt(r,e,Uv()),e)],ud=(r,e)=>[r.run(Dt(r,e,Xv(),"bool"),e)],ld=(r,e)=>[r.run(Dt(r,e,Yv()),e)],cd=(r,e)=>[r.run(Dt(r,e,Jv()),e)],fd=(r,e)=>[r.run(Dt(r,e,Wv()),e)],dd=(r,e)=>[r.run(Dt(r,e,Zv(),"bool"),e)]});var md,hd,rw,gd=C(()=>{"use strict";De();md=(r,e,n)=>(rw(e),[r.cast(e[0],n)]),hd=r=>lt.tensorDataTypeFromProto(r.attributes.getInt("to")),rw=r=>{if(!r||r.length!==1)throw new Error("Cast requires 1 input.");if(r[0].type==="string")throw new Error("Invalid input type.")}});var nw,ow,bd,Wo,yd=C(()=>{"use strict";He();Se();Qt();Ur();nw=(r,e)=>({name:"Concat (packed)",inputNames:Array.from({length:r},(n,t)=>`X${t}`),inputTypes:Array(r).fill(2),cacheHint:e}),ow=(r,e,n,t)=>{let o=n[0].dims.slice();if(t>=o.length||t<-1*o.length)throw new Error("axis specified for concat doesn't match input dimensionality");t<0&&(t=o.length+t);let i=o.slice(0);for(let P=1;P<n.length;P++){let E=n[P].dims.slice();for(let N=0;N<o.length;N++)if(N===t)i[t]+=E[N];else if(o[N]!==E[N])throw new Error("non concat dimensions must match")}let s=i.length,a=gn("coords",s),u=bt(s),l=er(),f=n.map(P=>P.dims),c=Gt(s),p=new Array(f.length-1);p[0]=f[0][t];for(let P=1;P<p.length;P++)p[P]=p[P-1]+f[P][t];let b=c[t],h=c.slice(-2),g=c.join(),T=`if (${b} < ${p[0]}) {
        return getChannel(
            getX0(${g}), vec2(${h.join()}));
        }`;for(let P=1;P<p.length;P++){let E=p[P-1];T+=`
            if (${b} < ${p[P]}  && ${b} >= ${p[P-1]}) {
              return getChannel(
                getX${P}(${Wo(c,b,E)}),
                vec2(${Wo(h,b,E)}));
            }`}let w=p.length,v=p[p.length-1];T+=`
            return getChannel(
              getX${w}(${Wo(c,b,v)}),
              vec2(${Wo(h,b,v)}));`;let S=oe(r.session.backend.glContext.version),$=`
          ${l}
          float getValue(${c.map(P=>"int "+P)}) {
            ${T}
          }

          void main() {
            ${u} coords = getOutputCoords();
            int lastDim = coords.${c[s-1]};
            coords.${c[s-1]} = coords.${c[s-2]};
            coords.${c[s-2]} = lastDim;

            vec4 result = vec4(getValue(${a}), 0., 0., 0.);

            ${a[s-1]} = ${a[s-1]} + 1;
            if (${a[s-1]} < ${i[s-1]}) {
              result.g = getValue(${a});
            }

            ${a[s-2]} = ${a[s-2]} + 1;
            if (${a[s-2]} < ${i[s-2]}) {
              result.a = getValue(${a});
            }

            ${a[s-1]} = ${a[s-1]} - 1;
            if (${a[s-2]} < ${i[s-2]} &&
                ${a[s-1]} < ${i[s-1]}) {
              result.b = getValue(${a});
            }
            ${S.output} = result;
          }
        `;return{...e,output:{dims:i,type:n[0].type,textureType:2},shaderSource:$,hasMain:!0}},bd=(r,e,n)=>{let t=nw(e.length,n.cacheKey);return{...t,get:()=>ow(r,t,e,n.axis)}},Wo=(r,e,n)=>{let t=r.indexOf(e);return r.map((i,s)=>s===t?`${i} - ${n}`:i).join()}});var xd,iw,aw,sw,vd,uw,lw,cw,wd,fw,Td=C(()=>{"use strict";st();Se();yd();xd=(r,e,n)=>(fw(e),r.session.pack&&e[0].dims.length>1?[r.run(bd(r,e,n),e)]:[r.run(sw(r,e,n),e)]),iw=(r,e)=>({name:"Concat",inputNames:Array.from({length:r},(n,t)=>`X${t}`),inputTypes:Array(r).fill(0),cacheHint:e}),aw=(r,e,n,t)=>{let o=n[0].dims.slice();if(t>=o.length||t<-1*o.length)throw new Error("axis specified for concat doesn't match input dimensionality");t<0&&(t=o.length+t);let i=o.slice(0);for(let b=1;b<n.length;b++){let h=n[b].dims.slice();for(let g=0;g<o.length;g++)if(g===t)i[t]+=h[g];else if(o[g]!==h[g])throw new Error("non concat dimensions must match")}let s=i.length,a=new Array(n.length),u=0;for(let b=0;b<a.length;++b)u+=n[b].dims[t],a[b]=u;let l="";n.length<5?l=vd(a):l=uw(a);let f=lw(n.length,s),c=cw(a),p=`
        ${f}
        ${c}
        ${l}
        float process(int indices[${s}]) {
          int textureIndex = getTextureWhereDataResides (indices[${t}]);

          if(textureIndex != 0) {
            indices[${t}] = indices[${t}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));
          }

          return fetchDataFromCorrectTexture(textureIndex, indices);
        }`;return{...e,output:{dims:i,type:n[0].type,textureType:0},shaderSource:p}},sw=(r,e,n)=>{let t=iw(e.length,n.cacheKey);return{...t,get:()=>aw(r,t,e,n.axis)}},vd=r=>`int getTextureWhereDataResides(int index) {
      ${r.map((n,t)=>`if(index<${n}) {return ${t};}
`).join("")}
    }`,uw=r=>vd(r),lw=(r,e)=>{let n=[`float fetchDataFromCorrectTexture(int textureIndex, int indices[${e}]) {`];for(let t=0;t<r;++t)t===0?n.push(`	if (textureIndex == ${t}) { return _X${t}(indices); }`):t===r-1?n.push(`	else { return _X${t}(indices); }`):n.push(`	else if (textureIndex == ${t}) { return _X${t}(indices); }`);return n.push("	}"),n.join(`
`)},cw=r=>{let e=["int getSizeInConcatAxisValueFromIndex(int index) {"];for(let n=0;n<r.length;++n)n===0?e.push(`	if (index == ${n}) { return ${r[n]}; }`):n===r.length-1?e.push(`	else { return ${r[n]}; }`):e.push(`	else if (index == ${n}) { return ${r[n]}; }`);return e.push("	}"),e.join(`
`)},wd=r=>be({axis:r.attributes.getInt("axis")}),fw=r=>{if(!r||r.length<1)throw new Error("too few inputs");let e=r[0].type,n=r[0].dims.length;if(e==="string")throw new Error("string tensor is not supported yet");for(let t of r){if(t.type!==e)throw new Error("input tensors should be one type");if(t.dims.length!==n)throw new Error("input tensors should have the same shape")}}});function dw(){return Bt("abs")}function pw(){return Bt("acos")}function mw(){return Bt("asin")}function hw(){return Bt("atan")}function gw(){return Bt("ceil")}function bw(){return Bt("cos")}function yw(r){let e="elu";return{body:`
  const float alpha = float(${r});

  float ${e}_(float a) {
    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;
  }
  vec4 ${e}_(vec4 v) {
    return vec4(${e}_(v.x), ${e}_(v.y), ${e}_(v.z), ${e}_(v.w));
  }
  `,name:e,type:0}}function xw(){return Bt("exp")}function vw(){return Bt("floor")}function es(r,e){let n="clip";return{body:`
  const float min = float(${r});
  const float max = float(${e});

  float ${n}_(float a) {
    return clamp(a, min, max);
  }
  vec4 ${n}_(vec4 v) {
    return clamp(v, min, max);
  }
  `,name:n,type:0}}function ww(){let r="indentity";return{body:`
  float ${r}_(float a) {
    return a;
  }
  vec4 ${r}_(vec4 v) {
    return v;
  }
  `,name:r,type:0}}function Tw(r){let e="leakyRelu";return{body:`
  const float alpha = float(${r});

  float ${e}_(float a) {
    return a < 0.0 ? a * alpha : a;
  }
  vec4 ${e}_(vec4 v) {
    return vec4(${e}_(v.x), ${e}_(v.y), ${e}_(v.z), ${e}_(v.w));
  }
  `,name:e,type:0}}function _w(){return Bt("log")}function Iw(){let r="neg";return{body:`
  float ${r}_(float a) {
    return -a;
  }
  vec4 ${r}_(vec4 v) {
    return -v;
  }
  `,name:r,type:0}}function Sw(){let r="not";return{body:`
  float ${r}_(float a) {
    return float( ! bool(a) );
  }
  bool ${r}_(bool a) {
    return !a;
  }
  vec4 ${r}_(vec4 v) {
    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));
  }
  bvec4 ${r}_(bvec4 v) {
    return bvec4(!v.x, !v.y, !v.z, !v.w);
  }
  `,name:r,type:0}}function $w(){return Bt("sin")}function ts(){let r="relu";return{body:`
  float ${r}_(float a) {
    return max( a, 0.0 );
  }
  vec4 ${r}_(vec4 v) {
    return max( v, 0.0 );
  }
  `,name:r,type:0}}function rs(){let r="sigmoid";return{body:`
  float ${r}_(float a) {
    return 1.0 / (1.0 + exp(-a));
  }
  vec4 ${r}_(vec4 v) {
    return 1.0 / (1.0 + exp(-v));
  }
  `,name:r,type:0}}function Aw(){return Bt("sqrt")}function Pw(){return Bt("tan")}function Ow(){let r="tanh";return{body:`
  float ${r}_(float a) {
    a = clamp(a, -10., 10.);
    a = exp(2.*a);
    return (a - 1.) / (a + 1.);
  }
  vec4 ${r}_(vec4 v) {
    v = clamp(v, -10., 10.);
    v = exp(2.*v);
    return (v - 1.) / (v + 1.);
  }
  `,name:r,type:0}}function Bt(r){return{body:`
  float ${r}_(float a) {
    return ${r}(a);
  }
  vec4 ${r}_(vec4 v) {
    return ${r}(v);
  }
  `,name:r,type:0}}var Ew,Ze,_d,Id,Sd,$d,ns,Ad,Pd,Cw,Od,Ed,Cd,kd,Dd,Bd,os,Ld,Rd,Nd,zd,Fd,Md,Vd,Gd,Ud,Wd,Hd,is=C(()=>{"use strict";st();De();pr();He();Se();Ew=(r,e,n,t)=>{let o=r.session.pack?2:0,i=oe(r.session.backend.glContext.version);return{...e,output:{dims:n.dims,type:n.type,textureType:o},shaderSource:`
     ${t.body}
     void main() {
       vec4 v = ${i.texture2D}(A, TexCoords);
       v = ${t.name}_(v);
       ${i.output} = v;
     }
     `,hasMain:!0}},Ze=(r,e,n,t)=>{let o=r.session.pack?2:0,i={name:n.name,inputTypes:[o],inputNames:["A"],cacheHint:t};return{...i,get:()=>Ew(r,i,e,n)}},_d=(r,e)=>[r.run(Ze(r,e[0],dw()),e)],Id=(r,e)=>[r.run(Ze(r,e[0],pw()),e)],Sd=(r,e)=>[r.run(Ze(r,e[0],mw()),e)],$d=(r,e)=>[r.run(Ze(r,e[0],hw()),e)],ns=(r,e,n)=>[r.run(Ze(r,e[0],es(n.min,n.max),n.cacheKey),e)],Ad=r=>be({min:r.attributes.getFloat("min",Mr),max:r.attributes.getFloat("max",Vr)}),Pd=(r,e)=>{let n=Cw(r,e);return ns(r,[e[0]],n)},Cw=(r,e)=>{if(e.length>=3&&(!r.session.isInitializer(e[1].dataId)||!r.session.isInitializer(e[2].dataId)))throw new Error("dynamic clip attributes are not allowed");let n=e.length>=3?e[1].numberData[0]:Mr,t=e.length>=3?e[2].numberData[0]:Vr;return be({min:n,max:t})},Od=(r,e)=>[r.run(Ze(r,e[0],gw()),e)],Ed=(r,e)=>[r.run(Ze(r,e[0],bw()),e)],Cd=(r,e,n)=>[r.run(Ze(r,e[0],yw(n.alpha),n.cacheKey),e)],kd=r=>be({alpha:r.attributes.getFloat("alpha",1)}),Dd=(r,e)=>[r.run(Ze(r,e[0],xw()),e)],Bd=(r,e)=>[r.run(Ze(r,e[0],vw()),e)],os=(r,e)=>[r.run(Ze(r,e[0],ww()),e)],Ld=(r,e,n)=>[r.run(Ze(r,e[0],Tw(n.alpha),n.cacheKey),e)],Rd=r=>be({alpha:r.attributes.getFloat("alpha",.01)}),Nd=(r,e)=>[r.run(Ze(r,e[0],_w()),e)],zd=(r,e)=>[r.run(Ze(r,e[0],Iw()),e)],Fd=(r,e)=>[r.run(Ze(r,e[0],Sw()),e)],Md=(r,e)=>[r.run(Ze(r,e[0],ts()),e)],Vd=(r,e)=>[r.run(Ze(r,e[0],rs()),e)],Gd=(r,e)=>[r.run(Ze(r,e[0],$w()),e)],Ud=(r,e)=>[r.run(Ze(r,e[0],Aw()),e)],Wd=(r,e)=>[r.run(Ze(r,e[0],Pw()),e)],Hd=(r,e)=>[r.run(Ze(r,e[0],Ow()),e)]});function tr(r){let e;switch(r.activation){case"Relu":e=ts();break;case"Sigmoid":e=rs();break;case"Clip":e=es(r.clipMin,r.clipMax);break;default:return{activationFunction:"",applyActivation:""}}let n=e.name,t=e.body,o=`value = ${n}_(value);`;return{activationFunction:t,applyActivation:o}}var bn,Wr=C(()=>{"use strict";De();is();bn=r=>{let e=r.getString("activation","");if(e==="Clip"){let[n,t]=r.getFloats("activation_params",[Mr,Vr]);return{activation:e,clipMax:t,clipMin:n,activationCacheKey:`${e}:${n},${t}`}}return{activation:e,activationCacheKey:e}}});var Dw,Bw,qd,Kd=C(()=>{"use strict";Pt();He();Se();Ho();Wr();Dw=(r,e)=>({name:"GroupedConv",inputNames:r?["X","W","Bias"]:["X","W"],inputTypes:r?[0,0,0]:[0,0],cacheHint:e}),Bw=(r,e,n,t)=>{let i=e.length>2?"value += getBias(output_channel);":"",s=e[0].dims.slice(),a=e[1].dims.slice(),u=a[0]/t.group;Re.verbose("GroupedConv",`autpPad:${t.autoPad}, dilations:${t.dilations}, group:${t.group}, kernelShape:${t.kernelShape}, pads:${t.pads}, strides:${t.strides}`);let l=yn(s,a,t.dilations,t.pads,t.strides),f=oe(r.session.backend.glContext.version),{activationFunction:c,applyActivation:p}=tr(t),b=`
  const ivec2 strides = ivec2(${t.strides[0]}, ${t.strides[1]});
  const ivec2 pads = ivec2(${t.pads[0]}, ${t.pads[1]});
  ${c}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;
    ivec2 xRCCorner = coords.zw * strides - pads;
    int group_id = output_channel / ${u};

    float value = 0.0;
    for (int wInChannel = 0; wInChannel < ${a[1]}; wInChannel++) {
      int input_channel = group_id * ${a[1]} + wInChannel;
      for (int wHeight = 0; wHeight < ${a[2]}; wHeight++) {
        int xHeight = xRCCorner.x + wHeight * ${t.dilations[0]};

        if (xHeight < 0 || xHeight >= ${s[2]}) {
          continue;
        }

        for (int wWidth = 0; wWidth < ${a[3]}; wWidth++) {
          int xWidth = xRCCorner.y + wWidth * ${t.dilations[1]};
          if (xWidth < 0 || xWidth >= ${s[3]}) {
            continue;
          }

          float xVal = getX(batch, input_channel, xWidth, xHeight);
          float wVal = getW(output_channel, wInChannel, wWidth, wHeight);
          value += xVal*wVal;
        }
      }
    }
    ${i}
    ${p}
    ${f.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:l,type:e[0].type,textureType:0},shaderSource:b,hasMain:!0}},qd=(r,e,n)=>{let t=Dw(e.length>2,n.cacheKey);return{...t,get:()=>Bw(r,e,t,n)}}});var Lw,Rw,jd,Xd=C(()=>{"use strict";He();Se();Ur();Lw=r=>({name:"Im2Col (packed)",inputNames:["A"],inputTypes:[2],cacheHint:r}),Rw=(r,e,n,t,o,i)=>{let s=n.dims,a=t.dims,u=2,l=3,f=o.length,c=[a[1]*a[2]*a[3],o[2]*o[3]],p=a[2]*a[3],b=er(),h=oe(r.session.backend.glContext.version),g="";for(let w=0;w<=1;w++)for(let v=0;v<=1;v++)g+=`
            blockIndex = rc.x + ${v};
            pos = rc.y + ${w};

            if(blockIndex < ${c[1]} && pos < ${c[0]}) {
              offsetY = int(blockIndex / (${o[f-1]})) * ${i.strides[0]} -
                ${i.pads[0]};
              d0 = offsetY + ${i.dilations[0]} * (imod(pos, ${p}) / ${a[2]});

              if(d0 < ${s[u]} && d0 >= 0) {
                offsetX = imod(blockIndex, ${o[f-1]}) * ${i.strides[1]} -
                  ${i.pads[1]};
                d1 = offsetX + ${i.dilations[1]} * imod(imod(pos, ${p}), ${a[2]});

                if(d1 < ${s[l]} && d1 >= 0) {

                  ch = int(float(pos)/ ${p}.);
                    innerDims = vec2(d0, d1);
                    result[${w*2+v}] = getChannel(
                      getA(0, ch, int(innerDims.x),
                      int(innerDims.y)), innerDims);
                }
              }
            }

          `;let T=`
      ${b}

      void main() {
        ivec2 rc = getOutputCoords();
          vec4 result = vec4(0.0);
          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
          vec2 innerDims;
          ${g}
          ${h.output} = result;
      }
            `;return{...e,output:{dims:c,type:n.type,textureType:2},shaderSource:T,hasMain:!0}},jd=(r,e,n,t,o)=>{let i=Lw(o.cacheKey);return{...i,get:()=>Rw(r,i,e,n,t,o)}}});function zw(r,e,n){let t=e[0].dims,o=e[1].dims,i=gt.calcShape(t,o,!0);if(!i)throw new Error("Can't use matmul on the given tensors");let s=bt(i.length),a=Gt(),{activationFunction:u,applyActivation:l}=tr(n),f=e.length>2,c=f?"value += getBiasForMatmul();":"",p=f?`${ss(s,a,e[2].dims,i,!1)}`:"",b=i.length,h=t.length,g=o.length,T=t[t.length-1],w=`
    ${u}
    ${p}
    float process(int indices[${b}]) {
        int a[${h}];
        int b[${g}];
        bcastMatmulIndices_A(indices, a);
        bcastMatmulIndices_B(indices, b);

        float value;
        for (int k=0; k<${T}; ++k) {
            a[${h-1}] = k;
            b[${g-2}] = k;
            value += _A(a) * _B(b);
        }
        ${c}
        ${l}
        return value;
    }`;return{...r,output:{dims:i,type:e[0].type,textureType:0},shaderSource:w}}function as(r,e){let n=Nw(r.length>2,e.activationCacheKey);return{...n,get:()=>zw(n,r,e)}}function ss(r,e,n,t,o){let i="",s=n.length,a=t.length,u=a-s;a<2&&s>0?i="coords":i=n.map((g,T)=>`coords.${e[T+u]}`).join(", ");let f=gt.getBroadcastDims(n,t).map(g=>`coords.${e[g+u]} = 0;`).join(`
`),p=J.size(n)===1,b="vec4(outputValue.xx, outputValue.yy)";return p&&(b="vec4(outputValue.x)"),o?`
vec4 getBiasForMatmul() {
  ${r} coords = getOutputCoords();
  ${f}
  vec4 outputValue = getBias(${i});
  return ${b};
}`:`
float getBiasForMatmul() {
  ${r} coords = getOutputCoords();
  ${f}
  return getBias(coords.x);
}`}var Zd,Yd,Nw,Fw,qo=C(()=>{"use strict";De();Se();Qt();Wr();us();Zd=(r,e,n)=>(Fw(e),r.session.pack?[r.run(Ko(r,e,n),e)]:[r.run(as(e,n),e)]),Yd=r=>bn(r.attributes),Nw=(r,e)=>({name:"MatMul",inputNames:r?["A","B","Bias"]:["A","B"],inputTypes:r?[0,0,0]:[0,0],cacheHint:e});Fw=r=>{if(!r||r.length!==2)throw new Error("MatMul requires 2 inputs.");if(r[0].dims[r[0].dims.length-1]!==r[1].dims[r[1].dims.length-2])throw new Error("shared dimension does not match.");if(r[0].type!=="float32"&&r[0].type!=="float64"||r[1].type!=="float32"&&r[1].type!=="float64")throw new Error("inputs should be float type");if(r[0].type!==r[1].type)throw new Error("inputs types should match")}});function Gw(r,e,n,t){let o=[],i=[],s=n[0].dims,a=n[1].dims,u=s.length,l=a.length,f=t.length,c=f-u,p=f-l;o=s.map((S,$)=>`coords.${e[$+c]}`),o[u-1]="i*2",o.join(", "),i=a.map((S,$)=>`coords.${e[$+p]}`),i[l-2]="i*2",i.join(", ");let b=gt.getBroadcastDims(s,t),h=gt.getBroadcastDims(a,t),g=b.map(S=>`coords.${e[S+c]} = 0;`).join(`
`),T=h.map(S=>`coords.${e[S+p]} = 0;`).join(`
`),w=`int lastDim = coords.${e[f-1]};
  coords.${e[f-1]} = coords.${e[f-2]};
  coords.${e[f-2]} = lastDim;`;return`
vec4 getAAtOutCoordsMatmul(int i) {
  ${r} coords = getOutputCoords();
  ${w}
  ${g}
  vec4 outputValue = getA(${o});
  return outputValue;
}

vec4 getBAtOutCoordsMatmul(int i) {
  ${r} coords = getOutputCoords();
  ${w}
  ${T}
  vec4 outputValue = getB(${i});
  return outputValue;
}`}function Uw(r,e){let n="";for(let t=0;t<e-2;t++)n+=`rc.${r[t]}, `;return n+=`rc.${r[e-2]}, i*2`,n}function Ww(r,e){let n="";for(let t=0;t<e-2;t++)n+=`rc.${r[t]}, `;return n+=`i*2, rc.${r[e-1]}`,n}var Mw,Vw,Ko,us=C(()=>{"use strict";De();He();Se();Qt();Wr();qo();Mw=(r,e)=>({name:"MatMul (packed)",inputNames:r?["A","B","Bias"]:["A","B"],inputTypes:r?[2,2,2]:[2,2],cacheHint:e}),Vw=(r,e,n,t)=>{let o=n.length>2,i=o?"value += getBiasForMatmul();":"",s=n[0].dims,a=n[1].dims,u=gt.calcShape(s,a,!0),l=!J.areEqual(n[0].dims,n[1].dims);if(!u)throw new Error("Can't use matmul on the given tensors");let f=s[s.length-1],c=Math.ceil(f/2),p=s.length,b=a.length,h=oe(r.session.backend.glContext.version),g=bt(u.length),T=u.length,w=Gt(),{activationFunction:v,applyActivation:S}=tr(t),$=o?`${ss(g,w,n[2].dims,u,!0)}`:"",P=l?`${Gw(g,w,n,u)}`:"",E=l?"getAAtOutCoordsMatmul(i)":`getA(${Uw(w,p)})`,N=l?"getBAtOutCoordsMatmul(i)":`getB(${Ww(w,b)})`,z=l?"":`${g} rc =
          getOutputCoords(); int lastDim = rc.${w[T-1]}; rc.${w[T-1]} =
          rc.${w[T-2]}; rc.${w[T-2]} = lastDim;
      `,q=`
            ${P}
            ${$}
            ${v}
            void main() {
              ${z}

              vec4 value = vec4(0);
              for (int i = 0; i < ${c}; i++) {
                vec4 a = ${E};
                vec4 b = ${N};

                value += (a.rrbb * b.rgrg);
                value += (a.ggaa * b.baba);
              }
              ${i}
              ${S}
              ${h.output} = value;
            }`;return{...e,output:{dims:u,type:n[0].type,textureType:2},shaderSource:q,hasMain:!0}},Ko=(r,e,n)=>{let t=Mw(e.length>2,n.activationCacheKey);return{...t,get:()=>Vw(r,t,e,n)}}});var Jd,Qd=C(()=>{"use strict";Ho();Xd();us();Jd=(r,e,n)=>{let t=e[0].dims,o=e[1].dims,i=yn(t,o,n.dilations,n.pads,n.strides),s=r.run(jd(r,e[0],e[1],i,n),[e[0]]),a=r.reshapePacked(e[1],[o[0],o[1]*o[2]*o[3]]),u=e.length===3?[a,s,e[2]]:[a,s],l=r.run(Ko(r,u,n),u);return r.reshapePacked(l,i)}});var Hw,qw,ep,ls,cs=C(()=>{"use strict";Se();Hw=r=>({name:"Im2Col",inputNames:["X"],inputTypes:[0],cacheHint:r}),qw=(r,e,n,t,o,i)=>{let s=n.dims,a=t.dims,u=o.length,l=ls(s,a,o,4),f=`
        const int XC = ${s[1]};
        const int XH = ${s[2]};
        const int XW = ${s[3]};
        const int KH = ${i.kernelShape[0]};
        const int KW = ${i.kernelShape[1]};
        const int dilationH = ${i.dilations[0]};
        const int dilationW = ${i.dilations[1]};
        const int strideH = ${i.strides[0]};
        const int strideW = ${i.strides[1]};
        const int padH = ${i.pads[0]};
        const int padW = ${i.pads[1]};
        const int KHKW = KH*KW;
        const int XCKHKW = XC * KHKW;
        const int outputChannels = 4;
        vec4 process(int indices[${u}]) {
          int b  = indices[0]; // batch size
          int oh = indices[1] * strideH - padH; //output height
          int ow = indices[2] * strideW - padW; //output width
          int p = indices[3] * outputChannels; //patch
          vec4 value = vec4(0.0);
          for(int i=0; i < outputChannels; ++i) {
            if(p < XCKHKW) {
              int patchC = p / KHKW;
              int patchH = (p - patchC*KHKW) / KW;
              int patchW = (p - patchC*KHKW) - patchH * KW;
              int xh2 = oh + patchH * dilationH;
              int xw2 = ow + patchW * dilationW;
              int x[${s.length}];
              x[0] = b;
              x[1] = patchC;
              x[2] = xh2;
              x[3] = xw2;
              if(xh2 >= 0 &&
                  xh2 < XH &&
                  xw2 >= 0 &&
                  xw2 < XW) {
                value[i] = _X(x);
              }
            }
            ++p;
          }
          return value;
        }
        `;return{...e,output:{dims:l,type:n.type,textureType:4},shaderSource:f}},ep=(r,e,n,t,o)=>{let i=Hw(o.cacheKey);return{...i,get:()=>qw(r,i,e,n,t,o)}},ls=(r,e,n,t=4)=>[n[0],n[2],n[3],Math.ceil(r[1]*e[2]*e[3]/t)]});var Kw,jw,tp,rp=C(()=>{"use strict";De();He();Se();Wr();cs();Kw=(r,e)=>({name:"ConvDotProduct",inputNames:r?["Im2Col","K","B"]:["Im2Col","K"],inputTypes:r?[0,4,0]:[0,4],cacheKey:e.activationCacheKey}),jw=(r,e,n,t,o)=>{let i=n[0].dims,s=n[1].dims,a=[s[0],Math.ceil(i[1]*s[2]*s[3]/4)],u=ls(i,s,t),[l,f]=r.calculateTextureWidthAndHeight(a,4),c=J.computeStrides(u),[p,b]=r.calculateTextureWidthAndHeight(u,4),h=t.length,g=n.length<3?"0.0":"_B(b)",T=Math.ceil(i[1]*s[2]*s[3]/4),{activationFunction:w,applyActivation:v}=tr(o),S=oe(r.session.backend.glContext.version),$=`
${w}
float process(int indices[${h}]) {
  int b[1];
  b[0] = indices[1];
  int im2col[4];
  im2col[0] = indices[0];
  im2col[1] = indices[2];
  im2col[2] = indices[3];
  int im2colOffset = im2col[0] * ${c[0]} + im2col[1] * ${c[1]} + im2col[2] * ${c[2]};
  int kernelOffset = indices[1] * ${a[1]};
  float value = ${g};
  for (int i = 0; i < ${T}; ++i) {
    vec2 im2colCoords = offsetToCoords(im2colOffset, ${p}, ${b});
    vec2 kernelCoords = offsetToCoords(kernelOffset, ${l}, ${f});
    value += dot(${S.texture2D}(Im2Col, im2colCoords), ${S.texture2D}(K, kernelCoords));
    ++im2colOffset;
    ++kernelOffset;
  }
  ${v}
  return value;
}`;return{...e,output:{dims:t,type:n[0].type,textureType:0},shaderSource:$}},tp=(r,e,n,t)=>{let o=Kw(e.length>2,t);return{...o,get:()=>jw(r,o,e,n,t)}}});var yn,fs,Xw,Zw,Yw,Jw,ds,Qw,Ho=C(()=>{"use strict";st();De();Kd();Qd();rp();Wr();cs();qo();yn=(r,e,n,t,o)=>{let i=r[0],s=r.slice(2),a=s.length,u=e[0],f=e.slice(2).map((h,g)=>h+(h-1)*(n[g]-1)),p=s.map((h,g)=>h+t[g]+t[g+a]).map((h,g)=>Math.floor((h-f[g]+o[g])/o[g]));return[i,u].concat(...p)},fs=(r,e,n)=>(Qw(e,n),Xw(r,e,n)),Xw=(r,e,n)=>{let t=Jw(n,e),o=r.session.pack,i=t.kernelShape[0]===1&&t.kernelShape[1]===1;return t.group>1?[r.run(qd(r,e,t),e)]:i&&o?[Zw(r,e,t)]:o&&e[0].dims.length===4&&e[0].dims[0]===1&&!i?[Jd(r,e,t)]:[Yw(r,e,t)]},Zw=(r,e,n)=>{let t=e[0].dims,o=e[1].dims,i=yn(t,o,n.dilations,n.pads,n.strides),s=r.reshapeUnpacked(e[0],[t[1],t[2]*t[3]]),a=r.reshapeUnpacked(e[1],[o[0],o[1]]),u=e.length>2?[a,s,e[2]]:[a,s],l=r.run(as(u,n),u);return r.reshapeUnpacked(l,i)},Yw=(r,e,n)=>{let t=e[0].dims,o=e[1].dims,i=yn(t,o,n.dilations,n.pads,n.strides),s=r.run(ep(r,e[0],e[1],i,n),[e[0]]),a=e.length===3?[s,e[1],e[2]]:[s,e[1]];return r.run(tp(r,e,i,n),a)},Jw=(r,e)=>{let n=r.kernelShape.slice();if(r.kernelShape.length===0)for(let i=2;i<e[1].dims.length;++i)n.push(e[1].dims[i]);let t=r.pads.slice();Fr.adjustPadsBasedOnAutoPad(e[0].dims,r.strides,r.dilations,n,t,r.autoPad);let o=Object.assign({},r);return Object.assign(o,{kernelShape:n,pads:t,cacheKey:r.cacheKey}),o},ds=r=>{let e=r.attributes,n=bn(e),t=e.getString("auto_pad","NOTSET"),o=e.getInts("dilations",[1,1]),i=e.getInt("group",1),s=e.getInts("kernel_shape",[]),a=e.getInts("pads",[0,0,0,0]),u=e.getInts("strides",[1,1]);return be({autoPad:t,dilations:o,group:i,kernelShape:s,pads:a,strides:u,...n})},Qw=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length!==4||r[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=r[0].dims[1],t=r[1].dims[1]*e.group;if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(r.length===3&&(r[2].dims.length!==1||r[1].dims[0]!==r[2].dims[0]))throw new Error("invalid bias");let o=r[0].dims.length-2;if(e.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(e.strides.length!==o)throw new Error(`strides should be ${o}D`);if(e.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape");if(r[0].type!=="float32"||r[1].type!=="float32")throw new Error("Conv input(X,W) should be float tensor");if(r.length===3&&r[2].type!=="float32")throw new Error("Conv input(bias) should be float tensor")}});var eT,tT,rT,np,nT,oT,iT,aT,sT,uT,op,lT,ip=C(()=>{"use strict";st();He();Se();Wr();eT=(r,e,n,t,o,i)=>(r-1)*e+n+(t-1)*o+1-i,tT=(r,e,n,t,o)=>{let i=Math.floor(r/2);e==="SAME_UPPER"?(n[t]=i,n[o]=r-i):e==="SAME_LOWER"&&(n[t]=r-i,n[o]=i)},rT=(r,e,n,t,o,i,s,a)=>{let u=r.length-2,l=a.length===0;for(let f=0;f<u;++f){let c=l?r[f+2]*i[f]:a[f],p=eT(r[f+2],i[f],o[f],e[f],n[f],c);tT(p,t,o,f,f+u),l&&a.push(i[f]*(r[f+2]-1)+s[f]+(e[f]-1)*n[f]+1-o[f]-o[f+u])}},np=(r,e,n)=>(lT(e,n),nT(r,e,n)),nT=(r,e,n)=>{let t=uT(n,e);return[sT(r,e,t)]},oT=(r,e)=>({name:"ConvTranspose",inputNames:r?["X","W","B"]:["X","W"],inputTypes:r?[0,0,0]:[0,0],cacheHint:e}),iT=(r,e,n,t)=>{let i=e.length>2?"getB(output_channel)":"0.0",s=e[0].dims,a=e[1].dims,u=a[1],l=a[0]/t.group,f=[e[0].dims[0],e[1].dims[1]*t.group,...t.outputShape],c=oe(r.session.backend.glContext.version),{activationFunction:p,applyActivation:b}=tr(t),h=`
  const ivec2 strides = ivec2(${t.strides[0]}, ${t.strides[1]});
  const ivec2 pads = ivec2(${t.pads[0]}, ${t.pads[1]});
  ${p}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;

    ivec2 loc = coords.zw + pads;

    int group_id = output_channel / ${u};
    int wOutChannel = output_channel - group_id * ${u};

    float value = ${i};
    for (int inChannelOffset = 0; inChannelOffset < ${l}; inChannelOffset++) {
      int input_channel = group_id * ${l} + inChannelOffset;
      for (int wWOff = 0; wWOff < ${a[2]}; wWOff++) {
        for (int wHOff = 0; wHOff < ${a[3]}; wHOff++) {
          ivec2 wOff = ivec2(wWOff * ${t.dilations[0]}, wHOff * ${t.dilations[1]});
          ivec2 wLoc = loc - wOff;
          ivec2 wLocIn = wLoc / strides;
          if (
            wLocIn * strides == wLoc &&
            wLocIn.x >= 0 && wLocIn.x < ${s[2]} &&
            wLocIn.y >= 0 && wLocIn.y < ${s[3]}
          ) {
            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);
            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);
            value += xVal * wVal;
          }
        }
      }
    }
    ${b}
    ${c.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:f,type:e[0].type,textureType:0},shaderSource:h,hasMain:!0}},aT=(r,e,n)=>{let t=oT(e.length>2,n.cacheKey);return{...t,get:()=>iT(r,e,t,n)}},sT=(r,e,n)=>r.run(aT(r,e,n),e),uT=(r,e)=>{let n=r.kernelShape.slice();if(r.kernelShape.length===0)for(let a=2;a<e[1].dims.length;++a)n.push(e[1].dims[a]);let t=r.pads.slice(),o=r.outputShape.slice(),i=e[0].dims;rT(i,n,r.dilations,r.autoPad,t,r.strides,r.outputPadding,o);let s=Object.assign({},r);return Object.assign(s,{kernelShape:n,pads:t,outputShape:o,cacheKey:r.cacheKey}),s},op=r=>{let e=r.attributes,n=bn(e),t=e.getString("auto_pad","NOTSET"),o=e.getInts("dilations",[1,1]),i=e.getInt("group",1),s=e.getInts("kernel_shape",[]),a=e.getInts("output_padding",[0,0]),u=e.getInts("output_shape",[]),l=e.getInts("pads",[0,0,0,0]),f=e.getInts("strides",[1,1]);return be({autoPad:t,dilations:o,group:i,kernelShape:s,outputPadding:a,outputShape:u,pads:l,strides:f,...n})},lT=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length!==4||r[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=r[0].dims[1],t=r[1].dims[0];if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let o=r[1].dims[1]*e.group;if(r.length===3&&(r[2].dims.length!==1||r[2].dims[0]!==o))throw new Error("invalid bias");let i=r[0].dims.length-2;if(e.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(e.strides.length!==i)throw new Error(`strides should be ${i}D`);if(e.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(e.outputPadding.length!==i)throw new Error(`output_padding should be ${i}D`);if(e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape");if(e.outputShape.length!==0&&e.outputShape.length!==r[0].dims.length-2)throw new Error("invalid output shape");if(r[0].type!=="float32"||r[1].type!=="float32")throw new Error("ConvTranspose input(X,W) should be float tensor");if(r.length===3&&r[2].type!=="float32")throw new Error("ConvTranspose input(bias) should be float tensor")}});var ap,Hr,sp,cT,up,fT,dT,pT,jo=C(()=>{"use strict";st();De();Se();ap={name:"Transpose",inputNames:["A"],inputTypes:[0]},Hr=(r,e,n)=>(pT(e),[r.run({...ap,cacheHint:n.cacheKey,get:()=>cT(r,e[0],n.perm)},e)]),sp=r=>be({perm:r.attributes.getInts("perm",[])}),cT=(r,e,n)=>{let t=e.dims;n=up(t,n);let o=fT(t,n),i=t.length,s=`
      ${dT("perm",n,i)}
      float process(int indices[${i}]) {
        int a[${i}];
        perm(a, indices);
        return _A(a);
      }`;return{...ap,output:{dims:o,type:e.type,textureType:0},shaderSource:s}},up=(r,e)=>(e&&e.length!==r.length&&(e=[...r.keys()].reverse()),e),fT=(r,e)=>(e=up(r,e),J.sortBasedOnPerm(r,e)),dT=(r,e,n)=>{let t=[];t.push(`void ${r}(out int a[${n}], int src[${n}]) {`);for(let o=0;o<n;++o)t.push(`	a[${e[o]}]=src[${o}];`);return t.push("	}"),t.join(`
`)},pT=r=>{if(!r||r.length!==1)throw new Error("Transpose requires 1 input.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("input should be float tensor")}});var lp,cp,mT,fp=C(()=>{"use strict";jo();lp=(r,e,n)=>{mT(e);let t=n.blocksize,o=t*t,i=n.mode==="DCR"?[0,3,4,1,5,2]:[0,1,4,2,5,3],s=n.mode==="DCR"?[e[0].dims[0],t,t,e[0].dims[1]/o,e[0].dims[2],e[0].dims[3]]:[e[0].dims[0],e[0].dims[1]/o,t,t,e[0].dims[2],e[0].dims[3]],a=r.reshapeUnpacked(e[0],s),u={perm:i,cacheKey:`${i}`},[l]=Hr(r,[a],u),f=[e[0].dims[0],e[0].dims[1]/o,e[0].dims[2]*t,e[0].dims[3]*t];return[r.reshapeUnpacked(l,f)]},cp=r=>{let e=r.attributes.getInt("blocksize");if(e<1)throw new Error(`blocksize must be >= 1, but got : ${e} for DepthToSpace`);let n=r.attributes.getString("mode","DCR");if(n!=="DCR"&&n!=="CRD")throw new Error(`unrecognized mode: ${n} for DepthToSpace`);return{mode:n,blocksize:e}},mT=r=>{if(r.length!==1)throw new Error(`DepthToSpace expect 1 inputs, but got ${r.length}`);if(r[0].type==="string"||r[0].dims.length!==4)throw new TypeError("DepthToSpace input should be a 4-D numeric tensor")}});var dp,pp,hT,mp=C(()=>{"use strict";De();dp=(r,e,n)=>{hT(e,n);let t=J.flattenShape(e[0].dims,n);return[r.reshapeUnpacked(e[0],t)]},pp=r=>r.attributes.getInt("axis",1),hT=(r,e)=>{if(!r||r.length!==1)throw new Error("Flatten requires 1 input.");let n=r[0].dims.length;if(n===0)throw new Error("scalar tensor is not supported.");if(e<-n||e>n)throw new Error("Invalid axis");if(r[0].type==="string")throw new Error("string tensor is not supported.")}});var Sr,Vn=C(()=>{"use strict";Sr=["float32","float64","int32","int16","int8","uint16","uint32","uint8"]});var hp,gp,gT,bT,yT,xT,bp=C(()=>{"use strict";st();Vn();De();Se();hp=(r,e,n)=>(xT(e,n.axis),[r.run(yT(r,e,n),e)]),gp=r=>be({axis:r.attributes.getInt("axis",0)}),gT={name:"Gather",inputNames:["A","B"],inputTypes:[0,0]},bT=(r,e,n,t)=>{let o=n[0].dims.slice(),i=n[1].dims.slice(),s=new Array(o.length+i.length-1);t=J.normalizeAxis(t,o.length);let a=[];for(let p=0;p<s.length;p++)p<t?(s[p]=o[p],a.push(`inputIdx[${p}] = outputIdx[${p}];`)):p<t+i.length?(s[p]=i[p-t],a.push(`indexDataIdx[${p-t}] = outputIdx[${p}];`)):(s[p]=o[p-i.length+1],a.push(`inputIdx[${p-i.length+1}] = outputIdx[${p}];`));let u=s.length||1,l=o.length,f=i.length||1,c=`
      float process(int outputIdx[${u}]) {
        int inputIdx[${l}];
        int indexDataIdx[${f}];
        indexDataIdx[0] = 0;
        ${a.join(`
        `)}
        int idx = int(_B(indexDataIdx));
        inputIdx[${t}] = idx < 0 ? idx + ${o[t]} : idx;
        return _A(inputIdx);
      }`;return{...e,output:{dims:s,type:n[0].type,textureType:0},shaderSource:c}},yT=(r,e,n)=>{let t={...gT,cacheHint:n.cacheKey};return{...t,get:()=>bT(r,t,e,n.axis)}},xT=(r,e)=>{if(!r||r.length!==2)throw new Error("Gather requires 2 inputs.");let n=r[0].dims.length;if(n<1)throw new Error("Invalid input shape.");if(e<-n||e>n-1)throw new Error("Invalid axis.");if(Sr.indexOf(r[0].type)===-1)throw new Error("Invaid input type.");if(r[1].type!=="int32"&&r[1].type!=="int16")throw new Error("Invaid input type.")}});var ps,yp,xp,vp,vT,wT,TT,wp=C(()=>{"use strict";st();De();Se();ps=(r,e,n)=>(TT(e,n),[r.run(vT(e,n),e)]),yp=(r,e)=>{let n=r.attributes.getInt("transA",0)!==0,t=r.attributes.getInt("transB",0)!==0,o=r.attributes.getFloat("alpha",1),i=r.attributes.getFloat("beta",1);return be({transA:n,transB:t,alpha:o,beta:i,isOptionalC:e})},xp=r=>yp(r,!1),vp=r=>yp(r,!0),vT=(r,e)=>{let n={name:"Gemm",inputNames:r.length===3?["A","B","C"]:["A","B"],inputTypes:r.length===3?[0,0,0]:[0,0],key:e.cacheKey};return{...n,get:()=>wT(n,r,e)}},wT=(r,e,n)=>{let t=e[0].dims.slice(),o=e[1].dims.slice(),[i,s]=No.getShapeOfGemmResult(t,n.transA,o,n.transB,e.length===3?e[2].dims:void 0),a=[i,s];if(!a)throw new Error("Can't use gemm on the given tensors");let u=t[t.length-1],l="";n.transA&&(u=t[0]),n.transA&&n.transB?l="value += _A_T(a) * _B_T(b);":n.transA&&!n.transB?l="value += _A_T(a) * _B(b);":!n.transA&&n.transB?l="value += _A(a) * _B_T(b);":!n.transA&&!n.transB&&(l="value += _A(a) * _B(b);");let f=a.length,c=e.length===3?`int c[${e[2].dims.length}];`:"",p=e.length===3?"bcastIndices_C(indices, c);":"",b=e.length===3?"value += beta * _C(c);":"",h=`
      float process(int indices[${f}]) {
          int a[${f}];
          int b[${f}];
          ${c}

          copyVec(indices, a);
          copyVec(indices, b);
          ${p}

          float value = 0.0;
          for (int k=0; k<${u}; ++k) {
              a[${f-1}] = k;
              b[${f-2}] = k;
              ${l}
          }

          value = value * alpha;
          ${b}
          return value;
      }`;return{...r,output:{dims:a,type:e[0].type,textureType:0},variables:[{name:"alpha",type:"float",data:n.alpha},{name:"beta",type:"float",data:n.beta}],shaderSource:h}},TT=(r,e)=>{if(!r)throw new Error("Input is missing");if(e.isOptionalC&&(r.length<2||r.length>3))throw new Error("Invaid input shape.");if(!e.isOptionalC&&r.length!==3)throw new Error("Gemm requires 3 inputs");if(r.length===3&&r[2].dims.length!==1&&r[2].dims.length!==2)throw new Error("Invalid input shape of C");if(r[0].type!=="float32"&&r[0].type!=="float64"||r[1].type!=="float32"&&r[1].type!=="float64"||r.length===3&&r[2].type!=="float32"&&r[2].type!=="float64")throw new Error("Invalid input type.");if(r[0].type!==r[1].type||r.length===3&&r[0].type!==r[2].type)throw new Error("Input types are mismatched")}});var Tp,_p,_T,IT,ST,$T,AT,Ip=C(()=>{"use strict";st();Se();Tp=(r,e,n)=>(AT(e),[r.run(ST(r,e,n),e)]),_p=r=>{let e=r.attributes.getFloat("scale"),n=r.attributes.getFloats("bias");return be({scale:e,bias:n})},_T={name:"ImageScaler",inputNames:["X"],inputTypes:[0]},IT=(r,e,n,t)=>{let o=n[0].dims.slice(),i=o.length,a=`
      ${$T(t.bias.length)}
      float process(int indices[${i}]) {
        return _X(indices) * scale + getBias(bias, indices[1]);
      }`;return{...e,output:{dims:o,type:n[0].type,textureType:0},variables:[{name:"bias",type:"float",arrayLength:t.bias.length,data:t.bias},{name:"scale",type:"float",data:t.scale}],shaderSource:a}},ST=(r,e,n)=>{let t={..._T,cacheHint:n.cacheKey};return{...t,get:()=>IT(r,t,e,n)}},$T=r=>{let e=[`float getBias(float bias[${r}], int channel) {`];for(let n=0;n<r;++n)n===0?e.push(`	if (channel == ${n}) { return bias[${n}]; }`):n===r-1?e.push(`	else { return bias[${n}]; }`):e.push(`	else if (channel == ${n}) { return bias[${n}]; }`);return e.push("	}"),e.join(`
`)},AT=r=>{if(!r||r.length!==1)throw new Error("ImageScaler requires 1 input.");if(r[0].dims.length!==4)throw new Error("Invalid input shape.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.")}});var $p,Ap,Sp,PT,OT,ET,CT,kT,DT,Pp=C(()=>{"use strict";He();Se();$p=(r,e,n)=>{DT(e);let t=r.run(OT(e[0]),e);return[r.run(kT(r,e[0],n,t.dims),[e[0],t,e[1],e[2]])]},Ap=r=>r.attributes.getFloat("epsilon",1e-5),Sp={name:"InstanceNormalization_MeanAndVariance",inputNames:["X"],inputTypes:[0]},PT=(r,e)=>{let n=e.dims.slice(),t=n[1],o=n[2]*n[3],i=[n[0],t],s=`
      vec4 process(int[2] indices) {
        vec4 v = vec4(0.0);
        int a[4];
        a[0] = indices[0];
        a[1] = indices[1];
        float temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += x;
          }
        }
        float mean = temp / float(${o});
        temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += (x - mean) * (x - mean);
          }
        }
        v.r = mean;
        v.g = temp / float(${o});

        return v;
      }`;return{...r,output:{dims:i,type:e.type,textureType:4},shaderSource:s}},OT=r=>({...Sp,get:()=>PT(Sp,r)}),ET={name:"InstanceNormalization_ComputeOutput",inputNames:["X","MeanAndVariance","Scale","B"],inputTypes:[0,4,0,0]},CT=(r,e,n,t,o)=>{let i=oe(r.session.backend.glContext.version),[s,a]=r.calculateTextureWidthAndHeight(o,4),[u,l]=[s/4,a],f=`
      vec4 get_MeanAndVariance(int[2] mv) {
        int offset = indicesToOffset_MeanAndVariance(mv);
        vec2 coords = offsetToCoords(offset, ${u}, ${l});
        return ${i.texture2D}(MeanAndVariance, coords);
      }

      float process(int[4] indices) {
        int mv[2];
        mv[0] = indices[0];
        mv[1] = indices[1];
        vec4 mean_and_variance = get_MeanAndVariance(mv);
        float mean = mean_and_variance.r;
        float variance = mean_and_variance.g;

        int sb[1];
        sb[0] = indices[1];
        float scale = _Scale(sb);
        float b = _B(sb);

        return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;
      }`;return{...e,output:{dims:n.dims,type:n.type,textureType:0},variables:[{name:"epsilon",type:"float",data:t}],shaderSource:f}},kT=(r,e,n,t)=>{let o={...ET,cacheHint:`${n}`};return{...o,get:()=>CT(r,o,e,n,t)}},DT=r=>{if(!r||r.length!==3)throw new Error("InstanceNormalization requires 3 inputs.");let e=r[0],n=r[1],t=r[2];if(e.dims.length<3||n.dims.length!==1||t.dims.length!==1)throw new Error("Invalid input shape.");if(n.dims[0]!==e.dims[1]||t.dims[0]!==e.dims[1])throw new Error("Input shapes are mismatched.");if(e.type!=="float32"&&e.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||t.type!=="float32"&&t.type!=="float64")throw new Error("Invalid input type.");if(r[0].dims.length!==4)throw new Error("Only support 4-D input shape.")}});function BT(r,e){let n=r[0].dims[1],t=r[0].dims.length,o=-Math.floor((e.size-1)/2),i=Math.ceil((e.size-1)/2),s=`float(${e.alpha}) / float(${e.size})`,a=`float(${e.bias})`,u=`float(${e.beta})`,l=`
    float process(int indices[${t}]) {
        int c = indices[1];
        float x = _X(indices);
        float square_sum = 0.0;

        for (int i = ${o}; i <= ${i}; i++) {
          int idx = c + i;
          if (c >= 0 && c < ${n}) {
            indices[1] = idx;
            float j = _X(indices);
            square_sum += j * j;
          }
        }
        return x / pow(${a} + ${s} * square_sum, ${u});
    }`;return{...Cp,cacheHint:e.cacheKey,output:{dims:r[0].dims,type:r[0].type,textureType:0},shaderSource:l}}function LT(r,e){return{...Cp,cacheHint:e.cacheKey,get:()=>BT(r,e)}}var Op,Ep,Cp,RT,kp=C(()=>{"use strict";st();Se();Op=(r,e,n)=>(RT(e),[r.run(LT(e,n),e)]),Ep=r=>{let e=r.attributes.getFloat("alpha",1e-4),n=r.attributes.getFloat("beta",.75),t=r.attributes.getFloat("bias",1),o=r.attributes.getInt("size");return be({alpha:e,beta:n,bias:t,size:o})},Cp={name:"LRN",inputNames:["X"],inputTypes:[0]};RT=r=>{if(!r||r.length!==1)throw new Error("LRN requires 1 input.");if(r[0].dims.length!==4)throw new Error('currently only support LRN for input with "NCHW" format');if(r[0].type!=="float32")throw new Error("input should be float type")}});var NT,ms,Dp,Bp,Lp,zT,FT,MT,VT,GT,UT,WT,HT,Rp=C(()=>{"use strict";st();De();He();Se();NT={name:"Pad",inputNames:["A"],inputTypes:[0]},ms=(r,e,n)=>(MT(e),[r.run({...NT,cacheHint:n.cacheKey,get:()=>FT(r,e[0],n)},e)]),Dp=r=>{let e=r.attributes.getString("mode","constant"),n=r.attributes.getFloat("value",0),t=r.attributes.getInts("pads");return be({mode:e,value:n,pads:t})},Bp=(r,e,n)=>{VT(e);let t=zT(r,e,n);return ms(r,[e[0]],t)},Lp=r=>r.attributes.getString("mode","constant"),zT=(r,e,n)=>{if(!r.session.isInitializer(e[1].dataId)||e.length>=3&&!r.session.isInitializer(e[2].dataId))throw new Error("dynamic pad attributes are not allowed");let t=Array.from(e[1].integerData),o=e.length>=3?e[2].floatData[0]:0;return be({mode:n,pads:t,value:o})},FT=(r,e,n)=>{let t=J.padShape(e.dims.slice(),n.pads),o=t.length,s=`
      ${GT(r,e,n)}
      float process(int[${o}] indices) {
          return padA(indices);
      }`;return{name:"Pad",inputNames:["A"],inputTypes:[0],output:{dims:t,type:e.type,textureType:0},shaderSource:s}},MT=r=>{if(!r||r.length!==1)throw new Error("Pad requires 1 input");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.")},VT=r=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Pad requires 2 or 3 inputs");if(r[1].type!=="int32")throw new Error("Invalid input type.");if(r.length>=3&&r[2].type==="string")throw new Error("Invalid input type.")},GT=(r,e,n)=>{let t=oe(r.session.backend.glContext.version),[o,i]=r.calculateTextureWidthAndHeight(e.dims,0),s=J.computeStrides(e.dims);switch(n.mode){case"constant":return UT(t,e.dims,s,o,i,n.pads,n.value);case"reflect":return WT(t,e.dims,s,o,i,n.pads);case"edge":return HT(t,e.dims,s,o,i,n.pads);default:throw new Error("Invalid mode")}},UT=(r,e,n,t,o,i,s)=>{let a=e.length,u="";for(let l=a-1;l>=0;--l)u+=`
        k = m[${l}] - ${i[l]};
        if (k < 0)  return constant;
        if (k >= ${e[l]}) return constant;
        offset += k * ${n[l]};
        `;return`
      float padA(int m[${a}]) {
        const float constant = float(${s});
        int offset = 0;
        int k = 0;
        ${u}
        vec2 coords = offsetToCoords(offset, ${t}, ${o});
        float value = getColorAsFloat(${r.texture2D}(A, coords));
        return value;
      }
      `},WT=(r,e,n,t,o,i)=>{let s=e.length,a="";for(let u=s-1;u>=0;--u)a+=`
        k = m[${u}] - ${i[u]};
        if (k < 0) { k = -k; }
        {
          const int _2n_1 = ${2*(e[u]-1)};
          k = int( mod( float(k), float(_2n_1) ) ) ;
          if(k >= ${e[u]}) { k = _2n_1 - k; }
        }
        offset += k * ${n[u]};
        `;return`
      float padA(int m[${s}]) {
        int offset = 0;
        int k = 0;
        ${a}
        vec2 coords = offsetToCoords(offset, ${t}, ${o});
        float value = getColorAsFloat(${r.texture2D}(A, coords));
        return value;
      }
      `},HT=(r,e,n,t,o,i)=>{let s=e.length,a="";for(let u=s-1;u>=0;--u)a+=`
        k = m[${u}] - ${i[u]};
        if (k < 0)  k = 0;
        if (k >= ${e[u]}) k = ${e[u]-1};
        offset += k * ${n[u]};
      `;return`
      float padA(int m[${s}]) {
        int offset = 0;
        int k = 0;
        ${a}
        vec2 coords = offsetToCoords(offset, ${t}, ${o});
        float value = getColorAsFloat(${r.texture2D}(A, coords));
        return value;
      }
      `}});var zp,Fp,Mp,Vp,Gp,Up,Wp,Hp,qp,qT,Np,Kp,Zo,jp,Xo,KT,Xp=C(()=>{"use strict";st();De();Se();zp=(r,e,n)=>{Zo(e);let t={name:"AveragePool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[r.run({...t,get:()=>Mp(e,t,!1,n)},e)]},Fp=r=>{let e=r.attributes.getString("auto_pad","NOTSET"),n=r.attributes.getInt("ceil_mode",0),t=r.attributes.getInt("count_include_pad",0)!==0,o=r.attributes.getInts("kernel_shape"),i=r.attributes.getInts("strides",[]),s=r.attributes.getInts("pads",[]);if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");return be({autoPad:e,ceilMode:n,countIncludePad:t,kernelShape:o,strides:i,pads:s})},Mp=(r,e,n,t)=>{let[o,i]=qp(r,t,n),s=J.size(o.kernelShape),a="value += _X(x);",u="";o.countIncludePad?u+=`value /= float(${s});`:u+=`value /= float(${s} - pad);`;let f=`
        ${jp(r[0].dims,o,a,u,"0.0")}
      `;return{...e,output:{dims:i,type:r[0].type,textureType:0},shaderSource:f}},Vp=(r,e,n)=>{Zo(e);let t={name:"GlobalAveragePool",inputNames:["X"],inputTypes:[0],cacheHint:`${n.countIncludePad}`};return[r.run({...t,get:()=>Mp(e,t,!0,n)},e)]},Gp=r=>{let e=r.attributes.getInt("count_include_pad",0)!==0;return be({autoPad:"",ceilMode:0,countIncludePad:e,kernelShape:[],strides:[],pads:[]})},Up=(r,e,n)=>{Zo(e);let t={name:"MaxPool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[r.run({...t,get:()=>Hp(e,t,!1,n)},e)]},Wp=r=>{let e=r.attributes.getString("auto_pad","NOTSET"),n=r.attributes.getInt("ceil_mode",0),t=r.attributes.getInts("kernel_shape"),o=r.attributes.getInts("strides",[]),i=r.attributes.getInts("pads",[]),s=r.attributes.getInt("storage_order",0),a=r.attributes.getInts("dilations",[]);if(s!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");return be({autoPad:e,ceilMode:n,countIncludePad:!1,kernelShape:t,strides:o,pads:i,storageOrder:s,dilations:a})},Hp=(r,e,n,t)=>{let[o,i]=qp(r,t,n),s=`
      value = max(_X(x), value);
    `,a="",l=`
      ${jp(r[0].dims,o,s,a,"-1e5")}
    `;return{...e,output:{dims:i,type:r[0].type,textureType:0},shaderSource:l}},qp=(r,e,n)=>{let t=r[0].dims.slice(),o=Object.hasOwnProperty.call(e,"dilations"),i=e.kernelShape.slice(),s=e.strides.slice(),a=o?e.dilations.slice():[],u=e.pads.slice();Fr.adjustPoolAttributes(n,t,i,s,a,u);let l=Fr.computePoolOutputShape(n,t,s,a,i,u,e.autoPad),f=Object.assign({},e);return o?Object.assign(f,{kernelShape:i,strides:s,pads:u,dilations:a,cacheKey:e.cacheKey}):Object.assign(f,{kernelShape:i,strides:s,pads:u,cacheKey:e.cacheKey}),[f,l]},qT={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[],cacheKey:""},Np={name:"GlobalMaxPool",inputNames:["X"],inputTypes:[0]},Kp=(r,e)=>(Zo(e),[r.run({...Np,get:()=>Hp(e,Np,!0,qT)},e)]),Zo=r=>{if(!r||r.length!==1)throw new Error("Pool ops requires 1 input.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.")},jp=(r,e,n,t,o)=>{let i=r.length;if(e.kernelShape.length<=2){let s=e.kernelShape[e.kernelShape.length-1],a=e.strides[e.strides.length-1],u=e.pads[e.pads.length/2-1],l=e.pads[e.pads.length-1],f=r[i-1],c="",p="",b="";if(u+l!==0?c=`
          for (int i = 0; i < ${s}; i++) {
            x[${i} - 1] = indices[${i} - 1] * ${a} - ${u} + i;
            if (x[${i} - 1] < 0 || x[${i} - 1] >= ${f}) {
              pad++;
              continue;
            }
            ${n}
          }`:c=`
          for (int i = 0; i < ${s}; i++) {
            x[${i} - 1] = indices[${i} - 1] * ${a} - ${u} + i;
            ${n}
          }`,e.kernelShape.length===2){let g=e.kernelShape[e.kernelShape.length-2],T=e.strides[e.strides.length-2],w=e.pads[e.pads.length/2-2],v=e.pads[e.pads.length-2],S=r[i-2];w+v!==0?p=`
            for (int j = 0; j < ${g}; j++) {
              x[${i} - 2] = indices[${i} - 2] * ${T} - ${w} + j;
              if (x[${i} - 2] < 0 || x[${i} - 2] >= ${S}) {
                pad+= ${s};
                continue;
              }
          `:p=`
            for (int j = 0; j < ${g}; j++) {
              x[${i} - 2] = indices[${i} - 2] * ${T} - ${w} + j;
            `,b=`
          }
        `}return`
        float process(int indices[${i}]) {
          int x[${i}];
          copyVec(indices, x);

          float value = ${o};
          int pad = 0;
          ${p}
          ${c}
          ${b}
          ${t}
          return value;
        }
      `}else{let s=J.size(e.kernelShape),a=J.computeStrides(e.kernelShape),u=a.length,l=e.pads.length,f=KT(u),c=Xo(r,"inputDims"),p=Xo(e.pads,"pads"),b=Xo(a,"kernelStrides"),h=Xo(e.strides,"strides"),g=e.pads.reduce((v,S)=>v+S),T="";return g?T=`
            if (x[j] >= inputDims[j] || x[j] < 0) {
              pad++;
              isPad = true;
              break;
            }
          }
          if (!isPad) {
            ${n}
          }`:T=`
          }
          ${n}
        `,`
        ${f}
        float process(int indices[${i}]) {
          int x[${i}];
          copyVec(indices, x);
          int offset[${u}];
          int pads[${l}];
          int inputDims[${i}];
          int kernelStrides[${u}];
          int strides[${u}];
          ${p}
          ${c}
          ${h}
          ${b}

          float value = ${o};
          int pad = 0;
          bool isPad = false;
          for (int i = 0; i < ${s}; i++) {
            offsetToIndices(i, kernelStrides, offset);
            isPad = false;
            for (int j = ${i} - ${u}; j < ${i}; j++) {
              x[j] = indices[j] * strides[j - ${i} + ${u}]
                + offset[j - ${i} + ${u}] - pads[j - 2];
              ${T}
          }
          ${t}

          return value;
        }
      `}},Xo=(r,e)=>{let n="";for(let t=0;t<r.length;t++)n+=`
      ${e}[${t}] = ${r[t]};
    `;return n},KT=r=>`
  void offsetToIndices(int offset, int[${r}] strides, out int[${r}] indices) {
    if (${r} == 0) {
      return;
    }
    for (int i = 0; i < ${r} - 1; ++i) {
      indices[i] = offset / strides[i];
      offset -= indices[i] * strides[i];
    }
    indices[${r} - 1] = offset;
  }`});var qr,$r,jT,XT,Zp,Yp,Jp,Qp,em,tm,rm,nm=C(()=>{"use strict";st();Vn();De();Se();qr=(r,e,n,t,o)=>{XT(e);let i={name:t,inputNames:["A"],inputTypes:[0]};return[r.run({...i,cacheHint:n.cacheKey,get:()=>jT(r,e,n,t,o,i)},e)]},$r=r=>{let e=r.attributes.getInts("axes",[]),n=r.attributes.getInt("keepdims",1)===1;return be({axes:e,keepDims:n})},jT=(r,e,n,t,o,i)=>{let s=[],a=e[0].dims.length||1,u=[],l=J.normalizeAxes(n.axes,e[0].dims.length),f=o(e,l),c=f[1];for(let h=0;h<e[0].dims.length;h++)l.indexOf(h)>=0||l.length===0?(n.keepDims&&s.push(1),c=`
          for(int j${h} = 0; j${h} < ${e[0].dims[h]}; j${h}++) {
            inputIdx[${h}] = j${h};
            ${c}
          }`):(u.push(`inputIdx[${h}] = outputIdx[${s.length}];`),s.push(e[0].dims[h]));let b=`
      float process(int outputIdx[${s.length||1}]) {
        float value;                 // final result
        int inputIdx[${a}];      // addressing input data
        ${u.join(`
`)}
        ${f[0]}       // init ops for reduce max/min
        ${c}
        ${f[2]}       // final computation for reduce mean
        return value;
      }`;return{...i,output:{dims:s,type:e[0].type,textureType:0},shaderSource:b}},XT=r=>{if(!r||r.length!==1)throw new Error("Reduce op requires 1 input.");if(Sr.indexOf(r[0].type)===-1)throw new Error("Invalid input type.")},Zp=(r,e,n)=>qr(r,e,n,"ReduceSum",()=>["value = 0.0;","value += _A(inputIdx);",""]),Yp=(r,e,n)=>qr(r,e,n,"ReduceMean",(o,i)=>{let s=1;for(let a=0;a<o[0].dims.length;a++)(i.indexOf(a)>=0||i.length===0)&&(s*=o[0].dims[a]);return["value = 0.0;","value += _A(inputIdx);",`value /= ${s}.;`]}),Jp=(r,e,n)=>qr(r,e,n,"ReduceMax",(o,i)=>{let s=[];for(let a=0;a<o[0].dims.length;a++)(i.indexOf(a)>=0||i.length===0)&&s.push(`inputIdx[${a}] = 0;`);return[`${s.join(`
`)}
value = _A(inputIdx);`,"value = max(value, _A(inputIdx));",""]}),Qp=(r,e,n)=>qr(r,e,n,"ReduceMin",(o,i)=>{let s=[];for(let a=0;a<o[0].dims.length;a++)(i.indexOf(a)>=0||i.length===0)&&s.push(`inputIdx[${a}] = 0;`);return[`${s.join(`
`)}
value = _A(inputIdx);`,"value = min(value, _A(inputIdx));",""]}),em=(r,e,n)=>qr(r,e,n,"ReduceProd",()=>["value = 1.0;","value *= _A(inputIdx);",""]),tm=(r,e,n)=>qr(r,e,n,"ReduceLogSum",()=>["value = 0.0;","value += _A(inputIdx);","value = log(value);"]),rm=(r,e,n)=>qr(r,e,n,"ReduceLogSumSquare",()=>["float t; value = 0.0;","t = _A(inputIdx); value += t * t;",""])});var om,im=C(()=>{"use strict";De();om=(r,e)=>{let n=J.calculateReshapedDims(e[0].dims,e[1].integerData);return r.session.pack?[r.reshapePacked(e[0],n)]:[r.reshapeUnpacked(e[0],n)]}});var am,hs,sm,um,Gn,ZT,gs,Yo,bs=C(()=>{"use strict";st();He();Se();am={name:"Upsample",inputNames:["X"],inputTypes:[0]},hs=(r,e,n)=>(gs(e,n),[r.run({...am,cacheHint:n.cacheKey,get:()=>ZT(r,e,n)},e)]),sm=r=>Gn(r,7),um=r=>Gn(r,9),Gn=(r,e)=>{let n=e>=10,t=r.attributes.getString("mode","nearest");if(t!=="nearest"&&t!=="linear"&&(e<11||t!=="cubic"))throw new Error(`unrecognized mode: ${t}`);let o=[];e<9&&(o=r.attributes.getFloats("scales"),Yo(o,t,n));let i=r.attributes.getFloat("extrapolation_value",0),s=e>10?r.attributes.getString("coordinate_transformation_mode","half_pixel"):"asymmetric";if(["asymmetric","pytorch_half_pixel","tf_half_pixel_for_nn","align_corners","tf_crop_and_resize","half_pixel"].indexOf(s)===-1)throw new Error(`coordinate_transform_mode '${s}' is not supported`);let a=s==="tf_crop_and_resize",u=a,l=t==="nearest"&&e>=11?r.attributes.getString("nearest_mode","round_prefer_floor"):"";if(["round_prefer_floor","round_prefer_ceil","floor","ceil",""].indexOf(l)===-1)throw new Error(`nearest_mode '${l}' is not supported`);let f=r.attributes.getFloat("cubic_coeff_a",-.75),c=r.attributes.getInt("exclude_outside",0)!==0;if(c&&t!=="cubic")throw new Error("exclude_outside can be set to 1 only when mode is CUBIC.");let p=e<11?!0:t==="nearest"&&s==="asymmetric"&&l==="floor",b=0,h=0,g=0;return e>10?r.inputs.length>2?(b=1,h=2,g=3):(h=1,g=2):e===9&&(h=1),be({opset:e,isResize:n,mode:t,scales:o,extrapolationValue:i,coordinateTransformMode:s,useExtrapolation:u,needRoiInput:a,nearestMode:l,cubicCoefficientA:f,excludeOutside:c,useNearest2xOptimization:p,roiInputIdx:b,scalesInputIdx:h,sizesInputIdx:g})},ZT=(r,e,n)=>{let t=oe(r.session.backend.glContext.version),[o,i]=r.calculateTextureWidthAndHeight(e[0].dims,0),s=e[0].dims.map((g,T)=>Math.floor(g*n.scales[T])),[a,u]=r.calculateTextureWidthAndHeight(s,0),l=s.length,f=new Array(l),c=new Array(l),p=`
      int output_pitches[${l}];
      int input_pitches[${l}];
      `;for(let g=l-1;g>=0;g--)f[g]=g===l-1?1:f[g+1]*s[g+1],c[g]=g===l-1?1:c[g+1]*e[0].dims[g+1],p+=`
        output_pitches[${g}] = ${f[g]};
        input_pitches[${g}] = ${c[g]};
        `;let b=`
      float getInputFloat(int index) {
        vec2 coords = offsetToCoords(index, ${o}, ${i});
        float value = getColorAsFloat(${t.texture2D}(X, coords));
        return value;
      }
      `,h=n.mode==="nearest"?`
    ${b}
    float process(int indices[${l}]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${a}, ${u});

      ${p}

      int d, m;
      for (int dim = 0; dim < ${l}; ++dim) {
        d = output_index / output_pitches[dim];
        m = output_index - d * output_pitches[dim];
        output_index = m;

        if (scales[dim] != 1 && d > 0) {
          int d2 = d / scales[dim];
          m = d - d2 * scales[dim];
          d = d2;
        }
        input_index += input_pitches[dim] * d;
      }

      return getInputFloat(input_index);
    }`:l===4?`
    ${b}
    float process(int indices[4]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${a}, ${u});

      ${p}

      int m;
      int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m / output_pitches[1];
      m = m - index_of_dim1 * output_pitches[1];
      index_of_dim2 = m / output_pitches[2];
      m = m - index_of_dim2 * output_pitches[2];
      index_of_dim3 = m;

      int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;
      index_of_input_dim2 = index_of_dim2 / scales[2];
      y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];
      index_of_input_dim3 = index_of_dim3 / scales[3];
      x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];

      input_index = index_of_dim0 * input_pitches[0] +
            index_of_dim1 * input_pitches[1] +
            index_of_input_dim2 * input_pitches[2] +
            index_of_input_dim3;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim2 = false;
      if (index_of_input_dim2 == (${e[0].dims[2]} - 1)) {
        // It's the end in dimension 2
        x01 = x00;
        end_of_dim2 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[2]);
      }

      if (index_of_input_dim3 == (input_pitches[2] - 1)) {
        // It's the end in dimension 3
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);
    }`:`
    ${b}
    float process(int indices[2]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${a}, ${u});

      ${p}

      int m;
      int index_of_dim0, index_of_dim1;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m;

      int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;
      index_of_input_dim0 = index_of_dim0 / scales[0];
      y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];
      index_of_input_dim1 = index_of_dim1 / scales[1];
      x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];

      input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim0 = false;
      if (index_of_input_dim0 == (${e[0].dims[0]} - 1)) {
        // It's the end in dimension 0
        x01 = x00;
        end_of_dim0 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[0]);
      }

      if (index_of_input_dim1 == (input_pitches[0] - 1)) {
        // It's the end in dimension 1
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);
    }`;return{...am,output:{dims:s,type:e[0].type,textureType:0},shaderSource:h,variables:[{name:"scales",type:"int",arrayLength:n.scales.length,data:n.scales.map(g=>Math.ceil(g))}]}},gs=(r,e)=>{if(!r||e.opset<9&&r.length!==1||e.opset>=9&&e.opset<11&&r.length!==2||e.opset>=11&&r.length<2)throw new Error("invalid inputs.");if(e.scales.length>0&&r[0].dims.length!==e.scales.length)throw new Error("Invalid input shape.");if(r[0].type==="string")throw new Error("Invalid input tensor types.")},Yo=(r,e,n)=>{if(n){for(let t of r)if(t<=0)throw new Error("Scale value should be greater than 0.")}else for(let t of r)if(t<1)throw new Error("Scale value should be greater than or equal to 1.");if((e==="linear"||e==="cubic")&&r.length!==2&&(r.length!==4||r[0]!==1||r[1]!==1))throw new Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${n?"Resize":"Upsample"} opeartor.`)}});var ys,xs,lm,cm,YT,JT,QT,e_,fm=C(()=>{"use strict";He();Se();Qt();Ur();bs();ys={name:"Resize",inputNames:["A"],inputTypes:[2]},xs=(r,e,n)=>(gs(e,n),[r.run({...ys,cacheHint:n.cacheKey,get:()=>YT(r,e,n)},e)]),lm=r=>Gn(r,10),cm=r=>Gn(r,11),YT=(r,e,n)=>{let t=oe(r.session.backend.glContext.version),[o,i]=JT(e,n);if(o.every(S=>S===1)&&n.coordinateTransformMode!=="tf_crop_and_resize")return{...ys,output:{dims:i,type:e[0].type,textureType:2},hasMain:!0,shaderSource:`void main() {
                    vec4 v = ${t.texture2D}(X, TexCoords);
                    ${t.output} = v;
                }`};let a=i.length;if(a<2)throw new Error(`output dimension should be at least 2, but got ${a}`);let u=i[a-2],l=i[a-1],f=e[0].dims;if(a!==f.length)throw new Error(`output dimension should match input ${f.length}, but got ${a}`);let c=f[a-2],p=f[a-1],b=o[a-2],h=o[a-1],g="";if(n.mode!=="linear")throw new Error(`resize (packed) does not support mode: '${n.mode}'`);switch(n.coordinateTransformMode){case"asymmetric":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return vec4(coords) / scaleWHWH;
                    }
                `;break;case"half_pixel":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;
                    }
                `;break;case"pytorch_half_pixel":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 fcoords = vec4(coords);
                        return vec4(
                            ${l}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,
                            ${u}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,
                            ${l}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,
                            ${u}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0
                          );
                    }
                `;break;case"align_corners":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 resized = vec4(${l}.0 - 1.0, ${u}.0 - 1.0, ${l}.0 - 1.0,
                            ${u}.0 - 1.0);
                        vec4 original = vec4(${p}.0 - 1.0, ${c}.0 - 1.0, ${p}.0 - 1.0,
                            ${c}.0 - 1.0);
                        vec4 new_scale = original / resized;
                        return vec4(coords) * new_scale;
                    }
                `;break;default:throw new Error(`resize (packed) does not support coordinateTransformMode:                                 '${n.coordinateTransformMode}'`)}let T=bt(a),w=er(),v=`
            const vec2 inputWH = vec2(${c}.0, ${p}.0);
            const vec4 scaleWHWH = vec4(float(${b}), float(${h}), float(${b}), float(${h}));
            ${w}
            ${g}
            float getAValue(int x10, int r, int c, int d) {
                return getChannel(getA(x10, r, c, d), vec2(c, d));
            }
            void main() {
                ${T} rc = getOutputCoords();

                int batch = rc[0];
                int depth = rc[1];

                // retrieve the 4 coordinates that is used in the 4 packed output values.
                ivec4 coords = ivec4(rc.wz, rc.w + 1, rc.z + 1);

                // calculate the source index in fraction
                vec4 sourceFrac = getSourceFracIndex(coords);

                // get the lower and upper bound of the 4 values that will be packed into one texel.
                ivec4 x00 = ivec4(max(sourceFrac.xy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xy)));
                ivec4 x01 = ivec4(max(sourceFrac.xw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xw)));
                ivec4 x10 = ivec4(max(sourceFrac.zy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zy)));
                ivec4 x11 = ivec4(max(sourceFrac.zw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zw)));

                bool hasNextRow = rc.w < ${u-1};
                bool hasNextCol = rc.z < ${l-1};

                // pack x00, x01, x10, x11's top-left corner into one vec4 structure
                vec4 topLeft = vec4(
                    getAValue(batch, depth, x00.x, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.y) : 0.0);

                // pack x00, x01, x10, x11's top-right corner into one vec4 structure
                vec4 topRight = vec4(
                    getAValue(batch, depth, x00.x, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.w) : 0.0);

                // pack x00, x01, x10, x11's bottom-left corner into one vec4 structure
                vec4 bottomLeft = vec4(
                    getAValue(batch, depth, x00.z, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.y) : 0.0);

                // pack x00, x01, x10, x11's bottom-right corner into one vec4 structure
                vec4 bottomRight = vec4(
                    getAValue(batch, depth, x00.z, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.w) : 0.0);

                // calculate the interpolation fraction on u and v direction
                vec4 frac = vec4(sourceFrac) - floor(sourceFrac);
                vec4 clampFrac = clamp(frac, vec4(0.0), vec4(1.0));

                vec4 top = mix(topLeft, topRight, clampFrac.ywyw);
                vec4 bottom = mix(bottomLeft, bottomRight, clampFrac.ywyw);
                vec4 newValue = mix(top, bottom, clampFrac.xxzz);

                ${t.output} = vec4(newValue);
            }
        `;return{...ys,output:{dims:i,type:e[0].type,textureType:2},hasMain:!0,shaderSource:v}},JT=(r,e)=>{let t=r[0].dims,o=e.scales,i;if(o.length===0){let a=r[e.scalesInputIdx];if(a&&a.size!==0){if(r[e.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");o=QT(a,e.mode,e.isResize)}else{let u=r[e.sizesInputIdx];if(!u||u.size===0)throw new Error("Either scales or sizes MUST be provided as input.");i=Array.from(u.integerData),o=e_(i,t,e.mode,e.isResize)}}else if(r[e.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");let s=i||t.map((a,u)=>Math.floor(a*o[u]));return[o,s]},QT=(r,e,n)=>{let t=Array.from(r.floatData);return Yo(t,e,n),t},e_=(r,e,n,t)=>{let o=e.length,i=new Array(o);for(let s=0,a=o;s<a;s++)if(e[s]===0){if(r[s]!==0)throw new Error("Input dim is zero but required output dim is non-zero.");i[s]=1}else i[s]=r[s]/e[s];return Yo(i,n,t),i}});var dm,t_,pm=C(()=>{"use strict";Gr();dm=(r,e)=>(t_(e),[new Qe([e[0].dims.length],"int32",void 0,void 0,new Int32Array(e[0].dims))]),t_=r=>{if(!r||r.length!==1)throw new Error("Shape requires 1 input.")}});var vs,mm,hm,gm,r_,bm,n_,o_,ym=C(()=>{"use strict";st();Vn();De();Se();vs={name:"Slice",inputNames:["A"],inputTypes:[0]},mm=(r,e,n)=>(r_(e),[r.run({...vs,cacheHint:n.cacheKey,get:()=>gm(r,e[0],n)},e)]),hm=r=>{let e=r.attributes.getInts("starts"),n=r.attributes.getInts("ends"),t=r.attributes.getInts("axes",[]);return be({starts:e,ends:n,axes:t})},gm=(r,e,n)=>{let t=n.axes.length===0?e.dims.slice(0).map((c,p)=>p):n.axes,o=J.normalizeAxes(t,e.dims.length),i=n.starts.map((c,p)=>c>e.dims[o[p]]-1?e.dims[o[p]]:J.normalizeAxis(c,e.dims[o[p]])),s=n.ends.map((c,p)=>c>e.dims[o[p]]-1?e.dims[o[p]]:J.normalizeAxis(c,e.dims[o[p]])),a=e.dims.slice(),u=[];for(let c=0;c<o.length;c++)a[o[c]]=s[c]-i[c],i[c]>0&&u.push(`outputIdx[${o[c]}] += ${i[c]};`);let f=`
      float process(int outputIdx[${a.length}]) {
        ${u.join(`
      `)}
        return _A(outputIdx);
      }`;return{...vs,output:{dims:a,type:e.type,textureType:0},shaderSource:f}},r_=r=>{if(!r||r.length!==1)throw new Error("Slice requires 1 input.");if(Sr.indexOf(r[0].type)===-1)throw new Error("Invalid input type.")},bm=(r,e)=>{o_(e);let n=n_(r,e);return[r.run({...vs,cacheHint:n.cacheKey,get:()=>gm(r,e[0],n)},[e[0]])]},n_=(r,e)=>{if(!r.session.isInitializer(e[1].dataId)||!r.session.isInitializer(e[2].dataId)||e.length>=4&&!r.session.isInitializer(e[3].dataId)||e.length>=5&&!r.session.isInitializer(e[4].dataId))throw new Error("dynamic slice attributes are not allowed");if(e.length>=5&&e[4].integerData.some(s=>s!==1))throw new Error("currently non-1 steps is not supported for Slice");let n=Array.from(e[1].integerData),t=Array.from(e[2].integerData),o=e.length>=4?Array.from(e[3].integerData):[],i=`${o};${n};${t}`;return{starts:n,ends:t,axes:o,cacheKey:i}},o_=r=>{if(!r||r.length<3||r.length>5)throw new Error("Invalid input number.");if(r[1].type!=="int32"||r[1].dims.length!==1)throw new Error("Invalid input type.");if(r[2].type!=="int32"||r[2].dims.length!==1)throw new Error("Invalid input type.");if(r.length>=4&&(r[3].type!=="int32"||r[3].dims.length!==1))throw new Error("Invalid input type.");if(r.length>=5&&(r[4].type!=="int32"||r[4].dims.length!==1))throw new Error("Invalid input type.")}});var xm,vm,wm,Tm,_m,Im,Sm,$m,i_,a_,s_,Am,Pm=C(()=>{"use strict";st();De();He();Se();jo();xm={name:"SoftmaxComputeMax",inputNames:["A"],inputTypes:[0]},vm={name:"SoftmaxComputeScale",inputNames:["A","Max"],inputTypes:[0,0]},wm={name:"SoftMax",inputNames:["A","Max","Norm"],inputTypes:[0,0,0]},Tm=(r,e,n)=>{Am(e);let t=e[0].dims.slice(),o=J.normalizeAxis(n.axis,t.length),i=J.sizeToDimension(t,o),s=J.sizeFromDimension(t,o);return $m(r,e,n,i,s)},_m=r=>be({axis:r.attributes.getInt("axis",1)}),Im=r=>be({axis:r.attributes.getInt("axis",-1)}),Sm=(r,e,n)=>{Am(e);let t=e[0].dims.slice(),o=J.normalizeAxis(n.axis,t.length),i=t.length,s=o!==i-1,a=[],u=[],l=[],f;s&&(u=Array.from({length:i}).map((h,g)=>g),u[o]=i-1,u[i-1]=o,u.map(h=>a.push(t[h])),f=be({perm:u}),l=Hr(r,e,f));let c=s?J.sizeToDimension(a,i-1):J.sizeToDimension(t,i-1),p=s?J.sizeFromDimension(a,i-1):J.sizeFromDimension(t,i-1),b=$m(r,s?l:e,n,c,p);return s?Hr(r,b,f):b},$m=(r,e,n,t,o)=>{let i=i_(r,e[0],t,o,[t]),s=r.run({...xm,cacheHint:n.cacheKey,get:()=>i},e),a=a_(r,e[0],t,o,i.output.dims,[t]),u=r.run({...vm,cacheHint:n.cacheKey,get:()=>a},[e[0],s]),l=s_(r,e[0],t,o,i.output.dims,a.output.dims);return[r.run({...wm,cacheHint:n.cacheKey,get:()=>l},[e[0],s,u])]},i_=(r,e,n,t,o)=>{let[i,s]=r.calculateTextureWidthAndHeight(e.dims,0),a=o.length;if(n<1||t<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(o.length!==1)throw new Error("Dimensionality of the output should be 1");if(o[0]!==n)throw new Error("Shape of the output should be equal to logical row count");let u=oe(r.session.backend.glContext.version),l=`
      float process(int[${a}] indices) {
        int logical_row_start_offset = indices[0] * ${t};

        float max = getColorAsFloat(${u.texture2D}(A, offsetToCoords(logical_row_start_offset, ${i},
        ${s} )));
        for(int i=1; i<${t}; ++i)
        {
          float current = getColorAsFloat(${u.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${i}, ${s})));
          if(current > max)
          max = current;
        }

        return max;
      }`;return{...xm,output:{dims:o,type:e.type,textureType:0},shaderSource:l}},a_=(r,e,n,t,o,i)=>{let[s,a]=r.calculateTextureWidthAndHeight(e.dims,0),u=i.length;if(n<1||t<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(i.length!==1)throw new Error("Dimensionality of the output should be 1");if(i[0]!==n)throw new Error("Shape of the output should be equal to logical row count");if(o.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(o[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let l=oe(r.session.backend.glContext.version),f=`
      float process(int[${u}] indices) {
        int logical_row_start_offset = indices[0] * ${t};

        float norm_factor = 0.0;
        float max = _Max(indices);
        for(int i=0; i<${t}; ++i)
        {
          norm_factor += exp(getColorAsFloat(${l.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${s}, ${a}))) - max);
        }

        return norm_factor;
      }`;return{...vm,output:{dims:i,type:e.type,textureType:0},shaderSource:f}},s_=(r,e,n,t,o,i)=>{let[s,a]=r.calculateTextureWidthAndHeight(e.dims,0),u=e.dims.length;if(n<1||t<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(o.length!==1||i.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(o[0]!==n||i[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let l=`
      float process(int[${u}] indices) {

      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)
      int offset = coordsToOffset(TexCoords, ${s}, ${a});

      //determine the logical row for this index
      int logical_row_index[1];
      logical_row_index[0] = offset / ${t};

      float norm_factor = _Norm(logical_row_index);

      // avoid possible division by 0
      // if norm_facor is 0, all elements are zero
      // if so, return 0
      if(norm_factor == 0.0)
        return 0.0;

      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;
    }`;return{...wm,output:{dims:e.dims,type:e.type,textureType:0},shaderSource:l}},Am=r=>{if(!r||r.length!==1)throw new Error("Softmax requires 1 input.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type")}});var Om,Em,Cm,u_,l_,c_,km=C(()=>{"use strict";st();De();Se();Om={name:"Split",inputNames:["A"],inputTypes:[0]},Em=(r,e,n)=>{c_(e);let t=J.normalizeAxis(n.axis,e[0].dims.length),o=u_(r,e,t,n),i=[];for(let s=0;s<o;++s)i.push(r.run({...Om,cacheHint:`${n.cacheKey};${s}`,get:()=>l_(r,e[0],n,t,s)},e));return i},Cm=r=>{let e=r.attributes.getInt("axis",0),n=r.attributes.getInts("split",[]),t=r.outputs.length;return be({axis:e,split:n,numOutputs:t})},u_=(r,e,n,t)=>{let[,o]=Ln.splitShape(e[0].dims,n,t.split,t.numOutputs);return o.length},l_=(r,e,n,t,o)=>{let[i,s]=Ln.splitShape(e.dims,t,n.split,n.numOutputs),a=s[o],u=i[o],f=`
      float process(int indices[${u.length}]) {
        indices[${t}] += ${a};
        return _A(indices);
      }
    `;return{...Om,cacheHint:`${n.cacheKey}:${o}`,output:{dims:u,type:e.type,textureType:0},shaderSource:f}},c_=r=>{if(!r||r.length!==1)throw new Error("Split requires one input.");if(r[0].type!=="int8"&&r[0].type!=="uint8"&&r[0].type!=="int16"&&r[0].type!=="uint16"&&r[0].type!=="int32"&&r[0].type!=="uint32"&&r[0].type!=="float32"&&r[0].type!=="float64"&&r[0].type!=="bool")throw new Error("Invalid input type.")}});var ws,Dm,Bm,f_,d_,Lm=C(()=>{"use strict";De();ws=(r,e,n)=>{f_(e);let t=J.squeezeShape(e[0].dims,n);return[r.reshapeUnpacked(e[0],t)]},Dm=(r,e)=>(d_(e),ws(r,[e[0]],Array.from(e[1].integerData))),Bm=r=>r.attributes.getInts("axes"),f_=r=>{if(!r||r.length!==1)throw new Error("Squeeze requires 1 input.");if(r[0].type==="string")throw new Error("invalid input tensor types.")},d_=r=>{if(!r||r.length!==2)throw new Error("Squeeze requires 2 inputs.");if(r[1].type!=="int32")throw new Error("Invalid input type.")}});var Rm,p_,m_,Nm=C(()=>{"use strict";He();Se();Rm=(r,e)=>{m_(e);let n={name:"Sum",inputNames:e.map((o,i)=>`X${i}`),inputTypes:new Array(e.length).fill(0)};return[r.run({...n,get:()=>p_(r,e,n)},e)]},p_=(r,e,n)=>{let t=oe(r.session.backend.glContext.version),o=e[0].dims.slice(),s=`
      void main() {
        vec4 result = ${e.map((a,u)=>`${t.texture2D}(X${u},TexCoords)`).join(" + ")};
        ${t.output} = result;
      }
    `;return{...n,output:{dims:o,type:e[0].type,textureType:0},hasMain:!0,shaderSource:s}},m_=r=>{if(!r||r.length===0)throw new Error("Sum requires inputs.");let e=r[0].dims.length;for(let n=1;n<r.length;n++){if(e!==r[n].dims.length)throw new Error("Input shapes are mismatched.");for(let t=0;t<e;t++)if(r[0].dims[t]!==r[n].dims[t])throw new Error("Input shapes are not matched.")}if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.");for(let n=1;n<r.length;n++)if(r[0].type!==r[n].type)throw new Error("Input types are not matched.")}});var zm,h_,g_,Fm=C(()=>{"use strict";Vn();Se();zm=(r,e)=>{g_(e);let n={name:"Tile",inputNames:["A"],inputTypes:[0]};return[r.run({...n,get:()=>h_(r,e,n)},e)]},h_=(r,e,n)=>{let t=e[0].dims.slice(),o=new Array(t.length),i=[];for(let u=0;u<t.length;u++)o[u]=t[u]*e[1].numberData[u],i.push(`inputIdx[${u}] = int(mod(float(outputIdx[${u}]), ${t[u]}.));`);let s=o.length,a=`
      float process(int outputIdx[${s}]) {
        int inputIdx[${s}];
        ${i.join(`
`)}
        return _A(inputIdx);
      }
    `;return{...n,output:{dims:o,type:e[0].type,textureType:0},shaderSource:a}},g_=r=>{if(!r||r.length!==2)throw new Error("Tile requires 2 input.");if(r[1].dims.length!==1)throw new Error("The second input shape must 1 dimension.");if(r[1].dims[0]!==r[0].dims.length)throw new Error("Invalid input shape.");if(Sr.indexOf(r[0].type)===-1)throw new Error("Invalid input type.");if(r[1].type!=="int32"&&r[1].type!=="int16")throw new Error("Invalid repeat type.")}});var Ts,Mm,Vm,b_,y_,Gm=C(()=>{"use strict";De();Ts=(r,e,n)=>{b_(e);let t=J.unsqueezeShape(e[0].dims,n);return[r.reshapeUnpacked(e[0],t)]},Mm=(r,e)=>(y_(e),Ts(r,[e[0]],Array.from(e[1].integerData))),Vm=r=>r.attributes.getInts("axes"),b_=r=>{if(!r||r.length!==1)throw new Error("Unsqueeze requires 1 input.");if(r[0].type==="string")throw new Error("invalid input tensor types.")},y_=r=>{if(!r||r.length!==2)throw new Error("Unsqueeze requires 2 inputs.");if(r[1].type!=="int32")throw new Error("Invalid input type.")}});var Um,Wm=C(()=>{"use strict";ed();pd();gd();Td();Ho();ip();fp();mp();bp();wp();Ip();Pp();kp();qo();Rp();Xp();nm();im();fm();pm();ym();Pm();km();Lm();Nm();Fm();jo();is();Gm();bs();Um=[["Abs","","6+",_d],["Acos","","7+",Id],["Add","","7+",td],["And","","7+",rd],["Asin","","7+",Sd],["Atan","","7+",$d],["AveragePool","","7+",zp,Fp],["BatchNormalization","","7+",Jf,Qf],["Cast","","6+",md,hd],["Ceil","","6+",Od],["Clip","","6-10",ns,Ad],["Clip","","11+",Pd],["Concat","","4+",xd,wd],["Conv","","1+",fs,ds],["ConvTranspose","","1+",np,op],["Cos","","7+",Ed],["Div","","7+",nd],["Dropout","","7+",os],["DepthToSpace","","1+",lp,cp],["Equal","","7+",od],["Elu","","6+",Cd,kd],["Exp","","6+",Dd],["Flatten","","1+",dp,pp],["Floor","","6+",Bd],["FusedConv","com.microsoft","1+",fs,ds],["Gather","","1+",hp,gp],["Gemm","","7-10",ps,xp],["Gemm","","11+",ps,vp],["GlobalAveragePool","","1+",Vp,Gp],["GlobalMaxPool","","1+",Kp],["Greater","","7+",id],["Identity","","1+",os],["ImageScaler","","1+",Tp,_p],["InstanceNormalization","","6+",$p,Ap],["LeakyRelu","","6+",Ld,Rd],["Less","","7+",ad],["LRN","","1+",Op,Ep],["Log","","6+",Nd],["MatMul","","1+",Zd,Yd],["MaxPool","","1+",Up,Wp],["Mul","","7+",sd],["Neg","","6+",zd],["Not","","1+",Fd],["Or","","7+",ud],["Pad","","2-10",ms,Dp],["Pad","","11+",Bp,Lp],["Pow","","7+",ld],["PRelu","","7+",cd],["ReduceLogSum","","1+",tm,$r],["ReduceMax","","1+",Jp,$r],["ReduceMean","","1+",Yp,$r],["ReduceMin","","1+",Qp,$r],["ReduceProd","","1+",em,$r],["ReduceSum","","1-12",Zp,$r],["ReduceSumSquare","","1+",rm,$r],["Relu","","6+",Md],["Reshape","","5+",om],["Resize","","10",xs,lm],["Resize","","11+",xs,cm],["Shape","","1+",dm],["Sigmoid","","6+",Vd],["Sin","","7+",Gd],["Slice","","10+",bm],["Slice","","1-9",mm,hm],["Softmax","","1-12",Tm,_m],["Softmax","","13+",Sm,Im],["Split","","2-12",Em,Cm],["Sqrt","","6+",Ud],["Squeeze","","1-12",ws,Bm],["Squeeze","","13+",Dm],["Sub","","7+",fd],["Sum","","6+",Rm],["Tan","","7+",Wd],["Tanh","","6+",Hd],["Tile","","6+",zm],["Transpose","","1+",Hr,sp],["Upsample","","7-8",hs,sm],["Upsample","","9",hs,um],["Unsqueeze","","1-12",Ts,Vm],["Unsqueeze","","13+",Mm],["Xor","","7+",dd]]});function qm(r){let e={},n;for(;(n=Hm.exec(r))!==null;){let t=n[3].split(",").map(o=>{let i=o.trim().split(" ");return i&&i.length===2?{type:i[0],name:i[1]}:null}).filter(o=>o!==null);e[n[2]]={params:t,body:n[4]}}for(let t in e){let o=x_.replace("__FUNC__",t),i=new RegExp(o,"gm");for(;(n=i.exec(r))!==null;){let s=n[1],a=n[2],u=n[3].split(","),l=s?`${s} ${a};`:"",f=e[t].body,c="";e[t].params.forEach((b,h)=>{b&&(c+=`${b.type} ${b.name} = ${u[h]};
`)}),f=`${c}
 ${f}`,f=f.replace("return",`${a} = `);let p=`
      ${l}
      {
        ${f}
      }
      `;r=r.replace(n[0],p)}}return r=r.replace(Hm,""),r}var Hm,x_,Km=C(()=>{"use strict";Hm=/@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm,x_="(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;"});function xn(r,e){let n=[],t=[],o=e!=null&&Array.isArray(e)&&e.length===0,i=e==null||o?null:v_(e,r).sort(),s=0;for(let a=0;a<r.length;++a){if(i!=null){if(i[s]===a&&r[a]!==1)throw new Error(`Can't squeeze axis ${a} since its dim '${r[a]}' is not 1`);(i[s]==null||i[s]>a)&&r[a]===1&&(n.push(r[a]),t.push(a)),i[s]<=a&&s++}r[a]!==1&&(n.push(r[a]),t.push(a))}return{newShape:n,keptDims:t}}function v_(r,e){let n=e.length;return r=r==null?e.map((t,o)=>o):[].concat(r),pn(r.every(t=>t>=-n&&t<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${r}`),pn(r.every(w_),()=>`All values in axis param must be integers but got axis ${r}`),r.map(t=>t<0?n+t:t)}function w_(r){return r%1===0}function T_(r){if(r.length===0)return 1;let e=r[0];for(let n=1;n<r.length;n++)e*=r[n];return e}function jm(r){let e=Math.ceil(Math.sqrt(r));return[e,Math.ceil(r/e)]}var Jo,_s=C(()=>{"use strict";Pt();De();Jo=class{constructor(e){this.maxTextureSize=e}computeTextureWH(e,n){let t=this.computeTexture(e,n);return n&&n.isPacked&&(t[0]/=2,t[1]/=2),n&&n.reverseWH?[t[1],t[0]]:t}computeTexture(e,n){let t=n&&n.isPacked;if(e.length===0)return t?[2,2]:[1,1];let o=this.maxTextureSize;if(n&&n.breakAxis!==void 0){let a=n.breakAxis>=e.length?1:e.slice(n.breakAxis).reduce((l,f)=>l*f),u=n.breakAxis<=0?1:e.slice(0,n.breakAxis).reduce((l,f)=>l*f);if(a>o||u>o)Re.verbose("TextureLayout",`Given width/height preferences were unattainable: shape:${e}, breakAxis:${n.breakAxis}`);else return[a,u]}let i=e.slice(0);t&&(o=o*2,i=i.map((a,u)=>u>=i.length-2?i[u]%2===0?i[u]:i[u]+1:i[u]),i.length===1&&(i=[2,i[0]])),i.length!==2&&(i=xn(i).newShape);let s=T_(i);return i.length<=1&&s<=o?[1,s]:i.length===2&&i[0]<=o&&i[1]<=o?i:i.length===3&&i[0]*i[1]<=o&&i[2]<=o?[i[0]*i[1],i[2]]:i.length===3&&i[0]<=o&&i[1]*i[2]<=o?[i[0],i[1]*i[2]]:i.length===4&&i[0]*i[1]*i[2]<=o&&i[3]<=o?[i[0]*i[1]*i[2],i[3]]:i.length===4&&i[0]<=o&&i[1]*i[2]*i[3]<=o?[i[0],i[1]*i[2]*i[3]]:t?jm(s/4).map(a=>a*2):jm(s)}}});var Qo,Xm=C(()=>{"use strict";De();pr();He();_s();Qt();Qo=class extends kt{constructor(n){super(n)}getFunctions(){return{...this.offsetToCoords(),...this.coordsToOffset(),...this.toVec(),...this.valueFrom(),...this.getCommonUtilFuncs(),...this.getInputsSamplingSnippets(),...this.getOutputSamplingSnippet()}}getCustomTypes(){return{}}offsetToCoords(){let n="offsetToCoords";return{offsetToCoords:new X(`
      vec2 ${n}(int offset, int width, int height) {
        int t = offset / width;
        int s = offset - t*width;
        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);
        return coords;
      }
      `)}}coordsToOffset(){let n="coordsToOffset";return{coordsToOffset:new X(`
      int ${n}(vec2 coords, int width, int height) {
        float s = coords.s * float(width);
        float t = coords.t * float(height);
        int offset = int(t) * width + int(s);
        return offset;
      }
      `)}}getOutputSamplingSnippet(){let n=this.context.outputTextureLayout;return n.isPacked?this.getPackedOutputSamplingSnippet(n):this.getUnpackedOutputSamplingSnippet(n)}getPackedOutputSamplingSnippet(n){let t=n.unpackedShape,o=[n.width,n.height],i={},s="getOutputCoords";switch(t.length){case 0:i[s]=this.getOutputScalarCoords();break;case 1:i[s]=this.getOutputPacked1DCoords(t,o);break;case 2:i[s]=this.getOutputPacked2DCoords(t,o);break;case 3:i[s]=this.getOutputPacked3DCoords(t,o);break;default:i[s]=this.getOutputPackedNDCoords(t,o)}let u=`
      void setOutput(vec4 val) {
        ${oe(this.context.glContext.version).output} = val;
      }
    `,l="floatTextureSetRGBA";return i[l]=new X(u),i}getUnpackedOutputSamplingSnippet(n){let t=n.unpackedShape,o=[n.width,n.height],i={},s="getOutputCoords";switch(t.length){case 0:i[s]=this.getOutputScalarCoords();break;case 1:i[s]=this.getOutputUnpacked1DCoords(t,o);break;case 2:i[s]=this.getOutputUnpacked2DCoords(t,o);break;case 3:i[s]=this.getOutputUnpacked3DCoords(t,o);break;case 4:i[s]=this.getOutputUnpacked4DCoords(t,o);break;case 5:i[s]=this.getOutputUnpacked5DCoords(t,o);break;case 6:i[s]=this.getOutputUnpacked6DCoords(t,o);break;default:throw new Error(`Unsupported output dimensionality: ${t.length}`)}let u=`
        void setOutput(float val) {
          ${oe(this.context.glContext.version).output} = vec4(val, 0, 0, 0);
        }
    `,l="floatTextureSetR";return i[l]=new X(u),i}getOutputScalarCoords(){return new X(`
      int getOutputCoords() {
        return 0;
      }
    `)}getOutputPacked1DCoords(n,t){let o=t,i="";return o[0]===1?(i=`
          int getOutputCoords() {
            return 2 * int(TexCoords.y * ${o[1]}.0);
          }
        `,new X(i)):o[1]===1?(i=`
          int getOutputCoords() {
            return 2 * int(TexCoords.x * ${o[0]}.0);
          }
        `,new X(i)):(i=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                 vec2(${o[0]}, ${o[1]}));
          return 2 * (resTexRC.y * ${o[0]} + resTexRC.x);
        }
      `,new X(i))}getOutputPacked2DCoords(n,t){let o="";if(zr.arraysEqual(n,t))return o=`
        ivec2 getOutputCoords() {
          return 2 * ivec2(TexCoords.xy * vec2(${t[0]}, ${t[1]}));
        }
      `,new X(o);let i=t,s=Math.ceil(n[1]/2);return o=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${i[0]}, ${i[1]}));

          int index = resTexRC.y * ${i[0]} + resTexRC.x;

          // reverse r and c order for packed texture
          int r = imod(index, ${s}) * 2;
          int c = 2 * (index / ${s});

          return ivec2(r, c);
        }
      `,new X(o)}getOutputPacked3DCoords(n,t){let o=[t[0],t[1]],i=Math.ceil(n[2]/2),s=i*Math.ceil(n[1]/2),a=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${o[0]}, ${o[1]}));
          int index = resTexRC.y * ${o[0]} + resTexRC.x;

          int b = index / ${s};
          index -= b * ${s};

          // reverse r and c order for packed texture
          int r = imod(index, ${i}) * 2;
          int c = 2 * (index / ${i});

          return ivec3(b, r, c);
        }
      `;return new X(a)}getOutputPackedNDCoords(n,t){let o=[t[0],t[1]],i=Math.ceil(n[n.length-1]/2),s=i*Math.ceil(n[n.length-2]/2),a=s,u="",l="b, r, c";for(let c=2;c<n.length-1;c++)a*=n[n.length-c-1],u=`
      int b${c} = index / ${a};
      index -= b${c} * ${a};
    `+u,l=`b${c}, `+l;let f=`
      ivec${n.length} getOutputCoords() {
        ivec2 resTexRC = ivec2(TexCoords.xy *
                              vec2(${o[0]}, ${o[1]}));
        int index = resTexRC.y * ${o[0]} + resTexRC.x;

        ${u}

        int b = index / ${s};
        index -= b * ${s};

        // reverse r and c order for packed texture
        int r = imod(index, ${i}) * 2;
        int c = 2 * (index / ${i});

        return ivec${n.length}(${l});
      }
    `;return new X(f)}getOutputUnpacked1DCoords(n,t){let o=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          return resTexRC.y * ${t[0]} + resTexRC.x;
        }
      `;return new X(o)}getOutputUnpacked2DCoords(n,t){let o=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          int r = index / ${n[1]};
          int c = index - r * ${n[1]};
          return ivec2(r, c);
        }
      `;return new X(o)}getOutputUnpacked3DCoords(n,t){let o="",i=n.length,s=null;i<2&&(s=[]),s=new Array(i-1),s[i-2]=n[i-1];for(let l=i-3;l>=0;--l)s[l]=s[l+1]*n[l+1];let a=["r","c","d"],u=s.map((l,f)=>{let c=`int ${a[f]} = index / ${l}`,p=f===s.length-1?`int ${a[f+1]} = index - ${a[f]} * ${l}`:`index -= ${a[f]} * ${l}`;return`${c}; ${p};`}).join("");return o=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${u}
          return ivec3(r, c, d);
        }
      `,new X(o)}getOutputUnpacked4DCoords(n,t){let o="",i=n.length,s=null;i<2&&(s=[]),s=new Array(i-1),s[i-2]=n[i-1];for(let l=i-3;l>=0;--l)s[l]=s[l+1]*n[l+1];let a=["r","c","d","d2"],u=s.map((l,f)=>{let c=`int ${a[f]} = index / ${l}`,p=f===s.length-1?`int ${a[f+1]} = index - ${a[f]} * ${l}`:`index -= ${a[f]} * ${l}`;return`${c}; ${p};`}).join("");return o=`
      ivec4 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${u}
          return ivec4(r, c, d, d2);
        }
      `,new X(o)}getOutputUnpacked5DCoords(n,t){let o="",i=n.length,s=null;i<2&&(s=[]),s=new Array(i-1),s[i-2]=n[i-1];for(let l=i-3;l>=0;--l)s[l]=s[l+1]*n[l+1];let a=["r","c","d","d2","d3"],u=s.map((l,f)=>{let c=`int ${a[f]} = index / ${l}`,p=f===s.length-1?`int ${a[f+1]} = index - ${a[f]} * ${l}`:`index -= ${a[f]} * ${l}`;return`${c}; ${p};`}).join("");return o=`
      ivec5 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${u}
          return ivec5(r, c, d, d2, d3);
        }
      `,new X(o)}getOutputUnpacked6DCoords(n,t){let o="",i=n.length,s=null;i<2&&(s=[]),s=new Array(i-1),s[i-2]=n[i-1];for(let l=i-3;l>=0;--l)s[l]=s[l+1]*n[l+1];let a=["r","c","d","d2","d3","d4"],u=s.map((l,f)=>{let c=`int ${a[f]} = index / ${l}`,p=f===s.length-1?`int ${a[f+1]} = index - ${a[f]} * ${l}`:`index -= ${a[f]} * ${l}`;return`${c}; ${p};`}).join("");return o=`
     ivec6 getOutputCoords() {
         ivec2 resTexRC = ivec2(TexCoords.xy *
                               vec2(${t[0]}, ${t[1]}));
         int index = resTexRC.y * ${t[0]} + resTexRC.x;
         ${u}
         return ivec6(r, c, d, d2, d3, d4);
       }
     `,new X(o)}getCommonUtilFuncs(){let n={},t="uvFromFlat";n[t]=new X(`
    vec2 uvFromFlat(int texNumR, int texNumC, int index) {
      int texC = index / texNumR;
      int texR = index - texC * texNumR;
      // TODO: swap texR, texC order in following function so row is corresponding to u and column is corresponding to
      //       v.
      return (vec2(texR, texC) + halfCR) / vec2(texNumR, texNumC);
    }
    `),t="packedUVfrom1D",n[t]=new X(`
      vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
        int texelIndex = index / 2;
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="packedUVfrom2D",n[t]=new X(`
      vec2 packedUVfrom2D(int texNumR, int texNumC, int texelsInLogicalRow, int row, int col) {
        int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="packedUVfrom3D",n[t]=new X(`
      vec2 packedUVfrom3D(int texNumR, int texNumC,
          int texelsInBatch, int texelsInLogicalRow, int b,
          int row, int col) {
        int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = index / texNumC;
        int texC = index - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="sampleTexture";let o=oe(this.context.glContext.version);return n[t]=new X(`
        float sampleTexture(sampler2D textureSampler, vec2 uv) {
            return ${o.texture2D}(textureSampler, uv).r;
        }`),n}getInputsSamplingSnippets(){let n={},t=this.context.outputTextureLayout;return this.context.programInfo.inputNames.forEach((o,i)=>{let s=this.context.inputTextureLayouts[i],a=zo(o);s.isPacked?n[a]=this.getPackedSamplerFromInput(a,o,s):n[a]=this.getUnpackedSamplerFromInput(a,o,s);let u=Rf(o);s.unpackedShape.length<=t.unpackedShape.length&&(s.isPacked?n[u]=this.getPackedSamplerAtOutputCoords(u,s,t,o):n[u]=this.getUnpackedSamplerAtOutputCoords(u,s,t,o))}),n}getPackedSamplerAtOutputCoords(n,t,o,i){let s=t.unpackedShape,a=o.unpackedShape,l=zo(i),f=s.length,c=a.length,p=gt.getBroadcastDims(s,a),b=bt(c),h=c-f,g,T=Gt();f===0?g="":c<2&&p.length>=1?g="coords = 0;":g=p.map(q=>`coords.${T[q+h]} = 0;`).join(`
`);let w="";c<2&&f>0?w="coords":w=s.map((q,K)=>`coords.${T[K+h]}`).join(", ");let v="return outputValue;",$=J.size(s)===1,E=J.size(a)===1;if(f===1&&!$&&!E)v=`
        return vec4(outputValue.xy, outputValue.xy);
      `;else if($&&!E)c===1?v=`
          return vec4(outputValue.x, outputValue.x, 0., 0.);
        `:v=`
          return vec4(outputValue.x);
        `;else if(p.length){let q=f-2,K=f-1;p.indexOf(q)>-1&&p.indexOf(K)>-1?v="return vec4(outputValue.x);":p.indexOf(q)>-1?v="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":p.indexOf(K)>-1&&(v="return vec4(outputValue.xx, outputValue.zz);")}let N=`
        int lastDim = coords.${T[c-1]};
        coords.${T[c-1]} = coords.${T[c-2]};
        coords.${T[c-2]} = lastDim;
      `,z=`
      vec4 ${n}() {
        ${b} coords = getOutputCoords();
        ${N}
        ${g}
        vec4 outputValue = ${l}(${w});
        ${v}
      }
    `;return new X(z,["coordinates.getOutputCoords"])}getUnpackedSamplerAtOutputCoords(n,t,o,i){let s=[o.width,o.height],a=[t.width,t.height],u=t.unpackedShape.length,l=o.unpackedShape.length,f=t.unpackedShape,c=o.unpackedShape,p=zo(i);if(u===l&&zr.arraysEqual(a,s)){let $=`
          float ${n}() {
            return sampleTexture(${i}, TexCoords);
          }
        `;return new X($,["coordinates.sampleTexture"])}let b=bt(l),h=gt.getBroadcastDims(f,c),g=l-u,T,w=Gt();u===0?T="":l<2&&h.length>=1?T="coords = 0;":T=h.map($=>`coords.${w[$+g]} = 0;`).join(`
`);let v="";l<2&&u>0?v="coords":v=t.unpackedShape.map(($,P)=>`coords.${w[P+g]}`).join(", ");let S=`
        float ${n}() {
          ${b} coords = getOutputCoords();
          ${T}
          return ${p}(${v});
        }
      `;return new X(S,["coordinates.getOutputCoords"])}getPackedSamplerFromInput(n,t,o){switch(o.unpackedShape.length){case 0:return this.getPackedSamplerScalar(n,t);case 1:return this.getPackedSampler1D(n,t,o);case 2:return this.getPackedSampler2D(n,t,o);case 3:return this.getPackedSampler3D(n,t,o);default:return this.getPackedSamplerND(n,t,o)}}getUnpackedSamplerFromInput(n,t,o){let i=o.unpackedShape;switch(i.length){case 0:return this.getUnpackedSamplerScalar(n,t,o);case 1:return this.getUnpackedSampler1D(n,t,o);case 2:return this.getUnpackedSampler2D(n,t,o);case 3:return this.getUnpackedSampler3D(n,t,o);case 4:return this.getUnpackedSampler4D(n,t,o);case 5:return this.getUnpackedSampler5D(n,t,o);case 6:return this.getUnpackedSampler6D(n,t,o);default:throw new Error(`Unsupported dimension ${i.length}-D`)}}getPackedSamplerScalar(n,t){let o=oe(this.context.glContext.version),i=`
          vec4 ${n}() {
            return ${o.texture2D}(${t}, halfCR);
          }
        `;return new X(i)}getPackedSampler1D(n,t,o){let i=[o.width,o.height],s=[i[1],i[0]],a=oe(this.context.glContext.version),l=`vec4 ${n}(int index) {
      vec2 uv = packedUVfrom1D(
      ${s[0]}, ${s[1]}, index);
      return ${a.texture2D}(${t}, uv);
    }`;return new X(l,["coordinates.packedUVfrom1D"])}getPackedSampler2D(n,t,o){let i=o.unpackedShape,s=[o.width,o.height],a=oe(this.context.glContext.version),u=s[0],l=s[1];if(s!=null&&zr.arraysEqual(i,s)){let h=`vec4 ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${l}.0, ${u}.0);
        return ${a.texture2D}(${t}, uv);
      }`;return new X(h)}let f=s,c=Math.ceil(i[1]/2),b=`vec4 ${n}(int row, int col) {
      vec2 uv = packedUVfrom2D(${f[1]}, ${f[0]}, ${c}, row, col);
      return ${a.texture2D}(${t}, uv);
    }`;return new X(b,["coordinates.packedUVfrom2D"])}getPackedSampler3D(n,t,o){let i=o.unpackedShape,s=[o.width,o.height],a=[s[0],s[1]],u=oe(this.context.glContext.version);if(i[0]===1){let g=i.slice(1),T=[1,2],w=mn(i,g),v=["b","row","col"],S=JSON.parse(JSON.stringify(o));S.unpackedShape=w;let $=this.getPackedSamplerFromInput(n,t,S),E=`${$.routineBody}
      vec4 ${n}(int b, int row, int col) {
        return ${n}(${hn(v,T)});
      } `;return new X(E,$.dependencies)}let l=a[0],f=a[1],c=Math.ceil(i[2]/2),p=c*Math.ceil(i[1]/2),h=`vec4 ${n}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${f}, ${l}, ${p}, ${c}, b, row, col);
      return ${u.texture2D}(${t}, uv);}`;return new X(h,["coordinates.packedUVfrom3D"])}getPackedSamplerND(n,t,o){let i=o.unpackedShape,s=i.length,a=[o.width,o.height],u=oe(this.context.glContext.version),l=[a[0],a[1]],f=l[1],c=l[0],p=Math.ceil(i[s-1]/2),b=p*Math.ceil(i[s-2]/2),h="int b, int row, int col",g=`b * ${b} + (row / 2) * ${p} + (col / 2)`;for(let v=2;v<s-1;v++)h=`int b${v}, `+h,b*=i[s-v-1],g=`b${v} * ${b} + `+g;let w=`vec4 ${n}(${h}) {
      int index = ${g};
      int texR = index / ${c};
      int texC = index - texR * ${c};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${c}, ${f});
      return ${u.texture2D}(${t}, uv);
    }`;return new X(w)}getUnpackedSamplerScalar(n,t,o){let[i,s]=[o.width,o.height];if(i===1&&s===1){let u=`
          float ${n}() {
            return sampleTexture(${t}, halfCR);
          }
        `;return new X(u,["coordinates.sampleTexture"])}let a=`
        float ${n}() {
          int offset_${t} = coordsToOffset(TexCoords, ${i}, ${s});
          vec2 uv = uvFromFlat(${i}, ${s}, offset_${t});
          return sampleTexture(${t}, uv);
        }
      `;return new X(a,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler1D(n,t,o){let i=o.width,s=o.height;if(s===1&&i===1){let u=`
        float ${n}(int index) {
          return sampleTexture(${t}, halfCR);
        }
      `;return new X(u,["coordinates.sampleTexture"])}if(s===1){let u=`
          float ${n}(int index) {
            vec2 uv = vec2((float(index) + 0.5) / ${i}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new X(u,["coordinates.sampleTexture"])}if(i===1){let u=`
          float ${n}(int index) {
            vec2 uv = vec2(0.5, (float(index) + 0.5) / ${s}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new X(u,["coordinates.sampleTexture"])}let a=`
        float ${n}(int index) {
          vec2 uv = uvFromFlat(${i}, ${s}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new X(a,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler2D(n,t,o){let i=o.unpackedShape,s=[o.height,o.width];if(s!=null&&zr.arraysEqual(i,s)){let b=s[1],h=s[0],g=`
          float ${n}(int row, int col) {
            vec2 uv = (vec2(row, col) + halfCR) / vec2(${b}.0, ${h}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new X(g,["coordinates.sampleTexture"])}let{newShape:a,keptDims:u}=xn(i),l=a;if(l.length<i.length){let b=mn(i,l),h=JSON.parse(JSON.stringify(o));h.unpackedShape=b;let g=["col","row"],T=`
          ${this.getUnpackedSamplerFromInput(n,t,h).routineBody}
          float ${n}(int row, int col) {
            return ${n}(${hn(g,u)});
          }
        `;return new X(T,["coordinates.sampleTexture"])}let f=s[1],c=s[0];if(c===1){let b=`
          float ${n}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${f}, ${c});
            float index = dot(vec3(row, col, offset_${t}), vec3(${i[1]}, 1, 1));
            vec2 uv = vec2(0.5, (index + 0.5) / ${f}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new X(b,["coordinates.sampleTexture","coordinates.coordsToOffset"])}if(f===1){let b=`
          float ${n}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${f}, ${c});
            float index = dot(vec3(row, col, offset_${t}), vec3(${i[1]}, 1, 1));
            vec2 uv = vec2((index + 0.5) / ${c}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new X(b,["coordinates.sampleTexture","coordinates.coordsToOffset"])}let p=`
        float ${n}(int row, int col) {
          int index = col * ${i[1]} + row;
          vec2 uv = uvFromFlat(${f}, ${c}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new X(p,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler3D(n,t,o){let i=o.unpackedShape,s=i[1]*i[2],a=i[2],{newShape:u,keptDims:l}=xn(i),f=u;if(f.length<i.length){let h=mn(i,f),g=["batch","col","row"],T=JSON.parse(JSON.stringify(o));T.unpackedShape=h;let w=this.getUnpackedSamplerFromInput(n,t,T),v=l.reverse(),S=`
          ${w.routineBody}
          float ${n}(int batch, int row, int col) {
            return ${n}(${hn(g,v)});
          }
        `;return new X(S,w.dependencies)}let c=o.width,p=o.height,b=`
          float ${n}(int depth, int row, int col) {
            // Explicitly use integer operations as dot() only works on floats.
            int index = depth * ${s} + col * ${a} + row;
            vec2 uv = uvFromFlat(${c}, ${p}, index);
            return sampleTexture(${t}, uv);
          }
      `;return new X(b,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler4D(n,t,o){let i=o.unpackedShape,s=i[3],a=i[2]*s,u=i[1]*a,l=o.width,f=o.height,c=`
        float ${n}(int row, int col, int depth, int depth2) {
          int index = row * ${u} + col * ${a} +
              depth2 * ${s} + depth;
          vec2 uv = uvFromFlat(${l}, ${f}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new X(c,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler5D(n,t,o){let i=o.unpackedShape,s=i[4],a=i[3]*s,u=i[2]*a,l=i[1]*u,{newShape:f,keptDims:c}=xn(i);if(f.length<i.length){let g=mn(i,f),T=["row","col","depth","depth2","depth3"],w=JSON.parse(JSON.stringify(o));w.unpackedShape=g;let v=`
          ${this.getUnpackedSamplerFromInput(n,t,w).routineBody}
          float ${n}(int row, int col, int depth, int depth2, int depth3) {
            return ${n}(${hn(T,c)});
          }
        `;return new X(v,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let p=o.width,b=o.height,h=`
        float ${n}(int row, int col, int depth, int depth2, int depth3) {
          int index = row * ${l} + col * ${u} + depth * ${a} +
          depth3 * ${s} + depth2;
          vec2 uv = uvFromFlat(${p}, ${b}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new X(h,["coordinates.sampleTexture","coordinates.uvFromFlat"])}getUnpackedSampler6D(n,t,o){let i=o.unpackedShape,s=i[5],a=i[4]*s,u=i[3]*a,l=i[2]*u,f=i[1]*l,{newShape:c,keptDims:p}=xn(i);if(c.length<i.length){let T=mn(i,c),w=["row","col","depth","depth2","depth3","depth4"],v=JSON.parse(JSON.stringify(o));v.unpackedShape=T;let S=`
            ${this.getUnpackedSamplerFromInput(n,t,v).routineBody}
            float ${n}(int row, int col, int depth,
              int depth2, int depth3, int depth4) {
              return ${n}(${hn(w,p)});
            }
          `;return new X(S,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let b=o.width,h=o.height,g=`
          float ${n}(int row, int col, int depth,
            int depth2, int depth3, int depth4) {
            int index = row * ${f} + col * ${l} + depth * ${u} +
            depth2 * ${a} + depth3 * ${s} + depth4;
            vec2 uv = uvFromFlat(${b}, ${h}, index);
            return sampleTexture(${t}, uv);
          }
        `;return new X(g,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}toVec(){let n=this.context.outputTextureLayout,t=n.shape.length,o=n.strides,i=n.width,s=n.height,a=[];for(let l=0;l<t-1;++l)a.push(`
        c[${l}] = offset / ${o[l]};`),a.push(`
        offset -= c[${l}] * ${o[l]};`);a.push(`
        c[${t-1}] = offset;`);let u=`
      void toVec(vec2 texCoords, out int c[${t}]) {
        int offset = coordsToOffset(texCoords, ${i}, ${s});
        ${a.join("")}
      }
      void toVec(int offset, out int c[${t}]) {
        ${a.join("")}
      }
    `;return{toVec:new X(u,["coordinates.coordsToOffset"])}}valueFrom(){let n={};return this.context.programInfo.inputNames.forEach((t,o)=>{let i=this.context.inputTextureLayouts[o],a=(i.unpackedShape.length>0?i.unpackedShape:i.shape).length,u=`_${t}`;n[u]=new X(this.getValueFromSingle(t,a,i.width,i.height,!1),[`shapeUtils.indicesToOffset${u}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"]),u=u+"_T",n[u]=new X(this.getValueFromSingle(t,a,i.width,i.height,!0),[`shapeUtils.indicesToOffset${u}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"])}),n}getValueFromSingle(n,t,o,i,s){let a=`_${n}`;s&&(a=a+"_T");let u=oe(this.context.glContext.version);return`
        float ${a}(int m[${t}]) {
          int offset = indicesToOffset${a}(m);
          vec2 coords = offsetToCoords(offset, ${o}, ${i});
          float value = getColorAsFloat(${u.texture2D}(${n}, coords));
          return value;
        }
        `}getPackedValueFrom(n,t,o,i,s){let a=`_${n}_Pack`;s&&(a=a+"_T");let u=oe(this.context.glContext.version);return`
        vec4 ${a}(int m[${t}]) {
          int offset = indicesToOffset_${n}(m);
          vec2 coords = offsetToCoords(offset, ${o}, ${i});
          return ${u.texture2D}(${n}, coords);
        }
        `}}});var ei,Zm=C(()=>{"use strict";pr();ei=class r extends kt{constructor(e){super(e)}getFunctions(){return{...this.encodeFloat32(),...this.decodeFloat32()}}getCustomTypes(){return{}}encodeFloat32(){return{encode:new X(`highp vec4 encode(highp float f) {
        return vec4(f, 0.0, 0.0, 0.0);
      }
        `)}}decodeFloat32(){return{decode:new X(`highp float decode(highp vec4 rgba) {
        return rgba.r;
      }
        `)}}encodeUint8(){let e=r.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{encode:new X(`
      highp vec4 encode(highp float f) {
        highp float F = abs(f);
        highp float Sign = step(0.0,-f);
        highp float Exponent = floor(log2(F));
        highp float Mantissa = (exp2(- Exponent) * F);
        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));
        highp vec4 rgba;
        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));
        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);
        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));
        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));
        ${e}
        rgba = rgba / 255.0; // values need to be normalized to [0,1]
        return rgba;
    }
        `)}}decodeUint8(){let e=r.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{decode:new X(`
        highp float decode(highp vec4 rgba) {
          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]
          ${e}
          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;
          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;
          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);
          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));
          return Result;
      }
        `)}}static isLittleEndian(){let e=new ArrayBuffer(4),n=new Uint32Array(e),t=new Uint8Array(e);if(n[0]=3735928559,t[0]===239)return!0;if(t[0]===222)return!1;throw new Error("unknown endianness")}}});var ti,Ym=C(()=>{"use strict";pr();He();ti=class extends kt{constructor(e){super(e)}getFunctions(){return{...this.setFragColor(),...this.getColorAsFloat()}}getCustomTypes(){return{}}setFragColor(){let e=oe(this.context.glContext.version);return{setFragColor:new X(`
        void setFragColor(float value) {
            ${e.output} = encode(value);
        }
        `,["encoding.encode"])}}getColorAsFloat(){return{getColorAsFloat:new X(`
        float getColorAsFloat(vec4 color) {
            return decode(color);
        }
        `,["encoding.decode"])}}}});var ri,Jm=C(()=>{"use strict";pr();ri=class r extends kt{constructor(e){super(e)}getFunctions(){return{...this.bcastIndex(),...this.bcastMatmulIndex(),...this.offsetToIndices(),...this.indicesToOffset(),...this.incrementIndices()}}getCustomTypes(){return{}}bcastIndex(){let e=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((t,o)=>{let i=this.context.inputTextureLayouts[o].unpackedShape;if(i.length<=e){let s=i.length,a=e-s,u=`bcastIndices_${t}`,l="";for(let c=0;c<s;++c)l+=`
          realIndices[${c}] = int( mod(float(bcastedIndices[${a+c}]), ${i[c]}.0) );
          `;let f=`
        void ${u} (int bcastedIndices[${e}], out int realIndices[${s}]) {
          ${l}
        }
        `;n[u]=new X(f)}}),n}bcastMatmulIndex(){let e=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((t,o)=>{let i=this.context.inputTextureLayouts[o].shape;if(!(i.length<2||i.length>e)){let s=i.length,a=e-s,u=`bcastMatmulIndices_${t}`,l="";for(let c=0;c<s-2;++c)l+=`
          realIndices[${c}] = int( mod(float(bcastedIndices[${a+c}]), ${i[c]}.0) );
          `;let f=`
        void ${u}(int bcastedIndices[${e}], out int realIndices[${s}]) {
          ${l}
          realIndices[${s-1}] = bcastedIndices[${e-1}];
          realIndices[${s-2}] = bcastedIndices[${e-2}];
        }
        `;n[u]=new X(f)}}),n}indicesToOffset(){let e={};return this.context.programInfo.inputNames.forEach((n,t)=>{let o=this.context.inputTextureLayouts[t].shape,i=this.context.inputTextureLayouts[t].strides,s=o.length,a=`indicesToOffset_${n}`;e[a]=new X(r.indexToOffsetSingle(a,s,i)),a=`indicesToOffset_${n}_T`,e[a]=new X(r.indexToOffsetSingle(a,s,i.slice().reverse()))}),e}static indexToOffsetSingle(e,n,t){let o="";for(let i=n-1;i>=0;--i)o+=`
        offset += indices[${i}] * ${t[i]};
        `;return`
      int ${e}(int indices[${n}]) {
        int offset = 0;
        ${o}
        return offset;
      }
      `}offsetToIndices(){let e={};return this.context.programInfo.inputNames.forEach((n,t)=>{let o=this.context.inputTextureLayouts[t].shape,i=this.context.inputTextureLayouts[t].strides,s=o.length,a=`offsetToIndices_${n}`;e[a]=new X(r.offsetToIndicesSingle(a,s,i)),a=`offsetToIndices_${n}_T`,e[a]=new X(r.offsetToIndicesSingle(a,s,i.slice().reverse()))}),e}static offsetToIndicesSingle(e,n,t){let o=[];for(let i=0;i<n-1;++i)o.push(`
      indices[${i}] = offset / ${t[i]};`),o.push(`
        offset -= indices[${i}] * ${t[i]};`);return o.push(`
      indices[${n-1}] = offset;`),`
      void ${e}(int offset, out int indices[${n}]) {
        ${o.join("")}
      }
      `}incrementIndices(){let e={};return this.context.programInfo.inputNames.forEach((n,t)=>{let o=this.context.inputTextureLayouts[t].shape,i=o.length,s=`incrementIndices_${n}`,a="";for(let l=0;l<i;++l)a+=`
        shape[${l}] = ${o[l]};`;let u=`
        void ${s}(int axis, out int indices[${i}]) {
          int shape[${i}];
          ${a};
          for(int i = ${i} -1 ; i >= 0; --i) {
            if(i > axis) continue;
            indices[i] += 1;
            if(indices[i] < shape[i]) {
              break;
            }
            indices[i] = 0;
          }
        }
        `;e[s]=new X(u)}),e}}});var ni,Qm=C(()=>{"use strict";pr();ni=class extends kt{constructor(e){super(e)}getCustomTypes(){return{}}getFunctions(){return{...this.binaryVecFunctions(),...this.copyVec(),...this.setVecItem(),...this.getVecItem()}}binaryVecFunctions(){let n=this.context.outputTextureLayout.shape.length,t={add:"+=",sub:"-=",mul:"*=",div:"/="},o={};for(let i in t){let s=`${i}Vec`,a="";for(let l=0;l<n;++l)a+=`
          dest[${l}] ${t[i]} src[${l}];
          `;let u=`
        void ${s}(int src[${n}], out int dest[${n}]) {
          ${a}
        }
        `;o[s]=new X(u)}return o}copyVec(){let n=this.context.outputTextureLayout.shape.length,t="";for(let i=0;i<n;++i)t+=`
        dest[${i}] = src[${i}];
        `;let o=`
      void copyVec(int src[${n}], out int dest[${n}]) {
        ${t}
      }
      `;return{copyVec:new X(o)}}setVecItem(){let n=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index =${n} + index;
        if (index == 0)
            m[0] = value;
        `;for(let i=1;i<n-1;++i)t+=`
        else if (index == ${i})
            m[${i}] = value;
            `;t+=`
        else
            m[${n-1}] = value;
        `;let o=`
      void setVecItem(out int m[${n}], int index, int value) {
        ${t}
      }
        `;return{setVecItem:new X(o)}}getVecItem(){let n=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index = ${n} + index;
        if (index == 0)
            return m[0];
      `;for(let i=1;i<n-1;++i)t+=`
        else if (index == ${i})
            return m[${i}];
      `;t+=`
        else
            return m[${n-1}];
        `;let o=`
      int getVecItem(int m[${n}], int index) {
        ${t}
      }
    `;return{getVecItem:new X(o)}}}});var Is,eh=C(()=>{"use strict";Xm();Zm();Ym();Jm();Qm();Is={encoding:ei,fragcolor:ti,vec:ni,shapeUtils:ri,coordinates:Qo}});var oi,th=C(()=>{"use strict";pr();Km();eh();He();oi=class{constructor(e,n,t,o){this.libs={};this.glslLibRoutineDependencyGraph={};this.context=new Go(e,n,t,o),Object.keys(Is).forEach(s=>{let a=new Is[s](this.context);this.libs[s]=a});let i=this.glslLibRoutineDependencyGraph;for(let s in this.libs){let u=this.libs[s].getFunctions();for(let l in u){let f=s+"."+l,c;i[f]?(c=i[f],c.routineBody=u[l].routineBody):(c=new Mn(f,u[l].routineBody),i[f]=c);let p=u[l].dependencies;if(p)for(let b=0;b<p.length;++b)if(i[p[b]])c.addDependency(i[p[b]]);else{let h=new Mn(p[b]);i[p[b]]=h,c.addDependency(h)}}}}preprocess(){let e=this.context.programInfo,n=e.shaderSource;return this.context.programInfo.hasMain||(n=`${n}
      ${Lf(this.context.glContext.version,this.context.outputTextureLayout.shape.length)}`),n=qm(n),`${Bf(this.context.glContext.version)}
    ${this.getUniforms(e.inputNames,e.variables)}
    ${this.getImports(n)}
    ${n}`}getImports(e){let n=this.selectGlslLibRoutinesToBeIncluded(e);if(n.length===0)return"";let t="";for(let o=0;o<n.length;++o)if(n[o].routineBody)t+=n[o].routineBody+`
`;else throw new Error(`Missing body for the Glsl Library routine: ${n[o].name}`);return t}selectGlslLibRoutinesToBeIncluded(e){let n=[];return Object.keys(this.glslLibRoutineDependencyGraph).forEach(t=>{let o=t.split(".")[1];e.indexOf(o)!==-1&&n.push(this.glslLibRoutineDependencyGraph[t])}),Uo.returnOrderedNodes(n)}getUniforms(e,n){let t=[];if(e)for(let o of e)t.push(`uniform sampler2D ${o};`);if(n)for(let o of n)t.push(`uniform ${o.type} ${o.name}${o.arrayLength?`[${o.arrayLength}]`:""};`);return t.join(`
`)}}});var ii,rh=C(()=>{"use strict";ft();Pt();th();He();ii=class{constructor(e,n,t){this.profiler=e;this.glContext=n;this.textureLayoutStrategy=t;this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,n){this.repo.set(e,n)}run(e,n,t){this.profiler.event("op",`ProgramManager.run ${e.programInfo.name??"unknown kernel"}`,()=>{let o=this.glContext.gl,i=e.program;o.useProgram(i);try{this.bindOutput(t),this.attributesBound||this.bindAttributes(e.attribLocations),this.bindUniforms(e.uniformLocations,e.programInfo.variables??[],n)}catch(s){throw Re.error("ProgramManager",e.programInfo.shaderSource),s}this.profiler.event("backend","GlContext.draw()",()=>{this.glContext.draw()})},this.glContext)}dispose(){this.vertexShader&&this.glContext.deleteShader(this.vertexShader),this.repo.forEach(e=>this.glContext.deleteProgram(e.program))}build(e,n,t){return this.profiler.event("backend","ProgramManager.build",()=>{let o=new oi(this.glContext,e,n,t),i=o.preprocess(),s=this.compile(i);return{programInfo:e,program:s,uniformLocations:this.getUniformLocations(s,o.context.programInfo.inputNames,o.context.programInfo.variables),attribLocations:this.getAttribLocations(s)}})}compile(e){if(!this.vertexShader){Re.verbose("ProrgramManager","Compiling and caching Vertex shader for the first time");let o=Df(this.glContext.version);this.vertexShader=this.glContext.compileShader(o,this.glContext.gl.VERTEX_SHADER)}le.debug&&Re.verbose("ProrgramManager",`FragShader:
${e}
`);let n=this.glContext.compileShader(e,this.glContext.gl.FRAGMENT_SHADER),t=this.glContext.createProgram(this.vertexShader,n);return this.glContext.deleteShader(n),t}bindOutput(e){let n=e.width,t=e.height;Re.verbose("ProrgramManager",`Binding output texture to Framebuffer: w/h=${n}/${t}, shape=${e.shape}, type=${e.tensor.type}`),this.glContext.attachFramebuffer(e.texture,n,t)}bindAttributes(e){let n=e.position,t=e.textureCoord;this.glContext.setVertexAttributes(n,t),this.attributesBound=!0}bindUniforms(e,n,t){let o=this.glContext.gl,i=0;for(let{name:s,type:a,location:u,arrayLength:l}of e){let f=n.find(c=>c.name===s)?.data;if(a!=="sampler2D"&&!f)throw new Error(`variable '${s}' does not have data defined in program info`);switch(a){case"sampler2D":this.bindTexture(t[i],u,i),i++;break;case"float":l?o.uniform1fv(u,f):o.uniform1f(u,f);break;case"int":l?o.uniform1iv(u,f):o.uniform1i(u,f);break;default:throw new Error(`Uniform not implemented: ${a}`)}}}bindTexture(e,n,t){this.glContext.bindTextureToUniform(e.texture,t,n)}getAttribLocations(e){return{position:this.getAttribLocation(e,"position"),textureCoord:this.getAttribLocation(e,"textureCoord")}}getUniformLocations(e,n,t){let o=[];if(n)for(let i of n)o.push({name:i,type:"sampler2D",location:this.getUniformLocation(e,i)});if(t)for(let i of t)o.push({...i,location:this.getUniformLocation(e,i.name)});return o}getUniformLocation(e,n){let o=this.glContext.gl.getUniformLocation(e,n);if(o===null)throw new Error(`Uniform ${n} not found.`);return o}getAttribLocation(e,n){return this.glContext.gl.getAttribLocation(e,n)}}});var ai,nh=C(()=>{"use strict";Pt();zn();ai=class{constructor(e,n,t,o){this.glContext=e;this.layoutStrategy=n;this.profiler=t;this.config=o;this.pendingRead=new Map;o.reuseTextures&&(this.inUseTextures=new Map,this.idleTextures=new Map,this.textureLookup=new Map)}createTextureFromLayout(e,n,t,o){let i=this.toEncoderType(e),s=this.glContext.getEncoder(i,n.channels||1,o);if(n.isPacked&&o===1)throw new Error("not implemented");let a=n.width,u=n.height,l,f;if(this.config.reuseTextures){l=`${a}x${u}_${s.format}_${s.internalFormat}_${s.textureType}`,f=this.inUseTextures.get(l),f||(f=[],this.inUseTextures.set(l,f));let p=this.idleTextures.get(l);if(p&&p.length>0){let b=p.pop();return f.push(b),o===1&&this.glContext.updateTexture(b,a,u,s,this.toTextureData(e,t)),b}}Re.verbose("TextureManager",`Creating new texture of size ${n.width}x${n.height}`);let c=this.glContext.allocateTexture(a,u,s,this.toTextureData(e,t));return this.config.reuseTextures&&(f.push(c),this.textureLookup.set(c,l)),c}readTexture(e,n,t){return t||(t=1),this.profiler.event("backend","TextureManager.readTexture",()=>{let o=e.shape.reduce((s,a)=>s*a)*t,i=this.glContext.readTexture(e.texture,e.width,e.height,o,this.toEncoderType(n),t);return this.toTensorData(n,i)})}async readTextureAsync(e,n,t){let o=e.tensor.dataId;if(t||(t=1),this.pendingRead.has(o)){let i=this.pendingRead.get(o);return new Promise(s=>i?.push(s))}return this.profiler.event("backend","TextureManager.readTextureAsync",async()=>{this.pendingRead.set(o,[]);let i=e.shape.reduce((l,f)=>l*f)*t;await this.glContext.createAndWaitForFence();let s=this.glContext.readTexture(e.texture,e.width,e.height,i,this.toEncoderType(n),t),a=this.toTensorData(n,s),u=this.pendingRead.get(o);return this.pendingRead.delete(o),u?.forEach(l=>l(a)),a})}readUint8TextureAsFloat(e){return this.profiler.event("backend","TextureManager.readUint8TextureAsFloat",()=>{let n=e.shape.reduce((o,i)=>o*i),t=this.glContext.readTexture(e.texture,e.width,e.height,n*4,"byte",4);return new Float32Array(t.buffer,t.byteOffset,n)})}releaseTexture(e,n){let t;if(this.config.reuseTextures&&(t=this.textureLookup.get(e.texture),t)){n&&this.textureLookup.delete(t);let o=this.inUseTextures.get(t);if(o){let i=o.indexOf(e.texture);if(i!==-1){o.splice(i,1);let s=this.idleTextures.get(t);s||(s=[],this.idleTextures.set(t,s)),s.push(e.texture)}}}(!t||n)&&(Re.verbose("TextureManager",`Deleting texture of size ${e.width}x${e.height}`),this.glContext.deleteTexture(e.texture))}toTensorData(e,n){switch(e){case"int16":return n instanceof Int16Array?n:Int16Array.from(n);case"int32":return n instanceof Int32Array?n:Int32Array.from(n);case"int8":return n instanceof Int8Array?n:Int8Array.from(n);case"uint16":return n instanceof Uint16Array?n:Uint16Array.from(n);case"uint32":return n instanceof Uint32Array?n:Uint32Array.from(n);case"uint8":case"bool":return n instanceof Uint8Array?n:Uint8Array.from(n);case"float32":return n instanceof Float32Array?n:Float32Array.from(n);case"float64":return n instanceof Float64Array?n:Float64Array.from(n);default:throw new Error(`TensorData type ${e} is not supported`)}}toTextureData(e,n){if(n)return n instanceof Float32Array?n:new Float32Array(n)}toEncoderType(e){return"float"}clearActiveTextures(){this.glContext.clearActiveTextures()}}});var si,oh=C(()=>{"use strict";Pt();yc();Zf();Wm();rh();_s();nh();si=class{constructor(e,n){this.backend=e;this.context=n;this.layoutStrategy=new Jo(e.glContext.maxTextureSize),this.programManager=new ii(this.context.profiler,e.glContext,this.layoutStrategy),this.textureManager=new ai(e.glContext,this.layoutStrategy,this.context.profiler,{reuseTextures:e.textureCacheMode==="full"}),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map,this.pack=e.pack,this.pack2unpackMap=new Map,this.unpack2packMap=new Map}createInferenceHandler(){return new Vo(this)}onGraphInitialized(e){let n=e.getValues().filter(t=>t.from===-1&&t.tensor).map(t=>t.tensor.dataId);this.initializers=new Set(n)}isInitializer(e){return this.initializers?this.initializers.has(e):!1}addInitializer(e){this.initializers.add(e)}getTextureData(e,n){return n?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,n,t=!1){Re.verbose("WebGLSessionHandler","Storing Texture data in cache"),t?this.packedTextureDataCache.set(e,n):this.unpackedTextureDataCache.set(e,n)}dispose(){this.programManager.dispose(),this.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.unpackedTextureDataCache=new Map}resolve(e,n,t){let o=bc(e,n,Um);return{impl:o.opImpl,context:o.opInit?o.opInit(e,t):e}}}});function __(r){let e=0;for(;e<r.length&&r[e]();++e);return e-1}var Un,ih=C(()=>{"use strict";ft();zn();zn();Qt();Un=class{constructor(e,n){this.frameBufferBound=!1;this.itemsToPoll=[];this.gl=e,this.version=n,this.getExtensions(),this.vertexbuffer=this.createVertexbuffer(),this.framebuffer=this.createFramebuffer(),this.queryVitalParameters()}allocateTexture(e,n,t,o){let i=this.gl,s=i.createTexture();i.bindTexture(i.TEXTURE_2D,s),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);let a=o?t.encode(o,e*n):null;return i.texImage2D(i.TEXTURE_2D,0,t.internalFormat,e,n,0,t.format,t.textureType,a),this.checkError(),s}updateTexture(e,n,t,o,i){let s=this.gl;s.bindTexture(s.TEXTURE_2D,e);let a=o.encode(i,n*t);s.texSubImage2D(s.TEXTURE_2D,0,0,0,n,t,o.format,o.textureType,a),this.checkError()}attachFramebuffer(e,n,t){let o=this.gl;o.bindTexture(o.TEXTURE_2D,e),o.bindFramebuffer(o.FRAMEBUFFER,this.framebuffer),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,e,0),this.checkError(),o.viewport(0,0,n,t),o.scissor(0,0,n,t)}readTexture(e,n,t,o,i,s){let a=this.gl;s||(s=1),this.frameBufferBound||this.attachFramebuffer(e,n,t);let u=this.getEncoder(i,s),l=u.allocate(n*t);return a.bindTexture(a.TEXTURE_2D,e),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,e,0),a.readPixels(0,0,n,t,a.RGBA,u.textureType,l),this.checkError(),u.decode(l,o)}isFramebufferReady(){return!0}getActiveTexture(){let e=this.gl;return`TEXTURE${e.getParameter(this.gl.ACTIVE_TEXTURE)-e.TEXTURE0}`}getTextureBinding(){return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D)}getFramebufferBinding(){return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)}setVertexAttributes(e,n){let t=this.gl;t.vertexAttribPointer(e,3,t.FLOAT,!1,20,0),t.enableVertexAttribArray(e),n!==-1&&(t.vertexAttribPointer(n,2,t.FLOAT,!1,20,12),t.enableVertexAttribArray(n)),this.checkError()}createProgram(e,n){let t=this.gl,o=t.createProgram();return t.attachShader(o,e),t.attachShader(o,n),t.linkProgram(o),o}compileShader(e,n){let t=this.gl,o=t.createShader(n);if(!o)throw new Error(`createShader() returned null with type ${n}`);if(t.shaderSource(o,e),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)===!1)throw new Error(`Failed to compile shader: ${t.getShaderInfoLog(o)}
Shader source:
${e}`);return o}deleteShader(e){this.gl.deleteShader(e)}bindTextureToUniform(e,n,t){let o=this.gl;o.activeTexture(o.TEXTURE0+n),this.checkError(),o.bindTexture(o.TEXTURE_2D,e),this.checkError(),o.uniform1i(t,n),this.checkError()}draw(){this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.checkError()}checkError(){if(le.debug){let e=this.gl,n=e.getError(),t="";switch(n){case e.NO_ERROR:return;case e.INVALID_ENUM:t="INVALID_ENUM";break;case e.INVALID_VALUE:t="INVALID_VALUE";break;case e.INVALID_OPERATION:t="INVALID_OPERATION";break;case e.INVALID_FRAMEBUFFER_OPERATION:t="INVALID_FRAMEBUFFER_OPERATION";break;case e.OUT_OF_MEMORY:t="OUT_OF_MEMORY";break;case e.CONTEXT_LOST_WEBGL:t="CONTEXT_LOST_WEBGL";break;default:t=`Unknown WebGL Error: ${n.toString(16)}`}throw new Error(t)}}deleteTexture(e){this.gl.deleteTexture(e)}deleteProgram(e){this.gl.deleteProgram(e)}getEncoder(e,n,t=0){if(this.version===2)return new Fo(this.gl,n);switch(e){case"float":return t===1||this.isRenderFloat32Supported?new Nn(this.gl,n):new Nn(this.gl,n,this.textureHalfFloatExtension.HALF_FLOAT_OES);case"int":throw new Error("not implemented");case"byte":return new Mo(this.gl,n);default:throw new Error(`Invalid dataType: ${e}`)}}clearActiveTextures(){let e=this.gl;for(let n=0;n<this.maxTextureImageUnits;++n)e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_2D,null)}dispose(){if(this.disposed)return;let e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(this.framebuffer),e.bindBuffer(e.ARRAY_BUFFER,null),e.deleteBuffer(this.vertexbuffer),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.finish(),this.disposed=!0}createDefaultGeometry(){return new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0])}createVertexbuffer(){let e=this.gl,n=e.createBuffer();if(!n)throw new Error("createBuffer() returned null");let t=this.createDefaultGeometry();return e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),this.checkError(),n}createFramebuffer(){let e=this.gl.createFramebuffer();if(!e)throw new Error("createFramebuffer returned null");return e}queryVitalParameters(){let e=this.gl;if(this.isFloatTextureAttachableToFrameBuffer=this.checkFloatTextureAttachableToFrameBuffer(),this.isRenderFloat32Supported=this.checkRenderFloat32(),this.isFloat32DownloadSupported=this.checkFloat32Download(),this.version===1&&!this.textureHalfFloatExtension&&!this.isRenderFloat32Supported)throw new Error("both float32 and float16 TextureType are not supported");this.isBlendSupported=!this.isRenderFloat32Supported||this.checkFloat32Blend(),this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.maxTextureImageUnits=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),this.version}getExtensions(){this.version===2?(this.colorBufferFloatExtension=this.gl.getExtension("EXT_color_buffer_float"),this.disjointTimerQueryWebgl2Extension=this.gl.getExtension("EXT_disjoint_timer_query_webgl2")):(this.textureFloatExtension=this.gl.getExtension("OES_texture_float"),this.textureHalfFloatExtension=this.gl.getExtension("OES_texture_half_float"))}checkFloatTextureAttachableToFrameBuffer(){let e=this.gl,n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);let t=this.version===2?e.RGBA32F:e.RGBA;e.texImage2D(e.TEXTURE_2D,0,t,1,1,0,e.RGBA,e.FLOAT,null);let o=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0);let i=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(n),e.deleteFramebuffer(o),i}checkRenderFloat32(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension)return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Download(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension||!this.gl.getExtension("WEBGL_color_buffer_float"))return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Blend(){let e=this.gl,n,t,o,i,s;try{n=e.createTexture(),t=e.createFramebuffer(),e.bindTexture(e.TEXTURE_2D,n);let a=this.version===2?e.RGBA32F:e.RGBA;return e.texImage2D(e.TEXTURE_2D,0,a,1,1,0,e.RGBA,e.FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,t),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.enable(e.BLEND),o=e.createShader(e.VERTEX_SHADER),!o||(e.shaderSource(o,"void main(){}"),e.compileShader(o),i=e.createShader(e.FRAGMENT_SHADER),!i)||(e.shaderSource(i,"precision highp float;void main(){gl_FragColor=vec4(0.5);}"),e.compileShader(i),s=e.createProgram(),!s)?!1:(e.attachShader(s,o),e.attachShader(s,i),e.linkProgram(s),e.useProgram(s),e.drawArrays(e.POINTS,0,1),e.getError()===e.NO_ERROR)}finally{e.disable(e.BLEND),s&&e.deleteProgram(s),o&&e.deleteShader(o),i&&e.deleteShader(i),t&&(e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(t)),n&&(e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(n))}}beginTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,n=this.disjointTimerQueryWebgl2Extension,t=e.createQuery();return e.beginQuery(n.TIME_ELAPSED_EXT,t),t}else throw new Error("WebGL1 profiling currently not supported.")}endTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,n=this.disjointTimerQueryWebgl2Extension;e.endQuery(n.TIME_ELAPSED_EXT);return}else throw new Error("WebGL1 profiling currently not supported")}isTimerResultAvailable(e){let n=!1,t=!1;if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let o=this.gl,i=this.disjointTimerQueryWebgl2Extension;n=o.getQueryParameter(e,o.QUERY_RESULT_AVAILABLE),t=o.getParameter(i.GPU_DISJOINT_EXT)}else throw new Error("WebGL1 profiling currently not supported");return n&&!t}getTimerResult(e){let n=0;if(this.version===2){let t=this.gl;n=t.getQueryParameter(e,t.QUERY_RESULT),t.deleteQuery(e)}else throw new Error("WebGL1 profiling currently not supported");return n/1e6}async waitForQueryAndGetTime(e){return await Xa(()=>this.isTimerResultAvailable(e)),this.getTimerResult(e)}async createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let n,t=e,o=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),o===null?n=()=>!0:n=()=>{let i=t.clientWaitSync(o,0,0);return i===t.ALREADY_SIGNALED||i===t.CONDITION_SATISFIED},{query:o,isFencePassed:n}}async pollFence(e){return new Promise(n=>{this.addItemToPoll(()=>e.isFencePassed(),()=>n())})}pollItems(){let e=__(this.itemsToPoll.map(n=>n.isDoneFn));for(let n=0;n<=e;++n){let{resolveFn:t}=this.itemsToPoll[n];t()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}async addItemToPoll(e,n){this.itemsToPoll.push({isDoneFn:e,resolveFn:n}),!(this.itemsToPoll.length>1)&&await Xa(()=>(this.pollItems(),this.itemsToPoll.length===0))}}});function Ss(r){let e;if((!r||r==="webgl2")&&"webgl2"in vn?e=vn.webgl2:(!r||r==="webgl")&&"webgl"in vn&&(e=vn.webgl),!e)try{let t=S_();e=ah(t,r)}catch{let o=I_();e=ah(o,r)}r=r||e.version===1?"webgl":"webgl2";let n=e.gl;return vn[r]=e,n.isContextLost()?(delete vn[r],Ss(r)):(n.disable(n.DEPTH_TEST),n.disable(n.STENCIL_TEST),n.disable(n.BLEND),n.disable(n.DITHER),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SAMPLE_COVERAGE),n.enable(n.SCISSOR_TEST),n.enable(n.CULL_FACE),n.cullFace(n.BACK),e)}function ah(r,e){let n={alpha:!1,depth:!1,antialias:!1,stencil:!1,preserveDrawingBuffer:!1,premultipliedAlpha:!1,failIfMajorPerformanceCaveat:!1},t,o=n;if((!e||e==="webgl2")&&(t=r.getContext("webgl2",o),t))try{return new Un(t,2)}catch(i){Re.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl2'. Error: ${i}`)}if((!e||e==="webgl")&&(t=r.getContext("webgl",o)||r.getContext("experimental-webgl",o),t))try{return new Un(t,1)}catch(i){Re.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${i}`)}throw new Error("WebGL is not supported")}function I_(){if(typeof document>"u")throw new TypeError("failed to create canvas: document is not supported");let r=document.createElement("canvas");return r.width=1,r.height=1,r}function S_(){if(typeof OffscreenCanvas>"u")throw new TypeError("failed to create offscreen canvas: OffscreenCanvas is not supported");return new OffscreenCanvas(1,1)}var vn,sh=C(()=>{"use strict";Pt();ih();vn={}});var ui,uh=C(()=>{"use strict";ft();Pt();oh();sh();ui=class{get contextId(){return le.webgl.contextId}set contextId(e){le.webgl.contextId=e}get matmulMaxBatchSize(){return le.webgl.matmulMaxBatchSize}set matmulMaxBatchSize(e){le.webgl.matmulMaxBatchSize=e}get textureCacheMode(){return le.webgl.textureCacheMode}set textureCacheMode(e){le.webgl.textureCacheMode=e}get pack(){return le.webgl.pack}set pack(e){le.webgl.pack=e}get async(){return le.webgl.async}set async(e){le.webgl.async=e}initialize(){try{return this.glContext=Ss(this.contextId),typeof this.matmulMaxBatchSize!="number"&&(this.matmulMaxBatchSize=16),typeof this.textureCacheMode!="string"&&(this.textureCacheMode="full"),typeof this.pack!="boolean"&&(this.pack=!1),typeof this.async!="boolean"&&(this.async=!1),Re.setWithEnv(le),le.webgl.context||Object.defineProperty(le.webgl,"context",{value:this.glContext.gl}),Re.verbose("WebGLBackend",`Created WebGLContext: ${typeof this.glContext} with matmulMaxBatchSize: ${this.matmulMaxBatchSize}; textureCacheMode: ${this.textureCacheMode}; pack: ${this.pack}; async: ${this.async}.`),!0}catch(e){return Re.warning("WebGLBackend",`Unable to initialize WebGLBackend. ${e}`),!1}}createSessionHandler(e){return new si(this,e)}dispose(){this.glContext.dispose()}}});async function $s(r){if(r){let e=typeof r=="string"?[r]:r;for(let n of e){let t=lh.get(n);if(t)return t;let o=await A_(n);if(o)return o}}else return $s(["webgl"]);throw new Error("no available backend to use")}async function A_(r){let e=$_;if(typeof e[r]<"u"&&P_(e[r])){let n=e[r],t=n.initialize();if(typeof t=="object"&&"then"in t&&(t=await t),t)return lh.set(r,n),n}}function P_(r){let e=r;return"initialize"in e&&typeof e.initialize=="function"&&"createSessionHandler"in e&&typeof e.createSessionHandler=="function"&&"dispose"in e&&typeof e.dispose=="function"}var lh,$_,ch=C(()=>{"use strict";uh();lh=new Map,$_={webgl:new ui}});var As,li,fh=C(()=>{"use strict";Pt();As=class{constructor(e,n){this.op=e;this.node=n}},li=class{constructor(e,n,t){this.graph=e;this.profiler=t;this.initialize(n)}initialize(e){this.profiler.event("session","ExecutionPlan.initialize",()=>{let n=this.graph.getNodes();if(n.length!==e.length)throw new Error("The size of nodes and OPs do not match.");this._ops=e.map((t,o)=>new As(t,n[o])),this.reset(),this._starter=[],this._ops.forEach((t,o)=>{let i=!0;for(let s of t.node.inputs)if(!this._values[s]&&this.graph.getInputIndices().indexOf(s)===-1){i=!1;break}i&&this._starter.push(o)})})}reset(){this._values=this.graph.getValues().map(e=>e.tensor)}async execute(e,n){return this.profiler.event("session","ExecutionPlan.execute",async()=>{this.reset();let t=e.createInferenceHandler(),o=this.graph.getInputIndices();if(n.length!==o.length)throw new Error(`number of input tensors don't match the number of inputs to the model: actual: ${n.length} expected: ${o.length}`);n.forEach((f,c)=>{let p=o[c];this._values[p]=f});let i=this._starter.slice(0),s=this.graph.getValues(),a=this.graph.getNodes(),u=0;for(;u<i.length;){let f=i[u++],c=this._ops[f],p=c.node.inputs.map(T=>this._values[T]);if(p.indexOf(void 0)!==-1)throw new Error(`unresolved input detected: op: ${c.node}`);let b=p;Re.verbose("ExecPlan",`Running op:${c.node.name} (${b.map((T,w)=>`'${c.node.inputs[w]}': ${T.type}[${T.dims.join(",")}]`).join(", ")})`);let h=await this.profiler.event("node",c.node.name,async()=>c.op.impl(t,b,c.op.context));if(h.length!==c.node.outputs.length)throw new Error("the size of output does not match model definition.");h.forEach((T,w)=>{let v=c.node.outputs[w];if(this._values[v])throw new Error(`output [${v}] already has value: op:${c.node.name}`);this._values[v]=T});let g=new Set;h.forEach((T,w)=>{let v=c.node.outputs[w];for(let S of s[v].to){let $=a[S],P=!0;for(let E of $.inputs)if(!this._values[E]){P=!1;break}P&&g.add(S)}}),i.push(...g)}let l=[];for(let f=0;f<this.graph.getOutputIndices().length;f++){let c=this.graph.getOutputIndices()[f],p=this._values[c];if(p===void 0)throw new Error(`required output [${c}] does not have value`);c===0?await p.getData():p.data,l.push(p)}return Re.verbose("ExecPlan","disposing of inferenceHandler"),t.dispose(),l})}}});var we,Lt,Wn,dh=C(()=>{"use strict";Cn();we=un(dn());Gr();De();Lt=ee.experimental.fbs,Wn=class r{constructor(e){if(this._attributes=new Map,e!=null){for(let n of e)n instanceof we.onnx.AttributeProto?this._attributes.set(n.name,[r.getValue(n),r.getType(n)]):n instanceof Lt.Attribute&&this._attributes.set(n.name(),[r.getValue(n),r.getType(n)]);if(this._attributes.size<e.length)throw new Error("duplicated attribute names")}}set(e,n,t){this._attributes.set(e,[t,n])}delete(e){this._attributes.delete(e)}getFloat(e,n){return this.get(e,"float",n)}getInt(e,n){return this.get(e,"int",n)}getString(e,n){return this.get(e,"string",n)}getTensor(e,n){return this.get(e,"tensor",n)}getFloats(e,n){return this.get(e,"floats",n)}getInts(e,n){return this.get(e,"ints",n)}getStrings(e,n){return this.get(e,"strings",n)}getTensors(e,n){return this.get(e,"tensors",n)}get(e,n,t){let o=this._attributes.get(e);if(o===void 0){if(t!==void 0)return t;throw new Error(`required attribute not found: ${e}`)}if(o[1]!==n)throw new Error(`type mismatch: expected ${n} but got ${o[1]}`);return o[0]}static getType(e){let n=e instanceof we.onnx.AttributeProto?e.type:e.type();switch(n){case we.onnx.AttributeProto.AttributeType.FLOAT:return"float";case we.onnx.AttributeProto.AttributeType.INT:return"int";case we.onnx.AttributeProto.AttributeType.STRING:return"string";case we.onnx.AttributeProto.AttributeType.TENSOR:return"tensor";case we.onnx.AttributeProto.AttributeType.FLOATS:return"floats";case we.onnx.AttributeProto.AttributeType.INTS:return"ints";case we.onnx.AttributeProto.AttributeType.STRINGS:return"strings";case we.onnx.AttributeProto.AttributeType.TENSORS:return"tensors";default:throw new Error(`attribute type is not supported yet: ${we.onnx.AttributeProto.AttributeType[n]}`)}}static getValue(e){let n=e instanceof we.onnx.AttributeProto?e.type:e.type();if(n===we.onnx.AttributeProto.AttributeType.GRAPH||n===we.onnx.AttributeProto.AttributeType.GRAPHS)throw new Error("graph attribute is not supported yet");let t=this.getValueNoCheck(e);if(n===we.onnx.AttributeProto.AttributeType.INT&&wt.isLong(t))return wt.longToNumber(t);if(n===we.onnx.AttributeProto.AttributeType.INTS){let o=t,i=new Array(o.length);for(let s=0;s<o.length;s++){let a=o[s];i[s]=wt.longToNumber(a)}return i}if(n===we.onnx.AttributeProto.AttributeType.TENSOR)return e instanceof we.onnx.AttributeProto?Qe.fromProto(t):Qe.fromOrtTensor(t);if(n===we.onnx.AttributeProto.AttributeType.TENSORS){if(e instanceof we.onnx.AttributeProto)return t.map(i=>Qe.fromProto(i));if(e instanceof Lt.Attribute)return t.map(i=>Qe.fromOrtTensor(i))}return n===we.onnx.AttributeProto.AttributeType.STRING&&e instanceof we.onnx.AttributeProto?Rn(t):n===we.onnx.AttributeProto.AttributeType.STRINGS&&e instanceof we.onnx.AttributeProto?t.map(Rn):t}static getValueNoCheck(e){return e instanceof we.onnx.AttributeProto?this.getValueNoCheckFromOnnxFormat(e):this.getValueNoCheckFromOrtFormat(e)}static getValueNoCheckFromOnnxFormat(e){switch(e.type){case we.onnx.AttributeProto.AttributeType.FLOAT:return e.f;case we.onnx.AttributeProto.AttributeType.INT:return e.i;case we.onnx.AttributeProto.AttributeType.STRING:return e.s;case we.onnx.AttributeProto.AttributeType.TENSOR:return e.t;case we.onnx.AttributeProto.AttributeType.GRAPH:return e.g;case we.onnx.AttributeProto.AttributeType.FLOATS:return e.floats;case we.onnx.AttributeProto.AttributeType.INTS:return e.ints;case we.onnx.AttributeProto.AttributeType.STRINGS:return e.strings;case we.onnx.AttributeProto.AttributeType.TENSORS:return e.tensors;case we.onnx.AttributeProto.AttributeType.GRAPHS:return e.graphs;default:throw new Error(`unsupported attribute type: ${we.onnx.AttributeProto.AttributeType[e.type]}`)}}static getValueNoCheckFromOrtFormat(e){switch(e.type()){case Lt.AttributeType.FLOAT:return e.f();case Lt.AttributeType.INT:return e.i();case Lt.AttributeType.STRING:return e.s();case Lt.AttributeType.TENSOR:return e.t();case Lt.AttributeType.GRAPH:return e.g();case Lt.AttributeType.FLOATS:return e.floatsArray();case Lt.AttributeType.INTS:{let n=[];for(let t=0;t<e.intsLength();t++)n.push(e.ints(t));return n}case Lt.AttributeType.STRINGS:{let n=[];for(let t=0;t<e.stringsLength();t++)n.push(e.strings(t));return n}case Lt.AttributeType.TENSORS:{let n=[];for(let t=0;t<e.tensorsLength();t++)n.push(e.tensors(t));return n}default:throw new Error(`unsupported attribute type: ${Lt.AttributeType[e.type()]}`)}}}});var Os,ci,Es,rr,fi,Ps,ph=C(()=>{"use strict";dh();Cn();Os=un(dn());Gr();De();ci=ee.experimental.fbs,Es={from:(r,e)=>new Ps(r,e)},rr=class{constructor(e){this._from=void 0,this._to=[],this.tensor=void 0,this.type=void 0,e&&(this.type=lt.tensorValueTypeFromProto(e.type.tensorType))}get from(){return this._from}get to(){return this._to}},fi=class{constructor(e,n){e instanceof Os.onnx.NodeProto?(this.name=e.name,this.opType=e.opType,this.attributes=new Wn(e.attribute)):e instanceof ci.Node&&(this.name=n??e.name(),this.opType=e.opType(),this.attributes=new Wn(lt.tensorAttributesFromORTFormat(e))),this.inputs=[],this.outputs=[],this.executeNode=!0}},Ps=class{constructor(e,n){if(!e)throw new TypeError("graph is empty");this.buildGraph(e),this.transformGraph(n),this.checkIsAcyclic()}getInputIndices(){return this._allInputIndices}getInputNames(){return this._allInputNames}getOutputIndices(){return this._allOutputIndices}getOutputNames(){return this._allOutputNames}getValues(){return this._allData}getNodes(){return this._nodes}buildGraph(e){if(e instanceof Os.onnx.GraphProto)this.buildGraphFromOnnxFormat(e);else if(e instanceof ci.Graph)this.buildGraphFromOrtFormat(e);else throw new TypeError("Graph type is not supported.")}buildGraphFromOnnxFormat(e){let n=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let t=new Map;if(!e.input)throw new Error("missing information in graph: input");let o=[];for(let i of e.input){if(n.has(i.name))throw new Error(`duplicated input name: ${i.name}`);let s=this._allData.push(new rr(i))-1;n.set(i.name,s),o.push(i.name)}if(!e.initializer)throw new Error("missing information in graph: initializer");for(let i of e.initializer){let s=n.get(i.name);if(s===void 0){let a=new rr;a.type={shape:{dims:lt.tensorDimsFromProto(i.dims)},tensorType:lt.tensorDataTypeFromProto(i.dataType)},s=this._allData.push(a)-1,n.set(i.name,s)}this._allData[s]._from=-1,this._allData[s].tensor=Qe.fromProto(i)}for(let i=0;i<this._allData.length;i++)this._allData[i].tensor||(this._allInputIndices.push(i),this._allInputNames.push(o[i]));if(!e.output)throw new Error("missing information in graph: output");for(let i of e.output){if(n.has(i.name))throw new Error(`duplicated output name: ${i.name}`);let s=this._allData.push(new rr(i))-1;n.set(i.name,s),this._allOutputIndices.push(s),this._allOutputNames.push(i.name)}if(!e.node)throw new Error("missing information in graph: node");for(let i of e.node){if(!i.name)for(let a=0;;a++){let u=`unnamed_${i.opType}_${a}`;if(!t.has(u)){i.name=u;break}}if(t.has(i.name))throw new Error(`duplicated node name: ${i.name}`);let s=this._nodes.push(new fi(i))-1;t.set(i.name,s)}for(let i=0;i<this._nodes.length;i++){let s=this._nodes[i],a=e.node[i];if(!a.output)throw new Error(`missing output for node: ${a.name}`);for(let u of a.output){let l=n.get(u);if(typeof l>"u"&&(l=this._allData.push(new rr)-1,n.set(u,l)),s.outputs.push(l),this._allData[l]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${l}`);if(this._allData[l]._from=i,a.opType==="Constant"){if(!a.attribute||a.attribute.length!==1||!a.attribute[0].t)throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(!a.output||a.output.length!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");s.outputs.pop(),s.executeNode=!1,this._allData[l]._from=-1,this._allData[l].tensor=Qe.fromProto(a.attribute[0].t)}}}for(let i=0;i<this._nodes.length;i++){let s=this._nodes[i],a=e.node[i];if(!a.input)throw new Error(`missing input for node: ${a.name}`);for(let u of a.input){let l=n.get(u);if(typeof l>"u"){if(u===""&&(a.input.length===3||a.input.length===4)&&a.opType==="Resize")continue;throw new Error(`unrecognized input '${u}' for node: ${a.name}`)}s.inputs.push(l),this._allData[l]._to.push(i)}}return!0}buildGraphFromOrtFormat(e){let n=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let t=new Map,o=[];for(let i=0;i<e.inputsLength();i++){let s=e.inputs(i);if(n.has(s))throw new Error(`duplicated input name: ${s}`);for(let a=0;a<e.nodeArgsLength();a++)if(e.nodeArgs(a)?.name()===s){let u=new rr;if(e.nodeArgs(a)?.type()?.valueType()!==ci.TypeInfoValue.tensor_type)throw new Error("Unexpected value type for the nodeArg.");let f=e.nodeArgs(a).type().value(new ci.TensorTypeAndShape),c=lt.tensorDataTypeFromProto(f.elemType()),p=f.shape(),b=[];for(let g=0;g<p.dimLength();g++)b.push(wt.longToNumber(p.dim(g).value().dimValue()));u.type={shape:{dims:b},tensorType:c};let h=this._allData.push(u)-1;n.set(s,h),o.push(s)}}for(let i=0;i<e.initializersLength();i++){let s=e.initializers(i),a=n.get(s.name());if(a===void 0){let u=new rr,l=lt.tensorDimsFromORTFormat(s),f=lt.tensorDataTypeFromProto(s.dataType());u.type={shape:{dims:l},tensorType:f},a=this._allData.push(u)-1,n.set(s.name(),a)}this._allData[a]._from=-1,this._allData[a].tensor=Qe.fromOrtTensor(s)}for(let i=0;i<this._allData.length;i++)this._allData[i].tensor||(this._allInputIndices.push(i),this._allInputNames.push(o[i]));for(let i=0;i<e.outputsLength();i++){let s=e.outputs(i);if(n.has(s))throw new Error(`duplicated output name: ${s}`);let a=this._allData.push(new rr)-1;n.set(s,a),this._allOutputIndices.push(a),this._allOutputNames.push(s)}if(!e.nodes)throw new Error("missing information in graph: node");for(let i=0;i<e.nodesLength();i++){let s=e.nodes(i),a=s.name();if(!a)for(let l=0;a=`unnamed_${s.opType()}_${l}`,!!t.has(a);l++);if(t.has(a))throw new Error(`duplicated node name: ${a}`);let u=this._nodes.push(new fi(s,a))-1;t.set(a,u)}for(let i=0;i<this._nodes.length;i++){let s=this._nodes[i],a=e.nodes(i);if(a==null)throw new Error(`No node exists at index ${i}`);if(a?.outputsLength()===0)throw new Error(`missing output for node: ${a.name}`);for(let u=0;u<a?.outputsLength();u++){let l=a?.outputs(u),f=n.get(l);if(typeof f>"u"&&(f=this._allData.push(new rr)-1,n.set(l,f)),s.outputs.push(f),this._allData[f]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${f}`);if(this._allData[f]._from=i,a.opType()==="Constant"){if(a.attributesLength()!==1||!a.attributes(0).t())throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(a.outputsLength()!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");s.outputs.pop(),s.executeNode=!1,this._allData[f]._from=-1,this._allData[f].tensor=Qe.fromOrtTensor(a.attributes(0).t())}}}for(let i=0;i<this._nodes.length;i++){let s=this._nodes[i],a=e.nodes(i);if(a.inputsLength()===0)throw new Error(`missing input for node: ${a.name}`);for(let u=0;u<a.inputsLength();u++){let l=a.inputs(u),f=n.get(l);if(typeof f>"u")throw new Error(`unrecognized input '${l}' for node: ${a.name()}`);s.inputs.push(f),this._allData[f]._to.push(i)}}}checkIsAcyclic(){let e=new Set;this._allInputIndices.forEach(o=>{this._allData[o]._to.forEach(s=>{e.add(s)})});let n=Array.from(e),t=new Array(this._nodes.length).fill("white");for(;n.length>0;){let o=n.pop();t[o]==="gray"?t[o]="black":(n.push(o),t[o]="gray",this._nodes[o].outputs.forEach(i=>{let s=this._allData[i];if(typeof s.tensor<"u")throw new Error("node outputs should not be initialized");if(s._from!==o)throw new Error("from property of the Value object doesn't match index of Node being processed");s._to.forEach(a=>{if(t[a]==="gray")throw new Error("model graph is cyclic");t[a]==="white"&&n.push(a)})}))}}transformGraph(e){this.removeAllIdentityNodes(),this.removeAllDropoutNodes(),this.fuseConvActivationNodes(),e&&e.transformGraph(this),this.finalizeGraph()}finalizeGraph(){let e=0,n=new Array(this._nodes.length,0),t=0;for(let o=0;o<this._nodes.length;o++)n[o]=t,this._nodes[o].executeNode?(t!==o&&(this._nodes[t]=this._nodes[o]),t++):this._nodes[o].outputs.forEach(i=>{this._allData[i]._from=-2});this._nodes.splice(t,this._nodes.length-t);for(let o=0;o<this._allData.length;o++){let i=this._allData[o];i._from!==void 0&&i._from!==-1&&i._from!==-2&&(i._from=n[i._from]);for(let s=0;s<i._to.length;s++)if(i._to[s]>=0)i._to[s]=n[i._to[s]];else throw new Error("Trying to update a removed node")}e=0;for(let o=0;o<this._allData.length;o++){if(this._allData[o].from===-2&&this._allOutputIndices.indexOf(o+e)===-1){e++,this._allData.splice(o,1),o--;continue}if(e>0){let i=-1;this._allData[o].from!==void 0&&this._allData[o].from!==-1?(i=this._nodes[this._allData[o].from].outputs.indexOf(o+e),i!==-1&&(this._nodes[this._allData[o].from].outputs[i]=o)):(i=this._allInputIndices.indexOf(o+e),i!==-1&&(this._allInputIndices[i]=o)),this._allData[o].to.forEach(s=>{i=this._nodes[s].inputs.indexOf(o+e),i!==-1&&(this._nodes[s].inputs[i]=o)}),this._allData[o].to.length===0&&(i=this._allOutputIndices.indexOf(o+e),i!==-1&&(this._allOutputIndices[i]=o))}}}deleteNode(e){let n=this._nodes[e];if(n.outputs.length>1){for(let a=1;a<n.outputs.length;a++)if(this._allData[n.outputs[a]].to.length>0)throw new Error("Node deletion with more than one output connected to other nodes is not supported. ")}n.executeNode=!1;let t=n.inputs[0],o=n.outputs[0],i=this._allData[o].to;for(let a=0;a<n.inputs.length;a++){let u=this._allData[n.inputs[a]].to.indexOf(e);if(u===-1)throw new Error("The Value object doesn't have the current Node in it's 'to' property ");this._allData[n.inputs[a]].to.splice(u,1)}this._allData[o]._to=[];let s=this._allOutputIndices.indexOf(o);if(s!==-1&&(this._allOutputIndices[s]=t),i&&i.length>0)for(let a of i){let u=this._nodes[a].inputs.indexOf(o);if(u===-1)throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");this._nodes[a].inputs[u]=t,this._allData[t].to.push(a)}}removeAllDropoutNodes(){let e=0;for(let n of this._nodes){if(n.opType==="Dropout"){if(n.inputs.length!==1)throw new Error("Dropout nodes should only contain one input. ");if(n.outputs.length!==1&&n.outputs.length!==2)throw new Error("Dropout nodes should contain either 1 or 2 output(s)");if(n.outputs.length===2&&this._allData[n.outputs[1]]._to.length!==0)throw new Error("Dropout nodes's second output should not be referenced by other nodes");this.deleteNode(e)}e++}}removeAllIdentityNodes(){let e=0;for(let n of this._nodes)n.opType==="Identity"&&this.deleteNode(e),e++}isActivation(e){switch(e.opType){case"Relu":case"Sigmoid":case"Clip":return!0;default:return!1}}fuseConvActivationNodes(){for(let e of this._nodes)if(e.opType==="Conv"){let n=this._allData[e.outputs[0]]._to;if(n.length===1&&this.isActivation(this._nodes[n[0]])){let t=this._nodes[n[0]];if(t.opType==="Clip")if(t.inputs.length===1)try{e.attributes.set("activation_params","floats",[t.attributes.getFloat("min"),t.attributes.getFloat("max")])}catch{e.attributes.set("activation_params","floats",[Mr,Vr])}else if(t.inputs.length>=3&&this._allData[t.inputs[1]].tensor!==void 0&&this._allData[t.inputs[2]].tensor!==void 0)e.attributes.set("activation_params","floats",[this._allData[t.inputs[1]].tensor.floatData[0],this._allData[t.inputs[2]].tensor.floatData[0]]);else continue;e.attributes.set("activation","string",t.opType),this.deleteNode(n[0])}}}}});var mh,O_,di,hh=C(()=>{"use strict";ko();ph();Cn();mh=un(dn());De();O_=ee.experimental.fbs,di=class{constructor(){}load(e,n,t){let o;if(!t)try{this.loadFromOnnxFormat(e,n);return}catch(i){if(t!==void 0)throw i;o=i}try{this.loadFromOrtFormat(e,n)}catch(i){throw t!==void 0?i:new Error(`Failed to load model as ONNX format: ${o}
as ORT format: ${i}`)}}loadFromOnnxFormat(e,n){let t=mh.onnx.ModelProto.decode(e);if(wt.longToNumber(t.irVersion)<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=t.opsetImport.map(i=>({domain:i.domain,version:wt.longToNumber(i.version)})),this._graph=Es.from(t.graph,n)}loadFromOrtFormat(e,n){let t=new k.ByteBuffer(e),o=O_.InferenceSession.getRootAsInferenceSession(t).model();if(wt.longToNumber(o.irVersion())<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=[];for(let s=0;s<o.opsetImportLength();s++){let a=o.opsetImport(s);this._opsets.push({domain:a?.domain(),version:wt.longToNumber(a.version())})}this._graph=Es.from(o.graph(),n)}get graph(){return this._graph}get opsets(){return this._opsets}}});var pi,gh=C(()=>{"use strict";ch();fh();Pt();hh();pi=class{constructor(e={}){this._initialized=!1,this.backendHint=e.backendHint,this.profiler=Eo.create(e.profiler),this.context={profiler:this.profiler,graphInputTypes:[],graphInputDims:[]}}get inputNames(){return this._model.graph.getInputNames()}get outputNames(){return this._model.graph.getOutputNames()}startProfiling(){this.profiler.start()}endProfiling(){this.profiler.stop()}async loadModel(e,n,t){await this.profiler.event("session","Session.loadModel",async()=>{let o=await $s(this.backendHint);if(this.sessionHandler=o.createSessionHandler(this.context),this._model=new di,typeof e=="string"){let i=e.endsWith(".ort");{let a=await(await fetch(e)).arrayBuffer();this.initialize(new Uint8Array(a),i)}}else if(ArrayBuffer.isView(e))this.initialize(e);else{let i=new Uint8Array(e,n||0,t||e.byteLength);this.initialize(i)}})}initialize(e,n){if(this._initialized)throw new Error("already initialized");this.profiler.event("session","Session.initialize",()=>{let t=this.sessionHandler.transformGraph?this.sessionHandler:void 0;this._model.load(e,t,n),this.sessionHandler.onGraphInitialized&&this.sessionHandler.onGraphInitialized(this._model.graph),this.initializeOps(this._model.graph),this._executionPlan=new li(this._model.graph,this._ops,this.profiler)}),this._initialized=!0}async run(e){if(!this._initialized)throw new Error("session not initialized yet");return this.profiler.event("session","Session.run",async()=>{let n=this.normalizeAndValidateInputs(e),t=await this._executionPlan.execute(this.sessionHandler,n);return this.createOutput(t)})}normalizeAndValidateInputs(e){let n=this._model.graph.getInputNames();if(Array.isArray(e)){if(e.length!==n.length)throw new Error(`incorrect input array length: expected ${n.length} but got ${e.length}`)}else{if(e.size!==n.length)throw new Error(`incorrect input map size: expected ${n.length} but got ${e.size}`);let t=new Array(e.size),o=0;for(let i=0;i<n.length;++i){let s=e.get(n[i]);if(!s)throw new Error(`missing input tensor for: '${name}'`);t[o++]=s}e=t}if(!this.context.graphInputTypes||this.context.graphInputTypes.length===0||!this.context.graphInputDims||this.context.graphInputDims.length===0){let t=this._model.graph.getInputIndices(),o=this._model.graph.getValues(),i=new Array(t.length);for(let s=0;s<t.length;++s){let a=o[t[s]];i[s]=a.type.shape.dims,this.context.graphInputTypes.push(a.type.tensorType),this.context.graphInputDims.push(e[s].dims)}this.validateInputTensorDims(i,e,!0)}else this.validateInputTensorDims(this.context.graphInputDims,e,!1);return this.validateInputTensorTypes(this.context.graphInputTypes,e),e}validateInputTensorTypes(e,n){for(let t=0;t<n.length;t++){let o=e[t],i=n[t].type;if(o!==i)throw new Error(`input tensor[${t}] check failed: expected type '${o}' but got ${i}`)}}validateInputTensorDims(e,n,t){for(let o=0;o<n.length;o++){let i=e[o],s=n[o].dims;if(!this.compareTensorDims(i,s,t))throw new Error(`input tensor[${o}] check failed: expected shape '[${i.join(",")}]' but got [${s.join(",")}]`)}}compareTensorDims(e,n,t){if(e.length!==n.length)return!1;for(let o=0;o<e.length;++o)if(e[o]!==n[o]&&(!t||e[o]!==0))return!1;return!0}createOutput(e){let n=this._model.graph.getOutputNames();if(e.length!==n.length)throw new Error("expected number of outputs do not match number of generated outputs");let t=new Map;for(let o=0;o<n.length;++o)t.set(n[o],e[o]);return t}initializeOps(e){let n=e.getNodes();this._ops=new Array(n.length);for(let t=0;t<n.length;t++)this._ops[t]=this.sessionHandler.resolve(n[t],this._model.opsets,e)}}});var mi,bh=C(()=>{"use strict";ft();Gr();mi=class{constructor(e){this.session=e;this.inputNames=this.session.inputNames,this.outputNames=this.session.outputNames}async dispose(){}async run(e,n,t){let o=new Map;for(let a in e)if(Object.hasOwnProperty.call(e,a)){let u=e[a];o.set(a,new Qe(u.dims,u.type,void 0,void 0,u.data))}let i=await this.session.run(o),s={};return i.forEach((a,u)=>{s[u]=new it(a.type,a.data,a.dims)}),s}startProfiling(){this.session.startProfiling()}endProfiling(){this.session.endProfiling()}}});var yh={};sn(yh,{onnxjsBackend:()=>E_});var Cs,E_,xh=C(()=>{"use strict";gh();bh();Cs=class{async init(){}async createInferenceSessionHandler(e,n){let t=new pi(n);return typeof e=="string"?await t.loadModel(e):await t.loadModel(e),new mi(t)}},E_=new Cs});var hi=C(()=>{"use strict"});var Th={};sn(Th,{default:()=>C_});var vh,wh,C_,_h=C(()=>{"use strict";ks();Kr();Hn();vh="ort-wasm-proxy-worker",wh=globalThis.self?.name===vh;wh&&(self.onmessage=r=>{let{type:e,in:n}=r.data;try{switch(e){case"init-wasm":gi(n.wasm).then(()=>{bi(n).then(()=>{postMessage({type:e})},t=>{postMessage({type:e,err:t})})},t=>{postMessage({type:e,err:t})});break;case"init-ep":{let{epName:t,env:o}=n;yi(o,t).then(()=>{postMessage({type:e})},i=>{postMessage({type:e,err:i})});break}case"copy-from":{let{buffer:t}=n,o=qn(t);postMessage({type:e,out:o});break}case"create":{let{model:t,options:o}=n;xi(t,o).then(i=>{postMessage({type:e,out:i})},i=>{postMessage({type:e,err:i})});break}case"release":vi(n),postMessage({type:e});break;case"run":{let{sessionId:t,inputIndices:o,inputs:i,outputIndices:s,options:a}=n;wi(t,o,i,s,new Array(s.length).fill(null),a).then(u=>{u.some(l=>l[3]!=="cpu")?postMessage({type:e,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:e,out:u},_i([...i,...u]))},u=>{postMessage({type:e,err:u})});break}case"end-profiling":Ti(n),postMessage({type:e});break;default:}}catch(t){postMessage({type:e,err:t})}});C_=wh?null:r=>new Worker(r??wn,{type:"module",name:vh})});var Sh={};sn(Sh,{default:()=>k_});var Ds,Ih,k_,$h=C(()=>{"use strict";Ih=(Ds=import.meta.url,async function(r={}){function e(){return ae.buffer!=ge.buffer&&Fe(),ge}function n(){return ae.buffer!=ge.buffer&&Fe(),Ie}function t(){return ae.buffer!=ge.buffer&&Fe(),xe}function o(){return ae.buffer!=ge.buffer&&Fe(),se}function i(){return ae.buffer!=ge.buffer&&Fe(),pe}function s(){return ae.buffer!=ge.buffer&&Fe(),ce}function a(){return ae.buffer!=ge.buffer&&Fe(),ut}function u(){return ae.buffer!=ge.buffer&&Fe(),Te}var l,f,c=Object.assign({},r),p=new Promise((d,m)=>{l=d,f=m}),b=typeof window=="object",h=typeof importScripts=="function",g=h&&self.name=="em-pthread";c.mountExternalData=(d,m)=>{(c.Cb||(c.Cb=new Map)).set(d,m)},c.unmountExternalData=()=>{delete c.Cb};var T=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let w=()=>{let d=(y,x,_)=>(...O)=>{let R=Zt,M=x?.();O=y(...O);let j=x?.();return M!==j&&(y=j,_(M),x=_=null),Zt!=R?new Promise((Y,ne)=>{ma={resolve:Y,reject:ne}}):O},m=y=>async(...x)=>{try{if(c.Bb)throw Error("Session already started");let _=c.Bb={Zb:x[0],errors:[]},O=await y(...x);if(c.Bb!==_)throw Error("Session mismatch");c.Jb?.flush();let R=_.errors;if(0<R.length){let M=await Promise.all(R);if(M=M.filter(j=>j),0<M.length)throw Error(M.join(`
`))}return O}finally{c.Bb=null}};c._OrtCreateSession=d(c._OrtCreateSession,()=>c._OrtCreateSession,y=>c._OrtCreateSession=y),c._OrtRun=m(d(c._OrtRun,()=>c._OrtRun,y=>c._OrtRun=y)),c._OrtRunWithBinding=m(d(c._OrtRunWithBinding,()=>c._OrtRunWithBinding,y=>c._OrtRunWithBinding=y)),c._OrtBindInput=d(c._OrtBindInput,()=>c._OrtBindInput,y=>c._OrtBindInput=y),w=void 0};c.jsepInit=(d,m)=>{if(w?.(),d==="webgpu"){[c.Jb,c.Qb,c.Ub,c.Kb,c.Tb,c.gb,c.Vb,c.Xb,c.Rb,c.Sb,c.Wb]=m;let y=c.Jb;c.jsepRegisterBuffer=(x,_,O,R)=>y.registerBuffer(x,_,O,R),c.jsepGetBuffer=x=>y.getBuffer(x),c.jsepCreateDownloader=(x,_,O)=>y.createDownloader(x,_,O),c.jsepOnReleaseSession=x=>{y.onReleaseSession(x)},c.jsepOnRunStart=x=>y.onRunStart(x)}};var v,S,$=Object.assign({},c),P="./this.program",E=(d,m)=>{throw m},N="";(b||h)&&(h?N=self.location.href:typeof document<"u"&&document.currentScript&&(N=document.currentScript.src),Ds&&(N=Ds),N=N.startsWith("blob:")?"":N.substr(0,N.replace(/[?#].*/,"").lastIndexOf("/")+1),h&&(S=d=>{var m=new XMLHttpRequest;return m.open("GET",d,!1),m.responseType="arraybuffer",m.send(null),new Uint8Array(m.response)}),v=(d,m,y)=>{var x=new XMLHttpRequest;x.open("GET",d,!0),x.responseType="arraybuffer",x.onload=()=>{x.status==200||x.status==0&&x.response?m(x.response):y()},x.onerror=y,x.send(null)});var z=console.log.bind(console),q=console.error.bind(console),K=z,F=q;if(Object.assign(c,$),$=null,g){let d=function(m){try{var y=m.data,x=y.cmd;if(x==="load"){let _=[];self.onmessage=O=>_.push(O),self.startWorker=()=>{postMessage({cmd:"loaded"});for(let O of _)d(O);self.onmessage=d};for(let O of y.handlers)c[O]&&!c[O].proxy||(c[O]=(...R)=>{postMessage({Ib:"callHandler",hc:O,args:R})},O=="print"&&(K=c[O]),O=="printErr"&&(F=c[O]));ae=y.wasmMemory,Fe(),_e(y.wasmModule)}else if(x==="run"){ya(y.pthread_ptr,0,0,1,0,0),fa(y.pthread_ptr),Nx(),Eu(),$e||(Al(),$e=!0);try{zx(y.start_routine,y.arg)}catch(_){if(_!="unwind")throw _}}else x==="cancel"?an()&&ho(-1):y.target!=="setimmediate"&&(x==="checkMailbox"?$e&&io():x&&(F(`worker: received unknown command ${x}`),F(y)))}catch(_){throw Pl(),_}};var UI=d,_e,$e=!1;F=function(...m){m=m.join(" "),console.error(m)},self.alert=function(...m){postMessage({Ib:"alert",text:m.join(" "),jc:an()})},c.instantiateWasm=(m,y)=>new Promise(x=>{_e=_=>{_=new WebAssembly.Instance(_,Iu()),y(_),x()}}),self.onunhandledrejection=m=>{throw m.reason||m},self.onmessage=d}var ae,qe,Q,ge,Ie,xe,se,pe,ce,ut,V,ie,Te,tt=!1;function Fe(){var d=ae.buffer;c.HEAP8=ge=new Int8Array(d),c.HEAP16=xe=new Int16Array(d),c.HEAPU8=Ie=new Uint8Array(d),c.HEAPU16=se=new Uint16Array(d),c.HEAP32=pe=new Int32Array(d),c.HEAPU32=ce=new Uint32Array(d),c.HEAPF32=ut=new Float32Array(d),c.HEAPF64=Te=new Float64Array(d),c.HEAP64=V=new BigInt64Array(d),c.HEAPU64=ie=new BigUint64Array(d)}if(!g){if(c.wasmMemory)ae=c.wasmMemory;else if(!((ae=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0})).buffer instanceof T))throw F("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),Error("bad memory");Fe()}var Ke=[],tn=[],mt=[],rt=0,Kt=null,hr=null;function no(){if(--rt==0&&(Kt!==null&&(clearInterval(Kt),Kt=null),hr)){var d=hr;hr=null,d()}}function An(d){throw F(d="Aborted("+d+")"),tt=!0,Q=1,d=new WebAssembly.RuntimeError(d+". Build with -sASSERTIONS for more info."),f(d),d}var xu,vu=d=>d.startsWith("data:application/octet-stream;base64,"),wu=d=>d.startsWith("file://");function Tu(d){if(S)return S(d);throw"both async and sync fetching of the wasm failed"}function _u(d,m,y){return function(x){if(b||h){if(typeof fetch=="function"&&!wu(x))return fetch(x,{credentials:"same-origin"}).then(_=>{if(!_.ok)throw`failed to load wasm binary file at '${x}'`;return _.arrayBuffer()}).catch(()=>Tu(x));if(v)return new Promise((_,O)=>{v(x,R=>_(new Uint8Array(R)),O)})}return Promise.resolve().then(()=>Tu(x))}(d).then(x=>WebAssembly.instantiate(x,m)).then(y,x=>{F(`failed to asynchronously prepare wasm: ${x}`),An(x)})}function Iu(){return{a:{wa:Rx,b:Mx,Y:Bu,y:Nu,ma:zu,U:Mu,W:Vu,na:Gu,ka:Uu,da:Wu,ja:Hu,I:qu,V:Ku,S:ju,la:Xu,T:Zu,sa:Vx,C:Ux,M:Wx,L:qx,B:jx,s:Xx,p:Zx,D:Yx,x:o0,N:i0,ra:a0,ga:s0,Q:u0,Z:l0,E:c0,fa,pa:f0,u:d0,A:h0,o:g0,k:y0,c:la,n:x0,j:T0,xa:_0,r:I0,d:S0,v:$0,m:A0,g:P0,l:O0,i:E0,h:C0,e:k0,aa:D0,ba:B0,ca:L0,_:cl,$:fl,P:R0,f:N0,K:z0,F:F0,J:M0,ta:V0,oa:G0,R:U0,t:pl,w:W0,O:H0,va:q0,ua:K0,ha:gl,ia:bl,X:oa,z:yl,H:xl,ea:vl,G:wl,a:ae,qa:Il,q:Z0}}}var ta={1336340:(d,m,y,x)=>{if(c===void 0||!c.Cb)return 1;if((d=ot(d>>>0)).startsWith("./")&&(d=d.substring(2)),!(d=c.Cb.get(d)))return 2;if(x>>>=0,(m>>>=0)+(y>>>=0)>d.byteLength)return 3;try{return n().set(d.subarray(m,m+y),x>>>0),0}catch{return 4}},1336841:()=>{c.Rb()},1336872:()=>{c.Sb()},1336901:()=>{c.Wb()},1336926:d=>c.Qb(d),1336959:d=>c.Ub(d),1336991:(d,m,y)=>{c.Kb(d,m,y,!0)},1337030:(d,m,y)=>{c.Kb(d,m,y)},1337063:()=>typeof wasmOffsetConverter<"u",1337120:d=>{c.gb("Abs",d,void 0)},1337171:d=>{c.gb("Neg",d,void 0)},1337222:d=>{c.gb("Floor",d,void 0)},1337275:d=>{c.gb("Ceil",d,void 0)},1337327:d=>{c.gb("Reciprocal",d,void 0)},1337385:d=>{c.gb("Sqrt",d,void 0)},1337437:d=>{c.gb("Exp",d,void 0)},1337488:d=>{c.gb("Erf",d,void 0)},1337539:d=>{c.gb("Sigmoid",d,void 0)},1337594:(d,m,y)=>{c.gb("HardSigmoid",d,{alpha:m,beta:y})},1337673:d=>{c.gb("Log",d,void 0)},1337724:d=>{c.gb("Sin",d,void 0)},1337775:d=>{c.gb("Cos",d,void 0)},1337826:d=>{c.gb("Tan",d,void 0)},1337877:d=>{c.gb("Asin",d,void 0)},1337929:d=>{c.gb("Acos",d,void 0)},1337981:d=>{c.gb("Atan",d,void 0)},1338033:d=>{c.gb("Sinh",d,void 0)},1338085:d=>{c.gb("Cosh",d,void 0)},1338137:d=>{c.gb("Asinh",d,void 0)},1338190:d=>{c.gb("Acosh",d,void 0)},1338243:d=>{c.gb("Atanh",d,void 0)},1338296:d=>{c.gb("Tanh",d,void 0)},1338348:d=>{c.gb("Not",d,void 0)},1338399:(d,m,y)=>{c.gb("Clip",d,{min:m,max:y})},1338468:d=>{c.gb("Clip",d,void 0)},1338520:(d,m)=>{c.gb("Elu",d,{alpha:m})},1338578:d=>{c.gb("Relu",d,void 0)},1338630:(d,m)=>{c.gb("LeakyRelu",d,{alpha:m})},1338694:(d,m)=>{c.gb("ThresholdedRelu",d,{alpha:m})},1338764:(d,m)=>{c.gb("Cast",d,{to:m})},1338822:d=>{c.gb("Add",d,void 0)},1338873:d=>{c.gb("Sub",d,void 0)},1338924:d=>{c.gb("Mul",d,void 0)},1338975:d=>{c.gb("Div",d,void 0)},1339026:d=>{c.gb("Pow",d,void 0)},1339077:d=>{c.gb("Equal",d,void 0)},1339130:d=>{c.gb("Greater",d,void 0)},1339185:d=>{c.gb("GreaterOrEqual",d,void 0)},1339247:d=>{c.gb("Less",d,void 0)},1339299:d=>{c.gb("LessOrEqual",d,void 0)},1339358:(d,m,y,x,_)=>{c.gb("ReduceMean",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1339517:(d,m,y,x,_)=>{c.gb("ReduceMax",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1339675:(d,m,y,x,_)=>{c.gb("ReduceMin",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1339833:(d,m,y,x,_)=>{c.gb("ReduceProd",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1339992:(d,m,y,x,_)=>{c.gb("ReduceSum",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1340150:(d,m,y,x,_)=>{c.gb("ReduceL1",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1340307:(d,m,y,x,_)=>{c.gb("ReduceL2",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1340464:(d,m,y,x,_)=>{c.gb("ReduceLogSum",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1340625:(d,m,y,x,_)=>{c.gb("ReduceSumSquare",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1340789:(d,m,y,x,_)=>{c.gb("ReduceLogSumExp",d,{keepDims:!!m,noopWithEmptyAxes:!!y,axes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1340953:d=>{c.gb("Where",d,void 0)},1341006:(d,m,y)=>{c.gb("Transpose",d,{perm:m?Array.from(i().subarray(m>>>0,y>>>0)):[]})},1341114:(d,m,y,x)=>{c.gb("DepthToSpace",d,{blocksize:m,mode:ot(y),format:x?"NHWC":"NCHW"})},1341247:(d,m,y,x)=>{c.gb("DepthToSpace",d,{blocksize:m,mode:ot(y),format:x?"NHWC":"NCHW"})},1341380:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L,fe)=>{c.gb("ConvTranspose",d,{format:j?"NHWC":"NCHW",autoPad:m,dilations:[y],group:x,kernelShape:[_],pads:[O,R],strides:[M],wIsConst:()=>!!e()[Y>>>0],outputPadding:ne?Array.from(i().subarray(ne>>>0,Ae>>>0)):[],outputShape:Ce?Array.from(i().subarray(Ce>>>0,L>>>0)):[],activation:ot(fe)})},1341781:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L)=>{c.gb("ConvTranspose",d,{format:M?"NHWC":"NCHW",autoPad:m,dilations:Array.from(i().subarray(y>>>0,2+(y>>>0)>>>0)),group:x,kernelShape:Array.from(i().subarray(_>>>0,2+(_>>>0)>>>0)),pads:Array.from(i().subarray(O>>>0,4+(O>>>0)>>>0)),strides:Array.from(i().subarray(R>>>0,2+(R>>>0)>>>0)),wIsConst:()=>!!e()[j>>>0],outputPadding:Y?Array.from(i().subarray(Y>>>0,ne>>>0)):[],outputShape:Ae?Array.from(i().subarray(Ae>>>0,Ce>>>0)):[],activation:ot(L)})},1342346:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L,fe)=>{c.gb("ConvTranspose",d,{format:j?"NHWC":"NCHW",autoPad:m,dilations:[y],group:x,kernelShape:[_],pads:[O,R],strides:[M],wIsConst:()=>!!e()[Y>>>0],outputPadding:ne?Array.from(i().subarray(ne>>>0,Ae>>>0)):[],outputShape:Ce?Array.from(i().subarray(Ce>>>0,L>>>0)):[],activation:ot(fe)})},1342747:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L)=>{c.gb("ConvTranspose",d,{format:M?"NHWC":"NCHW",autoPad:m,dilations:Array.from(i().subarray(y>>>0,2+(y>>>0)>>>0)),group:x,kernelShape:Array.from(i().subarray(_>>>0,2+(_>>>0)>>>0)),pads:Array.from(i().subarray(O>>>0,4+(O>>>0)>>>0)),strides:Array.from(i().subarray(R>>>0,2+(R>>>0)>>>0)),wIsConst:()=>!!e()[j>>>0],outputPadding:Y?Array.from(i().subarray(Y>>>0,ne>>>0)):[],outputShape:Ae?Array.from(i().subarray(Ae>>>0,Ce>>>0)):[],activation:ot(L)})},1343312:(d,m)=>{c.gb("GlobalAveragePool",d,{format:m?"NHWC":"NCHW"})},1343403:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L,fe,Le)=>{c.gb("AveragePool",d,{format:Le?"NHWC":"NCHW",auto_pad:m,ceil_mode:y,count_include_pad:x,storage_order:_,dilations:[O,R],kernel_shape:[M,j],pads:[Y,ne,Ae,Ce],strides:[L,fe]})},1343687:(d,m)=>{c.gb("GlobalAveragePool",d,{format:m?"NHWC":"NCHW"})},1343778:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L,fe,Le)=>{c.gb("AveragePool",d,{format:Le?"NHWC":"NCHW",auto_pad:m,ceil_mode:y,count_include_pad:x,storage_order:_,dilations:[O,R],kernel_shape:[M,j],pads:[Y,ne,Ae,Ce],strides:[L,fe]})},1344062:(d,m)=>{c.gb("GlobalMaxPool",d,{format:m?"NHWC":"NCHW"})},1344149:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L,fe,Le)=>{c.gb("MaxPool",d,{format:Le?"NHWC":"NCHW",auto_pad:m,ceil_mode:y,count_include_pad:x,storage_order:_,dilations:[O,R],kernel_shape:[M,j],pads:[Y,ne,Ae,Ce],strides:[L,fe]})},1344429:(d,m)=>{c.gb("GlobalMaxPool",d,{format:m?"NHWC":"NCHW"})},1344516:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L,fe,Le)=>{c.gb("MaxPool",d,{format:Le?"NHWC":"NCHW",auto_pad:m,ceil_mode:y,count_include_pad:x,storage_order:_,dilations:[O,R],kernel_shape:[M,j],pads:[Y,ne,Ae,Ce],strides:[L,fe]})},1344796:(d,m,y,x,_)=>{c.gb("Gemm",d,{alpha:m,beta:y,transA:x,transB:_})},1344900:d=>{c.gb("MatMul",d,void 0)},1344954:(d,m,y,x)=>{c.gb("ArgMax",d,{keepDims:!!m,selectLastIndex:!!y,axis:x})},1345062:(d,m,y,x)=>{c.gb("ArgMin",d,{keepDims:!!m,selectLastIndex:!!y,axis:x})},1345170:(d,m)=>{c.gb("Softmax",d,{axis:m})},1345233:(d,m)=>{c.gb("Concat",d,{axis:m})},1345293:(d,m,y,x,_)=>{c.gb("Split",d,{axis:m,numOutputs:y,splitSizes:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1345433:d=>{c.gb("Expand",d,void 0)},1345487:(d,m)=>{c.gb("Gather",d,{axis:Number(m)})},1345558:(d,m)=>{c.gb("GatherElements",d,{axis:Number(m)})},1345637:(d,m,y,x,_,O,R,M,j,Y,ne)=>{c.gb("Resize",d,{antialias:m,axes:y?Array.from(i().subarray(y>>>0,x>>>0)):[],coordinateTransformMode:ot(_),cubicCoeffA:O,excludeOutside:R,extrapolationValue:M,keepAspectRatioPolicy:ot(j),mode:ot(Y),nearestMode:ot(ne)})},1345983:(d,m,y,x,_,O,R)=>{c.gb("Slice",d,{starts:m?Array.from(i().subarray(m>>>0,y>>>0)):[],ends:x?Array.from(i().subarray(x>>>0,_>>>0)):[],axes:O?Array.from(i().subarray(O>>>0,R>>>0)):[]})},1346199:d=>{c.gb("Tile",d,void 0)},1346251:(d,m,y)=>{c.gb("InstanceNormalization",d,{epsilon:m,format:y?"NHWC":"NCHW"})},1346365:(d,m,y)=>{c.gb("InstanceNormalization",d,{epsilon:m,format:y?"NHWC":"NCHW"})},1346479:d=>{c.gb("Range",d,void 0)},1346532:(d,m)=>{c.gb("Einsum",d,{equation:ot(m)})},1346613:(d,m,y,x,_)=>{c.gb("Pad",d,{mode:m,value:y,pads:x?Array.from(i().subarray(x>>>0,_>>>0)):[]})},1346740:(d,m,y,x,_,O)=>{c.gb("BatchNormalization",d,{epsilon:m,momentum:y,spatial:!!_,trainingMode:!!x,format:O?"NHWC":"NCHW"})},1346909:(d,m,y,x,_,O)=>{c.gb("BatchNormalization",d,{epsilon:m,momentum:y,spatial:!!_,trainingMode:!!x,format:O?"NHWC":"NCHW"})},1347078:(d,m,y)=>{c.gb("CumSum",d,{exclusive:Number(m),reverse:Number(y)})},1347175:(d,m,y,x,_,O,R,M,j)=>{c.gb("Attention",d,{numHeads:m,isUnidirectional:y,maskFilterValue:x,scale:_,doRotary:O,qkvHiddenSizes:R?Array.from(i().subarray(Number(M)>>>0,Number(M)+R>>>0)):[],pastPresentShareBuffer:!!j})},1347447:d=>{c.gb("BiasAdd",d,void 0)},1347502:d=>{c.gb("BiasSplitGelu",d,void 0)},1347563:d=>{c.gb("FastGelu",d,void 0)},1347619:(d,m,y,x,_,O,R,M,j,Y,ne,Ae,Ce,L,fe,Le)=>{c.gb("Conv",d,{format:Ae?"NHWC":"NCHW",auto_pad:m,dilations:y?Array.from(i().subarray(y>>>0,x>>>0)):[],group:_,kernel_shape:O?Array.from(i().subarray(O>>>0,R>>>0)):[],pads:M?Array.from(i().subarray(M>>>0,j>>>0)):[],strides:Y?Array.from(i().subarray(Y>>>0,ne>>>0)):[],w_is_const:()=>!!e()[Ce>>>0],activation:ot(L),activation_params:fe?Array.from(a().subarray(fe>>>0,Le>>>0)):[]})},1348115:d=>{c.gb("Gelu",d,void 0)},1348167:(d,m,y,x)=>{c.gb("GroupQueryAttention",d,{numHeads:m,kvNumHeads:y,scale:x})},1348280:(d,m,y,x)=>{c.gb("LayerNormalization",d,{axis:m,epsilon:y,simplified:!!x})},1348391:(d,m,y,x)=>{c.gb("LayerNormalization",d,{axis:m,epsilon:y,simplified:!!x})},1348502:(d,m,y,x,_,O)=>{c.gb("MatMulNBits",d,{k:m,n:y,accuracyLevel:x,bits:_,blockSize:O})},1348629:(d,m,y,x,_,O)=>{c.gb("MultiHeadAttention",d,{numHeads:m,isUnidirectional:y,maskFilterValue:x,scale:_,doRotary:O})},1348788:(d,m)=>{c.gb("QuickGelu",d,{alpha:m})},1348852:(d,m,y,x,_)=>{c.gb("RotaryEmbedding",d,{interleaved:!!m,numHeads:y,rotaryEmbeddingDim:x,scale:_})},1348991:(d,m,y)=>{c.gb("SkipLayerNormalization",d,{epsilon:m,simplified:!!y})},1349093:d=>{c.Vb(d)},1349127:(d,m)=>c.Xb(d,m,c.Bb.Zb,c.Bb.errors),1349239:(d,m,y)=>{c.gb("SkipLayerNormalization",d,{epsilon:m,simplified:!!y})}};function Rx(d,m,y){return il(async()=>{await c.Tb(d,m,y)})}function ra(d){this.name="ExitStatus",this.message=`Program terminated with exit(${d})`,this.status=d}var na=d=>{d.terminate(),d.onmessage=()=>{}},Su=d=>{gr.length==0&&(ku(),Cu(gr[0]));var m=gr.pop();if(!m)return 6;Cr.push(m),jt[d.xb]=m,m.xb=d.xb;var y={cmd:"run",start_routine:d.$b,arg:d.Mb,pthread_ptr:d.xb};return m.postMessage(y,d.ec),0},Er=0,We=(d,m,...y)=>{for(var x=2*y.length,_=wa(),O=va(8*x),R=O>>>3,M=0;M<y.length;M++){var j=y[M];typeof j=="bigint"?(V[R+2*M]=1n,V[R+2*M+1]=j):(V[R+2*M]=0n,u()[R+2*M+1>>>0]=j)}return d=Ol(d,0,x,O,m),go(_),d};function $u(d){if(g)return We(0,1,d);if(Q=d,!(0<Er)){for(var m of Cr)na(m);for(m of gr)na(m);gr=[],Cr=[],jt=[],c.onExit?.(d),tt=!0}E(d,new ra(d))}function Au(d){if(g)return We(1,0,d);oa(d)}var oa=d=>{if(Q=d,g)throw Au(d),"unwind";$u(d)},gr=[],Cr=[],Pu=[],jt={},Ou=d=>{var m=d.xb;delete jt[m],gr.push(d),Cr.splice(Cr.indexOf(d),1),d.xb=0,xa(m)};function Eu(){Pu.forEach(d=>d())}var Cu=d=>new Promise(m=>{d.onmessage=_=>{var O=(_=_.data).cmd;if(_.targetThread&&_.targetThread!=an()){var R=jt[_.targetThread];R?R.postMessage(_,_.transferList):F(`Internal error! Worker sent a message "${O}" to target pthread ${_.targetThread}, but that thread no longer exists!`)}else O==="checkMailbox"?io():O==="spawnThread"?Su(_):O==="cleanupThread"?Ou(jt[_.thread]):O==="killThread"?(_=_.thread,O=jt[_],delete jt[_],na(O),xa(_),Cr.splice(Cr.indexOf(O),1),O.xb=0):O==="cancelThread"?jt[_.thread].postMessage({cmd:"cancel"}):O==="loaded"?(d.loaded=!0,m(d)):O==="alert"?alert(`Thread ${_.threadId}: ${_.text}`):_.target==="setimmediate"?d.postMessage(_):O==="callHandler"?c[_.handler](..._.args):O&&F(`worker sent an unknown command ${O}`)},d.onerror=_=>{throw F(`worker sent an error! ${_.filename}:${_.lineno}: ${_.message}`),_};var y,x=[];for(y of["onExit"])c.hasOwnProperty(y)&&x.push(y);d.postMessage({cmd:"load",handlers:x,wasmMemory:ae,wasmModule:qe})});function ku(){var d=new Worker(new URL(import.meta.url),{type:"module",workerData:"em-pthread",name:"em-pthread"});gr.push(d)}var oo=d=>{for(;0<d.length;)d.shift()(c)},Nx=()=>{var d=an(),m=s()[d+52>>>2>>>0];d=s()[d+56>>>2>>>0],Cl(m,m-d),go(m)},zx=(d,m)=>{Er=0,d=kl(d,m),0<Er?Q=d:ho(d)};class Fx{constructor(m){this.Fb=m-24}}function Mx(d,m,y){var x=new Fx(d>>>=0);throw m>>>=0,y>>>=0,s()[x.Fb+16>>>2>>>0]=0,s()[x.Fb+4>>>2>>>0]=m,s()[x.Fb+8>>>2>>>0]=y,d}function Du(d,m,y,x){return g?We(2,1,d,m,y,x):Bu(d,m,y,x)}function Bu(d,m,y,x){if(d>>>=0,m>>>=0,y>>>=0,x>>>=0,T===void 0)return F("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var _=[];return g&&_.length===0?Du(d,m,y,x):(d={$b:y,xb:d,Mb:x,ec:_},g?(d.Ib="spawnThread",postMessage(d,_),0):Su(d))}var Lu=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0,Ru=(d,m,y)=>{var x=(m>>>=0)+y;for(y=m;d[y]&&!(y>=x);)++y;if(16<y-m&&d.buffer&&Lu)return Lu.decode(d.buffer instanceof T?d.slice(m,y):d.subarray(m,y));for(x="";m<y;){var _=d[m++];if(128&_){var O=63&d[m++];if((224&_)==192)x+=String.fromCharCode((31&_)<<6|O);else{var R=63&d[m++];65536>(_=(240&_)==224?(15&_)<<12|O<<6|R:(7&_)<<18|O<<12|R<<6|63&d[m++])?x+=String.fromCharCode(_):(_-=65536,x+=String.fromCharCode(55296|_>>10,56320|1023&_))}}else x+=String.fromCharCode(_)}return x},ot=(d,m)=>(d>>>=0)?Ru(n(),d,m):"";function Nu(d,m,y){return g?We(3,1,d,m,y):0}function zu(d,m){if(g)return We(4,1,d,m)}var ia=d=>{for(var m=0,y=0;y<d.length;++y){var x=d.charCodeAt(y);127>=x?m++:2047>=x?m+=2:55296<=x&&57343>=x?(m+=4,++y):m+=3}return m},Fu=(d,m,y,x)=>{if(!(0<x))return 0;var _=y>>>=0;x=y+x-1;for(var O=0;O<d.length;++O){var R=d.charCodeAt(O);if(55296<=R&&57343>=R&&(R=65536+((1023&R)<<10)|1023&d.charCodeAt(++O)),127>=R){if(y>=x)break;m[y++>>>0]=R}else{if(2047>=R){if(y+1>=x)break;m[y++>>>0]=192|R>>6}else{if(65535>=R){if(y+2>=x)break;m[y++>>>0]=224|R>>12}else{if(y+3>=x)break;m[y++>>>0]=240|R>>18,m[y++>>>0]=128|R>>12&63}m[y++>>>0]=128|R>>6&63}m[y++>>>0]=128|63&R}}return m[y>>>0]=0,y-_},rn=(d,m,y)=>Fu(d,n(),m,y);function Mu(d,m){if(g)return We(5,1,d,m)}function Vu(d,m,y){if(g)return We(6,1,d,m,y)}function Gu(d,m,y){return g?We(7,1,d,m,y):0}function Uu(d,m){if(g)return We(8,1,d,m)}function Wu(d,m,y){if(g)return We(9,1,d,m,y)}function Hu(d,m,y,x){if(g)return We(10,1,d,m,y,x)}function qu(d,m,y,x){if(g)return We(11,1,d,m,y,x)}function Ku(d,m,y,x){if(g)return We(12,1,d,m,y,x)}function ju(d){if(g)return We(13,1,d)}function Xu(d,m){if(g)return We(14,1,d,m)}function Zu(d,m,y){if(g)return We(15,1,d,m,y)}var Yu,br,Vx=()=>{An("")},Xt=d=>{for(var m="";n()[d>>>0];)m+=Yu[n()[d++>>>0]];return m},aa={},sa={},Gx={};function lr(d,m,y={}){if(!("argPackAdvance"in m))throw new TypeError("registerType registeredInstance requires argPackAdvance");return function(x,_,O={}){var R=_.name;if(!x)throw new br(`type "${R}" must have a positive integer typeid pointer`);if(sa.hasOwnProperty(x)){if(O.Ob)return;throw new br(`Cannot register type '${R}' twice`)}sa[x]=_,delete Gx[x],aa.hasOwnProperty(x)&&(_=aa[x],delete aa[x],_.forEach(M=>M()))}(d,m,y)}var Ju=(d,m,y)=>{switch(m){case 1:return y?x=>e()[x>>>0]:x=>n()[x>>>0];case 2:return y?x=>t()[x>>>1>>>0]:x=>o()[x>>>1>>>0];case 4:return y?x=>i()[x>>>2>>>0]:x=>s()[x>>>2>>>0];case 8:return y?x=>V[x>>>3]:x=>ie[x>>>3];default:throw new TypeError(`invalid integer width (${m}): ${d}`)}};function Ux(d,m,y){y>>>=0,lr(d>>>=0,{name:m=Xt(m>>>0),fromWireType:x=>x,toWireType:function(x,_){if(typeof _!="bigint"&&typeof _!="number")throw _=_===null?"null":(x=typeof _)=="object"||x==="array"||x==="function"?_.toString():""+_,new TypeError(`Cannot convert "${_}" to ${this.name}`);return typeof _=="number"&&(_=BigInt(_)),_},argPackAdvance:yr,readValueFromPointer:Ju(m,y,m.indexOf("u")==-1),Ab:null})}var yr=8;function Wx(d,m,y,x){lr(d>>>=0,{name:m=Xt(m>>>0),fromWireType:function(_){return!!_},toWireType:function(_,O){return O?y:x},argPackAdvance:yr,readValueFromPointer:function(_){return this.fromWireType(n()[_>>>0])},Ab:null})}var ua=[],cr=[];function la(d){9<(d>>>=0)&&--cr[d+1]==0&&(cr[d]=void 0,ua.push(d))}var $t=d=>{if(!d)throw new br("Cannot use deleted val. handle = "+d);return cr[d]},At=d=>{switch(d){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let m=ua.pop()||cr.length;return cr[m]=d,cr[m+1]=1,m}};function ca(d){return this.fromWireType(s()[d>>>2>>>0])}var Hx={name:"emscripten::val",fromWireType:d=>{var m=$t(d);return la(d),m},toWireType:(d,m)=>At(m),argPackAdvance:yr,readValueFromPointer:ca,Ab:null};function qx(d){return lr(d>>>0,Hx)}var Kx=(d,m)=>{switch(m){case 4:return function(y){return this.fromWireType(a()[y>>>2>>>0])};case 8:return function(y){return this.fromWireType(u()[y>>>3>>>0])};default:throw new TypeError(`invalid float width (${m}): ${d}`)}};function jx(d,m,y){y>>>=0,lr(d>>>=0,{name:m=Xt(m>>>0),fromWireType:x=>x,toWireType:(x,_)=>_,argPackAdvance:yr,readValueFromPointer:Kx(m,y),Ab:null})}function Xx(d,m,y,x,_){if(d>>>=0,y>>>=0,m=Xt(m>>>0),_===-1&&(_=4294967295),_=M=>M,x===0){var O=32-8*y;_=M=>M<<O>>>O}var R=m.includes("unsigned")?function(M,j){return j>>>0}:function(M,j){return j};lr(d,{name:m,fromWireType:_,toWireType:R,argPackAdvance:yr,readValueFromPointer:Ju(m,y,x!==0),Ab:null})}function Zx(d,m,y){function x(O){var R=s()[O>>>2>>>0];return O=s()[O+4>>>2>>>0],new _(e().buffer,O,R)}var _=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][m];lr(d>>>=0,{name:y=Xt(y>>>0),fromWireType:x,argPackAdvance:yr,readValueFromPointer:x},{Ob:!0})}function Yx(d,m){d>>>=0;var y=(m=Xt(m>>>0))==="std::string";lr(d,{name:m,fromWireType:function(x){var _=s()[x>>>2>>>0],O=x+4;if(y)for(var R=O,M=0;M<=_;++M){var j=O+M;if(M==_||n()[j>>>0]==0){if(R=ot(R,j-R),Y===void 0)var Y=R;else Y+=String.fromCharCode(0),Y+=R;R=j+1}}else{for(Y=Array(_),M=0;M<_;++M)Y[M]=String.fromCharCode(n()[O+M>>>0]);Y=Y.join("")}return Yt(x),Y},toWireType:function(x,_){_ instanceof ArrayBuffer&&(_=new Uint8Array(_));var O=typeof _=="string";if(!(O||_ instanceof Uint8Array||_ instanceof Uint8ClampedArray||_ instanceof Int8Array))throw new br("Cannot pass non-string to std::string");var R=y&&O?ia(_):_.length,M=mo(4+R+1),j=M+4;if(s()[M>>>2>>>0]=R,y&&O)rn(_,j,R+1);else if(O)for(O=0;O<R;++O){var Y=_.charCodeAt(O);if(255<Y)throw Yt(j),new br("String has UTF-16 code units that do not fit in 8 bits");n()[j+O>>>0]=Y}else for(O=0;O<R;++O)n()[j+O>>>0]=_[O];return x!==null&&x.push(Yt,M),M},argPackAdvance:yr,readValueFromPointer:ca,Ab(x){Yt(x)}})}var Qu=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,Jx=(d,m)=>{for(var y=d>>1,x=y+m/2;!(y>=x)&&o()[y>>>0];)++y;if(32<(y<<=1)-d&&Qu)return Qu.decode(n().slice(d,y));for(y="",x=0;!(x>=m/2);++x){var _=t()[d+2*x>>>1>>>0];if(_==0)break;y+=String.fromCharCode(_)}return y},Qx=(d,m,y)=>{if(y??=2147483647,2>y)return 0;var x=m;y=(y-=2)<2*d.length?y/2:d.length;for(var _=0;_<y;++_){var O=d.charCodeAt(_);t()[m>>>1>>>0]=O,m+=2}return t()[m>>>1>>>0]=0,m-x},e0=d=>2*d.length,t0=(d,m)=>{for(var y=0,x="";!(y>=m/4);){var _=i()[d+4*y>>>2>>>0];if(_==0)break;++y,65536<=_?(_-=65536,x+=String.fromCharCode(55296|_>>10,56320|1023&_)):x+=String.fromCharCode(_)}return x},r0=(d,m,y)=>{if(m>>>=0,y??=2147483647,4>y)return 0;var x=m;y=x+y-4;for(var _=0;_<d.length;++_){var O=d.charCodeAt(_);if(55296<=O&&57343>=O&&(O=65536+((1023&O)<<10)|1023&d.charCodeAt(++_)),i()[m>>>2>>>0]=O,(m+=4)+4>y)break}return i()[m>>>2>>>0]=0,m-x},n0=d=>{for(var m=0,y=0;y<d.length;++y){var x=d.charCodeAt(y);55296<=x&&57343>=x&&++y,m+=4}return m};function o0(d,m,y){if(d>>>=0,m>>>=0,y=Xt(y>>>=0),m===2)var x=Jx,_=Qx,O=e0,R=M=>o()[M>>>1>>>0];else m===4&&(x=t0,_=r0,O=n0,R=M=>s()[M>>>2>>>0]);lr(d,{name:y,fromWireType:M=>{for(var j,Y=s()[M>>>2>>>0],ne=M+4,Ae=0;Ae<=Y;++Ae){var Ce=M+4+Ae*m;Ae!=Y&&R(Ce)!=0||(ne=x(ne,Ce-ne),j===void 0?j=ne:(j+=String.fromCharCode(0),j+=ne),ne=Ce+m)}return Yt(M),j},toWireType:(M,j)=>{if(typeof j!="string")throw new br(`Cannot pass non-string to C++ string type ${y}`);var Y=O(j),ne=mo(4+Y+m);return s()[ne>>>2>>>0]=Y/m,_(j,ne+4,Y+m),M!==null&&M.push(Yt,ne),ne},argPackAdvance:yr,readValueFromPointer:ca,Ab(M){Yt(M)}})}function i0(d,m){lr(d>>>=0,{Pb:!0,name:m=Xt(m>>>0),argPackAdvance:0,fromWireType:()=>{},toWireType:()=>{}})}var a0=()=>1;function s0(d){ya(d>>>0,!h,1,!b,131072,!1),Eu()}var el=d=>{if(!tt)try{if(d(),!(0<Er))try{g?ho(Q):oa(Q)}catch(m){m instanceof ra||m=="unwind"||E(1,m)}}catch(m){m instanceof ra||m=="unwind"||E(1,m)}};function fa(d){d>>>=0,typeof Atomics.fc=="function"&&(Atomics.fc(i(),d>>>2,d).value.then(io),d+=128,Atomics.store(i(),d>>>2,1))}var io=()=>{var d=an();d&&(fa(d),el(El))};function u0(d,m){(d>>>=0)==m>>>0?setTimeout(io):g?postMessage({targetThread:d,cmd:"checkMailbox"}):(d=jt[d])&&d.postMessage({cmd:"checkMailbox"})}var da=[];function l0(d,m,y,x,_){for(m>>>=0,x/=2,da.length=x,y=_>>>0>>>3,_=0;_<x;_++)da[_]=V[y+2*_]?V[y+2*_+1]:u()[y+2*_+1>>>0];return(m?ta[m]:Y0[d])(...da)}function c0(d){d>>>=0,g?postMessage({cmd:"cleanupThread",thread:d}):Ou(jt[d])}function f0(d){}var pa=(d,m)=>{var y=sa[d];if(y===void 0)throw d=$l(d),y=Xt(d),Yt(d),new br(`${m} has unknown type ${y}`);return y},tl=(d,m,y)=>{var x=[];return d=d.toWireType(x,y),x.length&&(s()[m>>>2>>>0]=At(x)),d};function d0(d,m,y){return m>>>=0,y>>>=0,d=$t(d>>>0),m=pa(m,"emval::as"),tl(m,y,d)}var ao=d=>{try{d()}catch(m){An(m)}},xr=0,Zt=null,rl=0,so=[],nl={},ol={},p0=0,ma=null,m0=[];function il(d){return function(m){if(!tt){if(xr===0){var y=!1,x=!1;m((_=0)=>{if(!tt&&(rl=_,y=!0,x)){xr=2,ao(()=>Ll(Zt)),typeof Browser<"u"&&Browser.Gb.Nb&&Browser.Gb.resume(),_=!1;try{var O=function(){var j=i()[Zt+8>>>2>>>0];return j=te[ol[j]],--Er,j()}()}catch(j){O=j,_=!0}var R=!1;if(!Zt){var M=ma;M&&(ma=null,(_?M.reject:M.resolve)(O),R=!0)}if(_&&!R)throw O}}),x=!0,y||(xr=1,Zt=function(){var _=mo(65548),O=_+12;s()[_>>>2>>>0]=O,s()[_+4>>>2>>>0]=O+65536,O=so[0];var R=nl[O];return R===void 0&&(R=p0++,nl[O]=R,ol[R]=O),O=R,i()[_+8>>>2>>>0]=O,_}(),typeof Browser<"u"&&Browser.Gb.Nb&&Browser.Gb.pause(),ao(()=>Dl(Zt)))}else xr===2?(xr=0,ao(Rl),Yt(Zt),Zt=null,m0.forEach(el)):An(`invalid state: ${xr}`);return rl}}(m=>{d().then(m)})}function h0(d){return d>>>=0,il(()=>(d=$t(d)).then(At))}var uo=[];function g0(d,m,y,x){return y>>>=0,x>>>=0,(d=uo[d>>>0])(null,m=$t(m>>>0),y,x)}var b0={},lo=d=>{var m=b0[d];return m===void 0?Xt(d):m};function y0(d,m,y,x,_){return y>>>=0,x>>>=0,_>>>=0,(d=uo[d>>>0])(m=$t(m>>>0),m[y=lo(y)],x,_)}var al=()=>typeof globalThis=="object"?globalThis:Function("return this")();function x0(d){return(d>>>=0)==0?At(al()):(d=lo(d),At(al()[d]))}var v0=d=>{var m=uo.length;return uo.push(d),m},w0=(d,m)=>{for(var y=Array(d),x=0;x<d;++x)y[x]=pa(s()[m+4*x>>>2>>>0],"parameter "+x);return y},sl=(d,m)=>Object.defineProperty(m,"name",{value:d});function T0(d,m,y){var x=(m=w0(d,m>>>0)).shift();d--;var _=`return function (obj, func, destructorsRef, args) {
`,O=0,R=[];y===0&&R.push("obj");for(var M=["retType"],j=[x],Y=0;Y<d;++Y)R.push("arg"+Y),M.push("argType"+Y),j.push(m[Y]),_+=`  var arg${Y} = argType${Y}.readValueFromPointer(args${O?"+"+O:""});
`,O+=m[Y].argPackAdvance;return _+=`  var rv = ${y===1?"new func":"func.call"}(${R.join(", ")});
`,x.Pb||(M.push("emval_returnValue"),j.push(tl),_+=`  return emval_returnValue(retType, destructorsRef, rv);
`),M.push(_+`};
`),d=function(ne){var Ae=Function;if(!(Ae instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof Ae} which is not a function`);var Ce=sl(Ae.name||"unknownFunctionName",function(){});return Ce.prototype=Ae.prototype,Ce=new Ce,(ne=Ae.apply(Ce,ne))instanceof Object?ne:Ce}(M)(...j),y=`methodCaller<(${m.map(ne=>ne.name).join(", ")}) => ${x.name}>`,v0(sl(y,d))}function _0(d){return d=lo(d>>>0),At(c[d])}function I0(d,m){return m>>>=0,d=$t(d>>>0),m=$t(m),At(d[m])}function S0(d){9<(d>>>=0)&&(cr[d+1]+=1)}function $0(){return At([])}function A0(d){d=$t(d>>>0);for(var m=Array(d.length),y=0;y<d.length;y++)m[y]=d[y];return At(m)}function P0(d){return At(lo(d>>>0))}function O0(){return At({})}function E0(d){for(var m=$t(d>>>=0);m.length;){var y=m.pop();m.pop()(y)}la(d)}function C0(d,m,y){m>>>=0,y>>>=0,d=$t(d>>>0),m=$t(m),y=$t(y),d[m]=y}function k0(d,m){return m>>>=0,d=(d=pa(d>>>0,"_emval_take_value")).readValueFromPointer(m),At(d)}function D0(d,m){d=-9007199254740992>d||9007199254740992<d?NaN:Number(d),m>>>=0,d=new Date(1e3*d),i()[m>>>2>>>0]=d.getUTCSeconds(),i()[m+4>>>2>>>0]=d.getUTCMinutes(),i()[m+8>>>2>>>0]=d.getUTCHours(),i()[m+12>>>2>>>0]=d.getUTCDate(),i()[m+16>>>2>>>0]=d.getUTCMonth(),i()[m+20>>>2>>>0]=d.getUTCFullYear()-1900,i()[m+24>>>2>>>0]=d.getUTCDay(),d=(d.getTime()-Date.UTC(d.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,i()[m+28>>>2>>>0]=d}var nn=d=>d%4==0&&(d%100!=0||d%400==0),ul=[0,31,60,91,121,152,182,213,244,274,305,335],ll=[0,31,59,90,120,151,181,212,243,273,304,334];function B0(d,m){d=-9007199254740992>d||9007199254740992<d?NaN:Number(d),m>>>=0,d=new Date(1e3*d),i()[m>>>2>>>0]=d.getSeconds(),i()[m+4>>>2>>>0]=d.getMinutes(),i()[m+8>>>2>>>0]=d.getHours(),i()[m+12>>>2>>>0]=d.getDate(),i()[m+16>>>2>>>0]=d.getMonth(),i()[m+20>>>2>>>0]=d.getFullYear()-1900,i()[m+24>>>2>>>0]=d.getDay();var y=(nn(d.getFullYear())?ul:ll)[d.getMonth()]+d.getDate()-1|0;i()[m+28>>>2>>>0]=y,i()[m+36>>>2>>>0]=-60*d.getTimezoneOffset(),y=new Date(d.getFullYear(),6,1).getTimezoneOffset();var x=new Date(d.getFullYear(),0,1).getTimezoneOffset();d=0|(y!=x&&d.getTimezoneOffset()==Math.min(x,y)),i()[m+32>>>2>>>0]=d}function L0(d){d>>>=0;var m=new Date(i()[d+20>>>2>>>0]+1900,i()[d+16>>>2>>>0],i()[d+12>>>2>>>0],i()[d+8>>>2>>>0],i()[d+4>>>2>>>0],i()[d>>>2>>>0],0),y=i()[d+32>>>2>>>0],x=m.getTimezoneOffset(),_=new Date(m.getFullYear(),6,1).getTimezoneOffset(),O=new Date(m.getFullYear(),0,1).getTimezoneOffset(),R=Math.min(O,_);return 0>y?i()[d+32>>>2>>>0]=+(_!=O&&R==x):0<y!=(R==x)&&(_=Math.max(O,_),m.setTime(m.getTime()+6e4*((0<y?R:_)-x))),i()[d+24>>>2>>>0]=m.getDay(),y=(nn(m.getFullYear())?ul:ll)[m.getMonth()]+m.getDate()-1|0,i()[d+28>>>2>>>0]=y,i()[d>>>2>>>0]=m.getSeconds(),i()[d+4>>>2>>>0]=m.getMinutes(),i()[d+8>>>2>>>0]=m.getHours(),i()[d+12>>>2>>>0]=m.getDate(),i()[d+16>>>2>>>0]=m.getMonth(),i()[d+20>>>2>>>0]=m.getYear(),d=m.getTime(),BigInt(isNaN(d)?-1:d/1e3)}function cl(d,m,y,x,_,O,R){return g?We(16,1,d,m,y,x,_,O,R):-52}function fl(d,m,y,x,_,O){if(g)return We(17,1,d,m,y,x,_,O)}function R0(d,m,y,x){d>>>=0,m>>>=0,y>>>=0,x>>>=0;var _=new Date().getFullYear(),O=new Date(_,0,1),R=new Date(_,6,1);_=O.getTimezoneOffset();var M=R.getTimezoneOffset(),j=Math.max(_,M);s()[d>>>2>>>0]=60*j,i()[m>>>2>>>0]=+(_!=M),O=(d=Y=>Y.toLocaleTimeString(void 0,{hour12:!1,timeZoneName:"short"}).split(" ")[1])(O),R=d(R),M<_?(rn(O,y,17),rn(R,x,17)):(rn(O,x,17),rn(R,y,17))}var ha=[],dl=(d,m)=>{ha.length=0;for(var y;y=n()[d++>>>0];){var x=y!=105;m+=(x&=y!=112)&&m%8?4:0,ha.push(y==112?s()[m>>>2>>>0]:y==106?V[m>>>3]:y==105?i()[m>>>2>>>0]:u()[m>>>3>>>0]),m+=x?8:4}return ha};function N0(d,m,y){return d>>>=0,m=dl(m>>>0,y>>>0),ta[d](...m)}function z0(d,m,y){return d>>>=0,m=dl(m>>>0,y>>>0),ta[d](...m)}var F0=()=>{},M0=()=>Date.now();function V0(d,m){return F(ot(d>>>0,m>>>0))}var pl,G0=()=>{throw Er+=1,"unwind"};function U0(){return 4294901760}pl=()=>performance.timeOrigin+performance.now();var W0=()=>navigator.hardwareConcurrency;function H0(d){d>>>=0;var m=n().length;if(d<=m||4294901760<d)return!1;for(var y=1;4>=y;y*=2){var x=m*(1+.2/y);x=Math.min(x,d+100663296);var _=Math;x=Math.max(d,x);e:{_=(_.min.call(_,4294901760,x+(65536-x%65536)%65536)-ae.buffer.byteLength+65535)/65536;try{ae.grow(_),Fe();var O=1;break e}catch{}O=void 0}if(O)return!0}return!1}var co=()=>(An("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),on={},ml=d=>{d.forEach(m=>{var y=co();y&&(on[y]=m)})};function q0(){var d=Error().stack.toString().split(`
`);return d[0]=="Error"&&d.shift(),ml(d),on.Lb=co(),on.Yb=d,on.Lb}function K0(d,m,y){if(d>>>=0,m>>>=0,on.Lb==d)var x=on.Yb;else(x=Error().stack.toString().split(`
`))[0]=="Error"&&x.shift(),ml(x);for(var _=3;x[_]&&co()!=d;)++_;for(d=0;d<y&&x[d+_];++d)i()[m+4*d>>>2>>>0]=co();return d}var ga,ba={},hl=()=>{if(!ga){var d,m={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:P||"./this.program"};for(d in ba)ba[d]===void 0?delete m[d]:m[d]=ba[d];var y=[];for(d in m)y.push(`${d}=${m[d]}`);ga=y}return ga};function gl(d,m){if(g)return We(18,1,d,m);d>>>=0,m>>>=0;var y=0;return hl().forEach((x,_)=>{var O=m+y;for(_=s()[d+4*_>>>2>>>0]=O,O=0;O<x.length;++O)e()[_++>>>0]=x.charCodeAt(O);e()[_>>>0]=0,y+=x.length+1}),0}function bl(d,m){if(g)return We(19,1,d,m);d>>>=0,m>>>=0;var y=hl();s()[d>>>2>>>0]=y.length;var x=0;return y.forEach(_=>x+=_.length+1),s()[m>>>2>>>0]=x,0}function yl(d){return g?We(20,1,d):52}function xl(d,m,y,x){return g?We(21,1,d,m,y,x):52}function vl(d,m,y,x){return g?We(22,1,d,m,y,x):70}var j0=[null,[],[]];function wl(d,m,y,x){if(g)return We(23,1,d,m,y,x);m>>>=0,y>>>=0,x>>>=0;for(var _=0,O=0;O<y;O++){var R=s()[m>>>2>>>0],M=s()[m+4>>>2>>>0];m+=8;for(var j=0;j<M;j++){var Y=n()[R+j>>>0],ne=j0[d];Y===0||Y===10?((d===1?K:F)(Ru(ne,0)),ne.length=0):ne.push(Y)}_+=M}return s()[x>>>2>>>0]=_,0}var Tl=[31,29,31,30,31,30,31,31,30,31,30,31],_l=[31,28,31,30,31,30,31,31,30,31,30,31],X0=(d,m)=>{e().set(d,m>>>0)};function Il(d,m,y,x){function _(L,fe,Le){for(L=typeof L=="number"?L.toString():L||"";L.length<fe;)L=Le[0]+L;return L}function O(L,fe){return _(L,fe,"0")}function R(L,fe){function Le(zl){return 0>zl?-1:0<zl?1:0}var kr;return(kr=Le(L.getFullYear()-fe.getFullYear()))===0&&(kr=Le(L.getMonth()-fe.getMonth()))===0&&(kr=Le(L.getDate()-fe.getDate())),kr}function M(L){switch(L.getDay()){case 0:return new Date(L.getFullYear()-1,11,29);case 1:return L;case 2:return new Date(L.getFullYear(),0,3);case 3:return new Date(L.getFullYear(),0,2);case 4:return new Date(L.getFullYear(),0,1);case 5:return new Date(L.getFullYear()-1,11,31);case 6:return new Date(L.getFullYear()-1,11,30)}}function j(L){var fe=L.yb;for(L=new Date(new Date(L.zb+1900,0,1).getTime());0<fe;){var Le=L.getMonth(),kr=(nn(L.getFullYear())?Tl:_l)[Le];if(!(fe>kr-L.getDate())){L.setDate(L.getDate()+fe);break}fe-=kr-L.getDate()+1,L.setDate(1),11>Le?L.setMonth(Le+1):(L.setMonth(0),L.setFullYear(L.getFullYear()+1))}return Le=new Date(L.getFullYear()+1,0,4),fe=M(new Date(L.getFullYear(),0,4)),Le=M(Le),0>=R(fe,L)?0>=R(Le,L)?L.getFullYear()+1:L.getFullYear():L.getFullYear()-1}d>>>=0,m>>>=0,y>>>=0,x>>>=0;var Y=s()[x+40>>>2>>>0];for(var ne in x={cc:i()[x>>>2>>>0],bc:i()[x+4>>>2>>>0],Db:i()[x+8>>>2>>>0],Hb:i()[x+12>>>2>>>0],Eb:i()[x+16>>>2>>>0],zb:i()[x+20>>>2>>>0],rb:i()[x+24>>>2>>>0],yb:i()[x+28>>>2>>>0],kc:i()[x+32>>>2>>>0],ac:i()[x+36>>>2>>>0],dc:Y?ot(Y):""},y=ot(y),Y={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})y=y.replace(new RegExp(ne,"g"),Y[ne]);var Ae="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),Ce="January February March April May June July August September October November December".split(" ");for(ne in Y={"%a":L=>Ae[L.rb].substring(0,3),"%A":L=>Ae[L.rb],"%b":L=>Ce[L.Eb].substring(0,3),"%B":L=>Ce[L.Eb],"%C":L=>O((L.zb+1900)/100|0,2),"%d":L=>O(L.Hb,2),"%e":L=>_(L.Hb,2," "),"%g":L=>j(L).toString().substring(2),"%G":j,"%H":L=>O(L.Db,2),"%I":L=>((L=L.Db)==0?L=12:12<L&&(L-=12),O(L,2)),"%j":L=>{for(var fe=0,Le=0;Le<=L.Eb-1;fe+=(nn(L.zb+1900)?Tl:_l)[Le++]);return O(L.Hb+fe,3)},"%m":L=>O(L.Eb+1,2),"%M":L=>O(L.bc,2),"%n":()=>`
`,"%p":L=>0<=L.Db&&12>L.Db?"AM":"PM","%S":L=>O(L.cc,2),"%t":()=>"	","%u":L=>L.rb||7,"%U":L=>O(Math.floor((L.yb+7-L.rb)/7),2),"%V":L=>{var fe=Math.floor((L.yb+7-(L.rb+6)%7)/7);if(2>=(L.rb+371-L.yb-2)%7&&fe++,fe)fe==53&&((Le=(L.rb+371-L.yb)%7)==4||Le==3&&nn(L.zb)||(fe=1));else{fe=52;var Le=(L.rb+7-L.yb-1)%7;(Le==4||Le==5&&nn(L.zb%400-1))&&fe++}return O(fe,2)},"%w":L=>L.rb,"%W":L=>O(Math.floor((L.yb+7-(L.rb+6)%7)/7),2),"%y":L=>(L.zb+1900).toString().substring(2),"%Y":L=>L.zb+1900,"%z":L=>{var fe=0<=(L=L.ac);return L=Math.abs(L)/60,(fe?"+":"-")+("0000"+(L/60*100+L%60)).slice(-4)},"%Z":L=>L.dc,"%%":()=>"%"},y=y.replace(/%%/g,"\0\0"),Y)y.includes(ne)&&(y=y.replace(new RegExp(ne,"g"),Y[ne](x)));return ne=function(L){var fe=Array(ia(L)+1);return Fu(L,fe,0,fe.length),fe}(y=y.replace(/\0\0/g,"%")),ne.length>m?0:(X0(ne,d),ne.length-1)}function Z0(d,m,y,x){return Il(d>>>0,m>>>0,y>>>0,x>>>0)}g||function(){for(var d=c.numThreads-1;d--;)ku();Ke.unshift(()=>{rt++,function(m){g?m():Promise.all(gr.map(Cu)).then(m)}(()=>no())})}();for(var Sl=Array(256),fo=0;256>fo;++fo)Sl[fo]=String.fromCharCode(fo);Yu=Sl,br=c.BindingError=class extends Error{constructor(d){super(d),this.name="BindingError"}},c.InternalError=class extends Error{constructor(d){super(d),this.name="InternalError"}},cr.push(0,1,void 0,1,null,1,!0,1,!1,1),c.count_emval_handles=()=>cr.length/2-5-ua.length;var Y0=[$u,Au,Du,Nu,zu,Mu,Vu,Gu,Uu,Wu,Hu,qu,Ku,ju,Xu,Zu,cl,fl,gl,bl,yl,xl,vl,wl],te=function(){function d(y,x){return te=y.exports,te=function(){var _=te,O={};for(let[R,M]of Object.entries(_))O[R]=typeof M=="function"?(...j)=>{so.push(R);try{return M(...j)}finally{tt||(so.pop(),Zt&&xr===1&&so.length===0&&(xr=0,Er+=1,ao(Bl),typeof Fibers<"u"&&Fibers.lc()))}}:M;return O}(),te=function(){var _=te,O=M=>j=>M(j)>>>0,R=M=>()=>M()>>>0;return(_=Object.assign({},_)).za=O(_.za),_.cb=R(_.cb),_.db=O(_.db),_.emscripten_main_runtime_thread_id=R(_.emscripten_main_runtime_thread_id),_.pb=O(_.pb),_.qb=R(_.qb),_}(),Pu.push(te.fb),tn.unshift(te.ya),qe=x,no(),te}var m=Iu();if(rt++,c.instantiateWasm)try{return c.instantiateWasm(m,d)}catch(y){F(`Module.instantiateWasm callback failed with error: ${y}`),f(y)}return xu||=c.locateFile?vu("ort-wasm-simd-threaded.jsep.wasm")?"ort-wasm-simd-threaded.jsep.wasm":c.locateFile?c.locateFile("ort-wasm-simd-threaded.jsep.wasm",N):N+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,function(y,x){var _=xu;return typeof WebAssembly.instantiateStreaming!="function"||vu(_)||wu(_)||typeof fetch!="function"?_u(_,y,x):fetch(_,{credentials:"same-origin"}).then(O=>WebAssembly.instantiateStreaming(O,y).then(x,function(R){return F(`wasm streaming compile failed: ${R}`),F("falling back to ArrayBuffer instantiation"),_u(_,y,x)}))}(m,function(y){d(y.instance,y.module)}).catch(f),{}}(),$l=d=>($l=te.za)(d),Al=()=>(Al=te.Aa)();c._OrtInit=(d,m)=>(c._OrtInit=te.Ba)(d,m),c._OrtGetLastError=(d,m)=>(c._OrtGetLastError=te.Ca)(d,m),c._OrtCreateSessionOptions=(d,m,y,x,_,O,R,M,j,Y)=>(c._OrtCreateSessionOptions=te.Da)(d,m,y,x,_,O,R,M,j,Y),c._OrtAppendExecutionProvider=(d,m)=>(c._OrtAppendExecutionProvider=te.Ea)(d,m),c._OrtAddFreeDimensionOverride=(d,m,y)=>(c._OrtAddFreeDimensionOverride=te.Fa)(d,m,y),c._OrtAddSessionConfigEntry=(d,m,y)=>(c._OrtAddSessionConfigEntry=te.Ga)(d,m,y),c._OrtReleaseSessionOptions=d=>(c._OrtReleaseSessionOptions=te.Ha)(d),c._OrtCreateSession=(d,m,y)=>(c._OrtCreateSession=te.Ia)(d,m,y),c._OrtReleaseSession=d=>(c._OrtReleaseSession=te.Ja)(d),c._OrtGetInputOutputCount=(d,m,y)=>(c._OrtGetInputOutputCount=te.Ka)(d,m,y),c._OrtGetInputName=(d,m)=>(c._OrtGetInputName=te.La)(d,m),c._OrtGetOutputName=(d,m)=>(c._OrtGetOutputName=te.Ma)(d,m),c._OrtFree=d=>(c._OrtFree=te.Na)(d),c._OrtCreateTensor=(d,m,y,x,_,O)=>(c._OrtCreateTensor=te.Oa)(d,m,y,x,_,O),c._OrtGetTensorData=(d,m,y,x,_)=>(c._OrtGetTensorData=te.Pa)(d,m,y,x,_),c._OrtReleaseTensor=d=>(c._OrtReleaseTensor=te.Qa)(d),c._OrtCreateRunOptions=(d,m,y,x)=>(c._OrtCreateRunOptions=te.Ra)(d,m,y,x),c._OrtAddRunConfigEntry=(d,m,y)=>(c._OrtAddRunConfigEntry=te.Sa)(d,m,y),c._OrtReleaseRunOptions=d=>(c._OrtReleaseRunOptions=te.Ta)(d),c._OrtCreateBinding=d=>(c._OrtCreateBinding=te.Ua)(d),c._OrtBindInput=(d,m,y)=>(c._OrtBindInput=te.Va)(d,m,y),c._OrtBindOutput=(d,m,y,x)=>(c._OrtBindOutput=te.Wa)(d,m,y,x),c._OrtClearBoundOutputs=d=>(c._OrtClearBoundOutputs=te.Xa)(d),c._OrtReleaseBinding=d=>(c._OrtReleaseBinding=te.Ya)(d),c._OrtRunWithBinding=(d,m,y,x,_)=>(c._OrtRunWithBinding=te.Za)(d,m,y,x,_),c._OrtRun=(d,m,y,x,_,O,R,M)=>(c._OrtRun=te._a)(d,m,y,x,_,O,R,M),c._OrtEndProfiling=d=>(c._OrtEndProfiling=te.$a)(d),c._JsepOutput=(d,m,y)=>(c._JsepOutput=te.ab)(d,m,y),c._JsepGetNodeName=d=>(c._JsepGetNodeName=te.bb)(d);var po,an=()=>(an=te.cb)(),mo=c._malloc=d=>(mo=c._malloc=te.db)(d),Yt=c._free=d=>(Yt=c._free=te.eb)(d),ya=(d,m,y,x,_,O)=>(ya=te.hb)(d,m,y,x,_,O),Pl=()=>(Pl=te.ib)(),Ol=(d,m,y,x,_)=>(Ol=te.jb)(d,m,y,x,_),xa=d=>(xa=te.kb)(d),ho=d=>(ho=te.lb)(d),El=()=>(El=te.mb)(),Cl=(d,m)=>(Cl=te.nb)(d,m),go=d=>(go=te.ob)(d),va=d=>(va=te.pb)(d),wa=()=>(wa=te.qb)(),kl=c.dynCall_ii=(d,m)=>(kl=c.dynCall_ii=te.sb)(d,m),Dl=d=>(Dl=te.tb)(d),Bl=()=>(Bl=te.ub)(),Ll=d=>(Ll=te.vb)(d),Rl=()=>(Rl=te.wb)();function Nl(){if(!(0<rt))if(g)l(c),g||oo(tn),startWorker(c);else{if(c.preRun)for(typeof c.preRun=="function"&&(c.preRun=[c.preRun]);c.preRun.length;)Ke.unshift(c.preRun.shift());oo(Ke),0<rt||po||(po=!0,c.calledRun=!0,tt||(g||oo(tn),l(c),g||oo(mt)))}}return c.___start_em_js=1349341,c.___stop_em_js=1349502,c.stackSave=()=>wa(),c.stackRestore=d=>go(d),c.stackAlloc=d=>va(d),c.UTF8ToString=ot,c.stringToUTF8=rn,c.lengthBytesUTF8=ia,hr=function d(){po||Nl(),po||(hr=d)},Nl(),p}),k_=Ih;globalThis.self?.name==="em-pthread"&&Ih()});var wn,D_,B_,L_,Ah,Ph,R_,Oh,Hn=C(()=>{"use strict";hi();wn=!1?void 0:import.meta.url??(typeof document<"u"?document.currentScript?.src:typeof self<"u"?self.location?.href:void 0),D_=!1||typeof location>"u"?void 0:location.origin,B_=(r,e)=>{try{let n=e??wn;return(n?new URL(r,n):new URL(r)).origin===D_}catch{return!1}},L_=async r=>{let n=await(await fetch(r,{credentials:"same-origin"})).blob();return URL.createObjectURL(n)},Ah=(_h(),Pn(Th)).default,Ph=async()=>{if(!wn)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(B_(wn))return[void 0,Ah()];let r=await L_(wn);return[r,Ah(r)]},R_=($h(),Pn(Sh)).default,Oh=async(r,e,n)=>[void 0,R_]});var Bs,Ls,Ii,Eh,N_,z_,gi,Ye,Kr=C(()=>{"use strict";Hn();Ls=!1,Ii=!1,Eh=!1,N_=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},z_=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},gi=async r=>{if(Ls)return Promise.resolve();if(Ii)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Eh)throw new Error("previous call to 'initializeWebAssembly()' failed.");Ii=!0;let e=r.initTimeout,n=r.numThreads;if(!z_())throw new Error("WebAssembly SIMD is not supported in the current environment.");let t=N_();n>1&&!t&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+n+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),r.numThreads=n=1);let o=r.wasmPaths,i=typeof o=="string"?o:void 0,s=o?.mjs,a=s?.href??s,u=o?.wasm,l=u?.href??u,[f,c]=await Oh(a,i,n>1),p=!1,b=[];if(e>0&&b.push(new Promise(h=>{setTimeout(()=>{p=!0,h()},e)})),b.push(new Promise((h,g)=>{let T={numThreads:n};(l||i)&&(T.locateFile=(w,v)=>l??(i??v)+w),c(T).then(w=>{Ii=!1,Ls=!0,Bs=w,h(),f&&URL.revokeObjectURL(f)},w=>{Ii=!1,Eh=!0,g(w)})})),await Promise.race(b),p)throw new Error(`WebAssembly backend initializing failed due to timeout: ${e}ms`)},Ye=()=>{if(Ls&&Bs)return Bs;throw new Error("WebAssembly is not initialized yet.")}});var nt,Kn,Ue,Si=C(()=>{"use strict";Kr();nt=(r,e)=>{let n=Ye(),t=n.lengthBytesUTF8(r)+1,o=n._malloc(t);return n.stringToUTF8(r,o,t),e.push(o),o},Kn=(r,e,n,t)=>{if(typeof r=="object"&&r!==null){if(n.has(r))throw new Error("Circular reference in options");n.add(r)}Object.entries(r).forEach(([o,i])=>{let s=e?e+o:o;if(typeof i=="object")Kn(i,s+".",n,t);else if(typeof i=="string"||typeof i=="number")t(s,i.toString());else if(typeof i=="boolean")t(s,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},Ue=r=>{let e=Ye(),n=e.stackSave();try{let t=e.stackAlloc(8);e._OrtGetLastError(t,t+4);let o=e.HEAP32[t/4],i=e.HEAPU32[t/4+1],s=i?e.UTF8ToString(i):"";throw new Error(`${r} ERROR_CODE: ${o}, ERROR_MESSAGE: ${s}`)}finally{e.stackRestore(n)}}});var Ch,kh=C(()=>{"use strict";Kr();Si();Ch=r=>{let e=Ye(),n=0,t=[],o=r||{};try{if(r?.logSeverityLevel===void 0)o.logSeverityLevel=2;else if(typeof r.logSeverityLevel!="number"||!Number.isInteger(r.logSeverityLevel)||r.logSeverityLevel<0||r.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${r.logSeverityLevel}`);if(r?.logVerbosityLevel===void 0)o.logVerbosityLevel=0;else if(typeof r.logVerbosityLevel!="number"||!Number.isInteger(r.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${r.logVerbosityLevel}`);r?.terminate===void 0&&(o.terminate=!1);let i=0;return r?.tag!==void 0&&(i=nt(r.tag,t)),n=e._OrtCreateRunOptions(o.logSeverityLevel,o.logVerbosityLevel,!!o.terminate,i),n===0&&Ue("Can't create run options."),r?.extra!==void 0&&Kn(r.extra,"",new WeakSet,(s,a)=>{let u=nt(s,t),l=nt(a,t);e._OrtAddRunConfigEntry(n,u,l)!==0&&Ue(`Can't set a run config entry: ${s} - ${a}.`)}),[n,t]}catch(i){throw n!==0&&e._OrtReleaseRunOptions(n),t.forEach(s=>e._free(s)),i}}});var F_,M_,V_,G_,Dh,Bh=C(()=>{"use strict";Kr();Si();F_=r=>{switch(r){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${r}`)}},M_=r=>{switch(r){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${r}`)}},V_=r=>{r.extra||(r.extra={}),r.extra.session||(r.extra.session={});let e=r.extra.session;e.use_ort_model_bytes_directly||(e.use_ort_model_bytes_directly="1"),r.executionProviders&&r.executionProviders.some(n=>(typeof n=="string"?n:n.name)==="webgpu")&&(r.enableMemPattern=!1)},G_=(r,e,n)=>{for(let t of e){let o=typeof t=="string"?t:t.name;switch(o){case"webnn":if(o="WEBNN",typeof t!="string"){let a=t?.deviceType;if(a){let u=nt("deviceType",n),l=nt(a,n);Ye()._OrtAddSessionConfigEntry(r,u,l)!==0&&Ue(`Can't set a session config entry: 'deviceType' - ${a}.`)}}break;case"webgpu":if(o="JS",typeof t!="string"){let s=t;if(s?.preferredLayout){if(s.preferredLayout!=="NCHW"&&s.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${s.preferredLayout}`);let a=nt("preferredLayout",n),u=nt(s.preferredLayout,n);Ye()._OrtAddSessionConfigEntry(r,a,u)!==0&&Ue(`Can't set a session config entry: 'preferredLayout' - ${s.preferredLayout}.`)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${o}`)}let i=nt(o,n);Ye()._OrtAppendExecutionProvider(r,i)!==0&&Ue(`Can't append execution provider: ${o}.`)}},Dh=r=>{let e=Ye(),n=0,t=[],o=r||{};V_(o);try{let i=F_(o.graphOptimizationLevel??"all"),s=M_(o.executionMode??"sequential"),a=typeof o.logId=="string"?nt(o.logId,t):0,u=o.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log serverity level is not valid: ${u}`);let l=o.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let f=typeof o.optimizedModelFilePath=="string"?nt(o.optimizedModelFilePath,t):0;if(n=e._OrtCreateSessionOptions(i,!!o.enableCpuMemArena,!!o.enableMemPattern,s,!!o.enableProfiling,0,a,u,l,f),n===0&&Ue("Can't create session options."),o.executionProviders&&G_(n,o.executionProviders,t),o.enableGraphCapture!==void 0){if(typeof o.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);let c=nt("enableGraphCapture",t),p=nt(o.enableGraphCapture.toString(),t);e._OrtAddSessionConfigEntry(n,c,p)!==0&&Ue(`Can't set a session config entry: 'enableGraphCapture' - ${o.enableGraphCapture}.`)}if(o.freeDimensionOverrides)for(let[c,p]of Object.entries(o.freeDimensionOverrides)){if(typeof c!="string")throw new Error(`free dimension override name must be a string: ${c}`);if(typeof p!="number"||!Number.isInteger(p)||p<0)throw new Error(`free dimension override value must be a non-negative integer: ${p}`);let b=nt(c,t);e._OrtAddFreeDimensionOverride(n,b,p)!==0&&Ue(`Can't set a free dimension override: ${c} - ${p}.`)}return o.extra!==void 0&&Kn(o.extra,"",new WeakSet,(c,p)=>{let b=nt(c,t),h=nt(p,t);e._OrtAddSessionConfigEntry(n,b,h)!==0&&Ue(`Can't set a session config entry: ${c} - ${p}.`)}),[n,t]}catch(i){throw n!==0&&e._OrtReleaseSessionOptions(n),t.forEach(s=>e._free(s)),i}}});var Rs,Ar,jr,$i,jn,Ai,Ns,ue=C(()=>{"use strict";Rs=r=>{switch(r){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;default:throw new Error(`unsupported data type: ${r}`)}},Ar=r=>{switch(r){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";default:throw new Error(`unsupported data type: ${r}`)}},jr=r=>[void 0,4,1,1,2,2,4,8,void 0,1,2,8,4,8,void 0,void 0,void 0][r],$i=r=>{switch(r){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${r}`)}},jn=r=>{switch(r){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${r}`)}},Ai=r=>r==="float32"||r==="float16"||r==="int32"||r==="int64"||r==="uint32"||r==="uint8"||r==="bool",Ns=r=>{switch(r){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;default:throw new Error(`unsupported data location: ${r}`)}}});var Xn,zs=C(()=>{"use strict";hi();Xn=async r=>{if(typeof r=="string")if(!1)try{let{readFile:e}=Ta("node:fs/promises");return new Uint8Array(await e(r))}catch(e){if(e.code==="ERR_FS_FILE_TOO_LARGE"){let{createReadStream:n}=Ta("node:fs"),t=n(r),o=[];for await(let i of t)o.push(i);return new Uint8Array(Buffer.concat(o))}throw e}else{let e=await fetch(r);if(!e.ok)throw new Error(`failed to load external data file: ${r}`);let n=e.headers.get("Content-Length"),t=n?parseInt(n,10):0;if(t<1073741824)return new Uint8Array(await e.arrayBuffer());{if(!e.body)throw new Error(`failed to load external data file: ${r}, no response body.`);let o=e.body.getReader(),i;try{i=new ArrayBuffer(t)}catch(a){if(a instanceof RangeError){let u=Math.ceil(t/65536);i=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw a}let s=0;for(;;){let{done:a,value:u}=await o.read();if(a)break;let l=u.byteLength;new Uint8Array(i,s,l).set(u),s+=l}return new Uint8Array(i,0,t)}}else return r instanceof Blob?new Uint8Array(await r.arrayBuffer()):r instanceof Uint8Array?r:new Uint8Array(r)}});var U_,W_,Lh,Rh,Nh,H_,Ne,mr=C(()=>{"use strict";ue();U_=["V","I","W","E","F"],W_=(r,e)=>{console.log(`[${U_[r]},${new Date().toISOString()}]${e}`)},Nh=(r,e)=>{Lh=r,Rh=e},H_=(r,e)=>{let n=jn(r),t=jn(Lh);n>=t&&W_(n,typeof e=="function"?e():e)},Ne=(...r)=>{Rh&&H_(...r)}});var zh,Fh=C(()=>{"use strict";ue();zh=(r,e)=>new($i(e))(r)});var Pi=C(()=>{"use strict"});var Mh,Fs,Ms,q_,K_,Vh,Gs,Vs,Uh,Wh=C(()=>{"use strict";mr();Pi();Mh=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Fs=[],Ms=r=>Math.ceil(r/16)*16,q_=r=>{for(let e=0;e<Fs.length;e++){let n=Fs[e];if(r<=n)return n}return Math.ceil(r/16)*16},K_=1,Vh=()=>K_++,Gs=async(r,e,n,t)=>{let o=Ms(n),i=r.device.createBuffer({size:o,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=r.getCommandEncoder();r.endComputePass(),s.copyBufferToBuffer(e,0,i,0,o),r.flush(),await i.mapAsync(GPUMapMode.READ);let a=i.getMappedRange();if(t){let u=t();return u.set(new Uint8Array(a,0,n)),u}else return new Uint8Array(a.slice(0,n))}finally{i.destroy()}},Vs=class{constructor(e){this.backend=e;this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersForUploadingPending=[],this.buffersPending=[],this.externalBuffers=new Map,this.capturedPendingBuffers=new Map;for(let[n]of Mh)Fs.push(n),this.freeBuffers.set(n,[]),this.freeUniformBuffers.set(n,[])}upload(e,n){let t=n.buffer,o=n.byteOffset,i=n.byteLength,s=Ms(i),a=this.storageCache.get(e);if(!a)throw new Error("gpu data for uploading does not exist");if(a.originalSize!==i)throw new Error(`inconsistent data size. gpu data size=${a.originalSize}, data size=${i}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:s,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(t,o,i)),u.unmap();let f=this.backend.getCommandEncoder();this.backend.endComputePass(),f.copyBufferToBuffer(u,0,a.gpuData.buffer,0,s),Ne("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`),this.buffersForUploadingPending.push(u)}memcpy(e,n){let t=this.storageCache.get(e);if(!t)throw new Error("source gpu data for memcpy does not exist");let o=this.storageCache.get(n);if(!o)throw new Error("destination gpu data for memcpy does not exist");if(t.originalSize!==o.originalSize)throw new Error("inconsistent source and destination gpu data size");let i=Ms(t.originalSize),s=this.backend.getCommandEncoder();this.backend.endComputePass(),s.copyBufferToBuffer(t.gpuData.buffer,0,o.gpuData.buffer,0,i)}registerExternalBuffer(e,n,t){let o;if(t){if(o=this.externalBuffers.get(t),o===void 0)throw new Error("previous buffer is not registered");if(e===t)return Ne("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${n}) => id=${o}, buffer is the same, skip.`),o;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`);this.externalBuffers.delete(t)}else o=Vh();return this.storageCache.set(o,{gpuData:{id:o,type:0,buffer:e},originalSize:n}),this.externalBuffers.set(e,o),Ne("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${n}) => id=${o}, registered.`),o}unregisterExternalBuffer(e){let n=this.externalBuffers.get(e);n!==void 0&&(this.storageCache.delete(n),this.externalBuffers.delete(e),Ne("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${n}`))}create(e,n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let t=q_(e),o,i=(n&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,s=(n&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||s){let l=(i?this.freeBuffers:this.freeUniformBuffers).get(t);l?l.length>0?o=l.pop():o=this.backend.device.createBuffer({size:t,usage:n}):o=this.backend.device.createBuffer({size:t,usage:n})}else o=this.backend.device.createBuffer({size:t,usage:n});let a={id:Vh(),type:0,buffer:o};return this.storageCache.set(a.id,{gpuData:a,originalSize:e}),Ne("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${a.id}`),a}get(e){return this.storageCache.get(e)?.gpuData}release(e){let n=this.storageCache.get(e);if(!n)throw new Error("releasing data does not exist");return Ne("verbose",()=>`[WebGPU] GpuDataManager.release(id=${e}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(e),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,n){let t=this.storageCache.get(e);if(!t)throw new Error("data does not exist");await Gs(this.backend,t.gpuData.buffer,t.originalSize,n)}refreshPendingBuffers(){for(let e of this.buffersForUploadingPending)e.destroy();if(this.buffersForUploadingPending=[],this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let n=Mh.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let t=this.freeBuffers.get(e.size)||[];n===void 0||t.length>=n?e.destroy():t.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let t=this.freeUniformBuffers.get(e.size)||[];n===void 0||t.length>=n?e.destroy():t.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let n of this.buffersPending)e.push(n);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(n=>{n.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(n=>{n.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(n=>{n.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onReleaseSession(e){let n=this.capturedPendingBuffers.get(e);n&&(n.forEach(t=>{t.destroy()}),this.capturedPendingBuffers.delete(e))}},Uh=(...r)=>new Vs(...r)});var Us,de,et=C(()=>{"use strict";Us=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},de=r=>new Us(r)});var Ws,nr,B,Xr,Oi,Ei,Ci,ye=C(()=>{"use strict";Ws=class{static calcMatMulShape(e,n){return e[1]!==n[0]?void 0:[e[0],n[1]]}},nr=class{static calcShape(e,n,t=!1){let o=e.length,i=n.length;if(o===0)return n;if(i===0)return e;let s=Math.max(e.length,n.length),a=new Array(s);if(t){if(o<2||i<2)return;let u=Ws.calcMatMulShape([e[o-2],e[o-1]],[n[i-2],n[i-1]]);if(u===void 0)return;[a[s-2],a[s-1]]=u}for(let u=t?3:1;u<=s;u++){let l=o-u<0?1:e[o-u],f=i-u<0?1:n[i-u];if(l!==f&&l>1&&f>1)return;let c=Math.max(l,f);if(l&&f)a[s-u]=Math.max(l,f);else{if(c>1)return;a[s-u]=0}}return a}static isValidBroadcast(e,n){let t=e.length,o=n.length;if(t>o)return!1;for(let i=1;i<=t;i++)if(e[t-i]!==1&&e[t-i]!==n[o-i])return!1;return!0}},B=class r{static size(e){return r.getSizeFromDimensionRange(e,0,e.length)}static convertShape(e,n=4){let t=e.length;if(t===0)return[];let o=new Array(t),i=t-1;for(;i>=0;){if(e[i]%n===0){o[i]=e[i]/n;break}if(n%e[i]!==0)throw new Error("cannot convert shape");o[i]=1,n/=e[i],i--}for(i--;i>=0;i--)o[i]=e[i];return o}static sizeFromDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,n,e.length)}static sizeToDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,0,n)}static getSizeFromDimensionRange(e,n,t){let o=1;for(let i=n;i<t;i++){if(e[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");o*=e[i]}return o}static computeStrides(e){let n=e.length;if(n===0)return[];if(n===1)return[1];let t=new Array(n);t[n-1]=1,t[n-2]=e[n-1];for(let o=n-3;o>=0;--o)t[o]=t[o+1]*e[o+1];return t}static normalizeAxis(e,n){if(e<-n&&e>=n)throw new Error("unsupported axis for this operation.");return e<0?e+n:e}static normalizeAxes(e,n){return e.map(t=>this.normalizeAxis(t,n??e.length))}static sortBasedOnPerm(e,n){return n?n.map(t=>e[t]):e.slice().reverse()}static padShape(e,n){let t=e.length;return e.map((o,i)=>o+n[i]+n[i+t])}static areEqual(e,n){return e.length!==n.length?!1:e.every((t,o)=>t===n[o])}},Xr=class r{static adjustPoolAttributes(e,n,t,o,i,s){if(!e&&t.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let a=0;a<n.length-2;a++)a>=t.length?t.push(n[a+2]):t[a]=n[a+2];for(let a=0;a<t.length;a++)if(a<o.length){if(o[a]<0)throw new Error("strides should be greater than or equal to 1")}else o.push(1);for(let a=0;a<t.length;a++)if(a<i.length){if(i[a]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let a=0;a<t.length*2;a++)if(a<s.length){if(s[a]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let a=0;a<t.length;a++){if(t[a]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[a]>=t[a]||s[a+t.length]>=t[a])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(e,n,t,o,i,s,a){if(a){if(i.length!==2*(e.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==e.length-2)throw new Error("length of strides should be the length of data dimensions");if(o.length!==e.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<e.length-2;u++)r.adjustPadAndReturnShape(e[u+(s?1:2)],n[u],t[u],o[u],i,u,u+e.length-2,a)}}static computePoolOutputShape(e,n,t,o,i,s,a){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let u=[n[0],n[1]];return r.computeShapeHelper(e,n,u,t,o,i,s,a),u}static computeConvOutputShape(e,n,t,o,i,s,a){if(e.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[e[0],n[0]];return r.computeShapeHelper(!1,e,u,t,o,i,s,a),u}static computeShapeHelper(e,n,t,o,i,s,a,u){if(e)for(let l=0;l<n.length-2;l++)t.push(1);else for(let l=0;l<n.length-2;l++)t.push(r.adjustPadAndReturnShape(n[l+2],o[l],i[l],s[l],a,l,l+n.length-2,u))}static adjustPadAndReturnShape(e,n,t,o,i,s,a,u){let l=t*(o-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return i[s]=0,i[a]=0,Math.floor((e-l)/n+1);case"SAME_LOWER":case"SAME_UPPER":if(t!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((e+n-1)/n-1)*n+o-e;return i[s]=Math.floor(u==="SAME_LOWER"?(c+1)/2:c/2),i[a]=c-i[s],Math.floor((e+c-o)/n+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((e+i[s]+i[a]-l)/n+1)}},Oi=class{static getShapeOfGemmResult(e,n,t,o,i){if(e.length!==2||t.length!==2)throw new Error("shape need to be of size 2");let s,a,u;n?(s=e[1],a=e[0]):(s=e[0],a=e[1]);let l=-1;if(o?(u=t[0],l=1):(u=t[1],l=0),t[l]!==a)throw new Error("dimension mismatch");if(s<=0||u<=0||a<=0)throw new Error("invalid shape specified");if(i&&!nr.isValidBroadcast(i,[s,u]))throw new Error("gemm: invalid bias shape for broadcast");return[s,u,a]}},Ei=-34028234663852886e22,Ci=34028234663852886e22});var Zr,qs,Be,ct,W,ze,Pr,Yr,Ut,Z,Ks,D,G,ki,Hs,Hh,_n,he=C(()=>{"use strict";ue();ye();Zr=64,qs=(r,e)=>{if(e===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(r){case 10:return e>1?`vec${e}<f16>`:"f16";case 1:return e>1?`vec${e}<f32>`:"f32";case 6:return e>1?`vec${e}<i32>`:"i32";case 12:return e>1?`vec${e}<u32>`:"u32";case 7:if(e>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(e>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(e!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];default:throw new Error(`Unknown data type: ${r}`)}},Be=(r,e=1)=>{let n=qs(r,e);return typeof n=="string"?n:n[0]},ct=(r,e=1)=>{let n=qs(r,e);return typeof n=="string"?n:n[1]},W=(...r)=>{let e=[];return r.forEach(n=>{n.length!==0&&e.push({type:12,data:n},{type:12,data:B.computeStrides(n)})}),e},ze=r=>r%4===0?4:r%2===0?2:1,Pr=(r="f32",e,n="0")=>!e||e===1?`${r}(${n})`:`vec${e}<${r}>(${n})`,Yr=(r,e,n)=>r==="f32"?n:e===1?`f32(${n})`:`vec${e}<f32>(${n})`,Ut=(r,e)=>e===4?`(${r}.x + ${r}.y + ${r}.z + ${r}.w)`:e===2?`(${r}.x + ${r}.y)`:e===3?`(${r}.x + ${r}.y + ${r}.z)`:r,Z=(r,e,n,t)=>r.startsWith("uniforms.")&&n>4?typeof e=="string"?t==="f16"?`${r}[(${e}) / 8][(${e}) % 8 / 4][(${e}) % 8 % 4]`:`${r}[(${e}) / 4][(${e}) % 4]`:t==="f16"?`${r}[${Math.floor(e/8)}][${Math.floor(e%8/4)}][${e%8%4}]`:`${r}[${Math.floor(e/4)}][${e%4}]`:n>1?`${r}[${e}]`:r,Ks=(r,e,n,t,o)=>{let i=typeof n=="number",s=i?n:n.length,a=[...new Array(s).keys()],u=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,l=qs(e,o),f=typeof l=="string"?l:l[1],c=typeof l=="string"?l:l[0],p={indices:u,value:f,storage:c,tensor:e},b=V=>typeof V=="string"?V:`${V}u`,h={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},g=i?"uniforms.":"",T=`${g}${r}_shape`,w=`${g}${r}_strides`,v="";for(let V=0;V<s-1;V++)v+=`
    let dim${V} = current / ${Z(w,V,s)};
    let rest${V} = current % ${Z(w,V,s)};
    indices[${V}] = dim${V};
    current = rest${V};
    `;v+=`indices[${s-1}] = current;`;let S=s<2?"":`
  fn o2i_${r}(offset: u32) -> ${p.indices} {
    var indices: ${p.indices};
    var current = offset;
    ${v}
    return indices;
  }`,$=V=>(h.offsetToIndices=!0,s<2?V:`o2i_${r}(${V})`),P=[];if(s>=2)for(let V=s-1;V>=0;V--)P.push(`${Z(w,V,s)} * (indices[${V}])`);let E=s<2?"":`
  fn i2o_${r}(indices: ${p.indices}) -> u32 {
    return ${P.join("+")};
  }`,N=V=>(h.indicesToOffset=!0,s<2?V:`i2o_${r}(${V})`),z=(...V)=>s===0?"0u":`${p.indices}(${V.map(b).join(",")})`,q=(V,ie)=>s<2?`${V}`:`${Z(V,ie,s)}`,K=(V,ie,Te)=>s<2?`${V}=${Te};`:`${Z(V,ie,s)}=${Te};`,F={},_e=(V,ie)=>{h.broadcastedIndicesToOffset=!0;let Te=`${ie.name}broadcastedIndicesTo${r}Offset`;if(Te in F)return`${Te}(${V})`;let tt=[];for(let Fe=s-1;Fe>=0;Fe--){let Ke=ie.indicesGet("outputIndices",Fe+ie.rank-s);tt.push(`${q(w,Fe)} * (${Ke} % ${q(T,Fe)})`)}return F[Te]=`fn ${Te}(outputIndices: ${ie.type.indices}) -> u32 {
             return ${tt.length>0?tt.join("+"):"0u"};
           }`,`${Te}(${V})`},$e=(V,ie)=>(()=>{if(p.storage===p.value)return`${r}[${V}]=${ie};`;if(p.storage==="vec2<u32>"&&p.value==="i32")return`${r}[${V}]=vec2<u32>(u32(${ie}), select(0u, 0xFFFFFFFFu, ${ie} < 0));`;if(p.storage==="vec2<u32>"&&p.value==="u32")return`${r}[${V}]=vec2<u32>(u32(${ie}), 0u);`;if(p.storage==="u32"&&p.value==="vec4<bool>")return`${r}[${V}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${ie}));`;throw new Error(`not supported combination of storage type ${p.storage} and value type ${p.value} yet`)})(),ae=V=>(()=>{if(p.storage===p.value)return`${r}[${V}]`;if(p.storage==="vec2<u32>"&&p.value==="i32")return`i32(${r}[${V}].x)`;if(p.storage==="vec2<u32>"&&p.value==="u32")return`u32(${r}[${V}].x)`;if(p.storage==="u32"&&p.value==="vec4<bool>")return`vec4<bool>(bool(${r}[${V}] & 0xFFu), bool(${r}[${V}] & 0xFF00u), bool(${r}[${V}] & 0xFF0000u), bool(${r}[${V}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${p.storage} and value type ${p.value} yet`)})(),qe=s<2?"":`
  fn get_${r}ByIndices(indices: ${p.indices}) -> ${f} {
    return ${ae(`i2o_${r}(indices)`)};
  }`,Q=s<2?"":(()=>{let V=a.map(Te=>`d${Te}: u32`).join(", "),ie=a.map(Te=>`d${Te}`).join(", ");return`
  fn get_${r}(${V}) -> ${f} {
    return get_${r}ByIndices(${z(ie)});
  }`})(),ge=(...V)=>{if(V.length!==s)throw new Error(`indices length must be ${s}`);let ie=V.map(b).join(",");return s===0?ae("0u"):s===1?ae(ie[0]):(h.get=!0,h.getByIndices=!0,h.indicesToOffset=!0,`get_${r}(${ie})`)},Ie=V=>s<2?ae(V):(h.getByIndices=!0,h.indicesToOffset=!0,`get_${r}ByIndices(${V})`),xe=s<2?"":`
  fn set_${r}ByIndices(indices: ${p.indices}, value: ${f}) {
    ${$e(`i2o_${r}(indices)`,"value")}
  }`,se=s<2?"":(()=>{let V=a.map(Te=>`d${Te}: u32`).join(", "),ie=a.map(Te=>`d${Te}`).join(", ");return`
  fn set_${r}(${V}, value: ${f}) {
    set_${r}ByIndices(${z(ie)}, value);
  }`})();return{impl:()=>{let V=[],ie=!1;return h.offsetToIndices&&(V.push(S),ie=!0),h.indicesToOffset&&(V.push(E),ie=!0),h.broadcastedIndicesToOffset&&(Object.values(F).forEach(Te=>V.push(Te)),ie=!0),h.set&&(V.push(se),ie=!0),h.setByIndices&&(V.push(xe),ie=!0),h.get&&(V.push(Q),ie=!0),h.getByIndices&&(V.push(qe),ie=!0),!i&&ie&&V.unshift(`const ${T} = ${p.indices}(${n.join(",")});`,`const ${w} = ${p.indices}(${B.computeStrides(n).join(",")});`),V.join(`
`)},type:p,offsetToIndices:$,indicesToOffset:N,broadcastedIndicesToOffset:_e,indices:z,indicesGet:q,indicesSet:K,set:(...V)=>{if(V.length!==s+1)throw new Error(`indices length must be ${s}`);let ie=V[s];if(typeof ie!="string")throw new Error("value must be string");let Te=V.slice(0,s).map(b).join(",");return s===0?$e("0u",ie):s===1?$e(Te[0],ie):(h.set=!0,h.setByIndices=!0,h.indicesToOffset=!0,`set_${r}(${Te}, ${ie})`)},setByOffset:$e,setByIndices:(V,ie)=>s<2?$e(V,ie):(h.setByIndices=!0,h.indicesToOffset=!0,`set_${r}ByIndices(${V}, ${ie});`),get:ge,getByOffset:ae,getByIndices:Ie,usage:t,name:r,strides:w,shape:T,rank:s}},D=(r,e,n,t=1)=>Ks(r,e,n,"input",t),G=(r,e,n,t=1)=>Ks(r,e,n,"output",t),ki=(r,e,n,t=1)=>Ks(r,e,n,"internal",t),Hs=class{constructor(e,n){this.normalizedDispatchGroup=e;this.limits=n;this.internalVariables=[];this.variables=[];this.uniforms=[];this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Zr){let n=typeof e=="number"?e:e[0],t=typeof e=="number"?1:e[1],o=typeof e=="number"?1:e[2];if(n>this.limits.maxComputeWorkgroupSizeX||t>this.limits.maxComputeWorkgroupSizeY||o>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${n}, ${t}, ${o}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(n*t*o>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${n}, ${t}, ${o}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,s=i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,a=i?"let global_idx = global_id.x; let local_idx = local_id.x;":`let global_idx = (workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
          workgroup_id.y * num_workgroups[0] + workgroup_id.x) * ${n*t*o}u + local_idx;`;return`@compute @workgroup_size(${n}, ${t}, ${o})
  fn main(${s}) {
    ${a}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,n){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let t=e.usage==="input"?"read":"read_write",o=e.type.storage;return`@group(0) @binding(${n}) var<storage, ${t}> ${e.name}: array<${o}>;`}declareVariables(...e){return e.map(n=>this.declareVariable(n,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(n=>this.registerInternalVariable(n)),this}registerUniform(e,n,t=1){return this.uniforms.push({name:e,type:n,length:t}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:n,type:t,length:o}of this.uniforms)if(o&&o>4)t==="f16"?e.push(`@align(16) ${n}:array<mat2x4<${t}>, ${Math.ceil(o/8)}>`):e.push(`${n}:array<vec4<${t}>, ${Math.ceil(o/4)}>`);else{let i=o==null||o===1?t:`vec${o}<${t}>`;e.push(`${n}:${i}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=n=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(n)];return this.uniforms.map(n=>[e(n.type),n.length??1])}},Hh=(r,e)=>new Hs(r,e),_n=(r,e)=>{let n=r.length,t=[];for(let o=0;o<n;o++){let i=n-1-o,s=r[i]||1;(e[e.length-1-o]||1)>1&&s===1&&t.unshift(i)}return t}});var j_,qh,X_,Z_,Tt,Kh,jh,Jr=C(()=>{"use strict";ue();ye();et();he();j_=r=>{if(!r||r.length!==1)throw new Error("Transpose requires 1 input.")},qh=(r,e)=>e&&e.length!==r?[...new Array(r).keys()].reverse():e,X_=(r,e)=>B.sortBasedOnPerm(r,qh(r.length,e)),Z_=(r,e,n,t)=>{let o=[];o.push(`fn perm(i: ${t.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let i=0;i<e;++i)o.push(n.indicesSet("a",r[i],`i[${i}]`));return o.push("return a;}"),o.join(`
`)},Tt=(r,e)=>{let n=r.dataType,t=r.dims.length,o=qh(t,e),i=X_(r.dims,o),s=G("output",n,i.length),a=D("a",n,t),u;if(o.length===2&&o[0]===1&&o[1]===0){let l=s.type.value,f=[16,16,1];u=c=>`
  ${c.registerUniform("output_size","u32").declareVariables(a,s)}
  var<workgroup> tile : array<array<${l}, ${f[0]+1}>, ${f[0]}>;
  ${c.mainStart(f)}
    var x = workgroup_id.x * ${f[0]}u + local_id.x;
    var y = workgroup_id.y * ${f[0]}u + local_id.y;
    let width = uniforms.output_shape[0];
    let height = uniforms.output_shape[1];
    if (x < width && y < height) {
      tile[local_id.y][local_id.x] = ${a.getByOffset("y * width + x")};
    }
    workgroupBarrier();
    x = workgroup_id.y * ${f[0]}u + local_id.x;
    y = workgroup_id.x * ${f[0]}u + local_id.y;
    if (x < height && y < width) {
      ${s.setByOffset("y * height + x","tile[local_id.x][local_id.y]")}
    }
  }`}else u=l=>`
  ${l.registerUniform("output_size","u32").declareVariables(a,s)}

  ${Z_(o,t,a,s)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${s.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${s.setByOffset("global_idx",a.getByIndices("aIndices"))}
  }`;return{name:"Transpose",shaderCache:{hint:`${e}`,inputDependencies:["rank"]},getRunData:l=>{let f=B.size(i);return{outputs:[{dims:i,dataType:l[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:[{type:12,data:f},...W(l[0].dims,i)]}},getShaderSource:u}},Kh=(r,e)=>{j_(r.inputs),r.compute(Tt(r.inputs[0],e.perm))},jh=r=>de({perm:r.perm})});var Y_,J_,Q_,e2,t2,r2,n2,o2,i2,a2,or,Xh,Zh,Yh,Jh,Qh,eg,tg,rg,ng,og,ig=C(()=>{"use strict";ue();ye();he();Di();Jr();Y_={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},J_={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Q_={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},e2={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},t2=(r,e)=>{let n=[];for(let t=e-r;t<e;++t)n.push(t);return n},r2=(r,e)=>{let n=[],t=r.length;for(let i=0;i<t;i++)e.indexOf(i)===-1&&n.push(r[i]);let o=e.map(i=>r[i]);return[n,o]},n2=(r,e)=>{let n=r.length+e.length,t=[],o=0;for(let i=0;i<n;i++)e.indexOf(i)===-1?t.push(r[o++]):t.push(1);return t},o2=(r,e)=>{for(let n=0;n<r.length;++n)if(r[r.length-n-1]!==e-1-n)return!1;return!0},i2=(r,e)=>{let n=[];if(!o2(r,e)){for(let t=0;t<e;++t)r.indexOf(t)===-1&&n.push(t);r.forEach(t=>n.push(t))}return n},a2=(r,e,n,t,o,i,s)=>{let a=n[0].dims,u=B.size(i),l=B.size(s),f=D("_A",n[0].dataType,a),c=G("output",o,i),p=32,b=`
          var<workgroup> aBestValues : array<f32, ${p}>;
       `;return{name:r,shaderCache:e,getShaderSource:g=>`
        ${g.registerUniform("reduceSize","u32").declareVariables(f,c)}
        ${b}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${g.mainStart(p)}

          let outputIndex = global_idx / ${p};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Q_[t]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${p}) {
           let candidate = f32(${f.getByOffset("offset + k")});
           bestValue = ${Y_[t]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${p}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${J_[t]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${c.setByOffset("outputIndex",`${t==="mean"?`${c.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${c.type.storage}(${e2[t]})`}`)};
         }
        }`,getRunData:()=>({outputs:[{dims:i,dataType:o}],dispatchGroup:{x:u},programUniforms:[{type:12,data:l}]})}},or=(r,e,n,t)=>{let o=r.inputs.length===1?n:js(r.inputs,n),i=o.axes;i.length===0&&!o.noopWithEmptyAxes&&(i=r.inputs[0].dims.map((b,h)=>h));let s=B.normalizeAxes(i,r.inputs[0].dims.length),a=s,u=r.inputs[0],l=i2(a,r.inputs[0].dims.length);l.length>0&&(u=r.compute(Tt(r.inputs[0],l),{inputs:[0],outputs:[-1]})[0],a=t2(a.length,u.dims.length));let[f,c]=r2(u.dims,a),p=f;o.keepDims&&(p=n2(f,s)),r.compute(a2(e,{hint:o.cacheKey,inputDependencies:["type"]},[u],t,r.inputs[0].dataType,p,c),{inputs:[u]})},Xh=(r,e)=>{or(r,"ReduceMeanShared",e,"mean")},Zh=(r,e)=>{or(r,"ReduceL1Shared",e,"l1")},Yh=(r,e)=>{or(r,"ReduceL2Shared",e,"l2")},Jh=(r,e)=>{or(r,"ReduceLogSumExpShared",e,"logSumExp")},Qh=(r,e)=>{or(r,"ReduceMaxShared",e,"max")},eg=(r,e)=>{or(r,"ReduceMinShared",e,"min")},tg=(r,e)=>{or(r,"ReduceProdShared",e,"prod")},rg=(r,e)=>{or(r,"ReduceSumShared",e,"sum")},ng=(r,e)=>{or(r,"ReduceSumSquareShared",e,"sumSquare")},og=(r,e)=>{or(r,"ReduceLogSumShared",e,"logSum")}});var ir,s2,Bi,js,ar,u2,l2,c2,f2,d2,p2,m2,h2,g2,b2,sr,ag,sg,ug,lg,cg,fg,dg,pg,mg,hg,Di=C(()=>{"use strict";ue();ye();et();he();ig();ir=r=>{if(!r||r.length===0||r.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(r.length===2&&r[1].dims.length!==1)throw new Error("Invalid axes input dims.")},s2=r=>["","",`var value = ${r.getByIndices("input_indices")};`,""],Bi=(r,e,n,t,o,i,s=!1,a=!1)=>{let u=[],l=n[0].dims,f=l.length,c=B.normalizeAxes(o,f),p=!a&&c.length===0;l.forEach((T,w)=>{p||c.indexOf(w)>=0?s&&u.push(1):u.push(T)});let b=u.length,h=B.size(u);return{name:r,shaderCache:e,getShaderSource:T=>{let w=[],v=D("_A",n[0].dataType,f),S=G("output",i,b),$=t(v,S,c),P=$[2];for(let E=0,N=0;E<f;E++)p||c.indexOf(E)>=0?(s&&N++,P=`for(var j${E}: u32 = 0; j${E} < ${l[E]}; j${E}++) {
                  ${$[2].includes("last_index")?`let last_index = j${E};`:""}
                  ${v.indicesSet("input_indices",E,`j${E}`)}
                  ${P}
                }`):(w.push(`${v.indicesSet("input_indices",E,S.indicesGet("output_indices",N))};`),N++);return`

        ${T.registerUniform("output_size","u32").declareVariables(v,S)}

        ${T.mainStart()}
          ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${v.type.indices};
          let output_indices = ${S.offsetToIndices("global_idx")};

          ${w.join(`
`)}
          ${$[0]}       // init ops for reduce max/min
          ${$[1]}
          ${P}
          ${$[3]}
          ${$.length===4?S.setByOffset("global_idx","value"):$.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:i}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},...W(l,u)]})}},js=(r,e)=>{let n=[];return r[1].dims[0]>0&&r[1].getBigInt64Array().forEach(t=>n.push(Number(t))),de({axes:n,keepDims:e.keepDims,noopWithEmptyAxes:e.noopWithEmptyAxes})},ar=(r,e,n,t)=>{let o=r.inputs,i=o.length===1?n:js(o,n);r.compute(Bi(e,{hint:i.cacheKey,inputDependencies:["rank"]},[o[0]],i.noopWithEmptyAxes&&i.axes.length===0?s2:t,i.axes,o[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},u2=(r,e)=>{ir(r.inputs),ar(r,"ReduceLogSum",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${t.getByIndices("input_indices")};`,"value = log(value);"])},l2=(r,e)=>{ir(r.inputs),ar(r,"ReduceL1",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += abs(${t.getByIndices("input_indices")});`,""])},c2=(r,e)=>{ir(r.inputs),ar(r,"ReduceL2",e,(t,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${t.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},f2=(r,e)=>{ir(r.inputs),ar(r,"ReduceLogSumExp",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += exp(${t.getByIndices("input_indices")});`,"value = log(value);"])},d2=(r,e)=>{ir(r.inputs),ar(r,"ReduceMax",e,(t,o,i)=>{let s=[];for(let a=0;a<t.rank;a++)(i.indexOf(a)>=0||i.length===0)&&s.push(t.indicesSet("input_indices",a,0));return[`${s.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};`,`value = max(value, ${t.getByIndices("input_indices")});`,""]})},p2=(r,e)=>{ir(r.inputs),ar(r,"ReduceMean",e,(t,o,i)=>{let s=1;for(let a=0;a<t.rank;a++)(i.indexOf(a)>=0||i.length===0)&&(s*=r.inputs[0].dims[a]);return["var sum = f32(0);","",`sum += f32(${t.getByIndices("input_indices")});`,`let value = ${o.type.value}(sum / ${s});`]})},m2=(r,e)=>{ir(r.inputs),ar(r,"ReduceMin",e,(t,o,i)=>{let s=[];for(let a=0;a<t.rank;a++)(i.indexOf(a)>=0||i.length===0)&&s.push(`input_indices[${a}] = 0;`);return[`${s.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};`,`value = min(value, ${t.getByIndices("input_indices")});`,""]})},h2=(r,e)=>{ir(r.inputs),ar(r,"ReduceProd",e,(t,o)=>[`var value = ${o.type.storage}(1);`,"",`value *= ${t.getByIndices("input_indices")};`,""])},g2=(r,e)=>{ir(r.inputs),ar(r,"ReduceSum",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${t.getByIndices("input_indices")};`,""])},b2=(r,e)=>{ir(r.inputs),ar(r,"ReduceSumSquare",e,(t,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${t.getByIndices("input_indices")}; value += t * t;`,""])},sr=(r,e,n)=>{if(e.length===0)return n;let t=1,o=1;for(let i=0;i<e.length;i++)e.indexOf(i)===-1?t*=r[i]:o*=r[i];return o<32&&t>1024},ag=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?p2(r,e):Xh(r,e)},sg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?l2(r,e):Zh(r,e)},ug=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?c2(r,e):Yh(r,e)},lg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?f2(r,e):Jh(r,e)},cg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?d2(r,e):Qh(r,e)},fg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?m2(r,e):eg(r,e)},dg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?h2(r,e):tg(r,e)},pg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?g2(r,e):rg(r,e)},mg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?b2(r,e):ng(r,e)},hg=(r,e)=>{sr(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?u2(r,e):og(r,e)}});var gg,bg,yg,Xs,xg=C(()=>{"use strict";ue();et();Di();gg=r=>{if(!r||r.length===0||r.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(r[0].dataType!==1)throw new Error("Invalid input type.")},bg=(r,e)=>{gg(r.inputs);let n=(t,o,i)=>{let s=[];for(let a=0;a<t.rank;a++)(i.indexOf(a)>=0||i.length===0)&&s.push(`input_indices[${a}] = 0;`);return[`${s.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${t.getByIndices("input_indices")} ${e.selectLastIndex>0?"<=":"<"} value) {
         value = ${t.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};r.compute(Bi("ArgMin",{hint:e.cacheKey,inputDependencies:["rank"]},[r.inputs[0]],n,[e.axis],7,e.keepDims),{inputs:[0]})},yg=(r,e)=>{gg(r.inputs);let n=(t,o,i)=>{let s=[];for(let a=0;a<t.rank;a++)(i.indexOf(a)>=0||i.length===0)&&s.push(`input_indices[${a}] = 0;`);return[`${s.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${t.getByIndices("input_indices")} ${e.selectLastIndex>0?">=":">"} value) {
         value = ${t.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};r.compute(Bi("argMax",{hint:e.cacheKey,inputDependencies:["rank"]},[r.inputs[0]],n,[e.axis],7,e.keepDims),{inputs:[0]})},Xs=r=>de(r)});var y2,x2,v2,w2,In,T2,vg,Li=C(()=>{"use strict";ue();Pi();he();y2=(r,e)=>{let n=r[0],t=r[1],o=r[2],i=r[3],s=r[4],a=r[5];if(s&&a)throw new Error("Attention cannot have both past and relative_position_bias");if(n.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=n.dims[0],l=n.dims[1],f=n.dims[2];if(o.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(t.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(t.dims[0]!==f)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(o.dims[0]!==t.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let c=o.dims[0]/3,p=c,b=p;if(e.qkvHiddenSizes.length>0){if(e.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of e.qkvHiddenSizes)if(S%e.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");c=e.qkvHiddenSizes[0],p=e.qkvHiddenSizes[1],b=e.qkvHiddenSizes[2]}let h=l;if(c!==p)throw new Error("qkv_hidden_sizes first element should be same as the second");if(o.dims[0]!==c+p+b)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let g=0;if(s){if(p!==b)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==e.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==p/e.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');e.pastPresentShareBuffer||(g=s.dims[3])}let T=h+g,w=-1,v=0;if(i)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");return{batchSize:u,sequenceLength:l,pastSequenceLength:g,kvSequenceLength:h,totalSequenceLength:T,maxSequenceLength:w,inputHiddenSize:f,hiddenSize:c,vHiddenSize:b,headSize:Math.floor(c/e.numHeads),vHeadSize:Math.floor(b/e.numHeads),numHeads:e.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:e.maskFilterValue,maskType:v,scale:e.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},x2=(r,e,n,t)=>{let o=ze(t),i=64,s=t/o;s<i?i=1:s/8<64&&(i=Math.ceil(s/8));let a=Math.ceil(t/o/i),u=[{type:e.dataType,data:1/t},{type:12,data:s},{type:12,data:a}],l=Be(e.dataType,o),f=ct(1,o),c=p=>{let b=G("x",e.dataType,e.dims,o),g=[{name:"d_inv",type:ct(e.dataType)},{name:"d_comp",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${i}>;
  var<workgroup> thread_sum: array<f32, ${i}>;
  ${p.registerUniforms(g).declareVariables(b)}
  ${p.mainStart([i,1,1])}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = workgroup_id.x * uniforms.d_comp + local_offset;

    var thread_max_vector = ${f}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
      thread_max_vector = max(${f}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(o){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${i}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${f}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
      sum_vector += exp(${f}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(o){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${i}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
        x[offset + i] = ${b.type.value}(uniforms.d_inv);
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < uniforms.d_comp; i++) {
        var f32input = ${f}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${i};${l};${o}`},getShaderSource:c,getRunData:()=>({outputs:[],dispatchGroup:{x:n},programUniforms:u})}},v2=(r,e,n,t,o,i,s,a)=>{let u=a+i.kvSequenceLength,l=[i.batchSize,i.numHeads,i.sequenceLength,u],f=i.kvNumHeads===void 0&&r.outputCount>1,c=f?[i.batchSize,i.numHeads,u,i.headSize]:void 0,p=s.scale===0?1/Math.sqrt(i.headSize):s.scale,b=ze(i.headSize),h=i.headSize/b,g=12,T={x:Math.ceil(u/g),y:Math.ceil(i.sequenceLength/g),z:i.batchSize*i.numHeads},w=[{type:12,data:i.sequenceLength},{type:12,data:h},{type:12,data:u},{type:12,data:i.numHeads},{type:1,data:p},{type:12,data:a},{type:12,data:i.kvSequenceLength}],v=["type","type"];t&&v.push("type"),o&&v.push("type");let S=[{dims:l,dataType:e.dataType,gpuDataType:0}];f&&S.push({dims:c,dataType:e.dataType,gpuDataType:0});let $=P=>{let E=D("q",e.dataType,e.dims,b),N=D("key",n.dataType,n.dims,b),z=[E,N];if(t){let $e=D("past_key",t.dataType,t.dims,b);z.push($e)}o&&z.push(D("relative_position_bias",o.dataType,o.dims));let q=G("output",e.dataType,l),K=[q];f&&K.push(G("present_key",e.dataType,c,b));let F=ct(1,b),_e=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"}];return`
  const TILE_SIZE = ${g}u;

  var<workgroup> tileQ: array<${E.type.storage}, ${g*g}>;
  var<workgroup> tileK: array<${E.type.storage}, ${g*g}>;
  ${P.registerUniforms(_e).declareVariables(...z,...K)}
  ${P.mainStart([g,g,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let qOffset = uniforms.M * uniforms.K * headIdx + m * uniforms.K;
    ${(()=>t&&f?`
    let kOffset = uniforms.kv_sequence_length * uniforms.K * headIdx;
    let pastKeyOffset = uniforms.past_sequence_length * uniforms.K * headIdx;`:`
    let kOffset = uniforms.N * uniforms.K * headIdx + n * uniforms.K;`)()}
    ${f?"let presentKeyOffset = headIdx * uniforms.N * uniforms.K;":""}
    var value = ${F}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${(()=>t&&f?`
              if (n + local_id.y < uniforms.past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else {
                tileK[idx] =
                         key[kOffset + (n + local_id.y - uniforms.past_sequence_length) * uniforms.K + w + local_id.x];
              }`:"tileK[idx] = key[kOffset + local_id.y * uniforms.K + w + local_id.x];")()}
      ${f?"present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];":""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
        value += ${F}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    let headOffset = headIdx * uniforms.M * uniforms.N;
    if (global_id.y < uniforms.M && global_id.x < uniforms.N) {
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(b){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${b}`)}})()};
        output[outputIdx] = ${q.type.value} (sum * uniforms.alpha) + ${o?"relative_position_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${b};${o!==void 0};${t!==void 0};${r.outputCount}`,inputDependencies:v},getRunData:()=>({outputs:S,dispatchGroup:T,programUniforms:w}),getShaderSource:$}},w2=(r,e,n,t,o,i)=>{let s=i+o.kvSequenceLength,a=o.nReps?o.nReps:1,u=o.vHiddenSize*a,l=o.kvNumHeads==null&&r.outputCount>1,f=l?[o.batchSize,o.numHeads,s,o.headSize]:void 0,c=[o.batchSize,o.sequenceLength,u],p=12,b={x:Math.ceil(o.vHeadSize/p),y:Math.ceil(o.sequenceLength/p),z:o.batchSize*o.numHeads},h=[{type:12,data:o.sequenceLength},{type:12,data:s},{type:12,data:o.vHeadSize},{type:12,data:o.numHeads},{type:12,data:u},{type:12,data:i},{type:12,data:o.kvSequenceLength}],g=t?["type","type","type"]:["type","type"],T=[{dims:c,dataType:e.dataType,gpuDataType:0}];l&&T.push({dims:f,dataType:e.dataType,gpuDataType:0});let w=v=>{let S=D("probs",e.dataType,e.dims),$=D("v",n.dataType,n.dims),P=[S,$];t&&P.push(D("past_value",t.dataType,t.dims));let N=[G("output",e.dataType,c)];l&&N.push(G("present_value",e.dataType,f));let z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"}];return`
  const TILE_SIZE = ${p}u;
  var<workgroup> tileQ: array<${S.type.value}, ${p*p}>;
  var<workgroup> tileK: array<${S.type.value}, ${p*p}>;
  ${v.registerUniforms(z).declareVariables(...P,...N)}
  ${v.mainStart([p,p,1])}
   let headIdx = workgroup_id.z;
   let m = global_id.y;
   let n = global_id.x;

   let offsetA = headIdx * (uniforms.M * uniforms.K) + m * uniforms.K;
   ${(()=>t&&l?`
    let pastValueOffset = headIdx * uniforms.N * uniforms.past_sequence_length + n;
    let vOffset = headIdx * uniforms.N * uniforms.kv_sequence_length + n;
      `:`
   let offsetB = headIdx * uniforms.N * uniforms.K + n;
            `)()}
    ${l?"let presentValueOffset = headIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${S.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${(()=>t&&l?`
        if (w + local_id.y < uniforms.past_sequence_length) {
          tileK[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else {
          tileK[idx] = v[vOffset + (w + local_id.y - uniforms.past_sequence_length) * uniforms.N];
        }
      `:`
        tileK[idx] = v[offsetB + (w + local_id.y) * uniforms.N];
      `)()}
        ${l?"present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileK[idx];":""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let currentBatchHeadNumber = workgroup_id.z % uniforms.num_heads;
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + currentBatchHeadNumber * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${t!==void 0};${r.outputCount}`,inputDependencies:g},getRunData:()=>({outputs:T,dispatchGroup:b,programUniforms:h}),getShaderSource:w}},In=(r,e,n,t,o,i,s,a,u,l,f)=>{let c=r.outputCount,p=l.kvNumHeads!==void 0||c>1?l.pastSequenceLength:0,b=p+l.kvSequenceLength,h=l.kvNumHeads===void 0&&c>1&&s?[e,n,s]:[e,n];u&&h.push(u);let g=r.compute(v2(r,e,n,c>1?s:void 0,u,l,f,p),{inputs:h,outputs:l.kvNumHeads===void 0&&c>1?[-1,1]:[-1]})[0];r.compute(x2(r,g,l.batchSize*l.numHeads*l.sequenceLength,b),{inputs:[g],outputs:[]});let T=l.kvNumHeads===void 0&&c>1&&a?[g,t,a]:[g,t];r.compute(w2(r,g,t,c>1&&a?a:void 0,l,p),{inputs:T,outputs:l.kvNumHeads===void 0&&c>1?[0,2]:[0]})},T2=(r,e)=>{let n=[e.batchSize,e.numHeads,e.sequenceLength,e.headSize],t=e.sequenceLength,o=e.inputHiddenSize,i=e.headSize,s=12,a={x:Math.ceil(e.headSize/s),y:Math.ceil(e.sequenceLength/s),z:e.batchSize*e.numHeads},u=[r.inputs[0],r.inputs[1],r.inputs[2]],l=[{type:12,data:t},{type:12,data:o},{type:12,data:i},{type:12,data:e.numHeads},{type:12,data:e.headSize},{type:12,data:e.hiddenSize},{type:12,data:e.hiddenSize+e.hiddenSize+e.vHiddenSize}],f=c=>{let p=G("output_q",u[0].dataType,n),b=G("output_k",u[0].dataType,n),h=G("output_v",u[0].dataType,n),g=D("input",u[0].dataType,u[0].dims),T=D("weight",u[1].dataType,u[1].dims),w=D("bias",u[2].dataType,u[2].dims),v=g.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${v}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${v}, ${s*s}>;
  var<workgroup> tileWeightK: array<${v}, ${s*s}>;
  var<workgroup> tileWeightV: array<${v}, ${s*s}>;
  ${c.registerUniforms(S).declareVariables(g,T,w,p,b,h)}
  ${c.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${v}(0);
    var valueK = ${v}(0);
    var valueV = ${v}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return r.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0}],dispatchGroup:a,programUniforms:l}),getShaderSource:f},{inputs:u,outputs:[-1,-1,-1]})},vg=(r,e)=>{let n=y2(r.inputs,e),[t,o,i]=T2(r,n);return In(r,t,o,i,r.inputs[4],void 0,void 0,void 0,r.inputs[5],n,e)}});var _2,I2,S2,wg,Tg=C(()=>{"use strict";ft();ue();ye();et();he();_2=(r,e)=>{if(!r||r.length!==5)throw new Error("BatchNormalization requires 5 inputs");let n=(t,o,i)=>{let s=o.length;if(s!==t.length)throw new Error(`${i}: num dimensions != ${s}`);o.forEach((a,u)=>{if(a!==t[u])throw new Error(`${i}: dim[${u}] do not match`)})};if(r[0].dims.length>1){let t=e.format==="NHWC"?e.spatial?r[0].dims.slice(-1):r[0].dims.slice(-1).concat(r[0].dims.slice(1,r[0].dims.length-1)):r[0].dims.slice(1,e.spatial?2:void 0);n(r[1].dims,t,"Invalid input scale"),n(r[2].dims,t,"Invalid input B"),n(r[3].dims,t,"Invalid input mean"),n(r[4].dims,t,"Invalid input var")}else n(r[1].dims,[1],"Invalid input scale"),n(r[2].dims,[1],"Invalid input B"),n(r[3].dims,[1],"Invalid input mean"),n(r[4].dims,[1],"Invalid input var")},I2=(r,e)=>{let{epsilon:n,spatial:t,format:o}=e,i=r[0].dims,s=t?ze(i[i.length-1]):1,a=o==="NHWC"&&i.length>1?s:1,u=B.size(i)/s,l=t,f=l?i.length:i,c=D("x",r[0].dataType,r[0].dims,s),p=D("scale",r[1].dataType,r[1].dims,a),b=D("bias",r[2].dataType,r[2].dims,a),h=D("inputMean",r[3].dataType,r[3].dims,a),g=D("inputVar",r[4].dataType,r[4].dims,a),T=G("y",r[0].dataType,f,s),w=()=>{let S="";if(t)S=`let cOffset = ${i.length===1?"0u":o==="NHWC"?`outputIndices[${i.length-1}] / ${s}`:"outputIndices[1]"};`;else if(o==="NCHW")S=`
            ${T.indicesSet("outputIndices","0","0")}
            let cOffset = ${T.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${p.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let $=1;$<p.rank;$++)S+=`cIndices[${$}] = outputIndices[${$}];`;S+=`let cOffset = ${p.indicesToOffset("cIndices")};`}return S},v=S=>`
  const epsilon = ${n};
  ${S.registerUniform("outputSize","u32").declareVariables(c,p,b,h,g,T)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${T.offsetToIndices(`global_idx * ${s}`)};
    ${w()}
    let scale = ${p.getByOffset("cOffset")};
    let bias = ${b.getByOffset("cOffset")};
    let inputMean = ${h.getByOffset("cOffset")};
    let inputVar = ${g.getByOffset("cOffset")};
    let x = ${c.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${T.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${e.epsilon}_${e.format}_${t}_${s}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:v,getRunData:()=>({outputs:[{dims:r[0].dims,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l?[{type:12,data:u},...W(i)]:[{type:12,data:u}]})}},S2=r=>de(r),wg=(r,e)=>{let{inputs:n,outputCount:t}=r,o=S2({...e,outputCount:t});if(le.webgpu.validateInputContent&&_2(n,o),e.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");r.compute(I2(n,o))}});var $2,A2,_g,Ig=C(()=>{"use strict";ye();he();$2=r=>{if(r[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(r[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(r[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(r[0].dims[2]!==r[1].dims[0])throw new Error("last dimension of input and bias are not the same")},A2=r=>{let e=r[0].dims,n=r[0].dims[2],t=B.size(e)/4,o=r[0].dataType,i=D("input",o,e,4),s=D("bias",o,[n],4),a=D("residual",o,e,4),u=G("output",o,e,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:e,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(t/64)}}),getShaderSource:f=>`
  const channels = ${n}u / 4;
  ${f.declareVariables(i,s,a,u)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes(t)}
    let value = ${i.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${a.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},_g=r=>{$2(r.inputs),r.compute(A2(r.inputs))}});var P2,Ee,Sg,$g,Ag,Pg,Og,Eg,Cg,kg,Dg,O2,Bg,Lg,Rg,Ng,Zn,zg,Ri,Fg,Mg,Vg,Gg,Ug,Wg,Hg,qg,Kg,jg,Xg,Zg,Yg,Jg,Qg,eb,tb,rb,Zs,Ys,nb,ob,ib,E2,C2,ab,Ni=C(()=>{"use strict";ue();ye();et();he();P2=(r,e,n,t,o,i)=>{let s=Math.ceil(e/4),a="";typeof o=="string"?a=`${o}(a)`:a=o("a");let u=D("inputData",n,[s],4),l=G("outputData",t,[s],4);return`
      ${r.registerUniform("vec_size","u32").declareVariables(u,l)}

  ${i??""}

  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx",a)}
  }`},Ee=(r,e,n,t,o,i=r.dataType)=>({name:e,shaderCache:{hint:o,inputDependencies:["type"]},getShaderSource:s=>P2(s,B.size(r.dims),r.dataType,i,n,t),getRunData:s=>({outputs:[{dims:r.dims,dataType:i}],dispatchGroup:{x:Math.ceil(B.size(s[0].dims)/64/4)},programUniforms:[{type:12,data:Math.ceil(B.size(r.dims)/4)}]})}),Sg=r=>{r.compute(Ee(r.inputs[0],"Abs","abs"))},$g=r=>{r.compute(Ee(r.inputs[0],"Acos","acos"))},Ag=r=>{r.compute(Ee(r.inputs[0],"Acosh","acosh"))},Pg=r=>{r.compute(Ee(r.inputs[0],"Asin","asin"))},Og=r=>{r.compute(Ee(r.inputs[0],"Asinh","asinh"))},Eg=r=>{r.compute(Ee(r.inputs[0],"Atan","atan"))},Cg=r=>{r.compute(Ee(r.inputs[0],"Atanh","atanh"))},kg=r=>de(r),Dg=(r,e)=>{let n;switch(e.to){case 10:n="vec4<f16>";break;case 1:n="vec4<f32>";break;case 12:n="vec4<u32>";break;case 6:n="vec4<i32>";break;case 9:n="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${e.to}`)}r.compute(Ee(r.inputs[0],"Cast",n,void 0,e.cacheKey,e.to))},O2=r=>{let e=r.length>=2&&r[1].data!==0?r[1].getFloat32Array()[0]:Ei,n=r.length>=3&&r[2].data!==0?r[2].getFloat32Array()[0]:Ci;return de({min:e,max:n})},Bg=(r,e)=>{let n=r.inputs.length===1?e:O2(r.inputs),t=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"Clip",o=>`clamp(${o}, clip_min_, clip_max_)`,`
    const clip_min_: vec4<${t}> = vec4(${t}(${n.min}));
    const clip_max_: vec4<${t}> = vec4(${t}(${n.max}));
`,n.cacheKey),{inputs:[0]})},Lg=r=>{r.compute(Ee(r.inputs[0],"Ceil","ceil"))},Rg=r=>{r.compute(Ee(r.inputs[0],"Cos","cos"))},Ng=r=>{r.compute(Ee(r.inputs[0],"Cosh","cosh"))},Zn=r=>de(r),zg=(r,e)=>{let n=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"Elu",t=>`elu_vf32(${t})`,`
  const elu_alpha_ = ${n}(${e.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,e.cacheKey))},Ri=(r="f32")=>`
const r0: ${r} = 0.3275911;
const r1: ${r} = 0.254829592;
const r2: ${r} = -0.284496736;
const r3: ${r} = 1.421413741;
const r4: ${r} = -1.453152027;
const r5: ${r} = 1.061405429;

fn erf_vf32(v: vec4<${r}>) -> vec4<${r}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Fg=r=>{let e=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"Erf",n=>`erf_vf32(${n})`,Ri(e)))},Mg=r=>{r.compute(Ee(r.inputs[0],"Exp","exp"))},Vg=r=>{r.compute(Ee(r.inputs[0],"Floor","floor"))},Gg=r=>{let e=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"Gelu",n=>`0.5 * ${n} * (1.0 + erf_vf32(${n} * 0.7071067811865475))`,Ri(e)))},Ug=(r,e)=>{let n=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"LeakyRelu",t=>`select(leaky_relu_alpha_ * ${t}, ${t}, ${t} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${e.alpha});`,e.cacheKey))},Wg=r=>{r.compute(Ee(r.inputs[0],"Not",e=>`!${e}`))},Hg=r=>{r.compute(Ee(r.inputs[0],"Neg",e=>`-${e}`))},qg=r=>{r.compute(Ee(r.inputs[0],"Reciprocal",e=>`1.0/${e}`))},Kg=r=>{let e=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"Relu",n=>`select(vec4<${e}>(0.0), ${n}, ${n} > vec4<${e}>(0.0))`))},jg=r=>{r.compute(Ee(r.inputs[0],"Sigmoid",e=>`(1.0 / (1.0 + exp(-${e})))`))},Xg=r=>de(r),Zg=(r,e)=>{let n=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"HardSigmoid",t=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${e.alpha} * ${t} + vec4<${n}>(${e.beta})))`,void 0,e.cacheKey))},Yg=r=>{r.compute(Ee(r.inputs[0],"Sin","sin"))},Jg=r=>{r.compute(Ee(r.inputs[0],"Sinh","sinh"))},Qg=r=>{r.compute(Ee(r.inputs[0],"Sqrt","sqrt"))},eb=r=>{r.compute(Ee(r.inputs[0],"Tan","tan"))},tb=r=>`sign(${r}) * (1 - exp(-2 * abs(${r}))) / (1 + exp(-2 * abs(${r})))`,rb=r=>{r.compute(Ee(r.inputs[0],"Tanh",tb))},Zs=(r="f32")=>`
const fast_gelu_a: ${r} = 0.5;
const fast_gelu_b: ${r} = 0.7978845608028654;
const fast_gelu_c: ${r} = 0.035677408136300125;

fn tanh_v(v: vec4<${r}>) -> vec4<${r}> {
  return ${tb("v")};
}
`,Ys=r=>`(fast_gelu_a + fast_gelu_a * tanh_v(${r} * (fast_gelu_c * ${r} * ${r} + fast_gelu_b))) * ${r}`,nb=r=>{let e=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"FastGelu",Ys,Zs(e),void 0,r.inputs[0].dataType))},ob=(r,e)=>{let n=ct(r.inputs[0].dataType);return r.compute(Ee(r.inputs[0],"ThresholdedRelu",t=>`select(vec4<${n}>(0.0), ${t}, ${t} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${e.alpha});`,e.cacheKey)),0},ib=r=>{r.compute(Ee(r.inputs[0],"Log","log"))},E2=(r,e)=>`
const alpha = vec4<${r}>(${e});
const one = ${r}(1.0);
const zero = ${r}(0.0);

fn quick_gelu_impl(x: vec4<${r}>) -> vec4<${r}> {
  let v = x *alpha;
  var x1 : vec4<${r}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,C2=r=>`quick_gelu_impl(${r})`,ab=(r,e)=>{let n=ct(r.inputs[0].dataType);r.compute(Ee(r.inputs[0],"QuickGelu",C2,E2(n,e.alpha),e.cacheKey,r.inputs[0].dataType))}});var k2,D2,ub,lb=C(()=>{"use strict";ye();he();Ni();k2=r=>{if(r[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(r[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(r[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(r[0].dims[2]!==r[1].dims[0])throw new Error("last dimension of input and bias are not the same")},D2=r=>{let e=r[0].dims.slice();e[2]=e[2]/2;let n=D("input",r[0].dataType,r[0].dims,4),t=D("bias",r[0].dataType,[r[0].dims[2]],4),o=G("output",r[0].dataType,e,4),i=B.size(e)/4,s=Be(r[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:e,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${r[0].dims[2]/4/2}u;

  ${u.declareVariables(n,t,o)}

  ${Ri(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${o.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},ub=r=>{k2(r.inputs),r.compute(D2(r.inputs))}});var B2,L2,ur,cb,fb,db,pb,mb,hb,gb,bb,yb,xb,vb=C(()=>{"use strict";ue();ye();he();B2=(r,e,n,t,o,i,s,a,u,l,f,c)=>{let p,b;typeof a=="string"?p=b=(v,S)=>`${a}((${v}),(${S}))`:typeof a=="function"?p=b=a:(p=a.scalar,b=a.vector);let h=G("outputData",f,t.length,4),g=D("aData",u,e.length,4),T=D("bData",l,n.length,4),w;if(o)if(i){let v=B.size(e)===1,S=B.size(n)===1,$=e.length>0&&e[e.length-1]%4===0,P=n.length>0&&n[n.length-1]%4===0;v||S?w=h.setByOffset("global_idx",b(v?`${g.type.value}(${g.getByOffset("0")}.x)`:g.getByOffset("global_idx"),S?`${T.type.value}(${T.getByOffset("0")}.x)`:T.getByOffset("global_idx"))):w=`
            let outputIndices = ${h.offsetToIndices("global_idx * 4u")};
            let offsetA = ${g.broadcastedIndicesToOffset("outputIndices",h)};
            let offsetB = ${T.broadcastedIndicesToOffset("outputIndices",h)};
            ${h.setByOffset("global_idx",b(s||$?g.getByOffset("offsetA / 4u"):`${g.type.value}(${g.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||P?T.getByOffset("offsetB / 4u"):`${T.type.value}(${T.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else w=h.setByOffset("global_idx",b(g.getByOffset("global_idx"),T.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let v=(S,$,P="")=>{let E=`aData[indexA${$}][componentA${$}]`,N=`bData[indexB${$}][componentB${$}]`;return`
            let outputIndices${$} = ${h.offsetToIndices(`global_idx * 4u + ${$}u`)};
            let offsetA${$} = ${g.broadcastedIndicesToOffset(`outputIndices${$}`,h)};
            let offsetB${$} = ${T.broadcastedIndicesToOffset(`outputIndices${$}`,h)};
            let indexA${$} = offsetA${$} / 4u;
            let indexB${$} = offsetB${$} / 4u;
            let componentA${$} = offsetA${$} % 4u;
            let componentB${$} = offsetB${$} % 4u;
            ${S}[${$}] = ${P}(${p(E,N)});
          `};f===9?w=`
            var data = vec4<u32>(0);
            ${v("data",0,"u32")}
            ${v("data",1,"u32")}
            ${v("data",2,"u32")}
            ${v("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:w=`
            ${v("outputData[global_idx]",0)}
            ${v("outputData[global_idx]",1)}
            ${v("outputData[global_idx]",2)}
            ${v("outputData[global_idx]",3)}
          `}return`
        ${r.registerUniform("vec_size","u32").declareVariables(g,T,h)}

        ${c??""}

        ${r.mainStart()}
        ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${w}
      }`},L2=(r,e,n,t,o,i,s=n.dataType)=>{let a=!B.areEqual(n.dims,t.dims),u=n.dims,l=B.size(n.dims),f=!1,c=!1,p=[a];if(a){let b=nr.calcShape(n.dims,t.dims,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");u=b,l=B.size(u);let h=B.size(n.dims)===1,g=B.size(t.dims)===1,T=n.dims.length>0&&n.dims[n.dims.length-1]%4===0,w=t.dims.length>0&&t.dims[t.dims.length-1]%4===0;p.push(h),p.push(g),p.push(T),p.push(w);let v=1;for(let S=1;S<u.length;S++){let $=n.dims[n.dims.length-S]??1,P=t.dims[t.dims.length-S]??1;if($===P)v*=$;else break}v%4===0?(c=!0,f=!0):(h||g||T||w)&&(f=!0)}else f=!0;return p.push(f),{name:r,shaderCache:{hint:e+p.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>B2(b,n.dims,t.dims,u,f,a,c,o,n.dataType,t.dataType,s,i),getRunData:()=>({outputs:[{dims:u,dataType:s}],dispatchGroup:{x:Math.ceil(l/64/4)},programUniforms:[{type:12,data:Math.ceil(B.size(u)/4)},...W(n.dims,t.dims,u)]})}},ur=(r,e,n,t,o,i)=>{r.compute(L2(e,o??"",r.inputs[0],r.inputs[1],n,t,i))},cb=r=>{ur(r,"Add",(e,n)=>`${e}+${n}`)},fb=r=>{ur(r,"Div",(e,n)=>`${e}/${n}`)},db=r=>{ur(r,"Equal",{scalar:(e,n)=>`u32(${e}==${n})`,vector:(e,n)=>`vec4<u32>(${e}==${n})`},void 0,void 0,9)},pb=r=>{ur(r,"Mul",(e,n)=>`${e}*${n}`)},mb=r=>{let e=D("input",r.inputs[0].dataType,r.inputs[0].dims).type.value;ur(r,"Pow",{scalar:(t,o)=>`pow_custom(${t},${o})`,vector:(t,o)=>`pow_vector_custom(${t},${o})`},`
    fn pow_custom(a : ${e}, b : ${e}) -> ${e} {
      if (b == ${e}(0.0)) {
        return ${e}(1.0);
      } else if (a < ${e}(0.0) && f32(b) != floor(f32(b))) {
        return ${e}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${e}(1.0), round(f32(abs(b) % ${e}(2.0))) != 1.0) * ${e}(${e==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${e}>, b : vec4<${e}>) -> vec4<${e}> {
      // TODO: implement vectorized pow
      return vec4<${e}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},hb=r=>{ur(r,"Sub",(e,n)=>`${e}-${n}`)},gb=r=>{ur(r,"Greater",{scalar:(e,n)=>`u32(${e}>${n})`,vector:(e,n)=>`vec4<u32>(${e}>${n})`},void 0,void 0,9)},bb=r=>{ur(r,"Less",{scalar:(e,n)=>`u32(${e}<${n})`,vector:(e,n)=>`vec4<u32>(${e}<${n})`},void 0,void 0,9)},yb=r=>{ur(r,"GreaterOrEqual",{scalar:(e,n)=>`u32(${e}>=${n})`,vector:(e,n)=>`vec4<u32>(${e}>=${n})`},void 0,void 0,9)},xb=r=>{ur(r,"LessOrEqual",{scalar:(e,n)=>`u32(${e}<=${n})`,vector:(e,n)=>`vec4<u32>(${e}<=${n})`},void 0,void 0,9)}});var N2,z2,F2,M2,wb,Tb,_b=C(()=>{"use strict";ue();ye();et();he();N2=(r,e)=>{if(!r||r.length<1)throw new Error("too few inputs");let n=0,t=r[n],o=t.dataType,i=t.dims.length;r.forEach((s,a)=>{if(a!==n){if(s.dataType!==o)throw new Error("input tensors should be one type");if(s.dims.length!==i)throw new Error("input tensors should have the same shape");s.dims.forEach((u,l)=>{if(l!==e&&u!==t.dims[l])throw new Error("non concat dimensions must match")})}})},z2=(r,e)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${r}u>(${e});
    for (var i: u32 = 0u; i < ${r}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${r}u;
  }`,F2=(r,e)=>{let n=r.length,t=[];for(let o=0;o<n;++o){let i=e.setByOffset("global_idx",r[o].getByIndices("indices"));n===1?t.push(i):o===0?t.push(`if (inputIndex == ${o}u) { ${i} }`):o===n-1?t.push(`else { ${i} }`):t.push(`else if (inputIndex == ${o}) { ${i} }`)}return t.join(`
`)},M2=(r,e,n,t)=>{let o=B.size(n),i=new Array(r.length),s=new Array(r.length),a=0,u=[],l=[],f=[{type:12,data:o}];for(let g=0;g<r.length;++g)a+=r[g].dims[e],i[g]=a,l.push(r[g].dims.length),s[g]=D(`input${g}`,t,l[g]),u.push("rank"),f.push({type:12,data:i[g]});for(let g=0;g<r.length;++g)f.push(...W(r[g].dims));f.push(...W(n));let c=G("output",t,n.length),p=c.indicesGet("indices",e),b=Array.from(Array(i.length).keys()).map(g=>`uniforms.sizeInConcatAxis${g}`).join(","),h=g=>`

  ${(()=>{g.registerUniform("outputSize","u32");for(let T=0;T<r.length;T++)g.registerUniform(`sizeInConcatAxis${T}`,"u32");return g.declareVariables(...s,c)})()}

  ${z2(i.length,b)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${c.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${p});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${b});
      ${p} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${F2(s,c)}
  }`;return{name:"Concat",shaderCache:{hint:`${e}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:n,dataType:t}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:f}),getShaderSource:h}},wb=(r,e)=>{let n=r.inputs,t=n[0].dims,o=B.normalizeAxis(e.axis,t.length);N2(n,o);let i=t.slice();i[o]=n.reduce((a,u)=>a+(u.dims.length>o?u.dims[o]:0),0);let s=n.filter(a=>B.size(a.dims)>0);r.compute(M2(s,o,i,n[0].dataType),{inputs:s})},Tb=r=>de({axis:r.axis})});var Wt,Ht,qt,zi,Or=C(()=>{"use strict";ue();ye();Wt=(r,e,n="f32")=>{switch(r.activation){case"Relu":return`value = max(value, ${e}(0.0));`;case"Sigmoid":return`value = (${e}(1.0) / (${e}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${e}(${n}(uniforms.clip_min)), ${e}(${n}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${e}(0.0), min(${e}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${n}(uniforms.alpha) * value, value, value >= ${e}(0.0));`;case"":return"";default:throw new Error(`Unsupported activation ${r.activation}`)}},Ht=(r,e)=>{r.activation==="Clip"?e.push({type:1,data:r.clipMax},{type:1,data:r.clipMin}):r.activation==="HardSigmoid"?e.push({type:1,data:r.alpha},{type:1,data:r.beta}):r.activation==="LeakyRelu"&&e.push({type:1,data:r.alpha})},qt=(r,e)=>{r.activation==="Clip"?e.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):r.activation==="HardSigmoid"?e.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):r.activation==="LeakyRelu"&&e.push({name:"alpha",type:"f32"})},zi=r=>{let e=r?.activation||"";if(e==="HardSigmoid"){let[n,t]=r?.activation_params||[.2,.5];return{activation:e,alpha:n,beta:t}}else if(e==="Clip"){let[n,t]=r?.activation_params||[Ei,Ci];return{activation:e,clipMax:t,clipMin:n}}else if(e==="LeakyRelu"){let[n]=r?.activation_params||[.01];return{activation:e,alpha:n}}return{activation:e}}});var pt,Fi,Mi=C(()=>{"use strict";pt=(r,e)=>{switch(r){case 1:return e;case 2:return`vec2<${e}>`;case 3:return`vec3<${e}>`;case 4:return`vec4<${e}>`;default:throw new Error(`${r}-component is not supported.`)}},Fi=r=>`
      ${r?"value = value + getBiasByOutputCoords(coords);":""}
      `});var Vi,Js=C(()=>{"use strict";Vi=r=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${r}.x), i32(${r}.y), i32(${r}.z), 1));
}
`});var V2,G2,Yn,Ib,U2,Jn,W2,Gi,Qn=C(()=>{"use strict";ue();ye();he();Or();Mi();V2=(r,e)=>r?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${e?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${e?", batchIndices":""});
        `,G2=(r,e)=>r?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${e===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${e===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${e===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Yn=(r,e,n="f32",t,o=!1,i=32,s=!1,a=32)=>{let u=e[1]*r[1],l=e[0]*r[0],f=o?u:i,c=o?i:u,p=f/e[0],b=i/e[1];if(!((o&&p===4&&r[1]===4||!o&&(p===3||p===4))&&f%e[0]===0&&i%e[1]===0&&r[0]===4))throw new Error(`If transposeA ${o} is true, innerElementSize ${p} and workPerThread[1] ${r[1]} must be 4.
      Otherwise, innerElementSize ${p} must be 3 or 4.
  tileAWidth ${f} must be divisible by workgroupSize[0]${e[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${e[1]}. colPerThread ${r[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${p}<${n}>, ${f/p}>, ${c}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${l/r[0]}>, ${i}>;

const rowPerThread = ${r[1]};
const colPerThread = ${r[0]};
const innerElementSize = ${p};
const tileInner = ${i};

@compute @workgroup_size(${e[0]}, ${e[1]}, ${e[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${t?`let batchIndices = ${t.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${u};

  let num_tiles = ${s?`${Math.ceil(a/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${a}`:"0"};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${b};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${V2(o,t)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${t?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${p===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${G2(o,p)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Ib=(r,e)=>r?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${e?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${e?", batchIndices":""});
            `,U2=r=>r?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Jn=(r,e,n="f32",t,o=!1,i=32,s=!1,a=32,u=!1)=>{let l=r[1]*e[1],f=r[0]*e[0],c=o?l:i,p=o?i:l;if(!(p%e[1]===0&&c%e[0]===0&&i%e[1]===0))throw new Error(`tileAHight ${p} must be divisible by workgroupSize[1]${e[1]}, tileAWidth ${c} must be divisible by workgroupSize[0]${e[0]}, tileInner ${i} must be divisible by workgroupSize[1]${e[1]}`);let b=p/e[1],h=c/e[0],g=i/e[1],T=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${f};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${p}; inputRow = inputRow + ${e[1]}) {
        for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${e[0]}) {
          ${Ib(o,t)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${e[1]}) {
            for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${e[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${t?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${e[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${o?`mm_Asub[k][localRow + innerRow * ${e[1]}];`:`mm_Asub[localRow + innerRow * ${e[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${e[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${e[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${b};
let tileColA = i32(localId.x) * ${h};
let tileRowB = i32(localId.y) * ${g};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${h}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Ib(o,t)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${t?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${U2(o)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${c}>, ${p}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${f}>, ${i}>;
  const rowPerThread = ${r[1]};
  const colPerThread = ${r[0]};
  const tileInner = ${i};

@compute @workgroup_size(${e[0]}, ${e[1]}, ${e[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${t?`let batchIndices = ${t.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(a/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${a}`:"0"};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${T}
  }
`},W2=(r,e,n,t,o,i=!1)=>{let[s,a,u]=o,[l,f,c,p]=t,b=_n(s,u),h=_n(a,u),g=Be(t[0].type.tensor),T=()=>{let S=f.rank,$=l.rank,P=`var aIndices: ${f.type.indices};`;for(let E=S-2-1,N=$-1;E>=0;E--,N--)P+=`
aIndices[${E}] = ${$>1?`batchIndices[${N}]`:"batchIndices"};`;return b.forEach(E=>{P+=`
aIndices[${E}] = 0;`}),P+=`
aIndices[${S-2}] = u32(row);
                   aIndices[${S-1}] = u32(colIn);`,P},w=()=>{let S=c.rank,$=l.rank,P=`var bIndices: ${c.type.indices};`;for(let E=S-2-1,N=$-1;E>=0;E--,N--)P+=`
bIndices[${E}] = ${$>1?`batchIndices[${N}]`:"batchIndices"};`;return h.forEach(E=>{P+=`
bIndices[${E}] = 0;`}),P+=`
bIndices[${S-2}] = u32(row);
                   bIndices[${S-1}] = u32(colIn);`,P};return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${pt(r,g)} {
      var value = ${pt(r,g)}(0.0);
      let col = colIn * ${r};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        ${T()}
        value = ${f.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${pt(r,g)} {
      var value = ${pt(r,g)}(0.0);
      let col = colIn * ${r};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        ${w()}
        value = ${c.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${pt(r,g)}) {
      let col = colIn * ${r};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${e?`value = value + ${i?"bias[colIn]":`${pt(r,g)}(bias[row])`};`:""}
        ${n}
        ${p.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Gi=(r,e,n,t,o=!1)=>{let i=r[0].dims,s=r[1].dims,a=i.slice(0,-2),u=s.slice(0,-2),l=t?t.slice(0,-2):n.slice(0,-2),f=B.size(l),c=i[i.length-2],p=i[i.length-1],b=s[s.length-1],h=p%4===0&&b%4===0,g=c<=8?[4,1,1]:[4,4,1],T=[8,8,1],w=[Math.ceil(b/T[0]/g[0]),Math.ceil(c/T[1]/g[1]),Math.ceil(f/T[2]/g[2])],v=h?4:1,S=[...a,c,p/v],$=S.length,P=[...u,p,b/v],E=P.length,N=[f,c,b/v],z=[{type:6,data:c},{type:6,data:b},{type:6,data:p}];Ht(e,z),z.push(...W(l,S,P));let q=["rank","rank"],K=r.length>2;K&&(z.push(...W(r[2].dims)),q.push("rank")),z.push(...W(N));let F=_e=>{let $e=l.length,ae=ki("batchDims",r[0].dataType,$e,1),qe=Be(r[0].dataType),Q=D("a",r[0].dataType,$,v),ge=D("b",r[1].dataType,E,v),Ie=G("result",r[0].dataType,N.length,v),xe=[Q,ge];if(K){let V=o?v:1;xe.push(D("bias",r[2].dataType,r[2].dims.length,V))}let se=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];qt(e,se);let pe=Be(Ie.type.tensor),ce=Wt(e,Ie.type.value,pe),ut=W2(v,K,ce,[ae,Q,ge,Ie],[a,u,l],o);return`
  ${_e.registerUniforms(se).registerInternalVariables(ae).declareVariables(...xe,Ie)}
  ${ut}
  ${h?Yn(g,T,qe,ae):Jn(g,T,qe,ae)}
                   `};return{name:"MatMul",shaderCache:{hint:`${g};${e.activation};${h};${o}`,inputDependencies:q},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:z}),getShaderSource:F}}});var H2,Sb,$b=C(()=>{"use strict";ue();mr();he();Or();Mi();Js();Qn();H2=(r,e,n,t,o=!1,i,s=4,a=4,u=4,l="f32")=>{let f=K=>{switch(K){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${K} is not supported.`)}},c=K=>{switch(K){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${K} is not supported.`)}},p=r?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,b=r?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,h=r?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",g=r?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",T=r?"row":"col",w=r?"col":"row",v=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${r?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${T} / outWidth;
    let outCol = ${T} % outWidth;

    let WRow = ${w} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${w} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${w} % inChannels;
    var resData = ${pt(s,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${h} && xCol >= 0 && xCol < ${g}) {
      ${p}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${f(s)}
    }
    return resData;`,S=r?e&&t?`
    let col = colIn * ${s};
    ${v}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${v}
    }
    return ${pt(s,l)}(0.0);`:t&&n?`
    let col = colIn * ${s};
    ${v}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${v}
    }
    return ${pt(s,l)}(0.0);`,$=`${c(a)}`,P=pt(u,l),E=r?pt(s,l):pt(a,l),N=r?pt(a,l):pt(s,l),z=Wt(i,P,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${r?S:$}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${N} {
      ${r?$:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${P}) {
      let col = colIn * ${u};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${r?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${b}
      ${Fi(o)}
      ${z}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Sb=(r,e,n,t,o,i,s,a)=>{let u=e.format==="NHWC",l=u?r[0].dims[3]:r[0].dims[1],f=n[0],c=u?n[2]:n[3],p=u?n[1]:n[2],b=u?n[3]:n[1],h=u&&(l%4===0||l%3===0)&&b%4===0,g=u?b:c*p,T=u?c*p:b,w=[8,8,1],v=t<=8?[4,1,1]:[4,4,1],S=[Math.ceil(g/w[0]/v[0]),Math.ceil(T/w[1]/v[1]),Math.ceil(f/w[2]/v[2])];Ne("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${S}`);let $=h?u&&l%4!==0?3:4:1,P=w[1]*v[1],E=w[0]*v[0],N=Math.max(w[0]*$,w[1]),z=t%P===0,q=o%E===0,K=i%N===0,F=h?[$,4,4]:[1,1,1],_e=[{type:6,data:t},{type:6,data:o},{type:6,data:i},{type:6,data:[e.pads[0],e.pads[1]]},{type:6,data:e.strides},{type:6,data:e.dilations}];Ht(e,_e),_e.push(...W(r[0].dims,r[1].dims));let $e=["rank","rank"];s&&(_e.push(...W(r[2].dims)),$e.push("rank")),_e.push(...W(n));let ae=qe=>{let Q=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];qt(e,Q);let ge=h?4:1,Ie=Be(r[0].dataType),xe=`
      fn setOutputAtIndex(flatIndex : i32, value : ${h?`vec4<${Ie}>`:Ie}) {
        result[flatIndex] = ${h?`vec4<${Ie}>`:Ie}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${h?`vec4<${Ie}>`:Ie}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${h?"/ 4":""}, value);
      }`,se=D("x",r[0].dataType,r[0].dims.length,$===3?1:$),pe=D("w",r[1].dataType,r[1].dims.length,ge),ce=[se,pe],ut=G("result",r[0].dataType,n.length,ge);if(s){let V=D("bias",r[2].dataType,r[2].dims.length,ge);ce.push(V),xe+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${h?`vec4<${Ie}>`:Ie} {
          return bias[coords.${u?"w":"y"}${h?"/ 4":""}];
        }`}return`
        ${Vi("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${qe.registerUniforms(Q).declareVariables(...ce,ut)}
        ${xe}
        ${H2(u,z,q,K,s,e,F[0],F[1],F[2],Ie)}
        ${h?Yn(v,w,Ie,void 0,!u,N):Jn(v,w,Ie,void 0,!u,N,!1,void 0,a)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${e.cacheKey};${$};${h};${z};${q};${K};${P};${E};${N}`,inputDependencies:$e},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:_e}),getShaderSource:ae}}});var q2,Ab,Ui,K2,Pb,j2,Ob,Eb,Cb=C(()=>{"use strict";ue();mr();ye();he();q2=r=>{let e=1;for(let n=0;n<r.length;n++)e*=r[n];return e},Ab=r=>typeof r=="number"?[r,r,r]:r,Ui=(r,e)=>e<=1?r:r+(r-1)*(e-1),K2=(r,e,n,t=1)=>{let o=Ui(e,t);return Math.floor((r[0]*(n-1)-n+o)/2)},Pb=(r,e,n,t,o)=>{o==null&&(o=K2(r,e[0],t[0]));let i=[0,0,0,n];for(let s=0;s<3;s++)r[s]+2*o>=e[s]&&(i[s]=Math.trunc((r[s]-e[s]+2*o)/t[s]+1));return i},j2=(r,e,n,t,o,i,s,a,u,l)=>{let f,c,p,b;if(r==="VALID"&&(r=0),typeof r=="number"){f={top:r,bottom:r,left:r,right:r,front:r,back:r};let h=Pb([e,n,t,1],[a,u,l],1,[o,i,s],r);c=h[0],p=h[1],b=h[2]}else if(Array.isArray(r)){if(!r.every((g,T,w)=>g===w[0]))throw Error(`Unsupported padding parameter: ${r}`);f={top:r[0],bottom:r[1],left:r[2],right:r[3],front:r[4],back:r[5]};let h=Pb([e,n,t,1],[a,u,l],1,[o,i,s],r[0]);c=h[0],p=h[1],b=h[2]}else if(r==="SAME_UPPER"){c=Math.ceil(e/o),p=Math.ceil(n/i),b=Math.ceil(t/s);let h=(c-1)*o+a-e,g=(p-1)*i+u-n,T=(b-1)*s+l-t,w=Math.floor(h/2),v=h-w,S=Math.floor(g/2),$=g-S,P=Math.floor(T/2),E=T-P;f={top:S,bottom:$,left:P,right:E,front:w,back:v}}else throw Error(`Unknown padding parameter: ${r}`);return{padInfo:f,outDepth:c,outHeight:p,outWidth:b}},Ob=(r,e,n,t,o,i=!1,s="channelsLast")=>{let a,u,l,f,c;if(s==="channelsLast")[a,u,l,f,c]=r;else if(s==="channelsFirst")[a,c,u,l,f]=r;else throw new Error(`Unknown dataFormat ${s}`);let[p,,b,h,g]=e,[T,w,v]=Ab(n),[S,$,P]=Ab(t),E=Ui(b,S),N=Ui(h,$),z=Ui(g,P),{padInfo:q,outDepth:K,outHeight:F,outWidth:_e}=j2(o,u,l,f,T,w,v,E,N,z),$e=i?p*c:p,ae=[0,0,0,0,0];return s==="channelsFirst"?ae=[a,$e,K,F,_e]:s==="channelsLast"&&(ae=[a,K,F,_e,$e]),{batchSize:a,dataFormat:s,inDepth:u,inHeight:l,inWidth:f,inChannels:c,outDepth:K,outHeight:F,outWidth:_e,outChannels:$e,padInfo:q,strideDepth:T,strideHeight:w,strideWidth:v,filterDepth:b,filterHeight:h,filterWidth:g,effectiveFilterDepth:E,effectiveFilterHeight:N,effectiveFilterWidth:z,dilationDepth:S,dilationHeight:$,dilationWidth:P,inShape:r,outShape:ae,filterShape:e}},Eb=(r,e,n,t,o,i)=>{let s=i==="channelsLast",a=s?r[0].dims[3]:r[0].dims[1],u=!1,l=[64,1,1],f={x:n.map((v,S)=>S)},c=[Math.ceil(q2(f.x.map(v=>n[v]))/l[0]),1,1];Ne("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${c}`);let p=u?s&&a%4!==0?3:4:1,b=B.size(n),h=[{type:12,data:b},{type:12,data:t},{type:12,data:o},{type:12,data:e.strides},{type:12,data:e.dilations}];h.push(...W(r[0].dims,r[1].dims));let g=["rank","rank"],T=r.length===3;T&&(h.push(...W(r[2].dims)),g.push("rank")),h.push(...W(n));let w=v=>{let S=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:t.length},{name:"pads",type:"u32",length:o.length},{name:"strides",type:"u32",length:e.strides.length},{name:"dilations",type:"u32",length:e.dilations.length}],$=u?4:1,P=Be(r[0].dataType),E=D("x",r[0].dataType,r[0].dims.length,p===3?1:p),N=D("W",r[1].dataType,r[1].dims.length,$),z=[E,N],q=G("result",r[0].dataType,n.length,$),K="";if(T){let F=D("bias",r[2].dataType,r[2].dims.length,$);z.push(F),K+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${P}>`:P} {
          return bias[${s?Z("coords",4,5):Z("coords",1,5)}${u?"/ 4":""}];
        }`}return`
            ${K}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${N.getByIndices("aIndices")};
            }
          ${v.registerUniforms(S).declareVariables(...z,q)}
          ${v.mainStart()}
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${q.offsetToIndices("global_idx")};
              let batch = ${Z("coords",0,E.rank)};
              let d2 = ${s?Z("coords",E.rank-1,E.rank):Z("coords",1,E.rank)};
              let xFRCCorner = vec3<u32>(${s?Z("coords",1,E.rank):Z("coords",2,E.rank)},
              ${s?Z("coords",2,E.rank):Z("coords",3,E.rank)},
              ${s?Z("coords",3,E.rank):Z("coords",4,E.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?Z("uniforms.x_shape",1,E.rank):Z("uniforms.x_shape",2,E.rank)};
              let xShapeZ = ${s?Z("uniforms.x_shape",2,E.rank):Z("uniforms.x_shape",3,E.rank)};
              let xShapeW = ${s?Z("uniforms.x_shape",3,E.rank):Z("uniforms.x_shape",4,E.rank)};
              let xShapeU = ${s?Z("uniforms.x_shape",4,E.rank):Z("uniforms.x_shape",1,E.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var dotProd = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      dotProd += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`dotProd += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`dotProd += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      dotProd += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      dotProd += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${T?"dotProd = dotProd + getBiasByOutputCoords(coords)":""};
              result[global_idx] = f32(dotProd);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${e.cacheKey};${s};${p};${T}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:c[0],y:c[1],z:c[2]},programUniforms:h}),getShaderSource:w}}});var Qs,kb,Db=C(()=>{"use strict";ue();ye();he();eu();Or();Qs=(r,e,n)=>{let t=r.length>2,o=t?"value += b[output_channel];":"",i=r[0].dims,s=r[1].dims,a=s[0]/e.group,u=e.format==="NHWC",l=Wi(i,s,e.dilations,e.pads,e.strides,u),f=B.size(l),c=[{type:12,data:f},{type:12,data:e.dilations},{type:12,data:[e.strides[0],e.strides[1]]},{type:12,data:[e.pads[0],e.pads[1]]},{type:12,data:a}];Ht(e,c),c.push(...W(i,s));let p=["rank","rank"];t&&(c.push(...W(r[2].dims)),p.push("rank")),c.push(...W(l));let b=h=>{let g=G("output",r[0].dataType,l.length),T=Be(g.type.tensor),w=Wt(e,g.type.value,T),v=D("x",r[0].dataType,i.length),S=D("w",r[1].dataType,s.length),$=[v,S];t&&$.push(D("b",r[2].dataType,r[2].dims.length));let P=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:e.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];return qt(e,P),`
  ${h.registerUniforms(P).declareVariables(...$,g)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${g.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u?1:2}], outputIndices[${u?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel / uniforms.output_channels_per_group;

    var value: ${g.type.value} = ${g.type.value}(0);
    for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
      let input_channel = group_id * uniforms.w_shape[1] + wInChannel;
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[${u?1:2}]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[${u?2:3}]) {
            continue;
          }

          let xVal = ${u?v.get("batch","xHeight","xWidth","input_channel"):v.get("batch","input_channel","xHeight","xWidth")};
          let wVal = ${S.get("output_channel","wInChannel","wHeight","wWidth")};
          value += xVal*wVal;
        }
      }
    }
    ${o}
    ${w}
    ${g.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:e.cacheKey,inputDependencies:p},getRunData:()=>({outputs:[{dims:n?n(l):l,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:c}),getShaderSource:b}},kb=(r,e,n)=>{let t=r.length>2,o=ze(n[3]),i=ze(n[2]),s=B.size(n)/o/i,a=[r[0].dims[0],r[0].dims[1],r[0].dims[2],r[0].dims[3]/o],u=[r[1].dims[0],r[1].dims[1],r[1].dims[2],r[1].dims[3]/o],l=[n[0],n[1],n[2],n[3]/o],f=[{type:12,data:s},{type:6,data:[e.strides[0],e.strides[1]]},{type:6,data:[e.pads[0],e.pads[1]]}];Ht(e,f),f.push(...W(a,u,l));let c=(i-1)*e.strides[1]+u[1],p=b=>{let h=G("output",r[0].dataType,l.length,o),g=Be(h.type.tensor),T=Wt(e,h.type.value,g),w=D("x",r[0].dataType,a.length,o),v=D("w",r[1].dataType,u.length,o),S=[w,v];t&&S.push(D("b",r[2].dataType,r[2].dims,o));let $=t?"value += b[output_channel];":"",P=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return qt(e,P),`
  ${b.registerUniforms(P).declareVariables(...S,h)}
  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${i}u;
    let col = (index1 % width1) * ${i}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${c}>;
    var values: array<${h.type.value}, ${i}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${u[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${c}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${u[1]}; w_width++) {
          let w_val = ${v.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${i}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${i}u; i++) {
      var value = values[i];
      ${$}
      ${T}
      ${h.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${e.cacheKey};${o};${i};${c};${u[0]};${u[1]}`,inputDependencies:t?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:f}),getShaderSource:p}}});var tu,X2,Bb,ru=C(()=>{"use strict";ue();ye();Qn();he();Or();tu=(r,e,n,t,o=!1)=>{let i=r[0].dims,s=r[1].dims,a=i[i.length-2],u=s[s.length-1],l=i[i.length-1],f=ze(u),c=ze(l),p=ze(a),b=B.size(n)/f/p,h=r.length>2,g=t?t.slice(0,-2):n.slice(0,-2),w=[B.size(g),a,u],v=[{type:12,data:b},{type:12,data:a},{type:12,data:u},{type:12,data:l}];Ht(e,v),v.push(...W(g,i,s)),h&&v.push(...W(r[2].dims)),v.push(...W(w));let S=$=>{let P=ki("batch_dims",r[0].dataType,g.length),E=D("a",r[0].dataType,i.length,c),N=D("b",r[1].dataType,s.length,f),z=G("output",r[0].dataType,w.length,f),q=Be(z.type.tensor),K=Wt(e,z.type.value,q),F=[E,N],_e="";if(h){let se=o?f:1;F.push(D("bias",r[2].dataType,r[2].dims.length,se)),_e=`${o?`value += bias[col / ${se}];`:`value += ${z.type.value}(bias[row + i]);`}`}let $e=i.slice(0,-2),ae=s.slice(0,-2),qe=_n($e,g),Q=_n(ae,g),ge=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];qt(e,ge);let Ie=(se,pe)=>{let ce=se.rank,ut=se.name;if(ce===2)return`var ${ut}_indices = ${se.type.indices}(0u, 0u);`;let V=P.rank,ie=`var ${ut}_indices: ${se.type.indices};`;for(let Te=ce-2-1,tt=V-1;Te>=0;Te--,tt--)ie+=`
${ut}_indices[${Te}] = ${V>1?`batch_indices[${tt}]`:"batch_indices"};`;return pe.forEach(Te=>{ie+=`
${ut}_indices[${Te}] = 0;`}),ie+=`${ut}_indices[${ce-2}] = 0u;
                     ${ut}_indices[${ce-1}] = 0u;`,ie},xe=()=>{let se=`var a_data: ${E.type.value};`;for(let pe=0;pe<c;pe++)se+=`
              let b_data${pe} = b[(b_offset + (k + ${pe}) * uniforms.N + col) / ${f}];`;for(let pe=0;pe<p;pe++){se+=`a_data = a[(a_offset + (row + ${pe}) * uniforms.K + k) / ${c}];`;for(let ce=0;ce<c;ce++)se+=`
            values[${pe}] = fma(${N.type.value}(a_data${c===1?"":`[${ce}]`}), b_data${ce}, values[${pe}]);
`}return se};return`
  ${$.registerUniforms(ge).registerInternalVariables(P).declareVariables(...F,z)}
  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${p};
    let row = (index1 % stride1) * ${p};
    let batch = index1 / stride1;

    ${n.length===2?"":`let batch_indices = ${P.offsetToIndices("batch")};`}
    ${Ie(E,qe)}
    let a_offset = ${E.indicesToOffset("a_indices")};
    ${Ie(N,Q)}
    let b_offset = ${N.indicesToOffset("b_indices")};
    var values: array<${z.type.value}, ${p}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${c}) {
      ${xe()}
    }
    for (var i = 0u; i < ${p}u; i++) {
      var value = values[i];
      ${_e}
      ${K}
      let cur_indices = ${z.type.indices}(batch, row + i, col);
      let offset = ${z.indicesToOffset("cur_indices")};
      ${z.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${e.activation};${f};${c};${p};${o}`,inputDependencies:h?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:v}),getShaderSource:S}},X2=r=>{if(!r||r.length!==2)throw new Error("MatMul requires 2 inputs.");if(r[0].dims[r[0].dims.length-1]!==r[1].dims[r[1].dims.length-2])throw new Error("shared dimension does not match.")},Bb=r=>{X2(r.inputs);let e=nr.calcShape(r.inputs[0].dims,r.inputs[1].dims,!0);if(!e)throw new Error("Can't use matmul on the given tensors");let n=e[e.length-1],t=r.inputs[0].dims[r.inputs[0].dims.length-1];n<8&&t<8?r.compute(tu(r.inputs,{activation:""},e)):r.compute(Gi(r.inputs,{activation:""},e))}});var Wi,nu,Z2,ou,iu,Y2,J2,Q2,au,eu=C(()=>{"use strict";ye();$b();Cb();Qn();Db();Or();ru();Jr();Wi=(r,e,n,t,o,i)=>{let s=r[0],a=r.slice(i?1:2,i?3:4),u=a.length,l=e[0],c=e.slice(2).map((h,g)=>h+(h-1)*(n[g]-1)),b=a.map((h,g)=>h+t[g]+t[g+u]).map((h,g)=>Math.floor((h-c[g]+o[g])/o[g]));return b.splice(0,0,s),b.splice(i?3:1,0,l),b},nu=[2,3,1,0],Z2=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length>5)throw new Error("greater than 5D is not supported");if(r[0].dims.length!==r[1].dims.length)throw new Error("filter does not have same dimension as input");let n=r[0].dims[e.format==="NHWC"?r[0].dims.length-1:1],t=r[1].dims[1]*e.group;if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(r.length===3&&(r[2].dims.length!==1||r[1].dims[0]!==r[2].dims[0]))throw new Error("invalid bias");let o=r[0].dims.length-2;if(e.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(e.strides.length!==o)throw new Error(`strides should be ${o}D`);if(e.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape")},ou=(r,e)=>{let n=r.kernelShape.slice();for(let i=2;i<e[1].dims.length;++i)n[i-2]===0&&(n[i-2]=e[1].dims[i]);let t=r.pads.slice();Xr.adjustPadsBasedOnAutoPad(e[0].dims,r.strides,r.dilations,n,t,r.format==="NHWC",r.autoPad);let o=Object.assign({},r);return Object.assign(o,{kernelShape:n,pads:t}),o},iu=r=>{let e=zi(r),n=r.format,t=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][r.auto_pad],o=r.dilations,i=r.group,s=r.kernel_shape,a=r.pads,u=r.strides,l=r.w_is_const();return{autoPad:t,format:n,dilations:o,group:i,kernelShape:s,pads:a,strides:u,wIsConst:l,...e,cacheKey:`${r.format};${e.activation};`}},Y2=(r,e,n)=>{let t=ou(n,e),o=n.format==="NHWC";if(n.group!==1){if(!r.adapterInfo.isArchitecture("ampere")&&o&&e[1].dims[0]===n.group&&e[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1){let N=Wi(e[0].dims,e[1].dims,n.dilations,t.pads,n.strides,o),z=r.kernelCustomData.wT??r.compute(Tt(e[1],nu),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=z);let q=[e[0],z];e.length===3&&q.push(e[2]),r.compute(kb(q,t,N),{inputs:q})}else r.compute(Qs(e,t));return}let i=e.length===3,s=e[0].dims[o?1:2],a=e[0].dims[o?2:3],u=e[0].dims[o?3:1],l=e[1].dims[2],f=e[1].dims[3],c=Wi(e[0].dims,e[1].dims,n.dilations,t.pads,n.strides,o),p=c[o?1:2],b=c[o?2:3],h=c[o?3:1],g=o&&l===s&&f===a&&n.pads[0]===0&&n.pads[1]===0;if(g||l===1&&f===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let E=c[0],N,z,q,K=[];if(o){let $e=r.kernelCustomData.wT??r.compute(Tt(e[1],nu),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=$e),g){let ae=s*a*u;N=e[0].reshape([1,E,ae]),z=$e.reshape([1,ae,h]),q=[1,E,h]}else N=e[0].reshape([E,s*a,u]),z=$e.reshape([1,u,h]),q=[E,p*b,h];K.push(N),K.push(z)}else N=e[0].reshape([E,u,s*a]),z=e[1].reshape([1,h,u]),q=[E,h,p*b],K.push(z),K.push(N);i&&K.push(e[2]);let F=q[2],_e=K[0].dims[K[0].dims.length-1];F<8&&_e<8?r.compute(tu(K,t,c,q,o),{inputs:K}):r.compute(Gi(K,t,c,q,o),{inputs:K});return}let T=!0,w=r.kernelCustomData.wT??r.compute(Tt(e[1],nu),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=w);let v=[e[0],w];i&&v.push(e[2]);let S=o?p*b:h,$=o?h:p*b,P=l*f*u;r.compute(Sb(v,t,c,S,$,P,i,T),{inputs:v})},J2=(r,e)=>{let n=e.format==="NHWC",t=[r.inputs[0].reshape(n?[r.inputs[0].dims[0],1,r.inputs[0].dims[1],r.inputs[0].dims[2]]:[r.inputs[0].dims[0],r.inputs[0].dims[1],1,r.inputs[0].dims[2]]),r.inputs[1].reshape([r.inputs[1].dims[0],r.inputs[1].dims[1],1,r.inputs[1].dims[2]])];r.inputs.length===3&&t.push(r.inputs[2]);let o=[0,e.pads[0],0,e.pads[1]],i=[1].concat(e.strides),s=[1].concat(e.dilations),a=[1].concat(e.kernelShape),u=ou({...e,pads:o,strides:i,dilations:s,kernelShape:a},t);r.compute(Qs(t,u,l=>n?[l[0],l[2],l[3]]:[]))},Q2=(r,e,n)=>{let t=n.format==="NHWC"?"channelsLast":"channelsFirst",o=ou(n,e),i=n.autoPad==="NOTSET"?n.pads:n.autoPad,s=Ob(e[0].dims,e[1].dims,n.strides,n.dilations,i,!1,t);r.compute(Eb(e,o,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],t))},au=(r,e)=>{Z2(r.inputs,e),r.inputs[0].dims.length===3?J2(r,e):r.inputs[0].dims.length===5?Q2(r,r.inputs,e):Y2(r,r.inputs,e)}});var e1,Lb,Rb=C(()=>{"use strict";ue();mr();he();Or();Mi();Js();Qn();e1=(r,e=!1,n,t,o=4)=>{let i=w=>{switch(w){case 1:return"return w[getIndexFromCoords4D(coord, vec4<i32>(uniforms.w_shape))];";case 4:return`
            let coord1 = vec4<i32>(coordX, coordY, col + 1, rowInner);
            let coord2 = vec4<i32>(coordX, coordY, col + 2, rowInner);
            let coord3 = vec4<i32>(coordX, coordY, col + 3, rowInner);
            let v0 = w[getIndexFromCoords4D(coord, vec4<i32>(uniforms.w_shape))];
            let v1 = w[getIndexFromCoords4D(coord1, vec4<i32>(uniforms.w_shape))];
            let v2 = w[getIndexFromCoords4D(coord2, vec4<i32>(uniforms.w_shape))];
            let v3 = w[getIndexFromCoords4D(coord3, vec4<i32>(uniforms.w_shape))];
            return ${t}(v0, v1, v2, v3);
            `;default:throw new Error(`innerElementSize ${w} is not supported.`)}},s=r?`
      let coord = vec4<i32>(batch, iXR, iXC, xCh);
      `:`
      let coord = vec4<i32>(batch, xCh, iXR, iXC);
      `,a=r?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,u=r?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",l=r?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",f=r?"row":"col",c=r?"col":"row",p=`
      let inChannels = ${r?"i32(uniforms.x_shape[3])":"i32(uniforms.x_shape[1])"};
      let outWidth = ${r?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      let outRow = ${f} / outWidth;
      let outCol = ${f} % outWidth;

      let WRow = ${c} / (uniforms.filter_dims[1] * inChannels);
      let WCol = ${c} / inChannels % uniforms.filter_dims[1];
      let xR = f32(outRow - uniforms.pads[0] + uniforms.dilations[0] * WRow) / f32(uniforms.strides[0]);
      let xC = f32(outCol - uniforms.pads[1] + uniforms.dilations[1] * WCol) / f32(uniforms.strides[1]);
      if (xR < 0.0 || xR >= f32(${u}) || fract(xR) > 0.0) {
        return ${t}(0.0);
      }
      if (xC < 0.0 || xC >= f32(${l}) || fract(xC) > 0.0) {
        return ${t}(0.0);
      }
      let iXR = i32(xR);
      let iXC = i32(xC);
      let xCh = ${c} % inChannels;
      ${s}
      return x[getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape))/${o}];`,b=r?`
      let col = colIn * ${o};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
        ${p}
      }
      return ${t}(0.0);`:`
      let col = colIn * ${o};
      if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
        ${p}
      }
      return ${t}(0.0);`,h=`
      let col = colIn * ${o};
      let inChannels = ${r?"i32(uniforms.x_shape[3])":"i32(uniforms.x_shape[1])"};
      let coordX = uniforms.filter_dims[0] - 1 - row / (uniforms.filter_dims[1] * inChannels);
      let coordY = uniforms.filter_dims[1] - 1 - (row / inChannels) % uniforms.filter_dims[1];
      if (${r?"row < uniforms.dim_inner && col < uniforms.dim_b_outer":"row < uniforms.dim_inner && col < uniforms.dim_a_outer"}  && coordX >= 0 && coordY >= 0) {
        let rowInner = row % inChannels;
        let coord = vec4<i32>(coordX, coordY, col, rowInner);
        ${i(o)}
      }
      return ${t}(0.0);
      `,g=Wt(n,t);return`
  fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${t} {
    ${r?b:h}
  }

  fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${t} {
    ${r?h:b}
  }

  fn mm_write(batch: i32, row : i32, colIn : i32, valueInput : ${t}) {
    let col = colIn * ${o};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
      var value = valueInput;
      let outWidth = ${r?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${a}
      ${Fi(e)}
      ${g}
      result[getIndexFromCoords4D(coords, vec4<i32>(uniforms.result_shape))/${o}] = value;
    }
  }`},Lb=(r,e,n,t,o,i,s,a)=>{let u=e.format==="NHWC",l=u?r[0].dims[3]:r[0].dims[1],f=n[0],c=u?n[2]:n[3],p=u?n[1]:n[2],b=u?n[3]:n[1],h=u&&l%4===0&&l%3&&b%4===0,g=u?b:c*p,T=u?c*p:b,w=[8,8,1],v=t<=8?[4,1,1]:[4,4,1],S=[Math.ceil(g/w[0]/v[0]),Math.ceil(T/w[1]/v[1]),Math.ceil(f/w[2]/v[2])];Ne("verbose",()=>`[conv_backprop_mm_webgpu] dispatch = ${S}`);let $=h?4:1,P=Math.max(w[0]*$,w[1]),E=h?4:1,N=[e.kernelShape[u?1:2],e.kernelShape[u?2:3]],z=[N[0]+(e.dilations[0]<=1?0:(N[0]-1)*(e.dilations[0]-1)),N[1]+(e.dilations[1]<=1?0:(N[1]-1)*(e.dilations[1]-1))],q=[z[0]-1-Math.floor((e.pads[0]+e.pads[2])/2),z[1]-1-Math.floor((e.pads[1]+e.pads[3])/2)],K=[{type:6,data:t},{type:6,data:o},{type:6,data:i},{type:6,data:e.strides},{type:6,data:e.dilations},{type:6,data:N},{type:6,data:q}];Ht(e,K),K.push(...W(r[0].dims,r[1].dims));let F=["rank","rank"];s&&(K.push(...W(r[2].dims)),F.push("rank")),K.push(...W(n));let _e=$e=>{let ae=D("x",r[0].dataType,r[0].dims.length,E),qe=D("w",r[1].dataType,r[1].dims.length,1),Q=G("result",r[0].dataType,n.length,E),ge=[ae,qe],Ie="";if(s){let pe=D("bias",r[2].dataType,r[2].dims.length,E);ge.push(pe),Ie+=`
          fn getBiasByOutputCoords(coords : vec4<i32>) -> ${pe.type.value} {
            return bias[coords.${u?"w":"y"}${h?"/ 4":""}];
          }`}let xe=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"strides",type:"i32",length:2},{name:"dilations",type:"i32",length:2},{name:"filter_dims",type:"i32",length:N.length},{name:"pads",type:"i32",length:q.length}];qt(e,xe);let se=Be(r[0].dataType,1);if(se!=="f16"&&se!=="f32")throw new Error(`elemType ${se} is not supported.`);return`
        ${Vi("uniforms.result_strides")}
        ${$e.registerUniforms(xe).declareVariables(...ge,Q)};
        ${Ie}
        ${e1(u,s,e,ae.type.value,$)}
        ${h?Yn(v,w,se,void 0,!u,P):Jn(v,w,se,void 0,!u,P,!1,void 0,a)}`};return{name:"Conv2DTransposeMatMul",shaderCache:{hint:`${e.cacheKey};${v};${w};${h}`,inputDependencies:F},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:S[0],y:S[1],z:S[2]},programUniforms:K}),getShaderSource:_e}}});var t1,su,Nb=C(()=>{"use strict";ue();mr();ye();he();t1=(r,e,n,t,o,i=!1,s,a,u=!1)=>{let l=u?1:2,f=u?2:3,c=u?3:1,p=i?2:1,b=`
  fn setOutputAtIndex(flatIndex : u32, value : ${i?`vec4<${s}>`:s}) {
    result[flatIndex] = ${i?`vec4<${s}>`:s}(value);
  }`;t&&(b+=`
    fn getBiasByOutputCoords(coords : vec4<u32>) -> ${i?`vec4<${s}>`:s} {
      return bias[coords.${u?"w":"y"}${i?"/ 4":""}];
    }`);let h=i?4:1,g=D("W",e[1].dataType,e[1].dims.length,h),T=D("Dy",e[0].dataType,e[0].dims.length,h),w=[T,g];t&&w.push(D("bias",e[2].dataType,[n[c]].length,h));let v=G("result",e[0].dataType,n.length,h),S=`{
        let batch: u32 = ${o?"global_id.z":"workgroup_id.z"} / uniforms.result_shape[1];
        let r = ${o?"global_id.z":"workgroup_id.z"} % uniforms.result_shape[1];
        let c = ${o?"global_id.y":"workgroup_id.y"} * ${p};
        let d1: u32 = ${o?"global_id.x":"workgroup_id.x"} * 4;

        let dyCorner = vec2<i32>(i32(r), i32(c)) - vec2<i32>(uniforms.pads);

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        var dotProd: array<vec4<${s}>, ${p}>;
        for (var i = 0; i < ${p}; i++) {
          dotProd[i] = vec4<${s}>(0.0);
        }
        for (var wR: u32 = 0; wR < uniforms.filter_dims[0]; wR = wR + 1) {
          var dyR = (${s}(dyCorner.x) + ${s}(wR)) / ${s}(uniforms.strides.x);
          let wRPerm = uniforms.filter_dims[0] - 1 - wR;
          if (dyR < 0.0 || dyR >= ${s}(uniforms.Dy_shape[1]) ||
              fract(dyR) > 0.0 || wRPerm < 0) {
            continue;
          }
          let idyR: u32 = u32(dyR);

          for (var wC: u32 = 0; wC < uniforms.filter_dims[1]; wC = wC + 1) {
            let dyC = (${s}(dyCorner.y) + ${s}(wC)) / ${s}(uniforms.strides.y);
            let dyC2 = (${s}(dyCorner.y) + 1.0 + ${s}(wC)) / ${s}(uniforms.strides.y);
            let wCPerm = uniforms.filter_dims[1] - 1 - wC;
            if (wCPerm < 0) {
              continue;
            }
            var bDyCVal = true;
            var bDyCVal2 = true;
            if (dyC < 0.0 || dyC >= ${s}(uniforms.Dy_shape[2]) ||
                fract(dyC) > 0.0) {
              bDyCVal = false;
            }
            if (dyC2 < 0.0 || dyC2 >= ${s}(uniforms.Dy_shape[2]) ||
                fract(dyC2) > 0.0) {
              bDyCVal2 = false;
            }

            let idyC: u32 = u32(dyC);
            let idyC2: u32 = u32(dyC2);
            if (bDyCVal && bDyCVal2) {
              let d2Length = uniforms.Dy_shape[3];
              for (var d2 :u32 = 0; d2 < d2Length; d2 = d2 + 4) {
                let wValue0 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1","d2")};
                let wValue1 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 1","d2")};
                let wValue2 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 2","d2")};
                let wValue3 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 3","d2")};

                var xValue = ${T.get("batch","idyR","idyC","d2")};
                let tmpval = vec4<${s}>(dot(xValue, wValue0),
                                      dot(xValue, wValue1),
                                      dot(xValue, wValue2),
                                      dot(xValue, wValue3));
                dotProd[0] = dotProd[0] + tmpval;

                xValue =  ${T.get("batch","idyR","idyC2","d2")};

                dotProd[1] = dotProd[1] + vec4<${s}>(dot(xValue, wValue0),
                                                    dot(xValue, wValue1),
                                                    dot(xValue, wValue2),
                                                    dot(xValue, wValue3));
              }
            } else if (bDyCVal) {
              let d2Length = uniforms.Dy_shape[${c}];
              for (var d2: u32 = 0; d2 < d2Length; d2 = d2 + 4) {
                let wValue0 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1","d2")};
                let wValue1 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 1","d2")};
                let wValue2 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 2","d2")};
                let wValue3 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 3","d2")};

                var xValue = ${T.get("batch","idyR","idyC","d2")};
                let tmpval = vec4<${s}>(dot(xValue, wValue0),
                                      dot(xValue, wValue1),
                                      dot(xValue, wValue2),
                                      dot(xValue, wValue3));
                dotProd[0] = dotProd[0] + tmpval;
              }
            } else if (bDyCVal2) {
              let d2Length = uniforms.Dy_shape[3];
              for (var d2: u32 = 0; d2 < d2Length; d2 = d2 + 4) {
                let wValue0 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1","d2")};
                let wValue1 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 1","d2")};
                let wValue2 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 2","d2")};
                let wValue3 = ${g.get("u32(wRPerm)","u32(wCPerm)","d1 + 3","d2")};

                var xValue = ${T.get("batch","idyR","idyC2","d2")};
                let tmpval = vec4<${s}>(dot(xValue, wValue0),
                                      dot(xValue, wValue1),
                                      dot(xValue, wValue2),
                                      dot(xValue, wValue3));
                dotProd[1] = dotProd[1] + tmpval;
              }
            }
          }
        }

        for (var i: u32 = 0; i < ${p}; i = i + 1) {
          let value = dotProd[i] + ${t?"bias[c+i]":`vec4<${s}>(0.0)`};
          ${v.set("batch","r","c + i","d1","value")};
        }
      }`,$=`
          let outputIndices = ${v.offsetToIndices("global_idx")};
          let batch = ${v.indicesGet("outputIndices",0)};
          let d1 = ${v.indicesGet("outputIndices",c)};
          let r = ${v.indicesGet("outputIndices",l)};
          let c = ${v.indicesGet("outputIndices",f)};
          let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
          let dyRCorner = dyCorner.x;
          let dyCCorner = dyCorner.y;
          let groupId = d1 / uniforms.output_channels_per_group;
          let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
          // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
          // ? = to be determined. : = across all values in that axis.
          var dotProd = ${s}(0.0);
          for (var wR: u32 = 0; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
            if (wR % uniforms.dilations.x != 0) {
              continue;
            }
            let dyR = (${s}(dyRCorner) + ${s}(wR)) / ${s}(uniforms.strides[0]);
            let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
            if (dyR < 0.0 || dyR >= ${s}(uniforms.Dy_shape[${l}]) || fract(dyR) > 0.0 ||
                wRPerm < 0) {
              continue;
            }
            let idyR: u32 = u32(dyR);

            for (var wC: u32 = 0; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
              if (wC % uniforms.dilations.y != 0) {
                continue;
              }
              let dyC = (${s}(dyCCorner) + ${s}(wC)) / ${s}(uniforms.strides.y);
              let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
              if (dyC < 0.0 || dyC >= ${s}(uniforms.Dy_shape[${f}]) ||
                  fract(dyC) > 0.0 || wCPerm < 0) {
                continue;
              }
              let idyC: u32 = u32(dyC);
              var inputChannel = groupId * uniforms.input_channels_per_group;
              for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group; d2 = d2 + 1) {
                let xValue = ${u?T.get("batch","idyR","idyC","inputChannel"):T.get("batch","inputChannel","idyR","idyC")};
                let wValue = ${g.get("inputChannel","wOutChannel","u32(wRPerm)","u32(wCPerm)")};
                dotProd = dotProd + xValue * wValue;
                inputChannel = inputChannel + 1;
              }
            }
          }
          let value = dotProd + ${t?"bias[d1]":`${s}(0.0)`};
          ${v.setByOffset("global_idx","value")};
        `;return`
  ${r.registerUniforms(a).declareVariables(...w,v)}
  ${b}

    ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
  ${i?S:$}}`},su=(r,e,n)=>{let t=r.length>2,o=e.outputShape,i=B.size(o),s=[Math.ceil(i/64),1,1];Ne("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${s}`);let a=e.format==="NHWC",u=["rank","rank"],l=[e.strides[0],e.strides[1]],f=[e.kernelShape[a?1:2],e.kernelShape[a?2:3]],c=[e.dilations[0],e.dilations[1]],p=[f[0]+(e.dilations[0]<=1?0:(e.kernelShape[a?1:2]-1)*(e.dilations[0]-1)),f[1]+(e.dilations[1]<=1?0:(e.kernelShape[a?2:3]-1)*(e.dilations[1]-1))],b=[p[0]-1-Math.floor((e.pads[0]+e.pads[2])/2),p[1]-1-Math.floor(e.pads[1]+e.pads[3])/2],h=!1,g=e.group,T=r[1].dims,w=T[0]/g,v=T[1],S=[{type:12,data:i},{type:12,data:l},{type:12,data:f},{type:12,data:c},{type:12,data:p},{type:6,data:b},{type:12,data:w},{type:12,data:v},...W(r[0].dims,r[1].dims)];t&&(S.push(...W(r[2].dims)),u.push("rank")),S.push(...W(o));let $=s[1]===1&&s[2]===1,P=E=>{let N=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:l.length},{name:"filter_dims",type:"u32",length:f.length},{name:"dilations",type:"u32",length:f.length},{name:"effective_filter_dims",type:"u32",length:p.length},{name:"pads",type:"i32",length:b.length},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],z=Be(r[0].dataType);return`${t1(E,r,o,t,$,h,z,N,a)}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${e.cacheKey};`,inputDependencies:u},getRunData:()=>({dispatchGroup:{x:s[0],y:s[1],z:s[2]},outputs:[{dims:n?n(o):o,dataType:r[0].dataType}],programUniforms:S}),getShaderSource:P}}});var r1,n1,o1,zb,Fb,i1,a1,s1,u1,Mb,Vb=C(()=>{"use strict";Rb();Nb();Or();Jr();r1=(r,e,n,t,o,i)=>(r-1)*e+n+(t-1)*o+1-i,n1=(r,e,n,t,o)=>{let i=Math.floor(r/2);e==="SAME_UPPER"?(n[t]=i,n[o]=r-i):e==="SAME_LOWER"&&(n[t]=r-i,n[o]=i)},o1=(r,e,n,t,o,i,s,a,u,l)=>{let f=r.length-2,c=l.length===0;if(u.length===0)for(let h=0;h<f;++h)u.push(0);let p=r[0],b=e[a?3:1]*o;for(let h=0,g=r.length-f-(a?1:0);h<f;++h,++g){let T=r[g],w=c?T*s[h]:l[h],v=r1(T,s[h],i[h],e[g],n[h],w);n1(v,t,i,h,h+f),c&&l.push(s[h]*(T-1)+u[h]+(e[g]-1)*n[h]+1-i[h]-i[h+f])}l.splice(0,0,p),l.splice(a?3:1,0,b)},zb=(r,e)=>{let n=r.kernelShape.slice();if(r.kernelShape.length===0||r.kernelShape.reduce((c,p)=>c*p,1)===0){n.length=0;for(let c=2;c<e[1].dims.length;++c)n.push(e[1].dims[c])}let t=r.format==="NHWC";n.splice(0,0,e[1].dims[0]),n.splice(t?3:1,0,e[1].dims[1]);let o=r.pads.slice(),i=r.outputShape.slice(),s=r.outputPadding.slice(),a=e[0].dims,u=r.dilations.slice();if(u.reduce((c,p)=>c+p,0)===0){let c=e[0].dims.length-2;u=new Array(c).fill(1)}let l=r.strides.slice();if(l.reduce((c,p)=>c+p,0)===0){let c=e[0].dims.length-2;l=new Array(c).fill(1)}o1(a,n,u,r.autoPad,r.group,o,l,t,s,i);let f=Object.assign({},r);return Object.assign(f,{kernelShape:n,pads:o,outputPadding:s,outputShape:i,dilations:u,strides:l}),f},Fb=r=>{let e=zi(r),n=r.format,t=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof r.autoPad>"u"?0:r.autoPad],o=r.dilations,i=r.group,s=r.kernelShape,a=r.pads,u=r.strides,l=r.wIsConst(),f=r.outputPadding,c=r.outputShape;return{autoPad:t,format:n,dilations:o,group:i,kernelShape:s,outputPadding:f,outputShape:c,pads:a,strides:u,wIsConst:l,...e,cacheKey:`${r.format};${e.activation};`}},i1=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length!==4&&r[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(r[0].dims.length!==r[1].dims.length)throw new Error("filter does not have same dimension as input");let n=r[0].dims[e.format==="NHWC"?r[0].dims.length-1:1],t=r[1].dims[0];if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let o=r[1].dims[1]*e.group;if(r.length===3&&(r[2].dims.length!==1||r[2].dims[0]!==o))throw new Error("invalid bias");let i=r[0].dims.length-2;if(e.dilations.reduce((f,c)=>f+c,0)>0&&e.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(e.strides.reduce((f,c)=>f+c,0)>0&&e.strides.length!==i)throw new Error(`strides should be ${i}D`);if(e.pads.reduce((f,c)=>f+c,0)>0&&e.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(e.outputPadding.length!==i&&e.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(e.kernelShape.reduce((f,c)=>f+c,0)>0&&e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape");if(e.outputShape.length!==0&&e.outputShape.length!==r[0].dims.length-2)throw new Error("invalid output shape")},a1=[2,3,1,0],s1=(r,e,n)=>{let t=zb(n,e),o=n.format==="NHWC",i=t.outputShape,s=i[o?3:1],a=e[0].dims[o?3:1];if(t.group!==1||s===1&&a===1){r.compute(su(e,t));return}let u=i[o?1:2],l=i[o?2:3],f=e[1].dims[2],c=e[1].dims[3],p=o?u*l:s,b=o?s:u*l,h=f*c*a,g=!0,T=r.kernelCustomData.wT??r.compute(Tt(e[1],a1),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=T);let w=[e[0],T],v=e.length===3;v&&(!o&&e[2].dims.length===1?w.push(e[2].reshape([e[2].dims[0],1,1])):w.push(e[2])),r.compute(Lb(w,t,i,p,b,h,v,g),{inputs:w})},u1=(r,e)=>{let n=e.format==="NHWC",t=[r.inputs[0].reshape(n?[r.inputs[0].dims[0],1,r.inputs[0].dims[1],r.inputs[0].dims[2]]:[r.inputs[0].dims[0],r.inputs[0].dims[1],1,r.inputs[0].dims[2]]),r.inputs[1].reshape([r.inputs[1].dims[0],r.inputs[1].dims[1],1,r.inputs[1].dims[2]])];r.inputs.length===3&&t.push(r.inputs[2]);let o=e.kernelShape;(o.length===0||o[0]===0)&&(o=[r.inputs[1].dims[2]]);let i=e.dilations;(i.length===0||i[0]===0)&&(i=[1]);let s=e.strides;(s.length===0||s[0]===0)&&(s=[1]);let a=e.pads;a.length===0&&(a=[0,0]),a=[0,a[0],0,a[1]],s=[1].concat(s),i=[1].concat(i),o=[1].concat(o);let u=zb({...e,pads:a,strides:s,dilations:i,kernelShape:o},t);r.compute(su(t,u,l=>n?[l[0],l[2],l[3]]:[l[0],l[1],l[3]]))},Mb=(r,e)=>{i1(r.inputs,e),r.inputs[0].dims.length===3?u1(r,e):s1(r,r.inputs,e)}});var l1,Gb,Ub,Wb=C(()=>{"use strict";ue();ye();et();he();l1=(r,e,n,t)=>{let o=B.size(e),i=e.length,s=D("input",r,i),a=G("output",r,i),u=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),l=B.normalizeAxis(u,i),f=c=>{let p=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,b=Z("uniforms.input_shape","uniforms.axis",i),h=t.reverse?p+(t.exclusive?" + 1":""):"0",g=t.reverse?b:p+(t.exclusive?"":" + 1");return`
                ${c.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,a)}
                ${c.mainStart()}
                  ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${a.offsetToIndices("global_idx")};
                  var sum = ${a.type.value}(0);
                  let first : i32 = ${h};
                  let last : i32 = ${g};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${a.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:e,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},{type:12,data:l},...W(e,e)]}),getShaderSource:f}},Gb=(r,e)=>{let n=r.inputs[0].dims,t=r.inputs[0].dataType,o=r.inputs[1];r.compute(l1(t,n,o,e),{inputs:[0]})},Ub=r=>{let e=r.exclusive===1,n=r.reverse===1;return de({exclusive:e,reverse:n})}});var c1,f1,d1,Hb,qb,Kb=C(()=>{"use strict";ue();ye();et();he();c1=r=>{if(!r||r.length!==1)throw new Error("DepthToSpace requires 1 input.");if(r[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},f1=(r,e,n,t)=>{let o=[];o.push(`fn perm(i: ${t.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let i=0;i<e;++i)o.push(n.indicesSet("a",r[i],`i[${i}]`));return o.push("return a;}"),o.join(`
`)},d1=(r,e)=>{let n,t,o,i,s,a,u=e.format==="NHWC",l=e.blocksize,f=e.mode==="DCR";u?([n,t,o,i]=r.dims,s=f?[n,t,o,l,l,i/l**2]:[n,t,o,i/l**2,l,l],a=f?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,t,o,i]=[r.dims[0],r.dims[2],r.dims[3],r.dims[1]],s=f?[n,l,l,i/l**2,t,o]:[n,i/l**2,l,l,t,o],a=f?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let c=r.reshape(s),p=c.dims.length,b=r.dataType,h=D("a",b,p),g=G("output",b,p),T=w=>`
  ${w.registerUniform("output_size","u32").declareVariables(h,g)}

  ${f1(a,p,h,g)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${g.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${g.setByOffset("global_idx",h.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${r.dims};${e.blocksize};${e.mode}`,inputDependencies:["rank"]},getRunData:w=>{let v=u?[n,t*l,o*l,i/l**2]:[n,i/l**2,t*l,o*l],S=B.size(v),$=c.dims,P=B.sortBasedOnPerm($,a);return{outputs:[{dims:v,dataType:w[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...W($,P)]}},getShaderSource:T}},Hb=(r,e)=>{c1(r.inputs),r.compute(d1(r.inputs[0],e))},qb=r=>de({blocksize:r.blocksize,mode:r.mode,format:r.format})});var uu,Hi,jb,p1,m1,lu,cu,Xb,h1,Zb,Yb,Jb=C(()=>{"use strict";ue();ye();et();he();uu="[a-zA-Z]|\\.\\.\\.",Hi="("+uu+")+",jb="^"+Hi+"$",p1="("+Hi+",)*"+Hi,m1="^"+p1+"$",lu=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,n){let t=this.symbolToIndices.get(e);t===void 0?t=[n]:t.push(n),this.symbolToIndices.set(e,t)}},cu=class{constructor(e,n){this.equation=n;this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[t,o]=n.includes("->")?n.split("->",2):[n,""];if(!t.match(RegExp(m1)))throw new Error("Invalid LHS term");if(t.split(",").forEach((a,u)=>{let l=e[u].dims.slice();if(!a.match(RegExp(jb)))throw new Error("Invalid LHS term");let f=this.processTerm(a,!0,l,u);this.lhs.push(f)}),o==="")o+=[...this.symbolToInfo.entries()].filter(([a,u])=>u.count===1||a==="...").map(([a])=>a).join("");else if(!o.match(RegExp(Hi)))throw new Error("Invalid RHS");o.match(RegExp(uu,"g"))?.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let u=this.symbolToInfo.get(a);if(u===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(u.dimValue)}}),this.rhs=this.processTerm(o,!1,this.outputDims)}addSymbol(e,n,t){let o=this.symbolToInfo.get(e);if(o!==void 0){if(o.dimValue!==n&&o.count!==1)throw new Error("Dimension mismatch");o.count++,o.inputIndices.push(t)}else o={count:1,dimValue:n,inputIndices:[t]};this.symbolToInfo.set(e,o)}processTerm(e,n,t,o=-1){let i=t.length,s=!1,a=[],u=0;if(!e.match(RegExp(jb))&&!n&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(uu,"g")),f=new lu(o);return l?.forEach((c,p)=>{if(c==="..."){if(s)throw new Error("Only one ellipsis is allowed per input term");s=!0;let b=i-l.length+1;if(b<0)throw new Error("Ellipsis out of bounds");if(a=t.slice(u,u+b),this.hasEllipsis){if(this.ellipsisDims.length!==a.length||this.ellipsisDims.toString()!==a.toString())throw new Error("Ellipsis dimensions mismatch")}else if(n)this.hasEllipsis=!0,this.ellipsisDims=a;else throw new Error("Ellipsis must be specified in the LHS");for(let h=0;h<a.length;h++){let g=String.fromCharCode("0".charCodeAt(0)+h);f.addSymbol(g,p+h),this.addSymbol(g,t[u++],o)}}else f.addSymbol(c,p+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,t[u++],o)}),f}},Xb=r=>r+"_max",h1=(r,e,n,t)=>{let i=r.map(f=>f.length).map((f,c)=>D(`input${c}`,e,f)),s=B.size(t),a=G("output",e,t.length),u=[...n.symbolToInfo.keys()].filter(f=>!n.rhs.symbolToIndices.has(f)),l=f=>{let c=[],p="var prod = 1.0;",b="var sum = 0.0;",h="sum += prod;",g=[],T=[],w=[],v=[],S=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((P,E)=>{if(n.rhs.symbolToIndices.has(E)){let N=n.rhs.symbolToIndices.get(E)?.[0];N!==void 0&&n.lhs.forEach((z,q)=>{if(P.inputIndices.includes(q)){let K=z.symbolToIndices.get(E);if(K===void 0)throw new Error("Invalid symbol error");K.forEach(F=>{c.push(`${i[q].indicesSet(`input${q}Indices`,F,a.indicesGet("outputIndices",N))}`)})}})}else n.lhs.forEach((N,z)=>{if(P.inputIndices.includes(z)){let q=N.symbolToIndices.get(E);if(q===void 0)throw new Error("Invalid symbol error");q.forEach(K=>{g.push(`${i[z].indicesSet(`input${z}Indices`,K,`${E}`)}`)}),v.push(`prod *= ${i[z].getByIndices(`input${z}Indices`)};`)}}),T.push(`for(var ${E}: u32 = 0; ${E} < uniforms.${Xb(E)}; ${E}++) {`),w.push("}")});let $=S?[...c,`let sum = ${i.map((P,E)=>P.getByIndices(`input${E}Indices`)).join(" * ")};`]:[...c,b,...T,...g,p,...v,h,...w];return`
            ${f.registerUniforms(u.map(P=>({name:`${Xb(P)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...i,a)}

            ${f.mainStart()}
            ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${a.offsetToIndices("global_idx")};
            ${i.map((P,E)=>`var input${E}Indices: ${i[E].type.indices};`).join(`
`)}
            ${$.join(`
`)};
            ${a.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:n.equation,inputDependencies:r.map(()=>"rank")},getRunData:()=>{let f=u.filter(p=>n.symbolToInfo.has(p)).map(p=>({type:12,data:n.symbolToInfo.get(p)?.dimValue||0}));f.push({type:12,data:s});let c=r.map((p,b)=>[...W(p)]).reduce((p,b)=>p.concat(b),f);return c.push(...W(t)),{outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}},getShaderSource:l}},Zb=(r,e)=>{let n=new cu(r.inputs,e.equation),t=n.outputDims,o=r.inputs.map((i,s)=>i.dims);r.compute(h1(o,r.inputs[0].dataType,n,t))},Yb=r=>{let e=r.equation.replace(/\s+/g,"");return de({equation:e})}});var g1,Qb,b1,y1,ey,ty=C(()=>{"use strict";ue();ye();he();g1=r=>{if(!r||r.length!==2)throw new Error("Expand requires 2 input.");let e=r[0].dims,n=Array.from(r[1].getBigInt64Array(),Number),t=n.length<e.length?0:n.length-e.length,o=e.length<n.length?0:e.length-n.length;for(;t<n.length&&o<e.length;++t,++o)if(n[t]!==e[o]&&n[t]!==1&&e[o]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Qb=(r,e)=>{let n=r.length-e.length,t=[];for(let o=0;o<n;++o)t.push(r[o]);for(let o=0;o<e.length;++o)t.push(e[o]===1?r[o+n]:e[o]);return t},b1=(r,e)=>r.length>e.length?Qb(r,e):Qb(e,r),y1=r=>{let e=r[0].dims,n=Array.from(r[1].getBigInt64Array(),Number),t=b1(e,n),o=r[0].dataType,i=o===9?4:1,s=Math.ceil(B.size(t)/i),a=l=>{let f=D("input",o,e.length,i),c=G("output",o,t.length,i),p;if(o===9){let b=(h,g,T="")=>`
          let outputIndices${g} = ${c.offsetToIndices(`outputOffset + ${g}u`)};
          let offset${g} = ${f.broadcastedIndicesToOffset(`outputIndices${g}`,c)};
          let index${g} = offset${g} / 4u;
          let component${g} = offset${g} % 4u;
          ${h}[${g}] = ${T}(${f.getByOffset(`index${g}`)}[component${g}]);
        `;p=`
        let outputOffset = global_idx * ${i};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${c.setByOffset("global_idx","data")}
      }`}else p=`
        let outputIndices = ${c.offsetToIndices("global_idx")};
        let inputOffset = ${f.broadcastedIndicesToOffset("outputIndices",c)};
        ${c.setByOffset("global_idx",f.getByOffset("inputOffset"))}
      }`;return`
    ${l.registerUniform("vec_size","u32").declareVariables(f,c)}
    ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${p}`},u=[{type:12,data:s},...W(e,t)];return{name:"Expand",shaderCache:{hint:`${t.length}`,inputDependencies:["rank"]},getShaderSource:a,getRunData:()=>({outputs:[{dims:t,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},ey=r=>{g1(r.inputs),r.compute(y1(r.inputs),{inputs:[0]})}});var x1,ry,ny=C(()=>{"use strict";ue();ye();he();Ni();x1=r=>{let e=r[0].dataType,n=B.size(r[0].dims),t=B.size(r[1].dims),o=t%4===0,i=s=>{let a=D("x",e,[1],4),u=D("bias",e,[1],4),l=G("y",e,[1],4),f=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],c=b=>`
      let bias${b}_offset: u32 = (global_idx * 4 + ${b}) % uniforms.bias_size;
      let bias${b} = ${u.getByOffset(`bias${b}_offset / 4`)}[bias${b}_offset % 4];`,p=o?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${c(0)}${c(1)}${c(2)}${c(3)}
      let bias = ${a.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(f).declareVariables(a,u,l)}

    ${Zs(ct(e))}

    ${s.mainStart(Zr)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${a.getByOffset("global_idx")};
      ${p}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",Ys("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${o}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:t}],dispatchGroup:{x:Math.ceil(n/Zr/4)}})}},ry=r=>{r.inputs.length<2||B.size(r.inputs[1].dims)===0?nb(r):r.compute(x1(r.inputs))}});var v1,w1,oy,iy,ay=C(()=>{"use strict";ue();ye();et();he();v1=r=>{if(!r||r.length!==2)throw new Error("Gather requires 2 inputs.")},w1=(r,e)=>{let n=r[0].dims,t=r[1].dims,o=n.length,i=B.normalizeAxis(e.axis,o),s=n.slice(0);s.splice(i,1,...t);let a=n[i],u=r[0].dataType===9?4:1,l=Math.ceil(B.size(s)/u),f=[{type:12,data:l},{type:6,data:a},{type:12,data:i},...W(r[0].dims,r[1].dims,s)],c=p=>{let b=D("data",r[0].dataType,r[0].dims.length,u),h=D("inputIndices",r[1].dataType,r[1].dims.length),g=G("output",r[0].dataType,s.length,u),T=v=>{let S=t.length,$=`var indicesIndices${v}  = ${h.type.indices}(0);`;for(let P=0;P<S;P++)$+=`${S>1?`indicesIndices${v}[${P}]`:`indicesIndices${v}`} = ${s.length>1?`outputIndices${v}[uniforms.axis + ${P}]`:`outputIndices${v}`};`;$+=`
          var idx${v} = ${h.getByIndices(`indicesIndices${v}`)};
          if (idx${v} < 0) {
            idx${v} = idx${v} + uniforms.axisDimLimit;
          }
          var dataIndices${v} : ${b.type.indices};
        `;for(let P=0,E=0;P<o;P++)P===i?($+=`${o>1?`dataIndices${v}[${P}]`:`dataIndices${v}`} = u32(idx${v});`,E+=S):($+=`${o>1?`dataIndices${v}[${P}]`:`dataIndices${v}`} = ${s.length>1?`outputIndices${v}[${E}]`:`outputIndices${v}`};`,E++);return $},w;if(r[0].dataType===9){let v=(S,$,P="")=>`
          let outputIndices${$} = ${g.offsetToIndices(`outputOffset + ${$}u`)};
          ${T($)};
          let offset${$} = ${b.indicesToOffset(`dataIndices${$}`)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${S}[${$}] = ${P}(${b.getByOffset(`index${$}`)}[component${$}]);
        `;w=`
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${v("value",0,"u32")}
        ${v("value",1,"u32")}
        ${v("value",2,"u32")}
        ${v("value",3,"u32")}
        ${g.setByOffset("global_idx","value")}
      `}else w=`
      let outputIndices = ${g.offsetToIndices("global_idx")};
      ${T("")};
      let value = ${b.getByIndices("dataIndices")};
      ${g.setByOffset("global_idx","value")};
      `;return`
      ${p.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(b,h,g)}
      ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${w}
      }`};return{name:"Gather",shaderCache:{hint:e.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:c}},oy=r=>de({axis:r.axis}),iy=(r,e)=>{let n=r.inputs;v1(n),r.compute(w1(r.inputs,e))}});var T1,_1,sy,uy,ly=C(()=>{"use strict";ue();ye();et();he();T1=r=>{if(!r||r.length!==2)throw new Error("GatherElements requires 2 inputs.");if(r[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(r[0].dims.length!==r[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},_1=(r,e)=>{let n=r[0].dims,t=r[0].dataType,o=n.length,i=r[1].dims,s=r[1].dataType,a=B.normalizeAxis(e.axis,o),u=n[a],l=i.slice(0),f=B.size(l),c=D("input",t,o),p=D("indicesInput",s,i.length),b=G("output",t,l.length),h=[{type:12,data:f},{type:6,data:u},{type:12,data:a}];return h.push(...W(n,i,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:h}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(c,p,b)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${b.offsetToIndices("global_idx")};

      var idx = ${p.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${c.type.indices}(outputIndices);
      ${c.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${c.getByIndices("inputIndices")};

      ${b.setByOffset("global_idx","value")};
  }`}},sy=r=>de({axis:r.axis}),uy=(r,e)=>{let n=r.inputs;T1(n),r.compute(_1(r.inputs,e))}});var I1,S1,cy,fy,dy=C(()=>{"use strict";ue();ye();he();I1=r=>{if(!r)throw new Error("Input is missing");if(r.length<2||r.length>3)throw new Error("Invaid input number.");if(r.length===3&&r[2].dims.length>2)throw new Error("Invalid input shape of C");if(r[0].dataType!==r[1].dataType||r.length===3&&r[0].dataType!==r[2].dataType)throw new Error("Input types are mismatched")},S1=(r,e)=>{let n=r[0].dims.slice(),t=r[1].dims.slice(),[o,i,s]=Oi.getShapeOfGemmResult(n,e.transA,t,e.transB,r.length===3?r[2].dims:void 0),a=[o,i];if(!a)throw new Error("Can't use gemm on the given tensors");let u=B.size(a),l=[{type:12,data:u},{type:12,data:o},{type:12,data:i},{type:12,data:s},{type:1,data:e.alpha},{type:1,data:e.beta}],f=["type","type"];r.length===3&&(l.push(...W(r[2].dims)),f.push("rank")),l.push(...W(a));let c=p=>{let b="";e.transA&&e.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":e.transA&&!e.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!e.transA&&e.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!e.transA&&!e.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let h=e.alpha===1?"":"value *= uniforms.alpha;",g=D("a",r[0].dataType,r[0].dims),T=D("b",r[1].dataType,r[1].dims),w=g.type.value,v=null,S=[g,T];r.length===3&&(v=D("c",r[2].dataType,r[2].dims.length),S.push(v));let $=G("output",r[0].dataType,a.length);S.push($);let P=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${p.registerUniforms(P).declareVariables(...S)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${w}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${h}
    ${(()=>v!=null?`let cOffset = ${v.broadcastedIndicesToOffset("vec2(m, n)",$)}; value += ${w}(uniforms.beta) * ${v.getByOffset("cOffset")};`:"")()}
    output[global_idx] = value;
  }`};return{name:"Gemm",shaderCache:{hint:`${e.cacheKey}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:a,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:c}},cy=r=>{let e=r.transA,n=r.transB,t=r.alpha,o=r.beta;return{transA:e,transB:n,alpha:t,beta:o,cacheKey:`${r.transA};${r.transB};${r.alpha===1}`}},fy=(r,e)=>{I1(r.inputs),r.compute(S1(r.inputs,e))}});var _t,P1,my,py,O1,eo,hy,fu=C(()=>{"use strict";ue();ye();et();Pi();Li();he();Jr();_t=(r,e)=>r.length>e&&r[e].dims.length>0&&B.size(r[e].dims)>0?r[e]:void 0,P1=(r,e)=>{let n=r[0],t=_t(r,1),o=_t(r,2),i=_t(r,3),s=_t(r,4),a=_t(r,5),u=_t(r,6),l=_t(r,7);if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let f=!1,c=n.dims[0],p=n.dims[1],b=n.dims.length===3?f?n.dims[2]/3:n.dims[2]:e.numHeads*n.dims[4],h=p,g=0,T=0,w=Math.floor(b/e.numHeads);if(u&&l){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==e.numHeads||u.dims[3]!==w)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==c||l.dims[1]!==e.numHeads||l.dims[3]!==w)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=u.dims[2],T=u.dims[2]}else if(u||l)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v;if(t){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(t.dims.length<3||t.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==t.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(t.dims.length===3){if(t.dims[2]!==n.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');v=2,h=t.dims[1]}else if(t.dims.length===5){if(t.dims[2]!==e.numHeads||t.dims[3]!==2||t.dims[4]!==w)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');v=5,h=t.dims[1]}else{if(t.dims[1]!==e.numHeads||t.dims[3]!==w)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');v=0,h=t.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(n.dims.length===5&&(n.dims[2]!==e.numHeads||n.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}if(i){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(o&&n.dims.length===5&&n.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let S=0;if(s){S=8;let z=s.dims;throw z.length===1?z[0]===c?S=1:z[0]===3*c+2&&(S=3):z.length===2&&z[0]===c&&z[1]===h&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, kv_sequence_length)'):new Error("Mask not supported")}let $=!1,P=b;if(o){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(h!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');P=o.dims[2]}else{if(h!==o.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');P=o.dims[1]*o.dims[3],$=!0}}let E=g+h,N=!1;if(s)throw new Error("Key padding mask is not supported");if(a){if(a.dims.length!==4)throw new Error('Input "relative_position_bias" is expected to have 4 dimensions');if(a.dims[0]!==c&&a.dims[0]!==1||a.dims[1]!==e.numHeads||a.dims[2]!==p||a.dims[3]!==E)throw new Error('Input "relative_position_bias" shape (batch_size, 1, sequence_length, kv_sequence_length)')}return{batchSize:c,sequenceLength:p,pastSequenceLength:g,kvSequenceLength:h,totalSequenceLength:E,maxSequenceLength:T,inputHiddenSize:0,hiddenSize:b,vHiddenSize:P,headSize:w,vHeadSize:Math.floor(P/e.numHeads),numHeads:e.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:e.maskFilterValue,maskType:S,scale:e.scale,broadcastResPosBias:N,passPastInKv:$,qkvFormat:v}},my=r=>de({...r}),py=de({perm:[0,2,1,3]}),O1=(r,e,n,t,o,i,s)=>{let a=[t,o,i],u=B.size(a),l=[{type:12,data:u},{type:12,data:s},{type:12,data:i}],f=c=>{let p=G("qkv_with_bias",e.dataType,a),b=D("qkv",e.dataType,a),h=D("bias",n.dataType,a),g=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${c.registerUniforms(g).declareVariables(b,h,p)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return r.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:a,dataType:e.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:f},{inputs:[e,n],outputs:[-1]})[0]},eo=(r,e,n,t,o,i,s,a)=>{let u=i;if(s){if(t===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=O1(r,i,s,e,t,n*o,a),u=u.reshape([e,t,n,o]),r.compute(Tt(u,py.perm),{inputs:[u],outputs:[-1]})[0]}else return i.dims.length===3&&(u=i.reshape([e,t,n,o])),r.compute(Tt(u,py.perm),{inputs:[u],outputs:[-1]})[0]},hy=(r,e)=>{let n=P1(r.inputs,e),t=r.inputs[0],o=_t(r.inputs,1),i=_t(r.inputs,2),s=_t(r.inputs,3),a=_t(r.inputs,4),u=_t(r.inputs,5),l=_t(r.inputs,6),f=_t(r.inputs,7);if(t.dims.length===5)throw new Error("Packed QKV is not implemented");if(o?.dims.length===5)throw new Error("Packed KV is not implemented");let c=o&&i&&o.dims.length===4&&i.dims.length===4,p=eo(r,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t,s,0);if(c)return In(r,p,o,i,a,void 0,l,f,u,n,e);if(!o||!i)throw new Error("key and value must be provided");let b=eo(r,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,o,s,n.hiddenSize),h=eo(r,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,i,s,2*n.hiddenSize);In(r,p,b,h,a,void 0,l,f,u,n,e)}});var gy,E1,C1,du,by,pu=C(()=>{"use strict";ue();ye();he();gy=r=>Array.from(r.getBigInt64Array(),Number),E1=r=>{if(!r||r.length!==2)throw new Error("Tile requires 2 inputs.");if(r[0].dataType!==1&&r[0].dataType!==10&&r[0].dataType!==6&&r[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(r[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(r[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(gy(r[1]).length!==r[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},C1=(r,e)=>{let n=[];for(let t=0;t<r.length;++t)n.push(r[t]*e[t]);return n},du=(r,e)=>{let n=r[0].dims,t=e??gy(r[1]),o=C1(n,t),i=B.size(o),s=r[0].dataType,a=D("input",s,n.length),u=G("output",s,o.length),l=f=>`
      const inputShape = ${a.indices(...n)};
      ${f.registerUniform("output_size","u32").declareVariables(a,u)}
      ${f.mainStart()}
      ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${u.offsetToIndices("global_idx")};
      var input_indices: ${a.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${a.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${u.indicesGet("output_indices","i")}  % input_dim_i;

        ${a.indicesSet("input_indices","i","input_dim_value")}
      }
      ${u.setByOffset("global_idx",a.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:o,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...W(r[0].dims,o)]}),getShaderSource:l}},by=r=>{E1(r.inputs),r.compute(du(r.inputs),{inputs:[0]})}});var k1,yy,vy,D1,xy,wy,Ty=C(()=>{"use strict";ue();ye();et();Li();he();fu();pu();Jr();k1=(r,e)=>{let n=r[0],t=r[1],o=r[2],i=r[3],s=r[4];if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let a=!1,u=n.dims[0],l=n.dims[1],f=n.dims.length===3?a?n.dims[2]/3:n.dims[2]:e.numHeads*n.dims[4],c=l,p=0,b=0,h=Math.floor(f/e.numHeads),g=i&&i.dims.length!==0,T=s&&s.dims.length!==0,w=!0;if(g&&T){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');w?(p=i.dims[1],b=i.dims[1]):(p=i.dims[2],b=i.dims[2])}else if(g||T)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v;if(t){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(t.dims.length<3||t.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==t.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(t.dims.length===3){if(n.dims[2]%t.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');v=2,c=t.dims[1]}else if(t.dims.length===5){if(t.dims[2]!==e.numHeads||t.dims[3]!==2||t.dims[4]!==h)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');v=5,c=t.dims[1]}else{if(t.dims[1]!==e.numHeads||t.dims[3]!==h)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');v=0,c=t.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(n.dims.length===5&&(n.dims[2]!==e.numHeads||n.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}let S=0,$=!1,P=f;if(o){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(c!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');P=o.dims[2]}else{if(c!==o.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');P=o.dims[1]*o.dims[3],$=!0}}let E=p+c,N=!1;return{batchSize:u,sequenceLength:l,pastSequenceLength:p,kvSequenceLength:c,totalSequenceLength:E,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:f,vHiddenSize:P,headSize:h,vHeadSize:Math.floor(P/e.kvNumHeads),numHeads:e.numHeads,kvNumHeads:e.kvNumHeads,nReps:e.numHeads/e.kvNumHeads,pastPresentShareBuffer:!1,maskType:S,scale:e.scale,broadcastResPosBias:N,passPastInKv:$,qkvFormat:v,isPastkvBSNH:w}},yy=(r,e,n,t)=>{let o=[t.batchSize,t.totalSequenceLength,t.kvNumHeads,t.headSize],i=4,s=B.size(o)/i,a=t.totalSequenceLength,u=G("present_kv",n,o.length,i),l=D("new_kv",r.dataType,r.dims.length,i),f=e?D("past_kv",e.dataType,e.dims.length,i):void 0,c=Math.ceil(t.headSize/i),p={x:a,y:r.dims[0],z:1},b=e?["rank","rank"]:["rank"],h=[{type:12,data:s},{type:12,data:t.pastSequenceLength},{type:12,data:t.kvSequenceLength},{type:12,data:t.totalSequenceLength}],g=[l];f?(h.push(...W(r.dims),...W(e.dims),...W(o)),g.push(f)):h.push(...W(r.dims),...W(o));let T=[{name:"output_size",type:"u32"},{name:"past_seqlen",type:"u32"},{name:"new_seqlen",type:"u32"},{name:"present_seqlen",type:"u32"}],w=`      let past_batch_stride = uniforms.past_seqlen * num_heads * H;
        var past_head_stride = uniforms.past_seqlen * H;
        if (is_bsnh) {
          past_head_stride = H;
        }
        let in_offset = b * past_batch_stride + s * row_stride + n * past_head_stride + h;
        present_kv[out_offset] = past_kv[in_offset];`,v=`      let new_batch_stride = uniforms.new_seqlen * num_heads * H;
        let new_row_stride = num_heads * H;
        let new_head_stride = H;
        let in_offset = b * new_batch_stride + (s - past_seqlen) * new_row_stride + n * new_head_stride + h;
        present_kv[out_offset] = new_kv[in_offset];`,S=e?`if (s < past_seqlen) {
        ${w}
        } else if (s < past_seqlen + uniforms.new_seqlen) {
        ${v}
        }`:`if (s < past_seqlen + uniforms.new_seqlen) {
          ${v}
        }`,$=P=>`

  ${P.registerUniforms(T).declareVariables(...g,u)}
  ${P.mainStart([c,t.kvNumHeads,1])}
    ${P.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    var indices = ${u.offsetToIndices("global_idx")};
    let h = local_id.x;
    let n = local_id.y;
    let s = workgroup_id.x;
    let b = workgroup_id.y;
    let num_heads = ${t.kvNumHeads}u;
    let H = ${c}u;

    let present_seqlen = uniforms.present_seqlen;
    let present_batch_stride = present_seqlen * num_heads * H;
    var row_stride = H;
    let is_bsnh = ${t.isPastkvBSNH};

    if (is_bsnh) {
      row_stride = num_heads * H;
    }
    var present_head_stride = present_seqlen * H;
    if (is_bsnh) {
      present_head_stride = H;
    }

    let past_seqlen = uniforms.past_seqlen;

    let out_offset = b * present_batch_stride + s * row_stride + n * present_head_stride + h;
    ${S}
  }`;return{name:"ConcatPastNew",shaderCache:{hint:`${t.kvNumHeads}${c}${!!e}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:o,dataType:n}],dispatchGroup:p,programUniforms:h}),getShaderSource:$}},vy=r=>de({...r}),D1=de({perm:[0,2,1,3]}),xy=(r,e,n,t,o)=>{let i=e,s=t.kvNumHeads,a=t.nReps;return e.dims.length===3&&t.kvSequenceLength!==0&&(i=e.reshape([t.batchSize,t.kvSequenceLength,s,t.headSize])),n?i=r.compute(yy(i,n,i.dataType,t),{inputs:[i,n],outputs:[t.isPastkvBSNH?o:-1]})[0]:i=r.compute(yy(i,void 0,i.dataType,t),{inputs:[i],outputs:[t.isPastkvBSNH?o:-1]})[0],a!==1&&(i=r.compute(du([i],[1,1,1,a]),{inputs:[i],outputs:[-1]})[0],i=i.reshape([t.batchSize,t.totalSequenceLength,s*a,t.headSize])),r.compute(Tt(i,D1.perm),{inputs:[i],outputs:[-1]})[0]},wy=(r,e)=>{let n=k1(r.inputs,e);if(r.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(r.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let t=eo(r,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,r.inputs[0],void 0,0),o=r.inputs[3]&&r.inputs[3].dims.length!==0?r.inputs[3]:void 0,i=r.inputs[4]&&r.inputs[4].dims.length!==0?r.inputs[4]:void 0,s=xy(r,r.inputs[1],o,n,1),a=xy(r,r.inputs[2],i,n,2);In(r,t,s,a,void 0,void 0,void 0,void 0,void 0,n,e)}});var B1,L1,R1,_y,Iy=C(()=>{"use strict";ue();ye();he();B1=(r,e)=>{let n=r[0].dims,t=n,o=2,i=B.sizeToDimension(n,o),s=B.sizeFromDimension(n,o),a=ze(s),u=s/a,l=[n[0],n[1],u],f=["rank","type","type"],c=[{type:12,data:s},{type:12,data:u}];c.push(...W(l,l));let p=b=>{let h=D("x",r[0].dataType,l.length,a),g=D("scale",r[1].dataType,r[1].dims),T=D("bias",r[2].dataType,r[2].dims),w=G("output",r[0].dataType,l.length,a),v=[h,g,T,w],S=h.type.value,$=a===1?"f32":`vec${a}<f32>`,P=64,E=[{name:"normSize",type:"u32"},{name:"normPackedSize",type:"u32"}];return`
  var<workgroup> meanShared : f32;
  var<workgroup> squaredNormShared : f32;
  var<workgroup> workgroupShared : array<${$}, ${P}>;
  const workgroupSize = ${P}u;
  ${b.registerUniforms(E).declareVariables(...v)}
  ${b.mainStart(P)}
    let norm = global_idx / workgroupSize;
    let batch = norm / uniforms.x_shape[1];
    let channel = norm % uniforms.x_shape[1];
    let localIndex = local_id.x;

    // initialize workgroup memory
    var initial = ${$}(0);
    for (var h = localIndex; h < uniforms.normPackedSize; h += workgroupSize) {
      initial = initial + ${$}(${h.get("batch","channel","h")});
    }
    workgroupShared[localIndex] = initial;
    workgroupBarrier();

    // Calculate the mean of current channel data.
    for (var currSize = workgroupSize >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (localIndex < currSize) {
        workgroupShared[localIndex] = workgroupShared[localIndex] + workgroupShared[localIndex + currSize];
      }
      workgroupBarrier();
    }
    if (localIndex == 0) {
      meanShared = ${Ut("workgroupShared[0]",a)} / f32(uniforms.normSize);
    }
    workgroupBarrier();

    // reinitialize workgroup memory.
    initial = ${$}(0);
    for (var h = localIndex; h < uniforms.normPackedSize; h += workgroupSize) {
      let deviation =  ${$}(${h.get("batch","channel","h")}) - ${$}(meanShared);
      initial = initial + deviation * deviation;
    }
    workgroupShared[localIndex] = initial;
    workgroupBarrier();

    // Calculate the sum of square of deviation of current channel data.
    for (var currSize = workgroupSize >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (localIndex < currSize) {
        workgroupShared[localIndex] = workgroupShared[localIndex] + workgroupShared[localIndex + currSize];
      }
      workgroupBarrier();
    }
    if (localIndex == 0) {
      squaredNormShared = ${Ut("workgroupShared[0]",a)};
    }
    workgroupBarrier();

    let invStdDev = inverseSqrt(squaredNormShared / f32(uniforms.normSize) + f32(${e.epsilon}));
    let channelScale = invStdDev * f32(${g.getByOffset("channel")});
    let channelShift = f32(${T.getByOffset("channel")}) - meanShared * channelScale;
    for (var h = localIndex; h < uniforms.normPackedSize; h += workgroupSize) {
      let value = ${h.get("batch","channel","h")} * ${S}(${$}(channelScale)) + ${S}(${$}(channelShift));
      ${w.set("batch","channel","h","value")};
    }
  }`};return{name:"InstanceNormalization",shaderCache:{hint:`${e.epsilon};${a}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:t,dataType:r[0].dataType}],dispatchGroup:{x:i},programUniforms:c}),getShaderSource:p}},L1=(r,e,n,t,o,i,s,a)=>{let u=ze(s),l=64,f=u===1?"vec2f":`mat2x${u}f`,c=u===1?"f32":`vec${u}f`,p=(E,N)=>`${f}(${E}, ${N})`,b=o*s/u,h=Math.ceil(i/l),g=["type"],T=[{type:12,data:h},{type:12,data:i},{type:12,data:Math.floor(s/u)},{type:12,data:Math.floor(i*s/u)}],w=E=>{let N=D("input",e.dataType,e.dims,u);return`
  ${E.declareVariables(N)}
  @group(0) @binding(1) var<storage, read_write> output : array<${f}>;
  struct Uniforms {wg_size:u32, H:u32, C:u32, image_size:u32};
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  ${E.mainStart(l)}
    let currentImageNumber = global_idx / ${l} / uniforms.C;
    let currentChannelNumber = (global_idx / ${l}) % uniforms.C;
    let wgOffset = local_id.x * uniforms.wg_size;
    if (wgOffset >= uniforms.H) {
        return;
    }
    let wgMax = min(wgOffset + uniforms.wg_size, uniforms.H);

    let offset = currentImageNumber * uniforms.image_size + currentChannelNumber;
    var sum = ${Pr("f32",u)};
    var squaredSum = ${Pr("f32",u)};
    for (var i: u32 = wgOffset; i < wgMax; i++) {
        let value = ${c}(input[offset + i * uniforms.C]);
        sum += value;
        squaredSum += value * value;
    }
    output[global_idx] = ${p("sum","squaredSum")};
  }`},v=r.compute({name:"InstanceNormComputeMean",shaderCache:{hint:`${u}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:[o,s,l,2],dataType:1}],dispatchGroup:{x:o*s/u},programUniforms:T}),getShaderSource:w},{inputs:[e],outputs:[-1]})[0],S=[{type:12,data:b},{type:12,data:i},{type:12,data:Math.floor(s/u)},{type:12,data:Math.floor(l*s/u)}],$=["type","type","type"],P=E=>{let N=D("scale",n.dataType,n.dims,u),z=D("bias",t.dataType,t.dims,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${f}>;
  @group(0) @binding(1) var<storage, read> scale : array<${N.type.storage}>;
  @group(0) @binding(2) var<storage, read> bias : array<${z.type.storage}>;
  @group(0) @binding(3) var<storage, read_write> output : array<${f}>;
  struct Uniforms {units_of_work : u32, H: u32, C : u32, image_size : u32};
  @group(0) @binding(4) var<uniform> uniforms: Uniforms;

  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.units_of_work")}
    let currentImageNumber = global_idx / uniforms.C;
    let currentChannelNumber = global_idx % uniforms.C;

    let offset = currentImageNumber * uniforms.image_size;
    var sum = ${Pr("f32",u)};
    var squaredSum = ${Pr("f32",u)};
    for (var i: u32 = 0; i < min(${l}, uniforms.H); i++) {
        let value = input[offset + i + currentChannelNumber * ${l}];
        sum += value[0];
        squaredSum += value[1];
    }
    sum = sum / f32(uniforms.H);
    squaredSum = squaredSum / f32(uniforms.H);
    let invStdDev = inverseSqrt(squaredSum - sum * sum + f32(${a}));
    let channelScale = invStdDev * ${c}(scale[currentChannelNumber]);
    let channelShift = ${c}(bias[currentChannelNumber]) - sum * channelScale;

    output[global_idx] = ${p("channelScale","channelShift")};
  }`};return r.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${a}`,inputDependencies:$},getRunData:()=>({outputs:[{dims:[o,s,2],dataType:1}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:S}),getShaderSource:P},{inputs:[v,n,t],outputs:[-1]})[0]},R1=(r,e,n)=>{let t=e[0].dims,o=t,i=t[0],s=t[t.length-1],a=B.sizeFromDimension(t,1)/s,u=ze(s),l=B.size(o)/u,f=[{type:12,data:a},{type:12,data:Math.floor(s/u)}],c=["type","type"],p=L1(r,e[0],e[1],e[2],i,a,s,n.epsilon),b=h=>{let g=Be(e[0].dataType),T=u===1?"vec2f":`mat2x${u}f`,w=u===1?g:`vec${u}<${g}>`,v=D("input",e[0].dataType,e[0].dims,u),S=G("output",e[0].dataType,o,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${v.type.storage}>;
  @group(0) @binding(1) var<storage, read> scaleInput : array<${T}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${S.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${h.mainStart()}
    let currentImageNumber = global_idx / (uniforms.C * uniforms.H);
    let currentChannelNumber = global_idx % uniforms.C;

    let scaleOffset = currentImageNumber * uniforms.C + currentChannelNumber;
    let scale = scaleInput[scaleOffset];
    output[global_idx] = fma(input[global_idx], ${w}(scale[0]), ${w}(scale[1]));
  }`};r.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:b},{inputs:[e[0],p]})},_y=(r,e)=>{e.format==="NHWC"?R1(r,r.inputs,e):r.compute(B1(r.inputs,e))}});var N1,z1,Sy,$y=C(()=>{"use strict";ue();ye();he();N1=r=>{if(!r||r.length<2)throw new Error("layerNorm requires at least 2 inputs.")},z1=(r,e,n)=>{let t=e.simplified,o=r[0].dims,i=r[1],s=!t&&r[2],a=o,u=B.normalizeAxis(e.axis,o.length),l=B.sizeToDimension(o,u),f=B.sizeFromDimension(o,u),c=B.size(i.dims),p=s?B.size(s.dims):0;if(c!==f||s&&p!==f)throw new Error(`Size of X.shape()[axis:] == ${f}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${c} and bias size of ${p}`);let b=[];for(let P=0;P<o.length;++P)P<u?b.push(o[P]):b.push(1);let h=ze(f),g=["type","type"],T=[{type:12,data:l},{type:1,data:f},{type:12,data:Math.floor(f/h)},{type:1,data:e.epsilon}];s&&g.push("type");let w=n>1,v=n>2,S=P=>{let E=Be(r[0].dataType),N=[D("x",r[0].dataType,r[0].dims,h),D("scale",i.dataType,i.dims,h)];s&&N.push(D("bias",s.dataType,s.dims,h)),N.push(G("output",r[0].dataType,a,h)),w&&N.push(G("mean_data_output",1,b)),v&&N.push(G("inv_std_output",1,b));let z=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${P.registerUniforms(z).declareVariables(...N)}
  ${P.mainStart()}
    ${P.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Pr("f32",h)};
    var mean_square_vector = ${Pr("f32",h)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Yr(E,h,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Ut("mean_vector",h)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Ut("mean_square_vector",h)} / uniforms.norm_size ${t?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Yr(E,h,"x[j + offset]")};
      let f32scale = ${Yr(E,h,"scale[j]")};
      output[j + offset] = ${N[0].type.value}((f32input ${t?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Yr(E,h,"bias[j]")}`:""}
      );
    }

    ${w?"mean_data_output[global_idx] = mean":""};
    ${v?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},$=[{dims:a,dataType:r[0].dataType}];return w&&$.push({dims:b,dataType:1}),v&&$.push({dims:b,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${h};${n};${t}`,inputDependencies:g},getRunData:()=>({outputs:$,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:T}),getShaderSource:S}},Sy=(r,e)=>{N1(r.inputs),r.compute(z1(r.inputs,e,r.outputCount))}});var F1,M1,Ay,Py,Oy=C(()=>{"use strict";ue();ye();et();he();F1=(r,e)=>{if(r.length<3||r.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let n=r[0],t=n.dims.length;if(n.dims[t-1]!==e.k)throw new Error("The last dim of input shape does not match the k value");let o=Math.floor((e.k+e.blockSize-1)/e.blockSize),i=e.blockSize/8*e.bits,s=r[1];if(!B.areEqual(s.dims,[e.n,o,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=r[2].dims;if(B.size(u)!==e.n*o)throw new Error("scales input size error.");if(r.length===4){let f=r[3].dims,c=e.bits>4?e.n*o:e.n*Math.floor((o+1)/2);if(B.size(f)!==c)throw new Error("zeroPoints input size error.")}},M1=(r,e,n,t)=>{let o=r[0].dims,i=o.length,s=Math.floor((e.k+e.blockSize-1)/e.blockSize),a=o[i-2],u=e.k,l=e.n,f=o.slice(0,i-2),c=B.size(f),b=e.blockSize/8*e.bits/4,h=r[0].dataType,g=ze(a),T=ze(e.k),w=ze(b),v=jr(h),S=a*s*v,$=Math.floor(t/S),P=s<=n[0]&&$>0,E=!P||$>=4?ze(l):$>=2&&ze(l)>=2?2:1,N=f.concat([a,l]),z=B.size(N)/E/g,q=P?[]:[{type:12,data:z},{type:12,data:e.blockSize}],K=[c,a,u/T],F=B.convertShape(r[1].dims).slice();F.splice(-1,1,b/w),q.push(...W(K)),q.push(...W(F)),q.push(...W(r[2].dims)),r.length===4&&q.push(...W(B.convertShape(r[3].dims)));let _e=[c,a,l/E];q.push(...W(_e));let $e=ae=>{let qe=K.length,Q=D("a",r[0].dataType,qe,T),ge=D("b",12,F.length,w),Ie=D("scales",r[2].dataType,r[2].dims.length),xe=[Q,ge,Ie],se=r.length===4?D("zero_points",12,r[3].dims.length):void 0;se&&xe.push(se);let pe=_e.length,ce=G("output",r[0].dataType,pe,E),ut=[{name:"output_size",type:"u32"},{name:"block_size",type:"u32"}],V=Be(r[0].dataType),ie=(()=>{switch(T){case 1:return`array<${V}, 8>`;case 2:return`mat4x2<${V}>`;case 4:return`mat2x4<${V}>`;default:throw new Error(`${T}-component is not supported.`)}})(),Te=`
        for (var word: u32 = 0; word < ${b}; word += ${w}) {
          ${ge.indicesSet("b_indices","2","word")};
          let b_data = ${ge.getByIndices("b_indices")};
          for (var i: u32 = 0; i < ${w}; i++) {
            let b_value: u32 = ${w===1?"b_data":"b_data[word + i]"};
            let b_mask: u32 = 0x0F0F0F0Fu;
            let b_value_lower: vec4<u32> = unpack4xU8(b_value & b_mask);
            let b_value_upper: vec4<u32> = unpack4xU8((b_value >> 4) & b_mask);
            let b_quantized_values = ${ie}(${Array.from({length:4},(Fe,Ke)=>`${V}(b_value_lower[${Ke}]), ${V}(b_value_upper[${Ke}])`).join(", ")});
            let b_dequantized_values = ${(()=>T===1?`${ie}(${Array.from({length:8},(Fe,Ke)=>`(b_quantized_values[${Ke}] - zero_point) * scale`).join(", ")});`:`(b_quantized_values - ${ie}(${Array(8).fill("zero_point").join(",")})) * scale;`)()};
            // Number of B elements per 32-bit word is 32/bits = 32/4 = 8
            for (var m: u32 = 0; m < ${P?a:g}u; m++) {
              ${Q.indicesSet("a_indices",qe-2,P?"m":`row * ${g} + m`)};
              ${Q.indicesSet("a_indices",qe-1,"word_offset")};
              var input_offset = ${Q.indicesToOffset("a_indices")};
              var a_data: ${ie};
              for (var j: u32 = 0; j < ${8/T}; j++) {
                a_data[j] = ${Q.getByOffset("input_offset")};
                input_offset++;
              }
              ${P?"workgroup_shared[workgroup_shared_offset + m]":"output_values[m]"}${E>1?"[c]":""} += ${Array.from({length:8/T},(Fe,Ke)=>`${T===1?`a_data[${Ke}] * b_dequantized_values[${Ke}]`:`dot(a_data[${Ke}], b_dequantized_values[${Ke}])`}`).join(" + ")};
            }
            word_offset += ${8/T};
          }
        }`,tt=se?`
          zero_point_offset += 4;
          if (zero_point_offset == 32) {
            zero_point_offset = 0;
            zero_point_index++;
            zero_point_word = ${se.getByOffset("zero_point_index")};
          }`:"";return P?`
        var<workgroup> workgroup_shared: array<${ce.type.value}, ${a*s}>;
        ${ae.declareVariables(...xe,ce)}
        ${ae.mainStart([s,1,1])}
          var a_indices: ${Q.type.indices};
          var block = local_id.x;
          var col = workgroup_id.y;
          var batch = workgroup_id.z;
          ${Q.indicesSet("a_indices","0","batch")};
          // Two zero points are packed into one byte when uniforms.bits is 4.
          for (var c: u32 = 0; c < ${E}; c++) {
            let col_times_components_plus_c = col * ${E} + c;
              ${se?`
            var zero_point_bytes_per_col: u32 = (${s} + 1) / 2;
            var zero_point_byte_count: u32 = col_times_components_plus_c * zero_point_bytes_per_col + (block >> 0x1u);
            var zero_point_word_index: u32 = zero_point_byte_count >> 0x2u;
            var zero_point_byte_offset: u32 = zero_point_byte_count & 0x3u;
            var zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32 = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            var zero_point_word: u32 = ${se.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;`:""}
            var b_indices: ${ge.type.indices};
            ${ge.indicesSet("b_indices","0","col_times_components_plus_c")};
            // The scale and zero points are computed per block.
            var scales_index = col_times_components_plus_c * ${s} + block;
            let scale = ${Ie.getByOffset("scales_index")};
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${V}(${se?"(zero_point_word) & 0xFu":8});
            ${ge.indicesSet("b_indices","1","block")};
            var word_offset: u32 = block * ${e.blockSize/T};
            var workgroup_shared_offset: u32 = block * ${a};
            ${Te}
          }
          workgroupBarrier();
          var output_indices: ${ce.type.indices};
          var elements_per_thread: u32 = ${Math.ceil(a/s)};
          ${ce.indicesSet("output_indices","0","batch")};
          ${ce.indicesSet("output_indices",pe-1,"col")};
          ${ce.indicesSet("output_indices",pe-2,"local_id.x * elements_per_thread")};
          var output_offset = ${ce.indicesToOffset("output_indices")};
          for (var m: u32 = 0u; m < elements_per_thread; m++) {
            var row = m + local_id.x * elements_per_thread;
            if (row < ${a}) {
              var output_value: ${ce.type.value} = ${ce.type.value}(0);
              var workgroup_shared_offset: u32 = row;
              for (var b: u32 = 0u; b < ${s}u; b++) {
                output_value += workgroup_shared[workgroup_shared_offset];
                workgroup_shared_offset += ${a};
              }
              ${ce.setByOffset("output_offset","output_value")};
              output_offset += ${l/E};
            }
          }
        }`:`
        ${ae.registerUniforms(ut).declareVariables(...xe,ce)}
        ${ae.mainStart()}
          ${ae.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var output_values: array<${ce.type.value}, ${g}>;
          var output_indices = ${ce.offsetToIndices("global_idx")};
          var col = ${ce.indicesGet("output_indices",pe-1)};
          var row = ${ce.indicesGet("output_indices",pe-2)};
          var a_indices: ${Q.type.indices} = output_indices;
          // Two zero points are packed into one byte because uniforms.bits <= 4.
          // zero_point_offset is either 0 or 4. It is bit offset within one byte.
          // TODO support zero_point_offset for bits > 4
          ${se?`
          var zero_point_abs_offset = col * ${E} * ((${s} + 1) / 2);
          var zero_point_index: u32 = zero_point_abs_offset / 4;
          var zero_point_word: u32 = ${se.getByOffset("zero_point_index")};
          var zero_point_offset: u32 = (zero_point_abs_offset % 4) * 8;`:""}
          var scale_index = col * ${s*E};
          var b_indices: ${ge.type.indices};
          for (var c: u32 = 0; c < ${E}; c++) {
            ${ge.indicesSet("b_indices","0",`col * ${E} + c`)};
            var block_offset: u32 = 0;
            for (var block: u32 = 0; block < ${s}; block++) {
              // The scale and zero points are computed per block.
              let scale = ${Ie.getByOffset("scale_index")};
              // The default zero point is 8 for unsigned 4-bit quantization.
              let zero_point = ${V}(${se?"extractBits(zero_point_word, zero_point_offset, 4)":8});
              ${ge.indicesSet("b_indices","1","block")};
              var word_offset: u32 = block_offset;
              ${Te}
              scale_index++;
              ${tt}
              block_offset += uniforms.block_size / ${T};
            }
            // Drop the trailing 4 bits if the zero_poit_offset is not a byte boundary to align with the next byte.
            ${se?`if (zero_point_offset % 8 > 0) {
                ${tt}
              }`:""}
            }
            for (var k: u32 = 0u; k < ${g}u; k++) {
              ${ce.indicesSet("output_indices",pe-2,`${g} * row + k`)};
              ${ce.setByIndices("output_indices","output_values[k]")}
            }
        }`};return{name:P?"BlockwiseMatMulNBits":"MatMulNBits",shaderCache:{hint:`${e.cacheKey};${a};${h};${r.length}`,inputDependencies:Array(r.length).fill("rank")},getRunData:()=>({outputs:[{dims:N,dataType:h}],name:P?"BlockwiseMatMulNBits":"MatMulNBits",dispatchGroup:P?{x:1,y:Math.ceil(l/E),z:c}:{x:Math.ceil(z/64)},programUniforms:q}),getShaderSource:$e}},Ay=(r,e)=>{F1(r.inputs,e);let n=r.getMaxComputeWorkgroupSizes(),t=r.getMaxComputeWorkgroupStoragesize();r.compute(M1(r.inputs,e,n,t))},Py=r=>de(r)});var V1,G1,U1,W1,H1,q1,K1,j1,Ey,Cy=C(()=>{"use strict";ue();ye();he();V1=r=>{if(!r||r.length<1)throw new Error("Too few inputs");if(r[0].dataType!==1&&r[0].dataType!==10)throw new Error("Input type must be float or float16.");if(r.length>=2){let e=r[0].dims.length*2===r[1].dims[0];if(r.length===4&&(e=r[3].dims[0]*2===r[1].dims[0]),!e)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},G1=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
            k = i32(${r.indicesGet("indices",o)}) - ${Z("uniforms.pads",o,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Z("uniforms.x_shape",o,e)})) {
              break;
            }
            offset += k * i32(${Z("uniforms.x_strides",o,e)});
        `;return`
          value = ${r.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${t}
            value = x[offset];
          }
      `},U1=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
                k = i32(${r.indicesGet("indices",o)}) - ${Z("uniforms.pads",o,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Z("uniforms.x_shape",o,e)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Z("uniforms.x_shape",o,e)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Z("uniforms.x_strides",o,e)});
            `;return`
              var offset = 0;
              var k = 0;
              ${t}
              value = x[offset];
          `},W1=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
                k = i32(${r.indicesGet("indices",o)}) - ${Z("uniforms.pads",o,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Z("uniforms.x_shape",o,e)})) {
                  k = i32(${Z("uniforms.x_shape",o,e)}) - 1;
                }
                offset += k * i32(${Z("uniforms.x_strides",o,e)});
            `;return`
              var offset = 0;
              var k = 0;
              ${t}
              value = x[offset];
          `},H1=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
                k = i32(${r.indicesGet("indices",o)}) - ${Z("uniforms.pads",o,n)};
                if (k < 0)  {
                  k += i32(${Z("uniforms.x_shape",o,e)}]);
                }
                if (k >= i32(${Z("uniforms.x_shape",o,e)})) {
                  k -= i32(${Z("uniforms.x_shape",o,e)});
                }
                offset += k * i32(${Z("uniforms.x_strides",o,e)});
            `;return`
              var offset = 0;
              var k = 0;
              ${t}
              value = x[offset];
          `},q1=(r,e,n)=>{switch(n.mode){case 0:return G1(r,e,n.pads.length);case 1:return U1(r,e,n.pads.length);case 2:return W1(r,e,n.pads.length);case 3:return H1(r,e,n.pads.length);default:throw new Error("Invalid mode")}},K1=(r,e)=>{let n=B.padShape(r[0].dims.slice(),e.pads),t=r[0].dims,o=B.size(n),i=[{type:12,data:o},{type:6,data:e.pads}];e.mode===0&&i.push({type:r[0].dataType,data:e.value}),i.push(...W(r[0].dims,n));let s=["rank"],a=u=>{let l=G("output",r[0].dataType,n.length),f=D("x",r[0].dataType,t.length),c=f.type.value,p=q1(l,t.length,e),b=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:e.pads.length}];return e.mode===0&&b.push({name:"constant_value",type:c}),`
            ${u.registerUniforms(b).declareVariables(f,l)}
            ${u.mainStart()}
            ${u.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${l.offsetToIndices("global_idx")};

            var value = ${c}(0);
            ${p}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${e.mode}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(n)/64)},programUniforms:i}),getShaderSource:a}},j1=(r,e)=>{if(r.length>1){let n=r[1].getBigInt64Array(),t=r.length>=3&&r[2].data?r[2].getFloat32Array()[0]:0,o=r[0].dims.length,i=new Int32Array(2*o).fill(0);if(r.length>=4){let a=r[3].getBigInt64Array();for(let u=0;u<a.length;u++)i[Number(a[u])]=Number(n[u]),i[Number(a[u])+o]=Number(n[u+a.length])}else n.forEach((a,u)=>i[Number(u)]=Number(a));let s=[];return i.forEach(a=>s.push(a)),{mode:e.mode,value:t,pads:s}}else return e},Ey=(r,e)=>{V1(r.inputs);let n=j1(r.inputs,e);r.compute(K1(r.inputs,n),{inputs:[0]})}});var qi,ky,Dy,By,Ly,X1,Z1,Ry,Ny,zy,Fy,My,Vy,Gy,Uy,Wy,Hy,qy,Ky,jy=C(()=>{"use strict";ft();ue();ye();he();qi=r=>{if(le.webgpu.validateInputContent&&(!r||r.length!==1))throw new Error("Pool ops requires 1 input.")},ky=(r,e,n)=>{let t=e.format==="NHWC",o=r.dims.slice();t&&o.splice(1,0,o.pop());let i=Object.hasOwnProperty.call(e,"dilations"),s=e.kernelShape.slice(),a=e.strides.slice(),u=i?e.dilations.slice():[],l=e.pads.slice();Xr.adjustPoolAttributes(n,o,s,a,u,l);let f=Xr.computePoolOutputShape(n,o,a,u,s,l,e.autoPad),c=Object.assign({},e);i?Object.assign(c,{kernelShape:s,strides:a,pads:l,dilations:u,cacheKey:e.cacheKey}):Object.assign(c,{kernelShape:s,strides:a,pads:l,cacheKey:e.cacheKey});let p=f.slice();return p.push(p.splice(1,1)[0]),[c,t?p:f]},Dy=(r,e)=>{let n=e.format==="NHWC",t=B.size(r),o=B.size(e.kernelShape),i=[{type:12,data:t},{type:12,data:o}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(e.kernelShape.length<=2){let a=e.kernelShape[e.kernelShape.length-1],u=e.strides[e.strides.length-1],l=e.pads[e.pads.length/2-1],f=e.pads[e.pads.length-1],c=!!(l+f);i.push({type:12,data:a},{type:12,data:u},{type:12,data:l},{type:12,data:f}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let p=!1;if(e.kernelShape.length===2){let b=e.kernelShape[e.kernelShape.length-2],h=e.strides[e.strides.length-2],g=e.pads[e.pads.length/2-2],T=e.pads[e.pads.length-2];p=!!(g+T),i.push({type:12,data:b},{type:12,data:h},{type:12,data:g},{type:12,data:T}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,s,!0,c,p]}else{if(n)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let a=B.computeStrides(e.kernelShape);i.push({type:12,data:a},{type:12,data:e.pads},{type:12,data:e.strides}),s.push({name:"kernelStrides",type:"u32",length:a.length},{name:"pads",type:"u32",length:e.pads.length},{name:"strides",type:"u32",length:e.strides.length});let u=e.pads.reduce((l,f)=>l+f);return[i,s,!!u,!1,!1]}},By=(r,e,n,t,o,i,s,a,u,l,f,c)=>{let p=o.format==="NHWC",b=e.type.value,h=G("output",e.type.tensor,t);if(o.kernelShape.length<=2){let g="",T="",w="",v=n-(p?2:1);if(f?g=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${v}] < 0 || xIndices[${v}]
                      >= uniforms.x_shape[${v}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${e.indicesToOffset("xIndices")}];
                  ${i}
                }`:g=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${e.indicesToOffset("xIndices")}];
                  ${i}
                }`,o.kernelShape.length===2){let $=n-(p?3:2);c?T=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${$}] < 0 || xIndices[${$}] >= uniforms.x_shape[${$}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:T=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${$}] = indices[${$}] * uniforms.sh - uniforms.phStart + j;
                `,w=`
              }
            `}return`
            ${r.registerUniforms(u).declareVariables(e,h)}

            ${r.mainStart()}
              ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${h.offsetToIndices("global_idx")};
              var xIndices = ${h.offsetToIndices("global_idx")};

              var value = ${b}(${a});
              var pad = 0;
              ${T}
              ${g}
              ${w}
              ${s}

              output[global_idx] = value;
            }`}else{if(p)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let g=o.kernelShape.length,T=o.pads.length,w="";return l?w=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${e.indicesToOffset("xIndices")}];
                ${i}
              }`:w=`
              }
              let x_val = x[${e.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${r.registerUniforms(u).declareVariables(e,h)}

            ${r.mainStart()}
              ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${h.offsetToIndices("global_idx")};
              var xIndices = ${h.offsetToIndices("global_idx")};

              var offsets: array<u32, ${g}>;

              var value = ${b}(${a});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${g-1}u; j++) {
                  offsets[j] = offset / ${Z("uniforms.kernelStrides","j",g)};
                  offset -= offsets[j] * ${Z("uniforms.kernelStrides","j",g)};
                }
                offsets[${g-1}] = offset;

                isPad = false;
                for (var j = ${n-g}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${Z("uniforms.strides",`j - ${n-g}u`,g)}
                    + offsets[j - ${n-g}u] - ${Z("uniforms.pads","j - 2u",T)};
                  ${w}
              }
              ${s}

              output[global_idx] = value;
            }`}},Ly=r=>`${r.format};${r.ceilMode};${r.autoPad};${r.kernelShape.length}`,X1=r=>`${Ly(r)};${r.countIncludePad}`,Z1=r=>`${Ly(r)};${r.storageOrder};${r.dilations}`,Ry=r=>({format:r.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][r.auto_pad],ceilMode:r.ceil_mode,kernelShape:r.kernel_shape,strides:r.strides,pads:r.pads}),Ny=(r,e,n,t)=>{let[o,i]=ky(e,t,n),s=D("x",e.dataType,e.dims.length),a=s.type.value,u="value += x_val;",l="";o.countIncludePad?l+=`value /= ${a}(uniforms.kernelSize);`:l+=`value /= ${a}(i32(uniforms.kernelSize) - pad);`;let[f,c,p,b,h]=Dy(i,o);f.push(...W(e.dims,i));let g=["rank"];return{name:r,shaderCache:{hint:`${t.cacheKey};${p};${b};${h}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(B.size(i)/64)},programUniforms:f}),getShaderSource:T=>By(T,s,e.dims.length,i.length,o,u,l,0,c,p,b,h)}},zy=r=>{let e=r.count_include_pad!==0,n=Ry(r);if(n.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let t={countIncludePad:e,...n,cacheKey:""};return{...t,cacheKey:X1(t)}},Fy=(r,e)=>{qi(r.inputs),r.compute(Ny("AveragePool",r.inputs[0],!1,e))},My={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Vy=r=>{let e=r.format;return{format:e,...My,cacheKey:e}},Gy=(r,e)=>{qi(r.inputs),r.compute(Ny("GlobalAveragePool",r.inputs[0],!0,e))},Uy=(r,e,n,t)=>{let[o,i]=ky(e,t,n),s=`
      value = max(x_val, value);
    `,a="",u=D("x",e.dataType,e.dims.length),l=["rank"],[f,c,p,b,h]=Dy(i,o);return f.push(...W(e.dims,i)),{name:r,shaderCache:{hint:`${t.cacheKey};${p};${b};${h}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(B.size(i)/64)},programUniforms:f}),getShaderSource:g=>By(g,u,e.dims.length,i.length,o,s,a,e.dataType===10?-65504:-1e5,c,p,b,h)}},Wy=(r,e)=>{qi(r.inputs),r.compute(Uy("MaxPool",r.inputs[0],!1,e))},Hy=r=>{let e=r.storage_order,n=r.dilations,t=Ry(r);if(e!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(t.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let o={storageOrder:e,dilations:n,...t,cacheKey:""};return{...o,cacheKey:Z1(o)}},qy=r=>{let e=r.format;return{format:e,...My,cacheKey:e}},Ky=(r,e)=>{qi(r.inputs),r.compute(Uy("GlobalMaxPool",r.inputs[0],!0,e))}});var J1,Q1,Xy,Zy=C(()=>{"use strict";ft();ue();he();J1=(r,e,n)=>{let t=r===e,o=r<e&&n<0,i=r>e&&n>0;if(t||o||i)throw new Error("Range these inputs' contents are invalid.")},Q1=(r,e,n,t)=>{let o=Math.abs(Math.ceil((e-r)/n)),i=[o],s=o,a=[{type:12,data:s},{type:t,data:r},{type:t,data:n},...W(i)],u=l=>{let f=G("output",t,i.length),c=f.type.value,p=[{name:"outputSize",type:"u32"},{name:"start",type:c},{name:"delta",type:c}];return`
        ${l.registerUniforms(p).declareVariables(f)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${c}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${t}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:a})}},Xy=r=>{let e=0,n=0,t=0;r.inputs[0].dataType===6?(e=r.inputs[0].getInt32Array()[0],n=r.inputs[1].getInt32Array()[0],t=r.inputs[2].getInt32Array()[0]):r.inputs[0].dataType===1&&(e=r.inputs[0].getFloat32Array()[0],n=r.inputs[1].getFloat32Array()[0],t=r.inputs[2].getFloat32Array()[0]),le.webgpu.validateInputContent&&J1(e,n,t),r.compute(Q1(e,n,t,r.inputs[0].dataType),{inputs:[]})}});var eI,tI,rI,nI,oI,iI,aI,sI,uI,lI,cI,Yy,fI,dI,pI,mI,hI,Jy,Qy,ex=C(()=>{"use strict";ue();ye();et();he();eI=(r,e)=>{if(r.every(n=>n>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),r.length>0){if(e.mode==="linear"){if(!(r.length===2||r.length===3||r.length===4&&r[0]===1&&r[1]===1||r.length===4&&r[0]===1&&r[3]===1||r.length===5&&r[0]===1&&r[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(e.mode==="cubic"&&!(r.length===2||r.length===4&&r[0]===1&&r[1]===1||r.length===4&&r[0]===1&&r[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},tI=(r,e,n)=>{e.every(o=>o>=0&&o<n||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let t=new Array(n).fill(1);return e.forEach((o,i)=>t[o]=r[i]),t},rI=(r,e,n,t,o,i)=>{let[s,a,u]=n>10?[1,2,3]:[-1,r.length>1?1:-1,-1],l=r[0].dims.length;if(s>0&&r.length>s&&r[s].dims.length>0)r[s].getFloat32Array().forEach(f=>i.push(f));else if(e.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(a>0&&r.length>a&&r[a].dims.length>0){if(r[a].getFloat32Array().forEach(f=>t.push(f)),t.length!==0&&t.length!==l&&n>=18&&t.length!==e.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");eI(t,e),e.axes.length>0&&tI(t,e.axes,l).forEach((f,c)=>t[c]=f)}if(u>0&&r.length>u&&(r[u].getBigInt64Array().forEach(f=>o.push(Number(f))),o.length!==l||n>=18&&o.length===e.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(e.axes.length>0){if(t.length!==e.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(o.length!==e.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof t<"u"&&typeof o<"u"&&t.length>0&&o.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},nI=(r,e)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${e} { `+(()=>{switch(r){case"asymmetric":return`return ${e}(xResized) / ${e}(xScale);`;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${e}(xResized) + 0.5) / ${e}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${e}(xResized) + 0.5) / ${e}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    // The whole part and the fractional part are calculated separately due to inaccuracy of floating
                    // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
                    // offset-by-one error later in floor().
                    let whole = ${e}(xResized * (lengthOriginal - 1) / (lengthResized - 1));
                    let fract =
                        ${e}(xResized * (lengthOriginal - 1) % (lengthResized - 1)) / ${e}(lengthResized - 1);
                    return whole + fract;
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${e}(roiStart) * ${e}(lengthOriginal - 1) +
                        (${e}(xResized) * ${e}(roiEnd - roiStart) * ${e}(lengthOriginal - 1)) /
                        ${e}(lengthResized - 1);
                  } else {
                    return 0.5 * ${e}(roiStart + roiEnd) * ${e}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${e}xScale * ${e}(lengthResized);
                  const adjustment = ${e}(lengthResized) / outputWidth;
                  const center = ${e}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${e}(xResized) + 0.5) / ${e}(xScale)) - 0.5;`;case"half_pixel":return`return ((${e}(xResized) + 0.5) / ${e}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${r} is not supported`)}})()+"}",oI=(r,e,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(r){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(e<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${r} is not supported`)}})()+"}",iI=(r,e,n)=>{let t=new Array(n).fill(0).concat(new Array(n).fill(1)),o=r.length===0?t:r.slice();return e.length>0?(e.forEach((i,s)=>{t[i]=o[s],t[s+n]=o[e.length+s]}),t):o},aI=(r,e,n,t)=>{let o=[];if(n.length>0)if(t.length>0){if(r.forEach(i=>o.push(i)),Math.max(...t)>r.length)throw new Error("axes is out of bound");t.forEach((i,s)=>o[i]=n[s])}else n.forEach(i=>o.push(i));else{if(e.length===0)throw new Error("Resize requires either scales or sizes.");o=r.map((i,s)=>Math.round(i*e[s]))}return o},sI=(r,e,n)=>{let t=(()=>{switch(n.keepAspectRatioPolicy){case"not_larger":return n.axes.length>0?Math.min(...n.axes.map(i=>e[i]),Number.MAX_VALUE):Math.min(...e,Number.MAX_VALUE);case"not_smaller":return n.axes.length>0?Math.max(...n.axes.map(i=>e[i]),Number.MIN_VALUE):Math.max(...e,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();e.fill(1,0,e.length);let o=r.slice();return n.axes.length>0?(n.axes.forEach(i=>e[i]=t),n.axes.forEach(i=>o[i]=Math.round(r[i]*e[i]))):(e.fill(t,0,e.length),o.forEach((i,s)=>o[s]=Math.round(i*e[s]))),o},uI=(r,e,n,t,o)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${r.type.indices}) -> array<${r.type.value}, ${n.length}> {
      var original_indices: array<${r.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${r.indicesGet("output_indices","i")};
        var scale = ${Z("uniforms.scales","i",t)};
        var roi_low = ${Z("uniforms.roi","i",o)};
        var roi_hi = ${Z("uniforms.roi",`i + ${e.length}`,o)};
        if (scale == 1.0) {
          original_indices[i] = ${r.type.value}(output_index);
        } else {
          var input_shape_i = ${Z("uniforms.input_shape","i",e.length)};
          var output_shape_i = ${Z("uniforms.output_shape","i",n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,lI=(r,e,n,t,o,i,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> ${r.type.indices} {
      var input_indices: ${r.type.indices};
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Z("uniforms.scales","i",o)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Z("uniforms.roi","i",i)};
          var roi_hi = ${Z("uniforms.roi",`i + ${n.length}`,i)};
          var input_shape_i = ${Z("uniforms.input_shape","i",n.length)};
          var output_shape_i = ${Z("uniforms.output_shape","i",t.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${e.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${e.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${r.indicesSet("input_indices","i"," input_index")}
      }
      return input_indices;
    }`,cI=(r,e)=>`
    fn checkInputIndices(input_indices: ${r.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${e.length}; i++) {
        var input_index = ${r.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Z("uniforms.input_shape","i",e.length)}) {
          return false;
        }
      }
      return true;
    }`,Yy=(r,e,n,t)=>r.rank>t?`
    ${r.indicesSet("input_indices",e,"channel")};
    ${r.indicesSet("input_indices",n,"batch")};
`:"",fI=(r,e,n,t,o)=>{let[s,a,u,l]=n.length===2?[-1,0,1,-1]:[0,2,3,1],f=r.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${f} {
      var input_indices: ${r.type.indices};
      ${r.indicesSet("input_indices",a,`max(0, min(row, ${n[a]} - 1))`)};
      ${r.indicesSet("input_indices",u,`max(0, min(col, ${n[u]} - 1))`)};
      ${Yy(r,l,s,2)}
      return ${r.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${e.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${f} = originalIndices[${a}];
      var col:${f} = originalIndices[${u}];
      ${t?`if (row < 0 || row > (${n[a]} - 1) || col < 0 || col > (${n[u]} - 1)) {
        return ${o};
      }`:""};
      row = max(0, min(row, ${n[a]} - 1));
      col = max(0, min(col, ${n[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${s}])`:"0"};
      var x11: ${f} = getInputValue(batch, channel, row1, col1);
      var x12: ${f} = getInputValue(batch, channel, row1, col2);
      var x21: ${f} = getInputValue(batch, channel, row2, col1);
      var x22: ${f} = getInputValue(batch, channel, row2, col2);
      var dx1: ${f} = abs(row - ${f}(row1));
      var dx2: ${f} = abs(${f}(row2) - row);
      var dy1: ${f} = abs(col - ${f}(col1));
      var dy2: ${f} = abs(${f}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},dI=(r,e,n,t,o,i,s,a,u,l)=>{let f=n.length===2,c=!0,[p,b]=f?[0,1]:c?[2,3]:[1,2],h=r.type.value,g=T=>{let w=T===p?"row":"col";return`
      fn ${w}CubicInterpolation(input_indices: ${r.type.indices}, output_indices: ${e.type.indices}) -> ${h} {
        var output_index = ${e.indicesGet("output_indices",T)};
        var originalIdx: ${h} = getOriginalCoordinateFromResizedCoordinate(output_index, ${o[T]},
        ${t[T]}, ${n[T]}, ${i[T]}, ${i[T]} + ${n.length});
        var fractOriginalIdx: ${h} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${a} && (originalIdx < 0 || originalIdx > (${n[T]} - 1))) {
          return ${u};
        }
        var data: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${w}: ${h} = originalIdx + ${h}(i);
          if (${w} < 0 || ${w} >= ${n[T]}) {
            ${(()=>l?`coefs[i + 1] = 0.0;
                        continue;`:a?`return ${u};`:`${w} = max(0, min(${w}, ${n[T]} - 1));`)()};
          }
        var input_indices_copy: ${r.type.indices} = input_indices;
          ${r.indicesSet("input_indices_copy",T,`u32(${w})`)};
          data[i + 1] = ${T===p?r.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${g(p)};
    ${g(b)};
  fn getCubicInterpolationCoefs(s: ${h}) -> array<${h}, 4> {
    var absS = abs(s);
    var coeffs: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${h} = 1.0 - absS;
    var twoMinusAbsS: ${h} = 2.0 - absS;
    var onePlusAbsS: ${h} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${h}, 4>, coefs: array<${h}, 4>) -> ${h} {
    var coefsSum: ${h} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${e.type.indices}) -> ${h} {
    var input_indices: ${r.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},pI=(r,e,n,t,o)=>{let[s,a,u,l,f]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=r.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${r.type.indices};
      ${r.indicesSet("input_indices",a,`max(0, min(depth, ${n[a]} - 1))`)};
      ${r.indicesSet("input_indices",u,`max(0, min(height, ${n[u]} - 1))`)};
      ${r.indicesSet("input_indices",l,`max(0, min(width, ${n[l]} - 1))`)};
      ${Yy(r,f,s,3)}
      return ${r.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${e.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${a}];
      var height:${c} = originalIndices[${u}];
      var width:${c} = originalIndices[${l}];
      ${t?`if (depth < 0 || depth > (${n[a]} - 1) || height < 0 || height > (${n[u]} - 1) || width < 0 || (width > ${n[l]} - 1)) {
      return ${o};
        }`:""};

    depth = max(0, min(depth, ${n[a]} - 1));
      height = max(0, min(height, ${n[u]} - 1));
      width = max(0, min(width, ${n[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${f}])`:"0"};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${s}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},mI=(r,e,n,t,o,i)=>{let s=r.dims,a=iI(i,e.axes,s.length),u=aI(s,t,o,e.axes),l=t.slice();t.length===0&&(l=s.map((v,S)=>v===0?1:u[S]/v),e.keepAspectRatioPolicy!=="stretch"&&(u=sI(s,l,e)));let f=G("output",r.dataType,u.length),c=D("input",r.dataType,s.length),p=B.size(u),b=s.length===u.length&&s.every((v,S)=>v===u[S]),h=e.coordinateTransformMode==="tf_crop_and_resize",g=e.extrapolationValue,T=c.type.value,w=v=>`
      ${b?"":`
      ${nI(e.coordinateTransformMode,T)};
      ${(()=>{switch(e.mode){case"nearest":return`
              ${cI(c,s)};
              ${oI(e.nearestMode,n,T)};
              ${lI(c,f,s,u,l.length,a.length,h)};
              `;case"linear":return`
              ${uI(f,s,u,l.length,a.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${fI(c,f,s,h,g)}`;if(s.length===3||s.length===5)return`${pI(c,f,s,h,g)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${dI(c,f,s,u,l,a,e.cubicCoeffA,h,e.extrapolationValue,e.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${v.registerUniform("output_size","u32").registerUniform("scales","f32",l.length).registerUniform("roi","f32",a.length).declareVariables(c,f)}
      ${v.mainStart()}
        ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${b?"output[global_idx] = input[global_idx];":`
        let output_indices = ${f.offsetToIndices("global_idx")};
        var input_indices: ${c.type.indices};
        ${(()=>{switch(e.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${c.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${e.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${e.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${e.cacheKey}|${n}|${l.length>0?l:""}|${o.length>0?o:""}|${a.length>0?a:""}|${b}|${s}`,inputDependencies:["rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:u,dataType:r.dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:[{type:12,data:p},{type:1,data:l},{type:1,data:a},...W(s,u)]})}},hI=r=>{let e=r.customDataBuffer;return new Uint32Array(e,e.byteOffset,1)[0]},Jy=(r,e)=>{let n=[],t=[],o=[],i=hI(r);if(e.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");rI(r.inputs,e,i,n,t,o),r.compute(mI(r.inputs[0],e,i,n,t,o),{inputs:[0]})},Qy=r=>{let e=r.antialias,n=r.axes,t=r.coordinateTransformMode,o=r.cubicCoeffA,i=r.excludeOutside!==0,s=r.extrapolationValue,a=r.keepAspectRatioPolicy,u=r.mode,l=r.nearestMode===""?"simple":r.nearestMode;return de({antialias:e,axes:n,coordinateTransformMode:t,cubicCoeffA:o,excludeOutside:i,extrapolationValue:s,keepAspectRatioPolicy:a,mode:u,nearestMode:l})}});var gI,bI,tx,rx=C(()=>{"use strict";ue();ye();et();he();gI=(r,e)=>{let[n,t,o,i]=r,{numHeads:s,rotaryEmbeddingDim:a}=e;if(n.dims.length!==3&&n.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!B.areEqual(t.dims,[])&&!B.areEqual(t.dims,[1])&&t.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${t.dims.length}`);if(o.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${o.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!B.areEqual(o.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(a>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=n.dims[0],l=n.dims[n.dims.length-2],f=o.dims[0],c=B.sizeFromDimension(n.dims,1)/l,p=a===0?o.dims[1]*2:c/s;if(a>p)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(t.dims.length===2){if(u!==t.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${t.dims[0]}`);if(l!==t.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${t.dims[1]}`)}if(p/2!==o.dims[1]&&a/2!==o.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${o.dims[1]}`);if(l>f)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},bI=(r,e)=>{let{interleaved:n,numHeads:t,rotaryEmbeddingDim:o,scale:i}=e,s=r[0].dims[0],a=B.sizeFromDimension(r[0].dims,1),u=r[0].dims[r[0].dims.length-2],l=a/u,f=r[2].dims[1],c=o===0?f*2:l/t,p=new Array(s,u,l/c,c-f),b=B.computeStrides(p),h=[{type:1,data:i},{type:12,data:p},{type:12,data:b},...r[0].dims.length===3?new Array({type:12,data:[a,l,c,1]}):[],...r[0].dims.length===4?new Array({type:12,data:[a,c,u*c,1]}):[],...W(r[0].dims,r[1].dims,r[2].dims,r[3].dims,r[0].dims)],g=T=>{let w=D("input",r[0].dataType,r[0].dims.length),v=D("position_ids",r[1].dataType,r[1].dims.length),S=D("cos_cache",r[2].dataType,r[2].dims.length),$=D("sin_cache",r[3].dataType,r[3].dims.length),P=G("output",r[0].dataType,r[0].dims.length);return T.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:p.length},{name:"global_strides",type:"u32",length:b.length},{name:"input_output_strides",type:"u32",length:b.length}]),`
        ${T.declareVariables(w,v,S,$,P)}

        ${T.mainStart(Zr)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${T.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${v.broadcastedIndicesToOffset("bsnh.xy",G("",v.type.tensor,2))};
            let position_id =
                u32(${v.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${w.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${w.getByOffset("j")} * ${$.get("position_id","bsnh[3]")};
            ${P.setByOffset("i","re")}
            let im = ${w.getByOffset("i")} * ${$.get("position_id","bsnh[3]")} +
                ${w.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${P.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${P.setByOffset("k",w.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:de({interleaved:n}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:g,getRunData:()=>({outputs:[{dims:r[0].dims,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(B.size(p)/Zr)},programUniforms:h})}},tx=(r,e)=>{gI(r.inputs,e),r.compute(bI(r.inputs,e))}});var yI,xI,nx,ox=C(()=>{"use strict";ue();ye();he();yI=r=>{if(!r||r.length<3)throw new Error("layerNorm requires at least 3 inputs.");let e=r[0],n=r[1],t=r[2];if(e.dataType!==n.dataType||e.dataType!==t.dataType)throw new Error("All inputs must have the same data type");if(e.dims.length!==3&&e.dims.length!==2)throw new Error("Input must be 2D or 3D");if(n.dims.length!==3&&n.dims.length!==2)throw new Error("Skip must be 2D or 3D");let o=e.dims[e.dims.length-1],i=e.dims[e.dims.length-2];if(n.dims[n.dims.length-1]!==o)throw new Error("Skip must have the same hidden size as input");if(n.dims[n.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(t.dims.length!==1)throw new Error("Gamma must be 1D");if(t.dims[t.dims.length-1]!==o)throw new Error("Gamma must have the same hidden size as input");if(r.length>3){let s=r[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==o)throw new Error("Beta must have the same hidden size as input")}if(r.length>4){let s=r[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==o)throw new Error("Bias must have the same hidden size as input")}},xI=(r,e,n,t)=>{let o=e.simplified,i=r[0].dims,s=B.size(i),a=i,u=s,l=i.slice(-1)[0],f=t?i.slice(0,-1).concat(1):[],c=!o&&r.length>3,p=r.length>4,b=t&&n>1,h=t&&n>2,g=n>3,T=64,w=ze(l),v=[{type:12,data:u},{type:12,data:w},{type:12,data:l},{type:1,data:e.epsilon}],S=P=>{let E=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],N=[D("x",r[0].dataType,r[0].dims,w),D("skip",r[1].dataType,r[1].dims,w),D("gamma",r[2].dataType,r[2].dims,w)];c&&N.push(D("beta",r[3].dataType,r[3].dims,w)),p&&N.push(D("bias",r[4].dataType,r[4].dims,w)),N.push(G("output",r[0].dataType,a,w)),b&&N.push(G("mean_output",1,f)),h&&N.push(G("inv_std_output",1,f)),g&&N.push(G("input_skip_bias_sum",r[0].dataType,a,w));let z=Be(r[0].dataType),q=Be(1,w);return`

      ${P.registerUniforms(E).declareVariables(...N)}
      var<workgroup> sum_shared : array<${q}, ${T}>;
      var<workgroup> sum_squared_shared : array<${q}, ${T}>;

      ${P.mainStart([T,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${T};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${T};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${T-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${p?"bias[offset1d + i]":z+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${g?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Yr(z,w,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${T};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Ut("sum",w)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Ut("square_sum",w)} / f32(uniforms.hidden_size) ${o?"":"- mean * mean"} + uniforms.epsilon);
        ${b?"mean_output[global_idx] = mean;":""}
        ${h?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o?"":`- ${z}(mean)`}) *
            ${z}(inv_std_dev) * gamma[offset1d + i]
            ${c?"+ beta[offset1d + i]":""};
        }
      }`},$=[{dims:a,dataType:r[0].dataType}];return n>1&&$.push({dims:f,dataType:1}),n>2&&$.push({dims:f,dataType:1}),n>3&&$.push({dims:i,dataType:r[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${w};${b};${h};${g}`,inputDependencies:r.map((P,E)=>"type")},getShaderSource:S,getRunData:()=>({outputs:$,dispatchGroup:{x:Math.ceil(u/l)},programUniforms:v})}},nx=(r,e)=>{yI(r.inputs);let t=[0];r.outputCount>1&&t.push(-3),r.outputCount>2&&t.push(-3),r.outputCount>3&&t.push(3),r.compute(xI(r.inputs,e,r.outputCount,!1),{outputs:t})}});var vI,Ki,wI,ix,TI,_I,ax,sx,ux=C(()=>{"use strict";ue();ye();et();he();vI=(r,e)=>{if(!r||r.length<1)throw new Error("too few inputs");if(e.axes.length!==0){if(e.axes.length!==e.starts.length||e.axes.length!==e.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(e.starts.length!==e.ends.length)throw new Error("starts and ends must have the same length");r.slice(1).forEach((n,t)=>{if(r[t+1].dataType!==6&&r[t+1].dataType!==7)throw new Error(`Input ${t} must be an array of int32 or int64`)})},Ki=(r,e)=>{let n=[];if(r.length>e)if(r[e].dataType===7)r[e].getBigInt64Array().forEach(t=>n.push(Number(t)));else if(r[e].dataType===6)r[e].getInt32Array().forEach(t=>n.push(Number(t)));else throw new Error(`Input ${e} must be an array of int32 or int64`);return n},wI=(r,e)=>{if(r.length>1){let n=Ki(r,1),t=Ki(r,2),o=Ki(r,3);return o.length===0&&(o=[...Array(r[0].dims.length).keys()]),de({starts:n,ends:t,axes:o})}else return e},ix=(r,e,n,t,o)=>{let i=r;return r<0&&(i+=n[t[e]]),o[e]<0?Math.max(0,Math.min(i,n[t[e]]-1)):Math.max(0,Math.min(i,n[t[e]]))},TI=(r,e,n)=>`fn calculateInputIndices(output_indices: ${e.type.indices}) -> ${r.type.indices} {
          var input_indices: ${r.type.indices};
          var carry = 0u;
          for (var i = ${n.length}; i >= 0; i--) {
            let input_shape_i = ${Z("uniforms.input_shape","i",n.length)};
            let steps_i = ${Z("uniforms.steps","i",n.length)};
            let signs_i = ${Z("uniforms.signs","i",n.length)};
            let starts_i = ${Z("uniforms.starts","i",n.length)};
            var output_index = ${e.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${r.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,_I=(r,e)=>{let n=r[0].dims,t=B.size(n),o=e.axes.length>0?B.normalizeAxes(e.axes,n.length):[...Array(n.length).keys()],i=Ki(r,4);i.forEach(w=>w!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(o.length).fill(1));let s=e.starts.map((w,v)=>ix(w,v,n,o,i)),a=e.ends.map((w,v)=>ix(w,v,n,o,i));if(o.length!==s.length||o.length!==a.length)throw new Error("start, ends and axes should have the same number of elements");if(o.length!==n.length)for(let w=0;w<n.length;++w)o.includes(w)||(s.splice(w,0,0),a.splice(w,0,n[w]),i.splice(w,0,1));let u=i.map(w=>Math.sign(w));i.forEach((w,v,S)=>{if(w<0){let $=(a[v]-s[v])/w,P=s[v],E=P+$*i[v];s[v]=E,a[v]=P,S[v]=-w}});let l=n.slice(0);o.forEach((w,v)=>{l[w]=Math.ceil((a[w]-s[w])/i[w])});let f={dims:l,dataType:r[0].dataType},c=G("output",r[0].dataType,l.length),p=D("input",r[0].dataType,r[0].dims.length),b=B.size(l),h=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:i.length}],g=[{type:12,data:b},{type:12,data:s},{type:6,data:u},{type:12,data:i},...W(r[0].dims,l)],T=w=>`
      ${w.registerUniforms(h).declareVariables(p,c)}
        ${TI(p,c,n)}
        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${c.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${c.setByOffset("global_idx",p.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${s.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:T,getRunData:()=>({outputs:[f],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:g})}},ax=(r,e)=>{vI(r.inputs,e);let n=wI(r.inputs,e);r.compute(_I(r.inputs,n),{inputs:[0]})},sx=r=>{let e=r.starts,n=r.ends,t=r.axes;return de({starts:e,ends:n,axes:t})}});var II,SI,lx,cx,fx=C(()=>{"use strict";ue();ye();et();he();II=r=>{if(!r||r.length!==1)throw new Error("Softmax op requires 1 input.")},SI=(r,e)=>{let n=r.dims,t=B.size(n),o=64,i=e.axis;if(i<0&&(i=n.length+i),i<n.length-1)throw new Error("softmax only supports last axis for now.");let s=n[i],a=t/s,u=ze(s),l=s/u,f=(T,w)=>w===4?`max(max(${T}.x, ${T}.y), max(${T}.z, ${T}.w))`:w===2?`max(${T}.x, ${T}.y)`:w===3?`max(max(${T}.x, ${T}.y), ${T}.z)`:T,c=D("x",r.dataType,r.dims,u),p=G("result",r.dataType,r.dims,u),b=c.type.value,h=Be(r.dataType)==="f32"?`var threadMax = ${b}(-3.402823e+38f);`:`var threadMax = ${b}(-65504.0h);`,g=T=>`
      var<workgroup> rowMaxShared : ${b};
      var<workgroup> rowSumShared : ${b};
      var<workgroup> threadShared : array<${b}, ${o}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${b} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${b}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${T.registerUniform("packedCols","i32").declareVariables(c,p)}
      ${T.mainStart()}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${o};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${h}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${b}(${f("threadShared[0]",u)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${b}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${b}(${Ut("threadShared[0]",u)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`;return{name:"Softmax",shaderCache:{hint:`${u}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:n,dataType:r.dataType}],dispatchGroup:{x:a},programUniforms:[{type:6,data:l}]}),getShaderSource:g}},lx=(r,e)=>{II(r.inputs),r.compute(SI(r.inputs[0],e))},cx=r=>de({axis:r.axis})});var $I,AI,PI,OI,EI,dx,px,mx=C(()=>{"use strict";ue();ye();et();he();$I=r=>{if(!r||r.length<1)throw new Error("too few inputs")},AI=(r,e)=>{let n=[],t=e.numOutputs;return r[1].dims[0]>0&&(r[1].getBigInt64Array().forEach(o=>n.push(Number(o))),t=n.length),de({numOutputs:t,axis:e.axis,splitSizes:n})},PI=r=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${r}u; i += 1u ) {
    if (index < ${Z("uniforms.size_in_split_axis","i",r)}) {
        return i;
    }
    }
    return ${r}u;
}`,OI=r=>{let e=r.length,n=[];for(let t=0;t<e;++t){let o=r[t].setByIndices("indices","input[global_idx]");e===1?n.push(o):t===0?n.push(`if (output_number == ${t}u) { ${o} }`):t===e-1?n.push(`else { ${o} }`):n.push(`else if (output_number == ${t}) { ${o} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${r[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},EI=(r,e)=>{let n=r[0].dims,t=B.size(n),o=r[0].dataType,i=B.normalizeAxis(e.axis,n.length),s=new Array(e.numOutputs),a=D("input",o,n.length),u=new Array(e.numOutputs),l=[],f=[],c=0,p=[{type:12,data:t}];for(let h=0;h<e.numOutputs;h++){c+=e.splitSizes[h],u[h]=c;let g=n.slice();g[e.axis]=e.splitSizes[h],f.push(g),s[h]=G(`output${h}`,o,g.length),l.push({dims:f[h],dataType:r[0].dataType})}p.push({type:12,data:u},...W(n,...f));let b=h=>`
  ${h.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",u.length).declareVariables(a,...s)}
  ${PI(u.length)}
  ${OI(s)}

  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${a.offsetToIndices("global_idx")};
    var index = ${a.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Z("uniforms.size_in_split_axis","output_number - 1u",u.length)};
      ${a.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:e.cacheKey,inputDependencies:["rank"]},getShaderSource:b,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(t/64)},programUniforms:p})}},dx=(r,e)=>{$I(r.inputs);let n=r.inputs.length===1?e:AI(r.inputs,e);r.compute(EI(r.inputs,n),{inputs:[0]})},px=r=>{let e=r.axis,n=r.splitSizes,t=r.numOutputs<0?n.length:r.numOutputs;if(t!==n.length)throw new Error("numOutputs and splitSizes lengh must be equal");return de({axis:e,numOutputs:t,splitSizes:n})}});var CI,kI,hx,gx=C(()=>{"use strict";ue();ye();he();CI=(r,e,n,t,o)=>{let i=G("output_data",o,n.length,4),s=D("a_data",e[1].dataType,e[1].dims.length,4),a=D("b_data",e[2].dataType,e[2].dims.length,4),u=D("c_data",e[0].dataType,e[0].dims.length,4),l,f=(c,p,b)=>`select(${p}, ${c}, ${b})`;if(!t)l=i.setByOffset("global_idx",f(s.getByOffset("global_idx"),a.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let c=(p,b,h="")=>{let g=`a_data[index_a${b}][component_a${b}]`,T=`b_data[index_b${b}][component_b${b}]`,w=`bool(c_data[index_c${b}] & (0xffu << (component_c${b} * 8)))`;return`
            let output_indices${b} = ${i.offsetToIndices(`global_idx * 4u + ${b}u`)};
            let offset_a${b} = ${s.broadcastedIndicesToOffset(`output_indices${b}`,i)};
            let offset_b${b} = ${a.broadcastedIndicesToOffset(`output_indices${b}`,i)};
            let offset_c${b} = ${u.broadcastedIndicesToOffset(`output_indices${b}`,i)};
            let index_a${b} = offset_a${b} / 4u;
            let index_b${b} = offset_b${b} / 4u;
            let index_c${b} = offset_c${b} / 4u;
            let component_a${b} = offset_a${b} % 4u;
            let component_b${b} = offset_b${b} % 4u;
            let component_c${b} = offset_c${b} % 4u;
            ${p}[${b}] = ${h}(${f(g,T,w)});
          `};o===9?l=`
            var data = vec4<u32>(0);
            ${c("data",0,"u32")}
            ${c("data",1,"u32")}
            ${c("data",2,"u32")}
            ${c("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:l=`
            ${c("output_data[global_idx]",0)}
            ${c("output_data[global_idx]",1)}
            ${c("output_data[global_idx]",2)}
            ${c("output_data[global_idx]",3)}
          `}return`
        ${r.registerUniform("vec_size","u32").declareVariables(u,s,a,i)}
        ${r.mainStart()}
        ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`},kI=r=>{let e=r[1].dims,n=r[2].dims,t=r[0].dims,o=r[1].dataType,i=!(B.areEqual(e,n)&&B.areEqual(n,t)),s=e,a=B.size(e);if(i){let l=nr.calcShape(nr.calcShape(e,n,!1),t,!1);if(!l)throw new Error("Can't perform where op on the given tensors");s=l,a=B.size(s)}let u=Math.ceil(a/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>CI(l,r,s,i,o),getRunData:()=>({outputs:[{dims:s,dataType:o}],dispatchGroup:{x:Math.ceil(a/64/4)},programUniforms:[{type:12,data:u},...W(t,e,n,s)]})}},hx=r=>{r.compute(kI(r.inputs))}});var bx,yx=C(()=>{"use strict";xg();Li();Tg();Ig();lb();vb();_b();eu();Vb();Wb();Kb();Jb();ty();ny();ay();ly();dy();Ty();Iy();$y();ru();Oy();fu();Cy();jy();Zy();Di();ex();rx();ox();ux();fx();mx();pu();Jr();Ni();gx();bx=new Map([["Abs",[Sg]],["Acos",[$g]],["Acosh",[Ag]],["Add",[cb]],["ArgMax",[yg,Xs]],["ArgMin",[bg,Xs]],["Asin",[Pg]],["Asinh",[Og]],["Atan",[Eg]],["Atanh",[Cg]],["Attention",[vg]],["AveragePool",[Fy,zy]],["BatchNormalization",[wg]],["BiasAdd",[_g]],["BiasSplitGelu",[ub]],["Cast",[Dg,kg]],["Ceil",[Lg]],["Clip",[Bg]],["Concat",[wb,Tb]],["Conv",[au,iu]],["ConvTranspose",[Mb,Fb]],["Cos",[Rg]],["Cosh",[Ng]],["CumSum",[Gb,Ub]],["DepthToSpace",[Hb,qb]],["Div",[fb]],["Einsum",[Zb,Yb]],["Elu",[zg,Zn]],["Equal",[db]],["Erf",[Fg]],["Exp",[Mg]],["Expand",[ey]],["FastGelu",[ry]],["Floor",[Vg]],["FusedConv",[au,iu]],["Gather",[iy,oy]],["GatherElements",[uy,sy]],["Gelu",[Gg]],["Gemm",[fy,cy]],["GlobalAveragePool",[Gy,Vy]],["GlobalMaxPool",[Ky,qy]],["Greater",[gb]],["GreaterOrEqual",[yb]],["GroupQueryAttention",[wy,vy]],["HardSigmoid",[Zg,Xg]],["InstanceNormalization",[_y]],["LayerNormalization",[Sy]],["LeakyRelu",[Ug,Zn]],["Less",[bb]],["LessOrEqual",[xb]],["Log",[ib]],["MatMul",[Bb]],["MatMulNBits",[Ay,Py]],["MaxPool",[Wy,Hy]],["Mul",[pb]],["MultiHeadAttention",[hy,my]],["Neg",[Hg]],["Not",[Wg]],["Pad",[Ey]],["Pow",[mb]],["QuickGelu",[ab,Zn]],["Range",[Xy]],["Reciprocal",[qg]],["ReduceMin",[fg]],["ReduceMean",[ag]],["ReduceMax",[cg]],["ReduceSum",[pg]],["ReduceProd",[dg]],["ReduceL1",[sg]],["ReduceL2",[ug]],["ReduceLogSum",[hg]],["ReduceLogSumExp",[lg]],["ReduceSumSquare",[mg]],["Relu",[Kg]],["Resize",[Jy,Qy]],["RotaryEmbedding",[tx]],["Sigmoid",[jg]],["Sin",[Yg]],["Sinh",[Jg]],["Slice",[ax,sx]],["SkipLayerNormalization",[nx]],["Split",[dx,px]],["Sqrt",[Qg]],["Softmax",[lx,cx]],["Sub",[hb]],["Tan",[eb]],["Tanh",[rb]],["ThresholdedRelu",[ob,Zn]],["Tile",[by]],["Transpose",[Kh,jh]],["Where",[hx]]])});var ji,xx=C(()=>{"use strict";ft();mr();he();ji=class{constructor(e){this.backend=e;this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,n){this.repo.set(e,n)}run(e,n,t,o,i){St(e.programInfo.name);let s=this.backend.device,a=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let f of n)u.push({binding:u.length,resource:{buffer:f.buffer}});for(let f of t)u.push({binding:u.length,resource:{buffer:f.buffer}});i&&u.push({binding:u.length,resource:i});let l=s.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let f={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:o};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(f)}a.setPipeline(e.computePipeline),a.setBindGroup(0,l),a.dispatchWorkgroups(...o),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),yt(e.programInfo.name)}dispose(){}build(e,n){St(e.name);let t=this.backend.device,o=[];t.features.has("shader-f16")&&o.push("enable f16;");let i=Hh(n,this.backend.device.limits),s=e.getShaderSource(i),a=`${o.join(`
`)}
${i.additionalImplementations}
${s}`,u=t.createShaderModule({code:a,label:e.name});Ne("verbose",()=>`[WebGPU] ${e.name} shader code: ${a}`);let l=t.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return yt(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:i.variablesInfo}}normalizeDispatchGroupSize(e){let n=typeof e=="number"?e:e.x,t=typeof e=="number"?1:e.y||1,o=typeof e=="number"?1:e.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(n<=i&&t<=i&&o<=i)return[n,t,o];let s=n*t*o,a=Math.ceil(Math.sqrt(s));if(a>i){if(a=Math.ceil(Math.cbrt(s)),a>i)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[a,a,a]}else return[a,a,1]}}});var DI,BI,mu,Xi,vx=C(()=>{"use strict";ft();ue();mr();Fh();Wh();yx();xx();DI=(r,e)=>{if(e.length!==r.length)throw new Error(`inputDependencies length ${e.length} is not equal to inputTensors length ${r.length}.`);let n=[];for(let t=0;t<r.length;++t){let o=r[t].dataType;switch(e[t]){case"none":{n.push("");break}case"type":{n.push(`${o}`);break}case"rank":{let i=r[t].dims.length;n.push(`${o};${i}`);break}case"dims":{let i=r[t].dims.join(",");n.push(`${o};${i}`);break}default:throw new Error(`unsupported input dependency: ${e[t]}`)}}return n.join("|")},BI=(r,e,n)=>{let t=r.name;return r.shaderCache?.hint&&(t+="["+r.shaderCache.hint+"]"),t+=":"+n+`:${DI(e,r.shaderCache?.inputDependencies??new Array(e.length).fill("dims"))}`,t},mu=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Xi=class{constructor(){this.currentSessionId=null;this.currentKernelId=null;this.commandEncoder=null;this.computePassEncoder=null;this.maxDispatchNumber=16;this.pendingDispatchNumber=0;this.pendingKernels=[];this.pendingQueries=new Map;this.sessionStatus="default";this.capturedCommandList=new Map;this.capturedPendingKernels=new Map;this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,n){this.env=e;let t=[],o={requiredLimits:{maxComputeWorkgroupStorageSize:n.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:n.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:n.limits.maxStorageBufferBindingSize,maxBufferSize:n.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:n.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:n.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.limits.maxComputeWorkgroupSizeZ},requiredFeatures:t};n.features.has("chromium-experimental-timestamp-query-inside-passes")?t.push("chromium-experimental-timestamp-query-inside-passes"):n.features.has("timestamp-query")&&t.push("timestamp-query"),n.features.has("shader-f16")&&t.push("shader-f16"),this.device=await n.requestDevice(o),this.adapterInfo=new mu(n.info||await n.requestAdapterInfo()),this.gpuDataManager=Uh(this),this.programManager=new ji(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Nh(e.logLevel,!!e.debug),this.device.onuncapturederror=i=>{i.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${i.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:n,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),n={};this.queryType==="at-passes"&&(n.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(n)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;St(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let n=new BigUint64Array(e.getMappedRange()),t=this.pendingQueries.get(e);for(let o=0;o<n.length/2;o++){let i=t[o],s=i.kernelId,a=this.kernels.get(s),u=a.kernelType,l=a.kernelName,f=i.programName,c=i.inputTensorViews,p=i.outputTensorViews,b=n[o*2],h=n[o*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=b);let g=Number(b-this.queryTimeBase),T=Number(h-this.queryTimeBase);if(!Number.isSafeInteger(g)||!Number.isSafeInteger(T))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(w=>({dims:w.dims,dataType:Ar(w.dataType)})),outputsMetadata:p.map(w=>({dims:w.dims,dataType:Ar(w.dataType)})),kernelId:s,kernelType:u,kernelName:l,programName:f,startTime:g,endTime:T});else{let w="";c.forEach((S,$)=>{w+=`input[${$}]: [${S.dims}] | ${Ar(S.dataType)}, `});let v="";p.forEach((S,$)=>{v+=`output[${$}]: [${S.dims}] | ${Ar(S.dataType)}, `}),console.log(`[profiling] kernel "${s}|${u}|${l}|${f}" ${w}${v}execution time: ${T-g} ns`)}_o("GPU",`${f}::${b}::${h}`)}e.unmap(),this.pendingQueries.delete(e)}),yt()}run(e,n,t,o,i,s){St(e.name);let a=[];for(let S=0;S<n.length;++S){let $=n[S].data;if($===0)continue;let P=this.gpuDataManager.get($);if(!P)throw new Error(`no GPU data for input: ${$}`);a.push(P)}let{outputs:u,dispatchGroup:l,programUniforms:f}=e.getRunData(n),c=t.length===0?u.map((S,$)=>$):t;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let p=[],b=[];for(let S=0;S<u.length;++S){if(!Number.isInteger(c[S])||c[S]<-3||c[S]>=s)throw new Error(`Invalid output index: ${c[S]}`);if(c[S]===-3)continue;let $=c[S]===-1,P=c[S]===-2,E=$||P?i(u[S].dataType,u[S].dims):o(c[S],u[S].dataType,u[S].dims);if(p.push(E),E.data===0)continue;let N=this.gpuDataManager.get(E.data);if(!N)throw new Error(`no GPU data for output: ${E.data}`);if($&&this.temporaryData.push(N),P){let z=this.kernelPersistentData.get(this.currentKernelId);z||(z=[],this.kernelPersistentData.set(this.currentKernelId,z)),z.push(N)}b.push(N)}if(a.length!==n.length||b.length!==p.length){if(b.length===0)return yt(e.name),p;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let h;if(f){let S=0,$=[];f.forEach(z=>{let q=typeof z.data=="number"?[z.data]:z.data;if(q.length===0)return;let K=z.type===10?2:4,F,_e;z.type===10?(_e=q.length>4?16:q.length>2?8:q.length*K,F=q.length>4?16:K*q.length):(_e=q.length<=2?q.length*K:16,F=16),S=Math.ceil(S/_e)*_e,$.push(S);let $e=z.type===10?8:4;S+=q.length>4?Math.ceil(q.length/$e)*F:q.length*K});let P=16;S=Math.ceil(S/P)*P;let E=new ArrayBuffer(S);f.forEach((z,q)=>{let K=$[q],F=typeof z.data=="number"?[z.data]:z.data;if(z.type===6)new Int32Array(E,K,F.length).set(F);else if(z.type===12)new Uint32Array(E,K,F.length).set(F);else if(z.type===10)new Uint16Array(E,K,F.length).set(F);else if(z.type===1)new Float32Array(E,K,F.length).set(F);else throw new Error(`Unsupported uniform type: ${Ar(z.type)}`)});let N=this.gpuDataManager.create(S,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(N.buffer,0,E,0,S),this.gpuDataManager.release(N.id),h={offset:0,size:S,buffer:N.buffer}}let g=this.programManager.normalizeDispatchGroupSize(l),T=g[1]===1&&g[2]===1,w=BI(e,n,T),v=this.programManager.getArtifact(w);if(v||(v=this.programManager.build(e,g),this.programManager.setArtifact(w,v),Ne("info",()=>`[artifact] key: ${w}, programName: ${e.name}`)),f&&v.uniformVariablesInfo){if(f.length!==v.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${v.uniformVariablesInfo.length}, got ${f.length} in program "${v.programInfo.name}".`);for(let S=0;S<f.length;S++){let $=f[S],P=$.type,E=typeof $.data=="number"?1:$.data.length,[N,z]=v.uniformVariablesInfo[S];if(P!==N||E!==z)throw new Error(`Uniform variable ${S} mismatch: expect type ${N} with size ${z}, got type ${P} with size ${E} in program "${v.programInfo.name}".`)}}if(Ne("info",()=>`[ProgramManager] run "${e.name}" (key=${w}) with ${g[0]}x${g[1]}x${g[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let S={kernelId:this.currentKernelId,programName:v.programInfo.name,inputTensorViews:n,outputTensorViews:p};this.pendingKernels.push(S),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(S)}return this.programManager.run(v,a,b,g,h),yt(e.name),p}upload(e,n){this.gpuDataManager.upload(e,n)}memcpy(e,n){this.gpuDataManager.memcpy(e,n)}async download(e,n){await this.gpuDataManager.download(e,n)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,n,t,o){let i=bx.get(e);if(!i)throw new Error(`kernel not implemented: ${e}`);let s={kernelType:e,kernelName:o,kernelEntry:i[0],attributes:[i[1],t]};this.kernels.set(n,s)}releaseKernel(e){let n=this.kernelPersistentData.get(e);if(n){for(let t of n)this.gpuDataManager.release(t.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,n,t){let o=this.kernels.get(e);if(!o)throw new Error(`kernel not created: ${e}`);let i=o.kernelType,s=o.kernelName,a=o.kernelEntry,u=o.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${i}] ${s}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),Ne("info",()=>`[WebGPU] Start to run kernel "[${i}] ${s}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),a(n,u[1]),0}catch(f){return t.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${s}" failed. ${f}`)),1}finally{l&&t.push(this.device.popErrorScope().then(f=>f?`GPU validation error for kernel "[${i}] ${s}": ${f.message}`:null));for(let f of this.temporaryData)this.gpuDataManager.release(f.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,n,t,o){let i=this.sessionExternalDataMapping.get(e);i||(i=new Map,this.sessionExternalDataMapping.set(e,i));let s=i.get(n),a=this.gpuDataManager.registerExternalBuffer(t,o,s?.[1]);return i.set(n,[a,t]),a}unregisterBuffers(e){let n=this.sessionExternalDataMapping.get(e);n&&(n.forEach(t=>this.gpuDataManager.unregisterExternalBuffer(t[1])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let n=this.gpuDataManager.get(e);if(!n)throw new Error(`no GPU data for buffer: ${e}`);return n.buffer}createDownloader(e,n,t){return async()=>{let o=await Gs(this,e,n);return zh(o.buffer,t)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){Ne("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){Ne("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){Ne("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),n=this.capturedPendingKernels.get(this.currentSessionId),t=e.length;this.pendingKernels=[];for(let o=0;o<t;o++){let i=this.getComputePassEncoder(),s=e[o];this.writeTimestamp(this.pendingDispatchNumber*2),i.setPipeline(s.computePipeline),i.setBindGroup(0,s.bindGroup),i.dispatchWorkgroups(...s.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(n[o]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}});var wx={};sn(wx,{init:()=>LI});var to,hu,LI,Tx=C(()=>{"use strict";ue();vx();mr();ye();to=class r{constructor(e,n,t,o){this.module=e;this.dataType=n;this.data=t;this.dims=o}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let e=B.size(this.dims);return e===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,e)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let e=B.size(this.dims);return e===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,e)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let e=B.size(this.dims);return e===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,e)}reshape(e){if(B.size(e)!==B.size(this.dims))throw new Error("Invalid new shape");return new r(this.module,this.dataType,this.data,e)}},hu=class{constructor(e,n,t){this.module=e;this.backend=n;this.customDataOffset=0;this.customDataSize=0;this.adapterInfo=n.adapterInfo;let o=e.HEAPU32,i=t>>>2;this.opKernelContext=o[i++];let s=o[i++];this.outputCount=o[i++],this.customDataOffset=o[i++],this.customDataSize=o[i++];let a=[];for(let u=0;u<s;u++){let l=o[i++],f=o[i++],c=o[i++],p=[];for(let b=0;b<c;b++)p.push(o[i++]);a.push(new to(e,l,f,p))}this.inputs=a}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}getMaxComputeWorkgroupSizes(){return[this.backend.device.limits.maxComputeWorkgroupSizeX,this.backend.device.limits.maxComputeWorkgroupSizeY,this.backend.device.limits.maxComputeWorkgroupSizeZ]}getMaxComputeWorkgroupStoragesize(){return this.backend.device.limits.maxComputeWorkgroupStorageSize}compute(e,n){let t=n?.inputs?.map(a=>typeof a=="number"?this.inputs[a]:a)??this.inputs,o=n?.outputs??[],i=(a,u,l)=>new to(this.module,u,this.output(a,l),l),s=(a,u)=>{let l=jr(a);if(!l)throw new Error(`Unsupported data type: ${a}`);let f=l*B.size(u),c=f>0?this.backend.gpuDataManager.create(f).id:0;return new to(this.module,a,c,u)};return this.backend.run(e,t,o,i,s,this.outputCount)}output(e,n){let t=this.module.stackSave();try{let o=this.module.stackAlloc((1+n.length)*4),i=o>>2;this.module.HEAPU32[i++]=n.length;for(let s=0;s<n.length;s++)this.module.HEAPU32[i++]=n[s];return this.module._JsepOutput(this.opKernelContext,e,o)}catch(o){throw new Error(`Failed to generate kernel's output[${e}] with dims [${n}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${o}`)}finally{this.module.stackRestore(t)}}},LI=async(r,e,n,t)=>{let o=e.jsepInit;if(!o)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(r==="webgpu"){let i=new Xi;await i.initialize(n,t),o("webgpu",[i,s=>i.alloc(s),s=>i.free(s),(s,a,u,l=!1)=>{if(l)Ne("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${s}, dst=${a}, size=${u}`),i.memcpy(s,a);else{Ne("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${s}, gpuDataId=${a}, size=${u}`);let f=e.HEAPU8.subarray(s>>>0,(s>>>0)+u);i.upload(a,f)}},async(s,a,u)=>{Ne("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${s}, dataOffset=${a}, size=${u}`),await i.download(s,()=>e.HEAPU8.subarray(a>>>0,(a>>>0)+u))},(s,a,u)=>i.createKernel(s,a,u,e.UTF8ToString(e._JsepGetNodeName(a))),s=>i.releaseKernel(s),(s,a,u,l)=>{Ne("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${u}, kernel=${s}, contextDataOffset=${a}`);let f=new hu(e,i,a);return i.computeKernel(s,f,l)},()=>i.captureBegin(),()=>i.captureEnd(),()=>i.replay()])}else o("webnn")}});var RI,bi,yi,Qr,NI,qn,xi,vi,_x,wi,Ti,_i,ks=C(()=>{"use strict";kh();Bh();ue();Kr();Si();zs();RI=(r,e)=>{Ye()._OrtInit(r,e)!==0&&Ue("Can't initialize onnxruntime.")},bi=async r=>{RI(r.wasm.numThreads,jn(r.logLevel))},yi=async(r,e)=>{{let n=(Tx(),Pn(wx)).init;if(e==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let t=r.webgpu.adapter;if(t){if(typeof t.limits!="object"||typeof t.features!="object"||typeof t.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let o=r.webgpu.powerPreference;if(o!==void 0&&o!=="low-power"&&o!=="high-performance")throw new Error(`Invalid powerPreference setting: "${o}"`);let i=r.webgpu.forceFallbackAdapter;if(i!==void 0&&typeof i!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${i}"`);if(t=await navigator.gpu.requestAdapter({powerPreference:o,forceFallbackAdapter:i}),!t)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await n("webgpu",Ye(),r,t)}if(e==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await n("webnn",Ye(),r)}}},Qr=new Map,NI=r=>{let e=Ye(),n=e.stackSave();try{let t=e.stackAlloc(8);return e._OrtGetInputOutputCount(r,t,t+4)!==0&&Ue("Can't get session input/output count."),[e.HEAP32[t/4],e.HEAP32[t/4+1]]}finally{e.stackRestore(n)}},qn=r=>{let e=Ye(),n=e._malloc(r.byteLength);if(n===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${r.byteLength}.`);return e.HEAPU8.set(r,n),[n,r.byteLength]},xi=async(r,e)=>{let n,t,o=Ye();Array.isArray(r)?[n,t]=r:r.buffer===o.HEAPU8.buffer?[n,t]=[r.byteOffset,r.byteLength]:[n,t]=qn(r);let i=0,s=0,a=0,u=[],l=[],f=[];try{if([s,u]=Dh(e),e?.externalData&&o.mountExternalData){let v=[];for(let S of e.externalData){let $=typeof S=="string"?S:S.path;v.push(Xn(typeof S=="string"?S:S.data).then(P=>{o.mountExternalData($,P)}))}await Promise.all(v)}for(let v of e?.executionProviders??[])if((typeof v=="string"?v:v.name)==="webnn"){if(o.currentContext)throw new Error("WebNN execution provider is already set.");if(typeof v!="string"){let $=v,P=$?.context,E=$?.gpuDevice,N=$?.deviceType,z=$?.numThreads,q=$?.powerPreference;P?o.currentContext=P:E?o.currentContext=await navigator.ml.createContext(E):o.currentContext=await navigator.ml.createContext({deviceType:N,numThreads:z,powerPreference:q})}else o.currentContext=await navigator.ml.createContext();break}i=await o._OrtCreateSession(n,t,s),i===0&&Ue("Can't create a session."),o.currentContext&&(o.currentContext=void 0);let[c,p]=NI(i),b=!!e?.enableGraphCapture,h=[],g=[],T=[];for(let v=0;v<c;v++){let S=o._OrtGetInputName(i,v);S===0&&Ue("Can't get an input name."),l.push(S),h.push(o.UTF8ToString(S))}for(let v=0;v<p;v++){let S=o._OrtGetOutputName(i,v);S===0&&Ue("Can't get an output name."),f.push(S);let $=o.UTF8ToString(S);g.push($);{if(b&&e?.preferredOutputLocation===void 0){T.push("gpu-buffer");continue}let P=typeof e?.preferredOutputLocation=="string"?e.preferredOutputLocation:e?.preferredOutputLocation?.[$]??"cpu";if(P!=="cpu"&&P!=="cpu-pinned"&&P!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${P}.`);if(b&&P!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${P}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);T.push(P)}}let w=null;return T.some(v=>v==="gpu-buffer")&&(a=o._OrtCreateBinding(i),a===0&&Ue("Can't create IO binding."),w={handle:a,outputPreferredLocations:T,outputPreferredLocationsEncoded:T.map(v=>Ns(v))}),Qr.set(i,[i,l,f,w,b,!1]),[i,h,g]}catch(c){throw l.forEach(p=>o._OrtFree(p)),f.forEach(p=>o._OrtFree(p)),a!==0&&o._OrtReleaseBinding(a),i!==0&&o._OrtReleaseSession(i),c}finally{o._free(n),s!==0&&o._OrtReleaseSessionOptions(s),u.forEach(c=>o._free(c)),o.unmountExternalData?.()}},vi=r=>{let e=Ye(),n=Qr.get(r);if(!n)throw new Error(`cannot release session. invalid session id: ${r}`);let[t,o,i,s,a]=n;s&&(a&&e._OrtClearBoundOutputs(s.handle),e._OrtReleaseBinding(s.handle)),e.jsepOnReleaseSession?.(r),o.forEach(u=>e._OrtFree(u)),i.forEach(u=>e._OrtFree(u)),e._OrtReleaseSession(t),Qr.delete(r)},_x=(r,e,n,t,o,i=!1)=>{if(!r){e.push(0);return}let s=Ye(),a=r[0],u=r[1],l=r[3],f,c;if(a==="string"&&l==="gpu-buffer")throw new Error("String tensor is not supported on GPU.");if(i&&l!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${o} when enableGraphCapture is true.`);if(l==="gpu-buffer"){let h=r[2].gpuBuffer,g=jr(Rs(a));c=u.reduce((w,v)=>w*v,1)*g;let T=s.jsepRegisterBuffer;if(!T)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');f=T(t,o,h,c)}else{let h=r[2];if(Array.isArray(h)){c=4*h.length,f=s._malloc(c),n.push(f);let g=f/4;for(let T=0;T<h.length;T++){if(typeof h[T]!="string")throw new TypeError(`tensor data at index ${T} is not a string`);s.HEAPU32[g++]=nt(h[T],n)}}else c=h.byteLength,f=s._malloc(c),n.push(f),s.HEAPU8.set(new Uint8Array(h.buffer,h.byteOffset,c),f)}let p=s.stackSave(),b=s.stackAlloc(4*u.length);try{let h=b/4;u.forEach(T=>s.HEAP32[h++]=T);let g=s._OrtCreateTensor(Rs(a),f,c,b,u.length,Ns(l));g===0&&Ue(`Can't create tensor for input/output. session=${t}, index=${o}.`),e.push(g)}finally{s.stackRestore(p)}},wi=async(r,e,n,t,o,i)=>{let s=Ye(),a=Qr.get(r);if(!a)throw new Error(`cannot run inference. invalid session id: ${r}`);let u=a[0],l=a[1],f=a[2],c=a[3],p=a[4],b=a[5],h=e.length,g=t.length,T=0,w=[],v=[],S=[],$=[],P=s.stackSave(),E=s.stackAlloc(h*4),N=s.stackAlloc(h*4),z=s.stackAlloc(g*4),q=s.stackAlloc(g*4);try{[T,w]=Ch(i);for(let Q=0;Q<h;Q++)_x(n[Q],v,$,r,e[Q],p);for(let Q=0;Q<g;Q++)_x(o[Q],S,$,r,h+t[Q],p);let K=E/4,F=N/4,_e=z/4,$e=q/4;for(let Q=0;Q<h;Q++)s.HEAPU32[K++]=v[Q],s.HEAPU32[F++]=l[e[Q]];for(let Q=0;Q<g;Q++)s.HEAPU32[_e++]=S[Q],s.HEAPU32[$e++]=f[t[Q]];if(c&&!b){let{handle:Q,outputPreferredLocations:ge,outputPreferredLocationsEncoded:Ie}=c;if(l.length!==h)throw new Error(`input count from feeds (${h}) is expected to be always equal to model's input count (${l.length}).`);for(let xe=0;xe<h;xe++){let se=e[xe];await s._OrtBindInput(Q,l[se],v[xe])!==0&&Ue(`Can't bind input[${xe}] for session=${r}.`)}for(let xe=0;xe<g;xe++){let se=t[xe];o[xe]?.[3]?s._OrtBindOutput(Q,f[se],S[xe],0)!==0&&Ue(`Can't bind pre-allocated output[${xe}] for session=${r}.`):s._OrtBindOutput(Q,f[se],0,Ie[se])!==0&&Ue(`Can't bind output[${xe}] to ${ge[xe]} for session=${r}.`)}Qr.set(r,[u,l,f,c,p,!0])}s.jsepOnRunStart?.(u);let ae;c?ae=await s._OrtRunWithBinding(u,c.handle,g,z,T):ae=await s._OrtRun(u,N,E,h,q,g,z,T),ae!==0&&Ue("failed to call OrtRun().");let qe=[];for(let Q=0;Q<g;Q++){let ge=s.HEAPU32[z/4+Q];if(ge===S[Q]){qe.push(o[Q]);continue}let Ie=s.stackSave(),xe=s.stackAlloc(4*4),se=!1,pe,ce=0;try{s._OrtGetTensorData(ge,xe,xe+4,xe+8,xe+12)!==0&&Ue(`Can't access output tensor data on index ${Q}.`);let V=xe/4,ie=s.HEAPU32[V++];ce=s.HEAPU32[V++];let Te=s.HEAPU32[V++],tt=s.HEAPU32[V++],Fe=[];for(let mt=0;mt<tt;mt++)Fe.push(s.HEAPU32[Te/4+mt]);s._OrtFree(Te);let Ke=Fe.reduce((mt,rt)=>mt*rt,1);pe=Ar(ie);let tn=c?.outputPreferredLocations[t[Q]];if(pe==="string"){if(tn==="gpu-buffer")throw new Error("String tensor is not supported on GPU.");let mt=[],rt=ce/4;for(let Kt=0;Kt<Ke;Kt++){let hr=s.HEAPU32[rt++],no=Kt===Ke-1?void 0:s.HEAPU32[rt]-hr;mt.push(s.UTF8ToString(hr,no))}qe.push([pe,Fe,mt,"cpu"])}else if(tn==="gpu-buffer"&&Ke>0){let mt=s.jsepGetBuffer;if(!mt)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let rt=mt(ce),Kt=jr(ie);if(Kt===void 0||!Ai(pe))throw new Error(`Unsupported data type: ${pe}`);se=!0,qe.push([pe,Fe,{gpuBuffer:rt,download:s.jsepCreateDownloader(rt,Ke*Kt,pe),dispose:()=>{s._OrtReleaseTensor(ge)}},"gpu-buffer"])}else{let mt=$i(pe),rt=new mt(Ke);new Uint8Array(rt.buffer,rt.byteOffset,rt.byteLength).set(s.HEAPU8.subarray(ce,ce+rt.byteLength)),qe.push([pe,Fe,rt,"cpu"])}}finally{s.stackRestore(Ie),pe==="string"&&ce&&s._free(ce),se||s._OrtReleaseTensor(ge)}}return c&&!p&&(s._OrtClearBoundOutputs(c.handle),Qr.set(r,[u,l,f,c,p,!1])),qe}finally{s.stackRestore(P),v.forEach(K=>s._OrtReleaseTensor(K)),S.forEach(K=>s._OrtReleaseTensor(K)),$.forEach(K=>s._free(K)),T!==0&&s._OrtReleaseRunOptions(T),w.forEach(K=>s._free(K))}},Ti=r=>{let e=Ye(),n=Qr.get(r);if(!n)throw new Error("invalid session id");let t=n[0],o=e._OrtEndProfiling(t);o===0&&Ue("Can't get an profile file name."),e._OrtFree(o)},_i=r=>{let e=[];for(let n of r){let t=n[2];!Array.isArray(t)&&"buffer"in t&&e.push(t.buffer)}return e}});var en,Rt,ro,Yi,Ji,Zi,gu,bu,Sn,$n,FI,Ix,Sx,$x,Ax,Px,Ox,Ex,yu=C(()=>{"use strict";ft();ks();Kr();Hn();en=()=>!!le.wasm.proxy&&typeof document<"u",ro=!1,Yi=!1,Ji=!1,bu=new Map,Sn=(r,e)=>{let n=bu.get(r);n?n.push(e):bu.set(r,[e])},$n=()=>{if(ro||!Yi||Ji||!Rt)throw new Error("worker not ready")},FI=r=>{switch(r.data.type){case"init-wasm":ro=!1,r.data.err?(Ji=!0,gu[1](r.data.err)):(Yi=!0,gu[0]()),Zi&&(URL.revokeObjectURL(Zi),Zi=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let e=bu.get(r.data.type);r.data.err?e.shift()[1](r.data.err):e.shift()[0](r.data.out);break}default:}},Ix=async()=>{if(!Yi){if(ro)throw new Error("multiple calls to 'initWasm()' detected.");if(Ji)throw new Error("previous call to 'initWasm()' failed.");if(ro=!0,en())return new Promise((r,e)=>{Rt?.terminate(),Ph().then(([n,t])=>{try{Rt=t,Rt.onerror=i=>e(i),Rt.onmessage=FI,gu=[r,e];let o={type:"init-wasm",in:le};Rt.postMessage(o),Zi=n}catch(o){e(o)}},e)});try{await gi(le.wasm),await bi(le),Yi=!0}catch(r){throw Ji=!0,r}finally{ro=!1}}},Sx=async r=>{if(en())return $n(),new Promise((e,n)=>{Sn("init-ep",[e,n]);let t={type:"init-ep",in:{epName:r,env:le}};Rt.postMessage(t)});await yi(le,r)},$x=async r=>en()?($n(),new Promise((e,n)=>{Sn("copy-from",[e,n]);let t={type:"copy-from",in:{buffer:r}};Rt.postMessage(t,[r.buffer])})):qn(r),Ax=async(r,e)=>{if(en()){if(e?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return $n(),new Promise((n,t)=>{Sn("create",[n,t]);let o={type:"create",in:{model:r,options:{...e}}},i=[];r instanceof Uint8Array&&i.push(r.buffer),Rt.postMessage(o,i)})}else return xi(r,e)},Px=async r=>{if(en())return $n(),new Promise((e,n)=>{Sn("release",[e,n]);let t={type:"release",in:r};Rt.postMessage(t)});vi(r)},Ox=async(r,e,n,t,o,i)=>{if(en()){if(n.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(o.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return $n(),new Promise((s,a)=>{Sn("run",[s,a]);let u=n,l={type:"run",in:{sessionId:r,inputIndices:e,inputs:u,outputIndices:t,options:i}};Rt.postMessage(l,_i(u))})}else return wi(r,e,n,t,o,i)},Ex=async r=>{if(en())return $n(),new Promise((e,n)=>{Sn("end-profiling",[e,n]);let t={type:"end-profiling",in:r};Rt.postMessage(t)});Ti(r)}});var Cx,MI,Qi,kx=C(()=>{"use strict";ft();yu();ue();hi();zs();Cx=(r,e)=>{switch(r.location){case"cpu":return[r.type,r.dims,r.data,"cpu"];case"gpu-buffer":return[r.type,r.dims,{gpuBuffer:r.gpuBuffer},"gpu-buffer"];default:throw new Error(`invalid data location: ${r.location} for ${e()}`)}},MI=r=>{switch(r[3]){case"cpu":return new it(r[0],r[2],r[1]);case"gpu-buffer":{let e=r[0];if(!Ai(e))throw new Error(`not supported data type: ${e} for deserializing GPU tensor`);let{gpuBuffer:n,download:t,dispose:o}=r[2];return it.fromGpuBuffer(n,{dataType:e,dims:r[1],download:t,dispose:o})}default:throw new Error(`invalid data location: ${r[3]}`)}},Qi=class{async fetchModelAndCopyToWasmMemory(e){return $x(await Xn(e))}async loadModel(e,n){St();let t;typeof e=="string"?!1?t=await Xn(e):t=await this.fetchModelAndCopyToWasmMemory(e):t=e,[this.sessionId,this.inputNames,this.outputNames]=await Ax(t,n),yt()}async dispose(){return Px(this.sessionId)}async run(e,n,t){St();let o=[],i=[];Object.entries(e).forEach(p=>{let b=p[0],h=p[1],g=this.inputNames.indexOf(b);if(g===-1)throw new Error(`invalid input '${b}'`);o.push(h),i.push(g)});let s=[],a=[];Object.entries(n).forEach(p=>{let b=p[0],h=p[1],g=this.outputNames.indexOf(b);if(g===-1)throw new Error(`invalid output '${b}'`);s.push(h),a.push(g)});let u=o.map((p,b)=>Cx(p,()=>`input "${this.inputNames[i[b]]}"`)),l=s.map((p,b)=>p?Cx(p,()=>`output "${this.outputNames[a[b]]}"`):null),f=await Ox(this.sessionId,i,u,a,l,t),c={};for(let p=0;p<f.length;p++)c[this.outputNames[a[p]]]=s[p]??MI(f[p]);return yt(),c}startProfiling(){}endProfiling(){Ex(this.sessionId)}}});var VI,ea,Dx=C(()=>{"use strict";ft();yu();kx();Hn();VI=()=>{if((typeof le.wasm.initTimeout!="number"||le.wasm.initTimeout<0)&&(le.wasm.initTimeout=0),le.wasm.simd===!1&&console.warn('Deprecated property "env.wasm.simd" is set to false. non-SIMD build is no longer provided, and this setting will be ignored.'),typeof le.wasm.proxy!="boolean"&&(le.wasm.proxy=!1),typeof le.wasm.trace!="boolean"&&(le.wasm.trace=!1),typeof le.wasm.numThreads!="number"||!Number.isInteger(le.wasm.numThreads)||le.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)le.wasm.numThreads=1;else{let r=typeof navigator>"u"?Ta("node:os").cpus().length:navigator.hardwareConcurrency;le.wasm.numThreads=Math.min(4,Math.ceil((r||1)/2))}},ea=class{async init(e){VI(),await Ix(),await Sx(e)}async createInferenceSessionHandler(e,n){let t=new Qi;return await t.loadModel(e,n),Promise.resolve(t)}}});var Bx={};sn(Bx,{wasmBackend:()=>GI});var GI,Lx=C(()=>{"use strict";Dx();GI=new ea});ft();ft();ft();var mc="1.19.0";var YM=$a;{let r=(xh(),Pn(yh)).onnxjsBackend;vr("webgl",r,-10)}{let r=(Lx(),Pn(Bx)).wasmBackend;vr("webgpu",r,5),vr("webnn",r,5),vr("cpu",r,10),vr("wasm",r,10)}Object.defineProperty(le.versions,"web",{value:mc,enumerable:!0});export{ov as InferenceSession,_o as TRACE,St as TRACE_FUNC_BEGIN,yt as TRACE_FUNC_END,it as Tensor,av as TrainingSession,YM as default,le as env,vr as registerBackend};
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/*! Bundled license information:

long/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
//# sourceMappingURL=ort.all.bundle.min.mjs.map
