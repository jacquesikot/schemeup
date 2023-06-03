var M=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var v=Object.prototype.hasOwnProperty;var B=(m,d)=>{for(var b in d)M(m,b,{get:d[b],enumerable:!0})},z=(m,d,b,N)=>{if(d&&typeof d=="object"||typeof d=="function")for(let p of U(d))!v.call(m,p)&&p!==b&&M(m,p,{get:()=>d[p],enumerable:!(N=q(d,p))||N.enumerable});return m};var j=m=>z(M({},"__esModule",{value:!0}),m);var P={};B(P,{handler:()=>k});module.exports=j(P);var A=["int","integer","bigint","smallint","decimal","numeric","real","double precision","serial","bigserial","money","character varying","varchar","character","char","text","bytea","timestamp without time zone","timestamp with time zone","date","time without time zone","time with time zone","interval","boolean","enum","uuid","json","jsonb","xml","tsvector","tsquery","point","line","lseg","box","path","polygon","circle","cidr","inet","macaddr","bit","bit varying","hstore","ltree","ltxtquery"];var k=async m=>{function d(o){let r=/CREATE TABLE[^;]+;/gi;return o.match(r)||[]}function b(o){let r=/ALTER TABLE[^;]+;/gi;return o.match(r)||[]}function N(o){let r=[];for(let t of o){let n=t.replace(/[\r\n]+/g,"").trim(),u=/CREATE TABLE\s+((\w+\.\w+)|(\w+\."\w+"))/i,s=n.match(u),e=s?s[1]:"",c=[],f=n.indexOf("(")+1,g=n.lastIndexOf(")"),h=n.substring(f,g).trim(),C=0,y="";for(let a=0;a<h.length;a++){let l=h[a];l==="("?C++:l===")"&&C--,l===","&&C===0?(c.push(y.trim()),y=""):y+=l}c.push(y.trim());let L=b(m.body),T=O(L),S=I(x),K=R(m.body);r.push({tableName:e,columns:c.map(a=>F(a)),foreignKeys:[],indexes:[]}),T.map(a=>{let l=r.find(i=>i.tableName===a.tableName);if(l){let i=l.foreignKeys.find(w=>w.columnName===a.columnName);i?i.referenceTable=a.referenceTable:l.foreignKeys.push(a)}}),S.map(a=>{let l=r.find(i=>i.tableName===a.tableName);if(l){let i=l.foreignKeys.find(w=>w.columnName===a.columnName);i?i.referenceTable=a.referenceTable:l.foreignKeys.push(a)}}),K.map(a=>{let l=r.find(i=>i.tableName===a.tableName);if(l){let i=l.indexes.find(w=>w.indexName===a.indexName);i?i.indexColumns=a.indexColumns:l.indexes.push(a)}})}return r}function p(o,r){let t="";for(let n=0;n<r.length;n++){let u=new RegExp(r[n]+"\\b[^\\s]*","i"),s=o.match(u);s&&(!t||s[0].length>t.length)&&(t=s[0])}return t}function F(o){let r=o.split(" ")[0],t,n,u="",s=!1,e=o.split(" ")[0];if(e.toLowerCase()==="primary")return;if(e.toLowerCase()==="foreign")return;if(e.toLowerCase()==="constraint")return;if(e.toLowerCase()==="check")return;if(e.toLowerCase()==="unique")return;if(e.toLowerCase()==="index")return;if(e.toLowerCase()==="using")return;if(e.toLowerCase()==="tablespace")return;if(e.toLowerCase()==="inherits")return;if(e.toLowerCase()==="with")return;if(e.toLowerCase()==="options")return;if(e.toLowerCase()==="storage")return;if(e.toLowerCase()==="collate")return;if(e.toLowerCase()==="default")return;if(e.toLowerCase()==="generated")return;if(e.toLowerCase()==="identity")return;if(e.toLowerCase()==="always")return;if(e.toLowerCase()==="as")return;if(e.toLowerCase()==="stored")return;if(e.toLowerCase()==="virtual")return;if(e.toLowerCase()==="on")return;if(e.toLowerCase()==="delete")return;if(e.toLowerCase()==="update")return;if(e.toLowerCase()==="references")return;if(e.toLowerCase()==="match")return;if(e.toLowerCase()==="partial")return;r=e,t=p(o,A),o.toLowerCase().includes("not null")?n=!1:n=!0;let c=o.toLowerCase().match(/default\s+(.*?)\s+/);c&&c.length>1&&(u=c[1].toUpperCase()),/\b(auto_increment|serial|identity\b(?!.*_(number|identity)))\b/.test(o.toLowerCase())&&(s=!0);let g={columnName:r,dataType:t,nullable:n,defaultValue:u,autoInc:s};if(g.columnName)return g}function O(o){let r=[];return o.forEach(t=>{let n=t.toLowerCase().replace(/\n/g," ").replace(/\s+/g," ").trim();if(n.includes("add constraint")&&n.includes("foreign key")){let u=n.match(/alter table only (.*?) add constraint/),s=n.match(/add constraint (.*?) foreign key/),e=n.match(/foreign key \((.*?)\) references/),c=n.match(/references (.*?)\(/),f=n.match(/references .*?\((.*?)\)/),g=n.match(/on update (cascade|set null|set default|no action)/),h=n.match(/on delete (cascade|set null|set default|no action)/);if(u&&s&&e&&c&&f){let C=u[1],y=s[1],L=e[1],T=c[1],S=f[1],K=g?g[1]:null,a=h?h[1]:null,l=r.find(i=>i.tableName===C);l||(l={tableName:C,foreignKeys:[]},r.push(l)),l.foreignKeys.push({fkName:y,columnName:L,referenceTable:T,referenceColumn:S,onUpdate:K,onDelete:a})}}}),r}function I(o){let r=[];return x.forEach(t=>{t=t.toLowerCase(),t=t.replace(/\s+/g," "),t=t.replace(/[\r\n]+/g,""),t=t.replace(/"/g,"");let n=t.match(/create table (\w+\.\w+)/),u=n?n[1]:"NO TABLE NAME",s=/(constraint (\w+) )?foreign key \((\w+)\) references (\w+\.\w+)( \((\w+)\))?( on delete (cascade|set null|no action|restrict|set default))?( on update (cascade|set null|no action|restrict|set default))?/g,e,c=[];for(;(e=s.exec(t))!==null;){let f={fkName:e[2]||"NO NAME",columnName:e[3],referenceTable:e[4],referenceColumn:e[6]||"NO COLUMN",onDelete:e[8]||"NO ACTION",onUpdate:e[10]||"NO ACTION"};c.push(f)}c.length>0&&r.push({tableName:u,foreignKeys:c})}),r}function R(o){o=o.toLowerCase().replace(/"/g,"").replace(/\s+/g," ").trim();let r=o.split(";"),t={},n=/create (unique )?index (.*?) on (.*?) using (.*?) \((.*?)\)/;for(let u of r){let s=u.match(n);if(s){let e=!!s[1],c=s[2],f=s[3],g=s[4],h=s[5];t[f]||(t[f]={tableName:f,indexes:[]}),t[f].indexes.push({column:h,unique:e,sorting:g})}}return t=Object.values(t),t}let x=d(m.body),D=N(x),E;return E=D,{statusCode:200,body:JSON.stringify({response:E})}};0&&(module.exports={handler});