import React, { useEffect, useMemo, useRef, useState } from 'react';
import vanillaTypes from '../public/data/dayz-vanilla-types.json';
import { Activity, Backpack, Boxes, Check, ChevronDown, Download, FileUp, HeartPulse, Layers, Plus, Save, Search, Share2, Shield, Skull, Trash2, Upload, Weight, X, Crosshair, Package, Zap } from 'lucide-react';

const starterItems = [
  {id:'ak74',name:'AK-74',category:'Weapons',type:'weapon',weight:3.5,slots:0,ammo:'5.45x39mm',mag:'30rd AK Mag',attachments:['Optic','Muzzle','Handguard'],source:'Vanilla'},
  {id:'mlock',name:'Mlock-91',category:'Weapons',type:'weapon',weight:0.8,ammo:'9x19mm',mag:'15rd Mlock Mag',attachments:['Optic','Suppressor'],source:'Vanilla'},
  {id:'mosin',name:'Mosin 91/30',category:'Weapons',type:'weapon',weight:4.0,ammo:'7.62x54mmR',mag:'Internal magazine',attachments:['Optic','Bayonet'],source:'Vanilla'},
  {id:'knife',name:'Combat Knife',category:'Tools',type:'tool',weight:0.25,source:'Vanilla'},
  {id:'helmet',name:'Combat Helmet',category:'Gear',type:'headgear',weight:1.2,slots:12,source:'Vanilla'},
  {id:'boonie',name:'Boonie Hat',category:'Gear',type:'headgear',weight:0.2,slots:4,source:'Vanilla'},
  {id:'jacket',name:'Field Jacket',category:'Gear',type:'clothing',weight:0.8,slots:20,source:'Vanilla'},
  {id:'vest',name:'Plate Carrier',category:'Gear',type:'vest',weight:5.0,slots:12,source:'Vanilla'},
  {id:'pack',name:'Hunting Backpack',category:'Gear',type:'backpack',weight:1.0,slots:42,source:'Vanilla'},
  {id:'pants',name:'Cargo Pants',category:'Gear',type:'clothing',weight:0.6,slots:20,source:'Vanilla'},
  {id:'boots',name:'Combat Boots',category:'Gear',type:'clothing',weight:0.7,slots:6,source:'Vanilla'},
  {id:'bandage',name:'Bandage',category:'Medical',type:'supply',weight:0.1,stack:4,source:'Vanilla'},
  {id:'saline',name:'Saline Bag',category:'Medical',type:'supply',weight:0.3,stack:1,source:'Vanilla'},
  {id:'tetra',name:'Tetracycline Pills',category:'Medical',type:'supply',weight:0.05,stack:12,source:'Vanilla'},
  {id:'water',name:'Water Bottle',category:'Food & Water',type:'supply',weight:0.5,stack:1,source:'Vanilla'},
  {id:'beans',name:'Canned Baked Beans',category:'Food & Water',type:'supply',weight:0.4,stack:1,source:'Vanilla'},
  {id:'steak',name:'Cooked Steak',category:'Food & Water',type:'supply',weight:0.3,stack:1,source:'Vanilla'},
  {id:'ammo545',name:'5.45x39mm Rounds',category:'Ammo',type:'ammo',weight:0.01,stack:20,ammo:'5.45x39mm',source:'Vanilla'},
  {id:'magak',name:'30rd AK Mag',category:'Ammo',type:'magazine',weight:0.25,stack:1,ammo:'5.45x39mm',source:'Vanilla'},
  {id:'ammo9',name:'9x19mm Rounds',category:'Ammo',type:'ammo',weight:0.008,stack:25,ammo:'9x19mm',source:'Vanilla'},
  {id:'magm',name:'15rd Mlock Mag',category:'Ammo',type:'magazine',weight:0.15,stack:1,ammo:'9x19mm',source:'Vanilla'},
  {id:'scope',name:'Pistol Optic',category:'Attachments',type:'attachment',weight:0.2,slot:'Optic',source:'Vanilla'},
  {id:'suppressor',name:'Pistol Suppressor',category:'Attachments',type:'attachment',weight:0.3,slot:'Suppressor',source:'Vanilla'},
  {id:'custom',name:'Zero Merxy Custom Item',category:'Custom',type:'supply',weight:0.5,stack:1,source:'Modded'}
];
const humanizeClassname = (name) => name
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  .replace(/[_-]+/g, ' ')
  .replace(/\b(ak|m4|svd|pso|p1|cz|izh|mp|sg|gorka|tundra|mosin)\b/gi, m => m.toUpperCase())
  .trim();
const inferCategory = (item) => {
  const n = item.classname.toLowerCase();
  const source = [...(item.category || []), ...(item.usage || [])].join(' ').toLowerCase();
  if (/ammo|cartridge|bullet|shell|projectile|magazine|clip|speedloader|flaregun/.test(n)) return 'Ammo';
  if (/optic|scope|suppressor|silencer|handguard|buttstock|rail|bayonet|weaponattachment|weapon.?light|pistol.?grip/.test(n)) return 'Attachments';
  if (/rifle|shotgun|pistol|revolver|smg|submachine|launcher|crossbow|bow|weapon|ak[0-9]|m4a|mosin|svd|famas|aug|ump|mp5|cz[0-9]/.test(n)) return 'Weapons';
  if (/bandage|medical|bloodbag|saline|syringe|epinephrine|morphine|tetracycline|vitamin|charcoal|disinfect|splint|thermometer|defibrillator|firstaid|heatpack/.test(n)) return 'Medical';
  if (/food|bakedbeans|rice|pasta|can_|canned|meat|steak|fruit|vegetable|apple|pear|plum|water|soda|drink|bottle|canteen|kvas|milk|honey|jam|marmalade/.test(n)) return 'Food & Water';
  if (/backpack|bag|vest|jacket|coat|shirt|hoodie|sweater|pants|jeans|shorts|boots|shoes|gloves|helmet|hat|cap|balaclava|mask|glasses|goggles|dress|skirt|uniform|gorka|raincoat|holster|sheath|armband|apron|tactical/.test(n)) return 'Gear';
  if (/knife|axe|hatchet|hammer|screwdriver|wrench|pliers|shovel|pickaxe|crowbar|saw|tool|rope|fishing|hook|lockpick|compass|map|binocular|rangefinder|flashlight|lighter|matches|repair|sewing|whetstone|canopener|can opener|ducttape|battery|wire|gascan|jerrycan/.test(n)) return 'Tools';
  if (source.includes('clothes') || source.includes('clothing')) return 'Gear';
  if (source.includes('weapons')) return 'Weapons';
  if (source.includes('tools')) return 'Tools';
  return 'Other';
};
const inferType = (item, category) => {
  const n = item.classname.toLowerCase();
  if (category === 'Weapons') return 'weapon';
  if (category === 'Ammo') return /magazine|clip|speedloader/.test(n) ? 'magazine' : 'ammo';
  if (category === 'Attachments') return 'attachment';
  if (category === 'Gear') {
    if (/backpack|bag/.test(n)) return 'backpack';
    if (/vest|platecarrier|chestholster/.test(n)) return 'vest';
    if (/helmet|hat|cap|beret|boonie/.test(n)) return 'headgear';
    return 'clothing';
  }
  if (category === 'Tools') return 'tool';
  return 'supply';
};
const vanillaItems = (vanillaTypes.items || []).map(item => {
  const category = inferCategory(item);
  return {
    id: `vanilla-${item.classname}`,
    classname: item.classname,
    name: item.details?.display_name || humanizeClassname(item.classname),
    category,
    type: inferType(item, category),
    weight: item.details?.weight_kg ?? null,
    slots: null,
    itemSize: item.details?.item_size || null,
    equipmentSlot: item.details?.equipment_slot || null,
    compatibleWeapons: item.details?.compatible_weapons || [],
    details: item.details || null,
    source: 'Vanilla',
    loot: { nominal: item.nominal, min: item.min, lifetime: item.lifetime, restock: item.restock, quantmin: item.quantmin, quantmax: item.quantmax, cost: item.cost, flags: item.flags, usage: item.usage, categoryTags: item.category }
  };
});
const allCatalogItems = [...starterItems, ...vanillaItems];
const slots = [
  ['Headgear','Headgear'],['Facewear','Facewear'],['Eyewear','Eyewear'],['Outerwear','Outerwear'],
  ['Vest','Vest'],['Backpack','Backpack'],['Top','Top'],['Pants','Pants'],['Gloves','Gloves'],['Boots','Boots'],
  ['Primary Weapon','Primary Weapon'],['Secondary Weapon','Secondary Weapon'],['Melee','Melee']
];
const iconFor = (cat) => ({Weapons:Crosshair,Gear:Shield,Tools:Zap,Medical:HeartPulse,'Food & Water':Activity,Ammo:Boxes,Attachments:Layers,Custom:Package}[cat] || Package);
const readStore = () => { try { return JSON.parse(localStorage.getItem('zm-loadouts') || '[]'); } catch { return []; } };
export default function App(){
  const [catalog,setCatalog] = useState(allCatalogItems);
  const [category,setCategory] = useState('All Items');
  const [search,setSearch] = useState('');
  const [compatWeaponId,setCompatWeaponId] = useState('');
  const [mode,setMode] = useState('PvP');
  const [name,setName] = useState('Zero Merxy Loadout');
  const [gear,setGear] = useState({'Headgear':'boonie','Primary Weapon':'ak74','Secondary Weapon':'mlock','Melee':'knife','Outerwear':'jacket','Vest':'vest','Backpack':'pack','Pants':'pants','Boots':'boots'});
  const [inventory,setInventory] = useState([{id:'magak',qty:2},{id:'ammo545',qty:60},{id:'bandage',qty:4},{id:'water',qty:1},{id:'beans',qty:2},{id:'saline',qty:1},{id:'scope',qty:1}]);
  const [saved,setSaved] = useState(readStore);
  const [notice,setNotice] = useState('');
  const [installPrompt,setInstallPrompt] = useState(null);
  useEffect(()=>{ const handler=e=>{e.preventDefault();setInstallPrompt(e)}; window.addEventListener('beforeinstallprompt',handler); return ()=>window.removeEventListener('beforeinstallprompt',handler); },[]);
  const [customName,setCustomName] = useState('');
  const [customWeight,setCustomWeight] = useState('0.5');
  const [customCategory,setCustomCategory] = useState('Custom');
  const [notes,setNotes] = useState('Built for Zero Merxy. Adapt to your server rules.');
  const fileRef = useRef(null);
  const allCats = ['All Items','Weapons','Gear','Tools','Attachments','Ammo','Medical','Food & Water','Custom','Other'];
  const filtered = useMemo(()=>{const q=search.trim().toLowerCase();return catalog.filter(i=>(category==='All Items'||i.category===category)&&(!q||[i.name,i.classname,i.category,i.type].some(v=>String(v||'').toLowerCase().includes(q))))},[catalog,category,search]);
  const itemById = id => catalog.find(i=>i.id===id);
  const compatibilityWeapon = itemById(compatWeaponId);
  const compatibleAttachments = useMemo(() => {
    if (!compatibilityWeapon) return [];
    const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const weaponNames = [compatibilityWeapon.name, compatibilityWeapon.classname].filter(Boolean).map(normalize);
    return catalog.filter(item => item.type === 'attachment' && Array.isArray(item.compatibleWeapons) && item.compatibleWeapons.some(w => weaponNames.some(n => n && (n === normalize(w) || n.includes(normalize(w)) || normalize(w).includes(n)))));
  }, [catalog, compatWeaponId]);
  const compatibilityItems = catalog.filter(item => item.type === 'weapon' && item.source === 'Vanilla').sort((a,b)=>a.name.localeCompare(b.name));
  const gearItems = Object.values(gear).map(itemById).filter(Boolean);
  const inventoryItems = inventory.map(row=>({...row,item:itemById(row.id)})).filter(row=>row.item);
  const totalWeight = gearItems.reduce((sum,i)=>sum+(Number(i.weight)||0),0)+inventoryItems.reduce((sum,r)=>sum+(Number(r.item.weight)||0)*r.qty,0);
  const capacity = (itemById(gear.Backpack)?.slots||0)+(itemById(gear.Vest)?.slots||0)+(itemById(gear.Outerwear)?.slots||0)+(itemById(gear.Pants)?.slots||0);
  const itemCount = Object.values(gear).filter(Boolean).length+inventory.reduce((s,r)=>s+r.qty,0);
  const toast = msg => {setNotice(msg);setTimeout(()=>setNotice(''),2600)};
  function addItem(item){
    if(['weapon','headgear','vest','backpack','clothing'].includes(item.type)){
      const slot = item.type==='weapon' ? (!gear['Primary Weapon']?'Primary Weapon':'Secondary Weapon') : item.type==='headgear'?'Headgear':item.type==='vest'?'Vest':item.type==='backpack'?'Backpack':'Outerwear';
      setGear(g=>({...g,[slot]:item.id}));
    } else setInventory(rows=>{const found=rows.find(r=>r.id===item.id);return found?rows.map(r=>r.id===item.id?{...r,qty:r.qty+1}:r):[...rows,{id:item.id,qty:1}]});
    toast(`${item.name} added`);
  }
  function removeInventory(id){setInventory(rows=>rows.filter(r=>r.id!==id))}
  function payload(){return {app:'DayZ Standalone Loadout Builder',version:2,name,mode,gear,inventory,notes,customItems:catalog.filter(i=>i.source==='Modded')}}
  function saveLoadout(){const p=payload();const next=[{...p,updatedAt:new Date().toISOString()},...saved.filter(s=>s.name!==name)].slice(0,30);setSaved(next);localStorage.setItem('zm-loadouts',JSON.stringify(next));toast('Loadout saved on this device');}
  function loadPayload(p){setName(p.name||'Imported Loadout');setMode(p.mode||'PvP');setGear(p.gear||{});setInventory(p.inventory||[]);setNotes(p.notes||'');if(p.customItems?.length)setCatalog(old=>[...old.filter(i=>i.source!=='Modded'),...p.customItems]);toast('Loadout imported');}
  function exportFile(){const blob=new Blob([JSON.stringify(payload(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(name.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'dayz-loadout')+'.json';a.click();URL.revokeObjectURL(a.href);toast('Loadout exported');}
  async function shareCode(){const code=btoa(unescape(encodeURIComponent(JSON.stringify(payload()))));try{await navigator.clipboard.writeText(code);toast('Share code copied to clipboard');}catch{window.prompt('Copy this loadout share code:',code)}}
  function importFile(file){if(!file)return;const reader=new FileReader();reader.onload=()=>{try{loadPayload(JSON.parse(reader.result))}catch{toast('That file is not a valid loadout JSON')}};reader.readAsText(file)}
  function importCode(){const code=window.prompt('Paste a Zero Merxy loadout share code');if(!code)return;try{loadPayload(JSON.parse(decodeURIComponent(escape(atob(code.trim())))))}catch{toast('Invalid share code')}}
  function addCustom(){if(!customName.trim())return;const item={id:'mod-'+Date.now(),name:customName.trim(),category:customCategory,type:'supply',weight:Math.max(0,Number(customWeight)||0),stack:1,source:'Modded'};setCatalog(c=>[...c,item]);setCustomName('');toast('Custom server item added');}
  function assignSlot(slot,id){setGear(g=>({...g,[slot]:id||undefined}));}
  function dragStart(e,item){e.dataTransfer.setData('application/zm-item',JSON.stringify(item));}
  function dropSlot(e,slot){e.preventDefault();try{const it=JSON.parse(e.dataTransfer.getData('application/zm-item'));assignSlot(slot,it.id);toast(`${it.name} equipped in ${slot}`)}catch{}}
  function reset(){setGear({});setInventory([]);setName('New Loadout');toast('Loadout cleared')}
  return <div className="app-shell">
    <header className="hero">
      <div className="brand-mark"><Skull size={42}/><span>ZERO<br/><b>MERXY</b></span></div>
      <div className="hero-title"><div className="eyebrow">SURVIVE · ADAPT · OVERCOME</div><h1>DAYZ <span>STANDALONE LOADOUT BUILDER</span></h1><p>Plan your kit. Pack smart. Make it out alive.</p></div>
      <div className="hero-status"><span className="live-dot"/> STANDALONE TOOL <small>VANILLA + MODDED</small></div>
    </header>
    <main>
      <section className="toolbar">
        <div className="namebox"><label>LOADOUT NAME</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="mode-tabs">{['PvP','PvE','Survival'].map(m=><button className={mode===m?'active':''} onClick={()=>setMode(m)} key={m}>{m}</button>)}</div>
        <div className="toolbar-actions">{installPrompt&&<button className="btn primary" onClick={async()=>{await installPrompt.prompt();setInstallPrompt(null)}}><Download size={16}/> Install app</button>}<button className="btn primary" onClick={saveLoadout}><Save size={16}/> Save</button><button className="btn" onClick={exportFile}><Download size={16}/> Export</button><button className="btn" onClick={shareCode}><Share2 size={16}/> Share code</button><button className="btn" onClick={()=>fileRef.current?.click()}><Upload size={16}/> Import</button><input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={e=>{importFile(e.target.files?.[0]);e.target.value=''}}/></div>
      </section>
      <section className="workspace">
        <aside className="panel catalog-panel">
          <div className="panel-head"><div><span className="eyebrow">FIELD DEPOT</span><h2>Item Catalog</h2></div><span className="count">{filtered.length} ITEMS</span></div>
          <div className="searchbox"><Search size={16}/><input placeholder="Search gear, ammo, supplies..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <div className="category-list">{allCats.map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}<ChevronDown size={13}/></button>)}</div>
          <div className="catalog-list">{filtered.map(item=>{const Icon=iconFor(item.category);return <div draggable onDragStart={e=>dragStart(e,item)} className="catalog-item" key={item.id}><div className="item-icon"><Icon size={18}/></div><div className="item-copy"><strong>{item.name}</strong><span>{item.category} · {item.weight == null ? 'weight unknown' : `${item.weight} kg`}</span></div><button className="add-btn" onClick={()=>addItem(item)} title="Add item"><Plus size={17}/></button></div>})}{!filtered.length&&<p className="empty">No items found. Try another search.</p>}</div>
          <div className="custom-form"><div className="eyebrow">CUSTOM SERVER ITEM</div><input placeholder="Item name" value={customName} onChange={e=>setCustomName(e.target.value)}/><div className="custom-row"><select value={customCategory} onChange={e=>setCustomCategory(e.target.value)}><option>Custom</option><option>Gear</option><option>Weapons</option><option>Ammo</option><option>Medical</option><option>Food & Water</option><option>Attachments</option></select><input aria-label="weight kg" type="number" min="0" step=".1" value={customWeight} onChange={e=>setCustomWeight(e.target.value)}/><button className="btn primary small" onClick={addCustom}><Plus size={14}/> Add</button></div></div>
        </aside>
        <section className="center-column">
          <div className="panel survivor-panel">
            <div className="panel-head"><div><span className="eyebrow">SURVIVOR PROFILE</span><h2>Operator Loadout</h2></div><span className="mode-pill">{mode.toUpperCase()} KIT</span></div>
            <div className="survivor-stage"><div className="survivor-silhouette"><div className="silhouette-head"/><div className="silhouette-body"><div className="strap"/></div><div className="silhouette-arm left"/><div className="silhouette-arm right"/><div className="silhouette-leg left"/><div className="silhouette-leg right"/></div><div className="survivor-caption"><Skull size={15}/> FIELD OPERATOR <span>•</span> ZERO MERXY</div><div className="readiness"><span className="live-dot"/> KIT STATUS <b>{itemCount>10?'GEARED UP':itemCount>0?'IN PROGRESS':'UNGEARED'}</b></div></div>
            <div className="stat-row"><div className="stat"><Weight size={17}/><div><span>TOTAL WEIGHT</span><b>{totalWeight.toFixed(2)} <small>kg</small></b></div></div><div className="stat"><Backpack size={17}/><div><span>GEAR CAPACITY*</span><b>{capacity} <small>slots</small></b></div></div><div className="stat"><Boxes size={17}/><div><span>ITEM COUNT</span><b>{itemCount}</b></div></div></div>
            <p className="disclaimer">*Capacity is an estimate from selected container items. Weight and slot data are prototype values; verify against your DayZ version and mods.</p>
          </div>
          <div className="panel gear-panel"><div className="panel-head"><div><span className="eyebrow">EQUIPPED</span><h2>Character Gear Slots</h2></div><span className="count">{Object.values(gear).filter(Boolean).length}/{slots.length}</span></div><div className="gear-grid">{slots.map(([slot,label])=>{const it=itemById(gear[slot]);return <div className={'gear-slot '+(it?'filled':'')} key={slot} onDragOver={e=>e.preventDefault()} onDrop={e=>dropSlot(e,slot)}><div className="slot-top"><span>{label}</span>{it&&<button title="Unequip" onClick={()=>assignSlot(slot,'')}><X size={13}/></button>}</div>{it?<><div className="slot-item-icon"><Shield size={19}/></div><strong>{it.name}</strong><small>{it.weight == null ? 'Weight unknown' : `${it.weight} kg`}</small></>:<div className="slot-empty"><Plus size={18}/><span>Drag item here</span></div>}</div>})}</div></div>
          <div className="panel compatibility-panel"><div className="panel-head"><div><span className="eyebrow">WEAPON WORKBENCH</span><h2>Attachment Compatibility</h2></div><Crosshair size={18}/></div><label className="compat-label" htmlFor="compat-weapon">SELECT WEAPON</label><select id="compat-weapon" className="compat-select" value={compatWeaponId} onChange={e=>setCompatWeaponId(e.target.value)}><option value="">Choose a weapon…</option>{compatibilityItems.map(item=><option value={item.id} key={item.id}>{item.name}{item.classname && item.classname!==item.name ? ` (${item.classname})` : ''}</option>)}</select>{compatibilityWeapon ? <><div className="compat-meta"><span>{compatibilityWeapon.classname || compatibilityWeapon.name}</span><span>{compatibleAttachments.length} listed match{compatibleAttachments.length===1?'':'es'}</span></div>{compatibleAttachments.length ? <div className="compat-list">{compatibleAttachments.map(item=><div className="compat-item" key={item.id}><div><strong>{item.name}</strong><small>{item.details?.equipment_slot || item.slot || 'Attachment'}</small></div><span>{item.weight == null ? 'Weight unknown' : `${item.weight} kg`}</span><button className="add-btn" onClick={()=>addItem(item)} title="Add attachment to inventory"><Plus size={16}/></button></div>)}</div> : <p className="empty">No researched attachment matches are recorded for this weapon yet. This does not mean the weapon has no compatible attachments.</p>}<p className="compat-note">Compatibility appears only where the catalog contains researched match data. Confirm against your DayZ version and server mods.</p></> : <p className="empty">Choose a weapon to check the researched attachment records.</p>}</div>
          <div className="panel inventory-panel"><div className="panel-head"><div><span className="eyebrow">PACK CONTENTS</span><h2>Inventory & Supplies</h2></div><span className="count">{inventoryItems.length} STACKS</span></div>{inventoryItems.length?<div className="inventory-table"><div className="inventory-head"><span>ITEM</span><span>TYPE</span><span>QTY</span><span>WEIGHT</span><span/></div>{inventoryItems.map(({id,qty,item})=><div className="inventory-row" key={id} draggable onDragStart={e=>dragStart(e,item)}><div className="inventory-name"><span className="mini-icon"><Package size={15}/></span><strong>{item.name}</strong></div><span className="muted">{item.category}</span><div className="qty-control"><button onClick={()=>setInventory(rows=>rows.map(r=>r.id===id?{...r,qty:Math.max(1,r.qty-1)}:r))}>−</button><b>{qty}</b><button onClick={()=>setInventory(rows=>rows.map(r=>r.id===id?{...r,qty:r.qty+1}:r))}>+</button></div><span>{item.weight == null ? '—' : `${(item.weight*qty).toFixed(2)} kg`}</span><button className="icon-button danger" onClick={()=>removeInventory(id)} title="Remove"><Trash2 size={15}/></button></div>)}</div>:<div className="empty inventory-empty">Your inventory is empty. Add items from the catalog.</div>}<div className="notes-box"><label>LOADOUT NOTES</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Server rules, ammo plan, squad role..."/></div></div>
        </section>
        <aside className="right-column">
          <div className="panel summary-panel"><div className="panel-head"><div><span className="eyebrow">QUICK READ</span><h2>Loadout Summary</h2></div><Activity size={18}/></div><div className="weight-total"><span>Carried weight</span><b>{totalWeight.toFixed(2)} kg</b></div><div className="weight-track"><span style={{width:`${Math.min(100,totalWeight/50*100)}%`}}/></div><div className="weight-foot"><span>Estimated 50 kg reference</span><b>{Math.max(0,50-totalWeight).toFixed(2)} kg remaining</b></div><div className="summary-line"><Shield size={16}/><span>Gear slots filled</span><b>{Object.values(gear).filter(Boolean).length}</b></div><div className="summary-line"><HeartPulse size={16}/><span>Medical stacks</span><b>{inventory.filter(r=>itemById(r.id)?.category==='Medical').length}</b></div><div className="summary-line"><Crosshair size={16}/><span>Weapon slots</span><b>{['Primary Weapon','Secondary Weapon'].filter(s=>gear[s]).length}/2</b></div><div className="summary-line"><Zap size={16}/><span>Ammo / magazine stacks</span><b>{inventory.filter(r=>['Ammo','magazine'].includes(itemById(r.id)?.category)||itemById(r.id)?.type==='ammo'||itemById(r.id)?.type==='magazine').length}</b></div></div>
          <div className="panel saved-panel"><div className="panel-head"><div><span className="eyebrow">LOCAL STORAGE</span><h2>Saved Loadouts</h2></div><Save size={18}/></div>{saved.length?saved.map((s,i)=><div className="saved-item" key={s.updatedAt||i}><button className="saved-load" onClick={()=>loadPayload(s)}><strong>{s.name}</strong><span>{s.mode||'Survival'} · {new Date(s.updatedAt||Date.now()).toLocaleDateString()}</span></button><button className="icon-button danger" title="Delete saved loadout" onClick={()=>{const next=saved.filter((_,j)=>j!==i);setSaved(next);localStorage.setItem('zm-loadouts',JSON.stringify(next));toast('Saved loadout deleted')}}><Trash2 size={14}/></button></div>):<p className="empty">No saved loadouts yet. Hit Save to keep this kit on this device.</p>}<button className="btn full" onClick={importCode}><FileUp size={15}/> Import share code</button></div>
          <div className="panel checklist-panel"><div className="panel-head"><div><span className="eyebrow">FIELD CHECK</span><h2>Build Checklist</h2></div><Check size={18}/></div>{[['Weapon selected',!!(gear['Primary Weapon']||gear['Secondary Weapon'])],['Medical supplies',inventory.some(r=>itemById(r.id)?.category==='Medical')],['Food or water',inventory.some(r=>itemById(r.id)?.category==='Food & Water')],['Backpack equipped',!!gear.Backpack],['Loadout named',!!name.trim()]].map(([label,ok])=><div className="check-row" key={label}><span className={ok?'check-ok':'check-no'}>{ok?<Check size={12}/>:<X size={12}/>}</span>{label}</div>)}<button className="btn danger-outline full" onClick={reset}><Trash2 size={15}/> Clear current loadout</button></div>
        </aside>
      </section>
    </main>
    <footer><div className="brand-mini"><Skull size={18}/> ZERO MERXY</div><span>DAYZ LOADOUT BUILDER <i>•</i> COMMUNITY PROTOTYPE</span><span>PLAN SMART. SURVIVE LONGER.</span></footer>
    {notice&&<div className="toast"><Check size={16}/>{notice}</div>}
  </div>
}