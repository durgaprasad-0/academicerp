const t=(d,o)=>{const e=document.createElement("a");e.href=d,e.setAttribute("download",o||""),document.body.appendChild(e),e.click(),document.body.removeChild(e)};export{t as d};
