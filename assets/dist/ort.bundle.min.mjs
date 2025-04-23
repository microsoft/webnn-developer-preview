/*!
 * ONNX Runtime Web v1.22.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var Tn=Object.defineProperty;var Lp=Object.getOwnPropertyDescriptor;var Gp=Object.getOwnPropertyNames;var Hp=Object.prototype.hasOwnProperty;var In=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')});var N=(e,t)=>()=>(e&&(t=e(e=0)),t);var zt=(e,t)=>{for(var r in t)Tn(e,r,{get:t[r],enumerable:!0})},Fp=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Gp(t))!Hp.call(e,o)&&o!==r&&Tn(e,o,{get:()=>t[o],enumerable:!(n=Lp(t,o))||n.enumerable});return e};var Ht=e=>Fp(Tn({},"__esModule",{value:!0}),e);var cr,_t,wt,qp,Hi,Cn=N(()=>{"use strict";cr=new Map,_t=[],wt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let n=cr.get(e);if(n===void 0)cr.set(e,{backend:t,priority:r});else{if(n.priority>r)return;if(n.priority===r&&n.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let o=_t.indexOf(e);o!==-1&&_t.splice(o,1);for(let i=0;i<_t.length;i++)if(cr.get(_t[i]).priority<=r){_t.splice(i,0,e);return}_t.push(e)}return}throw new TypeError("not a valid backend")},qp=async e=>{let t=cr.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(n){return r||(t.error=`${n}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Hi=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),n=r.length===0?_t:r,o,i=[],a=new Set;for(let l of n){let c=await qp(l);typeof c=="string"?i.push({name:l,err:c}):(o||(o=c),o===c&&a.add(l))}if(!o)throw new Error(`no available backend found. ERR: ${i.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:c}of i)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${c}`);let u=t.filter(l=>a.has(typeof l=="string"?l:l.name));return[o,new Proxy(e,{get:(l,c)=>c==="executionProviders"?u:Reflect.get(l,c)})]}});var Fi=N(()=>{"use strict";Cn()});var qi,Ki=N(()=>{"use strict";qi="1.22.0"});var ji,Ue,An=N(()=>{"use strict";Ki();ji="warning",Ue={wasm:{},webgl:{},webgpu:{},versions:{common:qi},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);ji=e}},get logLevel(){return ji}};Object.defineProperty(Ue,"logLevel",{enumerable:!0})});var we,Zi=N(()=>{"use strict";An();we=Ue});var Qi,Yi,Xi=N(()=>{"use strict";Qi=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let n=r.getContext("2d");if(n!=null){let o,i;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(o=e.dims[2],i=e.dims[3]):(o=e.dims[3],i=e.dims[2]);let a=t?.format!==void 0?t.format:"RGB",u=t?.norm,l,c;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?c=[0,0,0,0]:typeof u.bias=="number"?c=[u.bias,u.bias,u.bias,u.bias]:(c=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(c[3]=u.bias[3]));let p=i*o,m=0,h=p,y=p*2,g=-1;a==="RGBA"?(m=0,h=p,y=p*2,g=p*3):a==="RGB"?(m=0,h=p,y=p*2):a==="RBG"&&(m=0,y=p,h=p*2);for(let _=0;_<i;_++)for(let S=0;S<o;S++){let v=(e.data[m++]-c[0])*l[0],w=(e.data[h++]-c[1])*l[1],x=(e.data[y++]-c[2])*l[2],T=g===-1?255:(e.data[g++]-c[3])*l[3];n.fillStyle="rgba("+v+","+w+","+x+","+T+")",n.fillRect(S,_,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Yi=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),n;if(r!=null){let o,i,a;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(o=e.dims[2],i=e.dims[1],a=e.dims[3]):(o=e.dims[3],i=e.dims[2],a=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,c,p;l===void 0||l.mean===void 0?c=[255,255,255,255]:typeof l.mean=="number"?c=[l.mean,l.mean,l.mean,l.mean]:(c=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(c[3]=l.mean[3])),l===void 0||l.bias===void 0?p=[0,0,0,0]:typeof l.bias=="number"?p=[l.bias,l.bias,l.bias,l.bias]:(p=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(p[3]=l.bias[3]));let m=i*o;if(t!==void 0&&(t.format!==void 0&&a===4&&t.format!=="RGBA"||a===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,y=0,g=1,_=2,S=3,v=0,w=m,x=m*2,T=-1;u==="RGBA"?(v=0,w=m,x=m*2,T=m*3):u==="RGB"?(v=0,w=m,x=m*2):u==="RBG"&&(v=0,x=m,w=m*2),n=r.createImageData(o,i);for(let k=0;k<i*o;y+=h,g+=h,_+=h,S+=h,k++)n.data[y]=(e.data[v++]-p[0])*c[0],n.data[g]=(e.data[w++]-p[1])*c[1],n.data[_]=(e.data[x++]-p[2])*c[2],n.data[S]=T===-1?255:(e.data[T++]-p[3])*c[3]}else throw new Error("Can not access image data");return n}});var kn,Ji,ea,ta,ra,na,oa=N(()=>{"use strict";pr();kn=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:n}=t,o=t.norm??{mean:255,bias:0},i,a;typeof o.mean=="number"?i=[o.mean,o.mean,o.mean,o.mean]:i=[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],typeof o.bias=="number"?a=[o.bias,o.bias,o.bias,o.bias]:a=[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",c=r*n,p=l==="RGBA"?new Float32Array(c*4):new Float32Array(c*3),m=4,h=0,y=1,g=2,_=3,S=0,v=c,w=c*2,x=-1;u==="RGB"&&(m=3,h=0,y=1,g=2,_=-1),l==="RGBA"?x=c*3:l==="RBG"?(S=0,w=c,v=c*2):l==="BGR"&&(w=0,v=c,S=c*2);for(let k=0;k<c;k++,h+=m,g+=m,y+=m,_+=m)p[S++]=(e[h]+a[0])/i[0],p[v++]=(e[y]+a[1])/i[1],p[w++]=(e[g]+a[2])/i[2],x!==-1&&_!==-1&&(p[x++]=(e[_]+a[3])/i[3]);return l==="RGBA"?new De("float32",p,[1,4,r,n]):new De("float32",p,[1,3,r,n])},Ji=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,n=typeof ImageData<"u"&&e instanceof ImageData,o=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,i=typeof e=="string",a,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},c=p=>typeof HTMLCanvasElement<"u"&&p instanceof HTMLCanvasElement||p instanceof OffscreenCanvas?p.getContext("2d"):null;if(r){let p=l();p.width=e.width,p.height=e.height;let m=c(p);if(m!=null){let h=e.height,y=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,y=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=h,u.width=y}else u.tensorFormat="RGBA",u.height=h,u.width=y;m.drawImage(e,0,0),a=m.getImageData(0,0,y,h).data}else throw new Error("Can not access image data")}else if(n){let p,m;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(p=t.resizedHeight,m=t.resizedWidth):(p=e.height,m=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=p,u.width=m,t!==void 0){let h=l();h.width=m,h.height=p;let y=c(h);if(y!=null)y.putImageData(e,0,0),a=y.getImageData(0,0,m,p).data;else throw new Error("Can not access image data")}else a=e.data}else if(o){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let p=l();p.width=e.width,p.height=e.height;let m=c(p);if(m!=null){let h=e.height,y=e.width;return m.drawImage(e,0,0,y,h),a=m.getImageData(0,0,y,h).data,u.height=h,u.width=y,kn(a,u)}else throw new Error("Can not access image data")}else{if(i)return new Promise((p,m)=>{let h=l(),y=c(h);if(!e||!y)return m();let g=new Image;g.crossOrigin="Anonymous",g.src=e,g.onload=()=>{h.width=g.width,h.height=g.height,y.drawImage(g,0,0,h.width,h.height);let _=y.getImageData(0,0,h.width,h.height);u.height=h.height,u.width=h.width,p(kn(_.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(a!==void 0)return kn(a,u);throw new Error("Input data provided is not supported - aborted tensor creation")},ea=(e,t)=>{let{width:r,height:n,download:o,dispose:i}=t,a=[1,n,r,4];return new De({location:"texture",type:"float32",texture:e,dims:a,download:o,dispose:i})},ta=(e,t)=>{let{dataType:r,dims:n,download:o,dispose:i}=t;return new De({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:n,download:o,dispose:i})},ra=(e,t)=>{let{dataType:r,dims:n,download:o,dispose:i}=t;return new De({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:n,download:o,dispose:i})},na=(e,t,r)=>new De({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})});var vt,Ft,ia,aa,sa=N(()=>{"use strict";vt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Ft=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),ia=!1,aa=()=>{if(!ia){ia=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,n=typeof r<"u"&&r.from;e&&(vt.set("int64",BigInt64Array),Ft.set(BigInt64Array,"int64")),t&&(vt.set("uint64",BigUint64Array),Ft.set(BigUint64Array,"uint64")),n?(vt.set("float16",r),Ft.set(r,"float16")):vt.set("float16",Uint16Array)}}});var ua,la,da=N(()=>{"use strict";pr();ua=e=>{let t=1;for(let r=0;r<e.length;r++){let n=e[r];if(typeof n!="number"||!Number.isSafeInteger(n))throw new TypeError(`dims[${r}] must be an integer, got: ${n}`);if(n<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${n}`);t*=n}return t},la=(e,t)=>{switch(e.location){case"cpu":return new De(e.type,e.data,t);case"cpu-pinned":return new De({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new De({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new De({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new De({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}});var De,pr=N(()=>{"use strict";Xi();oa();sa();da();De=class{constructor(t,r,n){aa();let o,i;if(typeof t=="object"&&"location"in t)switch(this.dataLocation=t.location,o=t.type,i=t.dims,t.location){case"cpu-pinned":{let u=vt.get(o);if(!u)throw new TypeError(`unsupported type "${o}" to create tensor from pinned buffer`);if(!(t.data instanceof u))throw new TypeError(`buffer should be of type ${u.name}`);this.cpuData=t.data;break}case"texture":{if(o!=="float32")throw new TypeError(`unsupported type "${o}" to create tensor from texture`);this.gpuTextureData=t.texture,this.downloader=t.download,this.disposer=t.dispose;break}case"gpu-buffer":{if(o!=="float32"&&o!=="float16"&&o!=="int32"&&o!=="int64"&&o!=="uint32"&&o!=="uint8"&&o!=="bool"&&o!=="uint4"&&o!=="int4")throw new TypeError(`unsupported type "${o}" to create tensor from gpu buffer`);this.gpuBufferData=t.gpuBuffer,this.downloader=t.download,this.disposer=t.dispose;break}case"ml-tensor":{if(o!=="float32"&&o!=="float16"&&o!=="int32"&&o!=="int64"&&o!=="uint32"&&o!=="uint64"&&o!=="int8"&&o!=="uint8"&&o!=="bool"&&o!=="uint4"&&o!=="int4")throw new TypeError(`unsupported type "${o}" to create tensor from MLTensor`);this.mlTensorData=t.mlTensor,this.downloader=t.download,this.disposer=t.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let u,l;if(typeof t=="string")if(o=t,l=n,t==="string"){if(!Array.isArray(r))throw new TypeError("A string tensor's data must be a string array.");u=r}else{let c=vt.get(t);if(c===void 0)throw new TypeError(`Unsupported tensor type: ${t}.`);if(Array.isArray(r)){if(t==="float16"&&c===Uint16Array||t==="uint4"||t==="int4")throw new TypeError(`Creating a ${t} tensor from number array is not supported. Please use ${c.name} as data.`);t==="uint64"||t==="int64"?u=c.from(r,BigInt):u=c.from(r)}else if(r instanceof c)u=r;else if(r instanceof Uint8ClampedArray)if(t==="uint8")u=Uint8Array.from(r);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(t==="float16"&&r instanceof Uint16Array&&c!==Uint16Array)u=new globalThis.Float16Array(r.buffer,r.byteOffset,r.length);else throw new TypeError(`A ${o} tensor's data must be type of ${c}`)}else if(l=r,Array.isArray(t)){if(t.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let c=typeof t[0];if(c==="string")o="string",u=t;else if(c==="boolean")o="bool",u=Uint8Array.from(t);else throw new TypeError(`Invalid element type of data array: ${c}.`)}else if(t instanceof Uint8ClampedArray)o="uint8",u=Uint8Array.from(t);else{let c=Ft.get(t.constructor);if(c===void 0)throw new TypeError(`Unsupported type for tensor data: ${t.constructor}.`);o=c,u=t}if(l===void 0)l=[u.length];else if(!Array.isArray(l))throw new TypeError("A tensor's dims must be a number array");i=l,this.cpuData=u,this.dataLocation="cpu"}let a=ua(i);if(this.cpuData&&a!==this.cpuData.length&&!((o==="uint4"||o==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=o,this.dims=i,this.size=a}static async fromImage(t,r){return Ji(t,r)}static fromTexture(t,r){return ea(t,r)}static fromGpuBuffer(t,r){return ta(t,r)}static fromMLTensor(t,r){return ra(t,r)}static fromPinnedBuffer(t,r,n){return na(t,r,n)}toDataURL(t){return Qi(this,t)}toImageData(t){return Yi(this,t)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(t){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let r=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=r,t&&this.disposer&&(this.disposer(),this.disposer=void 0),r}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(t){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return la(this,t)}}});var He,En=N(()=>{"use strict";pr();He=De});var mr,ca,Ne,Re,Pn=N(()=>{"use strict";An();mr=(e,t)=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||console.timeStamp(`${e}::ORT::${t}`)},ca=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],n=!1;for(let o=0;o<r.length;o++){if(n&&!r[o].includes("TRACE_FUNC")){let i=`FUNC_${e}::${r[o].trim().split(" ")[1]}`;t&&(i+=`::${t}`),mr("CPU",i);return}r[o].includes("TRACE_FUNC")&&(n=!0)}},Ne=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||ca("BEGIN",e)},Re=e=>{(typeof Ue.trace>"u"?!Ue.wasm.trace:!Ue.trace)||ca("END",e)}});var fr,pa=N(()=>{"use strict";Cn();En();Pn();fr=class e{constructor(t){this.handler=t}async run(t,r,n){Ne();let o={},i={};if(typeof t!="object"||t===null||t instanceof He||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let a=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof He)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");a=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid output name: ${c}.`);o[c]=null}if(typeof n=="object"&&n!==null)i=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else{let c=!1,p=Object.getOwnPropertyNames(r);for(let m of this.outputNames)if(p.indexOf(m)!==-1){let h=r[m];(h===null||h instanceof He)&&(c=!0,a=!1,o[m]=h)}if(c){if(typeof n=="object"&&n!==null)i=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else i=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds'.`);if(a)for(let c of this.outputNames)o[c]=null;let u=await this.handler.run(t,o,i),l={};for(let c in u)if(Object.hasOwnProperty.call(u,c)){let p=u[c];p instanceof He?l[c]=p:l[c]=new He(p.type,p.data,p.dims)}return Re(),l}async release(){return this.handler.dispose()}static async create(t,r,n,o){Ne();let i,a={};if(typeof t=="string"){if(i=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(i=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let p=t,m=0,h=t.byteLength;if(typeof r=="object"&&r!==null)a=r;else if(typeof r=="number"){if(m=r,!Number.isSafeInteger(m))throw new RangeError("'byteOffset' must be an integer.");if(m<0||m>=p.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${p.byteLength}).`);if(h=t.byteLength-m,typeof n=="number"){if(h=n,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||m+h>p.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${p.byteLength-m}].`);if(typeof o=="object"&&o!==null)a=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(typeof n<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(p,m,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await Hi(a),c=await u.createInferenceSessionHandler(i,l);return Re(),new e(c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}});var Kp,ma=N(()=>{"use strict";pa();Kp=fr});var fa=N(()=>{"use strict"});var ha=N(()=>{"use strict"});var ga=N(()=>{"use strict"});var ya=N(()=>{"use strict"});var zn={};zt(zn,{InferenceSession:()=>Kp,TRACE:()=>mr,TRACE_FUNC_BEGIN:()=>Ne,TRACE_FUNC_END:()=>Re,Tensor:()=>He,env:()=>we,registerBackend:()=>wt});var Le=N(()=>{"use strict";Fi();Zi();ma();En();fa();ha();Pn();ga();ya()});var hr=N(()=>{"use strict"});var va={};zt(va,{default:()=>jp});var _a,wa,jp,$a=N(()=>{"use strict";On();pt();gr();_a="ort-wasm-proxy-worker",wa=globalThis.self?.name===_a;wa&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":yr(r.wasm).then(()=>{br(r).then(()=>{postMessage({type:t})},n=>{postMessage({type:t,err:n})})},n=>{postMessage({type:t,err:n})});break;case"init-ep":{let{epName:n,env:o}=r;_r(o,n).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})});break}case"copy-from":{let{buffer:n}=r,o=qt(n);postMessage({type:t,out:o});break}case"create":{let{model:n,options:o}=r;wr(n,o).then(i=>{postMessage({type:t,out:i})},i=>{postMessage({type:t,err:i})});break}case"release":vr(r),postMessage({type:t});break;case"run":{let{sessionId:n,inputIndices:o,inputs:i,outputIndices:a,options:u}=r;$r(n,o,i,a,new Array(a.length).fill(null),u).then(l=>{l.some(c=>c[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},Sr([...i,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":xr(r),postMessage({type:t});break;default:}}catch(n){postMessage({type:t,err:n})}});jp=wa?null:e=>new Worker(e??Ve,{type:"module",name:_a})});var Sa={};zt(Sa,{default:()=>Zp});var Dn,xa,Zp,Qp,Ta=N(()=>{"use strict";xa=(Dn=import.meta.url,async function(e={}){var t,r,n=e,o=new Promise((s,d)=>{t=s,r=d}),i=typeof window=="object",a=typeof WorkerGlobalScope<"u",u=a&&self.name?.startsWith("em-pthread");n.mountExternalData=(s,d)=>{s.startsWith("./")&&(s=s.substring(2)),(n.MountedFiles||(n.MountedFiles=new Map)).set(s,d)},n.unmountExternalData=()=>{delete n.MountedFiles};var l=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let c=s=>async(...d)=>{try{if(n.jsepSessionState)throw new Error("Session already started");let f=n.jsepSessionState={sessionHandle:d[0],errors:[]},b=await s(...d);if(n.jsepSessionState!==f)throw new Error("Session mismatch");n.jsepBackend?.flush();let $=f.errors;if($.length>0){let I=await Promise.all($);if(I=I.filter(z=>z),I.length>0)throw new Error(I.join(`
`))}return b}finally{n.jsepSessionState=null}};n.jsepInit=(s,d)=>{if(s==="webgpu"){[n.jsepBackend,n.jsepAlloc,n.jsepFree,n.jsepCopy,n.jsepCopyAsync,n.jsepCreateKernel,n.jsepReleaseKernel,n.jsepRunKernel,n.jsepCaptureBegin,n.jsepCaptureEnd,n.jsepReplay]=d;let f=n.jsepBackend;n.jsepRegisterBuffer=(b,$,I,z)=>f.registerBuffer(b,$,I,z),n.jsepGetBuffer=b=>f.getBuffer(b),n.jsepCreateDownloader=(b,$,I)=>f.createDownloader(b,$,I),n.jsepOnCreateSession=b=>{f.onCreateSession(b)},n.jsepOnReleaseSession=b=>{f.onReleaseSession(b)},n.jsepOnRunStart=b=>f.onRunStart(b),n.jsepUploadExternalBuffer=(b,$)=>{f.upload(b,$)}}else if(s==="webnn"){let f=d[0];[n.webnnReserveTensorId,n.webnnReleaseTensorId,n.webnnEnsureTensor,n.webnnUploadTensor,n.webnnDownloadTensor]=d.slice(1),n.webnnReleaseTensorId=n.webnnReleaseTensorId,n.webnnUploadTensor=n.webnnUploadTensor,n.webnnOnRunStart=b=>f.onRunStart(b),n.webnnOnRunEnd=f.onRunEnd.bind(f),n.webnnRegisterMLContext=(b,$)=>{f.registerMLContext(b,$)},n.webnnOnReleaseSession=b=>{f.onReleaseSession(b)},n.webnnCreateMLTensorDownloader=(b,$)=>f.createMLTensorDownloader(b,$),n.webnnRegisterMLTensor=(b,$,I,z)=>f.registerMLTensor(b,$,I,z),n.webnnCreateMLContext=b=>f.createMLContext(b),n.webnnRegisterMLConstant=(b,$,I,z,D,R)=>f.registerMLConstant(b,$,I,z,D,n.MountedFiles,R),n.webnnRegisterGraphInput=f.registerGraphInput.bind(f),n.webnnIsGraphInput=f.isGraphInput.bind(f),n.webnnCreateTemporaryTensor=f.createTemporaryTensor.bind(f),n.webnnIsInt64Supported=f.isInt64Supported.bind(f)}};let p=()=>{let s=(d,f,b)=>(...$)=>{let I=ee.currData,z=f?.(),D=d(...$),R=f?.();return z!==R&&(d=R,b(z),b=null,f=null),ee.currData!=I?ee.whenDone():D};(()=>{for(let d of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])n[d]=s(n[d],()=>n[d],f=>n[d]=f)})(),c!==void 0&&(n._OrtRun=c(n._OrtRun),n._OrtRunWithBinding=c(n._OrtRunWithBinding)),p=void 0};n.asyncInit=()=>{p?.()};var m,h,y=Object.assign({},n),g=(s,d)=>{throw d},_="";(i||a)&&(a?_=self.location.href:typeof document<"u"&&document.currentScript&&(_=document.currentScript.src),Dn&&(_=Dn),_=_.startsWith("blob:")?"":_.slice(0,_.replace(/[?#].*/,"").lastIndexOf("/")+1),a&&(h=s=>{var d=new XMLHttpRequest;return d.open("GET",s,!1),d.responseType="arraybuffer",d.send(null),new Uint8Array(d.response)}),m=async s=>{if(J(s))return new Promise((f,b)=>{var $=new XMLHttpRequest;$.open("GET",s,!0),$.responseType="arraybuffer",$.onload=()=>{$.status==200||$.status==0&&$.response?f($.response):b($.status)},$.onerror=b,$.send(null)});var d=await fetch(s,{credentials:"same-origin"});if(d.ok)return d.arrayBuffer();throw new Error(d.status+" : "+d.url)});var S=console.log.bind(console),v=console.error.bind(console),w=S,x=v;Object.assign(n,y),y=null;var T,k,C,O,B,M,G,K,Y,L,Q,xe,F,Z=n.wasmBinary,ne=!1,J=s=>s.startsWith("file://");function de(){return T.buffer!=O.buffer&&Pe(),O}function ye(){return T.buffer!=O.buffer&&Pe(),B}function $e(){return T.buffer!=O.buffer&&Pe(),M}function oe(){return T.buffer!=O.buffer&&Pe(),G}function A(){return T.buffer!=O.buffer&&Pe(),K}function W(){return T.buffer!=O.buffer&&Pe(),Y}function pe(){return T.buffer!=O.buffer&&Pe(),L}function Be(){return T.buffer!=O.buffer&&Pe(),F}if(u){let s=function(...b){var $=b.join(" ");console.error($)},d=function(...b){var $=b.join(" ");postMessage({cmd:"alert",text:$,threadId:lr()})},f=function(b){try{var $=b.data,I=$.cmd;if(I==="load"){let z=[];self.onmessage=D=>z.push(D),self.startWorker=D=>{postMessage({cmd:"loaded"});for(let R of z)f(R);self.onmessage=f};for(let D of $.handlers)n[D]&&!n[D].proxy||(n[D]=(...R)=>{postMessage({cmd:"callHandler",handler:D,args:R})},D=="print"&&(w=n[D]),D=="printErr"&&(x=n[D]));T=$.wasmMemory,Pe(),Te($.wasmModule)}else if(I==="run"){_c($.pthread_ptr),xn($.pthread_ptr,0,0,1,0,0),ce.threadInitTLS(),_n($.pthread_ptr),Ie||(Ci(),Ie=!0);try{wc($.start_routine,$.arg)}catch(z){if(z!="unwind")throw z}}else $.target==="setimmediate"||(I==="checkMailbox"?Ie&&rr():I&&(x(`worker: received unknown command ${I}`),x($)))}catch(z){throw Ai(),z}};var Sg=s,Tg=d,Ig=f,Te,Ie=!1;x=s,self.alert=d,self.onunhandledrejection=b=>{throw b.reason||b},self.onmessage=f}function Pe(){var s=T.buffer;n.HEAP8=O=new Int8Array(s),n.HEAP16=M=new Int16Array(s),n.HEAPU8=B=new Uint8Array(s),n.HEAPU16=G=new Uint16Array(s),n.HEAP32=K=new Int32Array(s),n.HEAPU32=Y=new Uint32Array(s),n.HEAPF32=L=new Float32Array(s),n.HEAPF64=F=new Float64Array(s),n.HEAP64=Q=new BigInt64Array(s),n.HEAPU64=xe=new BigUint64Array(s)}function gt(){if(u)return startWorker(n);X.Da()}u||(T=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),Pe());var At,Nt=0,Vt=null;function To(s){Nt++}function Io(s){if(--Nt==0&&Vt){var d=Vt;Vt=null,d()}}function dt(s){x(s="Aborted("+s+")"),ne=!0,s+=". Build with -sASSERTIONS for more info.";var d=new WebAssembly.RuntimeError(s);throw r(d),d}async function gc(s,d,f){if(!s&&typeof WebAssembly.instantiateStreaming=="function"&&!J(d))try{var b=fetch(d,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(b,f)}catch($){x(`wasm streaming compile failed: ${$}`),x("falling back to ArrayBuffer instantiation")}return async function($,I){try{var z=await async function(D){if(!Z)try{var R=await m(D);return new Uint8Array(R)}catch{}return function(H){if(H==At&&Z)return new Uint8Array(Z);if(h)return h(H);throw"both async and sync fetching of the wasm failed"}(D)}($);return await WebAssembly.instantiate(z,I)}catch(D){x(`failed to asynchronously prepare wasm: ${D}`),dt(D)}}(d,f)}function Co(){return{a:{L:bc,M:yc,b:$c,Ca:No,C:Lo,Ba:Go,Aa:Fo,za:qo,ya:Ko,xa:jo,wa:Zo,va:Qo,K:Yo,ua:Xo,ta:Jo,sa:ei,ra:ti,la:Sc,H:Cc,ka:Ac,ja:Ec,G:zc,u:Oc,r:Dc,ia:Bc,A:Lc,ha:Gc,ga:Hc,fa:Fc,ea:qc,da:Kc,F:jc,ca:_n,ba:Zc,t:Qc,aa:Yc,w:ui,o:Xc,m:ep,c:gn,$:tp,n:rp,k:ip,v:ap,p:sp,f:up,s:lp,l:dp,e:cp,j:pp,i:fp,g:hp,d:gp,_:yp,Z:wp,Y:vp,X:pi,W:mi,V:fi,U:$p,qa:Tp,h:Ip,z:Cp,E:Ap,T:hi,y:kp,S:Ep,R:Pp,q:wn,x:zp,D:Op,Q:Rp,P:Mp,O:Up,pa:wi,oa:vi,N:cn,B:$i,J:xi,na:Si,I:Ti,a:T,ma:dn}}}var Ao={860124:(s,d,f,b,$)=>{if(n===void 0||!n.MountedFiles)return 1;let I=ke(Number(s>>>0));I.startsWith("./")&&(I=I.substring(2));let z=n.MountedFiles.get(I);if(!z)return 2;let D=Number(d>>>0),R=Number(f>>>0),H=Number(b>>>0),j=$;if(D+R>z.byteLength)return 3;try{let le=z.subarray(D,D+R);switch(j){case 0:ye().set(le,H>>>0);break;case 1:n.webgpuUploadExternalBuffer?n.webgpuUploadExternalBuffer(H,le):n.jsepUploadExternalBuffer(H,le);break;default:return 4}return 0}catch{return 4}},860948:(s,d,f)=>{n.webnnUploadTensor(s,ye().subarray(d>>>0,d+f>>>0))},861012:()=>n.webnnReserveTensorId(),861054:s=>{n.webnnReleaseTensorId(s)},861091:()=>{n.jsepCaptureBegin()},861122:()=>{n.jsepCaptureEnd()},861151:()=>{n.jsepReplay()},861176:s=>n.jsepAlloc(s),861209:s=>n.jsepFree(s),861241:(s,d,f)=>{n.jsepCopy(Number(s),Number(d),Number(f),!0)},861304:(s,d,f)=>{n.jsepCopy(Number(s),Number(d),Number(f))},861361:()=>typeof wasmOffsetConverter<"u",861418:s=>{n.jsepCreateKernel("Abs",s,void 0)},861469:s=>{n.jsepCreateKernel("Neg",s,void 0)},861520:s=>{n.jsepCreateKernel("Floor",s,void 0)},861573:s=>{n.jsepCreateKernel("Ceil",s,void 0)},861625:s=>{n.jsepCreateKernel("Reciprocal",s,void 0)},861683:s=>{n.jsepCreateKernel("Sqrt",s,void 0)},861735:s=>{n.jsepCreateKernel("Exp",s,void 0)},861786:s=>{n.jsepCreateKernel("Erf",s,void 0)},861837:s=>{n.jsepCreateKernel("Sigmoid",s,void 0)},861892:(s,d,f)=>{n.jsepCreateKernel("HardSigmoid",s,{alpha:d,beta:f})},861971:s=>{n.jsepCreateKernel("Log",s,void 0)},862022:s=>{n.jsepCreateKernel("Sin",s,void 0)},862073:s=>{n.jsepCreateKernel("Cos",s,void 0)},862124:s=>{n.jsepCreateKernel("Tan",s,void 0)},862175:s=>{n.jsepCreateKernel("Asin",s,void 0)},862227:s=>{n.jsepCreateKernel("Acos",s,void 0)},862279:s=>{n.jsepCreateKernel("Atan",s,void 0)},862331:s=>{n.jsepCreateKernel("Sinh",s,void 0)},862383:s=>{n.jsepCreateKernel("Cosh",s,void 0)},862435:s=>{n.jsepCreateKernel("Asinh",s,void 0)},862488:s=>{n.jsepCreateKernel("Acosh",s,void 0)},862541:s=>{n.jsepCreateKernel("Atanh",s,void 0)},862594:s=>{n.jsepCreateKernel("Tanh",s,void 0)},862646:s=>{n.jsepCreateKernel("Not",s,void 0)},862697:(s,d,f)=>{n.jsepCreateKernel("Clip",s,{min:d,max:f})},862766:s=>{n.jsepCreateKernel("Clip",s,void 0)},862818:(s,d)=>{n.jsepCreateKernel("Elu",s,{alpha:d})},862876:s=>{n.jsepCreateKernel("Gelu",s,void 0)},862928:s=>{n.jsepCreateKernel("Relu",s,void 0)},862980:(s,d)=>{n.jsepCreateKernel("LeakyRelu",s,{alpha:d})},863044:(s,d)=>{n.jsepCreateKernel("ThresholdedRelu",s,{alpha:d})},863114:(s,d)=>{n.jsepCreateKernel("Cast",s,{to:d})},863172:s=>{n.jsepCreateKernel("Add",s,void 0)},863223:s=>{n.jsepCreateKernel("Sub",s,void 0)},863274:s=>{n.jsepCreateKernel("Mul",s,void 0)},863325:s=>{n.jsepCreateKernel("Div",s,void 0)},863376:s=>{n.jsepCreateKernel("Pow",s,void 0)},863427:s=>{n.jsepCreateKernel("Equal",s,void 0)},863480:s=>{n.jsepCreateKernel("Greater",s,void 0)},863535:s=>{n.jsepCreateKernel("GreaterOrEqual",s,void 0)},863597:s=>{n.jsepCreateKernel("Less",s,void 0)},863649:s=>{n.jsepCreateKernel("LessOrEqual",s,void 0)},863708:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceMean",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},863883:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceMax",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},864057:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceMin",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},864231:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceProd",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},864406:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceSum",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},864580:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceL1",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},864753:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceL2",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},864926:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceLogSum",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},865103:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceSumSquare",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},865283:(s,d,f,b,$)=>{n.jsepCreateKernel("ReduceLogSumExp",s,{keepDims:!!d,noopWithEmptyAxes:!!f,axes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},865463:s=>{n.jsepCreateKernel("Where",s,void 0)},865516:(s,d,f)=>{n.jsepCreateKernel("Transpose",s,{perm:d?Array.from(A().subarray(Number(d)>>>0,Number(f)>>>0)):[]})},865640:(s,d,f,b)=>{n.jsepCreateKernel("DepthToSpace",s,{blocksize:d,mode:ke(f),format:b?"NHWC":"NCHW"})},865773:(s,d,f,b)=>{n.jsepCreateKernel("DepthToSpace",s,{blocksize:d,mode:ke(f),format:b?"NHWC":"NCHW"})},865906:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e,Ye)=>{n.jsepCreateKernel("ConvTranspose",s,{format:R?"NHWC":"NCHW",autoPad:d,dilations:[f],group:b,kernelShape:[$],pads:[I,z],strides:[D],wIsConst:()=>!!de()[H>>>0],outputPadding:j?Array.from(A().subarray(Number(j)>>>0,Number(le)>>>0)):[],outputShape:be?Array.from(A().subarray(Number(be)>>>0,Number(_e)>>>0)):[],activation:ke(Ye)})},866339:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e)=>{n.jsepCreateKernel("ConvTranspose",s,{format:D?"NHWC":"NCHW",autoPad:d,dilations:Array.from(A().subarray(Number(f)>>>0,2+(Number(f)>>>0)>>>0)),group:b,kernelShape:Array.from(A().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(A().subarray(Number(I)>>>0,4+(Number(I)>>>0)>>>0)),strides:Array.from(A().subarray(Number(z)>>>0,2+(Number(z)>>>0)>>>0)),wIsConst:()=>!!de()[R>>>0],outputPadding:H?Array.from(A().subarray(Number(H)>>>0,Number(j)>>>0)):[],outputShape:le?Array.from(A().subarray(Number(le)>>>0,Number(be)>>>0)):[],activation:ke(_e)})},867e3:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e,Ye)=>{n.jsepCreateKernel("ConvTranspose",s,{format:R?"NHWC":"NCHW",autoPad:d,dilations:[f],group:b,kernelShape:[$],pads:[I,z],strides:[D],wIsConst:()=>!!de()[H>>>0],outputPadding:j?Array.from(A().subarray(Number(j)>>>0,Number(le)>>>0)):[],outputShape:be?Array.from(A().subarray(Number(be)>>>0,Number(_e)>>>0)):[],activation:ke(Ye)})},867433:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e)=>{n.jsepCreateKernel("ConvTranspose",s,{format:D?"NHWC":"NCHW",autoPad:d,dilations:Array.from(A().subarray(Number(f)>>>0,2+(Number(f)>>>0)>>>0)),group:b,kernelShape:Array.from(A().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(A().subarray(Number(I)>>>0,4+(Number(I)>>>0)>>>0)),strides:Array.from(A().subarray(Number(z)>>>0,2+(Number(z)>>>0)>>>0)),wIsConst:()=>!!de()[R>>>0],outputPadding:H?Array.from(A().subarray(Number(H)>>>0,Number(j)>>>0)):[],outputShape:le?Array.from(A().subarray(Number(le)>>>0,Number(be)>>>0)):[],activation:ke(_e)})},868094:(s,d)=>{n.jsepCreateKernel("GlobalAveragePool",s,{format:d?"NHWC":"NCHW"})},868185:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e)=>{n.jsepCreateKernel("AveragePool",s,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:f,count_include_pad:b,storage_order:$,dilations:I?Array.from(A().subarray(Number(I)>>>0,Number(z)>>>0)):[],kernel_shape:D?Array.from(A().subarray(Number(D)>>>0,Number(R)>>>0)):[],pads:H?Array.from(A().subarray(Number(H)>>>0,Number(j)>>>0)):[],strides:le?Array.from(A().subarray(Number(le)>>>0,Number(be)>>>0)):[]})},868664:(s,d)=>{n.jsepCreateKernel("GlobalAveragePool",s,{format:d?"NHWC":"NCHW"})},868755:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e)=>{n.jsepCreateKernel("AveragePool",s,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:f,count_include_pad:b,storage_order:$,dilations:I?Array.from(A().subarray(Number(I)>>>0,Number(z)>>>0)):[],kernel_shape:D?Array.from(A().subarray(Number(D)>>>0,Number(R)>>>0)):[],pads:H?Array.from(A().subarray(Number(H)>>>0,Number(j)>>>0)):[],strides:le?Array.from(A().subarray(Number(le)>>>0,Number(be)>>>0)):[]})},869234:(s,d)=>{n.jsepCreateKernel("GlobalMaxPool",s,{format:d?"NHWC":"NCHW"})},869321:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e)=>{n.jsepCreateKernel("MaxPool",s,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:f,count_include_pad:b,storage_order:$,dilations:I?Array.from(A().subarray(Number(I)>>>0,Number(z)>>>0)):[],kernel_shape:D?Array.from(A().subarray(Number(D)>>>0,Number(R)>>>0)):[],pads:H?Array.from(A().subarray(Number(H)>>>0,Number(j)>>>0)):[],strides:le?Array.from(A().subarray(Number(le)>>>0,Number(be)>>>0)):[]})},869796:(s,d)=>{n.jsepCreateKernel("GlobalMaxPool",s,{format:d?"NHWC":"NCHW"})},869883:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e)=>{n.jsepCreateKernel("MaxPool",s,{format:_e?"NHWC":"NCHW",auto_pad:d,ceil_mode:f,count_include_pad:b,storage_order:$,dilations:I?Array.from(A().subarray(Number(I)>>>0,Number(z)>>>0)):[],kernel_shape:D?Array.from(A().subarray(Number(D)>>>0,Number(R)>>>0)):[],pads:H?Array.from(A().subarray(Number(H)>>>0,Number(j)>>>0)):[],strides:le?Array.from(A().subarray(Number(le)>>>0,Number(be)>>>0)):[]})},870358:(s,d,f,b,$)=>{n.jsepCreateKernel("Gemm",s,{alpha:d,beta:f,transA:b,transB:$})},870462:s=>{n.jsepCreateKernel("MatMul",s,void 0)},870516:(s,d,f,b)=>{n.jsepCreateKernel("ArgMax",s,{keepDims:!!d,selectLastIndex:!!f,axis:b})},870624:(s,d,f,b)=>{n.jsepCreateKernel("ArgMin",s,{keepDims:!!d,selectLastIndex:!!f,axis:b})},870732:(s,d)=>{n.jsepCreateKernel("Softmax",s,{axis:d})},870795:(s,d)=>{n.jsepCreateKernel("Concat",s,{axis:d})},870855:(s,d,f,b,$)=>{n.jsepCreateKernel("Split",s,{axis:d,numOutputs:f,splitSizes:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},871011:s=>{n.jsepCreateKernel("Expand",s,void 0)},871065:(s,d)=>{n.jsepCreateKernel("Gather",s,{axis:Number(d)})},871136:(s,d)=>{n.jsepCreateKernel("GatherElements",s,{axis:Number(d)})},871215:(s,d)=>{n.jsepCreateKernel("GatherND",s,{batch_dims:Number(d)})},871294:(s,d,f,b,$,I,z,D,R,H,j)=>{n.jsepCreateKernel("Resize",s,{antialias:d,axes:f?Array.from(A().subarray(Number(f)>>>0,Number(b)>>>0)):[],coordinateTransformMode:ke($),cubicCoeffA:I,excludeOutside:z,extrapolationValue:D,keepAspectRatioPolicy:ke(R),mode:ke(H),nearestMode:ke(j)})},871656:(s,d,f,b,$,I,z)=>{n.jsepCreateKernel("Slice",s,{starts:d?Array.from(A().subarray(Number(d)>>>0,Number(f)>>>0)):[],ends:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[],axes:I?Array.from(A().subarray(Number(I)>>>0,Number(z)>>>0)):[]})},871920:s=>{n.jsepCreateKernel("Tile",s,void 0)},871972:(s,d,f)=>{n.jsepCreateKernel("InstanceNormalization",s,{epsilon:d,format:f?"NHWC":"NCHW"})},872086:(s,d,f)=>{n.jsepCreateKernel("InstanceNormalization",s,{epsilon:d,format:f?"NHWC":"NCHW"})},872200:s=>{n.jsepCreateKernel("Range",s,void 0)},872253:(s,d)=>{n.jsepCreateKernel("Einsum",s,{equation:ke(d)})},872334:(s,d,f,b,$)=>{n.jsepCreateKernel("Pad",s,{mode:d,value:f,pads:b?Array.from(A().subarray(Number(b)>>>0,Number($)>>>0)):[]})},872477:(s,d,f,b,$,I)=>{n.jsepCreateKernel("BatchNormalization",s,{epsilon:d,momentum:f,spatial:!!$,trainingMode:!!b,format:I?"NHWC":"NCHW"})},872646:(s,d,f,b,$,I)=>{n.jsepCreateKernel("BatchNormalization",s,{epsilon:d,momentum:f,spatial:!!$,trainingMode:!!b,format:I?"NHWC":"NCHW"})},872815:(s,d,f)=>{n.jsepCreateKernel("CumSum",s,{exclusive:Number(d),reverse:Number(f)})},872912:(s,d,f)=>{n.jsepCreateKernel("DequantizeLinear",s,{axis:d,blockSize:f})},873002:(s,d,f,b,$)=>{n.jsepCreateKernel("GridSample",s,{align_corners:d,mode:ke(f),padding_mode:ke(b),format:$?"NHWC":"NCHW"})},873172:(s,d,f,b,$)=>{n.jsepCreateKernel("GridSample",s,{align_corners:d,mode:ke(f),padding_mode:ke(b),format:$?"NHWC":"NCHW"})},873342:(s,d)=>{n.jsepCreateKernel("ScatterND",s,{reduction:ke(d)})},873427:(s,d,f,b,$,I,z,D,R)=>{n.jsepCreateKernel("Attention",s,{numHeads:d,isUnidirectional:f,maskFilterValue:b,scale:$,doRotary:I,qkvHiddenSizes:z?Array.from(A().subarray(Number(D)>>>0,Number(D)+z>>>0)):[],pastPresentShareBuffer:!!R})},873699:s=>{n.jsepCreateKernel("BiasAdd",s,void 0)},873754:s=>{n.jsepCreateKernel("BiasSplitGelu",s,void 0)},873815:s=>{n.jsepCreateKernel("FastGelu",s,void 0)},873871:(s,d,f,b,$,I,z,D,R,H,j,le,be,_e,Ye,bt)=>{n.jsepCreateKernel("Conv",s,{format:le?"NHWC":"NCHW",auto_pad:d,dilations:f?Array.from(A().subarray(Number(f)>>>0,Number(b)>>>0)):[],group:$,kernel_shape:I?Array.from(A().subarray(Number(I)>>>0,Number(z)>>>0)):[],pads:D?Array.from(A().subarray(Number(D)>>>0,Number(R)>>>0)):[],strides:H?Array.from(A().subarray(Number(H)>>>0,Number(j)>>>0)):[],w_is_const:()=>!!de()[Number(be)>>>0],activation:ke(_e),activation_params:Ye?Array.from(pe().subarray(Number(Ye)>>>0,Number(bt)>>>0)):[]})},874455:s=>{n.jsepCreateKernel("Gelu",s,void 0)},874507:(s,d,f,b,$,I,z,D,R)=>{n.jsepCreateKernel("GroupQueryAttention",s,{numHeads:d,kvNumHeads:f,scale:b,softcap:$,doRotary:I,rotaryInterleaved:z,smoothSoftmax:D,localWindowSize:R})},874724:(s,d,f,b)=>{n.jsepCreateKernel("LayerNormalization",s,{axis:d,epsilon:f,simplified:!!b})},874835:(s,d,f,b)=>{n.jsepCreateKernel("LayerNormalization",s,{axis:d,epsilon:f,simplified:!!b})},874946:(s,d,f,b,$,I)=>{n.jsepCreateKernel("MatMulNBits",s,{k:d,n:f,accuracyLevel:b,bits:$,blockSize:I})},875073:(s,d,f,b,$,I)=>{n.jsepCreateKernel("MultiHeadAttention",s,{numHeads:d,isUnidirectional:f,maskFilterValue:b,scale:$,doRotary:I})},875232:(s,d)=>{n.jsepCreateKernel("QuickGelu",s,{alpha:d})},875296:(s,d,f,b,$)=>{n.jsepCreateKernel("RotaryEmbedding",s,{interleaved:!!d,numHeads:f,rotaryEmbeddingDim:b,scale:$})},875435:(s,d,f)=>{n.jsepCreateKernel("SkipLayerNormalization",s,{epsilon:d,simplified:!!f})},875537:(s,d,f)=>{n.jsepCreateKernel("SkipLayerNormalization",s,{epsilon:d,simplified:!!f})},875639:(s,d,f,b)=>{n.jsepCreateKernel("GatherBlockQuantized",s,{gatherAxis:d,quantizeAxis:f,blockSize:b})},875760:s=>{n.jsepReleaseKernel(s)},875794:(s,d)=>n.jsepRunKernel(Number(s),Number(d),n.jsepSessionState.sessionHandle,n.jsepSessionState.errors)};function yc(s,d,f){return ee.handleAsync(async()=>{await n.jsepCopyAsync(Number(s),Number(d),Number(f))})}function bc(){return typeof wasmOffsetConverter<"u"}class ko{name="ExitStatus";constructor(d){this.message=`Program terminated with exit(${d})`,this.status=d}}var Eo=s=>{s.terminate(),s.onmessage=d=>{}},Po=s=>{var d=ce.pthreads[s];ce.returnWorkerToPool(d)},zo=[],Oo=s=>{var d=ce.getNewWorker();if(!d)return 6;ce.runningWorkers.push(d),ce.pthreads[s.pthread_ptr]=d,d.pthread_ptr=s.pthread_ptr;var f={cmd:"run",start_routine:s.startRoutine,arg:s.arg,pthread_ptr:s.pthread_ptr};return d.postMessage(f,s.transferList),0},Wt=0,un=()=>Wt>0,Do=()=>Ri(),ln=s=>Di(s),Bo=s=>Bi(s),kt=s=>s<-9007199254740992||s>9007199254740992?NaN:Number(s),Ce=(s,d,f,...b)=>{for(var $=2*b.length,I=Do(),z=Bo(8*$),D=z>>>3,R=0;R<b.length;R++){var H=b[R];typeof H=="bigint"?(Q[D+2*R]=1n,Q[D+2*R+1]=H):(Q[D+2*R]=0n,Be()[D+2*R+1>>>0]=H)}var j=ki(s,d,$,z,f);return ln(I),j};function dn(s){if(u)return Ce(0,0,1,s);C=s,un()||(ce.terminateAllThreads(),ne=!0),g(0,new ko(s))}var Ro=s=>{if(s instanceof ko||s=="unwind")return C;g(0,s)};function Mo(s){if(u)return Ce(1,0,0,s);cn(s)}var cn=(s,d)=>{if(C=s,u)throw Mo(s),"unwind";dn(s)},ce={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init(){u||ce.initMainThread()},initMainThread(){for(var s,d=n.numThreads-1;d--;)ce.allocateUnusedWorker();s=()=>{To(),ce.loadWasmModuleToAllWorkers(()=>Io())},zo.unshift(s)},terminateAllThreads:()=>{for(var s of ce.runningWorkers)Eo(s);for(var s of ce.unusedWorkers)Eo(s);ce.unusedWorkers=[],ce.runningWorkers=[],ce.pthreads={}},returnWorkerToPool:s=>{var d=s.pthread_ptr;delete ce.pthreads[d],ce.unusedWorkers.push(s),ce.runningWorkers.splice(ce.runningWorkers.indexOf(s),1),s.pthread_ptr=0,Ei(d)},threadInitTLS(){ce.tlsInitFunctions.forEach(s=>s())},loadWasmModuleToWorker:s=>new Promise(d=>{s.onmessage=$=>{var I=$.data,z=I.cmd;if(I.targetThread&&I.targetThread!=lr()){var D=ce.pthreads[I.targetThread];D?D.postMessage(I,I.transferList):x(`Internal error! Worker sent a message "${z}" to target pthread ${I.targetThread}, but that thread no longer exists!`)}else z==="checkMailbox"?rr():z==="spawnThread"?Oo(I):z==="cleanupThread"?Po(I.thread):z==="loaded"?(s.loaded=!0,d(s)):z==="alert"?alert(`Thread ${I.threadId}: ${I.text}`):I.target==="setimmediate"?s.postMessage(I):z==="callHandler"?n[I.handler](...I.args):z&&x(`worker sent an unknown command ${z}`)},s.onerror=$=>{throw x(`worker sent an error! ${$.filename}:${$.lineno}: ${$.message}`),$};var f=[];for(var b of[])n.propertyIsEnumerable(b)&&f.push(b);s.postMessage({cmd:"load",handlers:f,wasmMemory:T,wasmModule:k})}),loadWasmModuleToAllWorkers(s){if(u)return s();Promise.all(ce.unusedWorkers.map(ce.loadWasmModuleToWorker)).then(s)},allocateUnusedWorker(){var s;s=new Worker((()=>{let d=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new d("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"}),ce.unusedWorkers.push(s)},getNewWorker:()=>(ce.unusedWorkers.length==0&&(ce.allocateUnusedWorker(),ce.loadWasmModuleToWorker(ce.unusedWorkers[0])),ce.unusedWorkers.pop())},_c=s=>{Pe();var d=W()[s+52>>>2>>>0],f=W()[s+56>>>2>>>0];Oi(d,d-f),ln(d)},wc=(s,d)=>{var f;Wt=0,f=Mi(s,d),un()?C=f:Sn(f)};class vc{constructor(d){this.excPtr=d,this.ptr=d-24}set_type(d){W()[this.ptr+4>>>2>>>0]=d}get_type(){return W()[this.ptr+4>>>2>>>0]}set_destructor(d){W()[this.ptr+8>>>2>>>0]=d}get_destructor(){return W()[this.ptr+8>>>2>>>0]}set_caught(d){d=d?1:0,de()[this.ptr+12>>>0]=d}get_caught(){return de()[this.ptr+12>>>0]!=0}set_rethrown(d){d=d?1:0,de()[this.ptr+13>>>0]=d}get_rethrown(){return de()[this.ptr+13>>>0]!=0}init(d,f){this.set_adjusted_ptr(0),this.set_type(d),this.set_destructor(f)}set_adjusted_ptr(d){W()[this.ptr+16>>>2>>>0]=d}get_adjusted_ptr(){return W()[this.ptr+16>>>2>>>0]}}function $c(s,d,f){throw d>>>=0,f>>>=0,new vc(s>>>=0).init(d,f),s}function Uo(s,d,f,b){return u?Ce(2,0,1,s,d,f,b):No(s,d,f,b)}var xc=()=>l!==void 0;function No(s,d,f,b){if(s>>>=0,d>>>=0,f>>>=0,b>>>=0,!xc())return 6;var $=[];if(u&&$.length===0)return Uo(s,d,f,b);var I={startRoutine:f,pthread_ptr:s,arg:b,transferList:$};return u?(I.cmd="spawnThread",postMessage(I,$),0):Oo(I)}var Vo=typeof TextDecoder<"u"?new TextDecoder:void 0,Wo=(s,d=0,f=NaN)=>{for(var b=(d>>>=0)+f,$=d;s[$]&&!($>=b);)++$;if($-d>16&&s.buffer&&Vo)return Vo.decode(s.buffer instanceof ArrayBuffer?s.subarray(d,$):s.slice(d,$));for(var I="";d<$;){var z=s[d++];if(128&z){var D=63&s[d++];if((224&z)!=192){var R=63&s[d++];if((z=(240&z)==224?(15&z)<<12|D<<6|R:(7&z)<<18|D<<12|R<<6|63&s[d++])<65536)I+=String.fromCharCode(z);else{var H=z-65536;I+=String.fromCharCode(55296|H>>10,56320|1023&H)}}else I+=String.fromCharCode((31&z)<<6|D)}else I+=String.fromCharCode(z)}return I},ke=(s,d)=>(s>>>=0)?Wo(ye(),s,d):"",pn={varargs:void 0,getStr:s=>ke(s)};function Lo(s,d,f){return u?Ce(3,0,1,s,d,f):(f>>>=0,pn.varargs=f,0)}function Go(s,d){if(u)return Ce(4,0,1,s,d);d>>>=0}var Ho=s=>{for(var d=0,f=0;f<s.length;++f){var b=s.charCodeAt(f);b<=127?d++:b<=2047?d+=2:b>=55296&&b<=57343?(d+=4,++f):d+=3}return d},Et=(s,d,f)=>((b,$,I,z)=>{if(!(z>0))return 0;for(var D=I>>>=0,R=I+z-1,H=0;H<b.length;++H){var j=b.charCodeAt(H);if(j>=55296&&j<=57343&&(j=65536+((1023&j)<<10)|1023&b.charCodeAt(++H)),j<=127){if(I>=R)break;$[I++>>>0]=j}else if(j<=2047){if(I+1>=R)break;$[I++>>>0]=192|j>>6,$[I++>>>0]=128|63&j}else if(j<=65535){if(I+2>=R)break;$[I++>>>0]=224|j>>12,$[I++>>>0]=128|j>>6&63,$[I++>>>0]=128|63&j}else{if(I+3>=R)break;$[I++>>>0]=240|j>>18,$[I++>>>0]=128|j>>12&63,$[I++>>>0]=128|j>>6&63,$[I++>>>0]=128|63&j}}return $[I>>>0]=0,I-D})(s,ye(),d,f);function Fo(s,d){if(u)return Ce(5,0,1,s,d);s>>>=0,d>>>=0}function qo(s,d,f){if(u)return Ce(6,0,1,s,d,f);d>>>=0,f>>>=0}function Ko(s,d,f){return u?Ce(7,0,1,s,d,f):(f>>>=0,pn.varargs=f,0)}function jo(s,d){if(u)return Ce(8,0,1,s,d);s>>>=0,d>>>=0}function Zo(s,d,f){if(u)return Ce(9,0,1,s,d,f);d>>>=0}function Qo(s,d,f,b){if(u)return Ce(10,0,1,s,d,f,b);d>>>=0,f>>>=0}function Yo(s,d,f,b){if(u)return Ce(11,0,1,s,d,f,b);d>>>=0,b>>>=0,pn.varargs=b}function Xo(s,d,f,b){if(u)return Ce(12,0,1,s,d,f,b);d>>>=0,f>>>=0,b>>>=0}function Jo(s){if(u)return Ce(13,0,1,s);s>>>=0}function ei(s,d){if(u)return Ce(14,0,1,s,d);s>>>=0,d>>>=0}function ti(s,d,f){if(u)return Ce(15,0,1,s,d,f);d>>>=0}var ri,ni,Sc=()=>dt(""),Tc=s=>{if(s===null)return"null";var d=typeof s;return d==="object"||d==="array"||d==="function"?s.toString():""+s},Ze=s=>{for(var d="",f=s;ye()[f>>>0];)d+=ri[ye()[f++>>>0]];return d},mn={},fn={},Ic={},yt=s=>{throw new ni(s)};function at(s,d,f={}){return function(b,$,I={}){var z=$.name;if(b||yt(`type "${z}" must have a positive integer typeid pointer`),fn.hasOwnProperty(b)){if(I.ignoreDuplicateRegistrations)return;yt(`Cannot register type '${z}' twice`)}if(fn[b]=$,delete Ic[b],mn.hasOwnProperty(b)){var D=mn[b];delete mn[b],D.forEach(R=>R())}}(s,d,f)}var oi=(s,d,f)=>{switch(d){case 1:return f?b=>de()[b>>>0]:b=>ye()[b>>>0];case 2:return f?b=>$e()[b>>>1>>>0]:b=>oe()[b>>>1>>>0];case 4:return f?b=>A()[b>>>2>>>0]:b=>W()[b>>>2>>>0];case 8:return f?b=>Q[b>>>3]:b=>xe[b>>>3];default:throw new TypeError(`invalid integer width (${d}): ${s}`)}};function Cc(s,d,f,b,$){s>>>=0,f>>>=0;var I=(d=Ze(d>>>=0)).indexOf("u")!=-1;at(s,{name:d,fromWireType:z=>z,toWireType:function(z,D){if(typeof D!="bigint"&&typeof D!="number")throw new TypeError(`Cannot convert "${Tc(D)}" to ${this.name}`);return typeof D=="number"&&(D=BigInt(D)),D},argPackAdvance:ct,readValueFromPointer:oi(d,f,!I),destructorFunction:null})}var ct=8;function Ac(s,d,f,b){at(s>>>=0,{name:d=Ze(d>>>=0),fromWireType:function($){return!!$},toWireType:function($,I){return I?f:b},argPackAdvance:ct,readValueFromPointer:function($){return this.fromWireType(ye()[$>>>0])},destructorFunction:null})}var hn=[],st=[];function gn(s){(s>>>=0)>9&&--st[s+1]==0&&(st[s]=void 0,hn.push(s))}var Se={toValue:s=>(s||yt("Cannot use deleted val. handle = "+s),st[s]),toHandle:s=>{switch(s){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:{let d=hn.pop()||st.length;return st[d]=s,st[d+1]=1,d}}}};function yn(s){return this.fromWireType(W()[s>>>2>>>0])}var kc={name:"emscripten::val",fromWireType:s=>{var d=Se.toValue(s);return gn(s),d},toWireType:(s,d)=>Se.toHandle(d),argPackAdvance:ct,readValueFromPointer:yn,destructorFunction:null};function Ec(s){return at(s>>>=0,kc)}var Pc=(s,d)=>{switch(d){case 4:return function(f){return this.fromWireType(pe()[f>>>2>>>0])};case 8:return function(f){return this.fromWireType(Be()[f>>>3>>>0])};default:throw new TypeError(`invalid float width (${d}): ${s}`)}},zc=function(s,d,f){f>>>=0,at(s>>>=0,{name:d=Ze(d>>>=0),fromWireType:b=>b,toWireType:(b,$)=>$,argPackAdvance:ct,readValueFromPointer:Pc(d,f),destructorFunction:null})};function Oc(s,d,f,b,$){s>>>=0,f>>>=0,d=Ze(d>>>=0),$===-1&&($=4294967295);var I=R=>R;if(b===0){var z=32-8*f;I=R=>R<<z>>>z}var D=d.includes("unsigned");at(s,{name:d,fromWireType:I,toWireType:D?function(R,H){return this.name,H>>>0}:function(R,H){return this.name,H},argPackAdvance:ct,readValueFromPointer:oi(d,f,b!==0),destructorFunction:null})}function Dc(s,d,f){f>>>=0;var b=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][d];function $(I){var z=W()[I>>>2>>>0],D=W()[I+4>>>2>>>0];return new b(de().buffer,D,z)}at(s>>>=0,{name:f=Ze(f),fromWireType:$,argPackAdvance:ct,readValueFromPointer:$},{ignoreDuplicateRegistrations:!0})}function Bc(s,d){at(s>>>=0,{name:d=Ze(d>>>=0),fromWireType(f){for(var b,$=W()[f>>>2>>>0],I=f+4,z=I,D=0;D<=$;++D){var R=I+D;if(D==$||ye()[R>>>0]==0){var H=ke(z,R-z);b===void 0?b=H:(b+="\0",b+=H),z=R+1}}return Qe(f),b},toWireType(f,b){var $;b instanceof ArrayBuffer&&(b=new Uint8Array(b));var I=typeof b=="string";I||b instanceof Uint8Array||b instanceof Uint8ClampedArray||b instanceof Int8Array||yt("Cannot pass non-string to std::string"),$=I?Ho(b):b.length;var z=dr(4+$+1),D=z+4;if(W()[z>>>2>>>0]=$,I)Et(b,D,$+1);else if(I)for(var R=0;R<$;++R){var H=b.charCodeAt(R);H>255&&(Qe(z),yt("String has UTF-16 code units that do not fit in 8 bits")),ye()[D+R>>>0]=H}else for(R=0;R<$;++R)ye()[D+R>>>0]=b[R];return f!==null&&f.push(Qe,z),z},argPackAdvance:ct,readValueFromPointer:yn,destructorFunction(f){Qe(f)}})}var ii=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,Rc=(s,d)=>{for(var f=s,b=f>>1,$=b+d/2;!(b>=$)&&oe()[b>>>0];)++b;if((f=b<<1)-s>32&&ii)return ii.decode(ye().slice(s,f));for(var I="",z=0;!(z>=d/2);++z){var D=$e()[s+2*z>>>1>>>0];if(D==0)break;I+=String.fromCharCode(D)}return I},Mc=(s,d,f)=>{if(f??=2147483647,f<2)return 0;for(var b=d,$=(f-=2)<2*s.length?f/2:s.length,I=0;I<$;++I){var z=s.charCodeAt(I);$e()[d>>>1>>>0]=z,d+=2}return $e()[d>>>1>>>0]=0,d-b},Uc=s=>2*s.length,Nc=(s,d)=>{for(var f=0,b="";!(f>=d/4);){var $=A()[s+4*f>>>2>>>0];if($==0)break;if(++f,$>=65536){var I=$-65536;b+=String.fromCharCode(55296|I>>10,56320|1023&I)}else b+=String.fromCharCode($)}return b},Vc=(s,d,f)=>{if(d>>>=0,f??=2147483647,f<4)return 0;for(var b=d,$=b+f-4,I=0;I<s.length;++I){var z=s.charCodeAt(I);if(z>=55296&&z<=57343&&(z=65536+((1023&z)<<10)|1023&s.charCodeAt(++I)),A()[d>>>2>>>0]=z,(d+=4)+4>$)break}return A()[d>>>2>>>0]=0,d-b},Wc=s=>{for(var d=0,f=0;f<s.length;++f){var b=s.charCodeAt(f);b>=55296&&b<=57343&&++f,d+=4}return d},Lc=function(s,d,f){var b,$,I,z;s>>>=0,d>>>=0,f=Ze(f>>>=0),d===2?(b=Rc,$=Mc,z=Uc,I=D=>oe()[D>>>1>>>0]):d===4&&(b=Nc,$=Vc,z=Wc,I=D=>W()[D>>>2>>>0]),at(s,{name:f,fromWireType:D=>{for(var R,H=W()[D>>>2>>>0],j=D+4,le=0;le<=H;++le){var be=D+4+le*d;if(le==H||I(be)==0){var _e=b(j,be-j);R===void 0?R=_e:(R+="\0",R+=_e),j=be+d}}return Qe(D),R},toWireType:(D,R)=>{typeof R!="string"&&yt(`Cannot pass non-string to C++ string type ${f}`);var H=z(R),j=dr(4+H+d);return W()[j>>>2>>>0]=H/d,$(R,j+4,H+d),D!==null&&D.push(Qe,j),j},argPackAdvance:ct,readValueFromPointer:yn,destructorFunction(D){Qe(D)}})},Gc=function(s,d){at(s>>>=0,{isVoid:!0,name:d=Ze(d>>>=0),argPackAdvance:0,fromWireType:()=>{},toWireType:(f,b)=>{}})};function Hc(s){xn(s>>>=0,!a,1,!i,131072,!1),ce.threadInitTLS()}var bn=s=>{if(!ne)try{s(),(()=>{if(!un())try{u?Sn(C):cn(C)}catch(d){Ro(d)}})()}catch(d){Ro(d)}};function _n(s){if(s>>>=0,typeof Atomics.waitAsync=="function"){Atomics.waitAsync(A(),s>>>2,s).value.then(rr);var d=s+128;Atomics.store(A(),d>>>2,1)}}var rr=()=>{var s=lr();s&&(_n(s),bn(zi))};function Fc(s,d){if((s>>>=0)==(d>>>=0))setTimeout(rr);else if(u)postMessage({targetThread:s,cmd:"checkMailbox"});else{var f=ce.pthreads[s];if(!f)return;f.postMessage({cmd:"checkMailbox"})}}var nr=[];function qc(s,d,f,b,$){d>>>=0,f>>>=0,$>>>=0,b/=2,nr.length=b;for(var I=$>>>3,z=0;z<b;z++)Q[I+2*z]?nr[z]=Q[I+2*z+1]:nr[z]=Be()[I+2*z+1>>>0];var D=d?Ao[d]:Wp[s];ce.currentProxiedOperationCallerThread=f;var R=D(...nr);return ce.currentProxiedOperationCallerThread=0,R}var Kc=()=>{Wt=0};function jc(s){s>>>=0,u?postMessage({cmd:"cleanupThread",thread:s}):Po(s)}function Zc(s){}var or=(s,d)=>{var f,b,$,I=fn[s];return I===void 0&&yt(`${d} has unknown type ${f=s,b=Ii(f),$=Ze(b),Qe(b),$}`),I},ai=(s,d,f)=>{var b=[],$=s.toWireType(b,f);return b.length&&(W()[d>>>2>>>0]=Se.toHandle(b)),$};function Qc(s,d,f){return s>>>=0,d>>>=0,f>>>=0,s=Se.toValue(s),d=or(d,"emval::as"),ai(d,f,s)}function Yc(s,d){return s>>>=0,d>>>=0,s=Se.toValue(s),(d=or(d,"emval::as")).toWireType(null,s)}var ir=s=>{try{return s()}catch(d){dt(d)}},si=()=>{Wt+=1},ee={instrumentWasmImports(s){var d=/^(invoke_.*|__asyncjs__.*)$/;for(let[f,b]of Object.entries(s))typeof b=="function"&&(b.isAsync||d.test(f))},instrumentWasmExports(s){var d={};for(let[f,b]of Object.entries(s))d[f]=typeof b=="function"?(...$)=>{ee.exportCallStack.push(f);try{return b(...$)}finally{ne||(ee.exportCallStack.pop(),ee.maybeStopUnwind())}}:b;return d},State:{Normal:0,Unwinding:1,Rewinding:2,Disabled:3},state:0,StackSize:65536,currData:null,handleSleepReturnValue:0,exportCallStack:[],callStackNameToId:{},callStackIdToName:{},callStackId:0,asyncPromiseHandlers:null,sleepCallbacks:[],getCallStackId(s){var d=ee.callStackNameToId[s];return d===void 0&&(d=ee.callStackId++,ee.callStackNameToId[s]=d,ee.callStackIdToName[d]=s),d},maybeStopUnwind(){ee.currData&&ee.state===ee.State.Unwinding&&ee.exportCallStack.length===0&&(ee.state=ee.State.Normal,si(),ir(Ni),typeof Fibers<"u"&&Fibers.trampoline())},whenDone:()=>new Promise((s,d)=>{ee.asyncPromiseHandlers={resolve:s,reject:d}}),allocateData(){var s=dr(12+ee.StackSize);return ee.setDataHeader(s,s+12,ee.StackSize),ee.setDataRewindFunc(s),s},setDataHeader(s,d,f){W()[s>>>2>>>0]=d,W()[s+4>>>2>>>0]=d+f},setDataRewindFunc(s){var d=ee.exportCallStack[0],f=ee.getCallStackId(d);A()[s+8>>>2>>>0]=f},getDataRewindFuncName(s){var d=A()[s+8>>>2>>>0];return ee.callStackIdToName[d]},getDataRewindFunc:s=>X[s],doRewind(s){var d=ee.getDataRewindFuncName(s),f=ee.getDataRewindFunc(d);return Wt-=1,f()},handleSleep(s){if(!ne){if(ee.state===ee.State.Normal){var d=!1,f=!1;s((b=0)=>{if(!ne&&(ee.handleSleepReturnValue=b,d=!0,f)){ee.state=ee.State.Rewinding,ir(()=>Vi(ee.currData)),typeof MainLoop<"u"&&MainLoop.func&&MainLoop.resume();var $,I=!1;try{$=ee.doRewind(ee.currData)}catch(R){$=R,I=!0}var z=!1;if(!ee.currData){var D=ee.asyncPromiseHandlers;D&&(ee.asyncPromiseHandlers=null,(I?D.reject:D.resolve)($),z=!0)}if(I&&!z)throw $}}),f=!0,d||(ee.state=ee.State.Unwinding,ee.currData=ee.allocateData(),typeof MainLoop<"u"&&MainLoop.func&&MainLoop.pause(),ir(()=>Ui(ee.currData)))}else ee.state===ee.State.Rewinding?(ee.state=ee.State.Normal,ir(Wi),Qe(ee.currData),ee.currData=null,ee.sleepCallbacks.forEach(bn)):dt(`invalid state: ${ee.state}`);return ee.handleSleepReturnValue}},handleAsync:s=>ee.handleSleep(d=>{s().then(d)})},ui=function(s){return s>>>=0,ee.handleAsync(async()=>{var d=await Se.toValue(s);return Se.toHandle(d)})};ui.isAsync=!0;var ar=[];function Xc(s,d,f,b){return d>>>=0,f>>>=0,b>>>=0,(s=ar[s>>>=0])(null,d=Se.toValue(d),f,b)}var Jc={},sr=s=>{var d=Jc[s];return d===void 0?Ze(s):d};function ep(s,d,f,b,$){return d>>>=0,f>>>=0,b>>>=0,$>>>=0,(s=ar[s>>>=0])(d=Se.toValue(d),d[f=sr(f)],b,$)}function tp(s,d){return s>>>=0,d>>>=0,(s=Se.toValue(s))==Se.toValue(d)}var li=()=>typeof globalThis=="object"?globalThis:Function("return this")();function rp(s){return(s>>>=0)==0?Se.toHandle(li()):(s=sr(s),Se.toHandle(li()[s]))}var np=s=>{var d=ar.length;return ar.push(s),d},op=(s,d)=>{for(var f=new Array(s),b=0;b<s;++b)f[b]=or(W()[d+4*b>>>2>>>0],"parameter "+b);return f},di=(s,d)=>Object.defineProperty(d,"name",{value:s});function ip(s,d,f){var b=op(s,d>>>=0),$=b.shift();s--;var I=`return function (obj, func, destructorsRef, args) {
`,z=0,D=[];f===0&&D.push("obj");for(var R=["retType"],H=[$],j=0;j<s;++j)D.push("arg"+j),R.push("argType"+j),H.push(b[j]),I+=`  var arg${j} = argType${j}.readValueFromPointer(args${z?"+"+z:""});
`,z+=b[j].argPackAdvance;I+=`  var rv = ${f===1?"new func":"func.call"}(${D.join(", ")});
`,$.isVoid||(R.push("emval_returnValue"),H.push(ai),I+=`  return emval_returnValue(retType, destructorsRef, rv);
`),I+=`};
`,R.push(I);var le=function(_e,Ye){if(!(_e instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof _e} which is not a function`);var bt=di(_e.name||"unknownFunctionName",function(){});bt.prototype=_e.prototype;var Li=new bt,Gi=_e.apply(Li,Ye);return Gi instanceof Object?Gi:Li}(Function,R)(...H),be=`methodCaller<(${b.map(_e=>_e.name).join(", ")}) => ${$.name}>`;return np(di(be,le))}function ap(s){return s=sr(s>>>=0),Se.toHandle(n[s])}function sp(s,d){return s>>>=0,d>>>=0,s=Se.toValue(s),d=Se.toValue(d),Se.toHandle(s[d])}function up(s){(s>>>=0)>9&&(st[s+1]+=1)}function lp(){return Se.toHandle([])}function dp(s){s>>>=0,s=Se.toValue(s);for(var d=new Array(s.length),f=0;f<s.length;f++)d[f]=s[f];return Se.toHandle(d)}function cp(s){return s>>>=0,Se.toHandle(sr(s))}function pp(){return Se.toHandle({})}var mp=s=>{for(;s.length;){var d=s.pop();s.pop()(d)}};function fp(s){s>>>=0;var d=Se.toValue(s);mp(d),gn(s)}function hp(s,d,f){s>>>=0,d>>>=0,f>>>=0,s=Se.toValue(s),d=Se.toValue(d),f=Se.toValue(f),s[d]=f}function gp(s,d){d>>>=0;var f=(s=or(s>>>=0,"_emval_take_value")).readValueFromPointer(d);return Se.toHandle(f)}function yp(s,d){s=kt(s),d>>>=0;var f=new Date(1e3*s);A()[d>>>2>>>0]=f.getUTCSeconds(),A()[d+4>>>2>>>0]=f.getUTCMinutes(),A()[d+8>>>2>>>0]=f.getUTCHours(),A()[d+12>>>2>>>0]=f.getUTCDate(),A()[d+16>>>2>>>0]=f.getUTCMonth(),A()[d+20>>>2>>>0]=f.getUTCFullYear()-1900,A()[d+24>>>2>>>0]=f.getUTCDay();var b=Date.UTC(f.getUTCFullYear(),0,1,0,0,0,0),$=(f.getTime()-b)/864e5|0;A()[d+28>>>2>>>0]=$}var bp=[0,31,60,91,121,152,182,213,244,274,305,335],_p=[0,31,59,90,120,151,181,212,243,273,304,334],ci=s=>{var d;return((d=s.getFullYear())%4!=0||d%100==0&&d%400!=0?_p:bp)[s.getMonth()]+s.getDate()-1};function wp(s,d){s=kt(s),d>>>=0;var f=new Date(1e3*s);A()[d>>>2>>>0]=f.getSeconds(),A()[d+4>>>2>>>0]=f.getMinutes(),A()[d+8>>>2>>>0]=f.getHours(),A()[d+12>>>2>>>0]=f.getDate(),A()[d+16>>>2>>>0]=f.getMonth(),A()[d+20>>>2>>>0]=f.getFullYear()-1900,A()[d+24>>>2>>>0]=f.getDay();var b=0|ci(f);A()[d+28>>>2>>>0]=b,A()[d+36>>>2>>>0]=-60*f.getTimezoneOffset();var $=new Date(f.getFullYear(),0,1),I=new Date(f.getFullYear(),6,1).getTimezoneOffset(),z=$.getTimezoneOffset(),D=0|(I!=z&&f.getTimezoneOffset()==Math.min(z,I));A()[d+32>>>2>>>0]=D}var vp=function(s){s>>>=0;var d=(()=>{var f=new Date(A()[s+20>>>2>>>0]+1900,A()[s+16>>>2>>>0],A()[s+12>>>2>>>0],A()[s+8>>>2>>>0],A()[s+4>>>2>>>0],A()[s>>>2>>>0],0),b=A()[s+32>>>2>>>0],$=f.getTimezoneOffset(),I=new Date(f.getFullYear(),0,1),z=new Date(f.getFullYear(),6,1).getTimezoneOffset(),D=I.getTimezoneOffset(),R=Math.min(D,z);if(b<0)A()[s+32>>>2>>>0]=+(z!=D&&R==$);else if(b>0!=(R==$)){var H=Math.max(D,z),j=b>0?R:H;f.setTime(f.getTime()+6e4*(j-$))}A()[s+24>>>2>>>0]=f.getDay();var le=0|ci(f);A()[s+28>>>2>>>0]=le,A()[s>>>2>>>0]=f.getSeconds(),A()[s+4>>>2>>>0]=f.getMinutes(),A()[s+8>>>2>>>0]=f.getHours(),A()[s+12>>>2>>>0]=f.getDate(),A()[s+16>>>2>>>0]=f.getMonth(),A()[s+20>>>2>>>0]=f.getYear();var be=f.getTime();return isNaN(be)?-1:be/1e3})();return BigInt(d)};function pi(s,d,f,b,$,I,z){return u?Ce(16,0,1,s,d,f,b,$,I,z):(s>>>=0,$=kt($),I>>>=0,z>>>=0,-52)}function mi(s,d,f,b,$,I){if(u)return Ce(17,0,1,s,d,f,b,$,I);s>>>=0,d>>>=0,I=kt(I)}var Lt={},wn=()=>performance.timeOrigin+performance.now();function fi(s,d){if(u)return Ce(18,0,1,s,d);if(Lt[s]&&(clearTimeout(Lt[s].id),delete Lt[s]),!d)return 0;var f=setTimeout(()=>{delete Lt[s],bn(()=>Pi(s,wn()))},d);return Lt[s]={id:f,timeout_ms:d},0}var $p=function(s,d,f,b){s>>>=0,d>>>=0,f>>>=0,b>>>=0;var $=new Date().getFullYear(),I=new Date($,0,1),z=new Date($,6,1),D=I.getTimezoneOffset(),R=z.getTimezoneOffset(),H=Math.max(D,R);W()[s>>>2>>>0]=60*H,A()[d>>>2>>>0]=+(D!=R);var j=_e=>{var Ye=_e>=0?"-":"+",bt=Math.abs(_e);return`UTC${Ye}${String(Math.floor(bt/60)).padStart(2,"0")}${String(bt%60).padStart(2,"0")}`},le=j(D),be=j(R);R<D?(Et(le,f,17),Et(be,b,17)):(Et(le,b,17),Et(be,f,17))},hi=()=>Date.now(),xp=1,Sp=s=>s>=0&&s<=3;function Tp(s,d,f){if(d=kt(d),f>>>=0,!Sp(s))return 28;var b;if(s===0)b=hi();else{if(!xp)return 52;b=wn()}var $=Math.round(1e3*b*1e3);return Q[f>>>3]=BigInt($),0}var vn=[],gi=(s,d,f)=>{var b=(($,I)=>{var z;for(vn.length=0;z=ye()[$++>>>0];){var D=z!=105;I+=(D&=z!=112)&&I%8?4:0,vn.push(z==112?W()[I>>>2>>>0]:z==106?Q[I>>>3]:z==105?A()[I>>>2>>>0]:Be()[I>>>3>>>0]),I+=D?8:4}return vn})(d,f);return Ao[s](...b)};function Ip(s,d,f){return gi(s>>>=0,d>>>=0,f>>>=0)}function Cp(s,d,f){return gi(s>>>=0,d>>>=0,f>>>=0)}var Ap=()=>{};function kp(s,d){return x(ke(s>>>=0,d>>>=0))}var Ep=()=>{throw si(),"unwind"},yi=()=>4294901760;function Pp(){return yi()}var zp=()=>navigator.hardwareConcurrency;function Op(s){return dt("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}var Dp=(s,d)=>Math.ceil(s/d)*d,Bp=s=>{var d=(s-T.buffer.byteLength+65535)/65536|0;try{return T.grow(d),Pe(),1}catch{}};function Rp(s){s>>>=0;var d=ye().length;if(s<=d)return!1;var f=yi();if(s>f)return!1;for(var b=1;b<=4;b*=2){var $=d*(1+.2/b);$=Math.min($,s+100663296);var I=Math.min(f,Dp(Math.max(s,$),65536));if(Bp(I))return!0}return!1}var ur=s=>(dt("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Pt={},bi=s=>{s.forEach(d=>{var f=ur(d);f&&(Pt[f]=d)})},_i=()=>new Error().stack.toString();function Mp(){var s=_i().split(`
`);return s[0]=="Error"&&s.shift(),bi(s),Pt.last_addr=ur(s[3]),Pt.last_stack=s,Pt.last_addr}function Up(s,d,f){var b;s>>>=0,d>>>=0,Pt.last_addr==s?b=Pt.last_stack:((b=_i().split(`
`))[0]=="Error"&&b.shift(),bi(b));for(var $=3;b[$]&&ur(b[$])!=s;)++$;for(var I=0;I<f&&b[I+$];++I)A()[d+4*I>>>2>>>0]=ur(b[I+$]);return I}var $n={},Gt=()=>{if(!Gt.strings){var s={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(var d in $n)$n[d]===void 0?delete s[d]:s[d]=$n[d];var f=[];for(var d in s)f.push(`${d}=${s[d]}`);Gt.strings=f}return Gt.strings},wi=function(s,d){if(u)return Ce(19,0,1,s,d);s>>>=0,d>>>=0;var f=0;return Gt().forEach((b,$)=>{var I=d+f;W()[s+4*$>>>2>>>0]=I,((z,D)=>{for(var R=0;R<z.length;++R)de()[D++>>>0]=z.charCodeAt(R);de()[D>>>0]=0})(b,I),f+=b.length+1}),0},vi=function(s,d){if(u)return Ce(20,0,1,s,d);s>>>=0,d>>>=0;var f=Gt();W()[s>>>2>>>0]=f.length;var b=0;return f.forEach($=>b+=$.length+1),W()[d>>>2>>>0]=b,0};function $i(s){return u?Ce(21,0,1,s):52}function xi(s,d,f,b){return u?Ce(22,0,1,s,d,f,b):(d>>>=0,f>>>=0,b>>>=0,52)}function Si(s,d,f,b){return u?Ce(23,0,1,s,d,f,b):(d=kt(d),b>>>=0,70)}var Np=[null,[],[]],Vp=(s,d)=>{var f=Np[s];d===0||d===10?((s===1?w:x)(Wo(f)),f.length=0):f.push(d)};function Ti(s,d,f,b){if(u)return Ce(24,0,1,s,d,f,b);d>>>=0,f>>>=0,b>>>=0;for(var $=0,I=0;I<f;I++){var z=W()[d>>>2>>>0],D=W()[d+4>>>2>>>0];d+=8;for(var R=0;R<D;R++)Vp(s,ye()[z+R>>>0]);$+=D}return W()[b>>>2>>>0]=$,0}ce.init(),(()=>{for(var s=new Array(256),d=0;d<256;++d)s[d]=String.fromCharCode(d);ri=s})(),ni=n.BindingError=class extends Error{constructor(s){super(s),this.name="BindingError"}},n.InternalError=class extends Error{constructor(s){super(s),this.name="InternalError"}},st.push(0,1,void 0,1,null,1,!0,1,!1,1),n.count_emval_handles=()=>st.length/2-5-hn.length;var Wp=[dn,Mo,Uo,Lo,Go,Fo,qo,Ko,jo,Zo,Qo,Yo,Xo,Jo,ei,ti,pi,mi,fi,wi,vi,$i,xi,Si,Ti],X=await async function(){function s($,I){return X=$.exports,X=function(D){var R=j=>le=>j(le)>>>0,H=j=>()=>j()>>>0;return(D=Object.assign({},D)).Ea=R(D.Ea),D.gb=H(D.gb),D.ib=R(D.ib),D.ub=R(D.ub),D.vb=H(D.vb),D.__cxa_get_exception_ptr=R(D.__cxa_get_exception_ptr),D}(X=ee.instrumentWasmExports(X)),z=X.jb,ce.tlsInitFunctions.push(z),k=I,Io(),X;var z}To();var d,f,b=Co();if(n.instantiateWasm)return new Promise(($,I)=>{n.instantiateWasm(b,(z,D)=>{s(z,D),$(z.exports)})});if(u)return new Promise($=>{Te=I=>{var z=new WebAssembly.Instance(I,Co());$(s(z,I))}});At??=n.locateFile?(d="ort-wasm-simd-threaded.jsep.wasm",n.locateFile?n.locateFile(d,_):_+d):new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href;try{return s((f=await gc(Z,At,b)).instance,f.module)}catch($){return r($),Promise.reject($)}}(),Ii=s=>(Ii=X.Ea)(s),Ci=()=>(Ci=X.Fa)(),lr=(n._OrtInit=(s,d)=>(n._OrtInit=X.Ga)(s,d),n._OrtGetLastError=(s,d)=>(n._OrtGetLastError=X.Ha)(s,d),n._OrtCreateSessionOptions=(s,d,f,b,$,I,z,D,R,H)=>(n._OrtCreateSessionOptions=X.Ia)(s,d,f,b,$,I,z,D,R,H),n._OrtAppendExecutionProvider=(s,d,f,b,$)=>(n._OrtAppendExecutionProvider=X.Ja)(s,d,f,b,$),n._OrtAddFreeDimensionOverride=(s,d,f)=>(n._OrtAddFreeDimensionOverride=X.Ka)(s,d,f),n._OrtAddSessionConfigEntry=(s,d,f)=>(n._OrtAddSessionConfigEntry=X.La)(s,d,f),n._OrtReleaseSessionOptions=s=>(n._OrtReleaseSessionOptions=X.Ma)(s),n._OrtCreateSession=(s,d,f)=>(n._OrtCreateSession=X.Na)(s,d,f),n._OrtReleaseSession=s=>(n._OrtReleaseSession=X.Oa)(s),n._OrtGetInputOutputCount=(s,d,f)=>(n._OrtGetInputOutputCount=X.Pa)(s,d,f),n._OrtGetInputOutputMetadata=(s,d,f,b)=>(n._OrtGetInputOutputMetadata=X.Qa)(s,d,f,b),n._OrtFree=s=>(n._OrtFree=X.Ra)(s),n._OrtCreateTensor=(s,d,f,b,$,I)=>(n._OrtCreateTensor=X.Sa)(s,d,f,b,$,I),n._OrtGetTensorData=(s,d,f,b,$)=>(n._OrtGetTensorData=X.Ta)(s,d,f,b,$),n._OrtReleaseTensor=s=>(n._OrtReleaseTensor=X.Ua)(s),n._OrtCreateRunOptions=(s,d,f,b)=>(n._OrtCreateRunOptions=X.Va)(s,d,f,b),n._OrtAddRunConfigEntry=(s,d,f)=>(n._OrtAddRunConfigEntry=X.Wa)(s,d,f),n._OrtReleaseRunOptions=s=>(n._OrtReleaseRunOptions=X.Xa)(s),n._OrtCreateBinding=s=>(n._OrtCreateBinding=X.Ya)(s),n._OrtBindInput=(s,d,f)=>(n._OrtBindInput=X.Za)(s,d,f),n._OrtBindOutput=(s,d,f,b)=>(n._OrtBindOutput=X._a)(s,d,f,b),n._OrtClearBoundOutputs=s=>(n._OrtClearBoundOutputs=X.$a)(s),n._OrtReleaseBinding=s=>(n._OrtReleaseBinding=X.ab)(s),n._OrtRunWithBinding=(s,d,f,b,$)=>(n._OrtRunWithBinding=X.bb)(s,d,f,b,$),n._OrtRun=(s,d,f,b,$,I,z,D)=>(n._OrtRun=X.cb)(s,d,f,b,$,I,z,D),n._OrtEndProfiling=s=>(n._OrtEndProfiling=X.db)(s),n._JsepOutput=(s,d,f)=>(n._JsepOutput=X.eb)(s,d,f),n._JsepGetNodeName=s=>(n._JsepGetNodeName=X.fb)(s),()=>(lr=X.gb)()),Qe=n._free=s=>(Qe=n._free=X.hb)(s),dr=n._malloc=s=>(dr=n._malloc=X.ib)(s),xn=(s,d,f,b,$,I)=>(xn=X.lb)(s,d,f,b,$,I),Ai=()=>(Ai=X.mb)(),ki=(s,d,f,b,$)=>(ki=X.nb)(s,d,f,b,$),Ei=s=>(Ei=X.ob)(s),Sn=s=>(Sn=X.pb)(s),Pi=(s,d)=>(Pi=X.qb)(s,d),zi=()=>(zi=X.rb)(),Oi=(s,d)=>(Oi=X.sb)(s,d),Di=s=>(Di=X.tb)(s),Bi=s=>(Bi=X.ub)(s),Ri=()=>(Ri=X.vb)(),Mi=n.dynCall_ii=(s,d)=>(Mi=n.dynCall_ii=X.wb)(s,d),Ui=s=>(Ui=X.xb)(s),Ni=()=>(Ni=X.yb)(),Vi=s=>(Vi=X.zb)(s),Wi=()=>(Wi=X.Ab)();return n.stackSave=Do,n.stackRestore=ln,n.stackAlloc=Bo,n.setValue=function(s,d,f="i8"){switch(f.endsWith("*")&&(f="*"),f){case"i1":case"i8":de()[s>>>0]=d;break;case"i16":$e()[s>>>1>>>0]=d;break;case"i32":A()[s>>>2>>>0]=d;break;case"i64":Q[s>>>3]=BigInt(d);break;case"float":pe()[s>>>2>>>0]=d;break;case"double":Be()[s>>>3>>>0]=d;break;case"*":W()[s>>>2>>>0]=d;break;default:dt(`invalid type for setValue: ${f}`)}},n.getValue=function(s,d="i8"){switch(d.endsWith("*")&&(d="*"),d){case"i1":case"i8":return de()[s>>>0];case"i16":return $e()[s>>>1>>>0];case"i32":return A()[s>>>2>>>0];case"i64":return Q[s>>>3];case"float":return pe()[s>>>2>>>0];case"double":return Be()[s>>>3>>>0];case"*":return W()[s>>>2>>>0];default:dt(`invalid type for getValue: ${d}`)}},n.UTF8ToString=ke,n.stringToUTF8=Et,n.lengthBytesUTF8=Ho,function s(){if(Nt>0)Vt=s;else{if(u)return t(n),void gt();(d=>{for(;d.length>0;)d.shift()(n)})(zo),Nt>0?Vt=s:(n.calledRun=!0,ne||(gt(),t(n)))}}(),n.PTR_SIZE=4,o}),Zp=xa,Qp=globalThis.self?.name?.startsWith("em-pthread");Qp&&xa()});var Aa,Rn,Yp,Ve,ka,Bn,Xp,Jp,Ea,em,Ia,Pa,Ca,za,gr=N(()=>{"use strict";hr();Aa=typeof location>"u"?void 0:location.origin,Rn=import.meta.url>"file:"&&import.meta.url<"file;",Yp=()=>{if(!!1){if(Rn){let e=URL;return new URL(new e("ort.bundle.min.mjs",import.meta.url).href,Aa).href}return import.meta.url}},Ve=Yp(),ka=()=>{if(Ve&&!Ve.startsWith("blob:"))return Ve.substring(0,Ve.lastIndexOf("/")+1)},Bn=(e,t)=>{try{let r=t??Ve;return(r?new URL(e,r):new URL(e)).origin===Aa}catch{return!1}},Xp=(e,t)=>{let r=t??Ve;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Jp=(e,t)=>`${t??"./"}${e}`,Ea=async e=>{let r=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(r)},em=async e=>(await import(/*webpackIgnore:true*/e)).default,Ia=($a(),Ht(va)).default,Pa=async()=>{if(!Ve)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Bn(Ve))return[void 0,Ia()];let e=await Ea(Ve);return[e,Ia(e)]},Ca=(Ta(),Ht(Sa)).default,za=async(e,t,r)=>{if(!e&&!t&&Ca&&Ve&&Bn(Ve))return[void 0,Ca];{let n="ort-wasm-simd-threaded.jsep.mjs",o=e??Xp(n,t),i=!!1&&r&&o&&!Bn(o,t),a=i?await Ea(o):o??Jp(n,t);return[i?a:void 0,await em(a)]}}});var Mn,Un,Tr,Oa,tm,rm,nm,yr,ge,pt=N(()=>{"use strict";gr();Un=!1,Tr=!1,Oa=!1,tm=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},rm=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},nm=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},yr=async e=>{if(Un)return Promise.resolve();if(Tr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Oa)throw new Error("previous call to 'initializeWebAssembly()' failed.");Tr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!nm())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!rm())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let n=tm();r>1&&!n&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let o=e.wasmPaths,i=typeof o=="string"?o:void 0,a=o?.mjs,u=a?.href??a,l=o?.wasm,c=l?.href??l,p=e.wasmBinary,[m,h]=await za(u,i,r>1),y=!1,g=[];if(t>0&&g.push(new Promise(_=>{setTimeout(()=>{y=!0,_()},t)})),g.push(new Promise((_,S)=>{let v={numThreads:r};if(p)v.wasmBinary=p;else if(c||i)v.locateFile=w=>c??i+w;else if(u&&u.indexOf("blob:")!==0)v.locateFile=w=>new URL(w,u).href;else if(m){let w=ka();w&&(v.locateFile=x=>w+x)}h(v).then(w=>{Tr=!1,Un=!0,Mn=w,_(),m&&URL.revokeObjectURL(m)},w=>{Tr=!1,Oa=!0,S(w)})})),await Promise.race(g),y)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},ge=()=>{if(Un&&Mn)return Mn;throw new Error("WebAssembly is not initialized yet.")}});var We,Kt,fe,Ir=N(()=>{"use strict";pt();We=(e,t)=>{let r=ge(),n=r.lengthBytesUTF8(e)+1,o=r._malloc(n);return r.stringToUTF8(e,o,n),t.push(o),o},Kt=(e,t,r,n)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([o,i])=>{let a=t?t+o:o;if(typeof i=="object")Kt(i,a+".",r,n);else if(typeof i=="string"||typeof i=="number")n(a,i.toString());else if(typeof i=="boolean")n(a,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},fe=e=>{let t=ge(),r=t.stackSave();try{let n=t.PTR_SIZE,o=t.stackAlloc(2*n);t._OrtGetLastError(o,o+n);let i=Number(t.getValue(o,n===4?"i32":"i64")),a=t.getValue(o+n,"*"),u=a?t.UTF8ToString(a):"";throw new Error(`${e} ERROR_CODE: ${i}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}});var Da,Ba=N(()=>{"use strict";pt();Ir();Da=e=>{let t=ge(),r=0,n=[],o=e||{};try{if(e?.logSeverityLevel===void 0)o.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)o.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(o.terminate=!1);let i=0;return e?.tag!==void 0&&(i=We(e.tag,n)),r=t._OrtCreateRunOptions(o.logSeverityLevel,o.logVerbosityLevel,!!o.terminate,i),r===0&&fe("Can't create run options."),e?.extra!==void 0&&Kt(e.extra,"",new WeakSet,(a,u)=>{let l=We(a,n),c=We(u,n);t._OrtAddRunConfigEntry(r,l,c)!==0&&fe(`Can't set a run config entry: ${a} - ${u}.`)}),[r,n]}catch(i){throw r!==0&&t._OrtReleaseRunOptions(r),n.forEach(a=>t._free(a)),i}}});var om,im,am,Cr,sm,Ra,Ma=N(()=>{"use strict";pt();Ir();om=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},im=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},am=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Cr=(e,t,r,n)=>{let o=We(t,n),i=We(r,n);ge()._OrtAddSessionConfigEntry(e,o,i)!==0&&fe(`Can't set a session config entry: ${t} - ${r}.`)},sm=async(e,t,r)=>{for(let n of t){let o=typeof n=="string"?n:n.name,i=[];switch(o){case"webnn":if(o="WEBNN",typeof n!="string"){let m=n?.deviceType;m&&Cr(e,"deviceType",m,r)}break;case"webgpu":if(o="JS",typeof n!="string"){let p=n;if(p?.preferredLayout){if(p.preferredLayout!=="NCHW"&&p.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${p.preferredLayout}`);Cr(e,"preferredLayout",p.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${o}`)}let a=We(o,r),u=i.length,l=0,c=0;if(u>0){l=ge()._malloc(u*ge().PTR_SIZE),r.push(l),c=ge()._malloc(u*ge().PTR_SIZE),r.push(c);for(let p=0;p<u;p++)ge().setValue(l+p*ge().PTR_SIZE,i[p][0],"*"),ge().setValue(c+p*ge().PTR_SIZE,i[p][1],"*")}await ge()._OrtAppendExecutionProvider(e,a,l,c,u)!==0&&fe(`Can't append execution provider: ${o}.`)}},Ra=async e=>{let t=ge(),r=0,n=[],o=e||{};am(o);try{let i=om(o.graphOptimizationLevel??"all"),a=im(o.executionMode??"sequential"),u=typeof o.logId=="string"?We(o.logId,n):0,l=o.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log serverity level is not valid: ${l}`);let c=o.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw new Error(`log verbosity level is not valid: ${c}`);let p=typeof o.optimizedModelFilePath=="string"?We(o.optimizedModelFilePath,n):0;if(r=t._OrtCreateSessionOptions(i,!!o.enableCpuMemArena,!!o.enableMemPattern,a,!!o.enableProfiling,0,u,l,c,p),r===0&&fe("Can't create session options."),o.executionProviders&&await sm(r,o.executionProviders,n),o.enableGraphCapture!==void 0){if(typeof o.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);Cr(r,"enableGraphCapture",o.enableGraphCapture.toString(),n)}if(o.freeDimensionOverrides)for(let[m,h]of Object.entries(o.freeDimensionOverrides)){if(typeof m!="string")throw new Error(`free dimension override name must be a string: ${m}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let y=We(m,n);t._OrtAddFreeDimensionOverride(r,y,h)!==0&&fe(`Can't set a free dimension override: ${m} - ${h}.`)}return o.extra!==void 0&&Kt(o.extra,"",new WeakSet,(m,h)=>{Cr(r,m,h,n)}),[r,n]}catch(i){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&fe("Can't release session options."),n.forEach(a=>t._free(a)),i}}});var Ot,Xe,mt,Ar,jt,kr,Er,Nn,re=N(()=>{"use strict";Ot=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Xe=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},mt=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],n=typeof t=="number"?t:t.reduce((o,i)=>o*i,1);return r>0?Math.ceil(n*r):void 0},Ar=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},jt=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},kr=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Er=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Nn=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}});var Zt,Vn=N(()=>{"use strict";hr();Zt=async e=>{if(typeof e=="string")if(!1)try{let{readFile:t}=In("node:fs/promises");return new Uint8Array(await t(e))}catch(t){if(t.code==="ERR_FS_FILE_TOO_LARGE"){let{createReadStream:r}=In("node:fs"),n=r(e),o=[];for await(let i of n)o.push(i);return new Uint8Array(Buffer.concat(o))}throw t}else{let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),n=r?parseInt(r,10):0;if(n<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let o=t.body.getReader(),i;try{i=new ArrayBuffer(n)}catch(u){if(u instanceof RangeError){let l=Math.ceil(n/65536);i=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let a=0;for(;;){let{done:u,value:l}=await o.read();if(u)break;let c=l.byteLength;new Uint8Array(i,a,c).set(l),a+=c}return new Uint8Array(i,0,n)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}});var um,lm,Ua,Na,Pr,dm,ue,Je=N(()=>{"use strict";re();um=["V","I","W","E","F"],lm=(e,t)=>{console.log(`[${um[e]},${new Date().toISOString()}]${t}`)},Pr=(e,t)=>{Ua=e,Na=t},dm=(e,t)=>{let r=jt(e),n=jt(Ua);r>=n&&lm(r,typeof t=="function"?t():t)},ue=(...e)=>{Na&&dm(...e)}});var Wn,et,E,xt,zr,Va,Wa,ie=N(()=>{"use strict";Wn=class{static calcMatMulShape(t,r){return t[1]!==r[0]?void 0:[t[0],r[1]]}},et=class{static calcShape(t,r,n=!1){let o=t.length,i=r.length;if(o===0)return r;if(i===0)return t;let a=Math.max(t.length,r.length),u=new Array(a);if(n){if(o<2||i<2)return;let l=Wn.calcMatMulShape([t[o-2],t[o-1]],[r[i-2],r[i-1]]);if(l===void 0)return;[u[a-2],u[a-1]]=l}for(let l=n?3:1;l<=a;l++){let c=o-l<0?1:t[o-l],p=i-l<0?1:r[i-l];if(c!==p&&c>1&&p>1)return;let m=Math.max(c,p);if(c&&p)u[a-l]=Math.max(c,p);else{if(m>1)return;u[a-l]=0}}return u}static isValidBroadcast(t,r){let n=t.length,o=r.length;if(n>o)return!1;for(let i=1;i<=n;i++)if(t[n-i]!==1&&t[n-i]!==r[o-i])return!1;return!0}},E=class e{static size(t){return e.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let n=t.length;if(n===0)return[];let o=new Array(n),i=n-1;for(;i>=0;){if(t[i]%r===0){o[i]=t[i]/r;break}if(r%t[i]!==0)throw new Error("cannot convert shape");o[i]=1,r/=t[i],i--}for(i--;i>=0;i--)o[i]=t[i];return o}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return e.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,n){let o=1;for(let i=r;i<n;i++){if(t[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");o*=Number(t[i])}return o}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let n=new Array(r);n[r-1]=1,n[r-2]=t[r-1];for(let o=r-3;o>=0;--o)n[o]=n[o+1]*t[o+1];return n}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(n=>this.normalizeAxis(n,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(n=>t[n]):t.slice().reverse()}static padShape(t,r){let n=t.length;return t.map((o,i)=>o+r[i]+r[i+n])}static areEqual(t,r){return t.length!==r.length?!1:t.every((n,o)=>n===r[o])}},xt=class e{static adjustPoolAttributes(t,r,n,o,i,a){if(!t&&n.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=n.length?n.push(r[u+2]):n[u]=r[u+2];for(let u=0;u<n.length;u++)if(u<o.length){if(o[u]<0)throw new Error("strides should be greater than or equal to 1")}else o.push(1);for(let u=0;u<n.length;u++)if(u<i.length){if(i[u]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let u=0;u<n.length*2;u++)if(u<a.length){if(a[u]<0)throw new Error("pad should be greater than or equal to 1")}else a.push(0);for(let u=0;u<n.length;u++){if(n[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(a[u]>=n[u]||a[u+n.length]>=n[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,n,o,i,a,u){if(u){if(i.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(o.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)e.adjustPadAndReturnShape(t[l+(a?1:2)],r[l],n[l],o[l],i,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,n,o,i,a,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return e.computeShapeHelper(t,r,l,n,o,i,a,u),l}static computeConvOutputShape(t,r,n,o,i,a,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return e.computeShapeHelper(!1,t,l,n,o,i,a,u),l}static computeShapeHelper(t,r,n,o,i,a,u,l){if(t)for(let c=0;c<r.length-2;c++)n.push(1);else for(let c=0;c<r.length-2;c++)n.push(e.adjustPadAndReturnShape(r[c+2],o[c],i[c],a[c],u,c,c+r.length-2,l))}static adjustPadAndReturnShape(t,r,n,o,i,a,u,l){let c=n*(o-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return i[a]=0,i[u]=0,Math.floor((t-c)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(n!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let m=((t+r-1)/r-1)*r+o-t;return i[a]=Math.floor(l==="SAME_LOWER"?(m+1)/2:m/2),i[u]=m-i[a],Math.floor((t+m-o)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+i[a]+i[u]-c)/r+1)}},zr=class{static getShapeOfGemmResult(t,r,n,o,i){if(t.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let a,u,l;r?(a=t[1],u=t[0]):(a=t[0],u=t[1]);let c=-1;if(o?(l=n[0],c=1):(l=n[1],c=0),n[c]!==u)throw new Error("dimension mismatch");if(a<=0||l<=0||u<=0)throw new Error("invalid shape specified");if(i&&!et.isValidBroadcast(i,[a,l]))throw new Error("gemm: invalid bias shape for broadcast");return[a,l,u]}},Va=-34028234663852886e22,Wa=34028234663852886e22});var Or,Ln=N(()=>{"use strict";re();Or=(e,t)=>new(Ar(t))(e)});var Hn,Ga,cm,La,pm,Ha,Dr,Br,Gn,Fa,qa=N(()=>{"use strict";Je();Hn=(e,t=!0)=>{if(e.byteLength%8!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 8 (BigInt).");let r=e.byteLength/8,n=new BigInt64Array(e.buffer,e.byteOffset,r),o=new Int32Array(r);for(let i=0;i<r;i++){let a=n[i];if(a>2147483647n||a<-2147483648n)throw new Error(`Overflow occurred when converting BigInt to Int32 at index ${i}: ${a}`);o[i]=Number(a)}return t?new Uint8Array(o.buffer):o},Ga=(e,t=!0)=>{if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (Int32).");let r=e.byteLength/4,n=new Int32Array(e.buffer,e.byteOffset,r),o=BigInt64Array.from(n,BigInt);return t?new Uint8Array(o.buffer):o},cm=1,La=()=>cm++,pm=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Ha=(e,t)=>{let r=pm.get(e);if(!r)throw new Error("Unsupported data type.");return t.length>0?Math.ceil(t.reduce((n,o)=>n*o)*r/8):0},Dr=class{constructor(t){this.shouldConvertInt64toInt32=!1;this.isInt64ToInt32Converted=!1;let{sessionId:r,context:n,tensor:o,dataType:i,shape:a,shouldConvertInt64toInt32:u=!1}=t;this.sessionId=r,this.mlContext=n,this.mlTensor=o,this.dataType=i,this.tensorShape=a,this.shouldConvertInt64toInt32=u}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return Ha(this.dataType,this.tensorShape)}destroy(){ue("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(t){this.mlContext.writeTensor(this.mlTensor,t)}async read(t,r){if(t){let n=await this.mlContext.readTensor(this.mlTensor),o=Ga(new Uint8Array(n));if(r){(r instanceof ArrayBuffer?new Uint8Array(r):new Uint8Array(r.buffer,r.byteOffset,r.byteLength)).set(o);return}else return o.buffer}else return r?this.mlContext.readTensor(this.mlTensor,r):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(t,r,n){return this.mlContext===t&&this.dataType===r&&this.tensorShape.length===n.length&&this.tensorShape.every((o,i)=>o===n[i])}setIsInt64ToInt32Converted(t){this.isInt64ToInt32Converted=t}},Br=class{constructor(t,r){this.tensorManager=t;this.wrapper=r}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(t,r,n,o){let i=r,a=this.tensorManager.getMLContext(t),u=i==="int64"&&!a.opSupportLimits().input.dataTypes.includes("int64");if(u&&(i="int32",ue("verbose",()=>"[WebNN] TensorIdTracker.ensureTensor: convert dataType from int64 to int32")),this.wrapper){if(this.wrapper.canReuseTensor(a,i,n))return this.wrapper.tensor;if(o){if(this.wrapper.byteLength!==Ha(i,n))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let l=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(t,i,n,l,!0,!0,u),o&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(t){let r=t;if(this.wrapper)if(this.wrapper.shouldConvertInt64toInt32&&(r=Hn(t,!0),this.wrapper.setIsInt64ToInt32Converted(!0)),r.byteLength===this.wrapper.byteLength){this.wrapper.write(r);return}else ue("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(r):this.activeUpload=new Uint8Array(r)}async download(t){if(this.activeUpload){let r=this.wrapper?.isInt64ToInt32Converted?Ga(this.activeUpload):this.activeUpload;if(t){t instanceof ArrayBuffer?new Uint8Array(t).set(r):new Uint8Array(t.buffer,t.byteOffset,t.byteLength).set(r);return}else return r.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return t?this.wrapper.read(this.wrapper?.shouldConvertInt64toInt32,t):this.wrapper.read(this.wrapper?.shouldConvertInt64toInt32)}},Gn=class{constructor(t){this.backend=t;this.tensorTrackersById=new Map;this.freeTensors=[];this.externalTensors=new Set}getMLContext(t){let r=this.backend.getMLContext(t);if(!r)throw new Error("MLContext not found for session.");return r}reserveTensorId(){let t=La();return this.tensorTrackersById.set(t,new Br(this)),t}releaseTensorId(t){let r=this.tensorTrackersById.get(t);r&&(this.tensorTrackersById.delete(t),r.tensorWrapper&&this.releaseTensor(r.tensorWrapper))}async ensureTensor(t,r,n,o,i){ue("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${r}, dataType: ${n}, shape: ${o}, copyOld: ${i}}`);let a=this.tensorTrackersById.get(r);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(t,n,o,i)}upload(t,r){let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");n.upload(r)}async download(t,r){ue("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${t}, dstBuffer: ${r?.byteLength}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.download(r)}releaseTensorsForSession(t){for(let r of this.freeTensors)r.sessionId===t&&r.destroy();this.freeTensors=this.freeTensors.filter(r=>r.sessionId!==t)}registerTensor(t,r,n,o){let i=this.getMLContext(t),a=La(),u=new Dr({sessionId:t,context:i,tensor:r,dataType:n,shape:o});return this.tensorTrackersById.set(a,new Br(this,u)),this.externalTensors.add(u),a}async getCachedTensor(t,r,n,o,i,a,u=!1){let l=this.getMLContext(t);for(let[p,m]of this.freeTensors.entries())if(m.canReuseTensor(l,r,n)){ue("verbose",()=>`[WebNN] Reusing tensor {dataType: ${r}, shape: ${n}}`);let h=this.freeTensors.splice(p,1)[0];return h.sessionId=t,h}ue("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${r}, shape: ${n}}`);let c=await l.createTensor({dataType:r,shape:n,dimensions:n,usage:o,writable:i,readable:a});return new Dr({sessionId:t,context:l,tensor:c,dataType:r,shape:n,shouldConvertInt64toInt32:u})}releaseTensor(t){this.externalTensors.has(t)&&this.externalTensors.delete(t),this.freeTensors.push(t)}},Fa=(...e)=>new Gn(...e)});var Fn,mm,Rr,Ka=N(()=>{"use strict";re();pt();Ln();qa();Je();Fn=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),mm=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),n=Object.keys(t).sort();return r.length===n.length&&r.every((o,i)=>o===n[i]&&e[o]===t[o])},Rr=class{constructor(t){this.tensorManager=Fa(this);this.mlContextBySessionId=new Map;this.sessionIdsByMLContext=new Map;this.mlContextCache=[];this.sessionGraphInputs=new Map;this.temporaryGraphInputs=[];this.temporarySessionTensorIds=new Map;Pr(t.logLevel,!!t.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(t){ue("verbose",()=>`[WebNN] onRunStart {sessionId: ${t}}`),this.activeSessionId=t}onRunEnd(t){ue("verbose",()=>`[WebNN] onRunEnd {sessionId: ${t}}`);let r=this.temporarySessionTensorIds.get(t);if(r){for(let n of r)ue("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${n}}`),this.tensorManager.releaseTensorId(n);this.temporarySessionTensorIds.delete(t),this.activeSessionId=void 0}}async createMLContext(t){if(t instanceof GPUDevice){let n=this.mlContextCache.findIndex(o=>o.gpuDevice===t);if(n!==-1)return this.mlContextCache[n].mlContext;{let o=await navigator.ml.createContext(t);return this.mlContextCache.push({gpuDevice:t,mlContext:o}),o}}else if(t===void 0){let n=this.mlContextCache.findIndex(o=>o.options===void 0&&o.gpuDevice===void 0);if(n!==-1)return this.mlContextCache[n].mlContext;{let o=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:o}),o}}let r=this.mlContextCache.findIndex(n=>mm(n.options,t));if(r!==-1)return this.mlContextCache[r].mlContext;{let n=await navigator.ml.createContext(t);return this.mlContextCache.push({options:t,mlContext:n}),n}}registerMLContext(t,r){this.mlContextBySessionId.set(t,r);let n=this.sessionIdsByMLContext.get(r);n||(n=new Set,this.sessionIdsByMLContext.set(r,n)),n.add(t),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(t,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(t){this.sessionGraphInputs.delete(t);let r=this.mlContextBySessionId.get(t);if(!r)return;this.tensorManager.releaseTensorsForSession(t),this.mlContextBySessionId.delete(t);let n=this.sessionIdsByMLContext.get(r);if(n.delete(t),n.size===0){this.sessionIdsByMLContext.delete(r);let o=this.mlContextCache.findIndex(i=>i.mlContext===r);o!==-1&&this.mlContextCache.splice(o,1)}}getMLContext(t){return this.mlContextBySessionId.get(t)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(t){ue("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${t}}`),this.tensorManager.releaseTensorId(t)}async ensureTensor(t,r,n,o,i){let a=Fn.get(n);if(!a)throw new Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(t??this.currentSessionId,r,a,o,i)}async createTemporaryTensor(t,r,n){ue("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${r}, shape: ${n}}`);let o=Fn.get(r);if(!o)throw new Error(`Unsupported ONNX data type: ${r}`);let i=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(t,i,o,n,!1);let a=this.temporarySessionTensorIds.get(t);return a?a.push(i):this.temporarySessionTensorIds.set(t,[i]),i}uploadTensor(t,r){if(!ge().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");ue("verbose",()=>`[WebNN] uploadTensor {tensorId: ${t}, data: ${r.byteLength}}`),this.tensorManager.upload(t,r)}async downloadTensor(t,r){return this.tensorManager.download(t,r)}createMLTensorDownloader(t,r){return async()=>{let n=await this.tensorManager.download(t);return Or(n,r)}}registerMLTensor(t,r,n,o){let i=Fn.get(n);if(!i)throw new Error(`Unsupported ONNX data type: ${n}`);let a=this.tensorManager.registerTensor(t,r,i,o);return ue("verbose",()=>`[WebNN] registerMLTensor {tensor: ${r}, dataType: ${i}, dimensions: ${o}} -> {tensorId: ${a}}`),a}registerMLConstant(t,r,n,o,i,a,u=!1){if(!a)throw new Error("External mounted files are not available.");let l=t;t.startsWith("./")&&(l=t.substring(2));let c=a.get(l);if(!c)throw new Error(`File with name ${l} not found in preloaded files.`);if(r+n>c.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let p=c.slice(r,r+n).buffer,m;switch(i.dataType){case"float32":m=new Float32Array(p);break;case"float16":m=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(p):new Uint16Array(p);break;case"int32":m=new Int32Array(p);break;case"uint32":m=new Uint32Array(p);break;case"int64":u?(m=Hn(new Uint8Array(p),!1),i.dataType="int32"):m=new BigInt64Array(p);break;case"uint64":m=new BigUint64Array(p);break;case"int8":m=new Int8Array(p);break;case"int4":case"uint4":case"uint8":m=new Uint8Array(p);break;default:throw new Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`)}return ue("verbose",()=>`[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}} ${u?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),o.constant(i,m)}registerGraphInput(t){this.temporaryGraphInputs.push(t)}isGraphInput(t,r){let n=this.sessionGraphInputs.get(t);return n?n.includes(r):!1}isInt64Supported(t){return!!this.mlContextBySessionId.get(t)?.opSupportLimits().input.dataTypes.includes("int64")}flush(){}}});var Mr=N(()=>{"use strict"});var ja,qn,Kn,fm,hm,Za,Zn,jn,Ya,Xa=N(()=>{"use strict";Je();Mr();ja=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),qn=[],Kn=e=>Math.ceil(Number(e)/16)*16,fm=e=>{for(let t=0;t<qn.length;t++){let r=qn[t];if(e<=r)return r}return Math.ceil(e/16)*16},hm=1,Za=()=>hm++,Zn=async(e,t,r,n)=>{let o=Kn(r),i=e.device.createBuffer({size:o,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let a=e.getCommandEncoder();e.endComputePass(),a.copyBufferToBuffer(t,0,i,0,o),e.flush(),await i.mapAsync(GPUMapMode.READ);let u=i.getMappedRange();if(n){let l=n();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{i.destroy()}},jn=class{constructor(t){this.backend=t;this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[r]of ja)qn.push(r),this.freeBuffers.set(r,[]),this.freeUniformBuffers.set(r,[]);this.sessionCount=0}upload(t,r){let n=r.buffer,o=r.byteOffset,i=r.byteLength,a=Kn(i),u=this.storageCache.get(t);if(!u)throw new Error("gpu data for uploading does not exist");if(Number(u.originalSize)!==i)throw new Error(`inconsistent data size. gpu data size=${u.originalSize}, data size=${i}`);let l=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),c=l.getMappedRange();new Uint8Array(c).set(new Uint8Array(n,o,i)),l.unmap();let p=this.backend.device.createCommandEncoder();p.copyBufferToBuffer(l,0,u.gpuData.buffer,0,a),this.backend.device.queue.submit([p.finish()]),l.destroy(),ue("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${t})`)}memcpy(t,r){let n=this.storageCache.get(t);if(!n)throw new Error("source gpu data for memcpy does not exist");let o=this.storageCache.get(r);if(!o)throw new Error("destination gpu data for memcpy does not exist");if(n.originalSize!==o.originalSize)throw new Error("inconsistent source and destination gpu data size");let i=Kn(n.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(n.gpuData.buffer,0,o.gpuData.buffer,0,i)}registerExternalBuffer(t,r,n){let o;if(n){if(o=n[0],t===n[1])return ue("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${r}) => id=${o}, buffer is the same, skip.`),o;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else o=Za();return this.storageCache.set(o,{gpuData:{id:o,type:0,buffer:t},originalSize:r}),ue("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${r}) => id=${o}, registered.`),o}unregisterExternalBuffer(t){t!==void 0&&(this.storageCache.delete(t),ue("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${t}`))}create(t,r=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=fm(t),o,i=(r&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(r&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||a){let c=(i?this.freeBuffers:this.freeUniformBuffers).get(n);c?c.length>0?o=c.pop():o=this.backend.device.createBuffer({size:n,usage:r}):o=this.backend.device.createBuffer({size:n,usage:r})}else o=this.backend.device.createBuffer({size:n,usage:r});let u={id:Za(),type:0,buffer:o};return this.storageCache.set(u.id,{gpuData:u,originalSize:Number(t)}),ue("verbose",()=>`[WebGPU] GpuDataManager.create(size=${t}) => id=${u.id}`),u}get(t){return this.storageCache.get(t)?.gpuData}release(t){let r=typeof t=="bigint"?Number(t):t,n=this.storageCache.get(r);if(!n){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return ue("verbose",()=>`[WebGPU] GpuDataManager.release(id=${r}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(r),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(t,r){let n=this.storageCache.get(Number(t));if(!n)throw new Error("data does not exist");await Zn(this.backend,n.gpuData.buffer,n.originalSize,r)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let t of this.buffersPending){let r=ja.get(t.size);if((t.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(t.size)||[];r===void 0||n.length>=r?t.destroy():n.push(t)}else if((t.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(t.size)||[];r===void 0||n.length>=r?t.destroy():n.push(t)}else t.destroy()}this.buffersPending=[]}else{let t=this.capturedPendingBuffers.get(this.backend.currentSessionId);t||(t=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,t));for(let r of this.buffersPending)t.push(r);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(t=>{t.forEach(r=>{r.destroy()})}),this.freeUniformBuffers.forEach(t=>{t.forEach(r=>{r.destroy()})}),this.storageCache.forEach(t=>{t.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(t=>{t.forEach(r=>{r.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(t){let r=this.capturedPendingBuffers.get(t);r&&(r.forEach(n=>{n.destroy()}),this.capturedPendingBuffers.delete(t)),this.sessionCount-=1,this.sessionCount===0&&(ue("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(n=>{n.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Ya=(...e)=>new jn(...e)});var Qn,te,Ae=N(()=>{"use strict";Qn=class{constructor(t){Object.assign(this,t)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(t=>`${this[t]}`).join(";")),this.key}},te=e=>new Qn(e)});var St,Xn,ve,ze,V,me,Jn,Tt,Fe,q,Ur,P,U,Ja,Nr,Yn,es,se=N(()=>{"use strict";re();ie();St=64,Xn=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},ve=(e,t=1)=>{let r=Xn(e,t);return typeof r=="string"?r:r[0]},ze=(e,t=1)=>{let r=Xn(e,t);return typeof r=="string"?r:r[1]},V=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:E.computeStrides(r)})}),t},me=e=>e%4===0?4:e%2===0?2:1,Jn=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Tt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Fe=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,q=(e,t,r,n)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?n==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:n==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Ur=(e,t,r,n,o)=>{let i=typeof r=="number",a=i?r:r.length,u=[...new Array(a).keys()],l=a<2?"u32":a<=4?`vec${a}<u32>`:`array<u32, ${a}>`,c=Xn(t,o),p=typeof c=="string"?c:c[1],m=typeof c=="string"?c:c[0],h={indices:l,value:p,storage:m,tensor:t},y=A=>typeof A=="string"?A:`${A}u`,g={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},_=i?"uniforms.":"",S=`${_}${e}_shape`,v=`${_}${e}_strides`,w="";for(let A=0;A<a-1;A++)w+=`
    let dim${A} = current / ${q(v,A,a)};
    let rest${A} = current % ${q(v,A,a)};
    indices[${A}] = dim${A};
    current = rest${A};
    `;w+=`indices[${a-1}] = current;`;let x=a<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${w}
    return indices;
  }`,T=A=>(g.offsetToIndices=!0,a<2?A:`o2i_${e}(${A})`),k=[];if(a>=2)for(let A=a-1;A>=0;A--)k.push(`${q(v,A,a)} * (indices[${A}])`);let C=a<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${k.join("+")};
  }`,O=A=>(g.indicesToOffset=!0,a<2?A:`i2o_${e}(${A})`),B=(...A)=>a===0?"0u":`${h.indices}(${A.map(y).join(",")})`,M=(A,W)=>a<2?`${A}`:`${q(A,W,a)}`,G=(A,W,pe)=>a<2?`${A}=${pe};`:`${q(A,W,a)}=${pe};`,K={},Y=(A,W)=>{g.broadcastedIndicesToOffset=!0;let pe=`${W.name}broadcastedIndicesTo${e}Offset`;if(pe in K)return`${pe}(${A})`;let Be=[];for(let Te=a-1;Te>=0;Te--){let Ie=W.indicesGet("outputIndices",Te+W.rank-a);Be.push(`${M(v,Te)} * (${Ie} % ${M(S,Te)})`)}return K[pe]=`fn ${pe}(outputIndices: ${W.type.indices}) -> u32 {
             return ${Be.length>0?Be.join("+"):"0u"};
           }`,`${pe}(${A})`},L=(A,W)=>(()=>{if(h.storage===h.value)return`${e}[${A}]=${W};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${A}]=vec2<u32>(u32(${W}), select(0u, 0xFFFFFFFFu, ${W} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${A}]=vec2<u32>(u32(${W}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${A}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${W}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),Q=A=>(()=>{if(h.storage===h.value)return`${e}[${A}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${A}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${A}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${A}] & 0xFFu), bool(${e}[${A}] & 0xFF00u), bool(${e}[${A}] & 0xFF0000u), bool(${e}[${A}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),xe=a<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${p} {
    return ${Q(`i2o_${e}(indices)`)};
  }`,F=a<2?"":(()=>{let A=u.map(pe=>`d${pe}: u32`).join(", "),W=u.map(pe=>`d${pe}`).join(", ");return`
  fn get_${e}(${A}) -> ${p} {
    return get_${e}ByIndices(${B(W)});
  }`})(),Z=(...A)=>{if(A.length!==a)throw new Error(`indices length must be ${a}`);let W=A.map(y).join(",");return a===0?Q("0u"):a===1?Q(W[0]):(g.get=!0,g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}(${W})`)},ne=A=>a<2?Q(A):(g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}ByIndices(${A})`),J=a<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${p}) {
    ${L(`i2o_${e}(indices)`,"value")}
  }`,de=a<2?"":(()=>{let A=u.map(pe=>`d${pe}: u32`).join(", "),W=u.map(pe=>`d${pe}`).join(", ");return`
  fn set_${e}(${A}, value: ${p}) {
    set_${e}ByIndices(${B(W)}, value);
  }`})();return{impl:()=>{let A=[],W=!1;return g.offsetToIndices&&(A.push(x),W=!0),g.indicesToOffset&&(A.push(C),W=!0),g.broadcastedIndicesToOffset&&(Object.values(K).forEach(pe=>A.push(pe)),W=!0),g.set&&(A.push(de),W=!0),g.setByIndices&&(A.push(J),W=!0),g.get&&(A.push(F),W=!0),g.getByIndices&&(A.push(xe),W=!0),!i&&W&&A.unshift(`const ${S} = ${h.indices}(${r.join(",")});`,`const ${v} = ${h.indices}(${E.computeStrides(r).join(",")});`),A.join(`
`)},type:h,offsetToIndices:T,indicesToOffset:O,broadcastedIndicesToOffset:Y,indices:B,indicesGet:M,indicesSet:G,set:(...A)=>{if(A.length!==a+1)throw new Error(`indices length must be ${a}`);let W=A[a];if(typeof W!="string")throw new Error("value must be string");let pe=A.slice(0,a).map(y).join(",");return a===0?L("0u",W):a===1?L(pe[0],W):(g.set=!0,g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}(${pe}, ${W})`)},setByOffset:L,setByIndices:(A,W)=>a<2?L(A,W):(g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}ByIndices(${A}, ${W});`),get:Z,getByOffset:Q,getByIndices:ne,usage:n,name:e,strides:v,shape:S,rank:a}},P=(e,t,r,n=1)=>Ur(e,t,r,"input",n),U=(e,t,r,n=1)=>Ur(e,t,r,"output",n),Ja=(e,t,r)=>Ur(e,t,r,"atomicOutput",1),Nr=(e,t,r,n=1)=>Ur(e,t,r,"internal",n),Yn=class{constructor(t,r){this.normalizedDispatchGroup=t;this.limits=r;this.internalVariables=[];this.variables=[];this.uniforms=[];this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(t){return`if (global_idx >= ${typeof t=="number"?`${t}u`:t}) { return; }`}mainStart(t=St){let r=typeof t=="number"?t:t[0],n=typeof t=="number"?1:t[1],o=typeof t=="number"?1:t[2];if(r>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||o>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${r}, ${n}, ${o}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(r*n*o>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${r}, ${n}, ${o}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,u=i?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${r*n*o}u + local_idx;`;return`@compute @workgroup_size(${r}, ${n}, ${o})
  fn main(${a}) {
    ${u}
  `}appendVariableUniforms(t){t.rank!==0&&(t.shape.startsWith("uniforms.")&&this.uniforms.push({name:t.shape.replace("uniforms.",""),type:"u32",length:t.rank}),t.strides.startsWith("uniforms.")&&this.uniforms.push({name:t.strides.replace("uniforms.",""),type:"u32",length:t.rank}))}declareVariable(t,r){if(t.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(t),this.appendVariableUniforms(t);let n=t.usage==="input"?"read":"read_write",o=t.usage==="atomicOutput"?"atomic<i32>":t.type.storage;return`@group(0) @binding(${r}) var<storage, ${n}> ${t.name}: array<${o}>;`}declareVariables(...t){return t.map(r=>this.declareVariable(r,this.variableIndex++)).join(`
`)}registerInternalVariable(t){if(t.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(t),this.appendVariableUniforms(t)}registerInternalVariables(...t){return t.forEach(r=>this.registerInternalVariable(r)),this}registerUniform(t,r,n=1){return this.uniforms.push({name:t,type:r,length:n}),this}registerUniforms(t){return this.uniforms=this.uniforms.concat(t),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let t=[];for(let{name:r,type:n,length:o}of this.uniforms)if(o&&o>4)n==="f16"?t.push(`@align(16) ${r}:array<mat2x4<${n}>, ${Math.ceil(o/8)}>`):t.push(`${r}:array<vec4<${n}>, ${Math.ceil(o/4)}>`);else{let i=o==null||o===1?n:`vec${o}<${n}>`;t.push(`${r}:${i}`)}return`
      struct Uniforms { ${t.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(t=>t.impl()).join(`
`)+this.internalVariables.map(t=>t.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let t=r=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(r)];return this.uniforms.map(r=>[t(r.type),r.length??1])}},es=(e,t)=>new Yn(e,t)});var gm,ts,ym,bm,_m,wm,Oe,rs,ns,ut=N(()=>{"use strict";re();ie();Ae();se();gm=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},ts=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),ym=(e,t)=>E.sortBasedOnPerm(e,ts(e.length,t)),bm=(e,t,r,n)=>{let o=`fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let i=0;i<t;++i)o+=`a[${e[i]}]=i[${i}];`;return o+="return a;}"},_m=(e,t)=>{let r=[],n=[];for(let o=0;o<e.length;++o)e[o]!==1&&r.push(e[o]),e[t[o]]!==1&&n.push(t[o]);return{newShape:r,newPerm:n}},wm=(e,t)=>{let r=0;for(let n=0;n<e.length;++n)if(t[e[n]]!==1){if(e[n]<r)return!1;r=e[n]}return!0},Oe=(e,t)=>{let r=e.dataType,n=e.dims.length,o=ts(n,t),i=ym(e.dims,o),a=e.dims,u=i,l=n<2||wm(o,e.dims),c;if(l)return c=_=>{let S=P("input",r,a,4),v=U("output",r,u,4);return`
  ${_.registerUniform("output_size","u32").declareVariables(S,v)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=E.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:c};let{newShape:p,newPerm:m}=_m(e.dims,o),h=E.areEqual(m,[2,3,1]),y=E.areEqual(m,[3,1,2]);if(p.length===2||h||y){a=h?[p[0],p[1]*p[2]]:y?[p[0]*p[1],p[2]]:p,u=[a[1],a[0]];let _=16;return c=S=>{let v=P("a",r,a.length),w=U("output",r,u.length);return`
  ${S.registerUniform("output_size","u32").declareVariables(v,w)}
  var<workgroup> tile : array<array<${w.type.value}, ${_+1}>, ${_}>;
  ${S.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${v.getByIndices(`${v.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${w.setByIndices(`${w.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let S=E.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/_),y:Math.ceil(u[0]/_)},programUniforms:[{type:12,data:S},...V(a,u)]}},getShaderSource:c}}return c=_=>{let S=P("a",r,a.length),v=U("output",r,u.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(S,v)}

  ${bm(o,n,S,v)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${v.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${v.setByOffset("global_idx",S.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let _=E.size(i);return{outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...V(a,u)]}},getShaderSource:c}},rs=(e,t)=>{gm(e.inputs,t.perm),e.compute(Oe(e.inputs[0],t.perm))},ns=e=>te({perm:e.perm})});var vm,$m,xm,Sm,Tm,Im,Cm,Am,km,Em,tt,os,is,as,ss,us,ls,ds,cs,ps,ms,fs=N(()=>{"use strict";re();ie();se();Vr();ut();vm={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},$m={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},xm={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Sm={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Tm=(e,t)=>{let r=[];for(let n=t-e;n<t;++n)r.push(n);return r},Im=(e,t)=>{let r=[],n=e.length;for(let i=0;i<n;i++)t.indexOf(i)===-1&&r.push(e[i]);let o=t.map(i=>e[i]);return[r,o]},Cm=(e,t)=>{let r=e.length+t.length,n=[],o=0;for(let i=0;i<r;i++)t.indexOf(i)===-1?n.push(e[o++]):n.push(1);return n},Am=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},km=(e,t)=>{let r=[];if(!Am(e,t)){for(let n=0;n<t;++n)e.indexOf(n)===-1&&r.push(n);e.forEach(n=>r.push(n))}return r},Em=(e,t,r,n,o,i,a)=>{let u=r[0].dims,l=E.size(i),c=E.size(a),p=P("_A",r[0].dataType,u),m=U("output",o,i),h=64;l===1&&(h=256);let y=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,g=_=>`
        ${_.registerUniform("reduceSize","u32").declareVariables(p,m)}
        ${y}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${_.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${xm[n]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${p.getByOffset("offset + k")});
           bestValue = ${vm[n]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${$m[n]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${m.setByOffset("outputIndex",`${n==="mean"?`${m.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${m.type.storage}(${Sm[n]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:g,getRunData:()=>({outputs:[{dims:i,dataType:o}],dispatchGroup:{x:l},programUniforms:[{type:12,data:c}]})}},tt=(e,t,r,n)=>{let o=e.inputs.length===1?r:eo(e.inputs,r),i=o.axes;i.length===0&&!o.noopWithEmptyAxes&&(i=e.inputs[0].dims.map((y,g)=>g));let a=E.normalizeAxes(i,e.inputs[0].dims.length),u=a,l=e.inputs[0],c=km(u,e.inputs[0].dims.length);c.length>0&&(l=e.compute(Oe(e.inputs[0],c),{inputs:[0],outputs:[-1]})[0],u=Tm(u.length,l.dims.length));let[p,m]=Im(l.dims,u),h=p;o.keepDims&&(h=Cm(p,a)),e.compute(Em(t,o.cacheKey,[l],n,e.inputs[0].dataType,h,m),{inputs:[l]})},os=(e,t)=>{tt(e,"ReduceMeanShared",t,"mean")},is=(e,t)=>{tt(e,"ReduceL1Shared",t,"l1")},as=(e,t)=>{tt(e,"ReduceL2Shared",t,"l2")},ss=(e,t)=>{tt(e,"ReduceLogSumExpShared",t,"logSumExp")},us=(e,t)=>{tt(e,"ReduceMaxShared",t,"max")},ls=(e,t)=>{tt(e,"ReduceMinShared",t,"min")},ds=(e,t)=>{tt(e,"ReduceProdShared",t,"prod")},cs=(e,t)=>{tt(e,"ReduceSumShared",t,"sum")},ps=(e,t)=>{tt(e,"ReduceSumSquareShared",t,"sumSquare")},ms=(e,t)=>{tt(e,"ReduceLogSumShared",t,"logSum")}});var rt,Pm,Wr,eo,nt,zm,Om,Dm,Bm,Rm,Mm,Um,Nm,Vm,Wm,ot,hs,gs,ys,bs,_s,ws,vs,$s,xs,Ss,Vr=N(()=>{"use strict";re();ie();Ae();se();fs();rt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Pm=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Wr=(e,t,r,n,o,i,a=!1,u=!1)=>{let l=[],c=r[0].dims,p=c.length,m=E.normalizeAxes(o,p),h=!u&&m.length===0;c.forEach((S,v)=>{h||m.indexOf(v)>=0?a&&l.push(1):l.push(S)});let y=l.length,g=E.size(l);return{name:e,shaderCache:t,getShaderSource:S=>{let v=[],w=P("_A",r[0].dataType,p),x=U("output",i,y),T=n(w,x,m),k=T[2];for(let C=0,O=0;C<p;C++)h||m.indexOf(C)>=0?(a&&O++,k=`for(var j${C}: u32 = 0; j${C} < ${c[C]}; j${C}++) {
                  ${T[2].includes("last_index")?`let last_index = j${C};`:""}
                  ${w.indicesSet("input_indices",C,`j${C}`)}
                  ${k}
                }`):(v.push(`${w.indicesSet("input_indices",C,x.indicesGet("output_indices",O))};`),O++);return`

        ${S.registerUniform("output_size","u32").declareVariables(w,x)}

        ${S.mainStart()}
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${w.type.indices};
          let output_indices = ${x.offsetToIndices("global_idx")};

          ${v.join(`
`)}
          ${T[0]}       // init ops for reduce max/min
          ${T[1]}
          ${k}
          ${T[3]}
          ${T.length===4?x.setByOffset("global_idx","value"):T.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:i}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...V(c,l)]})}},eo=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),te({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},nt=(e,t,r,n)=>{let o=e.inputs,i=o.length===1?r:eo(o,r);e.compute(Wr(t,{hint:i.cacheKey,inputDependencies:["rank"]},[o[0]],i.noopWithEmptyAxes&&i.axes.length===0?Pm:n,i.axes,o[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},zm=(e,t)=>{rt(e.inputs),nt(e,"ReduceLogSum",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,"value = log(value);"])},Om=(e,t)=>{rt(e.inputs),nt(e,"ReduceL1",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += abs(${n.getByIndices("input_indices")});`,""])},Dm=(e,t)=>{rt(e.inputs),nt(e,"ReduceL2",t,(n,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Bm=(e,t)=>{rt(e.inputs),nt(e,"ReduceLogSumExp",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += exp(${n.getByIndices("input_indices")});`,"value = log(value);"])},Rm=(e,t)=>{rt(e.inputs),nt(e,"ReduceMax",t,(n,o,i)=>{let a=[];for(let u=0;u<n.rank;u++)(i.indexOf(u)>=0||i.length===0)&&a.push(n.indicesSet("input_indices",u,0));return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = max(value, ${n.getByIndices("input_indices")});`,""]})},Mm=(e,t)=>{rt(e.inputs),nt(e,"ReduceMean",t,(n,o,i)=>{let a=1;for(let u=0;u<n.rank;u++)(i.indexOf(u)>=0||i.length===0)&&(a*=e.inputs[0].dims[u]);return["var sum = f32(0);","",`sum += f32(${n.getByIndices("input_indices")});`,`let value = ${o.type.value}(sum / ${a});`]})},Um=(e,t)=>{rt(e.inputs),nt(e,"ReduceMin",t,(n,o,i)=>{let a=[];for(let u=0;u<n.rank;u++)(i.indexOf(u)>=0||i.length===0)&&a.push(`input_indices[${u}] = 0;`);return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = min(value, ${n.getByIndices("input_indices")});`,""]})},Nm=(e,t)=>{rt(e.inputs),nt(e,"ReduceProd",t,(n,o)=>[`var value = ${o.type.storage}(1);`,"",`value *= ${n.getByIndices("input_indices")};`,""])},Vm=(e,t)=>{rt(e.inputs),nt(e,"ReduceSum",t,(n,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,""])},Wm=(e,t)=>{rt(e.inputs),nt(e,"ReduceSumSquare",t,(n,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += t * t;`,""])},ot=(e,t,r)=>{if(t.length===0)return r;let n=1,o=1;for(let i=0;i<t.length;i++)t.indexOf(i)===-1?n*=e[i]:o*=e[i];return o<32&&n>1024},hs=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Mm(e,t):os(e,t)},gs=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Om(e,t):is(e,t)},ys=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Dm(e,t):as(e,t)},bs=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Bm(e,t):ss(e,t)},_s=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Rm(e,t):us(e,t)},ws=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Um(e,t):ls(e,t)},vs=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Nm(e,t):ds(e,t)},$s=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vm(e,t):cs(e,t)},xs=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wm(e,t):ps(e,t)},Ss=(e,t)=>{ot(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?zm(e,t):ms(e,t)}});var Ts,Is,Cs,to,As=N(()=>{"use strict";re();Ae();Vr();Ts=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Is=(e,t)=>{Ts(e.inputs);let r=(n,o,i)=>{let a=[];for(let u=0;u<n.rank;u++)(i.indexOf(u)>=0||i.length===0)&&a.push(`input_indices[${u}] = 0;`);return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${n.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};e.compute(Wr("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Cs=(e,t)=>{Ts(e.inputs);let r=(n,o,i)=>{let a=[];for(let u=0;u<n.rank;u++)(i.indexOf(u)>=0||i.length===0)&&a.push(`input_indices[${u}] = 0;`);return[`${a.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${n.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${n.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};e.compute(Wr("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},to=e=>te(e)});var Lm,ro,Gm,Hm,Fm,Dt,qm,ks,Lr=N(()=>{"use strict";re();ie();Mr();se();Lm=(e,t)=>{let r=e[0],n=e[1],o=e[2],i=e[3],a=e[4],u=e[5];if(a&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],c=r.dims[1],p=r.dims[2];if(o.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(n.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(n.dims[0]!==p)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(o.dims[0]!==n.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let m=o.dims[0]/3,h=m,y=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let x of t.qkvHiddenSizes)if(x%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");m=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],y=t.qkvHiddenSizes[2]}let g=c;if(m!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(o.dims[0]!==m+h+y)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let _=0;if(a){if(h!==y)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(a.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(a.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(a.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(a.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(a.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(_=a.dims[3])}let S=g+_,v=-1,w=0;if(i)throw new Error("Mask not supported");if(a)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==c||u.dims[3]!==S)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:c,pastSequenceLength:_,kvSequenceLength:g,totalSequenceLength:S,maxSequenceLength:v,inputHiddenSize:p,hiddenSize:m,vHiddenSize:y,headSize:Math.floor(m/t.numHeads),vHeadSize:Math.floor(y/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},ro=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Gm=(e,t,r,n,o,i,a,u)=>{let l=me(a?1:i),c=64,p=i/l;p<c&&(c=32);let m=Math.ceil(i/l/c),h=[{type:12,data:t},{type:12,data:r},{type:12,data:n},{type:12,data:o},{type:12,data:p},{type:12,data:m}],y=ve(e.dataType,l),g=ze(1,l),_=["type"];a&&_.push("type"),u&&_.push("type");let S=v=>{let w=U("x",e.dataType,e.dims,l),x=[w],T=a?P("seq_lens",a.dataType,a.dims):void 0;T&&x.push(T);let k=u?P("total_sequence_length_input",u.dataType,u.dims):void 0;k&&x.push(k);let C=ze(e.dataType),O=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${c}>;
  var<workgroup> thread_sum: array<f32, ${c}>;
  ${v.registerUniforms(O).declareVariables(...x)}
  ${v.mainStart([c,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${ro(T,k,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${c}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${a?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${g}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${g}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${c}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${g}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${g}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${c}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${C}(1.0) / ${C}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${g}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${a?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${C}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${c};${y};${l}`,inputDependencies:_},getShaderSource:S,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:o,z:t*r},programUniforms:h})}},Hm=(e,t,r,n,o,i,a,u,l)=>{let c=a+i.kvSequenceLength,p=[i.batchSize,i.numHeads,i.sequenceLength,c],m=e>1&&n,h=i.kvNumHeads?i.kvNumHeads:i.numHeads,y=m?[i.batchSize,h,c,i.headSize]:void 0,g=i.nReps?i.nReps:1,_=i.scale===0?1/Math.sqrt(i.headSize):i.scale,S=me(i.headSize),v=i.headSize/S,w=12,x={x:Math.ceil(c/w),y:Math.ceil(i.sequenceLength/w),z:i.batchSize*i.numHeads},T=[{type:12,data:i.sequenceLength},{type:12,data:v},{type:12,data:c},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:1,data:_},{type:12,data:a},{type:12,data:i.kvSequenceLength},{type:12,data:g}],k=m&&n&&E.size(n.dims)>0,C=["type","type"];k&&C.push("type"),o&&C.push("type"),u&&C.push("type"),l&&C.push("type");let O=[{dims:p,dataType:t.dataType,gpuDataType:0}];m&&O.push({dims:y,dataType:t.dataType,gpuDataType:0});let B=M=>{let G=P("q",t.dataType,t.dims,S),K=P("key",r.dataType,r.dims,S),Y=[G,K];if(k){let J=P("past_key",n.dataType,n.dims,S);Y.push(J)}o&&Y.push(P("attention_bias",o.dataType,o.dims));let L=u?P("seq_lens",u.dataType,u.dims):void 0;L&&Y.push(L);let Q=l?P("total_sequence_length_input",l.dataType,l.dims):void 0;Q&&Y.push(Q);let xe=U("output",t.dataType,p),F=[xe];m&&F.push(U("present_key",t.dataType,y,S));let Z=ze(1,S),ne=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${G.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${G.type.storage}, ${w*w}>;
  ${M.registerUniforms(ne).declareVariables(...Y,...F)}
  ${M.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${g===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${g===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${ro(L,Q,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${k&&m?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${m?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${Z}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${k&&m?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${m?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${Z}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(S){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${S}`)}})()};
        output[outputIdx] = ${xe.type.value} (sum * uniforms.alpha) + ${o?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${S};${o!==void 0};${n!==void 0};${e}`,inputDependencies:C},getRunData:()=>({outputs:O,dispatchGroup:x,programUniforms:T}),getShaderSource:B}},Fm=(e,t,r,n,o,i,a=void 0,u=void 0)=>{let l=i+o.kvSequenceLength,c=o.nReps?o.nReps:1,p=o.vHiddenSize*c,m=e>1&&n,h=o.kvNumHeads?o.kvNumHeads:o.numHeads,y=m?[o.batchSize,h,l,o.headSize]:void 0,g=[o.batchSize,o.sequenceLength,p],_=12,S={x:Math.ceil(o.vHeadSize/_),y:Math.ceil(o.sequenceLength/_),z:o.batchSize*o.numHeads},v=[{type:12,data:o.sequenceLength},{type:12,data:l},{type:12,data:o.vHeadSize},{type:12,data:o.numHeads},{type:12,data:o.headSize},{type:12,data:p},{type:12,data:i},{type:12,data:o.kvSequenceLength},{type:12,data:c}],w=m&&n&&E.size(n.dims)>0,x=["type","type"];w&&x.push("type"),a&&x.push("type"),u&&x.push("type");let T=[{dims:g,dataType:t.dataType,gpuDataType:0}];m&&T.push({dims:y,dataType:t.dataType,gpuDataType:0});let k=C=>{let O=P("probs",t.dataType,t.dims),B=P("v",r.dataType,r.dims),M=[O,B];w&&M.push(P("past_value",n.dataType,n.dims));let G=a?P("seq_lens",a.dataType,a.dims):void 0;a&&M.push(G);let K=u?P("total_sequence_length_input",u.dataType,u.dims):void 0;u&&M.push(K);let L=[U("output",t.dataType,g)];m&&L.push(U("present_value",t.dataType,y));let Q=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;
  var<workgroup> tileQ: array<${O.type.value}, ${_*_}>;
  var<workgroup> tileV: array<${O.type.value}, ${_*_}>;
  ${C.registerUniforms(Q).declareVariables(...M,...L)}
  ${C.mainStart([_,_,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${c===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${c===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${ro(G,K,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${w&&m?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${m?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${O.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${w&&m?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${m?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${n!==void 0};${e}`,inputDependencies:x},getRunData:()=>({outputs:T,dispatchGroup:S,programUniforms:v}),getShaderSource:k}},Dt=(e,t,r,n,o,i,a,u,l,c,p=void 0,m=void 0)=>{let h=Math.min(e.outputCount,1+(a?1:0)+(u?1:0)),y=h>1?c.pastSequenceLength:0,g=y+c.kvSequenceLength,_=l&&E.size(l.dims)>0?l:void 0,S=[t,r];h>1&&a&&E.size(a.dims)>0&&S.push(a),_&&S.push(_),p&&S.push(p),m&&S.push(m);let v=e.compute(Hm(h,t,r,a,_,c,y,p,m),{inputs:S,outputs:h>1?[-1,1]:[-1]})[0];e.compute(Gm(v,c.batchSize,c.numHeads,y,c.sequenceLength,g,p,m),{inputs:p&&m?[v,p,m]:[v],outputs:[]});let w=[v,n];h>1&&u&&E.size(u.dims)>0&&w.push(u),p&&w.push(p),m&&w.push(m),e.compute(Fm(h,v,n,u,c,y,p,m),{inputs:w,outputs:h>1?[0,2]:[0]})},qm=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],n=t.sequenceLength,o=t.inputHiddenSize,i=t.headSize,a=12,u={x:Math.ceil(t.headSize/a),y:Math.ceil(t.sequenceLength/a),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],c=[{type:12,data:n},{type:12,data:o},{type:12,data:i},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],p=m=>{let h=U("output_q",l[0].dataType,r),y=U("output_k",l[0].dataType,r),g=U("output_v",l[0].dataType,r),_=P("input",l[0].dataType,l[0].dims),S=P("weight",l[1].dataType,l[1].dims),v=P("bias",l[2].dataType,l[2].dims),w=_.type.storage,x=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${a}u;
  var<workgroup> tileInput: array<${w}, ${a*a}>;
  var<workgroup> tileWeightQ: array<${w}, ${a*a}>;
  var<workgroup> tileWeightK: array<${w}, ${a*a}>;
  var<workgroup> tileWeightV: array<${w}, ${a*a}>;
  ${m.registerUniforms(x).declareVariables(_,S,v,h,y,g)}
  ${m.mainStart([a,a,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${w}(0);
    var valueK = ${w}(0);
    var valueV = ${w}(0);
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:c}),getShaderSource:p},{inputs:l,outputs:[-1,-1,-1]})},ks=(e,t)=>{let r=Lm(e.inputs,t),[n,o,i]=qm(e,r);return Dt(e,n,o,i,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}});var Km,jm,Zm,Es,Ps=N(()=>{"use strict";Le();re();ie();Ae();se();Km=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(n,o,i)=>{let a=o.length;if(a!==n.length)throw new Error(`${i}: num dimensions != ${a}`);o.forEach((u,l)=>{if(u!==n[l])throw new Error(`${i}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let n=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,n,"Invalid input scale"),r(e[2].dims,n,"Invalid input B"),r(e[3].dims,n,"Invalid input mean"),r(e[4].dims,n,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},jm=(e,t)=>{let{epsilon:r,spatial:n,format:o}=t,i=e[0].dims,a=n?me(i[i.length-1]):1,u=o==="NHWC"&&i.length>1?a:1,l=E.size(i)/a,c=n,p=c?i.length:i,m=P("x",e[0].dataType,e[0].dims,a),h=P("scale",e[1].dataType,e[1].dims,u),y=P("bias",e[2].dataType,e[2].dims,u),g=P("inputMean",e[3].dataType,e[3].dims,u),_=P("inputVar",e[4].dataType,e[4].dims,u),S=U("y",e[0].dataType,p,a),v=()=>{let x="";if(n)x=`let cOffset = ${i.length===1?"0u":o==="NHWC"?`outputIndices[${i.length-1}] / ${a}`:"outputIndices[1]"};`;else if(o==="NCHW")x=`
            ${S.indicesSet("outputIndices","0","0")}
            let cOffset = ${S.indicesToOffset("outputIndices")};`;else{x=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let T=1;T<h.rank;T++)x+=`cIndices[${T}] = outputIndices[${T}];`;x+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return x},w=x=>`
  const epsilon = ${r};
  ${x.registerUniform("outputSize","u32").declareVariables(m,h,y,g,_,S)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${S.offsetToIndices(`global_idx * ${a}`)};
    ${v()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${y.getByOffset("cOffset")};
    let inputMean = ${g.getByOffset("cOffset")};
    let inputVar = ${_.getByOffset("cOffset")};
    let x = ${m.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${S.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${n}_${a}`,inputDependencies:c?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c?[{type:12,data:l},...V(i)]:[{type:12,data:l}]})}},Zm=e=>te(e),Es=(e,t)=>{let{inputs:r,outputCount:n}=e,o=Zm({...t,outputCount:n});if(we.webgpu.validateInputContent&&Km(r,o),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(jm(r,o))}});var Qm,Ym,zs,Os=N(()=>{"use strict";ie();se();Qm=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Ym=e=>{let t=e[0].dims,r=e[0].dims[2],n=E.size(t)/4,o=e[0].dataType,i=P("input",o,t,4),a=P("bias",o,[r],4),u=P("residual",o,t,4),l=U("output",o,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:p=>`
  const channels = ${r}u / 4;
  ${p.declareVariables(i,a,u,l)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let value = ${i.getByOffset("global_idx")}
      + ${a.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},zs=e=>{Qm(e.inputs),e.compute(Ym(e.inputs))}});var Xm,he,Ds,Bs,Rs,Ms,Us,Ns,Vs,Ws,Ls,Jm,Gs,Hs,Fs,qs,Qt,Ks,Gr,js,Zs,Qs,Ys,Xs,Js,eu,tu,ru,nu,ou,iu,au,su,uu,lu,du,cu,no,oo,pu,mu,fu,ef,tf,hu,Hr=N(()=>{"use strict";re();ie();Ae();se();Xm=(e,t,r,n,o,i,a)=>{let u=Math.ceil(t/4),l="";typeof o=="string"?l=`${o}(a)`:l=o("a");let c=P("inputData",r,[u],4),p=U("outputData",n,[u],4),m=[{name:"vec_size",type:"u32"}];return a&&m.push(...a),`
      ${e.registerUniforms(m).declareVariables(c,p)}

  ${i??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${c.getByOffset("global_idx")};
    ${p.setByOffset("global_idx",l)}
  }`},he=(e,t,r,n,o,i=e.dataType,a,u)=>{let l=[{type:12,data:Math.ceil(E.size(e.dims)/4)}];return a&&l.push(...a),{name:t,shaderCache:{hint:o,inputDependencies:["type"]},getShaderSource:c=>Xm(c,E.size(e.dims),e.dataType,i,r,n,u),getRunData:c=>({outputs:[{dims:e.dims,dataType:i}],dispatchGroup:{x:Math.ceil(E.size(c[0].dims)/64/4)},programUniforms:l})}},Ds=e=>{e.compute(he(e.inputs[0],"Abs","abs"))},Bs=e=>{e.compute(he(e.inputs[0],"Acos","acos"))},Rs=e=>{e.compute(he(e.inputs[0],"Acosh","acosh"))},Ms=e=>{e.compute(he(e.inputs[0],"Asin","asin"))},Us=e=>{e.compute(he(e.inputs[0],"Asinh","asinh"))},Ns=e=>{e.compute(he(e.inputs[0],"Atan","atan"))},Vs=e=>{e.compute(he(e.inputs[0],"Atanh","atanh"))},Ws=e=>te(e),Ls=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(he(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Jm=e=>{let t,r,n=e.length>=2&&e[1].data!==0,o=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=n?e[1].getFloat32Array()[0]:-34028234663852886e22,r=o?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=n?e[1].getUint16Array()[0]:64511,r=o?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return te({min:t,max:r})},Gs=(e,t)=>{let r=t||Jm(e.inputs),n=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"Clip",o=>`clamp(${o}, vec4<${n}>(uniforms.min), vec4<${n}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:n},{name:"max",type:n}]),{inputs:[0]})},Hs=e=>{e.compute(he(e.inputs[0],"Ceil","ceil"))},Fs=e=>{e.compute(he(e.inputs[0],"Cos","cos"))},qs=e=>{e.compute(he(e.inputs[0],"Cosh","cosh"))},Qt=e=>te(e),Ks=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"Elu",n=>`elu_vf32(${n})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Gr=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,js=e=>{let t=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,Gr(t)))},Zs=e=>{e.compute(he(e.inputs[0],"Exp","exp"))},Qs=e=>{e.compute(he(e.inputs[0],"Floor","floor"))},Ys=e=>{let t=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,Gr(t)))},Xs=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"LeakyRelu",n=>`select(leaky_relu_alpha_ * ${n}, ${n}, ${n} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Js=e=>{e.compute(he(e.inputs[0],"Not",t=>`!${t}`))},eu=e=>{e.compute(he(e.inputs[0],"Neg",t=>`-${t}`))},tu=e=>{e.compute(he(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},ru=e=>{let t=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},nu=e=>{e.compute(he(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},ou=e=>te(e),iu=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"HardSigmoid",n=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${n} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},au=e=>{e.compute(he(e.inputs[0],"Sin","sin"))},su=e=>{e.compute(he(e.inputs[0],"Sinh","sinh"))},uu=e=>{e.compute(he(e.inputs[0],"Sqrt","sqrt"))},lu=e=>{e.compute(he(e.inputs[0],"Tan","tan"))},du=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,cu=e=>{e.compute(he(e.inputs[0],"Tanh",du))},no=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${du("v")};
}
`,oo=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,pu=e=>{let t=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"FastGelu",oo,no(t),void 0,e.inputs[0].dataType))},mu=(e,t)=>{let r=ze(e.inputs[0].dataType);return e.compute(he(e.inputs[0],"ThresholdedRelu",n=>`select(vec4<${r}>(0.0), ${n}, ${n} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},fu=e=>{e.compute(he(e.inputs[0],"Log","log"))},ef=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,tf=e=>`quick_gelu_impl(${e})`,hu=(e,t)=>{let r=ze(e.inputs[0].dataType);e.compute(he(e.inputs[0],"QuickGelu",tf,ef(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}});var rf,nf,yu,bu=N(()=>{"use strict";ie();se();Hr();rf=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},nf=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=P("input",e[0].dataType,e[0].dims,4),n=P("bias",e[0].dataType,[e[0].dims[2]],4),o=U("output",e[0].dataType,t,4),i=E.size(t)/4,a=ve(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:l=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${l.declareVariables(r,n,o)}

  ${Gr(a)}

  ${l.mainStart()}
    ${l.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${o.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},yu=e=>{rf(e.inputs),e.compute(nf(e.inputs))}});var of,af,it,_u,wu,vu,$u,xu,Su,Tu,Iu,Cu,Au,ku=N(()=>{"use strict";re();ie();se();of=(e,t,r,n,o,i,a,u,l,c,p,m)=>{let h,y;typeof u=="string"?h=y=(w,x)=>`${u}((${w}),(${x}))`:typeof u=="function"?h=y=u:(h=u.scalar,y=u.vector);let g=U("outputData",p,n.length,4),_=P("aData",l,t.length,4),S=P("bData",c,r.length,4),v;if(o)if(i){let w=E.size(t)===1,x=E.size(r)===1,T=t.length>0&&t[t.length-1]%4===0,k=r.length>0&&r[r.length-1]%4===0;w||x?v=g.setByOffset("global_idx",y(w?`${_.type.value}(${_.getByOffset("0")}.x)`:_.getByOffset("global_idx"),x?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"))):v=`
            let outputIndices = ${g.offsetToIndices("global_idx * 4u")};
            let offsetA = ${_.broadcastedIndicesToOffset("outputIndices",g)};
            let offsetB = ${S.broadcastedIndicesToOffset("outputIndices",g)};
            ${g.setByOffset("global_idx",y(a||T?_.getByOffset("offsetA / 4u"):`${_.type.value}(${_.getByOffset("offsetA / 4u")}[offsetA % 4u])`,a||k?S.getByOffset("offsetB / 4u"):`${S.type.value}(${S.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else v=g.setByOffset("global_idx",y(_.getByOffset("global_idx"),S.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(x,T,k="")=>{let C=`aData[indexA${T}][componentA${T}]`,O=`bData[indexB${T}][componentB${T}]`;return`
            let outputIndices${T} = ${g.offsetToIndices(`global_idx * 4u + ${T}u`)};
            let offsetA${T} = ${_.broadcastedIndicesToOffset(`outputIndices${T}`,g)};
            let offsetB${T} = ${S.broadcastedIndicesToOffset(`outputIndices${T}`,g)};
            let indexA${T} = offsetA${T} / 4u;
            let indexB${T} = offsetB${T} / 4u;
            let componentA${T} = offsetA${T} % 4u;
            let componentB${T} = offsetB${T} % 4u;
            ${x}[${T}] = ${k}(${h(C,O)});
          `};p===9?v=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:v=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(_,S,g)}

        ${m??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${v}
      }`},af=(e,t,r,n,o,i,a=r.dataType)=>{let u=r.dims.map(_=>Number(_)??1),l=n.dims.map(_=>Number(_)??1),c=!E.areEqual(u,l),p=u,m=E.size(u),h=!1,y=!1,g=[c];if(c){let _=et.calcShape(u,l,!1);if(!_)throw new Error("Can't perform binary op on the given tensors");p=_.slice(),m=E.size(p);let S=E.size(u)===1,v=E.size(l)===1,w=u.length>0&&u[u.length-1]%4===0,x=l.length>0&&l[l.length-1]%4===0;g.push(S),g.push(v),g.push(w),g.push(x);let T=1;for(let k=1;k<p.length;k++){let C=u[u.length-k],O=l[l.length-k];if(C===O)T*=C;else break}T%4===0?(y=!0,h=!0):(S||v||w||x)&&(h=!0)}else h=!0;return g.push(h),{name:e,shaderCache:{hint:t+g.map(_=>_.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:_=>of(_,u,l,p,h,c,y,o,r.dataType,n.dataType,a,i),getRunData:()=>({outputs:[{dims:p,dataType:a}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(E.size(p)/4)},...V(u,l,p)]})}},it=(e,t,r,n,o,i)=>{e.compute(af(t,o??"",e.inputs[0],e.inputs[1],r,n,i))},_u=e=>{it(e,"Add",(t,r)=>`${t}+${r}`)},wu=e=>{it(e,"Div",(t,r)=>`${t}/${r}`)},vu=e=>{it(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},$u=e=>{it(e,"Mul",(t,r)=>`${t}*${r}`)},xu=e=>{let t=P("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;it(e,"Pow",{scalar:(n,o)=>`pow_custom(${n},${o})`,vector:(n,o)=>`pow_vector_custom(${n},${o})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Su=e=>{it(e,"Sub",(t,r)=>`${t}-${r}`)},Tu=e=>{it(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Iu=e=>{it(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Cu=e=>{it(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Au=e=>{it(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}});var uf,lf,df,cf,Eu,Pu,zu=N(()=>{"use strict";re();ie();Ae();se();uf=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,n=e[r],o=n.dataType,i=n.dims.length;e.forEach((a,u)=>{if(u!==r){if(a.dataType!==o)throw new Error("input tensors should be one type");if(a.dims.length!==i)throw new Error("input tensors should have the same shape");a.dims.forEach((l,c)=>{if(c!==t&&l!==n.dims[c])throw new Error("non concat dimensions must match")})}})},lf=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,df=(e,t)=>{let r=e.length,n=[];for(let o=0;o<r;++o){let i=t.setByOffset("global_idx",e[o].getByIndices("indices"));r===1?n.push(i):o===0?n.push(`if (inputIndex == ${o}u) { ${i} }`):o===r-1?n.push(`else { ${i} }`):n.push(`else if (inputIndex == ${o}) { ${i} }`)}return n.join(`
`)},cf=(e,t,r,n)=>{let o=E.size(r),i=new Array(e.length),a=new Array(e.length),u=0,l=[],c=[],p=[{type:12,data:o}];for(let _=0;_<e.length;++_)u+=e[_].dims[t],i[_]=u,c.push(e[_].dims.length),a[_]=P(`input${_}`,n,c[_]),l.push("rank"),p.push({type:12,data:i[_]});for(let _=0;_<e.length;++_)p.push(...V(e[_].dims));p.push(...V(r));let m=U("output",n,r.length),h=m.indicesGet("indices",t),y=Array.from(Array(i.length).keys()).map(_=>`uniforms.sizeInConcatAxis${_}`).join(","),g=_=>`

  ${(()=>{_.registerUniform("outputSize","u32");for(let S=0;S<e.length;S++)_.registerUniform(`sizeInConcatAxis${S}`,"u32");return _.declareVariables(...a,m)})()}

  ${lf(i.length,y)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${m.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${y});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${df(a,m)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:p}),getShaderSource:g}},Eu=(e,t)=>{let r=e.inputs,n=r[0].dims,o=E.normalizeAxis(t.axis,n.length);uf(r,o);let i=n.slice();i[o]=r.reduce((u,l)=>u+(l.dims.length>o?l.dims[o]:0),0);let a=r.filter(u=>E.size(u.dims)>0);e.compute(cf(a,o,i,r[0].dataType),{inputs:a})},Pu=e=>te({axis:e.axis})});var qe,Ke,je,Fr,ft=N(()=>{"use strict";re();ie();qe=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Ke=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},je=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Fr=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,n]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:n}}else if(t==="Clip"){let[r,n]=e?.activation_params||[Va,Wa];return{activation:t,clipMax:n,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}});var Ee,Ou,qr=N(()=>{"use strict";Ee=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Ou=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `});var Du,Bu=N(()=>{"use strict";Du=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`});var Yt,Kr,jr=N(()=>{"use strict";re();ie();se();ft();Yt=(e,t,r,n,o)=>{let i=n-r;return`
      ${Array.from({length:r}).map((a,u)=>`
      if (${q(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,q(o,u+i,n))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Kr=(e,t,r,n,o=!1,i)=>{let a=e[0].dims,u=e[1].dims,l=a[a.length-2],c=u[u.length-1],p=a[a.length-1],m=me(c),h=me(p),y=me(l),g=E.size(r)/m/y,_=e.length>2,S=n?n.slice(0,-2):r.slice(0,-2),w=[E.size(S),l,c],x=[{type:12,data:g},{type:12,data:l},{type:12,data:c},{type:12,data:p}];Ke(t,x),x.push(...V(S,a,u)),_&&x.push(...V(e[2].dims)),x.push(...V(w));let T=k=>{let C=Nr("batch_dims",e[0].dataType,S.length),O=P("a",e[0].dataType,a.length,h),B=P("b",e[1].dataType,u.length,m),M=U("output",e[0].dataType,w.length,m),G=ve(M.type.tensor),K=qe(t,M.type.value,G),Y=[O,B],L="";if(_){let F=o?m:1;Y.push(P("bias",e[2].dataType,e[2].dims.length,F)),L=`${o?`value += bias[col / ${F}];`:`value += ${M.type.value}(bias[row + i]);`}`}let Q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];je(t,Q);let xe=()=>{let F=`var a_data: ${O.type.value};`;for(let Z=0;Z<h;Z++)F+=`
              let b_data${Z} = b[(b_offset + (k + ${Z}) * uniforms.N + col) / ${m}];`;for(let Z=0;Z<y;Z++){F+=`a_data = a[(a_offset + (row + ${Z}) * uniforms.K + k) / ${h}];`;for(let ne=0;ne<h;ne++)F+=`
            values[${Z}] = fma(${B.type.value}(a_data${h===1?"":`[${ne}]`}), b_data${ne}, values[${Z}]);
`}return F};return`
  ${k.registerUniforms(Q).registerInternalVariables(C).declareVariables(...Y,M)}
  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${m})) * ${m};
    var index1 = global_idx / (uniforms.N / ${m});
    let stride1 = uniforms.M / ${y};
    let row = (index1 % stride1) * ${y};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${C.offsetToIndices("batch")};`}

    var a_indices: ${O.type.indices};
    ${Yt("a_indices",O,O.rank-2,C.rank,"batch_indices")}
    ${O.indicesSet("a_indices",O.rank-2,0)}
    ${O.indicesSet("a_indices",O.rank-1,0)}
    let a_offset = ${O.indicesToOffset("a_indices")};

    var b_indices: ${B.type.indices};
    ${Yt("b_indices",B,B.rank-2,C.rank,"batch_indices")}
    ${B.indicesSet("b_indices",B.rank-2,0)}
    ${B.indicesSet("b_indices",B.rank-1,0)}
    let b_offset = ${B.indicesToOffset("b_indices")};
    var values: array<${M.type.value}, ${y}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${xe()}
    }
    for (var i = 0u; i < ${y}u; i++) {
      var value = values[i];
      ${L}
      ${K}
      let cur_indices = ${M.type.indices}(batch, row + i, col);
      let offset = ${M.indicesToOffset("cur_indices")};
      ${M.setByOffset(`offset / ${m}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${m};${h};${y};${o}`,inputDependencies:_?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:x}),getShaderSource:T}}});var pf,mf,io,Ru,ff,ao,hf,Xt,Zr=N(()=>{"use strict";re();ie();se();ft();jr();qr();pf=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,mf=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,io=(e,t,r="f32",n,o=!1,i=32,a=!1,u=32)=>{let l=t[1]*e[1],c=t[0]*e[0],p=o?l:i,m=o?i:l,h=p/t[0],y=i/t[1];if(!((o&&h===4&&e[1]===4||!o&&(h===3||h===4))&&p%t[0]===0&&i%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${o} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${r}>, ${p/h}>, ${m}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${c/e[0]}>, ${i}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${a?"0":"i32(globalId.z)"};
  ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${a?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${a?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${y};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${pf(o,n)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${n?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${mf(o,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Ru=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,ff=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",ao=(e,t,r="f32",n,o=!1,i=32,a=!1,u=32,l=!1)=>{let c=e[1]*t[1],p=e[0]*t[0],m=o?c:i,h=o?i:c;if(!(h%t[1]===0&&m%t[0]===0&&i%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${m} must be divisible by workgroupSize[0]${t[0]}, tileInner ${i} must be divisible by workgroupSize[1]${t[1]}`);let y=h/t[1],g=m/t[0],_=i/t[1],S=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${c};
    let globalColStart = i32(workgroupId.x) * ${p};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${t[0]}) {
          ${Ru(o,n)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${n?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${o?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${c};

let tileRowA = i32(localId.y) * ${y};
let tileColA = i32(localId.x) * ${g};
let tileRowB = i32(localId.y) * ${_};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${y}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${g}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Ru(o,n)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${n?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${ff(o)}
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
  var<workgroup> mm_Asub : array<array<${r}, ${m}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${p}>, ${i}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${i};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${a?"0":"i32(globalId.z)"};
    ${n?`let batchIndices = ${n.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${a?`${Math.ceil(u/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${a?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${S}
  }
`},hf=(e,t,r,n,o=!1)=>{let[i,a,u,l]=n,c=ve(n[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Ee(e,c)} {
      var value = ${Ee(e,c)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${a.type.indices};
        ${Yt("aIndices",a,a.rank-2,i.rank,"batchIndices")}
        ${a.indicesSet("aIndices",a.rank-2,"u32(row)")}
        ${a.indicesSet("aIndices",a.rank-1,"u32(colIn)")}
        value = ${a.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${Ee(e,c)} {
      var value = ${Ee(e,c)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${Yt("bIndices",u,u.rank-2,i.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ee(e,c)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${o?"bias[colIn]":`${Ee(e,c)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Xt=(e,t,r,n,o=!1,i)=>{let a=e[0].dims,u=e[1].dims,l=a.slice(0,-2),c=u.slice(0,-2),p=n?n.slice(0,-2):r.slice(0,-2),m=E.size(p),h=a[a.length-2],y=a[a.length-1],g=u[u.length-1],_=y%4===0&&g%4===0,S=h<=8?[4,1,1]:[4,4,1],v=[8,8,1],w=[Math.ceil(g/v[0]/S[0]),Math.ceil(h/v[1]/S[1]),Math.ceil(m/v[2]/S[2])],x=_?4:1,T=[...l,h,y/x],k=T.length,C=[...c,y,g/x],O=C.length,B=[m,h,g/x],M=[{type:6,data:h},{type:6,data:g},{type:6,data:y}];Ke(t,M),M.push(...V(p,T,C));let G=["rank","rank"],K=e.length>2;K&&(M.push(...V(e[2].dims)),G.push("rank")),M.push(...V(B));let Y=L=>{let Q=p.length,xe=Nr("batchDims",e[0].dataType,Q,1),F=ve(e[0].dataType),Z=P("a",e[0].dataType,k,x),ne=P("b",e[1].dataType,O,x),J=U("result",e[0].dataType,B.length,x),de=[Z,ne];if(K){let W=o?x:1;de.push(P("bias",e[2].dataType,e[2].dims.length,W))}let ye=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];je(t,ye);let $e=ve(J.type.tensor),oe=qe(t,J.type.value,$e),A=hf(x,K,oe,[xe,Z,ne,J],o);return`
  ${L.registerUniforms(ye).registerInternalVariables(xe).declareVariables(...de,J)}
  ${A}
  ${_?io(S,v,F,xe):ao(S,v,F,xe)}
                   `};return{name:"MatMul",shaderCache:{hint:`${S};${t.activation};${_};${o}`,inputDependencies:G},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:M}),getShaderSource:Y}}});var gf,Mu,Uu=N(()=>{"use strict";re();Je();se();ft();qr();Bu();Zr();gf=(e,t,r,n,o=!1,i,a=4,u=4,l=4,c="f32")=>{let p=G=>{switch(G){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${c}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${G} is not supported.`)}},m=G=>{switch(G){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${G} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,y=e?`
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
    `,g=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",_=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",S=e?"row":"col",v=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${S} / outWidth;
    let outCol = ${S} % outWidth;

    let WRow = ${v} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${v} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${v} % inChannels;
    var resData = ${Ee(a,c)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${g} && xCol >= 0 && xCol < ${_}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${p(a)}
    }
    return resData;`,x=e?t&&n?`
    let col = colIn * ${a};
    ${w}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${w}
    }
    return ${Ee(a,c)}(0.0);`:n&&r?`
    let col = colIn * ${a};
    ${w}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Ee(a,c)}(0.0);`,T=e?n&&r?m(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${m(u)}
    }
    return ${Ee(u,c)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${m(u)}
    }
    return ${Ee(u,c)}(0.0);`,k=Ee(l,c),C=e?Ee(a,c):Ee(u,c),O=e?Ee(u,c):Ee(a,c),B=qe(i,k,c);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?x:T}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${O} {
      ${e?T:x}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${k}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${y}
      ${Ou(o)}
      ${B}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Mu=(e,t,r,n,o,i,a,u,l)=>{let c=t.format==="NHWC",p=c?e[0].dims[3]:e[0].dims[1],m=r[0],h=c?r[2]:r[3],y=c?r[1]:r[2],g=c?r[3]:r[1],_=c&&(p%4===0||p%3===0)&&g%4===0,S=c?g:h*y,v=c?h*y:g,w=[8,8,1],x=n<=8?[4,1,1]:[4,4,1],T=[Math.ceil(S/w[0]/x[0]),Math.ceil(v/w[1]/x[1]),Math.ceil(m/w[2]/x[2])];ue("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${T}`);let k=_?c&&p%4!==0?3:4:1,C=w[1]*x[1],O=w[0]*x[0],B=Math.max(w[0]*k,w[1]),M=n%C===0,G=o%O===0,K=i%B===0,Y=_?[k,4,4]:[1,1,1],L=[{type:6,data:n},{type:6,data:o},{type:6,data:i},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Ke(t,L),L.push(...V(e[0].dims,e[1].dims));let Q=["rank","rank"];a&&(L.push(...V(e[2].dims)),Q.push("rank")),L.push(...V(r));let xe=F=>{let Z=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];je(t,Z);let ne=_?4:1,J=ve(e[0].dataType),de=`
      fn setOutputAtIndex(flatIndex : i32, value : ${_?`vec4<${J}>`:J}) {
        result[flatIndex] = ${_?`vec4<${J}>`:J}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${_?`vec4<${J}>`:J}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${_?"/ 4":""}, value);
      }`,ye=P("x",e[0].dataType,e[0].dims.length,k===3?1:k),$e=P("w",e[1].dataType,e[1].dims.length,ne),oe=[ye,$e],A=U("result",e[0].dataType,r.length,ne);if(a){let W=P("bias",e[2].dataType,e[2].dims.length,ne);oe.push(W),de+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${_?`vec4<${J}>`:J} {
          return bias[coords.${c?"w":"y"}${_?"/ 4":""}];
        }`}return`
        ${Du("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${F.registerUniforms(Z).declareVariables(...oe,A)}
        ${de}
        ${gf(c,M,G,K,a,t,Y[0],Y[1],Y[2],J)}
        ${_?io(x,w,J,void 0,!c,B):ao(x,w,J,void 0,!c,B,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${k};${_};${M};${G};${K};${C};${O};${B}`,inputDependencies:Q},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:T[0],y:T[1],z:T[2]},programUniforms:L}),getShaderSource:xe}}});var yf,Nu,Qr,bf,Vu,_f,Wu,Lu,Gu=N(()=>{"use strict";re();Je();ie();se();ft();qr();yf=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Nu=e=>typeof e=="number"?[e,e,e]:e,Qr=(e,t)=>t<=1?e:e+(e-1)*(t-1),bf=(e,t,r,n=1)=>{let o=Qr(t,n);return Math.floor((e[0]*(r-1)-r+o)/2)},Vu=(e,t,r,n,o)=>{o==null&&(o=bf(e,t[0],n[0]));let i=[0,0,0,r];for(let a=0;a<3;a++)e[a]+2*o>=t[a]&&(i[a]=Math.trunc((e[a]-t[a]+2*o)/n[a]+1));return i},_f=(e,t,r,n,o,i,a,u,l,c)=>{let p,m,h,y;if(e==="VALID"&&(e=0),typeof e=="number"){p={top:e,bottom:e,left:e,right:e,front:e,back:e};let g=Vu([t,r,n,1],[u,l,c],1,[o,i,a],e);m=g[0],h=g[1],y=g[2]}else if(Array.isArray(e)){if(!e.every((_,S,v)=>_===v[0]))throw Error(`Unsupported padding parameter: ${e}`);p={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let g=Vu([t,r,n,1],[u,l,c],1,[o,i,a],e[0]);m=g[0],h=g[1],y=g[2]}else if(e==="SAME_UPPER"){m=Math.ceil(t/o),h=Math.ceil(r/i),y=Math.ceil(n/a);let g=(m-1)*o+u-t,_=(h-1)*i+l-r,S=(y-1)*a+c-n,v=Math.floor(g/2),w=g-v,x=Math.floor(_/2),T=_-x,k=Math.floor(S/2),C=S-k;p={top:x,bottom:T,left:k,right:C,front:v,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:p,outDepth:m,outHeight:h,outWidth:y}},Wu=(e,t,r,n,o,i=!1,a="channelsLast")=>{let u,l,c,p,m;if(a==="channelsLast")[u,l,c,p,m]=e;else if(a==="channelsFirst")[u,m,l,c,p]=e;else throw new Error(`Unknown dataFormat ${a}`);let[h,,y,g,_]=t,[S,v,w]=Nu(r),[x,T,k]=Nu(n),C=Qr(y,x),O=Qr(g,T),B=Qr(_,k),{padInfo:M,outDepth:G,outHeight:K,outWidth:Y}=_f(o,l,c,p,S,v,w,C,O,B),L=i?h*m:h,Q=[0,0,0,0,0];return a==="channelsFirst"?Q=[u,L,G,K,Y]:a==="channelsLast"&&(Q=[u,G,K,Y,L]),{batchSize:u,dataFormat:a,inDepth:l,inHeight:c,inWidth:p,inChannels:m,outDepth:G,outHeight:K,outWidth:Y,outChannels:L,padInfo:M,strideDepth:S,strideHeight:v,strideWidth:w,filterDepth:y,filterHeight:g,filterWidth:_,effectiveFilterDepth:C,effectiveFilterHeight:O,effectiveFilterWidth:B,dilationDepth:x,dilationHeight:T,dilationWidth:k,inShape:e,outShape:Q,filterShape:t}},Lu=(e,t,r,n,o,i)=>{let a=i==="channelsLast",u=a?e[0].dims[3]:e[0].dims[1],l=!1,c=[64,1,1],p={x:r.map((w,x)=>x)},m=[Math.ceil(yf(p.x.map(w=>r[w]))/c[0]),1,1];ue("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${m}`);let h=l?a&&u%4!==0?3:4:1,y=E.size(r),g=[{type:12,data:y},{type:12,data:n},{type:12,data:o},{type:12,data:t.strides},{type:12,data:t.dilations}];Ke(t,g),g.push(...V(e[0].dims,e[1].dims));let _=["rank","rank"],S=e.length===3;S&&(g.push(...V(e[2].dims)),_.push("rank")),g.push(...V(r));let v=w=>{let x=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:n.length},{name:"pads",type:"u32",length:o.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];je(t,x);let T=l?4:1,k=ve(e[0].dataType),C=P("x",e[0].dataType,e[0].dims.length,h===3?1:h),O=P("W",e[1].dataType,e[1].dims.length,T),B=[C,O],M=U("result",e[0].dataType,r.length,T),G="";if(S){let L=P("bias",e[2].dataType,e[2].dims.length,T);B.push(L),G+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${k}>`:k} {
          return bias[${a?q("coords",4,5):q("coords",1,5)}${l?"/ 4":""}];
        }`}let K=Ee(h,k),Y=qe(t,K,k);return`
            ${G}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${O.getByIndices("aIndices")};
            }
          ${w.registerUniforms(x).declareVariables(...B,M)}
          ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${M.offsetToIndices("global_idx")};
              let batch = ${q("coords",0,C.rank)};
              let d2 = ${a?q("coords",C.rank-1,C.rank):q("coords",1,C.rank)};
              let xFRCCorner = vec3<u32>(${a?q("coords",1,C.rank):q("coords",2,C.rank)},
              ${a?q("coords",2,C.rank):q("coords",3,C.rank)},
              ${a?q("coords",3,C.rank):q("coords",4,C.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${a?q("uniforms.x_shape",1,C.rank):q("uniforms.x_shape",2,C.rank)};
              let xShapeZ = ${a?q("uniforms.x_shape",2,C.rank):q("uniforms.x_shape",3,C.rank)};
              let xShapeW = ${a?q("uniforms.x_shape",3,C.rank):q("uniforms.x_shape",4,C.rank)};
              let xShapeU = ${a?q("uniforms.x_shape",4,C.rank):q("uniforms.x_shape",1,C.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
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
                      ${a?`let xValues = vec4<f32>(
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
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${a?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${a?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${a?`let xValues = vec3<f32>(
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
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${S?"value = value + getBiasByOutputCoords(coords)":""};
              ${Y}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${a};${h};${S}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:m[0],y:m[1],z:m[2]},programUniforms:g}),getShaderSource:v}}});var Hu,Fu,qu=N(()=>{"use strict";re();ie();se();ft();Hu=(e,t,r,n)=>{let o=e.length>2,i=o?"value += b[output_channel];":"",a=e[0].dims,u=e[1].dims,l=t.format==="NHWC",c=l?r[3]:r[1],p=c/t.group,m=l&&p>=4?me(c):1,h=E.size(r)/m,y=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:p}];Ke(t,y),y.push(...V(a,[u[0],u[1],u[2],u[3]/m]));let g=o?["rank","rank","rank"]:["rank","rank"];y.push(...V([r[0],r[1],r[2],r[3]/m]));let _=S=>{let v=U("output",e[0].dataType,r.length,m),w=ve(v.type.tensor),x=qe(t,v.type.value,w),T=P("x",e[0].dataType,a.length),k=P("w",e[1].dataType,u.length,m),C=[T,k];o&&C.push(P("b",e[2].dataType,e[2].dims,m));let O=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];je(t,O);let B=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${T.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${k.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${T.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${k.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${S.registerUniforms(O).declareVariables(...C,v)}

  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${v.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${m} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${v.type.value} = ${v.type.value}(0);
    ${B}
    ${i}
    ${x}
    ${v.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${m}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:y}),getShaderSource:_}},Fu=(e,t,r,n)=>{let o=e.length>2,i=me(r[3]),a=me(r[2]),u=E.size(r)/i/a,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/i],c=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/i],p=[r[0],r[1],r[2],r[3]/i],m=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Ke(t,m),m.push(...V(l,c,p));let h=(a-1)*t.strides[1]+c[1],y=g=>{let _=U("output",e[0].dataType,p.length,i),S=ve(_.type.tensor),v=qe(t,_.type.value,S),w=P("x",e[0].dataType,l.length,i),x=P("w",e[1].dataType,c.length,i),T=[w,x];o&&T.push(P("b",e[2].dataType,e[2].dims,i));let k=o?"value += b[output_channel];":"",C=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return je(t,C),`
  ${g.registerUniforms(C).declareVariables(...T,_)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${a}u;
    let col = (index1 % width1) * ${a}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${h}>;
    var values: array<${_.type.value}, ${a}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${c[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${c[1]}; w_width++) {
          let w_val = ${x.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${a}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${a}u; i++) {
      var value = values[i];
      ${k}
      ${v}
      ${_.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${i};${a};${h};${c[0]};${c[1]}`,inputDependencies:o?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m}),getShaderSource:y}}});var wf,so,vf,uo,lo,Ku,$f,xf,co,ju=N(()=>{"use strict";ie();Uu();Gu();Zr();qu();ft();jr();ut();wf=(e,t,r,n,o,i)=>{let a=e[0],u=e.slice(i?1:2,i?3:4),l=u.length,c=t[0],m=t.slice(2).map((g,_)=>g+(g-1)*(r[_]-1)),y=u.map((g,_)=>g+n[_]+n[_+l]).map((g,_)=>Math.floor((g-m[_]+o[_])/o[_]));return y.splice(0,0,a),y.splice(i?3:1,0,c),y},so=[2,3,1,0],vf=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],n=e[1].dims[1]*t.group;if(r!==n)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let o=e[0].dims.length-2;if(t.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(t.strides.length!==o)throw new Error(`strides should be ${o}D`);if(t.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},uo=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let i=2;i<t[1].dims.length;++i)r[i-2]===0&&(r[i-2]=t[1].dims[i]);let n=e.pads.slice();xt.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,n,e.format==="NHWC",e.autoPad);let o=Object.assign({},e);return Object.assign(o,{kernelShape:r,pads:n}),o},lo=e=>{let t=Fr(e),r=e.format,n=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],o=e.dilations,i=e.group,a=e.kernel_shape,u=e.pads,l=e.strides,c=e.w_is_const();return{autoPad:n,format:r,dilations:o,group:i,kernelShape:a,pads:u,strides:l,wIsConst:c,...t,cacheKey:`${e.format};${t.activation};`}},Ku=(e,t,r,n)=>{let o=r.format==="NHWC",i=wf(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,o);if(r.group!==1){let C=[t[0]];if(o){let B=e.kernelCustomData.wT??e.compute(Oe(t[1],so),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=B),C.push(B)}else C.push(t[1]);t.length===3&&C.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&o&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Fu(C,r,i,n),{inputs:C}):e.compute(Hu(C,r,i,n),{inputs:C});return}let a=t.length===3,u=t[0].dims[o?1:2],l=t[0].dims[o?2:3],c=t[0].dims[o?3:1],p=t[1].dims[2],m=t[1].dims[3],h=i[o?1:2],y=i[o?2:3],g=i[o?3:1],_=o&&p===u&&m===l&&r.pads[0]===0&&r.pads[1]===0;if(_||p===1&&m===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let C=i[0],O,B,M,G=[];if(o){let L=e.kernelCustomData.wT??e.compute(Oe(t[1],so),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=L),_){let Q=u*l*c;O=t[0].reshape([1,C,Q]),B=L.reshape([1,Q,g]),M=[1,C,g]}else O=t[0].reshape([C,u*l,c]),B=L.reshape([1,c,g]),M=[C,h*y,g];G.push(O),G.push(B)}else O=t[0].reshape([C,c,u*l]),B=t[1].reshape([1,g,c]),M=[C,g,h*y],G.push(B),G.push(O);a&&G.push(t[2]);let K=M[2],Y=G[0].dims[G[0].dims.length-1];K<8&&Y<8?e.compute(Kr(G,r,i,M,o,n),{inputs:G}):e.compute(Xt(G,r,i,M,o,n),{inputs:G});return}let S=!0,v=e.kernelCustomData.wT??e.compute(Oe(t[1],so),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=v);let w=[t[0],v];a&&w.push(t[2]);let x=o?h*y:g,T=o?g:h*y,k=p*m*c;e.compute(Mu(w,r,i,x,T,k,a,S,n),{inputs:w})},$f=(e,t)=>{let r=t.format==="NHWC",n=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&n.push(e.inputs[2]);let o=[0,t.pads[0],0,t.pads[1]],i=[1].concat(t.strides),a=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=uo({...t,pads:o,strides:i,dilations:a,kernelShape:u},n);Ku(e,n,l,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},xf=(e,t,r)=>{let n=r.format==="NHWC"?"channelsLast":"channelsFirst",o=uo(r,t),i=r.autoPad==="NOTSET"?r.pads:r.autoPad,a=Wu(t[0].dims,t[1].dims,r.strides,r.dilations,i,!1,n);e.compute(Lu(t,o,a.outShape,[a.filterDepth,a.filterHeight,a.filterWidth],[a.padInfo.front,a.padInfo.top,a.padInfo.left],n))},co=(e,t)=>{if(vf(e.inputs,t),e.inputs[0].dims.length===3)$f(e,t);else if(e.inputs[0].dims.length===5)xf(e,e.inputs,t);else{let r=uo(t,e.inputs);Ku(e,e.inputs,r)}}});var Zu,Qu=N(()=>{"use strict";re();Je();ie();se();Zu=(e,t,r)=>{let n=e.length>2,o=t.outputShape,i=t.format==="NHWC",a=t.group,u=e[1].dims,l=u[2]/a,c=u[3],p=i?me(l):1,m=i&&c===1&&l>=4,h=m?Math.floor(l/4)*4:Math.floor(l/p)*p,y=l-h,g=i?me(c):1,_=i?c===1?p:g:1,S=E.size(o)/g,v=[Math.ceil(S/64),1,1];ue("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${v}`);let w=["rank","rank"],x=[t.strides[0],t.strides[1]],T=[t.kernelShape[i?1:2],t.kernelShape[i?2:3]],k=[t.dilations[0],t.dilations[1]],C=[T[0]+(t.dilations[0]<=1?0:(t.kernelShape[i?1:2]-1)*(t.dilations[0]-1)),T[1]+(t.dilations[1]<=1?0:(t.kernelShape[i?2:3]-1)*(t.dilations[1]-1))],O=[C[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),C[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],B=[{type:12,data:S},{type:12,data:x},{type:12,data:T},{type:12,data:k},{type:12,data:C},{type:6,data:O},{type:12,data:h},{type:12,data:l},{type:12,data:c},...V(e[0].dims,e[1].dims)];n&&(B.push(...V(e[2].dims)),w.push("rank")),B.push(...V(o));let M=G=>{let K=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:x.length},{name:"filter_dims",type:"u32",length:T.length},{name:"dilations",type:"u32",length:T.length},{name:"effective_filter_dims",type:"u32",length:C.length},{name:"pads",type:"i32",length:O.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],Y=ve(e[0].dataType),L=i?1:2,Q=i?2:3,xe=i?3:1,F=P("W",e[1].dataType,e[1].dims.length,_),Z=P("Dy",e[0].dataType,e[0].dims.length,p),ne=[Z,F];n&&ne.push(P("bias",e[2].dataType,[o[xe]].length,g));let J=U("result",e[0].dataType,o.length,g),de=()=>{let oe="";if(m)p===4?oe+=`
        let xValue = ${Z.getByOffset("x_offset")};
        let wValue = ${F.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:p===2?oe+=`
          dotProd = dotProd + dot(vec4<${Y}>(${Z.getByOffset("x_offset")}, ${Z.getByOffset("x_offset + 1u")}), vec4<${Y}>(${F.getByOffset("w_offset")}, ${F.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:p===1&&(oe+=`
          dotProd = dotProd + dot(vec4<${Y}>(${Z.getByOffset("x_offset")}, ${Z.getByOffset("x_offset + 1u")}, ${Z.getByOffset("x_offset + 2u")}, ${Z.getByOffset("x_offset + 3u")}), vec4<${Y}>(${F.getByOffset("w_offset")}, ${F.getByOffset("w_offset + 1u")}, ${F.getByOffset("w_offset + 2u")}, ${F.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(oe+=`
                  let xValue = ${i?Z.getByOffset(`${Z.indicesToOffset(`${Z.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p}`):Z.get("batch","inputChannel","idyR","idyC")};
        `,p===1)oe+=`
          let w_offset = ${F.indicesToOffset(`${F.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${F.getByOffset(`w_offset / ${_}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let A=0;A<p;A++)oe+=`
            let wValue${A} = ${F.getByOffset(`${F.indicesToOffset(`${F.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${A}, wOutChannel)`)} / ${_}`)};
            dotProd = dotProd + xValue[${A}] * wValue${A};`;return oe},ye=()=>{if(y===0)return"";if(!m)throw new Error(`packInputAs4 ${m} is not true.`);let oe="";if(p===1){oe+="dotProd = dotProd";for(let A=0;A<y;A++)oe+=`
            + ${Z.getByOffset(`x_offset + ${A}`)} * ${F.getByOffset(`w_offset + ${A}`)}`;oe+=";"}else if(p===2){if(y!==2)throw new Error(`Invalid inputChannelsRemainder ${y}.`);oe+=`
          let xValue = ${Z.getByOffset("x_offset")};
          let wValue = ${F.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return oe},$e=`
            let outputIndices = ${J.offsetToIndices(`global_idx * ${g}`)};
            let batch = ${J.indicesGet("outputIndices",0)};
            let d1 = ${J.indicesGet("outputIndices",xe)};
            let r = ${J.indicesGet("outputIndices",L)};
            let c = ${J.indicesGet("outputIndices",Q)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${J.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${Y}(dyRCorner) + ${Y}(wR)) / ${Y}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${Y}(uniforms.Dy_shape[${L}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${Y}(dyCCorner) + ${Y}(wC)) / ${Y}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${Y}(uniforms.Dy_shape[${Q}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${m?`
                var x_offset = ${Z.indicesToOffset(`${Z.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${p};
                var w_offset = ${F.indicesToOffset(`${F.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${_};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${m?4:p}) {
                  ${de()}
                  inputChannel = inputChannel + ${m?4:p};
                }
                ${ye()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${n?` + bias[d1 / ${g}]`:""};
            ${J.setByOffset("global_idx","value")};
          `;return`
    ${G.registerUniforms(K).declareVariables(...ne,J)}
      ${G.mainStart()}
      ${G.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${$e}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${p}${_}${g}${m}${y}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:v[0],y:v[1],z:v[2]},outputs:[{dims:r?r(o):o,dataType:e[0].dataType}],programUniforms:B}),getShaderSource:M}}});var Sf,Tf,If,Yu,Xu,Cf,Ju,Af,el,tl=N(()=>{"use strict";Qu();ft();ut();Sf=(e,t,r,n,o,i)=>(e-1)*t+r+(n-1)*o+1-i,Tf=(e,t,r,n,o)=>{let i=Math.floor(e/2);t==="SAME_UPPER"?(r[n]=i,r[o]=e-i):t==="SAME_LOWER"&&(r[n]=e-i,r[o]=i)},If=(e,t,r,n,o,i,a,u,l,c)=>{let p=e.length-2,m=c.length===0;l.length<p&&l.push(...Array(p-l.length).fill(0));let h=e[0],y=t[u?3:1]*o;for(let g=0,_=e.length-p-(u?1:0);g<p;++g,++_){let S=e[_],v=m?S*a[g]:c[g],w=Sf(S,a[g],i[g],t[_],r[g],v);Tf(w,n,i,g,g+p),m&&c.push(a[g]*(S-1)+l[g]+(t[_]-1)*r[g]+1-i[g]-i[g+p])}c.splice(0,0,h),c.splice(u?3:1,0,y)},Yu=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((m,h)=>m*h,1)===0){r.length=0;for(let m=2;m<t[1].dims.length;++m)r.push(t[1].dims[m])}let n=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(n?3:1,0,t[1].dims[1]);let o=e.pads.slice(),i=e.outputShape.slice(),a=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((m,h)=>m+h,0)===0){let m=t[0].dims.length-2;l=new Array(m).fill(1)}let c=e.strides.slice();if(c.reduce((m,h)=>m+h,0)===0){let m=t[0].dims.length-2;c=new Array(m).fill(1)}If(u,r,l,e.autoPad,e.group,o,c,n,a,i);let p=Object.assign({},e);return Object.assign(p,{kernelShape:r,pads:o,outputPadding:a,outputShape:i,dilations:l,strides:c}),p},Xu=e=>{let t=Fr(e),r=e.format,n=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],o=e.dilations,i=e.group,a=e.kernelShape,u=e.pads,l=e.strides,c=e.wIsConst(),p=e.outputPadding,m=e.outputShape;return{autoPad:n,format:r,dilations:o,group:i,kernelShape:a,outputPadding:p,outputShape:m,pads:u,strides:l,wIsConst:c,...t,cacheKey:`${e.format};${t.activation};`}},Cf=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],n=e[1].dims[0];if(r!==n)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let o=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==o))throw new Error("invalid bias");let i=e[0].dims.length-2;if(t.dilations.reduce((p,m)=>p+m,0)>0&&t.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(t.strides.reduce((p,m)=>p+m,0)>0&&t.strides.length!==i)throw new Error(`strides should be ${i}D`);if(t.pads.reduce((p,m)=>p+m,0)>0&&t.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(t.outputPadding.length!==i&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(t.kernelShape.reduce((p,m)=>p+m,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Ju=(e,t,r,n)=>{let o=e.kernelCustomData.wT??e.compute(Oe(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=o);let i=[t[0],o];t.length===3&&i.push(t[2]),e.compute(Zu(i,r,n),{inputs:i})},Af=(e,t)=>{let r=t.format==="NHWC",n=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&n.push(e.inputs[2]);let o=t.kernelShape;(o.length===0||o[0]===0)&&(o=[e.inputs[1].dims[2]]);let i=t.dilations;(i.length===0||i[0]===0)&&(i=[1]);let a=t.strides;(a.length===0||a[0]===0)&&(a=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],a=[1].concat(a),i=[1].concat(i),o=[1].concat(o);let l=t.outputPadding;l=[0].concat(l);let c=Yu({...t,pads:u,strides:a,dilations:i,kernelShape:o,outputPadding:l},n);Ju(e,n,c,p=>r?[p[0],p[2],p[3]]:[p[0],p[1],p[3]])},el=(e,t)=>{if(Cf(e.inputs,t),e.inputs[0].dims.length===3)Af(e,t);else{let r=Yu(t,e.inputs);Ju(e,e.inputs,r)}}});var kf,rl,nl,ol=N(()=>{"use strict";re();ie();Ae();se();kf=(e,t,r,n)=>{let o=E.size(t),i=t.length,a=P("input",e,i),u=U("output",e,i),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),c=E.normalizeAxis(l,i),p=m=>{let h=` i32(${a.indicesGet("inputIndices","uniforms.axis")}) `,y=q("uniforms.input_shape","uniforms.axis",i),g=n.reverse?h+(n.exclusive?" + 1":""):"0",_=n.reverse?y:h+(n.exclusive?"":" + 1");return`
                ${m.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(a,u)}
                ${m.mainStart()}
                  ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${g};
                  let last : i32 = ${_};
                  for (var i : i32 = first; i < last; i++) {
                    ${a.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${a.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:n.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},{type:12,data:c},...V(t,t)]}),getShaderSource:p}},rl=(e,t)=>{let r=e.inputs[0].dims,n=e.inputs[0].dataType,o=e.inputs[1];e.compute(kf(n,r,o,t),{inputs:[0]})},nl=e=>{let t=e.exclusive===1,r=e.reverse===1;return te({exclusive:t,reverse:r})}});var Ef,Pf,zf,il,al,sl=N(()=>{"use strict";re();ie();Ae();se();Ef=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Pf=(e,t,r,n)=>{let o=[];o.push(`fn perm(i: ${n.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let i=0;i<t;++i)o.push(r.indicesSet("a",e[i],`i[${i}]`));return o.push("return a;}"),o.join(`
`)},zf=(e,t)=>{let r,n,o,i,a,u,l=t.format==="NHWC",c=t.blocksize,p=t.mode==="DCR";l?([r,n,o,i]=e.dims,a=p?[r,n,o,c,c,i/c**2]:[r,n,o,i/c**2,c,c],u=p?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,n,o,i]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],a=p?[r,c,c,i/c**2,n,o]:[r,i/c**2,c,c,n,o],u=p?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let m=e.reshape(a),h=m.dims.length,y=e.dataType,g=P("a",y,h),_=U("output",y,h),S=v=>`
  ${v.registerUniform("output_size","u32").declareVariables(g,_)}

  ${Pf(u,h,g,_)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx",g.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:v=>{let w=l?[r,n*c,o*c,i/c**2]:[r,i/c**2,n*c,o*c],x=E.size(w),T=m.dims,k=E.sortBasedOnPerm(T,u);return{outputs:[{dims:w,dataType:v[0].dataType}],dispatchGroup:{x:Math.ceil(x/64)},programUniforms:[{type:12,data:x},...V(T,k)]}},getShaderSource:S}},il=(e,t)=>{Ef(e.inputs),e.compute(zf(e.inputs[0],t))},al=e=>te({blocksize:e.blocksize,mode:e.mode,format:e.format})});var po,Yr,ul,Of,Df,mo,fo,ll,Bf,dl,cl,pl=N(()=>{"use strict";re();ie();Ae();se();po="[a-zA-Z]|\\.\\.\\.",Yr="("+po+")+",ul="^"+Yr+"$",Of="("+Yr+",)*"+Yr,Df="^"+Of+"$",mo=class{constructor(t=-1){this.symbolToIndices=new Map,this.inputIndex=t}addSymbol(t,r){let n=this.symbolToIndices.get(t);n===void 0?n=[r]:n.push(r),this.symbolToIndices.set(t,n)}},fo=class{constructor(t,r){this.equation=r;this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[n,o]=r.includes("->")?r.split("->",2):[r,""];if(!n.match(RegExp(Df)))throw new Error("Invalid LHS term");if(n.split(",").forEach((u,l)=>{let c=t[l].dims.slice();if(!u.match(RegExp(ul)))throw new Error("Invalid LHS term");let p=this.processTerm(u,!0,c,l);this.lhs.push(p)}),o==="")o+=[...this.symbolToInfo.entries()].filter(([u,l])=>l.count===1||u==="...").map(([u])=>u).join("");else if(!o.match(RegExp(Yr)))throw new Error("Invalid RHS");o.match(RegExp(po,"g"))?.forEach(u=>{if(u==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let l=this.symbolToInfo.get(u);if(l===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(l.dimValue)}}),this.rhs=this.processTerm(o,!1,this.outputDims)}addSymbol(t,r,n){let o=this.symbolToInfo.get(t);if(o!==void 0){if(o.dimValue!==r&&o.count!==1)throw new Error("Dimension mismatch");o.count++,o.inputIndices.push(n)}else o={count:1,dimValue:r,inputIndices:[n]};this.symbolToInfo.set(t,o)}processTerm(t,r,n,o=-1){let i=n.length,a=!1,u=[],l=0;if(!t.match(RegExp(ul))&&!r&&t!=="")throw new Error("Invalid LHS term");let c=t.match(RegExp(po,"g")),p=new mo(o);return c?.forEach((m,h)=>{if(m==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let y=i-c.length+1;if(y<0)throw new Error("Ellipsis out of bounds");if(u=n.slice(l,l+y),this.hasEllipsis){if(this.ellipsisDims.length!==u.length||this.ellipsisDims.toString()!==u.toString())throw new Error("Ellipsis dimensions mismatch")}else if(r)this.hasEllipsis=!0,this.ellipsisDims=u;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<u.length;g++){let _=String.fromCharCode(48+g);p.addSymbol(_,h+g),this.addSymbol(_,n[l++],o)}}else p.addSymbol(m,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(m,n[l++],o)}),p}},ll=e=>e+"_max",Bf=(e,t,r,n)=>{let i=e.map(p=>p.length).map((p,m)=>P(`input${m}`,t,p)),a=E.size(n),u=U("output",t,n.length),l=[...r.symbolToInfo.keys()].filter(p=>!r.rhs.symbolToIndices.has(p)),c=p=>{let m=[],h="var prod = 1.0;",y="var sum = 0.0;",g="sum += prod;",_=[],S=[],v=[],w=[],x=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((k,C)=>{if(r.rhs.symbolToIndices.has(C)){let O=r.rhs.symbolToIndices.get(C)?.[0];O!==void 0&&r.lhs.forEach((B,M)=>{if(k.inputIndices.includes(M)){let G=B.symbolToIndices.get(C);if(G===void 0)throw new Error("Invalid symbol error");G.forEach(K=>{m.push(`${i[M].indicesSet(`input${M}Indices`,K,u.indicesGet("outputIndices",O))}`)})}})}else r.lhs.forEach((O,B)=>{if(k.inputIndices.includes(B)){let M=O.symbolToIndices.get(C);if(M===void 0)throw new Error("Invalid symbol error");M.forEach(G=>{_.push(`${i[B].indicesSet(`input${B}Indices`,G,`${C}`)}`)}),w.push(`prod *= ${i[B].getByIndices(`input${B}Indices`)};`)}}),S.push(`for(var ${C}: u32 = 0; ${C} < uniforms.${ll(C)}; ${C}++) {`),v.push("}")});let T=x?[...m,`let sum = ${i.map((k,C)=>k.getByIndices(`input${C}Indices`)).join(" * ")};`]:[...m,y,...S,..._,h,...w,g,...v];return`
            ${p.registerUniforms(l.map(k=>({name:`${ll(k)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...i,u)}

            ${p.mainStart()}
            ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${u.offsetToIndices("global_idx")};
            ${i.map((k,C)=>`var input${C}Indices: ${i[C].type.indices};`).join(`
`)}
            ${T.join(`
`)};
            ${u.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let p=l.filter(h=>r.symbolToInfo.has(h)).map(h=>({type:12,data:r.symbolToInfo.get(h)?.dimValue||0}));p.push({type:12,data:a});let m=e.map((h,y)=>[...V(h)]).reduce((h,y)=>h.concat(y),p);return m.push(...V(n)),{outputs:[{dims:n,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:m}},getShaderSource:c}},dl=(e,t)=>{let r=new fo(e.inputs,t.equation),n=r.outputDims,o=e.inputs.map((i,a)=>i.dims);e.compute(Bf(o,e.inputs[0].dataType,r,n))},cl=e=>{let t=e.equation.replace(/\s+/g,"");return te({equation:t})}});var Rf,ml,Mf,Uf,fl,hl=N(()=>{"use strict";re();ie();se();Rf=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),n=r.length<t.length?0:r.length-t.length,o=t.length<r.length?0:t.length-r.length;for(;n<r.length&&o<t.length;++n,++o)if(r[n]!==t[o]&&r[n]!==1&&t[o]!==1)throw new Error("Expand requires shape to be broadcastable to input")},ml=(e,t)=>{let r=e.length-t.length,n=[];for(let o=0;o<r;++o)n.push(e[o]);for(let o=0;o<t.length;++o)n.push(t[o]===1?e[o+r]:t[o]);return n},Mf=(e,t)=>e.length>t.length?ml(e,t):ml(t,e),Uf=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),n=Mf(t,r),o=e[0].dataType,i=o===9||E.size(t)===1,a=o===9||t.length>0&&t[t.length-1]%4===0?4:1,u=i||n.length>0&&n[n.length-1]%4===0?4:1,l=Math.ceil(E.size(n)/u),c=m=>{let h=P("input",o,t.length,a),y=U("output",o,n.length,u),g;if(o===9){let _=(S,v,w="")=>`
          let outputIndices${v} = ${y.offsetToIndices(`outputOffset + ${v}u`)};
          let offset${v} = ${h.broadcastedIndicesToOffset(`outputIndices${v}`,y)};
          let index${v} = offset${v} / 4u;
          let component${v} = offset${v} % 4u;
          ${S}[${v}] = ${w}(${h.getByOffset(`index${v}`)}[component${v}]);
        `;g=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${_("data",0,"u32")}
        ${_("data",1,"u32")}
        ${_("data",2,"u32")}
        ${_("data",3,"u32")}
        ${y.setByOffset("global_idx","data")}
      }`}else g=`
        let outputIndices = ${y.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",y)};
        let data = ${y.type.value}(${h.getByOffset(`inputOffset / ${a}`)});
        ${y.setByOffset("global_idx","data")}
      }`;return`
    ${m.registerUniform("vec_size","u32").declareVariables(h,y)}
    ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${g}`},p=[{type:12,data:l},...V(t,n)];return{name:"Expand",shaderCache:{hint:`${n.length};${a}${u}`,inputDependencies:["rank"]},getShaderSource:c,getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p})}},fl=e=>{Rf(e.inputs),e.compute(Uf(e.inputs),{inputs:[0]})}});var Nf,gl,yl=N(()=>{"use strict";re();ie();se();Hr();Nf=e=>{let t=e[0].dataType,r=E.size(e[0].dims),n=E.size(e[1].dims),o=n%4===0,i=a=>{let u=P("x",t,[1],4),l=P("bias",t,[1],4),c=U("y",t,[1],4),p=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],m=y=>`
      let bias${y}_offset: u32 = (global_idx * 4 + ${y}) % uniforms.bias_size;
      let bias${y} = ${l.getByOffset(`bias${y}_offset / 4`)}[bias${y}_offset % 4];`,h=o?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${m(0)}${m(1)}${m(2)}${m(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${a.registerUniforms(p).declareVariables(u,l,c)}

    ${no(ze(t))}

    ${a.mainStart(St)}
      ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${c.setByOffset("global_idx",oo("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${o}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:a=>({outputs:[{dims:a[0].dims,dataType:a[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:n}],dispatchGroup:{x:Math.ceil(r/St/4)}})}},gl=e=>{e.inputs.length<2||E.size(e.inputs[1].dims)===0?pu(e):e.compute(Nf(e.inputs))}});var Vf,Wf,bl,_l,wl=N(()=>{"use strict";re();ie();Ae();se();Vf=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Wf=(e,t)=>{let r=e[0].dims,n=e[1].dims,o=r.length,i=E.normalizeAxis(t.axis,o),a=r.slice(0);a.splice(i,1,...n);let u=r[i],l=e[0].dataType===9?4:1,c=Math.ceil(E.size(a)/l),p=[{type:12,data:c},{type:6,data:u},{type:12,data:i},...V(e[0].dims,e[1].dims,a)],m=h=>{let y=P("data",e[0].dataType,e[0].dims.length,l),g=P("inputIndices",e[1].dataType,e[1].dims.length),_=U("output",e[0].dataType,a.length,l),S=w=>{let x=n.length,T=`var indicesIndices${w}  = ${g.type.indices}(0);`;for(let k=0;k<x;k++)T+=`${x>1?`indicesIndices${w}[${k}]`:`indicesIndices${w}`} = ${a.length>1?`outputIndices${w}[uniforms.axis + ${k}]`:`outputIndices${w}`};`;T+=`
          var idx${w} = ${g.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${y.type.indices};
        `;for(let k=0,C=0;k<o;k++)k===i?(T+=`${o>1?`dataIndices${w}[${k}]`:`dataIndices${w}`} = u32(idx${w});`,C+=x):(T+=`${o>1?`dataIndices${w}[${k}]`:`dataIndices${w}`} = ${a.length>1?`outputIndices${w}[${C}]`:`outputIndices${w}`};`,C++);return T},v;if(e[0].dataType===9){let w=(x,T,k="")=>`
          let outputIndices${T} = ${_.offsetToIndices(`outputOffset + ${T}u`)};
          ${S(T)};
          let offset${T} = ${y.indicesToOffset(`dataIndices${T}`)};
          let index${T} = offset${T} / 4u;
          let component${T} = offset${T} % 4u;
          ${x}[${T}] = ${k}(${y.getByOffset(`index${T}`)}[component${T}]);
        `;v=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${_.setByOffset("global_idx","value")}
      `}else v=`
      let outputIndices = ${_.offsetToIndices("global_idx")};
      ${S("")};
      let value = ${y.getByIndices("dataIndices")};
      ${_.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(y,g,_)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${v}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:p}),getShaderSource:m}},bl=e=>te({axis:e.axis}),_l=(e,t)=>{let r=e.inputs;Vf(r),e.compute(Wf(e.inputs,t))}});var Lf,vl,$l,xl=N(()=>{"use strict";re();ie();se();Lf=(e,t,r,n,o,i,a,u,l)=>{let c=[{type:12,data:i},{type:12,data:n},{type:12,data:o},{type:12,data:r},{type:12,data:a},{type:12,data:u},{type:12,data:l}],p=[i];c.push(...V(t.dims,p));let m=h=>{let y=P("indices_data",t.dataType,t.dims.length),g=U("input_slice_offsets_data",12,1,1),_=[y,g],S=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:o.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${h.registerUniforms(S).declareVariables(..._)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${o.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${o.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:c}),getShaderSource:m},{inputs:[t],outputs:[-1]})[0]},vl=(e,t)=>{let r=e.inputs,n=r[0].dims,o=r[0].dataType,i=r[1].dims,a=i[i.length-1],u=E.sizeToDimension(i,i.length-1),l=E.sizeFromDimension(n,t.batchDims+a),c=E.sizeToDimension(n,t.batchDims),p=E.sizeFromDimension(n,t.batchDims),m=u/c,h=new Array(a),y=l;for(let T=0;T<a;++T)h[a-1-T]=y,y*=n[t.batchDims+a-1-T];let g=Lf(e,r[1],h,t.batchDims,n,u,m,p,a),_=t.batchDims+a;if(_>n.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let S=i.slice(0,-1).concat(n.slice(_)),v=E.size(S),w=[{type:12,data:v},{type:12,data:l},...V(r[0].dims,g.dims,S)],x=T=>{let k=P("data",r[0].dataType,r[0].dims.length),C=P("slice_offsets",12,g.dims.length),O=U("output",r[0].dataType,S.length);return`
          ${T.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(k,C,O)}
            ${T.mainStart()}
            ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:S,dataType:o}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:w}),getShaderSource:x},{inputs:[r[0],g]})},$l=e=>({batchDims:e.batch_dims,cacheKey:""})});var Gf,Hf,Sl,Tl,Il=N(()=>{"use strict";re();ie();Ae();se();Gf=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=E.normalizeAxis(t.quantizeAxis,e[0].dims.length),n=t.blockSize,o=e[0],i=e[2],a=e.length===4?e[3]:void 0;if(i.dims.length!==o.dims.length||!o.dims.map((u,l)=>l===r?Math.ceil(u/n)===i.dims[l]:u===i.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(a){if(a.dataType!==o.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(a.dims.length!==i.dims.length||!a.dims.map((u,l)=>u===i.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Hf=(e,t)=>{let r=e[0].dims,n=e[1].dims,o=r.length,i=E.normalizeAxis(t.gatherAxis,o),a=E.normalizeAxis(t.quantizeAxis,o),u=r.slice(0);u.splice(i,1,...n);let l=E.size(u),c=e[2].dataType,m=e[0].dataType===22,h=[{type:12,data:l},{type:12,data:a},{type:12,data:i},{type:12,data:t.blockSize},...V(...e.map((g,_)=>g.dims),u)],y=g=>{let _=P("data",e[0].dataType,e[0].dims.length),S=P("inputIndices",e[1].dataType,e[1].dims.length),v=P("scales",e[2].dataType,e[2].dims.length),w=e.length>3?P("zeroPoint",e[3].dataType,e[3].dims.length):void 0,x=U("output",c,u.length),T=[_,S,v];w&&T.push(w);let k=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(k).declareVariables(...T,x)}
        ${g.mainStart()}
        let output_indices = ${x.offsetToIndices("global_idx")};
        var indices_indices = ${S.type.indices}(0);
        ${n.length>1?`
          for (var i: u32 = 0; i < ${n.length}; i++) {
            let index = ${x.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${S.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${x.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${x.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${S.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[i]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${x.indicesGet("output_indices",`i + ${n.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${m?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${v.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${v.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${v.getByIndices("scale_indices")};
        ${w?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${w.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${w.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${m?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ze(c)}(quantized_data - zero_point) * scale;
        ${x.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,_)=>_!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,_)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:c}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:y}},Sl=(e,t)=>{let r=e.inputs;Gf(r,t),e.compute(Hf(e.inputs,t))},Tl=e=>te({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})});var Ff,qf,Cl,Al,kl=N(()=>{"use strict";re();ie();Ae();se();Ff=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},qf=(e,t)=>{let r=e[0].dims,n=e[0].dataType,o=r.length,i=e[1].dims,a=e[1].dataType,u=E.normalizeAxis(t.axis,o),l=r[u],c=i.slice(0),p=E.size(c),m=P("input",n,o),h=P("indicesInput",a,i.length),y=U("output",n,c.length),g=[{type:12,data:p},{type:6,data:l},{type:12,data:u}];return g.push(...V(r,i,c)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:g}),getShaderSource:v=>`
      ${v.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(m,h,y)}
      ${v.mainStart()}
      ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${y.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${m.type.indices}(outputIndices);
      ${m.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${m.getByIndices("inputIndices")};

      ${y.setByOffset("global_idx","value")};
  }`}},Cl=e=>te({axis:e.axis}),Al=(e,t)=>{let r=e.inputs;Ff(r),e.compute(qf(e.inputs,t))}});var Kf,jf,El,Pl,zl=N(()=>{"use strict";re();ie();se();Kf=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},jf=(e,t)=>{let r=e[0].dims.slice(),n=e[1].dims.slice(),[o,i,a]=zr.getShapeOfGemmResult(r,t.transA,n,t.transB,e.length===3?e[2].dims:void 0),u=[o,i];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,c=Math.ceil(i/l),p=Math.ceil(o/l),m=!0,h=E.size(u),y=[{type:12,data:m?c:h},{type:12,data:o},{type:12,data:i},{type:12,data:a},{type:1,data:t.alpha},{type:1,data:t.beta}],g=["type","type"];e.length===3&&(y.push(...V(e[2].dims)),g.push("rank")),y.push(...V(u));let _=v=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let x=t.alpha===1?"":"value *= uniforms.alpha;",T=P("a",e[0].dataType,e[0].dims),k=P("b",e[1].dataType,e[1].dims),C=T.type.value,O=null,B=[T,k];e.length===3&&(O=P("c",e[2].dataType,e[2].dims.length),B.push(O));let M=U("output",e[0].dataType,u.length);B.push(M);let G=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${v.registerUniforms(G).declareVariables(...B)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${C}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${x}
    ${O!=null?`let cOffset = ${O.broadcastedIndicesToOffset("vec2(m, n)",M)}; value += ${C}(uniforms.beta) * ${O.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},S=v=>{let w=P("a",e[0].dataType,e[0].dims),x=P("b",e[1].dataType,e[1].dims),T=null,k=[w,x];e.length===3&&(T=P("c",e[2].dataType,e[2].dims.length),k.push(T));let C=U("output",e[0].dataType,u.length);k.push(C);let O=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],B="",M="";t.transA&&t.transB?(M=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${x.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(M=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${x.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(M=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${x.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(M=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${x.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let G=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${v.registerUniforms(O).declareVariables(...k)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${x.type.storage}, ${l}>, ${l}>;
  ${v.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${C.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${M}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${B}
      }
      workgroupBarrier();
    }

    ${G}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${T!=null?`let cOffset = ${T.broadcastedIndicesToOffset("vec2(m, n)",C)}; value += ${C.type.value}(uniforms.beta) * ${T.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return m?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:c*p},programUniforms:y}),getShaderSource:S}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:y}),getShaderSource:_}},El=e=>{let t=e.transA,r=e.transB,n=e.alpha,o=e.beta;return{transA:t,transB:r,alpha:n,beta:o,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Pl=(e,t)=>{Kf(e.inputs),e.compute(jf(e.inputs,t))}});var lt,ht,Bt,Rt,Zf,Qf,Yf,Xf,Jf,eh,th,rh,Ol,Dl,Bl=N(()=>{"use strict";re();ie();Ae();se();[lt,ht,Bt,Rt]=[0,1,2,3],Zf=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Qf=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Yf=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Xf=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Jf=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,eh=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${lt}] = batch;
     indices[${ht}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Bt}] = u32(r);
            indices[${Rt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${Bt}] = u32(clamp(r, 0, H - 1));
          indices[${Rt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Bt}] = gs_reflect(r, border[1], border[3]);
          indices[${Rt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,th=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${lt}], indices[${ht}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${lt}], indices[${ht}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${lt}], indices[${ht}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${lt}], indices[${ht}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${lt}], indices[${ht}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${lt}], indices[${ht}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,rh=(e,t)=>{let r=P("x",e[0].dataType,e[0].dims.length),n=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],o=P("grid",e[1].dataType,n.length,2),i=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(i=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[lt,ht,Bt,Rt]=[0,3,1,2]);let a=U("output",e[0].dataType,i.length),u=r.type.value,l=E.size(i),c=[{type:12,data:l},...V(e[0].dims,n,i)],p=m=>`
  ${m.registerUniform("output_size","u32").declareVariables(r,o,a)}
  ${Qf}
  ${Yf(u)}
  ${Xf(t)}
  ${Jf(t)}
  ${eh(r,u,t)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Bt}]);
      let W_in = i32(uniforms.x_shape[${Rt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${a.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${lt}], indices[${Bt}], indices[${Rt}]);
      let nxy = ${o.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${th(a,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:m=>{let h=E.size(i);return{outputs:[{dims:i,dataType:m[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:c}},getShaderSource:p}},Ol=(e,t)=>{Zf(e.inputs),e.compute(rh(e.inputs,t))},Dl=e=>te({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})});var Me,ih,Ml,Rl,ah,Jt,Ul,ho=N(()=>{"use strict";re();ie();Ae();Mr();Lr();se();ut();Me=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,ih=(e,t)=>{let r=e[0],n=Me(e,1),o=Me(e,2),i=Me(e,3),a=Me(e,4),u=Me(e,5),l=Me(e,6),c=Me(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let p=r.dims[0],m=r.dims[1],h=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],y=m,g=0,_=0,S=Math.floor(h/t.numHeads);if(l&&c&&E.size(l.dims)&&E.size(c.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==p||l.dims[1]!==t.numHeads||l.dims[3]!==S)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(c.dims[0]!==p||c.dims[1]!==t.numHeads||c.dims[3]!==S)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==c.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(c.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=l.dims[2],_=l.dims[2]}else if(l&&E.size(l.dims)||c&&E.size(c.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v;if(n&&E.size(n.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(n.dims.length===3){if(n.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');v=2,y=n.dims[1]}else if(n.dims.length===5){if(n.dims[2]!==t.numHeads||n.dims[3]!==2||n.dims[4]!==S)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');v=5,y=n.dims[1]}else{if(n.dims[1]!==t.numHeads||n.dims[3]!==S)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');v=0,y=n.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}if(i&&E.size(i.dims)>0){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(n&&n.dims.length===5&&n.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=g+y,x=0;if(a&&E.size(a.dims)>0){x=8;let O=a.dims;throw O.length===1?O[0]===p?x=1:O[0]===3*p+2&&(x=3):O.length===2&&O[0]===p&&O[1]===w&&(x=5),x===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let T=!1,k=h;if(o&&E.size(o.dims)>0){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(y!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');k=o.dims[2]}else{if(y!==o.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');k=o.dims[1]*o.dims[3],T=!0}}let C=!1;if(a&&E.size(a.dims)>0)throw new Error("Key padding mask is not supported");if(u&&E.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==p||u.dims[1]!==t.numHeads||u.dims[2]!==m||u.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:p,sequenceLength:m,pastSequenceLength:g,kvSequenceLength:y,totalSequenceLength:w,maxSequenceLength:_,inputHiddenSize:0,hiddenSize:h,vHiddenSize:k,headSize:S,vHeadSize:Math.floor(k/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:x,scale:t.scale,broadcastResPosBias:C,passPastInKv:T,qkvFormat:v}},Ml=e=>te({...e}),Rl=te({perm:[0,2,1,3]}),ah=(e,t,r,n,o,i,a)=>{let u=[n,o,i],l=E.size(u),c=[{type:12,data:l},{type:12,data:a},{type:12,data:i}],p=m=>{let h=U("qkv_with_bias",t.dataType,u),y=P("qkv",t.dataType,u),g=P("bias",r.dataType,u),_=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${m.registerUniforms(_).declareVariables(y,g,h)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c}),getShaderSource:p},{inputs:[t,r],outputs:[-1]})[0]},Jt=(e,t,r,n,o,i,a,u)=>{let l=i;if(a&&E.size(a.dims)>0){if(n===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=ah(e,i,a,t,n,r*o,u),l=l.reshape([t,n,r,o]),r===1||n===1?l:e.compute(Oe(l,Rl.perm),{inputs:[l],outputs:[-1]})[0]}else return i.dims.length===3&&(l=i.reshape([t,n,r,o])),r===1||n===1?l:e.compute(Oe(l,Rl.perm),{inputs:[l],outputs:[-1]})[0]},Ul=(e,t)=>{let r=ih(e.inputs,t),n=e.inputs[0],o=Me(e.inputs,1),i=Me(e.inputs,2),a=Me(e.inputs,3),u=Me(e.inputs,4),l=Me(e.inputs,5),c=Me(e.inputs,6),p=Me(e.inputs,7);if(n.dims.length===5)throw new Error("Packed QKV is not implemented");if(o?.dims.length===5)throw new Error("Packed KV is not implemented");let m=o&&i&&o.dims.length===4&&i.dims.length===4,h=Jt(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,n,a,0);if(m)return Dt(e,h,o,i,u,void 0,c,p,l,r);if(!o||!i)throw new Error("key and value must be provided");let y=Jt(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,o,a,r.hiddenSize),g=Jt(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,i,a,2*r.hiddenSize);Dt(e,h,y,g,u,void 0,c,p,l,r)}});var sh,uh,lh,dh,go,Nl,Vl,yo=N(()=>{"use strict";re();ie();Ae();se();sh=e=>{if(!e||e.length<1)throw new Error("too few inputs")},uh=(e,t)=>{let r=[],n=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(o=>r.push(Number(o))),n=r.length),te({numOutputs:n,axis:t.axis,splitSizes:r})},lh=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${q("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,dh=e=>{let t=e.length,r=[];for(let n=0;n<t;++n){let o=e[n].setByIndices("indices","input[global_idx]");t===1?r.push(o):n===0?r.push(`if (output_number == ${n}u) { ${o} }`):n===t-1?r.push(`else { ${o} }`):r.push(`else if (output_number == ${n}) { ${o} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},go=(e,t)=>{let r=e[0].dims,n=E.size(r),o=e[0].dataType,i=E.normalizeAxis(t.axis,r.length),a=new Array(t.numOutputs),u=P("input",o,r.length),l=new Array(t.numOutputs),c=[],p=[],m=0,h=[{type:12,data:n}];for(let g=0;g<t.numOutputs;g++){m+=t.splitSizes[g],l[g]=m;let _=r.slice();_[i]=t.splitSizes[g],p.push(_),a[g]=U(`output${g}`,o,_.length),c.push({dims:p[g],dataType:e[0].dataType})}h.push({type:12,data:l},...V(r,...p));let y=g=>`
  ${g.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...a)}
  ${lh(l.length)}
  ${dh(a)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${q("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:y,getRunData:()=>({outputs:c,dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h})}},Nl=(e,t)=>{sh(e.inputs);let r=e.inputs.length===1?t:uh(e.inputs,t);e.compute(go(e.inputs,r),{inputs:[0]})},Vl=e=>{let t=e.axis,r=e.splitSizes,n=e.numOutputs<0?r.length:e.numOutputs;if(n!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return te({axis:t,numOutputs:n,splitSizes:r})}});var ch,Xr,Wl,bo=N(()=>{"use strict";re();ie();Ae();se();ch=(e,t)=>{let[r,n,o,i]=e,{numHeads:a,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!E.areEqual(n.dims,[])&&!E.areEqual(n.dims,[1])&&n.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${n.dims.length}`);if(o.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${o.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!E.areEqual(o.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&a===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],c=r.dims[r.dims.length-2],p=o.dims[0],m=E.sizeFromDimension(r.dims,1)/c,h=u===0?o.dims[1]*2:m/a;if(u>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(n.dims.length===2){if(l!==n.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${n.dims[0]}`);if(c!==n.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${n.dims[1]}`)}if(h/2!==o.dims[1]&&u/2!==o.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${o.dims[1]}`);if(c>p)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Xr=(e,t)=>{let{interleaved:r,numHeads:n,rotaryEmbeddingDim:o,scale:i}=t,a=e[0].dims[0],u=E.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],c=u/l,p=e[2].dims[1],m=o===0?p*2:c/n,h=new Array(a,l,c/m,m-p),y=E.computeStrides(h),g=[{type:1,data:i},{type:12,data:h},{type:12,data:y},...e[0].dims.length===3?new Array({type:12,data:[u,c,m,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,m,l*m,1]}):[],...V(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],_=S=>{let v=P("input",e[0].dataType,e[0].dims.length),w=P("position_ids",e[1].dataType,e[1].dims.length),x=P("cos_cache",e[2].dataType,e[2].dims.length),T=P("sin_cache",e[3].dataType,e[3].dims.length),k=U("output",e[0].dataType,e[0].dims.length);return S.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:y.length},{name:"input_output_strides",type:"u32",length:y.length}]),`
        ${S.declareVariables(v,w,x,T,k)}

        ${S.mainStart(St)}
          let half_rotary_emb_dim = uniforms.${x.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",U("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${v.getByOffset("i")} * ${x.get("position_id","bsnh[3]")} -
                ${v.getByOffset("j")} * ${T.get("position_id","bsnh[3]")};
            ${k.setByOffset("i","re")}
            let im = ${v.getByOffset("i")} * ${T.get("position_id","bsnh[3]")} +
                ${v.getByOffset("j")} * ${x.get("position_id","bsnh[3]")};
            ${k.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${k.setByOffset("k",v.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:te({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(E.size(h)/St)},programUniforms:g})}},Wl=(e,t)=>{ch(e.inputs,t),e.compute(Xr(e.inputs,t))}});var ph,mh,Ll,fh,Gl,Hl=N(()=>{"use strict";Ae();re();Lr();ho();yo();ut();bo();se();ph=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],n=e[1],o=e[2],i=e[3],a=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],c=r.dims[1],p=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],m=c,h=0,y=!n||n.dims.length===0,g=Math.floor(y?p/(t.numHeads+2*t.kvNumHeads):p/t.numHeads);y&&(p=g*t.numHeads);let _=i&&i.dims.length!==0,S=a&&a.dims.length!==0;if(_&&i.dims.length===4&&i.dims[0]===l&&i.dims[1]!==t.kvNumHeads&&i.dims[2]===t.kvNumHeads&&i.dims[3]===g)throw new Error("BSNH pastKey/pastValue is not supported");if(_&&S){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(a.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=i.dims[2]}else if(_||S)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let w=1;if(n&&n.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(n.dims.length<3||n.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(n.dims.length===3){if(r.dims[2]%n.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');m=n.dims[1]}else if(n.dims.length===5){if(n.dims[2]!==t.numHeads||n.dims[3]!==2||n.dims[4]!==g)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');m=n.dims[1]}else{if(n.dims[1]!==t.numHeads||n.dims[3]!==g)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');m=n.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');w=3}let x=0,T=!1,k=t.kvNumHeads?g*t.kvNumHeads:p;if(o&&o.dims.length>0){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(m!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');k=o.dims[2]}else{if(m!==o.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');k=o.dims[1]*o.dims[3],T=!0}}let C=e.length>4?e[5]:void 0;if(C&&C.dims.length!==1&&C.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:c,pastSequenceLength:h,kvSequenceLength:m,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:p,vHiddenSize:k,headSize:g,vHeadSize:Math.floor(k/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:x,scale:t.scale,broadcastResPosBias:!1,passPastInKv:T,qkvFormat:w}},mh=te({perm:[0,2,1,3]}),Ll=(e,t,r)=>{let n=t,o=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(n=t.reshape([r.batchSize,r.kvSequenceLength,o,r.headSize]),n=e.compute(Oe(n,mh.perm),{inputs:[n],outputs:[-1]})[0]),n},fh=(e,t,r,n)=>{let o=7,i=["type","type"],a=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],c=p=>{let m=P("seq_lens",r.dataType,r.dims),h=P("total_seq_lens",n.dataType,n.dims),y=U("pos_ids",o,a),g=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${p.registerUniforms(g).declareVariables(m,h,y)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${h.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${m.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${y.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${y.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:c}},Gl=(e,t)=>{let r=ph(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let n=e.inputs[0],o=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,i=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,a=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,c=e.inputs.length>5?e.inputs[6]:void 0,p=r.kvNumHeads?r.kvNumHeads:r.numHeads,m=te({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,p*r.headSize,p*r.headSize]}),[h,y,g]=!o&&!i?e.compute(go([n],m),{inputs:[n],outputs:[-1,-1,-1]}):[n,o,i],_,S;if(t.doRotary){let T=e.compute(fh(r.batchSize,r.sequenceLength,l,c),{inputs:[l,c],outputs:[-1]})[0],k=e.inputs[7],C=e.inputs[8],O=te({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),B=[h,T,k,C],M=[-1];_=e.compute(Xr(B,O),{inputs:B,outputs:M})[0],B.splice(0,1,y);let G=te({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});S=e.compute(Xr(B,G),{inputs:B,outputs:M})[0]}let v=Jt(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?_:h,void 0,0),w=Ll(e,t.doRotary?S:y,r),x=Ll(e,g,r);Dt(e,v,w,x,void 0,void 0,a,u,void 0,r,l,c)}});var Fl,hh,gh,ql,Kl=N(()=>{"use strict";re();ie();ut();se();Fl=(e,t,r,n,o,i,a,u)=>{let l=me(i),c=l===1?"f32":`vec${l}f`,p=l===1?"vec2f":`mat2x${l}f`,m=o*a,h=64;m===1&&(h=256);let y=[o,a,i/l],g=[o,a,2],_=["rank","type","type"],S=[];S.push(...V(y,g));let v=w=>{let x=P("x",t.dataType,3,l),T=P("scale",r.dataType,r.dims),k=P("bias",n.dataType,n.dims),C=U("output",1,3,2),O=[x,T,k,C];return`
  var<workgroup> workgroup_shared : array<${p}, ${h}>;
  const workgroup_size = ${h}u;
  ${w.declareVariables(...O)}
  ${w.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${c}(0);
    var squared_sum = ${c}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${c}(${x.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${p}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Fe("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${Fe("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${h}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:g,dataType:1}],dispatchGroup:{x:m},programUniforms:S}),getShaderSource:v},{inputs:[t,r,n],outputs:[-1]})[0]},hh=(e,t,r)=>{let n=t[0].dims,o=n,i=2,a=n[0],u=n[1],l=E.sizeFromDimension(n,i),c=me(l),p=E.size(o)/c,m=Fl(e,t[0],t[1],t[2],a,l,u,r.epsilon),h=[a,u,l/c],y=[a,u],g=["type","none"],_=S=>{let v=P("x",t[0].dataType,h.length,c),w=P("scale_shift",1,y.length,2),x=U("output",t[0].dataType,h.length,c),T=[v,w,x];return`
  ${S.registerUniform("output_size","u32").declareVariables(...T)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${x.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${v.getByOffset("global_idx")} * ${x.type.value}(scale_shift.x) + ${x.type.value}(scale_shift.y);
      ${x.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${c}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:o,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:[{type:12,data:p},...V(h,y,h)]}),getShaderSource:_},{inputs:[t[0],m]})},gh=(e,t,r)=>{let n=t[0].dims,o=n,i=n[0],a=n[n.length-1],u=E.sizeFromDimension(n,1)/a,l=me(a),c=E.size(o)/l,p=[{type:12,data:u},{type:12,data:Math.floor(a/l)}],m=["type","type"],h=!1,y=[0,n.length-1];for(let v=0;v<n.length-2;v++)h=h||n[v+1]!==1,y.push(v+1);h=h&&n[n.length-1]!==1;let g=h?e.compute(Oe(e.inputs[0],y),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:n.length},(v,w)=>n[y[w]])),_=Fl(e,g,t[1],t[2],i,u,a,r.epsilon),S=v=>{let w=ve(t[0].dataType),x=l===1?"vec2f":`mat${l}x2f`,T=O=>{let B=O===0?"x":"y",M=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${w}(${M}(scale.${B}))`;case 2:return`vec2<${w}>(${M}(scale[0].${B}, scale[1].${B}))`;case 4:return`vec4<${w}>(${M}(scale[0].${B}, scale[1].${B}, scale[2].${B}, scale[3].${B}))`;default:throw new Error(`Not supported compoents ${l}`)}},k=P("input",t[0].dataType,t[0].dims,l),C=U("output",t[0].dataType,o,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${k.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${x}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${C.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${v.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${T(0)}, ${T(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:o,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:p}),getShaderSource:S},{inputs:[t[0],_]})},ql=(e,t)=>{t.format==="NHWC"?gh(e,e.inputs,t):hh(e,e.inputs,t)}});var yh,bh,jl,Zl=N(()=>{"use strict";re();ie();se();yh=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},bh=(e,t,r)=>{let n=t.simplified,o=e[0].dims,i=e[1],a=!n&&e[2],u=o,l=E.normalizeAxis(t.axis,o.length),c=E.sizeToDimension(o,l),p=E.sizeFromDimension(o,l),m=E.size(i.dims),h=a?E.size(a.dims):0;if(m!==p||a&&h!==p)throw new Error(`Size of X.shape()[axis:] == ${p}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${m} and bias size of ${h}`);let y=[];for(let k=0;k<o.length;++k)k<l?y.push(o[k]):y.push(1);let g=me(p),_=["type","type"],S=[{type:12,data:c},{type:1,data:p},{type:12,data:Math.floor(p/g)},{type:1,data:t.epsilon}];a&&_.push("type");let v=r>1,w=r>2,x=k=>{let C=ve(e[0].dataType),O=[P("x",e[0].dataType,e[0].dims,g),P("scale",i.dataType,i.dims,g)];a&&O.push(P("bias",a.dataType,a.dims,g)),O.push(U("output",e[0].dataType,u,g)),v&&O.push(U("mean_data_output",1,y)),w&&O.push(U("inv_std_output",1,y));let B=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${k.registerUniforms(B).declareVariables(...O)}
  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Jn("f32",g)};
    var mean_square_vector = ${Jn("f32",g)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Tt(C,g,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Fe("mean_vector",g)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Fe("mean_square_vector",g)} / uniforms.norm_size ${n?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Tt(C,g,"x[j + offset]")};
      let f32scale = ${Tt(C,g,"scale[j]")};
      output[j + offset] = ${O[0].type.value}((f32input ${n?"":"- mean"}) * inv_std_dev * f32scale
        ${a?`+ ${Tt(C,g,"bias[j]")}`:""}
      );
    }

    ${v?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},T=[{dims:u,dataType:e[0].dataType}];return v&&T.push({dims:y,dataType:1}),w&&T.push({dims:y,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${g};${r};${n}`,inputDependencies:_},getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(c/64)},programUniforms:S}),getShaderSource:x}},jl=(e,t)=>{yh(e.inputs),e.compute(bh(e.inputs,t,e.outputCount))}});var _h,Ql,Yl=N(()=>{"use strict";ie();jr();Zr();_h=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Ql=e=>{_h(e.inputs);let t=et.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],n=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&n<8)e.compute(Kr(e.inputs,{activation:""},t));else{let o=t[t.length-2],i=E.size(e.inputs[0].dims.slice(0,-2)),a=E.size(e.inputs[1].dims.slice(0,-2));if(i!==1&&o===1&&a===1){let u=e.inputs[0].reshape([1,i,n]),l=e.inputs[1].reshape([1,n,r]),c=[1,i,r],p=[u,l];e.compute(Xt(p,{activation:""},t,c),{inputs:p})}else e.compute(Xt(e.inputs,{activation:""},t))}}});var wh,vh,$h,Xl,Jl,ed=N(()=>{"use strict";re();ie();Ae();se();wh=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],n=r.dims.length;if(r.dims[n-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let o=Math.floor((t.k+t.blockSize-1)/t.blockSize),i=t.blockSize/8*t.bits,a=e[1];if(!E.areEqual(a.dims,[t.n,o,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let l=e[2].dims;if(E.size(l)!==t.n*o)throw new Error("scales input size error.");if(e.length===4){let p=e[3].dims,m=t.bits>4?t.n*o:t.n*Math.floor((o+1)/2);if(E.size(p)!==m)throw new Error("zeroPoints input size error.")}},vh=(e,t)=>{let r=e[0].dims,n=r.length,o=r[n-2],i=t.k,a=t.n,u=r.slice(0,n-2),l=E.size(u),p=e[1].dims[2]/4,m=e[0].dataType,h=me(t.k),y=me(p),g=me(a),_=u.concat([o,a]),S=o>1&&a/g%2===0?2:1,v=E.size(_)/g/S,w=64,x=[],T=[l,o,i/h],k=E.convertShape(e[1].dims).slice();k.splice(-1,1,p/y),x.push(...V(T)),x.push(...V(k)),x.push(...V(e[2].dims)),e.length===4&&x.push(...V(E.convertShape(e[3].dims)));let C=[l,o,a/g];x.push(...V(C));let O=B=>{let M=T.length,G=P("a",e[0].dataType,M,h),K=P("b",12,k.length,y),Y=P("scales",e[2].dataType,e[2].dims.length),L=[G,K,Y],Q=e.length===4?P("zero_points",12,e[3].dims.length):void 0;Q&&L.push(Q);let xe=C.length,F=U("output",e[0].dataType,xe,g),Z=ve(e[0].dataType),ne=(()=>{switch(h){case 1:return`array<${Z}, 8>`;case 2:return`mat4x2<${Z}>`;case 4:return`mat2x4<${Z}>`;default:throw new Error(`${h}-component is not supported.`)}})(),J=()=>{let $e=`
          // reuse a data
            var input_offset = ${G.indicesToOffset(`${G.type.indices}(batch, row, word_offset)`)};
            var a_data: ${ne};
            for (var j: u32 = 0; j < ${8/h}; j++) {
              a_data[j] = ${G.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let oe=0;oe<g*S;oe++)$e+=`
            b_value = ${y===1?`b${oe}_data`:`b${oe}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${ne}(${Array.from({length:4},(A,W)=>`${Z}(b_value_lower[${W}]), ${Z}(b_value_upper[${W}])`).join(", ")});
            b_dequantized_values = ${h===1?`${ne}(${Array.from({length:8},(A,W)=>`(b_quantized_values[${W}] - ${Q?`zero_point${oe}`:"zero_point"}) * scale${oe}`).join(", ")});`:`(b_quantized_values - ${ne}(${Array(8).fill(`${Q?`zero_point${oe}`:"zero_point"}`).join(",")})) * scale${oe};`};
            workgroup_shared[local_id.x * ${S} + ${Math.floor(oe/g)}]${g>1?`[${oe%g}]`:""} += ${Array.from({length:8/h},(A,W)=>`${h===1?`a_data[${W}] * b_dequantized_values[${W}]`:`dot(a_data[${W}], b_dequantized_values[${W}])`}`).join(" + ")};
          `;return $e},de=()=>{let $e=`
            var col_index = col * ${g};
            ${Q?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Z}(8);`}
            `;for(let oe=0;oe<g*S;oe++)$e+=`
            let scale${oe} = ${Y.getByOffset("col_index * nBlocksPerCol + block")};
            ${Q?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${Q.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${oe} = ${Z}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return $e},ye=()=>{let $e=`col_index = col * ${g};`;for(let oe=0;oe<g*S;oe++)$e+=`
            let b${oe}_data = ${K.getByIndices(`${K.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return $e+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${ne};
            var b_dequantized_values: ${ne};`,$e};return`
        var<workgroup> workgroup_shared: array<${F.type.value}, ${S*w}>;
        ${B.declareVariables(...L,F)}
        ${B.mainStart([w,1,1])}
          let output_indices = ${F.offsetToIndices(`(global_idx / ${w}) * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${w}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/h};
            ${de()}
            for (var word: u32 = 0; word < ${p}; word += ${y}) {
              ${ye()}
              for (var i: u32 = 0; i < ${y}; i++) {
                ${J()}
                word_offset += ${8/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${S}) {
            var output_value: ${F.type.value} = ${F.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${w}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${S};
            }
            ${F.setByIndices(`${F.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${h};${y};${g};${S};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:m}],dispatchGroup:{x:v},programUniforms:x}),getShaderSource:O}},$h=(e,t)=>{let r=e[0].dims,n=r.length,o=r[n-2],i=t.k,a=t.n,u=r.slice(0,n-2),l=E.size(u),p=e[1].dims[2]/4,m=e[0].dataType,h=me(t.k),y=me(p),g=u.concat([o,a]),_=128,S=a%8===0?8:a%4===0?4:1,v=_/S,w=v*y*8,x=w/h,T=w/t.blockSize,k=E.size(g)/S,C=[],O=[l,o,i/h],B=E.convertShape(e[1].dims).slice();B.splice(-1,1,p/y),C.push(...V(O)),C.push(...V(B)),C.push(...V(e[2].dims)),e.length===4&&C.push(...V(E.convertShape(e[3].dims)));let M=[l,o,a];C.push(...V(M));let G=K=>{let Y=O.length,L=P("a",e[0].dataType,Y,h),Q=P("b",12,B.length,y),xe=P("scales",e[2].dataType,e[2].dims.length),F=[L,Q,xe],Z=e.length===4?P("zero_points",12,e[3].dims.length):void 0;Z&&F.push(Z);let ne=M.length,J=U("output",e[0].dataType,ne),de=ve(e[0].dataType),ye=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${de}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${de}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${de}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${de}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${L.type.value}, ${x}>;
        var<workgroup> inter_results: array<array<${J.type.value}, ${v}>, ${S}>;
        ${K.declareVariables(...F,J)}
        ${K.mainStart([v,S,1])}
          let output_indices = ${J.offsetToIndices(`workgroup_index * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${T} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${x};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${x}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${L.getByIndices(`${L.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${L.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${T} + local_id.x;
            ${Z?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${Z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${de}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${de}(8);`}
            let scale = ${xe.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${Q.getByIndices(`${Q.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/h};
            for (var i: u32 = 0; i < ${y}; i++) {
              ${ye()}
              let b_value = ${y===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${de}>(${Array.from({length:4},($e,oe)=>`${de}(b_value_lower[${oe}]), ${de}(b_value_upper[${oe}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${de}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},($e,oe)=>`${`dot(a_data${oe}, b_dequantized_values[${oe}])`}`).join(" + ")};
              word_offset += ${8/h};
            }
            workgroupBarrier();
          }

          if (local_idx < ${S}) {
            var output_value: ${J.type.value} = ${J.type.value}(0);
            for (var b = 0u; b < ${v}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${J.setByIndices(`${J.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${h};${y};${v};${S}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:m}],dispatchGroup:{x:k},programUniforms:C}),getShaderSource:G}},Xl=(e,t)=>{wh(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute($h(e.inputs,t)):e.compute(vh(e.inputs,t))},Jl=e=>te(e)});var xh,Sh,Th,Ih,Ch,Ah,kh,Eh,td,rd=N(()=>{"use strict";re();ie();se();xh=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Sh=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
            k = i32(${e.indicesGet("indices",o)}) - ${q("uniforms.pads",o,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${q("uniforms.x_shape",o,t)})) {
              break;
            }
            offset += k * i32(${q("uniforms.x_strides",o,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${n}
            value = x[offset];
          }
      `},Th=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${q("uniforms.pads",o,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${q("uniforms.x_shape",o,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${q("uniforms.x_shape",o,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${q("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},Ih=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${q("uniforms.pads",o,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${q("uniforms.x_shape",o,t)})) {
                  k = i32(${q("uniforms.x_shape",o,t)}) - 1;
                }
                offset += k * i32(${q("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},Ch=(e,t,r)=>{let n="";for(let o=t-1;o>=0;--o)n+=`
                k = i32(${e.indicesGet("indices",o)}) - ${q("uniforms.pads",o,r)};
                if (k < 0)  {
                  k += i32(${q("uniforms.x_shape",o,t)}]);
                }
                if (k >= i32(${q("uniforms.x_shape",o,t)})) {
                  k -= i32(${q("uniforms.x_shape",o,t)});
                }
                offset += k * i32(${q("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${n}
              value = x[offset];
          `},Ah=(e,t,r)=>{switch(r.mode){case 0:return Sh(e,t,r.pads.length);case 1:return Th(e,t,r.pads.length);case 2:return Ih(e,t,r.pads.length);case 3:return Ch(e,t,r.pads.length);default:throw new Error("Invalid mode")}},kh=(e,t)=>{let r=E.padShape(e[0].dims.slice(),t.pads),n=e[0].dims,o=E.size(r),i=[{type:12,data:o},{type:6,data:t.pads}],a=e.length>=3&&e[2].data;t.mode===0&&i.push({type:a?e[2].dataType:1,data:t.value}),i.push(...V(e[0].dims,r));let u=["rank"],l=c=>{let p=U("output",e[0].dataType,r.length),m=P("x",e[0].dataType,n.length),h=m.type.value,y=Ah(p,n.length,t),g=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&g.push({name:"constant_value",type:a?h:"f32"}),`
            ${c.registerUniforms(g).declareVariables(m,p)}
            ${c.mainStart()}
            ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${p.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${y}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${a}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(E.size(r)/64)},programUniforms:i}),getShaderSource:l}},Eh=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),n=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,o=e[0].dims.length,i=new Int32Array(2*o).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)i[Number(u[l])]=Number(r[l]),i[Number(u[l])+o]=Number(r[l+u.length])}else r.forEach((u,l)=>i[Number(l)]=Number(u));let a=[];return i.forEach(u=>a.push(u)),{mode:t.mode,value:n,pads:a}}else return t},td=(e,t)=>{xh(e.inputs);let r=Eh(e.inputs,t);e.compute(kh(e.inputs,r),{inputs:[0]})}});var Jr,nd,od,id,ad,Ph,zh,sd,ud,ld,dd,cd,pd,md,fd,hd,gd,yd,bd,_d=N(()=>{"use strict";Le();re();ie();se();Jr=e=>{if(we.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},nd=(e,t,r)=>{let n=t.format==="NHWC",o=e.dims.slice();n&&o.splice(1,0,o.pop());let i=Object.hasOwnProperty.call(t,"dilations"),a=t.kernelShape.slice(),u=t.strides.slice(),l=i?t.dilations.slice():[],c=t.pads.slice();xt.adjustPoolAttributes(r,o,a,u,l,c);let p=xt.computePoolOutputShape(r,o,u,l,a,c,t.autoPad),m=Object.assign({},t);i?Object.assign(m,{kernelShape:a,strides:u,pads:c,dilations:l,cacheKey:t.cacheKey}):Object.assign(m,{kernelShape:a,strides:u,pads:c,cacheKey:t.cacheKey});let h=p.slice();return h.push(h.splice(1,1)[0]),[m,n?h:p]},od=(e,t)=>{let r=t.format==="NHWC",n=E.size(e),o=E.size(t.kernelShape),i=[{type:12,data:n},{type:12,data:o}],a=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],c=t.pads[t.pads.length/2-1],p=t.pads[t.pads.length-1],m=!!(c+p);i.push({type:12,data:u},{type:12,data:l},{type:12,data:c},{type:12,data:p}),a.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let y=t.kernelShape[t.kernelShape.length-2],g=t.strides[t.strides.length-2],_=t.pads[t.pads.length/2-2],S=t.pads[t.pads.length-2];h=!!(_+S),i.push({type:12,data:y},{type:12,data:g},{type:12,data:_},{type:12,data:S}),a.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,a,!0,m,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=E.computeStrides(t.kernelShape);i.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),a.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((c,p)=>c+p);return[i,a,!!l,!1,!1]}},id=(e,t,r,n,o,i,a,u,l,c,p,m)=>{let h=o.format==="NHWC",y=t.type.value,g=U("output",t.type.tensor,n);if(o.kernelShape.length<=2){let _="",S="",v="",w=r-(h?2:1);if(p?_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${w}] < 0 || xIndices[${w}]
                      >= uniforms.x_shape[${w}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`:_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${i}
                }`,o.kernelShape.length===2){let T=r-(h?3:2);m?S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${T}] = indices[${T}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${T}] < 0 || xIndices[${T}] >= uniforms.x_shape[${T}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${T}] = indices[${T}] * uniforms.sh - uniforms.phStart + j;
                `,v=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var value = ${y}(${u});
              var pad = 0;
              ${S}
              ${_}
              ${v}
              ${a}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let _=o.kernelShape.length,S=o.pads.length,v="";return c?v=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${i}
              }`:v=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${e.registerUniforms(l).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var offsets: array<u32, ${_}>;

              var value = ${y}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${_-1}u; j++) {
                  offsets[j] = offset / ${q("uniforms.kernelStrides","j",_)};
                  offset -= offsets[j] * ${q("uniforms.kernelStrides","j",_)};
                }
                offsets[${_-1}] = offset;

                isPad = false;
                for (var j = ${r-_}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${q("uniforms.strides",`j - ${r-_}u`,_)}
                    + offsets[j - ${r-_}u] - ${q("uniforms.pads","j - 2u",S)};
                  ${v}
              }
              ${a}

              output[global_idx] = value;
            }`}},ad=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Ph=e=>`${ad(e)};${e.countIncludePad}`,zh=e=>`${ad(e)};${e.storageOrder};${e.dilations}`,sd=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),ud=(e,t,r,n)=>{let[o,i]=nd(t,n,r),a=P("x",t.dataType,t.dims.length),u=a.type.value,l="value += x_val;",c="";o.countIncludePad?c+=`value /= ${u}(uniforms.kernelSize);`:c+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[p,m,h,y,g]=od(i,o);p.push(...V(t.dims,i));let _=["rank"];return{name:e,shaderCache:{hint:`${n.cacheKey};${h};${y};${g}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(E.size(i)/64)},programUniforms:p}),getShaderSource:S=>id(S,a,t.dims.length,i.length,o,l,c,0,m,h,y,g)}},ld=e=>{let t=e.count_include_pad!==0,r=sd(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let n={countIncludePad:t,...r,cacheKey:""};return{...n,cacheKey:Ph(n)}},dd=(e,t)=>{Jr(e.inputs),e.compute(ud("AveragePool",e.inputs[0],!1,t))},cd={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},pd=e=>{let t=e.format;return{format:t,...cd,cacheKey:t}},md=(e,t)=>{Jr(e.inputs),e.compute(ud("GlobalAveragePool",e.inputs[0],!0,t))},fd=(e,t,r,n)=>{let[o,i]=nd(t,n,r),a=`
      value = max(x_val, value);
    `,u="",l=P("x",t.dataType,t.dims.length),c=["rank"],[p,m,h,y,g]=od(i,o);return p.push(...V(t.dims,i)),{name:e,shaderCache:{hint:`${n.cacheKey};${h};${y};${g}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:i,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(E.size(i)/64)},programUniforms:p}),getShaderSource:_=>id(_,l,t.dims.length,i.length,o,a,u,t.dataType===10?-65504:-1e5,m,h,y,g)}},hd=(e,t)=>{Jr(e.inputs),e.compute(fd("MaxPool",e.inputs[0],!1,t))},gd=e=>{let t=e.storage_order,r=e.dilations,n=sd(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(n.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let o={storageOrder:t,dilations:r,...n,cacheKey:""};return{...o,cacheKey:zh(o)}},yd=e=>{let t=e.format;return{format:t,...cd,cacheKey:t}},bd=(e,t)=>{Jr(e.inputs),e.compute(fd("GlobalMaxPool",e.inputs[0],!0,t))}});var Dh,Bh,wd,vd,$d=N(()=>{"use strict";re();ie();Ae();se();Dh=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,n)=>r===e[2].dims[n]).reduce((r,n)=>r&&n,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((o,i)=>i===t.axis||o===e[0].dims[i]).reduce((o,i)=>o&&i,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],n=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/n)||t.blockSize>Math.ceil(r/(n-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Bh=(e,t)=>{let r=E.normalizeAxis(t.axis,e[0].dims.length),n=e[0].dataType,o=n===3,i=e[0].dims,a=e[1].dataType,u=E.size(i),l=n===3||n===2,c=l?[Math.ceil(E.size(e[0].dims)/4)]:e[0].dims,p=e[1].dims,m=e.length>2?e[2]:void 0,h=m?l?[Math.ceil(E.size(m.dims)/4)]:m.dims:void 0,y=p.length===0||p.length===1&&p[0]===1,g=y===!1&&p.length===1,_=me(u),S=y&&(!l||_===4),v=S?_:1,w=S&&!l?_:1,x=P("input",l?12:n,c.length,w),T=P("scale",a,p.length),k=m?P("zero_point",l?12:n,h.length):void 0,C=U("output",a,i.length,v),O=[x,T];k&&O.push(k);let B=[c,p];m&&B.push(h);let M=[{type:12,data:u/v},{type:12,data:r},{type:12,data:t.blockSize},...V(...B,i)],G=K=>{let Y=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${K.registerUniforms(Y).declareVariables(...O,C)}
      ${K.mainStart()}
          ${K.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${C.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${x.getByOffset("global_idx / 4")};
            let x_vec = ${o?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${v===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${x.getByOffset("global_idx")};`};

          // Set scale input
          ${y?`let scale_value= ${T.getByOffset("0")}`:g?`
            let scale_index = ${C.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${T.getByOffset("scale_index")};`:`
            var scale_indices: ${T.type.indices} = output_indices;
            let index = ${T.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${T.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${T.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${k?y?l?`
                let zero_point_input = ${k.getByOffset("0")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${k.getByOffset("0")}`:g?l?`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${k.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${k.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${T.indicesToOffset("scale_indices")};
                let zero_point_input = ${k.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${k.getByIndices("scale_indices")};`:`let zero_point_value = ${l?o?"i32":"u32":x.type.value}(0);`};
      // Compute and write output
      ${C.setByOffset("global_idx",`${C.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:k?["rank","rank","rank"]:["rank","rank"]},getShaderSource:G,getRunData:()=>({outputs:[{dims:i,dataType:a}],dispatchGroup:{x:Math.ceil(u/v/64),y:1,z:1},programUniforms:M})}},wd=(e,t)=>{Dh(e.inputs,t),e.compute(Bh(e.inputs,t))},vd=e=>te({axis:e.axis,blockSize:e.blockSize})});var Rh,Mh,xd,Sd=N(()=>{"use strict";Le();re();se();Rh=(e,t,r)=>{let n=e===t,o=e<t&&r<0,i=e>t&&r>0;if(n||o||i)throw new Error("Range these inputs' contents are invalid.")},Mh=(e,t,r,n)=>{let o=Math.abs(Math.ceil((t-e)/r)),i=[o],a=o,u=[{type:12,data:a},{type:n,data:e},{type:n,data:r},...V(i)],l=c=>{let p=U("output",n,i.length),m=p.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:m},{name:"delta",type:m}];return`
        ${c.registerUniforms(h).declareVariables(p)}
        ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${m}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${n}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:i,dataType:n}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:u})}},xd=e=>{let t=0,r=0,n=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],n=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],n=e.inputs[2].getFloat32Array()[0]),we.webgpu.validateInputContent&&Rh(t,r,n),e.compute(Mh(t,r,n,e.inputs[0].dataType),{inputs:[]})}});var Uh,Td,Id,Nh,Cd,Ad,kd=N(()=>{"use strict";re();ie();Ae();se();Uh=(e,t,r,n)=>{if(e!=="none"&&n!=="i32"&&n!=="u32"&&n!=="f32")throw new Error(`Input ${n} is not supported with reduction ${e}.`);let o=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,i=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return n==="i32"||n==="u32"?`atomicAdd(&${t}, bitcast<${n}>(${r}));`:`
              ${o}bitcast<${n}>(oldValue) + (${r})${i}`;case"max":return n==="i32"||n==="u32"?`atomicMax(&${t}, bitcast<${n}>(${r}));`:`
                ${o}max(bitcast<f32>(oldValue), (${r}))${i}`;case"min":return n==="i32"||n==="u32"?`atomicMin(&${t}, bitcast<${n}>(${r}));`:`${o}min(bitcast<${n}>(oldValue), (${r}))${i}`;case"mul":return`${o}(bitcast<${n}>(oldValue) * (${r}))${i}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Td=(e,t)=>`${e===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[${t?"i - indices_start":"i"}];
    let dim_value = uniforms.output_shape[${t?"i - indices_start":"i"} + uniforms.last_index_dimension];`}
    
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));`,Id=(e,t,r)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${r?"global_idx":"idx"} + i];
        ${Uh(e.reduction,"output[data_offset + i]","value",t)}
      }`,Nh=(e,t)=>{let r=e[0].dims,n=e[1].dims,o=r,i=1,a=Math.ceil(E.size(n)/i),u=n[n.length-1],l=E.sizeFromDimension(r,u),c=E.sizeFromDimension(n,0)/u,p=[{type:12,data:a},{type:12,data:u},{type:12,data:l},...V(e[1].dims,e[2].dims,o)],m=h=>{let y=P("indices",e[1].dataType,e[1].dims.length),g=P("updates",e[2].dataType,e[2].dims.length,i),_=t.reduction!=="none"&&t.reduction!==""?Ja("output",e[0].dataType,o.length):U("output",e[0].dataType,o.length,i);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(y,g,_)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    for (var i = 0; i < ${c}; i = i + 1) {
      for (var j = i + 1; j < ${c}; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    // Process each index-update pair individually when duplicates exist
    for (var idx = 0u; idx < ${c}u; idx++) {
      var data_offset = 0u;
      for (var i = 0u; i < uniforms.last_index_dimension; i++) {
        var index = i32(indices[idx * uniforms.last_index_dimension + i].x);
        ${Td(r.length,!1)}
      }
      ${Id(t,_.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${Td(r.length,!0)}
  }
  ${Id(t,_.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:p}),getShaderSource:m}},Cd=e=>te({reduction:e.reduction}),Ad=(e,t)=>{e.compute(Nh(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}});var Vh,Wh,Lh,Ed,Gh,Hh,Fh,qh,Kh,jh,Zh,Qh,Pd,Yh,Xh,Jh,eg,tg,zd,Od,Dd=N(()=>{"use strict";re();ie();Ae();se();Vh=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Wh=(e,t,r)=>{t.every(o=>o>=0&&o<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let n=new Array(r).fill(1);return t.forEach((o,i)=>n[o]=e[i]),n},Lh=(e,t,r,n,o,i)=>{let[a,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],c=e[0].dims.length;if(a>0&&e.length>a&&e[a].dims.length>0)e[a].getFloat32Array().forEach(p=>i.push(p));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(p=>n.push(p)),n.length!==0&&n.length!==c&&r>=18&&n.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Vh(n,t),t.axes.length>0&&Wh(n,t.axes,c).forEach((p,m)=>n[m]=p)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(p=>o.push(Number(p))),o.length!==0&&o.length!==c&&r>=18&&o.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(o.length!==0&&o.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof n<"u"&&typeof o<"u"&&n.length>0&&o.length>c)throw new Error("Resize requires only of scales or sizes to be specified")},Ed=(e,t,r,n)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${n}(big / (${r}));
  let fract = ${n}(big % (${r})) / ${n}(${r});
  return whole + fract;
`,Gh=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Ed("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Ed("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Hh=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Fh=(e,t,r)=>{let n=new Array(r).fill(0).concat(new Array(r).fill(1)),o=e.length===0?n:e.slice();return t.length>0?(t.forEach((i,a)=>{n[i]=o[a],n[a+r]=o[t.length+a]}),n):o},qh=(e,t,r,n)=>{let o=[];if(r.length>0)if(n.length>0){if(e.forEach(i=>o.push(i)),Math.max(...n)>e.length)throw new Error("axes is out of bound");n.forEach((i,a)=>o[i]=r[a])}else r.forEach(i=>o.push(i));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");o=e.map((i,a)=>Math.round(i*t[a]))}return o},Kh=(e,t,r)=>{let n=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(i=>t[i]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(i=>t[i]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let o=e.slice();return r.axes.length>0?(r.axes.forEach(i=>t[i]=n),r.axes.forEach(i=>o[i]=Math.round(e[i]*t[i]))):(t.fill(n,0,t.length),o.forEach((i,a)=>o[a]=Math.round(i*t[a]))),o},jh=(e,t,r,n,o)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${q("uniforms.scales","i",n)};
        var roi_low = ${q("uniforms.roi","i",o)};
        var roi_hi = ${q("uniforms.roi",`i + ${t.length}`,o)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${q("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${q("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Zh=(e,t,r,n,o,i,a)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${q("uniforms.scales","i",o)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${q("uniforms.roi","i",i)};
          var roi_hi = ${q("uniforms.roi",`i + ${r.length}`,i)};
          var input_shape_i = ${q("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${q("uniforms.output_shape","i",n.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${a} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Qh=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${q("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Pd=(e,t,r,n)=>e.rank>n?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",Yh=(e,t,r,n,o)=>{let[a,u,l,c]=r.length===2?[-1,0,1,-1]:[0,2,3,1],p=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${p} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",u,`max(0, min(row, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(col, ${r[l]} - 1))`)};
      ${Pd(e,c,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${p} = originalIndices[${u}];
      var col:${p} = originalIndices[${l}];
      ${n?`if (row < 0 || row > (${r[u]} - 1) || col < 0 || col > (${r[l]} - 1)) {
        return ${o};
      }`:""};
      row = max(0, min(row, ${r[u]} - 1));
      col = max(0, min(col, ${r[l]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${c}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${p} = getInputValue(batch, channel, row1, col1);
      var x12: ${p} = getInputValue(batch, channel, row1, col2);
      var x21: ${p} = getInputValue(batch, channel, row2, col1);
      var x22: ${p} = getInputValue(batch, channel, row2, col2);
      var dx1: ${p} = abs(row - ${p}(row1));
      var dx2: ${p} = abs(${p}(row2) - row);
      var dy1: ${p} = abs(col - ${p}(col1));
      var dy2: ${p} = abs(${p}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Xh=(e,t,r,n,o,i,a,u,l,c)=>{let p=r.length===2,m=!0,[h,y]=p?[0,1]:m?[2,3]:[1,2],g=e.type.value,_=S=>{let v=S===h?"row":"col";return`
      fn ${v}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${g} {
        var output_index = ${t.indicesGet("output_indices",S)};
        var originalIdx: ${g} = getOriginalCoordinateFromResizedCoordinate(output_index, ${o[S]},
        ${n[S]}, ${r[S]}, ${i[S]}, ${i[S]} + ${r.length});
        var fractOriginalIdx: ${g} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[S]} - 1))) {
          return ${l};
        }
        var data: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${v}: ${g} = originalIdx + ${g}(i);
          if (${v} < 0 || ${v} >= ${r[S]}) {
            ${c?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${v} = max(0, min(${v}, ${r[S]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",S,`u32(${v})`)};
          data[i + 1] = ${S===h?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(h)};
    ${_(y)};
  fn getCubicInterpolationCoefs(s: ${g}) -> array<${g}, 4> {
    var absS = abs(s);
    var coeffs: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${g} = 1.0 - absS;
    var twoMinusAbsS: ${g} = 2.0 - absS;
    var onePlusAbsS: ${g} = 1.0 + absS;
    coeffs[0] = ((${a} * onePlusAbsS - 5 * ${a}) * onePlusAbsS + 8 * ${a}) * onePlusAbsS - 4 * ${a};
    coeffs[1] = ((${a} + 2) * absS - (${a} + 3)) * absS * absS + 1;
    coeffs[2] = ((${a} + 2) * oneMinusAbsS - (${a} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${a} * twoMinusAbsS - 5 * ${a}) * twoMinusAbsS + 8 * ${a}) * twoMinusAbsS - 4 * ${a};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${g}, 4>, coefs: array<${g}, 4>) -> ${g} {
    var coefsSum: ${g} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${g} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Jh=(e,t,r,n,o)=>{let[a,u,l,c,p]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],m=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${m} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",u,`max(0, min(depth, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(height, ${r[l]} - 1))`)};
      ${e.indicesSet("input_indices",c,`max(0, min(width, ${r[c]} - 1))`)};
      ${Pd(e,p,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${m} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${m} = originalIndices[${u}];
      var height:${m} = originalIndices[${l}];
      var width:${m} = originalIndices[${c}];
      ${n?`if (depth < 0 || depth > (${r[u]} - 1) || height < 0 || height > (${r[l]} - 1) || width < 0 || (width > ${r[c]} - 1)) {
      return ${o};
        }`:""};

    depth = max(0, min(depth, ${r[u]} - 1));
      height = max(0, min(height, ${r[l]} - 1));
      width = max(0, min(width, ${r[c]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${p}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${m} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${m} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${m} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${m} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${m} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${m} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${m} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${m} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${m} = abs(depth - ${m}(depth1));
      var dx2: ${m} = abs(${m}(depth2) - depth);
      var dy1: ${m} = abs(height - ${m}(height1));
      var dy2: ${m} = abs(${m}(height2) - height);
      var dz1: ${m} = abs(width - ${m}(width1));
      var dz2: ${m} = abs(${m}(width2) - width);
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
    }`},eg=(e,t,r,n,o,i)=>{let a=e.dims,u=Fh(i,t.axes,a.length),l=qh(a,n,o,t.axes),c=n.slice();n.length===0&&(c=a.map((w,x)=>w===0?1:l[x]/w),t.keepAspectRatioPolicy!=="stretch"&&(l=Kh(a,c,t)));let p=U("output",e.dataType,l.length),m=P("input",e.dataType,a.length),h=E.size(l),y=a.length===l.length&&a.every((w,x)=>w===l[x]),g=t.coordinateTransformMode==="tf_crop_and_resize",_=t.extrapolationValue,S=m.type.value,v=w=>`
      ${y?"":`
      ${Gh(t.coordinateTransformMode,S)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Qh(m,a)};
              ${Hh(t.nearestMode,r,S)};
              ${Zh(m,p,a,l,c.length,u.length,g)};
              `;case"linear":return`
              ${jh(p,a,l,c.length,u.length)};
              ${(()=>{if(a.length===2||a.length===4)return`${Yh(m,p,a,g,_)}`;if(a.length===3||a.length===5)return`${Jh(m,p,a,g,_)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(a.length===2||a.length===4)return`${Xh(m,p,a,l,c,u,t.cubicCoeffA,g,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",c.length).registerUniform("roi","f32",u.length).declareVariables(m,p)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${y?"output[global_idx] = input[global_idx];":`
        let output_indices = ${p.offsetToIndices("global_idx")};
        var input_indices: ${m.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${m.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${a.length===2||a.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${c.length>0?t.mode==="cubic"?c:c.length:""}|${o.length>0?o:""}|${u.length>0?u:""}|${y}|${t.mode==="nearest"?a.length:a}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:c},{type:1,data:u},...V(a,l)]})}},tg=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},zd=(e,t)=>{let r=[],n=[],o=[],i=tg(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Lh(e.inputs,t,i,r,n,o),e.compute(eg(e.inputs[0],t,i,r,n,o),{inputs:[0]})},Od=e=>{let t=e.antialias,r=e.axes,n=e.coordinateTransformMode,o=e.cubicCoeffA,i=e.excludeOutside!==0,a=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,c=e.nearestMode===""?"simple":e.nearestMode;return te({antialias:t,axes:r,coordinateTransformMode:n,cubicCoeffA:o,excludeOutside:i,extrapolationValue:a,keepAspectRatioPolicy:u,mode:l,nearestMode:c})}});var rg,ng,Bd,Rd=N(()=>{"use strict";re();ie();se();rg=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],n=e[2];if(t.dataType!==r.dataType||t.dataType!==n.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let o=t.dims[t.dims.length-1],i=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==o)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(n.dims.length!==1)throw new Error("Gamma must be 1D");if(n.dims[n.dims.length-1]!==o)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let a=e[3];if(a.dims.length!==1)throw new Error("Beta must be 1D");if(a.dims[a.dims.length-1]!==o)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let a=e[4];if(a.dims.length!==1)throw new Error("Bias must be 1D");if(a.dims[a.dims.length-1]!==o)throw new Error("Bias must have the same hidden size as input")}},ng=(e,t,r,n)=>{let o=t.simplified,i=e[0].dims,a=E.size(i),u=i,l=a,c=i.slice(-1)[0],p=n?i.slice(0,-1).concat(1):[],m=!o&&e.length>3,h=e.length>4,y=n&&r>1,g=n&&r>2,_=r>3,S=64,v=me(c),w=[{type:12,data:l},{type:12,data:v},{type:12,data:c},{type:1,data:t.epsilon}],x=k=>{let C=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],O=[P("x",e[0].dataType,e[0].dims,v),P("skip",e[1].dataType,e[1].dims,v),P("gamma",e[2].dataType,e[2].dims,v)];m&&O.push(P("beta",e[3].dataType,e[3].dims,v)),h&&O.push(P("bias",e[4].dataType,e[4].dims,v)),O.push(U("output",e[0].dataType,u,v)),y&&O.push(U("mean_output",1,p)),g&&O.push(U("inv_std_output",1,p)),_&&O.push(U("input_skip_bias_sum",e[0].dataType,u,v));let B=ve(e[0].dataType),M=ve(1,v);return`

      ${k.registerUniforms(C).declareVariables(...O)}
      var<workgroup> sum_shared : array<${M}, ${S}>;
      var<workgroup> sum_squared_shared : array<${M}, ${S}>;

      ${k.mainStart([S,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${S};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${S};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${S-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":B+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${_?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Tt(B,v,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${S};
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
        let mean = ${Fe("sum",v)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Fe("square_sum",v)} / f32(uniforms.hidden_size) ${o?"":"- mean * mean"} + uniforms.epsilon);
        ${y?"mean_output[global_idx] = mean;":""}
        ${g?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o?"":`- ${B}(mean)`}) *
            ${B}(inv_std_dev) * gamma[offset1d + i]
            ${m?"+ beta[offset1d + i]":""};
        }
      }`},T=[{dims:u,dataType:e[0].dataType}];return r>1&&T.push({dims:p,dataType:1}),r>2&&T.push({dims:p,dataType:1}),r>3&&T.push({dims:i,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${v};${y};${g};${_}`,inputDependencies:e.map((k,C)=>"type")},getShaderSource:x,getRunData:()=>({outputs:T,dispatchGroup:{x:Math.ceil(l/c)},programUniforms:w})}},Bd=(e,t)=>{rg(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(ng(e.inputs,t,e.outputCount,!1),{outputs:n})}});var og,en,ig,Md,ag,sg,Ud,Nd,Vd=N(()=>{"use strict";re();ie();Ae();se();og=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,n)=>{if(e[n+1].dataType!==6&&e[n+1].dataType!==7)throw new Error(`Input ${n} must be an array of int32 or int64`)})},en=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(n=>r.push(Number(n)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(n=>r.push(Number(n)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},ig=(e,t)=>{if(e.length>1){let r=en(e,1),n=en(e,2),o=en(e,3);return o.length===0&&(o=[...Array(e[0].dims.length).keys()]),te({starts:r,ends:n,axes:o})}else return t},Md=(e,t,r,n,o)=>{let i=e;return e<0&&(i+=r[n[t]]),o[t]<0?Math.max(0,Math.min(i,r[n[t]]-1)):Math.max(0,Math.min(i,r[n[t]]))},ag=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${q("uniforms.input_shape","i",r.length)};
            let steps_i = ${q("uniforms.steps","i",r.length)};
            let signs_i = ${q("uniforms.signs","i",r.length)};
            let starts_i = ${q("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,sg=(e,t)=>{let r=e[0].dims,n=E.size(r),o=t.axes.length>0?E.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],i=en(e,4);i.forEach(v=>v!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(o.length).fill(1));let a=t.starts.map((v,w)=>Md(v,w,r,o,i)),u=t.ends.map((v,w)=>Md(v,w,r,o,i));if(o.length!==a.length||o.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(o.length!==r.length)for(let v=0;v<r.length;++v)o.includes(v)||(a.splice(v,0,0),u.splice(v,0,r[v]),i.splice(v,0,1));let l=i.map(v=>Math.sign(v));i.forEach((v,w,x)=>{if(v<0){let T=(u[w]-a[w])/v,k=a[w],C=k+T*i[w];a[w]=C,u[w]=k,x[w]=-v}});let c=r.slice(0);o.forEach((v,w)=>{c[v]=Math.ceil((u[v]-a[v])/i[v])});let p={dims:c,dataType:e[0].dataType},m=U("output",e[0].dataType,c.length),h=P("input",e[0].dataType,e[0].dims.length),y=E.size(c),g=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:a.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:i.length}],_=[{type:12,data:y},{type:12,data:a},{type:6,data:l},{type:12,data:i},...V(e[0].dims,c)],S=v=>`
      ${v.registerUniforms(g).declareVariables(h,m)}
        ${ag(h,m,r)}
        ${v.mainStart()}
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${m.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${m.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${a.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:S,getRunData:()=>({outputs:[p],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:_})}},Ud=(e,t)=>{og(e.inputs,t);let r=ig(e.inputs,t);e.compute(sg(e.inputs,r),{inputs:[0]})},Nd=e=>{let t=e.starts,r=e.ends,n=e.axes;return te({starts:t,ends:r,axes:n})}});var ug,lg,Wd,Ld,Gd=N(()=>{"use strict";re();ie();Ae();ut();se();ug=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},lg=(e,t)=>{let r=e.inputs[0],n=r.dims,o=E.size(n),i=n.length,a=E.normalizeAxis(t.axis,i),u=a<n.length-1,l,c=[];u?(c=Array.from({length:i},(O,B)=>B),c[a]=i-1,c[i-1]=a,l=e.compute(Oe(r,c),{inputs:[r],outputs:[-1]})[0]):l=r;let p=l.dims,m=p[i-1],h=o/m,y=me(m),g=m/y,_=64;h===1&&(_=256);let S=(O,B)=>B===4?`max(max(${O}.x, ${O}.y), max(${O}.z, ${O}.w))`:B===2?`max(${O}.x, ${O}.y)`:B===3?`max(max(${O}.x, ${O}.y), ${O}.z)`:O,v=P("x",l.dataType,l.dims,y),w=U("result",l.dataType,l.dims,y),x=v.type.value,T=ve(l.dataType)==="f32"?`var threadMax = ${x}(-3.402823e+38f);`:`var threadMax = ${x}(-65504.0h);`,k=O=>`
      var<workgroup> rowMaxShared : ${x};
      var<workgroup> rowSumShared : ${x};
      var<workgroup> threadShared : array<${x}, ${_}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${x} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${x}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${O.registerUniform("packedCols","i32").declareVariables(v,w)}
      ${O.mainStart(_)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${_};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${T}
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
          rowMaxShared = ${x}(${S("threadShared[0]",y)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${x}(0.0);
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
          rowSumShared = ${x}(${Fe("threadShared[0]",y)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,C=e.compute({name:"Softmax",shaderCache:{hint:`${y};${_}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:p,dataType:l.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:g}]}),getShaderSource:k},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(Oe(C,c),{inputs:[C]})},Wd=(e,t)=>{ug(e.inputs),lg(e,t)},Ld=e=>te({axis:e.axis})});var Hd,dg,cg,pg,Fd,qd=N(()=>{"use strict";re();ie();se();Hd=e=>Array.from(e.getBigInt64Array(),Number),dg=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Hd(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},cg=(e,t)=>{let r=[];for(let n=0;n<e.length;++n)r.push(e[n]*t[n]);return r},pg=(e,t)=>{let r=e[0].dims,n=t??Hd(e[1]),o=cg(r,n),i=E.size(o),a=e[0].dataType,u=P("input",a,r.length),l=U("output",a,o.length),c=p=>`
      const inputShape = ${u.indices(...r)};
      ${p.registerUniform("output_size","u32").declareVariables(u,l)}
      ${p.mainStart()}
      ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${n}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...V(e[0].dims,o)]}),getShaderSource:c}},Fd=e=>{dg(e.inputs),e.compute(pg(e.inputs),{inputs:[0]})}});var mg,fg,Kd,jd=N(()=>{"use strict";re();ie();se();mg=(e,t,r,n,o)=>{let i=U("output_data",o,r.length,4),a=P("a_data",t[1].dataType,t[1].dims.length,4),u=P("b_data",t[2].dataType,t[2].dims.length,4),l=P("c_data",t[0].dataType,t[0].dims.length,4),c,p=(m,h,y)=>`select(${h}, ${m}, ${y})`;if(!n)c=i.setByOffset("global_idx",p(a.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let m=(h,y,g="")=>{let _=`a_data[index_a${y}][component_a${y}]`,S=`b_data[index_b${y}][component_b${y}]`,v=`bool(c_data[index_c${y}] & (0xffu << (component_c${y} * 8)))`;return`
            let output_indices${y} = ${i.offsetToIndices(`global_idx * 4u + ${y}u`)};
            let offset_a${y} = ${a.broadcastedIndicesToOffset(`output_indices${y}`,i)};
            let offset_b${y} = ${u.broadcastedIndicesToOffset(`output_indices${y}`,i)};
            let offset_c${y} = ${l.broadcastedIndicesToOffset(`output_indices${y}`,i)};
            let index_a${y} = offset_a${y} / 4u;
            let index_b${y} = offset_b${y} / 4u;
            let index_c${y} = offset_c${y} / 4u;
            let component_a${y} = offset_a${y} % 4u;
            let component_b${y} = offset_b${y} % 4u;
            let component_c${y} = offset_c${y} % 4u;
            ${h}[${y}] = ${g}(${p(_,S,v)});
          `};o===9?c=`
            var data = vec4<u32>(0);
            ${m("data",0,"u32")}
            ${m("data",1,"u32")}
            ${m("data",2,"u32")}
            ${m("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:c=`
            ${m("output_data[global_idx]",0)}
            ${m("output_data[global_idx]",1)}
            ${m("output_data[global_idx]",2)}
            ${m("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,a,u,i)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${c}
      }`},fg=e=>{let t=e[1].dims,r=e[2].dims,n=e[0].dims,o=e[1].dataType,i=!(E.areEqual(t,r)&&E.areEqual(r,n)),a=t,u=E.size(t);if(i){let c=et.calcShape(et.calcShape(t,r,!1),n,!1);if(!c)throw new Error("Can't perform where op on the given tensors");a=c,u=E.size(a)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:c=>mg(c,e,a,i,o),getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...V(n,t,r,a)]})}},Kd=e=>{e.compute(fg(e.inputs))}});var Zd,Qd=N(()=>{"use strict";As();Lr();Ps();Os();bu();ku();zu();ju();tl();ol();sl();pl();hl();yl();wl();xl();Il();kl();zl();Bl();Hl();Kl();Zl();Yl();ed();ho();rd();_d();$d();Sd();kd();Vr();Dd();bo();Rd();Vd();Gd();yo();qd();ut();Hr();jd();Zd=new Map([["Abs",[Ds]],["Acos",[Bs]],["Acosh",[Rs]],["Add",[_u]],["ArgMax",[Cs,to]],["ArgMin",[Is,to]],["Asin",[Ms]],["Asinh",[Us]],["Atan",[Ns]],["Atanh",[Vs]],["Attention",[ks]],["AveragePool",[dd,ld]],["BatchNormalization",[Es]],["BiasAdd",[zs]],["BiasSplitGelu",[yu]],["Cast",[Ls,Ws]],["Ceil",[Hs]],["Clip",[Gs]],["Concat",[Eu,Pu]],["Conv",[co,lo]],["ConvTranspose",[el,Xu]],["Cos",[Fs]],["Cosh",[qs]],["CumSum",[rl,nl]],["DepthToSpace",[il,al]],["DequantizeLinear",[wd,vd]],["Div",[wu]],["Einsum",[dl,cl]],["Elu",[Ks,Qt]],["Equal",[vu]],["Erf",[js]],["Exp",[Zs]],["Expand",[fl]],["FastGelu",[gl]],["Floor",[Qs]],["FusedConv",[co,lo]],["Gather",[_l,bl]],["GatherElements",[Al,Cl]],["GatherBlockQuantized",[Sl,Tl]],["GatherND",[vl,$l]],["Gelu",[Ys]],["Gemm",[Pl,El]],["GlobalAveragePool",[md,pd]],["GlobalMaxPool",[bd,yd]],["Greater",[Tu]],["GreaterOrEqual",[Cu]],["GridSample",[Ol,Dl]],["GroupQueryAttention",[Gl]],["HardSigmoid",[iu,ou]],["InstanceNormalization",[ql]],["LayerNormalization",[jl]],["LeakyRelu",[Xs,Qt]],["Less",[Iu]],["LessOrEqual",[Au]],["Log",[fu]],["MatMul",[Ql]],["MatMulNBits",[Xl,Jl]],["MaxPool",[hd,gd]],["Mul",[$u]],["MultiHeadAttention",[Ul,Ml]],["Neg",[eu]],["Not",[Js]],["Pad",[td]],["Pow",[xu]],["QuickGelu",[hu,Qt]],["Range",[xd]],["Reciprocal",[tu]],["ReduceMin",[ws]],["ReduceMean",[hs]],["ReduceMax",[_s]],["ReduceSum",[$s]],["ReduceProd",[vs]],["ReduceL1",[gs]],["ReduceL2",[ys]],["ReduceLogSum",[Ss]],["ReduceLogSumExp",[bs]],["ReduceSumSquare",[xs]],["Relu",[ru]],["Resize",[zd,Od]],["RotaryEmbedding",[Wl]],["ScatterND",[Ad,Cd]],["Sigmoid",[nu]],["Sin",[au]],["Sinh",[su]],["Slice",[Ud,Nd]],["SkipLayerNormalization",[Bd]],["Split",[Nl,Vl]],["Sqrt",[uu]],["Softmax",[Wd,Ld]],["Sub",[Su]],["Tan",[lu]],["Tanh",[cu]],["ThresholdedRelu",[mu,Qt]],["Tile",[Fd]],["Transpose",[rs,ns]],["Where",[Kd]]])});var tn,Yd=N(()=>{"use strict";Le();Je();se();tn=class{constructor(t){this.backend=t;this.repo=new Map,this.attributesBound=!1}getArtifact(t){return this.repo.get(t)}setArtifact(t,r){this.repo.set(t,r)}run(t,r,n,o,i){Ne(t.programInfo.name);let a=this.backend.device,u=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let l=[];for(let p of r)l.push({binding:l.length,resource:{buffer:p.buffer}});for(let p of n)l.push({binding:l.length,resource:{buffer:p.buffer}});i&&l.push({binding:l.length,resource:i});let c=a.createBindGroup({layout:t.computePipeline.getBindGroupLayout(0),entries:l,label:t.programInfo.name});if(this.backend.sessionStatus==="capturing"){let p={kernelId:this.backend.currentKernelId,computePipeline:t.computePipeline,bindGroup:c,dispatchGroup:o};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(p)}u.setPipeline(t.computePipeline),u.setBindGroup(0,c),u.dispatchWorkgroups(...o),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Re(t.programInfo.name)}dispose(){}build(t,r){Ne(t.name);let n=this.backend.device,o=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(m=>{n.features.has(m.feature)&&o.push(`enable ${m.extension};`)});let a=es(r,this.backend.device.limits),u=t.getShaderSource(a),l=`${o.join(`
`)}
${a.additionalImplementations}
${u}`,c=n.createShaderModule({code:l,label:t.name});ue("verbose",()=>`[WebGPU] ${t.name} shader code: ${l}`);let p=n.createComputePipeline({compute:{module:c,entryPoint:"main"},layout:"auto",label:t.name});return Re(t.name),{programInfo:t,computePipeline:p,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(t){let r=typeof t=="number"?t:t.x,n=typeof t=="number"?1:t.y||1,o=typeof t=="number"?1:t.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(r<=i&&n<=i&&o<=i)return[r,n,o];let a=r*n*o,u=Math.ceil(Math.sqrt(a));if(u>i){if(u=Math.ceil(Math.cbrt(a)),u>i)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[u,u,u]}else return[u,u,1]}}});var Xd={};zt(Xd,{WebGpuBackend:()=>wo});var hg,gg,_o,wo,Jd=N(()=>{"use strict";Le();re();Je();Ln();Xa();Qd();Yd();hg=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let n=0;n<e.length;++n){let o=e[n].dataType;switch(t[n]){case"none":{r.push("");break}case"type":{r.push(`${o}`);break}case"rank":{let i=e[n].dims.length;r.push(`${o};${i}`);break}case"dims":{let i=e[n].dims.join(",");r.push(`${o};${i}`);break}default:throw new Error(`unsupported input dependency: ${t[n]}`)}}return r.join("|")},gg=(e,t,r)=>{let n=e.name;return e.shaderCache?.hint&&(n+="["+e.shaderCache.hint+"]"),n+=":"+r+`:${hg(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,n},_o=class{constructor(t){t&&(this.architecture=t.architecture,this.vendor=t.vendor)}isArchitecture(t){return this.architecture===t}isVendor(t){return this.vendor===t}},wo=class{constructor(){this.currentSessionId=null;this.currentKernelId=null;this.commandEncoder=null;this.computePassEncoder=null;this.maxDispatchNumber=16;this.pendingDispatchNumber=0;this.pendingKernels=[];this.pendingQueries=new Map;this.sessionStatus="default";this.capturedCommandList=new Map;this.capturedPendingKernels=new Map;this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let t=this.kernelCustomData.get(this.currentKernelId);return t||(t={},this.kernelCustomData.set(this.currentKernelId,t)),t}async initialize(t,r){this.env=t;let n=[],o={requiredLimits:{maxComputeWorkgroupStorageSize:r.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:r.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:r.limits.maxStorageBufferBindingSize,maxBufferSize:r.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:r.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:r.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:r.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:r.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},i=a=>r.features.has(a)&&n.push(a)&&!0;i("chromium-experimental-timestamp-query-inside-passes")||i("timestamp-query"),i("shader-f16"),i("subgroups"),this.device=await r.requestDevice(o),this.adapterInfo=new _o(r.info||await r.requestAdapterInfo()),this.gpuDataManager=Ya(this),this.programManager=new tn(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Pr(t.logLevel,!!t.debug),this.device.onuncapturederror=a=>{a.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${a.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:r,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let t=this.getCommandEncoder(),r={};this.queryType==="at-passes"&&(r.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=t.beginComputePass(r)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Ne(),this.endComputePass();let t;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),t=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(t,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,t,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&t.mapAsync(GPUMapMode.READ).then(()=>{let r=new BigUint64Array(t.getMappedRange()),n=this.pendingQueries.get(t);for(let o=0;o<r.length/2;o++){let i=n[o],a=i.kernelId,u=this.kernels.get(a),l=u.kernelType,c=u.kernelName,p=i.programName,m=i.inputTensorViews,h=i.outputTensorViews,y=r[o*2],g=r[o*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=y);let _=Number(y-this.queryTimeBase),S=Number(g-this.queryTimeBase);if(!Number.isSafeInteger(_)||!Number.isSafeInteger(S))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:m.map(v=>({dims:v.dims,dataType:Xe(v.dataType)})),outputsMetadata:h.map(v=>({dims:v.dims,dataType:Xe(v.dataType)})),kernelId:a,kernelType:l,kernelName:c,programName:p,startTime:_,endTime:S});else{let v="";m.forEach((x,T)=>{v+=`input[${T}]: [${x.dims}] | ${Xe(x.dataType)}, `});let w="";h.forEach((x,T)=>{w+=`output[${T}]: [${x.dims}] | ${Xe(x.dataType)}, `}),console.log(`[profiling] kernel "${a}|${l}|${c}|${p}" ${v}${w}execution time: ${S-_} ns`)}mr("GPU",`${p}::${y}::${g}`)}t.unmap(),this.pendingQueries.delete(t)}),Re()}run(t,r,n,o,i,a){Ne(t.name);let u=[];for(let x=0;x<r.length;++x){let T=r[x].data;if(T===0)continue;let k=this.gpuDataManager.get(T);if(!k)throw new Error(`no GPU data for input: ${T}`);u.push(k)}let{outputs:l,dispatchGroup:c,programUniforms:p}=t.getRunData(r),m=n.length===0?l.map((x,T)=>T):n;if(m.length!==l.length)throw new Error(`Output size ${m.length} must be equal to ${l.length}.`);let h=[],y=[];for(let x=0;x<l.length;++x){if(!Number.isInteger(m[x])||m[x]<-3||m[x]>=a)throw new Error(`Invalid output index: ${m[x]}`);if(m[x]===-3)continue;let T=m[x]===-1,k=m[x]===-2,C=T||k?i(l[x].dataType,l[x].dims):o(m[x],l[x].dataType,l[x].dims);if(h.push(C),C.data===0)continue;let O=this.gpuDataManager.get(C.data);if(!O)throw new Error(`no GPU data for output: ${C.data}`);if(T&&this.temporaryData.push(O),k){let B=this.kernelPersistentData.get(this.currentKernelId);B||(B=[],this.kernelPersistentData.set(this.currentKernelId,B)),B.push(O)}y.push(O)}if(u.length!==r.length||y.length!==h.length){if(y.length===0)return Re(t.name),h;throw new Error(`Program ${t.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(p){let x=0,T=[];p.forEach(B=>{let M=typeof B.data=="number"?[B.data]:B.data;if(M.length===0)return;let G=B.type===10?2:4,K,Y;B.type===10?(Y=M.length>4?16:M.length>2?8:M.length*G,K=M.length>4?16:G*M.length):(Y=M.length<=2?M.length*G:16,K=16),x=Math.ceil(x/Y)*Y,T.push(x);let L=B.type===10?8:4;x+=M.length>4?Math.ceil(M.length/L)*K:M.length*G});let k=16;x=Math.ceil(x/k)*k;let C=new ArrayBuffer(x);p.forEach((B,M)=>{let G=T[M],K=typeof B.data=="number"?[B.data]:B.data;if(B.type===6)new Int32Array(C,G,K.length).set(K);else if(B.type===12)new Uint32Array(C,G,K.length).set(K);else if(B.type===10)new Uint16Array(C,G,K.length).set(K);else if(B.type===1)new Float32Array(C,G,K.length).set(K);else throw new Error(`Unsupported uniform type: ${Xe(B.type)}`)});let O=this.gpuDataManager.create(x,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(O.buffer,0,C,0,x),this.gpuDataManager.release(O.id),g={offset:0,size:x,buffer:O.buffer}}let _=this.programManager.normalizeDispatchGroupSize(c),S=_[1]===1&&_[2]===1,v=gg(t,r,S),w=this.programManager.getArtifact(v);if(w||(w=this.programManager.build(t,_),this.programManager.setArtifact(v,w),ue("info",()=>`[artifact] key: ${v}, programName: ${t.name}`)),p&&w.uniformVariablesInfo){if(p.length!==w.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${w.uniformVariablesInfo.length}, got ${p.length} in program "${w.programInfo.name}".`);for(let x=0;x<p.length;x++){let T=p[x],k=T.type,C=typeof T.data=="number"?1:T.data.length,[O,B]=w.uniformVariablesInfo[x];if(k!==O||C!==B)throw new Error(`Uniform variable ${x} mismatch: expect type ${O} with size ${B}, got type ${k} with size ${C} in program "${w.programInfo.name}".`)}}if(ue("info",()=>`[ProgramManager] run "${t.name}" (key=${v}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let x={kernelId:this.currentKernelId,programName:w.programInfo.name,inputTensorViews:r,outputTensorViews:h};this.pendingKernels.push(x),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(x)}return this.programManager.run(w,u,y,_,g),Re(t.name),h}upload(t,r){this.gpuDataManager.upload(t,r)}memcpy(t,r){this.gpuDataManager.memcpy(t,r)}async download(t,r){await this.gpuDataManager.download(t,r)}alloc(t){return this.gpuDataManager.create(t).id}free(t){return this.gpuDataManager.release(t)}createKernel(t,r,n,o){let i=Zd.get(t);if(!i)throw new Error(`kernel not implemented: ${t}`);let a={kernelType:t,kernelName:o,kernelEntry:i[0],attributes:[i[1],n]};this.kernels.set(r,a)}releaseKernel(t){let r=this.kernelPersistentData.get(t);if(r){for(let n of r)this.gpuDataManager.release(n.id);this.kernelPersistentData.delete(t)}this.kernelCustomData.delete(t),this.kernels.delete(t)}computeKernel(t,r,n){let o=this.kernels.get(t);if(!o)throw new Error(`kernel not created: ${t}`);let i=o.kernelType,a=o.kernelName,u=o.kernelEntry,l=o.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${i}] ${a}" is not allowed to be called recursively`);this.currentKernelId=t,l[0]&&(l[1]=l[0](l[1]),l[0]=void 0),ue("info",()=>`[WebGPU] Start to run kernel "[${i}] ${a}"...`);let c=this.env.debug;this.temporaryData=[];try{return c&&this.device.pushErrorScope("validation"),u(r,l[1]),0}catch(p){return n.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${a}" failed. ${p}`)),1}finally{c&&n.push(this.device.popErrorScope().then(p=>p?`GPU validation error for kernel "[${i}] ${a}": ${p.message}`:null));for(let p of this.temporaryData)this.gpuDataManager.release(p.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(t,r,n,o){let i=this.sessionExternalDataMapping.get(t);i||(i=new Map,this.sessionExternalDataMapping.set(t,i));let a=i.get(r),u=this.gpuDataManager.registerExternalBuffer(n,o,a);return i.set(r,[u,n]),u}unregisterBuffers(t){let r=this.sessionExternalDataMapping.get(t);r&&(r.forEach(n=>this.gpuDataManager.unregisterExternalBuffer(n[0])),this.sessionExternalDataMapping.delete(t))}getBuffer(t){let r=this.gpuDataManager.get(t);if(!r)throw new Error(`no GPU data for buffer: ${t}`);return r.buffer}createDownloader(t,r,n){return async()=>{let o=await Zn(this,t,r);return Or(o.buffer,n)}}writeTimestamp(t){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,t)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){ue("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){ue("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){ue("info","replay"),this.sessionStatus="replaying";let t=this.capturedCommandList.get(this.currentSessionId),r=this.capturedPendingKernels.get(this.currentSessionId),n=t.length;this.pendingKernels=[];for(let o=0;o<n;o++){let i=this.getComputePassEncoder(),a=t[o];this.writeTimestamp(this.pendingDispatchNumber*2),i.setPipeline(a.computePipeline),i.setBindGroup(0,a.bindGroup),i.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(r[o]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(t){this.unregisterBuffers(t),this.capturedCommandList.has(t)&&this.capturedCommandList.delete(t),this.capturedPendingKernels.has(t)&&this.capturedPendingKernels.delete(t),this.gpuDataManager.onReleaseSession(t)}onRunStart(t){this.currentSessionId=t,this.setQueryType()}}});var ec={};zt(ec,{init:()=>yg});var er,vo,yg,tc=N(()=>{"use strict";re();Je();ie();Ka();er=class e{constructor(t,r,n,o){this.module=t;this.dataType=r;this.data=n;this.dims=o}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=E.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=E.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=E.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=E.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(E.size(t)!==E.size(this.dims))throw new Error("Invalid new shape");return new e(this.module,this.dataType,this.data,t)}},vo=class{constructor(t,r,n){this.module=t;this.backend=r;this.customDataOffset=0;this.customDataSize=0;this.adapterInfo=r.adapterInfo;let o=t.PTR_SIZE,i=n/t.PTR_SIZE,a=o===4?"i32":"i64";this.opKernelContext=Number(t.getValue(o*i++,a));let u=Number(t.getValue(o*i++,a));this.outputCount=Number(t.getValue(o*i++,a)),this.customDataOffset=Number(t.getValue(o*i++,"*")),this.customDataSize=Number(t.getValue(o*i++,a));let l=[];for(let c=0;c<u;c++){let p=Number(t.getValue(o*i++,a)),m=Number(t.getValue(o*i++,"*")),h=Number(t.getValue(o*i++,a)),y=[];for(let g=0;g<h;g++)y.push(Number(t.getValue(o*i++,a)));l.push(new er(t,p,m,y))}this.inputs=l}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(t,r){let n=r?.inputs?.map(u=>typeof u=="number"?this.inputs[u]:u)??this.inputs,o=r?.outputs??[],i=(u,l,c)=>new er(this.module,l,this.output(u,c),c),a=(u,l)=>{let c=mt(u,l);if(!c)throw new Error(`Unsupported data type: ${u}`);let p=c>0?this.backend.gpuDataManager.create(c).id:0;return new er(this.module,u,p,l)};return this.backend.run(t,n,o,i,a,this.outputCount)}output(t,r){let n=this.module.stackSave();try{let o=this.module.PTR_SIZE,i=o===4?"i32":"i64",a=this.module.stackAlloc((1+r.length)*o);this.module.setValue(a,r.length,i);for(let u=0;u<r.length;u++)this.module.setValue(a+o*(u+1),r[u],i);return this.module._JsepOutput(this.opKernelContext,t,a)}catch(o){throw new Error(`Failed to generate kernel's output[${t}] with dims [${r}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${o}`)}finally{this.module.stackRestore(n)}}},yg=async(e,t,r,n)=>{let o=t.jsepInit;if(!o)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let i=(Jd(),Ht(Xd)).WebGpuBackend,a=new i;await a.initialize(r,n),o("webgpu",[a,u=>a.alloc(Number(u)),u=>a.free(u),(u,l,c,p=!1)=>{if(p)ue("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(c)}`),a.memcpy(Number(u),Number(l));else{ue("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(c)}`);let m=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(c));a.upload(Number(l),m)}},async(u,l,c)=>{ue("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${c}`),await a.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+c)>>>0))},(u,l,c)=>a.createKernel(u,Number(l),c,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>a.releaseKernel(u),(u,l,c,p)=>{ue("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${c}, kernel=${u}, contextDataOffset=${l}`);let m=new vo(t,a,Number(l));return a.computeKernel(Number(u),m,p)},()=>a.captureBegin(),()=>a.captureEnd(),()=>a.replay()])}else{let i=new Rr(r);o("webnn",[i,()=>i.reserveTensorId(),a=>i.releaseTensorId(a),async(a,u,l,c,p)=>i.ensureTensor(a,u,l,c,p),(a,u)=>{i.uploadTensor(a,u)},async(a,u)=>i.downloadTensor(a,u)])}}});var bg,br,_r,It,_g,rc,qt,wr,vr,nc,$r,xr,Sr,On=N(()=>{"use strict";Ba();Ma();re();pt();Ir();Vn();bg=(e,t)=>{ge()._OrtInit(e,t)!==0&&fe("Can't initialize onnxruntime.")},br=async e=>{bg(e.wasm.numThreads,jt(e.logLevel))},_r=async(e,t)=>{ge().asyncInit?.();{let r=(tc(),Ht(ec)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let n=e.webgpu.adapter;if(n){if(typeof n.limits!="object"||typeof n.features!="object"||typeof n.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let o=e.webgpu.powerPreference;if(o!==void 0&&o!=="low-power"&&o!=="high-performance")throw new Error(`Invalid powerPreference setting: "${o}"`);let i=e.webgpu.forceFallbackAdapter;if(i!==void 0&&typeof i!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${i}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:o,forceFallbackAdapter:i}),!n)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",ge(),e,n)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",ge(),e)}}},It=new Map,_g=e=>{let t=ge(),r=t.stackSave();try{let n=t.PTR_SIZE,o=t.stackAlloc(2*n);t._OrtGetInputOutputCount(e,o,o+n)!==0&&fe("Can't get session input/output count.");let a=n===4?"i32":"i64";return[Number(t.getValue(o,a)),Number(t.getValue(o+n,a))]}finally{t.stackRestore(r)}},rc=(e,t)=>{let r=ge(),n=r.stackSave(),o=0;try{let i=r.PTR_SIZE,a=r.stackAlloc(2*i);r._OrtGetInputOutputMetadata(e,t,a,a+i)!==0&&fe("Can't get session input/output metadata.");let l=Number(r.getValue(a,"*"));o=Number(r.getValue(a+i,"*"));let c=r.HEAP32[o/4];if(c===0)return[l,0];let p=r.HEAPU32[o/4+1],m=[];for(let h=0;h<p;h++){let y=Number(r.getValue(o+8+h*i,"*"));m.push(y!==0?r.UTF8ToString(y):Number(r.getValue(o+8+(h+p)*i,"*")))}return[l,c,m]}finally{r.stackRestore(n),o!==0&&r._OrtFree(o)}},qt=e=>{let t=ge(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},wr=async(e,t)=>{let r,n,o=ge();Array.isArray(e)?[r,n]=e:e.buffer===o.HEAPU8.buffer?[r,n]=[e.byteOffset,e.byteLength]:[r,n]=qt(e);let i=0,a=0,u=0,l=[],c=[],p=[];try{if([a,l]=await Ra(t),t?.externalData&&o.mountExternalData){let T=[];for(let k of t.externalData){let C=typeof k=="string"?k:k.path;T.push(Zt(typeof k=="string"?k:k.data).then(O=>{o.mountExternalData(C,O)}))}await Promise.all(T)}for(let T of t?.executionProviders??[])if((typeof T=="string"?T:T.name)==="webnn"){if(o.shouldTransferToMLTensor=!1,typeof T!="string"){let C=T,O=C?.context,B=C?.gpuDevice,M=C?.deviceType,G=C?.powerPreference;O?o.currentContext=O:B?o.currentContext=await o.webnnCreateMLContext(B):o.currentContext=await o.webnnCreateMLContext({deviceType:M,powerPreference:G})}else o.currentContext=await o.webnnCreateMLContext();break}i=await o._OrtCreateSession(r,n,a),o.webgpuOnCreateSession?.(i),i===0&&fe("Can't create a session."),o.jsepOnCreateSession?.(),o.currentContext&&(o.webnnRegisterMLContext(i,o.currentContext),o.currentContext=void 0,o.shouldTransferToMLTensor=!0);let[m,h]=_g(i),y=!!t?.enableGraphCapture,g=[],_=[],S=[],v=[],w=[];for(let T=0;T<m;T++){let[k,C,O]=rc(i,T);k===0&&fe("Can't get an input name."),c.push(k);let B=o.UTF8ToString(k);g.push(B),S.push(C===0?{name:B,isTensor:!1}:{name:B,isTensor:!0,type:Xe(C),shape:O})}for(let T=0;T<h;T++){let[k,C,O]=rc(i,T+m);k===0&&fe("Can't get an output name."),p.push(k);let B=o.UTF8ToString(k);_.push(B),v.push(C===0?{name:B,isTensor:!1}:{name:B,isTensor:!0,type:Xe(C),shape:O});{if(y&&t?.preferredOutputLocation===void 0){w.push("gpu-buffer");continue}let M=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[B]??"cpu";if(M!=="cpu"&&M!=="cpu-pinned"&&M!=="gpu-buffer"&&M!=="ml-tensor")throw new Error(`Not supported preferred output location: ${M}.`);if(y&&M!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${M}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);w.push(M)}}let x=null;return w.some(T=>T==="gpu-buffer"||T==="ml-tensor")&&(u=o._OrtCreateBinding(i),u===0&&fe("Can't create IO binding."),x={handle:u,outputPreferredLocations:w,outputPreferredLocationsEncoded:w.map(T=>Nn(T))}),It.set(i,[i,c,p,x,y,!1]),[i,g,_,S,v]}catch(m){throw c.forEach(h=>o._OrtFree(h)),p.forEach(h=>o._OrtFree(h)),u!==0&&o._OrtReleaseBinding(u)!==0&&fe("Can't release IO binding."),i!==0&&o._OrtReleaseSession(i)!==0&&fe("Can't release session."),m}finally{o._free(r),a!==0&&o._OrtReleaseSessionOptions(a)!==0&&fe("Can't release session options."),l.forEach(m=>o._free(m)),o.unmountExternalData?.()}},vr=e=>{let t=ge(),r=It.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[n,o,i,a,u]=r;a&&(u&&t._OrtClearBoundOutputs(a.handle)!==0&&fe("Can't clear bound outputs."),t._OrtReleaseBinding(a.handle)!==0&&fe("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),o.forEach(l=>t._OrtFree(l)),i.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(n)!==0&&fe("Can't release session."),It.delete(e)},nc=async(e,t,r,n,o,i,a=!1)=>{if(!e){t.push(0);return}let u=ge(),l=u.PTR_SIZE,c=e[0],p=e[1],m=e[3],h=m,y,g;if(c==="string"&&(m==="gpu-buffer"||m==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(a&&m!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(m==="gpu-buffer"){let v=e[2].gpuBuffer;g=mt(Ot(c),p);{let w=u.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');y=w(n,i,v,g)}}else if(m==="ml-tensor"){let v=e[2].mlTensor;g=mt(Ot(c),p);let w=u.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');y=w(n,v,Ot(c),p)}else{let v=e[2];if(Array.isArray(v)){g=l*v.length,y=u._malloc(g),r.push(y);for(let w=0;w<v.length;w++){if(typeof v[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);u.setValue(y+w*l,We(v[w],r),"*")}}else{let w=u.webnnIsGraphInput;if(c!=="string"&&w){let x=u.UTF8ToString(o);if(w(n,x)){let T=Ot(c);g=mt(T,p),h="ml-tensor";let k=u.webnnCreateTemporaryTensor,C=u.webnnUploadTensor;if(!k||!C)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let O=await k(n,T,p);C(O,new Uint8Array(v.buffer,v.byteOffset,v.byteLength)),y=O}else g=v.byteLength,y=u._malloc(g),r.push(y),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,g),y)}else g=v.byteLength,y=u._malloc(g),r.push(y),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,g),y)}}let _=u.stackSave(),S=u.stackAlloc(4*p.length);try{p.forEach((w,x)=>u.setValue(S+x*l,w,l===4?"i32":"i64"));let v=u._OrtCreateTensor(Ot(c),y,g,S,p.length,Nn(h));v===0&&fe(`Can't create tensor for input/output. session=${n}, index=${i}.`),t.push(v)}finally{u.stackRestore(_)}},$r=async(e,t,r,n,o,i)=>{let a=ge(),u=a.PTR_SIZE,l=It.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=l[0],p=l[1],m=l[2],h=l[3],y=l[4],g=l[5],_=t.length,S=n.length,v=0,w=[],x=[],T=[],k=[],C=a.stackSave(),O=a.stackAlloc(_*u),B=a.stackAlloc(_*u),M=a.stackAlloc(S*u),G=a.stackAlloc(S*u);try{[v,w]=Da(i);for(let L=0;L<_;L++)await nc(r[L],x,k,e,p[t[L]],t[L],y);for(let L=0;L<S;L++)await nc(o[L],T,k,e,m[n[L]],_+n[L],y);for(let L=0;L<_;L++)a.setValue(O+L*u,x[L],"*"),a.setValue(B+L*u,p[t[L]],"*");for(let L=0;L<S;L++)a.setValue(M+L*u,T[L],"*"),a.setValue(G+L*u,m[n[L]],"*");if(h&&!g){let{handle:L,outputPreferredLocations:Q,outputPreferredLocationsEncoded:xe}=h;if(p.length!==_)throw new Error(`input count from feeds (${_}) is expected to be always equal to model's input count (${p.length}).`);for(let F=0;F<_;F++){let Z=t[F];await a._OrtBindInput(L,p[Z],x[F])!==0&&fe(`Can't bind input[${F}] for session=${e}.`)}for(let F=0;F<S;F++){let Z=n[F];o[F]?.[3]?a._OrtBindOutput(L,m[Z],T[F],0)!==0&&fe(`Can't bind pre-allocated output[${F}] for session=${e}.`):a._OrtBindOutput(L,m[Z],0,xe[Z])!==0&&fe(`Can't bind output[${F}] to ${Q[F]} for session=${e}.`)}It.set(e,[c,p,m,h,y,!0])}a.jsepOnRunStart?.(c),a.webnnOnRunStart?.(c);let K;h?K=await a._OrtRunWithBinding(c,h.handle,S,M,v):K=await a._OrtRun(c,B,O,_,G,S,M,v),K!==0&&fe("failed to call OrtRun().");let Y=[];for(let L=0;L<S;L++){let Q=Number(a.getValue(M+L*u,"*"));if(Q===T[L]){Y.push(o[L]);continue}let xe=a.stackSave(),F=a.stackAlloc(4*u),Z=!1,ne,J=0;try{a._OrtGetTensorData(Q,F,F+u,F+2*u,F+3*u)!==0&&fe(`Can't access output tensor data on index ${L}.`);let ye=u===4?"i32":"i64",$e=Number(a.getValue(F,ye));J=a.getValue(F+u,"*");let oe=a.getValue(F+u*2,"*"),A=Number(a.getValue(F+u*3,ye)),W=[];for(let Te=0;Te<A;Te++)W.push(Number(a.getValue(oe+Te*u,ye)));a._OrtFree(oe)!==0&&fe("Can't free memory for tensor dims.");let pe=W.reduce((Te,Ie)=>Te*Ie,1);ne=Xe($e);let Be=h?.outputPreferredLocations[n[L]];if(ne==="string"){if(Be==="gpu-buffer"||Be==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Te=[];for(let Ie=0;Ie<pe;Ie++){let Pe=a.getValue(J+Ie*u,"*"),gt=a.getValue(J+(Ie+1)*u,"*"),At=Ie===pe-1?void 0:gt-Pe;Te.push(a.UTF8ToString(Pe,At))}Y.push([ne,W,Te,"cpu"])}else if(Be==="gpu-buffer"&&pe>0){let Te=a.jsepGetBuffer;if(!Te)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Ie=Te(J),Pe=mt($e,pe);if(Pe===void 0||!kr(ne))throw new Error(`Unsupported data type: ${ne}`);Z=!0,Y.push([ne,W,{gpuBuffer:Ie,download:a.jsepCreateDownloader(Ie,Pe,ne),dispose:()=>{a._OrtReleaseTensor(Q)!==0&&fe("Can't release tensor.")}},"gpu-buffer"])}else if(Be==="ml-tensor"&&pe>0){let Te=a.webnnEnsureTensor,Ie=a.webnnIsInt64Supported;if(!Te||!Ie)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(mt($e,pe)===void 0||!Er(ne))throw new Error(`Unsupported data type: ${ne}`);if(ne==="int64"&&!Ie(e))throw new Error('preferredLocation "ml-tensor" for int64 output is not supported by current WebNN Context.');let gt=await Te(e,J,$e,W,!1);Z=!0,Y.push([ne,W,{mlTensor:gt,download:a.webnnCreateMLTensorDownloader(J,ne),dispose:()=>{a.webnnReleaseTensorId(J),a._OrtReleaseTensor(Q)}},"ml-tensor"])}else{let Te=Ar(ne),Ie=new Te(pe);new Uint8Array(Ie.buffer,Ie.byteOffset,Ie.byteLength).set(a.HEAPU8.subarray(J,J+Ie.byteLength)),Y.push([ne,W,Ie,"cpu"])}}finally{a.stackRestore(xe),ne==="string"&&J&&a._free(J),Z||a._OrtReleaseTensor(Q),a.webnnOnRunEnd?.(c)}}return h&&!y&&(a._OrtClearBoundOutputs(h.handle)!==0&&fe("Can't clear bound outputs."),It.set(e,[c,p,m,h,y,!1])),Y}finally{a.stackRestore(C),x.forEach(K=>a._OrtReleaseTensor(K)),T.forEach(K=>a._OrtReleaseTensor(K)),k.forEach(K=>a._free(K)),v!==0&&a._OrtReleaseRunOptions(v),w.forEach(K=>a._free(K))}},xr=e=>{let t=ge(),r=It.get(e);if(!r)throw new Error("invalid session id");let n=r[0],o=t._OrtEndProfiling(n);o===0&&fe("Can't get an profile file name."),t._OrtFree(o)},Sr=e=>{let t=[];for(let r of e){let n=r[2];!Array.isArray(n)&&"buffer"in n&&t.push(n.buffer)}return t}});var Ct,Ge,tr,nn,on,rn,$o,xo,Mt,Ut,vg,oc,ic,ac,sc,uc,lc,dc,So=N(()=>{"use strict";Le();On();pt();gr();Ct=()=>!!we.wasm.proxy&&typeof document<"u",tr=!1,nn=!1,on=!1,xo=new Map,Mt=(e,t)=>{let r=xo.get(e);r?r.push(t):xo.set(e,[t])},Ut=()=>{if(tr||!nn||on||!Ge)throw new Error("worker not ready")},vg=e=>{switch(e.data.type){case"init-wasm":tr=!1,e.data.err?(on=!0,$o[1](e.data.err)):(nn=!0,$o[0]()),rn&&(URL.revokeObjectURL(rn),rn=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=xo.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},oc=async()=>{if(!nn){if(tr)throw new Error("multiple calls to 'initWasm()' detected.");if(on)throw new Error("previous call to 'initWasm()' failed.");if(tr=!0,Ct())return new Promise((e,t)=>{Ge?.terminate(),Pa().then(([r,n])=>{try{Ge=n,Ge.onerror=i=>t(i),Ge.onmessage=vg,$o=[e,t];let o={type:"init-wasm",in:we};!o.in.wasm.wasmPaths&&(r||Rn)&&(o.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Ge.postMessage(o),rn=r}catch(o){t(o)}},t)});try{await yr(we.wasm),await br(we),nn=!0}catch(e){throw on=!0,e}finally{tr=!1}}},ic=async e=>{if(Ct())return Ut(),new Promise((t,r)=>{Mt("init-ep",[t,r]);let n={type:"init-ep",in:{epName:e,env:we}};Ge.postMessage(n)});await _r(we,e)},ac=async e=>Ct()?(Ut(),new Promise((t,r)=>{Mt("copy-from",[t,r]);let n={type:"copy-from",in:{buffer:e}};Ge.postMessage(n,[e.buffer])})):qt(e),sc=async(e,t)=>{if(Ct()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Ut(),new Promise((r,n)=>{Mt("create",[r,n]);let o={type:"create",in:{model:e,options:{...t}}},i=[];e instanceof Uint8Array&&i.push(e.buffer),Ge.postMessage(o,i)})}else return wr(e,t)},uc=async e=>{if(Ct())return Ut(),new Promise((t,r)=>{Mt("release",[t,r]);let n={type:"release",in:e};Ge.postMessage(n)});vr(e)},lc=async(e,t,r,n,o,i)=>{if(Ct()){if(r.some(a=>a[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(o.some(a=>a))throw new Error("pre-allocated output tensor is not supported for proxy.");return Ut(),new Promise((a,u)=>{Mt("run",[a,u]);let l=r,c={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:n,options:i}};Ge.postMessage(c,Sr(l))})}else return $r(e,t,r,n,o,i)},dc=async e=>{if(Ct())return Ut(),new Promise((t,r)=>{Mt("end-profiling",[t,r]);let n={type:"end-profiling",in:e};Ge.postMessage(n)});xr(e)}});var cc,$g,an,pc=N(()=>{"use strict";Le();So();re();hr();Vn();cc=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},$g=e=>{switch(e[3]){case"cpu":return new He(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!kr(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:n,dispose:o}=e[2];return He.fromGpuBuffer(r,{dataType:t,dims:e[1],download:n,dispose:o})}case"ml-tensor":{let t=e[0];if(!Er(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:n,dispose:o}=e[2];return He.fromMLTensor(r,{dataType:t,dims:e[1],download:n,dispose:o})}default:throw new Error(`invalid data location: ${e[3]}`)}},an=class{async fetchModelAndCopyToWasmMemory(t){return ac(await Zt(t))}async loadModel(t,r){Ne();let n;typeof t=="string"?n=await this.fetchModelAndCopyToWasmMemory(t):n=t,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await sc(n,r),Re()}async dispose(){return uc(this.sessionId)}async run(t,r,n){Ne();let o=[],i=[];Object.entries(t).forEach(h=>{let y=h[0],g=h[1],_=this.inputNames.indexOf(y);if(_===-1)throw new Error(`invalid input '${y}'`);o.push(g),i.push(_)});let a=[],u=[];Object.entries(r).forEach(h=>{let y=h[0],g=h[1],_=this.outputNames.indexOf(y);if(_===-1)throw new Error(`invalid output '${y}'`);a.push(g),u.push(_)});let l=o.map((h,y)=>cc(h,()=>`input "${this.inputNames[i[y]]}"`)),c=a.map((h,y)=>h?cc(h,()=>`output "${this.outputNames[u[y]]}"`):null),p=await lc(this.sessionId,i,l,u,c,n),m={};for(let h=0;h<p.length;h++)m[this.outputNames[u[h]]]=a[h]??$g(p[h]);return Re(),m}startProfiling(){}endProfiling(){dc(this.sessionId)}}});var fc={};zt(fc,{OnnxruntimeWebAssemblyBackend:()=>sn,initializeFlags:()=>mc,wasmBackend:()=>xg});var mc,sn,xg,hc=N(()=>{"use strict";Le();So();pc();mc=()=>{(typeof we.wasm.initTimeout!="number"||we.wasm.initTimeout<0)&&(we.wasm.initTimeout=0);let e=we.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),we.wasm.simd=!1),typeof we.wasm.proxy!="boolean"&&(we.wasm.proxy=!1),typeof we.wasm.trace!="boolean"&&(we.wasm.trace=!1),typeof we.wasm.numThreads!="number"||!Number.isInteger(we.wasm.numThreads)||we.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)we.wasm.numThreads=1;else{let t=typeof navigator>"u"?In("node:os").cpus().length:navigator.hardwareConcurrency;we.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},sn=class{async init(t){mc(),await oc(),await ic(t)}async createInferenceSessionHandler(t,r){let n=new an;return await n.loadModel(t,r),n}},xg=new sn});Le();Le();Le();var ba="1.22.0";var zS=zn;{let e=(hc(),Ht(fc)).wasmBackend;wt("webgpu",e,5),wt("webnn",e,5),wt("cpu",e,10),wt("wasm",e,10)}Object.defineProperty(we.versions,"web",{value:ba,enumerable:!0});export{Kp as InferenceSession,mr as TRACE,Ne as TRACE_FUNC_BEGIN,Re as TRACE_FUNC_END,He as Tensor,zS as default,we as env,wt as registerBackend};
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
//# sourceMappingURL=ort.bundle.min.mjs.map
