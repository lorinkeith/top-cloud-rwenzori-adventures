import { onRequestPost, onRequestOptions, onRequestGet } from '../functions/api/contact.js'
export default async function handler(req,res) {
 const chunks=[]
 for await (const chunk of req) chunks.push(Buffer.from(chunk))
 const method=req.method||'GET'
 const request=new Request('http://localhost/api/contact',{method,headers:{'Content-Type':'application/json'},...(method==='POST'?{body:Buffer.concat(chunks)}:{})})
 const response=method==='POST'?await onRequestPost({request,env:process.env}):method==='OPTIONS'?onRequestOptions():onRequestGet()
 res.statusCode=response.status
 response.headers.forEach((value,name)=>res.setHeader(name,value))
 res.end(Buffer.from(await response.arrayBuffer()))
}
