// usage: node add_emblem.js <repo> <ref> <packdir> <name>   -> copies web/public/brand/* and renders *-logo.svg to PNG
const {execSync}=require('child_process'), fs=require('fs'), path=require('path');
const [repo, ref, pack, name]=process.argv.slice(2);
const out=path.join(pack,'brand'); fs.mkdirSync(out,{recursive:true});
const files=execSync(`git -C ${repo} ls-tree -r --name-only ${ref} web/public/brand/`).toString().trim().split('\n').filter(Boolean);
for (const f of files){ fs.writeFileSync(path.join(out, `medhanta-${name}-`+path.basename(f).replace(new RegExp('^'+name+'-'),'')), execSync(`git -C ${repo} show ${ref}:${f}`)); }
const logo=files.find(f=>/logo\.svg$/.test(f));
(async()=>{ if(!logo) return console.log('no svg logo', files);
  const svg=execSync(`git -C ${repo} show ${ref}:${logo}`).toString();
  const {chromium}=require('playwright'); const b=await chromium.launch(); const p=await b.newPage({deviceScaleFactor:1});
  await p.setContent(`<html><body style="margin:0;background:transparent"><div id="l" style="width:900px">${svg.replace('<svg','<svg style="width:900px;height:auto;display:block"')}</div></body></html>`);
  await p.locator('#l').screenshot({path:path.join(out,`medhanta-${name}-logo.png`),omitBackground:true}); await b.close();
  console.log('ok', fs.readdirSync(out).join(' '));})();
