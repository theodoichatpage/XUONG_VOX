// Repair malformed AVCDecoderConfigurationRecords emitted by affected Firefox versions.
export function repairAvcMetadata(meta){
 const description=meta?.decoderConfig?.description;if(!description)return meta;
 const d=description instanceof ArrayBuffer?new Uint8Array(description):ArrayBuffer.isView(description)?new Uint8Array(description.buffer,description.byteOffset,description.byteLength):null;
 if(!d||d.length<7||d[0]!==1||((d[4]&0xfc)===0xfc&&(d[5]&0xe0)===0xe0))return meta;
 let pos=6,out=Array.from(d.slice(0,6));out[4]|=0xfc;out[5]|=0xe0;
 function readNal(expected){if(pos+2>d.length)throw Error();let length=(d[pos]<<8)|d[pos+1];pos+=2;if(!length||pos+length>d.length)throw Error();let unit=d.slice(pos,pos+length);pos+=length;if(unit.length>1&&unit[0]===expected&&unit[1]===expected)unit=unit.slice(1);out.push(unit.length>>8,unit.length&255,...unit)}
 try{let count=d[5]&31;for(let i=0;i<count;i++)readNal(0x67);if(pos>=d.length)throw Error();let n=d[pos++];out.push(n);for(let i=0;i<n;i++)readNal(0x68);out.push(...d.slice(pos));return {...meta,decoderConfig:{...meta.decoderConfig,description:Uint8Array.from(out)}}}catch{return meta}
}
